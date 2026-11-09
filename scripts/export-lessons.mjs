import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'public/lesson-exports');
await mkdir(out, { recursive: true });
const labels = {
  idea: '💡 Key idea',
  action: '⚡ Try it',
  warning: '⚠️ Watch out',
  check: '🔎 Check your understanding',
};
const bullets = (items) => (items || []).map((x) => `- ${x}`).join('\n');
const ordered = (items) => (items || []).map((x, i) => `${i + 1}. ${x}`).join('\n');
const quote = (kind, text) =>
  `> **${labels[kind] || labels.idea}**\n>\n${text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')}`;
export function toMarkdown(l) {
  return `# ${l.title}\n\n${l.id} · ${l.track} · About ${l.minutes} minutes with practice\n\n![${l.illustration.alt}](https://sam-portal-production.up.railway.app/lesson-images/${l.id}.jpg)\n\n${l.summary}\n\n## Before you begin\n\n${bullets(l.prerequisites)}\n\n## What you will learn\n\n${bullets(l.learningObjectives)}\n\n${l.sections.map((s, i) => `## ${i + 1}. ${s.heading}\n\n${s.body.join('\n\n')}\n\n${(s.callouts || []).map((c) => quote(c.kind, c.text)).join('\n\n')}${(s.codeBlocks || []).map((c) => `\n\n**${c.caption}**\n\n\`\`\`${c.language}\n${c.code}\n\`\`\``).join('')}${(s.steps || []).map((x, j) => `\n\n### Step ${j + 1}: ${x.title}\n\n${x.instruction}\n\n${quote('check', 'Expected result: ' + x.expected)}`).join('')}`).join('\n\n')}\n\n## ⚡ Independent practice: ${l.exercise.title}\n\n${l.exercise.brief}\n\n${ordered(l.exercise.steps)}\n\n### Your work is ready when\n\n${bullets(l.exercise.acceptance)}${l.exercise.stretch ? '\n\n' + quote('idea', 'Optional extension: ' + l.exercise.stretch) : ''}\n\n## 🔎 Check your understanding\n\nAnswer in your own words before reading the explanations.\n\n${l.knowledgeCheck.map((q, i) => `### ${i + 1}. ${q.question}\n\n**Answer:** ${q.answer}`).join('\n\n')}\n\n## What to take away\n\n${bullets(l.recap)}\n\n## Sources and further reading\n\n${l.sources.map((s) => `- [${s.title}](${s.url})`).join('\n')}\n`;
}
const tracks = ['junior', 'middle', 'senior', 'jobs'];
const index = [];
for (const track of tracks) {
  const dir = path.join(root, 'data/lessons', track);
  const files = (await readdir(dir)).filter((x) => x.endsWith('.json')).sort();
  const combined = [];
  for (const file of files) {
    const lesson = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    const markdown = toMarkdown(lesson);
    await writeFile(path.join(out, lesson.id + '.md'), markdown);
    combined.push(markdown);
    index.push({ id: lesson.id, title: lesson.title, track, file: lesson.id + '.md' });
  }
  await writeFile(path.join(out, track + '-course.md'), combined.join('\n\n---\n\n'));
}
await writeFile(path.join(out, 'index.json'), JSON.stringify(index, null, 2) + '\n');
console.log(`Exported ${index.length} complete lessons and four course collections.`);

const agentforceText = await readFile(path.join(root, 'docs/agentforce-lesson.md'), 'utf8');
await writeFile(path.join(out, 'AF-L01.md'), agentforceText);
