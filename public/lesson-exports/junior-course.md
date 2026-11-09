# What a CRM Does for a Business

J01 · junior · About 35 minutes with practice

![Two drawn colleagues sharing a customer record, conversation and calendar](https://sam-portal-production.up.railway.app/lesson-images/J01.jpg)

Follow one customer request and discover why a team needs shared information, clear responsibility, and a next action.

## Before you begin

- No previous CRM or Salesforce experience is required.

## What you will learn

- Explain why a team needs shared customer context.
- Distinguish history from future work.
- Describe a next action with an owner and a due time.

## 1. Start with a conversation

Northstar Motors is our fictional car dealership: a business that helps people choose and buy cars. Irina is interested in a vehicle and asks whether she can try driving it before deciding. That short trial is a test drive. Anna is a salesperson. Her job is to answer Irina's questions, find a suitable vehicle, and arrange the next step. A customer is the person receiving help from the business; in this lesson that includes someone who has not bought anything yet.

Anna learns that Irina wants a blue car and can speak tomorrow afternoon. She writes a telephone number on a piece of paper. The next day Anna is away. Max, another salesperson, takes over. He has the number but does not know what Anna promised. Calling immediately could mean repeating questions, offering the wrong vehicle, or missing an agreed appointment. This is an information problem before it is a software problem.

> **💡 Key idea**
>
> Begin with what people need to know and do. A software feature is useful when it improves that work.

## 2. Separate history, responsibility, and the next action

CRM stands for customer relationship management. A CRM system is software that helps a business keep useful information about customers and its work with them. The useful information is more than a directory of names. Northstar needs the request, previous conversations, agreements, and the work still to be done. Salesforce provides CRM products; we will introduce it separately in J02.

History describes something that already happened: Anna discussed the blue vehicle on Monday. A next action describes work that has not happened: call Irina on Tuesday afternoon. Responsibility names the person who should do it: Max. A due time makes the promise concrete. These ideas are related, but one does not replace another. Writing 'customer called' does not tell Max what to do next.

Oleg manages the sales team. He needs to notice requests with no responsible person and promises that have become overdue. In our example, the shared information helps him assign work without interrupting every salesperson. We are describing a proposed working process, not claiming that an unconfigured CRM automatically knows these facts.

> **🔎 Check your understanding**
>
> Can Max continue the conversation using the information you wrote, without asking Anna to explain it again?

## 3. Work through the handover

Make a small handover note before opening any software. Use fictional details only. Do not invent a confirmed appointment: Irina has asked about a test drive, but a time has not yet been agreed. Distinguishing an enquiry from a commitment prevents a persuasive-looking screen from hiding an inaccurate business record.

A spreadsheet can also support a small team. The question is whether the chosen system reliably supports its actual process, including related information, updates, and appropriate access. A CRM cannot repair information nobody entered. A useful developer therefore asks which facts matter, who supplies them, and how the team will check they stay accurate.

> **⚠️ Watch out**
>
> Do not mark an appointment as confirmed just because a customer expressed interest.

### Step 1: Capture the request

Write Irina, blue vehicle, and request for a test drive. Use a fictional contact method.

> **🔎 Check your understanding**
>
> Expected result: A colleague can identify the customer and the request.

### Step 2: Record the promise

Write: Max will call on Tuesday afternoon to agree a time.

> **🔎 Check your understanding**
>
> Expected result: The note separates the action, owner, and due time.

### Step 3: Test the handover

Ask a partner to explain the next step using only your note.

> **🔎 Check your understanding**
>
> Expected result: Any missing detail becomes a specific question rather than an assumption.

## ⚡ Independent practice: Prepare a customer handover

Anna will be absent tomorrow. Prepare a short note that lets Max continue helping Irina.

1. Describe the request and one completed conversation.
2. Name the next action, responsible person, and due time.
3. List one unanswered question and explain who should answer it.

### Your work is ready when

- The note distinguishes a request from a confirmed test drive.
- Another person can state what happens next without guessing.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is a telephone number insufficient?

**Answer:** It identifies a contact method, but does not explain the request, earlier commitments, or the next action.

### 2. Does storing a note automatically assign responsibility?

**Answer:** No. The working process must explicitly identify who owns the next action.

### 3. Must Northstar choose software before describing its process?

**Answer:** No. Understanding the people, information, and decisions makes the software choice and configuration more meaningful.

## What to take away

- Explain why a team needs shared customer context.
- Distinguish history from future work.
- Describe a next action with an owner and a due time.

## Sources and further reading

- [Salesforce CRM basics](https://trailhead.salesforce.com/content/learn/modules/lex_implementation_basics/lex_implementation_basics_welcome)


---

# Salesforce Products, the Platform, and Your Org

J02 · junior · About 35 minutes with practice

![A drawn salesperson, administrator and developer around a single application workspace](https://sam-portal-production.up.railway.app/lesson-images/J02.jpg)

Distinguish a product, an application, and an org while learning who uses and changes Salesforce.

## Before you begin

- No previous CRM or Salesforce experience is required.

## What you will learn

- Distinguish product, platform, application, and org.
- Describe user, administrator, developer, and business-owner responsibilities.
- Separate administrator configuration from ordinary-user testing.

## 1. A product solves a category of work

Salesforce is both a company name and the name people use for its family of business software. A company can use Salesforce products to support work such as sales or customer service. A product provides a collection of capabilities for a particular purpose. This does not mean every Salesforce customer owns every product or sees the same features.

Northstar's salespeople need customer details and follow-up work. Its support staff need to track customer problems. A ready-made product can provide a starting point. Northstar may still need changes to match how it arranges test drives. A developer should first understand the available capabilities instead of assuming that every requirement needs a new program.

> **💡 Key idea**
>
> Ask what the company has purchased and enabled. The word Salesforce alone does not describe an exact feature set.

## 2. The platform and an individual environment

The Salesforce platform provides tools for storing data, controlling access, creating applications, and adding business behaviour. An application brings together screens and functions used for a task. Some changes can be made using configuration: settings chosen through the interface. Others require code: written instructions that a programming language can execute. Both approaches still need clear requirements and testing.

An org, short for organization, is a separate Salesforce environment containing its own data, users, and configuration. A user is an account through which a person signs in. Northstar's working org is distinct from your personal learning org. Creating a learning org does not grant access to an employer's customer information.

One org can contain several applications. Anna might use a sales application while a support employee opens a service application. Changing application changes the working interface; it does not necessarily change org. Similarly, being able to open an application does not automatically grant access to every record shown in it. Later lessons distinguish the layers of permission.

> **🔎 Check your understanding**
>
> If Anna switches applications but stays in the same environment, has Northstar created a second copy of its customer database? Explain why that does not follow.

## 3. People and responsibilities

Anna and Max use the system to carry out sales work. Oleg defines the team's needs and checks whether the result helps the business. A Salesforce administrator changes configuration, manages access, and maintains the application. A Salesforce developer writes and maintains code when the solution needs it. These are responsibilities, not rigid boundaries: a developer also uses configuration, and a small team may combine several jobs.

Consider two requests. 'We need a place to store the preferred callback time' may be satisfied by adding a field. 'We need current stock from a separate inventory system' requires investigation of a data exchange. Neither request should be assigned solely because it contains a technical-sounding word. The team must understand the expected behaviour, existing features, and ownership of the source information.

For this course you will temporarily perform several responsibilities in your own learning org. Keep them conceptually separate. Configuring access as an administrator is not proof that an ordinary salesperson can use the resulting feature.

> **⚠️ Watch out**
>
> Your learning administrator account has broad privileges. Its successful test does not prove a salesperson has the intended access.

### Step 1: Name the environment

Write down the org you intend to use for learning, separately from any work environment.

> **🔎 Check your understanding**
>
> Expected result: You can explain where experiments belong.

### Step 2: Assign responsibilities

For each request, identify the business decision-maker, configuration work, and any coding work.

> **🔎 Check your understanding**
>
> Expected result: Unclear ownership becomes a question for Oleg rather than an invented requirement.

## ⚡ Independent practice: Assign five pieces of work

Northstar needs a new field, a customer note, an access change, a useful management report, and a stock-system connection.

1. Identify who uses the result of each request.
2. Suggest who clarifies, configures, or develops it.
3. Explain one responsibility that two roles may share.

### Your work is ready when

- An application is not confused with an org.
- The proposed developer work includes understanding requirements and testing, not just writing code.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What is an org?

**Answer:** A separate Salesforce environment containing data, users, and configuration.

### 2. Does a developer always need to write code?

**Answer:** No. Configuration or an existing feature may satisfy the agreed requirement.

### 3. Does changing application necessarily change org?

**Answer:** No. Multiple applications can exist inside one org.

## What to take away

- Distinguish product, platform, application, and org.
- Describe user, administrator, developer, and business-owner responsibilities.
- Separate administrator configuration from ordinary-user testing.

## Sources and further reading

- [Salesforce architecture](https://trailhead.salesforce.com/content/learn/modules/starting_force_com/starting_understanding_arch)
- [Salesforce CRM basics](https://trailhead.salesforce.com/content/learn/modules/lex_implementation_basics/lex_implementation_basics_welcome)


---

# Create and Reopen a Learning Org

J03 · junior · About 35 minutes with practice

![A small separate training workspace in a protective outline beside a larger company workspace](https://sam-portal-production.up.railway.app/lesson-images/J03.jpg)

Use a browser to create a personal Salesforce learning environment and verify that you can return to the same one.

## Before you begin

- J01 and J02: the Northstar example and the difference between Salesforce products, the platform, and an org.
- A browser and access to a personal Trailhead account.

## What you will learn

- Distinguish Trailhead from a Salesforce org.
- Create and reopen a named learning environment.
- Keep sign-in details out of submitted evidence.

## 1. Know which account opens which place

Trailhead is Salesforce's learning website. It contains explanations and exercises. A Trailhead Playground is a Salesforce org intended for hands-on learning. Signing in to Trailhead opens the learning website; launching a Playground opens Salesforce itself. They are connected experiences, but they are not the same screen or the same set of stored information.

For this lesson you need a browser and a way to sign in to Trailhead. You do not need Visual Studio Code, a terminal, or programming experience. We introduce those tools when they have a purpose. Use a personal learning environment rather than an employer's working org, and use fictional customers. Northstar is an invented company, not an account you need to obtain from someone else.

> **💡 Key idea**
>
> The first technical skill is knowing where you are working and how to reopen it.

## 2. Create an identifiable Playground

Open the official Playground creation lesson linked below and sign in to Trailhead. A hands-on challenge is an exercise that checks work in a selected Salesforce org. Near its Launch control, you can choose an existing org or create a Playground. Interface labels can change slightly; identify the create, select, and launch actions by their purpose.

Give the environment a recognizable name such as SAM Beginner. Wait for creation to finish, then select that environment before launching it. Salesforce opens in another browser tab. If nothing opens, inspect the browser's blocked-pop-up notice before trying repeated creation. Accidentally making several similar environments makes it harder to know where your work lives.

A newly created org may contain sample records and applications. Those records are not Northstar's finished project. The Northstar objects are introduced through configuration or the starter project later. Not seeing Vehicle on your first visit is therefore expected. Do not install an unrelated package just to make the interface resemble a later lesson.

> **⚠️ Watch out**
>
> A normal Playground is not a promise of every paid product or Agentforce capability. Specialized lessons state their own environment requirements.

### Step 1: Sign in to the learning website

Open Trailhead and use your chosen sign-in method.

> **🔎 Check your understanding**
>
> Expected result: You can access your learning profile.

### Step 2: Create or select the org

Find the hands-on org selector, create SAM Beginner if necessary, and wait for readiness.

> **🔎 Check your understanding**
>
> Expected result: The selector identifies the environment you intend to use.

### Step 3: Launch Salesforce

Select that org and choose Launch; allow the new tab if the browser blocks it.

> **🔎 Check your understanding**
>
> Expected result: A Salesforce page opens without needing development tools.

### Step 4: Inspect without changing

Locate App Launcher, an available application, and Setup if your learning account permits it.

> **🔎 Check your understanding**
>
> Expected result: You recognize the areas introduced in J04.

## 3. Prove that the environment is yours to revisit

Close the Salesforce tab and launch the same Playground again from Trailhead. Check the selected environment name before launching. Two environments may look almost identical, so visual similarity alone is not sufficient evidence. Record the environment's friendly name and the route you used to reopen it in a private learning note.

A Salesforce username and a contact email can be different. Do not guess credentials or publish them in an assignment screenshot. Trailhead provides a separate lesson for obtaining Playground credentials when a later tool requires them. For today's browser route, successfully reopening the selected org is the important result.

Developer Edition is another kind of environment commonly used for learning and development. If you already have one, discuss whether it fits the upcoming exercises rather than assuming every environment is interchangeable. A new beginner can follow the Playground route consistently. If an application is unavailable, note its absence and ask a precise question; changing random settings is not part of this exercise.

> **🔎 Check your understanding**
>
> Can you close the tab, select the named environment again, and explain why it is separate from an employer's org?

## ⚡ Independent practice: Record a repeatable entry route

Prepare a short environment note that helps you resume learning tomorrow.

1. Launch the same org twice.
2. Record its friendly name and your navigation route.
3. Record the first Salesforce page you see; omit credentials. You will explore its navigation in J04.

### Your work is ready when

- The note identifies one learning environment consistently.
- No passwords, authentication files, or real customer details appear in the evidence.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Is VS Code required for this lesson?

**Answer:** No. A browser and a learning org are enough.

### 2. Why can two orgs look alike?

**Answer:** They may use the same interface and sample configuration while containing separate data.

### 3. Does a Playground include every Salesforce product?

**Answer:** No. Product availability and special lesson requirements must be checked separately.

## What to take away

- Distinguish Trailhead from a Salesforce org.
- Create and reopen a named learning environment.
- Keep sign-in details out of submitted evidence.

## Sources and further reading

- [Create a Trailhead Playground](https://trailhead.salesforce.com/content/learn/modules/trailhead_playground_management/create-a-trailhead-playground)
- [Playground credentials](https://trailhead.salesforce.com/content/learn/modules/trailhead_playground_management/get-your-trailhead-playground-username-and-password)


---

# Finding Your Way Around Salesforce

J04 · junior · About 35 minutes with practice

![One clean application window opening into a list and a single record card](https://sam-portal-production.up.railway.app/lesson-images/J04.jpg)

Recognize an application, navigation item, list, record page, and Setup without assuming previous Salesforce use.

## Before you begin

- J03: a personal learning org that you can launch from Trailhead.

## What you will learn

- Navigate from an application to a list and a record.
- Recognize Setup as configuration.
- Investigate a view before assuming a record is missing.

## 1. Understand the screen before changing it

An interface is the collection of pages, menus, fields, and controls through which a person uses software. Lightning Experience is Salesforce's main modern desktop interface. Your learning org may show different applications or labels from an illustration because its language, configuration, and permissions can differ. We will explain the purpose of each area rather than rely on a pixel-perfect screenshot.

The App Launcher, commonly shown as a grid of dots, helps you find available applications and items. Search for Sales to open a sales workspace if it is available. The application name helps you recognize where you are. Its navigation items lead to areas such as Contacts. A contact is information about a person; we will examine the underlying data model in J05 and J07.

> **⚡ Try it**
>
> Before every exercise, identify the org and application you are using. This avoids changing the right thing in the wrong place.

## 2. Move from several records to one record

A record is information about one specific item, such as one person or one test drive. A list shows several records so that you can find and compare them. A list view is a selected way of displaying that list, often with conditions that determine which records appear. 'Recently Viewed' is therefore not a promise to display every contact in the org.

Suppose Anna wants Irina's telephone number. She opens Contacts, finds the appropriate person, and opens the record. The record page presents information about that one contact. A Details area commonly displays field values, while Related presents associated information where the page supports it. The list and the record page are different views of the same stored information, not separate copies of the person.

If Irina is absent from one list, first inspect the selected view and its conditions. A missing row can mean that the view excludes it, that your access excludes it, or that no matching record exists. Immediately creating another Irina may produce a duplicate. Searching and explaining the current view is a better first move.

> **🔎 Check your understanding**
>
> Explain which question a list answers and which question a record page answers.

## 3. Keep configuration separate from daily work

Setup is the configuration area of Salesforce. When permitted, you can reach it through the gear menu. It is where an administrator manages features such as users and object definitions. Entering a telephone number for one customer is everyday data work. Adding a new kind of field to store telephone numbers is a configuration change that can affect many records.

A missing Setup option can reflect permissions. A missing application may reflect availability or configuration. Do not assume a broken installation or ask for broad access before understanding the symptom. At this stage, your goal is to recognize the route and describe what you see. You are not expected to troubleshoot every permission or customize every page.

Write a short navigation diary. Describe where you started, the item you selected, and the information you expected. This habit becomes useful when reporting a bug: 'I cannot find the record in Recently Viewed' is much more precise than 'Salesforce is broken.'

> **⚠️ Watch out**
>
> Do not change unfamiliar settings merely to make your screen match a screenshot.

### Step 1: Find an application

Use App Launcher to locate Sales, or record the available application names if it is absent.

> **🔎 Check your understanding**
>
> Expected result: You can identify an application and its navigation.

### Step 2: Compare two pages

Open a list of sample contacts and then one sample record.

> **🔎 Check your understanding**
>
> Expected result: You can distinguish the collection from a single item.

### Step 3: Locate Setup

Find the gear menu and Setup in your own learning org, if permitted.

> **🔎 Check your understanding**
>
> Expected result: You can identify configuration without changing it.

## ⚡ Independent practice: Draw Anna's route

Create a simple map showing how Anna finds a customer and where an administrator changes configuration.

1. Include App Launcher, application, navigation item, list, and record page.
2. Mark Setup as a separate configuration route.
3. Describe why a missing row in a filtered list does not prove deletion.

### Your work is ready when

- Each interface area has a plain-language purpose.
- The map distinguishes navigation, stored data, and configuration.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does Recently Viewed contain every record?

**Answer:** No. It is a particular list view, not a complete inventory of all accessible records.

### 2. Where should Anna read one customer's telephone number?

**Answer:** On that customer's record page, provided the field and record are accessible.

### 3. Why might Setup be unavailable?

**Answer:** The signed-in user may lack permission; the absence is not by itself evidence of a software failure.

## What to take away

- Navigate from an application to a list and a record.
- Recognize Setup as configuration.
- Investigate a view before assuming a record is missing.

## Sources and further reading

- [Navigate Salesforce and Setup](https://trailhead.salesforce.com/content/learn/modules/lex_implementation_basics/lex_implementation_basics_setup)
- [Work with lists and records](https://trailhead.salesforce.com/content/learn/modules/lex_salesforce_basics/lex_salesforce_basics_getting_started)


---

# Objects, Fields, and Records

J05 · junior · About 35 minutes with practice

![Three neatly stacked record cards with aligned property rows and one highlighted field](https://sam-portal-production.up.railway.app/lesson-images/J05.jpg)

Use a small vehicle catalogue to distinguish the shape of information from individual stored items.

## Before you begin

- J01–J04: the business example, your learning org, and basic navigation.

## What you will learn

- Distinguish objects, fields, records, and values.
- Read the starter's principal API names.
- Explain why an event needs its own record.

## 1. One catalogue, several vehicles

Northstar needs to keep information about vehicles it can offer customers. An object describes a kind of information stored in Salesforce. Our example is Vehicle. A field describes one property of that kind of item, such as Model or Status. A record stores the values for one particular vehicle. Two physical vehicles require two records, even if their models are identical.

Imagine a table with Model, VIN, and Status as column headings. Each row describes a vehicle. The table is a useful analogy for an object, the column headings resemble fields, and the rows resemble records. The analogy helps you read the structure; it does not mean Salesforce is simply a spreadsheet or that every application must be designed as one large table.

> **💡 Key idea**
>
> An object describes a category. A record represents one member of that category.

## 2. Separate a field definition from its value

The course starter uses Vehicle__c, with Model__c, VIN__c, and Status__c. The __c suffix identifies a custom object or field in these API names. An API name is the identifier used by configuration files and code; the visible label is the name a user reads. For now, recognize the distinction without memorizing every naming rule.

Model__c is a text field. 'City EV' is one possible value. Status__c is a picklist: a field offering a defined set of choices. In the starter those choices are Available, Reserved, and Unavailable. VIN__c is text with a uniqueness constraint in this educational schema. A constraint is a rule the system applies to stored data. We use fictional identifiers, not real vehicle or customer information.

When a third vehicle arrives, Anna creates another record. When Oleg decides every vehicle needs a mileage value, the team considers adding a field. Adding the field does not automatically discover each vehicle's mileage. Someone must supply the values or define a reliable source. Confusing these two changes leads to duplicate objects and missing business information.

> **🔎 Check your understanding**
>
> Point to a field name and a field value in your drawing. They should not be the same concept.

## 3. Introduce relationships carefully

A test drive is a separate event involving a vehicle and a customer. Northstar may run several test drives for the same vehicle on different days. Copying the entire vehicle description into every event would make updates difficult. A relationship instead points from one record to another, allowing the event to identify its vehicle.

The starter Test_Drive__c object includes Vehicle__c, a relationship to a vehicle; Customer__c, a relationship to Contact; Scheduled_At__c, a date and time; and Status__c, the event's status. The vehicle's availability and the test drive's progress answer different questions. A vehicle can be Available while one earlier test drive is Completed. Do not merge those status fields into one shared meaning.

You do not need to configure the relationship yet. J09 explains its behaviour. Today's task is to describe which information belongs to a vehicle and which belongs to a particular appointment, and to notice why one item can participate in many events.

> **⚠️ Watch out**
>
> These are the course starter's design choices, not a universal automotive data model.

### Step 1: Create two paper records

Draw two vehicle cards with different fictional VIN values and the same field names.

> **🔎 Check your understanding**
>
> Expected result: The cards share a structure but identify different vehicles.

### Step 2: Add one event

Draw a test-drive card and an arrow to one vehicle card.

> **🔎 Check your understanding**
>
> Expected result: The event refers to the selected vehicle rather than duplicating the whole catalogue.

### Step 3: Classify a change

Describe adding another vehicle, then adding a mileage field.

> **🔎 Check your understanding**
>
> Expected result: You distinguish a data change from a structure change.

## ⚡ Independent practice: Model the smallest useful catalogue

Create a diagram containing two vehicles and three test-drive events.

1. Write the field names once for each object.
2. Give each vehicle a distinct fictional identifier.
3. Connect two events to the same vehicle on different days.

### Your work is ready when

- Objects, fields, values, and records are labelled correctly.
- Vehicle status is distinct from test-drive status.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Is City EV a field?

**Answer:** No. It is a possible value of the Model field.

### 2. Does every physical car need a different custom object?

**Answer:** No. It needs a separate record in the Vehicle object.

### 3. Why separate a test drive from a vehicle?

**Answer:** A vehicle can take part in several events with different customers, dates, and outcomes.

## What to take away

- Distinguish objects, fields, records, and values.
- Read the starter's principal API names.
- Explain why an event needs its own record.

## Sources and further reading

- [Understand objects](https://trailhead.salesforce.com/content/learn/modules/data_modeling/objects_intro)


---

# Turn a Request into a Testable Task

J06 · junior · About 35 minutes with practice

![A simple request card becoming three concrete checklist steps beside a drawn learner](https://sam-portal-production.up.railway.app/lesson-images/J06.jpg)

Clarify who needs a feature, what information it uses, and how you will know it works before choosing a tool.

## Before you begin

- No previous CRM or Salesforce experience is required.

## What you will learn

- Describe a requirement in terms of people and outcomes.
- Separate scope, assumptions, and implementation choices.
- Write acceptance criteria for valid and invalid cases.

## 1. A short request contains unanswered decisions

Oleg asks, 'Please add test-drive booking to Salesforce.' This expresses a useful direction, but it is not yet a complete task. Who makes the booking? What information is required? What does booking mean: recording a request, reserving a vehicle, or confirming a customer appointment? These choices affect the data, permissions, and behaviour that the team will eventually build.

Start with the people. Anna needs to record the vehicle and time agreed with Irina so that Max can host the appointment when Anna is away. Anna is the user of this proposed function; Irina is the customer receiving the service. The request does not imply that Irina needs a Salesforce login. Separating the person using the screen from the person affected by the business outcome prevents an unnecessary external portal.

> **💡 Key idea**
>
> A useful requirement explains the person, the needed outcome, and why it matters.

## 2. Ask questions in a workable order

First identify the information. Does the vehicle already exist in the catalogue? How is the customer identified? Which time zone does the team use? Then identify the actions: can Anna create, change, confirm, and cancel the appointment? Finally investigate exceptional situations: a vehicle becomes unavailable, a time is already occupied, or Irina changes her mind.

Do not quietly invent answers. Write unknowns as questions and proposals as proposals. Oleg might decide that the first version simply records an appointment after a salesperson checks availability manually. Automatic calendar coordination would then be a later feature. That is a legitimate small scope when it is agreed and described honestly.

Scope is the boundary of the current task. For our first booking feature, an agreed scope might include a vehicle, customer, scheduled time, and appointment status. It might exclude payment, vehicle ownership transfer, and automated reminders. Stating the exclusions helps a reviewer understand what the exercise is intended to demonstrate, without pretending those business needs never exist.

> **⚡ Try it**
>
> Keep an assumptions list next to the task. Give each unresolved decision an owner who can answer it.

## 3. Define evidence of success and failure

Acceptance criteria are conditions used to decide whether the agreed behaviour has been delivered. 'Make booking easy' is too ambiguous to test on its own. 'Anna selects an existing vehicle and future time, saves the appointment, reopens it, and sees the same values' describes observable actions and results. A reviewer can repeat that scenario.

Also describe an invalid case. For example, propose that an appointment without a vehicle cannot be confirmed, and that the interface explains what is missing. This is a proposed rule until Oleg agrees. Distinguish that requirement from an implementation suggestion such as 'use a validation rule.' The behaviour should be understood before the team chooses the mechanism.

Finally, think about handover. If Max must conduct the appointment, specify how he identifies the relevant record and whether he may edit it. 'The record exists' is not enough if the intended colleague cannot find it. In later lessons you will implement the data and access choices. Today's deliverable is a clear, small task that another person can understand and test.

> **🔎 Check your understanding**
>
> For each criterion, could two people perform the same steps and agree whether the expected result happened?

### Step 1: Rewrite the request

Name Anna, the information she records, and the business benefit.

> **🔎 Check your understanding**
>
> Expected result: The task describes a person and an outcome.

### Step 2: Identify uncertainty

Write questions about required data, time, cancellation, and Max's access.

> **🔎 Check your understanding**
>
> Expected result: Open decisions remain visible.

### Step 3: Write two acceptance examples

Describe one valid booking and one rejected input using explicit expected results.

> **🔎 Check your understanding**
>
> Expected result: A reviewer can reproduce both cases without interpreting vague adjectives.

## ⚡ Independent practice: Prepare a booking brief

Write a one-page brief for Oleg before creating fields or automation.

1. State the goal and the user.
2. List required information, three unanswered questions, and the current scope.
3. Write one successful and one unsuccessful example.

### Your work is ready when

- Assumptions are visibly different from confirmed requirements.
- Acceptance criteria describe behaviour rather than an unexamined technical solution.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Can an invented restriction be treated as a requirement?

**Answer:** No. Record it as a proposal and ask the decision-maker to confirm it.

### 2. Why identify Max in the task?

**Answer:** Because the handover may require access and a way to find the appointment, not merely record creation.

### 3. What makes an acceptance criterion testable?

**Answer:** Concrete inputs and actions with an observable expected outcome.

## What to take away

- Describe a requirement in terms of people and outcomes.
- Separate scope, assumptions, and implementation choices.
- Write acceptance criteria for valid and invalid cases.

## Sources and further reading

- [Construct a user story and acceptance criteria](https://trailhead.salesforce.com/content/learn/modules/user-story-creation/construct-a-user-story)


---

# Choose Standard Objects Before Creating New Ones

J07 · junior · About 50 minutes with practice

![A restrained row of customer, company, opportunity and support record symbols connected by one path](https://sam-portal-production.up.railway.app/lesson-images/J07.jpg)

Classify customer information using Lead, Account, Contact, Opportunity, and Case, then explain why the course adds two custom objects.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Match standard objects to their purposes.
- Explain the project-specific custom objects.
- Distinguish the classroom model from a complete automotive implementation.

## 1. Match an object to the question it answers

A standard object is supplied by Salesforce for a common category of work. A custom object is a structure a team adds for its own application. Starting with standard objects can preserve useful existing behaviour and familiar terminology. It is not a command to force every business concept into an unsuitable object.

A Lead commonly represents an early prospect whose suitability or next step is still being assessed. An Account commonly represents a business or organization, and a Contact represents a person associated with business relationships. An Opportunity tracks a potential sale, including its progress. A Case tracks an issue or service request that needs resolution. A customer can therefore be associated with several related records that describe different work, rather than being copied into unrelated 'Customer One' and 'Customer Two' objects.

> **💡 Key idea**
>
> Choose the object by the business information it represents, not by which screen looks easiest to customize.

## 2. Follow Irina without forcing a conversion story

Irina asks about a City EV. Northstar might initially capture that enquiry as a Lead if its sales process qualifies enquiries that way. When it identifies a real sales opportunity, the team may maintain a Contact for Irina and an Opportunity for the possible purchase. A Lead is not required before every Opportunity: a salesperson can create an Opportunity for an existing relationship. Lead conversion is one supported process, not the definition of all selling.

After purchase, Irina reports a problem with a charging cable. That issue is a Case, not a new Opportunity merely because it concerns the same person. If she later considers another vehicle, a separate Opportunity can describe that new potential sale. The records represent different events and responsibilities even though they concern one customer.

Salesforce also offers Person Accounts for appropriate business-to-consumer designs. Their availability and adoption require a deliberate data-model decision. This Junior project uses a synthetic Contact because Test_Drive__c.Customer__c is explicitly a Contact lookup. Do not change that field to a different target midway through the labs, or assume the simplified classroom design is the only valid dealership architecture.

> **⚠️ Watch out**
>
> Do not enable a major account-model feature merely to complete this classification exercise. Work within the agreed training schema.

## 3. Explain the two course-specific objects

The course uses Vehicle__c to describe an individual vehicle and Test_Drive__c to describe one requested appointment. Neither is automatically provided just because a Sales application exists. You will inspect or create these structures in your learning org, or use the supplied starter when the development setup guide is complete.

The useful question is whether existing capabilities already represent the requirement accurately. If Oleg wants to track a complaint, Case is worth examining before building a Complaint object. If he needs a distinct educational appointment linked to a vehicle, the course's Test Drive object gives us a clear small model. Explain what you gain and what you take responsibility for when choosing a custom object.

The inspection below is read-only. Sample data may use different names. Record the meanings you observe, and keep them separate from the particular sample records.

> **🔎 Check your understanding**
>
> Can you describe a customer, a possible sale, and a support issue without treating them as the same record?

### Step 1: Inspect the standard objects

In Setup → Object Manager, locate Lead, Account, Contact, Opportunity, and Case. Read their names and available fields.

> **🔎 Check your understanding**
>
> Expected result: You recognize existing structures without creating duplicates.

### Step 2: Classify five stories

Use an unqualified enquiry, a company customer, a contact person, a possible sale, and a charging-cable problem.

> **🔎 Check your understanding**
>
> Expected result: Each story has a reasoned object choice.

### Step 3: Inspect the agreed model

Use the schema list in the next section to identify the two lookups and their targets. If the objects already exist in Object Manager, inspect them rather than creating duplicates.

> **🔎 Check your understanding**
>
> Expected result: The next lesson has a known, matching starting model.

## 4. Prepare the core objects in the browser

This step supplies the objects used from J08 onward. You do not need VS Code or a command line yet. If the starter has already been deployed, compare these definitions and skip creation of matching components. In API names, __c marks a custom object or field. The creation form adds that suffix itself: enter Vehicle in Object Name, not Vehicle__c.

A lookup stores a reference to another record. Here an appointment may point to one vehicle and one Contact. Keep both relationships optional and independent for now; later lessons teach required business information and ownership in detail. Use only fictional practice data.

> **⚠️ Watch out**
>
> Keep these exact API names and picklist values. Later examples reference them. Do not redeploy the unchanged starter over later browser changes: retrieve and reconcile those changes when setting up VS Code.

### Step 1: Create Vehicle

Open Setup → Object Manager → Create → Custom Object. Use Label Vehicle, Plural Label Vehicles, Object Name Vehicle, Record Name Vehicle Name, and Text as its name type. Select Allow Reports, leave Allow Activities off, and set deployment status to Deployed. Save.

> **🔎 Check your understanding**
>
> Expected result: Object Manager shows Vehicle with API name Vehicle__c and a text Name field.

### Step 2: Create its fields

Open Vehicle → Fields & Relationships → New. Add Model as Text, length 80; VIN as Text, length 17, Unique with case-insensitive comparison and External ID; and Status as a Picklist. Enter Available, Reserved, Unavailable on separate lines, use Available as the default, and restrict values to the defined list. Keep these fields optional. Follow Next through field visibility and page-layout selection, then Save each field.

> **🔎 Check your understanding**
>
> Expected result: The API names are Model__c, VIN__c, and Status__c. A duplicate synthetic VIN is prevented.

### Step 3: Create Test Drive

Create another custom object: Label Test Drive, Plural Label Test Drives, Object Name Test_Drive. Choose Auto Number for Record Name Test Drive Number, display format TD-{0000}, starting number 1. Enable reports, leave activities off, and select Deployed. Save.

> **🔎 Check your understanding**
>
> Expected result: Test_Drive__c has an automatically assigned Name; the learner does not type an appointment number.

### Step 4: Create appointment relationships

In Test Drive → Fields & Relationships → New, choose Lookup Relationship, Related To Vehicle, field label Vehicle and field name Vehicle. Keep it optional and choose to clear the field if the related record is deleted. Use Test_Drives as the child relationship name. Finish the visibility/layout screens. Repeat for Related To Contact with label Customer, field name Customer, and child relationship name Test_Drives.

> **🔎 Check your understanding**
>
> Expected result: Vehicle__c refers to Vehicle__c; Customer__c refers to Contact. Neither is Master-Detail.

### Step 5: Create appointment values

Add Scheduled At as Date/Time, field name Scheduled_At. Add a restricted Status picklist with Requested, Confirmed, Completed, Cancelled; default Requested. Keep these fields optional at schema level.

> **🔎 Check your understanding**
>
> Expected result: Scheduled_At__c and Status__c match the lesson examples.

### Step 6: Check the baseline

In Setup → Sharing Settings, edit organization-wide defaults for the two custom objects to Private and save. If external defaults are shown, keep them Private too. Do not change standard-object sharing for this step. In each object inspect Fields & Relationships and the definition just created. J10 creates navigation tabs and the application; J13 explains the private-access baseline in depth.

> **🔎 Check your understanding**
>
> Expected result: Both custom objects keep independent owners and match the starter definitions.

## ⚡ Independent practice: Write an object-selection note

Explain how Northstar should store five different pieces of customer work.

1. Map each story to a standard object and explain your choice.
2. Add Vehicle and Test Drive with one reason for each custom object.
3. Record one question that would require a business decision in a real consumer-sales implementation.
4. Create or inspect the two core objects using the browser steps, and record their API names and relationship targets.

### Your work is ready when

- An Opportunity is not described as requiring a Lead in every process.
- The course Contact lookup and its limits are stated explicitly.
- The learning org contains the core Vehicle and Test Drive schema needed by J08, without duplicate objects.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Is a customer complaint a new sale?

**Answer:** No. A Case is designed to track an issue; a separate sale would be an Opportunity.

### 2. Must every Opportunity start with Lead conversion?

**Answer:** No. Opportunities can also be created for existing relationships.

### 3. Why keep Vehicle and Test Drive separate?

**Answer:** One vehicle can participate in multiple appointments with different customers, dates, and outcomes.

## What to take away

- Match standard objects to their purposes.
- Explain the project-specific custom objects.
- Distinguish the classroom model from a complete automotive implementation.

## Sources and further reading

- [Salesforce CRM objects](https://trailhead.salesforce.com/content/learn/modules/lex_implementation_basics/lex_implementation_basics_welcome)
- [Data-model choices](https://trailhead.salesforce.com/content/learn/modules/data_modeling/objects_intro)
- [Create a custom object](https://trailhead.salesforce.com/content/learn/modules/create-a-custom-object-quick-look/create-a-custom-object)
- [Custom object creation fields](https://help.salesforce.com/s/articleView?id=platform.dev_objectcreate.htm&language=en_US&type=5)


---

# Field Types, Formulas, and Validation Rules

J08 · junior · About 50 minutes with practice

![A record form with a calendar field, a number field and a clear validation check](https://sam-portal-production.up.railway.app/lesson-images/J08.jpg)

Separate entered values, calculated values, and rejected input using concrete appointment examples.

## Before you begin

- J07: the browser-created or deployed Vehicle__c and Test_Drive__c schema is present in your learning org.

## What you will learn

- Distinguish stored, derived, and validated information.
- Target validation to the intended change.
- Test boundaries and missing values.

## 1. Give every field a clear responsibility

Northstar's starter stores Scheduled_At__c as a date and time, and Status__c as a restricted picklist. A date and time describes an instant; a status describes progress. Making both text fields would accept vague values such as 'sometime later' or inconsistent spellings that are difficult to process. A field type defines what sort of information can be stored, but it does not by itself express every business rule.

We will add an optional teaching extension: Duration_Minutes__c, a Number field with three digits and zero decimal places. It is not present in the core starter. Add it deliberately and include it in your submitted metadata. For the exercise, Oleg agrees that entered durations must be between 15 and 120 minutes. This is a classroom requirement, not a general rule about Salesforce or dealerships.

> **💡 Key idea**
>
> A stored value comes from an input or another system. A formula derives a value from information already available.

## 2. Calculate one value and reject a different problem

Create a Date/Time formula field named Planned_End__c. Its value is Scheduled_At__c plus Duration_Minutes__c divided by 1440, the number of minutes in a day. A formula field is calculated rather than edited directly. Guard against missing inputs so that a partial request does not display a misleading end time. Display behaviour follows the user's time settings; test with an explicit time zone in your evidence.

A validation rule rejects a save when its error-condition formula evaluates to true. That direction matters: the formula describes the invalid case. We will reject a newly entered or changed scheduled time that is in the past. We will not block an unrelated update to an old appointment merely because its original appointment time has now passed.

This is different from using Flow to update another record. Use a formula when you need a derived value, a validation rule when you need to reject an invalid save, and automation when you need a business action. Those are starting questions, not a promise that every requirement fits exactly one feature.

> **⚠️ Watch out**
>
> A rule that simply says Scheduled_At__c < NOW() would also reject unrelated edits to historical appointments.

**Planned_End__c: Date/Time formula**

```text
IF(
  OR(ISBLANK(Scheduled_At__c), ISBLANK(Duration_Minutes__c)),
  NULL,
  Scheduled_At__c + (Duration_Minutes__c / 1440)
)
```

**Reject a newly supplied past appointment time**

```text
AND(
  NOT(ISBLANK(Scheduled_At__c)),
  OR(ISNEW(), ISCHANGED(Scheduled_At__c)),
  Scheduled_At__c < NOW()
)
```

## 3. Test boundary cases instead of one happy example

A sensible first example is tomorrow at 14:00 with a duration of 30 minutes. The calculated end should be tomorrow at 14:30 in the same display time zone. Also test 15 and 120 minutes, then 14 and 121. Enter a past scheduled time on a new record and expect the agreed validation message.

To test a historical record without relying on time passing during a lesson, create the record before activating the time rule in an isolated learning exercise. Then activate the rule and edit only its status. The unchanged past time should not trigger this particular rule. Other rules may still apply, so document the configuration rather than assuming an error has only one possible cause.

A common mistake is using page-layout requiredness as if every entry route enforced it. Later lessons compare UI choices and server-side rules. For now, make the intended business constraint explicit, place the error near the relevant field where practical, and use wording that tells Anna how to correct the value.

> **🔎 Check your understanding**
>
> Your evidence should include accepted values and rejected values, not only a screenshot of the formula editor.

### Step 1: Add the teaching fields

Open Setup → Object Manager → Test Drive → Fields & Relationships → New. Choose Number for Duration Minutes, field name Duration_Minutes, length 3, decimal places 0, not required. Finish the visibility/layout screens. Repeat with Formula, field name Planned_End, return type Date/Time, and paste the supplied formula. Use Check Syntax before saving.

> **🔎 Check your understanding**
>
> Expected result: The new field definitions are recorded as project additions.

### Step 2: Add the time validation

In Test Drive → Validation Rules → New, name the rule Future_New_Schedule, enter the supplied time formula and a clear error message, choose Scheduled At as the error location, and save. Prepare the historical fixture before activating the rule, then activate it for the tests.

> **🔎 Check your understanding**
>
> Expected result: Past newly entered times are rejected.

### Step 3: Add the duration rule

Add a validation rule with AND(NOT(ISBLANK(Duration_Minutes__c)), OR(Duration_Minutes__c < 15, Duration_Minutes__c > 120)). Put the message on Duration Minutes. This version allows blank; document that choice. If the business instead requires a value, state and implement that separate requirement.

> **🔎 Check your understanding**
>
> Expected result: The boundary behaviour matches the written agreement.

## ⚡ Independent practice: Create a field-behaviour test table

Give Oleg evidence that the fields accept valid data and explain invalid input.

1. Record inputs and expected outcomes for six boundary cases.
2. Run the cases and capture actual results.
3. Include the formula, rules, and added field definitions in your work.

### Your work is ready when

- A historical appointment can receive an unrelated edit without this time rule blocking it.
- Blank handling and time-zone assumptions are documented.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. When does a validation rule reject a save?

**Answer:** When its error-condition formula is true.

### 2. Why use ISNEW or ISCHANGED here?

**Answer:** The rule targets a newly supplied time rather than all later changes to an old appointment.

### 3. Can Anna directly edit Planned_End__c?

**Answer:** No. Its value is derived from the formula inputs.

## What to take away

- Distinguish stored, derived, and validated information.
- Target validation to the intended change.
- Test boundaries and missing values.

## Sources and further reading

- [Validation rule best practices](https://trailhead.salesforce.com/content/learn/modules/validation-rules/implement-best-practices)
- [Formula fields](https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic/formula_fields)


---

# Choose Lookup or Master-Detail Deliberately

J09 · junior · About 50 minutes with practice

![Two record cards connected by a clean relationship line with a small linked record underneath](https://sam-portal-production.up.railway.app/lesson-images/J09.jpg)

Compare relationship behaviour while preserving independent ownership of the course Test Drive records.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Evaluate relationship consequences before implementation.
- Read the core lookup configuration accurately.
- Isolate destructive experiments from project records.

## 1. A connection also carries behaviour

A relationship is more than a line on a diagram. It affects how records depend on one another and what happens when a related record changes or is deleted. Salesforce supports different relationship types. For this lesson, compare Lookup with Master-Detail. Do not choose between them only because both can display a related record on a page.

A Lookup connects a record to another record while allowing a comparatively independent design. The exact requiredness and deletion behaviour depend on the field configuration and supported object combination. A Master-Detail relationship creates a stronger dependency: the detail's ownership and record access follow the master, and deleting the master also deletes its detail records. Inspect the actual configuration rather than treating all lookups as identical.

> **💡 Key idea**
>
> Before choosing a relationship, ask who owns the child, who may see it, and whether it should survive the parent.

## 2. Read the course relationship as a contract

The core Test_Drive__c.Vehicle__c field is an optional Lookup to Vehicle__c with SetNull deletion behaviour. Test_Drive__c.Customer__c is an optional Lookup to Contact with the same deletion setting. The Test Drive object has its own owner and Private organization-wide default. Those are deliberate starter choices that allow us to teach separate appointment ownership and sharing in J11–J16.

Suppose Anna owns an appointment for a vehicle managed by another employee. A Lookup does not automatically mean every person who can see the vehicle can see Anna's appointment. Equally, the appointment's independent sharing does not grant permission to every field on the related Contact. These access questions must be designed and tested separately.

If the referenced vehicle is deleted in a suitable controlled example, SetNull is intended to clear the relationship rather than make the appointment a master-detail casualty. Business rules or other dependencies can still prevent deletion. In a real application, Oleg may prefer to prevent deletion or retire vehicles instead. Record that as a design discussion; do not silently change the core model while later exercises depend on it.

> **⚠️ Watch out**
>
> Keep the core Test Drive → Vehicle field as Lookup. A temporary Master-Detail experiment belongs on separate disposable objects.

## 3. Compare two small models without damaging your project

Create a disposable pair of objects such as Relationship Demo Parent and Relationship Demo Detail. Use these for the Master-Detail experiment rather than converting the course relationship. Add one parent and two detail records with clearly artificial names. Before deleting anything, predict which records will remain and how ownership will be represented.

For the Lookup comparison, use a separate disposable lookup field or inspect the existing starter configuration, then test only expendable records. Keep a before-and-after record count and the relevant relationship setting. A screenshot of a field type alone cannot prove what happened to the records.

The important outcome is a reasoned decision. 'Master-Detail makes a report easier' is incomplete if it also removes independent ownership that Northstar needs. Conversely, choosing Lookup solely to avoid learning access behaviour misses the point. Model the business dependency, then evaluate the technical consequences. Later requirements can be expensive when a relationship's meaning was never agreed.

> **🔎 Check your understanding**
>
> Can your explanation predict ownership, access dependency, and parent deletion—not just which field appears on the page?

### Step 1: Inspect the core relationship

Open Test Drive → Fields & Relationships → Vehicle and record the type, requiredness, and deletion setting.

> **🔎 Check your understanding**
>
> Expected result: The documented model matches the starter.

### Step 2: Build the disposable comparison

Create separate demo objects and a Master-Detail field on the detail object.

> **🔎 Check your understanding**
>
> Expected result: The core project remains unchanged.

### Step 3: Test a parent deletion

Use only disposable records, record the before state, delete the parent, and inspect the result.

> **🔎 Check your understanding**
>
> Expected result: Your observed outcome can be compared with the prediction.

### Step 4: Clean up deliberately

Remove or clearly isolate the disposable demo and preserve evidence.

> **🔎 Check your understanding**
>
> Expected result: The final project still has independent Test Drive ownership.

## ⚡ Independent practice: Write a relationship decision

Explain why the course keeps Test Drive independently owned.

1. Compare both relationship types using the same business questions.
2. Record your deletion prediction and observed result.
3. Inspect the final core field and confirm it is still Lookup.

### Your work is ready when

- The experiment does not replace the core relationship.
- The explanation includes ownership and access, not only deletion.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Where is a Master-Detail field created?

**Answer:** On the detail object, pointing to its master.

### 2. Does a Lookup always imply the same deletion behaviour?

**Answer:** No. Inspect the field configuration and supported relationship behaviour.

### 3. Why preserve Lookup in this project?

**Answer:** The later labs need Test Drive records with independent owners and sharing.

## What to take away

- Evaluate relationship consequences before implementation.
- Read the core lookup configuration accurately.
- Isolate destructive experiments from project records.

## Sources and further reading

- [Object relationships](https://trailhead.salesforce.com/content/learn/modules/data_modeling/object_relationships)


---

# Build a Usable Sales Application

J10 · junior · About 50 minutes with practice

![A compact car-dealership application window with a car, appointment card and small bar chart](https://sam-portal-production.up.railway.app/lesson-images/J10.jpg)

Assemble tabs, a record page, a useful list, and a small management report around one clear salesperson journey.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Build a small application around a user task.
- Distinguish page configuration from security.
- Validate a report against known records.

## 1. Design for a task rather than a catalogue of fields

Anna needs to find a vehicle, identify a customer, and record an appointment. A useful application makes that sequence understandable. Putting every available field on the screen does not automatically make the application complete. Start with the agreed task from J06 and the data model from J07–J09.

The starter defines objects and fields, but it does not provide a finished Northstar application. Create custom object tabs for Vehicle and Test Drive if they are not already available, then use App Manager to create a Lightning application named Northstar Learning. Add the navigation items required by the task, such as Vehicles, Test Drives, and Contacts. Availability still depends on permissions; an application is not an access-control shortcut.

> **⚡ Try it**
>
> Write the three actions Anna needs to perform before changing the page layout.

## 2. Distinguish the page from the stored information

A page layout arranges fields and actions for a record. A Lightning record page arranges components around that record. These configuration layers affect presentation. Field-level security controls access to a field. Removing a field from a layout is not a substitute for denying access, because another supported entry route may still expose an accessible field.

The course Test Drive has an automatically generated Name, displayed as a number such as TD-0001. Anna should not be expected to type that number. Place Vehicle, Customer, Scheduled At, and Status where she can understand them. If you added the duration extension in J08, explain it alongside the calculated end rather than presenting the formula as another editable input.

Ask Max to use the page without a spoken walkthrough. If he cannot tell whether he is editing the vehicle or the appointment, improve labels, grouping, or the application route. Do not fix confusion by adding more instructions to a training video while leaving the actual interface ambiguous.

> **⚠️ Watch out**
>
> A hidden or read-only-looking field on one page is a presentation choice, not complete proof of enforced field access.

## 3. Make a list and a report answer different questions

A list view helps a salesperson find working records. Create a view such as Upcoming Confirmed Test Drives, with a Status condition and appropriate scheduled-time conditions supported by the interface. Include the appointment number, vehicle, customer, scheduled time, and owner where accessible. Explain that filters select records from the user's available data; they do not grant records.

Oleg's report answers a broader question, such as how many confirmed appointments are assigned to each owner this week. The starter enables reports on the custom objects. If the report builder does not offer a suitable report type, create or inspect a custom report type with Test Drive as the primary object. A report type defines which records and fields the report can use. Keep this first report simple enough to reconcile with a small hand-counted dataset.

Enter three synthetic appointments: two Confirmed and one Requested. Use different owners only if your org has suitable users. Predict the report totals before running it. A visually attractive chart that counts the wrong status is still wrong. Save the report in an appropriate learning folder and test access as the intended user when available.

> **🔎 Check your understanding**
>
> Can Oleg explain exactly which records contributed to the displayed count?

### Step 1: Create the application route

Add the needed custom object tabs and a small Northstar Learning application.

> **🔎 Check your understanding**
>
> Expected result: A learner can reach vehicles and appointments predictably.

### Step 2: Arrange one record page

Show the core appointment fields clearly and distinguish calculated fields from editable inputs.

> **🔎 Check your understanding**
>
> Expected result: Max can complete the agreed task without guessing.

### Step 3: Build a focused list

Apply explicit status and time conditions and select useful columns.

> **🔎 Check your understanding**
>
> Expected result: The sample Requested record is excluded when the view is for Confirmed appointments.

### Step 4: Reconcile a report

Count the sample data manually, run the report, and compare totals.

> **🔎 Check your understanding**
>
> Expected result: Any difference is investigated through filters, report type, and access.

## ⚡ Independent practice: Demonstrate one complete user journey

Create a short demonstration from application navigation to an appointment and a management count.

1. Record the route and the field choices.
2. Explain the list filters and report grouping.
3. Ask another person to repeat the journey and note one improvement.

### Your work is ready when

- The report matches the known sample records.
- The explanation does not claim that a page layout enforces field-level security.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why can a report and a list show different counts?

**Answer:** They can use different filters, report structures, or available data; inspect those assumptions before declaring a defect.

### 2. Does an application tab grant object access?

**Answer:** No. Presentation and permission are separate concerns.

### 3. Why not make the auto-number editable?

**Answer:** It is generated by the configured Name field; the user supplies the business information instead.

## What to take away

- Build a small application around a user task.
- Distinguish page configuration from security.
- Validate a report against known records.

## Sources and further reading

- [Application navigation](https://trailhead.salesforce.com/content/learn/modules/lex_implementation_basics/lex_implementation_basics_setup)
- [Report builder](https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards/lex_implementation_reports_dashboards_using_report_builder)


---

# Understand the Layers of Data Access

J11 · junior · About 50 minutes with practice

![Four translucent geometric access layers protecting one customer record](https://sam-portal-production.up.railway.app/lesson-images/J11.jpg)

Separate sign-in, object operations, field permissions, and access to an individual record.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Describe a precise access operation.
- Separate the main access layers.
- Use evidence from the intended identity.

## 1. Describe the requested action

Oleg says that Max should see tomorrow's test drive. Before configuring anything, make that sentence precise. Max needs to sign in, read Test Drive records, read the relevant fields, and access the particular appointment. If he must change its time, the required action is different. Access without a user, record, field, and operation is too vague to test.

Organization access concerns entry into the environment, including an active account and applicable login controls. Object permissions describe operations such as Create, Read, Edit, and Delete on a category of data; people often abbreviate these as CRUD. Field-level security, or FLS, describes which fields are readable or editable. Record access concerns the individual records a user can reach within those object operations.

> **💡 Key idea**
>
> Ask which user wants to perform which action on which record and fields.

## 2. Distinguish similar symptoms

Imagine that Anna owns TD-001 and Max does not. First, Max cannot sign in. Sharing TD-001 does not repair the login problem. Second, Max can sign in but lacks Read on Test Drive. A record share does not substitute for object Read. Third, he can read the appointment but not a protected field. Increasing record sharing does not fix a deliberately restricted field.

Fourth, Max has the relevant object and field permissions but no access to the private appointment. This is the situation where record-sharing mechanisms become relevant. This sequence is a useful model for ordinary interactions, not a claim that every execution context is identical. Developer features, elevated permissions, and specialized access controls need explicit consideration in later lessons.

The visible page introduces presentation as another concern. A field can be absent because the page excludes it, FLS hides it, or a component is configured differently. The remedies differ. Comparing screenshots without inspecting permissions can lead you to change the wrong layer and accidentally grant more than the business requested.

> **⚠️ Watch out**
>
> An administrator successfully opening a record does not prove the intended salesperson access.

## 3. Run a controlled experiment

Use a restricted learning user if the org has a suitable spare license. Record its profile, permission sets, and broad data permissions first. A pre-existing grant can hide the effect you are trying to demonstrate. For example, object-level View All Records can explain visibility that you otherwise might attribute to a new share.

To prepare a test identity, open Setup → Users → Users → New User. Use a fictional learning name, an email address you control for account access, and a unique email-shaped Username; Username and email have different purposes. Choose an available compatible Salesforce license and the Minimum Access – Salesforce profile when your org offers it. Otherwise inspect the chosen profile and remove broad permissions from the experiment. Do not use System Administrator for the restricted persona. Complete account activation through the normal Salesforce process, keep credentials private, and sign in through a separate browser profile. J12 supplies the small business permissions. If no suitable license is available, use the explicitly unexecuted analysis path below.

Choose one known appointment and write the expected action for Max. Change one layer at a time and repeat the same action against the same record. Keep the record identifier in private evidence so that a different sample record does not confuse your comparison. Use fictional data and do not put credentials in screenshots.

If another suitable user is unavailable, complete the predictions and configuration inspection but mark user-execution checks as not performed. Changing page layouts while remaining an administrator is not an equivalent test. Accurate evidence of a limitation is better than an apparently complete access matrix based on the wrong identity.

The goal is to avoid random grants. Once you identify the blocked layer, propose the smallest correction consistent with the requirement. Then verify a permitted action and an action that should remain denied. Successful troubleshooting explains both the improvement and the boundary that remains in place.

> **🔎 Check your understanding**
>
> Record an allowed action and a denied action for every configuration change.

### Step 1: Write the baseline

Describe Max, the appointment, the operation, and the required fields.

> **🔎 Check your understanding**
>
> Expected result: The test can be repeated without interpretation.

### Step 2: Inspect grants

Check the relevant user assignments and appointment ownership.

> **🔎 Check your understanding**
>
> Expected result: Broad permissions and existing routes are visible.

### Step 3: Change one variable

Test one object, field, or record change in the learning org.

> **🔎 Check your understanding**
>
> Expected result: The observation can be connected to a specific change.

## ⚡ Independent practice: Classify four access failures

Explain why similar symptoms require different investigation paths.

1. Describe a login failure, missing object Read, hidden field, and inaccessible record.
2. Identify evidence and a possible minimal correction for each.
3. Run available restricted-user tests and label those not performed.

### Your work is ready when

- Object, field, and record access are distinguished.
- Administrator results are not represented as salesperson tests.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Will record sharing grant object Read?

**Answer:** No. The required object operation permission remains necessary.

### 2. Does an absent field prove missing FLS?

**Answer:** No. Page or component configuration can also omit a field.

### 3. What if no second user is available?

**Answer:** Document predictions and configuration, and explicitly mark execution checks as unperformed.

## What to take away

- Describe a precise access operation.
- Separate the main access layers.
- Use evidence from the intended identity.

## Sources and further reading

- [Data security overview](https://trailhead.salesforce.com/modules/data_security/units/data_security_overview)
- [Field-level security](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields)


---

# Grant a Small Set of Working Permissions

J12 · junior · About 50 minutes with practice

![Two small permission cards combining to open one lock on a record](https://sam-portal-production.up.railway.app/lesson-images/J12.jpg)

Create an additive permission set that enables appointment work without broad administration.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Design grants from working operations.
- Explain additive permissions.
- Verify combined access and negative cases.

## 1. Start from the work

Anna needs to read vehicles and contacts, create test-drive requests, and edit appointments she is allowed to manage. She does not need to delete the vehicle catalogue or configure user accounts. Write the required operations before opening a permission editor. This provides a business reason for each grant.

A permission set is a collection of permissions assigned to users. It generally adds to permissions already granted by the profile and other assignments. It is not a subtraction mechanism. If a profile grants Delete, leaving Delete unchecked in a new permission set does not remove that existing grant. Inspect the combined access rather than treating one configuration page as the entire user.

> **💡 Key idea**
>
> A narrow permission set produces narrow effective access only when the other assignments are appropriate too.

## 2. Define a deliberate learning assignment

Create a permission set named SAM Appointment Editor. For this exercise, grant Read on Vehicle and Contact, and Read, Create, and Edit on Test Drive. Do not grant Delete, View All Records, Modify All Records, or broad administrative permissions. Configure the required field visibility and editability for Vehicle__c, Customer__c, Scheduled_At__c, and Status__c on Test Drive.

Auto-number and other system fields are not ordinary editable fields, so do not force them into an identical editability checklist. For Vehicle, allow the fields Anna needs to choose a vehicle, including Model. Decide explicitly whether this exercise requires VIN visibility. Lookup selection also depends on access to the referenced records; a visible relationship field does not make the entire related object available.

SAM_Lab_Basics in the starter is a convenience set with broader editing capabilities on both custom objects. Do not assign it alongside the narrow test set and then attribute every allowed action to SAM Appointment Editor. Use an appropriately restricted identity or inspect the complete combined grants. Permission-set assignment also depends on compatible user licensing. Investigate an assignment error instead of changing licenses without understanding the consequences.

> **⚠️ Watch out**
>
> Do not dismiss a failed lab check by granting System Administrator or Modify All Data.

## 3. Prove the useful permission and the boundary

Configure the set in Setup, assign it to the intended restricted learning user, and inspect the resulting user access summary. Assignment confirms configuration, not behaviour. Sign in as that user or use an approved login-as route in your own org to test the actual operation.

Create an appointment using related records the user can access. Next attempt an explicitly excluded action, such as deleting a vehicle or changing a field deliberately excluded from all grants. If the negative test succeeds, investigate the profile and other assignments before modifying the new permission set. An unchecked box in one source is not proof of an effective denial.

Record access remains separate. Anna having Edit on Test Drive does not mean she should edit every private appointment. Begin the positive check with an appointment she owns, then compare another owner's record when suitable users are available. That separates object capability from access to a particular record.

Keep a reason beside every grant. 'Needed to select an existing vehicle' helps a reviewer assess the decision. 'It made the error disappear' does not establish whether the access is appropriate. This reasoning also makes later changes safer because you can identify which business operation depends on each permission.

> **🔎 Check your understanding**
>
> For an unexpectedly allowed operation, identify the source that grants it before making another change.

### Step 1: Create the set

Open Setup → Permission Sets → New, enter SAM Appointment Editor, and choose a license setting compatible with the intended user. Save. Under Object Settings, open each relevant object → Edit, select the agreed object and field grants, then save. Use Manage Assignments → Add Assignments to choose the learning user; review all existing assignments before testing.

> **🔎 Check your understanding**
>
> Expected result: The configuration matches the written task.

### Step 2: Inspect the whole identity

Assign the set to a compatible restricted user and review its other grants.

> **🔎 Check your understanding**
>
> Expected result: Additional permission sources are not hidden.

### Step 3: Run both directions

Perform a permitted create and attempt a prohibited operation.

> **🔎 Check your understanding**
>
> Expected result: The useful action succeeds and the boundary remains enforced.

## ⚡ Independent practice: Explain a permission decision

Submit a small table connecting Anna to the operations and fields she needs.

1. List grants with business reasons.
2. Record the relevant complete assignments of the test identity.
3. Capture one permitted operation and two prohibited operations.

### Your work is ready when

- The evidence uses a restricted user.
- The explanation recognizes additive permissions and independent record sharing.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does an unchecked Delete box remove another Delete grant?

**Answer:** No. The actual granting source must be inspected and changed when appropriate.

### 2. Why might a lookup still fail?

**Answer:** Related-object or related-record access may be missing.

### 3. Does assignment prove the workflow works?

**Answer:** No. The intended operation still needs to be tested.

## What to take away

- Design grants from working operations.
- Explain additive permissions.
- Verify combined access and negative cases.

## Sources and further reading

- [Control object access](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects)
- [Create and assign permission sets](https://help.salesforce.com/s/articleView?id=000206679&language=en_US&type=1)


---

# Set a Record-Access Baseline and Add Exceptions

J13 · junior · About 50 minutes with practice

![A simple team hierarchy above three record cards with carefully drawn access paths](https://sam-portal-production.up.railway.app/lesson-images/J13.jpg)

Use Private defaults, roles, and a focused sharing rule to explain appointment visibility.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Explain OWD as a baseline.
- Distinguish roles from profiles.
- Validate a targeted sharing exception.

## 1. Start with the baseline

Organization-wide defaults, commonly called OWD, define a baseline for access to records users do not own. The course starter sets Vehicle and Test Drive to Private. Private does not mean that nobody except the owner can ever see a record. Ownership, hierarchy behaviour where applicable, explicit sharing, and elevated permissions can provide additional access.

Keep object and field permissions separate. If Max has no Read permission on Test Drive, widening record visibility is not the whole solution. Conversely, Read on Test Drive does not mean all private appointments are visible. You are combining the layers introduced in J11, not replacing them with a single Sharing Settings screen.

> **💡 Key idea**
>
> Begin with a restrictive baseline and explain each intended path that expands record access.

## 2. Separate a hierarchy position from a permission profile

A role represents a position in a record-access hierarchy. It is not the same thing as a profile or a job title printed on a business card. In a controlled example, Anna and Max can occupy peer sales roles while Oleg sits above them. Inspect the custom object's Grant Access Using Hierarchies setting before predicting Oleg's access. Record the actual configuration rather than assuming standard and custom objects behave identically.

A public group collects users or other supported members for uses such as sharing recipients. Create a Northstar Service Review group containing a suitable test user. A criteria-based sharing rule can grant that group Read access to appointments whose Status is Confirmed. The business reason is that service staff prepare for agreed visits.

The rule does not confirm an appointment, grant missing object permissions, or revoke another access path. It adds a grant for records meeting its condition. It also does not create a branch boundary: the core starter has no Branch field. A real branch-specific requirement would first need suitable data and a complete sharing design. Avoid claiming that this small demonstration implements a requirement its data cannot express.

> **⚠️ Watch out**
>
> Sharing rules grant access; they are not deny rules that cancel ownership, hierarchy, or other grants.

## 3. Use records that distinguish the possible outcomes

Prepare Anna's Confirmed appointment and Anna's Requested appointment. Predict what the service reviewer should see through the new rule. The Confirmed appointment qualifies; the Requested appointment does not. If a third record owned by a peer is available, include it to make ownership differences visible.

Before calling an observation a failure, inspect other access paths. The reviewer might own the record, sit above its owner in a hierarchy, or hold View All Records. A matching role name does not by itself grant access to peer records. Your explanation needs an actual configured path, not an assumption about organizational seniority.

Sharing changes may require recalculation. Note the change time, wait for relevant processing, and refresh before checking again. Repeatedly adding permissions while a change is being applied makes the experiment harder to interpret. Record any unperformed checks if the training org lacks suitable distinct users.

Create an access map containing the baseline, record owners, hierarchy setting, group members, rule condition, and observations. A screenshot of the rule is only one part of that map. The reviewer needs enough context to explain why both the included and excluded record behaved as expected.

> **🔎 Check your understanding**
>
> For each visible record, identify a configured route that could grant access and verify it.

### Step 1: Inspect OWD

Record the actual Test Drive baseline and custom-object hierarchy setting.

> **🔎 Check your understanding**
>
> Expected result: The prediction matches the environment.

### Step 2: Configure one exception

Create a small public group and a Read rule for Confirmed appointments.

> **🔎 Check your understanding**
>
> Expected result: The condition and recipient have clear business purposes.

### Step 3: Test contrasting records

Compare Confirmed and Requested appointments under the intended reviewer.

> **🔎 Check your understanding**
>
> Expected result: The result distinguishes this rule from unrelated grants.

## ⚡ Independent practice: Document one access map

Explain the intended owner, peer, manager, and service-reviewer access.

1. Draw hierarchy positions and public-group membership.
2. List the baseline and sharing condition.
3. Test matching and nonmatching records with the available identities.

### Your work is ready when

- A role is not confused with a profile.
- No unsupported branch isolation is claimed.
- Other granting sources are investigated when results differ.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does Private prevent all non-owner access?

**Answer:** No. Additional configured access routes can grant it.

### 2. Does a sharing rule change Status?

**Answer:** No. It evaluates the stored status to decide which records qualify.

### 3. Does sharing a role automatically share peer records?

**Answer:** No. Identify an actual configured granting mechanism.

## What to take away

- Explain OWD as a baseline.
- Distinguish roles from profiles.
- Validate a targeted sharing exception.

## Sources and further reading

- [Control access to records](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records)


---

# Share One Record and Test an Ownership Change

J14 · junior · About 50 minutes with practice

![One drawn colleague handing a single record card to another through a permission key](https://sam-portal-production.up.railway.app/lesson-images/J14.jpg)

Use manual sharing for a specific handover and verify transfer behaviour in the actual org configuration.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Use manual sharing for a bounded exception.
- Separate ownership from additional access.
- Test transfer behaviour against current settings.

## 1. Choose a specific exception

Anna is absent tomorrow and asks Max to help with one appointment. If the need is temporary and specific, manual sharing may fit better than granting access to every sales record. Manual sharing allows an owner or another sufficiently authorized user to grant supported access to an individual record.

The share remains one part of the permission picture. Max still needs the required object and field permissions. Read Only sharing does not authorize editing, and Read/Write sharing does not replace object Edit when it is missing. Reuse the layered model from J11 rather than assuming a Share action bypasses the rest of the access design.

> **💡 Key idea**
>
> Repeated identical manual exceptions suggest a recurring process or rule that deserves a deliberate design.

## 2. Distinguish a share from ownership

Ownership identifies the responsible owner of a record. Sharing can add access for another recipient without changing that owner. Anna can remain the owner while Max receives access. Transferring ownership changes a different relationship and may alter other access paths as well.

Do not memorize the outdated absolute statement that manual shares always disappear after transfer. Current Salesforce documentation describes an org-level setting named Keep manual shares when transferring records. The default behaviour removes manual shares when ownership changes; enabling the setting changes that behaviour. Inspect and record the actual setting before predicting your result.

Other grants can conceal what happened. Max may continue seeing the appointment because he became its owner, is above the new owner in a hierarchy, or qualifies through a sharing rule. Continuing visibility is therefore not proof that a manual share survived. You must distinguish the share itself from the total effective access of its recipient.

Object-specific limitations also matter. Use the supported Sharing action for the object and interface. If it is unavailable, inspect sharing configuration, page actions, and your authority to share rather than assuming every object offers the same control to every user.

> **⚠️ Watch out**
>
> Ownership-transfer behaviour depends on current settings and object considerations. Record the conditions behind your observation.

## 3. Isolate a transfer experiment

Choose an expendable Requested Test Drive with a known owner. Using Requested helps avoid the Confirmed-service rule created in J13, although you must still inspect any other grants. Record the intended recipient and sharing level before making the change. Give only the access needed for the handover.

Before transferring the record, write the predicted new owner and the retention setting. After transfer, inspect available sharing information and repeat the recipient action. Keep before-and-after evidence. If your training org has only two suitable users, the recipient may also become the new owner; that does not isolate whether the original manual share remains. Label the limitation instead of presenting an ambiguous outcome as proof.

Finally consider the end of the business exception. When Max no longer needs temporary access, remove the relevant temporary share where permitted and retest. If another route still grants access, explain it. A cleanup check is useful precisely because removing one grant does not always remove every grant.

In a working team, Oleg should define how handovers are requested and reviewed. A developer should not invent an unrecorded permanent access policy because a one-off demonstration was convenient. Your submission should explain the intended duration of the exception and the way its completion is verified.

> **🔎 Check your understanding**
>
> Explain both the manual share and alternative routes that could preserve recipient access.

### Step 1: Record the retention setting

Inspect Sharing Settings and note the ownership-transfer option without changing unrelated configuration.

> **🔎 Check your understanding**
>
> Expected result: The prediction is tied to this org.

### Step 2: Share one appointment

Grant the required recipient the minimum supported access.

> **🔎 Check your understanding**
>
> Expected result: The requested one-record operation succeeds.

### Step 3: Transfer and inspect

Change ownership in the controlled example and inspect sharing information plus effective access.

> **🔎 Check your understanding**
>
> Expected result: Ownership and retained sharing are not confused.

### Step 4: Review the exception

Remove temporary access when appropriate and retry the recipient operation.

> **🔎 Check your understanding**
>
> Expected result: Any remaining access has an identified explanation.

## ⚡ Independent practice: Write a transfer observation

Explain the behaviour of one manual share before and after ownership changes.

1. Record owner, recipient, sharing level, and retention setting.
2. Predict and test the result where suitable identities exist.
3. Describe other granting routes and any test you could not isolate.

### Your work is ready when

- The explanation does not say manual shares always disappear.
- New ownership is not mistaken for retained manual sharing.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does sharing transfer ownership?

**Answer:** No. The two operations change different relationships.

### 2. Why inspect the retention setting?

**Answer:** It changes the default handling of manual shares during transfer.

### 3. Why is the recipient becoming owner a weak isolation test?

**Answer:** Ownership itself can explain continued access regardless of the manual share.

## What to take away

- Use manual sharing for a bounded exception.
- Separate ownership from additional access.
- Test transfer behaviour against current settings.

## Sources and further reading

- [Keep manual shares on transfer](https://help.salesforce.com/s/articleView?id=platform.security_sharing_keep_manual_transfer.htm&language=en_US&type=5)
- [Manual sharing considerations](https://help.salesforce.com/s/articleView?id=sf.manual_sharing_considerations_lex.htm&language=en_US&type=5)


---

# Trace the Source of an Access Problem

J15 · junior · About 50 minutes with practice

![A magnifying glass tracing two different paths toward the same accessible record](https://sam-portal-production.up.railway.app/lesson-images/J15.jpg)

Investigate missing or excessive access with evidence, one hypothesis, and a minimal correction.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Write a reproducible access symptom.
- Trace an effective grant to its source.
- Verify a minimal correction and its boundary.

## 1. Write a reproducible access report

Anna reports that Max cannot see an appointment. Begin by asking which user, which record, which fields, and which action. Record the route through the application and the exact visible result. 'Missing from Recently Viewed' and 'access denied when opening a known record' are different observations. The first may concern a list; the second is stronger evidence about record access.

Use fictional records and private identifiers in the investigation note. Include the time of the check and the configuration changes that occurred shortly before it. A problem that started after a permission-set assignment is a useful clue, but timing alone does not prove the cause. Treat it as a hypothesis to investigate.

> **💡 Key idea**
>
> A diagnosis explains the observed behaviour. A workaround merely makes the immediate symptom disappear.

## 2. Inspect grants before adding them

Open the relevant user in Setup and inspect View Summary where available. The User Access Summary consolidates useful permission and assignment information. Access Granted By can show which profile, permission set, or permission set group supplies a particular permission. Refresh the summary after assignment changes and remember that not every possible access feature is represented in one screen.

For missing object Read, inspect all object grants. For a field issue, inspect field permissions and the page configuration separately. For a record issue, inspect ownership, OWD, hierarchy settings, group memberships, sharing rules, manual shares, and broad record-access permissions. The checklist narrows the cause; it does not justify changing every item.

Unexpected access deserves the same discipline. Suppose Max can edit vehicles even though SAM Appointment Editor grants only Read. The starter SAM_Lab_Basics assignment may still grant Edit. Adding another 'read-only' permission set will not subtract it. Identify the actual granting source and decide whether removing or modifying that source is consistent with the business requirement.

> **⚠️ Watch out**
>
> Removing a permission from a shared permission set can affect every assigned user, not just the person in your bug report.

## 3. Use three deliberately different cases

Prepare a missing-object case, a missing-field case, and a missing-record case in a controlled learning setup. Change one relevant assignment or sharing condition per case. If your org has too few users, execute the cases sequentially with a restricted test identity and restore the documented baseline between them. Record which simultaneous ownership scenarios remain untested.

For each case, write an expected symptom before changing configuration. Then inspect the actual outcome. A field removed from a layout should not be labelled an FLS failure. A record filtered out by a list should not be labelled a sharing failure. These distinctions matter because a broad 'fix' can create access that nobody requested.

Propose the smallest justified correction. If Max needs one particular appointment, consider a bounded record grant rather than View All Records. If his role requires an object operation, consider the relevant task-based permission set rather than an administrator profile. Have the business owner confirm ambiguous needs.

Retest the original action and one boundary. If the intended appointment is now visible, verify an unrelated private appointment remains unavailable. Finally restore temporary test changes and preserve the explanation. The useful deliverable is a short causal account: symptom, evidence, source, correction, and regression check.

> **🔎 Check your understanding**
>
> Could a reviewer reproduce your conclusion using the same user, record, and configuration evidence?

### Step 1: Capture the symptom

Record the identity, action, record, field, route, and exact result.

> **🔎 Check your understanding**
>
> Expected result: The report is specific.

### Step 2: Inspect a likely source

Use the user access summary plus the appropriate object, field, or sharing configuration.

> **🔎 Check your understanding**
>
> Expected result: The hypothesis has evidence.

### Step 3: Apply one correction

Change only the justified granting source in the learning setup.

> **🔎 Check your understanding**
>
> Expected result: The original action has a predictable outcome.

### Step 4: Retest a boundary

Try an unrelated record or excluded operation.

> **🔎 Check your understanding**
>
> Expected result: The correction has not silently broadened access beyond the task.

## ⚡ Independent practice: Submit three small investigations

Diagnose one object, one field, and one record access case.

1. Write the symptom and hypothesis for each.
2. Identify the actual relevant configuration source.
3. Record the correction and a successful regression check.

### Your work is ready when

- A layout issue is not mislabeled as FLS.
- A filter issue is not mislabeled as sharing.
- Any unavailable execution check is stated honestly.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why inspect Access Granted By?

**Answer:** It helps identify the actual source of a permission rather than guessing which assignment matters.

### 2. Will a read-only set cancel Edit from another source?

**Answer:** No. Permissions are additive; inspect the Edit grant.

### 3. Why retest an unrelated private record?

**Answer:** It checks that the correction did not grant a broader scope than intended.

## What to take away

- Write a reproducible access symptom.
- Trace an effective grant to its source.
- Verify a minimal correction and its boundary.

## Sources and further reading

- [User Access Summary](https://help.salesforce.com/s/articleView?id=platform.users_access_summary.htm&language=en_US&type=5)
- [Permissions and access settings](https://help.salesforce.com/s/articleView?id=permissions_about_users_access.htm&language=en_US)


---

# Verify Access for Sales, Service, and Management

J16 · junior · About 50 minutes with practice

![Two drawn workplace roles facing the same records with different visible subsets](https://sam-portal-production.up.railway.app/lesson-images/J16.jpg)

Turn a written access matrix into repeatable positive and negative checks for three working personas.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Translate working personas into specific checks.
- Test allowed and denied actions.
- Document evidence limits without overstating completeness.

## 1. Define the personas before configuring them

A persona is a description of a type of user and the work that user needs to perform. It is not automatically a Salesforce profile, role, or permission set. For this capstone, Anna represents sales work, Max represents service preparation for the exercise, and Oleg represents management. Max is normally another salesperson in the story; assigning him a temporary service-review responsibility here is an explicit test scenario.

Anna should create and manage the appointments she owns. The service reviewer should read Confirmed appointments needed for preparation, without changing appointment data. Oleg should read the appointments covered by the agreed management hierarchy. Do not assume Oleg should edit every record merely because he is a manager. Write the requirement and configure only what it needs.

> **💡 Key idea**
>
> A persona states a business need. The implementation can combine several configuration mechanisms.

## 2. Create an executable matrix

Make a matrix whose rows are actions and whose columns are personas. Use concrete records: Anna's Requested appointment, Anna's Confirmed appointment, and an unrelated peer appointment where suitable users exist. Include read, edit, and delete actions, plus at least one field-level restriction. Mark the expected result and the reason for it.

For example, the service reviewer may read Anna's Confirmed appointment through the focused sharing rule but should not edit its scheduled time because object Edit is absent. Anna may edit her own appointment but should not gain broad vehicle deletion. Oleg's visibility must be explained through the actual role positions and custom-object hierarchy setting, not through an administrator profile.

Lookups add dependencies. A persona might be able to open an appointment while lacking sufficient access to its related Contact or Vehicle for a particular screen action. Decide what the task requires and include those related-record checks. Otherwise, the main appointment may appear correct while the real user journey still fails.

> **⚠️ Watch out**
>
> Do not count an administrator session or a changed page layout as a substitute for a restricted-user test.

## 3. Execute within the available licenses

A small learning org may not provide enough active licenses for three simultaneous restricted users. Inspect what is actually available. Where appropriate, test permission personas sequentially with a restricted identity and restore a documented baseline between runs. That can demonstrate object and field behaviour, but it cannot fully reproduce every simultaneous ownership and hierarchy relationship.

Clearly label design-only or unperformed checks. A reviewer can still assess the intended model and the evidence you were able to obtain. They should not have to infer that 'passed' really meant 'the diagram looked plausible.' If the goal requires a distinct-owner experiment, arrange the appropriate environment before claiming it is complete.

For each executed case, record the persona, relevant assignments, record, action, expected result, and observed result. Keep the evidence concise. A short demonstration of a successful allowed action followed by a genuinely denied action is more convincing than scrolling through many setup screens.

When a result differs, use J15 to diagnose the source. Avoid changing the expected result after the fact simply to make the matrix green. If the requirement itself changes, record Oleg's decision separately and rerun affected tests. The final matrix should explain both what the system permits and what it deliberately does not permit.

> **🔎 Check your understanding**
>
> Every passed cell needs an observation under the intended identity; every untested cell needs a visible reason.

### Step 1: Write the matrix

Use named synthetic records and precise operations for sales, service review, and management.

> **🔎 Check your understanding**
>
> Expected result: Expected results exist before execution.

### Step 2: Inspect effective identities

Record profile, permission assignments, role, and relevant group membership for each test.

> **🔎 Check your understanding**
>
> Expected result: The chosen identity matches its persona.

### Step 3: Run and capture

Perform the positive and negative actions in a controlled order.

> **🔎 Check your understanding**
>
> Expected result: The evidence can be compared with the matrix.

### Step 4: Review differences

Investigate mismatches and rerun after justified corrections.

> **🔎 Check your understanding**
>
> Expected result: The final result has an explanation, not merely a pass label.

## ⚡ Independent practice: Demonstrate the access model

Deliver a short access demonstration and an evidence matrix for Oleg.

1. Include at least two allowed and two denied operations per persona where executable.
2. Document related Contact and Vehicle access.
3. List license constraints and unperformed distinct-user scenarios.

### Your work is ready when

- No broad grant was added solely to make a test pass.
- Every executed result names the tested persona.
- Untested cells remain distinguishable from successful ones.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Is a persona the same as a role?

**Answer:** No. A persona describes work; a role is one possible part of its Salesforce access implementation.

### 2. Can sequential identity changes prove every hierarchy scenario?

**Answer:** No. Some scenarios need distinct concurrent owners or users.

### 3. What should happen after an unexpected pass?

**Answer:** Investigate the extra granting source; a prohibited action succeeding is a defect against the stated matrix.

## What to take away

- Translate working personas into specific checks.
- Test allowed and denied actions.
- Document evidence limits without overstating completeness.

## Sources and further reading

- [Control access to records](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records)
- [User Access Summary](https://help.salesforce.com/s/articleView?id=platform.users_access_summary.htm&language=en_US&type=5)


---

# Create a Record-Triggered Flow with a Clear Failure Path

J17 · junior · About 50 minutes with practice

![Three simple flow nodes transforming a saved appointment into a reminder card](https://sam-portal-production.up.railway.app/lesson-images/J17.jpg)

Create one follow-up Task for a new appointment request, avoid update duplicates, and make a failed reminder visible.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Specify a Flow event and action.
- Include prerequisites and explicit field mapping.
- Verify duplicate avoidance and a visible failure outcome.

## 1. Define the event and the business action

A Flow is a configured sequence of operations. A record-triggered Flow starts when an eligible record is created, updated, or deleted, according to its configuration. Our requirement is deliberately small: when a new Requested Test Drive with a scheduled time is created, create one Task for its owner to follow up. A Task is a Salesforce work item. Creating it is not the same as sending an email or displaying a timed desktop reminder.

Choose an after-save record-triggered Flow because it creates a separate related record. A before-save flow is useful for certain changes to the triggering record itself, but that is not this action. Limiting the trigger to record creation prevents an ordinary later edit from creating another Task. This is a specific duplicate-prevention design, not a universal guarantee against duplicate source appointments.

> **💡 Key idea**
>
> Describe the event, qualifying condition, action, and failure outcome before adding elements.

## 2. Prepare the actual starter requirements

The core Test Drive object currently has activities disabled. Enable Allow Activities on this custom object in the learning org before using its ID as Task.WhatId, and include that metadata change in your submission. Task.WhatId identifies the related business record. Without the prerequisite, a seemingly correct Create Records element can fail.

Use a user-owned synthetic appointment. Configure Task.Subject as 'SAM reminder: ' followed by the appointment number, OwnerId as the appointment OwnerId, WhatId as the appointment Id, and ActivityDate as the date derived from Scheduled_At__c. Select valid Task Status and Priority values available in your org; do not assume a translated label is a valid API value.

Record-triggered automation can execute with elevated context. Its Task creation is not proof that the salesperson independently has all the corresponding Task permissions. Review who can create the source appointment and whether this automated action is an intended consequence. Do not use automation as an unexplained way to bypass an access requirement.

> **⚠️ Watch out**
>
> The starter does not enable activities. Configure and retrieve that explicit prerequisite before relating Tasks to Test Drive records.

## 3. Connect success and failure deliberately

Create the Flow for Test_Drive__c, triggered when a record is created. Require Status__c equal Requested and Scheduled_At__c not blank. Optimize for Actions and Related Records. Add a Create Records element for the Task with the fields described above.

Connect the create element's fault path to a Custom Error element supported by the record-triggered Flow. Use a business-readable message such as 'The appointment could not be saved because its follow-up task failed. Contact the learning administrator.' This design rejects the source save rather than silently leaving an appointment without its required Task. Do not expose a raw fault message containing internal details to an ordinary user.

Test the normal route with a future appointment. Confirm one Task exists, then edit an unrelated appointment value and confirm the Task count remains one. To test failure in the isolated learning org, temporarily use a narrowly targeted Task validation rule that rejects new Subjects beginning with SAM reminder. Confirm that the source appointment save is rejected and no completed reminder is left behind. Disable that test-only rule afterward and rerun the valid case.

Flow Debug is helpful, but activation and an actual record save are separate checks. Document which version is active and which execution you observed. A debug run configured to roll back does not prove that a persistent appointment or Task was created.

> **🔎 Check your understanding**
>
> Compare both record counts and the message shown to the user. A visible path in Flow Builder is not execution evidence.

### Step 1: Configure the prerequisite

Enable activities on Test Drive and record the metadata change.

> **🔎 Check your understanding**
>
> Expected result: Task.WhatId can reference the intended object.

### Step 2: Build the create-only path

Set the trigger conditions and map the Task fields explicitly.

> **🔎 Check your understanding**
>
> Expected result: A new eligible appointment produces one follow-up Task.

### Step 3: Add the failure response

Connect the fault path to a suitable Custom Error.

> **🔎 Check your understanding**
>
> Expected result: A required reminder failure blocks the save visibly.

### Step 4: Exercise both routes

Test creation, a later edit, and the temporary controlled fault.

> **🔎 Check your understanding**
>
> Expected result: Counts and user-visible results match the written requirement.

## ⚡ Independent practice: Submit a predictable reminder Flow

Deliver the Flow, activity-setting change, and a three-case result table.

1. Demonstrate one Task after an eligible create.
2. Demonstrate no additional Task after an update.
3. Demonstrate the controlled failure and remove the temporary fault injection.

### Your work is ready when

- The activity prerequisite is included.
- The submission distinguishes a Task from an email notification.
- The active version and observed transaction outcome are stated.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why choose after-save here?

**Answer:** The action creates a separate Task related to the saved appointment.

### 2. Why does an edit not create another Task?

**Answer:** The Flow is configured for record creation only.

### 3. Does Task creation prove the user had direct Task creation permission?

**Answer:** No. The automation execution context must be considered separately.

## What to take away

- Specify a Flow event and action.
- Include prerequisites and explicit field mapping.
- Verify duplicate avoidance and a visible failure outcome.

## Sources and further reading

- [Record-triggered Flow](https://trailhead.salesforce.com/content/learn/modules/record-triggered-flows/get-started-with-triggered-flows)
- [Rollback and custom errors](https://trailhead.salesforce.com/content/learn/modules/flow-implementation-2/roll-back-changes-after-an-error)


---

# Apex Syntax, Variables, Collections, and Methods

J18 · junior · About 50 minutes with practice

![A calm developer workspace with a small code card, a collection of blocks and a method-shaped container](https://sam-portal-production.up.railway.app/lesson-images/J18.jpg)

Read and write a small pure Apex function before introducing database operations.

## Before you begin

- J01–J17 and the workspace setup guide; preserve browser-built metadata before deploying source files.

## What you will learn

- Read basic Apex syntax.
- Choose collections by their purpose.
- Define and trace a method contract.

## 1. Read the language one construct at a time

Apex is a programming language used on the Salesforce platform. A variable names a value, and its type describes what kind of value it can hold. Integer represents a whole number, String represents text, and Boolean represents true or false. An assignment such as Integer minute = 600 stores a value. A comparison such as minute == 600 asks a question; the two operations are different.

A class groups related code. A method is a named operation with inputs, a return type, and a body between braces. public makes the method available to callers allowed by the language; static lets it be called on the class without creating an instance. return supplies the result. An if statement chooses a branch, and a for loop repeats a block for elements in a collection. Semicolons finish statements, while braces group their bodies.

> **💡 Key idea**
>
> Read a method as input → rules → output before thinking about Salesforce records.

## 2. Choose a collection for a purpose

A List keeps elements in an indexed sequence and can contain duplicates. A Set keeps unique elements without promising a useful display order. A Map connects unique keys to values, such as an appointment ID to a prepared label. These choices express different needs; replacing every list with a map does not automatically make code better.

Our example uses minutes after midnight as a simple integer exercise. 600 means 10:00 and 840 means 14:00. This is not a complete scheduling model: it has no date, time zone, duration, or vehicle. The function removes occupied values, ignores invalid or missing numbers, removes duplicates, and returns the remaining minutes in ascending order. Those decisions are explicit parts of its contract.

Null means that a reference has no value. It is different from an empty collection, which exists but contains no items. The method below returns an empty list for a null request list and treats a null occupied set as no occupied values. Another application could choose to reject null; what matters is documenting and testing the choice.

> **⚠️ Watch out**
>
> This pure function does not reserve a real appointment or prove that a vehicle is available.

**SlotPlanner.cls — no database access**

```apex
public with sharing class SlotPlanner {
    public static List<Integer> available(
        List<Integer> requested, Set<Integer> occupied
    ) {
        Set<Integer> uniqueMinutes = new Set<Integer>();
        if (requested == null) return new List<Integer>();
        for (Integer minute : requested) {
            if (minute == null || minute < 0 || minute > 1439) continue;
            if (occupied == null || !occupied.contains(minute)) {
                uniqueMinutes.add(minute);
            }
        }
        List<Integer> result = new List<Integer>(uniqueMinutes);
        result.sort();
        return result;
    }
}
```

## 3. Trace the example before running it

For requested values 600, 840, 600, and 1500, with 840 occupied, the result is a single value: 600. The duplicate collapses in the Set, the invalid 1500 is skipped, and the occupied value is excluded. Sorting makes the returned order explicit instead of relying on Set iteration.

Complete the separate workspace setup guide before creating an Apex class in VS Code. Your org already contains browser-built changes from J07–J17: retrieve and reconcile that metadata first, rather than overwriting it with the original starter. Create SlotPlanner.cls in force-app/main/default/classes with its matching metadata file. From starter/salesforce, deploy the classes directory to the explicit learning alias. Save the short invocation below in scripts/apex/slot-planner-demo.apex, then run sf apex run --file scripts/apex/slot-planner-demo.apex --target-org sam-training. System.debug is exploratory output; J22 adds assertions.

For a Map exercise, build a Map<Integer, String> containing 600 → Morning and 840 → Afternoon. Use containsKey before relying on a lookup when a missing key has business meaning. Avoid an unnecessary nested loop that searches the same label list repeatedly.

Make one deliberate syntax mistake in a disposable copy, such as removing a semicolon, and read the compiler message. Restore the correct code. Learning to connect a message to a small line of code is more valuable than repeatedly pasting a whole replacement class.

> **🔎 Check your understanding**
>
> Trace every requested value on paper and explain why it is included, excluded, or deduplicated.

**SlotPlanner.cls-meta.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>68.0</apiVersion>
    <status>Active</status>
</ApexClass>
```

**scripts/apex/slot-planner-demo.apex, after deploying SlotPlanner**

```apex
System.debug(SlotPlanner.available(
    new List<Integer>{600, 840, 600, 1500},
    new Set<Integer>{840}
));
```

**Run from starter/salesforce; sam-training must identify your learning org**

```shell
sf project deploy start --source-dir force-app/main/default/classes --target-org sam-training
sf apex run --file scripts/apex/slot-planner-demo.apex --target-org sam-training
```

### Step 1: Prepare the development route

Complete the setup guide and confirm the target is the learning org.

> **🔎 Check your understanding**
>
> Expected result: You can create and deploy a class deliberately.

### Step 2: Trace and execute

Predict the sample result, then run the same inputs.

> **🔎 Check your understanding**
>
> Expected result: The returned list contains only 600.

### Step 3: Vary the input

Try an empty list, null input, duplicate valid values, and all occupied values.

> **🔎 Check your understanding**
>
> Expected result: Each outcome follows the documented contract.

## ⚡ Independent practice: Extend a pure function safely

Add a method that returns labels for available minutes using a Map.

1. Explain every variable type and method input.
2. Define how missing labels should be handled.
3. Record results for normal, duplicate, empty, and invalid inputs.

### Your work is ready when

- The code performs no database operation.
- Returned ordering and null behaviour are explicit.
- The explanation distinguishes List, Set, and Map.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. How does assignment differ from comparison?

**Answer:** Assignment stores a value; comparison produces a true or false result.

### 2. Why sort after converting the Set to a List?

**Answer:** The display order should be explicit rather than depend on Set iteration.

### 3. Is null the same as an empty List?

**Answer:** No. Null is no referenced value; an empty List is a collection with zero elements.

## What to take away

- Read basic Apex syntax.
- Choose collections by their purpose.
- Define and trace a method contract.

## Sources and further reading

- [Apex collections](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/langcon-apex-collections.html)
- [Iterating collections](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/langcon-apex-collections-iterating.html)


---

# Read and Change Records with SOQL and DML

J19 · junior · About 50 minutes with practice

![One data shelf with a clean read arrow and a separate update arrow returning one record](https://sam-portal-production.up.railway.app/lesson-images/J19.jpg)

Write a bounded bulk operation with explicit user-mode access and separate reads from writes.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Distinguish SOQL from DML.
- Use explicit operation access modes.
- Verify a selective collection update.

## 1. A query reads; DML changes stored records

SOQL, the Salesforce Object Query Language, selects records and fields. DML, or Data Manipulation Language, creates, updates, deletes, or otherwise changes records. Reading a Test Drive into an Apex variable does not itself change the stored appointment. Assigning a different value to that variable also does not persist it until an appropriate DML operation succeeds.

Oleg asks for a small function that cancels Requested appointments for a supplied set of vehicles. The caller supplies vehicle IDs, which identify records. The method should ignore an empty input, query eligible appointments once, prepare the changes, and update the collection once. It must not cancel Confirmed appointments merely because they concern the same vehicle.

> **💡 Key idea**
>
> Separate selecting eligible records, deciding changes, and writing those changes.

## 2. Make access mode explicit

The example deliberately uses WITH USER_MODE for the query and update as user for DML. This makes the intended access mode visible instead of relying on version-sensitive defaults. The project targets API 68.0. Current documentation differs from older material about defaults, so use explicit modes and inspect the documentation version when maintaining older code.

User-mode operations enforce applicable user access, including object and field permissions and record-sharing behaviour. The fields used in query conditions matter too. A class declared with sharing is not, by itself, a complete statement that every object and field operation has been authorized. Keep class sharing and database-operation access mode conceptually separate.

The query selects only IDs needed for the update. New update objects contain only Id and Status__c, avoiding an unnecessary write payload of every selected field. Errors are not silently converted into success. The caller must receive and handle a failed operation appropriately; a returned count means the DML completed in this method's current transaction, not that all unrelated later work can never roll it back.

> **⚠️ Watch out**
>
> Do not switch to system mode simply to make a permission failure disappear. First determine whether the caller should have the requested capability.

**TestDriveCancellation.cls — API 68.0**

```apex
public with sharing class TestDriveCancellation {
    public static Integer cancelRequested(Set<Id> vehicleIds) {
        if (vehicleIds == null || vehicleIds.isEmpty()) return 0;
        List<Test_Drive__c> changes = new List<Test_Drive__c>();
        for (Test_Drive__c row : [
            SELECT Id FROM Test_Drive__c
            WHERE Vehicle__c IN :vehicleIds AND Status__c = 'Requested'
            WITH USER_MODE
        ]) {
            changes.add(new Test_Drive__c(
                Id = row.Id, Status__c = 'Cancelled'
            ));
        }
        if (!changes.isEmpty()) update as user changes;
        return changes.size();
    }
}
```

## 3. Understand the size boundary

A single-record example can hide a query or DML statement inside a loop. Repeating it for many input records then repeats those operations and consumes finite transaction limits. The sample method uses one query and one collection update. That is a bulk-aware shape, but it is not a claim of unlimited capacity: one vehicle could still have an enormous number of appointments.

For the Junior exercise, use a bounded synthetic dataset with 200 total eligible appointments. State that boundary. Larger datasets and recovery strategies belong in later lessons. Include a few Confirmed appointments that must remain unchanged, and a Requested appointment for a vehicle outside the supplied set.

Prepare the expected counts before invoking the method. After it runs, requery the records instead of trusting the method's returned number alone. Verify the eligible statuses changed and the excluded statuses did not. Run a restricted-user scenario separately so that an administrator's broad rights do not conceal a missing business permission.

Remember that updating records can run validation, Flow, and triggers already active in the org. Resource consumption and failures belong to the entire transaction, not only this short method. Record the active relevant automation with your results.

> **🔎 Check your understanding**
>
> Verify both the changed set and the untouched set by reading stored records after execution.

### Step 1: Create the method

Use the setup guide to create the class and API 68.0 metadata in the learning project.

> **🔎 Check your understanding**
>
> Expected result: The source declares an explicit access policy.

### Step 2: Prepare a bounded dataset

Create eligible and ineligible appointments with known vehicle relationships.

> **🔎 Check your understanding**
>
> Expected result: Expected changes are countable before execution.

### Step 3: Run and requery

Invoke the method for the chosen IDs and inspect the saved statuses.

> **🔎 Check your understanding**
>
> Expected result: The result matches eligibility, not merely input size.

## ⚡ Independent practice: Demonstrate selective bulk cancellation

Provide evidence for empty, single-record, and 200-record scenarios.

1. Include Confirmed records and another vehicle as exclusions.
2. Record query and DML behaviour using appropriate logs or test limits.
3. Test a permitted caller and document a restricted access failure.

### Your work is ready when

- No query or DML is executed once per appointment.
- Only Requested appointments for supplied vehicles change.
- The stated dataset boundary is honest.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does assigning a field in memory save it?

**Answer:** No. A successful DML operation is required to persist a change.

### 2. Why use explicit user mode?

**Answer:** It declares the intended access enforcement and avoids depending on changing defaults.

### 3. Does one query make the function infinitely scalable?

**Answer:** No. Query rows, memory, CPU, DML rows, and other transaction work still have limits.

## What to take away

- Distinguish SOQL from DML.
- Use explicit operation access modes.
- Verify a selective collection update.

## Sources and further reading

- [Database access modes](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-enforce-usermode.html)
- [DML statements](https://developer.salesforce.com/docs/platform/apex-ref/references/apex-ref/apex-dml-section.html)


---

# Use a Thin Trigger and a Focused Handler

J20 · junior · About 50 minutes with practice

![An incoming group of record cards activating one event-driven processing node](https://sam-portal-production.up.railway.app/lesson-images/J20.jpg)

Validate the whole incoming collection while keeping business rules outside the trigger entry point.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Choose a trigger event from the requirement.
- Validate a complete incoming collection.
- Separate context dispatch from business rules.

## 1. Understand what starts a trigger

An Apex trigger runs in response to specified database events, such as inserting or updating records. Before triggers run before the final stored result is established and can be useful for checking or changing incoming values. After triggers serve different needs, including work that relies on saved identifiers. Choose the event from the requirement rather than using after update for every problem.

Oleg agrees two small rules for this lesson. A Confirmed appointment must identify its vehicle, customer, and scheduled time. An existing Completed appointment must not change status. This is not a complete scheduling state machine: it does not check calendar overlap or guarantee that every possible business transition is covered. Those limits are explicit.

> **💡 Key idea**
>
> A trigger is an entry point. The handler should express a small, named business responsibility.

## 2. Read old and new values for the whole collection

Trigger.new contains the incoming records for supported events. Trigger.oldMap provides previous records keyed by ID for update scenarios. Comparing old and new values lets the handler distinguish an actual transition from an unrelated edit. Repeating the same Completed status is not a change and should not be rejected by the terminal-status rule.

The handler loops over every incoming record, not only the first. addError marks an invalid record with an explanation. Whether a caller permits partial success affects the overall save result; the normal all-or-none DML statement can fail the group. Do not claim that addError always produces exactly the same batch outcome regardless of the calling operation.

The handler below performs no query or DML. It validates the pending records directly. That avoids an unnecessary update of the same records from inside their own update trigger, a common source of repeated execution. The class sharing declaration is not the mechanism enforcing these business rules; the explicit checks are.

> **⚠️ Watch out**
>
> Trigger execution context and database-operation defaults are version-sensitive. This API 68.0 example avoids database operations inside the handler.

**TestDriveStatusGuard.cls**

```apex
public with sharing class TestDriveStatusGuard {
    public static void validate(
        List<Test_Drive__c> pending, Map<Id, Test_Drive__c> previous
    ) {
        for (Test_Drive__c row : pending) {
            if (row.Status__c == 'Confirmed' &&
                (row.Vehicle__c == null || row.Customer__c == null ||
                 row.Scheduled_At__c == null)) {
                row.addError('A confirmed test drive needs a vehicle, customer, and time.');
            }
            if (previous != null && previous.containsKey(row.Id)) {
                Test_Drive__c oldRow = previous.get(row.Id);
                if (oldRow.Status__c == 'Completed' &&
                    row.Status__c != oldRow.Status__c) {
                    row.addError('A completed test drive cannot change status.');
                }
            }
        }
    }
}
```

**TestDriveTrigger.trigger**

```apex
trigger TestDriveTrigger on Test_Drive__c (before insert, before update) {
    TestDriveStatusGuard.validate(
        Trigger.new, Trigger.isUpdate ? Trigger.oldMap : null
    );
}
```

## 3. Make the contract visible in tests

Create a valid Confirmed appointment with all three references or values. Then attempt to confirm an incomplete request and expect the explanatory failure. For the transition rule, create an appropriate synthetic Completed appointment and attempt to move it back to Requested. Also edit an unrelated allowed field while leaving Completed unchanged; this specific rule should not reject that operation.

Include multiple records in a single DML call so that the loop matters. A handler that only checks pending[0] could pass a single-record example while ignoring the rest. In J22, turn these cases into automated tests with assertions. For now, record the predicted and observed behaviour carefully.

If an equivalent validation rule already enforces the same condition from an earlier experiment, decide which implementation owns the rule. Avoid keeping two independent copies simply because both seem harmless. They can produce duplicate messages and drift when the requirement changes. Document the chosen implementation and any disabled experimental rule in the handover.

> **🔎 Check your understanding**
>
> Include an invalid record after the first position in your batch. The first record alone is not a sufficient trigger test.

## ⚡ Independent practice: Submit a trigger with a narrow responsibility

Implement and explain the two agreed validation rules.

1. Keep the trigger limited to context dispatch.
2. Test valid insert, invalid confirmation, completed-status change, and unchanged completed status.
3. Repeat with a collection containing an invalid record beyond position zero.

### Your work is ready when

- All pending records are checked.
- The handler contains no unnecessary self-update.
- The submission states what the rules do not guarantee.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why use old values?

**Answer:** They distinguish a transition from an unrelated edit that keeps the same status.

### 2. Why avoid updating the same records again in this handler?

**Answer:** The before-event records are already being saved, and another update can cause unnecessary recursion.

### 3. Does this prevent double booking?

**Answer:** No. The rules check required confirmation information and a terminal status, not scheduling conflicts.

## What to take away

- Choose a trigger event from the requirement.
- Validate a complete incoming collection.
- Separate context dispatch from business rules.

## Sources and further reading

- [Trigger execution order](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-triggers-order-of-execution.html)
- [Trigger access-mode release note](https://help.salesforce.com/s/articleView?id=release-notes.rn_apex_triggers_system_mode.htm&language=en_US&release=262&type=5)


---

# Trace Automation Through a Transaction

J21 · junior · About 50 minutes with practice

![An orderly sequence of four process tiles inside one transaction boundary](https://sam-portal-production.up.railway.app/lesson-images/J21.jpg)

Explain how several automations participate in one save and verify what a rollback actually removes.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Trace relevant automation within a transaction.
- Distinguish memory from persisted data.
- Verify rollback with a fresh query.

## 1. A user action can start more than one operation

Anna edits an appointment once, but the platform may run validation, before-save automation, triggers, and after-save automation as part of processing that change. A transaction is a unit of database work with a commit or rollback outcome. Commit makes successful changes durable; rollback reverses the transaction changes covered by that rollback.

Use the official order-of-execution reference for the API and release you are working with. Do not memorize an old infographic as timeless truth. For this lesson, follow the relevant segments: before-save record-triggered Flow, before triggers, custom validation, later trigger and after-save automation stages, and the eventual commit. This is a focused route through the official sequence, not a complete replacement for it.

> **💡 Key idea**
>
> Draw the transaction boundary before drawing arrows between automation tools.

## 2. Predict interactions in the Northstar project

Suppose the J20 handler rejects an incomplete Confirmed appointment. The fact that Anna clicked the final button does not mean the record committed before that rejection. Likewise, the J17 Flow may attempt to create a follow-up Task and reach its Custom Error fault route. In that designed failure case, the source save is rejected rather than leaving a valid appointment with a silently missing required Task.

Two automations can also affect one another. An after-save action that updates its triggering record can cause another save cycle. A condition that remains true on every edit may repeat work. Prefer an event and change condition tied to the requirement. Do not reach immediately for a global static Boolean; a blanket skip can hide legitimate records or later processing.

A separate asynchronous execution after commit has its own transaction boundary. Rolling back a later transaction does not automatically undo an earlier committed transaction. External side effects have additional considerations as well. The Junior exercise concentrates on database changes in one learning-org transaction and labels work outside that scope rather than pretending all effects share one rollback switch.

> **⚠️ Watch out**
>
> A log line saying an operation started or a variable containing an ID does not prove that the record remained committed.

## 3. Observe a small explicit rollback

Use the short anonymous Apex experiment below only in the named learning org and with a user permitted to create and read Vehicle records. A savepoint marks a position to which the code can roll back database work. After inserting a synthetic vehicle, the example explicitly rolls back and queries by the ID held in memory.

The expected count is zero. The variable can still contain an ID even though the inserted database row no longer exists. That difference between in-memory state and persisted state is the point of the exercise. Existing validation or automation may affect the insert; record those conditions if your result differs.

Next revisit the controlled Flow fault from J17. Compare the appointment and Task counts before and after the failed operation. Read the user-facing error and the available debug information. Your explanation should connect the specific failure to the transaction outcome, not merely report that something red appeared on the screen.

Keep debugging focused: enable an appropriate trace for the actual executing identity, reproduce once with synthetic data, and inspect the relevant events. Excessive unrelated logging makes the causal sequence harder to see. Remove temporary diagnostic settings when finished.

> **🔎 Check your understanding**
>
> Requery stored records after the operation. Do not infer persistence from an object variable alone.

**Anonymous Apex: explicit rollback in the learning org**

```apex
Savepoint checkpoint = Database.setSavepoint();
Vehicle__c demo = new Vehicle__c(
    Name = 'Rollback demonstration',
    Model__c = 'City EV', Status__c = 'Available'
);
insert as user demo;
Id attemptedId = demo.Id;
Database.rollback(checkpoint);
Integer remaining = [
    SELECT COUNT() FROM Vehicle__c
    WHERE Id = :attemptedId WITH USER_MODE
];
Assert.areEqual(0, remaining, 'The inserted row must not remain after rollback.');
```

## ⚡ Independent practice: Explain a failed save from start to finish

Produce a small timeline and before-and-after record evidence.

1. Identify the automations relevant to one appointment save.
2. Run the explicit rollback example and inspect the stored result.
3. Explain the controlled Flow failure using a transaction boundary.

### Your work is ready when

- The timeline is labelled as a relevant subset of the official order.
- A retained variable ID is not mistaken for a committed record.
- Separate asynchronous work is not described as the same transaction.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does a generated ID prove commit?

**Answer:** No. The transaction can roll back while the variable still retains its assigned ID.

### 2. Why can an after-save update cause repeated work?

**Answer:** It can start another save cycle whose conditions qualify again.

### 3. Does a later asynchronous rollback undo a prior commit?

**Answer:** Not automatically. It belongs to a separate transaction and may require explicit recovery design.

## What to take away

- Trace relevant automation within a transaction.
- Distinguish memory from persisted data.
- Verify rollback with a fresh query.

## Sources and further reading

- [Official order of execution](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-triggers-order-of-execution.html)
- [Transaction control](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/langCon_apex_transaction_control.htm)


---

# Write Apex Tests That Prove Behaviour

J22 · junior · About 50 minutes with practice

![A small test bench comparing an expected result card with an actual result card and one check](https://sam-portal-production.up.railway.app/lesson-images/J22.jpg)

Create independent test data and assert valid, invalid, and bulk outcomes rather than aiming only for executed lines.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Write assertions for meaningful outcomes.
- Create independent synthetic test data.
- Test invalid and bulk behaviour as well as success.

## 1. A test is a claim with executable evidence

A useful test states what should happen for known inputs and checks the result. Code coverage measures which executable lines ran; it does not prove the business rule was correct. A test that calls a method without assertions can execute many lines while allowing a wrong result to pass unnoticed.

Start with a pure function from J18. A deterministic input and expected output make the purpose clear. Then test the record behaviour from J20 with synthetic data created by the test. Avoid depending on ordinary records already present in the org. An isolated test should explain its own setup and survive changes to unrelated sample data.

> **💡 Key idea**
>
> For every test, name the behaviour that would make it fail if the implementation were wrong.

## 2. Separate setup, execution, and assertions

An Apex test method is marked @IsTest. The test creates its inputs, performs the operation, and checks the result with assertions. Test.startTest and Test.stopTest delimit the operation under test and provide the documented testing behaviour for limits and asynchronous work. They do not turn a weak assertion into a strong one.

For the trigger tests, create a Vehicle with a Name, Model, and appropriate Status, and a fictional Contact with LastName. Create Test Drive records using those IDs and a future Scheduled_At__c. Use Confirmed when testing a valid confirmation, so the create-only Requested reminder Flow is not accidentally the central subject of that particular test. Test the Flow interaction separately.

For an invalid confirmation, omit one required reference and inspect the failed SaveResult from Database.insert(record, false). Assert that it failed and that the relevant error explains the missing information. The false argument permits per-record result reporting; inspect the result instead of expecting that simply reaching the next line proves success.

A bulk test should include 200 appropriate records in one operation and verify the intended result for all of them. Put an invalid record beyond the first position in a separate partial-success test to catch handlers that only inspect the first element. Keep the expected all-or-none or partial-success policy explicit.

> **⚠️ Watch out**
>
> A runAs block is not a universal replacement for CRUD and FLS enforcement. Test the actual access mode and operation your application uses.

## 3. Begin with a small complete test

The example checks deduplication, occupied values, sorting, and empty-input behaviour in the pure SlotPlanner function. Its assertions compare the expected collection directly. Deploy the class and its API 68.0 metadata to the learning org, then run the test through the setup guide's test command or supported interface.

After it passes, make a deliberate temporary defect in a local learning branch: remove the occupied-value check. Run the same test and confirm it fails for the intended reason, then restore the implementation. This mutation exercise demonstrates that the assertion observes an important rule rather than merely documenting a number.

No Salesforce test execution was performed when this course text was authored. Your submission must include the actual environment, executed test names, outcomes, and relevant failure details from your run. Do not copy a sample 'passed' label into evidence. If deployment fails, that is a result to diagnose, not a reason to claim the tests were executed.

> **🔎 Check your understanding**
>
> A meaningful assertion should fail when the relevant business behaviour is deliberately broken.

**SlotPlannerTest.cls**

```apex
@IsTest
private class SlotPlannerTest {
    @IsTest
    static void removesOccupiedInvalidAndDuplicateMinutes() {
        Test.startTest();
        List<Integer> actual = SlotPlanner.available(
            new List<Integer>{960, 840, 600, 600, 1500, null},
            new Set<Integer>{840}
        );
        Test.stopTest();
        Assert.areEqual(new List<Integer>{600, 960}, actual,
            'Valid unoccupied minutes must be unique and sorted.');
    }

    @IsTest
    static void returnsEmptyForMissingInput() {
        Assert.areEqual(0, SlotPlanner.available(null, null).size());
    }
}
```

## ⚡ Independent practice: Build a behaviour-focused test suite

Test the pure function and appointment validation with independent data.

1. Add valid confirmation and rejected incomplete confirmation tests.
2. Add completed-status and unchanged-status cases.
3. Add a 200-record case and a deliberately broken implementation check.

### Your work is ready when

- Assertions check the intended business outcome.
- Tests do not depend on ordinary org data.
- The submitted results come from an actual run or are clearly marked unperformed.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Can 100% coverage accompany incorrect behaviour?

**Answer:** Yes. Executed lines do not guarantee useful assertions or correct expected outcomes.

### 2. Why create test records?

**Answer:** They make the test independent and make its input assumptions visible.

### 3. What does the deliberate defect demonstrate?

**Answer:** That the test detects the behaviour it claims to protect.

## What to take away

- Write assertions for meaningful outcomes.
- Create independent synthetic test data.
- Test invalid and bulk behaviour as well as success.

## Sources and further reading

- [Apex testing](https://trailhead.salesforce.com/content/learn/modules/apex_testing/apex_testing_intro)
- [System.Assert](https://developer.salesforce.com/docs/platform/apex-ref/references/apex-ref/apex-class-system-assert.html)


---

# HTML, JavaScript, and Your First Lightning Web Component

J23 · junior · About 75 minutes with practice

![Three clean interface building blocks assembling into one component card](https://sam-portal-production.up.railway.app/lesson-images/J23.jpg)

Learn the browser-language basics and build an explicitly simulated appointment preview with four visible states.

## Before you begin

- Complete the workspace setup guide; basic HTML and JavaScript are introduced in this lesson.
- Complete J01–J22 or understand the project data model and learning-org workflow.

## What you will learn

- Read basic HTML and JavaScript structures.
- Explain template bindings and state.
- Build distinguishable UI outcomes.

## 1. Understand markup and behaviour separately

HTML describes the structure of a web interface. A paragraph uses a p element; a list can use ul and li elements. Elements have opening and closing tags, and attributes describe additional information. A Lightning Web Component, or LWC, combines an HTML template with JavaScript behaviour and a metadata configuration file. It is not an Apex class running in the browser.

JavaScript stores values and responds to events in the browser. A string is text, an array is an ordered collection written with square brackets, and an object groups named values inside braces. The sample row { id: 'demo-1', label: 'City EV appointment' } is an object in browser memory. It is not automatically a saved Salesforce record. The strict equality operator === compares values without the same coercion behaviour as loose equality.

> **💡 Key idea**
>
> Component state is what the interface currently knows. Database state is what the server has actually stored.

## 2. Read the component contract

import loads a named capability from another JavaScript module. The class extends LightningElement so it can participate in the LWC framework. A property such as state stores the current display state. A method such as showSample runs when its button is clicked. A getter, written with get, derives a value from current properties without being called with parentheses in the template.

The template uses curly-brace bindings such as {isLoading} to read JavaScript properties. lwc:if, lwc:elseif, and lwc:else select the visible branch. Keep the branches adjacent. The list directive repeats markup for each row, and key supplies a stable identity for each rendered item. Do not use an array position as the meaningful identity of a changing business record.

This first component intentionally has no server connection. Its buttons reproduce loading, empty, success, and error states so you can inspect the interface before introducing data access. The sample label is not a claim that an appointment was booked. J24 connects a separate component to real accessible records through standard data components.

> **⚠️ Watch out**
>
> Show this component as a UI demonstration. Its sample IDs and rows must not be presented as Salesforce records.

**appointmentPreview.js**

```javascript
import { LightningElement } from 'lwc';
export default class AppointmentPreview extends LightningElement {
    state = 'empty';
    rows = [];
    get isLoading() { return this.state === 'loading'; }
    get hasError() { return this.state === 'error'; }
    get hasRows() { return this.rows.length > 0; }
    showLoading() { this.rows = []; this.state = 'loading'; }
    showError() { this.rows = []; this.state = 'error'; }
    reset() { this.rows = []; this.state = 'empty'; }
    showSample() {
        this.rows = [{ id: 'demo-1', label: 'City EV — sample appointment' }];
        this.state = 'ready';
    }
}
```

**appointmentPreview.html**

```html
<template>
    <lightning-card title="Appointment preview — demonstration">
        <div class="slds-p-around_medium">
            <lightning-button label="Loading" onclick={showLoading}></lightning-button>
            <lightning-button label="Sample" onclick={showSample}></lightning-button>
            <lightning-button label="Error" onclick={showError}></lightning-button>
            <lightning-button label="Empty" onclick={reset}></lightning-button>
            <template lwc:if={isLoading}><p role="status">Loading appointments.</p></template>
            <template lwc:elseif={hasError}><p role="alert">The preview could not load. Try again.</p></template>
            <template lwc:elseif={hasRows}>
                <ul><template for:each={rows} for:item="row">
                    <li key={row.id}>{row.label}</li>
                </template></ul>
            </template>
            <template lwc:else><p>No appointments to display.</p></template>
        </div>
    </lightning-card>
</template>
```

**appointmentPreview.js-meta.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>68.0</apiVersion>
    <isExposed>true</isExposed>
    <targets><target>lightning__AppPage</target></targets>
</LightningComponentBundle>
```

## 3. Observe state changes deliberately

Create the appointmentPreview bundle using the workspace guide, deploy it to the learning org, and add it to a Lightning App Page. The metadata exposes it to that page type. File and folder names must agree. A component cannot appear on an unsupported page merely because its HTML is correct.

Select each demonstration state and read the resulting message. Use keyboard navigation as well as a mouse. A blank panel is not a helpful empty state, and an error should not look like a successful empty response. Return from Error to Sample and verify that the stale error disappears.

Describe each line in your own words before extending the example. In particular, explain why assigning a new rows array changes the displayed information but does not create a database record. This separation makes the next lesson on real data much easier to reason about.

> **🔎 Check your understanding**
>
> The four states must be distinguishable without relying on colour alone.

### Step 1: Prepare the bundle

Create the three matching files and verify the learning-org target.

> **🔎 Check your understanding**
>
> Expected result: The component deploys with API 68.0 metadata.

### Step 2: Place the component

Add it to a supported Lightning App Page in the learning application.

> **🔎 Check your understanding**
>
> Expected result: The preview is visible in its intended container.

### Step 3: Exercise all states

Use each button, including a recovery from Error to Sample.

> **🔎 Check your understanding**
>
> Expected result: Messages and rows match the current state without stale content.

## ⚡ Independent practice: Build a clear four-state preview

Extend the simulated preview with a second sample appointment while preserving honest labels.

1. Explain the array, row object, getter, and click handler.
2. Show loading, empty, success, and error states.
3. Test keyboard operation and recovery from an error.

### Your work is ready when

- The interface is explicitly labelled as a demonstration.
- Sample rows are not claimed to be persisted.
- Every rendered row has a stable key.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does assigning rows create Salesforce records?

**Answer:** No. It changes browser component state only.

### 2. What does a getter do here?

**Answer:** It derives a display condition from the current state.

### 3. Why show an explicit empty message?

**Answer:** Users need to distinguish a successful empty result from loading or failure.

## What to take away

- Read basic HTML and JavaScript structures.
- Explain template bindings and state.
- Build distinguishable UI outcomes.

## Sources and further reading

- [LWC HTML files](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-html-file.html)
- [Conditional rendering](https://developer.salesforce.com/docs/platform/lwc/guide/create-conditional.html)


---

# Read and Edit a Record with Lightning Data Service

J24 · junior · About 50 minutes with practice

![A small component window connected to a shared data cache and a record card](https://sam-portal-production.up.railway.app/lesson-images/J24.jpg)

Use a standard record form for an ordinary edit and verify the result under a restricted user.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Use a record-page context deliberately.
- Choose standard data components for ordinary edits.
- Verify saved data and permission boundaries.

## 1. Choose the smallest useful data component

The preview from J23 contained only browser data. Anna now needs to edit the scheduled time and status of a real Test Drive record that she can access. For a standard record-editing task, begin with Salesforce base components backed by Lightning Data Service rather than immediately writing a custom Apex controller.

Lightning Data Service, often abbreviated LDS, supports record access for these components and works with the platform's permission model. The standard record form can display and edit selected fields, handle a normal save, and show supported errors. This reduces code you would otherwise need to write and maintain. It does not mean the application no longer needs testing or a correct underlying sharing design.

> **💡 Key idea**
>
> A standard component is useful when its contract matches the task. Custom code needs a concrete reason.

## 2. Use the current record context

A record page has a current record. The public recordId property receives that context when the component is placed in a supported record-page environment. The @api decorator marks the property as part of the component's public interface. It does not magically supply an ID in every possible container. A component on an ordinary App Page needs a different, explicit way to identify a record.

The JavaScript imports object and field references from the Salesforce schema. These imports make the intended metadata dependencies visible. The fields array contains only Scheduled At and Status for this task, not every field in the object. The form uses mode edit and provides its own standard save and cancel behaviour.

The metadata limits this example to Test Drive record pages. Create the appointmentEditor bundle separately from the simulated preview. Do not pass demo-1 from J23 as its recordId: that was an illustrative browser key, not a Salesforce ID. Open a real synthetic Test Drive in your learning org before evaluating this component.

> **⚠️ Watch out**
>
> The example needs a real accessible Test Drive record and a supported record-page context.

**appointmentEditor.js**

```javascript
import { LightningElement, api } from 'lwc';
import TEST_DRIVE from '@salesforce/schema/Test_Drive__c';
import SCHEDULED_AT from '@salesforce/schema/Test_Drive__c.Scheduled_At__c';
import STATUS from '@salesforce/schema/Test_Drive__c.Status__c';
export default class AppointmentEditor extends LightningElement {
    @api recordId;
    objectApiName = TEST_DRIVE;
    fields = [SCHEDULED_AT, STATUS];
}
```

**appointmentEditor.html**

```html
<template>
    <lightning-card title="Edit this test drive">
        <div class="slds-p-around_medium">
            <lightning-record-form
                record-id={recordId}
                object-api-name={objectApiName}
                fields={fields}
                mode="edit">
            </lightning-record-form>
        </div>
    </lightning-card>
</template>
```

**appointmentEditor.js-meta.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>68.0</apiVersion><isExposed>true</isExposed>
    <targets><target>lightning__RecordPage</target></targets>
    <targetConfigs>
        <targetConfig targets="lightning__RecordPage">
            <objects><object>Test_Drive__c</object></objects>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

## 3. Verify the saved outcome and the access boundary

Open an appointment owned by the intended test user, edit its scheduled time to a valid future value, and save. Reopen or refresh the record and confirm the stored value. A value changed in an input box is not proof that the save succeeded. Repeat with a value rejected by the J08 time rule and check the error without assuming that the UI validation replaces server-side enforcement.

Test with field access deliberately limited according to the agreed persona. Confirm that the user cannot use this form to edit a field that should be unavailable. Also inspect record access: placing a component on a page does not make otherwise private records accessible. An administrator-only screenshot would miss both of these requirements.

If you need a custom arrangement or more control over submission events, investigate lightning-record-edit-form and its documented load, submit, success, and error events. That is a justified next step only when the simpler form no longer fits. Do not mix an unnecessary custom Apex save with a standard data form and then assume both data paths share identical refresh behaviour.

In your review note, explain why LDS fits this task and name one requirement that could require a different approach, such as a specialized multi-record business operation. The point is to choose based on behaviour, not to avoid learning Apex or to use Apex everywhere.

> **🔎 Check your understanding**
>
> Verify an actual stored value, a validation failure, and a restricted-user boundary.

### Step 1: Deploy and place

Add appointmentEditor to a Test Drive record page and activate the intended page assignment.

> **🔎 Check your understanding**
>
> Expected result: A real record ID reaches the public property.

### Step 2: Test the valid edit

Change a permitted future time and inspect the saved record.

> **🔎 Check your understanding**
>
> Expected result: The displayed result matches stored data.

### Step 3: Test the invalid edit

Use a past newly supplied time and inspect the validation response.

> **🔎 Check your understanding**
>
> Expected result: The invalid save is rejected visibly.

### Step 4: Test limited access

Repeat under the intended restricted persona.

> **🔎 Check your understanding**
>
> Expected result: The form respects the applicable object, field, and record boundaries.

## ⚡ Independent practice: Explain a standard-form decision

Deliver the working editor and a short comparison with a custom Apex alternative.

1. Identify the component context and schema dependencies.
2. Capture valid, invalid, and restricted-user outcomes.
3. Describe one requirement outside this simple form.

### Your work is ready when

- No synthetic preview ID is used as a Salesforce record ID.
- The outcome is verified after save.
- The choice of standard components is justified.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does @api recordId always populate in every container?

**Answer:** No. It depends on the supported context or a value explicitly supplied by a parent.

### 2. Why import schema references?

**Answer:** They make the object and field dependencies explicit to the platform tooling.

### 3. Does a record form remove the need for access tests?

**Answer:** No. The complete configuration must still be tested under the intended user.

## What to take away

- Use a record-page context deliberately.
- Choose standard data components for ordinary edits.
- Verify saved data and permission boundaries.

## Sources and further reading

- [Edit a record](https://developer.salesforce.com/docs/platform/lwc/guide/data-edit-record)
- [Record form reference](https://developer.salesforce.com/docs/platform/lightning-component-reference/guide/lightning-record-form.html?type=Develop)


---

# Pass Data Down and Send Events Up

J25 · junior · About 50 minutes with practice

![A parent component container and two child cards communicating with one upward event arrow](https://sam-portal-production.up.railway.app/lesson-images/J25.jpg)

Split a small interface into a parent and child with clear ownership of state.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Define component responsibilities.
- Pass read-only data through public properties.
- Communicate intent through a narrow event.

## 1. Give each component a responsibility

A component can become difficult to understand when it owns a list, renders every row, edits a record, and coordinates unrelated behaviour. Splitting it helps only when the responsibilities become clearer. For this exercise, appointmentPicker owns a small simulated list and the selected identifier. appointmentChoice displays one item and announces that the user selected it.

A public @api property lets the parent supply data to the child. The child should treat an object supplied by its owner as read-only. If it wants a change, it should communicate an intent rather than secretly altering the parent's object. This makes the direction of state ownership visible and makes later bugs easier to trace.

> **💡 Key idea**
>
> The owner decides the state. A child displays the supplied value and announces an action.

## 2. Use a small event contract

A CustomEvent communicates something that happened. Its type is a string agreed between sender and listener. In this example the type is selectappointment, and the detail is just the selected identifier. Sending a primitive identifier avoids exposing a mutable object when the parent only needs to know which item was chosen.

The child dispatches the event from itself. The parent listens directly on the child element with onselectappointment. The default non-bubbling, non-composed behaviour is sufficient for this direct relationship. Do not set every event to bubble across boundaries merely because it seems easier; a broader event contract exposes behaviour to more consumers.

The examples still use simulated rows so that you can understand communication independently of record access. The parent displays the chosen demonstration ID. It does not pass that ID into the real record form from J24. To integrate with actual data later, the parent must receive real accessible Salesforce IDs through an appropriate data path.

> **⚠️ Watch out**
>
> An event is a UI message, not proof of authorization or a database save.

**appointmentChoice.js**

```javascript
import { LightningElement, api } from 'lwc';
export default class AppointmentChoice extends LightningElement {
    @api choice;
    get label() { return this.choice ? this.choice.label : 'No appointment'; }
    handleSelect() {
        if (!this.choice) return;
        this.dispatchEvent(new CustomEvent('selectappointment', {
            detail: this.choice.id
        }));
    }
}
```

**appointmentChoice.html**

```html
<template>
    <lightning-button label={label} onclick={handleSelect}></lightning-button>
</template>
```

**appointmentPicker.js**

```javascript
import { LightningElement } from 'lwc';
export default class AppointmentPicker extends LightningElement {
    rows = [
        { id: 'demo-1', label: 'City EV — sample' },
        { id: 'demo-2', label: 'Touring — sample' }
    ];
    selectedId = 'None';
    handleSelect(event) { this.selectedId = event.detail; }
}
```

**appointmentPicker.html**

```html
<template>
    <lightning-card title="Choose a sample appointment">
        <div class="slds-p-around_medium">
            <template for:each={rows} for:item="row">
                <c-appointment-choice key={row.id} choice={row}
                    onselectappointment={handleSelect}>
                </c-appointment-choice>
            </template>
            <p role="status">Selected demonstration ID: {selectedId}</p>
        </div>
    </lightning-card>
</template>
```

**appointmentChoice.js-meta.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>68.0</apiVersion><isExposed>false</isExposed>
</LightningComponentBundle>
```

**appointmentPicker.js-meta.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>68.0</apiVersion><isExposed>true</isExposed>
    <targets><target>lightning__AppPage</target></targets>
</LightningComponentBundle>
```

## 3. Inspect the boundary rather than adding global variables

Create both component bundles. Give the child an API 68.0 metadata file with isExposed false, because it is used inside the parent. Expose the parent on a Lightning App Page using the configuration pattern from J23. Both bundles must be deployed, because the parent references the child by its kebab-case tag name.

Select the first row and then the second. The parent should display the corresponding ID each time. Inspect the child and confirm it does not assign to choice.id or change the supplied object. The parent remains the source of the selected state. A shared global variable is unnecessary for this local relationship.

Now deliberately mismatch the event name in a disposable local change. Observe that the child button can still respond internally while the parent never receives the agreed message. Restore the matching name. This is a useful debugging exercise because the visible symptom does not automatically imply a server problem.

If the interface grows beyond a direct parent-child relationship, other communication mechanisms may become appropriate. They belong to a different design discussion. For this small example, keep the contract narrow enough that you can explain every value crossing the component boundary.

> **🔎 Check your understanding**
>
> Trace the selected ID from child event detail to parent state without mutating the incoming row object.

### Step 1: Create two bundles

Add the child and parent files with matching names and the appropriate exposure metadata.

> **🔎 Check your understanding**
>
> Expected result: The parent can render the child.

### Step 2: Select each item

Use both child buttons and observe the parent status text.

> **🔎 Check your understanding**
>
> Expected result: Each event carries the expected primitive ID.

### Step 3: Inspect ownership

Review assignments in both classes and perform the deliberate event-name mismatch test.

> **🔎 Check your understanding**
>
> Expected result: State ownership and the communication failure are explainable.

## ⚡ Independent practice: Build a two-component picker

Extend the example with a third simulated item and document the public contract.

1. Describe the child input and event detail.
2. Show that selecting each item updates only the parent-owned selection.
3. Record the mismatch symptom and its correction.

### Your work is ready when

- The child does not mutate the supplied object.
- Events use a clear matching name and minimal detail.
- The simulation is not described as a database operation.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Who owns selectedId?

**Answer:** The parent appointmentPicker component.

### 2. Why send only the identifier?

**Answer:** It is the smallest information the parent needs and avoids exposing unnecessary mutable data.

### 3. Do these direct events need global propagation?

**Answer:** No. The parent listens directly to its child; wider propagation is unnecessary.

## What to take away

- Define component responsibilities.
- Pass read-only data through public properties.
- Communicate intent through a narrow event.

## Sources and further reading

- [Create and dispatch events](https://developer.salesforce.com/docs/platform/lwc/guide/events-create-dispatch.html)
- [Component data flow](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-data-flow.html)
- [Event propagation](https://developer.salesforce.com/docs/platform/lwc/guide/events-propagation.html)


---

# Investigate a Failure from Symptom to Cause

J26 · junior · About 50 minutes with practice

![A magnifying glass isolating one highlighted break in an otherwise clean code path](https://sam-portal-production.up.railway.app/lesson-images/J26.jpg)

Use a reproducible case, a focused hypothesis, and the right evidence from the browser or Salesforce.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Write a reproducible bug report.
- Choose evidence appropriate to the failing layer.
- Verify a minimal correction with a regression check.

## 1. Describe what failed without guessing the layer

A useful bug report starts with a person and an action. 'Max selected Touring, but the selected ID remained None' is more actionable than 'the component is broken.' Record the current user, page, relevant synthetic record, steps, expected result, and actual result. Include whether the problem happens every time and whether another user sees the same behaviour.

Separate the observation from the hypothesis. The unchanged selected ID is an observation. 'The child event name does not match the listener' is a hypothesis. 'Salesforce is slow' is another hypothesis, but it needs evidence. Keeping those categories separate prevents the first plausible explanation from becoming an untested conclusion.

> **💡 Key idea**
>
> Collect evidence that could disprove your hypothesis, not only evidence that seems to support it.

## 2. Work through a browser-side example

Use the two-component picker from J25. In a disposable learning change, rename the parent's event listener from onselectappointment to onappointmentselect while leaving the child event type unchanged. The child still dispatches selectappointment, but the parent is listening for a different event. The parent value remains unchanged.

Open the browser developer tools. The Console helps inspect JavaScript errors and carefully chosen diagnostic messages. A breakpoint in the child handler can confirm it runs. A breakpoint in the parent handler can show that it is not reached. You do not need to inspect a Salesforce database query to explain this particular mismatch because the example performs no server request.

Restore the matching event name and repeat the same steps. Verify both the first and second item, not merely the one you used during investigation. Remove temporary logging that would clutter the interface or expose unnecessary information. A successful fix includes a clear explanation of the broken contract and a check that protects it from recurrence.

> **⚠️ Watch out**
>
> Do not paste authentication tokens, real customer data, or complete private logs into public submissions.

## 3. Choose different evidence for server-side failures

Now consider a real record edit rejected by the J08 time rule. The browser can show the request outcome and user-facing validation message, but the business rule is enforced on the server. Changing the visual colour of the error does not correct the input or the requirement. Read the message, inspect the relevant rule, and test a valid future time.

For Apex behaviour, use an appropriately scoped debug log for the actual executing identity. Reproduce once and inspect the relevant exception or operation sequence. For the reminder Flow, inspect the active version and fault path. A wrong Task Status value, missing activity support, and a denied record edit are different causes even when each ends with a failed save.

Avoid solving all three examples by increasing user permissions. A JavaScript event mismatch has nothing to do with sharing. An invalid time is not an access failure. A missing Flow prerequisite needs the specific configuration change already described in J17. Diagnosis determines the remedy.

Finish with a short incident note: reproduction, cause, change, verification, and any remaining limitation. The goal is not a long diary of every click. Another developer should be able to understand why the change is justified and repeat the relevant check. If you cannot reproduce a reported failure, state that honestly and list the evidence still needed.

> **🔎 Check your understanding**
>
> Your final explanation should connect the observed symptom to a specific cause and a repeatable verification.

### Step 1: Create the controlled defect

Mismatch the parent listener in the simulated picker on a learning branch.

> **🔎 Check your understanding**
>
> Expected result: The symptom is reproducible without touching Salesforce records.

### Step 2: Inspect both handlers

Use browser breakpoints or minimal diagnostics to compare child and parent execution.

> **🔎 Check your understanding**
>
> Expected result: The missing communication boundary is identified.

### Step 3: Fix and retest

Restore the matching listener and select both sample items.

> **🔎 Check your understanding**
>
> Expected result: The parent updates consistently.

### Step 4: Compare a server rejection

Run an intentionally invalid time edit and inspect its validation response.

> **🔎 Check your understanding**
>
> Expected result: You distinguish UI communication from server business validation.

## ⚡ Independent practice: Submit one complete investigation

Choose the event mismatch or another controlled learning failure and explain it from symptom to proof.

1. Write exact reproduction steps and an initial hypothesis.
2. Capture only the evidence needed to locate the cause.
3. Record the smallest correction and repeat the original plus one adjacent scenario.

### Your work is ready when

- The note separates observed facts from hypotheses.
- The correction addresses the demonstrated cause.
- Private data and credentials are excluded.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Why is a hypothesis different from an observation?

**Answer:** A hypothesis proposes an explanation that still needs testing; an observation records what actually happened.

### 2. Would sharing changes fix the simulated event mismatch?

**Answer:** No. The example has a browser communication defect and no database request.

### 3. Why test an adjacent scenario after the fix?

**Answer:** It helps detect a correction that only works for the exact demonstration input.

## What to take away

- Write a reproducible bug report.
- Choose evidence appropriate to the failing layer.
- Verify a minimal correction with a regression check.

## Sources and further reading

- [LWC debugging](https://developer.salesforce.com/docs/platform/lwc/guide/debug-intro.html)
- [Custom events](https://developer.salesforce.com/docs/platform/lwc/guide/events-create-dispatch.html)


---

# Use Git to Hand Over a Reproducible Change

J27 · junior · About 50 minutes with practice

![A tidy branching path of commits joining a reviewed change card](https://sam-portal-production.up.railway.app/lesson-images/J27.jpg)

Capture the relevant metadata, review a small diff, and submit a version another person can inspect.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Distinguish metadata from business data.
- Review a minimal source diff.
- Hand over a specific reproducible version.

## 1. Distinguish source history from the running org

Git records versions of files. Salesforce stores the active configuration and business records in an org. These are related but not automatically identical. A working field created in Setup will not appear in a local repository until the relevant metadata is retrieved. A local code edit will not run in the org until it is deployed successfully.

Metadata describes configuration and code: objects, fields, permission sets, Flow definitions, components, and other supported types. Business records are the customers and appointments stored using that configuration. A normal metadata deployment does not automatically recreate all of your synthetic test records. The handover therefore needs both a metadata plan and a sample-data setup explanation.

> **💡 Key idea**
>
> A reproducible handover explains what to deploy, what to configure or assign afterward, and how to verify the result.

## 2. Prepare a reviewable Git change

Use the SAM repository as a template to create your own repository when that route is appropriate. Choose public only if you are comfortable showing its contents to everyone; a private repository requires explicitly granting the instructor access. Keep your solution work in your own repository rather than opening a solution PR into the course curriculum.

A branch is a separate line of file changes. A commit is a recorded snapshot with a message. A pull request asks a reviewer to inspect the proposed difference between branches. Create a small branch for the assignment, inspect git status, and review git diff before staging files. Stage the intended paths rather than blindly adding every file in the workspace.

Never commit Salesforce authentication directories, environment secrets, access tokens, production exports, or customer information. The supplied ignore rules help, but they do not replace reviewing what Git actually tracks. If a secret was committed, deleting it in a later commit does not erase it from history; stop using that credential and arrange appropriate rotation before sharing the repository.

> **⚠️ Watch out**
>
> A public PR and its commit history are public. Use only synthetic learning data and inspect the complete diff.

## 3. Retrieve, deploy, and document the actual scope

From the Salesforce DX project directory, retrieve the components changed in Setup. The example command retrieves only Test Drive metadata; it is not a complete project backup. Add the other relevant types or use a reviewed package manifest for your actual change. Include the activity setting from J17, added fields, page configuration, Flow, permissions, and code when they are required by your solution.

A clean target learning org is stronger handover evidence than repeatedly deploying to the same manually configured org. Authenticate that separate environment through the setup guide and deliberately assign the alias sam-review before using the deployment example. Do not point the command at an employer or production environment. Read the deployment result and test result; a command returning a job ID is not necessarily a completed successful deployment.

Some work remains outside a metadata deploy, such as assigning permission sets to the intended users and creating synthetic records. Write these steps explicitly with expected outcomes. Avoid a README that says only 'deploy everything' when the demonstration depends on an undocumented role, user, or active Flow version.

Submit through the portal with labelled files or an optional link to the PR in your own repository. Include the assignment ID, exact commit SHA when using Git, verification results, and known limitations. The instructor can review that version without merging a learner solution into the course repository.

> **🔎 Check your understanding**
>
> Can another person identify the exact reviewed version and repeat the setup without guessing hidden org changes?

**Examples: inspect the branch and retrieve one explicit component**

```bash
git switch -c codex/junior-capstone
git status --short
git diff
cd starter/salesforce
sf project retrieve start --metadata CustomObject:Test_Drive__c --target-org sam-training
```

**Deploy only after sam-review is authenticated as a separate learning org**

```bash
sf project deploy start --source-dir force-app --target-org sam-review --api-version 68.0 --test-level RunLocalTests --wait 20
```

## ⚡ Independent practice: Prepare a small review package

Hand over the appointment feature as a versioned, explainable change.

1. Review the diff and commit only intended source and documentation.
2. List metadata prerequisites, user assignments, and synthetic-data setup.
3. Provide the exact PR commit or labelled upload, deployment outcome, and verification evidence.

### Your work is ready when

- The package excludes credentials and real customer data.
- Setup-only changes required by the feature are captured or explicitly documented.
- The review target is an identifiable version in the learner repository.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. Does changing a local file change the org immediately?

**Answer:** No. A successful deployment is required for supported source changes.

### 2. Does metadata deployment recreate every sample customer?

**Answer:** No. Business-data setup needs its own explicit instructions.

### 3. Why record the commit SHA?

**Answer:** It identifies the exact version the reviewer should inspect and compare with the submitted evidence.

## What to take away

- Distinguish metadata from business data.
- Review a minimal source diff.
- Hand over a specific reproducible version.

## Sources and further reading

- [Salesforce CLI deployment](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project_deploy_start.html)
- [Retrieve metadata](https://developer.salesforce.com/docs/platform/api-metadata/guide/meta-quickstart-retrieve-use-retrieve.html)
- [Create a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)


---

# Deliver the Northstar Test-Drive Application

J28 · junior · About 50 minutes with practice

![A finished car test-drive application with a calendar and a small review check](https://sam-portal-production.up.railway.app/lesson-images/J28.jpg)

Demonstrate a complete small feature, explain its boundaries, and respond to a modest requirement change.

## Before you begin

- Complete the earlier Junior lessons and use only your personal learning org.

## What you will learn

- Demonstrate a complete small Salesforce feature.
- Connect implementation choices to business needs.
- Provide honest evidence and a reproducible handover.

## 1. Define the finished slice

Your Junior project is a small application for recording and managing test-drive requests. It is not a complete dealership platform, a production scheduling engine, or an Agentforce deployment. The goal is to connect business understanding, data, access, automation, code, interface behaviour, tests, and handover in one explainable slice.

Tell the story from the beginning. Irina asks Anna about a vehicle. Anna records the relevant customer, vehicle, and time in a Test Drive. Max needs the agreed access when helping with the appointment, and Oleg needs an accurate view of the team's work. Every technical component should support a part of that story rather than appear only because it was mentioned in a lesson.

> **💡 Key idea**
>
> A finished small feature has an observable result and stated limits. It does not need every possible technology.

## 2. Prepare evidence before recording the demonstration

Use only synthetic records in a named learning org. Confirm the core Lookup relationships, object ownership, relevant added fields, and current active automation. Review permission assignments and the access matrix from J16. Make sure the demonstrated user is the intended persona rather than an administrator whose privileges hide problems.

Run the behaviour tests from J22, including meaningful invalid and bulk cases. Record the actual results and the version they correspond to. If you changed the source after running the tests, determine whether the change requires another run rather than presenting old evidence as verification of the new version. Deployment or access checks that could not be executed must remain visibly unperformed.

Check the UI states as well as the happy path. A sample-only preview must still be labelled as a simulation; the real record editor must show a real accessible record. The Flow reminder should be described as a Task, not as an email service you have not configured. The application should explain invalid input clearly and preserve the intended access boundaries.

Finally, compare the saved metadata with the org. A good demonstration can still be difficult to review if a crucial field or activities setting exists only in Setup. Use the J27 handover checklist to capture those dependencies and any remaining manual assignments.

> **⚠️ Watch out**
>
> Do not claim production readiness, complete scheduling conflict prevention, or a passed Salesforce test that you did not run.

## 3. Demonstrate the business result and a failure case

Begin with a brief explanation of the people and the problem. Show Anna finding the vehicle and customer, creating an eligible request, and locating the resulting appointment. Show the one follow-up Task required by your Flow design. Edit the source record and demonstrate that the create-only Flow does not add another reminder.

Next show a deliberately invalid input, such as a newly supplied past time or incomplete confirmation, and explain the responsible rule. Show one allowed and one denied operation from the access matrix. Explain the difference between a rule rejecting data and permissions rejecting an action. Reopen the saved record to prove persistence rather than ending the demonstration at an edited input box.

For a modest change request, ask Oleg to choose one bounded variation: for example, changing the maximum permitted duration from 120 to 90 minutes. Identify the affected requirement, rule, test boundaries, and documentation before editing. Do not change a random number and assume all dependent expectations remain correct.

Conclude with a short design discussion. Explain why Test Drive is independently owned, why a standard record form fits the ordinary edit, where explicit user-mode Apex is used, and which limit would concern you first if usage grew. You do not need a Senior architecture answer. You need an accurate account of what you built and what you would investigate next.

> **🔎 Check your understanding**
>
> Every important claim in the demonstration should point to a visible result, a test, or a clearly labelled design limitation.

### Step 1: Freeze a review version

Choose the commit or upload version and gather matching verification results.

> **🔎 Check your understanding**
>
> Expected result: The evidence refers to one identifiable solution.

### Step 2: Run the user journey

Demonstrate request creation, reminder behaviour, record persistence, and the relevant personas.

> **🔎 Check your understanding**
>
> Expected result: The feature is understandable as a business workflow.

### Step 3: Show controlled rejection

Run a known invalid case and explain the responsible mechanism.

> **🔎 Check your understanding**
>
> Expected result: The failure is expected and user-readable.

### Step 4: Handle a small change

List affected rules and tests before making the agreed modification.

> **🔎 Check your understanding**
>
> Expected result: The change is reasoned and verified rather than improvised.

## ⚡ Independent practice: Submit the Junior capstone

Deliver a short demonstration, source package, and review note for the Northstar appointment feature.

1. Include the user journey, one controlled failure, access evidence, and bulk-test result.
2. Provide setup instructions and the exact reviewed version.
3. List limitations, unperformed checks, and one next improvement with a reason.

### Your work is ready when

- The feature works within its stated educational scope.
- Critical correctness or access defects are corrected before requesting acceptance.
- The author can explain data, permissions, automation, code, and interface choices.
- No simulation or unexecuted test is misrepresented as a live result.

## 🔎 Check your understanding

Answer in your own words before reading the explanations.

### 1. What makes this more than a collection of exercises?

**Answer:** The components support one coherent business journey and can be deployed, tested, and explained together.

### 2. Why demonstrate an invalid case?

**Answer:** It proves the application protects an agreed boundary and communicates the failure clearly.

### 3. What should happen before implementing a changed duration limit?

**Answer:** Update the requirement and identify affected validation, boundary tests, and documentation.

## What to take away

- Demonstrate a complete small Salesforce feature.
- Connect implementation choices to business needs.
- Provide honest evidence and a reproducible handover.

## Sources and further reading

- [Acceptance criteria](https://trailhead.salesforce.com/content/learn/modules/user-story-creation/construct-a-user-story)
- [Apex testing](https://trailhead.salesforce.com/content/learn/modules/apex_testing/apex_testing_intro)
- [Deployment reference](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project_deploy_start.html)
