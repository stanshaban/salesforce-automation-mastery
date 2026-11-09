import { buildSession, summarizeAnswers } from './quiz-engine.mjs';

const $ = (s, root = document) => root.querySelector(s);
const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const safeUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' ? esc(u.href) : '#';
  } catch {
    return '#';
  }
};
const external = (url, label) =>
  `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
const list = (items) =>
  `<ul>${(items || []).map((x) => `<li>${esc(typeof x === 'string' ? x : x.text || x.title || JSON.stringify(x))}</li>`).join('')}</ul>`;
const date = (x) =>
  x ? new Date(x).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const levelNames = { junior: 'Junior', middle: 'Middle', senior: 'Senior' };
const levels = Object.keys(levelNames);
const ids = { junior: 'j', middle: 'm', senior: 's' };
const statuses = {
  submitted: 'На проверке',
  in_review: 'Проверяется',
  changes_requested: 'Нужны изменения',
  accepted: 'Принято',
};
const statusTag = (status) =>
  `<span class="tag ${status === 'accepted' ? 'green' : status === 'changes_requested' ? 'amber' : ''}">${esc(statuses[status] || status)}</span>`;
const state = {
  user: null,
  route: 'home',
  level: 'junior',
  step: 0,
  questions: [],
  assignments: [],
  curriculum: [],
  setup: null,
  agentforce: null,
  foundations: null,
  progress: { history: {}, sessions: [], completed: [] },
  quiz: null,
  submissions: [],
  demoStep: 0,
};
let joinToken =
  location.pathname === '/join' ? new URLSearchParams(location.hash.slice(1)).get('token') : null;
if (joinToken) history.replaceState(null, '', '/join');
let toastTimer;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4200);
}
async function api(path, options = {}) {
  const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  const r = await fetch(path, {
    ...options,
    headers: { ...headers, ...options.headers },
    credentials: 'same-origin',
  });
  const payload = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(payload.error || 'Не удалось выполнить действие. Попробуй ещё раз.');
  return payload;
}
function normalizeProgress(p) {
  return { history: p?.history || {}, sessions: p?.sessions || [], completed: p?.completed || [] };
}
let progressSaveQueue = Promise.resolve();
let logoutInProgress = false;
function saveProgress() {
  if (logoutInProgress) return progressSaveQueue;
  const ownerId = state.user?.id || null;
  // Capture the owner and data now; later UI changes must not alter an enqueued save.
  let snapshot;
  try {
    snapshot = JSON.stringify(state.progress);
  } catch (e) {
    toast(`Прогресс пока не сохранён: ${e.message}`);
    return Promise.resolve();
  }
  progressSaveQueue = progressSaveQueue
    .then(async () => {
      if (ownerId) {
        if (state.user?.id !== ownerId) return;
        await api('/api/progress', { method: 'POST', body: `{"progress":${snapshot}}` });
      } else localStorage.setItem('sam-guest-progress', snapshot);
    })
    .catch((e) => {
      if ((state.user?.id || null) === ownerId) toast(`Прогресс пока не сохранён: ${e.message}`);
    });
  return progressSaveQueue;
}
const codeBox = (text) =>
  `<div class="codebox"><pre><code>${esc(text)}</code></pre><button class="copy" data-action="copy-code" type="button">Копировать</button></div>`;
function openModal(title, content, wide = false) {
  const modal = $('#modal');
  modal.innerHTML = `<div class="modal-head"><h2>${esc(title)}</h2><button class="close" aria-label="Закрыть" data-action="close-modal">×</button></div>${content}`;
  modal.style.maxWidth = wide ? '900px' : '760px';
  if (!modal.open) modal.showModal();
}
function closeModal() {
  $('#modal').close();
}
const navItems = [
  ['home', '◈', 'Обзор'],
  ['tracks', '▤', 'Программа обучения'],
  ['practice', '⌘', 'Самопроверка'],
  ['setup', '▣', 'Рабочее место'],
  ['agentforce', '✧', 'Agentforce'],
  ['security', '◇', 'Доступы в Salesforce'],
  ['submissions', '↗', 'Мои работы'],
];
function shell() {
  const current =
    navItems.find((x) => x[0] === state.route)?.[2] ||
    {
      admin: 'Кабинет преподавателя',
      profile: 'Мой профиль',
      jobs: 'Поиск работы',
      login: 'Вход',
      join: 'Приглашение',
    }[state.route] ||
    'SAM';
  $('#app').innerHTML =
    `<div class="shell"><aside class="sidebar"><a class="brand" href="#/home"><img src="/mark.svg" alt=""><div><b>SAM</b><small>DEVELOPER STUDIO</small></div></a><div class="nav-label">ТВОЁ РАЗВИТИЕ</div><nav class="nav" aria-label="Основная навигация">${navItems.map(([id, icon, title]) => `<a href="#/${id}" class="${state.route === id ? 'active' : ''}"><span class="icon" aria-hidden="true">${icon}</span>${title}</a>`).join('')}<div class="nav-label">СЛЕДУЮЩИЙ ШАГ</div><a href="#/jobs" class="${state.route === 'jobs' ? 'active' : ''}"><span class="icon" aria-hidden="true">⌕</span>Поиск работы</a>${state.user?.role === 'admin' ? `<a href="#/admin" class="${state.route === 'admin' ? 'active' : ''}"><span class="icon" aria-hidden="true">⊞</span>Преподаватель</a>` : ''}</nav><div class="sidebar-bottom"><p>Учись на примерах.<br>Создавай. Объясняй. Улучшай.</p><a href="https://github.com/stanshaban/salesforce-automation-mastery" target="_blank" rel="noopener noreferrer" class="side-foot">GitHub ↗</a></div></aside><div class="main-shell"><header class="topbar"><button class="mobile-toggle" data-action="menu" aria-label="Открыть меню">☰</button><div class="breadcrumb">Мастерская <span aria-hidden="true">/</span> <b>${current}</b></div><div class="account">${state.user ? `<div class="avatar">${esc((state.user.skoolUsername || 'S').slice(0, 2).toUpperCase())}</div><a href="#/profile" class="account-name">${esc(state.user.skoolUsername || state.user.email)}<small>${state.user.role === 'admin' ? 'Преподаватель' : 'Участник SAM'}</small></a><button class="text-btn" data-action="logout">Выйти</button>` : `<span class="tag">Гостевой доступ</span><a href="#/login" class="text-btn">Вход</a>`}</div></header><main class="main" id="main" tabindex="-1"></main></div></div>`;
}
function head(kicker, title, description, action = '') {
  return `<div class="page-head"><div><div class="eyebrow">${esc(kicker)}</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${action}</div>`;
}
function footer() {
  return `<footer class="footer"><span>Salesforce Automation Mastery · Учебная мастерская</span><span>Независимое сообщество · Не является продуктом Salesforce</span></footer>`;
}
function course(level) {
  return state.curriculum.find((x) => x.id === ids[level]);
}
function lessonCount(level) {
  return course(level)?.modules.reduce((n, m) => n + m.lessons.length, 0) || 0;
}
function trackCards() {
  const descriptions = {
    junior: 'CRM, основы Salesforce и первое приложение. Начни с того, зачем всё это нужно.',
    middle: 'Интеграции, асинхронный Apex и LWC. Собери функцию, которая работает целиком.',
    senior: 'Производительность, доступы и архитектура. Найди причину сбоя и обоснуй решение.',
  };
  return `<div class="grid three">${levels
    .map((level, i) => {
      const labs = state.assignments.filter((a) => a.level === level);
      const done = state.progress.completed.filter((id) => labs.some((a) => a.id === id)).length;
      return `<article class="card track ${level}"><div class="track-head"><span class="track-num">УРОВЕНЬ 0${i + 1}</span><strong>${levelNames[level]}</strong><span class="track-symbol" aria-hidden="true">${['◫', '⌘', '◇'][i]}</span></div><div class="track-body"><p>${descriptions[level]}</p><div class="meta">${lessonCount(level)} тем в программе · ${labs.length} практических заданий</div><div class="progress-line"><i style="width:${labs.length ? (done / labs.length) * 100 : 0}%"></i></div><small>${done} из ${labs.length} заданий отмечено выполненными</small><br><a class="btn" href="#/tracks/${level}">Открыть уровень <span>↗</span></a></div></article>`;
    })
    .join('')}</div>`;
}
function renderHome() {
  const answered = Object.values(state.progress.history).reduce((n, h) => n + (h.seen || 0), 0);
  const wrong = Object.values(state.progress.history).filter((h) => h.wrong > 0).length;
  return `${head('SALESFORCE AUTOMATION MASTERY', 'Твоя следующая ступень', 'Понятные объяснения, практические задачи и обратная связь по твоим решениям.')}<section class="hero"><div class="hero-content"><div class="eyebrow">ПРАКТИЧЕСКИЙ ПРОЕКТ</div><h2>Создай своего первого<br>агента в Agentforce</h2><p>Помоги автодилеру подобрать автомобиль и записать клиента на тест-драйв. Разберись, как устроено каждое действие агента.</p><a class="btn" href="#/agentforce">Открыть урок <span>↗</span></a></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit two"></div><div class="cube"></div><div class="floating one">01 · Запрос клиента</div><div class="floating two">02 · Действие в Salesforce</div><div class="floating three">✓ Тест-драйв записан</div></div></section><div class="section-title"><h2>Выбери свой уровень</h2><span>Один проект. Три глубины.</span></div>${trackCards()}<div class="grid two" style="margin-top:24px"><section class="card quiet-card"><div class="quiet-icon">⌘</div><div><h3>Проверь понимание</h3><p>Сценарии, разбор кода и поиск ошибок. Каждый набор собирается случайно с учётом прошлых ответов.</p><div class="stats"><div><strong>${answered}</strong><small>пройденных вопросов</small></div><div><strong>${state.questions.length}</strong><small>базовых вопросов</small></div></div><br><a class="text-btn" href="#/practice">Начать тренировку →</a>${wrong ? `<p style="margin-top:10px">Есть ${wrong} вопросов для повторения.</p>` : ''}</div></section><section class="card quiet-card"><div class="quiet-icon">▣</div><div><h3>Подготовь рабочее место</h3><p>VS Code, Salesforce CLI, учебная org и Git. Посмотри, где найти нужную команду и как проверить результат.</p><a class="text-btn" href="#/setup">Пройти настройку →</a><p style="margin-top:20px">Готово решение? Отправь файлы или ссылку на Pull Request и получи review.</p><a class="text-btn" href="#/submissions">Мои работы →</a></div></section></div>`;
}
function lessonOutline(l) {
  return `<details class="lesson-row"><summary><span class="lesson-id">${esc(l.id)}</span>${esc(l.title)}</summary><div class="lesson-content"><span class="tag">Программа урока</span><dl><dt>Результат</dt><dd>${esc(l.outcome)}</dd><dt>Практика</dt><dd>${esc(l.task)}</dd><dt>Как проверить</dt><dd>${esc(l.acceptance)}</dd><dt>Обсудим на интервью</dt><dd>${esc(l.interview)}</dd></dl>${state.foundations?.lessons?.some((x) => x.id === l.id) ? `<button class="btn small" data-action="foundation" data-id="${esc(l.id)}">Читать урок</button>` : ''}</div></details>`;
}
function renderTracks() {
  const c = course(state.level);
  return `${head('ПРОГРАММА ОБУЧЕНИЯ', `${levelNames[state.level]} Salesforce Developer`, c?.exit || 'Выбери уровень обучения.')}<div class="pillrow" style="margin-bottom:25px">${levels.map((l) => `<a class="btn ${l === state.level ? '' : 'secondary'}" href="#/tracks/${l}">${levelNames[l]}</a>`).join('')}</div><div class="note roadmap-banner">Здесь собрана программа обучения и задания. Подробные первые уроки Junior доступны по кнопке «Читать урок». Остальные темы пока представлены планом; полноценный практический урок Agentforce находится в отдельном разделе.</div>${state.level === 'junior' ? `<section class="card quiet-card" style="margin-bottom:25px"><div class="quiet-icon">01</div><div><h3>Начни с CRM и устройства Salesforce</h3><p>Сначала разберём, зачем компании CRM, кто в ней работает и что означают объекты, поля и записи.</p><button class="btn small" data-action="foundation" data-id="J01">Открыть первый урок</button></div></section>` : ''}<div class="section-title"><h2>Практика уровня</h2><span>Проект Northstar Motors</span></div><div class="grid two">${state.assignments
    .filter((a) => a.level === state.level)
    .map(
      (a) =>
        `<article class="card assignment"><div class="pillrow"><span class="tag">${esc(a.id)}</span><small>${a.estimatedMinutes} мин</small>${state.progress.completed.includes(a.id) ? '<span class="tag green">Выполнено</span>' : ''}</div><h3>${esc(a.title)}</h3><p>${esc(a.brief)}</p><button class="btn secondary small" data-action="assignment" data-id="${esc(a.id)}">Открыть задание →</button></article>`,
    )
    .join(
      '',
    )}</div>${(c?.modules || []).map((m, i) => `<div class="section-title"><h2>${i + 1}. ${esc(m.title)}</h2></div><div class="lesson-list">${m.lessons.map(lessonOutline).join('')}</div>`).join('')}`;
}
function showAssignment(id) {
  const a = state.assignments.find((a) => a.id === id);
  if (!a) return;
  openModal(
    a.title,
    `<div class="pillrow"><span class="tag">${a.id}</span><span class="tag">${levelNames[a.level]}</span><span class="tag">${a.estimatedMinutes} мин</span></div><div class="small-copy"><p style="margin-top:20px">${esc(a.brief)}</p><h3>Что нужно знать</h3>${list(a.prerequisites)}<h3>Что сделать</h3>${list(a.tasks)}<h3>Критерии готовности</h3>${list(a.acceptance)}<h3>Проверь сложные случаи</h3>${list(a.failureCases)}<h3>Что приложить</h3>${list(a.deliverables)}<h3>Подготовь объяснение</h3>${list(a.reviewQuestions)}<div class="note">${esc(typeof a.environment === 'string' ? a.environment : JSON.stringify(a.environment || ''))}</div><p>Стартовый проект: ${external(`https://github.com/stanshaban/salesforce-automation-mastery/tree/main/${a.starterPath || 'starter/salesforce'}`, a.starterPath || 'starter/salesforce')}</p></div><div class="modal-actions"><button class="btn secondary" data-action="complete-assignment" data-id="${a.id}">${state.progress.completed.includes(id) ? 'Снять отметку' : 'Отметить выполненным'}</button><button class="btn" data-action="submit-assignment" data-id="${a.id}">Отправить на review</button></div>`,
    true,
  );
}
function renderPractice() {
  const topics = [...new Set(state.questions.filter((q) => q.level === state.level).map((q) => q.topic))];
  return `${head('САМОПРОВЕРКА', 'Понимание важнее запоминания', 'Вопросы и порядок ответов выбираются заново. У части вопросов меняются условия и правильный вывод.')}<div class="grid two"><section class="card"><h2>Новая тренировка</h2><form id="quiz-config" class="stack"><div class="field"><label for="quiz-level">Уровень</label><select id="quiz-level" name="level">${levels.map((l) => `<option value="${l}" ${l === state.level ? 'selected' : ''}>${levelNames[l]}</option>`).join('')}</select></div><div class="field"><label for="quiz-topic">Тема</label><select id="quiz-topic" name="topic"><option value="all">Все темы уровня</option>${topics.map((t) => `<option>${esc(t)}</option>`).join('')}</select></div><div class="field"><label for="quiz-count">Количество вопросов</label><select id="quiz-count" name="count"><option value="8">8 · короткая практика</option><option value="15">15 · подробная проверка</option><option value="25">25 · большая тренировка</option></select></div><label class="check"><input type="checkbox" name="weakOnly">Повторить вопросы, в которых были ошибки</label><button class="btn" type="submit">Начать тренировку →</button></form></section><div class="stack"><section class="card"><div class="eyebrow">КАК ЭТО РАБОТАЕТ</div><h3>Сначала решение, затем объяснение</h3><p class="small-copy muted">Выбери ответ и проверь его. После ответа ты увидишь причину, разбор альтернатив и ссылку на документацию. В пределах одной попытки вопрос не повторяется.</p><p class="small-copy muted">Если вопросов по теме меньше выбранного количества, тренировка будет короче. В режиме повторения используются вопросы с прошлыми ошибками; если таких пока нет — обычный набор.</p><div class="note">Это тренажёр для обучения. Он помогает найти пробелы, но не подтверждает профессиональный грейд.</div>${!state.user ? '<p class="small-copy muted" style="margin-top:15px">Сейчас прогресс хранится в этом браузере. После входа по приглашению он сохраняется в твоём профиле.</p>' : ''}</section><section class="card"><h3>Последние попытки</h3>${
    state.progress.sessions.length
      ? state.progress.sessions
          .slice(-5)
          .reverse()
          .map(
            (s) =>
              `<div class="history-row"><span>${levelNames[s.level] || s.level} <small>· ${date(s.at)}</small></span><b>${s.correct}/${s.total}</b></div>`,
          )
          .join('')
      : '<p class="muted small-copy">Здесь появятся результаты тренировок.</p>'
  }</section></div></div>`;
}
function renderQuiz() {
  const quiz = state.quiz,
    q = quiz.questions[quiz.index];
  if (!q) return renderQuizResult();
  const answered = quiz.answer !== undefined;
  const correct = quiz.answer === q.correctOptionId;
  return `<div class="quiz-shell"><div class="quiz-top"><a href="#/practice" class="text-btn">← К тренировкам</a><span class="tag">${quiz.index + 1} / ${quiz.questions.length}</span></div><div class="progress-line"><i style="width:${((quiz.index + (answered ? 1 : 0)) / quiz.questions.length) * 100}%"></i></div><section class="card"><div class="pillrow"><span class="tag">${levelNames[quiz.level]}</span><span class="tag">${esc(q.topic)}</span><span class="tag">${{ concept: 'Понятие', scenario: 'Ситуация', code: 'Разбор кода', diagnosis: 'Поиск причины' }[q.kind] || 'Вопрос'}</span></div><h1 class="question-title">${esc(q.prompt)}</h1>${q.code ? codeBox(q.code) : ''}<div class="answers">${q.options.map((o, i) => `<button class="answer ${answered ? (o.id === q.correctOptionId ? 'correct' : o.id === quiz.answer ? 'incorrect' : '') : o.id === quiz.selected ? 'selected' : ''}" data-action="quiz-select" data-id="${esc(o.id)}" ${answered ? 'disabled' : ''}><span class="letter">${String.fromCharCode(65 + i)}</span><span>${esc(o.text)}</span></button>`).join('')}</div>${answered ? `<div class="explanation"><strong>${quiz.answer === null ? 'Вопрос пропущен' : correct ? 'Верно' : 'Разберём решение'}</strong><p style="margin:12px 0">${esc(q.explanation)}</p>${(q.whyOthers || []).map((o) => `<p class="small-copy"><b>${esc(q.options.find((x) => x.id === o.id)?.text || o.id)}</b><br>${esc(o.text)}</p>`).join('')}${external(q.sourceUrl, 'Официальная документация ↗')}</div><button class="btn" data-action="quiz-next">${quiz.index === quiz.questions.length - 1 ? 'Посмотреть результат' : 'Следующий вопрос →'}</button>` : `<div class="modal-actions"><button class="text-btn" data-action="quiz-skip">Пропустить</button><button class="btn" data-action="quiz-check" ${!quiz.selected ? 'disabled' : ''}>Проверить ответ</button></div>`}</section></div>`;
}
function recordAnswer(answer) {
  const quiz = state.quiz;
  if (!quiz || quiz.answer !== undefined) return;
  const q = quiz.questions[quiz.index];
  if (!q || (answer !== null && !q.options.some((option) => option.id === answer))) return;
  quiz.answer = answer;
  quiz.answers.push({ question: q, selectedOptionId: answer, skipped: answer === null });
  const family = q.familyId || q.id,
    previous = state.progress.history[family] || {};
  const counter = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0);
  const h = {
    ...previous,
    seen: counter(previous.seen),
    correct: counter(previous.correct),
    wrong: counter(previous.wrong),
    skipped: counter(previous.skipped),
  };
  h.seen++;
  h.lastSeen = Date.now();
  if (answer === null) h.skipped++;
  else if (answer === q.correctOptionId) {
    h.correct++;
    h.lastCorrect = true;
  } else {
    h.wrong++;
    h.lastCorrect = false;
  }
  state.progress.history[family] = h;
  saveProgress();
  render();
}
function renderQuizResult() {
  const q = state.quiz,
    r = summarizeAnswers(q.answers);
  if (!q.saved) {
    q.saved = true;
    state.progress.sessions.push({
      level: q.level,
      at: new Date().toISOString(),
      correct: r.correct,
      total: r.total,
      score: r.score,
      skipped: r.skipped,
    });
    state.progress.sessions = state.progress.sessions.slice(-100);
    saveProgress();
  }
  return `<div class="quiz-shell">${head('РЕЗУЛЬТАТ ТРЕНИРОВКИ', 'Теперь видно, что повторить', 'Посмотри на темы и вернись к объяснениям сложных вопросов.')}<section class="card"><div class="result-number">${r.correct}<small> / ${r.total}</small></div><p class="muted">Верных ответов · пропущено ${r.skipped}</p>${r.topics.map((t) => `<div class="topic-result"><span>${esc(t.topic)}</span><b>${t.correct}/${t.total}</b><div class="progress-line"><i style="width:${(t.correct / t.total) * 100}%"></i></div></div>`).join('')}<div class="modal-actions"><a href="#/practice" class="btn secondary">Настроить тренировку</a><button class="btn" data-action="quiz-again">Новый набор →</button></div></section><div class="section-title"><h2>Разбор попытки</h2></div>${q.answers.map((a) => `<details class="lesson-row" style="margin-bottom:10px"><summary><span>${a.skipped ? '○' : a.selectedOptionId === a.question.correctOptionId ? '✓' : '↻'}</span>${esc(a.question.title || a.question.prompt)}</summary><div class="lesson-content"><p>${esc(a.question.prompt)}</p><p><b>Правильный ответ:</b> ${esc(a.question.options.find((o) => o.id === a.question.correctOptionId)?.text)}</p><p>${esc(a.question.explanation)}</p>${external(a.question.sourceUrl, 'Источник')}</div></details>`).join('')}</div>`;
}
function vscode(step) {
  const zone = step.visual?.zone;
  return `<div class="vscode" aria-label="Учебная схема окна Visual Studio Code"><div class="vscode-bar"><i></i><i></i><i></i><span>sam-training — Visual Studio Code</span></div><div class="vs-window"><div class="vs-activity ${zone === 'source-control' ? 'highlight' : ''}">▣<br>⌕<br>⑂<br>⊞</div><div class="vs-explorer ${zone === 'sidebar' ? 'highlight' : ''}">EXPLORER<br>⌄ salesforce<br>　⌄ force-app<br>　　⌄ main<br>　　　default<br>　sfdx-project.json</div><div class="vs-code ${zone === 'editor' ? 'highlight' : ''}"><span style="color:#668096">1　</span>{<br><span style="color:#668096">2　</span>　<em>"packageDirectories"</em>: [<br><span style="color:#668096">3　</span>　　{ "path": "force-app" }<br><span style="color:#668096">4　</span>　],<br><span style="color:#668096">5　</span>　<em>"sourceApiVersion"</em>: "68.0"<br><span style="color:#668096">6　</span>}</div><div class="vs-terminal ${zone === 'terminal' ? 'highlight' : ''}">TERMINAL　 PROBLEMS　 OUTPUT<br>$ sf org list<br><span style="color:#a8cdb6">sam-training　 Connected</span></div>${zone === 'palette' ? '<div class="vs-palette highlight">&gt; SFDX: Authorize an Org<br><br>SFDX: Open Default Org</div>' : ''}</div><div class="vs-status ${zone === 'status' ? 'highlight' : ''}"><span>⑂ main　 ○ 0　△ 0</span><span>sam-training　 Salesforce</span></div><div class="vs-caption">Схема интерфейса · ${esc(step.visual?.caption || '')}</div></div>`;
}
function renderSetup() {
  if (!state.setup) return '<p>Гайд недоступен.</p>';
  const step = state.setup.steps[state.step];
  return `${head('РАБОЧЕЕ МЕСТО', 'Разработка в Visual Studio Code', state.setup.introduction)}<div class="guide-layout"><nav class="steps-nav" aria-label="Шаги настройки">${state.setup.steps.map((s, i) => `<button class="step-button ${i === state.step ? 'active' : ''}" data-action="setup-step" data-index="${i}"><b>${String(i + 1).padStart(2, '0')}</b>${esc(s.title)}</button>`).join('')}</nav><section class="card"><div class="eyebrow">ШАГ ${state.step + 1} / ${state.setup.steps.length}</div><h2>${esc(step.title)}</h2><p class="small-copy">${esc(step.explanation)}</p>${vscode(step)}<div class="small-copy"><h3>Сделай по порядку</h3><ol>${step.actions.map((a) => `<li>${esc(a)}</li>`).join('')}</ol>${(step.commands || []).map((c) => `<p><b>${esc(c.label)}</b> <span class="tag">${esc(c.platform || '')}</span></p>${codeBox(c.command)}`).join('')}<div class="note success"><b>Проверь результат</b><br>${esc(step.verify)}</div><br><div class="note warn"><b>Частая ошибка</b><br>${esc(step.commonMistake)}</div><h3>Официальные инструкции</h3><ul>${(step.sourceUrls || []).map((url, i) => `<li>${external(url, `Источник ${i + 1} · ${new URL(url).hostname}`)}</li>`).join('')}</ul><p class="muted">Видео к этому шагу запланировано. Письменная инструкция доступна сейчас.</p></div><div class="modal-actions"><button class="btn secondary" data-action="setup-step" data-index="${Math.max(0, state.step - 1)}" ${state.step === 0 ? 'disabled' : ''}>Назад</button><button class="btn" data-action="setup-step" data-index="${Math.min(state.setup.steps.length - 1, state.step + 1)}" ${state.step === state.setup.steps.length - 1 ? 'disabled' : ''}>Следующий шаг →</button></div></section></div>`;
}
function renderLogin() {
  return `<div class="auth-panel card"><div class="eyebrow">ДОСТУП В SAM</div><h1>Вход преподавателя</h1><p class="muted small-copy">Участники входят по персональной ссылке от преподавателя. Ссылка открывает регистрацию, затем браузер запоминает вход.</p><form id="admin-login" class="stack"><div class="field"><label for="login-email">Email</label><input id="login-email" name="email" type="email" required autocomplete="username"></div><div class="field"><label for="login-password">Пароль преподавателя</label><input id="login-password" name="password" type="password" required autocomplete="current-password"></div><div class="form-error" role="alert"></div><button class="btn">Войти</button></form><p class="consent-info" style="margin-top:20px">Потерял доступ как участник? Попроси преподавателя создать новую ссылку для твоего профиля.</p></div>`;
}
function renderJoin() {
  if (!joinToken)
    return `<div class="auth-panel card"><h1>Нужна ссылка-приглашение</h1><p class="muted">Открой персональную ссылку, которую выдал преподаватель. После использования она больше не действует.</p><a class="btn" href="#/home">Открыть мастерскую</a></div>`;
  return `<div class="auth-panel card"><div class="eyebrow">ТВОЯ МАСТЕРСКАЯ SALESFORCE</div><h1>Добро пожаловать в SAM</h1><p class="muted small-copy">Укажи, как найти тебя в сообществе. Преподаватель увидит эти данные рядом с твоими работами.</p><form id="join-form" class="stack"><div class="field"><label for="join-email">Твой email</label><input id="join-email" name="email" type="email" required autocomplete="email"></div><div class="field"><label for="join-skool">Имя пользователя в Skool</label><input id="join-skool" name="skoolUsername" required maxlength="80" placeholder="Например, alex-developer"></div><label class="check"><input name="notificationsConsent" type="checkbox">Согласен получать на email уведомления о проверке моих работ и изменении их статуса.</label><p class="consent-info">Согласие добровольное. Его можно отозвать в профиле. Отправка писем пока не подключена; результаты проверки доступны в кабинете. Email сохраняется без подтверждения адреса.</p><div class="form-error" role="alert"></div><button class="btn">Войти по приглашению →</button></form></div>`;
}
async function loadSubmissions() {
  if (!state.user) return;
  try {
    state.submissions = (await api('/api/submissions')).submissions || [];
  } catch (e) {
    toast(e.message);
  }
}
function renderSubmissions() {
  return `${head('ПРАКТИКА И ОБРАТНАЯ СВЯЗЬ', state.user?.role === 'admin' ? 'Работы участников' : 'Мои работы', 'Отправь решение, объясни свой подход и доработай его после review.', state.user ? '<button class="btn" data-action="new-submission">Отправить работу ↗</button>' : '')}<div class="note" style="margin-bottom:22px">Можно приложить файлы проекта или ссылку на GitHub Pull Request. Работы и отзывы в портале доступны только автору и преподавателю.</div>${!state.user ? '<section class="card empty"><div class="icon">↗</div><h3>Войди по приглашению</h3><p>После входа здесь появятся твои работы и ответы преподавателя.</p><a class="btn secondary" href="#/login">Как войти</a></section>' : submissionTable(state.submissions)}`;
}
function submissionTable(items) {
  return `<section class="card">${items.length ? `<div class="table-wrap"><table><thead><tr><th>Работа</th>${state.user.role === 'admin' ? '<th>Участник</th>' : ''}<th>Статус</th><th>Отправлено</th></tr></thead><tbody>${items.map((s) => `<tr><td><button class="table-button" data-action="view-submission" data-id="${esc(s.id)}">${esc(s.title)}</button><div class="muted" style="margin-top:6px">${esc(s.assignmentId)}</div></td>${state.user.role === 'admin' ? `<td>${esc(s.user?.skoolUsername || '')}<br><small>${esc(s.user?.email || '')}</small></td>` : ''}<td>${statusTag(s.status)}</td><td>${date(s.createdAt)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty"><h3>Работ пока нет</h3><p>Выбери задание в программе и отправь своё первое решение.</p><a class="btn secondary" href="#/tracks/junior">Выбрать задание</a></div>'}</section>`;
}
function submissionForm(assignmentId = '', parentId = '') {
  if (!state.user) {
    closeModal();
    location.hash = '/login';
    return;
  }
  openModal(
    'Отправить работу',
    `<form id="submission-form" class="stack"><input name="parentId" type="hidden" value="${esc(parentId)}"><div class="field"><label for="submission-assignment">Задание</label><select id="submission-assignment" name="assignmentId" required><option value="">Выбери задание</option>${state.assignments.map((a) => `<option value="${a.id}" ${a.id === assignmentId ? 'selected' : ''}>${a.id} · ${esc(a.title)}</option>`).join('')}<option value="AF-L01" ${assignmentId === 'AF-L01' ? 'selected' : ''}>AF-L01 · Агент для записи на тест-драйв</option></select></div><div class="field"><label for="submission-title">Название работы</label><input id="submission-title" name="title" maxlength="160" required placeholder="Например, заявка на тест-драйв — первая версия"></div><div class="field"><label for="submission-description">Что сделано и как проверить</label><textarea id="submission-description" name="description" required maxlength="7500" placeholder="Опиши решение, шаги проверки, результат тестов и вопросы к преподавателю."></textarea></div><div class="field"><label for="submission-github">Ссылка на GitHub Pull Request — необязательно</label><input id="submission-github" name="githubUrl" type="url" placeholder="https://github.com/username/repository/pull/1"></div><div class="field"><label for="submission-files">Файлы решения</label><input id="submission-files" name="files" type="file" multiple accept=".zip,.cls,.trigger,.js,.html,.css,.xml,.json,.md,.txt,.pdf,.png,.jpg,.jpeg,.webp,.csv"><small>До 5 файлов, до 10 МБ каждый и 25 МБ суммарно. Добавь файлы или ссылку на PR.</small><div id="file-labels"></div></div><div class="note">Приложи только учебные metadata и тестовые данные. Пароли, токены и данные клиентов в решении не нужны.</div><div class="form-error" role="alert"></div><button class="btn">Отправить на проверку</button></form>`,
  );
}
async function showSubmission(id) {
  try {
    const s = (await api(`/api/submissions/${encodeURIComponent(id)}`)).submission;
    openModal(
      s.title,
      `<div class="sub-meta">${statusTag(s.status)}<span>${esc(s.assignmentId)}</span><span>${date(s.createdAt)}</span>${s.parentId ? '<span>Повторная отправка</span>' : ''}</div>${state.user.role === 'admin' ? `<div class="note">${esc(s.user?.skoolUsername)} · ${esc(s.user?.email)}</div><br>` : ''}<p class="small-copy" style="white-space:pre-wrap">${esc(s.description)}</p>${s.githubUrl ? `<p>${external(s.githubUrl, 'Открыть GitHub Pull Request ↗')}</p>` : ''}<h3>Файлы</h3>${(s.files || []).map((f) => `<div class="file-row"><span>↧</span><a href="/api/files/${encodeURIComponent(f.id)}">${esc(f.label || f.originalName)}</a><small>${esc(f.originalName)} · ${(f.size / 1024).toFixed(1)} КБ</small></div>`).join('') || '<p class="muted small-copy">Решение предоставлено по ссылке.</p>'}<h3 style="margin-top:25px">Обратная связь</h3>${s.feedback ? `<div class="feedback">${esc(s.feedback)}</div>` : '<p class="muted small-copy">Преподаватель ещё не оставил комментарий.</p>'}${
        state.user.role === 'admin'
          ? `<form id="review-form" class="stack" data-id="${esc(s.id)}" style="margin-top:24px"><div class="field"><label for="review-status">Статус проверки</label><select id="review-status" name="status">${Object.entries(
              statuses,
            )
              .map(
                ([key, label]) =>
                  `<option value="${key}" ${s.status === key ? 'selected' : ''}>${label}</option>`,
              )
              .join(
                '',
              )}</select></div><div class="field"><label for="review-feedback">Комментарий участнику</label><textarea id="review-feedback" name="feedback" maxlength="20000" placeholder="Что работает хорошо, что изменить и как проверить исправление.">${esc(s.feedback || '')}</textarea></div><div class="form-error" role="alert"></div><button class="btn">Сохранить review</button></form>`
          : `<div class="modal-actions"><button class="btn" data-action="resubmit" data-id="${esc(s.assignmentId)}" data-parent="${esc(s.id)}">Отправить новую версию</button></div>`
      }`,
      true,
    );
  } catch (e) {
    toast(e.message);
  }
}
async function renderAdmin() {
  if (state.user?.role !== 'admin') return renderLogin();
  const [users, invites] = await Promise.all([api('/api/admin/users'), api('/api/admin/invites')]);
  return `${head('КАБИНЕТ ПРЕПОДАВАТЕЛЯ', 'Участники и проверка работ', 'Создавай приглашения, проверяй решения и отправляй участникам обратную связь.')}<div class="grid two"><section class="card"><h2>Новое приглашение</h2><form id="invite-form" class="stack"><div class="field"><label for="invite-label">Подпись для себя</label><input id="invite-label" name="label" maxlength="100" placeholder="Например, участник из Skool"></div><div class="field"><label for="invite-user">Для кого ссылка</label><select id="invite-user" name="userId"><option value="">Новый участник</option>${users.users
    .filter((u) => u.role !== 'admin')
    .map(
      (u) =>
        `<option value="${esc(u.id)}">Повторный вход: ${esc(u.skoolUsername)} · ${esc(u.email)}</option>`,
    )
    .join(
      '',
    )}</select></div><div class="field"><label for="invite-expiry">Срок действия</label><select id="invite-expiry" name="expiresInDays"><option value="7">7 дней</option><option value="30">30 дней</option><option value="1">1 день</option></select></div><div class="form-error" role="alert"></div><button class="btn">Создать персональную ссылку</button><div id="invite-result"></div></form></section><section class="card"><h2>Выданные приглашения</h2><p class="small-copy muted">Ссылка используется один раз. Для повторного входа выбери существующего участника. Пароль преподавателя участникам не нужен.</p>${
    invites.invites.length
      ? invites.invites
          .slice(0, 8)
          .map(
            (i) =>
              `<div class="history-row"><div><b>${esc(i.label || 'Без подписи')}</b><br><small>до ${date(i.expiresAt)}</small></div>${i.usedAt ? '<span class="tag green">Использовано</span>' : i.revokedAt ? '<span class="tag">Отозвано</span>' : new Date(i.expiresAt) < new Date() ? '<span class="tag">Истекло</span>' : `<button class="text-btn" data-action="revoke-invite" data-id="${esc(i.id)}">Отозвать</button>`}</div>`,
          )
          .join('')
      : '<p class="muted small-copy">Приглашений ещё нет.</p>'
  }</section></div><div class="section-title"><h2>Очередь проверки</h2><span>${state.submissions.length} работ</span></div><div class="filters"><div class="field"><label for="review-filter">Статус</label><select id="review-filter"><option value="all">Все работы</option>${Object.entries(
    statuses,
  )
    .map(([k, v]) => `<option value="${k}">${v}</option>`)
    .join(
      '',
    )}</select></div><div class="field"><label for="review-level-filter">Уровень</label><select id="review-level-filter"><option value="all">Все уровни</option>${levels.map((l) => `<option value="${l}">${levelNames[l]}</option>`).join('')}<option value="agentforce">Agentforce</option></select></div></div><div id="review-table">${submissionTable(state.submissions)}</div><div class="section-title"><h2>Участники</h2><span>${users.users.filter((u) => u.role !== 'admin').length} профилей</span></div><section class="card table-wrap"><table><thead><tr><th>Имя в Skool</th><th>Email</th><th>Уведомления</th></tr></thead><tbody>${
    users.users
      .filter((u) => u.role !== 'admin')
      .map(
        (u) =>
          `<tr><td>${esc(u.skoolUsername)}</td><td>${esc(u.email)}<br><small>Адрес указан участником</small></td><td>${u.notificationsConsent ? '<span class="tag green">Есть согласие</span>' : '<span class="tag">Без уведомлений</span>'}</td></tr>`,
      )
      .join('') || '<tr><td colspan="3" class="muted">Участников пока нет.</td></tr>'
  }</tbody></table></section>`;
}
function renderProfile() {
  if (!state.user) return renderLogin();
  return `${head('ПРОФИЛЬ', 'Твои данные и настройки', 'Данные помогают преподавателю сопоставить работу и участника сообщества.')}<section class="card balance"><p><b>Имя в Skool</b><br>${esc(state.user.skoolUsername)}</p><p><b>Email</b><br>${esc(state.user.email)}</p><p class="consent-info">Адрес указан пользователем и не подтверждён письмом.</p><form id="profile-form"><label class="check"><input type="checkbox" name="notificationsConsent" ${state.user.notificationsConsent ? 'checked' : ''}>Согласен получать уведомления о моих работах и результатах проверки.</label><p class="consent-info">Отправка писем пока не подключена. Настройка сохраняет твоё согласие на будущее. Отказ не ограничивает доступ к обучению и review.</p><div class="form-error" role="alert"></div><button class="btn">Сохранить настройки</button></form></section>`;
}
function renderJobs() {
  const c = state.curriculum.find((c) => c.id === 'jobs');
  return `${head('ПОДГОТОВКА К ПОИСКУ РАБОТЫ', 'Поиск работы Salesforce Developer', 'Программа мастер-класса: профиль, резюме, подбор вакансий и подготовка к интервью.')}<div class="note">Это содержание будущего мастер-класса. Практику к техническому интервью уже можно пройти в разделе «Самопроверка».</div>${(c?.modules || []).map((m) => `<div class="section-title"><h2>${esc(m.title)}</h2></div><div class="lesson-list">${m.lessons.map(lessonOutline).join('')}</div>`).join('')}`;
}
const securityInitial = {
  object: true,
  field: true,
  groupGrant: true,
  mute: false,
  directGrant: false,
  owner: false,
  role: false,
  sharing: true,
  restriction: false,
};
let security = { ...securityInitial };
function securityResult() {
  const object = security.object && (security.directGrant || (security.groupGrant && !security.mute));
  const record = security.owner || security.role || security.sharing;
  const visible = object && record && !security.restriction;
  const gates = [
    [
      'Объект',
      object,
      'Read нужен на объекте. Разрешения складываются; muting действует внутри своей группы.',
    ],
    ['Запись', record, 'В этом примере OWD = Private. Достаточно одного пути доступа к записи.'],
    [
      'Restriction Rule',
      !security.restriction,
      'Активное ограничение дополнительно отфильтровывает доступную запись.',
    ],
    ['Поле', visible && security.field, 'Поле видно, когда доступна сама запись и есть Read на поле.'],
  ];
  return `${gates.map(([title, on, desc]) => `<div class="security-gate ${on ? 'on' : 'off'}"><i>${on ? '✓' : '×'}</i><div><b>${title}</b><p>${desc}</p></div></div>`).join('')}<div class="note ${visible ? 'success' : 'warn'}"><b>${visible ? 'Запись доступна' : 'Запись не видна'}</b><br>${visible ? (security.field ? 'Поле Budget__c видно.' : 'Запись открывается, Budget__c скрыто.') : 'Одного разрешения на поле недостаточно, чтобы открыть запись.'}</div>`;
}
function renderSecurity() {
  return `${head('ИНТЕРАКТИВНАЯ СХЕМА', 'Доступ к объекту, записи и полю', 'Меняй условия и смотри, почему пользователь видит данные или теряет доступ.')}<div class="note" style="margin-bottom:24px">Учебный пример: пользователь открывает Test_Drive__c в интерфейсе, OWD = Private, без View All / Modify All. Restriction Rules доступны не для всех объектов и редакций. Схема показывает отдельный пример, а не вычисляет реальные права org.</div><div class="security-layout"><section class="card"><h2>Настройки пользователя</h2>${[
    ['object', 'Доступ к объекту разрешён лицензией'],
    ['groupGrant', 'Permission Set в группе даёт Read'],
    ['mute', 'Muting в этой группе убирает Read'],
    ['directGrant', 'Отдельный Permission Set даёт Read'],
    ['owner', 'Пользователь — владелец записи'],
    ['role', 'Доступ через иерархию ролей'],
    ['sharing', 'Запись доступна через sharing'],
    ['restriction', 'Restriction Rule исключает эту запись'],
    ['field', 'Есть Read на поле Budget__c'],
  ]
    .map(
      ([key, label]) =>
        `<label class="check check-group"><input type="checkbox" data-security="${key}" ${security[key] ? 'checked' : ''}>${label}</label>`,
    )
    .join(
      '',
    )}<button class="btn secondary small" data-action="security-reset">Сбросить пример</button></section><section class="card"><h2>Что доступно в итоге</h2><div id="security-result">${securityResult()}</div><div class="small-copy"><h3>Что попробовать</h3><ol><li>Включи muting: Read из группы исчезнет.</li><li>Добавь отдельный Permission Set: Read вернётся.</li><li>Убери все пути доступа к записи: разрешение на объект её не откроет.</li><li>Включи Restriction Rule и проверь результат.</li></ol><p>${external('https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/security_data_access.htm', 'Модель доступа Salesforce ↗')}</p></div></section></div>`;
}
function renderAgentforce() {
  const a = state.agentforce;
  return `${head('ПРАКТИЧЕСКИЙ УРОК', 'Agentforce: агент для автодилера', 'От устройства CRM и действий агента до записи на тест-драйв в учебном проекте.')}<section class="agent-hero"><div><div class="eyebrow">NORTHSTAR MOTORS</div><h2>Продавец помогает клиенту.<br>Агент выполняет действия в CRM.</h2><p class="small-copy">Northstar Motors — вымышленный автодилер. Продавец использует внутреннего Employee Agent в Salesforce: просит варианты для клиента, подтверждает запись и проверяет созданную заявку. Клиент не входит в CRM.</p><div class="pillrow"><span class="tag">Пошаговый проект</span><span class="tag">Apex + Agentforce</span><span class="tag">Проверка результата</span></div></div><div><h3>Что получится</h3><ol class="small-copy"><li>Найти доступные автомобили.</li><li>Предложить клиенту вариант.</li><li>Получить подтверждение от продавца.</li><li>Создать заявку и показать её номер.</li></ol><button class="btn" data-action="submit-assignment" data-id="AF-L01">Сдать проект на review</button></div></section><section class="card"><div class="section-title" style="margin-top:0"><h2>Посмотри сценарий до начала урока</h2><span class="tag">Учебная симуляция</span></div><p class="small-copy muted">Это интерактивная схема с фиксированными ответами. Она не подключается к Salesforce и не вызывает AI. Настоящего агента ты соберёшь в своей учебной org по инструкции ниже.</p><div id="agent-demo">${renderDemo()}</div></section>${a ? renderStructuredLesson(a) : '<div class="note" style="margin-top:20px">Материалы урока обновляются. Перезагрузи страницу немного позже.</div>'}`;
}
function renderDemo() {
  const n = state.demoStep;
  return `<div class="flow-map">${['Запрос', 'Инструкция агента', 'Apex action', 'Запись в Salesforce'].map((x, i) => `${i ? '<span class="flow-arrow">→</span>' : ''}<div class="flow-node ${Math.min(n, 3) === i ? 'active' : ''}">${x}</div>`).join('')}</div><div class="grid two"><div class="chat-demo"><div class="chat-head">Northstar Assistant · продавец и внутренний агент</div><div class="chat-lines"><div class="bubble user">Клиент хочет посмотреть семейный автомобиль. Найди учебные варианты тест-драйва.</div><div class="bubble">${['Начнём с доступных автомобилей. Нажми кнопку, чтобы агент вызвал действие поиска.', 'В учебном каталоге доступен Northstar Touring. Могу предложить тест-драйв завтра в 14:00. Подтверждаешь запись?', 'Перед сохранением действие проверяет автомобиль, время и отсутствие повторной заявки.', 'Заявка TD-00042 создана. Northstar Touring, завтра в 14:00. Менеджер увидит её в Salesforce.'][n]}</div></div><div class="demo-actions">${n < 3 ? `<button class="btn small" data-action="demo-next">${['Найти автомобили', 'Подтверждаю запись', 'Показать результат'][n]}</button>` : ''}<button class="btn secondary small" data-action="demo-reset">Начать заново</button></div></div><div class="card" style="background:#f7faf8"><h3>Что происходит в системе</h3><div class="audit-row"><b>Запрос</b><span>Продавец передаёт запрос клиента обычным языком.</span></div>${n >= 1 ? '<div class="audit-row"><b>Поиск</b><span>Агент выбирает разрешённое действие. Apex возвращает данные каталога.</span></div>' : ''}${n >= 2 ? '<div class="audit-row"><b>Подтверждение</b><span>Продавец подтвердил согласованную с клиентом запись. Теперь можно создавать заявку.</span></div>' : ''}${n >= 3 ? '<div class="audit-row"><b>Результат</b><span>В учебной схеме появилась запись Test_Drive__c. В настоящей org проверим её отдельным запросом.</span></div>' : ''}</div></div>`;
}
function renderStructuredLesson(a) {
  const chapters = a.chapters || a.modules || a.sections || [];
  return `<div class="section-title"><h2>${esc(a.title || 'Инструкция')}</h2><span class="tag">Около ${Math.round((a.estimatedMinutes || 300) / 60)} часов</span></div><div class="note" style="margin-bottom:20px">${esc(a.status || '')}</div><section class="card small-copy"><h3>Что нужно перед началом</h3>${list(a.prerequisites)}${a.environment ? `<h3>Учебная среда</h3><p>${esc(a.environment.recommended)}</p><p>${external(a.environment.signupUrl, 'Создать специальную учебную org ↗')}</p>${list(a.environment.requirements)}<details class="lesson-row"><summary>Возможности и ограничения среды</summary><div class="lesson-content">${list(a.environment.limitations)}<p>${esc(a.environment.actualVerification)}</p></div></details>` : ''}<p>${external('https://github.com/stanshaban/salesforce-automation-mastery/tree/main/starter/agentforce', 'Исходники Apex и тестов ↗')} · ${external('https://github.com/stanshaban/salesforce-automation-mastery/blob/main/docs/agentforce-lesson.md', 'Полный текст урока в GitHub ↗')}</p></section><div class="section-title"><h2>План практической работы</h2></div><div class="pillrow">${chapters.map((c, i) => `<button class="btn secondary small" data-action="jump-chapter" data-index="${i}">${i + 1}. ${esc(c.title)}</button>`).join('')}</div>${a.glossary ? `<details class="lesson-row" style="margin-top:20px"><summary>Словарь: объяснение новых терминов</summary><div class="lesson-content"><dl>${a.glossary.map((t) => `<dt>${esc(t.term)}</dt><dd>${esc(t.meaning)}<br><small>${esc(t.example)}</small></dd>`).join('')}</dl></div></details>` : ''}${a.dataModel ? `<section class="card small-copy" style="margin-top:20px"><h3>Какие данные хранит проект</h3><div class="table-wrap"><table><thead><tr><th>Объект</th><th>Сведения</th><th>Назначение</th></tr></thead><tbody>${a.dataModel.map((d) => `<tr><td><b>${esc(d.object)}</b><br><small>${esc(d.source)}</small></td><td>${esc(d.fields)}</td><td>${esc(d.purpose)}</td></tr>`).join('')}</tbody></table></div></section>` : ''}${chapters.map((ch, i) => `<section class="card chapter small-copy" style="margin-top:20px" id="af-${i}"><div class="eyebrow">ЧАСТЬ ${i + 1}</div><h2>${esc(ch.title)}</h2>${renderLessonBlock(ch)}</section>`).join('')}${a.systemInstructions ? `<section class="card small-copy" style="margin-top:20px"><h2>Инструкция для агента</h2><p>Используй этот текст после подготовки и проверки действий из урока.</p>${codeBox(a.systemInstructions)}</section>` : ''}${a.actionContracts ? `<section class="card small-copy" style="margin-top:20px"><h2>Действия: входные данные и результат</h2>${a.actionContracts.map((c) => `<details class="lesson-row" style="margin-bottom:12px"><summary>${esc(c.name)}</summary><div class="lesson-content"><p>${esc(c.implementation)}</p><p><b>Изменяет данные:</b> ${c.mutatesData ? 'Да' : 'Нет'} · <b>Подтверждение:</b> ${c.requiresConfirmation ? 'Обязательно' : 'Не требуется'}</p><h3>Входные параметры</h3>${list((c.inputs || []).map((i) => `${i.name} (${i.type}) — ${i.meaning}${i.required ? ' · обязательный' : ''}`))}<h3>Выходные значения</h3>${list(c.outputs)}<h3>Коды результата</h3>${list(c.resultCodes)}<div class="note warn">${esc(c.limitations)}</div>${c.sourcePath ? `<p>${external('https://github.com/stanshaban/salesforce-automation-mastery/blob/main/' + c.sourcePath, 'Открыть исходник ↗')}</p>` : ''}</div></details>`).join('')}</section>` : ''}${a.testScenarios ? `<section class="card small-copy" style="margin-top:20px"><h2>Проверь своего агента</h2><p>Пройди каждый сценарий в учебной org и запиши фактический результат. Если проверку нельзя выполнить в твоей среде, укажи причину.</p>${a.testScenarios.map((t) => `<details class="lesson-row" style="margin-bottom:10px"><summary><span class="lesson-id">${esc(t.id)}</span>${esc(t.title)}</summary><div class="lesson-content"><p><b>Подготовка:</b> ${esc(t.setup)}</p><p><b>Запрос:</b> ${esc(t.prompt)}</p><p><b>Ожидаемый результат:</b> ${esc(t.expected)}</p><p><b>Доказательство:</b> ${esc(t.evidence)}</p></div></details>`).join('')}</section>` : ''}<section class="card small-copy" style="margin-top:20px"><h2>Что сдать на проверку</h2>${list(a.deliverables)}<button class="btn" data-action="submit-assignment" data-id="AF-L01">Отправить Agentforce-проект</button></section>${a.sourceUrls ? `<details class="lesson-row" style="margin-top:20px"><summary>Официальные источники · проверено ${esc(a.checkedAt)}</summary><div class="lesson-content">${listLinks(a.sourceUrls)}</div></details>` : ''}`;
}
function listLinks(urls) {
  return `<ul>${urls.map((s, i) => `<li>${external(typeof s === 'string' ? s : s.url, typeof s === 'string' ? `Источник ${i + 1} · ${new URL(s).hostname}` : s.title || s.url)}</li>`).join('')}</ul>`;
}
function renderLessonBlock(ch) {
  let out = '';
  for (const key of ['goal', 'context', 'explanation', 'content', 'outcome', 'environment']) {
    if (ch[key]) out += `<p>${esc(ch[key])}</p>`;
  }
  if (ch.paragraphs) out += ch.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
  if (ch.terms)
    out += `<dl>${ch.terms.map((t) => `<dt><b>${esc(t.term)}</b></dt><dd>${esc(t.definition)}</dd>`).join('')}</dl>`;
  if (ch.steps)
    out += `<ol>${ch.steps.map((s) => `<li>${typeof s === 'string' ? esc(s) : `<b>${esc(s.title || s.label || '')}</b>${s.text ? `<p>${esc(s.text)}</p>` : ''}${s.detail ? `<p>${esc(s.detail)}</p>` : ''}${s.instruction ? `<p>${esc(s.instruction)}</p>` : ''}${s.description ? `<p>${esc(s.description)}</p>` : ''}${s.commands ? (Array.isArray(s.commands) ? s.commands.map((c) => codeBox(typeof c === 'string' ? c : c.command)).join('') : codeBox(s.commands)) : ''}${s.code ? codeBox(s.code) : ''}${s.expected ? `<div class="note success">${esc(s.expected)}</div>` : ''}`}</li>`).join('')}</ol>`;
  for (const key of ['commands', 'snippets'])
    if (ch[key])
      out += ch[key]
        .map((c) =>
          typeof c === 'string'
            ? codeBox(c)
            : `<h3>${esc(c.label || c.title || '')}</h3>${codeBox(c.command || c.code || '')}`,
        )
        .join('');
  if (ch.code) out += codeBox(ch.code);
  for (const [key, title] of [
    ['tasks', 'Практика'],
    ['acceptance', 'Проверка результата'],
    ['expectedResults', 'Ожидаемый результат'],
    ['commonFailures', 'Если что-то не работает'],
    ['questions', 'Проверь понимание'],
  ])
    if (ch[key])
      out += `<h3>${title}</h3>${Array.isArray(ch[key]) ? list(ch[key]) : `<p>${esc(ch[key])}</p>`}`;
  if (ch.checkpoint)
    out += `<div class="note success"><b>Проверь понимание</b><br>${esc(ch.checkpoint)}</div>`;
  if (ch.sourceUrls) out += listLinks(ch.sourceUrls);
  return out;
}
function showFoundation(id) {
  const l = state.foundations?.lessons?.find((l) => l.id === id);
  if (!l) {
    toast('Подробный урок ещё готовится. Программа доступна ниже.');
    return;
  }
  openModal(
    l.title,
    `<div class="small-copy"><div class="note">${esc(l.goal)}</div>${l.sections.map((ch) => `<h3>${esc(ch.title)}</h3>${renderLessonBlock(ch)}`).join('')}<h3>Самостоятельная работа</h3>${list(l.exercise)}<h3>Проверь себя</h3>${(l.questions || []).map((q) => `<details class="lesson-row"><summary>${esc(q.question)}</summary><div class="lesson-content">${esc(q.answer)}</div></details>`).join('')}${l.sourceUrls ? listLinks(l.sourceUrls) : ''}</div>`,
    true,
  );
}
let renderVersion = 0;
async function render() {
  const version = ++renderVersion;
  shell();
  let content;
  try {
    const renders = {
      home: renderHome,
      tracks: renderTracks,
      practice: renderPractice,
      quiz: renderQuiz,
      setup: renderSetup,
      login: renderLogin,
      join: renderJoin,
      submissions: renderSubmissions,
      profile: renderProfile,
      jobs: renderJobs,
      security: renderSecurity,
      agentforce: renderAgentforce,
    };
    content = state.route === 'admin' ? await renderAdmin() : (renders[state.route] || renderHome)();
  } catch (e) {
    content = `<section class="card"><h2>Не удалось открыть раздел</h2><p>${esc(e.message)}</p><button class="btn" data-action="refresh">Повторить</button></section>`;
  }
  if (version !== renderVersion) return;
  $('#main').innerHTML = content + footer();
  document.title = `${{ home: 'Мастерская', tracks: levelNames[state.level], practice: 'Самопроверка', agentforce: 'Agentforce', setup: 'VS Code', admin: 'Преподаватель' }[state.route] || 'Портал'} · SAM`;
}
async function navigate() {
  closeModal();
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  state.route = location.pathname === '/join' && !parts[0] ? 'join' : parts[0] || 'home';
  if (levels.includes(parts[1])) state.level = parts[1];
  if (state.route === 'quiz' && !state.quiz) state.route = 'practice';
  if (['submissions', 'admin'].includes(state.route)) await loadSubmissions();
  render();
  window.scrollTo(0, 0);
}
async function handleForm(e) {
  const form = e.target;
  if (!(form instanceof HTMLFormElement)) return;
  e.preventDefault();
  const data = new FormData(form),
    obj = Object.fromEntries(data),
    submit = $('button[type=submit],button:not([type])', form),
    err = $('.form-error', form);
  if (err) err.textContent = '';
  if (submit) submit.disabled = true;
  try {
    if (form.id === 'quiz-config') {
      state.level = obj.level;
      const qs = buildSession(state.questions, {
        level: obj.level,
        topic: obj.topic,
        count: Number(obj.count),
        history: state.progress.history,
        weakOnly: obj.weakOnly === 'on',
      });
      if (!qs.length) throw Error('Для этой темы пока нет вопросов. Выбери другую.');
      state.quiz = {
        level: obj.level,
        config: { ...obj },
        questions: qs,
        index: 0,
        answers: [],
        selected: null,
        answer: undefined,
      };
      location.hash = '/quiz';
    } else if (form.id === 'admin-login') {
      state.user = (await api('/api/auth/admin', { method: 'POST', body: JSON.stringify(obj) })).user;
      await loadUserProgress();
      location.hash = '/admin';
    } else if (form.id === 'join-form') {
      state.user = (
        await api('/api/auth/join', {
          method: 'POST',
          body: JSON.stringify({
            token: joinToken,
            email: obj.email,
            skoolUsername: obj.skoolUsername,
            notificationsConsent: obj.notificationsConsent === 'on',
          }),
        })
      ).user;
      joinToken = null;
      await loadUserProgress();
      history.replaceState(null, '', '/#/home');
      await navigate();
      toast('Добро пожаловать в мастерскую');
    } else if (form.id === 'invite-form') {
      const payload = { label: obj.label, expiresInDays: Number(obj.expiresInDays) };
      if (obj.userId) payload.userId = obj.userId;
      const { invite } = await api('/api/admin/invites', { method: 'POST', body: JSON.stringify(payload) });
      $('#invite-result').innerHTML =
        `<div class="note success">Приглашение создано. Скопируй ссылку сейчас и передай участнику.</div><div class="field" style="margin-top:12px"><label for="invite-link">Персональная ссылка</label><input id="invite-link" readonly value="${esc(invite.url)}"><button type="button" class="btn secondary small" data-action="copy-invite">Копировать ссылку</button></div>`;
    } else if (form.id === 'submission-form') {
      const files = [...$('#submission-files').files];
      if (files.length > 5) throw Error('Можно приложить до 5 файлов.');
      if (
        files.some((f) => f.size > 10 * 1024 * 1024) ||
        files.reduce((n, f) => n + f.size, 0) > 25 * 1024 * 1024
      )
        throw Error('До 10 МБ на файл и 25 МБ суммарно.');
      if (!files.length && !obj.githubUrl) throw Error('Приложи файлы или ссылку на Pull Request.');
      data.delete('files');
      for (const key of [...data.keys()]) if (key.startsWith('file-label-')) data.delete(key);
      files.forEach((f) => data.append('files', f));
      data.set(
        'fileLabels',
        JSON.stringify(files.map((f, i) => $(`[name="file-label-${i}"]`, form)?.value || f.name)),
      );
      await api('/api/submissions', { method: 'POST', body: data });
      closeModal();
      await loadSubmissions();
      if (state.route === 'submissions') render();
      else location.hash = '/submissions';
      toast('Работа отправлена на проверку');
    } else if (form.id === 'review-form') {
      await api(`/api/admin/submissions/${encodeURIComponent(form.dataset.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(obj),
      });
      closeModal();
      await loadSubmissions();
      render();
      toast('Review сохранён');
    } else if (form.id === 'profile-form') {
      state.user = (
        await api('/api/me', {
          method: 'PATCH',
          body: JSON.stringify({ notificationsConsent: obj.notificationsConsent === 'on' }),
        })
      ).user;
      render();
      toast('Настройки сохранены');
    }
  } catch (error) {
    if (err) err.textContent = error.message;
    else toast(error.message);
  } finally {
    if (submit) submit.disabled = false;
  }
}
async function handleAction(e) {
  const b = e.target.closest('[data-action]');
  if (!b) return;
  const id = b.dataset.id;
  try {
    switch (b.dataset.action) {
      case 'menu':
        $('.sidebar').classList.toggle('open');
        break;
      case 'close-modal':
        closeModal();
        break;
      case 'logout':
        if (logoutInProgress) break;
        logoutInProgress = true;
        b.disabled = true;
        try {
          await progressSaveQueue;
          await api('/api/auth/logout', { method: 'POST' });
          state.user = null;
          try {
            state.progress = normalizeProgress(
              JSON.parse(localStorage.getItem('sam-guest-progress') || '{}'),
            );
          } catch {
            state.progress = normalizeProgress({});
          }
          state.submissions = [];
          state.quiz = null;
          state.route = 'home';
          history.replaceState(null, '', '/#/home');
          render();
        } finally {
          logoutInProgress = false;
          b.disabled = false;
        }
        break;
      case 'assignment':
        showAssignment(id);
        break;
      case 'foundation':
        showFoundation(id);
        break;
      case 'complete-assignment':
        state.progress.completed = state.progress.completed.includes(id)
          ? state.progress.completed.filter((x) => x !== id)
          : [...state.progress.completed, id];
        await saveProgress();
        showAssignment(id);
        break;
      case 'submit-assignment':
        submissionForm(id);
        break;
      case 'new-submission':
        submissionForm();
        break;
      case 'resubmit':
        submissionForm(id, b.dataset.parent);
        break;
      case 'view-submission':
        await showSubmission(id);
        break;
      case 'setup-step':
        state.step = Number(b.dataset.index);
        render();
        break;
      case 'copy-code':
        await navigator.clipboard.writeText($('code', b.parentElement).textContent);
        toast('Команда скопирована');
        break;
      case 'quiz-select':
        state.quiz.selected = id;
        render();
        break;
      case 'quiz-check':
        if (state.quiz.selected) recordAnswer(state.quiz.selected);
        break;
      case 'quiz-skip':
        recordAnswer(null);
        break;
      case 'quiz-next':
        if (!state.quiz || state.quiz.answer === undefined) break;
        state.quiz.index++;
        state.quiz.selected = null;
        state.quiz.answer = undefined;
        render();
        window.scrollTo(0, 0);
        break;
      case 'quiz-again': {
        const q = state.quiz;
        state.quiz = {
          level: q.level,
          config: q.config,
          questions: buildSession(state.questions, {
            level: q.level,
            topic: q.config.topic,
            count: Number(q.config.count),
            history: state.progress.history,
            weakOnly: q.config.weakOnly === 'on',
          }),
          index: 0,
          answers: [],
          selected: null,
          answer: undefined,
        };
        render();
        window.scrollTo(0, 0);
        break;
      }
      case 'copy-invite':
        await navigator.clipboard.writeText($('#invite-link').value);
        toast('Ссылка скопирована');
        break;
      case 'revoke-invite':
        await api(`/api/admin/invites/${encodeURIComponent(id)}/revoke`, { method: 'POST' });
        render();
        toast('Приглашение отозвано');
        break;
      case 'jump-chapter':
        document
          .getElementById('af-' + b.dataset.index)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'demo-next':
        state.demoStep = Math.min(state.demoStep + 1, 3);
        $('#agent-demo').innerHTML = renderDemo();
        break;
      case 'demo-reset':
        state.demoStep = 0;
        $('#agent-demo').innerHTML = renderDemo();
        break;
      case 'security-reset':
        security = { ...securityInitial };
        render();
        break;
      case 'refresh':
        await navigate();
        break;
    }
  } catch (error) {
    toast(error.message);
  }
}
function handleChange(e) {
  if (e.target.id === 'quiz-level') {
    state.level = e.target.value;
    render();
  }
  if (e.target.id === 'submission-files') {
    $('#file-labels').innerHTML = [...e.target.files]
      .map(
        (f, i) =>
          `<label class="file-label"><span>${esc(f.name)}</span><input name="file-label-${i}" maxlength="160" placeholder="Подпись: например, Apex и тесты"></label>`,
      )
      .join('');
  }
  if (e.target.dataset.security) {
    security[e.target.dataset.security] = e.target.checked;
    $('#security-result').innerHTML = securityResult();
  }
  if (['review-filter', 'review-level-filter'].includes(e.target.id)) {
    const status = $('#review-filter').value,
      level = $('#review-level-filter').value;
    $('#review-table').innerHTML = submissionTable(
      state.submissions.filter(
        (s) =>
          (status === 'all' || s.status === status) &&
          (level === 'all' ||
            (level === 'agentforce'
              ? s.assignmentId === 'AF-L01'
              : s.assignmentId?.startsWith(ids[level].toUpperCase() + '-'))),
      ),
    );
  }
}
async function loadUserProgress() {
  const remote = normalizeProgress((await api('/api/progress')).progress);
  if (
    !Object.keys(remote.history).length &&
    !remote.completed.length &&
    Object.keys(state.progress.history).length
  ) {
    await saveProgress();
  } else state.progress = remote;
}
async function boot() {
  try {
    const resources = await Promise.all(
      [
        '/data/question-bank.json',
        '/data/assignments.json',
        '/data/curriculum.json',
        '/data/setup-guide.json',
      ].map((url) =>
        fetch(url).then((r) => {
          if (!r.ok) throw Error('Не удалось загрузить учебные материалы');
          return r.json();
        }),
      ),
    );
    const [questions, assignments, curriculum, setup] = resources;
    state.questions = Array.isArray(questions) ? questions : questions.questions;
    state.assignments = Array.isArray(assignments) ? assignments : assignments.assignments;
    state.curriculum = curriculum.courses;
    state.setup = setup;
    const optional = await Promise.all(
      ['/data/agentforce.json', '/data/foundations.json'].map((url) =>
        fetch(url)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ),
    );
    [state.agentforce, state.foundations] = optional;
    try {
      state.progress = normalizeProgress(JSON.parse(localStorage.getItem('sam-guest-progress') || '{}'));
    } catch {
      state.progress = normalizeProgress({});
    }
    state.user = (await api('/api/me')).user;
    if (state.user) await loadUserProgress();
    window.addEventListener('hashchange', navigate);
    document.addEventListener('submit', handleForm);
    document.addEventListener('click', handleAction);
    document.addEventListener('change', handleChange);
    $('#modal').addEventListener('click', (e) => {
      if (e.target === $('#modal')) closeModal();
    });
    await navigate();
  } catch (e) {
    $('#app').innerHTML =
      `<div class="error-page"><h1>Не удалось открыть мастерскую</h1><p>${esc(e.message)}</p><a class="btn" href="/">Обновить страницу</a></div>`;
  }
}
boot();
