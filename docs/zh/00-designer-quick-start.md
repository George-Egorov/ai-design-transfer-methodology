# 设计师快速入门

这是 BRIDGE 的简短而实用的切入点。您**不需要先阅读完整的规范**。按照下面的工作示例进行操作，然后在出现特定问题时使用 [example catalog](../examples/README.md)。

## 预期结果

开发人员、人工智能代理或工具应该能够在不开会的情况下打开设计并理解：

1.它代表哪个页面和状态；
2.哪些帧是同一页面的断点；
3. 哪些元素对应于这些断点；
4. 链接的去向以及控件的作用；
5. 什么是内容、装饰或导出资产。

## 从草稿到交接的一个例子

假设着陆页有两个断点和一个联系模式。

### 之前：设计必须被解码

```text
Desktop
  Frame 42
    Group 18
      Heading
      Text
    Button
    Button copy

Mobile final 2
  Group 91
    Title mobile
    Text
    Button

Popup
  ...
```

这棵树不能可靠地告诉我们两个根是否是同一页面、哪些元素匹配、任一按钮的作用、如何到达 `弹出` 或为什么一个按钮消失。

### 之后：同样的设计说明了一切

```text
Home [page=home] [route=/] [bp=1440] [view=default]
  Hero [section=home-hero]
    hero-copy
      hero-title
      hero-subtitle
    hero-actions
      email-link [href=mailto:sales@example.com]
      contact-button [action=modal:contact-modal]

Home [page=home] [route=/] [bp=375] [view=default]
  Hero [section=home-hero]
    hero-copy
      hero-title
      hero-subtitle
    hero-actions
      email-link [href=mailto:sales@example.com]
      contact-button [action=modal:contact-modal]

Contact Modal [modal=contact-modal]
  modal-content
    modal-title
    close-button
```

现在 `[page=home]`、`[view=default]` 和稳定层名称连接断点；`[bp]` 区分它们的宽度；链接和操作是明确的；并且模态动作解析为真实目标。`关闭按钮` 是 UI Kit 中的关闭控件的实例，因此其行为来自组件元数据。布局、尺寸、自动布局和样式仍然来自 Figma 而不是标签。

> 断点之间的视觉布局可能会发生变化。相同的逻辑元素和父关系应该保持可识别。

## 分五个步骤完成此操作

### 1. 命名每个根框架

Use this minimum:

```text
Name [page=page-id] [bp=width] [view=default]
```

仅当真实路由已知时才添加 `[route=/production-path]`。

根框架可以直接位于 Figma 页面上或仅用于组织画布的本机 Figma **部分**内。Figma 部分是透明的组织者：它们可以对桌面/移动区域、客户端、流程或批次进行分组，但它们不会替换根框架、贡献 BRIDGE 上下文或放弃其中的自动布局。不要使用普通的 `FRAME` 或 `GROUP` 作为页面根周围的外部画布组织器。

### 2. 匹配断点

首先使源布局具有确定性：每个页面根和框架构建的部分都使用本机自动布局，即使有零个或一个子级；当至少两个可见的有意义的直接子级参与流时，通用容器使用它。替换不透明 `[asset]` 子树之外的每个 Figma GROUP。仅将 `[decor]` 放置在确切的预期绝对视觉层上，切勿放置在容器上以绕过结构检查。

逐层比较桌面和移动设备。相同的逻辑元素保持相同的名称、父级、内容含义和操作。尺寸、自动布局方向、间距、顺序和可见性可能会发生变化。

### 3. 给重要元素起稳定的名称

Use short English `kebab-case` names such as `英雄标题`, `产品网格`, and `联系按钮`. Do not add device or breakpoint suffixes such as `-mobile` or `-375`.

### 4.仅添加Figma无法表达的意图

|Figma 已经知道了 |使用 BRIDGE 标签 |
|--- |--- |
|层类型、组件、变体 |页面和状态：`[page]`、`[view]` |
|自动布局、间隙、填充 |路线和断点：`[route]`、`[bp]` |
|尺寸、位置、约束 |链接或操作：`[href]`、`[action]` |
|填充、描边、效果、蒙版|目标：`[modal]`、`[state]` |
|框架和组件层次结构|转移意图：`[section]`、`[decor]`、`[asset]` |

### 5、无作者测试

让另一个人识别页面、其断点、每个交互结果、所有模式/状态目标以及应导出的内容。如果必须口头给出答案，那么设计仍然缺乏合同的一部分。

### 在插件里检查一下

打开 [BRIDGE Assistant workflow](https://poliklot.github.io/bridge-design-methodology/en/check/) 并安装插件。在Figma中：

1.打开**BRIDGE**；
2. 选择带有 `[page]` 标签的根框架（直接在 Figma 页面上或本机 Figma 部分内）；
3.运行**检查页面**；
4.打开每个发现，跳转到受影响的层，读取链接的规则并修复；
5. 解决或记录问题后重新运行检查。

### 仅检查旧主机中的新部分

当周围页面不是 BRIDGE 并且只有新部分在范围内时，请勿添加虚假页面元数据。Give the source boundary one stable section tag:

```text
Checkout summary [section=checkout-summary]
```

Then:

1. 选择标记的节根并运行 **检查所选节**；
2. 要比较响应式变体，请显式选择具有相同节 id 的两个或多个根 — 切勿向其中添加 `[bp]`、`[view]`、`[route]` 或 `[page]`；
3. 仅审查选定的子树结果和明确列出的延迟文件/主机检查；
4. 在声明主机放置解析之前，对所选根之外的内部路由/锚点或操作目标运行单独的文件/集成检查。已为此源范围创作并解析了完整有效的 `http:`、`https:`、`mailto:` 和 `电话：` href；不完整或格式错误的值会阻止语法错误，而不是延迟引用。

未标记的帧不会被默默地接受；使用插件现有的**草稿部分**操作或添加 `[section=<stable-id>]`。完全遍历选定的可编辑 `FRAME`/`COMPONENT`，并且 `[decor]` 保留在遍历范围内。确切的 `[section=id][asset]` 根可能是具有布局覆盖的有效不透明整体视觉效果 N/A；嵌套在不同 `[asset]` 祖先之下的标记部分在遍历之前被阻止，因为检查无法穿透继承的边界。选定的节根本身就是 `INSTANCE` ，产生部分边界证据；普通后代实例是受信任的原子边界，不会降低 Ready。单个选定的根可以为其一个声明的上下文做好准备；从未请求过的变体不会丢失覆盖范围。

仅针对选定的部分源，结果为 **Ready**、**Partial** 或 **Blocked**。Ready 永远不会升级旧版页面、路由、完整响应集、实施、产品或 WCAG 状态。请参阅 [incremental adoption](19-team-adoption.md#when-the-host-product-is-legacy) 和 [selected-section coverage contract](../validator/section-check-coverage.json)。

在以下情况下，页面已准备好进行切换：

- 页面、视图和所需的断点根明确；
- 页面/部分/内容流使用所需的本机自动布局，并且不保留非资产组；
- 稳定的身份仍然指代跨断点的相同元素；
- 链接和控制具有已知的目的地，并且可用目标解析；
- 每个报告的拦截器都是固定的，而警告和异常有明确的决定；
- [full preflight](08-preflight-checklist.md) 中的手动项目也已经过审核。

插件 0.9.3 覆盖快照记录了两个命令的精确、非相加的发出规则并集：Page Check 涵盖 107 个目录规则中的 42 个（40 个自动规则和 2 个启发式规则），而 **Check selected section** 涵盖 26 个规则（24 个自动规则和 2 个启发式规则；20 个本地规则和 6 个选定变体）。他们缩短审查时间；它们不会取代其余的结构化检查和手动检查。

## 找到正确的例子

| Question | Open this example |
| --- | --- |
| How do I name a page and its breakpoints? | [Page and breakpoints](../examples/README.md#1-page-and-breakpoints) |
| Which names must match? | [One element at different widths](../examples/README.md#2-one-element-at-different-widths) |
| When should I write `[section]`？|[Page section](../examples/README.md#3-page-section) |
|这是一个链接还是一个动作？|[Link or action](../examples/README.md#4-link-or-action) |
|如何将控件连接到模态？|[Control and modal target](../examples/README.md#5-control-and-modal-target) |
|包装纸应该表达什么？|[Meaningful structure](../examples/README.md#6-meaningful-structure) |
|动态文本应该如何表现？|[Dynamic text](../examples/README.md#7-dynamic-text) |
|这是内容、装饰还是资产？|[Content, decor, and asset](../examples/README.md#8-content-decor-and-asset) |

## 准备好交接了吗？

使用 [preflight checklist](08-preflight-checklist.md)。将完整的 [tag grammar](13-tag-grammar.md) 作为参考材料，不需要从头到尾阅读。