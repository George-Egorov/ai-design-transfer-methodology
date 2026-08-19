# BRIDGE 示例

当设计问题已经明确时，使用这些简短示例。每个示例只说明一个问题、一个修正和一个原因。先看前八个示例；数据、反应、动效和无障碍请查看进阶指南。

## 1. 页面和宽度

**问题：** 文件中有互不关联的 `desktop` 和 `mobile-final-2` 根图层。

**使用：**

```text
home [page=home] [route=/] [bp=1440] [view=default]
home [page=home] [route=/] [bp=375] [view=default]
```

相同的 `[page]` 和 `[view]` 表示准备好的宽度属于同一页面。`[bp]` 记录每个根图层展示的宽度。

## 2. 不同宽度使用同一个名称

**问题：** `hero-title-mobile` 看起来像一个新元素。

**使用：**

```text
hero-title
```

尺寸或位置可以变化，但稳定名称能让人识别同一个逻辑元素。

## 3. 页面区块

直接在页面中制作区块时使用 `[section]`：

```text
product-results [section=product-results]
  product-grid [collection=products]
```

来自 `Page Sections` 库的实例已经有源组件。如果当前图层不是区块边界，就不要重复添加区块键。

## 4. 链接还是动作

使用 `[href]` 表示跳转，使用 `[action]` 表示当前界面发生变化：

```text
catalog-link [href=/catalog]
filter-button [action=state:filters-open]
```

不要给按钮使用假的 `href`，也不要给普通链接使用假的动作。

## 5. 按钮和模态窗口

动作指向模态窗口的稳定标识：

```text
contact-button [action=modal:contact-modal]

contact-modal [modal=contact-modal]
  modal-title
  close-button
```

同一个 `UI Kit` 按钮可以在不同位置执行不同动作。动作属于页面中的实例，而不是共享组件的名称。

## 6. 有意义的结构

**问题：** 相邻图层只是因为被同时选中才被分在一起。

**使用：**

```text
hero
  hero-copy
    hero-title
    hero-subtitle
  hero-actions
    contact-button
```

每个包装层都应有实际作用：内容、布局、裁剪、背景或交互区域。详细规则请看[设计规则](../docs/01-design-rules.md)和[包装器规则](../docs/06-wrapper-policy.md)。

## 7. 真实内容

展示可能改变布局的数据：

```text
product-card
  product-title
  product-price
  product-image
```

检查短、长、空、加载和错误状态。不要用一张最终构图图片替代会变化的内容。

## 8. 内容、装饰和导出

在准确的视觉图层上使用最短且清晰的规则：

```text
product-image
hero-glow [decor]
campaign-illustration [asset]
```

`[decor]` 表示视觉作用，`[asset]` 表示整个视觉作为一个资源交付。如果两个说明都成立，同一图层可以同时使用两个标签。

## 如何使用示例目录

找到与你的问题相同的示例，采用最小的适用写法，然后完成设计师清单。数据、反应、动效和无障碍请使用进阶指南，不要继续向图层名称中添加标签。

> 非独立模块片段：这个 responsive 区块应放入完整的 `bridge` 契约中。

```json
{
  "bridge": {
    "responsive": {
      "defaultPolicy": "same-tree",
      "contexts": [
        { "id": "home-wide", "driver": "viewport", "width": 1440 },
        { "id": "home-narrow", "driver": "viewport", "width": 375 }
      ]
    }
  }
}
```
