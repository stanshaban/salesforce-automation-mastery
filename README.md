# Salesforce Automation Mastery

SAM is an English-language Salesforce developer workshop with 98 complete lessons: Junior (28), Middle (34), Senior (25), and Job Research (11), plus a separate ten-chapter Agentforce project. Lessons include explanations, worked examples, practical tasks, answered self-checks, and an individual generated illustration. The portal also provides 90 quiz families with 30 semantic variants, workspace setup, and assignment submissions for instructor review.

[Open the portal](https://sam-portal-production.up.railway.app) · [Server health](https://sam-portal-production.up.railway.app/api/health) · [Repository](https://github.com/stanshaban/salesforce-automation-mastery)

The environment URL is not release verification. After each deployment, check login, uploads, and submission access using the [operations guide](docs/operations.md).

## For learners

1. Open the portal and choose your track. Learning materials and self-checks are available to guests; guest progress stays in that browser.
2. Complete the browser foundations, then the VS Code and Salesforce CLI setup when the lessons introduce development tools. Use your own training Salesforce org.
3. Ask the instructor for a single-use invitation to create your learner account. Enter your email and Skool username. Learners do not need a password.
4. Upload your solution and label the files. You can also attach a pull-request URL from your own GitHub repository. Submissions, instructor feedback, and later versions remain in your account.

Read the [submission guide](docs/submissions.md), [review criteria](docs/reviewer-guide.md), and [Salesforce DX starter guide](starter/salesforce/README.md).

Email addresses are stored without address verification. Notification consent is optional, off by default, and changeable in the profile. Email delivery is not connected. Invitations do not automatically verify Skool membership or payment; the instructor issues them.

## Course content and publishing

Read the complete lessons in the portal. Each lesson and learning path has a downloadable text export. The [illustration library](https://sam-portal-production.up.railway.app/illustrations.html) shows all lesson covers. See the [Skool publishing guide](docs/skool-publishing-guide.md) for quote-style callouts and manual transfer of text and images.

The canonical lesson files live in `data/lessons/`. After editing lessons or course metadata, regenerate the public curriculum and text exports:

```sh
npm run build:content
npm run check
```

The repository includes 99 lesson covers and four course covers. Exact generation prompts are recorded in `docs/image-prompts/`. These are illustrations, not screenshots or measured architecture diagrams.

## Run locally

Use **Node.js 24**. The server uses built-in SQLite, Express, and Multer. It needs neither a separate database server nor an email provider.

```sh
npm ci
cp .env.example .env
```

In `.env`, set `ADMIN_EMAIL`, a random `ADMIN_PASSWORD` of at least 16 characters, and a separate `SESSION_SECRET` of at least 32 characters. For local work, keep `NODE_ENV=development`, `APP_URL=http://localhost:3000`, and `DATA_DIR=./.runtime`. Generate each secret separately:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Start the application:

```sh
node --env-file=.env server/index.mjs
```

Open `http://localhost:3000`. On the login page, sign in as the instructor, create an invitation, and test it in a separate browser profile. Never commit `.env`, the database, uploaded work, or invitation URLs.

## Checks

```sh
npm test
npm run check
node scripts/check-submission.mjs --root .
```

HTTP tests cover authentication, single-use invitations, access isolation, progress, uploads, reviews, and persistence after restart. The learner-project checker reads file structure. It does not execute Apex or establish Salesforce configuration security; those require training-org tests and review.

## Repository layout

| Directory | Purpose |
| --- | --- |
| `public/` | Portal interface |
| `data/` | Public lessons, course metadata, and questions |
| `server/` | Authentication, invitations, SQLite, uploads, and reviews |
| `starter/` | Salesforce learning projects |
| `docs/` | Submission, review, recording, and operating guides |
| `test/` | Server and quiz checks |

The public repository contains educational scenarios and source references, not private interview notes or learner submissions. A redistribution license has not been selected; no `LICENSE` file has been added automatically.
