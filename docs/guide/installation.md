# 安装

## 包管理器

::: code-group

```sh [pnpm]
pnpm add @wyatex/bottom-sheet
```

```sh [npm]
npm install @wyatex/bottom-sheet
```

```sh [yarn]
yarn add @wyatex/bottom-sheet
```

:::

## 引入

在需要使用的组件中引入 `BottomSheet` 及其样式：

```vue
<script setup>
import { BottomSheet } from '@wyatex/bottom-sheet'
import '@wyatex/bottom-sheet/dist/style.css'
</script>
```

## 环境要求

- Vue >= 3.3.0
