# BRIDGE 示例

这是一个简短的食谱目录。每个问题都从一个问题开始，对比好版本和坏版本，并仅解释一条规则。

如果 BRIDGE 对您来说是新的，请从 [designer quick start](../docs/00-designer-quick-start.md) 开始。

|示例|当 | 时使用它
|--- |--- |
|[1. Page and breakpoints](#1-page-and-breakpoints) |连接台式机、平板电脑和移动设备 |
|[2. One element at different widths](#2-one-element-at-different-widths) |使图层名称稳定 |
|[3. Page section](#3-page-section) |在 `[section]` 和 `Page Sections` 之间进行选择 |
|[4. Link or action](#4-link-or-action) |声明单击的结果 |
|[5. Control and modal target](#5-control-and-modal-target) |将控件连接到现有目标 |
|[6. Meaningful structure](#6-meaningful-structure) |去除意外的包装纸|
|[7. Dynamic text](#7-dynamic-text) |准备 CMS 内容和本地化 |
|[8. Content, decor, and asset](#8-content-decor-and-asset) |声明视觉效果应如何传递 |
|[9. Data display with real states](#9-data-display-with-real-states) |传输图表/表格及其运行时合约 |
|[10. Declared responsive transformation](#10-declared-responsive-transformation) |替换组合而不丢失语义 |
|[11. Async form reaction](#11-async-form-reaction) |涵盖验证、待处理、错误、焦点和历史记录 |
|[12. Long-scroll story and reduced motion](#12-long-scroll-story-and-reduced-motion) |定义场景、反向/重新进入和后备 |
|[13. End-to-end catalog delivery](#13-end-to-end-catalog-delivery) |通过 QA 和管理偏差跟踪设计 |

## 1. 页面和断点

**目标：** 显示同一主页的两个断点。

❌ Ambiguous:

```text
Desktop final
Mobile new
```

✅ Explicit:

```text
Home [page=home] [route=/] [bp=1440] [view=default]
Home [page=home] [route=/] [bp=375] [view=default]
```

`page` 和 `view` 保持不变，因为产品页面和状态相同。`bp` 随宽度变化。`route` 存在是因为生产路线已知。

两个根都可以是 Figma 页面的直接子级，也可以放置在本机 Figma 部分中，例如 `Desktop variants` 和 `Mobile variants`。这些画布组织器是透明的：将 BRIDGE 标签保留在实际的根框架上。普通的外部框架/组并不等同于 Figma 部分组织器。

[Full rule: responsive breakpoints](../docs/03-responsive-breakpoints.md)

---

## 2. 一个元素的宽度不同

**目标：** 在桌面和移动设备上连接一个标题和 CTA。

❌ 副本看起来像是不相关的元素：

```text
// desktop
title-desktop
blue-button-1440

// mobile
title-mobile
blue-button-375
```

✅ 名字表达身份而不是外表：

```text
// desktop and mobile
hero-title
primary-cta
```

Figma 中已存在字体、颜色、大小和位置。该名称标识另一个断点处的相同元素。

[Full rule: naming and identity](../docs/02-layer-naming-and-identity.md)

---

## 3. 页面部分

**Goal:** identify a hero section.

### 方案A：普通框架

```text
Hero [section=home-hero]
```

需要该标签是因为 Figma 不知道框架的产品部分密钥。

### 选项 B：来自 `Page Sections` 的实例

```text
home-hero
```

实例上不需要标记：`section=home-hero` 是从源部分组件推断出来的。普通 `UI Kit` 中的按钮或卡片不会自动成为一个部分。

[Full rule: Page Sections](../docs/14-components-and-ui-kit.md)

---

## 4. 链接或操作

**目标：**声明点击的结果。

```text
email-link [href=mailto:sales@example.com]
menu-button [action=state:mobile-menu-open]
Mobile Menu Open [state=mobile-menu-open]
unknown-button [control]
disabled-button [action=none]
```

- 导航到 URL 或锚点使用 `[href=...]`；
- UI 更改、模式、提交和重置使用 `[action=...]`；
- 未知的目的地或行为暂时使用 `[link]` 或 `[control]`。

每个 `[action=type:target-id]` 目标必须存在于具有相同 id 的切换结构中。草稿标记 `[link]` 和 `[control]` 在工作正在进行时有效，但在最终移交之前仍然是 TODO。

❌ 不要使用 `[href=#]` 作为占位符。`#faq` 是一个真实的目标；`#` 本身不是。

[Full rule: interactions](../docs/05-interactions-and-targets.md)

---

## 5. 控制和模态目标

**目标：** 显示 CTA 打开哪个模式。

❌ The action points nowhere:

```text
contact-button [action=modal:contact-modal]
```

✅ 切换结构中存在匹配目标：

```text
contact-button [action=modal:contact-modal]

Contact Modal [modal=contact-modal]
  modal-content
  close-button
```

`modal:` 之后的 ID 必须与 `[modal=...]` 匹配。模态组件必须定义 `close-button`、背景和转义行为。加载、错误和成功状态也不能仅存在于口头指令中。

[Full rule: targets](../docs/05-interactions-and-targets.md#modals-and-states)

---

## 6. 有意义的结构

**目标：** 对英雄标题、文本和控件进行分组。

❌ 手动坐标和非资产组：

```text
Home [page=home] [bp=1440] [view=default] (FRAME, layoutMode NONE)
  hero [section=hero] (FRAME, layoutMode NONE)
    Group 19
      hero-title
      hero-subtitle
    primary-cta
```

这会产生阻塞页面、部分和组的结果。`Group 19` 上的 `[decor]` 不会使其有效。

✅ 家长解释与原生自动布局的关系：

```text
Home [page=home] [bp=1440] [view=default] (FRAME, vertical Auto Layout)
  hero [section=hero] (FRAME, vertical Auto Layout)
    hero-copy (FRAME, vertical Auto Layout)
      hero-title
      hero-subtitle
    hero-actions (FRAME, horizontal Auto Layout)
      primary-cta
      secondary-cta
    hero-glow [decor] (ABSOLUTE visual leaf)
```

即使有零个或一个子项，页面和框架构建的节根也使用自动布局。当至少两个可见的有意义的直接子级参与内容流时，通用容器使用它。原始/叶子几何体除外。复杂的自由形式视觉效果可能是 `[asset]`；它的内部是不透明的，但它的根仍然是父级自动布局中的一个子级。

`[asset]` 子树之外的每个 Figma GROUP 仍然是阻塞错误。`[bridge-exception=manual-layout] [reason=...]` 可以记录对确切组的建议偏差，但页面检查仍然报告它以供单独接受。

[Full rule: wrappers](../docs/06-wrapper-policy.md)

---

## 7.动态文本

**目标：** 准备一张包含真实内容的卡片。

❌ 该设计仅适用于一根弦：

```text
product-card (fixed height 280)
  product-title: "A very comfortable\nchair"
```

✅ 文本自然换行，高度跟随内容：

```text
product-card (Auto Layout, hug contents)
  product-title: "A very comfortable chair"
```

如果固定高度和剪裁是产品决定，请声明溢出政策和原因。否则本地化或CMS数据会破坏卡。

[Full rule: height and overflow](../docs/07-height-and-overflow.md)

---

## 8. 内容、装饰和资产

**目标：**决定三个视觉层如何传输。

```text
product-photo
glow [decor]
complex-illustration [decor] [asset]
```

- `product-photo` 是身份稳定的内容镜像；
- `glow [decor]` 是确切预期的绝对视觉叶子，没有产品或可访问性语义；
- `complex-illustration [decor] [asset]` 是一种作为不透明资产导出的绝对装饰组合物。

`[decor]` 不授权自由格式容器/组，并不意味着该图层可能会在移动设备上悄然消失。`[asset]` 不会替换稳定的图层名称；它只会使真正的视觉子树变得不透明，并且在 BRIDGE 页面根上被禁止。

[Full rule: image, decor, and asset](../docs/01-design-rules.md#4-image-decor-and-asset-mean-different-things)

---

## 9. 真实状态数据显示

**目标：** 传输收入显示而不是理想值的屏幕截图。

该设计提供稳定的锚点和页面状态：

```text
Dashboard [page=dashboard] [route=/dashboard] [bp=1200] [view=default]
  Revenue [section=revenue-overview]
    period-filter
    revenue-chart
    revenue-table
    data-status

Dashboard Loading [page=dashboard] [route=/dashboard] [bp=1200] [view=loading]
Dashboard Empty [page=dashboard] [route=/dashboard] [bp=1200] [view=empty]
Dashboard Error [page=dashboard] [route=/dashboard] [bp=1200] [view=error]
```

结构化合约（而不是更多层标签）添加了正在回答的问题、数据集/所有者/刷新、月份和货币字段、区域设置/时区/舍入规则、排序/过滤行为、部分和陈旧行为以及 `revenue-table` 作为可访问的等价值。QA 装置涵盖缺失的月份、负值、延迟的部分响应、过时的数据、长本地化标签和混合方向标识符。

✅ 审阅者可以区分零和缺失，查找上次更新的状态，使用键盘操作过滤器，并获取每个绘制的值，而无需依赖颜色或悬停。

[Full rule: data and visualization](../docs/20-data-and-visualization.md)

---

## 10.宣布响应式转型

**目标：** 仅当比较表的容器太窄时才将其转变为披露。

❌ Unexplained screenshots:

```text
// wide
comparison-table

// narrow
comparison-card-1
comparison-card-2
```

✅ 合约保留 `same-tree` 作为默认值，并声明一种结构转换：

> **非独立片段。** 此摘录仅显示 `bridge.responsive`。将其插入 [transfer contract](../docs/04-transfer-contract.md#required-envelope) 中所需的 `bridge` 信封中；此处有意省略必需的信封字段。

```json
{
  "bridge": {
    "responsive": {
      "defaultPolicy": "same-tree",
      "contexts": [
        { "id": "comparison-wide", "driver": "container", "width": 800 },
        { "id": "comparison-narrow", "driver": "container", "width": 480 }
      ],
      "transformations": [{
        "id": "comparison-table-to-disclosures",
        "fromContext": "comparison-wide",
        "toContext": "comparison-narrow",
        "when": { "driver": "container", "container": "comparison-panel", "condition": "max-width: 480px" },
        "mappings": [{ "source": ["comparison-table"], "target": ["comparison-disclosures"], "semantics": "same-records-and-fields" }],
        "preserves": ["headers", "values", "selection", "actions", "accessible-names"],
        "readingOrder": ["comparison-heading", "comparison-disclosures"],
        "focusOrder": ["comparison-disclosure-trigger"],
        "stateTransfer": "preserve-selection-and-open-record",
        "history": "no-new-entry"
      }]
    }
  }
}
```

每行/列映射到带标签的公开字段。阅读和键盘顺序、省略细节路径、条件变化时的焦点、选择和后退/前进行为是验收标准。`ltr` 和 `rtl` 灯具决定逻辑顺序以及镜像的方向图标。

[Full rule: responsive behavior](../docs/03-responsive-breakpoints.md#declared-structural-transformations)

---

## 11. 异步形式反应

**目标：** 使“提交此潜在客户表格”可以在快乐路径之外实现。

```text
Lead Form [state=lead-form-idle]
  name [field=name] [name=name]
  email [field=email] [name=email]
  consent [field=consent] [name=consent]
  send [action=submit:lead-form]

Form Success [state=lead-form-success]
Form Error [state=lead-form-failure]
```

状态机添加 `idle`、`invalid`、`submitting`、`success` 和 `failure`。它定义了验证时机、第一个无效字段焦点、错误摘要公告、重复点击策略、路线离开取消、保值、重试和成功焦点。表单不添加URL历史记录条目；成功后刷新遵循已声明的产品决策。

✅ 测试客户端验证路径、服务器字段错误、脱机失败、超时、快速双重提交、重试、路由离开和键盘/屏幕阅读器完成。仅仅一个旋转器和一个成功的屏幕截图就足以让大部分反应未知。

[Full rule: state machines and reactions](../docs/22-state-machines-and-reactions.md)

---

## 12. 长卷轴故事和简化的动作

**目标：**传递三场景产品讲解。

```text
Workflow Story [section=feature-story]
  story-visual
  scene-intro
  scene-compare
  scene-result
```

结构化运动序列表示文档滚动连续驱动三个范围，`story-visual` 仅在 `feature-story` 内部粘性，向后滚动从当前进度导出反向状态，深度链接从当前位置初始化，调整大小/本地化重新计算范围，并立即显示聚焦目标。

减少运动将所有三个场景渲染为文档顺序中的静态部分。不受支持的粘性/滚动时间线行为使用相同的静态后备。内容、操作、完成状态和焦点不依赖于 `animationend`。

[Full rule: motion and long scroll](../docs/21-motion-and-scroll.md)

---

## 13. 端到端目录交付

**目标：** 将产品结果从设计证据带到已发布的实施，而不丢失未知数。

### 设计证据

```text
Catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
  Product Results [section=product-results]
    catalog-filter-form
    results-heading
    product-grid [collection=products]
      product-card-oak-chair [item=product]
      product-card-wool-lamp [item=product]
    pagination

Catalog [page=catalog] [route=/catalog] [bp=360] [view=default]
  Product Results [section=product-results]
    catalog-filter-form
    results-heading
    product-grid [collection=products]
      product-card-oak-chair [item=product]
      product-card-wool-lamp [item=product]
    pagination
```

层名称/`bridgeKey` 值标识创作的夹具出现，而不是记录位置。重复的 `[item=product]` 值对它们的共享角色/类型进行分类。该合约分别映射 `templateKey=product-card`、`designInstanceKey=product-card-oak-chair`、`runtimeDataKey=sku:CHAIR-OAK-01` 和目标 `ProductCard`。

### 契约式和公开式决策

数据状态包括加载、空、部分、过时、错误、离线和未经授权。过滤器反应保留值、替换查询历史记录条目、取消过时的请求以及聚焦/宣布结果标题。功能配置文件声明了方形产品艺术方向、图像格式/尺寸、第一个结果窗口后的延迟加载、最大 10,000 条记录、服务器分页和虚拟化阈值。

该团队尚不知道过时的缓存产品是否可以离线打开。这不会在聊天中隐藏：`OPEN-CATALOG-003` 记录范围 `catalog/offline`、产品所有者、阻止状态、合同门审查日期和安全只读后备。

### 实施和质量保证

实现使用记录 `sku`，从不使用卡顺序。QA 涵盖 1200 和 360 个锚点、中间/容器宽度、400% 回流、长俄语和 RTL/双向值、键盘/屏幕阅读器、低带宽、离线、数据保护程序、部分/错误状态、重复过滤器提交、后退/前进以及图像/数据预算。

### 管理偏差

目标比较组件尚无法在声明的公开转换中保留多行选择。团队暂时保留语义可滚动表。偏差将受影响的要求、影响、缓解、测试证据、产品/可访问性批准、所有者和到期日联系起来。它在发布记录中可见，并且仅在预期的转换发布并重新测试后才关闭。

这就是“无盲点”：并非每个答案在第一天就存在，但每个未知和差异都是明确的、拥有的和可测试的。

[Full contract](../docs/04-transfer-contract.md) · [Delivery lifecycle](../docs/24-delivery-lifecycle.md) · [Accessibility profile](../docs/23-accessibility-profile.md)

---

## 如何使用本目录

1. 找到最接近您的情况。
2. 复制好的结构，而不是其特定的 id。
3. 在每个断点和状态下检查相同的元素。
4. 仅针对有争议的案件开放完整规则。
5. 在切换之前运行 [preflight checklist](../docs/08-preflight-checklist.md)。