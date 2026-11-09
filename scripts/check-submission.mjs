#!/usr/bin/env node
/** Static file inspection only: no submitted code, Salesforce login or deployment. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--root')) {
  console.error('Usage: node scripts/check-submission.mjs [--root repository-path]');
  process.exit(2);
}
const root = path.resolve(args[1] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const relative = (file) => path.relative(root, file).split(path.sep).join('/');
const safeStat = (file) => {
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) { fail(`${relative(file)}: symlinks are not accepted in a submission.`); return null; }
  return stat;
};
function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  const stat = safeStat(directory);
  if (!stat?.isDirectory()) return [];
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    const info = safeStat(file);
    if (!info) continue;
    if (info.isDirectory()) {
      if (['.sf', '.sfdx', 'node_modules', '.git'].includes(entry.name)) {
        fail(`${relative(file)}: local auth, dependencies and Git internals do not belong in the learning package.`);
      } else found.push(...walk(file));
    } else if (info.isFile()) found.push(file);
  }
  return found;
}
function read(file) {
  if (!fs.existsSync(file)) { fail(`${relative(file)}: required file is missing.`); return null; }
  const stat = safeStat(file);
  if (!stat?.isFile()) { if (stat) fail(`${relative(file)}: expected a regular file.`); return null; }
  if (stat.size > 2 * 1024 * 1024) { fail(`${relative(file)}: text evidence must be under 2 MiB.`); return null; }
  return fs.readFileSync(file, 'utf8');
}
function json(file) {
  const text = read(file);
  if (text === null) return null;
  try { return JSON.parse(text); } catch { fail(`${relative(file)}: invalid JSON.`); return null; }
}
function textValue(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label}: provide a non-empty string.`);
}

const projectPath = path.join(root, 'starter/salesforce');
const project = json(path.join(projectPath, 'sfdx-project.json'));
if (project) {
  if (!/^\d{2}\.0$/.test(project.sourceApiVersion ?? '')) fail('sfdx-project.json: pin sourceApiVersion, for example 68.0.');
  if (!Array.isArray(project.packageDirectories) || !project.packageDirectories.length) fail('sfdx-project.json: packageDirectories is missing.');
  else for (const directory of project.packageDirectories) {
    if (typeof directory.path !== 'string' || !directory.path || path.isAbsolute(directory.path) || directory.path.split(/[\\/]/).includes('..')) {
      fail('sfdx-project.json: each package directory must be a safe relative path.');
      continue;
    }
    const directoryPath = path.join(projectPath, directory.path);
    if (!fs.existsSync(directoryPath)) fail(`sfdx-project.json: package directory ${directory.path} does not exist.`);
  }
}
const files = [...walk(projectPath), ...walk(path.join(root, 'starter/submissions'))];
const textExtensions = /\.(?:xml|cls|trigger|js|mjs|html|css|json|md|txt|csv|yml|yaml)$/i;
let metadataCount = 0;
for (const file of files) {
  const name = path.basename(file);
  if ((/^\.env(?:\.|$)/.test(name) && name !== '.env.example') || /\.(?:key|pem|p12|pfx)$/i.test(name)) {
    fail(`${relative(file)}: potential credential file. Remove it from the package and Git history before publishing.`);
    continue;
  }
  if (!textExtensions.test(name)) continue;
  const content = read(file);
  if (content === null) continue;
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)
      || /force:\/\/[^\s"'<>]+:[^\s"'<>]+@/i.test(content)
      || /\b(?:ghp_|github_pat_)[a-zA-Z0-9_]{20,}\b/.test(content)
      || /"(?:accessToken|refreshToken|sfdxAuthUrl)"\s*:\s*"[^"\s]{12,}"/.test(content)) {
    fail(`${relative(file)}: possible real credential. Inspect and rotate it if it was exposed. Contents are deliberately not printed.`);
  }
  if (name.endsWith('-meta.xml')) {
    metadataCount++;
    if (!content.includes('xmlns="http://soap.sforce.com/2006/04/metadata"')) fail(`${relative(file)}: Salesforce metadata namespace is missing.`);
    if (!/^\s*<\?xml[^>]*\?>/u.test(content)) fail(`${relative(file)}: XML declaration is missing.`);
    if (/<(?:modifyAllRecords|viewAllRecords)>\s*true\s*<\//i.test(content)
       || /<userPermissions>\s*<enabled>true<\/enabled>\s*<name>(?:ModifyAllData|ViewAllData)<\/name>/i.test(content)) {
      warnings.push(`${relative(file)}: broad permissions detected. Explain and review them; a green structure check does not approve this access.`);
    }
  }
}
if (!metadataCount) fail('No Salesforce metadata files found in starter/salesforce.');

const assignmentFile = path.join(root, 'data/assignments.json');
let ids = null;
if (fs.existsSync(assignmentFile)) {
  const data = json(assignmentFile);
  const assignments = Array.isArray(data) ? data : data?.assignments;
  if (Array.isArray(assignments)) ids = new Set(assignments.map(a => a.id));
  else fail('data/assignments.json: expected assignments array.');
}
const submissions = files.filter(f => path.basename(f) === 'submission.json');
for (const file of submissions) {
  const submission = json(file);
  if (!submission || typeof submission !== 'object' || Array.isArray(submission)) continue;
  const label = relative(file);
  if (submission.schemaVersion !== 1) fail(`${label}: schemaVersion must be 1.`);
  if (!/^[JMS]-L\d{2}$/.test(submission.assignmentId ?? '')) fail(`${label}: use an assignment ID such as J-L01.`);
  if (ids && !ids.has(submission.assignmentId)) fail(`${label}: unknown assignmentId.`);
  if (path.basename(path.dirname(file)) !== submission.assignmentId) fail(`${label}: folder name must equal assignmentId.`);
  textValue(submission.summary, `${label} summary`);
  textValue(submission.environment?.type, `${label} environment.type`);
  if (!/^\d{2}\.0$/.test(submission.environment?.apiVersion ?? '')) fail(`${label}: specify environment.apiVersion.`);
  for (const field of ['static', 'salesforce']) {
    if (!['passed', 'failed', 'not-run', 'not-applicable'].includes(submission.tests?.[field])) fail(`${label}: tests.${field} needs an explicit result.`);
  }
  if (!Array.isArray(submission.tests?.commands) || submission.tests.commands.some(c => typeof c !== 'string')) fail(`${label}: tests.commands must be an array of command descriptions.`);
  textValue(submission.tests?.resultsSummary, `${label} tests.resultsSummary`);
  if (!Array.isArray(submission.acceptance) || !submission.acceptance.length) fail(`${label}: include acceptance criteria and evidence.`);
  else for (const [index, criterion] of submission.acceptance.entries()) {
    textValue(criterion?.criterion, `${label} acceptance[${index}].criterion`);
    if (!['passed', 'failed', 'not-run'].includes(criterion?.result)) fail(`${label}: each acceptance result must be passed, failed or not-run.`);
    textValue(criterion?.evidence, `${label} acceptance[${index}].evidence`);
  }
  textValue(submission.designNotes, `${label} designNotes`);
  textValue(submission.aiAssistance, `${label} aiAssistance`);
}

for (const warning of warnings) console.warn(`REVIEW: ${warning}`);
for (const error of errors) console.error(`FAIL: ${error}`);
if (errors.length) {
  console.error(`Structure check failed with ${errors.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`Structure check passed: ${metadataCount} metadata files, ${submissions.length} submitted evidence manifest(s).`);
  if (!submissions.length) console.log('Starter only: no completed assignment has been submitted yet.');
  console.log('This is not XML schema validation, a secret-scan guarantee, an Apex test, an org deployment, or assignment acceptance.');
}
