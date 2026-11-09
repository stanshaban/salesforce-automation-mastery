# Review SAM submissions

The instructor area of the portal is the primary queue. Learners can attach a GitHub PR to the same submission; public Issues are a fallback.

## Take a submission

1. Open its ID, assignment, version, and files. Match the author to the learner using portal information. Do not copy email or Skool identity into public Issues or PR comments.
2. Confirm that personal review has been agreed and the work fits the selected checkpoint. Submission alone does not establish payment or entitlement to a paid service.
3. Identify the reviewed version: portal submission ID or exact commit SHA. If code changes during review, state which version the decision covers.
4. Check that your account can access any private PR. Do not request the learner's tokens or Salesforce login.

## Read the work

Start with the requirement and evidence, then inspect the changes. Distinguish a learner observation, an actual test result, and an unverified claim. Uploaded archives and code are untrusted: do not automatically run their scripts or commands. Inspect their contents first, and use a separate training environment with synthetic data for necessary execution.

Check:

- Required behavior and negative scenarios.
- CRUD, FLS, and record sharing in the intended execution context and API version.
- Bulk input, repeat requests, failures, and partial success where applicable.
- Tests that detect incorrect behavior rather than merely raising coverage.
- Clear responsibilities and recovery steps.
- The learner's ability to explain a decision and adapt to a new condition.

## Rubric

| Area | Points |
| --- | ---: |
| Required behavior | 25 |
| Access and data | 20 |
| Volume and reliability | 20 |
| Tests and evidence | 15 |
| Maintainability | 10 |
| Explanation | 10 |

The suggested pass threshold is 80/100 with no unresolved critical issue. Adapt irrelevant categories to the assignment before reviewing. A polished interface or high coverage cannot compensate for a data exposure. This is a SAM assignment result, not an official Salesforce grade or certification.

## Feedback format

> Observation → scenario → consequence → what to verify → direction for a correction.

Do not provide the complete solution in the first comment. Explain the cause and a test that exposes it. Separate critical defects, significant findings, and optional improvements.

Finish with:

1. The portal status: `in_review`, `changes_requested`, or `accepted`. Ask for missing evidence in the feedback when clarification is needed.
2. The reviewed version and a short explanation.
3. At most three main correction steps.
4. One question for the learner's technical defense.

For a PR in the learner's repository, leave line comments there. Do not merge the solution into the course repository. A public fallback Issue needs only a status and a review link without personal data. Optional queue labels include `submission`, `needs-review`, `changes-requested`, and `accepted`; labels do not establish payment or identity.

## Automated checks and their limits

The local checker and GitHub workflow inspect structure and some potentially unsafe files. This is limited static checking. Compilation, deployment, Apex execution, sharing correctness, and assignment acceptance need separate evidence. The core starter does not contain completed assignment solutions.

The PR checker comes from the base commit. Its workflow uses `pull_request`, a temporary GitHub-hosted runner, read-only permissions, and no Salesforce secrets. Do not switch to `pull_request_target` to make secrets available to untrusted work. See [GitHub's pull-request security guidance](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target).
