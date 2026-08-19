# BRIDGE 转让合约

BRIDGE 合同是版本化的、独立于目标的记录，它将设计证据与实施和 QA 连接起来。0.9版本引入了1.0之前的结构化合约及其[JSON Schema](../validator/bridge.schema.json)；0.10 版本添加了针对本机自动布局和非资产 GROUP 节点的阻止源结构规则；版本 0.11 为旧主机内的新 BRIDGE 工作添加了选定部分范围。该形状可用于工具，但字段在 1.0 之前可能仍会演化；在每次交换中固定 `contractVersion`、`methodologyVersion` 和 `rulesVersion`。

## 两个互补的表面

BRIDGE 故意避免将图层名称转换为数据库。

### 短层标签

设计师使用一个小的语法来表示在浏览设计时必须保持可见的意图：

```text
Catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
  Products [section=product-results]
    product-grid [collection=products]
      product-card-oak-chair [item=product]
  Filter [action=state:filters-open]
```

标签定位页面、变体、部分、链接/操作、目标、字段、集合、视觉策略、溢出和显式异常。它们不携带数据模式、状态图、运动时间线、可访问性测试计划或交付历史记录。

### 结构化 `bridge` 元数据

丰富的意图存在于一个命名空间对象中。它引用设计中可见的稳定身份，并且可以存储为 Figma 插件数据、sidecar JSON 文件或适配器有效负载。它必须随交接一起移动并作为一个单元进行验证。

```text
Figma/source metadata + short BRIDGE anchors + structured bridge metadata
                                ↓
                    one transferable contract
```

当结构化字段已经存在时，不要发明新的平面标签。

## 所需信封

完整的有效负载具有 `bridge` 根。核心包络包括：

| Field | Purpose |
| --- | --- |
| `contractVersion` | Version of the structured payload shape. |
| `methodologyVersion` | BRIDGE release used to prepare the transfer. |
| `rulesVersion` | Rule catalog version used for validation. |
| `source` | Tool, file/page, immutable revision, and capture context. |
| `上下文` | Declared transfer scope, product/page context when applicable, included axes, and external dependencies. |
| `身份` | Mapping across role, template, design instance, runtime data, and target implementation. |
| `结构` | Logical trees in declared responsive/data contexts. Native Figma node type, layout mode, positioning, and asset boundaries remain source evidence validated alongside this tree. |
| Contract modules | `数据`, `响应式`, `交互`, `运动`, `可访问性`, `功能`, and `生命周期` as applicable. |
| `openQuestions` | Known unknowns with owner, scope, blocking status, review point, and fallback. |
| `例外` | Intentional source/contract exceptions with impact and mitigation. |

仅当范围证明不适用时，省略的模块才意味着“不适用”。它绝不能意味着“没有人检查”。

## 旧主机内的选定部分范围

团队可以将 BRIDGE 应用到一个新部分，而无需迁移周围的产品。边界是一个明确选择的源根，带有稳定的节标识：

```text
Checkout summary [section=checkout-summary]
```

不要将该部分变成假页面。`[page]`、`[bp]`、`[view]` 和 `[route]` 仍然是页面根标记，不能仅仅为了运行验证而添加。**检查所选部分** 仅遍历规范化的所选根及其后代。选定的可编辑 `FRAME` 或 `COMPONENT` 接收完整的本地源审核；`GROUP` 仍然是一个阻塞的结构发现。当规范化的选定节根本身是 `INSTANCE` 时，仅边界证据可用，结果为 Partial。普通后代 `INSTANCE` 是一个受信任的原子边界，其内部不适用于此选定源遍历，并且不会降低 Ready。精确的 `[section=id][asset]` 根是一个有效的不透明整体视觉边界，内部布局不适用。相反，不同非页面根 `[asset]` 祖先下面的部分是无效的阻止范围：检查无法穿透继承的不透明边界。页面根目录上的非法 `[asset]` 永远不会产生不透明度；页面检查报告根分开，后代仍然可以检查。`[decor]` 本身永远不会停止遍历。

结构化范围记录了选择的内容和未选择的内容。这是一个**非独立片段**；将其插入所需的 `bridge` 信封中：

```json
{
  "context": {
    "project": "Legacy storefront section adoption",
    "scope": {
      "kind": "section",
      "rootIdentity": "checkout-summary",
      "boundary": "selected-subtree",
      "assetBoundary": "none",
      "hostCompliance": "legacy-out-of-scope",
      "selectionMode": "explicit-variants",
      "contextIds": ["summary-container-360", "summary-container-1200"],
      "readinessClaim": "section-source-only"
    },
    "externalDependencies": [{
      "id": "checkout-route-dependency",
      "kind": "route",
      "reference": "/checkout",
      "status": "deferred",
      "owner": "storefront-platform",
      "reviewAt": "host integration gate"
    }]
  },
  "responsive": {
    "defaultPolicy": "same-tree",
    "contexts": [
      {
        "id": "summary-container-360",
        "driver": "container",
        "width": 360,
        "label": "Container 360",
        "labelSource": "inferred-from-selected-root-width"
      },
      {
        "id": "summary-container-1200",
        "driver": "container",
        "width": 1200,
        "label": "Container 1200",
        "labelSource": "inferred-from-selected-root-width"
      }
    ]
  }
}
```

`assetBoundary` is `无` for an editable or atomic source root and `选定的根不透明` only when that exact selected section root carries `[asset]`. An ancestor asset boundary cannot form a valid section-scope contract. `single-root` declares one requested context and can be source-ready without inventing unrequested variants. `explicit-variants` means that the user explicitly selected two or more roots with the same `[section]` identity for comparison; the validator must not discover legacy siblings and silently expand scope. When a tool derives a context label from a selected root or container width, it records `labelSource：从所选根宽度推断` rather than presenting the label as authored intent.

在所选根内解析的操作目标是本地的。完整有效的 `http:`、`https:`、`mailto:` 或 `tel：` href 是为节源范围编写解析的，不会导致部分；它的运行时可用性仍然在源代码验证之外。不完整或格式错误的外部 href 是阻塞 `interaction.href-invalid` 发现，而不是延迟。需要在选定根之外查找的内部路由/锚点、模态/状态/表单/重置目标、组件和数据既不“缺失”也不经过验证：链接外部合约或将它们记录在 `externalDependencies` 中作为延迟/未验证，然后在单独的文件/主机集成检查中解决它们。完整的可执行示例是 [`bridge-section-contract.valid.json`](../validator/examples/bridge-section-contract.valid.json)。

成功的节范围合同意味着**节源已准备好用于声明的选定上下文**。这绝不意味着旧版主机页面、路由、完整的响应集、端到端旅程、实施、产品或 WCAG 一致性是 BRIDGE 就绪的。

## Identity 是一种映射，而不是一个重载的 id

单个名称无法安全地代表传输中涉及的每个身份。BRIDGE 划分了五个维度：

| Dimension | Question | Example |
| --- | --- | --- |
| `role` | What logical job does this element perform? | data item / product |
| `template` | Which reusable definition owns its shape and behavior? | `product-card` |
| `designInstance` | Which authored occurrence is this in the design and contexts? | `产品卡橡木椅` |
| `runtimeData` | Which record-key rule/fixture binds content at runtime? | collection `products`, key field `sku` |
| `target` | Which implementation entity realizes it? | web component `ProductCard` |

`bridgeKey` 连接合约引用；它不会折叠这些维度。值 `[item=product]` 是可重复的角色/类型，而不是唯一的设计装置或运行时记录 ID。像 `product-card-3` 这样的位置名称可能是临时设计夹具标识，但它绝不能成为运行时记录键。排序、过滤、分页、实时更新和重复查找记录需要稳定的产品密钥。

交互目标不同：反应是指模态、状态、形式、路线或元素的 `bridgeKey` 。`identity.elements[].target` 字段将元素映射到实现代码或另一个目标平台。

## 规范说明性有效负载

这个例子故意足够广泛以显示模块的组成。真正的有效负载仅包含适用的模块，但保持相同的命名空间形状。

```json
{
  "bridge": {
    "contractVersion": "0.2.0",
    "methodologyVersion": "0.11.4",
    "rulesVersion": "0.5.0",
    "source": {
      "tool": "figma",
      "fileKey": "example-file-key",
      "pageId": "12:4",
      "pageName": "Catalog",
      "versionId": "figma-version-2026-08-13T10:20Z",
      "capturedAt": "2026-08-13T10:25:00Z"
    },
    "context": {
      "transferId": "catalog-default",
      "page": "catalog",
      "route": "/catalog",
      "view": "default",
      "axes": { "locale": "en-US", "theme": "light" },
      "contextIds": ["catalog-1200", "catalog-360"]
    },
    "identity": {
      "elements": [{
        "bridgeKey": "product-card-oak-chair",
        "role": { "kind": "data-item", "semantics": "product" },
        "template": {
          "templateKey": "product-card",
          "sourceComponentId": "55:8",
          "sourceComponentName": "UI Kit / Product Card"
        },
        "designInstance": {
          "designInstanceKey": "product-card-oak-chair",
          "sourceNodes": [
            { "contextId": "catalog-1200", "nodeId": "401:72", "layerPath": ["Catalog / 1200", "product-grid", "product-card-oak-chair"] },
            { "contextId": "catalog-360", "nodeId": "509:21", "layerPath": ["Catalog / 360", "product-grid", "product-card-oak-chair"] }
          ]
        },
        "runtimeData": {
          "collection": "products",
          "keyField": "sku",
          "fixtureKey": "oak-chair",
          "runtimeDataKey": "sku:CHAIR-OAK-01"
        },
        "target": {
          "platform": "web",
          "kind": "component",
          "targetKey": "ProductCard",
          "locator": "src/catalog/ProductCard"
        }
      }]
    },
    "structure": {
      "contexts": [
        { "id": "catalog-1200", "rootIdentity": "catalog", "tree": { "product-results": ["product-grid", "filter-button"] } },
        { "id": "catalog-360", "rootIdentity": "catalog", "tree": { "product-results": ["product-grid", "filter-button"] } }
      ]
    },
    "data": {
      "displays": [{
        "displayId": "product-grid",
        "purpose": "Browse products matching the active catalog query",
        "source": { "owner": "catalog-service", "dataset": "products", "refresh": "request" },
        "dimensions": [{ "key": "sku", "type": "string" }],
        "measures": [{ "key": "price", "type": "decimal", "currency": "USD" }],
        "format": { "locale": "user", "currencyDisplay": "symbol" },
        "states": ["loading", "empty", "error", "partial", "stale"]
      }]
    },
    "responsive": {
      "defaultPolicy": "same-tree",
      "contexts": [
        { "id": "catalog-1200", "driver": "viewport", "width": 1200 },
        { "id": "catalog-360", "driver": "viewport", "width": 360 }
      ],
      "transformations": [{
        "id": "comparison-table-to-disclosures",
        "fromContext": "comparison-wide",
        "toContext": "comparison-narrow",
        "when": { "driver": "container", "container": "comparison-panel", "condition": "max-width: 480px" },
        "mappings": [{ "source": ["comparison-table"], "target": ["comparison-disclosures"], "semantics": "same-records-and-fields" }],
        "preserves": ["content", "actions", "field-relationships", "selection", "accessible-names"],
        "readingOrder": ["comparison-heading", "comparison-disclosures"],
        "focusOrder": ["comparison-disclosure-trigger:*"],
        "stateTransfer": "preserve-selection-and-open-record",
        "history": "no-new-entry"
      }]
    },
    "interaction": {
      "stateMachines": [{
        "id": "catalog-filter",
        "initial": "idle",
        "states": ["idle", "pending", "results", "empty", "failure"],
        "transitions": [{
          "id": "apply-filter",
          "from": ["idle", "results", "empty", "failure"],
          "event": { "type": "submit", "source": "catalog-filter-form" },
          "pending": { "to": "pending", "duplicateEvent": "replace-with-latest" },
          "outcomes": {
            "success": { "to": "results", "focus": "results-heading", "announce": "Results updated" },
            "empty": { "to": "empty", "focus": "results-heading" },
            "failure": { "to": "failure", "focus": "filter-error", "retry": "preserve-values" }
          },
          "history": "replace-query"
        }]
      }]
    },
    "motion": { "sequences": [] },
    "capabilities": {
      "profiles": [{
        "id": "mobile-low-bandwidth",
        "target": { "platform": "web", "runtime": "browser" },
        "essentialExperience": ["product-name-and-price", "filter-and-open-product"],
        "supports": ["responsive-images", "offline-cache"],
        "unsupported": [{ "capability": "scroll-timeline", "fallback": "static-scenes", "owner": "storefront" }],
        "assets": [{
          "element": "product-image",
          "width": 960,
          "height": 960,
          "formats": ["avif", "webp", "jpeg"],
          "quality": "product-detail-visible",
          "artDirection": "square-crop-with-subject-safe-area",
          "loading": { "priority": "results-dependent", "poster": null, "strategy": "lazy-outside-first-window" }
        }],
        "data": { "expectedItems": 48, "maximumItems": 10000, "virtualizeAfter": 200, "strategy": "server-pagination" },
        "conditions": ["low-bandwidth", "offline", "data-saver", "low-power"],
        "budgets": [{ "metric": "initial-results-payload", "limit": 250, "unit": "KiB", "owner": "storefront", "measureAt": "release-qa" }]
      }]
    },
    "accessibility": {
      "profile": { "standard": "WCAG", "version": "2.2", "level": "AA" },
      "elements": [{
        "element": "product-grid",
        "name": "Catalog results",
        "readingOrder": ["results-heading", "active-filters", "product-grid", "pagination"],
        "testIds": ["catalog-results-keyboard", "catalog-results-reflow"]
      }]
    },
    "lifecycle": {
      "transferId": "catalog-default",
      "contractRevision": "7",
      "sourceRevision": "figma-version-2026-08-13T10:20Z",
      "targetRevision": "build-1842",
      "status": "qa",
      "owners": { "design": "catalog-design", "contract": "design-systems", "implementation": "storefront", "qa": "quality" },
      "requirements": ["REQ-CATALOG-017", "REQ-CATALOG-021"],
      "evidence": { "tests": ["catalog-grid-default", "catalog-grid-keyboard"] },
      "deviations": []
    },
    "openQuestions": [{
      "id": "OPEN-CATALOG-003",
      "scope": ["catalog", "offline"],
      "question": "May users open a product from stale cached results?",
      "owner": "catalog-product",
      "blocking": true,
      "due": "2026-08-18",
      "reviewAt": "contract-gate",
      "fallback": "Show cached results read-only and disable product navigation",
      "status": "open"
    }],
    "exceptions": []
  }
}
```

示例中的图层标签仍然是人类可见的锚点；有效负载添加了无法安全地放在名称中的关系和决策。

## 默认情况下是同一棵树，通过声明进行转换

`responsive.defaultPolicy` 是 `same-tree`。几何、自动布局方向、换行、同一逻辑父级内的顺序以及声明的可见性可能会在没有结构映射的情况下发生变化。

拓扑或表示更改仅作为 `responsive.transformations[]` 记录有效。它命名源和结果身份、视口/容器条件、字段/场景/动作映射、保留的语义、读取和焦点顺序、状态转移和历史行为。如果没有转换涵盖差异，则该差异就是契约漂移。

### 原生布局仍然需要源证据

结构化 `bridge.struct` 树不会复制 Figma 的原生 `layoutMode`、节点类型或定位字段。源验证器直接读取这些字段并应用规则目录：

- 页面根始终使用本机自动布局并且不能是 `[asset]`；
- 框架构建的部分根和 `Page部分` 源根使用自动布局，除非确切的部分是合法的不透明整体视觉资产；
- 具有至少两个可见且有意义的流程子级的通用自动布局容器使用自动布局；
- GROUP 节点仅在真正的不透明 `[asset]` 子树内有效；
- 原始/叶几何体和放置的实例内部不被视为内容流容器；
- `[decor]` 仅标识确切的预期绝对视觉节点，并且从不创建结构豁免。

页面检查将放置的实例视为原子的，并且不会解析其源组件的部分布局规则；单独审核可编辑源根目录。资产根仍然在逻辑树中显示为一个标识，并在其父项的自动布局中显示为一项。有原因的手动布局异常可能会伴随报告的结构偏差，但它不会改变源证据或将失败的页面检查变成通过。

## 显式未知数：没有未跟踪的盲点

BRIDGE **不**承诺每个决定都是已知的。它承诺不会追踪任何相关的未知因素。

`unknown`、`unsupported`、`TBD` 和等效状态仅作为 `openQuestions[]` 记录有效：

- 稳定的id和精确的范围；
- 问题或不受支持的能力；
- 负责任的所有者；
- 阻塞状态；
- 截止日期或指定审核时间；
- 未解决时的安全后备；
- 当前状态和解决后的决策链接。

如果后备不安全、无法访问、具有误导性或破坏性，则问题将被阻塞，受影响的范围无法通过其大门。仅存在于言语、聊天、独立任务或某人记忆中的问题是 BRIDGE 盲点。

## 目标能力和性能概况

合约不得假设每个目标都具有相同的编解码器、输入、布局原语、内存、网络或电源。`capability.profiles[]` 声明目标/运行时、必须在降级中生存的基本体验、支持和不支持的功能，以及针对每个不支持的需求的经过测试的回退。

对于媒体/资产，声明内在尺寸、可接受的格式和质量、艺术指导/裁剪安全区域、加载优先级、海报/预览以及预加载与惰性行为。对于数据，声明预期/最大量以及分页、流式传输或虚拟化阈值。涵盖低带宽、离线、数据保护、低功耗、减少运动和缺少 API 条件（如果适用）。

设计拥有基本内容、媒体、顺序和任务结果的声明。实施拥有可衡量的绩效预算、交付策略、工具和证据。尚不知道的能力或预算成为一个具有安全后备的开放性问题；它不是从最漂亮的设计框架中推断出来的。

## 源优先级和继承

每个事实使用一个所有者：

1. 目标平台的安全性、保密性、隐私性和本机语义限制所有其他来源；
2. 批准的产品/内容决策定义含义；
3. 结构化 BRIDGE 合约定义了源工具无法表达的意图；
4.Figma/源元数据定义了创作的结构、组件、几何形状和样式；
5. 固定组件/系统契约提供继承行为；
6. 明确批准的例外/偏差记录任何剩余差异。

不要将组件状态机复制到每个实例上。引用固定模板，然后仅声明特定于实例的内容、覆盖和上下文。

## 验证

A contract validator should check:

- 架构和固定版本字段；
- 范围内唯一的 `bridgeKey`、设计实例、要求、问题、异常和偏差 ID；
- 身份、树、显示、变换、反应、运动、可访问性和测试之间的有效引用；
- 源节点和上下文存在；
- 运行时记录映射不是位置夹具索引；
- 同树奇偶校验，除非适用的转换涵盖了差异；
- 能力概况包括资产/媒体、数据量、降级、不支持的功能回退和自有预算（如适用）；
- 状态机可达性和行动目标；
- 所需的数据状态和可访问性配置文件；
- 开放性问题包含所有者、范围、阻止状态、审查点和后备；
- 临时例外/偏差有审查/到期日期和证据。

有效的 JSON 文档并不自动成为有效的产品合同。确定性模式检查、设计源检查和手动语义审查是互补的。

## 1.0之前的兼容性

- Producers must emit an explicit `contractVersion`。
- 消费者必须拒绝不受支持的主要形状并报告未知字段，而不是默默地丢弃所需的含义。
- 附加扩展字段应保留命名空间并记录在案。
- 迁移必须保留稳定的身份和需求链接。
- 合同修订一旦接受实施/质量保证运行，就不可更改；更改会创建新的修订版。

参考 [Data and visualization](20-data-and-visualization.md)、[Responsive breakpoints](03-responsive-breakpoints.md)、[State machines and reactions](22-state-machines-and-reactions.md)、[Motion and long scroll](21-motion-and-scroll.md)、[Accessibility profile](23-accessibility-profile.md) 和 [Delivery lifecycle](24-delivery-lifecycle.md)。