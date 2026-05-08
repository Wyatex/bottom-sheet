# 快速开始

## 基础用法

`BottomSheet` 是一个触摸驱动的底部弹出面板，内置惯性滚动和弹性吸附动画。只需将内容放入默认插槽即可使用。

```vue
<script setup>
import { BottomSheet } from '@wyatex/bottom-sheet'
import '@wyatex/bottom-sheet/dist/style.css'
</script>

<template>
  <div class="app">
    <!-- 页面背景内容 -->
    <div class="map">
      ...
    </div>

    <!-- 底部弹出面板 -->
    <BottomSheet>
      <div v-for="n in 20" :key="n" class="item">
        列表项 {{ n }}
      </div>
    </BottomSheet>
  </div>
</template>
```

`BottomSheet` 通过 `position: absolute` 定位，需要确保父容器有定位上下文（如 `position: relative` 或 `fixed`）。

## 无限滚动

通过监听 `load-more` 事件实现滚动加载：

```vue
<script setup>
import { BottomSheet } from '@wyatex/bottom-sheet'
import { ref } from 'vue'
import '@wyatex/bottom-sheet/dist/style.css'

const items = ref([])
const loading = ref(false)

function loadMore() {
  if (loading.value)
    return
  loading.value = true

  setTimeout(() => {
    for (let i = 0; i < 20; i++) {
      items.value.push({ id: items.value.length, text: `项目 ${items.value.length + 1}` })
    }
    loading.value = false
  }, 500)
}
</script>

<template>
  <BottomSheet @load-more="loadMore">
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.text }}
    </div>
    <div v-if="loading" class="loading">
      加载中...
    </div>
  </BottomSheet>
</template>
```

当内部列表滚动到底部 50px 范围内时，`load-more` 事件会被触发。

## 自定义吸附点

默认的三个吸附点按屏幕高度比例自动计算：

| 吸附点 | 默认值 | 说明 |
|---|---|---|
| 最低点 | `innerHeight * 0.85` | 折叠状态 |
| 中间点 | `innerHeight * 0.6` | 初始位置 |
| 最高点 | `innerHeight * 0.15` | 完全展开 |

可通过 `minTranslateY`、`midTranslateY`、`maxTranslateY` props 自定义：

```vue
<template>
  <BottomSheet
    :min-translate-y="600"
    :mid-translate-y="400"
    :max-translate-y="100"
  >
    <!-- 内容 -->
  </BottomSheet>
</template>
```
