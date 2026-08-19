# 交互和目标

BRIDGE 对每个交互锚点使用一个事实来源。导航使用 `href`。非导航行为使用 `action`。然后，一个重要的操作解析为结构化的 [reaction/state-machine contract](22-state-machines-and-reactions.md)；短标签是一个定位器，而不是整个行为规范。

简单的设计器路径不需要普通链接和按钮的机器 ID。

```text
contacts [href=/contacts]
contact-us [action=modal:marketplaces-modal]
```

## 链接使用 `href`

已知的导航目的地直接写为`[href=...]`。该标签足以将该层分类为链接。

```text
contacts [href=/contacts]
faq [href=/contacts#faq]
same-page-faq [href=#faq]
telegram [href=https://t.me/company]
email [href=mailto:sales@example.com]
phone [href=tel:+12025550123]
```

Rules:

- `[href=...]` 既是链接标记又是唯一的目的地事实。
- 不要添加 `[link=...]` 只是为了表示该层是一个链接。
- 内部路由以 `/` 开头。
- 同页锚点以 `#` 开头，并且必须命名真正的锚点，例如 `#faq`。
- `[href=#]` 不是未知占位符并且无效。
- 外部 URL 以 `http://` 或 `https://` 开头。
- `mailto:` 和 `tel:` 是有效的外部协议。
- 不要添加第二个语义目标，例如 `[to=...]`。

如果目的地未知，请使用布尔草稿标记 `[link]` 而不是假 href：

```text
Contacts [link]
```

`[link]` 表示“该层将是一个链接，但 href 未知”。它作为草稿标记是有效的，但它是最终切换之前的 TODO。

可选的行为标签可以描述链接如何打开，而不是它指向的位置：

```text
telegram [href=https://t.me/company] [open=new-tab] [a11y-label=Telegram]
```

### 可选的高级链接 ID

仅当实现、分析或自动化管道需要与层名称不同的显式稳定机器 ID 时，才允许将 `[link=...]` 作为高级覆盖。

```text
contacts-cta [link=nav-contacts-primary] [href=/contacts]
```

该值必须是英文短横线大小写，并且不得包含断点后缀，例如 `-768`、`-375`、`-移动` 或 `-桌面`。

## 控件使用 `action`

控件是一种交互元素，它执行除直接导航之外的其他操作。已知的非导航行为直接写为`[action=...]`。该标签足以将该层分类为控件/按钮。

```text
contact-us [action=modal:marketplaces-modal]
menu [action=state:mobile-menu-open]
reset-filters [action=state:catalog-default]
submit [action=submit:lead-form]
disabled-cta [action=none]
```

Rules:

- `[action=...]` 既是控制标记，也是唯一的操作事实。
- 不要添加 `[control=...]` 只是为了表示该层是一个按钮/控件。
- 不要强迫页面设计者在页面层名称中写入诸如 `accordion-trigger` 或 `菜单按钮` 之类的详细角色。
- 确切的组件/控件类型应尽可能来自 UI Kit 组件实例元数据。

如果操作未知，请使用布尔草稿标记 `[control]`：

```text
Contact us [control]
```

`[control]` 表示“该层将是一个控件/按钮，但操作尚不清楚”。它作为草稿标记是有效的，但它是最终切换之前的 TODO。

Allowed action forms:

```text
 [action=modal:contact-modal]
 [action=state:mobile-menu-open]
 [action=submit:lead-form]
 [action=reset:catalog-filters]
 [action=none]
```

### 可选的高级控制 ID

仅当实现、分析或自动化管道需要与层名称不同的显式稳定机器 ID 时，才允许将 `[control=...]` 作为高级覆盖。

```text
contact-us [control=contact-cta-primary] [action=modal:marketplaces-modal]
```

该值必须是英文短横线大小写，并且不得包含断点后缀，例如 `-768`、`-375`、`-移动` 或 `-桌面`。

Bad:

```text
reviews [control=button-reviews-box-768] [action=modal:marketplaces-modal]
```

Good:

```text
reviews [action=modal:marketplaces-modal]
```

## 字段使用 `字段` 和 `名称`

表单字段需要稳定的身份和数据绑定。

```text
email [field=email] [name=email]
country [field=country] [name=country]
message [field=message] [name=message]
```

仅当无法从 UI Kit 组件或本机字段元数据推断类型时才使用 `[field-type=...]`：

```text
country [field=country] [name=country] [field-type=select]
```

## 模态和状态

已知的行动必须指向现有的目标：

```text
contact-us [action=modal:contact-modal]
contact-modal [modal=contact-modal]

menu [action=state:mobile-menu-open]
mobile-menu [state=mobile-menu-open]
```

如果模态或状态目标不存在，则设计不适合 BRIDGE。

## 从动作锚定到完全反应

`[action=submit:lead-form]` 回答“哪个操作开始？”它不回答验证、等待、失败、取消、重试、成功或重复输入期间发生的情况。结构化 `bridge.interaction.stateMachines[]` 记录：

- 当前状态、语义事件和防护；
- 待处理状态和副作用；
- 每一个可达到的结果和恢复路径；
- 并发、取消、过时响应和重试策略；
- 可见的反馈和辅助技术公告；
- 焦点目的地/恢复；
- URL、查询、浏览器历史记录、滚动和持久效果。

不要为每个事件、超时、错误、焦点目标和响应添加平面标签。保持稳定的层身份并从一个版本化的反应图中引用它们。

## 表单和异步行为

字段在设计中声明稳定的绑定锚点；表单合约还提供可见标签、说明、约束、自动完成目的、验证计时、错误关系、隐藏依赖值策略以及禁用与只读行为。

每个异步操作都涵盖适用的路径：

```text
idle → pending → success | empty | partial | failure | cancelled | timed-out
```

指定旧数据是否保持可见/陈旧、重复输入是否替换请求或将请求排队、乐观更新如何回滚、哪些值在失败后仍可幸存，以及何时可以重试或撤消。一个旋转器或一个成功屏幕并不是完整的交互。

## 焦点和历史是输出

每个反应都必须保持焦点或出于已声明的任务原因而移动焦点。定义对话框、验证、删除、插入结果、消失控件、路由更改和响应式转换的初始/恢复焦点。

对于可共享的过滤器、选项卡、分页、抽屉和步骤，决定路径/查询/哈希或内部状态、历史记录 `push` 与 `替换`、后退/前进、直接加载、刷新和滚动/焦点恢复。深层链接必须初始化状态而不重播之前的点击，并且 URL 不得公开敏感值。

## 验证者应该检查什么

- `[href=...]` without `[link=...]` is a valid link.
- `[action=...]` without `[control=...]` is a valid control.
- `[link]` and `[control]` are valid draft markers and should be reported as TODOs, not syntax errors.
- `[link=...]` and `[control=...]` are optional advanced ids; validate kebab-case and breakpoint suffixes only when a value is present.
- `[href=#]` is invalid; use `[link]`当目的地未知时。
- 当这些路由已知时，内部 href 路由解析为声明的路由。
- 内部 href 锚点解析为声明的部分/锚点。
- 模式/状态/提交/重置操作目标存在。
- 重要的操作解析为可到达的反应/状态机记录，具有待处理、失败、焦点、公告和历史效果（如果适用）。
- 表单定义标签、验证/错误行为、值保存和重复提交策略。
- 异步竞争、取消、重试和陈旧响应具有确定性结果。
- 社交/仅图标链接具有可访问的标签。
- 页面实例不会发明组件状态；状态属于 UI Kit 中。
