import { readFile, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const errors = [];
const parsed = new Map();
const exists = async relative => {
  try { await stat(path.join(root, relative)); return true; } catch { return false; }
};
const requireThat = (condition, message) => { if (!condition) errors.push(message); };
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const nonemptyArray = value => Array.isArray(value) && value.length > 0;
const levels = ['junior', 'middle', 'senior'];
function forbiddenPath(relative) {
  return /(^|\/)\.env(?:\..+)?$/.test(relative) && path.basename(relative) !== '.env.example'
    || /(^|\/)(?:\.sf|\.sfdx|runtime|\.runtime)(\/|$)/.test(relative)
    || /\.(?:sqlite|sqlite3)(?:-|$)/i.test(relative);
}

async function walk(relative) {
  const files = [];
  if (!(await exists(relative))) return files;
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory() && !['.git', 'node_modules', '.sf', '.sfdx', 'runtime', '.runtime'].includes(entry.name)) files.push(...await walk(child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

async function readJson(relative) {
  if (parsed.has(relative)) return parsed.get(relative);
  try {
    const value = JSON.parse(await readFile(path.join(root, relative), 'utf8'));
    parsed.set(relative, value);
    return value;
  } catch (error) {
    errors.push(`${relative}: ${error.code === 'ENOENT' ? 'required file is missing' : 'invalid JSON'}`);
    return null;
  }
}

function https(value, location) {
  try {
    const url = new URL(value);
    requireThat(url.protocol === 'https:' && !url.username && !url.password, `${location}: expected HTTPS source without credentials`);
  } catch { errors.push(`${location}: invalid source URL`); }
}

function sources(value, location) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => sources(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    const at = `${location}.${key}`;
    if (['sourceUrl', 'additionalSourceUrl'].includes(key)) https(item, at);
    else if (key === 'sourceUrls') {
      requireThat(Array.isArray(item), `${at}: expected source array`);
      if (Array.isArray(item)) item.forEach((source, index) => https(typeof source === 'string' ? source : source?.url, `${at}[${index}]`));
    } else if (key === 'sources') {
      requireThat(Array.isArray(item), `${at}: expected sources array`);
      if (Array.isArray(item)) item.forEach((source, index) => https(typeof source === 'string' ? source : source?.url, `${at}[${index}]`));
    } else sources(item, at);
  }
}

function unique(value, seen, location) {
  requireThat(nonempty(value), `${location}: missing ID`);
  requireThat(!seen.has(value), `${location}: duplicate ID ${value}`);
  seen.add(value);
}

const requiredFiles = [
  'public/index.html', 'public/app.mjs', 'public/styles.css', 'public/mark.svg', 'public/quiz-engine.mjs',
  'data/question-bank.json', 'data/question-sources.json', 'data/curriculum.json',
  'data/assignments.json', 'data/setup-guide.json', 'data/foundations.json', 'data/agentforce.json',
  'starter/salesforce/sfdx-project.json', 'starter/agentforce/sfdx-project.json',
  'starter/submissions/TEMPLATE/submission.example.json', '.gitignore', '.env.example',
];
for (const file of requiredFiles) requireThat(await exists(file), `${file}: required file is missing`);

// Parse every public training JSON file, not just the objects used by the current page.
const publicFiles = [...await walk('public'), ...await walk('data'), ...await walk('starter')];
for (const file of publicFiles.filter(file => file.endsWith('.json') && !forbiddenPath(file))) {
  const value = await readJson(file);
  if (value) sources(value, file);
}

for (const projectFile of ['starter/salesforce/sfdx-project.json', 'starter/agentforce/sfdx-project.json']) {
  const project = await readJson(projectFile);
  if (!project) continue;
  requireThat(nonemptyArray(project.packageDirectories), `${projectFile}: package directories required`);
  requireThat(/^\d+\.0$/.test(project.sourceApiVersion || ''), `${projectFile}: explicit API version required`);
  for (const directory of project.packageDirectories || []) {
    const relative = path.join(path.dirname(projectFile), directory.path || '');
    requireThat(nonempty(directory.path) && path.resolve(root, relative).startsWith(root) && await exists(relative), `${projectFile}: missing package directory`);
  }
}

const bank = await readJson('data/question-bank.json');
if (Array.isArray(bank)) {
  requireThat(bank.length >= 90, 'question-bank: expected at least 90 base questions');
  const seen = new Set();
  const prompts = new Set();
  let variationFamilies = 0;
  for (const level of levels) requireThat(bank.filter(question => question.level === level).length >= 30, `question-bank: fewer than 30 ${level} questions`);
  for (const family of bank) {
    requireThat(levels.includes(family.level), `${family.id}: invalid level`);
    requireThat(nonempty(family.title) && nonempty(family.topic), `${family.id}: missing title/topic`);
    requireThat([1, 2, 3].includes(family.difficulty), `${family.id}: invalid difficulty`);
    requireThat(['concept', 'scenario', 'code', 'diagnosis'].includes(family.kind), `${family.id}: invalid kind`);
    if (family.kind === 'code') requireThat(nonempty(family.code), `${family.id}: code question has no code`);
    https(family.sourceUrl, `${family.id}.sourceUrl`);
    if (nonemptyArray(family.variations)) variationFamilies += 1;
    for (const question of [family, ...(family.variations || [])]) {
      unique(question.id, seen, 'question-bank');
      requireThat(nonempty(question.prompt) && nonempty(question.explanation), `${question.id}: missing prompt/explanation`);
      requireThat(!prompts.has(question.prompt), `${question.id}: duplicate prompt`);
      prompts.add(question.prompt);
      const options = Array.isArray(question.options) ? question.options : [];
      const ids = options.map(option => option.id);
      requireThat(options.length >= 2 && new Set(ids).size === ids.length && options.every(option => nonempty(option.id) && nonempty(option.text)), `${question.id}: invalid options`);
      requireThat(ids.includes(question.correctOptionId), `${question.id}: correct answer is not an option`);
      const feedback = question.whyOthers || [];
      requireThat(feedback.length === options.length - 1 && new Set(feedback.map(item => item.id)).size === feedback.length && feedback.every(item => ids.includes(item.id) && item.id !== question.correctOptionId && nonempty(item.text)), `${question.id}: incomplete distractor feedback`);
    }
  }
  requireThat(variationFamilies >= 30, 'question-bank: fewer than 30 families with semantic variations');
  const manifest = await readJson('data/question-sources.json');
  if (manifest) {
    requireThat(nonemptyArray(manifest.sources) && nonemptyArray(manifest.versionCaveats), 'question-sources: sources/version caveats are required');
    const variantCount = bank.reduce((total, question) => total + (question.variations?.length || 0), 0);
    requireThat(manifest.counts?.base === bank.length && manifest.counts?.variants === variantCount, 'question-sources: counts do not match the bank');
    const documented = new Set((manifest.sources || []).map(source => source.url));
    for (const question of bank) requireThat(documented.has(question.sourceUrl), `${question.id}: source absent from manifest`);
    const familyIds = new Set(bank.map(question => question.id));
    for (const source of manifest.sources || []) {
      requireThat((source.questionIds || []).every(id => familyIds.has(id)), `question-sources ${source.id}: unknown question ID`);
    }
  }
} else if (bank) errors.push('question-bank: root must be an array');

const curriculum = await readJson('data/curriculum.json');
const lessonIds = new Set();
if (curriculum) {
  const courses = Array.isArray(curriculum.courses) ? curriculum.courses : [];
  requireThat(['j', 'm', 's', 'jobs'].every(id => courses.some(course => course.id === id)), 'curriculum: Junior, Middle, Senior and Jobs courses are required');
  const courseIds = new Set();
  for (const course of courses) {
    unique(course.id, courseIds, 'curriculum courses');
    requireThat(!/release|релиз/i.test(`${course.id} ${course.title}`), 'curriculum: a separate release course is outside this portal scope');
    requireThat(nonempty(course.title) && nonemptyArray(course.modules), `${course.id}: missing course title/modules`);
    for (const module of course.modules || []) {
      requireThat(nonempty(module.title) && nonemptyArray(module.lessons), `${course.id}: empty module`);
      for (const lesson of module.lessons || []) {
        unique(lesson.id, lessonIds, 'curriculum lessons');
        for (const field of ['title', 'outcome', 'task', 'acceptance', 'interview']) requireThat(nonempty(lesson[field]), `${lesson.id}: missing ${field}`);
      }
    }
  }
  requireThat(nonemptyArray(curriculum.sources), 'curriculum: official sources are required');
}

const assignments = await readJson('data/assignments.json');
if (assignments) {
  const rows = Array.isArray(assignments) ? assignments : assignments.assignments;
  requireThat(nonemptyArray(rows), 'assignments: expected tasks');
  const assignmentIds = new Set();
  for (const assignment of rows || []) {
    unique(assignment.id, assignmentIds, 'assignments');
    requireThat([...levels, 'agentforce'].includes(assignment.level), `${assignment.id}: invalid assignment level`);
    for (const field of ['title', 'brief', 'starterPath']) requireThat(nonempty(assignment[field]), `${assignment.id}: missing ${field}`);
    for (const field of ['tasks', 'acceptance', 'failureCases', 'deliverables', 'reviewQuestions']) requireThat(nonemptyArray(assignment[field]), `${assignment.id}: missing ${field}`);
    requireThat(Number.isFinite(assignment.estimatedMinutes) && assignment.estimatedMinutes > 0, `${assignment.id}: invalid duration`);
    if (nonempty(assignment.starterPath)) {
      const resolved = path.resolve(root, assignment.starterPath);
      requireThat(resolved.startsWith(root) && await exists(assignment.starterPath), `${assignment.id}: starter path is missing or outside repository`);
    }
    requireThat(nonemptyArray(assignment.sourceUrls) || nonemptyArray(assignments.sources), `${assignment.id}: no local or shared sources`);
  }
}

const setup = await readJson('data/setup-guide.json');
if (setup) {
  requireThat(nonempty(setup.title) && Array.isArray(setup.steps) && setup.steps.length >= 10, 'setup-guide: title and at least 10 steps are required');
  const ids = new Set();
  for (const step of setup.steps || []) {
    unique(step.id, ids, 'setup steps');
    for (const field of ['title', 'outcome', 'explanation', 'verify', 'commonMistake']) requireThat(nonempty(step[field]), `${step.id}: missing ${field}`);
    requireThat(nonemptyArray(step.actions), `${step.id}: missing actions`);
    requireThat(nonempty(step.visual?.zone) && nonempty(step.visual?.caption), `${step.id}: missing visual instructions`);
    requireThat(nonempty(step.video?.title) && nonemptyArray(step.video?.shots), `${step.id}: missing video plan`);
    requireThat(nonemptyArray(step.sourceUrls), `${step.id}: source URLs are required`);
    requireThat(Array.isArray(step.commands) && step.commands.every(command => nonempty(typeof command === 'string' ? command : command.command)), `${step.id}: malformed command list`);
  }
}

const foundations = await readJson('data/foundations.json');
if (foundations) {
  const lessons = foundations.lessons || [];
  requireThat(lessons.length === 6, 'foundations: expected six introductory lessons');
  const ids = new Set();
  for (const lesson of lessons) {
    unique(lesson.id, ids, 'foundations');
    requireThat(/^J0[1-6]$/.test(lesson.id) && lessonIds.has(lesson.id), `${lesson.id}: foundation must link to the first six Junior lessons`);
    requireThat(nonempty(lesson.title) && nonempty(lesson.goal), `${lesson.id}: foundation title/goal required`);
    requireThat(nonemptyArray(lesson.sections) && lesson.sections.every(section => nonempty(section.title)), `${lesson.id}: foundation sections required`);
    requireThat(nonemptyArray(lesson.exercise), `${lesson.id}: foundation exercise required`);
    requireThat(nonemptyArray(lesson.questions) && lesson.questions.every(question => nonempty(question.question) && nonempty(question.answer)), `${lesson.id}: complete self-check questions required`);
    requireThat(nonemptyArray(lesson.sourceUrls) || nonemptyArray(foundations.sourceUrls), `${lesson.id}: foundation sources required`);
  }
}

const agentforce = await readJson('data/agentforce.json');
if (agentforce) {
  requireThat(nonempty(agentforce.title), 'agentforce: title required');
  requireThat(Array.isArray(agentforce.chapters) && agentforce.chapters.length >= 8, 'agentforce: at least eight practical chapters required');
  requireThat(nonemptyArray(agentforce.sourceUrls), 'agentforce: source URLs required');
  for (const [index, chapter] of (agentforce.chapters || []).entries()) {
    requireThat(nonempty(chapter.title), `agentforce chapter ${index + 1}: title required`);
    requireThat(['explanation', 'content', 'paragraphs', 'steps', 'tasks', 'code'].some(key => nonempty(chapter[key]) || nonemptyArray(chapter[key])), `agentforce chapter ${index + 1}: missing teaching content`);
  }
}

// Complete authored lessons, exports and generated covers must agree with the curriculum.
const fullLessonFiles = (await walk('data/lessons')).filter(file => file.endsWith('.json'));
requireThat(fullLessonFiles.length === lessonIds.size, 'complete lessons: count differs from curriculum');
const authoredIds = new Set();
for (const file of fullLessonFiles) {
  const lesson = await readJson(file);
  if (!lesson) continue;
  unique(lesson.id, authoredIds, 'complete lessons');
  requireThat(lessonIds.has(lesson.id), `${file}: absent from curriculum`);
  requireThat([...levels, 'jobs'].includes(lesson.track), `${file}: invalid track`);
  for (const field of ['title', 'summary']) requireThat(nonempty(lesson[field]), `${file}: missing ${field}`);
  for (const field of ['prerequisites', 'learningObjectives', 'recap', 'sources']) requireThat(nonemptyArray(lesson[field]), `${file}: missing ${field}`);
  requireThat(nonemptyArray(lesson.sections), `${file}: no authored sections`);
  for (const section of lesson.sections || []) {
    requireThat(nonempty(section.heading) && nonemptyArray(section.body) && section.body.every(nonempty), `${file}: empty explanation`);
    for (const note of section.callouts || []) requireThat(['idea','action','warning','check'].includes(note.kind) && nonempty(note.text), `${file}: invalid callout`);
    for (const step of section.steps || []) requireThat(['title','instruction','expected'].every(key=>nonempty(step[key])), `${file}: incomplete guided step`);
    for (const code of section.codeBlocks || []) requireThat(nonempty(code.code) && nonempty(code.caption), `${file}: code has no context`);
  }
  requireThat(nonempty(lesson.exercise?.brief) && nonemptyArray(lesson.exercise?.steps) && nonemptyArray(lesson.exercise?.acceptance), `${file}: incomplete independent practice`);
  requireThat(lesson.knowledgeCheck?.length >= 3 && lesson.knowledgeCheck.every(q=>nonempty(q.question)&&nonempty(q.answer)), `${file}: incomplete answered knowledge check`);
  requireThat(nonempty(lesson.illustration?.alt), `${file}: image alt text missing`);
  requireThat(await exists(`public/lesson-images/${lesson.id}.jpg`), `${file}: unique cover missing`);
  const exported = await readFile(path.join(root, `public/lesson-exports/${lesson.id}.md`), 'utf8').catch(()=> '');
  requireThat(exported.includes(lesson.title) && exported.includes(lesson.exercise.brief) && exported.includes('> **'), `${file}: full text export missing or stale`);
  const prose=(lesson.sections || []).flatMap(section=>section.body || []).join(' ');
  requireThat(prose.split(/\s+/).length >= 300, `${file}: explanation is too thin for a complete lesson`);
}
requireThat([...lessonIds].every(id=>authoredIds.has(id)), 'complete lessons: curriculum has an outline without a lesson');
const imageManifest = await readJson('docs/image-prompts/manifest.json');
if (imageManifest) {
  requireThat(imageManifest.length === lessonIds.size + 1, 'image manifest: expected one cover per lesson plus Agentforce');
  const imageIds=new Set();
  for(const item of imageManifest) {
    unique(item.id,imageIds,'image manifest');
    requireThat(item.status==='generated' && nonempty(item.prompt) && await exists(item.path), `${item.id}: generated cover incomplete`);
  }
  requireThat(imageIds.has('AF-L01'), 'Agentforce cover missing');
}
for(const file of [...await walk('data'), 'public/app.mjs', 'public/index.html', 'public/lesson-reader.mjs', ...await walk('public/lesson-exports')].filter(file=>/\.(json|mjs|html|md)$/.test(file))) {
  const text=await readFile(path.join(root,file),'utf8');
  requireThat(!/[А-Яа-яЁё]/.test(text), `${file}: learner content must be English`);
}

// Look only at publishable files. Local .env/runtime data may legitimately exist and are not read.
let tracked = [];
try { tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\0').filter(Boolean); } catch { /* A downloaded ZIP has no Git metadata. */ }
for (const file of new Set([...publicFiles, ...tracked])) requireThat(!forbiddenPath(file), `${file}: private environment/auth/runtime file must not be published`);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\b(?:sk_live_|rk_live_)[A-Za-z0-9]{16,}\b/,
  /force:\/\/[^\s"'<>]+:[^\s"'<>]+@/,
  /\b00D[A-Za-z0-9]{12,15}![A-Za-z0-9._-]{30,}/,
];
const textFiles = new Set([...publicFiles, ...tracked, '.env.example'].filter(file => (/\.(?:json|html|mjs|js|css|md|txt|xml|yml|yaml|cls|trigger)$/.test(file) || file === '.env.example') && !file.startsWith('node_modules/') && !forbiddenPath(file)));
for (const file of textFiles) {
  try {
    const text = await readFile(path.join(root, file), 'utf8');
    requireThat(!secretPatterns.some(pattern => pattern.test(text)), `${file}: looks like a real secret; inspect locally (value omitted)`);
  } catch { errors.push(`${file}: tracked/public file cannot be read`); }
}
const exampleEnv = await readFile(path.join(root, '.env.example'), 'utf8').catch(() => '');
for (const line of exampleEnv.split(/\r?\n/)) {
  const match = line.match(/^([A-Z_]*(?:PASSWORD|SECRET|TOKEN|PRIVATE_KEY)[A-Z_]*)=(.*)$/);
  if (match) {
    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
    requireThat(!value || /replace|change|example|your[_ -]|placeholder|<[^>]+>/i.test(value), `.env.example: ${match[1]} must use an empty or explicit placeholder value`);
  }
}
const ignore = await readFile(path.join(root, '.gitignore'), 'utf8').catch(() => '');
for (const entry of ['.env', '.sf/', '.sfdx/']) requireThat(ignore.split(/\r?\n/).includes(entry), `.gitignore: ${entry} must be excluded`);

if (errors.length) {
  console.error(`Content check failed (${errors.length}):\n${[...new Set(errors)].map(error => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  const count = Array.isArray(bank) ? bank.length : 0;
  console.log(`Content OK: ${count} questions, ${parsed.size} JSON files, 98 complete lessons, exports, 99 generated covers, assignments, setup and Agentforce chapters. No known secret patterns in publishable files.`);
}
