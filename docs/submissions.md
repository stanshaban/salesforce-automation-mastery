# Submit a SAM assignment

Use the assignment card in the portal as the primary submission route. Attach your files, describe what you checked, and send the work to the instructor queue. A GitHub pull request is an optional way to show changes line by line.

Self-checks help identify gaps. Submitting work requests a review; it does not automatically pass the assignment, buy a service, or guarantee a personal review deadline.

## 1. Prepare a reviewable package

Choose one assignment ID, such as `J-L01`. Collect the following in a separate folder:

- Only the assignment's metadata and code from your training org.
- A short README: requirement, changes, reproduction steps, and known limitation.
- Acceptance criteria with actual results and supporting evidence.
- Results of checks you really ran. For Apex, include test names and outcomes; for declarative work, include reproducible scenarios.
- A brief explanation of a significant design decision and any AI assistance.

Use synthetic records only. Exclude `.sf`, `.sfdx`, `.git`, `node_modules`, `.env`, keys, authentication URLs, tokens, customer exports, and full unfiltered logs. A screenshot supports an observation but does not replace source files. Inspect the archive and diff before submission.

The evidence template is `starter/submissions/TEMPLATE/submission.example.json`. Copy it to `starter/submissions/<ID>/submission.json`, replace examples with your observations, and run from the repository root:

```sh
node scripts/check-submission.mjs
```

This checks structure and some potentially unsafe files. It **does not** compile Apex, run Salesforce tests, or prove correct permissions.

## 2. Submit through the portal

1. Open the assignment card and choose **Submit work**.
2. Sign in with the instructor-issued invitation. Enter your Skool username so the instructor can identify your membership.
3. Attach the prepared files and a short description. Optionally add the PR URL from your own GitHub repository.
4. Check the assignment ID, file labels, and attachment list before submitting.
5. Keep the submission ID. After feedback, open that submission and send a new version describing the correction. Do not present an old test result as evidence for changed code.

A submission accepts up to 5 files, at most 10 MiB each and 25 MiB in total. The portal does not need your Salesforce password, GitHub token, or administrator access to a work org. Personal review and its scope are agreed separately from file submission. Email delivery is not connected.

## 3. Optional GitHub workflow

Use this route to practice pull requests and receive comments on specific lines.

1. Open the [SAM template](https://github.com/stanshaban/salesforce-automation-mastery) and select **Use this template → Create a new repository**, using the default branch. Choose public only if you want everyone to see your learning code; private is also supported.
2. Clone **your own** repository. Confirm that `origin` points to it.
3. Create an assignment branch from your `main`:

```sh
git switch main
git pull --ff-only
git switch -c submission/J-L01
```

4. Work inside `starter/salesforce`. Retrieve only the metadata required for your change. Inspect the diff in VS Code Source Control before committing.
5. Stage specific paths:

```sh
git add starter/salesforce/force-app starter/submissions/J-L01
git diff --cached
git commit -m "Complete J-L01 data model"
git push -u origin submission/J-L01
```

6. Create a PR **inside your repository**, from `submission/J-L01` to `main`. Complete the PR template. Do not submit your solution as a PR to the course repository.
7. For a private repository, give the agreed instructor access before review. A URL alone does not grant private-code access. You do not need to make the repository public to submit.
8. Add the PR URL to your portal submission. Record the final commit identifier:

```sh
git rev-parse HEAD
```

9. Keep the PR open. Add corrections as new commits on the same branch, and identify the updated commit in your review notes. After review, you may merge the work into your own `main`.

A template creates an independent repository. Your PR therefore connects branches in **your repository**, keeping learner solutions separate from course source.

## Public Issues as a fallback

If the portal is unavailable, the [Submission issue form](https://github.com/stanshaban/salesforce-automation-mastery/issues/new?template=submission.yml) is a backup route. This queue is **public**. Include only the assignment ID, PR URL, commit SHA, and a short neutral status. Do not include email, Skool identity, private code, attachments, or evidence containing personal data.

Use the instructor's agreed private channel if even a link to a private repository should remain private. An issue is optional, not a required step in a portal submission.

## What a green GitHub check means

`Learner structure checks` reads metadata and the submission manifest. It uses the checker from the PR's base commit and does not execute proposed learner files. The job has no Salesforce credentials, connects to no org, and deploys no code.

A green result means that the limited structural checks passed. Correctness, access control, bulk behavior, and solution quality still need actual test evidence and review.

## Sources

- [GitHub: create a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).
- [GitHub: pull-request templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository).
- [GitHub: secure Actions use](https://docs.github.com/en/actions/reference/security/secure-use).
- [Salesforce DX project configuration](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-ws-config.html).

Reviewed November 9, 2026.
