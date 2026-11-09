# How a Salesforce Transaction Runs

S01 · senior · About 55 minutes with practice

![A shared platform foundation supporting several clearly separated application workspaces](https://sam-portal-production.up.railway.app/lesson-images/S01.jpg)

Trace one booking from a browser action to committed records, then separate that transaction from the work that follows it.

## Before you begin

- Complete the Middle track or explain SOQL, DML, triggers, and Queueable Apex.
- Know the starter Vehicle__c and Test_Drive__c objects and their lookup relationship.

## What you will learn

- Distinguish application metadata, business records, and execution state.
- Draw transaction and trust boundaries without inventing Salesforce internals.
- Explain which application decisions remain important on Hyperforce.

## 1. Start with Anna's booking

Anna is a salesperson at Northstar Motors. She selects a Vehicle__c record and creates a Test_Drive__c for client Irina. The field definitions, validation rules, Apex classes, and Flow definitions are metadata: instructions that describe how the application behaves. The particular vehicle and appointment are business data. Changing a field definition and inserting an appointment are different operations, even though both can begin in Setup or a browser.

A runtime is the software that interprets those definitions and executes the application. You do not need to know the physical database layout to design this feature. You do need to know which operations share a transaction. A transaction is a unit of work whose database changes can commit together or roll back together when its execution fails. The user's click is an entry point, not a guarantee that everything it eventually causes belongs to one transaction.

> **💡 Key idea**
>
> Draw the boundary around work that commits together, not around every action that has the same business purpose.

## 2. Follow the save through the boundary

Begin your diagram with identity and input. Anna's authenticated session identifies the caller; the application still needs to validate the requested vehicle, appointment time, and permitted operation. Object permissions, field permissions, and record access answer different questions. For Apex compiled at API 68.0, database operations default to user mode. Prefer an explicit access contract in examples so reviewers do not have to infer the intent from a class version.

Next draw the synchronous save path: request handling, applicable platform validation and automation, and the commit decision. This is a conceptual boundary diagram, not a replacement for the complete order-of-execution reference. A before-save change to the same appointment belongs inside that work. A Queueable job that runs later gets a separate execution context. If it fails after the appointment has committed, its failure does not travel backward and undo the earlier commit.

The synthetic trace below gives you events, not measurements from a Salesforce org. The reservation and notification are one business process but two technical transactions. That distinction determines what Anna can be told. 'Booking saved; notification pending' is more accurate than treating an enqueued notification as proof of delivery.

> **🔎 Check your understanding**
>
> Ask what remains true if the asynchronous step fails ten minutes after the browser reports success.

**Synthetic boundary trace; these events were written for this lesson**

```text
T1 request: Anna submits appointment for Irina
T1 validation: vehicle exists; requested time accepted
T1 database: Test_Drive__c created
T1 commit: appointment becomes durable
T2 Queueable: notification attempt starts later
T2 failure: external service times out
Observed business state: appointment exists; delivery is unconfirmed
```

## 3. Why shared infrastructure affects your design

Multitenancy means a platform serves multiple tenants while maintaining separation between their data and operations. An org is a tenant boundary; it is not permission for every user inside that org to see every record. Governor limits constrain individual executions, while other allocations apply across the org or a time window. These controls are part of the platform contract, so a design should budget work rather than assume unlimited processing.

Hyperforce concerns Salesforce's infrastructure architecture and deployment on public-cloud infrastructure. It does not turn an inefficient nested loop into an efficient algorithm, merge independent transactions, or remove the application security model. Regional availability and organizational requirements can affect an infrastructure decision, but they do not establish a particular CPU entitlement for your code.

Separate facts from assumptions on the drawing. Label an application service, an org boundary, and a conceptual platform layer. Do not invent a specific number of servers, a physical table layout, or a database engine for the customer's instance. If a requirement depends on such an internal detail, identify the supported Salesforce contract or an explicit question for Salesforce instead.

> **⚠️ Watch out**
>
> An architecture diagram should expose important uncertainty instead of hiding it behind detailed-looking infrastructure boxes.

## 4. Design a visible recovery path

Oleg, the manager, needs to distinguish an appointment that was never created from one whose notification failed. A useful application status might track Pending, Delivered, and Needs attention for the notification separately from the appointment's booking status. Those fields are a proposed extension, not fields already supplied by the starter. Keep the business state and delivery state separate so a retry cannot accidentally rebook Irina.

Measure each boundary independently in a permitted training environment: whether the appointment exists after the save, whether a queued job reached a terminal status, and whether a mocked recipient acknowledged the message. A screenshot of the appointment proves neither a network delivery nor the correctness of a retry. In a paper-only exercise, label every status transition as a prediction and explain how a future experiment would verify it.

> **⚡ Try it**
>
> Use one booking identifier across the diagram, but give each transaction and delivery attempt its own identifier.

## ⚡ Independent practice: Draw the booking boundary map

Create a one-page diagram and a state table for Anna's booking. Use the synthetic trace; no Salesforce connection is required.

1. Draw browser, Salesforce synchronous transaction, committed appointment, async worker, and external recipient.
2. Place metadata and business data in different boxes; annotate where identity and access are checked.
3. Add three failure cards: validation failure before commit, worker failure after commit, and successful delivery with a lost response.
4. For each card, state whether an appointment exists and what Anna and Oleg should see.
5. If using a training org, verify only one small save and a mocked asynchronous failure; record API version and the observations separately from the supplied trace.

### Your work is ready when

- The diagram has explicit commit boundaries and does not claim Hyperforce removes limits.
- A worker failure leaves the committed appointment intact.
- Every claim is labelled as a documented platform rule, a synthetic case result, or an observation from your own experiment.

> **💡 Key idea**
>
> Optional extension: Explain why a single business transaction can require reconciliation across several technical transactions.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does org isolation replace record sharing?

**Answer:** No. Tenant isolation separates organizations; sharing and other permissions govern access inside an organization.

### 2. Can a failed Queueable automatically roll back an appointment committed earlier?

**Answer:** No. The later job is a separate transaction. Recovery must handle the existing appointment and failed follow-up explicitly.

### 3. Why state the Apex API version?

**Answer:** Versioned behavior can affect execution defaults. API 68.0 uses the newer user-mode defaults; explicit access modes make the intended contract easier to review.

## What to take away

- Metadata describes the application; records describe individual business entities.
- Commit boundaries determine what can roll back together.
- Infrastructure changes do not replace efficient code, access design, or recovery planning.

## Sources and further reading

- [Salesforce architecture basics](https://architect.salesforce.com/docs/architect/fundamentals/guide/architecture-basics)
- [Platform multitenant architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-multitenant-architecture)
- [Set an access mode for database operations](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-enforce-usermode.html)


---

# Turn a Performance Complaint into a Measurable Requirement

S02 · senior · About 55 minutes with practice

![A simple stopwatch beside a user journey and a measurable target marker](https://sam-portal-production.up.railway.app/lesson-images/S02.jpg)

Convert 'Salesforce is slow' into a specific user journey, a comparison method, and an agreed improvement target.

## Before you begin

- Understand the transaction map from S01.
- Be able to distinguish browser rendering, an Apex request, and background work.

## What you will learn

- Define latency, throughput, and backlog in plain terms.
- Choose a user-centered start and finish point for a measurement.
- Write an evidence request that separates observations from explanations.

## 1. One complaint can describe four different problems

Oleg says that Salesforce is slow, but Anna says booking a test-drive is acceptable. Max says opening the vehicle list is frustrating, and the integration team says the overnight import finishes after staff arrive. These statements do not contradict each other. They refer to different operations, users, data sets, and finish lines. Treat the complaint as a request to investigate, not as proof that Apex or the database is responsible.

Latency is how long one operation takes from a defined start to a defined finish. Throughput is how many useful operations finish in a period. Backlog is work waiting to finish. Improving one does not guarantee improving the others. Moving work into a queue can reduce Anna's wait while increasing the time before Oleg sees an updated report.

> **💡 Key idea**
>
> Use the name of a user action, not the name of a technology, as the first row of a performance requirement.

## 2. Make the measurement boundary explicit

For a vehicle search, a useful start is Max submitting the search, and a useful finish is the moment the result rows can be used. A network response arriving is an intermediate point if the browser then spends another second rendering. For a booking, distinguish 'saved in Salesforce' from 'confirmed by the external scheduling system.' If the product only promises the first, measuring the second without saying so creates an impossible comparison.

Write the population beside the metric: user persona, permissions, browser, device, network, selected filters, approximate record distribution, and relevant automation. A broad-access administrator can produce different results from Anna. A warm cache can hide the cost of a fresh visit. Record these conditions before comparing a change, and keep them reasonably consistent afterward.

A percentile summarizes a distribution. The 95th percentile, usually written p95, describes a value at or below which roughly 95 percent of observations fall, under a stated calculation method. A median alone can hide a minority of very slow interactions. With ten observations, do not present p95 as a stable enterprise service commitment; report the small sample and individual values.

> **🔎 Check your understanding**
>
> A reviewer should be able to reproduce the start, finish, population, and sample rules from your measurement note.

## 3. Read the case without inventing evidence

The table below is a synthetic intake artifact. It contains business complaints and possible targets, not verified timings. 'Usually three seconds' is a person's estimate. It is useful for prioritization, but it is not a measured baseline. A target becomes meaningful only after the business confirms that the finish line represents useful work.

Prioritize the list-open journey if Max repeats it many times per hour and the wasted time is material. Investigate the import separately because its deadline and recovery needs differ. Do not merge them into a single average named 'Salesforce performance.' Assign an owner to each measurement and define how a missed target changes the business process, such as delayed customer calls.

Your first hypothesis might be that a large initial payload makes the list slow. Write the evidence that would support or reject it: response size, transfer time, browser rendering time, and the selected columns. A hypothesis should be testable. 'The platform is bad' and 'we need more asynchronous Apex' do not specify observations that could prove them wrong.

> **⚡ Try it**
>
> Ask for one representative slow example and one comparable acceptable example before requesting a broad production data export.

**Synthetic intake sheet**

```text
Journey | Reported symptom | Business finish line
Vehicle list | Max estimates 3–8 seconds | First useful filtered rows visible
Booking save | Anna estimates 2 seconds | Appointment Id shown after commit
Nightly import | Oleg reports missed opening time | Valid rows reconciled by 08:00
Notification | Some clients receive it late | Provider acknowledges delivery request
```

## 4. Agree on a target and a stop condition

An improvement statement could be: 'For the defined vehicle-list journey, reduce measured user wait while preserving the same visible records, columns required for the task, and access rules.' Add a numerical target only after obtaining a baseline and business agreement. Avoid a precise promised speedup derived from a synthetic example.

Specify guardrails alongside the target. For example, no increase in authorization errors, no missing required rows, and no unacceptable shift of work into a growing queue. These are conditions under which an apparent speedup should be rejected. A faster page with incorrect data is not a successful optimization.

For a small-org proxy, collect a modest set of repeatable observations on two controlled views rather than manufacturing millions of records. A proxy demonstrates measurement technique and reveals local behavior. It does not establish how a dealer network will behave under concurrent traffic. Record the additional workload and environment validation needed before making that claim.

> **⚠️ Watch out**
>
> Do not turn a small local experiment into a contractual service level or a forecast for a much larger organization.

## ⚡ Independent practice: Write a performance investigation brief

Choose two journeys from the synthetic intake sheet and prepare a one-page investigation brief for Oleg.

1. For each journey, define start, finish, user persona, useful output, and failure conditions.
2. Write one observation, two competing hypotheses, and the evidence needed to distinguish them.
3. Create a blank measurement table with run Id, conditions, elapsed time, outcome, and whether the sample was warm or cold.
4. Collect a few observations in a training environment if available, or keep the table explicitly unmeasured.
5. Propose a target-setting conversation and name a guardrail that could invalidate a speedup.

### Your work is ready when

- Latency, throughput, and backlog are not treated as interchangeable.
- Synthetic estimates and actual observations are visibly separated.
- The brief states sample limitations and a next evidence-gathering step.

> **💡 Key idea**
>
> Optional extension: Explain how you would investigate a problem reported only by users with restricted record access.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is 'API response returned' sometimes the wrong finish line?

**Answer:** The user may still wait for rendering or a separate confirmation. Measure the finish line that matches the promised business outcome.

### 2. Can a median prove that almost all users have a good experience?

**Answer:** No. A median describes the middle observation; it does not describe the slower tail or the representativeness of the sample.

### 3. What distinguishes a hypothesis from an observation?

**Answer:** An observation is recorded evidence. A hypothesis explains it and should state what evidence would support or contradict the explanation.

## What to take away

- Define one journey before choosing an optimization.
- Record conditions and distributions, not a single impressive timing.
- Agree on correctness guardrails and the limits of the evidence.

## Sources and further reading

- [Resource and cost optimization](https://architect.salesforce.com/docs/architect/well-architected/guide/resource-and-cost-optimization.html)
- [Architecture basics](https://architect.salesforce.com/docs/architect/fundamentals/guide/architecture-basics)
- [Asynchronous processing decision guide](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)


---

# Locate Delay Across the Browser, Apex, and Database

S03 · senior · About 65 minutes with practice

![Three timing segments for interface, processing and data with one bottleneck highlighted](https://sam-portal-production.up.railway.app/lesson-images/S03.jpg)

Use a request timeline to identify the work that actually controls a user's wait, then test one explanation at a time.

## Before you begin

- Complete S02's measurement brief.
- Know how to read a browser network panel and a basic Salesforce debug log.

## What you will learn

- Distinguish elapsed request time from Apex CPU time.
- Correlate observations without adding overlapping durations twice.
- Choose a controlled experiment that tests the current bottleneck.

## 1. Follow a request rather than a collection of tools

Max opens Northstar's vehicle search. The browser can wait before sending a request, transfer a response, process JavaScript, and render rows. Salesforce can spend time running application logic, accessing data, and waiting for a callout. These stages explain different parts of the wait. Opening every diagnostic tool at once creates more output, but it does not automatically establish a causal sequence.

Use a correlation identifier: a value that lets you associate records about the same request or business operation. Prefer a non-sensitive generated identifier over Irina's email or a complete request body. In a small experiment, a run label and carefully recorded timestamps may be enough. At greater scale, define how the identifier travels across application logs, integration attempts, and support reports.

> **💡 Key idea**
>
> A trace is a linked account of one execution. A pile of unrelated log lines is not yet a trace.

## 2. CPU time is only one clock

Apex CPU time measures application-server processing attributed to the transaction. The database-processing portion of SOQL and DML, and time waiting for an external callout, are not counted as Apex CPU. Application work around those operations can still consume CPU. Consequently, a request can take several seconds while its reported CPU is much smaller. It can also fail the CPU limit even when its queries individually look quick.

The synthetic example below places an external availability check on the critical path. The critical path is the chain of dependent work that determines when the user can continue. If rendering requires the callout result, improving a small collection loop will not remove the wait for that result. If the availability check can move to a later explicit step without breaking the business promise, the dependency itself may be the more valuable design question.

Be careful with overlapping measurements. A server span can contain a database span, and a browser network duration already includes waiting for the server response. Adding all three as if they were separate stages inflates the total. Annotate each duration as inclusive or exclusive, and identify which clock and boundary produced it.

> **🔎 Check your understanding**
>
> Do not subtract Apex CPU from browser elapsed time and label the remainder 'database time.' Several other causes may be present.

**Synthetic timeline for reasoning; not an observed benchmark**

```text
Run R-17: submit to usable screen = 4200 ms
  browser preparation = 150 ms
  request/response elapsed = 3500 ms
    external availability wait inside request = 2400 ms
    Apex CPU reported for transaction = 260 ms
  browser processing and render after response = 550 ms
Unattributed request time remains; investigate rather than guessing.
```

## 3. Test competing explanations

Write two hypotheses: the slow callout controls the delay, or a large response controls browser rendering. For the first, replace the external dependency with a controlled test double in a suitable test path and compare the request's structure and elapsed behavior. A test double is a stand-in with a deliberate response, not a secretly faster production service. For the second, compare a reduced required field set and a smaller initial result page while keeping the user task equivalent.

Change one meaningful variable at a time. Keep the same user permissions, filters, and application revision. Record whether caches were already populated. Capture several runs, including errors, rather than keeping only the fastest example. Heavy debug logging can affect an experiment and produce large files; use an appropriate logging scope and avoid publishing records or credentials.

If the measured bottleneck moves after an improvement, that is useful evidence. Removing a long dependency can make browser rendering the next dominant cost. It does not mean the original diagnosis was wrong. Stop when the agreed journey meets its target with sufficient confidence, or when a new hypothesis requires a different experiment.

> **⚡ Try it**
>
> Keep a short experiment ledger: change, expected signal, actual observation, interpretation, and next step.

## 4. What a small org can and cannot establish

In a training org, you can compare two LWC rendering approaches, observe request timing, or inspect a bounded Apex collection operation. These experiments teach how to attribute delay. They do not reproduce production network paths, a large sharing model, data skew, or concurrent dealer traffic. A good submission states the exact claim it supports, such as 'this change reduces repeated client processing for this fixture.'

Your evidence package should include a sanitized timeline, the relevant code difference, raw observation rows, and a short explanation of remaining uncertainty. Avoid exporting an entire browser archive without reviewing its contents: network captures can include sensitive headers and data. A concise redrawn timeline is often sufficient for a classroom review.

> **⚠️ Watch out**
>
> Synthetic timings are exercise inputs. Keep them out of a chart labelled 'measured before and after.'

## ⚡ Independent practice: Diagnose the R-17 request

Explain the synthetic timeline, then design a small experiment that could confirm or reject one bottleneck hypothesis.

1. Draw the browser and server spans with explicit nesting; calculate the stated total without double-counting.
2. Identify which time is known, which is included inside another span, and which remains unattributed.
3. Propose two different causes and name the observation that would distinguish them.
4. Prepare a minimal code or configuration change for one experiment; execution is optional.
5. Submit a blank or genuinely observed results table, a sanitized diagram, and a paragraph describing what the evidence cannot establish.

### Your work is ready when

- The answer does not equate CPU, network elapsed time, and database duration.
- The proposed experiment changes one relevant factor and preserves the business result.
- Any measured result includes conditions and sample count; supplied timings remain marked synthetic.

> **💡 Key idea**
>
> Optional extension: Explain how the diagnosis changes if the callout runs after commit and is no longer on Max's critical path.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Can a slow request have low Apex CPU?

**Answer:** Yes. Waiting for a callout, database processing, network transfer, and browser work can contribute to elapsed time without appearing as equivalent Apex CPU.

### 2. Why can summing trace spans be misleading?

**Answer:** A parent span may already include child spans. Only non-overlapping durations should be summed to explain the same elapsed interval.

### 3. What should you do with unexplained time?

**Answer:** Label it unattributed and gather a better observation. Do not assign it to the database merely because it is not Apex CPU.

## What to take away

- Find the dependent chain that controls the user's finish line.
- Keep timing boundaries and clocks explicit.
- Use a controlled experiment and report the scope of its evidence.

## Sources and further reading

- [What counts toward Apex CPU time](https://help.salesforce.com/s/articleView?id=000339361&language=en_US&type=1)
- [Resource and cost optimization](https://architect.salesforce.com/docs/architect/well-architected/guide/resource-and-cost-optimization.html)
- [Apex result caching](https://developer.salesforce.com/docs/platform/lwc/guide/apex-result-caching.html)


---

# Estimate Resource Demand Before Increasing Traffic

S04 · senior · About 60 minutes with practice

![A small resource budget gauge beside a group of efficiently processed records](https://sam-portal-production.up.railway.app/lesson-images/S04.jpg)

Build a small capacity model that separates transaction limits, organization allocations, and the rate at which background work can finish.

## Before you begin

- Understand transactions and the measurement boundaries from S01–S03.
- Know how bulk Apex uses collections and how asynchronous work is queued.

## What you will learn

- Separate per-transaction constraints from shared allocations.
- Calculate demand using explicit, reviewable assumptions.
- Identify the first constraint that needs a real workload experiment.

## 1. A limit and an allocation answer different questions

A per-transaction limit bounds one execution. An allocation can constrain an organization over a period or another shared scope. Capacity is the amount of useful work a system can complete under defined conditions. These concepts are related, but they are not interchangeable. An appointment handler can fit comfortably inside its own transaction limits while thousands of invocations consume a shared allowance or overwhelm a downstream service.

Northstar expects more dealers to use Anna's booking process. Oleg asks whether ten times as many appointments means ten times as much CPU in one transaction. Usually the first question is how requests are grouped. Ten independent requests differ from one bulk update containing many records, and both differ from a background process that queries additional related data. State the execution shape before doing arithmetic.

> **💡 Key idea**
>
> Write the unit beside every number: per record, per transaction, per minute, per day, or concurrent execution.

## 2. Calculate a transparent demand model

The fixture assumes one notification request per accepted booking and a separate reconciliation request per group of fifty bookings. These are invented design inputs. At 100 bookings per minute, the model predicts 100 notification requests and two reconciliation requests per minute, before retries. Multiply by the active minutes in the business day rather than automatically assuming round-the-clock traffic. Include a separate allowance for replays, retries, and administrative operations.

Now inspect the work inside a save. A handler that issues one query per appointment grows differently from a handler that queries relevant vehicles once for the whole collection. Do not extrapolate CPU as perfectly linear without measuring it: branching, sharing checks, record distribution, and downstream automation can change the relationship. Use the small experiment to identify the shape of the work, then retain uncertainty around its production cost.

Read current limits for the precise execution context and product. Do not copy a number from a synchronous example into a Batch execute budget, and do not assume every asynchronous mechanism shares the same rules. Runtime Limits methods help inspect supported transaction counters. Org allocations, licensing, and event/API consumption need their own sources.

> **🔎 Check your understanding**
>
> If a number has no unit, owner, or source, it is not ready to support a capacity decision.

**Synthetic assumptions for a spreadsheet, not measured capacity**

```text
Traffic scenarios: 10 / 100 / 1000 accepted bookings per minute
Active business period: 600 minutes per day
Notification demand: 1 request per booking
Reconciliation demand: 1 request per 50 bookings
Retry planning factor: model both 0% and 5% additional attempts
Unknowns: service response time, worker throughput, concurrency, actual org allocations
```

## 3. Queue growth reveals a different failure

Suppose a simulated worker completes 80 notifications per minute while 100 arrive. The backlog grows by approximately twenty per minute under those assumptions. Moving the publisher into Queueable does not remove that difference. It changes when the user waits and which execution limits apply. Queue age, the time the oldest pending item has waited, often describes business impact better than queue length alone.

During recovery, capacity must serve new arrivals and reduce old work. A worker that merely matches current arrival rate cannot drain the accumulated backlog. This is a planning equation, not a promise that Salesforce will provide a constant worker rate. Async scheduling is affected by shared resources and platform policies; avoid presenting it as an exact start-time guarantee.

> **⚠️ Watch out**
>
> Increasing enqueue rate is not evidence of increased completion capacity.

## 4. Turn the estimate into a verification plan

Use a small set of synthetic records to compare bulk and single-record execution. Record relevant counters before and after a bounded operation, preserve the same business assertions, and note other automation that ran. A tiny org cannot validate an enterprise rate forecast, but it can reveal an obvious query-per-record pattern.

Produce a capacity sheet with assumptions, derived demand, current documented constraints, and unknowns. Highlight the constraint that could be reached first. Recommend a controlled test in an authorized representative environment, including a stop condition for errors or queue growth. The useful output is an honest decision boundary, not a large spreadsheet full of unverified precision.

> **⚡ Try it**
>
> Maintain separate rows for demand you calculated, limits you verified, and throughput you actually observed.

## ⚡ Independent practice: Build Northstar's capacity sheet

Model all three traffic scenarios using the supplied assumptions and a small optional collection experiment.

1. Calculate notification, reconciliation, and retry demand per minute and business day.
2. Create separate sections for transaction counters, organization allocations, downstream capacity, and queue delay.
3. Compare one-record and small bulk execution if a training org is available; otherwise write the measurement procedure.
4. Model a worker completing 80 items per minute with 100 arrivals, then calculate backlog after 30 minutes.
5. Name the first production validation you would request and the condition that would stop it.

### Your work is ready when

- Every calculated value includes its unit and assumptions.
- The 80-versus-100 example produces 600 additional waiting items after 30 minutes.
- No small-org result is described as a validated 1000-bookings-per-minute capacity.

> **💡 Key idea**
>
> Optional extension: Add a recovery scenario with ongoing arrivals and explain the extra capacity required to reduce backlog.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why can safe transactions still exhaust shared capacity?

**Answer:** Many individually valid executions can collectively consume an allocation or create more work than a worker or downstream service can finish.

### 2. Does async imply an execution-time SLA?

**Answer:** No. Background work uses finite resources and scheduling policies; its start and completion times need observation and an appropriate business contract.

### 3. Why include retry traffic?

**Answer:** Retries consume resources too. A model based only on successful first attempts understates demand during failures and recovery.

## What to take away

- Budget execution work and shared demand separately.
- Treat queue growth as a measurable capacity mismatch.
- Use a small proxy to test mechanisms, not to certify enterprise throughput.

## Sources and further reading

- [Asynchronous processing decision guide](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)
- [Architecture basics](https://architect.salesforce.com/docs/architect/fundamentals/guide/architecture-basics)
- [Bulk API limits and allocations](https://developer.salesforce.com/docs/platform/salesforce-app-limits-cheatsheet/guide/salesforce-app-limits-platform-bulkapi.html)


---

# Choose an Optimization and Prove Its Value

S05 · senior · About 55 minutes with practice

![Two restrained performance traces showing a measured before and after with the same workload](https://sam-portal-production.up.railway.app/lesson-images/S05.jpg)

Prioritize an improvement by business impact, evidence, implementation risk, and the ability to reverse it.

## Before you begin

- Complete an investigation brief and a capacity sheet.
- Understand the difference between a measured observation and a synthetic example.

## What you will learn

- Rank candidate changes without promising unsupported speedups.
- Define before-and-after comparisons and correctness guardrails.
- Explain when leaving working code alone is the better choice.

## 1. The longest code file is not automatically the best target

Northstar has five proposed improvements: reduce the vehicle list's initial payload, replace a nested lookup loop, move a slow optional callout out of the save path, rewrite every Flow in Apex, and add a cache to a rarely used report. Oleg can fund only two this iteration. A senior recommendation should connect each change to a specific complaint, not simply prefer the most technically interesting option.

Value depends on frequency and consequence as well as duration. Saving half a second on an action repeated constantly may matter more than saving several seconds on a monthly administrative task. A correctness defect or a missed operational deadline can outweigh both. Write the affected population and business consequence before comparing implementation effort.

> **💡 Key idea**
>
> Prioritization is a decision under uncertainty. Make the uncertainty visible instead of disguising it as a precise score.

## 2. Use a small decision table

For each candidate, record the observed problem, the proposed mechanism, expected direction of improvement, risks, effort range, and a way to verify the result. Expected direction can be useful without an exact percentage. Reducing unused response fields should reduce payload size; it does not by itself establish how much faster Max's complete journey becomes.

The synthetic evidence cards below support investigating the payload and collection loop first. They do not prove either is the final production bottleneck. The broad rewrite has a large change surface and no isolated explanation for the reported symptoms. A change surface is the set of behaviors and components that might be affected. Larger surfaces demand more regression evidence and can make recovery harder.

Numbers in a ranking table express judgment, not a new physical law. If two proposals are close, choose a cheap experiment that reduces uncertainty. A short spike can answer whether a candidate affects the critical path before the team commits to a larger implementation.

> **⚡ Try it**
>
> Give each proposed change a falsifiable statement: 'If this explanation is correct, this particular signal should change.'

**Synthetic prioritization cards**

```text
A: Vehicle response includes 18 columns; Max uses 6. Rendering appears prominent.
B: Handler repeatedly scans all vehicles for each appointment. Comparison count grows rapidly.
C: Optional callout sometimes blocks save. Product owner has not agreed to delayed confirmation.
D: Rewrite all Flows in Apex. No isolated defect or baseline identified.
E: Cache monthly report. Few users; freshness requirements unresolved.
```

## 3. Define success before editing

For the payload change, preserve the fields required for Max's task and the same permitted record set. Measure response size and user-visible wait separately. For the lookup change, verify the same computed result across empty, single-record, and bulk inputs, then record the relevant counters or repeatable local comparison count. A reduced operation count supports the algorithmic explanation; actual timing still requires measurement.

Choose a baseline revision and keep the comparison environment, data fixture, persona, and cache conditions as consistent as practical. Record unsuccessful runs instead of silently discarding them. If external conditions change, say so. A small table of raw observations is more useful than a single percentage without its denominator.

Set rejection criteria. Reject a faster result that exposes extra fields, loses appointments, changes validation behavior, or creates an unacceptable backlog. Performance and correctness are joint requirements. A review should distinguish an intended contract change from an accidental regression.

> **🔎 Check your understanding**
>
> Write one example that must still succeed and one forbidden outcome that must still fail.

## 4. Plan the release and the decision to stop

A reversible change has a practical way back to the previous behavior. A feature toggle may help separate deployment from user exposure, but the team must test both paths and define who changes the toggle. Removing data or changing an external contract can require a recovery plan beyond a code revert.

After the chosen change, compare the agreed signals. If improvement is smaller than hoped, revisit the hypothesis rather than selecting a more flattering metric. If the target is met and the remaining imperfection has low business impact, stop. Every additional optimization has an opportunity cost and can introduce a new defect.

For this lesson, deliver a recommendation and a measurement plan. Any supplied timing or impact estimate remains synthetic until you perform and document the corresponding experiment. A strong explanation can recommend postponing a tempting rewrite when its evidence is weaker than a smaller change.

> **⚠️ Watch out**
>
> A before-and-after label requires actual comparable observations, not two imagined values.

## ⚡ Independent practice: Recommend two changes to Oleg

Choose two candidates from the evidence cards and prepare an approval-ready optimization note.

1. Create a five-row table with affected journey, evidence, mechanism, uncertainty, effort, and regression risk.
2. Select two changes and explain why the others wait.
3. For each selected change, define a baseline, a measurement, a correctness guardrail, and a rollback condition.
4. Prepare a small fixture or code diff for one candidate without claiming it was deployed.
5. Add a follow-up decision: continue, stop, or investigate a new bottleneck based on possible results.

### Your work is ready when

- The recommendation follows evidence and business use rather than the amount of code changed.
- No exact speedup is promised without observed comparable measurements.
- The verification plan includes permissions and data correctness, not only response time.

> **💡 Key idea**
>
> Optional extension: Defend the decision against a proposal to rewrite the whole booking application.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why might a smaller improvement have greater business value?

**Answer:** It may affect a much more frequent or important journey while carrying less delivery risk.

### 2. What invalidates an apparent speedup?

**Answer:** A changed business result, weakened access control, missing work, or another violated guardrail can make the faster result unacceptable.

### 3. When should optimization stop?

**Answer:** When the agreed outcome is met with adequate evidence and further changes are not justified by their expected value, risk, and cost.

## What to take away

- Rank improvements by evidence and business effect.
- Measure the same promise before and after.
- Stopping is a valid engineering decision when the remaining cost is justified.

## Sources and further reading

- [Resource and cost optimization](https://architect.salesforce.com/docs/architect/well-architected/guide/resource-and-cost-optimization.html)
- [Record-triggered automation decision guide](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered-automation)
- [Salesforce continuous integration](https://developer.salesforce.com/blogs/2022/01/set-up-continuous-integration-for-your-salesforce-projects)


---

# Read Query Plans and Data Selectivity

S06 · senior · About 65 minutes with practice

![A magnifying glass choosing a narrow indexed route through a large orderly data grid](https://sam-portal-production.up.railway.app/lesson-images/S06.jpg)

Explain why a query can slow down without a code change, and use query plans without mistaking a small data set for a scale benchmark.

## Before you begin

- Be comfortable writing SOQL filters and reading a Salesforce object model.
- Understand S03's distinction between database work and Apex CPU.

## What you will learn

- Define selectivity and explain why an index is not a performance guarantee.
- Compare query plans against actual data distribution.
- Design a small-org query experiment and state its scale limitations.

## 1. Indexes narrow a search only when the filter helps

An index is a data structure the platform may use to locate matching records efficiently. Selectivity describes how narrowly a condition reduces the candidate data set, under the optimizer's rules. A field can have an index while a particular value matches most records. In that case, following the index may not be the cheapest plan.

Anna opens active appointments at her dealer. A year ago, Status__c = 'Requested' matched a small fraction of appointments. In the synthetic growth case, a failed completion process leaves most appointments Requested. The query text is unchanged, but the data distribution is different. Adding an index without examining that distribution may leave the underlying problem untouched.

> **💡 Key idea**
>
> Ask 'How many records match this value?' rather than only 'Is this field indexed?'

## 2. Read a plan as an estimate

The Query Plan tool exposes candidate plans and estimates such as cardinality and relative cost. Cardinality is the estimated number of matching rows. A plan is evidence about how the optimizer sees this query in this environment; it is not a promise of a particular number of milliseconds. Different filters, values, and data volumes can produce different plans.

The synthetic snapshots below deliberately omit exact platform threshold calculations. They show a broad status filter and a narrower combination of dealer and date. In the starter, Dealer_Code__c is a proposed exercise field, not existing metadata. If you add it for a local experiment, record its definition and whether an index is actually available. Do not label an arbitrary custom field 'indexed' because its name sounds important.

Check whether a proposed filter preserves the business requirement. Restricting to recent appointments is useful if Anna asked for upcoming work; it is incorrect if Oleg requested a complete historical report. A faster query that silently excludes required history has changed the product contract.

> **🔎 Check your understanding**
>
> A plan comparison should include the exact query, relevant values, data distribution, and the user or access context.

**Synthetic large-volume reasoning snapshots**

```text
Snapshot A: 2,000,000 appointments; Requested matches 1,600,000.
Snapshot B: same dataset; a particular dealer and date range matches 420.
Question: which predicate is more useful for narrowing candidates?
Unknown: available indexes, supported operations, final optimizer plan, actual elapsed time.
These counts are invented exercise inputs, not results from a Salesforce org.
```

## 3. Keep query design and application design connected

Request only fields needed for the current operation, use appropriate filters, and paginate when the user cannot meaningfully consume every row at once. Reducing selected fields can reduce payload and memory even when it does not change the leading query plan. Pagination choices have their own contracts: SOQL OFFSET has a maximum offset and does not provide a stable snapshot across changing data.

Do not move a broad query into Batch and conclude that the query is fixed. Batch can change how work is divided, but start still needs a viable selection strategy. Likewise, replacing the query with a cache creates freshness, invalidation, and authorization questions. Consider those alternatives only when they fit the business journey.

Some indexing and query behaviors depend on field type, operator, platform support, and org configuration. Use current documentation and actual plan output for the final choice. Avoid treating a remembered selectivity percentage as a universal answer to every query shape.

> **⚠️ Watch out**
>
> A low estimated plan cost and a measured user-visible response time are different kinds of evidence.

## 4. Build a useful small-org proxy

Create a modest synthetic fixture, perhaps forty appointments distributed across two dealers and several dates. Compare result correctness for a broad and a narrow query, inspect any available plan output, and record counters or elapsed observations under consistent conditions. The small fixture can prove that the filter returns the intended subset; it cannot reproduce the selectivity decisions of a two-million-record production object.

Submit the actual local plan separately from your interpretation of the supplied large-volume snapshots. If the small org chooses the same plan for both queries, record that result rather than altering the evidence to match the lesson. The transferable skill is reasoning from requirements, distribution, and observed plans.

> **⚡ Try it**
>
> Preserve a readable query and data-distribution note alongside any screenshot of Query Plan.

## ⚡ Independent practice: Explain a query regression without changing the requirement

Compare the two synthetic snapshots and design a correct upcoming-appointments query for Anna.

1. State whether Anna needs all history or only a defined upcoming period.
2. Write broad and narrowed SOQL examples using real starter fields or explicitly declared exercise fields.
3. Calculate the match fractions in the supplied snapshots and identify missing information.
4. Optionally create a small synthetic fixture and record real result counts and plan output.
5. Prepare a recommendation that distinguishes a query change, data-quality repair, indexing question, and interface pagination decision.

### Your work is ready when

- The answer explains why unchanged code can behave differently after data growth.
- The narrower query retains all records required by the stated user journey.
- Small-org observations and large-volume assumptions are reported separately.

> **💡 Key idea**
>
> Optional extension: Describe how a backfill that changes many Status__c values could alter the query's behavior.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does an index guarantee fast execution?

**Answer:** No. Supported filter operations, selectivity, data distribution, and optimizer estimates influence whether using it is beneficial.

### 2. What does cardinality mean in a query plan?

**Answer:** It is an estimate of matching row count for the plan or operation, not an elapsed-time measurement.

### 3. Why not demonstrate scale by importing millions of rows into a training org?

**Answer:** The environment is not representative and has its own constraints. A small correctness experiment plus explicit scale analysis is more honest and useful.

## What to take away

- Interpret indexes together with value distribution.
- Preserve the business result while narrowing work.
- Treat query plans as environment-specific evidence.

## Sources and further reading

- [Developer Console Query Plan FAQ](https://help.salesforce.com/s/articleView?id=000199003&language=en_US&type=1)
- [Lightning Platform query optimizer](https://developer.salesforce.com/docs/platform/salesforce-large-data-volumes-bp/guide/ldv-deployments-infrastructure-salesforce-query-optimizer.html)
- [SOQL OFFSET](https://developer.salesforce.com/docs/platform/salesforce-soql-sosl/guide/sforce-api-calls-soql-select-offset.html)


---

# Find Shared Records Behind Lock Contention

S07 · senior · About 65 minutes with practice

![Many record links converging on one overloaded parent lock beside a more balanced arrangement](https://sam-portal-production.up.railway.app/lesson-images/S07.jpg)

Trace competing updates to the records they may lock, then change the work partition rather than blindly adding workers.

## Before you begin

- Understand lookup relationships, ownership, transactions, and DML.
- Read S06's distinction between data distribution and query text.

## What you will learn

- Explain record locking, contention, and different forms of data skew.
- Identify a shared parent or ownership structure in a concrete failure.
- Compare serialization, partitioning, shorter transactions, and bounded retries.

## 1. Different child records can share one contested resource

Record locking protects data consistency while an operation changes records. Contention occurs when concurrent operations need the same protected resource. Max and Anna may edit different appointments on screen yet trigger automation that updates the same Vehicle__c summary. Their visible records differ, but their transactions compete for a shared vehicle record.

Start from the complete operation, including triggers, Flows, roll-ups, sharing maintenance, and relationship behavior. A lookup does not mean that every possible update always locks every ancestor. Locking depends on the object, relationship settings, and operations performed. The correct question is which shared record or membership resource this particular transaction needs, not whether two users clicked different rows.

> **💡 Key idea**
>
> Draw the resources touched by the transaction, including indirect updates, before blaming the record named in the error.

## 2. Recognize concentration in the data model

Data skew is an uneven distribution that concentrates work or access maintenance. Account skew can involve many children under one Account. Lookup skew concentrates references to one target. Ownership skew concentrates many records under one owner, potentially making role or sharing changes expensive. These patterns are warning signs, not automatic proof of the same failure mechanism.

Northstar's synthetic model uses one 'Unassigned vehicle' record for many appointments. A handler also updates its Last_Activity__c on every appointment save. Last_Activity__c is a proposed exercise field. The model creates a hot record: a record many transactions repeatedly need. Replacing Anna's trigger with Queueable does not remove the shared target. It may simply move the contention into another queue.

The trace below records a designed contention story, not an actual Salesforce log. Its useful feature is the common Vehicle identifier. A real investigation should correlate the attempted updates and automation path, then verify the suspected lock through supported diagnostics or a controlled authorized experiment.

> **🔎 Check your understanding**
>
> Separate ownership-related sharing recalculation from row-lock contention; they can coexist but are not synonyms.

**Synthetic contention trace**

```text
10:00:00.000 Worker A updates appointment TD-A -> summary vehicle V-HOT
10:00:00.010 Worker B updates appointment TD-B -> summary vehicle V-HOT
10:00:00.020 Worker C updates appointment TD-C -> summary vehicle V-HOT
Business records differ; all three summary writes target V-HOT.
Observed outcome in this exercise: B retries, C is marked for later retry.
No real org was executed to produce this trace.
```

## 3. Choose a remedy that changes the cause

Partitioning groups work so concurrent workers operate on independent resources. For this example, route appointments for the same vehicle through one coordinated stream while allowing different vehicles to proceed independently. Merely sorting a file is not enough if the ingestion mechanism later splits it into overlapping parallel work. Verify the actual partition boundary.

Serialization processes conflicting work one at a time. It can improve useful throughput when parallel attempts spend most of their time failing and retrying, although it reduces theoretical concurrency. Shortening the transaction can reduce how long a lock is held. Removing an unnecessary summary write may be better than optimizing its retry policy.

Retries help with temporary contention but need a bound, delay, and a visible failure state. A failed business operation must not disappear after the last attempt. Idempotency, the property that repeating the same operation does not duplicate its business effect, remains necessary when the caller is unsure whether a prior attempt completed.

> **⚡ Try it**
>
> Compare successful completions and total attempts, not just the number of jobs launched.

## 4. Use a trace or a small controlled experiment

A small training org may not reproduce a contention error reliably. Scheduling and timing are not under your complete control, so a demonstration that happened not to fail does not disprove the mechanism. You can still inspect a proposed automation graph, count shared targets, and compare the intended partitioning.

If you run a small experiment, use synthetic records, a bounded number of operations, and an explicit stop condition. Record completed operations, failures, retry count, and elapsed wall time. Do not add artificial busy loops or unbounded traffic merely to force a lock. The goal is to evaluate a hypothesis safely, not to stress a shared learning environment.

Your final recommendation should state the tradeoff: for example, coordinating work by vehicle reduces conflicts but introduces a queue whose age needs monitoring. Avoid claiming that a single change eliminates every possible lock elsewhere in the org.

> **⚠️ Watch out**
>
> A quiet test with ten records is evidence about that test, not proof that a large concurrent import cannot contend.

## ⚡ Independent practice: Redesign the V-HOT workload

Create a lock map and a processing plan for the synthetic three-worker case.

1. List the direct appointment updates and indirect vehicle summary writes.
2. Draw which operations share V-HOT and which could safely run independently.
3. Compare removing the summary write, partitioning by Vehicle Id, serial processing, and bounded retry.
4. Choose one primary remedy and one fallback; define completion, failure, and queue-age measurements.
5. Use the supplied trace as a tabletop exercise, or document a bounded training-org observation without claiming large-scale reproduction.

### Your work is ready when

- The explanation identifies the common resource rather than only repeating UNABLE_TO_LOCK_ROW.
- The proposed partition corresponds to the actual record being contested.
- The recovery plan preserves failed work and does not rely on unlimited immediate retries.

> **💡 Key idea**
>
> Optional extension: Explain how a later ownership transfer could add a different sharing-related cost even after row contention improves.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why can different appointments contend?

**Answer:** Their transactions can update or otherwise require the same related record, such as a vehicle summary.

### 2. When can serial work finish sooner?

**Answer:** When parallel attempts create enough lock failures and retries that successful completion rate falls below a coordinated serial process.

### 3. Does moving work to Queueable remove a hot record?

**Answer:** No. The same shared target can remain contested; the execution location changed, not the underlying dependency.

## What to take away

- Map indirect work and shared targets.
- Change the cause of contention before increasing concurrency.
- Measure completed business work and preserve recoverable failures.

## Sources and further reading

- [Salesforce record locking and concurrency](https://developer.salesforce.com/blogs/2014/07/record-locking-cheat-sheet)
- [Large-volume data model and skew](https://trailhead.salesforce.com/content/learn/modules/large-data-volumes/design-your-data-model)
- [Ownership data skew](https://developer.salesforce.com/docs/platform/draes/guide/draes-group-membership-data-skew.html)


---

# Load Data with Reconciliation and Safe Replays

S08 · senior · About 70 minutes with practice

![A staged stream of records entering a database through a validation checkpoint](https://sam-portal-production.up.railway.app/lesson-images/S08.jpg)

Plan a repeatable vehicle-and-appointment load that accounts for dependencies, partial results, and uncertain retries.

## Before you begin

- Understand upsert, external identifiers, and partial DML success.
- Know the Vehicle__c to Test_Drive__c lookup relationship and S07's contention model.

## What you will learn

- Define a stable import identity separate from file row position.
- Reconcile successful, failed, and unprocessed work.
- Choose a loading strategy based on correctness and actual processing behavior.

## 1. A data load is a business transformation

Northstar receives vehicles and appointments from a dealer management system, abbreviated DMS. The DMS stores each vehicle under a stable source identifier. Salesforce needs a reliable way to recognize that the same source vehicle has arrived again. A CSV row number is not such an identity: sorting or splitting the file changes it.

An External ID field can support matching imported data to existing Salesforce records, but you must inspect its configuration and uniqueness requirements. The starter includes VIN__c; do not assume that any field named VIN is automatically the correct external identifier for every source. For the exercise, propose a Source_Key__c field with an explicit matching policy and document it as an extension.

Load parents before dependent records when appointments require resolved Vehicle__c references. Define what happens when a parent is missing: reject that child for correction, defer it for a later dependency pass, or apply an explicitly approved alternate process. Silently attaching every orphan to a generic vehicle corrupts the meaning of the data.

> **💡 Key idea**
>
> A successful HTTP request is not the same as a successfully reconciled migration.

## 2. Preserve identity through every result file

The supplied CSV contains six appointment input rows representing five distinct appointment identities. It does not contain vehicle rows. Create a separate five-row vehicle fixture with keys V-001 through V-005, leaving V-MISSING and V-MISSING-2 absent for the first attempt. The two A-101 rows are complete snapshots at versions 1 and 2. Before upload, retain version 2 and record version 1 as superseded. Do not submit competing versions together and assume CSV order makes the latest one win. Upsert matches identities; it does not supply a version policy.

Bulk API results distinguish successful, failed, and unprocessed records. Failed means processing encountered an error. Unprocessed means processing did not take place, such as when a job is interrupted. These categories need different operational explanations even if both eventually require attention. Do not rely on returned result ordering matching the original CSV order.

Keep a reconciliation ledger keyed by the stable source identifier and attempt identifier. Record the submitted source version, outcome, target Id when available, and a concise error category. A job status alone is insufficient to tell Oleg whether every required appointment is available.

Keep preflight decisions separate from API results. In this exercise, six source rows become five submitted appointment rows after the older A-101 snapshot is removed. The superseded row belongs in the preflight ledger, not in the API failed or unprocessed count. If rows represented independent delta operations instead of snapshots, collapsing them would require a different policy.

> **🔎 Check your understanding**
>
> The equation submitted = successful + failed + unprocessed must be interpreted at the same attempt scope, without counting replayed rows as new source entities.

**Synthetic appointment input; source keys are fictional**

```csv
source_key,vehicle_source_key,source_version
A-101,V-001,1
A-102,V-002,1
A-103,V-MISSING,1
A-104,V-004,1
A-105,V-MISSING-2,1
A-101,V-001,2
```

## 3. Control replays and concurrency

After correcting a missing parent, repeat only the relevant failed or unprocessed work unless your entire operation is deliberately idempotent and a broader replay is justified. Use the same business identity for a retry of the same action. Assigning a new random key on every attempt defeats duplicate detection.

Choose the API and loading mechanism explicitly. Bulk API 2.0 handles batching for you; do not assume that every tuning option from the original Bulk API exists there. If your design requires a serial-processing capability, verify which supported tool or API provides it. Alternatively, coordinate independent jobs or change the data partition with full awareness of how the service processes them.

Measure successful rows per elapsed period, total attempts, error rate, and reconciliation completeness. A parallel import that quickly launches many jobs but requires hours of manual duplicate repair is not necessarily the better business outcome. Include automation and sharing effects when judging the loading strategy.

> **⚠️ Watch out**
>
> Do not disable validation or security merely to make the success counter look better; define any exceptional migration access separately.

## 4. Make the exercise reproducible without a large org

A few synthetic records are enough to demonstrate matching, dependencies, rejected rows, and a replay. Use a local spreadsheet ledger if no suitable org is available. Mark predicted outcomes as predictions. If you execute a small load, save sanitized result rows and the precise metadata configuration that controls matching.

Before a real migration, add preparation steps for backups, permissions, source cutover, user communication, and reconciliation ownership. Those are decisions to review with the responsible team, not instructions to run against an employer's org. Retain result artifacts according to the agreed operational policy rather than assuming the API keeps them forever.

> **⚡ Try it**
>
> Make Oleg's completion criterion 'all required source entities accounted for,' not simply 'job finished.'

## ⚡ Independent practice: Reconcile and replay a small appointment load

Prepare a preflight and result ledger for the six supplied appointment rows, plus a separate vehicle fixture V-001 through V-005.

1. Define Source_Key__c and uniqueness assumptions on the proposed parent and child extensions; keep the lookup relationship unchanged.
2. Create vehicle fixture keys V-001 through V-005. Before upload, retain only A-101 version 2, and record version 1 as superseded.
3. Separate preflight decisions from the five submitted rows; classify actual API outcomes as success, failure or unprocessed, or label them predicted if unexecuted.
4. Correct the missing parents and design a replay that preserves appointment identity.
5. Produce totals by attempt and by unique business entity so a reviewer can see why those totals differ.

### Your work is ready when

- The ledger never relies on CSV position as the permanent identity.
- A-101 version 1 is recorded as superseded before upload; the five-row submitted set has one snapshot per source identity.
- Successful, failed, and unprocessed outcomes are distinguishable; replay does not create extra appointments.

> **💡 Key idea**
>
> Optional extension: Add a timeout with an unknown result and explain how reconciliation avoids blindly creating a duplicate.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. How is an unprocessed row different from a failed row?

**Answer:** A failed row was attempted and encountered an error; an unprocessed row did not undergo processing in that job attempt.

### 2. Why can two reconciliation totals differ?

**Answer:** Attempt counts include repeated submissions, while unique-business-entity counts collapse replays under stable identities.

### 3. Does upsert solve every duplicate problem?

**Answer:** No. It depends on a sound matching field, uniqueness assumptions, source authority, and conflict policy.

## What to take away

- Define stable identities and dependency order first.
- Reconcile every outcome category.
- Evaluate loading methods by correct completed work and recovery cost.

## Sources and further reading

- [Bulk API 2.0 workflow](https://trailhead.salesforce.com/content/learn/modules/api_basics/api_basics_bulk)
- [Unprocessed record results](https://developer.salesforce.com/docs/platform/api-asynch/guide/get-job-unprocessed-results.html)
- [Bulk API processing limits and allocations](https://developer.salesforce.com/docs/platform/salesforce-app-limits-cheatsheet/guide/salesforce-app-limits-platform-bulkapi.html)
- [Integration patterns: bulk processing and idempotency](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)


---

# Archive History Without Losing the Business Record

S09 · senior · About 60 minutes with practice

![Recent records on an active shelf and older records in an archive with one reporting path](https://sam-portal-production.up.railway.app/lesson-images/S09.jpg)

Separate active working data from historical information and design retrieval, reporting, and recovery before proposing deletion.

## Before you begin

- Understand data relationships and large-volume query concerns.
- Be able to explain Northstar's booking lifecycle and the difference between records and metadata.

## What you will learn

- Distinguish archiving, deletion, backup, and audit history.
- Define access and reporting requirements for historical appointments.
- Design an archive acceptance test without inventing a legal retention rule.

## 1. Older does not automatically mean unnecessary

Anna usually needs upcoming appointments and recent follow-ups. Oleg also needs historical conversion reports, while Irina may ask about a past visit. These journeys have different access patterns. Archiving moves or manages information so it no longer burdens the main operational path while remaining available under an explicit retrieval policy. Deletion removes it from that path and may eventually make recovery impossible.

A backup supports recovery after loss or corruption. An archive supports deliberate long-term retention and retrieval. Audit history explains changes or events, and is not necessarily a complete copy of every business record and relationship. One mechanism may help with more than one purpose, but you must verify its actual guarantees rather than treating the labels as synonyms.

> **💡 Key idea**
>
> Choose the historical questions the business must still answer before choosing where the data will live.

## 2. Define policy as a set of testable decisions

The fictional proposal below is an exercise, not a legal or compliance recommendation. Oleg suggests archiving completed appointments after a defined operational period, but the responsible business and data-governance owners must decide the real period, exceptions, and approval process. Do not infer a universal Salesforce or automotive retention requirement.

Classify records by lifecycle, not just CreatedDate. A very old appointment may still have an unresolved complaint, a linked obligation, or a correction in progress. Your selection rule needs exceptions and a way to prevent records from moving while they remain active. For the Vehicle__c lookup, decide whether the archive retains the relevant vehicle attributes, a stable reference, or both.

Define historical access separately from current Salesforce sharing. Copying a record to an external store can accidentally expose it to a different audience. Authentication, authorization, searchable fields, export rights, and deletion permissions need explicit owners in the destination.

> **🔎 Check your understanding**
>
> A retention rule must state who approves it, what can block archiving, and how exceptions are reviewed.

**Synthetic archive decision sheet**

```text
Candidate: completed Test_Drive__c records outside the agreed operational window
Exclude: unresolved complaint or pending correction
Required retrieval: find a fictional client's prior visit and its vehicle
Reporting: monthly completed-visit counts by dealer remain explainable
Open decisions: actual retention period, archive access, restoration target, deletion authority
No policy has been approved or executed by this lesson.
```

## 3. Compare storage choices against retrieval needs

Keeping history in core Salesforce preserves familiar relationships and reporting, but it may maintain storage and access-maintenance costs. A supported archive product can provide managed policies and retrieval features, subject to its licensing and product constraints. An external archive can suit some access patterns but requires integration, authorization, search design, and operations. Big Objects or other storage options are not drop-in replacements for every ordinary object query or report.

Create a fit table rather than declaring one option cheapest. Compare required searches, reporting freshness, relationship preservation, restoration granularity, operating effort, product availability, and expected cost categories. If pricing or licensing is unknown, mark it as a question rather than filling in an invented dollar value.

A report that combines live and archived data must avoid double-counting records during transition. A watermark, batch identifier, or explicit archive state can help define which source owns each record at a point in time. The mechanism needs a consistency contract; simply reading both locations does not create one.

> **⚠️ Watch out**
>
> Do not delete source records merely because an export file exists; first verify completeness, readability, relationships, and approved recovery.

## 4. Measure recoverability, not only storage reduction

A small proxy can use ten synthetic appointments and an archive manifest. A manifest is a list describing what was copied, its identifiers, counts, and verification information. Show that an allowed user can retrieve a selected historical visit, that an unauthorized persona cannot, and that the required report still reconciles.

Record retrieval time, missing references, mismatched counts, and restoration limitations. If you only designed the exercise, leave the observation cells empty and describe the planned checks. A storage estimate alone cannot show whether a customer's question can still be answered.

Separate rollback of an archive application change from restoration of archived records. Restoring relationships, preserving identifiers, handling records changed since export, and avoiding duplicate restoration may require a dedicated process. Write these decisions before treating the archive as an easy performance optimization.

> **⚡ Try it**
>
> Choose one historical customer question and prove the archive design can answer it under the correct permissions.

## ⚡ Independent practice: Design an archive acceptance pack

Use ten fictional appointments to define an archive policy proposal, a manifest, and a retrieval test.

1. Describe the active-user and historical-reporting journeys separately.
2. Write a candidate selection rule and at least two exclusions, leaving the actual retention period for the named owner to approve.
3. Compare core storage, a supported archive product, and an external store against the same requirements.
4. Create a manifest with stable source identities and relationship information.
5. Specify count reconciliation, permitted and denied retrieval, reporting continuity, and a single-record restoration test.

### Your work is ready when

- Archiving, backup, history, and deletion are not conflated.
- The exercise does not present an invented retention period as a legal rule.
- The design includes destination permissions and recovery, not only reduced live record count.

> **💡 Key idea**
>
> Optional extension: Explain how you would prevent a record from being counted in both live and archived reporting during migration.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is a CSV export not a complete archive design?

**Answer:** It does not by itself establish retrieval, access control, relationship preservation, reporting, retention, or restoration behavior.

### 2. Can an old record still be operational?

**Answer:** Yes. Lifecycle state and unresolved business needs can keep it active even when its creation date is old.

### 3. What should determine the storage option?

**Answer:** The required retrieval and reporting contract, access model, recovery needs, availability, and operating costs.

## What to take away

- Design historical journeys before moving records.
- Carry identity, relationships, and authorization into the archive.
- Verify retrieval and restoration before approving deletion.

## Sources and further reading

- [Salesforce Archive policy configuration](https://help.salesforce.com/s/articleView?id=xcloud.archive_create_policies.htm&language=en_US&type=5)
- [Large data volume model design](https://trailhead.salesforce.com/content/learn/modules/large-data-volumes/design-your-data-model)
- [Integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)


---

# Design Record Access for a Dealer Network

S10 · senior · About 65 minutes with practice

![A small network of dealership locations with deliberate grouped access boundaries](https://sam-portal-production.up.railway.app/lesson-images/S10.jpg)

Model dealer isolation, central service access, and staff changes without copying the organization chart into an oversized role hierarchy.

## Before you begin

- Understand object permissions, FLS, OWD, roles, groups, and sharing rules.
- Know that Test_Drive__c has independent ownership through a lookup relationship.

## What you will learn

- Separate job capabilities from record visibility.
- Compare access models using both daily work and organizational changes.
- Define positive and negative access tests for realistic personas.

## 1. Start with people doing work

Anna sells vehicles at Northstar East. Max works at Northstar West. Oleg manages both dealers, and a central service team handles appointments across selected branches. Irina is a fictional client represented by business data, not automatically a Salesforce user. These roles describe business responsibilities; they do not yet prescribe profiles, Salesforce roles, or licenses.

Object and field permissions define what a user can do with a kind of record and its fields. Record access determines which particular records are available. A permission set for booking work should not automatically imply visibility into every dealer. Conversely, a sharing rule that exposes an appointment does not supply missing object or field permissions.

> **💡 Key idea**
>
> Create two linked matrices: permitted operations by job, and visible records by business relationship.

## 2. Compare two plausible record models

In one model, appointments are owned by individual salespeople, with a compact managerial role structure and dealer-specific sharing groups. In another, ownership is more centralized and access is assigned through explicit business groups. Neither is universally correct. Individual ownership supports some workflows naturally but makes staff turnover and transfers important. Central ownership can simplify one process while concentrating records and making sharing maintenance expensive.

Role hierarchy access normally opens records upward through the hierarchy; two peers do not automatically gain each other's records just because their job titles match. Custom objects can have relevant hierarchy settings, so record the actual configuration. Public groups collect users or supported membership types for access rules; their maintenance and nesting also need operational ownership.

The synthetic matrix below expresses the desired read access. An Edit column would need a separate requirement. It is deliberately incomplete about service exceptions so you must ask which branches and appointment states the central team needs. 'All service staff need everything' is a broad assumption, not a discovered requirement.

> **🔎 Check your understanding**
>
> Review the model against a record owned by a peer, not only against records owned by the test user.

**Synthetic target matrix for Test_Drive__c read access**

```text
Anna / East appointment: allow
Anna / West appointment: deny unless an approved exception exists
Max / East appointment: deny unless an approved exception exists
Oleg / East and West appointments: allow
Central service / selected appointments: requirement still needs precise criteria
Irina: no Salesforce login is implied by this matrix
```

## 3. Design for changes, not only today's screenshot

Test a transfer: Anna moves from East to West. Decide whether her historical East appointments remain visible, move to another owner, or follow a separate historical policy. Removing her from a group may not close access if she still owns the records or another sharing path remains. Changing role membership or ownership at scale can trigger expensive access recalculation.

Test opening a third dealer, replacing a manager, and adding a temporary service exception. Count the kinds of configuration changes required rather than promising a precise recalculation time. A model requiring hundreds of manual shares every week has a different support burden from a rule based on stable business criteria.

Manual sharing may suit a specific exception, but its lifecycle must be explicit. Current Salesforce includes a setting that can preserve manual shares during owner transfer. Do not rely on the old unconditional statement that every manual share disappears on transfer. For programmatic reasons, use the supported sharing mechanism for the object and API version.

> **⚡ Try it**
>
> Add a lifecycle column to each grant: why it exists, who owns it, and what event should remove it.

## 4. Validate a small matrix and review scale separately

Use two or three internal test personas as licensing permits, or rotate permissions carefully in a training org while recording each configuration. Check both allowed and denied operations through the actual user-facing path. An administrator's successful query does not prove Anna's access is correct.

Your small matrix verifies intended access semantics. It does not benchmark a network-wide role reorganization. For scale, document likely high-impact changes, record ownership concentration, group maintenance, and a representative-environment validation plan. Keep a business-readable diagram beside the technical configuration so Oleg can verify that the rules match responsibility.

> **⚠️ Watch out**
>
> Do not resolve a failing negative test by granting View All or Modify All unless that broad access is actually the approved requirement.

## ⚡ Independent practice: Choose a Northstar access model

Compare individual appointment ownership with a centralized ownership alternative using the same business matrix.

1. Write CRUD/FLS requirements separately from record visibility for Anna, Max, Oleg, and central service.
2. Specify OWD, ownership, hierarchy behavior, groups, rules, and exception lifecycle for both alternatives.
3. Walk through Anna's branch transfer and a new dealer opening.
4. Prepare positive and negative checks for an East and a West appointment.
5. Recommend one model with a clear operating tradeoff and an unresolved scale question.

### Your work is ready when

- Peer access is not assumed from job title or role name.
- Removing one grant is not automatically treated as removal of every access path.
- The decision includes staff movement and exception cleanup as well as today's visibility.

> **💡 Key idea**
>
> Optional extension: Add a temporary cross-dealer collaboration requirement without granting permanent global access.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why separate permissions from sharing?

**Answer:** They answer different questions: permitted operations and fields versus access to individual records. Both can be necessary for the same user action.

### 2. What makes staff transfer a useful test?

**Answer:** It exposes ownership, historic-access, group membership, and grant-removal assumptions that a static matrix can hide.

### 3. Why not reproduce every reporting line as a role?

**Answer:** A role design should support record access and manageable changes; the full organization chart may introduce unnecessary complexity and recalculation.

## What to take away

- Model capabilities and record visibility separately.
- Test lifecycle events and alternative access paths.
- Validate semantics locally and scale behavior in an appropriate environment.

## Sources and further reading

- [Platform sharing architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture)
- [Manual shares and custom row causes](https://developer.salesforce.com/blogs/2026/10/protect-apex-shares-custom-row-causes-on-standard-objects)
- [Ownership data skew](https://developer.salesforce.com/docs/platform/draes/guide/draes-group-membership-data-skew.html)


---

# Remove Excess Access Without Breaking Legitimate Work

S11 · senior · About 65 minutes with practice

![A reviewer removing one unnecessary key from a ring of permissions](https://sam-portal-production.up.railway.app/lesson-images/S11.jpg)

Audit the sources of an effective permission or record grant and prove that a proposed removal changes exactly the intended access.

## Before you begin

- Complete S10's access matrix.
- Understand permission sets, permission set groups, muting, and sharing.

## What you will learn

- Trace additive permissions and independent record-access paths.
- Use muting within its actual group boundary.
- Plan access reduction with business tests and a controlled recovery route.

## 1. An effective right can have several sources

Max can edit an East appointment even though the team deleted a sharing rule. The deletion removed one source of record access, not necessarily all sources. Max might own the record, have hierarchy access, belong to another shared group, receive an explicit share, or hold a broad permission that bypasses ordinary record sharing. Investigate the operation, object, field, and record separately.

Effective access means the result of all applicable grants and restrictions in the actual execution path. A screenshot of one permission set is not a complete explanation. Likewise, a successful Apex endpoint can reflect its execution mode rather than Max's normal interface access. Record the entry point and Apex API version when code is involved.

> **💡 Key idea**
>
> Draw every path that can authorize the action before deciding which path to remove.

## 2. Muting is local to a permission set group

A permission set group bundles permission sets for a work responsibility. Its muting permission set removes selected permissions from that group's contribution. It is not a global deny that overrides the profile, a separately assigned permission set, or another group. This additive model explains why a muted permission can remain effective.

The synthetic inventory below gives Max Edit from two independent places. Muting the group removes one contribution; the direct assignment still provides Edit. Removing the direct assignment may still be insufficient to prevent editing a particular record if another object-level source remains. Also inspect dependencies: muting a foundational permission can affect related permissions within the group's effective result.

Keep field-level security distinct from record sharing. A user with access to the appointment may still be unable to read a restricted field. A broad record permission is not a reason to skip checking fields in the real access path. Write each proposed change at the narrowest relevant layer.

> **🔎 Check your understanding**
>
> A negative access test must use the affected user's effective permissions after recalculation has completed.

**Synthetic grant inventory for Max**

```text
Profile: Test_Drive__c Read
Group Sales_Work: Read + Edit, with Edit muted in that group
Direct permission set Temporary_Edit: Edit
Record access: West ownership plus an explicit East collaboration share
Finding: group muting alone does not remove the direct Edit grant
Open question: when should Temporary_Edit and the collaboration share expire?
```

## 3. Build a removal plan with observable outcomes

Start with the business reason: Max should stop editing East appointments after temporary collaboration ends, while continuing to edit his approved West work. Determine whether the intended change concerns object Edit, East record access, or both. Removing object Edit globally might solve the East symptom by unnecessarily breaking West work.

Create a before-and-after matrix of allowed and denied actions. Include normal interface use, relevant API or Apex entry points, sensitive fields, and any supported restrictions. Restriction rules can narrow existing record visibility for supported objects and contexts; they do not grant missing access. Do not assume that multiple matching restriction rules combine into a reliable AND policy.

Choose a small pilot and document the prior configuration so an authorized operator can restore it if a legitimate workflow fails. Restoration should restore the intended prior grant, not indiscriminately grant administrator access. Assign an owner to confirm that temporary privileges were actually removed after the exercise.

> **⚡ Try it**
>
> For every removal, write two expected outcomes: the prohibited action fails and the legitimate neighboring action still succeeds.

## 4. Treat the audit as maintained evidence

An access inventory becomes stale when jobs, groups, owners, or integrations change. Store the reason, responsible owner, review date, and expiration condition for exceptions. Where possible, use supported access-summary and diagnostic tools to gather evidence, but interpret the results against the complete business operation.

Use a small synthetic matrix for the lesson. If licenses prevent simultaneous personas, document the limitation and inspect one configuration at a time. Do not present a paper grant graph as an executed access test. A clear audit can still show exactly which checks remain to be run.

The final deliverable should explain why access existed, what changed, and how the business verified the result. A list of deleted permission sets without this causal explanation does not establish that access is now correct.

> **⚠️ Watch out**
>
> Removing a sharing rule is not proof of denied access; verify the effective result through the intended entry point.

## ⚡ Independent practice: Close Max's temporary access

Use the inventory to remove the expired East collaboration while preserving legitimate West work.

1. Draw object, field, and record-access sources as separate layers.
2. Explain the effect of group muting before changing any other grant.
3. Propose the smallest change that satisfies the business requirement.
4. Write allowed and denied checks for West and East appointments and one restricted field.
5. Prepare a before/after evidence table and a narrowly scoped recovery step.

### Your work is ready when

- Muting is never described as a user-wide deny.
- The plan checks independent grants after each removal.
- Legitimate West work remains a specific acceptance criterion.

> **💡 Key idea**
>
> Optional extension: Add an Apex endpoint on API 68.0 and explain why its explicit access mode belongs in the audit.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why can Edit remain after group muting?

**Answer:** The same permission can come from a profile, a direct permission set, or another group; muting affects only the selected group's contribution.

### 2. Why might deleting a share not close a record?

**Answer:** Ownership, hierarchy, other shares, rules, or broad permissions may still provide access.

### 3. What makes an access-removal test complete?

**Answer:** It verifies the prohibited operation fails while required neighboring operations continue to work under the intended persona and entry point.

## What to take away

- Explain effective access through all relevant paths.
- Use muting at its group boundary.
- Prove both removal and preservation of legitimate work.

## Sources and further reading

- [Mute permissions in permission set groups](https://trailhead.salesforce.com/content/learn/modules/permission-set-groups/mute-permissions-in-permission-set-groups)
- [Sharing architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture)
- [Restriction rules](https://help.salesforce.com/s/articleView?id=platform.security_restriction_rule.htm&language=en_US&type=5)


---

# Plan a Deferred-Sharing Maintenance Window

S12 · senior · About 65 minutes with practice

![A maintenance calendar beside a paused sharing calculation and a deliberate recalculation step](https://sam-portal-production.up.railway.app/lesson-images/S12.jpg)

Write an operational runbook for a large access-model change, including the distinct steps of resuming calculations and recalculating accumulated changes.

## Before you begin

- Understand sharing rules, groups, ownership, and effective-access tests.
- Complete S10 and S11 or equivalent access-model work.

## What you will learn

- Explain what sharing-rule deferral does and does not pause.
- Design a maintenance sequence with verification gates.
- Separate a tabletop rehearsal from an authorized production operation.

## 1. Deferral changes timing, not the intended access policy

Northstar is reorganizing dealer groups and roles. Recalculating sharing rules after every individual change may create unnecessary repeated work. Sharing-rule deferral can temporarily suspend relevant automatic calculations while a planned set of changes is made. The target access policy remains the business requirement; deferral is an operational timing mechanism.

Availability matters. The feature is not enabled by default in every org, and Salesforce documentation describes contacting Support to enable it. The operator also needs the relevant permissions. This classroom exercise does not ask you to enable the feature, reorganize a real role hierarchy, or assume that a Developer Edition can reproduce a large maintenance event.

> **💡 Key idea**
>
> A runbook describes a controlled operation with owners, checkpoints, and recovery decisions. It is more than a list of buttons.

## 2. Know exactly what is paused

Deferring sharing-rule calculations does not freeze every sharing-related mechanism. Manual shares and changes involving teams or queues can still be evaluated. Some role changes matter to sharing rules while other changes do not fall under the same deferral. Group-membership calculations have their own considerations; do not collapse all these mechanisms into a single 'security off' switch.

Existing record access can temporarily differ from the intended final configuration while changes await recalculation. This creates a business and access-management risk, not simply a performance benefit. Define which users and operations may continue during the window, how unexpected visibility will be handled, and who can stop the procedure.

The synthetic window below is a rehearsal timeline. Its times organize discussion and do not predict how long Salesforce will take to recalculate a real org. A real duration depends on the organization's data, access structure, concurrent activity, and platform behavior.

> **⚠️ Watch out**
>
> Do not claim that deferral disables permission checks or makes all access changes wait until Resume.

**Synthetic maintenance rehearsal**

```text
T0: record current configuration and expected persona matrix
T1: confirm approved scope, operator, recovery owner, and available window
T2: suspend relevant sharing-rule calculations
T3: apply reviewed group/role changes
T4: resume automatic calculations for new changes
T5: request full sharing-rule recalculation for accumulated changes
T6: wait for completion and verify allowed/denied access
T7: close only after evidence and ownership checks pass
```

## 3. Resume and Recalculate are different gates

Resume re-enables automatic handling of new changes. It does not replace the required full recalculation for changes accumulated during suspension. If the operator stops after Resume, the configuration may look finished while record access still reflects stale calculations. The runbook must therefore have two separate completion checks.

After requesting recalculation, monitor the supported status signals and wait for the relevant work to complete before declaring success. Then execute the persona matrix: Anna's East appointments, Max's West appointments, Oleg's managerial view, and explicitly denied cross-dealer cases. Include exceptions that should have expired.

Do not assume that reverting a role or group definition instantly reverses every consequence of an interrupted operation. Recovery may require restoring configuration, resuming work, recalculating, and verifying access again. Decide who can authorize each step and what evidence supports the decision.

> **🔎 Check your understanding**
>
> The maintenance window is not complete when the last configuration edit is saved; it is complete when the final access state is verified.

## 4. Prepare a useful rehearsal

Create three tabletop failure cards: the change list is only partially applied, the operator resumes but forgets recalculation, and a manual share is added during the window. For each, explain the expected uncertainty and the next safe decision. Avoid inventing automatic rollback guarantees.

Measure the operation through checkpoint timestamps, configuration counts, recalculation status, verification coverage, and unresolved exceptions. In a real approved environment these become observations. In this lesson they remain a plan unless you perform a separately authorized small test.

A good runbook includes a short communication message for Oleg, the business owner: which users may notice changes, what is temporarily restricted, what defines completion, and how to report unexpected access. Keep technical console details in the operator section so the business message stays understandable.

> **⚡ Try it**
>
> Assign a named role to every gate: operator, access verifier, business owner, and recovery decision-maker.

## ⚡ Independent practice: Rehearse a dealer-group reorganization

Prepare a runbook and three failure-card responses for a synthetic Northstar access change.

1. List the approved configuration changes and capture a proposed before/after access matrix.
2. Define prerequisites, feature availability checks, permissions, owners, and stop conditions.
3. Write Suspend, change, Resume, Recalculate, completion monitoring, and verification as separate steps.
4. Work through the three failure cards and state what must be verified before resuming normal use.
5. Add an evidence checklist and a short business communication draft; do not run the maintenance operation.

### Your work is ready when

- Resume and full Recalculate are explicit separate requirements.
- The plan acknowledges mechanisms that are not paused by sharing-rule deferral.
- Completion requires verified access and resolved exceptions, not only saved configuration.

> **💡 Key idea**
>
> Optional extension: Explain how you would coordinate unrelated group-membership work during the same window.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What remains unfinished after Resume alone?

**Answer:** The changes accumulated while sharing-rule calculations were suspended still require the documented full recalculation.

### 2. Are manual shares necessarily delayed by this deferral?

**Answer:** No. Sharing-rule deferral does not pause every sharing mechanism; manual shares are among the changes evaluated separately.

### 3. Why rehearse recovery?

**Answer:** An interrupted access change can leave configuration and effective access out of sync. Recovery needs a decision sequence and verification, not an assumed instant undo.

## What to take away

- Deferral is a controlled scheduling procedure.
- Resume and Recalculate are distinct.
- Close the window on verified access, not on operator optimism.

## Sources and further reading

- [Defer sharing rule calculations](https://help.salesforce.com/s/articleView?id=platform.security_sharing_rule_recalculation.htm&language=en_US&type=5)
- [Sharing architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture)
- [Ownership skew](https://developer.salesforce.com/docs/platform/draes/guide/draes-group-membership-data-skew.html)


---

# Control Privileged Code and External-User Access

S13 · senior · About 70 minutes with practice

![An external user and internal application separated by a clear guarded boundary](https://sam-portal-production.up.railway.app/lesson-images/S13.jpg)

Review identity, permissions, record sharing, and input validation as separate trust boundaries, using explicit Apex access modes.

## Before you begin

- Know permission layers, Apex sharing keywords, and API integrations.
- Understand user mode and system mode in the API 68.0 baseline.

## What you will learn

- Explain why authentication is not authorization.
- Identify the narrow responsibility of a privileged operation.
- Write negative tests for external identities and untrusted input.

## 1. Name the caller and the requested action

An external portal asks Salesforce to retrieve Irina's appointment. The request contains an appointment Id and a customer identifier. Neither value is proof that the caller is entitled to that appointment. Authentication establishes who the caller is; authorization establishes what that identity may do. Input validation checks whether the supplied values are acceptable for the operation. These checks solve different problems.

A trust boundary separates information or actions with different assumptions about who controls them. Browser input, integration payloads, and model-generated tool arguments should cross that boundary as untrusted data. The server should derive or verify the permitted customer relationship rather than accepting a caller's claim that a record belongs to them.

> **💡 Key idea**
>
> An Id is a locator, not an authorization token.

## 2. Read both the class and the operation mode

Sharing keywords govern record-level behavior in Apex contexts, while database operation modes affect the operation's security checks. With API 68.0, the newer default database mode is user mode. An explicit WITH USER_MODE query applies the user's sharing, object, and field checks even when the surrounding class is declared without sharing. Conversely, specifying system mode does not mean that a with-sharing class has automatically become without sharing.

This is why 'the class is with sharing' is not a complete security review, and 'Apex always ignores permissions' is an outdated blanket statement. Inspect the class version, call path, sharing declaration, and each operation's intended mode. Explicitly document any elevation rather than depending on an implicit default inherited from an old example.

The code below illustrates a user-mode read contract, not a complete externally exposed endpoint. A real endpoint still needs appropriate entry-point authorization, allowed field selection, input checks, and error behavior. Do not infer those missing pieces from one query.

> **🔎 Check your understanding**
>
> For every operation, explain which checks are applied and why the chosen mode matches the business permission.

**API 68.0 illustration: user-mode query, not a complete endpoint**

```apex
public with sharing class AppointmentReader {
    public static List<Test_Drive__c> readVisible(Set<Id> ids) {
        return [SELECT Id, Status__c, Vehicle__c
                FROM Test_Drive__c
                WHERE Id IN :ids WITH USER_MODE];
    }
}
```

## 3. If elevation is needed, make its scope small

A maintenance service might legitimately update a derived status across records that Anna cannot edit directly. That does not justify exposing an unrestricted 'update any object' method to her browser. Define the exact action, allowed records, permitted fields, initiating identity, and auditable reason. Keep privileged code behind a narrow boundary and validate its caller before performing elevated work.

Use an allowlist when client input controls a structural choice such as a sort field or operation name. Bind values in queries where supported, but do not assume a bound filter value validates an independently concatenated field name. If using stripInaccessible, use the returned cleaned records and understand that field stripping is not a substitute for the full record-access policy.

External users require particular care because license types and sharing models differ. A high-volume external user does not necessarily participate in the same role hierarchy as an internal employee. Verify the actual license, product, and supported access mechanism. Do not simulate an external persona with an internal administrator and call the result equivalent.

> **⚠️ Watch out**
>
> A broad OAuth scope or a successful token response does not replace the integration user's object, field, and record permissions.

## 4. Prove the denied paths

Build a synthetic matrix: an authorized appointment, another client's appointment, a nonexistent Id, a forbidden field, and a malformed operation request. Decide whether the response should reveal that a hidden record exists. Errors should be useful without disclosing another customer's data.

Run a small permitted test under genuinely limited personas when available. Otherwise produce a threat review and an executable test plan, clearly marked unexecuted. Record the security context with each result. A test that passes under an administrator says little about the portal caller.

The final review should show where identity is established, where the requested business action is authorized, where data access is enforced, and where input is validated. Keep these checks explicit even if one platform API supplies several of them.

> **⚡ Try it**
>
> Write the unauthorized case before the happy path; it often exposes an unclear trust boundary.

## ⚡ Independent practice: Review an appointment-read endpoint

Design the authorization contract for a portal caller who may read only their own appointments.

1. Draw browser, authentication layer, endpoint, data access, and response boundaries.
2. List trusted identity attributes and untrusted request values.
3. Specify the API 68.0 query mode and any deliberately privileged helper.
4. Create five positive/negative input cases, including another client's valid record Id.
5. Document license assumptions, required permissions, sanitized errors, and how the restricted persona will be tested.

### Your work is ready when

- The contract does not trust a client-supplied customer Id as proof of ownership.
- Identity, CRUD/FLS, record sharing, and payload validation are treated separately.
- Any elevated operation has a narrow purpose and explicit negative tests.

> **💡 Key idea**
>
> Optional extension: Explain how the plan changes for a different external-user license without assuming identical role behavior.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is a valid record Id insufficient authorization?

**Answer:** Knowing an identifier does not establish that the caller may access or change the identified record.

### 2. What does WITH USER_MODE do inside without sharing?

**Answer:** For that operation it applies the user's sharing, object permissions, and field permissions; the class label alone does not override the explicit mode.

### 3. What should a privileged helper avoid accepting?

**Answer:** Unrestricted object names, field sets, record selections, or arbitrary operations from an untrusted caller without a narrow validated business contract.

## What to take away

- Review identity and authorization independently.
- Use explicit operation modes and version-aware reasoning.
- Keep elevated work narrow and test denied access.

## Sources and further reading

- [Set an access mode for database operations](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-enforce-usermode.html)
- [Apex versioned behavior changes](https://developer.salesforce.com/docs/platform/apex-ref/references/apex-ref/versioned-behavior-changes.html)
- [Sharing architecture and external-user models](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture)
- [Dynamic SOQL](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-dynamic-soql.html)


---

# Choose System Boundaries and Data Ownership

S14 · senior · About 65 minutes with practice

![Two systems with one record clearly owned by one system and a controlled synchronisation path](https://sam-portal-production.up.railway.app/lesson-images/S14.jpg)

Decide which system owns each fact, how other systems use it, and what happens when they disagree.

## Before you begin

- Understand REST integration, asynchronous events, and batch processing.
- Know Northstar's vehicle, client, and appointment records.

## What you will learn

- Distinguish a system of record from a copied view.
- Choose interaction patterns using latency and consistency requirements.
- Define reconciliation before promising reliable integration.

## 1. One business process can have several authoritative systems

Northstar uses Salesforce for customer interactions, a dealer management system for workshop operations, and a stock service for vehicle availability. A system of record is the authoritative source for a particular fact. It does not have to own every field about an entity. Salesforce may own the requested appointment while the scheduling system owns the confirmed workshop slot.

Make ownership precise at the field or decision level. If both systems can independently declare the same slot reserved, a conflict policy is required. Copying the value into Salesforce does not transfer authority. Distinguish the authoritative state from a cached or replicated view, and show when the view was last refreshed.

> **💡 Key idea**
>
> Ask who is allowed to decide a fact, not only which system happens to store a copy.

## 2. Match the pattern to the business promise

A synchronous request asks another system for an answer while the caller waits. It fits a decision that requires a current authoritative result, but introduces a dependency into the user's critical path. An asynchronous message decouples timing, but the interface must communicate pending work and eventual outcomes. Batch synchronization moves a set of changes periodically; it can suit information whose freshness tolerance is larger.

Virtual access reads information without necessarily maintaining a full local copy. It can reduce duplication, but availability, query support, performance, authorization, and product licensing must fit the use case. It is not automatically simpler just because less data is stored locally.

The synthetic decisions below illustrate differing freshness needs. They are proposed requirements to discuss with Oleg, not defaults imposed by Salesforce. If the business later says availability must be confirmed atomically with reservation, a display-only stock feed is insufficient. You need a reservation contract with the authoritative system.

> **🔎 Check your understanding**
>
> State the acceptable age of a value and the behavior when its source is unavailable.

**Synthetic data-ownership worksheet**

```text
Client contact preference: Salesforce owns; changes sent to permitted consumers
Vehicle stock state: stock service owns; Salesforce displays a dated view
Requested test-drive: Salesforce owns the request
Confirmed slot: scheduling service owns the reservation decision
Monthly dealer summary: derived report; refresh tolerance agreed with Oleg
Open issue: whether booking requires synchronous reservation or may remain Pending
```

## 3. Design the failure contract with the success contract

Suppose Anna saves a request but the scheduling service is unavailable. If the approved process allows Pending, show that state and retain a recoverable work item. Do not display Confirmed simply because a message was enqueued. If the process requires immediate confirmation, return an understandable failure or an explicitly permitted alternative instead of inventing a reservation.

Pending is a user-facing integration state in this scenario, not a value already present in the starter picklist. The starter Test_Drive__c.Status__c values are Requested, Confirmed, Completed, and Cancelled. Keep an unconfirmed request as Requested and define a separate integration-state field if the implementation needs finer detail. Document any new metadata and map source states deliberately before writing them.

Reconciliation compares systems to find missing or inconsistent work. Define the business key, expected state, comparison frequency, responsible operator, and permitted repair. A message stream alone is not a permanent record of every business decision. A long outage or a consumer defect can require rebuilding state from an authoritative source.

Prevent an update loop. If Salesforce publishes a change, the DMS echoes it, and Salesforce republishes it as a new local decision, the systems can generate endless work. Use explicit source identity, operation identity, and ownership rules. Do not solve the problem by indiscriminately ignoring every inbound update.

> **⚡ Try it**
>
> For each integration arrow, write who initiates it, what outcome it promises, and how an unresolved outcome is found.

## 4. Keep the first implementation narrow

Begin with one field-level ownership map and one complete business journey. A small mock service can return Available, Unavailable, Timeout, and an existing reservation for a repeated key. This tests the application's reaction without requiring a real DMS or an industry product license.

Measure user-visible wait for synchronous dependencies and pending-work age for asynchronous ones. Count unresolved mismatches in reconciliation. These metrics answer different questions; a low API error count can coexist with many appointments stuck Pending because a consumer stopped processing.

Do not copy all DMS data into Salesforce because a future use might exist. Every copy brings storage, privacy, freshness, mapping, and support responsibilities. On the other hand, a carefully chosen local view may be justified when staff need to continue working through a brief dependency outage. Explain the tradeoff rather than adopting 'never copy' as another absolute rule.

> **⚠️ Watch out**
>
> An integration diagram without data ownership and failure behavior is incomplete, even when every arrow names an API.

## ⚡ Independent practice: Choose five Northstar integration patterns

Complete the ownership worksheet and choose an interaction pattern for each fact.

1. Name the authoritative owner, allowed writers, consumer, and stable business key for each row.
2. State freshness tolerance and what Anna sees during a source outage.
3. Choose synchronous request, asynchronous message, scheduled synchronization, or supported virtual access with a reason.
4. Design one reconciliation check and one loop-prevention rule.
5. Use a mock response table to walk through successful reservation, timeout, duplicate request, and unavailable slot.

### Your work is ready when

- A copy is never mistaken for the authoritative decision.
- The user-facing status matches the actual confirmation guarantee.
- Each asynchronous or replicated flow has a way to find and resolve missing work.

> **💡 Key idea**
>
> Optional extension: Explain how the design changes if Oleg requires booking during a DMS outage.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Must one system own every field of an entity?

**Answer:** No. Authority can be divided by fact or decision, provided the write rules and conflict behavior are explicit.

### 2. What does an asynchronous acceptance prove?

**Answer:** It proves only the stage defined by its contract, often that work was accepted or queued; it does not automatically prove downstream completion.

### 3. Why design reconciliation if events are already used?

**Answer:** Events can be missed, mishandled, or unavailable after retention. Reconciliation compares durable business state and repairs unresolved differences.

## What to take away

- Assign authority before choosing a transport.
- Match consistency and freshness to the business promise.
- Define recovery and reconciliation on every important boundary.

## Sources and further reading

- [Salesforce integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Asynchronous processing decision guide](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)
- [Decoupled event publishing](https://developer.salesforce.com/docs/platform/platform-events/guide/platform-events-considerations-decoupled-processes.html)


---

# Handle Duplicate and Out-of-Order Events

S15 · senior · About 70 minutes with practice

![Out-of-order message cards being placed into a coherent sequence with a duplicate set aside](https://sam-portal-production.up.railway.app/lesson-images/S15.jpg)

Design a consumer that produces a consistent business outcome when messages repeat or arrive in an unexpected sequence.

## Before you begin

- Understand Platform Events and transaction boundaries.
- Complete S14's data-ownership decisions and know stable business identifiers.

## What you will learn

- Separate event identity, operation identity, and stream position.
- Define an explicit policy for duplicates and older versions.
- Explain why one durable business effect requires more than a replay checkpoint.

## 1. Delivery and business effects have different identities

Northstar receives appointment-status events from its scheduling service. An event identifier names a particular message. A business operation identifier names the action that message represents. A replay position tells a subscriber where it is in a stream. These values may be related, but they are not interchangeable.

A publisher can send the same business operation again as a new event after a timeout. Deduplicating only the event identifier would not recognize that second message as the same operation. Conversely, two valid updates to the same appointment are not duplicates merely because they share an appointment Id. Define the unit you intend to apply once.

> **💡 Key idea**
>
> Write the business sentence first: 'Confirm reservation R once,' rather than 'Process every message once.'

## 2. Choose a version policy that matches the payload

The synthetic events below carry a complete current status and a monotonically increasing version assigned by the authoritative scheduling system. Under that explicit contract, version 3 can replace version 1, and a later arrival of version 2 should not move the appointment backward. The version is scoped to one appointment; it does not order all activity across every dealer.

A delta event, such as 'increase reserved capacity by one,' needs different treatment. Skipping an earlier delta because a higher version arrived can lose part of the calculation. Do not reuse the snapshot-state policy without checking the payload meaning. You may need ordered processing, gap detection, or reconciliation with the source.

For an equal version with a different payload, record a conflict rather than silently accepting whichever arrived last. Equal version plus matching operation and payload can be a harmless repeat. The distinction makes final state explainable and helps detect a publisher defect.

These are external status snapshots, not direct DML input for the starter. Rescheduled is absent from its restricted Status__c picklist. The local exercise keeps the external state in its own object. For an org implementation, declare separate source-status and source-version fields or an approved mapping first; never write an unmapped external label directly into Status__c. The exercise does not provide the time needed to update Scheduled_At__c after a reschedule.

> **🔎 Check your understanding**
>
> Ordering guarantees must specify their scope: one entity, one producer, one stream, or the business process.

**Synthetic complete-state events in arrival order**

```json
[
  {"appointmentKey":"A-101","operationKey":"confirm-7","version":1,"status":"Confirmed"},
  {"appointmentKey":"A-101","operationKey":"cancel-9","version":3,"status":"Cancelled"},
  {"appointmentKey":"A-101","operationKey":"reschedule-8","version":2,"status":"Rescheduled"},
  {"appointmentKey":"A-101","operationKey":"cancel-9","version":3,"status":"Cancelled"}
]
```

## 3. Make the state change and deduplication durable

An in-memory Set disappears when the worker restarts. For effects that must survive a restart, use durable state: for example, an operation ledger or a stored source version with a suitable uniqueness and concurrency strategy. If two workers can race, a check-then-insert sequence without protection can allow both to act. Explain where uniqueness or transaction coordination closes that gap.

When both the ledger update and the business update occur inside one Salesforce transaction, they can be designed to commit or fail together. A remote email or external reservation is outside that local database transaction. Its own idempotency key, acknowledgment, and recovery contract are still necessary. A Salesforce rollback cannot unsend a remote message already accepted elsewhere.

Checkpoint only according to the subscriber's documented delivery model and your durability boundary. A replay checkpoint is not a substitute for recording whether the business effect committed. Platform Event replay identifiers are opaque; do not calculate a next value by adding one. For Pub/Sub Platform Events, event.id serves a different purpose from replay_id, and source business identity still matters.

> **⚠️ Watch out**
>
> Do not promise universal exactly-once delivery. Define and test the narrower business effect your system can make idempotent.

## 4. Test restart and conflict, not only the happy sequence

A local table or pure function can apply the four supplied events without a live event bus. The expected final state under the stated snapshot contract is version 3, Cancelled, with one cancellation business effect. Preserve a reason for ignoring the older version and recognizing the repeat.

Then simulate a crash between receiving an event and committing the result. Repeat the event and verify the intended behavior. Add equal-version conflicting data and an unknown appointment. Count applied operations, harmless duplicates, stale events, conflicts, and unresolved items. Keep these categories visible rather than reporting every discarded message as a success.

If you later test in a training org, distinguish consumer logic tests from a real end-to-end delivery test. A correct function cannot alone prove the transport, permissions, publication timing, or subscriber configuration.

> **⚡ Try it**
>
> Keep an event-to-decision ledger so a reviewer can reconstruct why the final state is correct.

## ⚡ Independent practice: Build an explainable event reducer

Apply the synthetic events to an appointment state and record a decision for every arrival.

1. Define operation identity, entity identity, version authority, and snapshot semantics.
2. Implement a small pure reducer or a spreadsheet decision table.
3. Apply the four events and show one final Cancelled state at version 3.
4. Add a restart, an equal-version conflict, and an unknown appointment.
5. Describe where a durable ledger and concurrency protection belong in a Salesforce implementation.

### Your work is ready when

- The older version cannot revert the newer state.
- The duplicate cancellation does not repeat the business effect.
- The answer explains why the same policy would not automatically work for delta events.
- External status labels stay separate from the starter picklist until a documented mapping or metadata extension exists.

> **💡 Key idea**
>
> Optional extension: Add a remote notification and design its idempotency and uncertain-response handling separately.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is replay_id not the business idempotency key?

**Answer:** It identifies a stream position, not necessarily the same business operation across retries or republishing, and it is opaque.

### 2. Can a higher version always replace earlier events?

**Answer:** Only under a suitable contract, such as complete current-state snapshots. Delta events may require all earlier effects or explicit gap recovery.

### 3. What is wrong with an in-memory duplicate Set?

**Answer:** It does not survive restarts and does not by itself coordinate concurrent workers or remote effects.

## What to take away

- Separate transport identity from business identity.
- Choose ordering rules from payload semantics.
- Make important effects and recovery state durable.

## Sources and further reading

- [Pub/Sub event durability and replay](https://developer.salesforce.com/docs/platform/pub-sub-api/guide/event-message-durability.html)
- [Integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Decoupled event processes](https://developer.salesforce.com/docs/platform/platform-events/guide/platform-events-considerations-decoupled-processes.html)


---

# Recover from an External-Service Outage Without a Retry Storm

S16 · senior · About 65 minutes with practice

![An unavailable external system with buffered work and a careful controlled restart path](https://sam-portal-production.up.railway.app/lesson-images/S16.jpg)

Build bounded retries, visible failed work, and a paced recovery process that can handle new arrivals while draining a backlog.

## Before you begin

- Understand asynchronous work and S15's idempotency rules.
- Be able to distinguish a temporary network failure from invalid business input.

## What you will learn

- Classify failures before retrying them.
- Explain backoff, jitter, and a circuit breaker in practical terms.
- Define controlled recovery and a measurable backlog-clearing plan.

## 1. Retries are additional load

The scheduling service becomes unavailable while Anna and Max continue creating permitted Pending requests. If every failure retries immediately, the system produces more requests precisely when the dependency has less capacity. This is a retry storm: repeated attempts amplify the original outage and can consume Salesforce resources as well.

Begin with failure classification. A malformed request missing a required vehicle key will not repair itself through repeated identical calls. A temporary connectivity failure might recover. A timeout is especially important because the remote system may have completed the operation before the response was lost. That attempt needs idempotency or reconciliation, not an assumption that nothing happened.

> **💡 Key idea**
>
> Retry only when another attempt has a plausible path to a different outcome.

## 2. Define a bounded policy

Backoff increases the delay between attempts. Jitter adds a controlled random spread so many workers do not retry at exactly the same instant. A retry bound limits the number of attempts or the total age of retryable work. These are policy choices to test against the service contract, not universal magic numbers.

The synthetic policy below separates temporary errors from validation failures and unknown outcomes. Its delays are example design values, not Salesforce scheduling guarantees. A worker should store a future eligibility time or use an appropriate supported scheduling mechanism; do not hold an Apex transaction open by busy-waiting for the delay.

A circuit breaker is a controlled decision to stop making normal calls to a dependency after evidence of sustained failure, then allow a small probe or limited recovery path. It protects the system from repeatedly attempting work that is very likely to fail. The design must still show users and operators what remains Pending.

> **🔎 Check your understanding**
>
> Every retryable item needs an attempt count, last outcome, next eligible time, stable business key, and terminal handling.

**Synthetic outage policy to review, not a platform default**

```text
Validation failure: stop automatic retry; request data correction
Temporary 5xx/network failure: bounded delayed attempts with jitter
Rate-limit response: honor documented guidance and reduce demand
Timeout after possible write: retry with stable idempotency key or reconcile
Attempt/age limit reached: Needs attention with a responsible owner
Recovery: probe first, then gradually increase throughput
```

## 3. Preserve failed work and make ownership clear

An error queue is a durable list of work requiring attention, sometimes called a dead-letter queue. It is not a place to hide records forever. Include a concise error category, the relevant business identifier, the last attempt, and the action required. Avoid storing unnecessary customer details or complete authentication-bearing requests.

Oleg should see the number and age of unresolved bookings, while the operator can distinguish data correction from dependency recovery. A retry button should not blindly assign a new operation identity. Reusing the same business key allows the service to recognize a previously completed reservation.

Specify what users may do while the dependency is down. If the approved product contract allows a Pending request, explain that no slot is yet confirmed. If the business requires immediate reservation, the interface must follow a different failure path. Queue design cannot override that product decision.

> **⚠️ Watch out**
>
> Moving failures into a queue does not make the customer outcome successful.

## 4. Recover at a controlled rate

After the dependency returns, do not release the entire backlog at once. First verify a small probe, then increase the allowed rate while watching errors, response time, and queue age. Capacity must handle both new requests and old work. If arrivals equal completions, the backlog does not shrink.

Use a tabletop model: 600 waiting items, 100 new items per minute, and a hypothetical recovered capacity of 120 completions per minute. The net drain is twenty per minute, so the model needs thirty minutes to clear the initial backlog, assuming those rates remain constant. This arithmetic is useful planning, not evidence of actual Salesforce or provider capacity.

A small exercise can simulate success, timeout, invalid input, and rate limitation without calling a live service. Record transitions and the total number of attempts. Verify that a permanent failure does not loop and that a duplicate recovery attempt does not produce another reservation.

> **⚡ Try it**
>
> Measure oldest pending age, useful completions, and unresolved terminal failures throughout recovery.

## ⚡ Independent practice: Write an outage and recovery state machine

Design the statuses and transitions for scheduling requests during a synthetic thirty-minute outage.

1. Define Pending, Retry eligible, In progress, Completed, and Needs attention with clear meanings.
2. Assign each supplied failure category to a transition and a responsible owner.
3. Specify bounded backoff and jitter without implementing an Apex wait loop.
4. Model the 600-item recovery example and identify the assumptions.
5. Run a local simulation or manual trace that includes a duplicate attempt and a permanent validation failure.

### Your work is ready when

- No path retries forever without a bound or operator state.
- Unknown outcomes preserve the same business operation identity.
- The recovery calculation separates new arrivals from backlog drain and is labelled hypothetical.

> **💡 Key idea**
>
> Optional extension: Explain how a circuit breaker changes behavior when the provider fails again during recovery.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why add jitter?

**Answer:** It spreads retry timing so many failed requests do not return simultaneously and create another burst.

### 2. What is the purpose of an error queue?

**Answer:** To preserve unresolved work with enough context and ownership to correct, reconcile, or deliberately abandon it under an approved policy.

### 3. Why might a recovered worker fail to clear the backlog?

**Answer:** Its completion rate may only match or remain below the rate of new arrivals, leaving no spare capacity for old work.

## What to take away

- Classify before retrying.
- Bound attempts and preserve unresolved business work.
- Recover gradually and observe net backlog drain.

## Sources and further reading

- [Integration patterns and error handling](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Asynchronous processing constraints](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)
- [Named and external credentials](https://developer.salesforce.com/docs/platform/named-credentials/guide/get-started.html)


---

# Reconstruct an Incident from Business and Technical Evidence

S17 · senior · About 65 minutes with practice

![Three simple telemetry panels converging on one incident timeline](https://sam-portal-production.up.railway.app/lesson-images/S17.jpg)

Build an evidence-based incident timeline and choose corrective actions that address the demonstrated failure mechanism.

## Before you begin

- Understand event publication stages, asynchronous processing, and idempotency.
- Be able to read a sanitized execution or integration log.

## What you will learn

- Distinguish symptom, contributing condition, and demonstrated cause.
- Correlate publication, delivery, and business completion.
- Write a useful post-incident review with testable actions.

## 1. Begin with the customer outcome

Irina did not receive a test-drive notification. Oleg sees a successful booking and a log message saying 'event published.' These facts do not establish that a notification provider received or delivered anything. Define the missing business outcome before searching for the most dramatic error line.

Observability means having enough useful signals to understand what the system did and why. Logs describe individual events, metrics summarize behavior over time, and traces connect stages of an execution. None is sufficient alone. A low error count can coexist with missing work if the code never attempted the relevant stage or logged success too early.

> **💡 Key idea**
>
> The first incident question is 'What outcome is missing for whom?' rather than 'Which log looks suspicious?'

## 2. Follow the stages and their acknowledgments

Platform Event publication is asynchronous. A successful SaveResult from EventBus.publish reports the intermediate queuing result, not the final publication result or a subscriber's business completion. Publish callbacks can report the final publication outcome for supported events, but even publication success does not prove that an external provider completed its work.

The synthetic timeline below shows a mismatch between the dashboard's definition of success and the actual process. The subscriber attempted a provider call, timed out, and recorded no durable recovery state. The evidence supports a lost unresolved outcome; it does not prove whether the provider delivered the message before the timeout.

Keep timestamp sources explicit. Browser, Salesforce, and provider clocks can differ, and logs can arrive late. Use operation identifiers and causal relationships where possible rather than relying only on apparently adjacent timestamps. Preserve uncertainty when a stage lacks evidence.

> **🔎 Check your understanding**
>
> Give each acknowledgment a precise meaning: queued, published, consumed, provider accepted, or business outcome confirmed.

**Synthetic incident evidence**

```text
09:00:00 Booking A-101 committed
09:00:01 Publisher SaveResult isSuccess=true; dashboard marks Notified
09:00:03 Subscriber starts notification operation N-77
09:00:05 Provider request times out; no durable retry item recorded
09:30:00 Irina reports no message
Unknown: whether the provider accepted N-77 before the timeout
Known defect: dashboard marked success before downstream confirmation
```

## 3. Separate recovery from causal explanation

The immediate recovery task is to reconcile N-77 with the provider or apply the approved idempotent retry procedure. Blindly sending a new notification with a new operation key can create duplicates. The incident explanation is a separate task: why did an uncertain outcome disappear, and why did the dashboard misreport it?

A cause statement should connect a mechanism to evidence. 'The developer was careless' explains neither the status transition nor the missing recovery state. A stronger statement identifies that code used the queuing acknowledgment as a completed-notification signal and did not persist timeout handling. Contributing conditions might include a test suite that covered only successful responses.

An action such as 'be more careful' is not verifiable. Better actions include separating notification states, adding a timeout test, persisting recovery work, monitoring old Pending items, and assigning an owner to the reconciliation procedure. Each action needs a completion test and a responsible role.

> **⚡ Try it**
>
> Write corrective actions as observable changes with an owner and a verification method.

## 4. Measure the process that can fail silently

Add counts and age distributions for Pending notifications, attempts, confirmed provider acknowledgments, and unresolved outcomes. Alerting thresholds should reflect the business tolerance and observed normal behavior. Do not invent a universal threshold from this fictional incident.

For longer interruptions, remember that an event bus is not an unlimited archive. Standard Platform Event and CDC retention is limited, and recovery beyond the available replay window may require reconciliation from durable business state. A checkpoint is useful, but it does not replace a recovery source.

Your classroom submission can be a timeline, an evidence table, and a test proposal. Clearly mark supplied statements as synthetic and distinguish inference from proof. You do not need to manufacture a production outage to demonstrate disciplined incident reasoning.

> **⚠️ Watch out**
>
> An unexplained gap is a finding. Do not fill it with a confident story that the available evidence cannot support.

## ⚡ Independent practice: Write a short Northstar incident review

Explain the synthetic N-77 notification incident and propose a safe recovery and prevention plan.

1. Create a timeline with evidence source, event, known consequence, and uncertainty.
2. State the customer impact without assuming the provider's unknown outcome.
3. Describe an idempotent reconciliation or retry path for N-77.
4. Write two demonstrated causes or design defects and separate them from hypotheses.
5. Create three corrective actions with owners, tests, and a signal that would detect recurrence.

### Your work is ready when

- The report distinguishes queuing success from downstream completion.
- The timeout remains an uncertain remote outcome until reconciled.
- Corrective actions can be verified and avoid blame-only explanations.

> **💡 Key idea**
>
> Optional extension: Explain how recovery changes if the subscriber has been offline beyond the event retention window.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What does EventBus.publish SaveResult success prove?

**Answer:** It reports successful queuing of the publish operation, not final publication or subscriber completion.

### 2. Why not resend with a new notification key immediately?

**Answer:** The first call may have completed remotely despite the timeout; a new key can create a second business effect.

### 3. What makes a corrective action useful?

**Answer:** It changes an identified failure mechanism, has a responsible owner, and includes a concrete verification or recurrence-detection method.

## What to take away

- Trace the missing business outcome through distinct acknowledgments.
- Keep uncertainty visible.
- Turn causal findings into owned and testable improvements.

## Sources and further reading

- [Asynchronous Platform Event publish callbacks](https://developer.salesforce.com/docs/platform/platform-events/guide/platform-events-publish-callbacks.html)
- [Event durability and retention](https://developer.salesforce.com/docs/platform/pub-sub-api/guide/event-message-durability.html)
- [Integration failure and recovery patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)


---

# Refactor Legacy Automation in Small Verified Steps

S18 · senior · About 65 minutes with practice

![An older code structure receiving one small supported replacement piece](https://sam-portal-production.up.railway.app/lesson-images/S18.jpg)

Capture existing behavior, isolate one responsibility, and change a legacy booking handler without requiring a complete rewrite.

## Before you begin

- Understand Apex triggers, handlers, bulk processing, and assertions.
- Know Northstar's appointment statuses and the API 68.0 security baseline.

## What you will learn

- Explain characterization tests and their limits.
- Choose a small boundary for extracting legacy behavior.
- Separate structural refactoring from intentional behavior changes.

## 1. First discover what the old code actually does

Northstar's appointment trigger validates status changes, updates a vehicle summary, creates a reminder, and calls a helper with unclear side effects. Nobody can confidently explain why some conditions are repeated. Oleg wants a new cancellation rule, but a full rewrite would change too many behaviors at once.

A characterization test records the behavior of the existing implementation for a defined input. It is useful when documentation is incomplete. It does not declare every observed behavior correct. If the old handler creates duplicate reminders, a characterization test can reveal that fact, but the business still needs to decide the intended behavior before a corrective change.

> **💡 Key idea**
>
> Preserve behavior deliberately; do not preserve a defect accidentally because a test happened to capture it.

## 2. Build a behavior map before choosing a new design

List entry points, records read, records changed, external effects, and the conditions controlling each effect. Include other automation that can run in the same transaction. A trigger handler is not isolated merely because it is stored in one class. A Flow may update the record again, and an integration may enter through a different route.

Use the synthetic cases below to define a minimal behavior envelope. An envelope is the set of behavior you intend to keep stable during the first change. Include empty input, a normal transition, an unchanged status, a mixed bulk collection, and a rejected transition. Count side effects as well as checking the final field value.

Record the current class API versions and access modes. Raising an old class to API 68.0 can change default security behavior independently of your refactor. Do not combine an unexplained version migration with a structural extraction and then struggle to identify which change caused a regression.

> **🔎 Check your understanding**
>
> For each case, state which records may change and which must remain untouched.

**Synthetic characterization cases**

```text
C1: Requested -> Confirmed: one intended reminder
C2: Confirmed -> Confirmed: no new reminder
C3: Confirmed -> Cancelled: cancellation behavior requires clarification
C4: bulk collection includes C1 and C2: each record handled independently
C5: invalid past appointment confirmation: clear rejection
These are proposed expectations to review, not results from an executed org.
```

## 3. Extract one responsibility behind a seam

A seam is a boundary where one part of the implementation can be replaced or tested independently. Start by extracting a pure status-decision function: given old and new state, what action should occur? Keep the trigger's collection handling and persistence contract stable while this decision logic moves. A pure function returns a result without performing hidden database or network work, which makes it easier to test.

Do not immediately create a large framework with many layers. The first extraction should reduce a specific source of uncertainty. For example, separating 'should create a reminder' from 'insert reminder records' lets tests verify transition decisions without making every test depend on a complete org configuration.

Once the behavior envelope is stable, make the intentional change in a separate reviewable step. If the business approves a new cancellation rule, add a failing expectation for that rule, implement it, and show why the change is deliberate. Keep structural cleanup and product behavior distinguishable in the diff and explanation.

> **⚡ Try it**
>
> Make the first pull request small enough that a reviewer can compare the old decision path with the extracted one.

## 4. Use meaningful regression evidence

Tests should verify outcomes and absence of unintended work. A line-coverage number only shows which lines executed; it does not prove that a reminder was created once, that a denied transition stayed denied, or that a later batch of trigger records was processed.

An early return controlled by one transaction-wide static Boolean is a useful review target. It can suppress legitimate later work as well as recursion. Prefer business transition checks and deliberately scoped coordination over a blanket 'already ran' flag. Any stateful guard should explain what it tracks and when repeated processing is valid.

In a training org, test a small synthetic collection and document the actual result. Without an org, submit the behavior table, the pure-function tests or pseudocode, and the proposed extraction. Mark database behavior as unverified. The goal is a defensible small change, not an unsupported claim that every legacy interaction has been reproduced.

> **⚠️ Watch out**
>
> A successful narrow refactor does not certify unrelated automation that your behavior map did not cover.

## ⚡ Independent practice: Extract the reminder decision

Design a small refactor that separates status-transition decisions from reminder persistence.

1. Map the legacy handler's reads, writes, and possible repeated entry paths.
2. Turn the five cases into explicit expected actions and unresolved business questions.
3. Extract or sketch a pure decision function with no DML.
4. Write assertions for a mixed collection and an unchanged status.
5. Prepare a small diff plan and a separate follow-up for the approved cancellation behavior.

### Your work is ready when

- Existing behavior and intended corrected behavior are labelled separately.
- The first change has one responsibility and a clear comparison path.
- Tests check side-effect counts and bulk behavior, not only line coverage.

> **💡 Key idea**
>
> Optional extension: Explain how to migrate the class API version separately while testing restricted-user behavior.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does a characterization test prove the old behavior is desirable?

**Answer:** No. It records observed behavior for comparison; the business may decide that behavior is a defect.

### 2. Why extract a pure decision function first?

**Answer:** It creates a small testable seam and reduces dependence on database setup while preserving the persistence boundary.

### 3. Why separate API-version migration from refactoring?

**Answer:** Versioned defaults can change security behavior, making a combined change harder to diagnose and review.

## What to take away

- Map behavior before redesigning structure.
- Extract one useful seam.
- Separate intended behavior changes from structural cleanup.

## Sources and further reading

- [Record-triggered automation design](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered-automation)
- [Apex testing introduction](https://trailhead.salesforce.com/content/learn/modules/apex_testing/apex_testing_intro)
- [Versioned Apex behavior](https://developer.salesforce.com/docs/platform/apex-ref/references/apex-ref/versioned-behavior-changes.html)


---

# Test Integration Contracts at the Right Boundaries

S19 · senior · About 65 minutes with practice

![Two system interfaces meeting at a contract card with matching test checks](https://sam-portal-production.up.railway.app/lesson-images/S19.jpg)

Build a risk-based test set for a changing scheduling API, combining fast local checks with focused integration evidence.

## Before you begin

- Understand unit tests, HTTP mocks, and an external API contract.
- Complete S14's ownership map and S18's behavior-testing approach.

## What you will learn

- Explain consumer and provider contracts in plain language.
- Select tests that catch meaningful compatibility failures.
- Distinguish a mocked response test from an end-to-end integration result.

## 1. A contract includes meaning as well as field names

The scheduling provider returns a reservation reference, a status, and a start time. Northstar's consumer expects the reference to identify one stable reservation and the status to distinguish Pending from Confirmed. A contract describes request and response shape, required fields, valid values, identity, error behavior, and the meaning of those values.

A response can remain valid JSON while breaking the consumer. Renaming reservationId, changing a timestamp interpretation, returning a new status, or making an optional input required can all matter. A successful HTTP status alone is therefore not an adequate compatibility test.

> **💡 Key idea**
>
> Test the promises your code relies on, not just whether it can parse some JSON.

## 2. Use a concrete version change

The synthetic version-two response introduces a nested reservation object and a new status, AwaitingApproval. Anna must not see Confirmed merely because the response contains a reservation reference. Decide how the consumer handles the new shape and unknown values: reject with a visible integration error, map an approved new state, or support both contracts during a transition.

Create fixtures for the old response, the proposed new response, missing required data, an unknown status, a timeout, and an explicit business rejection. A fixture is a stable test input. Use fictional identifiers and avoid copying a real client's payload into a public repository.

Unknown fields and unknown values are different cases. A consumer may safely ignore an additional descriptive field while still needing deliberate handling for an unfamiliar status that controls business behavior. Do not turn 'be tolerant' into silently treating every unrecognized outcome as success.

The two JSON examples are invented provider contracts for this exercise. Store an integration Pending state separately from the starter booking picklist as described in S14. Do not assign AwaitingApproval directly to Test_Drive__c.Status__c. Your mapper must return a declared internal result or a visible error, not silently manufacture a confirmed booking.

> **🔎 Check your understanding**
>
> For each field or value, record whether the consumer depends on its presence, format, or business meaning.

**Synthetic existing flat response for the version-one fixture**

```json
{
  "contractVersion": 1,
  "reservationId": "R-DEMO-101",
  "status": "Confirmed",
  "startsAt": "2026-12-01T09:00:00Z"
}
```

**Synthetic proposed provider response**

```json
{
  "contractVersion": 2,
  "reservation": {
    "reference": "R-DEMO-101",
    "status": "AwaitingApproval",
    "startsAt": "2026-12-01T09:00:00Z"
  }
}
```

## 3. Place each check at the cheapest useful boundary

Unit tests can exercise status mapping, required-field validation, and error classification without a network. An Apex HttpCalloutMock lets code receive controlled HTTP responses in tests. These checks are fast and repeatable, but the mock represents what you believe the provider does, not independent proof of the provider's current behavior.

Contract verification compares that expectation with an agreed provider contract or a controlled provider environment. Integration tests check authentication, endpoint configuration, serialization, and interactions across the boundary. A focused UI smoke test verifies that Anna sees the correct user-facing state for one important journey. Acceptance checks confirm the business outcome under representative permissions.

Do not run every possible combination through an expensive end-to-end path. Concentrate fast tests on many decision cases and use a smaller number of cross-system tests for risks that local tests cannot observe. Conversely, do not replace all integration evidence with mocks just because the local suite is green.

> **⚡ Try it**
>
> Write a risk-to-test map: each important failure should point to a test that would actually detect it.

## 4. Make the test report honest and actionable

Report what ran, against which revision and environment, with which contract version, and what was mocked. A test named 'full booking integration' should not secretly stop at a mocked provider acknowledgment. Separate tests that passed from tests that were planned but could not run because credentials or a supported environment were unavailable.

For the lesson, use the supplied payloads to test a pure mapper or an Apex mock-based adapter in a training environment. You can prove that AwaitingApproval stays Pending in the user model if that is the approved mapping. You cannot prove real provider compatibility until the provider contract and behavior are verified.

Measure feedback time and the kinds of defect detected, not only the number of tests. A suite that quickly catches a changed reservation field is more useful than many assertions about incidental formatting. Preserve enough failure detail for a reviewer to identify the violated contract.

> **⚠️ Watch out**
>
> Code coverage is not a substitute for contract compatibility, authorization checks, or the user-visible booking outcome.

## ⚡ Independent practice: Build a scheduling-contract test matrix

Prepare fixtures and tests for a provider moving from the old flat response to the proposed nested contract.

1. Document the consumer's required fields, status meanings, and error behavior.
2. Create at least six synthetic fixtures, including the new status and a missing reservation reference.
3. Assign each risk to unit, mock-based adapter, provider contract, integration, or UI acceptance checks.
4. Implement the small status-mapping test or provide executable test specifications.
5. Write a test report separating executed local checks from outstanding provider verification.

### Your work is ready when

- An unfamiliar status cannot become Confirmed by default.
- The report identifies mocked dependencies and contract versions.
- At least one test would fail if the required reservation reference disappeared.

> **💡 Key idea**
>
> Optional extension: Design a temporary adapter that supports both response shapes while recording which contract each response used.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What can an HTTP mock prove?

**Answer:** It can prove how your code responds to the mocked interaction. It does not independently verify the real provider or its current configuration.

### 2. Why can an extra status be breaking?

**Answer:** Status values can control business decisions; an unhandled value may be incorrectly mapped or discarded even when JSON parsing succeeds.

### 3. How do you choose test depth?

**Answer:** Match the test boundary to the risk: local logic needs fast focused tests, while authentication and real cross-system behavior need integration evidence.

## What to take away

- Test contract meaning as well as syntax.
- Use fast tests broadly and cross-system tests deliberately.
- State exactly what executed and what was mocked.

## Sources and further reading

- [Test HTTP callouts with mocks](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-restful-http-testing.html)
- [Integration contracts and patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Salesforce CI checks](https://developer.salesforce.com/blogs/2022/01/set-up-continuous-integration-for-your-salesforce-projects)


---

# Release Metadata and Data Changes in Separate Stages

S20 · senior · About 70 minutes with practice

![A database schema transitioning through expand, migrate and retire stages](https://sam-portal-production.up.railway.app/lesson-images/S20.jpg)

Use an expand, migrate, and contract sequence so a new booking field can be introduced without pretending a code revert restores data.

## Before you begin

- Understand deployment, source control, and data backfills.
- Know integration contracts and the distinction between metadata and business records.

## What you will learn

- Separate deploying capability from moving data and switching users.
- Design a restartable backfill with verification gates.
- Explain code rollback and data recovery as different procedures.

## 1. A green deployment is only one milestone

Northstar adds Booking_Reference__c to store the scheduling provider's stable reservation reference. The field is a proposed extension to the starter, not existing metadata. Old appointments do not yet have values, old clients do not send the field, and some new provider responses arrive while migration is running.

Deploying the field and Apex changes makes the new capability available. A backfill populates appropriate existing records. A cutover changes which behavior users or integrations rely on. These steps have different failure modes. Metadata can deploy successfully while the backfill skips records or the consumer reads incomplete data.

> **💡 Key idea**
>
> Release readiness means the business journey works through the transition, not merely that metadata passed deployment validation.

## 2. Expand while keeping old clients functional

Expand means adding the new structure and compatible behavior before removing the old contract. Introduce the field without immediately requiring a value for every historical appointment. Give the appropriate personas only the permissions they need. Teach the application how to handle an appointment whose reference has not yet been populated.

Define the authoritative source for the new value. If the scheduling service owns reservation references, do not generate fictional references in Salesforce simply to satisfy a not-null check. Decide how a new booking obtains the reference and what status it has while that result is pending.

The synthetic state table below makes the transitional cases visible. A feature flag or other supported configuration switch can separate deployment from exposure, but both paths need tests. A flag that nobody can safely operate is not a recovery plan.

> **🔎 Check your understanding**
>
> Test an old record, an old client, a new client, and a new record before allowing the new field to become mandatory.

**Synthetic transition matrix**

```text
Historical appointment, no known reservation: explicitly unresolved or not applicable
Historical appointment, authoritative reservation found: eligible for backfill
New booking during migration: follows the new write contract
Old integration client: remains supported during agreed compatibility period
Cutover gate: required population and consumer behavior verified
```

## 3. Make migration restartable and race-aware

A restartable backfill can continue after interruption without corrupting records already processed. Use stable selection and business identifiers, record progress, and define what qualifies as completed. Do not rely only on a remembered page number if the underlying set changes during the run.

Concurrent writes matter. If a new booking obtains a current reservation reference while the backfill holds an older snapshot, the backfill must not overwrite it blindly. Use a supported conditional-write/version check, or lock the relevant record, read its fresh state, compare, and update within one short transaction. A plain re-query followed by an unprotected write can still race. In Apex, FOR UPDATE can support that local critical section, but its locks are released by a callout; do not assume a lock protects a read-callout-write sequence. Record conflicts for review rather than treating every mismatch as a retryable technical error.

Reconcile counts and values: selected, updated, skipped for an approved reason, failed, and unresolved. Check a sample of relationships and business outcomes as well as the aggregate count. Matching row counts alone cannot prove that each appointment received the correct reference.

In a small training org, a dozen synthetic records can demonstrate idempotent selection and a simulated concurrent update. It cannot validate production batch duration. Keep any throughput estimate separate from actual observations.

> **⚡ Try it**
>
> Design the second run before running the first: what prevents a repeated migration from overwriting correct newer data?

## 4. Contract only after the transition is proven

Contract means retiring the obsolete path after consumers and data are ready. Removing a field, tightening validation, or withdrawing an old API shape can be difficult to reverse. Require explicit evidence that no supported user or integration still depends on it.

A code rollback restores an earlier application revision where possible. It does not automatically restore overwritten values, recreate deleted records, or undo remote reservations. Data recovery needs its own source, identity mapping, conflict rules, and verification. Keep the previous compatible application path available long enough to make the planned rollback realistic.

Define a stop decision at each gate. If the backfill has unexplained mismatches, keep the old compatible behavior rather than forcing cutover to meet a date. Oleg should receive a plain-language status: capability deployed, migration progress, unresolved exceptions, and whether users have switched.

> **⚠️ Watch out**
>
> Do not use 'rollback' as one word covering both reversible metadata changes and irreversible data effects.

## ⚡ Independent practice: Plan the Booking Reference release

Write a staged release plan for adding the provider reference to existing and new appointments.

1. Define the field, ownership, permissions, and behavior when a value is absent.
2. Write expand, migrate, cutover, and contract gates with evidence for each.
3. Create twelve synthetic migration rows, including missing references, duplicates, and a record changed during migration.
4. Specify restart behavior, reconciliation totals, and conflict handling.
5. Write separate procedures for code rollback and data recovery; perform no production deployment.

### Your work is ready when

- Old supported clients remain compatible during the agreed transition.
- The backfill does not overwrite a newer authoritative value blindly.
- Code rollback and data recovery have separate inputs, owners, and checks.

> **💡 Key idea**
>
> Optional extension: Describe the decision if the new code is healthy but five percent of historical rows remain unresolved.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why can deployment success coexist with release failure?

**Answer:** The metadata may be valid while data migration, permissions, consumer compatibility, or the user cutover is incomplete.

### 2. What makes a backfill restartable?

**Answer:** Stable identity and selection, recorded progress, safe repeated application, and explicit handling of concurrent changes and unresolved rows.

### 3. Why is a code revert insufficient after data deletion?

**Answer:** Source control does not restore deleted business records or their relationships; recovery requires a separate verified data process.

## What to take away

- Deploy capability before requiring migrated data.
- Make the migration repeatable and conflict-aware.
- Retire old behavior only after evidence supports the cutover.

## Sources and further reading

- [Continuous integration and deployment preparation](https://developer.salesforce.com/blogs/2022/01/set-up-continuous-integration-for-your-salesforce-projects)
- [Disposable development and validation environments](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-scratch-orgs.html)
- [Integration compatibility and data ownership](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Git revert](https://git-scm.com/docs/git-revert)
- [Apex locking statements and callout boundaries](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/langcon-apex-locking-statements.html)


---

# Write an Architecture Decision and Review the Risk

S21 · senior · About 60 minutes with practice

![Two drawn developers comparing a small design diagram and a tradeoff card](https://sam-portal-production.up.railway.app/lesson-images/S21.jpg)

Explain a technical choice in a short decision record, then review a pull request by its behavior and consequences.

## Before you begin

- Understand Northstar's access model and integration alternatives.
- Be comfortable reading a small code diff and stating test expectations.

## What you will learn

- Write a concise architecture decision record with real alternatives.
- Separate required review fixes from optional preferences.
- Support disagreement with concrete scenarios and evidence.

## 1. A decision record preserves the reason

An architecture decision record, or ADR, captures a significant choice and why it was made. It should name the problem, relevant constraints, considered alternatives, selected approach, and consequences. Its value is not the number of headings. A future developer should understand which assumption would justify revisiting the choice.

Northstar must decide whether booking confirmation waits for the scheduling service or first creates a Pending request. The answer depends on the product promise, acceptable delay, outage behavior, and duplicate-prevention contract. 'Async is more scalable' is too broad to settle it. It hides the important question of whether Anna may tell Irina the slot is confirmed.

> **💡 Key idea**
>
> A useful decision says what it optimizes for and what it deliberately makes harder.

## 2. Compare alternatives under the same conditions

Consider synchronous reservation, asynchronous reservation with a Pending state, and a hybrid that performs a fast check but confirms later. Evaluate each against the same requirements. A hybrid check does not reserve a slot unless the provider contract explicitly says it does; a result can become stale before confirmation.

Record uncertainty honestly. If provider response-time evidence is unavailable, mark it unknown and propose a test. If the business has not accepted a Pending state, treat that as a decision dependency, not as permission to implement it silently.

A concise ADR might choose asynchronous confirmation because the approved process permits a short Pending period and staff need to keep capturing requests during brief outages. Consequences include a visible status, durable retry work, idempotency, reconciliation, and queue-age monitoring. That is a concrete tradeoff, not a claim that asynchronous processing is universally superior.

> **🔎 Check your understanding**
>
> Name at least one condition that would make you revisit the chosen approach.

**Synthetic ADR skeleton**

```text
Decision: capture a request, then confirm through the scheduling service
Context: approved Pending state; provider owns reservation authority
Alternatives: synchronous confirmation; asynchronous confirmation; check-then-confirm hybrid
Choice: asynchronous confirmation with stable operation identity
Consequences: queue, retries, reconciliation, visible Pending state
Revisit if: immediate guaranteed confirmation becomes a business requirement
```

## 3. Review a change through a failure scenario

The proposed pull request adds a browser-callable cancellation helper. Its pseudocode uses privileged update access for any supplied appointment Id and contains no explicit authorization check. The required review comment should identify the concrete risk: a caller could request cancellation of an appointment outside the permitted business relationship.

Do not hide that issue among preferences about naming or formatting. State the trigger, observed or inferred consequence, and necessary correction. For example: 'A caller-controlled Id reaches an elevated update without checking cancellation authority. Validate the permitted appointment and action before elevation, and add a negative test for another dealer's appointment.'

Under the API 68.0 baseline, review both the class declaration and the operation's explicit access mode. Do not rely on old assumptions that every query or DML automatically runs in system mode. A deliberate privileged operation deserves an explicit reason and a narrow boundary.

> **⚠️ Watch out**
>
> A review comment should not claim an exploit was executed when you only established the problematic code path.

**Intentionally unsafe pseudocode for review; not executable Apex**

```text
cancelAppointment(caller, appointmentId):
    appointment = privilegedRead(appointmentId)
    appointment.Status = "Cancelled"
    privilegedWrite(appointment)
    return "Cancelled"

Assumptions: browser-callable; privilegedRead/Write bypass caller access.
There is no caller-to-record or cancellation-authority check.
Do not implement these abstract privileged helpers as a production endpoint.
```

## 4. Make review a collaborative verification process

Separate blocking correctness or security issues, non-blocking maintainability improvements, and questions requiring product clarification. Ask for evidence proportional to the risk: a negative access test for the cancellation helper, a repeat-request test for idempotency, or a small measured comparison for a performance claim.

After a revision, verify that the identified behavior changed. A renamed method does not fix missing authorization. A test that asserts only 'no exception' does not prove that another dealer's appointment stayed unchanged. Review the revised diff and the relevant result.

In the classroom, produce one ADR and three review comments against a synthetic change. No real colleague or repository discussion needs to be contacted. The goal is a clear, respectful technical explanation that another developer can act on without reading your mind.

> **⚡ Try it**
>
> End each required comment with a verifiable condition, not a preferred implementation style.

## ⚡ Independent practice: Defend a decision and review a cancellation helper

Write the booking-confirmation ADR and evaluate a helper that accepts any appointment Id before a privileged cancellation.

1. State the approved business constraints and two genuine alternatives.
2. Choose an approach, list consequences, and name a revisit condition.
3. Write one blocking authorization comment, one test-coverage comment, and one optional maintainability suggestion.
4. For each required fix, define a scenario that would prove it is resolved.
5. Revise the ADR after a hypothetical requirement for immediate confirmation; explain whether the original choice still holds.

### Your work is ready when

- Alternatives are compared under the same business requirements.
- The review distinguishes harmful behavior from stylistic preference.
- The explanation connects access mode, caller authority, and a negative test.

> **💡 Key idea**
>
> Optional extension: Defend the alternative you did not choose to show that you understand its strongest use case.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What makes an ADR useful later?

**Answer:** It preserves context, constraints, alternatives, consequences, and the assumptions that would justify a new decision.

### 2. Why is 'use async' not enough?

**Answer:** It does not state the user-facing confirmation promise, failure behavior, consistency needs, or operational consequences.

### 3. What belongs in a blocking review comment?

**Answer:** A concrete correctness, security, or contract risk with an actionable correction and a way to verify the behavior.

## What to take away

- Record reasons and tradeoffs, not just a selected tool.
- Review behavior with concrete scenarios.
- Make required fixes distinguishable from preferences.

## Sources and further reading

- [Integration pattern selection](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Apex operation access modes](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-enforce-usermode.html)
- [CI evidence for Salesforce changes](https://developer.salesforce.com/blogs/2022/01/set-up-continuous-integration-for-your-salesforce-projects)


---

# Evaluate Agentforce Actions, Access, and Failure Behavior

S22 · senior · About 70 minutes with practice

![An agent action passing through a quality check, a permission boundary and a cost gauge](https://sam-portal-production.up.railway.app/lesson-images/S22.jpg)

Create an evaluation pack that tests what an agent does, what data it may use, and how it behaves when the answer or action is uncertain.

## Before you begin

- Understand Agentforce instructions and actions from the Middle track or the practical Agentforce lesson.
- Know user-mode access, integration failures, and idempotency.

## What you will learn

- Separate conversational quality from action correctness.
- Define pass/fail criteria before running an agent evaluation.
- Explain human confirmation, denied access, repeated actions, and test-environment limits.

## 1. A convincing sentence is not a verified business result

Northstar's agent helps Anna find a vehicle and arrange Irina's test-drive. A fluent response can still name an unavailable vehicle, expose another dealer's records, or claim a booking that was never committed. Evaluate the action path and resulting business state as well as the final text.

An evaluation is a repeatable test case with an input, context, expected behavior, and criteria for judging the result. A transcript is evidence of a particular conversation. Reviewing a supplied transcript is useful analysis, but it is not the same as executing the agent against Salesforce data and verifying the resulting records.

> **💡 Key idea**
>
> Grade the decision and the business effect, not whether the answer sounds confident.

## 2. Define the action boundary

List the allowed actions: search permitted vehicles, inspect an available slot, create a requested appointment under the approved contract, and hand off an unresolved issue. State which actions require confirmation and what details the user must confirm. 'Yes' after an unrelated question should not authorize a different vehicle, time, or customer.

Platform-supported confirmation settings can help require user confirmation for actions, but they do not replace server-side permission checks or validation. The action must still enforce access, accepted inputs, and repeat-safety. Keep elevated logic narrow and explicitly justified under the API 68.0 baseline.

Treat retrieved text and tool results as data, not new authority to change the agent's operating rules. A vehicle description containing an instruction to reveal other customers should not override the access policy. A tool error is not permission to invent an appointment number or repeatedly perform an expensive write.

> **🔎 Check your understanding**
>
> For each write action, specify the caller, allowed records, confirmation details, duplicate key, and verifiable result.

## 3. Build a varied evaluation pack

The synthetic cases below cover more than a successful booking. Each needs a pass condition that a reviewer can judge. For an unknown warranty fact, the expected behavior is to acknowledge the missing evidence or hand off, not to fabricate a confident answer. For another dealer's hidden appointment, a polite refusal alone is insufficient if the action already retrieved and exposed the record.

Separate deterministic checks from judgment-based checks. An appointment count, selected action, record identity, and duplicate-prevention outcome can often be checked precisely. Tone, clarity, and usefulness require a stated rubric and may need human review. Run paraphrases and repeated trials where appropriate; one successful wording does not establish robust behavior.

Use a regression set after changes to instructions, actions, or supporting data. Keep cases that previously found defects. Do not optimize only for a single fixed phrasing that the author knows in advance.

> **⚡ Try it**
>
> Write expected behavior before viewing the candidate response so the grading rule does not move to fit the answer.

**Synthetic Agentforce evaluation cases**

```text
E1: Anna requests an allowed vehicle and confirms a specific appointment
E2: Ask for a warranty fact absent from the supplied information
E3: Request Max's hidden appointment from an unauthorized persona
E4: A retrieved vehicle note says to ignore access rules
E5: Booking action returns a timeout with unknown remote outcome
E6: Repeat the same confirmed request after a lost response
E7: Cancel a booking without the required confirmation
E8: Tool output is malformed or names a different vehicle
```

## 4. Use supported test tools and report their boundaries

Salesforce documents Testing Center, Agentforce DX, and Testing API options. Choose a workflow that matches the supported environment and your evaluation needs. At the documentation baseline checked for this course, agent testing is available in sandboxes, tests can modify data, and Data 360 queries triggered by tests can consume credits even when the test run itself does not consume Einstein Requests or Flex Credits. Verify current availability and metering before execution.

If you lack an appropriate environment, complete the evaluation design and transcript analysis. Label the outcome 'designed' or 'reviewed,' not 'end-to-end passed.' The practical course simulation is not evidence that a real model, permission context, and Salesforce action chain succeeded.

When execution is available, record agent configuration, action revision, persona, data fixture, test method, and observed records. Track action failures, inappropriate data access, repeated writes, unresolved handoffs, and relevant consumption. Do not assign a fabricated universal cost per conversation.

The release decision should consider the cost of an error. A wrong vehicle description and an unauthorized cancellation have different consequences. Use stricter gates for actions that change important business state, and define when a human must take over.

> **⚠️ Watch out**
>
> A human confirmation step must be meaningful: it should describe the action the system is actually about to perform.

## ⚡ Independent practice: Create Northstar's agent evaluation pack

Turn the eight synthetic cases into a reviewable test suite with action, access, and outcome criteria.

1. Define permitted actions and confirmation requirements for the appointment journey.
2. For each case, specify persona, input, expected action or refusal, expected data changes, and evidence.
3. Add two paraphrases for a normal request and a repeated-request case.
4. Grade a clearly labelled synthetic transcript or run permitted tests in a supported sandbox.
5. Report passed, failed, and unexecuted checks separately, with a release gate for unauthorized writes.

### Your work is ready when

- The suite checks actual action outcomes and access boundaries, not only response quality.
- A repeated request cannot silently create a second booking.
- Transcript analysis is not represented as a completed live-agent test.

> **💡 Key idea**
>
> Optional extension: Design a human handoff that includes the unresolved question without exposing unrelated customer records.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is a polite answer insufficient evidence?

**Answer:** The agent may have selected the wrong action, retrieved forbidden data, or failed to create the promised record before producing the text.

### 2. Does user confirmation replace authorization?

**Answer:** No. Confirmation records intent for a specific action; server-side access and validation are still required.

### 3. What must be stated when no supported test org is available?

**Answer:** That the evaluation was designed or transcripts were reviewed, and that live action, access, and data-change checks remain unexecuted.

## What to take away

- Evaluate decisions, actions, and records together.
- Set criteria before running cases.
- State environment, consumption, and execution limitations clearly.

## Sources and further reading

- [Agent testing methods and environment constraints](https://developer.salesforce.com/docs/ai/agentforce/guide/testing-api-get-started.html)
- [Agent development lifecycle](https://architect.salesforce.com/docs/architect/fundamentals/guide/agent-development-lifecycle)
- [Agent action confirmation settings](https://developer.salesforce.com/docs/ai/agentforce/guide/ascript-ref-actions.html)
- [Apex access modes](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-enforce-usermode.html)


---

# Compare Core Salesforce, Automotive Cloud, and a DMS

S23 · senior · About 65 minutes with practice

![Three calm product option blocks compared against one requirement card](https://sam-portal-production.up.railway.app/lesson-images/S23.jpg)

Evaluate build, buy, and integration options against the same business requirements rather than choosing by product name or coding preference.

## Before you begin

- Know the custom Vehicle__c and Test_Drive__c learning model.
- Understand integration ownership and the operational cost of custom code.

## What you will learn

- Create a fit-gap comparison with explicit assumptions.
- Distinguish the learning model from an industry product's data model.
- Identify the proof and commercial questions needed before a recommendation.

## 1. The learning project is not an industry implementation

The SAM starter uses custom Vehicle__c and Test_Drive__c objects to teach Salesforce development. Automotive Cloud has its own documented industry data model and capabilities. Creating a custom object with a similar name does not install that product or reproduce its behavior, entitlements, interfaces, or support model.

Current Salesforce material may use Agentforce Automotive branding while developer documentation still describes Automotive Cloud. Confirm the actual product, edition, features, and contractual scope under discussion. A name change is not evidence that every capability or license in an old article applies to a proposed purchase.

> **💡 Key idea**
>
> Compare the business capability you need, not the similarity between two object labels.

## 2. Define fit and gap in concrete terms

A fit is a requirement an option can satisfy under the relevant configuration and constraints. A gap is something missing, uncertain, or requiring extension. Northstar needs vehicle and stakeholder relationships, test-drive coordination, selected workshop history, dealer access, and integration with an existing DMS. Each requirement needs a representative scenario and acceptance condition.

Core Salesforce customization may fit a narrow workflow and allow a small initial implementation. The organization also owns the long-term design, tests, upgrades, and support of those custom features. An industry product may supply useful domain structure and capabilities, but adoption can require data migration, configuration, licensing, and process change. Keeping a function in the DMS can preserve an established authoritative workflow while creating integration and user-experience responsibilities.

Do not mark a feature as a fit solely because a brochure names it. Ask what objects, relationships, actions, permissions, and operational constraints are involved. A short proof of concept should test the difficult part of the requirement, not only demonstrate a polished standard screen.

> **🔎 Check your understanding**
>
> Every 'fit' claim should point to documentation, a demonstrated scenario, or a clearly labelled assumption.

**Synthetic fit-gap rows**

```text
R1: identify a vehicle and its changing customer relationships
R2: let Anna request a test-drive with controlled dealer access
R3: preserve the DMS as authority for workshop reservations
R4: retrieve selected historical service information
R5: support reporting and future dealer onboarding
Options: custom core model / Automotive Cloud extension / DMS-led workflow with Salesforce integration
```

## 3. Compare total responsibility, not only initial coding

Use the same comparison columns for all options: functional fit, access model, integration ownership, data migration, release process, operational support, product availability, and cost categories. Cost categories include licensing, implementation, ongoing administration, custom maintenance, data movement, and training. Do not invent current prices or use an unsupported total to make one option appear cheapest.

Migration deserves its own scenario. Mapping custom Vehicle__c records into an industry model can involve more than copying names and VIN values. Relationships, identifiers, historical ownership, downstream references, and reports may need redesign. Keep the source authoritative until a reviewed cutover proves the destination's correctness.

An option that requires less custom code can be technically stronger when it matches a stable business process and reduces maintenance. It can also be inappropriate if it adds complexity the organization cannot operate. The decision should expose the consequences rather than treating build and buy as opposing professional identities.

> **⚡ Try it**
>
> Write one reason each option could be the right choice before recommending one.

## 4. Design a narrow evaluation without assuming a license

Use official data-model documentation to map a small fictional scenario: one vehicle, Irina's relationship to it, one appointment request, and a DMS reservation. Mark which parts are directly supported, need configuration, need code, or remain uncertain. If an appropriate trial or licensed environment is available, execute only the agreed proof scenario and record the environment.

An ordinary Trailhead Playground or Developer Edition does not automatically guarantee every industry feature. If you cannot access the required product, complete the fit-gap document and list the exact tests still needed. A diagram derived from documentation is useful evidence of analysis, but it is not a successful product implementation.

Your recommendation can be conditional: retain the learning model for the course, evaluate a specific industry capability for a real customer, and keep scheduling authority in the DMS until requirements justify a change. Separate the pedagogical choice from a procurement or production architecture decision.

> **⚠️ Watch out**
>
> A course's convenient custom schema should not become a default recommendation for every automotive organization.

## ⚡ Independent practice: Write a conditional product recommendation

Compare the three options for the five synthetic requirements and identify the next decision-changing proof.

1. Create a fit-gap table using the same columns and evidence standard for all options.
2. Map one fictional vehicle/customer/appointment scenario to the documented industry model without changing the starter.
3. List migration and integration implications for each option.
4. Name missing licensing, feature, pricing, and environment information rather than inventing it.
5. Recommend a narrow proof of concept and state which result would change your recommendation.

### Your work is ready when

- Vehicle__c is not described as the installed Automotive Cloud Vehicle model.
- All options receive a fair comparison with operating consequences.
- Unverified capabilities and commercial assumptions are clearly labelled.

> **💡 Key idea**
>
> Optional extension: Explain when keeping workshop scheduling outside Salesforce is the strongest design choice.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What is a fit-gap analysis?

**Answer:** A structured comparison of requirements that an option satisfies, requires extending, cannot satisfy, or has not yet been verified to satisfy.

### 2. Why is less custom code not automatically better?

**Answer:** The chosen product still needs suitable capabilities, configuration, access, integration, operating skills, and justified cost.

### 3. What can documentation-only evaluation establish?

**Answer:** It can support a model and identify likely capabilities and questions, but it does not prove a licensed environment or an end-to-end implementation works.

## What to take away

- Distinguish the teaching schema from the industry product.
- Compare total responsibility under the same requirements.
- Recommend the next useful proof, not an unsupported purchase decision.

## Sources and further reading

- [Automotive Cloud data-model overview](https://developer.salesforce.com/docs/platform/data-models/guide/automotive-cloud-overview.html)
- [Automotive Cloud developer guide](https://developer.salesforce.com/docs/industries/automotive-cloud/guide/dev-guide.html)
- [Current automotive product terminology](https://www.salesforce.com/automotive/cloud/guide/)
- [Integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)


---

# Lead a 45-Minute Dealer-Network Architecture Interview

S24 · senior · About 60 minutes with practice

![A drawn developer explaining a dealership network on a clear sparse whiteboard](https://sam-portal-production.up.railway.app/lesson-images/S24.jpg)

Use a structured conversation to turn an ambiguous network brief into a defensible design with explicit tradeoffs and unknowns.

## Before you begin

- Complete the preceding Senior design and reliability lessons.
- Be able to explain access, integration, transaction, and deployment decisions without relying on product slogans.

## What you will learn

- Ask questions that change the design before drawing components.
- Connect each major choice to a requirement and failure case.
- Explain the first likely scaling constraint and how it would be detected.

## 1. Treat ambiguity as part of the task

The interviewer says: 'Northstar is growing to one hundred dealers. Design its booking platform.' One hundred dealers does not tell you the number of users, booking rate, data distribution, business hours, external dependencies, or access policy. Do not fill every gap with an elaborate architecture and then defend the assumptions as facts.

Start with the user journey. Anna needs to request a test-drive, Irina needs a trustworthy confirmation, and Oleg needs visibility into unresolved work. Ask whether dealers share customers, who owns vehicle availability, whether booking must survive a DMS outage, and what 'confirmed' means. These questions can change the model more than choosing a queue or an API.

> **💡 Key idea**
>
> A good clarification narrows a decision. Avoid spending the whole interview collecting facts that cannot change the design.

## 2. Use time to produce a coherent first version

A practical forty-five-minute structure is five minutes clarifying the main journey, ten minutes on data and access, ten on integration and failure behavior, ten on scale and operations, and ten on tradeoffs and follow-up questions. This is a working aid, not a rigid script. If the interviewer introduces a critical constraint, adapt.

Draw only the main boundaries first: user interface, Salesforce transaction, authoritative scheduling system, background work where justified, and reconciliation. Mark Vehicle__c and Test_Drive__c as the custom teaching model. If you propose an industry product, identify the decision and verification needed rather than silently replacing the schema.

Use the synthetic requirement card below as a shared artifact. State which items are given and which you propose. A design discussion becomes easier when assumptions are visible next to the components they influence.

> **🔎 Check your understanding**
>
> Explain one complete booking path, including a failure, before adding secondary features.

**Synthetic interview requirement card**

```text
Given: 100 dealers; Salesforce handles customer-facing booking work
Given: existing DMS owns reservation confirmation
Given: dealers should not casually browse each other's appointments
Unknown: peak rate, active data volume, historical retention, license mix
Proposed for discussion: a visible Pending state during brief DMS outages
Required decision: who can approve cross-dealer exceptions?
```

## 3. Connect scale to mechanisms

Do not use the dealer count as a direct formula for Apex limits. Discuss transaction shape, expected request rate, record concentration, query selectivity, and asynchronous completion capacity. Identify a likely pressure point under your stated assumptions. For example, many appointments updating one shared vehicle summary can create contention; a broad Requested-status filter can become unselective as data changes.

Show what would reveal the problem: user-journey latency, relevant transaction counters, lock failures, oldest pending age, or reconciliation mismatches. Then describe a proportional response. Partition work by the actual shared resource, narrow a query without changing the requirement, or reduce unnecessary work before adding concurrency.

Access belongs in the scale discussion too. Staff transfers, centralized ownership, public-group maintenance, and hierarchy changes can affect sharing recalculation. A static permission diagram is insufficient if the network regularly reorganizes dealers.

> **⚡ Try it**
>
> For every major component, name one failure mode, one detection signal, and one recovery decision.

## 4. Handle a changed requirement without defending sunk work

Halfway through, the interviewer removes permission to keep a Pending state. Immediate authoritative confirmation is now required. Revisit the synchronous dependency, timeout behavior, and user experience. Do not insist that the original asynchronous design still satisfies a requirement it no longer meets.

Explain what remains reusable: stable business identities, access checks, reservation idempotency, reconciliation, and observability. Explain what changes: the critical path, availability tradeoff, and permitted response during an outage. A revised decision demonstrates understanding more clearly than adding an unsupported guarantee.

Finish with a concise summary of decisions, assumptions, and next validation. You do not need to solve every operational detail in forty-five minutes. You do need to expose the consequences of the choices you made and avoid presenting a hypothetical capacity or license as verified.

> **⚠️ Watch out**
>
> Confidence should come from a clear contract and reasoning, not from concealing missing information.

## ⚡ Independent practice: Run a timed design rehearsal

Record or write a forty-five-minute architecture discussion using the synthetic requirement card.

1. Prepare five questions that could materially change the design.
2. Create a first diagram and label data authority, access boundaries, and commit boundaries.
3. Walk through normal booking, timeout with unknown outcome, and a cross-dealer access denial.
4. At minute twenty-five, remove the Pending-state assumption and revise the relevant design.
5. Finish with a decision summary, three unknowns, and the next validation experiment.

### Your work is ready when

- The design explains one complete user journey and at least one failure.
- Tradeoffs change when the business requirement changes.
- No unmeasured rate, product entitlement, or hidden platform implementation is presented as fact.

> **💡 Key idea**
>
> Optional extension: Ask a reviewer to challenge the component you consider most likely to fail first, then respond using a detection and recovery plan.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is dealer count insufficient for capacity planning?

**Answer:** It does not establish workload rate, transaction size, data distribution, concurrency, or shared-resource demand.

### 2. What should change when Pending is no longer allowed?

**Answer:** The confirmation contract and critical path must be revisited, including synchronous dependency availability and timeout behavior.

### 3. What is a strong final interview summary?

**Answer:** A concise set of decisions tied to requirements, explicit assumptions, known tradeoffs, and the next evidence needed.

## What to take away

- Clarify decisions before drawing detail.
- Connect scale and reliability to concrete mechanisms.
- Revise the design when the requirement changes.

## Sources and further reading

- [Architecture basics](https://architect.salesforce.com/docs/architect/fundamentals/guide/architecture-basics)
- [Integration pattern selection](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Sharing architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture)
- [Asynchronous processing](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)


---

# Capstone: Improve Northstar with Reproducible Evidence

S25 · senior · About 90 minutes with practice

![A restored dealership system with a measured performance improvement and a concise incident timeline](https://sam-portal-production.up.railway.app/lesson-images/S25.jpg)

Deliver a small, complete improvement package that connects diagnosis, implementation, tests, recovery, and a clear statement of its limits.

## Before you begin

- Complete S01–S24 or demonstrate equivalent skills.
- Have a local project workspace; a Salesforce training org is optional for the proxy path.
- For the local JavaScript path, install Node.js 24 to match this repository and confirm node --version in your terminal. No npm packages are needed for the fixture.

## What you will learn

- Produce evidence that matches the scope of an improvement claim.
- Combine performance, correctness, and release reasoning in one review.
- Respond to a new constraint without hiding unresolved work.

## 1. Choose a bounded problem with a visible outcome

Oleg asks for a final improvement to Northstar's booking process. Choose two connected defects from the course, such as repeated collection scans and duplicate notification effects, or an overly broad vehicle query and an incomplete integration failure state. Avoid turning the capstone into a rewrite of the whole platform.

Define the user promise and the defect mechanism. Anna should receive a correct booking outcome, Max should see only permitted useful data, and Oleg should find unresolved work. A performance claim must preserve that promise. The final package should make it possible for another learner to reproduce your limited experiment without access to your private org or credentials.

> **💡 Key idea**
>
> The capstone is complete when the claimed behavior is demonstrated and its remaining limits are explicit, not when the repository contains many files.

## 2. Choose an honest execution path

The Salesforce path uses a small synthetic fixture in your own permitted training environment, with recorded API versions, configuration, personas, and actual test results. The local proxy path uses pure code or a simulation to demonstrate algorithmic work, state transitions, duplicate handling, and recovery decisions. It does not claim to measure Salesforce CPU, sharing recalculation, or enterprise throughput.

The JavaScript fixture below is a local illustration of repeated matching work. It deliberately uses ordinary objects rather than Salesforce records. Extend it to compare a nested search with a Map lookup while asserting the same matched result. Counting comparisons supports a claim about algorithmic work for that fixture. A wall-clock timing, if collected, remains a local measurement with its own conditions.

Save the complete JavaScript block as baseline.mjs in a local exercise folder and run node baseline.mjs from that folder. The supplied fixture should print comparisons: 1640 and matchedCount: 80. Those are deterministic counts for these arrays, not timings. Record your actual output before adding the Map implementation and assertions; a printed count alone is not a passing comparison test.

Use the S15 event sequence as a second fixture if you choose duplicate handling. Preserve the original supplied input and show the corrected final state. If you only write a design without executing either path, label the implementation and verification criteria incomplete rather than awarding yourself a passed capstone.

> **🔎 Check your understanding**
>
> Every result needs a reproducible command or procedure, a fixture, an expected outcome, and an actual observation.

**Local fixture to extend; not a Salesforce benchmark**

```javascript
const vehicles = Array.from({length: 40}, (_, i) => ({id: `V-${i}`}));
const appointments = Array.from({length: 80}, (_, i) => ({vehicleId: `V-${i % 40}`}));
let comparisons = 0;
const matched = appointments.map(appointment => {
  for (const vehicle of vehicles) {
    comparisons += 1;
    if (vehicle.id === appointment.vehicleId) return vehicle.id;
  }
  return null;
});
console.log({comparisons, matchedCount: matched.filter(Boolean).length});
// Add a Map-based implementation and assert identical matched values.
```

## 3. Build an evidence package, not a demonstration story

Include the problem brief, baseline revision, changed revision, fixture, raw results, and the smallest relevant diff. Add tests for empty input, ordinary input, a mixed collection, and the failure that originally motivated the change. For access-related work, include a denied case under the relevant security context. For asynchronous work, include a repeated or uncertain outcome.

Write one ADR explaining the selected approach and an alternative. Add a runbook for release or recovery appropriate to the change. A local algorithm improvement may need only a simple rollback procedure; a data backfill needs separate recovery reasoning. Scale the documentation to the actual risk.

Present before and after only when both were observed under comparable conditions. Supplied synthetic values belong in a separate assumptions section. A clear statement such as 'comparison count decreased for this local fixture; production Apex behavior remains untested' is more credible than an invented enterprise speedup.

> **⚡ Try it**
>
> Let a reviewer follow one claim all the way from requirement to code, test, result, and limitation.

## 4. Defend the result and accept a new constraint

Ask a reviewer to introduce one unexpected constraint: another dealer must remain isolated, the provider can return duplicate acknowledgments, or the historical data cannot be changed during business hours. Explain which part of the implementation still holds and which decision must be revisited. Do not conceal the gap with a new untested assertion.

Prepare a first-week observation plan for a hypothetical approved release. Choose a few signals tied to the original risk, such as failed saves, queue age, duplicate effects, access denials, and the defined user-journey latency. State who investigates each signal and what evidence would trigger rollback or recovery.

The review outcome can be Accepted, Changes required, or Design reviewed with execution outstanding. These statuses describe evidence, not a guaranteed professional title. Resolve important review comments by changing behavior and rerunning the relevant checks, then link the new result to the updated revision.

> **⚠️ Watch out**
>
> A local proxy demonstrates the mechanism it models; it does not certify a production Salesforce architecture.

## ⚡ Independent practice: Submit the Northstar improvement pack

Implement and verify two bounded, connected improvements using either a small Salesforce environment or the explicit local-proxy path.

1. Write a problem statement, user promise, and acceptance matrix before editing.
2. Preserve the baseline and fixture; implement a small reviewable change.
3. Run the meaningful checks and save raw, sanitized results with the revision identifiers.
4. Create one ADR, an appropriate release/recovery runbook, and a brief incident-prevention note.
5. Respond to one surprise constraint, resolve critical review findings, and submit the final evidence index.

### Your work is ready when

- At least one implementation path was executed; otherwise the submission explicitly remains incomplete for implementation acceptance.
- Before-and-after claims are supported by comparable observations and unchanged business assertions.
- The package includes tests, limitations, recovery reasoning, and no real customer data or credentials.

> **💡 Key idea**
>
> Optional extension: Have another learner reproduce the result from a clean checkout and record any missing instructions they discover.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Can a local Map experiment prove a Salesforce CPU improvement?

**Answer:** No. It can demonstrate reduced matching work and local behavior for the fixture; Salesforce runtime and production effects need separate measurements.

### 2. What makes an evidence index valuable?

**Answer:** It connects each claim to the exact fixture, revision, procedure, result, and limitation so another person can review or reproduce it.

### 3. How should an unexpected requirement be handled?

**Answer:** Identify which assumptions changed, preserve valid parts, revise the affected decision, and mark any new implementation or verification work as outstanding.

## What to take away

- Make a bounded improvement and prove the matching claim.
- Keep synthetic inputs, local observations, and Salesforce observations distinct.
- Finish with reproducible evidence and resolved critical review feedback.

## Sources and further reading

- [Resource and cost optimization](https://architect.salesforce.com/docs/architect/well-architected/guide/resource-and-cost-optimization.html)
- [Continuous integration evidence](https://developer.salesforce.com/blogs/2022/01/set-up-continuous-integration-for-your-salesforce-projects)
- [Integration reliability](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Apex behavior testing](https://trailhead.salesforce.com/content/learn/modules/apex_testing/apex_testing_intro)
- [Run Node.js scripts from the command line](https://nodejs.org/learn/command-line/run-nodejs-scripts-from-the-command-line)
