import { lessonMedia } from './lesson-media.mjs';
const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const bullets = (items) => `<ul>${(items || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
const labels = {
  idea: ['💡', 'Key idea'],
  action: ['⚡', 'Try it'],
  warning: ['⚠️', 'Watch out'],
  check: ['🔎', 'Check your understanding'],
};
export function callout(kind, text) {
  const [icon, label] = labels[kind] || labels.idea;
  return `<blockquote class="lesson-callout ${esc(labels[kind] ? kind : 'idea')}"><span class="callout-label"><span aria-hidden="true">${icon}</span> ${label}</span><p>${esc(text)}</p></blockquote>`;
}
export function renderFullLesson(lesson, { sequence = [], completed = false } = {}) {
  const l = lesson;
  const media = lessonMedia[l.id];
  const visual = media ? `<section class="reading-section lesson-visuals"><h2>See the steps</h2>${media.animation ? `<figure><video controls loop muted playsinline preload="none" poster="${esc(media.animation.poster)}"><source src="${esc(media.animation.video)}" type="video/mp4"></video><figcaption>${esc(media.animation.title)} · Teaching diagram. Pause or replay to inspect each state.</figcaption></figure>` : ''}${(media.screenshots || []).map(x => `<figure><img src="${esc(x.file)}" alt="${esc(x.title)}" loading="lazy"><figcaption>${esc(x.caption)}</figcaption></figure>`).join('')}</section>` : '';

  const index = sequence.findIndex((item) => item.id === l.id);
  const previous = index > 0 ? sequence[index - 1] : null;
  const next = index >= 0 ? sequence[index + 1] : null;
  const back = l.track === 'jobs' ? '#/jobs' : `#/tracks/${l.track}`;
  const sections = l.sections
    .map(
      (s, i) =>
        `<section class="reading-section" id="section-${i}"><h2 tabindex="-1">${i + 1}. ${esc(s.heading)}</h2>${s.body.map((p) => `<p>${esc(p)}</p>`).join('')}${(s.callouts || []).map((c) => callout(c.kind, c.text)).join('')}${(s.codeBlocks || []).map((c) => `<figure class="lesson-code"><figcaption>${esc(c.caption)} <span>${esc(c.language)}</span></figcaption><div class="codebox"><pre><code>${esc(c.code)}</code></pre><button type="button" class="copy" data-action="copy-code">Copy</button></div></figure>`).join('')}${s.steps?.length ? `<ol class="guided-steps">${s.steps.map((step) => `<li><h3>${esc(step.title)}</h3><p>${esc(step.instruction)}</p><div class="expected-result"><b>Expected result</b><p>${esc(step.expected)}</p></div></li>`).join('')}</ol>` : ''}</section>`,
    )
    .join('');
  return `<div class="lesson-toolbar"><a class="text-btn" href="${back}">← Back to ${l.track === 'jobs' ? 'Job Research' : esc(l.track[0].toUpperCase() + l.track.slice(1))}</a><a class="text-btn" href="/lesson-exports/${esc(l.id)}.md" download>Download lesson text ↓</a></div><article class="full-lesson"><header class="reading-header"><h1>${esc(l.title)}</h1><p class="lesson-summary">${esc(l.summary)}</p><img class="lesson-cover" src="/lesson-images/${esc(l.id)}.jpg" alt="${esc(l.illustration.alt)}" width="1672" height="941" fetchpriority="high"></header><div class="reading-layout"><aside class="lesson-toc"><span class="eyebrow">IN THIS LESSON</span><nav aria-label="Lesson sections">${l.sections.map((s, i) => `<button type="button" data-action="lesson-section" data-index="${i}">${i + 1}. ${esc(s.heading)}</button>`).join('')}<button type="button" data-action="lesson-section" data-index="exercise">Independent practice</button><button type="button" data-action="lesson-section" data-index="review">Check your understanding</button></nav></aside><div class="lesson-prose"><section class="lesson-start">${callout('action', 'Your practical outcome: ' + l.exercise.brief)}<h2>Check the result</h2>${bullets(l.exercise.acceptance)}<h2>Before you begin</h2>${bullets(l.prerequisites)}<h2>What you will learn</h2>${bullets(l.learningObjectives)}</section>${visual}${sections}<section class="reading-section exercise-section" id="section-exercise"><span class="eyebrow">⚡ INDEPENDENT PRACTICE</span><h2 tabindex="-1">${esc(l.exercise.title)}</h2><p>${esc(l.exercise.brief)}</p><ol>${l.exercise.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol><h3>Your work is ready when</h3>${bullets(l.exercise.acceptance)}${l.exercise.stretch ? callout('idea', `Optional extension: ${l.exercise.stretch}`) : ''}</section><section class="reading-section" id="section-review"><h2 tabindex="-1">Check your understanding</h2><p>Answer in your own words before opening the explanation.</p>${l.knowledgeCheck.map((q, i) => `<details class="lesson-row knowledge-check"><summary>${i + 1}. ${esc(q.question)}</summary><div class="lesson-content"><p>${esc(q.answer)}</p></div></details>`).join('')}<h3>What to take away</h3>${bullets(l.recap)}</section><section class="reading-section lesson-sources"><h2>Sources and further reading</h2><ul>${l.sources
    .map((s) => {
      let url;
      try {
        url = new URL(s.url);
        if (url.protocol !== 'https:') throw Error();
      } catch {
        return '';
      }
      return `<li><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></li>`;
    })
    .join(
      '',
    )}</ul><p>Examples use a fictional company and training data. Check the current documentation and your org's features before applying a solution elsewhere.</p></section><div class="lesson-finish"><button type="button" class="btn ${completed ? 'secondary' : ''}" data-action="complete-lesson" data-id="${esc(l.id)}" aria-pressed="${completed}">${completed ? '✓ Lesson marked complete' : 'Mark lesson complete'}</button><small>This records your own progress; it is separate from instructor review.</small></div><nav class="lesson-pagination" aria-label="Adjacent lessons">${previous ? `<a href="#/lesson/${esc(previous.id)}"><small>← PREVIOUS</small><b>${esc(previous.title)}</b></a>` : '<span></span>'}${next ? `<a href="#/lesson/${esc(next.id)}"><small>NEXT →</small><b>${esc(next.title)}</b></a>` : `<a href="${back}"><small>COURSE</small><b>Return to the learning path →</b></a>`}</nav></div></div></article>`;
}
