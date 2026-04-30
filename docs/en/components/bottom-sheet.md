# BottomSheet

A touch-driven bottom sheet component with built-in inertia scrolling, spring snap animations, and scroll-through handling.

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `allowInertiaTransfer` | `boolean` | `false` | Whether to allow inertia momentum to transfer between the sheet drag and inner list scroll. When `false`, inertia is killed at the boundary to prevent the list from "stealing" the swipe. |
| `maxVelocityLimit` | `number` | `30` | Maximum per-frame velocity limit (px). Prevents extremely fast swipes from producing oversized displacement. |
| `minTranslateY` | `number \| null` | `null` | Bottom (collapsed) snap anchor in px. Defaults to `window.innerHeight * 0.85`. |
| `midTranslateY` | `number \| null` | `null` | Middle snap anchor. Defaults to `window.innerHeight * 0.6`. This is the initial position on mount. |
| `maxTranslateY` | `number \| null` | `null` | Top (fully expanded) snap anchor in px. Defaults to `window.innerHeight * 0.15`. |

## Events

| Event | Payload | Description |
|---|---|---|
| `load-more` | — | Emitted when the inner list scrolls to within 50px of the bottom. Useful for infinite scroll. |

## Slots

| Slot | Description |
|---|---|
| default | Content rendered inside the list container, below the drag handle. |

## CSS Styles

The component uses `<style scoped>`. Key selectors:

| Selector | Description |
|---|---|
| `.bottom-sheet` | `position: absolute`, full viewport height, white background, top border-radius 24px, box-shadow, flex column layout. |
| `.drag-handle` | 30px tall drag handle area with a centered gray rounded bar. |
| `.list-container` | `flex: 1`, `overflow: hidden` (scroll is managed via JS), 20vh bottom padding. |

Since scrolling is managed via JavaScript (`scrollTop`), the `overflow: hidden` style is required — do not override it.

## Basic Example

```vue
<script setup>
import { BottomSheet } from '@wyatex/bottom-sheet'
import '@wyatex/bottom-sheet/dist/style.css'
</script>

<template>
  <div class="container">
    <BottomSheet>
      <div v-for="n in 30" :key="n" class="row">
        Item {{ n }}
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

## Infinite Scroll Example

```vue
<script setup>
import { ref } from 'vue'
import { BottomSheet } from '@wyatex/bottom-sheet'
import '@wyatex/bottom-sheet/dist/style.css'

const items = ref(Array.from({ length: 20 }, (_, i) => i + 1))
const loading = ref(false)

function loadMore() {
  if (loading.value) return
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
        📍 Nearby Place {{ id }}
      </div>
      <div v-if="loading" class="loading">Loading...</div>
    </BottomSheet>
  </div>
</template>
```
