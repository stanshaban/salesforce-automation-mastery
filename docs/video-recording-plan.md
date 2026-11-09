# Recording plan: a Salesforce developer workspace

Status: recording script, November 9, 2026. Videos have not been recorded. Text instructions and source links are in `data/setup-guide.json`. Record the current interfaces: commands in an old video may have different names.

The audience has completed the introduction: a CRM keeps customer information and related work; an object defines a kind of information, a field defines a property, and a record is one instance. The fictional Northstar Motors dealership sells vehicles. A salesperson records a customer's test-drive request, a manager reviews the team's work, and a developer changes the application. Repeat this context before showing metadata and tools.

Each video follows a clear result, a diagram, screen actions, one common failure, and an independent check. End with a small action for the learner. Durations guide editing, not the learner's pace.

| Chapter | Duration | Learner result |
| --- | ---: | --- |
| 1. CRM, the training org, and developer tools | 5–7 min | Distinguishes a Salesforce record, project file, CLI, and Git history |
| 2. Install VS Code and Git | 5–8 min | Opens a folder and terminal |
| 3. Install Salesforce CLI and Java | 5–8 min | Checks commands and explains Java's role |
| 4. Salesforce Extension Pack and the VS Code interface | 6–8 min | Finds an extension command and error output |
| 5. The learning repository and DX project | 7–9 min | Opens the correct folder and separates metadata from data |
| 6. Connect a training Salesforce org | 5–7 min | Verifies the target org before running a command |
| 7. Send project metadata to an org | 6–8 min | Deploys a bounded change and verifies its result |
| 8. Retrieve metadata and inspect a diff | 6–8 min | Finds an org field change in files and Git |
| 9. Apex tests and Debug Logs | 8–12 min | Distinguishes an assertion, coverage, and execution failure |
| 10. Submit files or a PR for review | 7–10 min | Prepares a clear review submission |

## 1. CRM, the training org, and developer tools

Open with three cards: vehicle, customer, and test drive. On a real synthetic training record, show model, date, and status. Explain who enters each value and why the business keeps the information together. An org is a separate Salesforce environment with its own data, configuration, and users.

Show the appointment record, its field definition in Object Manager, the corresponding XML in VS Code, and a diagram: files ↔ CLI ↔ training org. Add Git as file history and GitHub as a review workspace. Caption: “Saving a file changes that file; deployment sends selected configuration to the org.”

Pause: ask the learner where the customer's date value lives and where the date field itself is defined. Do not require Apex or Flow vocabulary before its lessons.

## 2. Install VS Code and Git

For macOS, show the official download, processor-appropriate build, Applications folder, and Command Palette action that puts `code` on PATH. Make Windows a separate segment showing User Installer, PATH setup, and a new terminal; do not mix interfaces into one continuous walkthrough.

Show `code --version` and `git --version`, then File → Open Folder. Demonstrate a terminal opened before installation that cannot yet find the new command. Pause for learners to check versions on their machines. Additional AI extensions are unnecessary for this chapter.

## 3. Install Salesforce CLI and Java

Show the official Salesforce CLI page, installer, and a new terminal running `sf --version`. Explain that a CLI is a program controlled with text commands. Show JDK 21 and `java -version`: Java supports the Apex Language Server's editor assistance; it does not run a Salesforce org on the laptop.

Include macOS `/usr/libexec/java_home -v 21` and Windows `where.exe java`. Show the Java Home user setting when automatic detection fails. Demonstrate an incorrect path to the executable instead of the JDK folder. Pause: version commands work and the editor no longer reports missing Java.

## 4. Salesforce Extension Pack and the VS Code interface

Show Extensions, `salesforce.salesforcedx-vscode`, the Salesforce publisher, and installation. Keep a small window map visible: Explorer, Extensions, Editor, Terminal/Output, and Status Bar.

Open Command Palette with Cmd+Shift+P or Ctrl+Shift+P, find a Salesforce command, then show Output and Problems. Terminal holds CLI results; Output holds extension messages. Pause: the learner locates the installed pack and the relevant Output channel.

## 5. The repository and DX project

Show the public SAM repository, a personal copy through **Use this template** when available, cloning, and opening `starter/salesforce`. If template creation is unavailable, show a fork as a separate supported route without pretending the button exists.

Explain `sfdx-project.json`, `force-app/main/default`, and the objects, permissionsets, classes, and lwc directories. The core starter supplies a data model, not completed assignment solutions. Show the Git root above the DX folder and the evidence area at `starter/submissions`.

Pause: locate Vehicle__c and explain the difference between a VIN field definition and an actual vehicle's VIN value. Do not create a new project over the starter. If Junior browser lessons already changed the org, identify those changes now and retrieve/reconcile them before deploying original starter files.

## 6. Connect a training Salesforce org

Diagram browser login → local CLI authorization → alias `sam-training`. Use the login route appropriate to the org type. Keep credential entry and consent details out of the recording. After login, inspect the org list and open the org with its explicit alias.

Show the distinction between Developer Edition and sandbox login URLs. An alias is a convenient local name, not proof that it points to the intended environment. Verify the domain and account before deployment. Pause: the learner opens their own org without giving the instructor its credentials.

## 7. Send metadata to an org

For a fresh learning org, show selected starter metadata, deployment with `--target-org sam-training`, the actual CLI result, and Object Manager. Open SAM_Lab_Basics and explain that deploying a permission set neither assigns it nor grants every other user's records.

For an org already used in J07–J17, show retrieval and reconciliation first. Preserve browser-created fields, Flow, activity settings, and permission changes. Do not overwrite them with unchanged starter metadata.

Demonstrate that deploying a field creates no actual vehicle records. Add one synthetic record through the interface. Pause: the learner checks the object and field in the org, not only a green CLI line.

## 8. Retrieve metadata and inspect a diff

Show one Vehicle field change in Setup, a focused retrieval, Source Control, and the before/after file diff. Before retrieval, preserve and inspect uncommitted local work so it is not accidentally overwritten.

Use explicit arrows: retrieve = org → files; deploy = files → org; commit = saved file history. Demonstrate the noise from retrieving unrelated metadata without actually needing a whole-org retrieval. Pause: the learner explains one changed line and its effect.

## 9. Apex tests and Debug Logs

Record after the Apex lessons and the relevant coding lab. The learner should already understand a class, method, input, and expected result. The core starter does not include a completed test solution.

Show the learner-created `SlotPlannerTest` from J22, a specific assertion, execution, and the observed outcome. On a disposable demonstration branch, break the occupied-slot check; the same test should fail. Restore the implementation and rerun. Show one useful sanitized Debug Log excerpt rather than dumping all records.

Explain that coverage reports executed lines, not assertion quality. If the CLI returns an asynchronous test-run ID, retrieve its result before claiming success. Pause: learners attach evidence from their own execution.

## 10. Submit files or a PR

Route A: portal assignment → selected metadata, README, and test evidence → descriptive file labels → submission → status. Route B: personal branch → staged diff → commit → PR into the learner's own main → PR URL in the portal.

Show a description containing the requirement, changes, reproduction steps, checks, and remaining uncertainty. On a training submission, demonstrate reviewer feedback and a new version. Explain public Issues only as an optional fallback. Keep email and Skool identity out of public PRs.

Pause: verify that the evidence matches the latest version. Upload success or a green structure check is not assignment acceptance.

## Recording and editing

- Record at 1920×1080 or higher with readable editor and terminal text. Show one action at a time.
- Use consistent colors: files blue, org teal, Git purple, errors amber. Repeat the meaning in text.
- Draw retrieve/deploy arrows between labelled areas. Show the complete diagram before highlighting one boundary.
- Record the working path and one real common failure. Never insert fabricated successful CLI output.
- Remove email, org IDs, tokens, client IDs, and customer data from footage. Use a demonstration account.
- Include recording date, OS, VS Code/CLI/Java versions, assignment ID, and primary-source links in each description. Update the affected chapter when an interface changes.
- Make video covers after final recording using the chapter name and actual interface. Do not add thumbnails or links that imply nonexistent videos are available.

## Primary sources

- [Install Salesforce Extensions](https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/install.html).
- [Apex Language Server Java setup](https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/java-setup.html).
- [Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode).
- [Salesforce CLI](https://developer.salesforce.com/tools/salesforcecli).
- [VS Code for macOS](https://code.visualstudio.com/docs/setup/mac) and [Windows](https://code.visualstudio.com/docs/setup/windows).
- [Create a GitHub pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request).
