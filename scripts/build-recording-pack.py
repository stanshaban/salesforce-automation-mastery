"""Build CameraCue v2 scripts from the authored lessons, with recording directions.

Speech is English. Recording and editing directions are Russian. Timing includes
screen work; pause CameraCue for a longer build rather than racing the script.
"""
import html
import json
import math
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "instructor" / "recording"
PUBLISH = ROOT.parent / "deliverables" / "skool-publication"
OUT.mkdir(parents=True, exist_ok=True)
manifest_file = PUBLISH / "skool-manifest.json"
if not manifest_file.exists():
    manifest_file = OUT / "skool-pages.json"
MANIFEST = json.loads(manifest_file.read_text())
LINKS = {x["id"]: x for x in MANIFEST}
if (PUBLISH / "intro-manifest.json").exists():
    LINKS.update({x["id"]: x for x in json.loads((PUBLISH / "intro-manifest.json").read_text())})
MEDIA = json.loads((ROOT / "public/lesson-media.mjs").read_text().split(" = ", 1)[1].strip().removesuffix(";"))

# Specific screen destinations and experiments, rather than a generic 'show lesson'.
SHOTS = {
"J01": "Покажи карточки Anna, Max и Irina и незаполненный запрос на тест-драйв. Заполни модель City EV, ответственного и следующий шаг. Закрой первоначальную заметку: проверь, сможет ли Max продолжить работу только по новой карточке.",
"J02": "Покажи заголовок открытой учебной org и App Launcher. На схеме отдели org от приложения Sales и продукта Sales Cloud. Разложи пять запросов Northstar между salesperson, administrator и developer.",
"J03": "Открой Trailhead → Hands-on Orgs. Покажи выбранную учебную org и Launch. Не снимай пароли, адрес личного аккаунта и авторизационные параметры. После запуска покажи название org, закрой и снова открой её тем же маршрутом.",
"J04": "В учебной org открой App Launcher → Sales → Contacts. Покажи переключатель Recently Viewed / All Contacts, затем один синтетический Contact → Details / Related. Открой шестерёнку → Setup, не меняя настройки.",
"J05": "Сравни список из двух синтетических автомобилей с полями объекта Vehicle в Object Manager. Выдели Model__c как поле, City EV как значение и целую строку как запись. Добавь к бумажной модели отдельную запись Test Drive.",
"J06": "Открой одностраничный brief Northstar. Запиши отдельно подтверждённые требования и вопросы. Покажи два примера приёмки: корректное подтверждение и отказ при отсутствии обязательных данных.",
"J07": "В Object Manager сравни Account, Contact, Opportunity и Case. Затем в отдельной учебной org создай Vehicle и Test Drive с API-именами из урока. Если объекты уже существуют, проверь их поля вместо создания дублей. Покажи два lookup-поля.",
"J08": "Object Manager → Test Drive → Fields & Relationships и Validation Rules. Покажи Duration, формулу и правило времени из урока. Выполни корректный ввод, некорректный ввод и несвязанное редактирование исторической записи. Не активируй правила в рабочей org.",
"J09": "Открой lookup Vehicle у Test Drive и его настройки удаления. Для master-detail используй только отдельные одноразовые учебные объекты. Покажи поведение владельца и удаления на них; не меняй основную связь курса.",
"J10": "App Manager → учебное приложение Northstar. Покажи переход от вкладки Test Drives к записи, затем focused list view и отчёт. Сверь число строк отчёта с заранее известным синтетическим набором.",
"J11": "Открой интерактивную модель Security в портале. По очереди убери object Read, доступ к полю и доступ к записи. Затем в Setup покажи соответствующие уровни на примере Test Drive. Не выдавай результат администратора за проверку продавца.",
"J12": "Setup → Permission Sets → учебный набор продавца → Object Settings → Test Drive. Сопоставь Read/Edit и поля с матрицей. Покажи полный список назначений ограниченного учебного пользователя и выполни allow/deny проверки.",
"J13": "Setup → Sharing Settings: покажи исходный OWD Test Drive. На схеме отдели владельца, коллегу и руководителя. В отдельной учебной конфигурации проверь одну точечную sharing rule и две контрастные записи.",
"J14": "Открой синтетическую Test Drive → Sharing. Зафиксируй владельца, ручную передачу доступа и настройку сохранения shares. После разрешённой учебной смены владельца сравни фактические источники доступа; не делай вывод только по видимости записи.",
"J15": "Покажи три карточки симптомов: объект отсутствует, поле недоступно, одна запись отсутствует. Для каждой запиши гипотезу, источник разрешения и минимальное исправление. Повтори первоначальную проверку после изменения.",
"J16": "Открой access-matrix с ролями Sales, Service, Manager. Для каждой строки покажи пользователя, операцию, ожидаемый и фактический результат. Невыполненные из-за лицензий проверки оставь явно помеченными.",
"J17": "В учебной org проверь Allow Activities у Test Drive. Открой record-triggered Flow: создание записи → создание Task → fault path с Custom Error. В Debug покажи успех и управляемую ошибку, затем проверь сохранённые записи.",
"J18": "В VS Code открой SlotPlanner из урока. Выдели типы переменных, List, Set и Map. Выполни метод на повторяющихся и занятых значениях, покажи фактический вывод и сравни с ручным прогнозом.",
"J19": "В VS Code покажи фильтр SOQL, коллекцию и один DML вне цикла. На небольшом синтетическом наборе сначала выполни запрос, затем изменение и повторный запрос. Сравни ожидаемые и изменившиеся ID.",
"J20": "В VS Code открой trigger и handler рядом. Проследи before insert/update, Trigger.new и oldMap. Выполни валидное подтверждение, невалидное подтверждение и изменение терминального статуса; проверь также неизменный Completed.",
"J21": "На схеме отметь соответствующие автоматизации одной транзакции. Выполни анонимный пример savepoint/rollback из урока только в учебной org. Сравни ID в переменной с повторным запросом к базе после rollback.",
"J22": "Открой Apex test рядом с SlotPlanner. До запуска назови ожидаемую коллекцию. Запусти тест, затем намеренно испорть одну проверяемую ветку, покажи красный результат и восстанови реализацию. Отдельно покажи 200 записей.",
"J23": "В VS Code покажи HTML, JS и metadata-файл одного LWC. Размести компонент на учебной странице. Покажи пустое состояние, данные и ошибку. Не снимай авторизационные файлы проекта.",
"J24": "На учебной record page покажи lightning-record-edit-form. Сохрани валидное изменение, затем вызови validation error. После каждого случая переоткрой запись. Отдельно проверь ограниченного пользователя.",
"J25": "Открой parent и child LWC рядом. Выдели @api для входа и CustomEvent для выхода. Выбери два разных автомобиля в интерфейсе и покажи, что состояние меняет родитель, а не ребёнок.",
"J26": "Создай контролируемую ошибку имени события из урока. Покажи симптом, listener и dispatched event. Исправь только несовпадение, повтори действие и отдельно продемонстрируй серверный отказ.",
"J27": "В VS Code Source Control покажи небольшой diff, status и commit. В отдельной папке проверь чистое получение проекта и README. Не публикуй auth-файлы, .env или личные данные.",
"J28": "Зафиксируй commit. Запиши путь Anna: контакт → автомобиль → тест-драйв → подтверждение → ожидаемый Task. Покажи отказ на неверных данных и ограниченный доступ, затем воспроизведение из README.",
"M01": "Открой матрицу доступа двух продавцов и менеджера. Сопоставь TD-A и TD-B с владельцами. Проверь object, field и record отдельно, затем убери ровно один учебный grant и повтори затронутые строки.",
"M02": "Setup → Permission Set Groups. Покажи reusable set, группу и muting set. Сравни четыре назначения из урока, включая независимый direct grant. На экране поясни, почему muting не отнимает разрешение, выданное вне группы.",
"M03": "Покажи ручной share одной записи, затем его удаление в учебной конфигурации. Если доступ остался, найди другой источник. На стандартной модели Account/Contact отдели implicit sharing от независимого custom lookup.",
"M04": "В VS Code покажи Apex Sharing Reason, share rows и reconciliation. На таблице проиграй назначения, отзыв и смену владельца. Запусти bulk/lifecycle тесты с проверкой отсутствия лишних shares.",
"M05": "Подготовь известный доступный набор записей. В поддерживаемой учебной конфигурации сравни доступ до и после restriction rule и разные пути чтения. Если функция недоступна, используй подписанную схему, не изображай успешный live run.",
"M06": "Покажи metadata API version у класса. Сравни явные режимы sharing и user-mode операций на матрице CRUD/FLS/record access. Отдельно покажи результат security tests до и после предполагаемого upgrade.",
"M07": "Открой decision table для одного требования: синхронность, объём, ошибки, сопровождение. Выдели ответственность, выбранную для Flow или Apex. Покажи реальное сохранение и отказ, не дублируя одну запись в обоих инструментах.",
"M08": "Покажи timeline Flow/trigger и durable operation key. Выполни повтор в той же транзакции и отдельный повторный запрос. Сверь persisted receipt и число бизнес-эффектов вместо проверки только static-флага.",
"M09": "В VS Code раздели service, pure rule и config adapter. Покажи Custom Metadata в отдельном окне. Подставь две конфигурации в unit tests без скрытого чтения org data из чистой функции.",
"M10": "Открой behavior table и соответствующие Apex assertions. Запусти independent fixtures, bulk case и mutation check. Покажи различие между line coverage и проверенным результатом.",
"M11": "На таблице сравни Queueable, Batch и Scheduled по задаче Northstar. Запусти один небольшой Queueable и покажи Apex Jobs. Затем посчитай busy-day demand, не называя маленький запуск нагрузочным тестом.",
"M12": "Покажи состояния durable request: Pending → Processing → Succeeded/Failed. В VS Code entry service и Queueable worker. Выполни demo-adapter success и controlled failure; проверь сохранённый статус и job ID.",
"M13": "В Batch class выдели start, execute, finish. Покажи независимые scopes, счётчики ошибок и partial results. Не используй один unit-test execute как доказательство нескольких production scopes.",
"M14": "Покажи scheduled launcher, ограничение перекрытия запусков и Apex Jobs. Запланируй только маленький учебный запуск, зафиксируй результат и убери созданное учебное расписание после демонстрации.",
"M15": "Открой contract table и схему Named Credential / External Credential. Покажи границу кода и секрета без значений credential. Проследи 200, 401 и timeout по заранее подготовленным response fixtures.",
"M16": "Рядом открой REST JSON contract и SOAP WSDL/generated stub. Выдели endpoint, operation и response. Запусти соответствующие unit mocks, явно называя их test context, а не live provider.",
"M17": "Покажи HttpCalloutMock с success, malformed body, 429, 500 и timeout. Запусти классификацию и bounded retry policy. Сверь число попыток и итоговый durable статус.",
"M18": "Открой external ID и unique key. Отправь один учебный запрос дважды, затем тот же key с другим vehicle. Сравни ID, число бизнес-записей и явный conflict outcome.",
"M19": "Покажи correlation key и журнал двух попыток без чувствительных payload. По очереди выбери retry, reconcile или manual review для известных результатов. Подтверди последующий статус записи.",
"M20": "В редакторе запросов сравни SOQL по Test Drive и SOSL по нескольким объектам. Покажи фильтр, ID и объём результатов. Отдельно объясни задержку search index после сохранения.",
"M21": "В браузере открой консоль и учебный LWC. Добавь/убери экземпляр и поменяй данные. Покажи constructor, connectedCallback, renderedCallback, disconnectedCallback и число подписок, не создавая loop в renderedCallback.",
"M22": "Покажи wire read, imperative write и владельца refresh. После успешного write смоделируй refresh failure. Раздели сохранённый результат от ошибки обновления интерфейса.",
"M23": "Сначала покажи CustomEvent child → parent. Затем независимый publisher/subscriber через LMS. Убери компонент, проверь cleanup и отсутствие повторных сообщений после возврата.",
"M24": "Покажи loading, empty, success и error в LWC. Пройди клавиатурой фокус и повтор. Запусти Jest behavior tests, затем покажи реальную доступность UI отдельно от mock-окружения.",
"M25": "В DevTools покажи границы двух компонентов. Сравни свойства, события и CSS через публичный контракт. Не используй доступ к чужой внутренней разметке как зависимость приложения.",
"M26": "На схеме обозначь commit producer и отдельную транзакцию subscriber. Проверь publish-after-commit и rollback в разрешённой учебной конфигурации, затем durable subscriber outcome, а не только publish result.",
"M27": "Открой supplied CDC trace. Повтори одно событие, переставь два события и добавь retention gap. Покажи checkpoint, deduplication и reconciliation как разные операции.",
"M28": "В отдельном учебном Git checkout покажи log до и после fetch. Затем merge и отдельный cherry-pick fix. На контролируемом конфликте объясни смысл обеих версий перед разрешением.",
"M29": "Открой учебный PR: ограниченный diff, проверки, setup order и recovery plan. Сверь commit результатов с commit PR. Не нажимай production deploy в демонстрации.",
"M30": "Открой scenario matrix. Проследи UI → request ID → worker → provider adapter → persisted result → refresh. Покажи один разрыв границы и минимальное исправление с повторной проверкой.",
"M31": "Покажи routing worksheet с presence, capacity, skills и work item. Меняй по одному условию. Live Omni-Channel снимай только при наличии нужной функции; иначе оставь схему явно подписанной simulation.",
"M32": "Открой action contract Agentforce и отдельно read/write границы. В поддерживаемой org покажи confirmation, trace и полученную запись. При отсутствии entitlement используй подписанный design walkthrough.",
"M33": "На схеме сравни Vehicle курса и официальный Automotive Cloud model. Отдельно укажи VIN, inventory, asset и ownership history. Не называй custom objects установленным Automotive Cloud.",
"M34": "Покажи PR/portal package, затем success, repeat, failure и denied operation. Выбери одну новую fault card. Проследи cause и исправление, затем снова выполни соседние проверки.",
"S01": "Построй timeline одной транзакции из реальных автоматизаций Northstar. Отдельной дорожкой покажи async boundary. Сопоставь журнал с commit/rollback, не изображая упрощённую схему полной спецификацией Salesforce.",
"S02": "Открой жалобу Anna и measurable target sheet. Задай пользовательский путь, объём, процентиль, корректность и границы измерения. Покажи, какие исходные данные ещё нужны.",
"S03": "Покажи browser Network timing, correlation ID и Apex log одного учебного действия. Разложи полное время по границам. Не складывай overlapping интервалы как последовательные.",
"S04": "Открой resource budget. Рассчитай queries, DML, CPU и async demand для заданного workload. Затем измени число записей и parallel requests, сохранив единицы измерения.",
"S05": "Покажи одинаковый fixture до и после изменения. Сначала assertions результата, затем сопоставимые метрики. Отдели локальный algorithm proxy от измерения Salesforce CPU.",
"S06": "Покажи broad/narrow SOQL, known fixture и доступный Query Plan. Сравни cardinality и relative cost с распределением данных. Не объявляй маленькую org доказательством enterprise selectivity.",
"S07": "На схеме отметь общий parent, который обновляют две транзакции. Проиграй конкуренцию и предложенный порядок работы. Live concurrency выполняй только в небольшой разрешённой учебной нагрузке.",
"S08": "Покажи import manifest с external IDs, accepted/rejected counts и checkpoint. Повтори одну партию и докажи reconciliation. Не запускай массовый импорт в неидентифицированную org.",
"S09": "Открой retention worksheet и отчёт по синтетической истории. Отдели рабочие записи, архив и путь восстановления/поиска. Покажи проверку бизнес-истории до любого удаления.",
"S10": "Построй access graph дилерской сети. Выдели owner, hierarchy, groups и shares разными стрелками. Проверь отрицательные пути, включая возможный обход через broad permissions.",
"S11": "На таблице effective grants найди два независимых пути доступа. Убери один на схеме и покажи, почему доступ остаётся. Подготовь phased removal и regression matrix вместо массового отключения прав.",
"S12": "Покажи tabletop runbook: Suspend → change → Resume → Recalculate → verify. Разыграй забытый Recalculate и manual share во время окна. Не запускай реальную maintenance operation ради видео.",
"S13": "На boundary diagram сопоставь external identity, entry point, Apex sharing и CRUD/FLS. Пройди один unauthorized request. Секреты, токены и реальные внешние пользователи в кадр не попадают.",
"S14": "Покажи ownership table для Salesforce и DMS: кто владеет каждым полем. Проследи обновление и конфликт. Выдели authoritative state и отображаемую копию отдельно.",
"S15": "Открой event trace с duplicate и out-of-order versions. Применяй события к одному aggregate по шагам. Покажи итоговый version и отсутствие повторного business effect.",
"S16": "Покажи outage timeline и bounded retry queue. Увеличь число клиентов на схеме, затем jitter/backoff и circuit-open state. Сравни нагрузку и reconcile неизвестный исход.",
"S17": "Разложи incident evidence по времени: user symptom, request key, attempts, state. Пометь observation и hypothesis. Построй причинную версию и укажи недостающую проверку.",
"S18": "Открой legacy automation inventory. Покажи characterization test, одну extracted responsibility и diff. Сравни поведение до/после и отдельный rollback step.",
"S19": "Покажи consumer/provider contract и response fixtures. Запусти malformed, missing field и timeout cases. Отдели unit mock, contract test и реальный network run.",
"S20": "Покажи staged release: compatible metadata → deploy → backfill → verify → enable. Разыграй остановку после backfill и восстановление без предположения, что metadata rollback отменяет данные.",
"S21": "Заполни ADR: context, decision, alternatives, consequences, evidence, review trigger. Сравни два решения на одном требовании. Риск привяжи к владельцу и следующей проверке.",
"S22": "Покажи Agentforce action boundary, confirmation и durable operation identity. Разыграй refused confirmation, retry и unknown outcome. Отдельно подпиши отсутствующие live entitlement/security tests.",
"S23": "Открой comparison table Core Salesforce / Automotive Cloud / DMS. Для VIN, inventory, sales, servicing и history назначь владельца данных. Сравни стоимость сопровождения и integration boundaries без выдуманных цен.",
"S24": "Начни таймер design interview. Сначала уточни бизнес-процесс и масштаб, затем нарисуй модель и boundaries. Введи новую failure constraint и пересмотри одно решение вслух.",
"S25": "Открой reproducible capstone package и commit. Покажи две связанные проблемы, одинаковые fixtures, correctness assertions и измерения. Затем новую fault card, recovery и список непроверенных границ.",
"JR01": "На обезличенных объявлениях отметь обязанности, обязательные условия и желательные навыки. Заполни target-role card своими подтверждёнными примерами. Не путай title с одинаковыми ожиданиями у всех компаний.",
"JR02": "Покажи bounded research prompt и таблицу источников. Открой оригинальную страницу каждого из пяти кандидатов. Исправь unsupported remote/location/status fields; не нажимай Apply в этом видео.",
"JR03": "Покажи job tracker с source URL, date checked, status и next action. Найди дубль, проверь устаревшую роль и назначь следующий шаг. Автоматизацию демонстрируй на безопасном sample batch.",
"JR04": "Открой evidence inventory: задача, личный вклад, артефакт, результат, предел утверждения. Преврати один расплывчатый bullet в проверяемое описание. Не придумывай revenue или проценты улучшения.",
"JR05": "Покажи обезличенный CV до и после: summary, experience, projects, skills. Свяжи каждое сильное утверждение с evidence inventory. Спрячь личный телефон и адрес.",
"JR06": "Открой одно объявление рядом с CV. Выдели подтверждённые совпадения и реальные пробелы. Переставь релевантные примеры, не добавляя несуществующий опыт.",
"JR07": "Покажи public project README, architecture sketch, safe demo и реальные tests. Проверь доступность ссылок без admin session. До публикации просмотри diff на auth-файлы и персональные данные.",
"JR08": "Покажи prompt интервьюера с уровнем и одной темой. Запиши один устный ответ, follow-up и rubric. Сравни уверенность формулировки с фактической правильностью и выпиши practice gap.",
"JR09": "В VS Code реализуй countByVehicle для supplied records. До кода согласуй null policy. Запусти empty, repeated vehicle и null cases; затем review варианта с query in loop.",
"JR10": "Покажи карточку опыта: context, personal action, outcome, limitation. Дай короткий ответ на камеру. Затем выбери вопросы команде о review, deployments и ownership, привязанные к будущей работе.",
"JR11": "Открой anonymized interview notes. Отдели точный вопрос от предположения о причине отказа. Выбери два пробела, назначь практику, проверку и дату повторного ответа.",
}

def speech(text):
    # Screen code is inspected, not dictated character by character.
    return {"type": "speech", "text": re.sub(r"\s+", " ", text).strip()}

def action(text):
    return {"type": "action", "text": text.strip()}

def save_script(id, title, scenes, track):
    if id in MEDIA:
        m = MEDIA[id]
        assets = ([m['animation']['video']] if 'animation' in m else []) + [s['file'] for s in m.get('screenshots', [])]
        scenes[0][1][0]['text'] += ' ГОТОВЫЕ ВСТАВКИ: ' + '; '.join('https://sam-portal-production.up.railway.app' + a for a in assets) + '. Анимацию используй как отдельное пояснение; UI показывай реальным снимком.'
    cues, start = [], 0
    for number, (label, blocks, work_seconds) in enumerate(scenes, 1):
        words = sum(len(b["text"].split()) for b in blocks if b["type"] == "speech")
        duration = max(12, math.ceil(words / 135 * 60) + work_seconds)
        cues.append(dict(start=start, duration=duration, label=f"{number:02} · {label}", blocks=blocks))
        start += duration
    obj = dict(version=2, title=f"{id} · {title}", cues=cues)
    folder = OUT / track / f"{id} — {re.sub(r'[/:?<>|]', '', title)}"
    folder.mkdir(parents=True, exist_ok=True)
    file = folder / f"{id}.scenario.json"
    file.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n")
    lines = [f"# {id} · {title}", "", f"Recording allowance: {start // 60}:{start % 60:02}", "English speech · Russian recording/editing directions", ""]
    for cue in cues:
        lines += [f"## {cue['label']}", ""]
        for b in cue["blocks"]:
            lines += [(f"> 🎬 {b['text']}" if b["type"] == "action" else b["text"]), ""]
    (folder / f"{id}.md").write_text("\n".join(lines))
    return dict(id=id, title=title, track=track, seconds=start, words=sum(len(b['text'].split()) for c in cues for b in c['blocks'] if b['type']=='speech'), file=str(file.relative_to(OUT)), url=LINKS.get(id,{}).get('url'))

def make_lesson(l):
    id = l['id']
    scenes = [("Результат и исходное состояние", [
        action(f"ДО ЗАПИСИ. Открой урок {LINKS[id]['url']}. Подготовь только синтетические данные и исходное состояние упражнения. {SHOTS[id]} Запиши финальный пример отдельным коротким проходом, затем верни исходное состояние. Если нужная функция недоступна, запиши объяснение схемы и явно назови эту границу."),
        action("КАМЕРА. Короткое вступление, затем экран. Действия ниже выполняй между соответствующими репликами. Для долгой сборки ставь CameraCue на паузу: ⌘⇧Space."),
        speech(f"Here is our practical task. {l['exercise']['brief']}"),
        action("МОНТАЖ ПОЗЖЕ. Вставь 6–10 секунд подготовленного результата. Это preview результата; пошаговую сборку покажи дальше без пропуска важных решений."),
        speech("By the end, you should be able to show the result and explain how you checked it. " + " ".join(l['exercise']['acceptance'][:2])),
    ], 15)]
    # Keep the mechanism and worked case in speech; long code remains on screen.
    for s in l['sections']:
        if 'Failure cases' in s['heading']:
            paras=s['body'][:1]
        elif s.get('steps'):
            paras=s['body'][:1]
        else:
            paras=s['body'][:2]
        blocks=[action(f"ЭКРАН. Раздел «{s['heading']}». Продолжай показ подготовленного примера. Выдели входные данные и решение именно этого раздела. Не прокручивай целый урок вместо демонстрации. Если это аналитическое упражнение, заполняй его рабочую таблицу по одному решению."), speech(" ".join(paras))]
        for code in s.get('codeBlocks',[]):
            blocks += [action(f"ЭКРАН · КОД. Открой пример «{code['caption']}» рядом с ожидаемым результатом. Выделяй вход, решение и выход; не читай весь листинг вслух. Перед запуском используй prerequisites и точную команду из урока. Запиши фактический вывод, включая ошибку, если она возникла."), speech(f"The example on screen is {code['caption'].rstrip('.')}. Before running it, identify the input, the branch that makes the decision, and the result we expect. We will compare that expectation with the actual output.")]
        scenes.append((s['heading'], blocks, 10 if not s.get('codeBlocks') else 35))
        for step in s.get('steps',[]):
            scenes.append((step['title'],[
                speech(f"Next, {step['title'][0].lower()+step['title'][1:]}. {step['instruction']}"),
                action(f"ПРИ ЗАПИСИ. Выполни именно описанный шаг «{step['title']}» на подготовленном экране. На длительной операции поставь суфлёр на паузу; убери из монтажа только ожидание. После действия задержи курсор у проверяемого результата на 2–3 секунды. Ожидаемый результат: {step['expected']} Если результат другой, сначала выясни причину; не произноси следующий вывод как уже доказанный."),
                speech("The result we are checking is this: " + step['expected']),
            ],45))
    if not any(s.get('steps') for s in l['sections']):
        for i, step in enumerate(l['exercise']['steps']):
            scenes.append((f"Практический шаг {i+1}", [
                speech(f"For the practical work, {step[0].lower()+step[1:]}"),
                action(f"ПРИ ЗАПИСИ. Выполни пункт {i+1} независимой практики в подготовленном fixture/worksheet. Покажи промежуточный артефакт и сохрани его. Не представляй расчёт или схему как выполненную операцию в Salesforce. Пауза суфлёра на время работы."),
                speech("Keep the intermediate result. We will need it when we check the complete exercise, rather than relying on the final screen alone."),
            ],45))
    q=l['knowledgeCheck'][0]
    warn=next((c['text'] for s in l['sections'] for c in s.get('callouts',[]) if c['kind']=='warning'),None)
    scenes.append(("Проверка и самостоятельная практика",[
        action("ЭКРАН. Вернись к результату упражнения. Покажи evidence, а не зелёный статус без деталей. Затем открой практическую задачу и остановись перед готовым решением."),
        speech((warn+" " if warn else "")+"Now pause the video and try the exercise yourself. " + l['exercise']['brief']+" "+" ".join(l['exercise']['acceptance'])),
        speech("Before you finish, answer this question in your own words. "+q['question']),
        action("ПРИ ЗАПИСИ. Пауза 4 секунды. Не показывай ответ раньше вопроса. Затем открой объяснение и сравни его с проверяемым результатом."),
        speech(q['answer']+" Save your work with the expected and actual results. If a check was not run, say which one remains and what you would need to run it."),
    ],12))
    return save_script(id,l['title'],scenes,l['track'])

rows=[]
lessons={}
for track in ['junior','middle','senior','jobs']:
    for f in sorted((ROOT/'data/lessons'/track).glob('*.json')):
        l=json.loads(f.read_text());lessons[l['id']]=l;rows.append(make_lesson(l))

af=json.loads((ROOT/'data/agentforce.json').read_text())
for ch in af['chapters']:
    id=ch['id'].upper()
    scenes=[("Цель и границы",[
        action(f"ДО ЗАПИСИ. Открой {LINKS[id]['url']} и специальную Agentforce Employee training org. Проверь prerequisite предыдущей главы. Записывай фактический Builder и реальные synthetic records. При отсутствии функции запиши схему и явно скажи, что live проверка не выполнена."),
        speech(ch['goal']+" "+ch['explanation']),
    ],15)]
    for st in ch['steps']:
        scenes.append((st['title'],[
            speech(st['detail']),
            action(f"ПРИ ЗАПИСИ · {st['title']}. Выполни этот шаг в учебной org по открытому уроку. Покажи конкретный input, изменяемую настройку или узел Flow и наблюдаемый output. На сборку поставь CameraCue на паузу ⌘⇧Space. Не снимай токены и auth-файлы. До изменения состояния сохрани before evidence, после — persisted record/trace. Если это подготовка permission/activation, используй только уже разрешённую учебную конфигурацию; доступ к чувствительным системам не расширяй ради съёмки."),
            speech("Check the value on screen before moving to the next step. If the result differs from the lesson, stop here and investigate that difference."),
        ],60))
    scenes.append(("Проверка результата",[
        action("ЭКРАН. Покажи expected/actual таблицу и соответствующий Flow debug, action trace или CRM record. Не подменяй результат live org симуляцией портала."),
        speech(" ".join(ch['expectedResults'])+" "+ch['checkpoint']),
        action("ПРИ ЗАПИСИ. Пауза для ответа. Покажи один из common failures и нужный диагностический экран."),
        speech("A common mistake to avoid is this: "+ch['commonFailures'][0]+" Keep the record or trace that supports your conclusion before continuing."),
    ],12))
    rows.append(save_script(id,LINKS[id]['title'].split(' · ',1)[1],scenes,'agentforce'))

rows.append(save_script('AF-L01','Project Overview and Prerequisites',[
 ("Результат проекта",[action("КАМЕРА. Представь Northstar Motors. МОНТАЖ ПОЗЖЕ: поверх речи вставь 8 секунд synthetic Contact, Vehicle и Test Drive. Это отдельные экраны, записанные после сборки проекта."),speech("We are going to build an employee sales assistant for Northstar Motors, a fictional car dealership. A salesperson will ask for a City EV demo slot, review the proposed booking, and confirm it. The result will be a Test Drive record that we can open and inspect. A separate confirmed request for human help will create a Case in a queue.")],12),
 ("Что выполняет агент",[action("ЭКРАН. Покажи схему: employee → agent → read catalog / booking Flow / Case Flow → CRM records. Подпиши demo slots и отдельную confirmation перед каждой write action."),speech("The agent provides the conversation. Apex reads an artificial catalog with two demo times. Two Flows perform the controlled writes. These are separate responsibilities. A convincing sentence in chat does not prove that a booking exists, and an artificial slot is not live dealership availability. We will verify the action trace and the stored record.")],12),
 ("Подготовка",[action("ЭКРАН. Открой prerequisites и официальный signup route из урока. Покажи версию API в metadata, список core/add-on файлов и setup guide. Не создавай аккаунт и не принимай условия во время обзорного видео."),speech("Use the special Developer Edition that supports Agentforce for employees. A normal Playground may not provide the same features. You also need the core Salesforce starter, the Agentforce Apex add-on, the additional booking fields, and the two Flows that we build during the course. All records will be synthetic. We start with the CRM process, then prepare the data and backend, build the agent, and test the result.")],12),
 ("Как проходить",[action("ЭКРАН. Покажи содержание AF00, затем verification matrix AF-Check. Выдели confirmed, declined, repeated и failure cases."),speech("Follow the chapters in order. Test each backend action before connecting it to the agent. Then check confirmation, declined writes, repeated bookings, missing data, restricted access, and backend failures. Record expected and actual outcomes. If your org cannot run a check, label it as outstanding. Your final project should make it clear which parts were built, which parts were tested, and what remains outside this demo.")],12)
],'agentforce'))

rows.append(save_script('AF-Check','Contracts and Verification',[
 ("Контракты",[action("ЭКРАН. AF-Check → Action contracts. Сравни input/output трёх действий. Отдельно выдели read-only catalog и confirmation на двух writes."),speech("This page is our reference for checking the complete assistant. Start with the action contracts. The catalog accepts an exact model and returns a result code, vehicle, and two artificial UTC slots. The booking Flow accepts the model, a real catalog slot key, and an accessible synthetic Contact ID. The handoff Flow accepts a reason and an optional accessible booking. Each write needs separate confirmation.")],15),
 *[(f"Проверка {test['id']}",[
     action(f"ПРИ ЗАПИСИ. Открой строку {test['id']} в матрице. Подготовь: {test.get('preparation',test.get('setup','см. урок'))}. Выполни input, затем покажи trace и before/after evidence. Не отмечай Passed до реального сравнения. На подготовку fixture останови суфлёр."),
     speech(f"For this check, use the scenario {test.get('title',test['id'])}. "+str(test.get('input',test.get('prompt','')))+" "+str(test.get('expected',''))),
 ],35) for test in af['testScenarios']],
 ("Передача результата",[action("ЭКРАН. Покажи README, metadata manifest, commit и results table. Раскрой одну строку passed и одну unexecuted. Не показывай credentials."),speech("Submit the metadata, the deployment order, the synthetic fixture, and the expected and actual result for every scenario. Keep the agent version with the evidence. A repeated booking must be checked against stored records. The minimal Case Flow does not provide durable Case deduplication, so repeated handoffs are a known limitation. Make that visible rather than describing this training demo as production ready.")],12)
],'agentforce'))

about_scenes=[
 ("Кому подходит курс",[action("КАМЕРА. Средний крупный план, спокойное приветствие. Все реплики запиши на камеру. Экраны для монтажа снимай отдельным проходом. Не добавляй обещаний работы, грейда или сертификации."),speech("Hi, I’m Stanislav. Welcome to Salesforce Automation Mastery. This community is for developers who want to understand Salesforce more deeply and become more confident building, explaining, and reviewing real features. You might be starting with CRM for the first time, moving beyond familiar Apex tasks, or preparing to discuss architecture and performance in an interview.")],5),
 ("Учебный проект",[action("МОНТАЖ ПОЗЖЕ · B01. Поверх следующей реплики вставь 8–12 секунд учебного проекта: synthetic Contact → Vehicle → Test Drive. Записывай экраны отдельно от речи, без реальных клиентов."),speech("We learn through Northstar Motors, a fictional car dealership. A customer asks for a test drive. A salesperson needs to find the right vehicle, record the appointment, and hand the work to a colleague. As the application grows, we add access control, automation, interfaces, integrations, and ways to recover when something fails. You can see what each technical decision changes for the people using the system.")],5),
 ("Junior",[action("МОНТАЖ ПОЗЖЕ · B02. Classroom → Junior → J00 contents. Покажи J01, J07, J17 и J28, затем один practical outcome. Во время основной записи продолжай говорить в камеру."),speech("The Junior path starts with what a CRM is, how Salesforce stores information, and how to find your way around an org. You build the data model, configure access, create a Flow, write Apex, and build a first Lightning Web Component. The goal is a small working feature that you can explain and hand over with tests and clear instructions.")],5),
 ("Middle и Senior",[action("МОНТАЖ ПОЗЖЕ · B03. Покажи M00 и S00, затем короткие фрагменты async state diagram и measured improvement worksheet. Не выдавай маленький demo fixture за enterprise load test."),speech("The Middle path connects those foundations. We work with asynchronous processing, API contracts, component communication, events, source control, and failure handling. The Senior path focuses on decisions: locating a performance problem, understanding access at scale, keeping integrations reliable, and changing an existing system without losing control of its behavior. You support your choices with evidence and explain the limits of what you tested.")],5),
 ("Agentforce и поиск работы",[action("МОНТАЖ ПОЗЖЕ · B04. Покажи Agentforce course contents и confirmation → persisted record. Затем Job Research course и portfolio checklist. Live agent trace используй только после фактической записи в поддерживаемой org."),speech("There is also a practical Agentforce project. You build an employee assistant that reads demo options, asks for confirmation, and creates a booking or a support Case. The Job Research course helps you turn your work into an honest CV and portfolio, research suitable roles, and practise technical interviews. We keep the focus on what you can demonstrate and explain.")],5),
 ("Как выглядит обучение",[action("МОНТАЖ ПОЗЖЕ · B05. Открой J04: practical outcome → demonstration → independent practice → acceptance. Затем портал: rotating self-check и submit form. Не отправляй фиктивную заявку в рабочую очередь."),speech("Each lesson gives you a practical outcome, an explanation, steps to try, and a check for deciding whether the work is ready. Read a small section, build that part, and compare the actual result with the expected one. Use the practice portal for self-checks and project submissions. The written lesson remains your reference while you work, so you can return to a step without searching through a long video.")],5),
 ("С чего начать",[action("КАМЕРА. Заверши прямым приглашением к первому действию. МОНТАЖ ПОЗЖЕ · B06: Classroom → нужный курс → его contents page. Цены и условия персонального review в этом видео не называй: их нужно сверять с действующими настройками."),speech("Start in the Classroom and open the contents page for the path that matches your experience. If you are new to Salesforce, begin with Junior and take the lessons in order. If you already build features, use the practical checks to find the gaps you want to work on. Choose one exercise, save your result, and explain how you know it works. That is where we begin.")],5),
]
rows.append(save_script('ABOUT','Welcome to Salesforce Automation Mastery',about_scenes,'00 — About'))

course_data=[]
ids={'junior':'J00','middle':'M00','senior':'S00','jobs':'JR00','agentforce':'AF00'}
for track in ids:
    id=ids[track]
    if track=='agentforce':
        title='Agentforce: Start Here and Course Contents'
        entry='Build the backend first, then the agent, then verify the stored result. Use a special Agentforce Employee training org.'
        members=[x for x in MANIFEST if x['id'].startswith('AF-')]
        modules=[dict(title='Project route',lessons=[dict(id=x['id'],title=x['title'].split(' · ',1)[1],outcome=(next((c['goal'] for c in af['chapters'] if c['id'].upper()==x['id']), 'Review prerequisites and contracts before running the project.' ))) for x in members])]
        exit='Demonstrate confirmation, refusal, repeated booking, and a queued Case using stored records and action traces.'
    else:
        meta=json.loads((ROOT/f'data/course-meta-{track}.json').read_text())
        title=f"{meta['title']}: Start Here"
        entry=meta['entry'];exit=meta['exit'];modules=meta['modules']
    parts=[f'<p>{html.escape(entry)}</p>', '<blockquote><p><strong>⚡ How to use this course</strong></p><p>Read the practical outcome first. Build one small step, compare the actual result with the expected result, then continue. Keep your source, test results, and a short explanation. An unavailable live feature should be labelled as an unexecuted check.</p></blockquote>',f'<h2>Your course project</h2><p>{html.escape(exit)}</p>','<h2>Course contents</h2>']
    for mod in modules:
        parts+=[f'<h3>{html.escape(mod["title"])}</h3><ul>']
        for l in mod['lessons']:
            parts += [f'<li><p><a href="{LINKS[l["id"]]["url"]}">{html.escape(l["id"]+" · "+l["title"])}</a><br>{html.escape(l["outcome"])}</p></li>']
        parts+=['</ul>']
    parts+=['<blockquote><p><strong>🔎 Before you submit</strong></p><p>Show what should happen, what actually happened, and the source version you tested. Use fictional records. Submit a focused pull request or permitted files through the SAM practice portal.</p></blockquote>']
    course_data.append(dict(id=id,track=track,title=f'{id} · Start Here and Course Contents',html=''.join(parts)))
    overview_scenes=[('Выбор маршрута',[action(f'ЭКРАН. Открой contents page курса {track}. Покажи prerequisites и результат проекта.'),speech(entry+' '+exit)],12)]
    for mod in modules:
        overview_scenes.append((mod['title'],[action(f'ЭКРАН. Прокрути до «{mod["title"]}». Открой один прямой lesson link, покажи practical outcome и вернись в contents.'),speech('This part covers '+mod['title'].lower()+'. '+' '.join(l['outcome'] for l in mod['lessons'][:3]))],12))
    overview_scenes.append(('Первое действие',[action('ЭКРАН. Покажи первый lesson link и правило self-check. Не открывай все уроки подряд.'),speech('Begin with the first lesson you have not yet completed. Keep a short record of your expected result, your actual result, and what you changed. Use the acceptance checks before moving on. If you already know a topic, demonstrate its practical result before skipping it.')],10))
    rows.append(save_script(id,title,overview_scenes,track))

PUBLISH.mkdir(parents=True, exist_ok=True)
(PUBLISH/'course-contents.json').write_text(json.dumps(course_data,ensure_ascii=False,indent=2)+'\n')
(OUT/'index.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
readme='''# Salesforce Automation Mastery — recording pack

CameraCue / CameraQ JSON version 2. One importable file per lesson, five contents videos, and the About introduction.

- **speech**: text to read in English.
- **action**: Russian instructions. `ПРИ ЗАПИСИ` means perform the action during the screen recording. `МОНТАЖ ПОЗЖЕ` means record that insert separately and place it over the narration later.
- Timings allow approximately 135 spoken words per minute plus screen work. Pause the prompter with **⌘⇧Space** for a longer build. Do not rush to match an estimated cue.
- Before recording, prepare the prerequisite metadata, a known synthetic fixture, and the expected result. Record a short finished-result insert, then reset the fixture for the walkthrough.
- Do not read source code character by character. Highlight its input, decision, and output; run it and show the actual result.
- A direction is a recording plan, not evidence that the org operation has already passed. If a live feature or license is missing, say so and use the explicitly labelled design/worksheet path.
- Import one or several `.scenario.json` files through CameraCue's file loader, paste JSON, or drag and drop them into the library. The accompanying `.md` files are readable scripts, not the app's import format.

## Files

'''
for row in rows:
    readme+=f'- [{row["id"]} · {row["title"]}]({row["file"].replace(" ","%20")}) — {row["words"]} spoken words, recording allowance {row["seconds"]//60}:{row["seconds"]%60:02}\n'
(OUT/'README.md').write_text(readme)
(OUT/'skool-pages.json').write_text(json.dumps(list(LINKS.values()),ensure_ascii=False,indent=2)+'\n')
subprocess.run([sys.executable, str(ROOT/'scripts/build-recording-index.py')], check=True)
print(f'Built {len(rows)} scripts, {sum(x["words"] for x in rows):,} spoken words; contents for five courses.')
