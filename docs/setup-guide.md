# VS Code and the Salesforce developer workflow

A training org is a separate Salesforce environment with its own users, data, and configuration. Metadata describes the application, such as which fields a vehicle has; data is the actual value stored for one vehicle. VS Code edits metadata and code files. Salesforce CLI transfers selected metadata between your project and org. Git records file history, while GitHub supports review. Complete the CRM, object, field, and record introduction before this guide.

The main path uses your personal SAM repository and its starter/salesforce DX folder. Instructions were checked against official documentation on 9 November 2026. A fresh org can receive the starter directly. If you built the schema through earlier browser-first lessons, retrieve and reconcile that existing configuration before deploying local files, preserving fields, Flow, permissions, and enabled Activities. Use the explicit alias sam-training and verify the connected org independently.

## 1. Understand the VS Code window

**Outcome:** Locate a file, a command, command output, and a Git change.

The Explorer shows project files; the editor changes their contents. The lower panel contains Terminal, Problems, and Output, which serve different purposes. The Command Palette finds editor and extension actions. The status bar helps identify your Git branch and selected Salesforce org.

1. Open a training folder with File → Open Folder.
2. Locate Explorer, Search, Source Control, and Extensions in the Activity Bar.
3. Open View → Command Palette: Cmd+Shift+P on macOS or Ctrl+Shift+P on Windows/Linux.
4. Open Terminal → New Terminal, then compare Terminal, Problems, and Output.

**Verify:** Without a hint, locate a file, the Command Palette, an error message, and the diff for a changed file.

**Common mistake:** Assuming that saving a local file has already changed the Salesforce org.

**Visual guide:** Five areas: Activity Bar → Explorer → Editor → lower panel → Status Bar.

Official references: [Reference 1](https://code.visualstudio.com/docs/getstarted/userinterface), [Reference 2](https://code.visualstudio.com/docs/terminal/basics).

## 2. Install VS Code and Git

**Outcome:** Open a project and verify that the editor and Git are available.

Use current stable VS Code and the official Git installer. On macOS, move VS Code into Applications and use the palette's Shell Command: Install code command in PATH when needed. On Windows, the User Installer is a suitable normal path; open a new terminal after installation so PATH changes take effect.

1. Install VS Code from the official download page, selecting the correct operating system and processor architecture.
2. Install Git from its official download instructions.
3. Open a new terminal and check both versions with the commands below.
4. If code is not found, configure its PATH entry or open the folder from the VS Code menu. Installing an AI assistant is not required.

### Commands

**Editor version** (all)

```text
code --version
```

**Git version** (all)

```text
git --version
```


**Verify:** Both version commands return a version, and File → Open Folder opens your training folder.

**Common mistake:** Keeping an old terminal open and interpreting its missing PATH update as a failed installation.

**Visual guide:** The terminal reports versions; the Explorer confirms which folder is open.

Official references: [Reference 1](https://code.visualstudio.com/docs/setup/mac), [Reference 2](https://code.visualstudio.com/docs/setup/windows), [Reference 3](https://git-scm.com/downloads), [Reference 4](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode).

## 3. Install Salesforce CLI and Java

**Outcome:** Verify the CLI and the JDK used by the Apex language tools.

Salesforce CLI executes Salesforce development commands; the extensions call it behind the scenes. Install the official CLI package for your system. The Apex Language Server also needs a supported JDK; JDK 21 is the recommended baseline in the checked documentation. Java supports editor tooling here; Salesforce itself is not being installed on your laptop.

1. Use the official Salesforce CLI installer for macOS or Windows and the correct processor architecture.
2. Install JDK 21 from a suitable JDK distribution and open a new terminal.
3. Run sf --version and java -version. On macOS, inspect the JDK path with /usr/libexec/java_home -v 21; on Windows, where.exe java shows the resolved executable.
4. If Java is not detected, configure JAVA_HOME/JDK_HOME or the user setting salesforcedx-vscode-apex.java.home to the JDK directory. Do not put a personal absolute Java path in repository settings.

### Commands

**Salesforce CLI version** (all)

```text
sf --version
```

**Java version** (all)

```text
java -version
```

**JDK 21 location on macOS** (macos)

```text
/usr/libexec/java_home -v 21
```

**Resolved Java executable on Windows** (windows)

```text
where.exe java
```


**Verify:** The terminal reports CLI and Java versions, and the Apex language server no longer reports a missing JDK.

**Common mistake:** Pointing Java Home at the java executable instead of the JDK directory, or committing a machine-specific path.

**Visual guide:** Two tools have separate roles: CLI connects to Salesforce; the JDK supports Apex editor analysis.

Official references: [Reference 1](https://developer.salesforce.com/tools/salesforcecli), [Reference 2](https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/java-setup.html).

## 4. Install Salesforce Extension Pack

**Outcome:** Use Salesforce editor commands from a verified extension package.

Install the pack published by Salesforce with ID salesforce.salesforcedx-vscode. It supplies the core Salesforce development extensions, including Apex and LWC support and access to CLI-backed actions. Keep VS Code current; the Marketplace requirements can be newer than older tutorial minimum versions.

1. Open Extensions and search for Salesforce Extension Pack.
2. Verify the publisher Salesforce and the exact extension ID before installing.
3. Reload VS Code if requested and open a DX project containing sfdx-project.json.
4. Search Salesforce commands in the Command Palette and inspect the relevant Output channel if an action fails. Additional paid AI features are not prerequisites for this guide.

### Commands

**Alternative installation using the exact extension ID** (all)

```text
code --install-extension salesforce.salesforcedx-vscode
```

**Installed extensions and versions** (all)

```text
code --list-extensions --show-versions
```


**Verify:** The installed pack appears with its version, Salesforce commands are available, and the correct DX folder is open.

**Common mistake:** Installing a similarly named third-party package or expecting Salesforce commands to work in an unrelated folder.

**Visual guide:** Extensions identifies the package; the Command Palette exposes actions; Output explains extension failures.

Official references: [Reference 1](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode), [Reference 2](https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/install.html), [Reference 3](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace).

## 5. Create your personal project copy

**Outcome:** Open the existing SAM DX project without generating a conflicting nested project.

Use a personal copy of stanshaban/salesforce-automation-mastery. If Use this template is available, create your copy from it; a fork is another supported learning path. A template copy has independent history, so create review PRs inside your own repository rather than assuming an upstream PR is possible.

1. Create or fork your personal repository and clone it with GitHub's displayed clone instructions.
2. From the repository root, open starter/salesforce in VS Code.
3. Find sfdx-project.json and force-app/main/default. The Git repository root is above this DX folder.
4. Inspect Vehicle__c and Test_Drive__c metadata. They define objects and fields, not actual customer records.
5. Check your remote URL and initial Git status. Do not generate a second project inside the starter. For a separate empty experiment, the current CLI command is sf template generate project --name northstar-sandbox --manifest.
6. If earlier lessons already created these objects in the browser, treat the clone as a baseline to reconcile, not an instruction to overwrite the org. Preserve your browser-built configuration before deployment.

### Commands

**Open the DX folder from the SAM repository root** (all)

```text
code starter/salesforce
```

**Check your repository remote** (all)

```text
git remote -v
```

**Check the initial working state** (all)

```text
git status
```


**Verify:** The Salesforce extensions see sfdx-project.json, the expected metadata exists, and origin points to your personal repository.

**Common mistake:** Opening only force-app, generating over the starter, or pushing learner solutions into the shared teaching repository.

**Visual guide:** Repository root → starter/salesforce → sfdx-project.json and force-app; submission evidence is a sibling folder.

Official references: [Reference 1](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), [Reference 2](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_template_generate_project.html).

## 6. Connect a training Salesforce org

**Outcome:** Authorize the intended environment and use its alias explicitly.

Browser login creates a local authenticated CLI connection. A Developer Edition normally uses the production login endpoint; a sandbox normally uses the sandbox endpoint or its verified My Domain. Choose the command matching your environment rather than running both. Never share the resulting authentication files with the reviewer.

1. Create or select a separate training org and identify its login type.
2. Run the appropriate browser-login command below.
3. Check the browser domain and username before completing authorization; keep passwords and tokens off recordings.
4. Use sf org list and sf org open --target-org sam-training to verify which org the alias opens.
5. Keep .sf, .sfdx, access tokens, and authentication URLs out of commits, uploads, and public evidence.

### Commands

**Developer Edition: browser login** (all)

```text
sf org login web --alias sam-training --instance-url https://login.salesforce.com
```

**Sandbox: alternative browser login** (all)

```text
sf org login web --alias sam-training --instance-url https://test.salesforce.com
```

**Connected environments** (all)

```text
sf org list
```

**Open the intended org** (all)

```text
sf org open --target-org sam-training
```


**Verify:** The alias opens the intended training org, whose identity you verified independently.

**Common mistake:** Trusting an alias name without checking its actual org, or using a client production environment for the exercise.

**Visual guide:** The status bar and explicit CLI target identify the selected environment; the browser verifies it.

Official references: [Reference 1](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_org_login_web.html), [Reference 2](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-cli-usernames-orgs.html).

## 7. Deploy the starter metadata

**Outcome:** Transfer the selected schema to the training org and inspect the result.

Deploy moves selected local metadata into Salesforce. For a fresh org, the reviewed starter is the baseline. For an org containing earlier coursework, first retrieve and reconcile its metadata: the original starter disables Activities and can overwrite object settings you changed in the browser. Deployment does not create sample data or automatically assign permission sets. Run the commands from starter/salesforce and choose the path matching your environment.

1. Identify whether this is a fresh org or an existing browser-built course org. Inspect the local Git state and preserve unrelated work.
2. For an existing course org, retrieve Vehicle and Test Drive metadata before deploying. Review the diff, preserve enabled Activities and added fields, and retrieve your relevant Flow and permission metadata separately by their actual names or through Org Browser.
3. For a fresh org, review the starter objects and permission set. For an existing org, finish reconciling the retrieved configuration and select only the intended changes.
4. Run the reviewed deployment with --target-org sam-training and wait for its final result. Do not blindly deploy the original starter over completed browser lessons.
5. Open Setup → Object Manager and verify fields, relationships, sharing, and Activities settings. Inspect SAM_Lab_Basics and assign it only to the intended training persona when required.
6. Create synthetic records and navigation tabs/app as the assignment requires. These are separate from metadata deployment and record sharing.

### Commands

**Existing course org: retrieve object metadata before reconciliation** (all)

```text
sf project retrieve start --metadata CustomObject:Vehicle__c --metadata CustomObject:Test_Drive__c --target-org sam-training
```

**Deploy reviewed metadata after the appropriate fresh-org or reconciliation path** (all)

```text
sf project deploy start --source-dir force-app --target-org sam-training --wait 10
```


**Verify:** Expected objects and fields exist; previously enabled Activities and course configuration remain intact. The intended persona can create the synthetic record, and the diff contains no unintended overwrite.

**Common mistake:** Blindly deploying the original starter over browser-built coursework, or treating a green deploy as proof of data, permission assignments, and sharing.

**Visual guide:** Files → CLI deployment → org metadata; data creation and permission assignment are separate actions.

Official references: [Reference 1](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project_deploy_start.html), [Reference 2](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-develop-any-org.html).

## 8. Retrieve a controlled change from the org

**Outcome:** Bring back one configuration change and explain its file diff.

Retrieve moves metadata from Salesforce to local files. Before retrieving, inspect and preserve local work because incoming metadata can overwrite it. A narrow retrieve keeps the diff understandable. This is different from Git pull, which integrates repository history rather than reading Salesforce configuration.

1. Make one deliberate Vehicle field change in Setup as part of J-L01.
2. Inspect git status and save or commit relevant local work before retrieval.
3. Retrieve only the teaching object using the command below.
4. Open Source Control and review each changed file. Explain how the XML change corresponds to the field you changed.
5. Keep unrelated retrieved metadata out of the assignment commit.

### Commands

**Check local changes** (all)

```text
git status
```

**Retrieve only the teaching object** (all)

```text
sf project retrieve start --metadata CustomObject:Vehicle__c --target-org sam-training
```

**Inspect the diff** (all)

```text
git diff
```


**Verify:** The local diff contains the intended field change, and you can explain its effect in the org.

**Common mistake:** Retrieving the whole org, overwriting local edits, or assuming retrieve also saved a Git commit.

**Visual guide:** Retrieve: org → files. Deploy: files → org. Commit: file history.

Official references: [Reference 1](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project_retrieve_start.html), [Reference 2](https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/org-browser.html).

## 9. Run Apex tests and investigate a failure

**Outcome:** Check actual assertions and use focused logs to understand a failed operation.

Complete J-L04 before this step: the starter itself contains no TestDriveStatusServiceTest class. The example command targets the test class you implement there. A test result should show the final pass/fail status and assertions; coverage alone does not establish correctness. If the CLI returns only a run ID, obtain the final result before claiming completion.

1. Open your J-L04 test and identify an assertion protecting a business rule.
2. Run the test class and wait for its final result.
3. Temporarily break the protected rule in your own training branch and verify that the relevant assertion fails; restore the implementation afterward.
4. Use a focused Debug Log to locate the relevant failure. Stop log tailing with Ctrl+C.
5. Remove secrets and personal data from evidence. Record whether the result came from a real org run or a local/static check.

### Commands

**Run the J-L04 test class** (all)

```text
sf apex run test --class-names TestDriveStatusServiceTest --target-org sam-training --result-format human --wait 10 --code-coverage
```

**Tail logs for your training operation** (all)

```text
sf apex tail log --target-org sam-training
```


**Verify:** Assertions pass for the correct implementation and fail for the intended mutation; the explanation identifies the cause rather than merely copying the error text.

**Common mistake:** Submitting 100% coverage as proof of correctness or treating an asynchronous run ID as a completed test.

**Visual guide:** Pass/fail, assertion message, and coverage are different signals; highlight the protected behavior.

Official references: [Reference 1](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_apex_run_test.html), [Reference 2](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_apex_tail_log.html).

## 10. Submit files or a pull request for review

**Outcome:** Give the reviewer a focused change, reproducible instructions, and evidence for the submitted version.

Select the assignment in the portal and attach the permitted files or a PR URL. A PR supports history and inline comments; create it from your branch into main of your personal copy. Public PRs are public evidence, while portal uploads are intended for you and the reviewer. Personal email and optional Skool profile information belong in the portal profile, not the public repository.

1. Prepare only the assignment's metadata, tests, README, and safe evidence. Exclude authentication files, customer data, and full-org exports.
2. For the GitHub path, create submission/J-L01 before editing. Review git diff and stage only the intended files; the commands below assume you are inside starter/salesforce.
3. Fill starter/submissions/J-L01/submission.json from its template with the assignment, environment/API, checks, limitations, and review question.
4. For files, use the portal's allowed formats and clear labels such as metadata, test results, and README. For GitHub, push your branch and create a PR into main of the same personal repository.
5. Verify the assignment ID, description, current files or PR URL, and submit the review request. Uploading a file is not an automatic pass.
6. After feedback, update the same work with a short explanation. Reuse the PR branch or attach the current file version. GitHub issues are an optional fallback, not a required step.

### Commands

**Create an assignment branch** (all)

```text
git switch -c submission/J-L01
```

**Review changes** (all)

```text
git diff
```

**Stage the intended metadata from the DX folder** (all)

```text
git add force-app
```

**Stage the submission card from the DX folder** (all)

```text
git add ../submissions/J-L01/submission.json
```

**Review the staged diff** (all)

```text
git diff --cached
```

**Commit the work** (all)

```text
git commit -m "Complete J-L01 data model"
```

**Push your branch** (all)

```text
git push -u origin submission/J-L01
```


**Verify:** The review request points to the right assignment and current solution, with matching test evidence and reproducible instructions.

**Common mistake:** Treating upload as approval, attaching only a result screenshot, or publishing credentials and personal information.

**Visual guide:** Changes + tests → files or PR URL → personal SAM review request → reviewer comments → revised version.

Official references: [Reference 1](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request), [Reference 2](https://docs.github.com/en/get-started/using-git/about-git), [Reference 3](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

