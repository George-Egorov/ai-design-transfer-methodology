# 高度和溢出

固定高度是传输错误的最常见来源之一。BRIDGE 要求高度意图明确。

## 默认偏好

更喜欢内容驱动的尺寸调整：

- 文本层拥抱内容；
- 卡片随着内容而增长；
- 部分定义填充和最小高度而不是剪切内容；
- 重复的卡片通过网格规则对齐，而不是隐藏溢出。

## 当允许固定高度时

固定高度适用于：

- 根断点画布；
- 具有设计系统尺寸的按钮和控件；
- 具有固定纵横比的图标和图像；
- 当有意设置相同高度时，有界的卡片；
- 面具、海报和导出的视觉资产；
- 具有明确溢出策略的可滚动区域。

声明一下原因：

```text
feature-card [height=fixed] [reason=equal-card-grid]
```

## 文本和固定高度

具有固定高度的文本层必须定义内容更改时会发生什么。

Bad:

```text
description [height=fixed]
```

Good:

```text
description [height=hug]
```

Or, if clipping is intentional:

```text
description [height=fixed] [overflow=truncate] [lines=3]
```

## 文本换行和手动换行

手动换行不是布局。

不要在文本图层、`<br>` 或特定于断点的副本分割中使用强制换行符，以使动态内容看起来正确。如果文本来自 CMS、管理面板、本地化文件、产品目录或任何其他可编辑源，则它必须由容器包装。

Bad:

```text
hero-title
"Launch your winter
business faster"
```

当休息只是一种视觉解决方法时。

Good:

```text
hero-title [height=hug]
```

文本区域宽度（而不是副本）定义了换行行为：

- 设置有意宽度/最大宽度；
——允许正常缠绕；
- 当块可以增长时使用拥抱/最小高度；
- 仅当截断是产品决定时才使用 `[overflow=truncate][lines=...]` ；
- 容忍长单词、名称、URL 和本地化文本。

强制换行仅当它们是内容语义或批准的品牌锁定的一部分时才有效：邮政地址、诗歌、具有规定格式的合法副本或必须在特定位置换行的活动标题。将其标记为例外：

```text
campaign-title [bridge-exception=manual-line-break] [reason=brand-lockup]
```

## 溢出政策

使用显式溢出标签：

```text
 [overflow=visible]
 [overflow=hidden]
 [overflow=scroll]
 [overflow=truncate]
```

如果某个项目在视觉上溢出，请将其放置在预期溢出的层次结构级别。
