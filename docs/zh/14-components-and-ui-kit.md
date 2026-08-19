# 组件、UI 工具包和页面部分

BRIDGE 将可重用库组件分为两个级别：

- **UI Kit** — 普通界面组件；
- **页面部分** — 可重用的页面级部分块。

这种分离可以防止设计人员在每个部分组件实例上重复 `[section=...]` ，并防止页面部分与按钮、卡片、字段和其他 UI 组件混淆。

## 核心规则

> `Page Sections` 中的组件实例被视为页面部分。`UI Kit` 中的组件实例不被视为页面部分。

节组件由其源组件标识，而不是由其在页面树中的位置标识。

分类在 `Page Sections` 下的每个组件的可编辑源根目录都使用本机自动布局，即使有零个或一个子组件，除非整个源根目录是合法的不透明整体视觉 `[asset]` 且没有实时内容流。放置的实例是原子页面树边界：页面检查 0.9 不会解析其源或将其内部结构报告为页面发现。通过选择可编辑的框架或组件树单独审核源组件；分离实例不是解决方法。

## 两个库级别

Figma 库应该将普通 UI 组件与页面部分组件分开。

```text
UI Kit
  button
  input
  select
  checkbox
  tabs
  accordion
  product-card
  review-card
  icon-button

Page Sections
  header
  footer
  hero
  reviews
  faq
  product-slider
  catalog-preview
  cta
```

`UI 套件` 包含用于构建屏幕的界面元素。

`页面部分` 包含大型可重用页面块，这些页面块可能出现在具有不同内容的不同页面上。

## 这在页面上意味着什么

If `页脚`, `评论`, or `产品滑块` are instances of components from `页面部分`, they stay clean on the page:

```text
footer
reviews
product-slider
```

Do not write:

```text
footer [section=footer]
reviews [section=reviews]
product-slider [section=product-slider]
```

该部分的含义来自源组件：

```text
Page Sections / footer -> section=footer
Page Sections / reviews -> section=reviews
Page Sections / product-slider -> section=product-slider
```

## 节 id 是如何解析的

对于来自 `页面节` 的组件，节 id 是从源组件或组件集名称解析的。

```text
Component set: footer
  Breakpoint=1920
  Breakpoint=1280
  Breakpoint=768
  Breakpoint=375
```

The section id is `页脚`.

`断点` 是组件变体属性，不是部分 id 的一部分。

## 为什么这在每个实例上都比 `[section=...]` 更好

在每个实例上重复 `[section=...]` 会产生重复：

- Figma 已经知道源组件；
- 设计师手动重复相同的含义；
- 实例标签可能会偏离源组件；
- 必须在每个页面上再次标记相同的组件。

BRIDGE 避免了两个事实来源：如果 Figma 已经知道源组件，则页面不会使用标签重复它。

## 当仍需要 `[section=...]` 时

仅在这些情况下，页面层仍然需要 `[section=...]`：

1. 该部分是一个常规框架，而不是来自 `页部分` 的组件。
2. 组件过于笼统，名称不明确具体部分。
3. 该页面有意覆盖此特定展示位置的部分含义。

```text
Reviews [section=reviews]
```

该标签不是每个组件的强制标记。仅当 Figma 无法提供足够含义时，它才是明确的解释。

## 部分的包装器

节不必是根框架的直接子级。共享包装器可以根据背景、间距或视觉范围对多个部分进行分组。

```text
page-root
  dark-area
    reviews
    faq
```

`暗区` 是一个包装器，而不是一个节。

`评论` and `常见问题` remain sections when their source components live in `页面部分`.

`page-root` 和 `dark-area` 内容包装器遵循自动布局策略。两者都不会仅仅因为视觉几何看起来已经正确而成为Figma GROUP。

## UI 套件责任

`UI套件` 拥有普通界面组件及其状态：按钮、字段、链接、卡片、选项卡、手风琴、模式和其他元素。

页面不应该是第一次发明悬停、焦点、禁用、加载、错误、选择、展开或打开状态的地方。

国家覆盖范围示例：

|组件系列 |所需状态 |
|--- |--- |
|类似按钮的控件|默认、悬停、焦点、按下、禁用、加载 |
|友情链接 |默认、悬停、焦点、访问、禁用 |
|文本字段 |空、已满、焦点、错误、禁用、成功 |
|类似选择的字段 |关闭、打开、选定、焦点、错误、禁用 |
|切换/开关 |关闭、打开、聚焦、禁用 |
|标签 |默认、活动、悬停、焦点、禁用 |
|披露/手风琴 |折叠、展开、焦点、禁用|
|模态/对话框 |默认、关闭行为、背景行为、焦点陷阱 |

确切的组件分类可能因设计系统而异。BRIDGE 不应强迫设计者在页面层名称中编写详细的控制角色。

## 页面实例责任

页面实例仅描述属于特定页面的含义：

```text
Contact us [action=modal:contact-modal]
FAQ [href=/contacts#faq]
Email [field=email] [name=email]
```

当 Figma 已经知道源组件时，不要添加 `[component=...]` 。

Bad:

```text
Contact us [component=button] [action=modal:contact-modal]
```

Good:

```text
Contact us [action=modal:contact-modal]
```

## 验证器检查

A BRIDGE validator should report:

- page section block is not a component from `页部分` and does not have `[section=...]`;
- component instance from `页面部分` repeats `[section=...]` manually without a reason;
- component from `UI套件` is accidentally used as a page section;
- same logical element uses different source components across breakpoints;
- instance is detached from the library component without a reason;
- required component states are missing in the library;
- component states are drawn manually on a page;
- instance overrides change component structure rather than allowed content;
- form fields do not expose data names;
- icon-only links do not expose accessible text meaning.

## Component source of truth

Preferred source order:

1. Figma 实例元数据。
2. 源组件或组件集。
3. 库页面：`UI套件` 或 `Page部分`。
4. 组件文档。
5. 仅当 Figma 无法提供足够含义时才使用 BRIDGE 标签。

BRIDGE 标签不应重复 Figma 已经可靠提供的信息。

## 页面状态与组件状态

不要将页面/数据状态与组件状态混淆。

Page state:

```text
Catalog Page [page=catalog] [route=/catalog] [bp=1200] [view=empty]
```

库中的组件状态：

```text
Button / Primary / Disabled
Input / Error
Accordion / Expanded
```

页面可以显示真实的数据状态，例如空目录。但是组件的悬停、焦点、禁用和加载都属于组件库。