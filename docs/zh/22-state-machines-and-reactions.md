# 状态机和反应

可点击的原型显示了一条路径。BRIDGE 反应合约定义了每个相关路径：事件、当前状态、防护、副作用、下一个状态、反馈、焦点、URL/历史效果和恢复行为。

## 反应、状态和视图

- **反应**是 `event + current state + guard → effects + next state`。
- **状态**是组件、表单、流程或页面的稳定状态。
- **视图** (`[view=...]`) 是页面/数据固定装置，例如 `default`、`loading`、`empty` 或 `error`。
- **目标**是反应引用的稳定元素、状态、模式、形式、路线或服务操作。

不要将名为“成功”的屏幕截图与完全成功的反应混淆。合约还需要提交状态、响应处理、焦点目的地、公告、重复行为和导航/历史结果。

## 保持图层标签简短

现有标签定位交互锚点：

```text
email [field=email] [name=email]
send [action=submit:lead-form]
lead-form [state=lead-form-idle]
success [state=lead-form-success]
```

原型连接可以提供额外的证据。不要为每个事件、防护、超时、焦点目的地、公告和 HTTP 状态添加标签。将这些关系放入由稳定身份键入的结构化 BRIDGE 元数据中。

## 规范反应记录

反应应回答所有适用的字段：

| Field | Meaning |
| --- | --- |
| `id` | Stable reaction identity. |
| `scope` | Component, form, page, application, or cross-route flow. |
| `from` / `event` | Current state and initiating user/system event. |
| `guard` | Condition that allows or rejects the transition. |
| `effects` | Validation, request, storage, analytics, clipboard, or other side effects. |
| `到` | Success state; include failure/cancel/timeout branches. |
| `反馈` | Visible status and assistive-technology announcement. |
| `焦点` | Focus destination and restoration rule. |
| `历史` | URL, query, hash, navigation, replace/push, and Back/Forward result. |
| `并发` | Duplicate input, cancellation, stale response, and ordering policy. |
| `持久性` | What survives reload, route change, closing, or another device. |

> **非独立模块片段。** 此摘录仅显示 `bridge.interaction` 并有意省略必需的信封字段。在交换或完整合同验证之前，将其插入 [transfer contract](04-transfer-contract.md#required-envelope) 中所需的 `bridge` 信封中。

```json
{
  "bridge": {
    "interaction": {
    "stateMachines": [{
      "id": "lead-form",
      "initial": "idle",
      "states": ["idle", "invalid", "submitting", "success", "failure"],
      "transitions": [{
        "id": "submit-lead",
        "from": ["idle", "invalid", "failure"],
        "event": { "type": "submit", "source": "lead-form" },
        "guard": "all-required-fields-valid",
        "pending": { "to": "submitting", "duplicateEvent": "ignore", "cancel": "on-route-leave" },
        "outcomes": {
          "success": { "to": "success", "focus": "success-heading", "announce": "Lead sent" },
          "validation": { "to": "invalid", "focus": "first-invalid-field", "announce": "Form has errors" },
          "failure": { "to": "failure", "focus": "error-summary", "retry": "preserve-values" }
        },
        "history": "none"
      }]
    }]
    }
  }
}
```

结构化合约中的值是面向适配器的标识符，而不是请求将它们全部放入 Figma 层名称中。

## 正确范围内的模型状态

|范围 |示例 |真相来源|
|--- |--- |--- |
|元素|聚焦、按下、选择、无效 |原生语义或 UI Kit 组件 |
|组件|手风琴打开，对话框繁忙，日期选择器月份 |UI Kit 状态模型加上实例内容 |
|表格 |原始、肮脏、验证、提交、成功 |成型反应机|
|页面/数据 |加载、空、部分、错误 |根 `[view]` 装置加上数据合约 |
|应用 |已注销、离线、权限已更改 |跨页流量合约|

不要为每个悬停状态创建页面根目录。不要将页面范围的错误隐藏在按钮变体中。父机器和子机器可以交互，但所有权和事件传播必须是明确的。

## 事件和输入奇偶校验

记录语义事件 — `activate`、`submit`、`change`、`dismiss`、`select`、`drag`、`timeout`、`response` — 而不是单独记录特定于设备的手势。然后定义支持的输入：

- 单击/点击激活也适用于本机键盘行为；
- 仅悬停内容也会出现在键盘焦点上并且可以被忽略；
- 拖动操作有单指针、键盘或基于控件的替代方案；
- 长按、滑动和多点触控手势都有可发现的替代方案；
- 挂起时重复激活遵循明确的并发规则。

遵循官方 [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) 中的交互和键盘约定，同时首选可用的本机 HTML 语义。

## 表单：字段和表单状态

对于每个字段定义：

- 数据名称、值类型、必需/可选状态以及自动完成目的（如果适用）；
- 持久可见的标签、说明、可接受的格式和约束；
- 原始、集中、填充、无效、禁用和只读演示文稿；
- 验证时机：输入、模糊、步骤更改或提交时；
- 规范的错误代码/消息以及与该字段的关系；
- 正常化不会默默地改变含义；
- 依赖字段、条件可见性以及隐藏值会发生什么情况。

对于表单定义：

- 客户端和服务器验证权限；
- 错误摘要、第一个无效字段焦点和公告；
- 待处理的 UI 以及哪些操作仍然可用；
- 错误、身份验证到期、路由更改和重试时的值保存；
- 成功结果、重复提交处理、幂等性期望；
- 重置/撤消确认和丢失未保存的工作行为。

占位符文本不是标签。禁用的控件无法解释它们不可用的原因；提供附近的状态或指示。只读和禁用是不同的产品状态。

## 异步反应

Every request path includes `idle→ 待处理 → 成功 |空 |部分 |失败|取消 |超时` as applicable. Specify:

- 先前的内容是否仍然可见以及是否变得陈旧；
- 更改消息传递之前的进度行为和最短/最长等待时间；
- 重试策略、退避、离线排队和手动重试；
- 查询、路由、模态或组件实例更改时取消；
- 竞赛政策：最新请求获胜、有序申请、合并或拒绝；
- 重复操作的重复数据删除和幂等性；
- 乐观更新、回滚、冲突解决和撤消窗口；
- 状态公告，无噪音重复。

Spinner 不是异步合约。迟到的响应不得覆盖较新的查询或意外移动焦点。

## 叠加、披露和焦点

对于对话框、抽屉、菜单、弹出窗口和披露，定义：

- 开幕活动和允许的状态；
- 初始焦点或原因焦点停留在触发器上；
- 曲面是否是模态的；
- Tab/Shift+Tab 范围和相关的箭头键规则；
- 逃脱、关闭控制、外部点击和破坏性解雇行为；
- 如果触发器消失，焦点恢复到触发器或声明的继任者；
- 嵌套叠加和路由更改行为；
- 滚动锁定而不丢失先前的滚动位置。

视觉上隐藏的内容不得保持意外可操作状态。仅仅为了演示而折叠的内容不得丢失所需的状态。使用匹配的 [APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/) 作为实施指南，而不是替代上述产品决策。

## 焦点是每次转变的一部分

完整的反应表明在以下情况下焦点在哪里：

- 验证失败；
- 模式打开或关闭；
- 内容被插入、删除、重新排序或过滤；
- 一个步骤完成；
- 焦点项目消失；
- 路线改变或历史记录恢复；
- 操作失败、超时或被撤消。

当用户可以继续原地不动时，默认保留焦点。移动它只是为了支持下一个任务或公开重要的反馈。切勿将焦点重置到文档开头，因为这是意外的渲染副作用。

## URL 和历史合约

声明状态是否可共享、可添加书签和可恢复。对于过滤器、选项卡、分页、选定记录、抽屉和多步骤流程，请决定：

- path, query, hash, in-memory, or persistent storage;
- `push` versus `replace`历史行为；
- 后退/前进结果；
- 直接加载和刷新初始化；
- 无效或过期状态处理；
- 滚动和焦点恢复；
- 关闭覆盖层是否会反转历史记录条目。

深层链接必须初始化相同的产品状态，而无需重播之前的点击。URL 不得泄露机密或敏感表单值。

## 反应覆盖率表

在切换之前，至少枚举：

|路径|所需证据|
|--- |--- |
|幸福之路|开始、中间反馈、最终状态、焦点/历史结果 |
|输入无效 |现场和总结反馈，修正路径|
|结果为空 |解释及恢复行动|
|权限/授权失败 |保留工作和重新验证/请求访问路径 |
|网络/服务器故障 |可重试与终端行为 |
|超时/离线|缓存状态、排队工作、重新连接行为 |
|取消/解雇 |副作用清理和焦点恢复 |
|重复/快速输入 |确定性并发结果 |
|后退/前进/重新加载 |状态、焦点和滚动恢复 |

## 审核门

仅当满足以下条件时，流才处于 BRIDGE 就绪状态：

- 每个互动锚点都有一个动作或真实的导航目的地；
- 每一个行动都有一个目标和完整的反应记录；
- 所有可到达的状态，包括挂起和失败，都有设计或继承的组件合同；
- 字段有标签、约束、错误和保值行为；
- 决定异步竞赛、重复事件、取消、重试和回滚；
- 焦点、公告、URL、历史记录和滚动行为是明确的；
- 键盘、指针、触摸和辅助技术用户可以完成相同的任务。
