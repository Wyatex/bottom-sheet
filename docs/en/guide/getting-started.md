# Getting Started

## Basic Usage

`BottomSheet` is a touch-driven bottom sheet component with built-in inertia scrolling and spring snap animations. Just place your content inside the default slot.

```vue
<script setup>
import { BottomSheet } from '@wyatex/bottom-sheet'
import '@wyatex/bottom-sheet/dist/style.css'
</script>

<template>
  <div class="app">
    <!-- Background content -->
    <div class="map">...</div>

    <!-- Bottom sheet -->
    <BottomSheet>
      <div class="item" v-for="n in 20" :key="n">
        Item {{ n }}
      </div>
    </BottomSheet>
  </div>
</template>
```

`BottomSheet` is positioned with `position: absolute`, so make sure its parent has a positioning context (e.g. `position: relative` or `fixed`).

## Infinite Scroll

Listen to the `load-more` event to implement scroll-to-load:

```vue
<script setup>
import { ref } from 'vue'
import { BottomSheet } from '@wyatex/bottom-sheet'
import '@wyatex/bottom-sheet/dist/style.css'

const items = ref([])
const loading = ref(false)

function loadMore() {
  if (loading.value) return
  loading.value = true

  setTimeout(() => {
    for (let i = 0; i < 20; i++) {
      items.value.push({ id: items.value.length, text: `Item ${items.value.length + 1}` })
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
    <div v-if="loading" class="loading">Loading...</div>
  </BottomSheet>
</template>
```

The `load-more` event fires when the inner list scrolls to within 50px of the bottom.

## Custom Snap Points

The three default snap points are calculated as a percentage of screen height:

| Snap Point | Default | Description |
|---|---|---|
| Bottom (collapsed) | `innerHeight * 0.85` | Collapsed state |
| Middle | `innerHeight * 0.6` | Initial position on mount |
| Top (fully expanded) | `innerHeight * 0.15` | Fully expanded state |

Customize them via `minTranslateY`, `midTranslateY`, and `maxTranslateY` props:

```vue
<template>
  <BottomSheet
    :min-translate-y="600"
    :mid-translate-y="400"
    :max-translate-y="100"
  >
    <!-- Content -->
  </BottomSheet>
</template>
```
