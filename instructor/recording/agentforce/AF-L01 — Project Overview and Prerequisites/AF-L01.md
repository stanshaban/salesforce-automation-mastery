# AF-L01 · Project Overview and Prerequisites

Recording allowance: 2:42
English speech · Russian recording/editing directions

## 01 · Результат проекта

> 🎬 КАМЕРА. Представь Northstar Motors. МОНТАЖ ПОЗЖЕ: поверх речи вставь 8 секунд synthetic Contact, Vehicle и Test Drive. Это отдельные экраны, записанные после сборки проекта.

We are going to build an employee sales assistant for Northstar Motors, a fictional car dealership. A salesperson will ask for a City EV demo slot, review the proposed booking, and confirm it. The result will be a Test Drive record that we can open and inspect. A separate confirmed request for human help will create a Case in a queue.

## 02 · Что выполняет агент

> 🎬 ЭКРАН. Покажи схему: employee → agent → read catalog / booking Flow / Case Flow → CRM records. Подпиши demo slots и отдельную confirmation перед каждой write action.

The agent provides the conversation. Apex reads an artificial catalog with two demo times. Two Flows perform the controlled writes. These are separate responsibilities. A convincing sentence in chat does not prove that a booking exists, and an artificial slot is not live dealership availability. We will verify the action trace and the stored record.

## 03 · Подготовка

> 🎬 ЭКРАН. Открой prerequisites и официальный signup route из урока. Покажи версию API в metadata, список core/add-on файлов и setup guide. Не создавай аккаунт и не принимай условия во время обзорного видео.

Use the special Developer Edition that supports Agentforce for employees. A normal Playground may not provide the same features. You also need the core Salesforce starter, the Agentforce Apex add-on, the additional booking fields, and the two Flows that we build during the course. All records will be synthetic. We start with the CRM process, then prepare the data and backend, build the agent, and test the result.

## 04 · Как проходить

> 🎬 ЭКРАН. Покажи содержание AF00, затем verification matrix AF-Check. Выдели confirmed, declined, repeated и failure cases.

Follow the chapters in order. Test each backend action before connecting it to the agent. Then check confirmation, declined writes, repeated bookings, missing data, restricted access, and backend failures. Record expected and actual outcomes. If your org cannot run a check, label it as outstanding. Your final project should make it clear which parts were built, which parts were tested, and what remains outside this demo.
