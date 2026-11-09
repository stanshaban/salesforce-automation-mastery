# Northstar Motors: исходная модель

Это небольшой Salesforce DX-проект для учебной org. Он содержит схему, от которой можно начать задания. Готовых Flow, Apex-решений, LWC и ответов на задания здесь нет.

## Что внутри

| Объект | Поля |
| --- | --- |
| `Vehicle__c` | `Name` (Text), `VIN__c` (Text 17, unique external ID), `Model__c` (Text 80), `Status__c` (Available / Reserved / Unavailable) |
| `Test_Drive__c` | `Name` (AutoNumber TD-{0000}), `Vehicle__c` (Lookup), `Customer__c` (Lookup Contact), `Scheduled_At__c` (DateTime), `Status__c` (Requested / Confirmed / Completed / Cancelled) |

Оба объекта имеют Private sharing. Связь тест-драйва с автомобилем — **Lookup**: у тест-драйва остаётся собственный владелец. Удаление связанной записи очищает необязательный lookup. Master-Detail можно сравнить в отдельном эксперименте; основную ветку для security-заданий оставь с Lookup.

Permission set `SAM_Lab_Basics` выдаёт Read/Create/Edit к двум учебным объектам, доступ к их полям и Read к Contact. Delete, View All и Modify All не выдаются. Он не создаёт record sharing и не гарантирует доступ к всем Contact: это зависит от профиля, FLS, владения и sharing учебной org. Не считай проверку под System Administrator доказательством правильных прав обычного пользователя.

## Начало работы

Пройди визуальный раздел VS Code в портале. Затем открой **эту папку** в VS Code: Salesforce Extensions должны видеть рядом `sfdx-project.json`.

Авторизуй отдельную учебную Developer Edition через браузер:

```sh
sf org login web --alias sam-lab
```

Проверь адрес org в открывшемся браузере. Не используй рабочую production-org. Перед deploy всегда указывай alias явно:

```sh
sf project deploy start --source-dir force-app --target-org sam-lab --dry-run
sf project deploy start --source-dir force-app --target-org sam-lab
sf org open --target-org sam-lab
```

Сначала прочитай результат dry run, только затем выполняй deploy. Эти команды нужно запускать самому в своей учебной среде. Создатели starter выполнили статические проверки файлов; успешное развёртывание в твоей org ещё нужно подтвердить.

Минимальный permission set назначается только выбранной учебной персоне, когда это соответствует заданию. Назначение широкому профилю не нужно. Пример для текущего авторизованного пользователя учебной org:

```sh
sf org assign permset --name SAM_Lab_Basics --target-org sam-lab
```

Для просмотра через интерфейс можно создать свои Tabs, Lightning App и страницы в Setup как часть задания. Это позволяет отдельно проверить, чем навигация отличается от доступа к данным.

## Версия и проверки

Baseline — `sourceApiVersion: 68.0` (Winter ’27). Это зафиксированная версия starter, а не обещание всегда использовать последнюю. Если учебная org не поддерживает её, сначала проверь версии и паспорт лаборатории; не меняй номер механически в задании, где поведение Apex зависит от версии.

Из корня всей репозитории:

```sh
node scripts/check-submission.mjs
```

Успешный static check не означает, что Apex-тесты прошли: их пока нет в starter. Когда добавишь Apex, запускай нужные тесты в своей учебной org и прикладывай фактический результат.

## Источники

- [DX project configuration](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-ws-config.html).
- [API version и sourceApiVersion](https://developer.salesforce.com/docs/platform/sfdx-setup/guide/sfdx-setup-apiversion.html).
- [Winter ’27, API 68.0](https://developer.salesforce.com/blogs/2026/10/developers-guide-to-the-winter-27-release).

Проверено 9 ноября 2026.
