import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PhoneSimulator from './components/PhoneSimulator.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PhoneSimulator', PhoneSimulator)
  },
} satisfies Theme
