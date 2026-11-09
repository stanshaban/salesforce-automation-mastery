# Northstar Motors core starter

This small Salesforce DX project provides the starting schema for a training org. It does not contain completed Flow, Apex, LWC, or assignment solutions.

## Included schema

| Object | Fields |
|---|---|
| Vehicle__c | Name (Text), VIN__c (Text 17, unique external ID), Model__c (Text 80), Status__c (Available / Reserved / Unavailable) |
| Test_Drive__c | Name (Auto Number TD-{0000}), Vehicle__c (Lookup), Customer__c (Lookup Contact), Scheduled_At__c (DateTime), Status__c (Requested / Confirmed / Completed / Cancelled) |

Both objects have private sharing. The vehicle relationship is a lookup, so a Test Drive retains its own owner. Deleting a referenced record clears the optional lookup. Compare master-detail in a separate experiment if required; preserve the lookup baseline for the access exercises.

Activities are disabled in the original starter. A later browser-first lesson may enable them. If your org already contains coursework, retrieve and reconcile its metadata before deploying this baseline; otherwise an object deployment can overwrite settings such as enabled Activities.

SAM_Lab_Basics grants Read/Create/Edit on the two teaching objects, access to their fields, and Read on Contact. It does not grant Delete, View All, Modify All, or record sharing. It does not guarantee access to every Contact. Verify the user's profile, FLS, ownership, and sharing separately. Administrator success is not restricted-user evidence.

## Open the correct project

Complete the portal's visual VS Code guide. Open this folder in VS Code so the Salesforce extensions can find sfdx-project.json.

Authorize a separate training Developer Edition through the browser:

```text
sf org login web --alias sam-training --instance-url https://login.salesforce.com
sf org open --target-org sam-training
```

Verify the actual org identity in the browser. Use the appropriate sandbox endpoint instead when the environment is a sandbox. Do not use a client production org for these exercises.

## Fresh org or existing coursework

For a fresh org, review the starter before deployment.

For an org built during browser-first lessons, first preserve local work and retrieve the existing objects:

```text
git status
sf project retrieve start --metadata CustomObject:Vehicle__c --metadata CustomObject:Test_Drive__c --target-org sam-training
git diff
```

Review and preserve existing fields, sharing choices, and Activities settings. Retrieve relevant Flow and permission metadata separately using their actual names or Org Browser. Reconcile the files before deploying. Do not blindly overwrite completed coursework with the original starter.

After reviewing the selected metadata, use an explicit target:

```text
sf project deploy start --source-dir force-app --target-org sam-training --dry-run
sf project deploy start --source-dir force-app --target-org sam-training
```

Inspect the dry-run result before performing the deployment. These commands run in your own training environment. Static source checks performed during authoring do not establish a successful deployment to your org.

Assign the minimal permission set only to the intended training persona when appropriate. For the currently authorized user:

```text
sf org assign permset --name SAM_Lab_Basics --target-org sam-training
```

Create Custom Object Tabs and a training Lightning app or pages in Setup when the lesson requires them. Navigation and data access are separate concerns.

## Version and verification

The baseline is sourceApiVersion 68.0, Winter ’27. It is a pinned teaching version, not a promise to always use the latest API. If your org does not support it, inspect the environment and lesson requirements before changing the number; some security exercises deliberately compare versioned behavior.

From the repository root:

```text
node scripts/check-submission.mjs
```

A successful static check does not mean Apex tests passed. This core starter has no Apex test class. After implementing one, run the relevant tests in your training org and attach the actual result.

## Sources

- [DX project configuration](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-ws-config.html)
- [API version and sourceApiVersion](https://developer.salesforce.com/docs/platform/sfdx-setup/guide/sfdx-setup-apiversion.html)
- [Winter ’27 and API 68.0](https://developer.salesforce.com/blogs/2026/10/developers-guide-to-the-winter-27-release)

Documentation checked on 9 November 2026.
