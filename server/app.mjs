import express from 'express';
import multer from 'multer';
import {DatabaseSync} from 'node:sqlite';
import {createHash, createHmac, randomBytes, randomUUID, timingSafeEqual} from 'node:crypto';
import {mkdirSync, readdirSync, unlinkSync, renameSync, existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DAY = 86400000;
const COOKIE = 'sam_session';
const sha = value => createHash('sha256').update(value).digest('hex');
const safeEqual = (a, b) => timingSafeEqual(Buffer.from(sha(a)), Buffer.from(sha(b)));
const fail = (status, message, code = 'invalid_request') => Object.assign(new Error(message), {status, code});
const cleanText = (value, name, max, required = false) => {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw fail(400, `Проверьте поле «${name}».`);
  return value.trim();
};
const emailOf = value => {
  const email = cleanText(value, 'Email', 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fail(400, 'Укажите корректный email.');
  return email;
};

export function createApp(options = {}) {
  const env = options.env ?? process.env;
  const production = env.NODE_ENV === 'production';
  const appUrl = env.APP_URL || 'http://localhost:3000';
  const origin = new URL(appUrl).origin;
  if (production && !origin.startsWith('https://')) throw new Error('APP_URL must use HTTPS in production');
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 16) throw new Error('ADMIN_PASSWORD must contain at least 16 characters');
  if (production && (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32)) throw new Error('SESSION_SECRET must contain at least 32 characters');
  const sessionSecret = env.SESSION_SECRET || randomBytes(48).toString('base64url');
  const adminEmail = emailOf(env.ADMIN_EMAIL || 'stan.shaban@gmail.com');
  const dataDir = path.resolve(options.dataDir || env.DATA_DIR || path.join(ROOT, '.sam-data'));
  const publicDir = path.resolve(options.publicDir || path.join(ROOT, 'public'));
  const contentDir = path.resolve(options.contentDir || path.join(ROOT, 'data'));
  if (dataDir === publicDir || dataDir.startsWith(`${publicDir}${path.sep}`)) throw new Error('DATA_DIR cannot be inside public');
  const uploadsDir = path.join(dataDir, 'uploads');
  const stagingDir = path.join(dataDir, 'staging');
  for (const dir of [dataDir, uploadsDir, stagingDir]) mkdirSync(dir, {recursive: true, mode: 0o700});
  // One application instance owns this volume. Staging is never served to browsers.
  for (const name of readdirSync(stagingDir)) if (/^[a-f0-9-]+\.upload$/.test(name)) unlinkSync(path.join(stagingDir, name));
  const db = new DatabaseSync(path.join(dataDir, 'sam.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, skool_username TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','learner')), notifications_consent INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS invites (id TEXT PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL, user_id TEXT REFERENCES users(id), created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL, expires_at INTEGER NOT NULL, used_at TEXT, revoked_at TEXT, label TEXT NOT NULL DEFAULT '');
    CREATE TABLE IF NOT EXISTS progress (user_id TEXT PRIMARY KEY REFERENCES users(id), value TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), assignment_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, github_url TEXT NOT NULL DEFAULT '', parent_id TEXT REFERENCES submissions(id), status TEXT NOT NULL DEFAULT 'submitted', feedback TEXT NOT NULL DEFAULT '', rubric TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, submission_id TEXT NOT NULL REFERENCES submissions(id), storage_name TEXT NOT NULL UNIQUE, original_name TEXT NOT NULL, label TEXT NOT NULL, size INTEGER NOT NULL, mime_type TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS submissions_user ON submissions(user_id, created_at);
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS files_submission ON files(submission_id);`);
  const now = () => options.now ? options.now() : Date.now();
  const iso = () => new Date(now()).toISOString();
  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  if (existingAdmin && existingAdmin.role !== 'admin') throw new Error('Configured admin email belongs to a learner');
  if (!existingAdmin) db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)').run(randomUUID(), adminEmail, 'SAM instructor', 'admin', 0, iso());
  const publicUser = row => row ? {id: row.id, email: row.email, skoolUsername: row.skool_username, role: row.role, notificationsConsent: Boolean(row.notifications_consent), emailVerified: false, createdAt: row.created_at} : null;
  const cookieOptions = {httpOnly: true, secure: production, sameSite: 'lax', path: '/'};
  const sign = token => createHmac('sha256', sessionSecret).update(token).digest('base64url');
  const sessionToken = req => {
    const cookie = (req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`));
    if (!cookie) return null;
    const [token, signature, extra] = cookie.slice(COOKIE.length + 1).split('.');
    if (extra || !token || !signature || !/^[\w-]{43}$/.test(token) || !safeEqual(signature, sign(token))) return null;
    return token;
  };
  const startSession = (res, userId) => {
    const token = randomBytes(32).toString('base64url');
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now());
    db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(sha(token), userId, now() + 30 * DAY);
    res.cookie(COOKIE, `${token}.${sign(token)}`, {...cookieOptions, maxAge: 30 * DAY});
  };
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', production ? 1 : false);
  let closed = false;
  app.locals.close = () => { if (!closed) { db.close(); closed = true; } };
  app.locals.dataDir = dataDir;
  app.use((req, res, next) => {
    res.set({'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});
    if (production) res.set('Strict-Transport-Security', 'max-age=31536000');
    if (req.path.startsWith('/api/')) res.set('Cache-Control', 'no-store');
    next();
  });
  const buckets = new Map();
  const rate = (name, count, duration = 15 * 60000, perUser = false) => (req, res, next) => {
    const time = now();
    const key = `${name}:${perUser ? req.user?.id || req.ip : req.ip}`;
    if (buckets.size > 10000) for (const [k, v] of buckets) if (v.until <= time) buckets.delete(k);
    if (!buckets.has(key) && buckets.size >= 20000) return next(fail(429, 'Слишком много запросов. Попробуйте позже.', 'rate_limited'));
    const bucket = buckets.get(key);
    const current = !bucket || bucket.until <= time ? {count: 0, until: time + (options.rateLimitWindowMs || duration)} : bucket;
    current.count += 1;
    buckets.set(key, current);
    if (current.count > count) { res.set('Retry-After', String(Math.ceil((current.until - time) / 1000))); return next(fail(429, 'Слишком много запросов. Попробуйте позже.', 'rate_limited')); }
    next();
  };
  app.use('/api', rate('api', 500));
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('origin') !== origin) return next(fail(403, 'Источник запроса не разрешён.', 'invalid_origin'));
    next();
  });
  app.use(express.json({limit: '160kb'}));
  app.use('/api', (req, res, next) => {
    const token = sessionToken(req);
    req.user = token ? db.prepare('SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?').get(sha(token), now()) : null;
    next();
  });
  const authenticated = (req, res, next) => req.user ? next() : next(fail(401, 'Войдите в портал.', 'unauthorized'));
  const admin = (req, res, next) => req.user?.role === 'admin' ? next() : next(fail(req.user ? 403 : 401, 'Доступ только преподавателю.', 'forbidden'));
  app.get('/api/health', (req, res) => res.json({ok: true, service: 'sam'}));
  app.get('/api/me', (req, res) => res.json({user: publicUser(req.user)}));
  app.patch('/api/me', authenticated, (req, res) => {
    if (typeof req.body?.notificationsConsent !== 'boolean') throw fail(400, 'Укажите согласие на уведомления.');
    db.prepare('UPDATE users SET notifications_consent=? WHERE id=?').run(req.body.notificationsConsent ? 1 : 0, req.user.id);
    res.json({user: publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id))});
  });
  app.post('/api/auth/admin', rate('admin-login', 8), (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const validPassword = safeEqual(password, env.ADMIN_PASSWORD);
    if (email !== adminEmail || !validPassword) throw fail(401, 'Неверные данные для входа.', 'invalid_credentials');
    const user = db.prepare('SELECT * FROM users WHERE email=? AND role=?').get(adminEmail, 'admin');
    startSession(res, user.id);
    res.json({user: publicUser(user)});
  });
  app.post('/api/auth/logout', (req, res) => {
    const token = sessionToken(req);
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(sha(token));
    res.clearCookie(COOKIE, cookieOptions).json({ok: true});
  });
  const publicInvite = row => ({id: row.id, userId: row.user_id, label: row.label, createdAt: row.created_at, expiresAt: new Date(row.expires_at).toISOString(), usedAt: row.used_at, revokedAt: row.revoked_at});
  app.get('/api/admin/invites', admin, (req, res) => res.json({invites: db.prepare('SELECT * FROM invites ORDER BY created_at DESC LIMIT 500').all().map(publicInvite)}));
  app.post('/api/admin/invites', admin, rate('invite-create', 100, 3600000, true), (req, res) => {
    const userId = cleanText(req.body?.userId, 'Участник', 64) || null;
    const label = cleanText(req.body?.label, 'Подпись приглашения', 160);
    if (userId && !db.prepare("SELECT id FROM users WHERE id=? AND role='learner'").get(userId)) throw fail(400, 'Участник не найден.');
    const days = req.body?.expiresInDays ?? 7;
    if (!Number.isInteger(days) || days < 1 || days > 30) throw fail(400, 'Срок приглашения — от 1 до 30 дней.');
    const token = randomBytes(32).toString('base64url');
    const id = randomUUID();
    db.exec('BEGIN IMMEDIATE');
    try {
      if (userId) db.prepare('UPDATE invites SET revoked_at=? WHERE user_id=? AND used_at IS NULL AND revoked_at IS NULL').run(iso(), userId);
      db.prepare('INSERT INTO invites VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?)').run(id, sha(token), userId, req.user.id, iso(), now() + days * DAY, label);
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    res.status(201).json({invite: {...publicInvite(db.prepare('SELECT * FROM invites WHERE id=?').get(id)), token, url: `${origin}/join#token=${token}`}});
  });
  app.post('/api/admin/invites/:id/revoke', admin, (req, res) => {
    const result = db.prepare('UPDATE invites SET revoked_at=? WHERE id=? AND used_at IS NULL').run(iso(), req.params.id);
    if (!result.changes) throw fail(404, 'Приглашение не найдено или уже использовано.');
    res.json({ok: true});
  });
  app.get('/api/admin/users', admin, (req, res) => res.json({users: db.prepare('SELECT * FROM users ORDER BY created_at DESC').all().map(publicUser)}));
  app.post('/api/auth/join', rate('join', 20), (req, res) => {
    const token = cleanText(req.body?.token, 'Приглашение', 100, true);
    const email = emailOf(req.body?.email);
    const username = cleanText(req.body?.skoolUsername, 'Имя в Skool', 80, true);
    if (req.body.notificationsConsent !== undefined && typeof req.body.notificationsConsent !== 'boolean') throw fail(400, 'Неверное значение согласия на уведомления.');
    let user;
    db.exec('BEGIN IMMEDIATE');
    try {
      const invite = db.prepare('SELECT * FROM invites WHERE token_hash=?').get(sha(token));
      if (!invite || invite.used_at || invite.revoked_at || invite.expires_at <= now()) throw fail(400, 'Ссылка недействительна, истекла или уже использована.', 'invalid_invite');
      if (invite.user_id) {
        user = db.prepare("SELECT * FROM users WHERE id=? AND role='learner'").get(invite.user_id);
        if (!user || user.email !== email) throw fail(400, 'Эта ссылка выдана другому участнику.', 'invite_identity_mismatch');
        db.prepare('UPDATE users SET skool_username=?, notifications_consent=? WHERE id=?').run(username, req.body.notificationsConsent === true ? 1 : 0, user.id);
      } else {
        if (db.prepare('SELECT id FROM users WHERE email=?').get(email)) throw fail(409, 'Аккаунт уже существует. Попросите преподавателя выдать ссылку для вашего аккаунта.', 'account_exists');
        const id = randomUUID();
        db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)').run(id, email, username, 'learner', req.body.notificationsConsent === true ? 1 : 0, iso());
        user = db.prepare('SELECT * FROM users WHERE id=?').get(id);
      }
      db.prepare('UPDATE invites SET used_at=?, user_id=? WHERE id=? AND used_at IS NULL').run(iso(), user.id, invite.id);
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    startSession(res, user.id);
    res.status(201).json({user: publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(user.id))});
  });
  app.get('/api/progress', authenticated, (req, res) => {
    const row = db.prepare('SELECT * FROM progress WHERE user_id=?').get(req.user.id);
    res.json({progress: row ? JSON.parse(row.value) : {}, updatedAt: row?.updated_at || null});
  });
  app.post('/api/progress', authenticated, (req, res) => {
    const progress = req.body?.progress;
    if (!progress || typeof progress !== 'object' || Array.isArray(progress)) throw fail(400, 'Прогресс должен быть объектом.');
    const encoded = JSON.stringify(progress);
    if (Buffer.byteLength(encoded) > 128 * 1024) throw fail(413, 'Слишком большой объём прогресса.');
    const updatedAt = iso();
    db.prepare('INSERT INTO progress VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at').run(req.user.id, encoded, updatedAt);
    res.json({progress, updatedAt});
  });
  const filesFor = submissionId => db.prepare('SELECT * FROM files WHERE submission_id=? ORDER BY rowid').all(submissionId).map(file => ({id: file.id, originalName: file.original_name, label: file.label, size: file.size, mimeType: file.mime_type, downloadUrl: `/api/files/${file.id}`}));
  const submissionView = row => ({id: row.id, userId: row.user_id, assignmentId: row.assignment_id, title: row.title, description: row.description, githubUrl: row.github_url, parentId: row.parent_id, status: row.status, feedback: row.feedback, rubric: JSON.parse(row.rubric), createdAt: row.created_at, updatedAt: row.updated_at, files: filesFor(row.id), user: publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(row.user_id))});
  const ownedSubmission = (id, user) => {
    const row = db.prepare('SELECT * FROM submissions WHERE id=?').get(id);
    if (!row || (user.role !== 'admin' && row.user_id !== user.id)) throw fail(404, 'Работа не найдена.', 'not_found');
    return row;
  };
  app.get('/api/submissions', authenticated, (req, res) => {
    const rows = req.user.role === 'admin' ? db.prepare('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 1000').all() : db.prepare('SELECT * FROM submissions WHERE user_id=? ORDER BY created_at DESC LIMIT 1000').all(req.user.id);
    res.json({submissions: rows.map(submissionView)});
  });
  app.get('/api/submissions/:id', authenticated, (req, res) => res.json({submission: submissionView(ownedSubmission(req.params.id, req.user))}));
  const maxFileBytes = options.maxFileBytes ?? 10 * 1024 * 1024;
  const maxTotalBytes = options.maxTotalBytes ?? 25 * 1024 * 1024;
  const maxStorageBytes = options.maxStorageBytes ?? 800 * 1024 * 1024;
  let activeUploads = 0;
  const upload = multer({storage: multer.diskStorage({destination: stagingDir, filename: (req, file, cb) => cb(null, `${randomUUID()}.upload`)}), limits: {files: 5, fileSize: maxFileBytes, fields: 16, fieldSize: 16000, parts: 21}}).array('files', 5);
  const cleanup = req => { for (const file of req.files || []) { try { unlinkSync(file.path); } catch {} } };
  app.post('/api/submissions', authenticated, rate('upload', 30, 3600000, true), (req, res, next) => {
    if (activeUploads >= 4) return next(fail(503, 'Сейчас загружаются другие работы. Повторите через минуту.', 'upload_busy'));
    if (!req.is('multipart/form-data')) return next(fail(400, 'Отправьте работу как multipart/form-data.'));
    if (Number(req.get('content-length') || 0) > maxTotalBytes + 256 * 1024) return next(fail(413, 'Общий размер файлов — не больше 25 МБ.', 'upload_limit'));
    const stored = Number(db.prepare('SELECT COALESCE(SUM(size),0) AS bytes FROM files').get().bytes);
    if (stored >= maxStorageBytes) return next(fail(507, 'Хранилище заполнено. Сообщите преподавателю.', 'storage_full'));
    activeUploads += 1;
    upload(req, res, error => {
      activeUploads -= 1;
      if (error) { cleanup(req); return next(error); }
      let moved = [];
      try {
        const title = cleanText(req.body.title, 'Название', 160, true);
        const description = cleanText(req.body.description, 'Описание', 10000);
        const assignmentId = cleanText(req.body.assignmentId, 'Задание', 64, true);
        if (!/^(?:[JMS]-L0[1-6]|AF-[A-Z0-9-]{1,40})$/.test(assignmentId)) throw fail(400, 'Выберите задание из портала.');
        const githubUrl = cleanText(req.body.githubUrl, 'GitHub URL', 500);
        if (githubUrl) {
          let url;
          try { url = new URL(githubUrl); } catch { throw fail(400, 'Укажите ссылку на GitHub.'); }
          if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password || !/^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/(?:pull\/\d+|tree\/.+|commit\/[a-f0-9]{7,40}))?\/?$/.test(url.pathname) || url.search || url.hash) throw fail(400, 'Нужна HTTPS-ссылка на репозиторий, PR, ветку или commit на github.com.');
        }
        const files = req.files || [];
        if (!files.length && !githubUrl) throw fail(400, 'Добавьте файлы или ссылку на GitHub.');
        const total = files.reduce((sum, file) => sum + file.size, 0);
        if (total > maxTotalBytes) throw fail(413, 'Общий размер файлов — не больше 25 МБ.', 'upload_limit');
        if (Number(db.prepare('SELECT COALESCE(SUM(size),0) AS bytes FROM files').get().bytes) + total > maxStorageBytes) throw fail(507, 'Хранилище заполнено. Сообщите преподавателю.', 'storage_full');
        let labels = [];
        if (req.body.fileLabels) { try { labels = JSON.parse(req.body.fileLabels); } catch { throw fail(400, 'Подписи файлов должны быть JSON-массивом.'); } }
        if (!Array.isArray(labels) || labels.length > files.length || labels.some(label => typeof label !== 'string' || label.length > 160)) throw fail(400, 'Проверьте подписи файлов.');
        const parentId = cleanText(req.body.parentId, 'Предыдущая версия', 64) || null;
        if (parentId) {
          const parent = ownedSubmission(parentId, req.user);
          if (parent.user_id !== req.user.id || parent.assignment_id !== assignmentId) throw fail(400, 'Новая версия должна относиться к вашей работе по этому заданию.');
        }
        const id = randomUUID();
        const createdAt = iso();
        db.exec('BEGIN IMMEDIATE');
        try {
          db.prepare('INSERT INTO submissions (id,user_id,assignment_id,title,description,github_url,parent_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)').run(id, req.user.id, assignmentId, title, description, githubUrl, parentId, createdAt, createdAt);
          for (const [index, file] of files.entries()) {
            const fileId = randomUUID();
            const storageName = `${fileId}.bin`;
            const destination = path.join(uploadsDir, storageName);
            renameSync(file.path, destination);
            moved.push(destination);
            const originalName = path.basename(file.originalname.replaceAll('\\', '/')).replace(/[\x00-\x1f\x7f]/g, '').slice(0, 180) || 'attachment';
            db.prepare('INSERT INTO files VALUES (?,?,?,?,?,?,?)').run(fileId, id, storageName, originalName, labels[index]?.trim() || originalName, file.size, 'application/octet-stream');
          }
          db.exec('COMMIT');
        } catch (error) { db.exec('ROLLBACK'); throw error; }
        moved = [];
        res.status(201).json({submission: submissionView(db.prepare('SELECT * FROM submissions WHERE id=?').get(id))});
      } catch (error) { for (const file of moved) { try { unlinkSync(file); } catch {} } cleanup(req); next(error); }
    });
  });
  app.get('/api/files/:id', authenticated, (req, res, next) => {
    const file = db.prepare('SELECT f.*, s.user_id FROM files f JOIN submissions s ON s.id=f.submission_id WHERE f.id=?').get(req.params.id);
    if (!file || (req.user.role !== 'admin' && req.user.id !== file.user_id)) throw fail(404, 'Файл не найден.', 'not_found');
    res.set({'Content-Type': 'application/octet-stream', 'Content-Security-Policy': "sandbox; default-src 'none'"});
    res.download(path.join(uploadsDir, file.storage_name), file.original_name, error => { if (error && !res.headersSent) next(fail(404, 'Файл недоступен.', 'not_found')); });
  });
  app.patch('/api/admin/submissions/:id', admin, (req, res) => {
    const row = ownedSubmission(req.params.id, req.user);
    const status = req.body?.status ?? row.status;
    if (!['submitted', 'in_review', 'changes_requested', 'accepted'].includes(status)) throw fail(400, 'Неизвестный статус проверки.');
    const feedback = req.body?.feedback === undefined ? row.feedback : cleanText(req.body.feedback, 'Обратная связь', 20000);
    const rubric = req.body?.rubric ?? JSON.parse(row.rubric);
    if (!rubric || typeof rubric !== 'object' || Array.isArray(rubric) || Buffer.byteLength(JSON.stringify(rubric)) > 8192) throw fail(400, 'Проверьте оценку по критериям.');
    db.prepare('UPDATE submissions SET status=?,feedback=?,rubric=?,updated_at=? WHERE id=?').run(status, feedback, JSON.stringify(rubric), iso(), row.id);
    res.json({submission: submissionView(db.prepare('SELECT * FROM submissions WHERE id=?').get(row.id))});
  });
  app.use('/api', (req, res) => res.status(404).json({error: 'Маршрут не найден.', code: 'not_found'}));
  const publicData = new Set(['curriculum.json', 'foundations.json', 'question-bank.json', 'questions.json', 'assignments.json', 'setup-guide.json', 'agentforce.json', 'agentforce-guide.json', 'agentforce-lesson.json']);
  app.get('/data/:name', (req, res) => {
    if (!publicData.has(req.params.name)) throw fail(404, 'Материал не найден.', 'not_found');
    const filename = path.join(contentDir, req.params.name);
    if (!existsSync(filename)) throw fail(404, 'Материал не найден.', 'not_found');
    res.type('json').send(readFileSync(filename));
  });
  app.use('/data', (req, res) => res.status(404).end());
  app.use(express.static(publicDir, {dotfiles: 'deny', index: 'index.html', redirect: false}));
  app.get(['/join', '/admin', '/learn', '/submissions', '/review'], (req, res) => {
    const index = path.join(publicDir, 'index.html');
    if (!existsSync(index)) throw fail(404, 'Портал ещё не собран.');
    res.sendFile(index);
  });
  app.use((req, res) => res.status(404).json({error: 'Страница не найдена.', code: 'not_found'}));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof multer.MulterError) return res.status(413).json({error: 'Лимит загрузки: до 5 файлов, до 10 МБ каждый и 25 МБ вместе.', code: 'upload_limit'});
    const status = error.status || (error.type === 'entity.too.large' ? 413 : 500);
    if (status >= 500 && status !== 507 && status !== 503) console.error('SAM request error:', error.message);
    res.status(status).json({error: status === 500 ? 'Не удалось выполнить запрос. Повторите позже.' : error.message, code: error.code || (status === 500 ? 'internal_error' : 'invalid_request')});
  });
  return app;
}
