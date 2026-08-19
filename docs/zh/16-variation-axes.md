# 变化轴

BRIDGE 区分设计变更的原因。一个轴不得隐藏另一轴的影响。

## 核心规则

> 默认情况下，断点是另一个布局中的同一逻辑树。不同的组合需要声明响应式转换；宽度本身并不能解释这一点。

内容的改变需要一个内容承载轴。仅为了保持响应可用性而更改的拓扑需要映射转换。两者都可能表现为根之间无法解释的漂移。

## 规范轴

|轴|设计主播|内容可以改变吗？|目的|
|--- |--- |--- |--- |
|页 |`[page=...]` |本身没有 |逻辑页面标识|
|路线 |`[route=...]` / `[route-pattern=...]` |没有 |已知的生产 URL/路径模板 |
|断点|`[bp=...]` |没有 |创作响应式宽度锚点 |
|查看 |`[view=...]` |是的，特定于州 |页面/数据状态，例如加载、空、部分或错误 |
|语言环境 |`[locale=...]` |是的 |翻译和区域格式 |
|方向/书写模式 |结构化上下文|本身没有 |`ltr`/`rtl` 和水平/垂直逻辑流 |
|主题|`[theme=...]` |没有 |视觉令牌上下文 |
|实验|`[experiment=...]` |是的，受控|产品实验|
|角色 |`[role-view=...]` |是的，受控|用户/权限视图|
|数据场景|`[data=...]` |仅固定装置|数据过长、缺失、最小、最大、过时或失败 |
|目标/能力|结构化上下文/配置文件 |只有通过决定|支持的平台/输入/媒体/性能功能和后备 |

标签是短的设计锚。方向、写入模式、功能、映射和验收标准属于结构化 `bridge.context`、`bridge.responsive` 或目标功能配置文件。

## 断点轴

```text
catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
catalog [page=catalog] [route=/catalog] [bp=360] [view=default]
```

默认值允许更改几何形状、间距、字体比例、自然换行、列数和视觉排列。它不允许静默内容、操作、数据、语义关系或可访问性损失。请参阅[Responsive behavior](03-responsive-breakpoints.md)。

## 视图轴

视图是可访问的页面/数据装置：

```text
catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
catalog-loading [page=catalog] [route=/catalog] [bp=1200] [view=loading]
catalog-empty [page=catalog] [route=/catalog] [bp=1200] [view=empty]
catalog-error [page=catalog] [route=/catalog] [bp=1200] [view=error]
```

由于产品状态发生变化，视图可能会更改内容。该视图中的匹配断点仍然遵循同一树默认值或声明的转换。组件微状态保留在组件/状态机契约中，而不是成为页面根。

## 区域设置轴

```text
contacts [page=contacts] [route=/contacts] [bp=1200] [locale=en-US]
contacts [page=contacts] [route=/contacts] [bp=1200] [locale=ru-RU]
```

区域设置可能会更改产品规则选择的翻译、复数、日期/数字/货币格式以及合法内容。测试扩展、牢不可破的值、字体覆盖范围和格式。区域设置并不是较短的移动副本的解决方法。

## 方向和写作模式

区域设置和方向相关但不能互换。在结构化上下文中记录 `方向：ltr |rtl` 和 `writingMode`：

```json
{
  "direction": "rtl",
  "writingMode": "horizontal-tb"
}
```

声明合成是否镜像；使用逻辑开始/结束；识别镜像图标和保持固定的图标；涵盖混合方向的姓名、电话号码、日期、ID、代码和数字；定义图表轴/类别顺序；独立于视觉镜像保留语义阅读和键盘顺序；并包括 RTL/双向应力夹具和屏幕截图（如果支持）。

## 主题轴

```text
dashboard [page=dashboard] [bp=1200] [theme=light]
dashboard [page=dashboard] [bp=1200] [theme=dark]
```

主题会改变标记、媒体选择，或许还有对比处理。它不得默默地更改产品副本、数据、操作或可用功能。测试每个交互、数据、焦点、禁用、错误和强制/高对比度状态，而不仅仅是默认背景。

## 实验轴

```text
pricing [page=pricing] [route=/pricing] [bp=1200] [experiment=cta-a]
pricing [page=pricing] [route=/pricing] [bp=1200] [experiment=cta-b]
```

实验可能会改变批准的内容或流程。定义假设、分配、暴露事件、指标、持续时间/所有权、回退、可访问性奇偶校验和交互/历史映射。不要将实验伪装成断点。

## 角色轴

```text
dashboard [page=dashboard] [route=/dashboard] [bp=1200] [role-view=guest]
dashboard [page=dashboard] [route=/dashboard] [bp=1200] [role-view=admin]
```

角色/权限变体可能会更改信息和操作。授权系统仍然是运行时的事实来源；隐藏一层并不安全。当页面打开时权限发生变化时，封面会发生转换。

## 数据场景轴

数据场景是 QA 固定装置，而不是生产变体：

```text
product-card [data=short]
product-card [data=long]
product-grid [collection=products] [data=max-items]
product-grid-empty [collection=products] [data=empty]
```

涵盖零、一、典型、最大/未知计数、长和混合方向文本、缺失值/媒体、重复、部分、陈旧、失败和未经授权的数据。夹具顺序或数字后缀绝不是运行时记录标识。请参阅[Data and visualization](20-data-and-visualization.md)。

## 目标和能力概况

目标可能会有所不同，因为它缺乏悬停、粘性定位、滚动时间线、图表基元、编解码器、内存、带宽或其他功能。不要将每个功能变成平面标签。结构化目标概况声明：

- 平台/运行时和支持的输入/输出功能；
- 资产/媒体格式、尺寸、质量变体和艺术指导；
- 加载优先级、海报/预览、预加载与惰性行为；
- 预期数据量以及分页或虚拟化的阈值/策略；
- 低带宽、离线、数据保护、低功耗和减少运动行为；
- 不支持的能力后备和所有者；
- 绩效预算以及实施措施的衡量标准。

设计宣告了哪些媒体、信息和体验是必不可少的。实施拥有可衡量的预算和平台映射。未知功能是显式拥有的 `openQuestions[]` 记录，而不是假定的后备。

## 轴构成

传输上下文可以组成轴：

```text
catalog [page=catalog] [route=/catalog] [bp=360] [view=empty] [locale=ar-SA] [theme=dark]
```

Structured context may add `方向：rtl`, `writingMode：水平-tb`, and target profile `移动低带宽`. Pairwise/full combinations are selected by risk; teams need not draw the Cartesian product, but every omitted combination must inherit deterministically or be recorded as an open question.

## 无效示例

```text
// breakpoint hides a content experiment
hero-title desktop = "Launch your store in one day"
hero-title mobile = "Launch faster"

// fake locale hides mobile copy
hero [bp=320] [locale=mobile-short]

// theme changes product behavior
delete [theme=light] [action=modal:confirm-delete]
delete [theme=dark] [action=none]
```

## 验证

验证者或审查者应报告：

- 内容/动作/数据跨断点或主题变化，没有适用的轴；
- 拓扑变化无需响应变换；
- 用于对设备/布局进行编码的区域设置；
- 方向简化为视觉镜像，无需比迪、阅读、键盘、图标和图表决策；
- 未经批准的所有权和仪器的实验；
- 特定于角色的可见性被视为授权；
- 用作运行时身份或生产变体的数据装置；
- 不支持的目标能力，没有后备、所有者、预算或悬而未决的问题；
- 未准备好的轴组合的继承不明确。
