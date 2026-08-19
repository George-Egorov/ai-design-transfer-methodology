# 设计师快速起步

BRIDGE 帮助其他人无需作者解释就能看懂 Figma 文件。不需要先读完整规范：先准备一份真实页面，说明重要关系，再交付文件。

## 文件需要回答什么

设计中应该清楚：

1. 当前是哪一个页面和状态；
2. 哪些准备好的宽度属于同一页面；
3. 哪些图层代表同一个元素；
4. 每个链接或按钮会做什么；
5. 哪些内容可编辑、属于装饰或需要导出。

## 一个小例子

### 之前：没有会议就看不懂

```text
desktop
  frame-42
    heading
    button

mobile-final-2
  group-91
    title
```

从这些名称看不出它们是否属于同一页面、哪些元素相同，也看不出按钮的作用。

### 之后：文件能够自我说明

```text
home [page=home] [bp=1440] [view=default]
  hero [section=home-hero]
    hero-title
    contact-button [action=modal:contact-modal]

home [page=home] [bp=375] [view=default]
  hero [section=home-hero]
    hero-title

contact-modal [modal=contact-modal]
```

现在页面、宽度、相同标题和模态窗口目标都能从同一棵树中读懂。

## 五个步骤准备文件

### 1. 命名页面

为每个准备好的根图层写下稳定的页面名、宽度和状态：

```text
home [page=home] [bp=1440] [view=default]
```

只有在真实路径已知时才添加 `[route=/real-path]`。不要为了填标签而编造地址。

### 2. 使用稳定的图层名称

使用简短的英文 `kebab-case` 名称：

```text
hero-title
product-grid
contact-button
```

同一个逻辑元素在所有准备好的宽度中使用同一个名称。不要在名称中加入 `-mobile`、`-desktop` 或宽度。

### 3. 展示重要宽度

准备团队要实现的宽屏和窄屏版本。尺寸、顺序和可见性可以变化，但元素的含义和关系应保持清晰。

### 4. 说明链接和动作

用 `[href]` 表示跳转，用 `[action]` 表示界面变化：

```text
email-link [href=mailto:sales@example.com]
contact-button [action=modal:contact-modal]
```

目标必须存在于声明的文件范围内，或者明确记录为待解决问题。

### 5. 检查交付

请没有参与文件制作的人回答：

- 这是哪个页面和状态？
- 哪些宽度属于它？
- 每个交互元素会做什么？
- 哪些内容应保持可编辑或需要导出？

如果仍需要口头解释，就补充缺失的名称、关系或状态，再重新检查。

## 只添加 Figma 没有保存的含义

Figma 已经保存图层类型、组件来源、布局设置、尺寸、位置、样式和层级。BRIDGE 标签只补充产品含义：页面、区块、路径、动作、目标、状态、内容、装饰或导出规则。

参见[设计规则](01-design-rules.md)和[图层命名](02-layer-naming-and-identity.md)。

## 如果你在现有产品中工作

先从一个新区块开始，不要为周围的旧文件编造页面元数据。[团队落地指南](19-team-adoption.md)介绍了后续做法。

## 下一步

- [BRIDGE 示例](../examples/README.md)
- [设计师清单](17-designer-checklist.md)
- [完整检查](08-preflight-checklist.md)
