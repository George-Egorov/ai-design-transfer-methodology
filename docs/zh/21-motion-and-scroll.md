# 动作和长卷轴合约

运动是随时间变化的行为。可转移设计必须定义其驱动程序、状态、时序、中断、重入和可访问的后备，而不仅仅是一对有吸引力的关键帧。

![Storyboard of scroll-driven scenes, transitions, and fallbacks](../assets/diagrams/motion-scroll-storyboard.svg)

*首先描述稳定的场景，然后描述转换和驱动它们的条件。*

## 从目标和稳定状态开始

每个动作序列都必须有一个目的：保持空间连续性、解释因果关系、直接注意力、展示进展、确认动作或讲述一个深思熟虑的故事。装饰性动作不得延迟或掩盖任务。

首先设计没有动画的有意义的状态：

```text
feature-story
  scene-intro
  scene-compare
  scene-result
```

每个状态都必须可以理解为一个静止的框架。运动定义了界面如何在这些状态之间移动。如果内容只有在移动时才有意义，那么回退是不完整的。

## 声明驱动程序

|司机 |示例 |合同要求|
|--- |--- |--- |
|时间 |进入、退出、循环、进度|开始条件、持续时间、延迟、迭代、结束状态 |
|用户事件 |单击、提交、拖动、悬停、聚焦 |事件、输入奇偶校验、取消/反转行为 |
|滚动 |某个部分或文档的进展 |源滚动条、范围、轴、偏移、映射、重新输入 |
|查看 |元素进入或离开可见性 |阈值、根、一次/重复策略 |
|媒体/数据 |播放时间或实时值|时钟/源、缓冲或丢失数据行为 |
|系统|路线变更、连接、偏好 |触发、持久、回退|

不要仅仅将序列标记为“滚动”。指定滚动是否跨越阈值、驱动连续进度或选择离散场景。

## 时间表合同

对于每个过渡或轨道，记录：

- 稳定的来源国和目的地国身份；
- 驱动器和触发器；
- 受影响的属性或语义变化；
- 起始/结束值和单位；
- 持续时间或输入范围；
- 延迟、缓动、迭代和填充行为；
- 同步/顺序关系；
- 变换原点和坐标空间；
- 取消、中断、调整大小和内容更改的行为；
- 反向和重新进入行为；
- 减少运动和无支撑平台的结果。

当保留预期的几何形状时，更喜欢动画变换和不透明度，但性能永远不会覆盖语义、焦点或可读内容。运动令牌可以定义可重复使用的持续时间和缓动；故事序列仍然需要自己的状态和驱动程序合约。

## 将丰富的运动保留在图层名称之外

在设计中使用普通稳定恒等式：

```text
Story [section=feature-story]
  story-visual
  scene-intro
  scene-compare
  scene-result
```

不要创建 `[fade]`、`[duration]`、`[easing]`、`[pin]` 和 `[scroll-start]` 标记的平面语法。引用结构化 BRIDGE 元数据中的身份：

> **非独立模块片段。** 此摘录仅显示 `bridge.motion` 并有意省略必需的信封字段。在交换或完整合同验证之前，将其插入 [transfer contract](04-transfer-contract.md#required-envelope) 中所需的 `bridge` 信封中。

```json
{
  "bridge": {
    "motion": {
      "sequences": [{
        "sequenceId": "feature-story-scroll",
        "purpose": "Explain the product workflow in three steps",
        "driver": {
          "type": "scroll-progress",
          "source": "document",
          "range": { "start": "feature-story block-start 80%", "end": "feature-story block-end 20%" },
          "axis": "block"
        },
        "scenes": [
          { "id": "intro", "range": [0, 0.32], "content": "scene-intro" },
          { "id": "compare", "range": [0.32, 0.68], "content": "scene-compare" },
          { "id": "result", "range": [0.68, 1], "content": "scene-result" }
        ],
        "pin": { "element": "story-visual", "mode": "sticky", "container": "feature-story" },
        "reentry": "derive-from-current-progress",
        "reducedMotion": "show-all-scenes-in-document-order"
      }]
    }
  }
}
```

CSS 实现可以将适当的情况映射到 [CSS Scroll-driven Animations specification](https://www.w3.org/TR/scroll-animations-1/)；其他目标可以使用另一种机制，同时保留相同的合同。

## 长卷故事

A long-scroll sequence defines:

1. **叙事单元：**场景、其稳定的ID以及每个场景中可见的含义。
2. **滚动源：**文档或命名容器；嵌套滚动条必须是显式的。
3. **范围：** 开始/结束偏移以及它们是否使用视口坐标或容器坐标。
4. **映射：** 连续进度、阈值、捕捉或离散场景选择。
5. **布局：** 保留高度、粘性/固定区域和正常流内容。
6. **条目：** 从上方、下方、锚点或恢复的历史到达时的初始状态。
7. **退出：**最终状态和双向清理。
8. **突变：** 调整大小、方向、字体加载、本地化或动态内容后重新计算。
9. **后备：** 当脚本、粘性定位或滚动时间线不可用时，可读的正常流程。

永远不要假设只向前滚动。向后清理必须确定性地反转或跳转到声明的稳定状态。中途加载深层链接不得要求用户从顶部滚动来初始化场景。

## 粘性和固定区域

当与设计相匹配时，更喜欢本机粘性行为。该合约标识包含块、插图、开始/结束边界、保留的流动空间、堆叠/碰撞策略以及固定对象高于可用视口时的行为。

固定演示文稿不得：

- 在可访问性树中重新排序有意义的内容；
- 陷阱轮、触摸或键盘滚动；
- 将焦点控件隐藏在标题或覆盖层后面；
- 将相同的可读内容复制到活动和非活动副本中；
- 需要特定的设备高度才能到达下一部分。

使用文档顺序作为语义和键盘顺序。视觉层可能与它重叠；他们可能无法取代它。

## 重入、反向和中断

对于每个序列决定：

- **重复：** 每个会话一次、每次观看一次或每个条目一次；
- **重新进入：**重新启动、恢复、从当前驱动程序派生或保持完成状态；
- **反向：**镜像正向时间轴，使用另一个过渡，或立即更改；
- **中断：**完成、取消、从当前值混合或保留进度；
- **快速输入：** 使用确定性规则进行去抖、排队、替换或忽略；
- **路由/历史恢复：**从 URL、保存的状态或当前滚动位置重建；
- **焦点输入：**立即显示聚焦目标，无需等待动画。

实现绝不能依赖 `animationend` 事件作为达到所需产品状态的唯一方法：减少运动、后台选项卡和取消可能会绕过它。

## 减少运动和后退

BRIDGE requires a reduced-motion design even when WCAG conformance alone would not force removal of every animation. Use the user's `更喜欢减少运动`[CSS Media Queries](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion) 描述的偏好。

对于每个序列选择一个真实的策略：

- 去除不必要的视差、缩放、旋转和大空间旅行；
- 用即时变化或短暂的淡入淡出来代替运动；
- 当需要运动时，停止自动循环并公开控件；
- 按正常文档顺序渲染长滚动场景；
- 保持进度、完成情况、焦点和目标状态相同。

如果滚动捕获、闪烁、固定布局或隐藏内容仍然存在，“将持续时间减少到几乎为零”并不是一个完整的策略。在禁用脚本或不支持 API 的情况下，所有基本内容和操作仍必须存在。

## 响应运动

运动遵循同一树规则。布局坐标和路径长度可以调整；身份、目的、状态效果和完成语义保持不变。

如果狭窄的演示用披露列表或静态序列替换固定的故事，请声明 [responsive transformation](03-responsive-breakpoints.md)：映射每个场景，保留阅读/操作顺序，定义焦点和历史行为，并为两个演示提供相同的简化运动结果。

## 动作审查门

仅当审阅者可以回答时，序列才准备就绪：

- 它有什么作用以及没有它哪些稳定状态存在？
- 推动进展的因素是什么？确切的范围和时间安排是什么？
- 反向、重新输入、快速输入、调整大小和深度链接会发生什么？
- 用户可以根据需要暂停或停止移动内容吗？
- 在粘贴/固定演示过程中有意义的顺序是否完好无损？
- 键盘焦点是否保持可见并落在已渲染的目标上？
- 减少运动是否能保留内容、动作、状态和任务完成情况？
- 如果没有首选动画机制，回退是否有效？

将 [WCAG 2.2 pause, stop, hide criterion](https://www.w3.org/TR/WCAG22/#pause-stop-hide) 和 [three flashes criterion](https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold) 应用到每个最终实现。