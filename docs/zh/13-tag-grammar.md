# BRIDGE 标签语法

BRIDGE 标签是层名称中简短的机器可读注释。在 Figma 中，它们仅用于 Figma 元数据中不存在的传输意图。

## 核心原则

如果标签与 Figma 中已编写的内容重复，请勿编写标签。

Figma 是技术层属性的真实来源：

- 节点类型：文本、图像/矢量、组件实例；
- 自动布局、约束、尺寸、间隙、填充、对齐、换行；
- 层次结构：框架、组、组件；
- 定位、剪裁、遮罩；
- 填充、描边、效果；
- 源组件、变体、组件属性。

BRIDGE标签仅用于产品或转移意义。

## 句法

使用属性标签来表示代理或适配器必须读取的事实：

```text
 [property=value]
```

对不需要值的视觉意图/策略标志和草稿标记使用布尔标签：

```text
[decor]
[asset]
[link]
[control]
```

Figma 内部的稳定身份可以只是图层名称：

```text
hero-title
product-photo
close-icon
button-group
```

该名称必须是稳定的英文 kebab-case。

如果属性标记具有类似身份的值，则该值必须为英文短横线大小写，除非该标记显式定义其他值语法，例如 `[route=/path]`、`[href=https://...]` 或 `[action=modal:target-id]`。

可选标识值不得包含断点名称或宽度。该断点已经通过 `[bp=...]` 属于页面/根框架；子 id 描述逻辑元素，而不是响应变体。

Bad:

```text
reviews [control=button-reviews-box-768] [action=modal:marketplaces-modal]
```

Good:

```text
reviews [action=modal:marketplaces-modal]
```

对于可选的身份承载值，例如 `[link=...]`、`[control=...]`、`[field=...]`、`[modal=...]`、`[state=...]`、`[section=...]`、集合/项目 ID 和后备 `[decor=...]` /`[asset=...]` 值、与当前断点匹配的后缀（例如 `-768`、`-375`、`-mobile` 或 `-desktop`）无效。

## 设计师写的标签

### 页面和路线

```text
 [page=home]
 [route=/]
 [bp=1920]
 [view=default]
 [anchor=faq]
```

```text
home [page=home] [route=/] [bp=1920] [view=default]
faq [anchor=faq]
```

`[page=...]`、`[bp=...]` 和 `[view=...]` 定义可起草的页面根。仅当真实生产 URL 已知时才添加 `[route=...]` 或 `[route-pattern=...]`：

```text
contacts [page=contacts] [bp=1440] [view=default]
contacts [page=contacts] [route=/contacts] [bp=1440] [view=default]
product-detail [page=product-detail] [route-pattern=/catalog/:slug] [bp=1440] [view=default]
```

不要为了满足清单而发明虚假的生产路线。

### 分段合同

```text
 [section=product-slider]
 [section=home-hero]
```

`[section=...]` 描述了节组件的稳定键，而不是特定块的标题。

如果该块是 `Page Sections` 库页面中的组件实例，则该页面实例不需要该标签：

```text
header
reviews
footer
```

在这种情况下，部分键来自源组件：

```text
Page Sections / header -> section=header
Page Sections / reviews -> section=reviews
Page Sections / footer -> section=footer
```

如果块是常规框架或组件太通用，请显式使用标签：

```text
catalog [section=product-slider]
related-products [section=product-slider]
recommended-products [section=product-slider]
hero [section=home-hero]
```

请勿使用 `Section /` 等前缀：该角色已从标记或 `Page Sections` 中的源组件中清除。

### 目标

```text
 [modal=contact-modal]
 [state=mobile-menu-open]
```

```text
contact-modal [modal=contact-modal]
mobile-menu-open [state=mobile-menu-open]
```

### 链接

已知的导航目的地写为 `[href=...]`。这个标签足以将该层分类为链接；普通设计器示例不需要`[link=...]`。

```text
 [href=/contacts]
 [href=/contacts#faq]
 [href=#faq]
 [href=https://t.me/company]
 [href=mailto:sales@example.com]
 [href=tel:+12025550123]
```

```text
contacts-link [href=/contacts]
faq-link [href=/contacts#faq]
same-page-faq [href=#faq]
telegram-link [href=https://t.me/company]
email-link [href=mailto:sales@example.com]
phone-link [href=tel:+12025550123]
```

如果目的地未知，请使用布尔草图标记 `[link]`：

```text
contacts-link [link]
```

`[href=#]` 无效。`#faq` 是真正的同页锚点；`#` 不是未知的 href 占位符。

Optional link behavior:

```text
 [open=new-tab]
[a11y-label=Telegram]
```

仅高级覆盖：当除了层名称之外还需要显式稳定机器 ID 时，请使用 `[link=...]` 。不要在普通的设计器示例中使用它。

```text
contacts-cta [link=nav-contacts-primary] [href=/contacts]
```

Validators classify href values:

- `/path` — 内部路由；
- `#anchor` — 同页锚点；
- `/path#anchor` — 跨页锚点；
- `https://...` — 外部 URL；
- `mailto:` / `tel:` — 外部协议。

### 控制和操作

已知的非导航操作被写为 `[action=...]`。这个标签足以将该层分类为控件/按钮；普通设计器示例不需要`[control=...]`。

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

如果操作未知，请使用布尔草稿标记 `[control]`：

```text
contact-cta [control]
```

仅高级覆盖：当除了层名称之外还需要显式稳定机器 ID 时，请使用 `[control=...]` 。不要在普通的设计器示例中使用它。

```text
contact-cta [control=contact-cta-primary] [action=modal:contact-modal]
```

Allowed action forms:

```text
 [action=modal:target-id]
 [action=state:target-id]
 [action=submit:form-id]
 [action=reset:target-id]
 [action=none]
```

### 领域

字段需要稳定的标识和数据绑定名称。

```text
email [field=email] [name=email]
country [field=country] [name=country]
message [field=message] [name=message]
```

仅当无法从 UI Kit/本机元数据推断类型时才使用 `[field-type=...]`：

```text
country [field=country] [name=country] [field-type=select]
```

### 收藏品和重复物品

仅当动态列表或重复数据必须明确时才使用集合/项目标签。

```text
products [collection=products]
product-card-oak-chair [item=product]
product-card-wool-lamp [item=product]
```

共享的 `[item=product]` 值对可重复的角色/类型进行分类；它不带有身份。使用稳定层名称/`bridgeKey` 和结构化 `designInstance`/`runtimeData` 映射来获得唯一的创作和运行时身份。如果卡片是一个组件实例，并且从 Figma 结构中可以明显看出重复，则不需要额外的标签。

### 视觉意图

内容图像获得稳定的图层名称，无需手动 `[image=...]` 标记。

```text
product-photo
article-cover
author-avatar
```

`[decor]` 和 `[asset]` 是布尔视觉意图/策略标签，而不是强制身份标签。它们可以一起出现，并且不得报告为“多个身份标签”。

装饰视觉效果标有 `[decor]`。

`[decor]` means:

- 该层具有装饰性；
- 不是产品内容；
- 在不透明资产之外，它是确切预期的绝对视觉节点，而不是流容器或组；
- 它不应进入可访问性树，并且可能是 `aria-hidden`；
- 它不需要替代/内容语义；
- 它仍然保留稳定的响应身份，并且不得在断点之间消失；
- 它永远不会禁用自身、祖先或任意子树的自动布局或组验证。

```text
sneg [decor]
snow-bg [decor]
hero-glow [decor]
```

整个导出的视觉对象标记有 `[asset]`。

`[asset]` means:

- 将视觉效果作为一个整体导出或使用；
- 不要从内部层重建它；
- 将其内部组成视为不透明以进行结构布局检查；
- 根资产在断点之间仍然保留稳定的响应身份，并且仍然是其父级自动布局中的一项；
- 切勿标记整个 BRIDGE 页面根 `[asset]` 以绕过布局检查。

```text
promo-poster [asset]
lab-illustration [asset]
snow-bg [decor] [asset]
```

如果图层已经有稳定的名称，则更喜欢布尔形式：

```text
sneg [decor] [asset]
```

身份是 `sneg`。`[decor]` 和 `[asset]` 仅添加视觉意图和传输策略。

旧值形式仍然有效，仅作为不良/默认图层名称的后备：

```text
Frame 182 [decor=snow-bg]
Group 91 [asset=promo-poster]
```

如果 `[decor=...]` 或 `[asset=...]` 中存在某个值，请将其验证为英文短横线大小写。没有值的布尔 `[decor]` 和 `[asset]` 是有效的。

### 高度和溢出

仅当无法从 Figma 安全推断行为或动态内容需要显式策略时才使用这些标签。

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

### 例外情况

```text
 [bridge-exception=raster-text]
 [bridge-exception=overlay]
 [bridge-exception=manual-layout]
 [bridge-exception=fixed-height]
 [bridge-exception=manual-line-break]
 [bridge-exception=unsupported-effect]
 [bridge-exception=manual-transfer]
 [reason=brand-lockup]
```

Rules:

- 每个异常都需要`[reason=...]`；
- 仅当换行符是语义的或批准的品牌锁定时才允许 `[bridge-exception=manual-line-break]` ，而不是动态文本的解决方法；
- `[bridge-exception=overlay] [reason=...]` 可能仅在精确的绝对覆盖节点上满足定位意图；
- 准确的 GROUP 或手动容器上的 `[bridge-exception=manual-layout] [reason=...]` 记录了建议的偏差，但不会抑制页面/部分/容器/GROUP 结构错误；
- 例外不会使设计变得更好，它们只会使复杂性变得更加明确。

## Figma 中未写的标签

对于 Figma 设计，请勿使用：

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

Rules:

- TEXT 节点从层名称中获取身份；
- 内容图像从图层名称中获取身份；
- 图标从层名称和/或组件元数据中获取身份；
- 页面根、框架构建部分和多子内容流容器使用 Figma 中的本机自动布局；
- GROUP 节点仅允许在不透明的 `[asset]` 子树内；基元和叶子几何体仍然不受拥有自动布局的约束；
- 定位是在 Figma 中编写的；
- 组件源、变体和状态来自 UI Kit 组件元数据；
- 导航目的地始终是 `[href=...]`，而不是 `[to=...]`。

## 组件所有权

当 Figma 已经知道源组件时，不要使用 `[component=...]` 标记页面实例。组件源、变体和 UI 状态属于 UI Kit，应从 Figma 组件元数据中提取。

Page instance:

```text
contact-cta [action=modal:contact-modal]
```

UI Kit 组件源定义了状态：默认、悬停、焦点、禁用、加载、错误等。

See [Components and UI Kit](14-components-and-ui-kit.md).

## 无效示例

```text
hero-title [text=hero-title]
```

对于 Figma TEXT 节点无效：使用图层名称 `hero-title`。

```text
content [container=content] [layout=stack]
```

对 Figma 结构无效：在 Figma 中使用 `content` 框架和自动布局。

```text
Group 91 [decor]
```

在资产子树外部无效：`[decor]` 不会将 GROUP 转换为布局合约。将其替换为自动布局框架，或者当整个视觉对象真正作为一个不透明单元传输时使用 `artwork [decor] [asset]` 。

```text
legacy-lockup [bridge-exception=manual-layout] [reason=vendor-master-art]
```

有效的异常语法，但它不会使非资产 GROUP 通过结构验证。阻塞发现继续到单独的偏差接受门。

```text
snow-bg [decor] [abs]
```

无效：`decor` 是意图；定位来自Figma。仅在本机定位为绝对的确切视觉节点上使用 `snow-bg [decor]` 。

```text
faq [to=anchor:contacts-faq] [href=/contacts#faq]
```

无效：两个目的地。仅使用 `[href=/contacts#faq]`。

```text
unknown-link [href=#]
```

无效：`#` 不是未知的 href 占位符。使用 `unknown-link [link]`。

```text
reviews [control=button-reviews-box-768] [action=modal:marketplaces-modal]
```

无效：可选 id 不得包含断点后缀。使用 `reviews [action=modal:marketplaces-modal]`。
