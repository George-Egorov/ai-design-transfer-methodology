# 验证与自动检查

BRIDGE 应该变得舒适，因为设计人员可以在移交之前进行飞行前检查并查看具体的、可修复的问题。因此，该方法不仅必须定义建议，还必须定义机器可检查的规则。

## 验证层

1. **语法验证** — 标签、布尔视觉意图/草稿标志、可选标签值、键、href/action 语法、断点标签。
2. **身份验证** — 身份唯一性、身份稳定性、断点中性身份值、类型稳定性以及从身份标签计数中正确排除 `[decor]`/`[asset]` 标志。
3. **响应式验证** — 身份覆盖、树拓扑/基数、父子稳定性、可见性变化、视觉意图漂移、内容漂移、顺序变化、断点完整性。
4. **结构验证** — 页面/部分/内容容器自动布局、禁止的非资产组节点、包装器、剪裁、定位意图、固定高度、重叠。
5. **交互图验证** — href 链接、草稿链接/控制标记、操作、目标、模式、状态、表单。
6. **内容验证**——文本平等、严格的法律/价格内容、富文本、本地化风险；跳过对装饰/根资产视觉效果内文本的产品内容偏差检查。
7. **资产验证** — 资产政策、原生文本滥用、导出设置、焦点。
8. **辅助功能验证** — 对比风险、触摸目标、标签、可聚焦状态、隐藏在辅助功能树中的装饰层。
9. **适配器功能验证** — 特定于目标的不支持的功能。

## 自动化水平

- **自动** — 可以从提取的设计数据中进行确定性检查。
- **启发式** - 可以放心地检测到，但可能需要设计者确认。
- **手动** — 必须由人工检查，但检查表应明确说明。

## 报告严重性

- **错误** — 阻止桥接就绪状态。
- **警告** — 在认真转移之前需要解释或修复。
- **信息** — 对实施者和适配器有用的上下文。

## 最小验证器管道

```text
extract design tree
  -> normalize names, boolean visual-intent tags, optional tag values, keys, and Figma metadata
  -> discover page roots among direct Figma-page children and through native Figma SECTION organizers only
  -> group roots by page, then by view, then by breakpoint
  -> build identity map and type map
  -> check optional identity-bearing values against current breakpoint names/widths
  -> compare responsive tree cardinality and parent identities only inside one page/view group
  -> compare visibility, sibling order, and visual-intent flags inside each parent
  -> compare product content across breakpoints, excluding decorative/root asset visuals
  -> classify page, section, generic content-container, primitive/leaf, component-instance, and opaque asset boundaries
  -> inspect native node type and layout mode; require Auto Layout and reject non-asset GROUP nodes
  -> validate exact-node absolute decor/overlay intent without treating [decor] as a structural exemption
  -> classify remaining wrappers and positioning intent
  -> build href/action-target graph
  -> inspect geometry, overflow, and fixed heights
  -> check assets and component states
  -> emit report with rule IDs, severity, location, and fix hints
```

本机 Figma 部分仅在页面根目录发现期间是透明的。验证器不会继承它们的名称/标签，将它们序列化到 BRIDGE 页面树中​​，或使用它们来抑制布局规则。它停止普通 `FRAME`/`GROUP` 包装器上的根发现，然后仅验证发现的标记根及其自己的子树。

## 检查所选部分

**检查所选部分**是针对旧版/非 BRIDGE 主机内的新 BRIDGE 部分的单独审核模式。它不得使用伪造的元数据运行页面管道。

```text
read explicit selection
  resolve-each-selected-node-to-its-nearest-own-ancestor [section=<stable-id>] boundary
  -> reject empty/untagged selection, a page root, mixed section ids, or a section below an inherited [asset] as Blocked scope
  -> deduplicate normalized roots; traverse only those roots and descendants
  -> treat [asset] as opaque, descendant INSTANCE as a trusted atomic boundary, and [decor] as traversed intent
  -> run local identity, syntax, structure, content, and internal-target checks
  -> compare only explicitly selected variants of one section when 2+ usable roots exist
  -> defer only references that require lookup outside selected roots plus file/page/integration concerns
  -> emit scope-qualified Ready, Partial, or Blocked plus a persistent coverage matrix
```

可编辑的 `FRAME` 或 `COMPONENT` 根接受完整的子树检查。可以对选定的 `GROUP` 进行标准化，以便报告可以发出现有的阻塞 `layout.group-outside-asset` 发现结果；它无法在不透明资产之外变为就绪状态。如果规范化的选定节根本身是 `INSTANCE`，则它仅公开边界证据，并且结果是部分的。普通后代实例是受信任的原子边界：它们的内部不适用于本次遍历，并且不会降低Ready。确切的 `[section=id] [asset]` 根是有效且不透明的，因此内部布局覆盖不适用。不同资产祖先下方的部分在遍历之前被阻止；遗传性不透明也不例外。`[decor]` 本身永远不会停止遍历。

一个规范化的根声明一个请求的上下文，并且当该声明的上下文干净时可以准备就绪。缺少用户未请求的变体是 `not requested`，而不是部分错误或缺少断点错误。两个或多个显式选择的根必须共享一个section id；它们成为声明的选定变体。从根/容器宽度推断的上下文标签被标记为推断，并且验证器永远不会发现相邻的遗留帧来制造覆盖范围。

|覆盖等级|选定部分的含义 |
|--- |--- |
|本地|所选子树可以证明内在标签/身份和操作/href 语法、源结构、内容证据、根内的目标以及完整有效的 `http:`、`https:`、`mailto:` 或 `tel:` href 值。不完整/格式错误的外部值是阻塞的，而不是延迟的。|
|选定的变体 |身份/类型、逻辑树/基数、父项、产品文本和视觉意图仅在明确选择的可用变体之间进行比较。|
|延期|需要在选定根之外查找的内部路由/锚点和操作/组件/数据目标，以及页面根、页面/视图/路由完整性、所需的页面断点、全局唯一性、主机放置、页面语义、运行时、生产可访问性和 WCAG 一致性需要单独的证据。|

准确实施的规则 ID 和适用性位于 [selected-section coverage manifest](../validator/section-check-coverage.json) 中。其精确并集的跟踪独立于页面检查，并且不得将两个计数相加。

## 规则目录概述

机器可读的种子位于 [`../validator/rules.json`](../validator/rules.json) 中。

|集团|规则示例 |严重性 |自动化|
|--- |--- |--- |--- |
|身份|`identity.missing-stable-identity` |错误 |自动|
|身份|`identity.same-identity-different-type` |错误 |自动 |
|身份|`identity.breakpoint-specific-id` |错误|自动|
|身份|`identity.decor-asset-flags-not-identities` |错误|自动|
|身份|`identity.multiple-identity-tags` |警告|自动 |
|语法 |`syntax.decor-asset-value-not-kebab-case` |错误|自动 |
|语法 |`syntax.identity-value-not-kebab-case` |警告|自动|
|语法 |`syntax.duplicate-tag` |错误 |自动 |
|语法 |`syntax.figma-metadata-tag-invalid` |错误 |自动|
|结构|`layout.page-root-missing-auto-layout` |错误 |自动|
|结构|`layout.page-root-cannot-be-asset` |错误|自动 |
|结构|`layout.section-missing-auto-layout` |错误|自动 |
|结构|`layout.container-missing-auto-layout` |错误 |自动 |
|结构|`layout.group-outside-asset` |错误 |自动 |
|结构|`layout.positioned-without-intent` |警告|自动|
|部分|`section.component-source-unclassified` |警告|启发式|
|部分|`section.redundant-instance-section-tag` |警告|启发式|
|组件|`component.ui-kit-used-as-section` |警告|启发式|
|反应灵敏 |`responsive.identity-missing-in-required-breakpoint` |错误 |自动 |
|反应灵敏 |`responsive.view-missing-required-breakpoint` |错误|自动 |
|反应灵敏 |`responsive.tree-cardinality-changed` |错误 |自动 |
|反应灵敏 |`responsive.parent-changed-across-breakpoints` |错误|自动 |
|反应灵敏 |`responsive.visual-intent-drift` |错误|自动|
|内容 |`content.text-changed-between-breakpoints` |错误|启发式|
|内容 |`content.decorative-asset-text-excluded-from-product-drift` |信息 |自动|
|内容 |`content.manual-line-break-in-dynamic-text` |错误 |启发式|
|结构|`layout.one-child-wrapper-without-role` |警告|启发式|
|结构|`layout.overlap-without-overlay-role` |警告|启发式|
|互动|`interaction.clickable-without-action` |警告|启发式|
|互动 |`interaction.link-without-href` |信息 |自动|
|互动|`interaction.control-without-action` |信息 |自动|
|互动 |`interaction.href-placeholder-invalid` |错误|自动|
|互动|`interaction.href-invalid` |错误|自动|
|互动|`interaction.optional-id-value-invalid` |错误|自动 |
|互动 |`interaction.action-invalid` |错误 |自动|
|互动 |`interaction.control-action-duplicate` |错误 |自动|
|互动 |`interaction.modal-target-missing` |错误 |自动|
|互动 |`interaction.form-target-missing` |错误 |自动 |
|互动 |`interaction.reset-target-missing` |警告|自动|
|路由|`routing.page-route-missing` |信息 |自动 |
|路由|`routing.page-root-required` |错误 |自动 |
|路由|`routing.default-view-missing` |警告|自动 |
|路由|`routing.route-not-production-url` |错误 |自动 |
|身高|`height.fixed-height-without-reason` |警告|自动 |
|溢出|`overflow.text-clipping-risk` |错误 |启发式|
|资产|`asset.raster-text-without-reason` |错误 |启发式/手动 |
|无障碍 |`accessibility.decorative-layer-exposed` |警告|自动 |
|互动 |`interaction.form-field-missing-label` |警告|自动|

对于 `layout.section-missing-auto-layout`，自动意味着审核树中存在携带 `[section]` 的非页面框架或组件。放置的实例是原子的：Page Check 0.9 既不解析其源组件，也不发出实例的部分布局结果。单独选择并审核可编辑源代码树。

## 建议的报告格式

```json
{
  "methodology": "BRIDGE",
  "status": "not-ready",
  "summary": {
    "errors": 3,
    "warnings": 8,
    "info": 4
  },
  "issues": [
    {
      "ruleId": "interaction.modal-target-missing",
      "severity": "error",
      "nodeId": "contact-cta",
      "breakpoint": 320,
      "message": "Button references modal `contact-modal`, but no modal target exists.",
      "fix": "Create `[modal=contact-modal]` or change the action."
    }
  ]
}
```

对于部分范围的报告，请包括边界和未完成的证据，而不是减少所有问题的数量：

```json
{
  "methodology": "BRIDGE",
  "mode": "section",
  "status": "partial",
  "scope": {
    "kind": "section",
    "rootIdentity": "checkout-summary",
    "boundary": "selected-subtree",
    "readinessClaim": "section-source-only"
  },
  "coverage": {
    "evaluated": ["local-structure", "local-syntax"],
    "notRequested": ["selected-variant-comparison"],
    "deferred": ["file-resolved-targets", "host-integration"]
  },
  "issues": []
}
```

`Ready` 要求在声明的选定范围内没有错误、警告/TODO、选定根源间隙或延迟检查；受信任的后代实例和未请求的变体不会降低它。`Partial` 没有阻塞本地错误，但保留选定的根 `INSTANCE`、无法区分的选定上下文或另一个警告/延迟间隙。`Blocked` 表示丢失/无效的标记边界、嵌套/混合节根或阻塞发现。这些标签绝不意味着页面、实施、产品或 WCAG 已准备就绪。

## 清单模式

### 设计师快速检查

在向工程人员展示文件之前使用：

- 身份缺失；
- 缺少动作；
- 明显的固定高度文本；
- 缺少模式/状态目标；
- 更改了移动副本。

### 审稿人严格把关

在批准切换之前使用：

- 完整的规则目录；
- 边缘情况清单；
- 国家覆盖范围；
- 可访问性警告；
- 适配器功能说明。

### 适配器认证检查

用于证明目标实现路径支持BRIDGE：

- 支持的标签；
- 支持的行动；
- 不支持的视觉功能；
- 资产后备行为；
- 响应式映射规则。

## 什么应该立即阻止切换

- 重要元素上缺少稳定的身份。
- 断点/视图范围内的重复身份。
- 比较不同 `[view=...]` 值的响应树。每个视图都是一个单独的响应式合约，并且仅在其自己的断点之间进行比较。
- 断点特定的可选标识值，例如 `[bp=375]` 根内的 `[control=button-reviews-box-375]`。
- 相同的标识用于不同的逻辑类型。
- 页面根目录禁用了本机自动布局；零/一个子级、`[asset]`、`[decor]` 或页面根目录上的异常元数据不会抑制该规则。
- 页面根带有`[asset]`；这是一个单独的阻止程序，不会创建不透明的边界，并且不会停止后代验证。
- 框架构建的部分禁用了本机自动布局，除非该确切部分是合法的不透明整体视觉 `[asset]` ，没有实时内容流。
- 当禁用自动布局时，支持通用自动布局的容器具有两个或更多可见的、有意义的直接流子级。
- Figma `GROUP` 存在于不透明 `[asset]` 子树之外。手动布局加原因记录了建议的偏差，但不能抑制结构错误。
- 在所需的断点上缺少稳定的装饰/资产根标识。
- 响应元素树基数或父子拓扑变化，无结构异常。
- 视觉意图漂移，例如桌面上的 `sneg [decor] [asset]` 在移动设备上变成普通的 `sneg`。
- 没有已知 `[href=...]` 或 `[action=...]` 的最终可点击元素；草稿 `[link]` / `[control]` 标记是 TODO，而不是语法错误。
- 无效的未知 href 占位符 `[href=#]`；使用 `[link]` 代替。
- 虚假或占位符 `[route=...]` 值；省略路由，直到知道生产 URL。
- 行动目标缺失。
- 没有路由的页面根目录是草案 TODO (`routing.page-route-missing`)，而不是拦截器。
- 没有关闭行为的模态。
- 文本固定高度，无溢出政策。
- 依赖于手动换行符的动态文本。
- 隐藏的键控层用作事实来源。
- 没有明确原因的光栅化文本。

## 误报是可以接受的

验证者应该更喜欢有用的摩擦而不是无声的失败。如果报告解释了如何标记故意异常，则误报是可以接受的：

```text
 [bridge-exception=overlay] [reason=decorative-layered-composition]
```

目标不是禁止复杂的设计。目标是使复杂性变得明确。即使存在 `[bridge-exception=manual-layout] [reason=...]` ，也会报告结构自动布局/组错误；这些标签为单独的偏差接受门而不是页面检查通过提供了证据。`[bridge-exception=overlay] [reason=...]` 可以满足精确绝对覆盖节点的定位意图。
