# 页面路由和视图

BRIDGE 将页面、生产路线、锚点和页面/数据状态视为传输契约的一流部分。设计不仅仅是一组部分；它是一个可导航的产品表面。

## 页面标识和可选路由

页面根始终需要稳定的 `[page=...]`。仅当真实生产 URL 或路由模式已知时才会添加路由。

已知路线：

```text
contacts [page=contacts] [route=/contacts] [bp=1200]
contacts [page=contacts] [route=/contacts] [bp=320]
```

Draft route unknown:

```text
contacts [page=contacts] [bp=1200] [view=default]
contacts [page=contacts] [bp=320] [view=default]
```

Rules:

- `[page=...]` 是稳定页面标识。
- `[route=...]` 是生产 URL 路径，不是猜测，也不是占位符。
- `[route-pattern=...]` 是真实的生产路线模板。
- 如果路线未知，则省略；缺少的路线是待办事项草稿，而不是硬错误。
- 当路由已知时，一个路由页面的所有断点/视图共享相同的路由。
- 路线在整个站点中是唯一的，除非该页面是有意的路线模板。

## 路由语法

Recommended route forms:

```text
 [route=/]
 [route=/contacts]
 [route=/catalog]
 [route=/catalog/product]
 [route-pattern=/catalog/:slug]
```

Rules:

- 仅将 `[route=...]` 用于具体生产页面；
- 仅将 `[route-pattern=...]` 用于真实模板，例如产品详细信息页面；
- 不要发明假路线来满足清单；
- 避免尾随斜杠，根 `/` 除外，除非产品明确要求它们；
- 合约中的路由值区分大小写，但建议使用小写短横线路径。

## 页面浏览量

`[view=...]` 描述页面/数据状态，而不是组件 UI 状态。

```text
catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
catalog-empty [page=catalog] [route=/catalog] [bp=1200] [view=empty]
catalog-loading [page=catalog] [route=/catalog] [bp=1200] [view=loading]
catalog-error [page=catalog] [route=/catalog] [bp=1200] [view=error]
```

Common page views:

```text
default
empty
loading
error
filtered
not-found
unauthorized
success
```

Rules:

- 每个页面都应该有 `view=default`；
- 动态页面和集合页面应在适用时定义空视图、加载视图和错误视图；
- 当路线已知时，同一页面的所有视图共享 `[page=...]` 和相同的 `[route=...]` ；
- 视图可以具有特定于状态的内容，但同一视图的响应断点不得更改内容。
- 响应式身份、类型、父级、基数和内容检查仅在一个视图内运行；`view=default` 永远不会与 `view=empty` 或 `view=err或` 的响应对应项进行比较。
- 断点集由页面契约共享：每个声明的视图都需要每个所需页面断点的根。

## 错误的页面状态建模

不要将页面状态建模为假页面或假路由：

```text
catalog [page=catalog] [route=/catalog] [view=default]
catalog-empty [page=catalog-empty] [route=/catalog-empty]
```

Correct:

```text
catalog [page=catalog] [route=/catalog] [view=default]
catalog-empty [page=catalog] [route=/catalog] [view=empty]
```

如果生产路线未知，则保留一页标识并省略路线：

```text
catalog [page=catalog] [view=default]
catalog-empty [page=catalog] [view=empty]
```

## 截面和锚杆

可寻址部分使用 `[section=...]` 和 `[anchor=...]`：

```text
contacts-faq [section=contacts-faq] [anchor=faq]
```

`[section=...]` 是可重用的部分/组件合约。人类图层名称可能是特定于页面的：

```text
catalog [section=product-slider]
related-products [section=product-slider]
recommended-products [section=product-slider]
first-screen [section=home-hero]
```

在前三个示例中，内容/数据不同，但适配器可以使用一个部分组件来实现该块。`home-hero` 是页面唯一部分的示例。

Rules:

- 当 `[section=...]` 存在时，不要在层名称中写入 `部分/` ；
- `[section=...]` 应在一页的断点上保持稳定；
- 不同页面上的相同`[section=...]`可能有不同的标题、数据和内容；
- 锚点在一页路由或页面标识中是唯一的；
- 相同的节标识应在断点之间保持相同的锚点；
- 锚点是导航的一部分，不应该在以后的实现中发明。

## 链接和 href 解析

已知链接使用 `href` 作为唯一的目标事实，不需要 `[link=...]`：

```text
contacts [href=/contacts]
faq [href=/contacts#faq]
same-page-faq [href=#faq]
telegram [href=https://t.me/company]
```

如果目的地未知，请使用 `[link]`：

```text
Contacts [link]
```

请勿使用 `[href=#]` 作为未知占位符。`#faq` 是真正的同页锚点；`#` 单独无效。

Validator resolution:

```text
href-contacts-page-with [route=/contacts]
href-contacts-faq-page [route=/contacts] + section [anchor=faq]
href-faq-current-page-section [anchor=faq]
href=https://...    -> external URL, no internal route required
```

如果由于设计处于草稿阶段而导致目标页面仍然缺少其路由，则路由解析可以保留为 TODO。一旦存在 `[route=...]`，它就必须是生产 URL。

## 查看和断点范围

具有已知路由的顶级页面根的唯一性范围：

```text
page + route + bp + view
```

如果草稿中的路线未知，请使用：

```text
page + bp + view
```

Example:

```text
catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
catalog [page=catalog] [route=/catalog] [bp=320] [view=default]
catalog-empty [page=catalog] [route=/catalog] [bp=1200] [view=empty]
catalog-empty [page=catalog] [route=/catalog] [bp=320] [view=empty]
```

## 验证者规则

A BRIDGE validator should report:

- page root has no route as Draft TODO, not a hard error;
- route value is not a production URL/path when route is specified;
- duplicate concrete routes;
- same page identity uses different known routes across breakpoints;
- same page view is missing on required breakpoint;
- dynamic collection page has no empty/loading/error view;
- `[href=#]`用作未知占位符；
- 当路由数据已知时，内部href路由不存在；
- 内部 href 锚点不存在；
- 同页锚点href在当前页面没有匹配的部分；
- 锚点在一页路由/页面标识内重复；
- 页面状态被建模为单独的假路由。
