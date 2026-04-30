# @wyatex/bottom-sheet

A lightweight bottom sheet component for Vue 3.

## Install

```bash
pnpm add @wyatex/bottom-sheet
```

## Usage

```vue
<script setup>
import { BottomSheet } from '@wyatex/bottom-sheet'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <BottomSheet v-model="isOpen">
    <p>Sheet content</p>
  </BottomSheet>
</template>
```

## Development

```bash
pnpm install
pnpm dev        # start playground
pnpm dev:docs   # start docs site
pnpm test       # run tests
pnpm lint       # lint code
```

## License

MIT
