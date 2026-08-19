# 层命名和身份

BRIDGE 身份是逻辑元素的稳定密钥。在 Figma 中，身份通过两种方式提供：

1. 当从 Figma 可靠地知道元素类型时，使用稳定的层名称；
2. 当必须声明产品意图时使用 BRIDGE 标签，因为 Figma 不知道这一点。

## 核心规则

如果标签仅重复 Figma 元数据，请勿编写标签。

```text
hero-title
product-photo
close-icon
button-group
hero-copy
```

当图层具有明确的 Figma 类型并且名称是稳定的英文 kebab-case 时，这些名称就足够了。

## 当需要标签时

非技术层属性的意图需要一个标签：

```text
Home Page [page=home] [route=/] [bp=1920] [view=default]
Catalog [section=product-slider]
primary-cta [href=/catalog]
menu-button [action=state:mobile-menu-open]
email [field=email] [name=email]
snow-bg [decor]
promo-poster [asset]
sneg [decor] [asset]
```

`[decor]` 和 `[asset]` 是布尔视觉意图/策略标签，而不是强制身份标签。如果图层已经命名良好，则图层名称将保持稳定的响应标识：

```text
sneg [decor] [asset]
```

这里的身份是`sneg`；`[decor]` 表示该图层是装饰性/非内容/可访问性隐藏的，而 `[asset]` 表示视觉效果应作为一个整体单元进行传输。

旧值形式仅允许作为不良/默认图层名称的后备：

```text
Frame 182 [decor=snow-bg]
Group 91 [asset=promo-poster]
```

如果 `[decor=...]` 或 `[asset=...]` 中存在某个值，则它必须是英文短横线大小写。没有值的布尔 `[decor]` 和 `[asset]` 是有效的，不应报告为缺失值。

## 没有写成 Figma 标签的内容

对于 Figma 设计，设计者不会手动描述层的技术构造：

- 图层是文本；
- 图层是内容图像；
- 图层是一个图标；
- 层是框架、组或结构包装器；
- 如何配置自动布局；
- 图层如何定位；
- 当 Figma 已经知道时，哪个源组件拥有一个实例。

## 跨断点稳定的身份

同一逻辑元素必须在所有断点上保持相同的键。

Desktop:

```text
hero-title
button-group
  primary-cta [href=/pricing]
  secondary-cta [action=modal:contact-modal]
```

Mobile:

```text
hero-title
button-group
  primary-cta [href=/pricing]
  secondary-cta [action=modal:contact-modal]
```

Figma 布局可能会改变，但身份保持不变。

视觉意图标签还必须保持语义稳定。如果桌面有：

```text
sneg [decor] [asset]
```

那么移动设备必须保持相同的身份和相同的视觉意图：

```text
sneg [decor] [asset]
```

如果移动设备上缺少 `sneg`，则属于响应式身份错误。如果移动设备具有 `sneg` 但放弃了 `[decor][asset]`，那就是视觉意图漂移，而不是新身份。

## 不要在可选标识值中编码断点

可选的 BRIDGE 标识值必须描述逻辑元素，而不是响应断点。断点数据已经通过 `[bp=...]` 属于页面/根框架。

Bad:

```text
// [bp=768]
Отзывы мобилка [control=button-reviews-box-768] [action=modal:marketplaces-modal]

// [bp=375]
Отзывы мобилка [control=button-reviews-box-375] [action=modal:marketplaces-modal]
```

Good:

```text
// [bp=768]
Отзывы мобилка [action=modal:marketplaces-modal]

// [bp=375]
Отзывы мобилка [action=modal:marketplaces-modal]
```

可选子 ID，例如 `[control=...]`、`[link=...]`、`[field=...]`、`[modal=...]`、`[state=...]`、`[section=...]`、集合/项目 ID 和后备 `[decor=...]` /`[asset=...]` 值必须保持断点中立。对于普通链接/按钮，最好不要选择任何 id：使用 `[href=...]`、`[link]`、`[action=...]` 或 `[control]`。如果可选标识值以当前断点后缀（例如 `-768`、`-375`、`-移动` 或 `-desktop` 结尾），请删除后缀并仅将断点保留在根上。

## 命名约定

使用英语 kebab-case 来获得稳定的身份：

- `section-bg`
- `hero-copy`
- `primary-cta`
- `stats-行`
- `卡主图像`

避免语义冲突。创作的装置实例需要独特、稳定的设计标识：

```text
product-card-oak-chair [item=product]
product-card-wool-lamp [item=product]
```

重复的 `[item=product]` 值对角色/类型进行分类；它故意不是唯一的。稳定层名称和 `bridgeKey` 标识创作的事件。仅当不存在有意义的装置键时，才可以接受数字后缀（例如 `product-card-1`）作为设计装置后备。不得将其视为数组位置或运行时记录标识：排序、过滤、分页和实时更新更改位置。重复的运行时内容在 [structured transfer contract](04-transfer-contract.md) 中使用单独的模板密钥、设计实例密钥和稳定产品数据密钥。

## 五个身份维度

稳定的层名称是人类可见的设计锚点，而不是每个系统的通用 ID。结构化 BRIDGE 元数据映射五个不同的维度：

|尺寸|意义|
|--- |--- |
|角色 |逻辑目的，例如导航、产品数据项或状态。|
|模板|拥有结构和继承行为的可重用组件/部分定义。|
|设计实例|每个声明的上下文中的此创作事件及其源节点。|
|运行时数据|收藏和稳定的产品记录是关键规则，从来不是视觉定位。|
|目标|在目标平台上实现元素的组件、实体或定位器。|

```text
role=data-item
templateKey=product-card
designInstanceKey=product-card-oak-chair
runtimeDataKey=sku:CHAIR-OAK-01
targetKey=ProductCard
```

这些是结构化合同字段，而不是五个新的层名称标签。对于简单的静态元素，它们可能是一致的，但适配器不能假设它们是一致的。交互目标通过引用元素的稳定`bridgeKey`来解析；它们与目标实现映射不同。

## 部分名称

一个部分可以通过两种方式来标识。

首先，它可能是 `Page部分` 库页面中的节组件的实例。在这种情况下，页面实例不需要 `[section=...]`：

```text
header
reviews
footer
```

该部分的含义来自源组件：

```text
Page Sections / header -> section=header
Page Sections / reviews -> section=reviews
Page Sections / footer -> section=footer
```

其次，它可能是一个规则的框架部分或一个不明确的组件。在这种情况下，请使用显式标签：

```text
Recommended Products [section=product-slider]
Related Products [section=product-slider]
Catalog [section=product-slider]
```

Rules:

- 标签之前的图层名称是该页面的上下文标签；
- `[section=...]` 是该section组件的稳定密钥；
- 内容、标题和数据可能在不同页面上有所不同，而 `[section=...]` 保持不变；
- 如果该部分已经是 `页部分` 中的组件的实例，则不要在页面上重复 `[section=...]` ；
- 如果该部分是常规框架，则使用 `[section=...]`；
- 如果组件太通用并且其名称无法标识该部分，请使用 `[section=...]` 作为明确的说明。

跨一页断点的相同节意味着相同的节块，并且应该保持可比较的结构。不同页面的同一部分不需要相同的内容。

## 内容标识

跨断点的相同标识意味着相同的逻辑内容。

Allowed changes:

- 宽度;
- 字体大小；
- 换行；
- 同一结构内的位置；
- 父级自动布局设置；
- 同一父级内部的订单；
- 特定断点的可见性。

不允许跨断点：

- 更改 CTA 文本；
- 改变价格；
- 更改合法副本；
- 更改产品声明；
- 在移动设备上隐藏重要含义；
- 仅针对移动设备缩短标签；
- 将相同的元素移动到另一个父元素；
- 在没有显式变体、状态、集合规则或例外的情况下添加或删除逻辑元素；
- 用单独的断点特定副本替换相同的逻辑元素。

Bad:

```text
// desktop
hero-title = "Launch your store in one day"

// mobile
hero-title = "Launch faster"
```

如果文本、含义或结构因区域设置、实验、个性化、产品变体或特定于目标的限制而不同，请在普通响应断点合同之外对其进行建模。响应式断点是为另一个宽度布局的相同元素集，而不是新的内容或结构版本。

## 推荐结构名称

```text
section-body
content
hero
hero-copy
button-group
stats-row
visual-column
cards-list
cards-grid
```

这些是层名称，而不是添加技术标签的请求。