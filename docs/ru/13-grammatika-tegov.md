# Грамматика тегов BRIDGE

BRIDGE-теги — короткие машиночитаемые пометки в названиях слоёв. Они добавляют только тот продуктовый смысл, которого нет в метаданных Figma.

## Главное правило

Не добавляйте тег, если он повторяет данные Figma.

Figma уже является источником правды для:

- типа слоя;
- Auto Layout, размеров, интервалов, внутренних отступов и выравнивания;
- иерархии фреймов, групп и компонентов;
- позиционирования, обрезки и масок;
- заливок, обводок и эффектов;
- исходного компонента, вариантов и свойств компонента.

BRIDGE-тег нужен только для продуктового смысла или правила переноса.

## Синтаксис

Свойство со значением записывается так:

```text
[property=value]
```

Признак или черновая отметка без значения записывается так:

```text
[decor]
[asset]
[link]
[control]
```

Стабильным идентификатором обычного слоя может быть само имя:

```text
hero-title
product-photo
close-icon
button-group
```

Имена и значения идентификаторов пишутся по-английски в `kebab-case`. Исключение составляют теги со специальным синтаксисом: например, `[route=/path]`, `[href=https://...]` и `[action=modal:target-id]`.

Не добавляйте в дочерний идентификатор ширину или устройство. Контрольная ширина уже задана на корневом фрейме через `[bp=...]`.

Плохо:

```text
Отзывы [control=button-reviews-box-768] [action=modal:marketplaces-modal]
```

Хорошо:

```text
Отзывы [action=modal:marketplaces-modal]
```

Суффиксы `-768`, `-375`, `-mobile` и `-desktop` недопустимы в значениях `[link]`, `[control]`, `[field]`, `[modal]`, `[state]`, `[section]`, `[collection]`, `[item]`, `[decor]` и `[asset]`.

## Теги, которые добавляет дизайнер

### Страница и маршрут

```text
[page=home]
[route=/]
[bp=1920]
[view=default]
[anchor=faq]
```

```text
Главная [page=home] [route=/] [bp=1920] [view=default]
Вопросы и ответы [anchor=faq]
```

`[page=...]`, `[bp=...]` и `[view=...]` задают страницу, контрольную ширину и состояние. `[route=...]` или `[route-pattern=...]` добавляется только для настоящего рабочего маршрута:

```text
Контакты [page=contacts] [bp=1440] [view=default]
Контакты [page=contacts] [route=/contacts] [bp=1440] [view=default]
Карточка товара [page=product-detail] [route-pattern=/catalog/:slug] [bp=1440] [view=default]
```

Не придумывайте рабочий адрес ради заполнения тега.

### Секция

```text
[section=product-slider]
[section=home-hero]
```

`[section=...]` задаёт стабильный тип секции, а не заголовок конкретного блока.

Если блок является экземпляром компонента из `Page Sections`, тег не нужен:

```text
header
reviews
footer
```

Секционный ключ определяется по исходному компоненту:

```text
Page Sections / header -> section=header
Page Sections / reviews -> section=reviews
Page Sections / footer -> section=footer
```

Для обычного фрейма или слишком общего компонента ключ указывается явно:

```text
Каталог [section=product-slider]
Похожие товары [section=product-slider]
Рекомендованные товары [section=product-slider]
Первый экран [section=home-hero]
```

Не используйте префикс `Секция /`: назначение уже понятно из тега или исходного компонента.

### Цели действий

```text
[modal=contact-modal]
[state=mobile-menu-open]
```

```text
Окно обратной связи [modal=contact-modal]
Открытое мобильное меню [state=mobile-menu-open]
```

### Ссылки

Известный адрес задаётся через `[href=...]`. Дополнительный `[link=...]` обычной ссылке не нужен.

```text
[href=/contacts]
[href=/contacts#faq]
[href=#faq]
[href=https://t.me/company]
[href=mailto:sales@example.com]
[href=tel:+12025550123]
```

Если адрес неизвестен, используйте черновую отметку:

```text
contacts-link [link]
```

`[href=#]` недопустим. `#faq` указывает на существующий якорь, а одиночный `#` не является адресом.

Дополнительное поведение:

```text
telegram-link [href=https://t.me/company] [open=new-tab] [a11y-label=Telegram]
```

`[link=...]` используется только при необходимости отдельного машинного идентификатора:

```text
contacts-cta [link=nav-contacts-primary] [href=/contacts]
```

Валидатор различает:

- `/path` — внутренний маршрут;
- `#anchor` — якорь на текущей странице;
- `/path#anchor` — якорь на другой странице;
- `https://...` — внешний адрес;
- `mailto:` и `tel:` — внешний протокол.

### Элементы управления и действия

Известное ненавигационное действие задаётся через `[action=...]`. Дополнительный `[control=...]` обычной кнопке не нужен.

```text
[action=modal:contact-modal]
[action=state:mobile-menu-open]
[action=submit:lead-form]
[action=reset:catalog-filters]
[action=none]
```

```text
contact-cta [action=modal:contact-modal]
menu-button [action=state:mobile-menu-open]
lead-submit [action=submit:lead-form]
reset-filters [action=reset:catalog-filters]
disabled-cta [action=none]
```

Если действие неизвестно, используйте `[control]`:

```text
contact-cta [control]
```

`[control=...]` нужен только при необходимости отдельного машинного идентификатора:

```text
contact-cta [control=contact-cta-primary] [action=modal:contact-modal]
```

Допустимые формы:

```text
[action=modal:target-id]
[action=state:target-id]
[action=submit:form-id]
[action=reset:target-id]
[action=none]
```

### Поля

Полю нужны стабильный ключ и имя данных:

```text
email [field=email] [name=email]
country [field=country] [name=country]
message [field=message] [name=message]
```

`[field-type=...]` добавляется только тогда, когда тип нельзя получить из компонента или метаданных поля:

```text
country [field=country] [name=country] [field-type=select]
```

### Коллекции и повторяющиеся элементы

Используйте `[collection]` и `[item]`, если нужно явно описать динамический список:

```text
products [collection=products]
product-card-oak-chair [item=product]
product-card-wool-lamp [item=product]
```

Общее значение `[item=product]` классифицирует повторяемую роль или тип и не является идентификатором. Уникальный экземпляр макета и рабочую запись задают стабильное имя слоя/`bridgeKey` и структурированные сопоставления `designInstance`/`runtimeData`. Если повторение очевидно из структуры и экземпляров компонентов, дополнительные теги не нужны.

### Контент, декор и экспорт

Контентное изображение получает стабильное имя без `[image=...]`:

```text
product-photo
article-cover
author-avatar
```

`[decor]` обозначает декоративный слой:

- он не является продуктовым содержимым;
- не должен попадать в дерево доступности;
- не требует альтернативного текста;
- сохраняет стабильное имя между адаптивами.

```text
snow-bg [decor]
hero-glow [decor]
```

`[asset]` обозначает сложный визуал, который нужно экспортировать или использовать целиком:

```text
promo-poster [asset]
lab-illustration [asset]
snow-bg [decor] [asset]
```

Если имя слоя уже стабильно, используйте формы без значения. `[decor]` и `[asset]` описывают назначение и не считаются дополнительными идентификаторами.

Форма со значением остаётся запасным вариантом:

```text
Frame 182 [decor=snow-bg]
Group 91 [asset=promo-poster]
```

### Высота и переполнение

Используйте эти теги только тогда, когда поведение нельзя надёжно получить из Figma или его нужно явно зафиксировать для динамического содержимого:

```text
[height=hug]
[height=fixed]
[height=min]
[height=fill]
[overflow=visible]
[overflow=hidden]
[overflow=scroll]
[overflow=truncate]
[lines=3]
```

```text
description [height=hug]
description [height=fixed] [overflow=truncate] [lines=3]
```

### Исключения

```text
[bridge-exception=raster-text]
[bridge-exception=overlap]
[bridge-exception=fixed-height]
[bridge-exception=manual-line-break]
[bridge-exception=unsupported-effect]
[bridge-exception=manual-transfer]
[reason=brand-lockup]
```

Правила:

- каждое исключение требует `[reason=...]`;
- ручной перенос строки допустим только как часть содержания или утверждённой композиции;
- исключение не исправляет проблему, а делает её явной и проверяемой.

## Теги, которых не должно быть в Figma

```text
[text=...]
[image=...]
[icon=...]
[container=...]
[layout=...]
[abs]
[component=...]
[to=...]
```

Причины:

- текст, изображение и иконка получают тип из Figma, а идентификатор — из имени;
- структура задаётся фреймами, группами, компонентами и Auto Layout;
- позиционирование хранится в Figma;
- исходный компонент и варианты приходят из метаданных компонента;
- адрес ссылки всегда задаётся через `[href=...]`, а не `[to=...]`.

## Владение компонентами

Не помечайте экземпляр на странице `[component=...]`, если Figma уже знает его исходный компонент.

```text
contact-cta [action=modal:contact-modal]
```

Состояния `default`, `hover`, `focus`, `disabled`, `loading` и `error` принадлежат исходному компоненту в `UI Kit`.

Подробнее: [компоненты, `UI Kit` и `Page Sections`](14-komponenty-i-ui-kit.md).

## Недопустимые примеры

```text
hero-title [text=hero-title]
```

Тип текста уже известен Figma. Достаточно имени `hero-title`.

```text
content [container=content] [layout=stack]
```

Структуру нужно собрать фреймом `content` и Auto Layout.

```text
snow-bg [decor] [abs]
```

`[decor]` описывает смысл, а позиционирование берётся из Figma. Правильно: `snow-bg [decor]`.

```text
FAQ [to=anchor:contacts-faq] [href=/contacts#faq]
```

Заданы две цели. Используйте только `[href=/contacts#faq]`.

```text
unknown-link [href=#]
```

Одиночный `#` не является адресом. Используйте `unknown-link [link]`.

```text
Отзывы [control=button-reviews-box-768] [action=modal:marketplaces-modal]
```

Идентификатор не должен содержать ширину. Достаточно `Отзывы [action=modal:marketplaces-modal]`.
