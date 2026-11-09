import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, readdirSync, rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {DatabaseSync} from 'node:sqlite';
import {createApp} from '../server/app.mjs';

const APP_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'teacher@example.test';
const ADMIN_PASSWORD = 'test-only-random-password-123456789';

async function fixture(t, options = {}) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'sam-test-'));
  const publicDir = path.join(dir, 'public');
  const contentDir = path.join(dir, 'content');
  const dataDir = path.join(dir, 'private');
  mkdirSync(publicDir); mkdirSync(contentDir);
  writeFileSync(path.join(publicDir, 'index.html'), '<h1>SAM test portal</h1>');
  writeFileSync(path.join(contentDir, 'curriculum.json'), '{"courses":[]}');
  writeFileSync(path.join(contentDir, 'private.json'), '{"secret":"must not be served"}');
  const env = {NODE_ENV: 'test', APP_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET: 'test-only-session-secret-at-least-32-characters', ...options.env};
  let app = createApp({...options, env, dataDir, publicDir, contentDir});
  let server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  let base = `http://127.0.0.1:${server.address().port}`;
  const restart = async () => {
    await new Promise(resolve => server.close(resolve));
    app.locals.close();
    app = createApp({...options, env, dataDir, publicDir, contentDir});
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  };
  t.after(async () => { await new Promise(resolve => server.close(resolve)); app.locals.close(); rmSync(dir, {recursive: true, force: true}); });
  const request = async (route, {method = 'GET', cookie, body, form, origin = env.APP_URL, headers = {}} = {}) => {
    const requestHeaders = {...headers};
    if (cookie) requestHeaders.cookie = cookie;
    if (!['GET', 'HEAD'].includes(method) && origin !== null) requestHeaders.origin = origin;
    if (body !== undefined) requestHeaders['content-type'] = 'application/json';
    const response = await fetch(`${base}${route}`, {method, headers: requestHeaders, body: form || (body === undefined ? undefined : JSON.stringify(body))});
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    return {status: response.status, data, headers: response.headers, cookie: response.headers.get('set-cookie')?.split(';')[0]};
  };
  const login = async () => {
    const response = await request('/api/auth/admin', {method: 'POST', body: {email: ADMIN_EMAIL, password: ADMIN_PASSWORD}});
    assert.equal(response.status, 200);
    return response.cookie;
  };
  const invite = async (cookie, body = {}) => {
    const response = await request('/api/admin/invites', {method: 'POST', cookie, body});
    assert.equal(response.status, 201, JSON.stringify(response.data));
    return response.data.invite;
  };
  const join = async (token, email = 'learner@example.test', extra = {}) => request('/api/auth/join', {method: 'POST', body: {token, email, skoolUsername: 'learner-skool', ...extra}});
  const learner = async (adminCookie, email = 'learner@example.test') => {
    const invitation = await invite(adminCookie);
    const response = await join(invitation.token, email);
    assert.equal(response.status, 201, JSON.stringify(response.data));
    return {cookie: response.cookie, user: response.data.user, invitation};
  };
  return {app, request, login, invite, join, learner, dataDir, restart};
}

function workForm({title = 'Bulk-safe implementation', assignmentId = 'J-L04', description = 'Учебная работа', githubUrl = '', parentId = '', files = [{name: 'Solution.cls', content: 'public with sharing class Solution {}', label: 'Apex source'}]} = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({title, assignmentId, description, githubUrl, parentId})) form.set(key, value);
  form.set('fileLabels', JSON.stringify(files.map(file => file.label || file.name)));
  for (const file of files) form.append('files', new Blob([file.content]), file.name);
  return form;
}

test('public health/content work; private storage and unlisted content are not public', async t => {
  const {request} = await fixture(t);
  assert.equal((await request('/api/health')).status, 200);
  assert.deepEqual((await request('/api/me')).data, {user: null});
  assert.equal((await request('/join')).status, 200);
  assert.equal((await request('/data/curriculum.json')).status, 200);
  for (const route of ['/data/sam.sqlite', '/data/private.json', '/.sam-data/sam.sqlite', '/uploads/example.bin', '/api/missing']) assert.equal((await request(route)).status, 404, route);
});

test('admin authentication, signed cookies, role boundaries, logout and CSRF', async t => {
  const {request, login, learner} = await fixture(t);
  assert.equal((await request('/api/admin/users')).status, 401);
  assert.equal((await request('/api/auth/admin', {method: 'POST', body: {email: ADMIN_EMAIL, password: 'wrong'}})).status, 401);
  for (const origin of ['https://attacker.example', null]) assert.equal((await request('/api/auth/admin', {method: 'POST', origin, body: {email: ADMIN_EMAIL, password: ADMIN_PASSWORD}})).status, 403);
  const cookie = await login();
  assert.equal((await request('/api/me', {cookie})).data.user.role, 'admin');
  assert.equal((await request('/api/me', {cookie: `${cookie.slice(0, -1)}X`})).data.user, null);
  const pupil = await learner(cookie);
  assert.equal((await request('/api/admin/users', {cookie: pupil.cookie})).status, 403);
  assert.equal((await request('/api/admin/invites', {method: 'POST', cookie: pupil.cookie, body: {}})).status, 403);
  assert.equal((await request('/api/auth/logout', {method: 'POST', cookie})).status, 200);
  assert.equal((await request('/api/me', {cookie})).data.user, null);
});

test('invitation token is shown once, stored hashed, and can be redeemed only once', async t => {
  const {request, login, invite, join, dataDir} = await fixture(t);
  const adminCookie = await login();
  const invitation = await invite(adminCookie, {label: 'November cohort'});
  assert.match(invitation.url, /\/join#token=[\w-]{43}$/);
  const listing = await request('/api/admin/invites', {cookie: adminCookie});
  assert.equal(listing.data.invites[0].label, 'November cohort');
  assert.equal(listing.data.invites[0].token, undefined);
  assert.equal(listing.data.invites[0].url, undefined);
  const db = new DatabaseSync(path.join(dataDir, 'sam.sqlite'), {readOnly: true});
  const row = db.prepare('SELECT token_hash FROM invites WHERE id=?').get(invitation.id);
  assert.notEqual(row.token_hash, invitation.token); assert.equal(row.token_hash.length, 64); db.close();
  const results = await Promise.all([join(invitation.token), join(invitation.token)]);
  assert.deepEqual(results.map(result => result.status).sort(), [201, 400]);
  const created = results.find(result => result.status === 201);
  assert.equal(created.data.user.role, 'learner');
  assert.equal(created.data.user.notificationsConsent, false);
  assert.equal(created.data.user.emailVerified, false);
});

test('general invitation cannot take over an existing account; targeted links rotate', async t => {
  const {request, login, invite, join, learner} = await fixture(t);
  const adminCookie = await login();
  const pupil = await learner(adminCookie);
  const generic = await invite(adminCookie);
  assert.equal((await join(generic.token, pupil.user.email)).status, 409);
  assert.equal((await join(generic.token, ADMIN_EMAIL)).status, 409);
  const oldLink = await invite(adminCookie, {userId: pupil.user.id});
  const freshLink = await invite(adminCookie, {userId: pupil.user.id});
  assert.equal((await join(oldLink.token, pupil.user.email)).status, 400);
  assert.equal((await join(freshLink.token, 'someone-else@example.test')).status, 400);
  const recovered = await join(freshLink.token, pupil.user.email);
  assert.equal(recovered.status, 201);
  assert.equal(recovered.data.user.id, pupil.user.id);
  const users = (await request('/api/admin/users', {cookie: adminCookie})).data.users;
  assert.equal(users.length, 2);
  assert.equal(users.filter(user => user.role === 'admin').length, 1);
});

test('revoked and expired invitations fail; expired sessions fail', async t => {
  let clock = Date.now();
  const {request, login, invite, join, learner} = await fixture(t, {now: () => clock});
  const adminCookie = await login();
  const revoked = await invite(adminCookie);
  assert.equal((await request(`/api/admin/invites/${revoked.id}/revoke`, {method: 'POST', cookie: adminCookie, body: {}})).status, 200);
  assert.equal((await join(revoked.token)).status, 400);
  const expired = await invite(adminCookie, {expiresInDays: 1});
  const pupil = await learner(adminCookie);
  clock += 2 * 86400000;
  assert.equal((await join(expired.token, 'new@example.test')).status, 400);
  clock += 30 * 86400000;
  assert.equal((await request('/api/me', {cookie: pupil.cookie})).data.user, null);
});

test('progress belongs to one learner, persists, and consent can be withdrawn without role change', async t => {
  const {request, login, learner} = await fixture(t);
  const adminCookie = await login();
  const a = await learner(adminCookie, 'a@example.test');
  const b = await learner(adminCookie, 'b@example.test');
  const progress = {completed: ['J-L01'], attempts: [{correct: 3, total: 5}]};
  assert.equal((await request('/api/progress', {method: 'POST', cookie: a.cookie, body: {progress}})).status, 200);
  assert.deepEqual((await request('/api/progress', {cookie: a.cookie})).data.progress, progress);
  assert.deepEqual((await request('/api/progress', {cookie: b.cookie})).data.progress, {});
  assert.equal((await request('/api/progress', {method: 'POST', cookie: a.cookie, body: {progress: []}})).status, 400);
  const consent = await request('/api/me', {method: 'PATCH', cookie: a.cookie, body: {notificationsConsent: true, role: 'admin'}});
  assert.equal(consent.data.user.notificationsConsent, true);
  assert.equal(consent.data.user.role, 'learner');
  assert.equal((await request('/api/me', {method: 'PATCH', cookie: a.cookie, body: {notificationsConsent: false}})).data.user.notificationsConsent, false);
});

test('upload, private download, reviewer feedback and resubmission work end to end', async t => {
  const {request, login, learner, dataDir} = await fixture(t);
  const adminCookie = await login();
  const a = await learner(adminCookie, 'a@example.test');
  const b = await learner(adminCookie, 'b@example.test');
  const source = 'throw new Error("uploaded code must never execute");';
  const response = await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({files: [{name: 'untrusted.js', content: source, label: 'Source for review'}]})});
  assert.equal(response.status, 201, JSON.stringify(response.data));
  const work = response.data.submission;
  assert.equal(work.files[0].label, 'Source for review');
  assert.equal(work.user.email, a.user.email);
  assert.equal(work.status, 'submitted');
  assert.equal((await request(`/api/submissions/${work.id}`, {cookie: b.cookie})).status, 404);
  assert.equal((await request(`/api/files/${work.files[0].id}`, {cookie: b.cookie})).status, 404);
  assert.equal((await request(`/api/files/${work.files[0].id}`)).status, 401);
  const download = await request(`/api/files/${work.files[0].id}`, {cookie: adminCookie});
  assert.equal(download.data, source);
  assert.match(download.headers.get('content-disposition'), /^attachment;/);
  assert.match(download.headers.get('content-type'), /application\/octet-stream/);
  assert.equal((await request('/api/submissions', {cookie: b.cookie})).data.submissions.length, 0);
  assert.equal((await request('/api/submissions', {cookie: adminCookie})).data.submissions.length, 1);
  assert.equal((await request(`/api/admin/submissions/${work.id}`, {method: 'PATCH', cookie: a.cookie, body: {status: 'accepted'}})).status, 403);
  const reviewed = await request(`/api/admin/submissions/${work.id}`, {method: 'PATCH', cookie: adminCookie, body: {status: 'changes_requested', feedback: 'Добавьте bulk test.', rubric: {bulkSafety: 1}}});
  assert.equal(reviewed.data.submission.feedback, 'Добавьте bulk test.');
  const revision = await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({parentId: work.id})});
  assert.equal(revision.status, 201);
  assert.equal(revision.data.submission.parentId, work.id);
  assert.equal(readdirSync(path.join(dataDir, 'staging')).length, 0);
  assert.ok(readdirSync(path.join(dataDir, 'uploads')).every(name => /^[a-f0-9-]+\.bin$/.test(name)));
});

test('upload validation rejects unsafe URLs, empty submissions and foreign parents', async t => {
  const {request, login, learner} = await fixture(t);
  const adminCookie = await login();
  const a = await learner(adminCookie, 'a@example.test');
  const b = await learner(adminCookie, 'b@example.test');
  for (const githubUrl of ['http://github.com/a/b', 'https://github.com.evil.test/a/b', 'javascript:alert(1)', 'https://attacker@github.com/a/b', 'https://github.com/a/b?token=secret']) {
    assert.equal((await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({githubUrl, files: []})})).status, 400, githubUrl);
  }
  assert.equal((await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({files: []})})).status, 400);
  const work = (await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({githubUrl: 'https://github.com/learner/sam/pull/2', files: []})})).data.submission;
  assert.ok(work.id);
  assert.equal((await request('/api/submissions', {method: 'POST', cookie: b.cookie, form: workForm({parentId: work.id})})).status, 404);
  assert.equal((await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({parentId: work.id, assignmentId: 'J-L01'})})).status, 400);
});

test('file count, per-file size, total size and durable storage limits clean up rejected uploads', async t => {
  const {request, login, learner, dataDir} = await fixture(t, {maxFileBytes: 100, maxTotalBytes: 150, maxStorageBytes: 180});
  const adminCookie = await login();
  const a = await learner(adminCookie);
  const file = (size, i = 0) => ({name: `file-${i}.txt`, content: 'x'.repeat(size)});
  for (const files of [[file(101)], [file(90), file(90, 1)], Array.from({length: 6}, (_, i) => file(1, i))]) {
    assert.equal((await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({files})})).status, 413);
    assert.equal(readdirSync(path.join(dataDir, 'staging')).length, 0);
    assert.equal(readdirSync(path.join(dataDir, 'uploads')).length, 0);
  }
  assert.equal((await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({files: [file(95)]})})).status, 201);
  assert.equal((await request('/api/submissions', {method: 'POST', cookie: a.cookie, form: workForm({files: [file(95)]})})).status, 507);
  assert.equal(readdirSync(path.join(dataDir, 'staging')).length, 0);
  assert.equal(readdirSync(path.join(dataDir, 'uploads')).length, 1);
});

test('admin login is rate limited and production session cookies are secure', async t => {
  const {request} = await fixture(t, {env: {NODE_ENV: 'production', APP_URL: 'https://sam.example.test'}});
  const valid = await request('/api/auth/admin', {method: 'POST', body: {email: ADMIN_EMAIL, password: ADMIN_PASSWORD}});
  assert.equal(valid.status, 200);
  assert.match(valid.headers.get('set-cookie'), /HttpOnly/);
  assert.match(valid.headers.get('set-cookie'), /Secure/);
  assert.match(valid.headers.get('set-cookie'), /SameSite=Lax/);
  for (let i = 0; i < 7; i++) assert.equal((await request('/api/auth/admin', {method: 'POST', body: {email: ADMIN_EMAIL, password: 'wrong'}})).status, 401);
  const limited = await request('/api/auth/admin', {method: 'POST', body: {email: ADMIN_EMAIL, password: ADMIN_PASSWORD}});
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
});

test('sessions, progress, uploads and labels survive an application restart', async t => {
  const {request, login, learner, restart} = await fixture(t);
  const adminCookie = await login();
  const a = await learner(adminCookie);
  await request('/api/progress', {method: 'POST', cookie: a.cookie, body: {progress: {completed: ['J-L01']}}});
  const files = Array.from({length: 5}, (_, i) => ({name: `source-${i}.xml`, content: `<metadata index="${i}"/>`, label: `Подпись ${i}`}));
  const form = workForm({files});
  for (const [i, file] of files.entries()) form.set(`file-label-${i}`, file.label);
  const work = await request('/api/submissions', {method: 'POST', cookie: a.cookie, form});
  assert.equal(work.status, 201, JSON.stringify(work.data));
  await restart();
  assert.equal((await request('/api/me', {cookie: a.cookie})).data.user.id, a.user.id);
  assert.deepEqual((await request('/api/progress', {cookie: a.cookie})).data.progress.completed, ['J-L01']);
  const saved = (await request('/api/submissions', {cookie: adminCookie})).data.submissions[0];
  assert.equal(saved.id, work.data.submission.id);
  assert.deepEqual(saved.files.map(file => file.label), files.map(file => file.label));
  assert.equal((await request(`/api/files/${saved.files[0].id}`, {cookie: a.cookie})).data, files[0].content);
});

test('30-day targeted invitations retain identity and expire under production settings', async t => {
  let clock = Date.now();
  const {login, invite, join, learner} = await fixture(t, {now: () => clock, env: {NODE_ENV: 'production', APP_URL: 'https://sam.example.test'}});
  const adminCookie = await login();
  const a = await learner(adminCookie);
  const invitation = await invite(adminCookie, {userId: a.user.id, expiresInDays: 30});
  assert.equal(new Date(invitation.expiresAt).getTime() - clock, 30 * 86400000);
  clock += 29 * 86400000;
  const beforeExpiry = await join(invitation.token, a.user.email);
  assert.equal(beforeExpiry.status, 201);
  assert.equal(beforeExpiry.data.user.id, a.user.id);
  const late = await invite(adminCookie, {userId: a.user.id, expiresInDays: 30});
  clock += 31 * 86400000;
  assert.equal((await join(late.token, a.user.email)).status, 400);
});
