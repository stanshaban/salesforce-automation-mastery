# Operate SAM

Environment: [sam-portal-production.up.railway.app](https://sam-portal-production.up.railway.app). Source: [stanshaban/salesforce-automation-mastery](https://github.com/stanshaban/salesforce-automation-mastery). This guide describes setup and verification; it does not certify the availability of a particular deployment.

## Railway configuration

Use the repository's root `Dockerfile`. It runs Node.js 24 and `node server/index.mjs`. `railway.json` defines `/api/health` as the health check. The application listens on `0.0.0.0` and the port in `PORT`.

Attach **one persistent volume mounted at `/data`** and set `DATA_DIR=/data`. The volume is available at runtime, not during the build. See [Railway volumes](https://docs.railway.com/volumes).

Keep **one replica and one application process**. SQLite, temporary-upload cleanup, and request counters assume that configuration. Multiple replicas require shared database/file storage and shared rate limits.

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `APP_URL` | `https://sam-portal-production.up.railway.app` |
| `DATA_DIR` | `/data` |
| `ADMIN_EMAIL` | One instructor email address |
| `ADMIN_PASSWORD` | A separate random secret, at least 16 characters |
| `SESSION_SECRET` | Another random secret, at least 32 characters |
| `PORT` | Service port; defaults to `3000` |

`ADMIN_EMAILS`, SMTP, Resend, and other mail variables are unused. Set secrets in Railway Variables and keep them in a password manager. Replace the example values in `.env.example`. `APP_URL` must exactly match the browser origin: state-changing requests check Origin, and production requires HTTPS.

The disk directory `/data` and public URLs under `/data/*.json` are separate. Only explicitly allowed learning JSON is public. `/data/sam.sqlite` and `/data/uploads` are not served directly.

## Authentication and invitations

The instructor signs in on the instructor login form using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Creating a learner record with the same email does not grant an administrator role.

In the instructor area, create an invitation for a new learner. The raw link is shown **once**; deliver it through your agreed private channel. The database stores a hash. Its secret follows `#token=`, so it is not included in the browser's URL request to the server; redemption sends it in the request body.

Invitations expire after 7 days by default; the form offers 1, 7, and 30 days. Used or revoked invitations cannot be redeemed. Anyone holding the link can attempt to use it, so do not publish it in a shared chat or Issue.

For a returning learner, select the **existing user** when creating a new link. A general invitation cannot attach to an existing account merely by supplying its email. A new targeted link revokes that user's older unused links. The learner must enter the email stored on that profile.

Sessions last 30 days. Production cookies use HttpOnly, Secure, and SameSite=Lax; logout removes the current session. Learners supply their own email and Skool username: this does not verify email ownership or Skool payment. Email sending is absent. Optional future-notification consent is stored separately and can be withdrawn in the profile.

## Submissions and limits

Learners see their own submissions; the instructor sees the full queue. For a new version, the learner opens a previous submission and resubmits. The instructor changes its status and leaves feedback; earlier versions remain available.

Each submission accepts up to **5 files**, at most **10 MiB each** and **25 MiB combined**, plus an optional HTTPS GitHub URL. Total committed attachments are capped at **800 MiB**. Leave additional volume space for the database, temporary uploads, and backups. The server does not read a `MAX_STORAGE_MB` setting; the current limit is defined in `server/app.mjs`.

Files receive generated storage names. The server neither executes uploaded code nor extracts archives. It downloads files as attachments after checking ownership or the instructor role. This is not antivirus scanning or automatic Salesforce validation. Inspect unfamiliar solutions in a separate learning environment without work credentials.

There is currently no interface for bulk deletion, user export, ownership transfer, or revoking an individual active session. Do not delete files from `uploads` independently of their database records: downloads would break. Before planned deletion, take a backup and prepare coordinated database/file maintenance. Review statuses are unrelated to payment; agree the scope of personal review separately.

## Backup and restore

Enable volume backup scheduling in Railway and take a manual backup before database-structure changes. Include the whole volume: SQLite and uploaded files must be restored together. Check current scheduling, retention, and limits in the Backups tab. See [Railway backups](https://docs.railway.com/volumes/backups).

Do not copy only `sam.sqlite` while the application is running: recent writes can be in `sam.sqlite-wal`. For a manual file copy, stop the application first and preserve the entire data directory. Backups contain email, submissions, feedback, and session hashes; keep them in private storage.

Before restoring, preserve the current state and record the selected backup time. In Railway, select the backup, choose Restore, review the replacement volume, and apply the deployment. Railway retains the previous volume separately; do not remove it before verification. Submissions created after the backup time will be absent from the restored state. Follow the current [Railway restoration procedure](https://docs.railway.com/volumes/backups).

After restoration, check login, the submission list, one attachment download, and a progress update. Changing `SESSION_SECRET` invalidates old cookies: the instructor signs in with the password, and learners need fresh links. Changing `ADMIN_PASSWORD` alone does not revoke existing sessions. There is no bulk active-invitation revocation interface; revoke relevant invitations individually in the instructor area before reissuing them when needed.

## Verify after deployment

1. Open `/api/health`. Expect HTTP 200 and `{"ok":true,"service":"sam"}`. This proves that the process responds; it is not a backup or attachment-access test.
2. Check the home page, all three tracks, self-checks, and workspace guide. The browser console should show no failed learning-data requests.
3. Sign in as instructor. Create a test invitation and redeem it in a separate browser profile. A second redemption must be rejected.
4. As that learner, save progress and submit a small synthetic file with a label. Verify that the instructor can read and review it and a different learner cannot.
5. Restart the service. Verify that the profile, progress, submission, and file persist. If data disappears, check the volume and `DATA_DIR` before issuing more invitations.

For HTTP 403 on a write, check `APP_URL` against the browser domain. For 429, wait for `Retry-After`; rate counters are in process memory. For 507, inspect storage usage. For startup failures, check Node 24, secrets, volume access, and logs without publishing personal data from them.

`portal-tests.yml` checks HTTP scenarios and course data in an isolated temporary environment. CI receives no Railway secrets and does not deploy. `learner-checks.yml` separately checks the learner-project structure and does not execute submitted Apex.
