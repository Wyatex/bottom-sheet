# BottomSheet

一个触摸驱动的底部弹出面板组件，内置惯性滚动、弹性吸附动画和滚动穿透处理。

## Props

| 名称 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `allowInertiaTransfer` | `boolean` | `false` | 是否允许惯性动量在面板拖拽和内部列表滚动之间传递。`false` 时，惯性在两者边界处停止，防止列表"偷走"滑动。 |
| `maxVelocityLimit` | `number` | `30` | 每帧最大速度限制（px），防止极速滑动产生过大位移。 |
| `minTranslateY` | `number \| null` | `null` | 折叠状态（最低点）吸附锚点，单位 px。默认为 `window.innerHeight * 0.85`。 |
| `midTranslateY` | `number \| null` | `null` | 半展开状态吸附锚点。默认为 `window.innerHeight * 0.6`，组件挂载时的初始位置。 |
| `maxTranslateY` | `number \| null` | `null` | 完全展开状态（最高点）吸附锚点。默认为 `window.innerHeight * 0.15`。 |

## Events

| 事件名 | 参数 | 说明 |
|---|---|---|
| `load-more` | — | 当内部列表滚动到底部 50px 范围内时触发，适用于无限滚动场景。 |

## Slots

| 插槽名 | 说明 |
|---|---|
| default | 默认插槽，内容渲染在拖拽把手下方的列表容器中。 |

## CSS 样式

组件使用 `<style scoped>`，以下是关键样式说明：

| 选择器 | 说明 |
|---|---|
| `.bottom-sheet` | `position: absolute`，铺满视口，白色背景，顶部圆角 24px，阴影，flex 纵向布局。 |
| `.drag-handle` | 30px 高的拖拽把手区域，居中显示灰色圆角横条。 |
| `.list-container` | `flex: 1`，`overflow: hidden`（滚动由 JS 控制），底部 20vh 内边距。 |

由于滚动是通过 JavaScript 控制 `scrollTop` 实现的，样式中 `overflow: hidden` 是必须的，请勿覆盖。

## 基础示例

```vue
<script setup>
import { BottomSheet } from '@wyatex/bottom-sheet'
import '@wyatex/bottom-sheet/dist/style.css'
</script>

<template>
  <div class="container">
    <BottomSheet>
      <div v-for="n in 30" :key="n" class="row">
        列表项 {{ n }}
      </div>
    </BottomSheet>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  inset: 0;
}
.row {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
```

## 无限滚动示例

```vue
<script setup>
import { BottomSheet } from '@wyatex/bottom-sheet'
import { ref } from 'vue'
import '@wyatex/bottom-sheet/dist/style.css'

const items = ref(Array.from({ length: 20 }, (_, i) => i + 1))
const loading = ref(false)

function loadMore() {
  if (loading.value)
    return
  loading.value = true
  setTimeout(() => {
    const start = items.value.length
    for (let i = 0; i < 20; i++) {
      items.value.push(start + i + 1)
    }
    loading.value = false
  }, 500)
}
</script>

<template>
  <div class="container">
    <BottomSheet @load-more="loadMore">
      <div v-for="id in items" :key="id" class="row">
        📍 附近地点 {{ id }}
      </div>
      <div v-if="loading" class="loading">
        加载中...
      </div>
    </BottomSheet>
  </div>
</template>
```
