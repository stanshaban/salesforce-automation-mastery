import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = async (name) => JSON.parse(await readFile(root + name, 'utf8'));
const curriculum = await read('data/curriculum.json');
curriculum.courses = await Promise.all(
  ['junior', 'middle', 'senior', 'jobs'].map((name) => read(`data/course-meta-${name}.json`)),
);
curriculum.revisionNote =
  'Complete English lessons with worked examples, independent practice, answered knowledge checks and individual generated illustrations. Junior starts with CRM, users and data. Agentforce is a separate practical project.';
curriculum.sources = curriculum.sources.map((s) => ({
  ...s,
  title: s.title.split(/ — | —| – /)[0].replace(/(?:K2U \/ )*Focus on Force/, 'K2U / Focus on Force'),
}));
await writeFile(root + 'data/curriculum.json', JSON.stringify(curriculum, null, 2) + '\n');
const foundations = [];
for (let i = 1; i <= 6; i++) {
  const l = await read(`data/lessons/junior/J0${i}.json`);
  foundations.push({
    id: l.id,
    title: l.title,
    goal: l.summary,
    sections: l.sections.map((s) => ({
      title: s.heading,
      paragraphs: s.body,
      steps: s.steps,
      code: s.codeBlocks?.map((c) => c.code).join('\n\n'),
    })),
    exercise: l.exercise.steps,
    questions: l.knowledgeCheck,
    sourceUrls: l.sources,
  });
}
await writeFile(
  root + 'data/foundations.json',
  JSON.stringify({ title: 'Salesforce Foundations', lessons: foundations }, null, 2) + '\n',
);
console.log('Built English curriculum and foundations from complete lesson sources.');

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
const gallery = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SAM illustration library</title><link rel="stylesheet" href="/styles.css"><style>body{padding:36px;max-width:1500px;margin:auto}header{margin-bottom:35px}.art-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px}.art-card{background:white;border:1px solid #dde4ec;border-radius:12px;overflow:hidden}.art-card img{width:100%;height:auto;display:block}.art-card div{padding:16px}.art-card h3{font-size:16px;line-height:1.5}h2{margin:40px 0 20px}a{text-decoration:none}small{color:#647287}</style></head><body><header><a href="/#/home">← Back to the learning portal</a><h1>SAM illustration library</h1><p>Original generated covers in the course's shared illustration style. Select a lesson to read it.</p></header>${curriculum.courses
  .map(
    (c) =>
      `<h2>${escapeHtml(c.title)}</h2><div class="art-grid">${c.modules
        .flatMap((m) => m.lessons)
        .map(
          (l) =>
            `<article class="art-card"><a href="/#/lesson/${l.id}"><img src="/lesson-images/${l.id}.jpg" alt="" width="1672" height="941" loading="lazy"><div><small>${l.id}</small><h3>${escapeHtml(l.title)}</h3></div></a></article>`,
        )
        .join('')}</div>`,
  )
  .join(
    '',
  )}<h2>Agentforce</h2><div class="art-grid"><article class="art-card"><a href="/#/agentforce"><img src="/lesson-images/AF-L01.jpg" alt="" width="1672" height="941" loading="lazy"><div><small>AF-L01</small><h3>Build a Dealership Assistant with Agentforce</h3></div></a></article></div></body></html>`;
await writeFile(root + 'public/illustrations.html', gallery + '\n');
