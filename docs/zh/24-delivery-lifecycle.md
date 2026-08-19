# 交付生命周期

仅当意图从设计到发布保持可追溯时，BRIDGE 才算完整。生命周期是：

> **设计 → 合同 → 实施 → QA → 发布或声明偏差**

![Lifecycle from design evidence through contract, implementation, QA, and managed deviation](../assets/diagrams/delivery-lifecycle.svg)

*偏差是受控分支，必须返回验证；这不是围绕合同的捷径。*

## 一系列证据

每个重要需求都会收到一个稳定的需求 ID 并链接到其证据：

```text
REQ-CATALOG-017
  design: Catalog / Default / 1200 → product-grid
  contract: bridge.data.displays → product-grid
  implementation: ProductGrid + catalog query adapter
  tests: catalog-grid-default, catalog-grid-empty, catalog-grid-keyboard
  deviations: none
```

不要创建五个不相关的规范。Figma 显示创作的视觉/结构证据；结构化的BRIDGE元数据记录Figma无法表达的意图；代码实现了它；测试验证结果；偏差记录已知的差异。稳定的身份将证据联系起来。

## 角色和责任

|角色 |负责|
|--- |--- |
|产品/设计所有者 |产品含义、完整状态、设计证据、内容、响应意图。|
|合同所有人|一致性、身份映射、结构化元数据、验收标准、变更日志。|
|实施所有者 |语义行为、目标平台决策、代码和实施证据。|
|QA/无障碍所有者 |覆盖范围、环境、预期结果、调查结果、回归证据。|
|偏差审批者 |用户/业务影响决策、缓解、所有者、到期和跟进。|

一个人可以担任多个角色。作者一定不是唯一能够解释设计的人，并且已知的分歧不能被引入它的实现者默默地认可。

## 生命周期记录

传输单元（页面、流、部分或组件）具有一个生命周期记录：

> **非独立模块片段。** 此摘录仅显示 `bridge.lifecycle` （加上上下文的 `contractVersion` ）并有意省略其他必需的信封字段。在交换或完整合同验证之前，将其插入 [transfer contract](04-transfer-contract.md#required-envelope) 中所需的 `bridge` 信封中。

```json
{
  "bridge": {
    "contractVersion": "0.2.0",
    "lifecycle": {
      "transferId": "catalog-default",
      "contractRevision": "7",
      "sourceRevision": "figma-version-2026-08-13T10:20Z",
      "targetRevision": "build-1842",
      "status": "qa",
      "owners": {
        "design": "catalog-design",
        "contract": "design-systems",
        "implementation": "storefront",
        "qa": "quality"
      },
      "requirements": ["REQ-CATALOG-017", "REQ-CATALOG-021"],
      "evidence": {
        "design": ["page=catalog;view=default;bp=1200"],
        "tests": ["catalog-grid-default", "catalog-grid-keyboard"]
      },
      "deviations": []
    }
  }
}
```

名称是说明性的。存储库、问题跟踪器、设计插件或构建系统可以存储记录，但它必须是版本化的、可链接的，并与传输单元一起交付。

## 旧主机内的选定部分

部分范围生命周期有两个不同的源/集成门：

1. **选定部分源门** — 固定 `[section=<stable-id>]` 根、选定子树边界、选定上下文、源修订版、本地发现和延迟依赖项；
2. **文件/主机集成门** - 验证需要在选定根之外查找的内部路由/锚点和操作/组件/数据目标、父级放置和剪切/堆叠、路由/页面关系、所需的产品上下文、页面语义、运行时行为和实现可访问性。完整有效的 `http:`、`https:`、`mailto:` 和 `电话:` href 已在源门进行创作和解析；不完整或格式错误的外部值会阻止而不是推迟该门。

当选定部分位于不同的不透明 `[asset]` 祖先下方时，源门无效；该范围在遍历之前被阻止。精确的 `[section=id][asset]` 选择的根仍然是有效的不透明整体视觉源，具有内部布局覆盖 N/A。

**检查所选部分**可以为第一个门生成就绪、部分或阻止的证据。存储该标签及其范围和覆盖矩阵；不要用它替换 `bridge.lifecycle.status` ，也不要用它作为第二个门通过的证据。仅当请求该上下文时，就绪单上下文部分源才有效。延迟的文件解析引用或选定的节根本身就是 `INSTANCE` ，使源结果部分，直到链接的门提供证据。普通后代实例是受信任的原子边界，不会降低Ready。

The legacy host is a declared boundary, not an accepted BRIDGE deviation and not a hidden migration requirement. The lifecycle record must say `hostCompliance：遗留范围外`, link every external dependency to an owner/review point, and prevent “section source ready” from becoming “page/product ready” in downstream status or release notes.

## 第一阶段：设计

设计业主准备有代表性的、与生产相关的证据：

- 根页面/视图/断点身份和已知的真实路线；
- 跨响应状态的相同逻辑树，加上每个声明的转换；
- 稳定的元素身份和组件/模板来源；
- 真实的内容和运行时数据装置；
- 完整的反应、目标、形式、异步和失败状态；
- 运动状态和后备；
- 无障碍意图和替代方案；
- 必要的媒体/经验加上资产艺术指导和代表性的低能力条件；
- 已知的目标约束和候选例外。

**设计门：**非作者的审阅者可以识别结构、变体、内容/数据含义、操作、目标、响应行为、可访问性期望和未解决的决策，而无需私人解释。

输出：版本化设计参考、夹具/场景列表、开放决策列表和初始需求 ID。

## 第二阶段：合同

合同所有者合并证据而不是重复证据：

1. 从 Figma 或源工具中提取技术真相；
2. 将稳定身份解析为角色、模板、设计实例、运行时数据、目标身份；
3. 附加结构化数据、响应式、反应式、运动式、可访问性和生命周期合同；
4. 定义验收标准和目标能力；
5. 将每一个未知或不受支持的功能变成一个拥有范围、阻塞状态、审查点和安全回退的开放问题；
6. 定义预期数据量、虚拟化/分页阈值、资产交付意图和实施拥有的性能预算；
7. 验证引用、目标、模式、状态可达性、奇偶性和异常；
8. 冻结合同修订以供执行。

**合同门：**每个所需的决策要么是明确的，从固定组件/系统合同继承，要么记录为阻止受影响范围的拥有的开放决策。仅在聊天或会议中才存在对实施至关重要的意义。

输出：固定源修订、结构化合同、跟踪矩阵、目标能力声明、验证报告和批准的实施范围。

## 第三阶段：实施

实施所有者将合约映射到目标平台。适配器或开发者必须：

- 保留语义同一性和关系，而不是盲目复制坐标；
- 使用本地目标行为和满足契约的设计系统；
- 首先实现精确声明的帧/场景，然后实现流体/容器行为；
- 通过稳定的数据键而不是 Figma 夹具顺序来映射运行时记录；
- 实现所有可到达的状态、反应、历史/焦点效果和后备；
- 记录肉眼无法观察到的特定目标决策；
- 实施和衡量资产、数据量、负载、低带宽/离线/数据保护/低功耗和能力回退预算；
- 在替换另一种行为之前标记不可能或有害的要求。

**实施门：**功能构建，确定性合同检查通过，每个需求都指向实施证据，并且没有隐藏任何已知的分歧。

输出：实施修订、映射/决策说明、自动化测试和候选偏差记录。

## 第四阶段：质量检查

QA 根据冻结的合约验证可观察的结果，而不是根据记忆或单个屏幕截图。

Required coverage includes:

- 准确声明的断点及其之间的范围；
- 容器驱动的变化和每个声明的结构转型；
- 典型数据和压力数据、每个所需的数据状态和本地化；
- 快乐、无效、待处理、空、部分、失败、取消、重试和历史路径；
- 运动的反向/重新进入/减少运动行为；
- 键盘、焦点、缩放/重排、屏幕阅读器、对比度、目标尺寸和媒体要求；
- 支持的浏览器、设备、目标运行时和后备条件；
- 所声明的能力概况下的资产维度/质量/艺术指导/加载优先级和数据量/虚拟化阈值；
- 低带宽、离线、数据节省、低功耗、缺失功能和适用的预算证据；
- 有意义状态下的组件/系统继承和视觉回归。

Classify results as `pass`, `fail`, `不适用`, `blocked`, or `接受偏差`; include evidence and environment. “Looks close” is not a result.

**QA门：** 每个验收标准都有一个结果；阻碍因素得到解决；可接受的偏差得到批准并可见；高风险行为存在回归覆盖。

输出：链接的 QA 报告、证据、缺陷记录、批准的偏差和发布建议。

## 第五阶段：发布与运营

At release, pin together:

- 设计/源代码修订；
- 合同和规则/模式版本；
- 实施/构建修订；
- 测试环境和证据修订；
- 主动偏差和到期日。

发布后，运行时证据可能会揭示内容长度、数据量、设备状况、辅助技术问题或固定装置中不存在的性能限制。将它们反馈到源设计、组件合同、示例和测试中。当规范合约仍然错误时，不要永远修补生产。

## 开放式问题协议

BRIDGE promises no **untracked** unknowns, not omniscience. A decision may remain `未知`, `不支持`, or `TBD` only in `bridge.openQuestions[]` with a stable id, exact scope, accountable owner, blocking status, due date or named review gate, safe fallback, and status/decision link.

在每个生命周期关口：

- 审查范围进入下一阶段的每个问题；
- 当回退不安全、无法访问、具有误导性、破坏性或无法测试时，阻止范围；
- 在实施和质量保证验收标准中进行非阻塞回退；
- 仅通过相关决定和更新的受影响证据来关闭记录；
- 升级逾期的问题，而不是默默地假设答案。

只存在于对话、聊天、未关联的任务或个人记忆中的问题是盲点，无法做好准备。

## 变更控制和合同漂移

改变始于它所改变的真理的所有者：

|改变|先更新|然后重新评估|
|--- |--- |--- |
|文案、视觉层次结构或产品流程 |设计证据|合同、实施、测试 |
|数据模式/来源/格式 |数据合同|装置、显示、状态、测试 |
|交互/状态行为 |反应合约|设计、焦点/历史、实施、测试 |
|组件 API 或目标限制 |实施/系统合同|设计映射、偏差、回归 |
|无障碍查找|要求和受影响的证据 |设计、合同、实施、所有变体 |

通过稳定身份和需求 ID 运行影响分析。合同冻结后源修订版本的更改要么创建新的合同修订版本，要么被明确证明是非语义的。无声的屏幕截图替换是合同漂移。

## 偏差协议

**偏差**是已接受的合同与实施或支持的目标之间故意的、经审查的不匹配。这不是一个未记录的解决方法。

每个偏差都存储在 `bridge.lifecycle.deviations` 下：

> **非独立模块片段。** 此摘录隔离了一条 `bridge.lifecycle.deviations` 记录，并有意省略了剩余的生命周期和必需的信封字段。将其插入所需的 [contract envelope](04-transfer-contract.md#required-envelope) 内的完整生命周期记录中。

```json
{
  "bridge": {
    "lifecycle": {
      "deviations": [{
        "id": "DEV-CATALOG-004",
        "requirement": "REQ-CATALOG-021",
        "scope": ["catalog", "catalog-360"],
        "difference": "Comparison table uses horizontal scroll instead of the declared card transformation",
        "reason": "Card mapping loses grouped header relationships in target version",
        "impact": "Comparison remains available with preserved table semantics and no data loss, but narrow-screen users need additional horizontal navigation",
        "mitigation": "Sticky first column, overflow instructions, edge affordance",
        "evidence": ["qa-catalog-360-table-scroll"],
        "owner": "storefront",
        "approvedBy": "product-and-accessibility",
        "status": "accepted",
        "reviewDate": "2026-11-30",
        "resolution": "Reassess after target table component upgrade"
      }]
    }
  }
}
```

Required rules:

- 识别违反的要求和确切的受影响范围；
- 解释用户、可访问性、数据和维护影响；
- 比较现实的替代方案；
- 提供缓解和验证证据；
- 指定负责人和批准人；
- 对临时偏差使用到期/审查日期；
- 在交接、质量保证和发布记录中予以体现；
- 仅在合同和实施收敛并重新测试后才关闭它。

妨碍 WCAG 2.2 AA 的偏差不能重新标记为合格。安全、隐私、法律和数据完整性约束优先于视觉保真度，必须上报给相关所有者。

## 准备和完成的定义

### 准备实施

- [ ] 范围和修订已固定。
- [ ] 稳定身份和目标映射是明确的。
- [ ] 结构化合约涵盖数据、转换、反应、运动和可访问性（如果适用）。
- [ ] 存在验收标准和测试场景。
- [ ] 所需的决策有所有者；阻止决定得到解决。
- [ ] 每个剩余的未知/不受支持的项目都是一个有范围的、拥有的、可审查的开放问题，具有安全测试的后备。
- [ ] 声明目标功能、基本媒体/体验、数据量、退化条件和实施拥有的预算。
- [ ] 候选偏差尚未隐藏为“实施细节”。

对于选定部分的传输，源检查就绪仅满足此列表的源证据部分。仅当计划实施所需的每个阻塞/延迟依赖性都已链接证据或拥有的安全后备时，该单元才准备好实施。页面/产品/WCAG 准备情况仍然是稍后的范围决定。

### 完成发布

- [ ] 已实施行为跟踪已接受的合同。
- [ ] 要求的精确、流体、状态、数据、运动和可访问性测试通过。
- [ ] 每个故障均已修复、被所有者阻止或被批准为可见偏差。
- [ ] 主动偏差有缓解和审查日期。
- [ ] 链接源、合同、代码/构建和 QA 修订。
- [ ] 运行时反馈有一条返回规范源的路线。

## 工作变更示例

目录表设计为 1200 和 360 像素。合约声明相同树回流，直到 `比较面板` 容器低于 480 px，然后进行表到披露转换，将每一列映射到标记字段。实现发现目标公开组件无法保留多行选择。

该团队不会默默地放弃移动设备上的选择：

1. `REQ-CATALOG-021` states that selection survives presentation changes.
2. The developer records the capability gap before substituting behavior.
3. Design evaluates keeping the semantic scrollable table versus adding selection to the disclosure component.
4. Accessibility and product owners approve the scrollable-table mitigation temporarily.
5. QA tests keyboard scrolling, headers, focus, selection, zoom, and Back/Forward at the affected range.
6. The release links `DEV-CATALOG-004`有所有者并到期。
7. 当组件获得选择时，团队实施原始转换，重新运行测试并消除偏差。

这就是 BRIDGE 的生命周期：差距是可见的、拥有的、测试的，并最终被消除的。