# Designing and verifying an access model

M01 · middle · About 50 minutes with practice

![A compact permission matrix with two drawn team roles and distinct accessible record groups](https://sam-portal-production.up.railway.app/lesson-images/M01.jpg)

Turn a business request into separate object, field, record, and operation decisions. Build an access matrix for two sales branches before changing permissions.

## Before you begin

- Junior: objects, fields, users, permission sets, and private organization-wide defaults.
- The core Vehicle__c and Test_Drive__c metadata are deployed in a training org.

## What you will learn

- Translate a role description into testable operations.
- Identify the source of every allowed action.
- Prove both permitted and denied access.

## 1. Understand the mechanism

Northstar Motors has two salespeople, Anna and Max, and a manager, Oleg. Irina is their customer, represented by a Contact record; she is not automatically a Salesforce user. Saying that service staff should see customers leaves several questions unanswered. Which customers, which fields, through which interface, and what may staff change? An access model answers these questions before a profile or sharing rule is edited.

Separate four decisions. Object permission determines whether an operation such as reading Test Drive is available at all. Field-level security determines which fields the person may read or edit. Record access determines which individual test drives the person can reach. A business rule can further decide whether an otherwise editable appointment may be cancelled. A person passing one layer has not automatically passed the others.

The starter uses private organization-wide defaults for Vehicle__c and Test_Drive__c. Both objects have independent owners. Test_Drive__c.Vehicle__c and Customer__c are optional lookups, so do not infer that seeing a vehicle or Contact grants access to every related test drive. A permission set granting object Read is also not a sharing mechanism. Record ownership, hierarchy, sharing rules, and explicit shares must be considered separately.

Design the smallest useful personas instead of a permission set for every individual. Anna and Max can share a salesperson permission set while record ownership distinguishes their work. Oleg may need access to both salespeople's appointments without permission to change a vehicle's VIN. A manager's title in a business diagram does not configure a Salesforce role hierarchy; that relationship must be deliberately implemented.

> **💡 Key idea**
>
> Write the expected result first; permission configuration is the implementation of that expectation.

## 2. Northstar Motors worked example

Use two vehicles and two test drives. Anna owns TD-A for Irina tomorrow; Max owns TD-B for another fictional customer. Both salespeople can read the shared demonstration vehicle catalog. Anna may edit TD-A's status but should not read TD-B. Oleg can read both appointments and cannot edit VIN__c. This small dataset distinguishes object permission from record visibility without requiring hundreds of records.

Create a table with columns persona, object, field, record category, operation, expected result, and granting mechanism. Include Anna reading Max's appointment as an explicit denial. If a deny test unexpectedly succeeds, investigate additional permission sets, hierarchy, groups, and broad administrative permissions before changing the intended requirement.

> **🔎 Check your understanding**
>
> Can you explain why Anna can read Vehicle__c yet cannot necessarily read Max's Test_Drive__c?

## 3. Build and inspect

No new fields are required. Use Name, VIN__c, Model__c, Status__c on Vehicle__c and the existing Test Drive fields. Use only synthetic Contacts.



### Step 1: Create the baseline

Create the two appointments and record their owners. Test from a restricted salesperson, not just the administrator who configured the exercise.

> **🔎 Check your understanding**
>
> Expected result: Ownership and record counts are known before adding grants.

### Step 2: Implement one access path

Grant the necessary object and field permissions, then choose a deliberate record-sharing mechanism for Oleg. Record why it matches the requirement.

> **🔎 Check your understanding**
>
> Expected result: Oleg reads both appointments through an identified mechanism.

### Step 3: Run the matrix

Execute each allow and deny row through the actual interface used in the scenario. Record the identity and result. Remove a grant and repeat the affected rows.

> **🔎 Check your understanding**
>
> Expected result: Results change only where the removed grant was necessary.

## 4. Failure cases and boundaries

A page layout can hide a field without enforcing field-level security. Likewise, a successful administrator demonstration says little about a salesperson's access. Treat these as different tests.

If the training org cannot provide three simultaneous users, perform sequential restricted-persona checks and label that limitation. Do not report concurrent multi-user verification that did not happen.

> **⚠️ Watch out**
>
> Do not fix a failed access test by giving View All or Modify All unless that broad access is an explicit requirement.

## ⚡ Independent practice: Create the Northstar access matrix

Prepare and verify a minimum-permission model for Anna, Max, and Oleg.

1. Write at least eight access rows before configuration.
2. Implement the intended grants.
3. Attach actual positive and negative results with the granting source.

### Your work is ready when

- Every allowed row identifies its grant.
- At least three denied operations are tested.
- No administrator-only evidence is presented as salesperson verification.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does object Read grant every record?

**Answer:** No. It enables the operation on the object; record visibility still has to be established.

### 2. Why is Irina not automatically a Salesforce user?

**Answer:** A Contact represents a person in business data. A User represents an authenticated Salesforce identity; the records serve different purposes.

### 3. Why test denial?

**Answer:** An overly broad configuration can pass every positive example while exposing records that should remain private.

## What to take away

- Separate object, field, record, and business-operation decisions.
- Configure personas and record access deliberately.
- Keep evidence tied to the tested user.

## Sources and further reading

- [Sharing and record access](https://help.salesforce.com/s/articleView?id=platform.managing_the_sharing_model.htm&language=en_US&type=5)


---

# Permission Set Groups and muting

M02 · middle · About 50 minutes with practice

![A group of permission tiles with one muted tile and a separate direct permission path](https://sam-portal-production.up.railway.app/lesson-images/M02.jpg)

Predict effective permissions when a permission set group mutes a grant that is also supplied elsewhere.

## Before you begin

- M01: an access matrix with restricted users.
- Junior permission sets and field-level security.

## What you will learn

- Explain the scope of a muting permission set.
- Trace a permission through multiple assignment paths.
- Verify dependent permissions and group recalculation.

## 1. Understand the mechanism

A permission set is a reusable bundle of grants. A permission set group combines several bundles for a working persona, such as Northstar sales coordinator. Muting adjusts permissions contributed by that particular group. It does not place a universal deny on the user, and it does not rewrite the original permission set that another group may reuse.

Imagine a VIN Maintenance permission set that grants Edit on Vehicle__c.VIN__c. The Data Steward group needs the grant. The Sales Coordinator group also includes this reusable permission set but mutes VIN editing. A user receiving only the coordinator group should not gain that edit permission through it. If the same user also receives VIN Maintenance directly, the independent grant remains.

Evaluate effective permissions by drawing paths rather than looking at a single checkbox. Profile grants, direct permission sets, and other permission set groups can each contribute access. After applying muting within its own group, combine the remaining grants. Muting a supporting permission can affect permissions dependent on it inside the group, so read the dependency information instead of treating every checkbox as independent.

Changes to a permission set group require recalculation. Testing a group while its calculated state is not current can produce misleading observations. Record the group's status and test the actual field operation after the update has completed. A disabled field in one page layout is weaker evidence than an operation using the real effective field permissions.

> **💡 Key idea**
>
> Muting changes one path of permission contribution, not the final user into a denied state.

## 2. Northstar Motors worked example

Anna receives Sales Coordinator, whose muting permission set removes VIN Edit. Max receives Data Steward. Anna should read a visible vehicle's VIN without editing it; Max may edit the synthetic VIN if the remaining object and record permissions permit it. Now assign VIN Maintenance directly to Anna. Predict her edit access before testing. It returns because a different assignment path supplies it.

Remove the direct assignment and add a second group granting the same field permission. The result should again demonstrate an independent path. Keep record access constant throughout these experiments: changing both sharing and FLS would make the cause ambiguous.

> **🔎 Check your understanding**
>
> If Anna still edits VIN after muting, name every possible independent source before changing the mute.

## 3. Build and inspect

Use existing Vehicle__c.VIN__c, a synthetic vehicle visible to both personas, and a restricted user. No new object or field is needed.



### Step 1: Build the reusable permission

Create VIN Maintenance with the object and field grants needed for the experiment. Add it to two groups and mute VIN Edit only in Sales Coordinator.

> **🔎 Check your understanding**
>
> Expected result: The underlying permission set remains unchanged.

### Step 2: Test four assignments

Compare coordinator only; coordinator plus direct permission set; coordinator plus Data Steward; and coordinator after both independent grants are removed. Wait for current group calculation.

> **🔎 Check your understanding**
>
> Expected result: The four observations follow the contribution paths.

### Step 3: Inspect dependency effects

In a separate reversible experiment, examine what happens when a prerequisite permission is muted. Read the configuration's dependent-permission information, then restore the original group.

> **🔎 Check your understanding**
>
> Expected result: You can explain any dependent change instead of calling it random behavior.

## 4. Failure cases and boundaries

A profile or unrelated permission set may already grant the field permission. Start from a minimal persona and inventory assignments. Otherwise, all four configurations may appear identical even though muting works correctly.

Do not use a destructive operation on customer records to prove a permission. VIN editing can be tested on a synthetic record, followed by restoration of its original value.

> **⚠️ Watch out**
>
> A muted permission in one group cannot revoke the same grant received from another source.

## ⚡ Independent practice: Explain a permission that survived muting

Submit the four-path experiment with a small diagram and observed results.

1. Capture the original permission source.
2. Predict every configuration before testing.
3. Apply the smallest correction that meets Anna's requirement without breaking Max's role.

### Your work is ready when

- The explanation distinguishes group-local muting from effective user permissions.
- All four assignment combinations are considered.
- Group recalculation and unchanged record access are recorded.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does muting alter the reused permission set?

**Answer:** No. It limits the permissions contributed through its associated group.

### 2. Why can a direct assignment restore access?

**Answer:** It supplies the grant independently of the muted group.

### 3. What should be checked before blaming a group?

**Answer:** The user's full assignment inventory, profile grants, the group calculation state, and whether object and record access are held constant.

## What to take away

- Trace independent permission sources.
- Wait for recalculation before comparing results.
- Use minimal changes that preserve other personas.

## Sources and further reading

- [Muting Permission Sets](https://help.salesforce.com/s/articleView?id=perm_set_groups_muting.htm&language=en_US&type=5)


---

# Manual and implicit sharing

M03 · middle · About 50 minutes with practice

![One record connected by a deliberate handoff path and a quieter parent relationship path](https://sam-portal-production.up.railway.app/lesson-images/M03.jpg)

Identify why a record is visible and distinguish an explicit manual grant from access arising from supported standard relationships.

## Before you begin

- M01 access layers and ownership.
- The difference between Account, Contact, Case, and a custom lookup.

## What you will learn

- Identify the source of record access.
- Test removal of one grant without assuming all access disappears.
- Recognize that custom lookups do not universally imply sharing.

## 1. Understand the mechanism

Manual sharing is a deliberate record-level grant to another user or group. It can solve a small exception such as Anna asking Max to help with one appointment. It does not grant object Read or field permissions. An owner may give a record-level permission that Max cannot effectively use until the other security layers allow the operation.

Implicit sharing describes access Salesforce derives from particular supported relationships and ownership rules, especially around Account and related standard records. It is platform-managed behavior, not a generic consequence of any lookup. The exact result depends on the objects and sharing configuration. Explain the documented relationship involved rather than claiming that every parent automatically shares all children.

The core Northstar Vehicle lookup is deliberately useful for comparison. Test_Drive__c has its own owner and private sharing. Giving Max access to Vehicle NS-001 does not, merely because of the lookup, promise access to Anna's appointment. A master-detail design would have different ownership and sharing consequences; changing relationship type is therefore an architectural change, not a cosmetic repair.

Removing a manual share removes that reason for access. It does not remove ownership, a role hierarchy path, a sharing rule, or a different share. Manual shares also have lifecycle considerations around owner changes. Current standard-object options and settings can affect behavior, so record the object and actual configuration rather than memorizing one universal sentence from an old interview answer.

> **💡 Key idea**
>
> Record visibility is the combined result of access paths; deleting one path is not necessarily a denial.

## 2. Northstar Motors worked example

Start with Anna owning TD-A and Max unable to read it. Give Max object Read and the necessary FLS, then manually share TD-A with Read. Max should see the appointment but should not gain Edit from this read-only grant alone. Remove the share and test again. If Max still sees it, investigate the remaining paths instead of assuming the deletion failed.

For a reproducible parent-implicit example, use Account and Case with Private internal sharing in an isolated training org. Give Max object Read and required field visibility for both, but no View All, broad data permission, account share, or hierarchy path. Anna owns a synthetic Account and a Case whose Account Name points to it. Confirm Max initially sees neither. Manually share only the Case with Max, Read Only. Max can then read the related Account through parent implicit sharing, while this path does not grant Account Edit. Access to a child solely through View All is not this experiment. Restore temporary sharing settings afterward; changes affect more than these two records.

> **🔎 Check your understanding**
>
> Can you explain a visible record without pointing to any manual share?

## 3. Build and inspect

No additional custom fields are needed. Use a disposable synthetic Account/Contact/Case dataset. If your edition or license limits a standard-object experiment, mark the live part unavailable and analyze the documented configuration.



### Step 1: Make the manual exception

Capture Max's denied baseline, add a Read manual share to TD-A, and verify the same read operation.

> **🔎 Check your understanding**
>
> Expected result: One explicit grant explains the changed result.

### Step 2: Remove and investigate

Remove that share. Compare the result with your access matrix and inspect other grants if visibility remains.

> **🔎 Check your understanding**
>
> Expected result: The explanation includes every still-effective path.

### Step 3: Compare relationship behavior

Run the isolated Account/Case steps above: denied baseline → Case Read share → Account Read. Compare this with Vehicle/Test Drive, whose custom lookup does not supply that parent-implicit path. Capture object permissions, owners, sharing settings, and identities.

> **🔎 Check your understanding**
>
> Expected result: The comparison does not infer platform behavior from a lookup icon.

## 4. Failure cases and boundaries

A user high in a role hierarchy may already see the record, making the manual-share experiment inconclusive. Choose a persona without that baseline path.

Some implicit shares are platform-managed and cannot be edited as arbitrary share rows. Do not attempt to repair them by deleting records from a share table; change the legitimate configuration that controls the relationship.

> **⚠️ Watch out**
>
> Neither an absent share row nor a deleted manual grant proves that a user has no access.

## ⚡ Independent practice: Document two sources of record access

Produce a short before-and-after report for manual sharing and one supported implicit-sharing relationship.

1. List ownership and sharing settings.
2. Predict visibility, then test restricted identities.
3. Explain the custom lookup counterexample.

### Your work is ready when

- Each visibility result names an access mechanism.
- Remaining access after removal is investigated.
- No claim says all lookups automatically share records.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does a manual Read share grant field Read?

**Answer:** No. Object and field permissions remain separate requirements.

### 2. Why might access survive removal?

**Answer:** Another path, such as hierarchy, ownership, or a rule, can still grant it.

### 3. Why compare a custom lookup?

**Answer:** It exposes the mistaken assumption that every relationship uses the standard-object implicit-sharing model.

## What to take away

- Name the source of access.
- Treat supported standard relationships explicitly.
- Verify lifecycle effects on the actual object and configuration.

## Sources and further reading

- [Sharing and record access](https://help.salesforce.com/s/articleView?id=platform.managing_the_sharing_model.htm&language=en_US&type=5)
- [Current sharing-reason metadata](https://developer.salesforce.com/docs/platform/api-metadata/references/meta-types/metadata-sharingreason.html)
- [Implicit sharing: parent Account access](https://help.salesforce.com/s/articleView?id=sharing_across_objects.htm&language=en_US&type=0)


---

# Apex managed sharing across a record lifecycle

M04 · middle · About 50 minutes with practice

![One access card moving through create, update and revoke stages without readable labels](https://sam-portal-production.up.railway.app/lesson-images/M04.jpg)

Maintain a manager's record access while preserving unrelated grants and handling bulk changes.

## Before you begin

- M03 share sources and lifecycle.
- Bulk-safe Apex, maps, sets, triggers, and assertions.

## What you will learn

- Use a custom RowCause to identify owned shares.
- Handle manager changes, clearing, and restoration.
- Preserve independent access and test 200 records.

## 1. Understand the mechanism

Some access requirements follow business data rather than the role hierarchy. Northstar appoints a manager to an internal project, and that manager needs Read while assigned. A sharing rule based only on fixed groups may not express this relationship. Apex managed sharing lets application logic maintain the specific record-level grant.

Create Project__c as a separate custom object with a Text Name, private organization-wide defaults, and Manager__c as a lookup to User. These fields are not in the starter. Add an Apex Sharing Reason named Assigned_Manager. Its API value becomes Assigned_Manager__c in the share record's RowCause. RowCause is the reason for the grant; it lets your process distinguish its work from Manual, Owner, or another application's reason.

Treat processing as reconciliation: calculate the desired manager grants, compare them with existing shares for your reason, then insert missing grants and remove obsolete ones. For a change from Anna to Oleg, delete only Anna's Assigned_Manager grant and add Oleg's grant. Anna may retain access through another path. That is not necessarily a defect in your handler.

Current metadata supports sharing reasons for eligible standard objects from API 68.0, so the old statement 'custom reasons are always custom-object-only' is no longer universally correct. This exercise deliberately uses Project__c for a clear owned schema. Check eligibility before extending the pattern to a standard object. Also define the privileged execution boundary: creating shares must not become an unrestricted public endpoint.

> **💡 Key idea**
>
> Your handler owns one reason for sharing, not every possible reason a person can see the record.

## 2. Northstar Motors worked example

Project P-1 starts with Manager=Anna. After processing, Anna has an Assigned_Manager Read grant. Oleg also has an independent Manual grant. When Manager changes to Oleg, remove only the old custom-reason grant and create or reconcile Oleg's custom-reason grant. The Manual grant remains. Clearing Manager removes your custom-reason grant, while independent access can remain.

The following fragment shows the shape of one share; it is not a complete trigger or deployable service. Reconciliation, bulk collection, error handling, authorization, and lifecycle dispatch still have to be implemented. Do not copy a one-row demonstration into a loop containing DML.

> **🔎 Check your understanding**
>
> If Anna keeps a Manual share after being replaced, should your handler delete it?

**Share construction fragment; Project__c and Assigned_Manager reason must exist**

```apex
Project__Share grant = new Project__Share();
grant.ParentId = projectId;
grant.UserOrGroupId = managerId;
grant.AccessLevel = 'Read';
grant.RowCause = Schema.Project__Share.RowCause.Assigned_Manager__c;
// Collect grants, authorize the operation, then perform bulk DML.
```

## 3. Build and inspect

Create Project__c, Manager__c, and the sharing reason first. Give test personas object Read and necessary FLS separately. Record API versions and the explicit security mode used by the privileged sharing operation.



### Step 1: Specify transitions

Write expected custom-reason grants for insert, same-manager update, A→B, A→null, null→A, delete/undelete, and owner change.

> **🔎 Check your understanding**
>
> Expected result: Each transition defines your own grant independently of total visibility.

### Step 2: Implement reconciliation

Query shares only for relevant project IDs and your RowCause. Collect inserts and deletes outside loops. Define behavior for an inactive manager and a manager who is also owner.

> **🔎 Check your understanding**
>
> Expected result: Repeated processing produces no unnecessary duplicates or unrelated deletions.

### Step 3: Verify lifecycle and bulk

Run assertions over 200 projects and the transition table. Include an independent Manual grant and inspect it after manager replacement.

> **🔎 Check your understanding**
>
> Expected result: The independent grant survives and all intended custom grants match the final data.

## 4. Failure cases and boundaries

Deleting all Project__Share rows for the previous manager destroys unrelated access. A broad query can make a superficially passing test conceal this defect.

Delete and undelete require explicit reasoning about restored data and shares. Do not claim they work because update tests pass. Define whether restoration reconciles immediately and prove the chosen behavior.

> **⚠️ Watch out**
>
> A sharing service must have an authorized entry point; do not expose arbitrary parent IDs and user IDs to unrestricted callers.

## ⚡ Independent practice: Maintain assigned-manager access

Implement the transition table on Project__c and submit evidence of safe reconciliation.

1. Create the declared schema.
2. Implement and test only your RowCause.
3. Run lifecycle, repeated-input, and 200-record checks.

### Your work is ready when

- No unrelated share is deleted.
- Cleared and changed managers remove the obsolete owned grant.
- Bulk and undelete behavior are explicitly tested.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why use a custom reason?

**Answer:** It identifies the process-owned grant and supports the intended managed-sharing lifecycle.

### 2. Does removing the old grant guarantee denial?

**Answer:** No. Independent access may still exist and must be assessed separately.

### 3. Why is insert-only logic insufficient?

**Answer:** Assignments change, clear, and may be restored after deletion; stale grants otherwise persist.

## What to take away

- Reconcile desired grants.
- Scope mutations to your reason.
- Test every lifecycle transition and authorization boundary.

## Sources and further reading

- [SharingReason metadata](https://developer.salesforce.com/docs/platform/api-metadata/references/meta-types/metadata-sharingreason.html)
- [Record access](https://help.salesforce.com/s/articleView?id=platform.managing_the_sharing_model.htm&language=en_US&type=5)


---

# Restriction rules and supported access paths

M05 · middle · About 50 minutes with practice

![A fine filter removing two records from an already accessible group](https://sam-portal-production.up.railway.app/lesson-images/M05.jpg)

Filter an already accessible record set for selected users while recognizing object, edition, and execution-context boundaries.

## Before you begin

- M01: grants versus operations.
- M03: multiple record-access paths.

## What you will learn

- Distinguish narrowing from granting access.
- Create a controlled restriction-rule experiment.
- Test the relevant read paths without claiming a universal deny.

## 1. Understand the mechanism

A sharing mechanism opens access to records. A restriction rule narrows the records a matching user can access through supported paths. Think of two stages: first determine the records available from the ordinary security model, then apply the rule's record criteria where the feature is supported. A restriction rule does not give a user object Read or open a private appointment.

Rules have user criteria and record criteria. User criteria identify the people to whom the restriction applies; record criteria identify the records that remain visible to those people. Both must be stated explicitly. A rule that accidentally matches Oleg as well as Anna can hide operational work from the manager, even when the sharing design itself is correct.

Support is specific rather than universal. Current documentation lists custom and external objects plus selected standard objects including quotes, contracts, events, tasks, time sheets, and time sheet entries. Active-rule allowances differ by edition. Check the current documentation and your org before creating a rule. Do not assume Account and Contact are supported simply because they are familiar CRM objects.

Execution context also matters. Test the UI and user-mode query paths that your feature actually uses. A privileged system operation must be reviewed separately rather than being treated as automatically constrained by every end-user restriction. This distinction becomes especially important when custom Apex or an integration reads data on behalf of another process.

> **💡 Key idea**
>
> A restriction rule filters applicable access; it is neither a sharing grant nor a universal denial across every context.

## 2. Northstar Motors worked example

Add Region__c, a restricted Picklist with North and South, to Test_Drive__c. Add SAM_Region_Limited__c, a Checkbox default false, to User. These fields are new prerequisites, not starter fields. In this small experiment, users with the checkbox true should see only North appointments through the supported paths being tested.

First give Anna ordinary access to one North and one South appointment. Confirm she can see both. Enable the restriction for the flagged test user and expect the South record to disappear from the selected read path. Max remains unflagged and should retain the baseline. This isolates restriction behavior from a missing share or missing object permission.

> **🔎 Check your understanding**
>
> If Anna cannot read either record, what other security layer might be failing?

## 3. Build and inspect

Use a separate training org or reversible rule. Record edition, object support, active-rule limit, user criteria, record criteria, and the exact paths you will test.



### Step 1: Prepare a known accessible set

Create the new fields and two appointments. Grant the restricted persona access to both before the rule. Capture a list-view and query baseline.

> **🔎 Check your understanding**
>
> Expected result: The experiment starts with known access rather than an assumed grant.

### Step 2: Apply the narrow rule

Create the restriction on Test_Drive__c for flagged users and North records. Activate it only after reviewing the criteria.

> **🔎 Check your understanding**
>
> Expected result: The flagged user loses the South result in supported end-user reads.

### Step 3: Compare identities and paths

Repeat as Anna and Max in the UI and an explicitly user-mode Apex query. Separately document any privileged process without pretending it is the same context.

> **🔎 Check your understanding**
>
> Expected result: Each observation names both identity and execution path.

## 4. Failure cases and boundaries

A list-view filter can look like a restriction rule while applying only to that view. Test an independent supported read path to distinguish the two.

A rule on one object does not automatically restrict all related child records. If an LWC also queries Contact or Vehicle, analyze those operations independently. Missing licensing or unsupported functionality should be reported, not simulated as a live successful configuration.

> **⚠️ Watch out**
>
> Never describe restriction rules as a global deny that automatically governs arbitrary privileged Apex.

## ⚡ Independent practice: Compare a grant with a restriction

Create the North/South experiment and explain the result for two users.

1. Document the baseline grants.
2. Add and test the rule.
3. Remove or deactivate it and verify the baseline returns.

### Your work is ready when

- No new access is attributed to the restriction.
- Supported object, edition, and context are recorded.
- Positive, negative, and unaffected-user cases are included.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Can the rule open a private appointment?

**Answer:** No. The underlying access must already be granted.

### 2. Why test an unflagged user?

**Answer:** It verifies that the user criteria do not restrict unrelated personas.

### 3. Does restricting Test Drive restrict its Contact?

**Answer:** Not automatically. The related object's own security and supported rules must be evaluated.

## What to take away

- Start with a known accessible set.
- State both user and record criteria.
- Verify support and execution context.

## Sources and further reading

- [Restriction Rules](https://help.salesforce.com/s/articleView?id=platform.security_restriction_rule.htm&language=en_US&type=5)
- [Explicit database access modes](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-enforce-usermode.html)


---

# Apex security and API-version defaults

M06 · middle · About 50 minutes with practice

![Two versioned code sheets beside a shield and explicit access-control switch](https://sam-portal-production.up.railway.app/lesson-images/M06.jpg)

Separate class sharing context from database access mode and verify security when changing an Apex API version.

## Before you begin

- M01–M05: CRUD, FLS, record access, and restrictions.
- Apex classes, SOQL, DML, and test users.

## What you will learn

- Distinguish record-sharing context from operation access mode.
- Explain the API 67 default changes.
- Write explicit-mode comparisons and negative tests.

## 1. Understand the mechanism

Apex security questions become easier when you name two separate decisions. The class sharing declaration describes record-sharing behavior in the relevant execution context. A database operation's access mode determines whether it enforces user-level permissions or deliberately runs with elevated behavior. Saying only 'this class is with sharing' does not explain every field or object check.

Defaults are versioned. In API 67.0 and later, classes without an explicit sharing declaration default to with sharing, and database operations default to user mode. In older versions, omission of a sharing declaration preserves the current sharing context rather than being a synonym for an explicit without sharing declaration; older database operations default to system mode. Read the current reference when migrating an existing class.

An explicitly user-mode query applies the running user's record access, object permissions, and field-level security. If a required field is inaccessible, the operation can fail rather than silently returning a sanitized response. Decide whether the product needs a clear error or an intentionally reduced response, and implement that choice. Do not catch every security error and return an empty list that looks like a legitimate absence of records.

System mode is not a shortcut for fixing permission errors. Some backend operations legitimately require privileges, but their entry point, allowed records, inputs, and output must be constrained. In system mode, the calling class's sharing declaration remains relevant to record-level behavior. Trigger context has its own rules; an API 67+ user-mode database operation still enforces its user-mode requirements even inside a trigger.

> **💡 Key idea**
>
> Review sharing context and database operation mode separately, and include the class API version in the review.

## 2. Northstar Motors worked example

Anna owns TD-A, while Max owns a private TD-B. Remove Anna's field Read for a field selected by the experiment. Compare an explicit user-mode query with a separately justified system-mode version, using the same identity and data. A correct result is not necessarily a row count: the user-mode operation may reject inaccessible fields before returning results.

Then compare copies of the small class compiled at API 66.0 and 68.0 with omitted declarations or modes. Record the actual differences without changing the data or persona. This is a migration experiment, not permission advice. The final application should state critical security choices explicitly so that intent is visible during review.

> **🔎 Check your understanding**
>
> Does with sharing alone prove that every returned field is readable to Anna?

**Query fragment: explicit user-mode read of starter fields**

```apex
List<Test_Drive__c> visits = [
    SELECT Id, Name, Status__c, Scheduled_At__c
    FROM Test_Drive__c
    WHERE Status__c = 'Requested'
    WITH USER_MODE
];
```

## 3. Build and inspect

Use existing starter fields. Keep comparison classes separate and record their .cls-meta.xml API versions. Do not deploy experimental privileged endpoints to a shared or production environment.



### Step 1: Prepare the security matrix

Define visible/hidden records and readable/hidden fields for a restricted user. Ensure the administrator can create fixtures without being used as the test persona.

> **🔎 Check your understanding**
>
> Expected result: The matrix predicts both rows and field-related failures.

### Step 2: Run explicit-mode comparisons

Execute the same selected fields and filters with clearly stated class context and operation mode. Capture success or the specific access failure.

> **🔎 Check your understanding**
>
> Expected result: Results can be explained without relying on an ambiguous default.

### Step 3: Evaluate a version upgrade

Run the controlled API 66/68 comparison, then make critical declarations explicit and repeat the intended application tests.

> **🔎 Check your understanding**
>
> Expected result: The change is reviewed as a behavior change, not merely an XML edit.

## 4. Failure cases and boundaries

An administrator test can conceal FLS defects. System.runAs changes the test identity, but it does not by itself turn every system-mode database operation into a user-mode operation.

Returning raw exception messages can reveal implementation details. Report an appropriate user-facing error while preserving a safe diagnostic reference for the developer.

> **⚠️ Watch out**
>
> Never teach 'Apex always runs in system mode' as an unversioned rule for current Salesforce.

## ⚡ Independent practice: Produce an Apex security comparison

Explain and verify one read path under explicit modes and API-version defaults.

1. Create restricted fixtures.
2. Compare modes and versions.
3. Write the final explicit policy and negative tests.

### Your work is ready when

- The report separates sharing from CRUD/FLS.
- API versions are identified.
- No broad permission is added solely to make the test green.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Is omitted sharing always without sharing?

**Answer:** No. Older omission preserves context; API 67+ defaults to with sharing.

### 2. What does user mode change?

**Answer:** It enforces the user's permissions and sharing for that database operation.

### 3. Why review an API-version upgrade?

**Answer:** Versioned defaults can change data access and failures even when the business code is unchanged.

## What to take away

- Name both security decisions.
- Treat defaults as versioned.
- Prove behavior under a restricted identity.

## Sources and further reading

- [Database access modes](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-enforce-usermode.html)
- [Current Apex REST security defaults](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-rest-exposing-data.html)


---

# Choosing Flow or Apex for a business operation

M07 · middle · About 50 minutes with practice

![A balanced choice between a simple visual process and a compact code block](https://sam-portal-production.up.railway.app/lesson-images/M07.jpg)

Choose an implementation from the shape of the work, its transaction boundaries, and the team's ability to maintain it.

## Before you begin

- Junior record-triggered Flow and bulk-safe Apex.
- M06: explicit security context.

## What you will learn

- Compare tools against concrete requirements.
- Identify transaction and maintenance constraints.
- Implement a small operation without duplicating responsibility.

## 1. Understand the mechanism

Northstar wants an automatic follow-up when Irina's test drive is confirmed. A Flow can be a clear choice when the rule is straightforward, administrators maintain it, and existing automation remains understandable. A more complex allocation algorithm or a highly reused typed service may fit Apex better. Neither the number of clicks nor a developer's preferred tool is a sufficient decision rule.

Start with the business operation, not the technology. State what triggers it, which records it reads and writes, the expected batch size, who maintains it, and what should happen when one record fails. Then locate the transaction boundary: must the follow-up succeed together with the confirmation, or may it be processed later? Moving work asynchronously changes the product's failure behavior, even if it reduces synchronous work.

Flow and Apex can coexist, but ownership of a rule must remain clear. If a Flow and trigger both create the same reminder, each may be individually correct while the combined application duplicates work. Use one orchestrator for the operation and call a reusable service only where that separation has value. A diagram showing two independent owners is a warning to resolve before implementation.

A decision should include the surrounding org. One more simple Flow in an already dense automation landscape may increase diagnostic difficulty. Conversely, a large framework for a three-condition rule can burden the next maintainer. Evaluate observability, testability, access enforcement, expected volume, and the likely next requirement. Record the tradeoff so future developers can reconsider it when the conditions change.

> **💡 Key idea**
>
> Choose the smallest understandable implementation that meets the actual transaction, volume, and maintenance requirements.

## 2. Northstar Motors worked example

Compare three requests. First, set a field on the same appointment when it changes to Confirmed. Second, create one follow-up record after confirmation, with a defined retry policy. Third, allocate vehicles across hundreds of appointments using a conflict-resolution algorithm. These differ in data access, failure handling, and complexity; they should not receive the same answer merely because all begin with a record change.

For the hands-on part, use a simple same-record rule: when a Test Drive first becomes Confirmed, reject confirmation without Vehicle__c, Customer__c, or Scheduled_At__c. No new fields are required. A validation rule is worth considering before either Flow or Apex because the requirement is to prevent invalid data. Comparing three tools is useful when the third is the simplest expression of the requirement.

> **🔎 Check your understanding**
>
> Have you distinguished preventing invalid data from performing a follow-up action?

## 3. Build and inspect

Use existing starter fields and a separate training branch. Inventory active validation, Flow, and triggers on Test_Drive__c before adding another implementation.



### Step 1: Write the decision table

For each request, list trigger, inputs, writes, volume, error policy, maintenance owner, and transaction needs. Include validation rules as a candidate where appropriate.

> **🔎 Check your understanding**
>
> Expected result: The choice follows constraints instead of tool loyalty.

### Step 2: Implement one responsibility

Implement the required-field confirmation rule using the selected mechanism. Disable competing experimental implementations in the training org.

> **🔎 Check your understanding**
>
> Expected result: Exactly one rule owns the validation behavior.

### Step 3: Verify boundaries

Try valid and invalid confirmations, a later harmless edit, and a 200-record operation. Capture which records fail and why.

> **🔎 Check your understanding**
>
> Expected result: The observed failure policy matches the decision document.

## 4. Failure cases and boundaries

A Flow is not automatically safe merely because its designer is visual. Queries and writes inside repeated paths still need volume analysis. Apex is not automatically maintainable merely because it is covered by tests.

A successful single-record UI save does not establish behavior for a bulk integration. The same requirement should be checked through the operation that will actually use it.

> **⚠️ Watch out**
>
> Do not implement the same business rule independently in Flow and Apex without a deliberate ownership boundary.

## ⚡ Independent practice: Defend an implementation choice

Choose and implement the confirmation rule, then explain how two larger variants would change your decision.

1. Compare at least two candidates and the transaction requirements.
2. Implement one rule.
3. Test valid, invalid, repeat-edit, and bulk cases.

### Your work is ready when

- The choice mentions maintenance and volume.
- No duplicate automation performs the same responsibility.
- The failure policy is demonstrated rather than implied.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Is Flow always preferable for a simple UI?

**Answer:** No. The relevant complexity lies in the business operation and existing automation, not just the screen.

### 2. Why consider validation rules?

**Answer:** They directly express an invariant that must block invalid saves without creating another orchestration layer.

### 3. What changes when work moves async?

**Answer:** The original save and later result are no longer one atomic user operation; status, errors, and retries become visible concerns.

## What to take away

- Start with requirements and transaction boundaries.
- Give each rule one owner.
- Reconsider the tool when constraints change.

## Sources and further reading

- [Record-triggered automation decision guide](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered.html)


---

# Order of execution, recursion, and idempotency

M08 · middle · About 50 minutes with practice

![A repeated event arriving at a gate that permits one successful change](https://sam-portal-production.up.railway.app/lesson-images/M08.jpg)

Explain repeated automation within a transaction and design a durable business result that is not duplicated by re-entry or retries.

## Before you begin

- M07: one owner per operation.
- Triggers, before/after values, transactions, and sets.

## What you will learn

- Recognize why automation can run again.
- Separate recursion prevention from durable duplicate protection.
- Test re-entry, bulk input, and later retries.

## 1. Understand the mechanism

A Salesforce save can run several layers of validation and automation. Some automation changes the same or related records, causing additional processing. Order of execution is the documented sequence of these stages; it is not simply 'Flow always before Apex' or 'one click means one trigger execution.' Use the current sequence and your actual configured automation when investigating a repeated effect.

Recursion is re-entry into a process caused by its own or related changes. Idempotency is a different property: repeating the same business operation does not create an additional business result. A recursion guard can reduce repeated work inside one transaction while doing nothing against a later API retry, a second Queueable transaction, or another user's concurrent request.

A static Boolean is especially coarse. It can mark an entire transaction as already handled after the first record or first trigger pass, causing later valid records to be skipped. Static memory also does not survive transaction boundaries. A set of processed IDs can improve transaction-local control, but it still does not represent a durable operation identity across independent requests.

Prefer a meaningful transition check plus a durable identity where the operation can repeat. A transition from Requested to Confirmed is different from editing a note on an already Confirmed record. However, Confirmed→Requested→Confirmed may represent either the same confirmation or a new business event. Decide that rule explicitly before choosing the key; otherwise the code cannot know whether a repeat is legitimate.

> **💡 Key idea**
>
> Preventing re-entry and preventing duplicate business effects solve related but different problems.

## 2. Northstar Motors worked example

Anna confirms TD-A. A Flow updates another field, and a trigger sees the appointment again. Max then resubmits the same external request after his client times out. A static guard might suppress the second trigger pass in Anna's transaction, but it cannot recognize Max's later request.

For this exercise, create Confirmation_Receipt__c with an Auto Number Name, Test_Drive__c lookup, and Operation_Key__c Text(100), Unique, External ID. Define one receipt per appointment's first confirmation, with key 'confirm:' plus the Test Drive Id. This intentionally does not support multiple independent confirmation cycles; describe that limitation. The unique constraint provides a final duplicate barrier, while the handler should return the existing result for a legitimate retry.

> **🔎 Check your understanding**
>
> What identifies the same operation after the original transaction has ended?

## 3. Build and inspect

Create the receipt object and fields before using them. Keep the lookup independent and give the test persona only the required object and field permissions.



### Step 1: Draw the actual execution path

List active Flow and trigger operations for confirmation. Mark every update that can cause another pass and the point where a receipt is created.

> **🔎 Check your understanding**
>
> Expected result: A specific path explains the repeated execution.

### Step 2: Implement durable receipt creation

Detect the intended transition, collect operation keys, query existing receipts in bulk, and create missing ones. Define how a uniqueness conflict is reported or reconciled.

> **🔎 Check your understanding**
>
> Expected result: A repeated operation returns one business receipt.

### Step 3: Exercise different repeat causes

Test a harmless update, re-entry, a 200-record confirmation, and a later repeated request. Include the status cycle and compare it with the declared first-confirmation rule.

> **🔎 Check your understanding**
>
> Expected result: Each result follows the business identity rather than static memory.

## 4. Failure cases and boundaries

A query-before-insert check alone can race with another transaction. Two workers can both observe no receipt; the unique field prevents both from committing duplicate keys.

If a retry catches every DML error and claims success, it may hide a validation or permission failure. Distinguish a confirmed existing receipt from an unrelated failed write.

> **⚠️ Watch out**
>
> Do not use a transaction-wide static Boolean as the complete solution to repeated business requests.

## ⚡ Independent practice: Create one confirmation receipt

Build the declared receipt behavior and demonstrate repeated execution without duplicate results.

1. Define operation identity.
2. Implement bulk collection and a durable uniqueness boundary.
3. Record results for re-entry, later retry, and 200 inputs.

### Your work is ready when

- Exactly one receipt exists per defined key.
- Unrelated failures are not called successful retries.
- The confirmation-cycle limitation is explicit.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why does static state not solve a later retry?

**Answer:** It belongs to one Apex transaction and is not a durable record of business completion.

### 2. Why use a unique key after querying?

**Answer:** Concurrent transactions can both miss an existing record before either commits.

### 3. Can every repeated confirmation share one key?

**Answer:** Only if the business defines them as the same operation; otherwise the identity must include a distinct event or version.

## What to take away

- Trace actual automation order.
- Define the business operation identity.
- Combine sensible guards with durable duplicate protection.

## Sources and further reading

- [Record-triggered architecture](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered.html)
- [Integration patterns and idempotency](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)


---

# Structuring Apex and using Custom Metadata

M09 · middle · About 50 minutes with practice

![Three tidy code modules with a separate small configuration card](https://sam-portal-production.up.railway.app/lesson-images/M09.jpg)

Separate warranty business rules, orchestration, and external access without adding layers that have no clear responsibility.

## Before you begin

- Apex classes, methods, object construction, and unit tests; the small policy constructor is introduced below.
- M07–M08: responsibility and operation identity.

## What you will learn

- Locate a rule in a small responsibility map.
- Represent deployable policy as Custom Metadata.
- Make local tests independent of a real endpoint.

## 1. Understand the mechanism

A large warranty method often mixes several jobs: reading a vehicle, deciding whether to request a check, constructing HTTP, interpreting a response, saving status, and deciding retry timing. When one policy changes, this mixture makes unrelated behavior harder to understand. Separation is useful when each part has a distinct reason to change and a clear input/output contract.

For Northstar, use three responsibilities. A policy object describes allowed attempts and timeout. A client adapter translates the warranty provider's request and response. An application service coordinates the vehicle, request state, and chosen client. This is a responsibility map, not a requirement to create an interface for every helper or a framework before the first use case works.

Custom Metadata stores deployable configuration records. It suits a policy such as a named warranty provider's timeout or enabled flag, which should move with configuration between environments. It is not the right place for secrets, per-customer mutable progress, or every transient result. Authentication belongs in the credential system, while request state belongs in ordinary data.

Introduce Warranty_Policy__mdt with Enabled__c Checkbox, Max_Attempts__c Number(2,0), and Timeout_Millis__c Number(6,0). Create a Default record with true, 3, and 10000 respectively. These names are new metadata dependencies, not starter fields. Validate policy values at the boundary: a missing record, zero attempts, or an unreasonable timeout should produce a clear configuration error rather than a mysterious runtime failure.

> **💡 Key idea**
>
> A useful layer has a distinct responsibility and can be explained with one concrete reason it might change.

## 2. Northstar Motors worked example

Suppose the provider changes its JSON from covered to isCovered. That translation belongs in the adapter. If Oleg changes the allowed retry count from three to two, policy changes without rewriting HTTP parsing. If Northstar decides that a completed test drive must exist before requesting a warranty check, that eligibility rule belongs in the application behavior, not in the generic HTTP client.

For the first implementation, avoid the network entirely. Create a small policy class with constructor arguments enabled, maxAttempts, and timeoutMillis. Have the orchestration accept the policy as input. The production entry point reads Custom Metadata and constructs the policy; unit tests construct explicit values. This keeps the local rule testable without pretending configuration and endpoint authentication were verified.

A constructor initializes a new instance: it has the same name as the class and no return type. In the example, this.maxAttempts is the instance field and maxAttempts is the incoming parameter. new WarrantyPolicy(true, 3, 10000) creates one explicit configuration value. You do not need an interface or inheritance framework for this local step; add a client interface only when defining interchangeable provider implementations.

> **🔎 Check your understanding**
>
> Which component changes when the provider renames a response field, and which changes when Northstar changes a retry limit?

**Complete minimal WarrantyPolicy.cls; caller validates acceptable values before use**

```apex
public with sharing class WarrantyPolicy {
    public Boolean enabled { get; private set; }
    public Integer maxAttempts { get; private set; }
    public Integer timeoutMillis { get; private set; }
    public WarrantyPolicy(Boolean enabled, Integer maxAttempts, Integer timeoutMillis) {
        this.enabled = enabled;
        this.maxAttempts = maxAttempts;
        this.timeoutMillis = timeoutMillis;
    }
}
```

## 3. Build and inspect

Create the Custom Metadata type and Default record in the training org, retrieve their metadata, and note the dependency. No Warranty_Request__c object is required yet; persistent request state is introduced in M12.



### Step 1: Map existing responsibilities

Take a single long warranty-method sketch and annotate each statement as policy, orchestration, external translation, or persistence.

> **🔎 Check your understanding**
>
> Expected result: The proposed split follows real responsibilities.

### Step 2: Extract one local rule

Create a small policy object and an eligibility method with explicit inputs. Test enabled/disabled and attempt-limit boundaries without any callout.

> **🔎 Check your understanding**
>
> Expected result: Changing a policy value changes a predictable result.

### Step 3: Connect configuration at the edge

Read the named Custom Metadata record only in the entry/configuration layer and validate missing or invalid values. Pass the resolved policy into the local rule.

> **🔎 Check your understanding**
>
> Expected result: Tests can supply policy directly while the entry point handles configuration failures.

## 4. Failure cases and boundaries

Reading global configuration inside every helper makes tests and behavior depend on hidden inputs. Passing a small validated policy makes those dependencies visible.

An abstraction that merely renames one method without isolating a changing dependency may add navigation rather than clarity. Remove it if the reviewer cannot explain what it protects.

> **⚠️ Watch out**
>
> Never put access tokens, passwords, or customer-specific request progress in Custom Metadata for this exercise.

## ⚡ Independent practice: Refactor a warranty rule

Separate one policy and one business decision from a mixed orchestration sketch.

1. Create and retrieve the declared metadata.
2. Implement a locally testable rule.
3. Demonstrate a policy change and a missing-configuration failure.

### Your work is ready when

- Dependencies are visible at the entry point.
- Local tests require no provider or real credentials.
- Each introduced layer has a stated responsibility.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is request progress ordinary data?

**Answer:** It changes per operation and represents runtime business state rather than deployable configuration.

### 2. Why inject a policy into a test?

**Answer:** It makes the rule's inputs explicit and lets the test cover boundaries without changing global configuration.

### 3. When is another layer unnecessary?

**Answer:** When it does not isolate a distinct responsibility or changing dependency and only forwards calls.

## What to take away

- Separate changing concerns.
- Use Custom Metadata for deployable policy.
- Keep secrets and mutable request state elsewhere.

## Sources and further reading

- [Integration architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Asynchronous processing fundamentals](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)
- [Custom Metadata accessors](https://developer.salesforce.com/docs/platform/apex-ref/references/apex-ref/apex-methods-system-custom-metadata-types.html)
- [Develop and test with Custom Metadata](https://trailhead.salesforce.com/content/learn/modules/custom_metadata_types_adv/cmt_develop)


---

# Testing a complete local business rule

M10 · middle · About 50 minutes with practice

![A test pyramid made of a few restrained blocks beside one concrete feature card](https://sam-portal-production.up.railway.app/lesson-images/M10.jpg)

Build independent fixtures and meaningful assertions for normal, boundary, invalid, and bulk inputs before introducing network behavior.

## Before you begin

- Junior Apex tests and assertions.
- M07 confirmation rule and M09 explicit dependencies.

## What you will learn

- Create focused synthetic test fixtures.
- Test outcomes rather than coverage alone.
- Demonstrate that a relevant code mutation fails a test.

## 1. Understand the mechanism

A useful unit test states a rule in executable form. It prepares known inputs, performs one operation, and checks a meaningful observable result. Code coverage tells you which lines ran; it does not tell you whether a completed appointment was accidentally cancelled or whether the returned value was correct. The strongest test fails when the behavior it protects is broken.

Northstar's local rule cancels Requested or Confirmed appointments strictly earlier than a supplied cutoff. Completed, Cancelled, and future appointments remain unchanged. Supplying the cutoff makes the rule deterministic; a test does not depend on the wall clock reaching midnight or on a record that happens to exist in the org. The boundary at exactly the cutoff deserves its own assertion.

A test factory is a helper that creates valid synthetic records with predictable defaults. It reduces repetitive setup, but should not hide the values central to the test. If the test examines a date boundary, show the date in the test instead of burying it in the factory. Avoid SeeAllData=true for these local rules: fixtures should be owned by the test.

Bulk tests should verify every relevant category, not merely insert 200 identical records and assert that no exception occurred. Use mixed statuses and dates. Test empty input, one record, repeated IDs where accepted, and an invalid operation. Match assertions to the defined contract: if errors are returned per record, inspect them; if the operation is atomic, verify rollback.

> **💡 Key idea**
>
> A test is valuable when an incorrect business outcome makes it fail.

## 2. Northstar Motors worked example

Use a cutoff of 2030-04-10 12:00 UTC. Create four appointments: Requested at 11:59, Confirmed at 12:00, Completed at 11:00, and Requested at 12:01. The first should become Cancelled, while the others retain their status. These exact examples distinguish a strict-before rule from an accidental less-than-or-equal comparison.

After your tests pass, temporarily change the comparison to include equality. Run the same suite. The boundary test should fail. Restore the implementation and rerun. This controlled mutation demonstrates that the assertion protects the intended rule rather than simply following the implementation's current output.

> **🔎 Check your understanding**
>
> Which assertion would fail if the service changed Completed records?

**Assertion fragment after invoking your implemented cancellation service**

```apex
Map<Id, Test_Drive__c> actual = new Map<Id, Test_Drive__c>([
    SELECT Id, Status__c FROM Test_Drive__c WHERE Id IN :fixtureIds
]);
System.assertEquals('Cancelled', actual.get(beforeId).Status__c);
System.assertEquals('Confirmed', actual.get(atCutoffId).Status__c);
// fixtureIds, beforeId and atCutoffId come from this test's own setup.
```

## 3. Build and inspect

Use existing Test Drive fields. Implement the local cancellation service before adapting the assertion fragment; it is not a complete test class. Create required fictional Vehicle/Contact records if your own validations require them.



### Step 1: Write the behavior table

List input status, scheduled time relative to cutoff, and expected output. Include null scheduled time and decide its behavior explicitly.

> **🔎 Check your understanding**
>
> Expected result: Every fixture has a reason to exist.

### Step 2: Implement independent tests

Use a small factory for defaults, explicit values for boundaries, Test.startTest/stopTest around the operation where appropriate, and assertions on persisted state.

> **🔎 Check your understanding**
>
> Expected result: Tests pass independently of org business data.

### Step 3: Add bulk and mutation checks

Build 200 mixed appointments, assert each category, then deliberately break one rule and observe a focused failure before restoring it.

> **🔎 Check your understanding**
>
> Expected result: A broken rule changes the test result for the expected reason.

## 4. Failure cases and boundaries

Asserting the value just assigned by test setup without calling the service tests the fixture, not the behavior. Likewise, catching an exception without asserting its meaning can allow an unexpected error to pass.

Do not introduce an HTTP mock here: this lesson deliberately tests local behavior. M17 adds network-contract tests once the client exists.

> **⚠️ Watch out**
>
> A green coverage report is not evidence that wrong records were left untouched.

## ⚡ Independent practice: Protect the cancellation rule

Submit a local test suite with boundaries, negative cases, and mixed bulk input.

1. Build the rule table and fixtures.
2. Write state assertions.
3. Record the intentional mutation failure and restored passing result.

### Your work is ready when

- No business records are read through SeeAllData.
- Strict cutoff and protected statuses are checked.
- The mutation fails a relevant assertion.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why pass a cutoff instead of reading now everywhere?

**Answer:** It makes the rule deterministic and separates business input from the clock.

### 2. What should a bulk test assert?

**Answer:** Correct results for the different input categories, not only that 200 records fit in one call.

### 3. Why temporarily break the rule?

**Answer:** It proves that the test detects the specific regression it claims to protect.

## What to take away

- Make inputs explicit.
- Assert business state and protected records.
- Use coverage as supporting information.

## Sources and further reading

- [Apex testing and mock boundaries](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-restful-http-testing.html)
- [Record-triggered processing](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered.html)


---

# Selecting an asynchronous processing mechanism

M11 · middle · About 50 minutes with practice

![One work request branching toward three different background processing lanes](https://sam-portal-production.up.railway.app/lesson-images/M11.jpg)

Match delayed work to its volume, timing, transaction, and recovery requirements without promising immediate execution.

## Before you begin

- Transactions and governor limits.
- M07 tool selection and M10 local tests.

## What you will learn

- Compare synchronous work, Queueable, Batch, schedules, and events.
- Explain a user-visible pending state.
- Estimate work per transaction and per day.

## 1. Understand the mechanism

Synchronous work runs as part of the operation the user is waiting for. Asynchronous work is accepted for later processing in another execution context. Moving work out of the save can improve responsiveness, but the user now needs a way to learn whether it succeeded. A message saying 'request accepted' is different from 'warranty verified.'

Queueable Apex suits a defined background unit that can carry serializable inputs and expose a job identity. Batch Apex partitions a larger selected dataset into separate execute transactions. Scheduled Apex or a scheduled Flow starts work according to a schedule; scheduling does not transform an unlimited amount of processing into a safe single transaction. An asynchronous Flow path can handle appropriate declarative follow-up work after the original save.

Events decouple a producer from subscribers. They are appropriate when the business fact should be consumed independently, rather than merely because a developer wants to avoid a method call. An event publisher does not receive proof that every subscriber completed. Similarly, enqueueing a job is not evidence that its final business write happened.

Capacity is finite. There are transaction limits, concurrent-work considerations, and org-level allocations. Queue-based processing can be delayed, and execution order or exact start times should not be promised without a documented guarantee. Use current org limits and observed load for planning. A developer should describe an acceptable delay and recovery path, not invent a one-second service-level agreement.

> **💡 Key idea**
>
> Async changes the contract from an immediate result to accepted work plus a later observable outcome.

## 2. Northstar Motors worked example

Classify five Northstar operations. Rejecting a missing customer before confirmation belongs in the synchronous validation path. A warranty check may be queued with Pending status. Cancelling many overdue appointments may use Batch. Starting the cancellation selection nightly requires a schedule. Announcing a committed confirmation to independent consumers may justify an event.

Suppose Anna requests 20 warranty checks and Oleg imports 20,000 vehicles. The first number may fit a bounded background design; the second requires workload analysis. Count expected requests, retries, callouts, records read, and writes. Do not conclude 'Queueable scales' from one small demonstration. The appropriate design may include aggregation, partitioning, or a slower accepted processing window.

> **🔎 Check your understanding**
>
> What will Anna see if accepted work has not started after several minutes?

**Complete NoOpObservationJob.cls, API 68.0; no business record changes**

```apex
public with sharing class NoOpObservationJob implements Queueable {
    public void execute(QueueableContext context) {
        System.debug('Observation job: ' + context.getJobId());
    }
}
```

**Anonymous Apex after deploying the class and metadata**

```apex
Id jobId = System.enqueueJob(new NoOpObservationJob());
System.debug(jobId);
```

## 3. Build and inspect

This lesson is a design-and-observation exercise using the existing core model. No paid product, external provider, or new custom object is required.



### Step 1: Create a decision sheet

For each of the five operations, record maximum expected volume, acceptable delay, required transaction behavior, and what the user needs to see.

> **🔎 Check your understanding**
>
> Expected result: A mechanism is justified by constraints.

### Step 2: Observe one small async run

Deploy NoOpObservationJob and its API 68.0 Apex metadata using the Junior class workflow. Run the supplied Anonymous Apex in the learning org, then open Setup → Apex Jobs and find its class/job identity. A quick run may already be Completed; do not invent intermediate observations.

> **🔎 Check your understanding**
>
> Expected result: The job has an identity and observable lifecycle.

### Step 3: Estimate the busy day

Add retries to your workload estimate and identify per-transaction and org-wide constraints from current documentation and org limits.

> **🔎 Check your understanding**
>
> Expected result: The plan includes a queue backlog and recovery response.

## 4. Failure cases and boundaries

Splitting work into one job per record can create avoidable queue pressure. Conversely, putting all records in one job can exceed transaction limits. Batch size and grouping are design choices, not universal constants.

An async job can fail after the original save succeeds. If the interface has only Success and Error for the original click, users cannot distinguish accepted work from completed work.

> **⚠️ Watch out**
>
> Do not promise that Queueable starts at an exact time or that async work has unlimited capacity.

## ⚡ Independent practice: Design the Northstar processing map

Choose mechanisms for five operations and state the visible result and recovery behavior of each.

1. Fill the constraints first.
2. Choose and explain a mechanism.
3. Record one observed job and a capacity estimate.

### Your work is ready when

- Every delayed operation has a pending state or equivalent acknowledgement.
- Timing is described as a requirement, not an unsupported guarantee.
- Retry load is included.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does enqueue success prove business success?

**Answer:** No. It confirms acceptance of work, whose later execution may fail.

### 2. What does Batch add?

**Answer:** It divides a selected dataset into separate execution transactions rather than treating it as one atomic job.

### 3. Why use an event?

**Answer:** To announce a fact or coordinate independent consumers when that decoupling meets the business requirement.

## What to take away

- Select by workload and recovery needs.
- Expose pending and failed states.
- Plan finite capacity.

## Sources and further reading

- [Asynchronous processing decision guide](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)


---

# Queueable Apex and observable request state

M12 · middle · About 50 minutes with practice

![Three linked background job tiles with a small recovery branch](https://sam-portal-production.up.railway.app/lesson-images/M12.jpg)

Create a local background warranty check with a durable request identity, a job reference, and explicit outcomes before adding HTTP.

## Before you begin

- M08 durable operation identity.
- M10 tests and M11 async selection.

## What you will learn

- Persist a request before enqueueing work.
- Separate job identity from business identity.
- Handle repeated requests and visible failures.

## 1. Understand the mechanism

A Queueable class implements Queueable and receives a QueueableContext when execute runs. System.enqueueJob returns a platform job ID. That ID is useful for diagnostics, but the business request should have its own durable identity: retries can create new job IDs for the same warranty request. Anna should track one request, not guess which platform job represents the latest attempt.

Create Warranty_Request__c with an Auto Number Name and Vehicle__c lookup to Vehicle__c. Add Request_Key__c Text(100), Unique, External ID; Status__c Picklist Queued, Processing, Succeeded, Failed, Unknown; Attempts__c Number(3,0), default 0; Result__c Text(255); Error_Code__c Text(80); and Job_Id__c Text(18). These are new training dependencies. Keep ownership private and grant required field access deliberately.

The entry service validates the vehicle and operation key, creates or finds the request, and enqueues bounded work. The job receives the request ID and reloads current state when it runs instead of relying on an old copied record. A terminal successful request should not be processed again merely because the enqueue button was pressed twice. Durable uniqueness and state transitions work together.

For this lesson, the background action is deterministic local code: Available vehicles produce a sample eligibility result and Unavailable vehicles produce a declared failure. It is not a real warranty decision. A limited retry policy can be modeled with an attempt counter and an explicit operator retry. Automatic delayed retries and actual callouts are later integration concerns; do not build an unbounded chain now.

> **💡 Key idea**
>
> One business request may have several execution attempts, each with its own job identity.

## 2. Northstar Motors worked example

Anna submits key WARRANTY-DEMO-001 for NS-001. The entry service creates one Queued request and stores the returned job ID. The job reloads that request, checks whether it is already terminal, evaluates the local demonstration rule, and persists Succeeded with a clearly labeled sample result. Submitting the same key again returns the existing request.

Repeat using an Unavailable vehicle. Anna should see Failed with a safe error code, rather than an indefinite spinner or a generic successful submission toast. If the job fails before your error record can be committed, Apex Jobs remains an additional diagnostic source; the business record alone is not a complete platform monitor.

> **🔎 Check your understanding**
>
> If a retry gets a new job ID, how does Anna still find the same business request?

**Enqueue fragment; request creation and authorization are separate prerequisites**

```apex
Id jobId = System.enqueueJob(new DemoWarrantyJob(requestId));
// DemoWarrantyJob is the Queueable class you implement in this lesson.
// Persist jobId on the authorized Warranty_Request__c request.
// Return the business request ID to the caller, not a fabricated result.
```

## 3. Build and inspect

Create all declared Warranty Request fields before writing the service. Unit tests use synthetic Vehicle records and the local outcome function; no server, credential, or HTTP mock is needed yet.



### Step 1: Define transitions

Write allowed transitions for Queued, Processing, Succeeded, and Failed. Define what a repeated key with a different vehicle means; reject conflicting reuse.

> **🔎 Check your understanding**
>
> Expected result: One key has one unambiguous business meaning.

### Step 2: Implement entry and worker

Collect and validate inputs, persist the request, enqueue the worker, and reload state in execute. Keep failure messages safe and the retry count bounded.

> **🔎 Check your understanding**
>
> Expected result: The caller receives an accepted request, while completion is recorded later.

### Step 3: Verify success and failure

Use Test.startTest/stopTest for the enqueued work, assert final data, and separately observe a real training run in Apex Jobs. Test repeated keys and exhausted retries.

> **🔎 Check your understanding**
>
> Expected result: Both platform execution and business state can be traced.

## 4. Failure cases and boundaries

A chained job is another transaction; do not assume the whole chain executes inside one unit test's stopTest. Test each unit and transition explicitly.

Catching an exception does not guarantee that the catch-path status write will succeed. Keep platform job monitoring and a reconciliation plan for abandoned Processing requests.

> **⚠️ Watch out**
>
> Never label the local demo eligibility function as a genuine warranty-provider response.

## ⚡ Independent practice: Build a visible background request

Implement the local Queueable lifecycle and a bounded manual retry.

1. Create schema and state rules.
2. Implement durable request and worker.
3. Verify success, failure, duplicate, and retry-limit cases.

### Your work is ready when

- One key creates one business request.
- Job and request IDs are distinguishable.
- Failed work is visible and retries are bounded.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why pass a request ID?

**Answer:** The worker can reload current state and avoid relying on stale copied data.

### 2. Why not use job ID as the business key?

**Answer:** A later attempt can have a different job ID while representing the same request.

### 3. Does a caught exception guarantee a saved Failed status?

**Answer:** No. Subsequent persistence can also fail, so platform monitoring and reconciliation remain necessary.

## What to take away

- Persist business identity.
- Reload current state in the worker.
- Expose outcomes and bounded recovery.

## Sources and further reading

- [Async processing choices](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)
- [Integration reliability patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)


---

# Batch Apex and independent execution scopes

M13 · middle · About 50 minutes with practice

![A large stack of records divided into three manageable processing groups](https://sam-portal-production.up.railway.app/lesson-images/M13.jpg)

Process a larger appointment dataset in bounded transactions and report partial failure without implying whole-job atomicity.

## Before you begin

- M10 cancellation tests.
- M11 async selection and M12 visible job outcomes.

## What you will learn

- Explain start, execute, and finish.
- Choose a scope from the work per record.
- Distinguish instance state, static state, and persisted results.

## 1. Understand the mechanism

Batch Apex separates selection from processing. The start method defines the dataset, execute receives a scope of records, and finish performs final coordination. Each execute invocation is a separate transaction with its own applicable limits. The job is therefore not one atomic transaction: a failure in a later scope does not automatically undo records committed by an earlier successful scope.

Scope size is a workload decision. Smaller scopes can reduce work and failure impact per transaction but increase transaction overhead. Larger scopes can be efficient until queries, writes, CPU, heap, or downstream automation make them unsafe. Estimate those costs from the actual operation rather than selecting 200 because it appears in an example. A scope also does not guarantee the order in which records are processed.

Database.Stateful preserves instance member values across the batch's transactions. It does not turn static fields into persistent counters, and it does not combine commits. Saving state has serialization cost, so retain a small summary rather than a growing collection of every record and error. Persist detailed errors in appropriate records when operators need durable inspection.

Use partial DML only if the business accepts partial success within a scope. Inspect every SaveResult and associate errors with the input record. An unhandled exception can roll back the whole scope; handled row failures may allow others to commit. Those are different policies, and the final report should say which occurred instead of describing every finish invocation as complete success.

> **💡 Key idea**
>
> A Batch job coordinates multiple transactions; its final status must account for their individual results.

## 2. Northstar Motors worked example

Use M10’s cancellation rule with a fixed cutoff. Prepare 401 appointments that meet the start query, plus separate protected-status fixtures. With a scope of 200, those 401 selected rows require three execute scopes. Count the start-query result before running: 401 total records with many filtered-out rows would not prove three scopes. Cause one declared validation failure on an eligible synthetic record during processing, and reconcile successes, protected records, and failures. Keep setup times compatible with the Junior time rule; a controlled future cutoff can test this logic without inserting forbidden past appointments.

For unit tests, keep each batch invocation's selected dataset within one execute scope. Salesforce's batch test limitation means a 401-record, scope-200 run should be a separate integration observation, not an assertion that one unit test executed several scopes. Unit tests can separately exercise the processing helper with mixed records and error policies.

> **🔎 Check your understanding**
>
> If the second scope fails, which changes from the first successful scope remain?

## 3. Build and inspect

Use existing Test Drive fields and the M10 service. If detailed error records are introduced, declare their object and fields in the submission; a structured result from the helper is sufficient for local unit tests.



### Step 1: Implement the three phases

Select only potentially eligible records in start, recheck the rule in execute, and produce a clear summary in finish. Keep the cutoff fixed for the run.

> **🔎 Check your understanding**
>
> Expected result: Records do not become eligible merely because the clock advanced between scopes.

### Step 2: Measure and handle errors

Choose a scope, record work per scope, and implement the stated atomic or partial-row policy. Use a small instance counter only if Database.Stateful is justified.

> **🔎 Check your understanding**
>
> Expected result: Counts and errors match the selected transaction policy.

### Step 3: Separate test evidence

Run one-scope unit tests and an independent 401-record training run. Inspect Apex Jobs and actual record states, then remove synthetic test data.

> **🔎 Check your understanding**
>
> Expected result: The evidence distinguishes unit verification from multi-scope observation.

## 4. Failure cases and boundaries

A static total can reset between scopes and produce an incorrect summary. A large Stateful map can increase overhead without making data durable for operators.

If finish sends a celebratory message while ignoring failed scopes or row errors, users receive an incorrect business result even though the callback executed.

> **⚠️ Watch out**
>
> Do not claim that Batch is all-or-nothing or that Database.Stateful persists static variables.

## ⚡ Independent practice: Process and account for 401 appointments

Build the cancellation Batch with visible success, skipped, and failed outcomes.

1. Implement one-scope tests.
2. Run the multi-scope training example.
3. Reconcile counts and demonstrate a safe rerun.

### Your work is ready when

- Protected statuses remain unchanged.
- An error is visible and tied to its record or scope.
- A repeat run does not corrupt already processed records.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What persists with Stateful?

**Answer:** Instance member state is retained across batch transactions; static state is not the same mechanism.

### 2. Why is scope not always 200?

**Answer:** The appropriate size depends on the actual work, limits, automation, and acceptable failure impact.

### 3. Why separate the 401-record run?

**Answer:** Apex batch unit tests are limited to one execute invocation per test; multi-scope behavior needs separately labeled evidence.

## What to take away

- Design each scope as a transaction.
- Report partial results honestly.
- Keep retained state small.

## Sources and further reading

- [Batch Apex](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-batch-interface.html)


---

# Scheduling, workload limits, and monitoring

M14 · middle · About 50 minutes with practice

![A clean clock connected to a background job and a small status monitor](https://sam-portal-production.up.railway.app/lesson-images/M14.jpg)

Run periodic work with a deliberate overlap policy, time-zone definition, and observable completion.

## Before you begin

- M11–M13 async jobs and Batch.
- Apex tests and persisted status.

## What you will learn

- Explain what the scheduler does and does not guarantee.
- Prevent or detect overlapping runs.
- Define operational evidence and recovery.

## 1. Understand the mechanism

A schedule decides when work should be requested. It does not guarantee that a long job finishes before the next scheduled occurrence, and it does not remove transaction or org limits. Northstar's nightly cancellation process therefore needs both a calendar rule and an execution policy. 'Run every night' is incomplete without a time zone, cutoff definition, and response to a missed or still-running job.

Scheduled Apex implements Schedulable; its execute method typically starts a bounded service or Batch. A scheduled Flow can be appropriate for declarative recurring processing. Choose from the required selection, volume, maintenance, and error behavior rather than assuming the scheduling mechanism performs the entire workload. Review the execution context and access of the work it launches.

Overlap occurs when a new run starts while a prior run is active. Checking Apex Jobs and then starting work is helpful observation, but a check alone can race with another launcher. A stronger design uses a durable coordination record or unique run identity with an authorized atomic claim and an expiry/recovery policy. Do not invent a never-expiring lock that blocks processing forever after a failure.

Monitoring should describe business progress, not only platform status. Oleg needs to know the selected date window, processed count, failures, oldest pending request, and whether another run was skipped. Set an expected operating window and a human response. A run that completes with 30 failed rows is different from a run that never started, and each needs a different recovery action.

> **💡 Key idea**
>
> A recurring schedule needs a policy for overlap, missed execution, and failed work.

## 2. Northstar Motors worked example

Northstar processes appointments before midnight in its agreed business time zone. The 01:00 run selects that fixed cutoff and normally takes ten minutes. On a busy day it is still active when an operator requests a manual rerun. Choose either to reject the duplicate launch with an observable reason or to resume a defined unprocessed partition. Do not let both workers silently process the same set.

Create Processing_Run__c only if implementing durable coordination: Auto Number Name, Run_Key__c Text(80) Unique External ID, Status__c Picklist Running/Succeeded/Failed, Started_At__c and Finished_At__c DateTime, and Summary__c Text(255). Use a key such as 'cancel:2030-04-10'. These are new fields. A failed run requires an authorized recovery transition, not deletion of evidence.

> **🔎 Check your understanding**
>
> What happens if yesterday's run is still marked Running after its worker failed?

## 3. Build and inspect

Use a dedicated training schedule and remove it when the experiment ends. Document the scheduling user's time zone and the business cutoff; do not infer both from the laptop clock.



### Step 1: Define the operational contract

Write schedule time, time zone, selection cutoff, expected duration, overlap response, and missed-run recovery.

> **🔎 Check your understanding**
>
> Expected result: Another developer can predict the intended date window.

### Step 2: Build a bounded launcher

Implement a small Schedulable or scheduled Flow that invokes the chosen bounded workload. Add an explicit coordination policy if duplicate launches are possible.

> **🔎 Check your understanding**
>
> Expected result: The launcher does not perform an uncontrolled scan itself.

### Step 3: Observe and clean up

Test the launcher locally, observe one training run, force the overlap scenario, and inspect both platform and business status. Remove the recurring schedule afterward.

> **🔎 Check your understanding**
>
> Expected result: No unattended training job remains active.

## 4. Failure cases and boundaries

Scheduling work separately for every record can consume scarce scheduling capacity and complicate operations. Prefer a deliberate recurring selection when that matches the requirement.

A permanent Running flag without expiry, ownership, or reconciliation can block work after a crash. Conversely, clearing it automatically without checking the worker can permit overlapping activity.

> **⚠️ Watch out**
>
> Do not treat a scheduler's configured time as proof that business processing completed at that time.

## ⚡ Independent practice: Operate a nightly job

Add a schedule and a documented monitoring and recovery procedure to M13.

1. Specify time and cutoff.
2. Demonstrate overlap handling.
3. Capture one run and clean up the schedule.

### Your work is ready when

- Time-zone assumptions are explicit.
- Overlap and abandoned-run behavior are defined.
- The report distinguishes scheduling, execution, and business completion.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why can a nightly job overlap?

**Answer:** Its previous execution or a manual run can still be active when another launch is requested.

### 2. Why is a check-then-start query insufficient alone?

**Answer:** Two launchers can both observe no active work before either starts it.

### 3. What should a run summary contain?

**Answer:** Its business window, processed and failed results, timing, and enough identity to investigate or recover.

## What to take away

- Separate schedule from workload.
- Coordinate duplicate launches.
- Monitor business outcomes.

## Sources and further reading

- [Apex scheduler](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-scheduler.html)
- [Async decision guide](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)


---

# API contracts and credential boundaries

M15 · middle · About 50 minutes with practice

![Two system boxes connected by a contract card and a small key](https://sam-portal-production.up.railway.app/lesson-images/M15.jpg)

Describe the warranty provider's request, response, errors, and identity before connecting a client.

## Before you begin

- M12 Warranty_Request__c state.
- M06 security context; HTTP vocabulary is introduced here.

## What you will learn

- Write an explicit external-service contract.
- Separate endpoint configuration from authentication.
- Define which runtime user can use a principal.

## 1. Understand the mechanism

An API contract states how two systems communicate. For Northstar's warranty check, it should specify the method and path, VIN format, response fields, error meanings, authentication, timeout expectations, and retry rules. A successful sample call is only one observation. It does not establish the contract for missing vehicles, expired credentials, malformed responses, or repeated operations.

HTTP is a request-and-response protocol. A method says what kind of operation is requested: GET reads information, while a service may use POST to accept an operation. A URL identifies the destination; headers carry metadata; a body carries structured content. The response includes a numeric status and may include a body. JSON represents named values using braces, quoted property names, strings, numbers, Boolean values, arrays, and null. In the sample, covered is a Boolean, not the string "true". The exact meaning of each status and field belongs in the service contract.

Use an intentionally fictional contract for this course: GET /v1/warranties/{vin}; 200 returns covered as a Boolean and expiresOn as an ISO date; 404 means the vehicle was not found; 429 and selected 5xx responses are potentially transient. A negative covered value is a valid business answer, not a transport failure. The mock implementation in M17 does not require a real warranty account or server.

Modern Named Credentials separate endpoint configuration from authentication configuration. A Named Credential identifies the endpoint and references an External Credential describing how authentication works. A principal represents the permitted identity configuration, and permission assignments control who may use it. A named principal can represent a shared integration identity; a per-user arrangement ties calls to individual external identities where the provider supports that design.

Credentials are operational configuration, not strings embedded in Apex or a repository. Decide the required remote scopes and who can provision or rotate the secret. A user who can run the Apex class should not automatically be assumed able to use every external principal. Authentication to the provider also does not replace Salesforce permission checks for the source vehicle and destination request.

> **💡 Key idea**
>
> The endpoint, remote identity, Salesforce caller, and permitted business operation are separate parts of the contract.

## 2. Northstar Motors worked example

Anna asks for a warranty check on vehicle NS-001. Salesforce reads the synthetic VIN under the intended user permissions. The client uses only the dedicated warranty endpoint and the allowed principal. A 200 response with covered=false means the lookup completed and found no coverage. A 401 means the integration's authentication needs attention; asking Anna to retry repeatedly is unlikely to fix it.

For the required exercise, write the contract and use test-only mock calls. You may prepare a configuration design with the Named Credential API name Northstar_Warranty, but do not enter fabricated real credentials or make requests to an arbitrary public service. A live credential exercise is optional only when you control a suitable test provider.

> **🔎 Check your understanding**
>
> Can you distinguish a valid 'not covered' answer from failed authentication?

**Fictional successful response contract, not a real provider payload**

```json
{
  "covered": true,
  "expiresOn": "2031-06-30"
}
```

**Production-style endpoint reference fragment; requires configured Named Credential**

```apex
request.setEndpoint('callout:Northstar_Warranty/v1/warranties/'
    + EncodingUtil.urlEncode(vin, 'UTF-8'));
request.setMethod('GET');
```

## 3. Build and inspect

The required path is contract plus HttpCalloutMock, with no remote server. Optional credential setup must record the selected protocol, principal type, permission mapping, and test endpoint you own.



### Step 1: Write the contract table

Define request inputs, successful fields and types, each error category, identity, timeout, and safe retry behavior.

> **🔎 Check your understanding**
>
> Expected result: Unknown responses have a specified handling rule.

### Step 2: Map the credential boundary

Draw Salesforce user → allowed principal → External Credential → Named Credential endpoint. Explain named versus per-user identity for this use case.

> **🔎 Check your understanding**
>
> Expected result: Secrets are not passed through business method parameters.

### Step 3: Review failure behavior

Describe how 401, 403, 404, 429, malformed JSON, and timeout differ. Choose the visible request state and operator action for each.

> **🔎 Check your understanding**
>
> Expected result: The same 'retry' button is not offered indiscriminately.

## 4. Failure cases and boundaries

A developer can accidentally log Authorization headers or full response bodies. Define safe diagnostic fields and keep secrets out of source control and evidence.

Configuring credentials does not prove the provider supports idempotency, a particular scope, or a particular API response. Those are contract facts that require documentation or controlled verification.

> **⚠️ Watch out**
>
> No real external service, secret, purchase, or paid trial is required for the mock-based course path.

## ⚡ Independent practice: Specify the warranty API

Create a contract and credential responsibility map that another developer can implement without guessing.

1. Define the fictional request and response.
2. Classify failure and retry outcomes.
3. Document optional live setup separately from mock verification.

### Your work is ready when

- Business negative and transport failures differ.
- Identity and principal permission mapping are explicit.
- No secret appears in code or documentation.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What does the Named Credential contribute?

**Answer:** Endpoint configuration and a reference to the authentication configuration.

### 2. What does an External Credential describe?

**Answer:** The authentication protocol and related identity configuration used for the external system.

### 3. Why not retry every 401?

**Answer:** The likely issue is invalid or expired authentication; repeated identical attempts can add load without repairing it.

## What to take away

- Write the contract before the client.
- Separate identity from endpoint.
- Keep live integration evidence distinct from mock tests.

## Sources and further reading

- [Named and External Credentials](https://help.salesforce.com/s/articleView?id=platform.external_services_define_named_credential.htm&language=en_US&type=5)
- [Principal access](https://help.salesforce.com/s/articleView?id=sf.nc_enable_ext_cred_principal.htm&language=en_US&type=5)


---

# Working with REST and SOAP service contracts

M16 · middle · About 50 minutes with practice

![Two distinct structured message envelopes exchanged between the same systems](https://sam-portal-production.up.railway.app/lesson-images/M16.jpg)

Read an existing provider interface, select the appropriate client and mock, and preserve its error and authentication semantics.

## Before you begin

- M15 HTTP and credential contract.
- Apex types and M15 JSON/HTTP introduction; XML and generated SOAP types are explained here.

## What you will learn

- Compare REST resource calls with SOAP operations.
- Explain WSDL-generated Apex dependencies.
- Choose HttpCalloutMock or WebServiceMock correctly.

## 1. Understand the mechanism

REST and SOAP are integration styles with different contract shapes. A REST warranty API might expose a resource path and JSON representation. A SOAP service exposes named operations with typed XML messages described by WSDL. The choice is often already made by the provider. Replacing a supported SOAP operation with an imagined REST endpoint is not an implementation decision available to the caller.

XML uses matching opening and closing tags to name structured values; an xmlns declaration identifies a namespace so similarly named elements can be distinguished. WSDL is an XML contract describing operations, message structures, and service bindings. Reading the illustrative body below does not require writing a WSDL from scratch. In the linked official example, follow its actual generated class definitions before running its mock test.

For a REST client, inspect the HTTP method, URL construction, headers, response status, and JSON schema. For SOAP, inspect the service endpoint, operation, request and response types, and fault structure. Authentication remains a separate concern in both cases. A well-formed XML message can still be unauthorized, and a 200 transport response is not by itself proof of a successful SOAP business result.

WSDL2Apex generates Apex classes from a supported WSDL contract. Those generated types reflect the provider's schema and operation names, so example class names cannot be assumed to exist in your org. Keep generated code separate from the small adapter that the application calls. A schema change may require regeneration and regression tests rather than hand-editing generated definitions throughout business logic.

Use the matching test seam. An HTTP client using Http.send is tested with HttpCalloutMock. A generated SOAP client invoking WebServiceCallout.invoke is tested with WebServiceMock. The mocks return the appropriate response shape without a running provider. This allows you to test request translation and response handling while clearly leaving real authentication and provider compatibility for a later integration test.

> **💡 Key idea**
>
> Adapt to the provider's actual contract and mock the mechanism your client really invokes.

## 2. Northstar Motors worked example

Northstar's fictional REST response says covered=true. An equivalent SOAP operation might return a typed CoverageResult with an eligibility flag and expiry date. The application should consume a small common result rather than exposing provider-specific XML types throughout its UI and Queueable code. A fault such as UnknownVehicle is not the same as a connection failure.

For the SOAP inspection exercise, use Salesforce's official generated WSDL2Apex example linked in Sources. It supplies actual generated class definitions and the associated web-service test pattern. Identify the generated operation and response element from that example before adapting the idea to a hypothetical warranty contract. The sample's operation is not presented as a live Northstar warranty API.

> **🔎 Check your understanding**
>
> Would an HttpCalloutMock necessarily intercept a generated WebServiceCallout.invoke call?

**Illustrative SOAP-style body only; not a complete WSDL or deployable client**

```xml
<CheckWarranty xmlns="urn:northstar:demo">
  <vin>SAM00000000000001</vin>
</CheckWarranty>
```

## 3. Build and inspect

No server is required. Compare both contracts, then run the official generated SOAP sample and its supplied WebServiceMock pattern. If you choose the REST alternative, complete M17’s client first and return to this comparison. Do not assume a REST adapter already exists at this point. Label which path was executed and which was analyzed.



### Step 1: Trace both interfaces

For the fictional REST contract and official SOAP sample, locate endpoint, operation, request fields, result type, error form, and authentication configuration.

> **🔎 Check your understanding**
>
> Expected result: The two paths are compared on concrete boundaries.

### Step 2: Inspect generated code

Identify the SOAP port class, request/response element types, and invocation call. Wrap provider details behind a small application-facing result.

> **🔎 Check your understanding**
>
> Expected result: Application logic need not depend on every generated XML type.

### Step 3: Select and run the mock

Use the correct mock interface for the chosen client. Assert one successful result and one fault or rejection; do not contact the example endpoint.

> **🔎 Check your understanding**
>
> Expected result: The test proves local translation without claiming live provider compatibility.

## 4. Failure cases and boundaries

WSDL support has constraints; a failed import does not justify inventing generated methods. Record the parser failure and inspect the supported schema or provider-approved simplified contract.

Changing an endpoint string does not change a SOAP client's types or operation binding. Keep endpoint configuration and contract versioning as separate review items.

> **⚠️ Watch out**
>
> Generated class and operation names belong to a particular WSDL; never paste placeholder names as if they were real Salesforce APIs.

## ⚡ Independent practice: Compare two warranty integration designs

Write a contract map and demonstrate the appropriate mock for one concrete client.

1. Map REST and SOAP request/response shapes.
2. Identify the generated SOAP dependencies.
3. Run a local success and failure test without a provider.

### Your work is ready when

- The selected mock matches the call mechanism.
- Example XML is not described as a complete WSDL.
- Live authentication remains an explicitly separate check.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Must a modern integration use REST?

**Answer:** No. Use the provider's supported contract and the requirements of the system.

### 2. Why wrap generated SOAP classes?

**Answer:** It limits provider-schema coupling in business logic and makes changes easier to isolate.

### 3. Which mock tests WSDL-generated invocations?

**Answer:** WebServiceMock, registered with Test.setMock, supplies the generated response shape.

## What to take away

- Read the actual contract.
- Separate generated code from business adaptation.
- Use the correct mock boundary.

## Sources and further reading

- [Testing generated web-service callouts](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-callouts-wsdl2apex-testing.html)
- [Official generated WSDL2Apex example](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-callouts-wsdl2apex-gen-code.html)
- [Testing HTTP callouts](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-restful-http-testing.html)


---

# HTTP callouts, failures, and bounded retries

M17 · middle · About 50 minutes with practice

![An external request meeting a timeout clock and a carefully bounded retry loop](https://sam-portal-production.up.railway.app/lesson-images/M17.jpg)

Implement a small warranty client and test success, invalid responses, business absence, throttling, server failure, and transport errors locally.

## Before you begin

- M15 fictional API contract.
- M12 request states and M16 HttpCalloutMock.

## What you will learn

- Classify outcomes before retrying.
- Write a mock that checks the request.
- Keep network tests independent of a real server.

## 1. Understand the mechanism

A callout is a request from Apex to an external HTTP endpoint. Its result has several layers: the transport may fail, the server may return an error status, the body may violate the expected schema, or the body may contain a valid negative business answer. Collapsing all four into 'not covered' would mislead Anna and hide integration failures.

Use a small result contract such as COVERED, NOT_COVERED, NOT_FOUND, RETRYABLE, INVALID_RESPONSE, and TRANSPORT_ERROR. A 429 or selected 5xx response may justify a bounded later retry. A malformed 200 response should be diagnosed as a contract problem. A transport exception does not prove the provider did nothing; for state-changing requests, an unknown remote outcome requires reconciliation rather than a blind retry.

The required tests use HttpCalloutMock. Test.setMock replaces the network response, allowing a deterministic test to assert method, endpoint, and result. The reserved .invalid domain in the example is deliberately not a functioning server. Never run this demo client as a live provider integration. Replace its endpoint with the configured Named Credential only when performing a separately authorized live integration.

Retries belong to orchestration, not an uncontrolled loop around Http.send. Record attempt count, maximum attempts, next eligible time, and the final visible state. In this lesson, implement classification and demonstrate a bounded policy with controlled inputs; do not sleep in a unit test or promise an exact Queueable start time.

> **💡 Key idea**
>
> A correct retry policy begins by distinguishing failure categories and uncertain outcomes.

## 2. Northstar Motors worked example

Anna requests a warranty check. A 200 body containing covered=false is a successful negative answer. A 404 means the fictional provider has no matching vehicle. A 500 means the request did not yield a usable answer and may be retried under policy. The sample below is a complete minimal client class for the local mock exercise; it is not the complete request orchestration or production integration.

Create a separate test class implementing HttpCalloutMock. Its respond method should assert GET and the expected VIN in the endpoint, then return controlled status/body pairs. Register a different mock for each case and assert the returned classification. Include a mock that throws CalloutException and one with an invalid covered type.

> **🔎 Check your understanding**
>
> Which result states mean a business answer was obtained, rather than merely an HTTP response?

**Complete minimal WarrantyDemoClient.cls; test-only endpoint, no real server**

```apex
public with sharing class WarrantyDemoClient {
    public static String check(String vin) {
        if (String.isBlank(vin)) return 'INVALID_INPUT';
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://warranty.example.invalid/v1/warranties/'
            + EncodingUtil.urlEncode(vin, 'UTF-8'));
        req.setMethod('GET');
        req.setTimeout(10000);
        try {
            HttpResponse res = new Http().send(req);
            Integer status = res.getStatusCode();
            if (status == 404) return 'NOT_FOUND';
            if (status == 429 || (status >= 500 && status <= 599)) return 'RETRYABLE';
            if (status != 200) return 'REJECTED';
            try {
                Map<String, Object> body = (Map<String, Object>)
                    JSON.deserializeUntyped(res.getBody());
                if (!(body.get('covered') instanceof Boolean))
                    return 'INVALID_RESPONSE';
                if (!(body.get('expiresOn') instanceof String))
                    return 'INVALID_RESPONSE';
                String expiry = (String) body.get('expiresOn');
                if (!Pattern.matches('[0-9]{4}-[0-9]{2}-[0-9]{2}', expiry))
                    return 'INVALID_RESPONSE';
                Date parsedExpiry = Date.valueOf(expiry);
                return (Boolean) body.get('covered') ? 'COVERED' : 'NOT_COVERED';
            } catch (Exception invalidBody) {
                return 'INVALID_RESPONSE';
            }
        } catch (CalloutException transport) {
            return 'TRANSPORT_ERROR';
        }
    }
}
```

## 3. Build and inspect

Save the complete client in your own training DX project with matching Apex metadata. The mock class and test methods are your guided task. No Named Credential is required for the mock-only endpoint; do not make a live request.

When the M12 worker makes HTTP calls, declare implements Queueable, Database.AllowsCallouts. Read the request first, perform the callout before pending DML, then save the result and attempt history. Updating Processing or inserting a log before Http.send in that same transaction can cause an uncommitted-work error. A prior entry transaction may persist Queued and enqueue the worker; it commits separately. For multiple requests, design callout/write ordering deliberately rather than alternating a call and DML in a loop. The durable claim/concurrency policy remains a separate orchestration responsibility.



### Step 1: Build the response mock

Implement HttpCalloutMock with constructor values for status and body. Assert the expected request method and synthetic VIN inside respond.

> **🔎 Check your understanding**
>
> Expected result: The test fails if the client sends the wrong request.

### Step 2: Test all classifications

Register mocks for covered true/false with a valid expiresOn string, 404, 429, 500, malformed JSON, missing fields, wrong Boolean type, invalid or missing expiry date, and a transport exception. Assert INVALID_RESPONSE for bodies that violate either required field.

> **🔎 Check your understanding**
>
> Expected result: Every response produces the declared safe result.

### Step 3: Connect the bounded policy

Map the classifications to M12 request states and an attempt limit. Demonstrate two transient attempts followed by success with controlled responses, then exhaustion.

> **🔎 Check your understanding**
>
> Expected result: A retry never silently becomes a completed warranty decision.

## 4. Failure cases and boundaries

A test that returns 200 for every request can pass even when the endpoint or HTTP method is wrong. Assert the outgoing contract.

The catch for body parsing must not hide a successful business response under an unrelated status. Keep classification tests focused enough to identify the incorrect branch.

> **⚠️ Watch out**
>
> Do not log Authorization headers, credentials, or unrestricted response payloads when diagnosing failures.

## ⚡ Independent practice: Test the warranty client locally

Implement the mock and bounded orchestration mapping around the supplied client.

1. Create request-asserting mocks.
2. Test every listed outcome.
3. Record the retry limit and final user-visible state.

### Your work is ready when

- All tests run without a provider.
- A valid negative answer differs from failure.
- Retry exhaustion is visible and does not loop indefinitely.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Is covered=false an error?

**Answer:** No. Under this contract it is a valid business result.

### 2. What does a transport exception prove?

**Answer:** That the caller did not obtain a usable response; it does not universally prove the remote side performed no action.

### 3. Why assert the request in the mock?

**Answer:** Otherwise a wrong URL, method, or input could receive a fake success and pass unnoticed.

## What to take away

- Separate transport, protocol, schema, and business outcomes.
- Mock the outgoing contract as well as the response.
- Bound and observe retries.

## Sources and further reading

- [Testing HTTP callouts](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-restful-http-testing.html)
- [Integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Testing HTTP callouts](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-restful-http-testing-httpcalloutmock.html)
- [DML before Apex callouts](https://help.salesforce.com/s/articleView?id=000394416&language=en_US&type=1)
- [Queueable callouts from triggers](https://trailhead.salesforce.com/content/learn/modules/apex_triggers/apex_triggers_intro)


---

# Inbound APIs, external IDs, and duplicate protection

M18 · middle · About 50 minutes with practice

![Two matching incoming records passing a unique-key gate into one stored record](https://sam-portal-production.up.railway.app/lesson-images/M18.jpg)

Accept repeated incoming data without creating duplicate business requests, while distinguishing record identity from operation identity.

## Before you begin

- M08 idempotency and unique constraints.
- M12 Warranty_Request__c and M15 contract design.

## What you will learn

- Use an external ID for stable record matching.
- Define conflicting reuse of an idempotency key.
- Compare standard REST upsert with custom orchestration.

## 1. Understand the mechanism

An external ID identifies a Salesforce record using a key from another system. It lets an integration find or upsert the same record without first knowing its Salesforce Id. Upsert means create when there is no matching record and update when there is one. It is useful for synchronization, but it does not by itself make every downstream side effect exactly once.

An idempotency key identifies a business operation. The same request repeated after a timeout should return the existing result or safely continue that operation. The key must have a defined scope and payload meaning. Reusing WARRANTY-100 for a different vehicle should be a conflict, not a quiet overwrite of the original customer's request.

The starter VIN__c is a unique external ID on Vehicle__c. M12 adds a unique external Request_Key__c on Warranty_Request__c. These keys solve different matching needs: VIN identifies a vehicle; the request key identifies a particular warranty operation. A vehicle can legitimately have more than one check over time, so VIN alone is usually insufficient as the operation key.

Prefer the standard API when the requirement is ordinary record synchronization and the standard permission model fits. Use a custom endpoint or service when accepting the operation requires additional validation, state transitions, or a controlled result. In either case, authenticate the caller, limit its permissions, validate payload fields, and ensure repeated input cannot trigger an unintended duplicate external action.

> **💡 Key idea**
>
> Record identity says which entity; operation identity says which attempt at a business intention.

## 2. Northstar Motors worked example

A partner sends key WARRANTY-100 for NS-001 three times because its first two responses were lost. Northstar should have one request for that key. The second and third deliveries should not reset Succeeded to Queued or launch another provider operation without a defined reason. Now send the same key with NS-002: the service should reject conflicting reuse.

A standard upsert can demonstrate stable record matching with the existing VIN field. Use the placeholder request below only in a controlled authenticated API tool, replacing the host and version for your training org. Unit tests can instead exercise the application service directly without requiring any external client or server.

> **🔎 Check your understanding**
>
> Why should an update of a matching vehicle not automatically count as a new warranty request?

**Standard REST upsert shape; placeholder host, no credential included**

```http
PATCH /services/data/v68.0/sobjects/Vehicle__c/VIN__c/SAM00000000000001
Content-Type: application/json

{"Name":"NS-001","Model__c":"City EV","Status__c":"Available"}
```

## 3. Build and inspect

Use the declared unique external IDs. If storing a normalized request fingerprint, add Payload_Fingerprint__c Text(64) to Warranty_Request__c explicitly and document the canonical fields included; it is not already in the starter.



### Step 1: Define identity and conflict rules

State the record key, operation key, key scope, fields that must match on a repeat, and behavior after success or failure.

> **🔎 Check your understanding**
>
> Expected result: A repeated key has an unambiguous response.

### Step 2: Implement the acceptance boundary

Validate allowed inputs, find or create the request under a durable uniqueness constraint, and preserve terminal results on a legitimate repeat.

> **🔎 Check your understanding**
>
> Expected result: Three deliveries correspond to one business request.

### Step 3: Test repetition and disagreement

Submit identical input three times, then reuse the key with a different vehicle. Add a concurrency analysis explaining why query-before-insert alone is insufficient.

> **🔎 Check your understanding**
>
> Expected result: Identical repeats are safe; conflicting reuse is rejected.

## 4. Failure cases and boundaries

An external-ID field that is not unique can still allow ambiguous matching or duplicates under some operations. State the uniqueness requirement explicitly for the exercise.

Upserting a record can fire automation again. Check that the automation responds to meaningful changes or operation identity rather than treating every write as a new external action.

> **⚠️ Watch out**
>
> Do not promise exactly-once effects merely because an endpoint uses upsert.

## ⚡ Independent practice: Accept one request three times

Build and verify a stable inbound request contract with conflict handling.

1. Define record and operation keys.
2. Test repeat delivery and terminal-state preservation.
3. Reject changed payload under the same key.

### Your work is ready when

- One request exists for three identical deliveries.
- A successful request is not silently restarted.
- Conflicting key reuse returns an explicit error.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What does upsert guarantee conceptually?

**Answer:** It chooses create or update based on matching record identity; downstream behavior still requires design.

### 2. Why not use VIN as every request key?

**Answer:** The same vehicle can have distinct legitimate checks at different times.

### 3. What must a repeat compare?

**Answer:** The normalized fields that define the original operation, so conflicting reuse cannot overwrite its meaning.

## What to take away

- Separate entity identity from operation identity.
- Use durable uniqueness.
- Review repeated side effects.

## Sources and further reading

- [REST upsert by external ID](https://developer.salesforce.com/docs/platform/api-rest/guide/dome-upsert.html)
- [Integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)


---

# Integration diagnostics and controlled recovery

M19 · middle · About 50 minutes with practice

![A traced request moving through three systems with one clear diagnostic marker](https://sam-portal-production.up.railway.app/lesson-images/M19.jpg)

Trace a warranty request across attempts and give an operator enough evidence to retry safely without exposing secrets.

## Before you begin

- M12 persistent requests.
- M17 error categories and M18 operation identity.

## What you will learn

- Separate correlation, attempt, and platform job identities.
- Preserve useful failure history.
- Define safe manual retry eligibility.

## 1. Understand the mechanism

When Anna says that a warranty check failed, a developer needs to locate one business request and follow its attempts. A correlation ID connects diagnostic events belonging to the same operation. The request key from M12 can serve this role within the exercise. Each retry additionally has an attempt number and potentially a new Queueable job ID. These values answer different questions and should not replace one another.

A useful diagnostic event records what stage was reached, when it happened, the outcome category, and a safe error code. It need not contain the full request body, customer details, credentials, or raw provider response. Log enough to distinguish a malformed response from an expired credential or rejected business input, while keeping sensitive data out of routine evidence.

A single Error_Code__c field cannot preserve every attempt if it is overwritten on each retry. Introduce Integration_Attempt__c when durable history is required: Auto Number Name, Request__c lookup to Warranty_Request__c, Attempt_Number__c Number(3,0), Outcome__c Text(40), Error_Code__c Text(80), Occurred_At__c DateTime, and Duration_Ms__c Number(8,0). Define private access and appropriate permissions. These fields are new dependencies.

Recovery is a business operation with authorization and state rules. A manual retry should be allowed only for eligible failures, below the limit, and when another attempt is not active. Reuse the same business identity and preserve previous history. An Unknown outcome may require checking the provider's status before performing another state-changing operation; a Retry button cannot resolve that uncertainty by itself.

> **💡 Key idea**
>
> An operator should find the request, understand the failure category, and choose an authorized next action.

## 2. Northstar Motors worked example

Request WARRANTY-100 has attempt 1 classified TRANSPORT_ERROR and attempt 2 Succeeded. Oleg should see both attempts rather than only a final green status. The first failure explains a delay and can reveal a wider incident. The final result should reference the successful attempt without rewriting the original timestamp or pretending there was no failure.

Now consider three requests with different problems: invalid customer input, 401 authentication, and 503 temporary service failure. The first needs corrected data, the second needs credential attention, and the third may be eligible for a bounded retry. A dashboard displaying only 'Failed' invites the wrong action on at least two of them.

> **🔎 Check your understanding**
>
> Can Oleg explain why a request waited twenty minutes without opening a full Debug Log?

## 3. Build and inspect

Use the Warranty_Request__c fields declared in M12 and the attempt object declared here. A report or list view is sufficient; a custom LWC is not required for this lesson.



### Step 1: Define diagnostic fields

Choose correlation key, attempt number, stage, outcome, duration, and safe error code. State which data is deliberately excluded.

> **🔎 Check your understanding**
>
> Expected result: The log supports diagnosis without storing secrets.

### Step 2: Record two controlled attempts

Use M17 mocks to produce a failure and a success. Persist attempt rows and update the current request state without deleting history.

> **🔎 Check your understanding**
>
> Expected result: Both the current result and its history are visible.

### Step 3: Exercise recovery decisions

Create examples of invalid input, authentication failure, transient failure, and already-running work. Apply the documented retry policy.

> **🔎 Check your understanding**
>
> Expected result: Only eligible requests launch another bounded attempt.

## 4. Failure cases and boundaries

A log write may fail along with the business transaction. Platform job status and external monitoring can provide additional evidence; the custom log alone does not guarantee complete observability.

Retrying a request with changed input under the same key can corrupt its identity. Decide whether the correction is a new operation or an allowed version, and document that choice.

> **⚠️ Watch out**
>
> Do not expose raw stack traces, access tokens, Authorization headers, or unrestricted payloads in an operator-facing error message.

## ⚡ Independent practice: Create an integration investigation trail

Demonstrate how one request can be found, diagnosed, and safely retried.

1. Add the declared history schema.
2. Record controlled failure and success attempts.
3. Write a short operator recovery procedure.

### Your work is ready when

- History survives later success.
- One correlation key connects request and attempts.
- Retry authorization and eligibility are explicit.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why retain failed attempts after success?

**Answer:** They explain latency and recurring defects and support incident investigation.

### 2. Is a job ID enough?

**Answer:** No. One business operation can span several jobs and attempts.

### 3. Why not retry every failed request?

**Answer:** Some failures require input or credential repair, and unknown remote outcomes may require reconciliation first.

## What to take away

- Correlate without overlogging.
- Preserve attempt history.
- Make recovery an explicit operation.

## Sources and further reading

- [Integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Async architecture](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)


---

# Choosing SOQL or SOSL for a search requirement

M20 · middle · About 50 minutes with practice

![A focused search over one record shelf beside a broader search across several shelves](https://sam-portal-production.up.railway.app/lesson-images/M20.jpg)

Use structured queries for known filters and indexed search for words across object types, while handling delayed search visibility.

## Before you begin

- Junior SOQL and standard CRM objects.
- M06 user-mode security.

## What you will learn

- Choose SOQL or SOSL from the question.
- Navigate declared lookup relationships.
- Explain why a newly saved record may not immediately appear in search.

## 1. Understand the mechanism

SOQL queries records from a known object using structured fields and filters. It suits a request such as 'show Confirmed test drives scheduled tomorrow.' SOSL searches text across supported searchable fields and can return results from multiple object types. It suits 'find the customer named Irina across Contact, Lead, and Account.' The decision starts with the question, not with which language has fewer characters.

A child-to-parent SOQL relationship traverses a lookup using its relationship name. In the starter, Test_Drive__c.Customer__c points to Contact and Vehicle__c points to Vehicle__c, so expressions such as Customer__r.Name and Vehicle__r.Model__c provide related fields. These optional lookups may be null; the UI should not assume every row has a parent record.

Search indexes are updated asynchronously. After Anna creates a Contact, the record can be available through a direct ID query while a text search has not yet found it. That is a difference between the data store and search indexing, not proof that the save failed. For the immediate post-save screen, retain the created record ID rather than searching again to decide whether creation succeeded.

Neither query language replaces access control. State the running identity and use the intended access mode. Limit fields and result size to the UI's needs, validate search inputs, and avoid returning arbitrary object data. Search results also require a display contract: label the record type, distinguish people from companies, and handle ambiguous names instead of selecting the first match.

> **💡 Key idea**
>
> Choose structured filtering for a known record set and text search for discovery across searchable data.

## 2. Northstar Motors worked example

Oleg wants tomorrow's confirmed appointments, ordered by time. A bounded SOQL query on Test_Drive__c answers this precisely. Anna wants to locate Irina, whose name might appear as a Contact or an unconverted Lead; SOSL can return object-specific result lists that the UI labels separately.

Create a synthetic Contact named Irina SAM Search. Save it and keep its Id. Compare direct retrieval by Id with a SOSL search immediately and later. If search already finds it, record that observation; do not force a delay or claim the index always takes a fixed number of seconds. The important point is that immediate search visibility is not a guarantee.

> **🔎 Check your understanding**
>
> If a newly created Contact is absent from SOSL, which identifier can still prove that the save succeeded?

**SOQL fragment; startAt/endAt are supplied Datetime bounds**

```apex
List<Test_Drive__c> visits = [
    SELECT Id, Name, Scheduled_At__c, Customer__r.Name,
           Vehicle__r.Model__c
    FROM Test_Drive__c
    WHERE Status__c = 'Confirmed'
      AND Scheduled_At__c >= :startAt AND Scheduled_At__c < :endAt
    WITH USER_MODE
    ORDER BY Scheduled_At__c, Id LIMIT 100
];
```

**SOSL fragment; searchTerm is a validated string such as Irina***

```apex
List<List<SObject>> found = [
    FIND :searchTerm IN NAME FIELDS
    RETURNING Contact(Id, Name), Lead(Id, Name), Account(Id, Name)
    WITH USER_MODE
];
```

## 3. Build and inspect

No new custom fields are required. Use only synthetic Contact, Lead, and Account records and grant the test user the necessary access to the objects being queried.



### Step 1: Implement the appointment query

Define a time-zone-aware date window, use an inclusive lower and exclusive upper bound, and display null parent relationships safely.

> **🔎 Check your understanding**
>
> Expected result: Boundary appointments appear in the intended day without overlap.

### Step 2: Build the multi-object search

Return labeled Contact, Lead, and Account groups and ask the user to resolve ambiguous matches.

> **🔎 Check your understanding**
>
> Expected result: A company is not silently treated as the customer Contact.

### Step 3: Test save versus search

Create a Contact, retrieve by returned Id, and observe text-search visibility. In SOSL unit tests use Test.setFixedSearchResults for deterministic fixtures.

> **🔎 Check your understanding**
>
> Expected result: Unit tests do not claim to measure live indexing latency.

## 4. Failure cases and boundaries

Using a text search to establish whether the previous save succeeded can create accidental duplicates when the user retries a successful creation.

A hard-coded LIMIT can silently hide needed records. Define pagination or a visible result cap rather than presenting the first page as the complete dataset.

> **⚠️ Watch out**
>
> Do not promise immediate search indexing or use search as a substitute for CRUD/FLS and record-access checks.

## ⚡ Independent practice: Build structured and discovery searches

Create the appointment list and customer search with distinct contracts.

1. Implement bounded SOQL.
2. Implement labeled SOSL results.
3. Record the immediate post-save experiment.

### Your work is ready when

- Date boundaries and null lookups are handled.
- Multiple object types are distinguishable.
- The indexing limitation is explained without fabricated timing.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why use SOQL for tomorrow's appointments?

**Answer:** The object and field predicates are known and require structured filtering.

### 2. Why can SOSL miss a fresh record?

**Answer:** Its search index may not yet reflect the committed data.

### 3. What does FixedSearchResults test?

**Answer:** Deterministic SOSL result handling in unit tests, not the live indexing system.

## What to take away

- Match the query to the question.
- Keep created IDs for immediate confirmation.
- Handle security, ambiguity, and result bounds.

## Sources and further reading

- [User-mode query behavior](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-enforce-usermode.html)
- [SOQL and SOSL reference](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/)


---

# Lightning Web Component lifecycle

M21 · middle · About 50 minutes with practice

![A component card moving through create, render and cleanup stages on one path](https://sam-portal-production.up.railway.app/lesson-images/M21.jpg)

Observe creation, attachment, rendering, removal, and child-error handling without assuming a component renders only once.

## Before you begin

- Junior JavaScript classes, LWC templates, and reactive fields.
- A simple component deployed in a training Lightning page.

## What you will learn

- Explain the purpose of each lifecycle hook.
- Avoid render-driven update loops.
- Clean up listeners and subscriptions at the appropriate boundary.

## 1. Understand the mechanism

LWC manages component instances. A lifecycle hook is a method the framework calls at a particular stage, such as construction, connection to the document, rendering, or disconnection. The lifecycle concerns the instance, not a single Salesforce record save. A component may render many times as its state or inputs change, and an attached instance may later be removed and reinserted.

Use constructor for minimal initialization after super, not for querying child elements. connectedCallback is a place to begin work that requires attachment, but it can run again if the instance is reinserted. renderedCallback runs after rendering and can run repeatedly; changing reactive data there can schedule another render and create a loop. disconnectedCallback is where owned external resources often need cleanup.

Parent and child behavior matters. Connection flows from parent toward child, while rendered callbacks flow from child toward parent. Observing this order helps explain why a parent cannot assume a child's internal DOM exists during construction. Do not build business correctness around undocumented timing between a wire response and an unrelated promise; data arrival remains asynchronous.

errorCallback provides an error boundary for supported errors in descendant components. It is not a universal catch for every promise rejection, arbitrary event handler, or error in the boundary's own code. Handle asynchronous failures where they occur and show an appropriate UI state. The boundary should give the user a useful fallback rather than replacing diagnosis with a silent blank screen.

> **💡 Key idea**
>
> Lifecycle hooks describe repeatable instance phases; they are not one-time business workflow steps.

## 2. Northstar Motors worked example

Create a parent with a button that shows or hides a child visit panel. The child displays a counter and logs connection, rendering, and disconnection. Incrementing the counter should cause rendering without creating a new component instance. Hiding and showing demonstrates removal and either reinsertion or a new instance depending on how the parent template manages it.

Use the complete controller and template below as a small observation component. Add the usual LWC metadata target file through the setup guide before deploying it. Console logs are temporary teaching instrumentation; remove noisy logs before a real release.

> **🔎 Check your understanding**
>
> Why does clicking Update counter call renderedCallback without calling constructor again?

**Complete lifecycleProbe.js controller for the observation component**

```javascript
import { LightningElement } from 'lwc';
export default class LifecycleProbe extends LightningElement {
    count = 0;
    constructor() { super(); console.log('constructed'); }
    connectedCallback() { console.log('connected'); }
    renderedCallback() { console.log('rendered', this.count); }
    disconnectedCallback() { console.log('disconnected'); }
    increment() { this.count += 1; }
}
```

**Complete lifecycleProbe.html template**

```html
<template>
    <p>Observed updates: {count}</p>
    <lightning-button label="Update counter" onclick={increment}>
    </lightning-button>
</template>
```

## 3. Build and inspect

The probe requires no custom Salesforce fields. A separate parent component controls whether c-lifecycle-probe is present. Add an error-boundary experiment as a separate component rather than throwing inside the base probe.



### Step 1: Observe one instance

Deploy the probe, open browser developer tools, and record construction, connection, and first rendering. Increment the counter twice.

> **🔎 Check your understanding**
>
> Expected result: The same instance renders repeatedly.

### Step 2: Observe parent and child

Add a parent with conditional child rendering. Show and hide the child and compare the parent and child hook logs.

> **🔎 Check your understanding**
>
> Expected result: The observation distinguishes attachment from rendering.

### Step 3: Audit resources

If adding a window listener or subscription, retain the handler/reference and remove or release it when appropriate. Reopen the component and count callbacks.

> **🔎 Check your understanding**
>
> Expected result: One user action does not trigger duplicated listeners.

## 4. Failure cases and boundaries

Assigning a changing reactive field in every renderedCallback can produce an endless rerender cycle. Derive display values from state or guard genuinely one-time DOM setup appropriately.

An unhandled promise rejection requires a catch in the asynchronous path; adding an errorCallback to a parent is not a substitute for that handling.

> **⚠️ Watch out**
>
> Do not query a child's private DOM or assume a wire result arrives at a particular lifecycle hook.

## ⚡ Independent practice: Explain an observed lifecycle trace

Produce a parent-child trace and correct one deliberately introduced duplicate-resource or render-loop defect.

1. Capture initial and repeat renders.
2. Toggle the child.
3. Explain and fix the chosen defect.

### Your work is ready when

- Hook order is observed rather than invented.
- Repeated rendering is expected.
- No duplicated external listener remains after reopening.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does renderedCallback run only once?

**Answer:** No. It can run after each relevant render.

### 2. Why can connectedCallback repeat?

**Answer:** An instance can be disconnected and later inserted again.

### 3. Does errorCallback catch every async error?

**Answer:** No. Promise failures still need handling in their own asynchronous path.

## What to take away

- Separate construction, attachment, and rendering.
- Keep render callbacks free of uncontrolled state changes.
- Own and clean up external resources.

## Sources and further reading

- [LWC lifecycle hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-lifecycle-hooks.html)


---

# Wire, imperative Apex, and refreshing data

M22 · middle · About 50 minutes with practice

![A component and a data cache synchronising after one record update](https://sam-portal-production.up.railway.app/lesson-images/M22.jpg)

Separate reactive reads from explicit writes and refresh the cache that actually supplies the displayed data.

## Before you begin

- M21 lifecycle and asynchronous JavaScript.
- Apex security and a simple LWC using record inputs.

## What you will learn

- Use @api, @wire, and imperative calls for their distinct roles.
- Choose the correct refresh mechanism.
- Separate write failure from refresh failure.

## 1. Understand the mechanism

An @api property is part of a component's public input contract. A parent can pass the selected appointment ID, and the child should respond to changes without mutating the parent's object. @wire provisions data reactively from an adapter or cacheable Apex method. An imperative Apex call runs when your code explicitly invokes it, making it appropriate for a user-requested write.

A JavaScript Promise represents an operation that will settle later as fulfilled or rejected. An async method returns a Promise; await pauses that method’s continuation until the supplied Promise settles, without freezing the whole page. try/catch handles rejection from an awaited operation. This is why the save and refresh below have separate try blocks. A reactive wire parameter uses a dollar-prefixed property reference, such as status: "$status", so changing the component property requests data for the new input.

Apex methods used with @wire require cacheable=true and must not mutate data. Keep the emitted wire result, not just its data array, if it will later be passed to refreshApex. An imperative Apex result is not automatically managed by Lightning Data Service. Identify which mechanism owns each displayed value before choosing how to refresh it.

For an Apex wire, refreshApex refreshes that wired result. For LDS-backed records changed outside LDS, notifyRecordUpdateAvailable informs LDS about affected IDs. For a custom imperative read, call the read again and update local state. Do not assume one refresh function repairs every component or that a fixed cache duration can be relied upon.

Reactivity also needs clear state ownership. Reassigning a field to a new value is usually sufficient for ordinary updates; @track is not required on every property. It can help observe mutations within supported plain objects and arrays, but does not make every complex object deeply reactive. Prefer an understandable immutable update when it avoids ambiguous nested mutations.

> **💡 Key idea**
>
> Refresh the data source that owns the displayed value; saving a record and refreshing a view are separate operations.

## 2. Northstar Motors worked example

Anna confirms TD-A from a detail panel. The write succeeds, but the subsequent list refresh fails. Showing 'Save failed, try again' would encourage another write even though the appointment is already confirmed. Show a saved state with a separate 'Could not reload the list' message and offer to retry only the read.

The fragment below assumes a declared cacheable getVisits Apex method and a confirmVisit method that enforces the confirmation rule from M07. They are application methods you create, not built-in Salesforce APIs. The result object assigned in wiredVisits is what refreshApex needs. Adapt the names to your implemented controller rather than pasting unresolved imports.

> **🔎 Check your understanding**
>
> Which operation should the user repeat when the write succeeded but reloading failed?

**LWC controller fragment; requires your VisitController methods and template**

```javascript
@api status = 'Requested';
@wire(getVisits, { status: '$status' })
wiredVisits(result) {
    this.wiredResult = result;
    this.rows = result.data || [];
    this.loadError = result.error;
}
async confirmSelected() {
    if (this.saving) return;
    this.saving = true;
    this.saved = false;
    this.saveError = undefined;
    this.loadError = undefined;
    try {
        await confirmVisit({ recordId: this.selectedId });
        this.saved = true;
    } catch (error) {
        this.saveError = 'The appointment was not confirmed.';
        this.saving = false;
        return;
    }
    try {
        await refreshApex(this.wiredResult);
    } catch (error) {
        this.loadError = 'Saved, but the list could not be refreshed.';
    } finally {
        this.saving = false;
    }
}
```

## 3. Build and inspect

Use existing Test Drive fields. Implement a cacheable VisitController.getVisits(String status) using an allowed status filter, bounded results, and explicit user-mode access, plus a non-cacheable confirmVisit(Id recordId) enforcing M07. Grant the restricted user class access and required data permissions. Import api and wire from lwc, refreshApex from @salesforce/apex, and both controller methods. Add selectedId and the template/state declarations; the fragment is not a complete bundle.



### Step 1: Build the read path

Pass a selected record or filter through @api and connect a cacheable read. Show loading, empty, success, and error states distinctly.

> **🔎 Check your understanding**
>
> Expected result: Changing the public input produces the intended new read.

### Step 2: Add the explicit write

Call a non-cacheable mutation method on a user action. Disable accidental duplicate submission while waiting and preserve field-level/business validation errors safely.

> **🔎 Check your understanding**
>
> Expected result: A click has one controlled write result.

### Step 3: Test refresh ownership

Compare wired Apex, LDS, and imperative read scenarios. Simulate a write failure and a post-write refresh failure separately.

> **🔎 Check your understanding**
>
> Expected result: The interface offers the correct recovery for each case.

## 4. Failure cases and boundaries

Passing only an array to refreshApex loses the wire configuration it needs. Refresh the emitted result object.

A late response for selection A can overwrite selection B. Use a request identity or equivalent guard when managing imperative reads, and test rapid selection changes.

> **⚠️ Watch out**
>
> Do not mark a mutating method cacheable or treat notifyRecordUpdateAvailable as a general server-event bus.

## ⚡ Independent practice: Keep an appointment panel current

Implement a reactive read and explicit confirmation with separate save and refresh outcomes.

1. Verify input-driven reading.
2. Perform and validate the write.
3. Force refresh failure and retry only the read.

### Your work is ready when

- The correct refresh API matches each data source.
- A successful save is not reported as a failed save.
- Rapid input changes do not display the wrong record.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What must be passed to refreshApex?

**Answer:** A result previously emitted by an Apex wire, so its bound configuration can be refreshed.

### 2. When should LDS be notified?

**Answer:** When records it may cache change outside its own update mechanisms.

### 3. Is @track required for every field?

**Answer:** No. Ordinary reassignment is reactive; @track has a narrower role for supported nested mutations.

## What to take away

- Separate public input, reactive read, and explicit write.
- Refresh the owning source.
- Represent partial UI failure accurately.

## Sources and further reading

- [Apex result caching](https://developer.salesforce.com/docs/platform/lwc/guide/apex-result-caching.html)
- [LDS record update notification](https://developer.salesforce.com/docs/platform/lwc/guide/reference-notify-record-update.html)


---

# DOM events and Lightning Message Service

M23 · middle · About 50 minutes with practice

![Two sibling components using a shared message hub and one local parent-child arrow](https://sam-portal-production.up.railway.app/lesson-images/M23.jpg)

Choose a communication contract for related components and for independent regions of the same Lightning application.

## Before you begin

- M21 lifecycle and M22 data ownership.
- JavaScript events and component public inputs.

## What you will learn

- Use public properties down and events up a component tree.
- Use LMS for appropriate cross-DOM communication.
- Manage subscription scope and lifecycle.

## 1. Understand the mechanism

A child component should not reach into its parent's internal state. It can receive input through @api and announce an interaction through a DOM CustomEvent. The parent handles that event and decides what to do. This makes the child reusable: a visit row can announce a selected record without knowing whether the parent opens a panel, navigates, or updates a filter.

Lightning Message Service communicates across supported component regions in a Lightning page or application. It can connect components without a convenient common parent, including supported Aura or Visualforce integration points. A message channel defines the shared contract. LMS is a client-side application communication mechanism, not the server event bus used by Platform Events.

Keep messages small and meaningful. A selection message needs a recordId and perhaps an event type, not the entire customer record or a mutable object owned by another component. A subscriber should read current data through its authorized data source. Treat received IDs as input rather than proof that the user is allowed to access the record.

Choose subscription scope deliberately. Application-wide scope can deliver messages beyond the currently active region, which may be useful for a utility but surprising for a cached workspace component. Understand the component's lifetime, avoid duplicate subscriptions, and release resources appropriately. A hidden or cached component is not always equivalent to a destroyed component.

> **💡 Key idea**
>
> Use the narrowest communication boundary that matches the relationship between components.

## 2. Northstar Motors worked example

A Test Drive list contains individual row components. Each row dispatches visitselect with its ID; the list's parent manages selectedId and passes it into the detail component. No message service is necessary for that ordinary tree relationship.

Now add an independent warranty panel in another Lightning page region. It needs to react when the salesperson selects a different visit. Publish a small message on a new SAM_Visit_Selected__c message channel. The warranty panel subscribes and reloads authorized details, rather than trusting a payload containing customer and VIN information.

> **🔎 Check your understanding**
>
> Would publishing this message notify a separate backend integration that is not running in the Lightning application?

**Child event fragment; parent listens with onvisitselect**

```javascript
this.dispatchEvent(new CustomEvent('visitselect', {
    detail: { recordId: this.recordId }
}));
```

**Complete SAM_Visit_Selected.messageChannel-meta.xml declaration**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningMessageChannel xmlns="http://soap.sforce.com/2006/04/metadata">
    <masterLabel>SAM Visit Selected</masterLabel>
    <isExposed>true</isExposed>
    <description>Selected training appointment identifier.</description>
    <lightningMessageFields>
        <fieldName>recordId</fieldName>
        <description>Selected Test Drive ID.</description>
    </lightningMessageFields>
</LightningMessageChannel>
```

## 3. Build and inspect

Create the message-channel metadata under force-app/main/default/messageChannels. Its imported schema name includes __c. No new Salesforce object or field is required.



### Step 1: Build the parent-child path

Dispatch a narrow selection event and handle it in the parent. Keep input ownership in the parent and avoid mutating the passed record.

> **🔎 Check your understanding**
>
> Expected result: The child works without knowing its surrounding page layout.

### Step 2: Add the independent subscriber

Use lightning/messageService with the declared channel, a MessageContext, and a guarded subscription. Publish only recordId and reload details through the subscriber's data source.

> **🔎 Check your understanding**
>
> Expected result: The independent panel follows selection without sharing private DOM.

### Step 3: Test lifetime and scope

Open, close, and revisit the page or workspace. Compare the intended active-area behavior with application scope where supported, and count handler calls.

> **🔎 Check your understanding**
>
> Expected result: One published selection causes one intended update per active subscriber.

## 4. Failure cases and boundaries

An overly broad message can make unrelated components react and create difficult-to-trace loops. Define event names and which component is authoritative for selection.

Messages are not a durable record of business completion. If the user reloads the page, recover state from the appropriate data source rather than expecting old LMS messages to replay.

> **⚠️ Watch out**
>
> Do not describe LMS as a durable server-side event stream or as a replacement for authorization.

## ⚡ Independent practice: Connect a list and an independent panel

Demonstrate DOM events for one component tree and LMS for a separate panel.

1. Implement the narrow event contract.
2. Deploy the message channel and subscriber.
3. Test duplicate subscriptions and page lifetime.

### Your work is ready when

- Payloads contain only needed identifiers.
- DOM and LMS responsibilities are distinct.
- Scope and cleanup behavior are explained.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. When is a DOM event simpler?

**Answer:** When a child can communicate through its ordinary parent relationship.

### 2. Does LMS replace Platform Events?

**Answer:** No. They serve different client-application and server-integration boundaries.

### 3. Should the payload contain the whole customer?

**Answer:** Usually no. Send the minimal identity and let the subscriber read authorized current data.

## What to take away

- Prefer narrow contracts.
- Use LMS for the right boundary.
- Test scope and lifetime.

## Sources and further reading

- [Lightning Message Service](https://developer.salesforce.com/docs/platform/lwc/guide/use-message-channel.html)


---

# Accessible LWC states and Jest tests

M24 · middle · About 50 minutes with practice

![A clean accessible interface with a keyboard focus outline and a small automated test check](https://sam-portal-production.up.railway.app/lesson-images/M24.jpg)

Test what a user can understand and operate, including keyboard interaction, empty results, failed loading, and selection events.

## Before you begin

- M21–M23 component behavior and events.
- JavaScript promises and local development tools.

## What you will learn

- Define accessible loading, empty, success, and error states.
- Write isolated Jest tests for observable behavior.
- Explain what still requires a real org or browser.

## 1. Understand the mechanism

An accessible component communicates state and supports operation without relying only on a mouse or color. A spinner needs meaningful context, an error needs understandable text, and a selectable row needs a keyboard-operable control. Use appropriate Lightning base components and semantic HTML before inventing custom interaction patterns. A visually attractive card can still be unusable when focus disappears after an update.

Jest runs LWC unit tests locally. The tests create a component instance, supply controlled inputs or mocks, perform an interaction, and assert rendered output or dispatched events. They do not deploy to Salesforce or verify live object permissions. Mocking a successful Apex response does not prove that the actual Apex method returns that response for a restricted user.

Test the public behavior rather than private implementation details. If selecting a visit should dispatch visitselect with its recordId, assert that event. If an empty response should display a clear message, assert that message and the absence of false data rows. Avoid coupling the test to every nested DOM node inside a base component; those internals are not your component's contract.

LWC updates render asynchronously. After changing a property or resolving a mocked promise, allow the microtask work to complete before asserting the DOM. Clean up document.body and mock state between tests so a previous component does not influence the next one. A test that passes only when run after another test indicates hidden shared setup.

> **💡 Key idea**
>
> Test the behavior a user or parent component relies on, and keep the test's limitations visible.

## 2. Northstar Motors worked example

Anna opens an appointment list. While loading, she sees a contextual loading indication. If there are no appointments, she sees 'No test drives match this filter.' If loading fails, she receives a readable error and Retry control. Selecting TD-A with a keyboard-operable button dispatches its ID to the parent.

Create a visitCard component with a public recordId and a button labelled 'Select test drive'. Its handler dispatches visitselect with detail containing recordId, following M23. The complete test file below checks that public contract; the component itself is your small implementation task. This is a local UI test, not evidence of live Salesforce permissions.

> **🔎 Check your understanding**
>
> Which parts of this test would still pass even if the real user lacked Salesforce access?

**Complete visitCard/__tests__/visitCard.test.js; requires your c/visitCard component**

```javascript
import { createElement } from 'lwc';
import VisitCard from 'c/visitCard';

describe('c-visit-card', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });
    it('announces the selected appointment', () => {
        const element = createElement('c-visit-card', { is: VisitCard });
        element.recordId = 'a00000000000001AAA'; // local fixture only
        const selected = jest.fn();
        element.addEventListener('visitselect', selected);
        document.body.appendChild(element);
        element.shadowRoot.querySelector('lightning-button').click();
        expect(selected).toHaveBeenCalledTimes(1);
        expect(selected.mock.calls[0][0].detail.recordId).toBe(element.recordId);
    });
});
```

## 3. Build and inspect

Install a supported Node.js LTS version with npm, then check node --version and npm --version. Run the setup commands below from starter/salesforce, the directory containing sfdx-project.json, not the portal root. The Salesforce setup command installs the local Jest dependency and project configuration. Inspect the resulting package.json and lockfile and keep them with your learner project. Tests belong under force-app/main/default/lwc/visitCard/__tests__. Confirm .forceignore excludes **/__tests__/** so local tests are not deployed as component metadata.



**One-time setup and local execution from starter/salesforce**

```shell
node --version
npm --version
sf force lightning lwc test setup
npx sfdx-lwc-jest -- --runInBand
```

### Step 1: Specify four states

Write the visible text, available controls, and focus behavior for loading, empty, loaded, and failed states before implementation.

> **🔎 Check your understanding**
>
> Expected result: No state is represented by an unexplained blank area.

### Step 2: Write behavior tests

Mock data success, empty results, and rejection. Assert selection events, understandable error text, and Retry behavior after flushing asynchronous updates.

> **🔎 Check your understanding**
>
> Expected result: The tests detect a wrong event payload or missing recovery control.

### Step 3: Check actual interaction

Use keyboard-only navigation in the training Lightning page. Verify labels, focus order, visible focus, and state announcements where applicable.

> **🔎 Check your understanding**
>
> Expected result: Local unit tests are complemented by real interaction evidence.

## 4. Failure cases and boundaries

A test that only compares a snapshot can miss a broken interaction. Include a concrete user action and expected event or state transition.

An icon without an accessible name may look obvious to a sighted mouse user but be meaningless to assistive technology. Do not use color alone to distinguish success from failure.

> **⚠️ Watch out**
>
> Jest mocks do not verify real Apex execution, Salesforce security, browser layout, or complete accessibility.

## ⚡ Independent practice: Test a usable appointment selector

Build the four UI states and verify selection and recovery behavior.

1. Create explicit state descriptions.
2. Add isolated Jest tests.
3. Record a keyboard-only check in the org.

### Your work is ready when

- Tests pass independently with cleanup.
- Event payload and error recovery are asserted.
- Keyboard access and readable labels are demonstrated.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why flush asynchronous updates?

**Answer:** Property and promise changes may not have reached the rendered DOM when the immediate assertion runs.

### 2. What should a selection test assert?

**Answer:** The public event and intended record ID, not unrelated private implementation details.

### 3. Why still test in the org?

**Answer:** Jest does not establish live permissions, actual Apex results, integration, or complete browser accessibility.

## What to take away

- Design meaningful states.
- Test public behavior.
- Combine unit and real-user checks.

## Sources and further reading

- [Writing LWC Jest tests](https://developer.salesforce.com/docs/platform/lwc/guide/unit-testing-using-jest-create-tests.html)
- [Install LWC Jest](https://developer.salesforce.com/docs/platform/lwc/guide/unit-testing-using-jest-installation.html)


---

# Shadow DOM and component boundaries

M25 · middle · About 50 minutes with practice

![A component's internal structure enclosed in a clear boundary within a larger page](https://sam-portal-production.up.railway.app/lesson-images/M25.jpg)

Keep DOM, styling, and event contracts inside their intended boundaries and understand the implications for optional legacy migration.

## Before you begin

- M21 lifecycle.
- M23 events and M24 behavior tests.

## What you will learn

- Query only DOM owned by the component.
- Explain CSS scope and event retargeting.
- Preserve public contracts when replacing a legacy component.

## 1. Understand the mechanism

Shadow DOM defines an encapsulated internal tree for a component. The component's markup is not a public collection of elements for unrelated code to manipulate. LWC's platform implementation can differ between supported rendering modes and releases, but the design principle remains: interact through public properties, methods, events, and supported styling mechanisms rather than depending on another component's private DOM.

Within a shadow-rendered LWC, this.template.querySelector accesses elements owned by that component. A document-level selector is not the correct way to find a child's private input. Timing matters too: an element may not exist before rendering or while a conditional template branch is absent. A null query result can be expected state, not a reason to bypass encapsulation.

CSS scope prevents a parent's ordinary stylesheet from freely styling a child's internal elements. Use a declared styling hook or a public presentation option when supported. Forcing a selector through implementation-generated attributes couples the application to details that may change. If you need a different child appearance, expose a deliberate contract rather than searching for a clever global selector.

Events can cross component boundaries according to their propagation configuration. Retargeting makes the observed target appropriate to the listener's scope, protecting internal details. A parent should consume the event's documented detail payload, not assume event.target identifies the exact private button deep inside the child. Broad bubbling and composed settings expand the public event surface and should be used intentionally.

> **💡 Key idea**
>
> A component's internal markup is an implementation detail; its public contract is the integration boundary.

## 2. Northstar Motors worked example

Northstar's visitCard contains an internal button. Its parent needs the selected Test Drive ID, not access to the button element. The child dispatches visitselect with that ID, and the parent updates its selected record. Later, the child changes the button to a different accessible control. The parent should continue to work because the event contract has not changed.

For an optional Aura migration, write down the legacy component's page inputs, output events, navigation behavior, and required styling before replacing it. Move a small boundary at a time and test supported coexistence. The core lesson is complete without owning or building an Aura component; migration is an extension, not an assumed prerequisite.

> **🔎 Check your understanding**
>
> What should the parent know if the child's internal button markup changes?

**Owned-element access fragment after the relevant template has rendered**

```javascript
const retryButton = this.template.querySelector('[data-id="retry"]');
if (retryButton) {
    retryButton.focus();
}
// The matching data-id belongs to this component's own template.
// Do not replace this with a selector into another component's internals.
```

## 3. Build and inspect

Create two small LWC components with their own templates and styles. Use the existing visit-selection event contract. No Salesforce schema changes are required.



### Step 1: Observe ownership

Add an element marked data-id in the child. Query it from the child after rendering, then compare the parent's attempt to query its own template.

> **🔎 Check your understanding**
>
> Expected result: The parent does not rely on the child's private internal element.

### Step 2: Compare styling and events

Apply a parent paragraph style and a separate child style. Dispatch a documented event and inspect the listener's target and detail at each boundary.

> **🔎 Check your understanding**
>
> Expected result: The explanation separates styling scope, event payload, and retargeting.

### Step 3: Preserve the contract

Change the child's internal layout while retaining its public input and selection event. Run the parent behavior tests and keyboard check.

> **🔎 Check your understanding**
>
> Expected result: The parent still works without selector repairs.

## 4. Failure cases and boundaries

A test can accidentally reach into private DOM more aggressively than production code should. Unit inspection of a component's own shadow root is useful, but parent integration should still assert public contracts.

Making every event composed and bubbling can create collisions or expose internal interactions. Choose the narrowest propagation needed for the intended consumer.

> **⚠️ Watch out**
>
> Do not build cross-component behavior around undocumented DOM attributes or selectors that pierce another component's internals.

## ⚡ Independent practice: Demonstrate an encapsulated component pair

Show owned queries, scoped styles, and a stable public event contract.

1. Build the two components.
2. Record ownership and propagation observations.
3. Change child markup and rerun parent tests.

### Your work is ready when

- No private child DOM is accessed by the parent.
- The event detail carries the required business identity.
- Optional Aura work is labeled separately.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why can a global selector fail?

**Answer:** The desired element may be inside an encapsulated component tree rather than the document's accessible query scope.

### 2. What is retargeting for?

**Answer:** It exposes an event target appropriate to the listener's scope instead of leaking private internal elements.

### 3. How should a parent survive markup changes?

**Answer:** By depending on documented public properties and events rather than child selectors.

## What to take away

- Respect DOM ownership.
- Use supported styling contracts.
- Expose narrow, stable events.

## Sources and further reading

- [LWC Shadow DOM](https://developer.salesforce.com/docs/platform/lwc/guide/create-dom.html)


---

# Platform Events and publication timing

M26 · middle · About 50 minutes with practice

![A small event envelope published after a transaction boundary to two subscribers](https://sam-portal-production.up.railway.app/lesson-images/M26.jpg)

Publish a business fact with a deliberate relationship to commit, and verify the subscriber independently from the publisher.

## Before you begin

- M08 transactions and idempotency.
- M11 async choices and M19 diagnostic identities.

## What you will learn

- Distinguish a fact from a command.
- Compare Publish After Commit and Publish Immediately.
- Avoid treating publish acceptance as subscriber success.

## 1. Understand the mechanism

A Platform Event is a message on Salesforce's event infrastructure. A producer publishes it, and subscribers react independently. 'Test drive confirmed' describes a business fact; 'confirm this test drive' requests an action. Naming the intent matters because a subscriber should know whether it can trust the referenced change as committed or is being asked to perform it.

Publish After Commit ties publication to successful completion of the producing transaction. This is a natural choice for a message announcing a saved confirmation. Publish Immediately decouples publication from the transaction's final outcome, so a subscriber may observe the event before related data commits or even when the producer later rolls back. That behavior can be useful for specific diagnostics but is not interchangeable with a committed business fact.

The initial publish result reports acceptance for publication, not proof that the event reached every subscriber or that subscriber business work completed. Publishing itself is asynchronous and can fail after acceptance. A subscriber also has its own execution and error behavior. Model these stages separately in your status and diagnostics rather than returning a final business success from the publish call.

Events can be duplicated. A durable business key lets a subscriber avoid a second business effect even when the same operation is delivered again or republished under another event identity. That protection must be coordinated with the subscriber's output: do not mark an event handled before the intended result has been safely committed.

> **💡 Key idea**
>
> Commit, publication, delivery, and subscriber completion are separate milestones.

## 2. Northstar Motors worked example

Create Test_Drive_Confirmed__e with Test_Drive_Id__c Text(18) and Business_Key__c Text(100). Choose Publish After Commit. These are new Platform Event metadata fields, not ordinary Test Drive fields. Publish the appointment ID and a stable confirmation key; do not include Irina's email, phone, or unnecessary customer details.

Use Confirmation_Receipt__c from M08 as the subscriber's demonstration output. Its unique Operation_Key__c stores the business key. A repeated event should leave one receipt. In a separate event definition or controlled comparison, explore Publish Immediately and a producer rollback. The comparison must state the configured behavior and avoid presenting a unit-test event delivery as an external integration proof.

> **🔎 Check your understanding**
>
> What additional evidence is needed after accepted.isSuccess returns true?

**Publisher fragment; event metadata and a valid visitId must already exist**

```apex
Test_Drive_Confirmed__e eventMessage = new Test_Drive_Confirmed__e(
    Test_Drive_Id__c = String.valueOf(visitId),
    Business_Key__c = 'confirm:' + String.valueOf(visitId)
);
Database.SaveResult accepted = EventBus.publish(eventMessage);
System.assert(accepted.isSuccess(), 'Inspect publication-request errors');
// This assertion does not prove delivery or subscriber completion.
```

## 3. Build and inspect

Create the event metadata and verify its publish behavior. Use the receipt schema from M08 or explicitly define an equivalent unique-key output. Configure subscriber-user permissions deliberately.

In the isolated event exercise, remove or disable M08’s direct receipt-creation path so only the subscriber owns the effect. Use a fresh appointment/key and assert zero receipts before publication, one after delivery, and still one after redelivery. Otherwise a receipt created earlier by synchronous automation can make a broken subscriber appear correct. Configure and record the actual subscriber running identity; an event trigger does not automatically run as Anna.



### Step 1: Implement the producer boundary

Publish only for the defined confirmation event, with minimal payload and a stable business key. Record the initial acceptance result separately.

> **🔎 Check your understanding**
>
> Expected result: No unrelated update is announced as a new business confirmation.

### Step 2: Implement the subscriber result

Validate the payload, read authorized required data, and reconcile the unique-key receipt in the subscriber transaction. Preserve errors for investigation.

> **🔎 Check your understanding**
>
> Expected result: A duplicate does not create a second receipt.

### Step 3: Test commit and rollback

Test publisher behavior, subscriber delivery with supported Test.getEventBus().deliver calls, and an independently observed training run. Compare rollback under the selected settings.

> **🔎 Check your understanding**
>
> Expected result: Evidence names which stage and environment was actually verified.

## 4. Failure cases and boundaries

A subscriber cannot safely assume that a Publish Immediately event's referenced record is already committed. Retrying reads indefinitely is not a substitute for choosing the correct publication semantics.

A single transaction-local set does not provide durable deduplication. Re-delivery in a later transaction requires a persistent operation identity.

> **⚠️ Watch out**
>
> Do not describe EventBus.publish success as successful processing by all subscribers.

## ⚡ Independent practice: Publish and consume a confirmation fact

Create a minimal event path with explicit commit behavior and a duplicate-safe receipt.

1. Create the event schema.
2. Publish and inspect acceptance.
3. Test duplicate handling and rollback separately.

### Your work is ready when

- Payload contains no unnecessary customer data.
- Publication timing is stated and checked.
- The receipt remains unique across repeated delivery.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why prefer After Commit for this fact?

**Answer:** The message should describe a confirmation that actually committed.

### 2. Does a successful publish return prove processing?

**Answer:** No. Publication acceptance and subscriber completion are separate stages.

### 3. Why use a business key as well as an event identity?

**Answer:** The same business operation can be republished as a new event and still must not create a second effect.

## What to take away

- Name the event's meaning.
- Choose the commit relationship.
- Verify subscriber outcomes separately.

## Sources and further reading

- [Decoupled publishing](https://developer.salesforce.com/docs/platform/platform-events/guide/platform-events-considerations-decoupled-processes.html)
- [Platform Event considerations](https://developer.salesforce.com/docs/platform/platform-events/guide/platform-events-considerations.html)
- [Delivering test events](https://developer.salesforce.com/docs/platform/platform-events/guide/platform-events-test-deliver.html)


---

# Change Data Capture, replay, and duplicate delivery

M27 · middle · About 50 minutes with practice

![A stream of record changes with a replay bookmark and a duplicate-handling gate](https://sam-portal-production.up.railway.app/lesson-images/M27.jpg)

Choose a record-change stream or business event and recover from disconnection without treating replay IDs as permanent business identities.

## Before you begin

- M26 producer, subscriber, and durable deduplication.
- M18 entity and operation identity.

## What you will learn

- Distinguish CDC from a custom business event.
- Explain replay and retention boundaries.
- Apply repeat-safe consumption to a provided event trace.

## 1. Understand the mechanism

Change Data Capture describes supported changes to Salesforce records. A custom Platform Event describes a business message chosen by your application. If a downstream system needs a replica of selected record changes, CDC may fit. If it needs the explicit fact that a test drive confirmation was accepted under a particular rule, a custom business event can provide a clearer contract than interpreting every field update.

Replay lets a subscriber resume from a previously recorded position within the available event retention window. The replay ID is a stream position token, not a VIN, request ID, or universal permanent event identity. Do not generate it, increment it, or assume it is a consecutive sequence. Store the value supplied by the platform using the subscription mechanism's documented format.

Current documentation describes a 72-hour retention window for Platform Events and CDC events, but recovery planning should always check current product guarantees and maintenance limitations. A consumer offline beyond available retention cannot assume replay will reconstruct every missed change. It needs reconciliation, such as a controlled data comparison or snapshot followed by a coordinated restart.

Durable processing coordinates the business effect, deduplication record, and checkpoint. If the checkpoint advances before the effect is saved, a restart can skip work. If the effect commits but the checkpoint does not, replay can repeat it. A repeat-safe operation handles that latter case without a second unwanted effect. Exactly-once business outcomes require deliberate design, not a slogan about event-driven architecture.

> **💡 Key idea**
>
> A replay position helps resume delivery; a business identity helps avoid repeated effects.

## 2. Northstar Motors worked example

Analyze the provided trace: event E1 with business key confirm:A is processed; E2 with confirm:B is processed but the checkpoint write fails; the connection drops; after reconnect E2 is delivered again, followed by E3 with confirm:C. A correct receipt consumer ends with A, B, and C once each. The repeated delivery is expected recovery behavior, not evidence that the system is broken.

For CDC, inspect the documented ChangeEventHeader fields and the affected record IDs. A change event can represent more than the one-record mental model. Define how your consumer identifies a change or converges the destination state. Do not blindly apply the custom Platform Event's EventUuid rule to a different event schema without checking its documented identity fields.

> **🔎 Check your understanding**
>
> Why should the replay of confirm:B be safe even though its first effect already committed?

**Provided simulation trace; opaque replay tokens are illustrative, not arithmetic IDs**

```text
deliver token=qA  businessKey=confirm:A  effect=saved  checkpoint=saved
 deliver token=rZ  businessKey=confirm:B  effect=saved  checkpoint=failed
connection lost
resume from stored token=qA
 deliver token=rZ  businessKey=confirm:B  effect=already present
 deliver token=tM  businessKey=confirm:C  effect=saved  checkpoint=saved
```

## 3. Build and inspect

The trace analysis is mandatory and requires no paid product or external subscriber. A live CDC subscription is optional when your org supports the selected object and you have an appropriate client; label it separately.



### Step 1: Choose the message contract

Compare a Vehicle record synchronization requirement with a Test Drive confirmation notification. Select CDC or a custom event for each and explain the consumer's required information.

> **🔎 Check your understanding**
>
> Expected result: The selection follows the meaning of the data, not fashion.

### Step 2: Process the supplied trace

Maintain a table of durable receipts and checkpoint state after each line. Repeat the exercise with a crash before the effect is saved.

> **🔎 Check your understanding**
>
> Expected result: Neither crash point loses a required result or creates a duplicate effect.

### Step 3: Plan retention-gap recovery

Describe what happens after a gap beyond available retention. Identify the authoritative source, reconciliation window, and how to avoid applying an older update over a newer state.

> **🔎 Check your understanding**
>
> Expected result: Recovery does not depend on unavailable historical messages.

## 4. Failure cases and boundaries

Checkpointing receipt of a message before committing its effect can lose work. Advancing the position should follow the consumer's safe processing policy.

Out-of-order business updates or stale replay can overwrite newer state if the destination uses no version or convergence rule. State the ordering assumptions and validate them against the chosen channel.

> **⚠️ Watch out**
>
> Do not use replay ID as a permanent business primary key or promise exactly-once delivery.

## ⚡ Independent practice: Recover a disconnected consumer

Analyze the supplied trace and design both short-disconnection and retention-gap recovery.

1. Choose event type for two requirements.
2. Track effects and checkpoints line by line.
3. Write the reconciliation procedure.

### Your work is ready when

- The duplicate produces one effect.
- Replay tokens are treated as opaque.
- Beyond-retention recovery is defined.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What does CDC communicate?

**Answer:** Changes to supported Salesforce records, with a platform-defined change-event schema.

### 2. Why can a processed event appear again?

**Answer:** Its effect may have committed before the consumer's checkpoint, so replay safely redelivers it.

### 3. What if retention has expired?

**Answer:** Use a defined reconciliation or snapshot strategy; unavailable events cannot be recovered by inventing a replay token.

## What to take away

- Choose the right message meaning.
- Coordinate effects and checkpoints.
- Design for duplicates and retention gaps.

## Sources and further reading

- [CDC delivery](https://developer.salesforce.com/docs/platform/change-data-capture/guide/cdc-subscribe-delivery.html)
- [Event durability and retention](https://developer.salesforce.com/docs/platform/pub-sub-api/guide/event-message-durability.html)


---

# Git fetch, integration, and cherry-picking a fix

M28 · middle · About 50 minutes with practice

![A clean branching history with one small fix moved carefully to another branch](https://sam-portal-production.up.railway.app/lesson-images/M28.jpg)

Explain the state changed by common Git operations and transfer one focused correction without losing unrelated work.

## Before you begin

- Setup guide: personal repository, branches, commits, and PRs.
- A clean training copy with no uncommitted customer work.

## What you will learn

- Distinguish working tree, staging, local branch, and remote-tracking refs.
- Explain fetch versus pull.
- Resolve and verify a controlled cherry-pick conflict.

## 1. Understand the mechanism

The working tree contains the files currently checked out. The index, often called staging, records the content prepared for the next commit. A local branch points to a commit in your repository. A remote-tracking reference such as origin/main records the last fetched state of the remote branch; it is not a live view that updates itself whenever someone pushes.

git fetch downloads objects and updates the relevant remote-tracking references without automatically integrating them into your current branch. git pull performs a fetch followed by an integration strategy, such as merge or rebase, according to options and configuration. Before pulling, know which branch you are on, whether the working tree is clean, and which integration behavior is intended.

Cherry-pick applies the change introduced by a selected commit onto the current branch, creating a new commit when successful. It is useful for moving one focused fix without bringing an entire feature branch. The new commit has different ancestry and normally a different identity. A later merge can therefore encounter related changes; cherry-pick is not a magic link that makes histories identical.

Conflicts mean Git cannot decide how overlapping edits should combine. Resolve the business meaning, not merely the conflict markers. If two branches change the warranty timeout and its explanation, keeping both lines may create contradictory policy. Inspect the final file, run the relevant checks, and continue the operation only when the intended result is clear.

> **💡 Key idea**
>
> Git operations change specific layers of repository state; inspect those layers before integrating history.

## 2. Northstar Motors worked example

In your personal training copy, create notes/warranty-contract.md with a short fictional timeout policy and commit it. On a hotfix branch, correct one incorrect timeout explanation. On a feature branch, edit the same paragraph while adding unrelated notes. Cherry-picking the hotfix onto the feature branch gives a controlled conflict that contains no production code.

Draw the original main commit, feature commit, and hotfix commit before running the operation. After resolution, draw the new cherry-picked commit on the feature branch. Explain why the hotfix branch's original commit still exists and why the feature branch's new commit is not the same object.

> **🔎 Check your understanding**
>
> After fetch, which pointer may change even though your checked-out files remain unchanged?

**Inspection and integration commands in your personal training copy; replace the commit placeholder**

```shell
git status
git fetch origin
git log --oneline --graph --decorate --all -12
git diff main..origin/main
git switch practice/feature
git cherry-pick <observed-hotfix-commit-id>
# If conflicted: edit the intended final content, then:
git add notes/warranty-contract.md
git cherry-pick --continue
# To abandon this in-progress cherry-pick instead:
# git cherry-pick --abort
```

## 3. Build and inspect

Create the practice branches and file explicitly in your own repository. Replace placeholders using the observed log. Do not run these commands blindly in a checkout containing unrelated unfinished work.



### Step 1: Record the initial state

Inspect status and the branch graph. Note the current branch, staged files, working changes, and origin/main before fetching.

> **🔎 Check your understanding**
>
> Expected result: You can identify what is local and what is last-known remote state.

### Step 2: Observe fetch separately

Fetch, inspect the graph again, and compare local main with origin/main before choosing merge or rebase. Explain what pull would additionally do under your configuration.

> **🔎 Check your understanding**
>
> Expected result: No automatic integration is mistaken for part of fetch.

### Step 3: Transfer and resolve the fix

Cherry-pick the focused hotfix into the practice feature branch, resolve its intended meaning, and inspect the resulting diff and history.

> **🔎 Check your understanding**
>
> Expected result: Only the intended fix and known conflict resolution are added.

## 4. Failure cases and boundaries

A destructive reset can erase uncommitted or unshared work. It is unnecessary for this exercise; use the operation's abort mechanism when you need to return from an unresolved cherry-pick.

A clean merge or cherry-pick is not proof that the application is correct. Git resolves text and history, not warranty business rules.

> **⚠️ Watch out**
>
> Do not force-push or reset a shared branch merely to make the graph look tidy.

## ⚡ Independent practice: Transfer one warranty correction

Create the controlled branch experiment and explain each state transition.

1. Draw the initial graph.
2. Observe fetch without integration.
3. Resolve the cherry-pick and verify the final file.

### Your work is ready when

- Working tree, index, branch, and remote-tracking state are distinguished.
- The selected commit is identified from real history.
- The final content is coherent and unrelated changes are preserved.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does fetch update your current files?

**Answer:** It does not automatically integrate the fetched history into the checked-out branch.

### 2. What does pull add?

**Answer:** It integrates fetched changes using the selected or configured merge/rebase behavior.

### 3. Why does cherry-pick create a new commit?

**Answer:** It applies an existing change onto a different history position rather than moving the original commit object.

## What to take away

- Inspect state before history changes.
- Separate fetching from integration.
- Verify meaning after conflict resolution.

## Sources and further reading

- [Git fetch](https://git-scm.com/docs/git-fetch)
- [Git pull](https://git-scm.com/docs/git-pull)
- [Git cherry-pick](https://git-scm.com/docs/git-cherry-pick)


---

# Pull requests, CI checks, and controlled deployment

M29 · middle · About 50 minutes with practice

![A reviewed code card passing through tests and validation toward a deployment box](https://sam-portal-production.up.railway.app/lesson-images/M29.jpg)

Prepare a reviewable change with truthful validation, metadata dependencies, explicit target environment, and recovery steps.

## Before you begin

- M28 Git state and focused changes.
- Setup guide deployment and M10/M24 tests.

## What you will learn

- Distinguish repository checks, org validation, deployment, and smoke testing.
- Describe dependencies and permission changes.
- Plan recovery beyond reverting source files.

## 1. Understand the mechanism

A pull request is a review boundary: it presents a proposed change, its reason, and evidence that helps another person assess it. A useful description begins with a concrete trigger and resulting behavior. For Northstar, 'repeated warranty submissions now return the existing request' is more informative than a list of files or a claim that the integration was improved.

Continuous integration runs repeatable checks when code changes. Formatting, static analysis, local JavaScript tests, and metadata structure checks can run without a Salesforce org. Apex execution and deployment validation require an appropriate org and authentication. State which checks actually ran. A green repository workflow does not mean Apex passed if no org was connected.

A deployment plan includes the complete dependency set: custom fields, objects, permission sets, classes, Flow versions, configuration records, and any post-deploy activation or data preparation. Credentials require secure provisioning outside source code. Validate the selected package against the intended environment and make the target explicit; a default alias is not a sufficient safeguard against using the wrong org.

Review, validation, deployment, and smoke testing answer different questions. Review examines design and risks; validation checks deployability and selected tests; deployment changes the target; smoke testing verifies a small real user path afterward. The recovery plan must distinguish code rollback from data repair and external effects. Reverting a commit does not cancel a request already sent to another system.

> **💡 Key idea**
>
> Each green check proves a particular property; name that property and do not claim more.

## 2. Northstar Motors worked example

Prepare a PR for the M18 duplicate-request correction. Include the unique key field if it is new, the service changes, tests, and any permission changes. Describe the before/after case: the same key delivered three times previously created repeated work; now it returns one existing request, while conflicting payload reuse is rejected.

Your release checklist should identify a target training org, expected validation command, required secret provisioning, activation order, and one restricted-user smoke test. If only local checks are available, mark org validation Not run rather than fabricating a passed result. This still creates a reviewable artifact and clearly identifies the remaining gate.

> **🔎 Check your understanding**
>
> Which evidence proves the restricted user can use the deployed feature, rather than merely that the metadata parsed?

**Review evidence checklist, not an automatically executed pipeline**

```text
Change: repeated WARRANTY-100 returns the existing request
Local checks: command + observed result
Apex tests: org alias + test names + observed result, or Not run
Dependencies: object/field/permission/Flow configuration
Deploy target: explicitly named training org
Smoke test: restricted user + repeat request + expected record count
Recovery: source rollback, data repair, and external-effect handling
```

## 3. Build and inspect

Use a PR inside your personal training repository or the approved submission workflow. Do not put Salesforce tokens in the PR, repository files, screenshots, or untrusted pull-request workflow environments.



### Step 1: Create a focused PR

Inspect the complete diff and remove unrelated metadata. Write the problem, behavior, validation, dependencies, and limitations.

> **🔎 Check your understanding**
>
> Expected result: A reviewer can understand the change without reading the entire chat history.

### Step 2: Run appropriate checks

Execute available local tests and, when an authorized training org is connected, the selected org validation/tests. Record commands, target, and actual outcome.

> **🔎 Check your understanding**
>
> Expected result: Every reported result is tied to a real execution.

### Step 3: Plan deployment and recovery

Order schema, code, permissions, activation, and data preparation as needed. Define stop conditions and a post-deploy user smoke test.

> **🔎 Check your understanding**
>
> Expected result: The plan covers failure after deployment as well as before it.

## 4. Failure cases and boundaries

A CI workflow that exposes deployment credentials to untrusted code can turn review into an unintended privileged operation. Keep validation identities and execution boundaries deliberate.

A successful deploy can still leave a Flow inactive or a user without a needed permission. These post-deploy conditions belong in the checklist and smoke test.

> **⚠️ Watch out**
>
> Do not equate a reverted Git commit with reversal of data migrations or external side effects.

## ⚡ Independent practice: Prepare a reviewable release

Create a focused PR and release checklist for one completed Middle feature.

1. Explain the before/after behavior.
2. Attach actual check results and dependencies.
3. Write deployment, smoke, and recovery steps.

### Your work is ready when

- No check is marked passed without evidence.
- Target org and permissions are explicit.
- Recovery includes data and external effects where relevant.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What does a local Jest pass prove?

**Answer:** The mocked component behavior covered by those tests, not live Apex or org permissions.

### 2. Why list metadata dependencies?

**Answer:** A class or Flow may work in the development org only because undeclared fields or configuration already exist there.

### 3. What may require forward repair?

**Answer:** Data changes or external actions that a source rollback cannot automatically undo.

## What to take away

- Keep the PR focused.
- State what was actually validated.
- Plan the complete change lifecycle.

## Sources and further reading

- [Creating a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request)
- [Salesforce deployment command](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project_deploy_start.html)


---

# Verifying an application under failure

M30 · middle · About 50 minutes with practice

![A feature workflow with one intentionally interrupted connection and a visible recovery route](https://sam-portal-production.up.railway.app/lesson-images/M30.jpg)

Test the complete path from user action through background work and mocked provider response to the final visible result.

## Before you begin

- M12 and M17–M19 warranty flow.
- M22 UI state and M29 release evidence.

## What you will learn

- Define end-to-end outcomes for several failure modes.
- Trace one request across all components.
- Decide readiness from evidence rather than a happy-path demo.

## 1. Understand the mechanism

A feature can have passing unit tests in every layer while its combined path fails. The LWC may submit the wrong key, the service may enqueue work twice, or the worker may save a result that the UI never reloads. End-to-end verification follows the actual user intention across boundaries and checks the final business state, not merely each method's isolated return value.

For Northstar, the path is Anna's request, authorized vehicle lookup, durable warranty request, background attempt, provider classification, persisted outcome, and visible UI state. The provider can remain mocked for the required course exercise. Clearly label that boundary: the test verifies your application against controlled responses, not real provider authentication, network behavior, or production throughput.

Use a scenario matrix with initial data, identity, action, injected condition, expected state, expected user message, and evidence. Include success, valid negative answer, transport error, duplicate request, missing access, and bulk input. The same 'no exception' assertion cannot prove all of these. Some correct outcomes are refusals or unchanged records rather than successful writes.

Failures between stages deserve special attention. The provider result may be obtained but local persistence may fail; the write may succeed while UI refresh fails; a job may be accepted but delayed. Define how these incomplete states are detected and recovered. A visible Unknown or Pending state with a clear next action is more honest than a premature success message.

> **💡 Key idea**
>
> Readiness is a set of demonstrated outcomes and known limits, not a single successful conversation or click.

## 2. Northstar Motors worked example

Run WARRANTY-200 with a mock 200 covered=true response and verify one request, one appropriate attempt, and a visible completed result. Repeat the same key: the business result must remain singular. Then deny Anna access to the vehicle and try a new key. No privileged workaround should quietly create work on her behalf.

Next, make the UI refresh fail after the request is successfully accepted or completed. The interface should preserve the known operation status and offer to reload, not tell Anna to submit another request. This cross-layer case often reveals a defect that neither an Apex unit test nor a purely rendered LWC test catches alone.

> **🔎 Check your understanding**
>
> Which final record and user-visible state prove that each scenario behaved correctly?

## 3. Build and inspect

Use the schema and implementations from prior lessons. Test only synthetic data in a training org. When an org or restricted-user license is unavailable, label simulated or unexecuted checks rather than treating them as equivalent evidence.

HttpCalloutMock and Test.setMock operate in Apex test context; they do not intercept an ordinary browser-triggered callout. Separate three kinds of evidence: Apex tests with controlled HTTP mocks; LWC Jest tests with controlled Apex responses; and a real training-org UI run using M12’s explicitly labelled local deterministic demo adapter. For that last path, select the demo adapter through controlled training configuration, never from an untrusted browser flag; do not send the .invalid endpoint. A real end-to-end HTTP run needs a separately owned test endpoint and credential setup. Do not combine these observations into a claim that the test mock ran behind the live screen.



### Step 1: Build the scenario matrix

Write at least six scenarios before running them, including a denied operation and a repeated request. State exact expected counts and terminal or pending states.

> **🔎 Check your understanding**
>
> Expected result: The expected result can be evaluated without interpretation after the fact.

### Step 2: Trace the whole path

Record request key, attempt number, job ID, result category, persisted state, and UI state. Use the correlation approach from M19.

> **🔎 Check your understanding**
>
> Expected result: One user action can be followed across every relevant boundary.

### Step 3: Investigate one unexpected result

Choose a failing scenario, isolate the broken boundary, fix the smallest responsible layer, and rerun the affected scenario plus its regression checks.

> **🔎 Check your understanding**
>
> Expected result: The evidence shows cause, correction, and preserved neighboring behavior.

## 4. Failure cases and boundaries

Deleting logs and recreating data until the demo looks clean removes the information needed to understand the failure. Keep a small sanitized record of the original defect and the correction.

Testing only as the administrator can produce a complete-looking path that no salesperson can actually use. Include the real restricted persona or mark that test explicitly outstanding.

> **⚠️ Watch out**
>
> A mocked provider and a small dataset do not establish production integration compatibility or large-volume performance.

## ⚡ Independent practice: Create a release-readiness evidence pack

Verify the integrated feature with controlled failures and one repaired defect.

1. Run the scenario matrix.
2. Attach correlated evidence.
3. Explain the remaining unverified boundaries and release decision.

### Your work is ready when

- Duplicate and denied-access cases are included.
- UI messages match persisted outcomes.
- No unexecuted check is reported as successful.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why can isolated tests all pass while the feature fails?

**Answer:** The connections and assumptions between layers may be wrong even when each unit behaves correctly with its mocks.

### 2. What does the mock boundary leave unverified?

**Answer:** Real credentials, provider compatibility, actual network conditions, and other live integration properties.

### 3. What is useful evidence of a fix?

**Answer:** The original failure, its identified cause, the changed behavior, and relevant regression results.

## What to take away

- Trace the full business intention.
- Test incomplete and denied outcomes.
- State the remaining limits honestly.

## Sources and further reading

- [Integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Asynchronous processing](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)
- [HTTP mock behavior in test context](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-restful-http-testing-httpcalloutmock.html)


---

# Enhanced Omni-Channel routing

M31 · middle · About 50 minutes with practice

![Two customer work cards routed through an availability hub to two drawn support staff](https://sam-portal-production.up.railway.app/lesson-images/M31.jpg)

Explain how queued service work becomes eligible for a person based on presence, capacity, and routing configuration, with a complete no-license simulation path.

## Before you begin

- Standard Case records and queues.
- M01 access requirements and M30 observable outcomes.

## What you will learn

- Distinguish ownership assignment from active work routing.
- Evaluate presence and capacity using a concrete trace.
- Separate a simulated clinic from an optional live product lab.

## 1. Understand the mechanism

A Case records a customer's service issue. A queue groups work that a team can handle. An assignment rule can place a Case with an owner or queue, but that is not the same as deciding which available employee should receive the next item. Omni-Channel adds routing behavior based on configured eligibility, workload, priority, and, when used, skills.

Presence describes whether a person is available for the relevant work. Capacity describes how much work the configuration allows them to handle. A work item consumes capacity according to the chosen model. Queue membership alone does not prove that a person is currently eligible: they may be offline, at capacity, missing a needed skill, or unavailable for the relevant service channel.

Use current Enhanced Omni-Channel documentation rather than building a new learning path around retired Standard Omni-Channel instructions. The product and its available channels depend on edition, licenses, and org configuration. This clinic's mandatory path is the supplied routing simulation. A live setup is optional in a suitably entitled training org and must not be required to complete the core Middle project.

Omni-Channel and OmniStudio are different things. Omni-Channel routes service work; OmniStudio provides tools for guided interactions and related integration/data experiences. Similar names do not make them interchangeable. The useful interview answer explains the business operation and the configured routing stages rather than listing both products together.

> **💡 Key idea**
>
> Being a queue member is only one condition; presence, capacity, and the routing policy determine current eligibility.

## 2. Northstar Motors worked example

Use this simplified capacity model: each employee has capacity 4 and each Case costs 2 units. Anna is online with 2 units used; Max is online with all 4 used; Oleg is offline with 0 used. All three belong to the support queue. Only Anna is eligible for the next item. After accepting it, she reaches 4 and a second item must wait unless someone else's eligibility changes.

Now Max completes work and drops to 2 used units. He becomes eligible under the simple queue scenario. Add a required EV-service skill that only Anna has: Max's free capacity is no longer sufficient to qualify him. These examples intentionally avoid a tie between equally eligible employees, so they do not invent the product's tie-breaking algorithm.

> **🔎 Check your understanding**
>
> Why is Oleg ineligible even though his capacity usage is zero?

**Provided routing simulation; capacity units are an explicit teaching assumption**

```text
Person   Presence   Used/Limit   EV skill
Anna     Online     2/4          Yes
Max      Online     4/4          No
Oleg     Offline    0/4          Yes
Incoming Case cost: 2
Basic queue eligibility: Anna
After Anna accepts: no eligible person until a condition changes
```

## 3. Build and inspect

Mandatory: work through the provided trace and explain decisions. Optional live lab: verify Enhanced Omni-Channel entitlement, use synthetic Cases, and record the actual capacity model and configuration; do not assume it matches the simplified simulation.



### Step 1: Trace eligibility

For each person, evaluate queue membership, presence, available capacity, and any required skill. Record the first failed condition.

> **🔎 Check your understanding**
>
> Expected result: Every routing decision has a concrete explanation.

### Step 2: Change one condition

Simulate Max completing work, Anna going offline, and an EV skill requirement. Predict each result before changing the trace.

> **🔎 Check your understanding**
>
> Expected result: Capacity and skill are not confused with one another.

### Step 3: Optional live verification

In an entitled training org, configure a Case service channel, routing configuration, queue membership, presence settings, and the appropriate console utility. Test one online worker and one ineligible worker.

> **🔎 Check your understanding**
>
> Expected result: Evidence names the actual configuration and distinguishes it from simulation.

## 4. Failure cases and boundaries

A Case sitting in a queue is not proof that routing is broken. Check the service channel, eligible presence, capacity, membership, and routing configuration before changing ownership arbitrarily.

Closing a browser or changing a record status may interact with the configured capacity model differently than assumed. Verify the actual model instead of transferring simulation rules without inspection.

> **⚠️ Watch out**
>
> No paid license or trial is required for the mandatory clinic; mark live product steps Not run when unavailable.

## ⚡ Independent practice: Explain a routing decision

Submit the provided simulation with three condition changes and an optional separately labeled live observation.

1. Compute eligibility.
2. Explain waiting work.
3. Compare assignment ownership with active routing.

### Your work is ready when

- Every chosen or excluded person has a reason.
- No unsupported tie-breaking rule is invented.
- Simulation and live evidence are clearly separated.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is a queue not enough?

**Answer:** Membership identifies a team, but current presence, capacity, and routing requirements still determine eligibility.

### 2. How does an assignment rule differ?

**Answer:** It assigns ownership; Omni-Channel handles configured distribution of eligible work to available recipients.

### 3. Is OmniStudio the routing engine?

**Answer:** No. It is a different product family with different purposes.

## What to take away

- Check eligibility in stages.
- Use current Enhanced documentation.
- Keep product entitlement optional for the core course.

## Sources and further reading

- [Enhanced Omni-Channel overview](https://trailhead.salesforce.com/content/learn/modules/enhanced-omni-channel/explore-enhanced-omni-channel)
- [Omni-Channel administrator guide](https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/service_presence_administrators.pdf)


---

# Agentforce tasks, actions, and evidence

M32 · middle · About 50 minutes with practice

![A restrained agent symbol choosing one permitted action from three clear tool cards](https://sam-portal-production.up.railway.app/lesson-images/M32.jpg)

Build a clear mental model of an employee agent and verify one bounded read-only action before considering actions that change CRM data.

## Before you begin

- M01 security layers and M30 evidence.
- The core vehicle model; no AI product entitlement is required for the simulation.

## What you will learn

- Distinguish conversation, subagent routing, and deterministic action behavior.
- Define a narrow read-only action contract.
- Test unknown input, denied access, and misleading success.

## 1. Understand the mechanism

Northstar's salesperson already has a business task: find useful test-drive information for Irina. An employee agent offers a conversational way to reach a permitted operation. It should not replace the underlying data model or invent missing availability. Explain the task and its evidence first: the salesperson asks about a model, an action reads or calculates a bounded result, and the answer accurately describes that result.

In the current Agentforce Builder, subagents organize task-specific behavior and the Router selects an appropriate area. Actions perform concrete operations through supported mechanisms such as Flow or an invocable Apex method. Instructions help select and describe actions, while code, permissions, and data constraints enforce the actual operation. A well-written prompt is not a substitute for authorized database access.

Employee agents operate in the logged-in user's context, but custom Apex and Flow still need security review because their configured execution can be privileged. Verify object, field, record, and action access. Returning a record ID from a conversation does not prove that the user is authorized to use it in a later write. The action must validate its own inputs and intended scope.

The mandatory clinic uses a provided response simulation and test matrix. The optional live path uses the standalone starter/agentforce SAMDemoSlotCatalog action and a suitable Employee Agent org. It reads Vehicle__c and returns explicitly artificial tomorrow slots. This is a controlled demonstration, not a real dealer calendar, production agent, or Automotive Cloud entitlement.

> **💡 Key idea**
>
> Evaluate the action and its evidence, not the confidence of the generated sentence.

## 2. Northstar Motors worked example

Use three controlled results: City EV returns OK and two demo times; Tourer Hybrid returns UNAVAILABLE; an unknown model returns NOT_FOUND. A missing model requires clarification. If two visible vehicles share the exact model, the provided action returns AMBIGUOUS rather than choosing the first. The agent should explain these outcomes without making up a booking.

Test ten cases: clear request, paraphrased request, missing model, unknown model, unavailable model, ambiguous model, denied field access, denied record access, unrelated request, and a request to ignore restrictions. For each, state the expected action or clarification and whether any data should change. The read-only clinic should create no Test Drive or Case records.

> **🔎 Check your understanding**
>
> What observable evidence distinguishes a generated answer from a successful authorized action?

## 3. Build and inspect

Mandatory simulation needs only the listed fixture outcomes. Optional live path: obtain the official special Agentforce Employee Developer Edition, deploy starter/salesforce and starter/agentforce, grant minimal Apex/data access, and verify the action's tests first.



### Step 1: Write the action contract

Document model input, result codes, minimal outputs, mock limitation, and the fact that no data is written. Map each of the ten test cases to an expected result.

> **🔎 Check your understanding**
>
> Expected result: The agent has a bounded, reviewable responsibility.

### Step 2: Optional current Builder setup

Open Agentforce Studio → New Agent → Employee Agent. Create a test-drive information subagent and add the deployed Apex invocable action. Require the model input and keep action outputs clearly labeled as demo data.

> **🔎 Check your understanding**
>
> Expected result: The configured action matches the tested Apex contract.

### Step 3: Run and inspect

Analyze the simulation or use Preview in the entitled org. Inspect selected action, inputs, outputs, and actual record counts. Mark which mode was used.

> **🔎 Check your understanding**
>
> Expected result: A fluent answer cannot conceal an unauthorized or missing result.

## 4. Failure cases and boundaries

An action failure must not be rewritten as 'no warranty' or 'no availability' unless that is the actual business result. Unknown and denied access are not successful negative answers.

Adding a write action later introduces a new risk boundary. It needs explicit confirmation, backend validation, duplicate protection, and new tests; the read-only clinic does not prove those properties.

> **⚠️ Watch out**
>
> A portal simulation does not validate live Agentforce licensing, permissions, model behavior, or Salesforce writes.

## ⚡ Independent practice: Evaluate a bounded employee agent

Complete the ten-case matrix for the read-only contract and optionally demonstrate the live action.

1. Define expected behavior.
2. Run or analyze all ten cases.
3. Record actions and evidence, not only final prose.

### Your work is ready when

- No artificial slot is described as real calendar availability.
- Unknown and denied inputs are handled explicitly.
- Simulation and live results are distinguished.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What does an action add beyond instructions?

**Answer:** A concrete executable operation with defined inputs, outputs, and implementation constraints.

### 2. Why still review custom action security?

**Answer:** Apex or Flow can have privileged behavior that needs explicit control even inside an employee-agent scenario.

### 3. Does a successful conversation prove production readiness?

**Answer:** No. It does not establish broader security, reliability, licensing, volume, or integration behavior.

## What to take away

- Start from the business task.
- Bound and test the action.
- Treat generated language as a presentation of verified results.

## Sources and further reading

- [Current Employee Agent Builder](https://developer.salesforce.com/workshops/agentforce-new-workshop/employee-agents/1-get-started)
- [Agent trust and custom action boundaries](https://architect.salesforce.com/docs/architect/well-architected/guide/agentic-enterprise-trust.html)
- [Official Employee Agent training org](https://trailhead.salesforce.com/content/learn/projects/quick-start-create-employee-agents-in-agentforce/enable-agentforce-and-review-default-topics-and-actions)


---

# Automotive Cloud data modeling

M33 · middle · About 50 minutes with practice

![A vehicle record connected to a customer, a service appointment and an ownership card](https://sam-portal-production.up.railway.app/lesson-images/M33.jpg)

Compare the small custom vehicle model with Automotive Cloud's industry entities and decide what additional business requirements would justify the product.

## Before you begin

- Junior objects, relationships, Contact, Account, and Asset concepts.
- The core Vehicle__c/Test_Drive__c training model.

## What you will learn

- Distinguish a vehicle definition from an individual vehicle.
- Explain Asset and participant relationships at a conceptual level.
- Evaluate product fit without requiring a paid environment.

## 1. Understand the mechanism

The core SAM project uses Vehicle__c to teach Salesforce development with a small owned schema. That custom object is not the Automotive Cloud Vehicle standard object, and deploying the starter does not install the industry product. Similar labels can conceal different APIs, relationships, licenses, and business capabilities. Keep the two models visibly separate.

Automotive Cloud's Vehicle Definition extends product information with model-level vehicle characteristics, such as dimensions or powertrain specifications. An individual Vehicle represents a particular vehicle instance. A model definition can therefore describe many actual vehicles. Storing all model specifications repeatedly on every custom vehicle may work for a prototype but creates consistency and maintenance concerns as the business grows.

Asset represents an owned or installed product in the broader Salesforce model. Automotive's model includes relationships and participants that connect assets, vehicles, customers, accounts, warranties, and lifecycle information. Do not reduce these relationships to an assumed one-to-one field without reading the actual object documentation. The right mapping depends on what the company tracks: possession, ownership, service responsibility, sales, or finance.

A product decision needs more than counting objects. Ask whether Northstar needs manufacturer/dealer relationships, vehicle history, warranty terms, ownership changes, service processes, and supported integrations. Compare licensing, implementation effort, data migration, team skills, and fit to existing processes. An industry model can reduce custom reinvention when its semantics match the business; a small custom solution may still be appropriate for a narrower requirement.

> **💡 Key idea**
>
> Map business meaning before mapping field names or choosing an industry product.

## 2. Northstar Motors worked example

Irina considers a City EV model, then buys a particular vehicle with its own VIN. The model's battery specification belongs to a shared definition; the individual vehicle's identity and lifecycle belong to the instance. Later, a different person may own or use that same vehicle, while service and warranty history must remain understandable. These are richer relationships than a single Customer__c lookup on a test-drive request.

Create a mapping sheet with three columns: core teaching concept, Automotive concept, and unresolved question. Map Vehicle__c.Model__c toward model/definition information, Vehicle__c.VIN__c toward individual vehicle identity, and Contact toward a participant in a business relationship. Do not declare the mapping deployable until actual standard-object fields and relationship cardinalities are verified.

> **🔎 Check your understanding**
>
> Which information changes for one physical vehicle, and which should remain shared by every vehicle of the same definition?

## 3. Build and inspect

Mandatory: use the official data-model gallery and supplied scenario to build the mapping. Optional: use an available Automotive Cloud trial in a separate org. The official trial page currently lists a 30-day option, but verify its terms, features, and expiration before registering.



### Step 1: Read the industry diagram

Locate Vehicle Definition, Vehicle, Asset, Account/Contact participants, and warranty-related entities in the official model. Explain each in ordinary business language.

> **🔎 Check your understanding**
>
> Expected result: The learner can distinguish definitions, instances, and relationships.

### Step 2: Map the Northstar scenario

Trace Irina considering a model, selecting a specific vehicle, becoming a participant, and later requesting service. Record gaps in the custom starter.

> **🔎 Check your understanding**
>
> Expected result: The map exposes business requirements rather than merely renamed objects.

### Step 3: Compare two implementation choices

Choose two requirements where the industry model may add value and one narrow requirement the custom project already handles. If using a trial, verify object availability and label live observations separately.

> **🔎 Check your understanding**
>
> Expected result: The recommendation includes fit, cost, migration, and evidence limits.

## 4. Failure cases and boundaries

Copying custom-object Apex and changing Vehicle__c to Vehicle is not a migration strategy. Field names, relationships, permissions, validation, and product processes need explicit mapping.

A trial contains a limited environment and possibly sample configuration. Do not assume every observed feature is included in every customer's edition or license package.

> **⚠️ Watch out**
>
> The core project and the required clinic do not require an Automotive Cloud purchase or trial.

## ⚡ Independent practice: Create an Automotive model comparison

Map the Northstar customer-and-vehicle lifecycle and defend whether additional industry capabilities are needed.

1. Identify definition, instance, and participants.
2. List verified mappings and open questions.
3. Compare two product-fit benefits and implementation costs.

### Your work is ready when

- Vehicle__c is not confused with the industry Vehicle API.
- Relationships are not invented from labels.
- No unavailable trial blocks the core course.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why separate a Vehicle Definition?

**Answer:** It holds shared model characteristics rather than repeating them on every physical vehicle.

### 2. Is the custom starter Automotive Cloud?

**Answer:** No. It is an independent teaching schema on the core platform.

### 3. What should be verified before migration?

**Answer:** Actual APIs, relationships, cardinalities, permissions, licensing, lifecycle semantics, and data transformation needs.

## What to take away

- Separate definitions from instances.
- Map lifecycle relationships.
- Choose a product from requirements and evidence.

## Sources and further reading

- [Automotive data-model gallery](https://developer.salesforce.com/docs/platform/data-models/guide/automotive-cloud-overview.html)
- [Connecting vehicle and customer data](https://trailhead.salesforce.com/content/learn/modules/automotive-cloud-foundations/connect-customer-and-vehicle-data)
- [Official Automotive trial options](https://developer.salesforce.com/free-trials/comparison/automotive-cloud)


---

# Middle project review and technical defense

M34 · middle · About 50 minutes with practice

![A service application connecting a vehicle, a warranty response and a background job](https://sam-portal-production.up.railway.app/lesson-images/M34.jpg)

Demonstrate a coherent Northstar feature, defend its design with evidence, and repair one unfamiliar failure without relying on optional product licenses.

## Before you begin

- M01–M30 core concepts and completed integrated feature.
- M31–M33 clinic analyses or separately labeled optional live labs.

## What you will learn

- Present the business result and architecture clearly.
- Use evidence to explain security, retries, failures, and release readiness.
- Diagnose and repair one new defect.

## 1. Understand the mechanism

The Middle project combines skills into a feature that another developer can understand and operate. Northstar's salesperson submits a warranty or service-related request for a known vehicle, receives an honest accepted state, and later sees a result or actionable failure. The feature includes access control, durable identity, bounded background work, controlled provider responses, and a user interface that reflects persisted state.

A defense is not a recital of every Salesforce term. Begin with the business problem, actors, data, and success criteria. Anna and Max are salespeople, Oleg supervises work, and Irina is a customer Contact. Explain which user performs each operation and which components or transactions are responsible. The listener should understand the process before seeing a class diagram.

Evidence must match the submitted version. A passing test from an earlier branch does not validate a later change. Include source, metadata dependencies, real test results, controlled failure observations, and the deployment/recovery plan. Label the provider as mocked when it is mocked. Identify unavailable restricted-user, live integration, or product checks instead of hiding them behind a general 'tested' claim.

The product clinics broaden judgment but are not mandatory product deployments. A correct Omni-Channel routing simulation, a bounded Agentforce action analysis, and an Automotive model comparison satisfy the required awareness path. A learner should not need three separate paid entitlements to demonstrate competent core development. An optional live clinic can enrich the project without compensating for broken core access or duplicate handling.

> **💡 Key idea**
>
> Defend decisions with the requirement, the implementation boundary, and the evidence that supports it.

## 2. Northstar Motors worked example

Use a five-minute demonstration: Anna submits a request, the UI shows accepted work, the explicitly labelled local demo adapter supplies a result, and the final record is visible. Repeat the same key and show one business request. Trigger a controlled failure and show its safe operator recovery. Finally, attempt an unauthorized operation as a restricted user or clearly identify that check as outstanding.

For the repair exercise, the reviewer introduces one new condition: a 200 response lacks covered, a refresh fails after a successful write, a repeated key changes vehicle, or a request stays Processing after a job failure. Investigate from the correlation key and boundary evidence. Explain the hypothesis before changing code, then verify the smallest responsible correction and relevant regression tests.

> **🔎 Check your understanding**
>
> Can another developer reproduce your result using only the repository and submission instructions?

## 3. Build and inspect

Submit the implemented core feature, not every optional experiment in one deployment. List the custom objects and fields introduced by the lessons you used, their permissions, active Flow versions, and required configuration.

HttpCalloutMock and Test.setMock operate in Apex test context; they do not intercept an ordinary browser-triggered callout. Separate three kinds of evidence: Apex tests with controlled HTTP mocks; LWC Jest tests with controlled Apex responses; and a real training-org UI run using M12’s explicitly labelled local deterministic demo adapter. For that last path, select the demo adapter through controlled training configuration, never from an untrusted browser flag; do not send the .invalid endpoint. A real end-to-end HTTP run needs a separately owned test endpoint and credential setup. Do not combine these observations into a claim that the test mock ran behind the live screen.



### Step 1: Prepare the review package

Create a focused PR or portal file submission with a README, dependency list, setup/deploy order, scenario matrix, and known limitations. Remove credentials and real customer data.

> **🔎 Check your understanding**
>
> Expected result: The reviewer has a reproducible starting point.

### Step 2: Demonstrate and defend

Show success, repeat, failure, and access behavior. Explain one alternative architecture and why your chosen design fits the current workload and team.

> **🔎 Check your understanding**
>
> Expected result: Tradeoffs are connected to requirements rather than personal preference.

### Step 3: Repair the unfamiliar condition

Trace the defect to a boundary, implement a focused correction, run the affected checks, and explain any remaining uncertainty.

> **🔎 Check your understanding**
>
> Expected result: The repair improves the intended behavior without hiding another failure.

## 4. Failure cases and boundaries

A polished demo can conceal missing metadata, administrator-only access, or a mocked success that never persisted. The reviewer should inspect records and configuration as well as the screen.

Adding more products or architectural layers does not improve a project whose basic operation identity and recovery rules are unclear. Keep the defense centered on a coherent feature.

> **⚠️ Watch out**
>
> Do not claim production readiness, live provider compatibility, or tested product entitlements that the evidence does not establish.

## ⚡ Independent practice: Submit and defend the Northstar feature

Deliver the integrated project and complete a short review plus one repair exercise.

1. Prepare reproducible evidence.
2. Demonstrate the four core outcomes.
3. Explain and fix one unfamiliar failure.

### Your work is ready when

- Access, duplicate handling, failure recovery, and bulk behavior are supported by evidence.
- The release plan declares dependencies and actual checks.
- Required clinic analyses are complete without mandatory live product licenses.

> **💡 Key idea**
>
> Optional extension: Explain one limitation and propose a small follow-up experiment before extending the implementation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Which risks should be handed to the next developer?

**Answer:** The most material unverified boundaries, known recovery limitations, and capacity or security assumptions, each with a proposed next check.

### 2. Why must evidence match a commit or version?

**Answer:** Otherwise the reported result may describe different behavior from the submitted implementation.

### 3. What makes a repair convincing?

**Answer:** A clear cause, a focused change, a demonstrated corrected outcome, and checks that protect neighboring behavior.

## What to take away

- Present the business result first.
- Defend boundaries with evidence.
- Repair carefully and state limits.

## Sources and further reading

- [Integration patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns)
- [Reviewing changes through PRs](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request)
- [Asynchronous processing](https://architect.salesforce.com/docs/architect/decision-guides/guide/async-processing)
- [HTTP mock behavior in test context](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-restful-http-testing-httpcalloutmock.html)
