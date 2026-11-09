import { buildSession, summarizeAnswers } from './quiz-engine.mjs';
import { renderFullLesson, callout } from './lesson-reader.mjs';

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
  x ? new Date(x).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const levelNames = { junior: 'Junior', middle: 'Middle', senior: 'Senior' };
const levels = Object.keys(levelNames);
const ids = { junior: 'j', middle: 'm', senior: 's' };
const statuses = {
  submitted: 'Submitted',
  in_review: 'In review',
  changes_requested: 'Changes requested',
  accepted: 'Accepted',
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
  lessonId: 'J01',
  lessons: new Map(),
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
  if (!r.ok) throw new Error(payload.error || 'The action could not be completed. Please try again.');
  return payload;
}
function normalizeProgress(p) {
  return {
    history: p?.history || {},
    sessions: p?.sessions || [],
    completed: p?.completed || [],
    lessons: p?.lessons || [],
  };
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
    toast(`Progress has not been saved: ${e.message}`);
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
      if ((state.user?.id || null) === ownerId) toast(`Progress has not been saved: ${e.message}`);
    });
  return progressSaveQueue;
}
const codeBox = (text) =>
  `<div class="codebox"><pre><code>${esc(text)}</code></pre><button class="copy" data-action="copy-code" type="button">Copy</button></div>`;
function openModal(title, content, wide = false) {
  const modal = $('#modal');
  modal.innerHTML = `<div class="modal-head"><h2>${esc(title)}</h2><button class="close" aria-label="Close" data-action="close-modal">×</button></div>${content}`;
  modal.style.maxWidth = wide ? '900px' : '760px';
  if (!modal.open) modal.showModal();
}
function closeModal() {
  $('#modal').close();
}
const navItems = [
  ['home', '◈', 'Overview'],
  ['tracks', '▤', 'Learning paths'],
  ['practice', '⌘', 'Self-check'],
  ['setup', '▣', 'Workspace setup'],
  ['agentforce', '✧', 'Agentforce'],
  ['security', '◇', 'Salesforce access'],
  ['submissions', '↗', 'My submissions'],
];
function shell() {
  const current =
    navItems.find((x) => x[0] === state.route)?.[2] ||
    {
      admin: 'Instructor dashboard',
      profile: 'My profile',
      jobs: 'Job Research',
      lesson: 'Lesson',
      login: 'Sign in',
      join: 'Invitation',
    }[state.route] ||
    'SAM';
  $('#app').innerHTML =
    `<div class="shell"><aside class="sidebar"><a class="brand" href="#/home"><img src="/mark.svg" alt=""><div><b>SAM</b><small>DEVELOPER STUDIO</small></div></a><div class="nav-label">YOUR LEARNING</div><nav class="nav" aria-label="Main navigation">${navItems.map(([id, icon, title]) => `<a href="#/${id}" class="${state.route === id || (id === 'tracks' && state.route === 'lesson' && !state.lessonId.startsWith('JR')) ? 'active' : ''}"><span class="icon" aria-hidden="true">${icon}</span>${title}</a>`).join('')}<div class="nav-label">NEXT STEP</div><a href="#/jobs" class="${state.route === 'jobs' || (state.route === 'lesson' && state.lessonId.startsWith('JR')) ? 'active' : ''}"><span class="icon" aria-hidden="true">⌕</span>Job Research</a>${state.user?.role === 'admin' ? `<a href="#/admin" class="${state.route === 'admin' ? 'active' : ''}"><span class="icon" aria-hidden="true">⊞</span>Instructor</a>` : ''}</nav><div class="sidebar-bottom"><p>Learn from examples.<br>Build. Explain. Improve.</p><a href="https://github.com/stanshaban/salesforce-automation-mastery" target="_blank" rel="noopener noreferrer" class="side-foot">GitHub ↗</a></div></aside><div class="main-shell"><header class="topbar"><button class="mobile-toggle" data-action="menu" aria-label="Open menu">☰</button><div class="breadcrumb">Studio <span aria-hidden="true">/</span> <b>${current}</b></div><div class="account">${state.user ? `<div class="avatar">${esc((state.user.skoolUsername || 'S').slice(0, 2).toUpperCase())}</div><a href="#/profile" class="account-name">${esc(state.user.skoolUsername || state.user.email)}<small>${state.user.role === 'admin' ? 'Instructor' : 'SAM member'}</small></a><button class="text-btn" data-action="logout">Sign out</button>` : `<span class="tag">Guest access</span><a href="#/login" class="text-btn">Sign in</a>`}</div></header><main class="main" id="main" tabindex="-1"></main></div></div>`;
}
function head(kicker, title, description, action = '') {
  return `<div class="page-head"><div><div class="eyebrow">${esc(kicker)}</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${action}</div>`;
}
function footer() {
  return `<footer class="footer"><span>Salesforce Automation Mastery · Learning studio</span><span>Independent community · Not a Salesforce product</span></footer>`;
}
function course(level) {
  return state.curriculum.find((x) => x.id === ids[level]);
}
function lessonCount(level) {
  return course(level)?.modules.reduce((n, m) => n + m.lessons.length, 0) || 0;
}
function trackCards() {
  const descriptions = {
    junior:
      'CRM, Salesforce fundamentals, and your first application. Begin with the people and the problem.',
    middle: 'Integrations, asynchronous Apex, and LWC. Build a feature that works from end to end.',
    senior: 'Performance, access, and architecture. Investigate a failure and justify a solution.',
  };
  return `<div class="grid three">${levels
    .map((level, i) => {
      const labs = state.assignments.filter((a) => a.level === level);
      const done = state.progress.completed.filter((id) => labs.some((a) => a.id === id)).length;
      return `<article class="card track ${level}"><img class="track-cover" src="/course-images/${level}.jpg" alt="" loading="lazy" width="1672" height="941"><div class="track-head"><span class="track-num">LEVEL 0${i + 1}</span><strong>${levelNames[level]}</strong><span class="track-symbol" aria-hidden="true">${['◫', '⌘', '◇'][i]}</span></div><div class="track-body"><p>${descriptions[level]}</p><div class="meta">${lessonCount(level)} lessons · ${labs.length} practical assignments</div><div class="progress-line"><i style="width:${labs.length ? (done / labs.length) * 100 : 0}%"></i></div><small>${done} of ${labs.length} assignments marked complete</small><br><a class="btn" href="#/tracks/${level}">Open learning path <span>↗</span></a></div></article>`;
    })
    .join('')}</div>`;
}
function renderHome() {
  const answered = Object.values(state.progress.history).reduce((n, h) => n + (h.seen || 0), 0);
  const wrong = Object.values(state.progress.history).filter((h) => h.wrong > 0).length;
  return `${head('SALESFORCE AUTOMATION MASTERY', 'Develop your Salesforce skills', 'Clear explanations, practical work, and feedback on your solutions.')}<section class="hero"><div class="hero-content"><div class="eyebrow">PRACTICAL PROJECT</div><h2>Build a dealership<br>assistant with Agentforce</h2><p>Help a salesperson find a vehicle and arrange a test drive. Understand and verify each agent action.</p><a class="btn" href="#/agentforce">Open lesson <span>↗</span></a></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit two"></div><div class="cube"></div><div class="floating one">01 · Customer request</div><div class="floating two">02 · Salesforce action</div><div class="floating three">Example test-drive result</div></div></section><div class="section-title"><h2>Choose your learning path</h2><span>One project. Three levels of depth.</span></div>${trackCards()}<div class="grid two" style="margin-top:24px"><section class="card quiet-card"><div class="quiet-icon">⌘</div><div><h3>Check your understanding</h3><p>Scenarios, code reading, and diagnosis. Sessions rotate questions using your previous answers.</p><div class="stats"><div><strong>${answered}</strong><small>questions attempted</small></div><div><strong>${state.questions.length}</strong><small>question families</small></div></div><br><a class="text-btn" href="#/practice">Start a session →</a>${wrong ? `<p style="margin-top:10px">You have ${wrong} questions to revisit.</p>` : ''}</div></section><section class="card quiet-card"><div class="quiet-icon">▣</div><div><h3>Prepare your workspace</h3><p>VS Code, Salesforce CLI, a learning org, and Git. Find each command and verify its result.</p><a class="text-btn" href="#/setup">Open setup guide →</a><p style="margin-top:20px">Ready for feedback? Submit labelled files or a Pull Request link for review.</p><a class="text-btn" href="#/submissions">My submissions →</a></div></section></div>`;
}
function lessonOutline(l) {
  const done = state.progress.lessons?.includes(l.id);
  return `<details class="lesson-row"><summary><span class="lesson-id">${esc(l.id)}</span>${esc(l.title)}${done ? '<span class="lesson-complete-label">✓ Complete</span>' : ''}</summary><div class="lesson-content"><div class="lesson-preview"><img src="/lesson-images/${esc(l.id)}.jpg" alt="" loading="lazy" width="156" height="88"><div><p>${esc(l.outcome)}</p><a class="btn small" href="#/lesson/${esc(l.id)}">Read lesson →</a></div></div><dl><dt>Independent practice</dt><dd>${esc(l.task)}</dd><dt>Ready when</dt><dd>${esc(l.acceptance)}</dd><dt>Interview discussion</dt><dd>${esc(l.interview)}</dd></dl></div></details>`;
}
async function renderLesson() {
  const id = state.lessonId;
  if (!/^(J\d{2}|M\d{2}|S\d{2}|JR\d{2})$/.test(id)) throw Error('This lesson could not be found.');
  if (!state.lessons.has(id)) state.lessons.set(id, await api('/data/lessons/' + id));
  const lesson = state.lessons.get(id);
  const c = state.curriculum.find((c) => c.modules.some((m) => m.lessons.some((l) => l.id === id)));
  return renderFullLesson(lesson, {
    sequence: c?.modules.flatMap((m) => m.lessons) || [],
    completed: state.progress.lessons?.includes(id),
  });
}

function renderTracks() {
  const c = course(state.level);
  const lessons = (c?.modules || [])
    .map(
      (m, i) =>
        `<div class="section-title"><h2>${i + 1}. ${esc(m.title)}</h2></div><div class="lesson-list">${m.lessons.map(lessonOutline).join('')}</div>`,
    )
    .join('');
  const assignments = state.assignments
    .filter((a) => a.level === state.level)
    .map(
      (a) =>
        `<article class="card assignment"><div class="pillrow"><span class="tag">${esc(a.id)}</span><small>${a.estimatedMinutes} min</small>${state.progress.completed.includes(a.id) ? '<span class="tag green">Complete</span>' : ''}</div><h3>${esc(a.title)}</h3><p>${esc(a.brief)}</p><button class="btn secondary small" data-action="assignment" data-id="${esc(a.id)}">Open assignment →</button></article>`,
    )
    .join('');
  return `${head('LEARNING PATHS', `${levelNames[state.level]} Salesforce Developer`, c?.exit || 'Choose a learning path.')}<div class="pillrow" style="margin-bottom:25px">${levels.map((l) => `<a class="btn ${l === state.level ? '' : 'secondary'}" href="#/tracks/${l}">${levelNames[l]}</a>`).join('')}</div><section class="course-intro card"><img src="/course-images/${state.level}.jpg" alt="${levelNames[state.level]} Salesforce learning path" width="1672" height="941"><div><h2>Before you begin</h2><p>${esc(c?.entry)}</p><h3>Your project</h3><p>${esc(c?.project)}</p><a class="btn small" href="#/lesson/${c?.modules[0]?.lessons[0]?.id}">Start this learning path →</a></div></section><div class="note roadmap-banner">Each lesson includes an explanation, a worked example, practice and answers for self-check. Complete the lessons in order, then submit a level project for instructor review.</div><p class="course-download"><a class="text-btn" href="/lesson-exports/${state.level}-course.md" download>Download all ${levelNames[state.level]} lesson texts ↓</a></p>${lessons}<div class="section-title"><h2>Level project assignments</h2><span>Submit your work for review</span></div><div class="grid two">${assignments}</div>`;
}

function showAssignment(id) {
  const a = state.assignments.find((a) => a.id === id);
  if (!a) return;
  openModal(
    a.title,
    `<div class="pillrow"><span class="tag">${a.id}</span><span class="tag">${levelNames[a.level]}</span><span class="tag">${a.estimatedMinutes} min</span></div><div class="small-copy"><p style="margin-top:20px">${esc(a.brief)}</p><h3>Before you begin</h3>${list(a.prerequisites)}<h3>What to build</h3>${list(a.tasks)}<h3>Acceptance criteria</h3>${list(a.acceptance)}<h3>Check difficult cases</h3>${list(a.failureCases)}<h3>What to submit</h3>${list(a.deliverables)}<h3>Prepare your explanation</h3>${list(a.reviewQuestions)}<div class="note">${esc(typeof a.environment === 'string' ? a.environment : JSON.stringify(a.environment || ''))}</div><p>Starter project: ${external(`https://github.com/stanshaban/salesforce-automation-mastery/tree/main/${a.starterPath || 'starter/salesforce'}`, a.starterPath || 'starter/salesforce')}</p></div><div class="modal-actions"><button class="btn secondary" data-action="complete-assignment" data-id="${a.id}">${state.progress.completed.includes(id) ? 'Unmark complete' : 'Mark complete'}</button><button class="btn" data-action="submit-assignment" data-id="${a.id}">Submit for review</button></div>`,
    true,
  );
}
function renderPractice() {
  const topics = [...new Set(state.questions.filter((q) => q.level === state.level).map((q) => q.topic))];
  return `${head('SELF-CHECK', 'Understand the reasoning', 'Questions and answer order change between sessions. Some variants change the scenario and its correct conclusion.')}<div class="grid two"><section class="card"><h2>New session</h2><form id="quiz-config" class="stack"><div class="field"><label for="quiz-level">Level</label><select id="quiz-level" name="level">${levels.map((l) => `<option value="${l}" ${l === state.level ? 'selected' : ''}>${levelNames[l]}</option>`).join('')}</select></div><div class="field"><label for="quiz-topic">Topic</label><select id="quiz-topic" name="topic"><option value="all">All topics at this level</option>${topics.map((t) => `<option>${esc(t)}</option>`).join('')}</select></div><div class="field"><label for="quiz-count">Question count</label><select id="quiz-count" name="count"><option value="8">8 · short practice</option><option value="15">15 · detailed check</option><option value="25">25 · extended session</option></select></div><label class="check"><input type="checkbox" name="weakOnly">Revisit questions answered incorrectly</label><button class="btn" type="submit">Start a session →</button></form></section><div class="stack"><section class="card"><div class="eyebrow">HOW IT WORKS</div><h3>Answer first, then read the explanation</h3><p class="small-copy muted">Choose an answer and check it. You will see the reasoning, alternative explanations, and a documentation link. A question family appears only once within a session.</p><p class="small-copy muted">A small topic pool produces a shorter session. Review mode uses question families with earlier mistakes; when none exist, it uses the regular pool.</p><div class="note">This is a learning tool. It helps identify gaps but does not certify a professional grade.</div>${!state.user ? '<p class="small-copy muted" style="margin-top:15px">Guest progress is stored in this browser. After invitation sign-in, progress is saved to your profile.</p>' : ''}</section><section class="card"><h3>Recent sessions</h3>${
    state.progress.sessions.length
      ? state.progress.sessions
          .slice(-5)
          .reverse()
          .map(
            (s) =>
              `<div class="history-row"><span>${levelNames[s.level] || s.level} <small>· ${date(s.at)}</small></span><b>${s.correct}/${s.total}</b></div>`,
          )
          .join('')
      : '<p class="muted small-copy">Your session results will appear here.</p>'
  }</section></div></div>`;
}
function renderQuiz() {
  const quiz = state.quiz,
    q = quiz.questions[quiz.index];
  if (!q) return renderQuizResult();
  const answered = quiz.answer !== undefined;
  const correct = quiz.answer === q.correctOptionId;
  return `<div class="quiz-shell"><div class="quiz-top"><a href="#/practice" class="text-btn">← Back to self-check</a><span class="tag">${quiz.index + 1} / ${quiz.questions.length}</span></div><div class="progress-line"><i style="width:${((quiz.index + (answered ? 1 : 0)) / quiz.questions.length) * 100}%"></i></div><section class="card"><div class="pillrow"><span class="tag">${levelNames[quiz.level]}</span><span class="tag">${esc(q.topic)}</span><span class="tag">${{ concept: 'Concept', scenario: 'Scenario', code: 'Code reading', diagnosis: 'Diagnosis' }[q.kind] || 'Question'}</span></div><h1 class="question-title">${esc(q.prompt)}</h1>${q.code ? codeBox(q.code) : ''}<div class="answers">${q.options.map((o, i) => `<button class="answer ${answered ? (o.id === q.correctOptionId ? 'correct' : o.id === quiz.answer ? 'incorrect' : '') : o.id === quiz.selected ? 'selected' : ''}" data-action="quiz-select" data-id="${esc(o.id)}" ${answered ? 'disabled' : ''}><span class="letter">${String.fromCharCode(65 + i)}</span><span>${esc(o.text)}</span></button>`).join('')}</div>${answered ? `<div class="explanation"><strong>${quiz.answer === null ? 'Question skipped' : correct ? 'Correct' : 'Review the reasoning'}</strong><p style="margin:12px 0">${esc(q.explanation)}</p>${(q.whyOthers || []).map((o) => `<p class="small-copy"><b>${esc(q.options.find((x) => x.id === o.id)?.text || o.id)}</b><br>${esc(o.text)}</p>`).join('')}${external(q.sourceUrl, 'Official documentation ↗')}</div><button class="btn" data-action="quiz-next">${quiz.index === quiz.questions.length - 1 ? 'View results' : 'Next question →'}</button>` : `<div class="modal-actions"><button class="text-btn" data-action="quiz-skip">Skip</button><button class="btn" data-action="quiz-check" ${!quiz.selected ? 'disabled' : ''}>Check answer</button></div>`}</section></div>`;
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
  return `<div class="quiz-shell">${head('SESSION RESULTS', 'Choose what to revisit', 'Review the topic results and return to the explanations you need.')}<section class="card"><div class="result-number">${r.correct}<small> / ${r.total}</small></div><p class="muted">Correct answers · skipped ${r.skipped}</p>${r.topics.map((t) => `<div class="topic-result"><span>${esc(t.topic)}</span><b>${t.correct}/${t.total}</b><div class="progress-line"><i style="width:${(t.correct / t.total) * 100}%"></i></div></div>`).join('')}<div class="modal-actions"><a href="#/practice" class="btn secondary">Configure a session</a><button class="btn" data-action="quiz-again">New question set →</button></div></section><div class="section-title"><h2>Review this session</h2></div>${q.answers.map((a) => `<details class="lesson-row" style="margin-bottom:10px"><summary><span>${a.skipped ? '○' : a.selectedOptionId === a.question.correctOptionId ? '✓' : '↻'}</span>${esc(a.question.title || a.question.prompt)}</summary><div class="lesson-content"><p>${esc(a.question.prompt)}</p><p><b>Correct answer:</b> ${esc(a.question.options.find((o) => o.id === a.question.correctOptionId)?.text)}</p><p>${esc(a.question.explanation)}</p>${external(a.question.sourceUrl, 'Source')}</div></details>`).join('')}</div>`;
}
function vscode(step) {
  const zone = step.visual?.zone;
  return `<div class="vscode" aria-label="Illustrated Visual Studio Code workspace"><div class="vscode-bar"><i></i><i></i><i></i><span>sam-training — Visual Studio Code</span></div><div class="vs-window"><div class="vs-activity ${zone === 'source-control' ? 'highlight' : ''}">▣<br>⌕<br>⑂<br>⊞</div><div class="vs-explorer ${zone === 'sidebar' ? 'highlight' : ''}">EXPLORER<br>⌄ salesforce<br>　⌄ force-app<br>　　⌄ main<br>　　　default<br>　sfdx-project.json</div><div class="vs-code ${zone === 'editor' ? 'highlight' : ''}"><span style="color:#668096">1　</span>{<br><span style="color:#668096">2　</span>　<em>"packageDirectories"</em>: [<br><span style="color:#668096">3　</span>　　{ "path": "force-app" }<br><span style="color:#668096">4　</span>　],<br><span style="color:#668096">5　</span>　<em>"sourceApiVersion"</em>: "68.0"<br><span style="color:#668096">6　</span>}</div><div class="vs-terminal ${zone === 'terminal' ? 'highlight' : ''}">TERMINAL　 PROBLEMS　 OUTPUT<br>$ sf org list<br><span style="color:#a8cdb6">sam-training　 Connected</span></div>${zone === 'palette' ? '<div class="vs-palette highlight">&gt; SFDX: Authorize an Org<br><br>SFDX: Open Default Org</div>' : ''}</div><div class="vs-status ${zone === 'status' ? 'highlight' : ''}"><span>⑂ main　 ○ 0　△ 0</span><span>sam-training　 Salesforce</span></div><div class="vs-caption">Interface guide · ${esc(step.visual?.caption || '')}</div></div>`;
}
function renderSetup() {
  if (!state.setup) return '<p>The setup guide is unavailable.</p>';
  const step = state.setup.steps[state.step];
  return `${head('WORKSPACE SETUP', 'Develop with Visual Studio Code', state.setup.introduction)}<div class="guide-layout"><nav class="steps-nav" aria-label="Setup steps">${state.setup.steps.map((s, i) => `<button class="step-button ${i === state.step ? 'active' : ''}" data-action="setup-step" data-index="${i}"><b>${String(i + 1).padStart(2, '0')}</b>${esc(s.title)}</button>`).join('')}</nav><section class="card"><div class="eyebrow">STEP ${state.step + 1} / ${state.setup.steps.length}</div><h2>${esc(step.title)}</h2><p class="small-copy">${esc(step.explanation)}</p>${vscode(step)}<div class="small-copy"><h3>Follow these steps</h3><ol>${step.actions.map((a) => `<li>${esc(a)}</li>`).join('')}</ol>${(step.commands || []).map((c) => `<p><b>${esc(c.label)}</b> <span class="tag">${esc(c.platform || '')}</span></p>${codeBox(c.command)}`).join('')}<div class="note success"><b>Verify the result</b><br>${esc(step.verify)}</div><br><div class="note warn"><b>Common mistake</b><br>${esc(step.commonMistake)}</div><h3>Official instructions</h3><ul>${(step.sourceUrls || []).map((url, i) => `<li>${external(url, `Source ${i + 1} · ${new URL(url).hostname}`)}</li>`).join('')}</ul><p class="muted">A video for this step is planned. The written instructions are available now.</p></div><div class="modal-actions"><button class="btn secondary" data-action="setup-step" data-index="${Math.max(0, state.step - 1)}" ${state.step === 0 ? 'disabled' : ''}>Back</button><button class="btn" data-action="setup-step" data-index="${Math.min(state.setup.steps.length - 1, state.step + 1)}" ${state.step === state.setup.steps.length - 1 ? 'disabled' : ''}>Next step →</button></div></section></div>`;
}
function renderLogin() {
  return `<div class="auth-panel card"><div class="eyebrow">SAM ACCESS</div><h1>Instructor sign-in</h1><p class="muted small-copy">Members use a personal invitation from the instructor. Redeem the link once; this browser then keeps your session.</p><form id="admin-login" class="stack"><div class="field"><label for="login-email">Email</label><input id="login-email" name="email" type="email" required autocomplete="username"></div><div class="field"><label for="login-password">Instructor password</label><input id="login-password" name="password" type="password" required autocomplete="current-password"></div><div class="form-error" role="alert"></div><button class="btn">Sign in</button></form><p class="consent-info" style="margin-top:20px">Lost member access? Ask the instructor for a new sign-in link tied to your existing profile.</p></div>`;
}
function renderJoin() {
  if (!joinToken)
    return `<div class="auth-panel card"><h1>An invitation link is required</h1><p class="muted">Open the personal link supplied by your instructor. It can be used only once.</p><a class="btn" href="#/home">Open the studio</a></div>`;
  return `<div class="auth-panel card"><div class="eyebrow">YOUR SALESFORCE STUDIO</div><h1>Welcome to SAM</h1><p class="muted small-copy">Enter the details that identify you in the community. The instructor sees them alongside your submissions.</p><form id="join-form" class="stack"><div class="field"><label for="join-email">Your email</label><input id="join-email" name="email" type="email" required autocomplete="email"></div><div class="field"><label for="join-skool">Skool username</label><input id="join-skool" name="skoolUsername" required maxlength="80" placeholder="For example, alex-developer"></div><label class="check"><input name="notificationsConsent" type="checkbox">I agree to receive email updates about reviews and changes to my submission status.</label><p class="consent-info">Consent is optional and can be withdrawn in your profile. Email delivery is not connected; review results appear in your account. Your email address is stored without verification.</p><div class="form-error" role="alert"></div><button class="btn">Join with invitation →</button></form></div>`;
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
  return `${head('PRACTICE AND FEEDBACK', state.user?.role === 'admin' ? 'Member submissions' : 'My submissions', 'Submit a solution, explain your approach, and improve it after review.', state.user ? '<button class="btn" data-action="new-submission">Submit work ↗</button>' : '')}<div class="note" style="margin-bottom:22px">Attach project files or a GitHub Pull Request link. Portal submissions and feedback are visible only to their author and the instructor.</div>${!state.user ? '<section class="card empty"><div class="icon">↗</div><h3>Sign in with an invitation</h3><p>Your submissions and instructor feedback will appear here after sign-in.</p><a class="btn secondary" href="#/login">How to sign in</a></section>' : submissionTable(state.submissions)}`;
}
function submissionTable(items) {
  return `<section class="card">${items.length ? `<div class="table-wrap"><table><thead><tr><th>Submission</th>${state.user.role === 'admin' ? '<th>Member</th>' : ''}<th>Status</th><th>Submitted</th></tr></thead><tbody>${items.map((s) => `<tr><td><button class="table-button" data-action="view-submission" data-id="${esc(s.id)}">${esc(s.title)}</button><div class="muted" style="margin-top:6px">${esc(s.assignmentId)}</div></td>${state.user.role === 'admin' ? `<td>${esc(s.user?.skoolUsername || '')}<br><small>${esc(s.user?.email || '')}</small></td>` : ''}<td>${statusTag(s.status)}</td><td>${date(s.createdAt)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty"><h3>No submissions yet</h3><p>Choose an assignment and submit your first solution.</p><a class="btn secondary" href="#/tracks/junior">Choose an assignment</a></div>'}</section>`;
}
function submissionForm(assignmentId = '', parentId = '') {
  if (!state.user) {
    closeModal();
    location.hash = '/login';
    return;
  }
  openModal(
    'Submit work',
    `<form id="submission-form" class="stack"><input name="parentId" type="hidden" value="${esc(parentId)}"><div class="field"><label for="submission-assignment">Assignment</label><select id="submission-assignment" name="assignmentId" required><option value="">Choose an assignment</option>${state.assignments.map((a) => `<option value="${a.id}" ${a.id === assignmentId ? 'selected' : ''}>${a.id} · ${esc(a.title)}</option>`).join('')}<option value="AF-L01" ${assignmentId === 'AF-L01' ? 'selected' : ''}>AF-L01 · Test-drive assistant</option></select></div><div class="field"><label for="submission-title">Submission title</label><input id="submission-title" name="title" maxlength="160" required placeholder="For example, test-drive request — first version"></div><div class="field"><label for="submission-description">What you built and how to verify it</label><textarea id="submission-description" name="description" required maxlength="7500" placeholder="Describe the solution, verification steps, test results, and questions for the instructor."></textarea></div><div class="field"><label for="submission-github">GitHub Pull Request link — optional</label><input id="submission-github" name="githubUrl" type="url" placeholder="https://github.com/username/repository/pull/1"></div><div class="field"><label for="submission-files">Solution files</label><input id="submission-files" name="files" type="file" multiple accept=".zip,.cls,.trigger,.js,.html,.css,.xml,.json,.md,.txt,.pdf,.png,.jpg,.jpeg,.webp,.csv"><small>Up to 5 files, 10 MB each and 25 MB total. Add files or a PR link.</small><div id="file-labels"></div></div><div class="note">Submit learning metadata and synthetic data only. Exclude passwords, tokens, and customer information.</div><div class="form-error" role="alert"></div><button class="btn">Send for review</button></form>`,
  );
}
async function showSubmission(id) {
  try {
    const s = (await api(`/api/submissions/${encodeURIComponent(id)}`)).submission;
    openModal(
      s.title,
      `<div class="sub-meta">${statusTag(s.status)}<span>${esc(s.assignmentId)}</span><span>${date(s.createdAt)}</span>${s.parentId ? '<span>Revised submission</span>' : ''}</div>${state.user.role === 'admin' ? `<div class="note">${esc(s.user?.skoolUsername)} · ${esc(s.user?.email)}</div><br>` : ''}<p class="small-copy" style="white-space:pre-wrap">${esc(s.description)}</p>${s.githubUrl ? `<p>${external(s.githubUrl, 'Open GitHub Pull Request ↗')}</p>` : ''}<h3>Files</h3>${(s.files || []).map((f) => `<div class="file-row"><span>↧</span><a href="/api/files/${encodeURIComponent(f.id)}">${esc(f.label || f.originalName)}</a><small>${esc(f.originalName)} · ${(f.size / 1024).toFixed(1)} KB</small></div>`).join('') || '<p class="muted small-copy">The solution is provided through the linked repository.</p>'}<h3 style="margin-top:25px">Feedback</h3>${s.feedback ? `<div class="feedback">${esc(s.feedback)}</div>` : '<p class="muted small-copy">The instructor has not added feedback yet.</p>'}${
        state.user.role === 'admin'
          ? `<form id="review-form" class="stack" data-id="${esc(s.id)}" style="margin-top:24px"><div class="field"><label for="review-status">Review status</label><select id="review-status" name="status">${Object.entries(
              statuses,
            )
              .map(
                ([key, label]) =>
                  `<option value="${key}" ${s.status === key ? 'selected' : ''}>${label}</option>`,
              )
              .join(
                '',
              )}</select></div><div class="field"><label for="review-feedback">Feedback for the member</label><textarea id="review-feedback" name="feedback" maxlength="20000" placeholder="Explain what works, what to change, and how to verify the correction.">${esc(s.feedback || '')}</textarea></div><div class="form-error" role="alert"></div><button class="btn">Save review</button></form>`
          : `<div class="modal-actions"><button class="btn" data-action="resubmit" data-id="${esc(s.assignmentId)}" data-parent="${esc(s.id)}">Submit a new version</button></div>`
      }`,
      true,
    );
  } catch (e) {
    toast(e.message);
  }
}
function inviteHistory(items) {
  return items.length
    ? items
        .slice(0, 8)
        .map(
          (i) =>
            `<div class="history-row"><div><b>${esc(i.label || 'No label')}</b><br><small>until ${date(i.expiresAt)}</small></div>${i.usedAt ? '<span class="tag green">Used</span>' : i.revokedAt ? '<span class="tag">Revoked</span>' : new Date(i.expiresAt) < new Date() ? '<span class="tag">Expired</span>' : `<button class="text-btn" data-action="revoke-invite" data-id="${esc(i.id)}">Revoke</button>`}</div>`,
        )
        .join('')
    : '<p class="muted small-copy">No invitations yet.</p>';
}
async function renderAdmin() {
  if (state.user?.role !== 'admin') return renderLogin();
  const [users, invites] = await Promise.all([api('/api/admin/users'), api('/api/admin/invites')]);
  return `${head('INSTRUCTOR DASHBOARD', 'Members and reviews', 'Create invitations, inspect solutions, and leave feedback for members.')}<div class="grid two"><section class="card"><h2>New invitation</h2><form id="invite-form" class="stack"><div class="field"><label for="invite-label">Private label</label><input id="invite-label" name="label" maxlength="100" placeholder="For example, member from Skool"></div><div class="field"><label for="invite-user">Link recipient</label><select id="invite-user" name="userId"><option value="">New member</option>${users.users
    .filter((u) => u.role !== 'admin')
    .map(
      (u) =>
        `<option value="${esc(u.id)}">Returning member: ${esc(u.skoolUsername)} · ${esc(u.email)}</option>`,
    )
    .join(
      '',
    )}</select></div><div class="field"><label for="invite-expiry">Valid for</label><select id="invite-expiry" name="expiresInDays"><option value="7">7 days</option><option value="30">30 days</option><option value="1">1 day</option></select></div><div class="form-error" role="alert"></div><button class="btn">Create personal link</button><div id="invite-result"></div></form></section><section class="card"><h2>Issued invitations</h2><p class="small-copy muted">Each link can be used once. For a returning member, select the existing profile. Members do not need the instructor password.</p><div id="invite-history">${inviteHistory(
    invites.invites,
  )}</div></section></div><div class="section-title"><h2>Review queue</h2><span>${state.submissions.length} submissions</span></div><div class="filters"><div class="field"><label for="review-filter">Status</label><select id="review-filter"><option value="all">All submissions</option>${Object.entries(
    statuses,
  )
    .map(([k, v]) => `<option value="${k}">${v}</option>`)
    .join(
      '',
    )}</select></div><div class="field"><label for="review-level-filter">Level</label><select id="review-level-filter"><option value="all">All levels</option>${levels.map((l) => `<option value="${l}">${levelNames[l]}</option>`).join('')}<option value="agentforce">Agentforce</option></select></div></div><div id="review-table">${submissionTable(state.submissions)}</div><div class="section-title"><h2>Members</h2><span>${users.users.filter((u) => u.role !== 'admin').length} profiles</span></div><section class="card table-wrap"><table><thead><tr><th>Skool username</th><th>Email</th><th>Notifications</th></tr></thead><tbody>${
    users.users
      .filter((u) => u.role !== 'admin')
      .map(
        (u) =>
          `<tr><td>${esc(u.skoolUsername)}</td><td>${esc(u.email)}<br><small>Address supplied by the member</small></td><td>${u.notificationsConsent ? '<span class="tag green">Consent given</span>' : '<span class="tag">No notifications</span>'}</td></tr>`,
      )
      .join('') || '<tr><td colspan="3" class="muted">No members yet.</td></tr>'
  }</tbody></table></section>`;
}
function renderProfile() {
  if (!state.user) return renderLogin();
  return `${head('PROFILE', 'Your details and preferences', 'These details help the instructor match a submission to a community member.')}<section class="card balance"><p><b>Skool username</b><br>${esc(state.user.skoolUsername)}</p><p><b>Email</b><br>${esc(state.user.email)}</p><p class="consent-info">This address was supplied by the user and has not been verified by email.</p><form id="profile-form"><label class="check"><input type="checkbox" name="notificationsConsent" ${state.user.notificationsConsent ? 'checked' : ''}>I agree to receive updates about my submissions and reviews.</label><p class="consent-info">Email delivery is not connected. This preference records consent for future notifications. Declining does not restrict learning or review access.</p><div class="form-error" role="alert"></div><button class="btn">Save preferences</button></form></section>`;
}
function renderJobs() {
  const c = state.curriculum.find((c) => c.id === 'jobs');
  return `${head('JOB SEARCH PREPARATION', 'Salesforce Developer Job Research', 'Build a focused search process, an evidence-based CV, and an interview preparation routine.')}<img class="jobs-course-cover" src="/course-images/jobs.jpg" alt="Preparing a portfolio and a focused job search" width="1672" height="941"><div class="note">Read the lessons, build your job-search materials and practise answering interview questions with evidence from your own work.</div><p class="course-download"><a class="text-btn" href="/lesson-exports/jobs-course.md" download>Download all Job Research lesson texts ↓</a></p>${(c?.modules || []).map((m) => `<div class="section-title"><h2>${esc(m.title)}</h2></div><div class="lesson-list">${m.lessons.map(lessonOutline).join('')}</div>`).join('')}`;
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
      'Object',
      object,
      'Object Read is required. Permissions add together; muting affects only its own permission set group.',
    ],
    ['Record', record, 'This example uses Private OWD. One qualifying record-access path is enough.'],
    [
      'Restriction Rule',
      !security.restriction,
      'An applicable restriction additionally filters out an otherwise accessible record.',
    ],
    [
      'Field',
      visible && security.field,
      'The field is visible when the record is accessible and the user has field Read.',
    ],
  ];
  return `${gates.map(([title, on, desc]) => `<div class="security-gate ${on ? 'on' : 'off'}"><i>${on ? '✓' : '×'}</i><div><b>${title}</b><p>${desc}</p></div></div>`).join('')}<div class="note ${visible ? 'success' : 'warn'}"><b>${visible ? 'Record accessible' : 'Record not visible'}</b><br>${visible ? (security.field ? 'Scheduled_At__c is visible.' : 'The record opens, but Scheduled_At__c is hidden.') : 'Field permission alone does not open the record.'}</div>`;
}
function renderSecurity() {
  return `${head('INTERACTIVE MODEL', 'Object, record, and field access', 'Change the conditions and inspect why the user can or cannot see the information.')}<div class="note" style="margin-bottom:24px">Simplified example: a user opens Test_Drive__c through the interface with Private OWD and no View All or Modify All grants. Other profile grants are outside this model. Restriction Rule support varies by object and edition. This illustration does not calculate permissions in a real org.</div><div class="security-layout"><section class="card"><h2>User conditions</h2>${[
    ['object', 'The license permits access to the object'],
    ['groupGrant', 'A Permission Set in the group grants Read'],
    ['mute', 'Muting in that group removes its Read grant'],
    ['directGrant', 'A separate Permission Set grants Read'],
    ['owner', 'The user owns the record'],
    ['role', 'The role hierarchy grants access'],
    ['sharing', 'Sharing grants access to the record'],
    ['restriction', 'A Restriction Rule excludes this record'],
    ['field', 'Read is granted on Scheduled_At__c'],
  ]
    .map(
      ([key, label]) =>
        `<label class="check check-group"><input type="checkbox" data-security="${key}" ${security[key] ? 'checked' : ''}>${label}</label>`,
    )
    .join(
      '',
    )}<button class="btn secondary small" data-action="security-reset">Reset example</button></section><section class="card"><h2>Resulting access</h2><div id="security-result">${securityResult()}</div><div class="small-copy"><h3>Try these changes</h3><ol><li>Enable muting: the group Read grant disappears.</li><li>Add a separate Permission Set: Read becomes available again.</li><li>Remove every record-access path: object permission alone does not open the record.</li><li>Enable the Restriction Rule and inspect the result.</li></ol><p>${external('https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/security_data_access.htm', 'Salesforce access model ↗')}</p></div></section></div>`;
}
function renderAgentforce() {
  const a = state.agentforce;
  return `${head('PRACTICAL LESSON', 'Agentforce for a dealership', 'Understand the CRM process, build agent actions, and verify a test-drive booking in a learning org.')}<img class="lesson-cover" src="/lesson-images/AF-L01.jpg" alt="A dealership assistant coordinating vehicle search, confirmation, and an appointment record" width="1672" height="941" fetchpriority="high"><section class="agent-hero"><div><div class="eyebrow">NORTHSTAR MOTORS</div><h2>The salesperson helps the customer.<br>The agent performs CRM actions.</h2><p class="small-copy">Northstar Motors is a fictional dealership. A salesperson uses an internal Employee Agent in Salesforce to find options, confirm an appointment, and inspect the created record. The customer does not sign in to the CRM.</p><div class="pillrow"><span class="tag">Guided project</span><span class="tag">Apex + Agentforce</span><span class="tag">Verify the outcome</span></div></div><div><h3>What you will build</h3><ol class="small-copy"><li>Find suitable vehicles.</li><li>Offer an option to the customer.</li><li>Obtain confirmation from the salesperson.</li><li>Create the appointment and return its number.</li></ol><button class="btn" data-action="submit-assignment" data-id="AF-L01">Submit the project for review</button></div></section><section class="card"><div class="section-title" style="margin-top:0"><h2>Preview the scenario before building</h2><span class="tag">Learning simulation</span></div><p class="small-copy muted">This interactive illustration uses fixed responses. It does not connect to Salesforce or call AI. You will build the real agent in your own learning org using the lesson below.</p><div id="agent-demo">${renderDemo()}</div></section>${a ? renderStructuredLesson(a) : '<div class="note" style="margin-top:20px">The lesson could not be loaded. Refresh the page to try again.</div>'}`;
}
function renderDemo() {
  const n = state.demoStep;
  return `<div class="flow-map">${['Request', 'Agent instructions', 'Apex action', 'Salesforce record'].map((x, i) => `${i ? '<span class="flow-arrow">→</span>' : ''}<div class="flow-node ${Math.min(n, 3) === i ? 'active' : ''}">${x}</div>`).join('')}</div><div class="grid two"><div class="chat-demo"><div class="chat-head">Northstar Assistant · salesperson and internal agent</div><div class="chat-lines"><div class="bubble user">A customer wants to try a family car. Find the available learning test-drive options.</div><div class="bubble">${['Start with the available vehicles. Use the button to simulate the search action.', 'The learning catalogue contains City EV. A sample slot is available tomorrow at 14:00 UTC. Confirm the appointment?', 'Before creating the record, the action checks the vehicle, slot, and duplicate booking key.', 'Simulated result: TD-00042, City EV, tomorrow at 14:00 UTC. No Salesforce record was created by this preview.'][n]}</div></div><div class="demo-actions">${n < 3 ? `<button class="btn small" data-action="demo-next">${['Find vehicles', 'Confirm appointment', 'Show result'][n]}</button>` : ''}<button class="btn secondary small" data-action="demo-reset">Restart preview</button></div></div><div class="card" style="background:#f7faf8"><h3>What the example represents</h3><div class="audit-row"><b>Request</b><span>The salesperson describes the customer request in ordinary language.</span></div>${n >= 1 ? '<div class="audit-row"><b>Search</b><span>The agent selects an allowed action. Apex returns the catalogue result.</span></div>' : ''}${n >= 2 ? '<div class="audit-row"><b>Confirmation</b><span>The salesperson confirms the arrangement agreed with the customer. The write action can now proceed.</span></div>' : ''}${n >= 3 ? '<div class="audit-row"><b>Result</b><span>The diagram represents a Test_Drive__c record. In the actual learning org, verify the created record separately.</span></div>' : ''}</div></div>`;
}
function renderStructuredLesson(a) {
  const chapters = a.chapters || a.modules || a.sections || [];
  return `<div class="section-title"><h2>${esc(a.title || 'Instructions')}</h2><span class="tag">About ${Math.round((a.estimatedMinutes || 300) / 60)} hours</span></div><div class="note" style="margin-bottom:20px">${esc(a.status || '')}</div><section class="card small-copy"><h3>Before you begin</h3>${list(a.prerequisites)}${a.environment ? `<h3>Learning environment</h3><p>${esc(a.environment.recommended)}</p><p>${external(a.environment.signupUrl, 'Create the required learning org ↗')}</p>${list(a.environment.requirements)}<details class="lesson-row"><summary>Environment capabilities and limits</summary><div class="lesson-content">${list(a.environment.limitations)}<p>${esc(a.environment.actualVerification)}</p></div></details>` : ''}<p><a href="/lesson-exports/AF-L01.md" download>Download lesson text ↓</a></p><p>${external('https://github.com/stanshaban/salesforce-automation-mastery/tree/main/starter/agentforce', 'Apex source and tests ↗')} · ${external('https://github.com/stanshaban/salesforce-automation-mastery/blob/main/docs/agentforce-lesson.md', 'Full lesson text on GitHub ↗')}</p></section><div class="section-title"><h2>Project sequence</h2></div><div class="pillrow">${chapters.map((c, i) => `<button class="btn secondary small" data-action="jump-chapter" data-index="${i}">${i + 1}. ${esc(c.title)}</button>`).join('')}</div>${a.glossary ? `<details class="lesson-row" style="margin-top:20px"><summary>Glossary: new terms explained</summary><div class="lesson-content"><dl>${a.glossary.map((t) => `<dt>${esc(t.term)}</dt><dd>${esc(t.meaning)}<br><small>${esc(t.example)}</small></dd>`).join('')}</dl></div></details>` : ''}${a.dataModel ? `<section class="card small-copy" style="margin-top:20px"><h3>Project data model</h3><div class="table-wrap"><table><thead><tr><th>Object</th><th>Information</th><th>Purpose</th></tr></thead><tbody>${a.dataModel.map((d) => `<tr><td><b>${esc(d.object)}</b><br><small>${esc(d.source)}</small></td><td>${esc(d.fields)}</td><td>${esc(d.purpose)}</td></tr>`).join('')}</tbody></table></div></section>` : ''}${chapters.map((ch, i) => `<section class="card chapter small-copy" style="margin-top:20px" id="af-${i}"><div class="eyebrow">PART ${i + 1}</div><h2>${esc(ch.title)}</h2>${renderLessonBlock(ch)}</section>`).join('')}${a.systemInstructions ? `<section class="card small-copy" style="margin-top:20px"><h2>Agent instructions</h2><p>Use these instructions after preparing and checking the lesson actions.</p>${codeBox(a.systemInstructions)}</section>` : ''}${a.actionContracts ? `<section class="card small-copy" style="margin-top:20px"><h2>Action inputs and results</h2>${a.actionContracts.map((c) => `<details class="lesson-row" style="margin-bottom:12px"><summary>${esc(c.name)}</summary><div class="lesson-content"><p>${esc(c.implementation)}</p><p><b>Changes data:</b> ${c.mutatesData ? 'Yes' : 'No'} · <b>Confirmation:</b> ${c.requiresConfirmation ? 'Required' : 'Not required'}</p><h3>Input parameters</h3>${list((c.inputs || []).map((i) => `${i.name} (${i.type}) — ${i.meaning}${i.required ? ' · required' : ''}`))}<h3>Output values</h3>${list(c.outputs)}<h3>Result codes</h3>${list(c.resultCodes)}${c.limitations ? callout('warning', c.limitations) : ''}${c.sourcePath ? `<p>${external('https://github.com/stanshaban/salesforce-automation-mastery/blob/main/' + c.sourcePath, 'Open source ↗')}</p>` : ''}</div></details>`).join('')}</section>` : ''}${a.testScenarios ? `<section class="card small-copy" style="margin-top:20px"><h2>Test your agent</h2><p>Run each scenario in the learning org and record the actual result. If your environment cannot support a check, explain why it was not performed.</p>${a.testScenarios.map((t) => `<details class="lesson-row" style="margin-bottom:10px"><summary><span class="lesson-id">${esc(t.id)}</span>${esc(t.title)}</summary><div class="lesson-content"><p><b>Setup:</b> ${esc(t.setup)}</p><p><b>Request:</b> ${esc(t.prompt)}</p><p><b>Expected result:</b> ${esc(t.expected)}</p><p><b>Evidence:</b> ${esc(t.evidence)}</p></div></details>`).join('')}</section>` : ''}<section class="card small-copy" style="margin-top:20px"><h2>Prepare your submission</h2>${list(a.deliverables)}<button class="btn" data-action="submit-assignment" data-id="AF-L01">Submit Agentforce project</button></section>${a.sourceUrls ? `<details class="lesson-row" style="margin-top:20px"><summary>Official sources · checked ${esc(a.checkedAt)}</summary><div class="lesson-content">${listLinks(a.sourceUrls)}</div></details>` : ''}`;
}
function listLinks(urls) {
  return `<ul>${urls.map((s, i) => `<li>${external(typeof s === 'string' ? s : s.url, typeof s === 'string' ? `Source ${i + 1} · ${new URL(s).hostname}` : s.title || s.url)}</li>`).join('')}</ul>`;
}
function renderLessonBlock(ch) {
  let out = '';
  if (ch.goal) out += callout('idea', ch.goal);
  for (const key of ['context', 'explanation', 'content', 'outcome', 'environment']) {
    if (ch[key]) out += `<p>${esc(ch[key])}</p>`;
  }
  if (ch.paragraphs) out += ch.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
  if (ch.terms)
    out += `<dl>${ch.terms.map((t) => `<dt><b>${esc(t.term)}</b></dt><dd>${esc(t.definition)}</dd>`).join('')}</dl>`;
  if (ch.steps?.length) {
    out += callout(
      'action',
      'Work through the steps in your learning org. Check each expected result before continuing.',
    );
    out += `<ol>${ch.steps.map((s) => `<li>${typeof s === 'string' ? esc(s) : `<b>${esc(s.title || s.label || '')}</b>${s.text ? `<p>${esc(s.text)}</p>` : ''}${s.detail ? `<p>${esc(s.detail)}</p>` : ''}${s.instruction ? `<p>${esc(s.instruction)}</p>` : ''}${s.description ? `<p>${esc(s.description)}</p>` : ''}${s.commands ? (Array.isArray(s.commands) ? s.commands.map((c) => codeBox(typeof c === 'string' ? c : c.command)).join('') : codeBox(s.commands)) : ''}${s.code ? codeBox(s.code) : ''}${s.expected ? `<div class="note success">${esc(s.expected)}</div>` : ''}`}</li>`).join('')}</ol>`;
  }
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
    ['tasks', 'Practice'],
    ['acceptance', 'Verify the outcome'],
    ['expectedResults', 'Expected result'],
    ['questions', 'Check your understanding'],
  ])
    if (ch[key])
      out += `<h3>${title}</h3>${Array.isArray(ch[key]) ? list(ch[key]) : `<p>${esc(ch[key])}</p>`}`;
  if (ch.commonFailures) {
    const failures = Array.isArray(ch.commonFailures) ? ch.commonFailures : [ch.commonFailures];
    if (failures.length) out += callout('warning', failures[0]);
    if (failures.length > 1) out += list(failures.slice(1));
  }
  if (ch.checkpoint) out += callout('check', ch.checkpoint);
  if (ch.sourceUrls) out += listLinks(ch.sourceUrls);
  return out;
}
function showFoundation(id) {
  location.hash = '#/lesson/' + id;
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
      lesson: renderLesson,
    };
    content = state.route === 'admin' ? await renderAdmin() : await (renders[state.route] || renderHome)();
  } catch (e) {
    content = `<section class="card"><h2>This section could not be opened</h2><p>${esc(e.message)}</p><button class="btn" data-action="refresh">Try again</button></section>`;
  }
  if (version !== renderVersion) return;
  $('#main').innerHTML = content + footer();
  document.title =
    state.route === 'lesson'
      ? `${state.lessons.get(state.lessonId)?.title || 'Lesson'} · SAM`
      : `${{ home: 'Studio', tracks: levelNames[state.level], practice: 'Self-check', agentforce: 'Agentforce', setup: 'VS Code', admin: 'Instructor' }[state.route] || 'Portal'} · SAM`;
}
async function navigate() {
  closeModal();
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  state.route = location.pathname === '/join' && !parts[0] ? 'join' : parts[0] || 'home';
  if (levels.includes(parts[1])) state.level = parts[1];
  if (state.route === 'lesson') state.lessonId = parts[1] || 'J01';
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
      if (!qs.length) throw Error('There are no questions for this topic yet. Choose another topic.');
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
      toast('Welcome to the studio');
    } else if (form.id === 'invite-form') {
      const payload = { label: obj.label, expiresInDays: Number(obj.expiresInDays) };
      if (obj.userId) payload.userId = obj.userId;
      const { invite } = await api('/api/admin/invites', { method: 'POST', body: JSON.stringify(payload) });
      $('#invite-result').innerHTML =
        `<div class="note success">Invitation created. Copy the link now and share it privately with the intended member.</div><div class="field" style="margin-top:12px"><label for="invite-link">Personal link</label><input id="invite-link" readonly value="${esc(invite.url)}"><button type="button" class="btn secondary small" data-action="copy-invite">Copy link</button></div>`;
      const refreshed = await api('/api/admin/invites');
      $('#invite-history').innerHTML = inviteHistory(refreshed.invites);
    } else if (form.id === 'submission-form') {
      const files = [...$('#submission-files').files];
      if (files.length > 5) throw Error('You can attach up to 5 files.');
      if (
        files.some((f) => f.size > 10 * 1024 * 1024) ||
        files.reduce((n, f) => n + f.size, 0) > 25 * 1024 * 1024
      )
        throw Error('Each file can be up to 10 MB, with 25 MB in total.');
      if (!files.length && !obj.githubUrl) throw Error('Attach files or add a Pull Request link.');
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
      toast('Submission sent for review');
    } else if (form.id === 'review-form') {
      await api(`/api/admin/submissions/${encodeURIComponent(form.dataset.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(obj),
      });
      closeModal();
      await loadSubmissions();
      render();
      toast('Review saved');
    } else if (form.id === 'profile-form') {
      state.user = (
        await api('/api/me', {
          method: 'PATCH',
          body: JSON.stringify({ notificationsConsent: obj.notificationsConsent === 'on' }),
        })
      ).user;
      render();
      toast('Preferences saved');
    }
  } catch (error) {
    if (err) err.textContent = error.message;
    else toast(error.message);
  } finally {
    if (submit) submit.disabled = false;
  }
}
async function handleAction(e) {
  if (e.target.closest('.skip')) {
    e.preventDefault();
    $('#main')?.focus();
    return;
  }
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
      case 'lesson-section': {
        const heading = document.querySelector(`#section-${b.dataset.index} h2`);
        heading?.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
        heading?.focus({ preventScroll: true });
        break;
      }
      case 'complete-lesson': {
        const done = state.progress.lessons || [];
        state.progress.lessons = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
        saveProgress();
        render();
        break;
      }
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
        toast('Command copied');
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
        toast('Link copied');
        break;
      case 'revoke-invite':
        await api(`/api/admin/invites/${encodeURIComponent(id)}/revoke`, { method: 'POST' });
        render();
        toast('Invitation revoked');
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
          `<label class="file-label"><span>${esc(f.name)}</span><input name="file-label-${i}" maxlength="160" placeholder="Label: for example, Apex class and tests"></label>`,
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
    !remote.lessons.length &&
    (Object.keys(state.progress.history).length ||
      state.progress.completed.length ||
      state.progress.lessons.length)
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
          if (!r.ok) throw Error('Learning materials could not be loaded');
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
      `<div class="error-page"><h1>The studio could not be opened</h1><p>${esc(e.message)}</p><a class="btn" href="/">Refresh page</a></div>`;
  }
}
boot();
