# Northstar Motors: Agentforce demo actions

Учебный дополнительно подключаемый DX-проект, API 68.0. Сначала разверни модель `starter/salesforce` в той же отдельной учебной org. Основной урок находится в `data/agentforce.json`.

`SAMDemoSlotCatalog` — read-only Apex invocable action. Он читает доступные пользователю Vehicle__c по точному Model__c и возвращает два **искусственных** слота на следующий день (10:00 и 14:00 UTC). Это не подключение к внешнему календарю и не резервирование. Action не создаёт данные.

Урок отдельно описывает ручное создание полей Booking_Key__c/Duration_Minutes__c, Flow бронирования и Flow Case handoff. Эти Flow не включены как готовые metadata; их нужно построить и проверить по главам 4–5. Не активируй агент до проверки этих Flow.

Из этой папки, после подключения правильной учебной org и выдачи себе минимальных прав на Vehicle__c:

```text
sf project deploy start --source-dir force-app --target-org sam-training --wait 10
sf apex run test --class-names SAMDemoSlotCatalogTest --target-org sam-training --result-format human --wait 10 --code-coverage
```

Код и тесты подготовлены, но не скомпилированы и не запущены в Salesforce org при создании портала. Успешный JSON/XML check не заменяет deploy и Apex tests. Код использует `WITH USER_MODE`; отказ по CRUD/FLS надо исправлять минимальными разрешениями, а не заменять его на system mode. Системный DML в test setup создаёт только искусственные тестовые записи.

Перед demo проверь активные Flow/validation из других заданий: они могут менять результат. Базовая среда урока — свежий starter, а не org со всеми работами сразу. Проверки ограниченного пользователя, доступ к агенту, Flow fault paths и действия после подтверждения описаны в уроке.
