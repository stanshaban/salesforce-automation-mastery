# Middle curriculum editorial audit

Reviewed on 2026-11-09. Scope: M01–M34 and the matching Middle course metadata. All 34 lesson files contain instructional English prose, a worked Northstar example, guided steps with expected results, failure analysis, an exercise, at least three answered review questions, sources, and a distinct illustration brief. They are authored lessons, not completion claims for a learner's Salesforce org.

## Audience and sequencing

The entry point requires the Junior foundations or equivalent practical evidence. The lessons consistently identify Anna and Max as salespeople, Oleg as manager, and Irina as a fictional customer Contact. They distinguish a business participant from a Salesforce User and explain unfamiliar mechanisms before asking the learner to configure them.

Titles describe their actual subject. Curiosity headlines, rhetorical mystery, and assumed workplace vocabulary were removed. Each lesson follows a mechanism → concrete example → guided inspection → failure boundary progression. Product terminology is attached to a specific business action rather than introduced as an unexplained list of features.

The original sequence was retained with the following clarifications:

- M01–M06 separate object, field, record, business-operation, and execution-context decisions. Muting is group-local; implicit sharing is not inferred from arbitrary lookups; restriction rules are not a universal deny. M04 owns a specific sharing reason rather than all access to a record.
- M07 includes validation rules as a legitimate simpler answer when the requirement is preventing invalid saves. M08 separates transaction-local recursion control from durable operation identity. M09 introduces configuration at a clear boundary instead of prescribing a framework. M10 tests local rules before introducing HTTP mocks.
- M11–M14 distinguish acceptance from completion, request identity from job identity, and a schedule from the workload it launches. Batch unit tests stay within one execute scope; a 401-record multi-scope run is explicitly separate integration evidence. Stateful instance fields are not confused with static state.
- M15–M19 use a declared fictional warranty contract. Mandatory work needs no provider, server, credentials, purchase, or public endpoint. HTTP and generated SOAP clients use different mock interfaces. Upsert, idempotency, retry, and reconciliation are kept distinct. Attempt history preserves failures instead of overwriting them with the final success.
- M20 distinguishes structured SOQL filtering from SOSL discovery and explains asynchronous search indexing. M21–M25 distinguish lifecycle phases, wire-owned data, imperative writes, DOM communication, LMS scope, local Jest evidence, and component ownership. A successful write followed by failed refresh is represented accurately.
- M26–M27 separate commit, publication acceptance, delivery, subscriber completion, durable effects, and checkpoints. The provided replay trace is executable as a reasoning exercise without an external subscriber. Replay IDs are opaque and are not business identifiers.
- M28–M30 teach observable Git state, focused review, truthful check reporting, deployment dependencies, recovery, and integrated failure evidence. No workflow is assumed to have run merely because a configuration file exists.
- M31–M33 have complete mandatory analysis/simulation paths. Enhanced Omni-Channel, a live Employee Agent org, and Automotive Cloud are optional product environments. Their licenses do not block the core defense in M34.

## Schema and dependency review

The actual starter was inspected. Vehicle__c has Text Name, VIN__c, Model__c, and Status__c. Test_Drive__c has Auto Number Name, Vehicle__c and Customer__c optional lookups, Scheduled_At__c, and Status__c. Both custom objects use private sharing and independent ownership. Activities are not enabled in the starter; the Middle lessons do not silently depend on activities being enabled.

Every additional model is introduced before use:

| Lesson | Explicit new dependency |
|---|---|
| M04 | Project__c, Manager__c, and Assigned_Manager Apex sharing reason |
| M05 | Test_Drive__c.Region__c and User.SAM_Region_Limited__c |
| M08 | Confirmation_Receipt__c with Test_Drive__c and unique external Operation_Key__c |
| M09 | Warranty_Policy__mdt with enabled, attempt-limit, and timeout fields |
| M12 | Warranty_Request__c with vehicle, unique request key, status, attempts, result, error code, and job ID |
| M14 | Optional Processing_Run__c coordination schema, fully enumerated |
| M18 | Optional Payload_Fingerprint__c, with its purpose and type declared |
| M19 | Integration_Attempt__c history fields, fully enumerated |
| M23 | SAM_Visit_Selected message-channel metadata |
| M26 | Test_Drive_Confirmed__e with appointment ID and business key |

The custom training Vehicle__c is never presented as Automotive Cloud's standard Vehicle object. Automotive mappings remain conceptual until actual standard-object APIs and relationships are verified in an entitled environment.

## Current technical corrections

Official sources were checked for the version-sensitive areas. API 67+ database operations default to user mode, and omitted class sharing declarations default to with sharing. Older omission preserves sharing context; it is not simply an explicit without sharing declaration. The lesson reviews database mode separately from class sharing.

SharingReason metadata now supports eligible standard objects from API 68.0. The old universal custom-object-only statement was therefore avoided. The practical sharing kata still uses a declared custom Project__c for a controlled schema.

Restriction rules have object, edition, and context limits. Current Enhanced Omni-Channel documentation is used instead of a new dependency on retired Standard Omni-Channel. Agentforce uses the current Employee Agent Builder and subagent terminology. The Automotive trial page is referenced as an optional current offering whose terms must be checked, not a course prerequisite.

## Code and evidence policy

Complete minimal examples are explicitly identified, including the mock-only HTTP client, lifecycle observation component, and message-channel declaration. Fragments identify their required variables, classes, or controller methods. Placeholder names are not described as built-in Salesforce APIs. The SOAP lesson points to actual official generated-code examples instead of inventing WSDL-generated types.

Learners must compile, deploy, and test their own implementation. No Apex compilation, Salesforce org deployment, live provider call, product activation, or learner-specific security test was performed during authoring. Local schema validation does not stand in for those checks. A green mock test is not represented as live credential or provider compatibility evidence.

## Validation

- 34/34 expected lesson IDs exist, in M01–M34 order in course-meta-middle.json.
- Every file passes JSON parsing and required-field checks.
- Every lesson has four instructional sections, a guided exercise with acceptance criteria, at least three answered questions, sources, and a unique illustration prompt.
- All lesson and metadata content is English; a Cyrillic-character scan found none in the lesson files.
- Instructional text counts, excluding source lists and illustration prompts, range from 770 to 907 words; total 27,960 words. This count includes code, review questions, and exercise instructions.
- Illustration prompts each specify one concrete subject, minimal vector treatment, and no embedded text, logos, or photorealistic people. No generated image is falsely claimed to exist.

## Remaining implementation checks

The lesson reader should render code blocks, numbered guided steps, callouts, and answered review questions accessibly. Images must be generated and associated by the parent publishing workflow. Salesforce examples require the learner's actual schema, permissions, API version, and execution evidence. Live product clinics should retain their optional label in the UI and exported materials.
