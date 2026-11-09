# Northstar Motors Agentforce demo action

This separate DX add-on uses API 68.0. First deploy or reconcile the core starter/salesforce model in the same dedicated training org. The complete lesson is in data/agentforce.json and docs/agentforce-lesson.md.

SAMDemoSlotCatalog is a read-only Apex invocable action. It queries Vehicle__c by an exact Model__c visible to the running user and returns two artificial slots for the next UTC calendar date: 10:00 and 14:00 UTC. It does not contact an external calendar, reserve a vehicle, or create records.

The lesson explains how to create Booking_Key__c and Duration_Minutes__c, a booking Flow, and a Case-handoff Flow. Those Flow are not included as completed metadata; build and verify them using chapters 4–5 before activating the agent.

From this folder, after authorizing the intended org and granting the required Vehicle permissions:

```text
sf project deploy start --source-dir force-app --target-org sam-training --wait 10
sf apex run test --class-names SAMDemoSlotCatalogTest --target-org sam-training --result-format human --wait 10 --code-coverage
```

The code and tests are supplied, but were not compiled or executed in Salesforce during portal authoring. JSON/XML validation does not replace deployment and Apex tests.

The action uses WITH USER_MODE. Repair missing CRUD/FLS through the intended minimal permissions rather than switching to system mode. The system-mode DML in test setup creates synthetic test records only. The tests do not establish the full restricted-user behavior of your agent or Flow.

The slot catalog is ordinary deterministic code that runs during the live demonstration. It is not HttpCalloutMock: HTTP mocks affect Apex unit tests and cannot control a live UI conversation.

Use a clean core training environment for the main lesson. Flow and validation from other assignments can change its behavior; review them before reusing an existing org. The full lesson includes employee access, Flow fault paths, required confirmation, repeated booking, and the limitations of the minimal Case handoff.
