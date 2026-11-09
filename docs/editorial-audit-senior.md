# Senior course editorial audit

All 25 lessons, S01–S25, are fully authored in English. This is a teaching revision rather than a translation of the earlier outline. The course metadata mirrors the authored lesson titles and exercises.

## Teaching changes

- Each lesson defines its central terms, develops a Northstar scenario, includes a worked artifact or decision case, and gives a bounded exercise with acceptance criteria and three answered knowledge checks.
- The recurring people are salesperson Anna, salesperson Max, manager Oleg, and fictional client Irina. Vehicle__c and Test_Drive__c remain the core custom learning objects with a lookup relationship. Proposed fields are identified as extensions, not silently presented as existing starter metadata.
- Diagnostic lessons separate user latency, Apex CPU, database work, throughput, backlog, and allocations. They teach competing hypotheses and controlled measurements instead of treating every slow request as a SOQL problem.
- Query and locking lessons distinguish data distribution, index availability, contention, and ownership-related recalculation. They do not recommend reproducing millions of records in a Developer Edition.
- Integration lessons distinguish authoritative data, queued work, publication, subscriber processing, provider acknowledgment, and business completion. Retry and duplicate-handling exercises preserve durable business identity and uncertainty after timeouts.
- Delivery lessons separate characterization from approving old behavior, local mocks from provider verification, and code rollback from data recovery.
- Agentforce evaluation checks actions, access, repeated effects, unknown facts, and meaningful human confirmation. Automotive evaluation separates the custom teaching schema from licensed industry capabilities and current product terminology.

## Version and technical review

The examples use API 68.0 as the course baseline. Relevant official Salesforce and Git documentation was checked on 2026-11-09.

- Apex operation modes are explicit where they affect reasoning. API 67+ user-mode defaults are not confused with the historical behavior of older classes. Class sharing declarations and operation modes are discussed separately.
- Group muting is not described as a global deny. Removing one grant is not assumed to remove independent grants.
- Manual-share lifecycle accounts for Keep Manual Shares when Transferring Records. The course does not claim that manual shares always disappear on transfer.
- Deferred sharing separates Suspend, Resume, full Recalculate, completion monitoring, and access verification. It acknowledges that not every sharing mechanism is paused and that feature availability must be checked.
- Platform Event replay positions are opaque and distinct from event and business-operation identity. Publication queuing is not described as downstream completion, and retention is not treated as an unlimited archive.
- Agentforce testing constraints, possible data mutation, and Data 360 consumption are stated without inventing prices or claiming that every related operation is free.
- Automotive Cloud documentation is cited alongside current Agentforce Automotive terminology. Product access and licensing are questions to verify, not assumed Playground entitlements.

## Evidence and practice boundaries

Every supplied trace, capacity figure, event sequence, and business scenario is synthetic. None is presented as an observed Salesforce benchmark. No active Salesforce mutation or org test was performed while authoring these lessons.

Exercises offer small training-org experiments or clearly identified local/tabletop proxies. A local proxy can demonstrate an algorithm or state-machine property; it cannot certify Salesforce CPU, production sharing performance, real-provider compatibility, or large-network throughput. The capstone requires an executed implementation path for implementation acceptance and explicitly leaves a design-only submission incomplete on that criterion.

Performance claims require comparable raw observations. Access checks require the relevant limited persona. Proposed commercial, retention, and deployment decisions retain their owners and unresolved assumptions. Public artifacts use fictional identifiers and omit actual credentials and customer records.

## Validation

- Exactly 25 unique IDs, S01–S25, in the senior track.
- Each lesson contains four teaching sections, an exercise with at least five steps, at least three acceptance criteria, three answered checks, a recap, and at least two HTTPS sources.
- English-only narrative and technical examples; no Cyrillic text remains.
- After the independent review, narrative word count is 24,077, with individual lessons from 864 to 1,085 words. This counts summaries, prerequisites, objectives, section headings and prose, callouts, exercises, answered checks, and recaps; it excludes code, sources, and illustration metadata.
- Each lesson has a distinct restrained illustration subject, accessible alt text, and generation prompt. Image generation is intentionally handled separately by the main authoring workflow.
- Cross-course metadata uses the exact authored titles and all 25 lesson IDs. Plain mentions of previous lessons remain prose rather than unsupported application links.

## Remaining validation for a real course run

A teacher should execute selected Salesforce exercises in a supported training org, verify current feature and license availability, and review actual learner evidence. The course does not imply that source review alone proves compilation, deployment, access behavior, or provider compatibility in a specific org. Recheck version-sensitive sources when the platform release or exercise environment changes.

## Independent review of the final lessons — 2026-11-09

All 25 full lessons were reread against the actual starter schema and course metadata. The following substantive issues were corrected:

- **S08:** The supplied CSV has six appointment input rows, not a vehicle fixture. The lesson now specifies a separate V-001 through V-005 fixture and distinguishes five business identities from six source rows. The older A-101 snapshot is explicitly superseded before upload, so CSV ordering is not treated as a version-resolution policy. Preflight decisions and API result totals remain separate.
- **S14 and S15:** Pending and Rescheduled were external or interface concepts, but readers could have mistaken them for starter picklist values. The lessons now state the actual restricted values and require separate integration state or an explicit mapping. The event fixture does not claim to contain the appointment time required for a reschedule.
- **S19:** Added the missing version-one provider fixture so the flat-to-nested contract comparison has both inputs. Both contracts are clearly fictional, and new external status values cannot be assigned directly to the starter picklist. Replaced the stale underscore-form HTTP testing URL with the verified current hyphen-form URL; the same source-only correction was applied to M-Q15 and the canonical quiz source manifest.
- **S20:** A fresh read alone does not close a concurrent-write race. The explanation now requires an appropriate conditional write or coordinated read/compare/update, and states the callout boundary of Apex FOR UPDATE locks. The supporting Apex locking reference was added.
- **S21:** Added the intentionally unsafe cancellation pseudocode that the review exercise discusses. It is labelled as non-executable pseudocode and makes the missing caller authorization visible.
- **S25:** Added the Node.js 24 prerequisite, exact file/run instructions, and expected deterministic counts. The fixture remains a local algorithm example rather than a Salesforce performance claim.

Version-sensitive Apex defaults, explicit operation modes, deferred-sharing completion steps, and Agentforce testing constraints were checked against current official Salesforce pages. No change was needed to those explanations.

A direct HTTP sweep covered 51 unique source URLs: 19 responded successfully and 32 Salesforce Developer/Architect URLs denied that automated client with HTTP 403. These denials were not treated as broken documentation. The web research tool successfully retrieved current key technical pages, including the optimizer, archive, CPU, query-plan, API-version, sharing-deferral, and Agentforce references. The HTTP testing path correction above was verified through the current official page.

The only complete JavaScript example in these tracks was executed with Node.js v24.22.1. S25 printed 1,640 comparisons and 80 matches. Assertions verified both counts and equality with an independently constructed Map result. All three JSON example blocks parsed. The 36 Senior and Job Research lessons passed local checks for IDs, titles matching their course metadata, required learning fields, English text, and HTTPS source references.

No Salesforce org commands, Apex compilation, Apex tests, deployments, live-agent runs, provider calls, or production benchmarks were performed. The S13 class remains an illustrative access contract; its caption explicitly says it is not a complete endpoint.
