import { defineConfig } from 'vitepress'

export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '@wyatex/bottom-sheet',
      description: '一个 Vue 3 轻量级底部弹出面板组件',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: '组件', link: '/components/bottom-sheet' },
          { text: 'Playground', link: '/playground/' },
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '安装', link: '/guide/installation' },
              { text: '快速开始', link: '/guide/getting-started' },
            ],
          },
          {
            text: '组件',
            items: [
              { text: 'BottomSheet', link: '/components/bottom-sheet' },
            ],
          },
          {
            text: '体验',
            items: [
              { text: 'Playground', link: '/playground/' },
            ],
          },
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/wyatex/bottom-sheet' },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: '@wyatex/bottom-sheet',
      description: 'A lightweight bottom sheet component for Vue 3',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'Components', link: '/en/components/bottom-sheet' },
          { text: 'Playground', link: '/en/playground/' },
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Installation', link: '/en/guide/installation' },
              { text: 'Getting Started', link: '/en/guide/getting-started' },
            ],
          },
          {
            text: 'Components',
            items: [
              { text: 'BottomSheet', link: '/en/components/bottom-sheet' },
            ],
          },
          {
            text: 'Playground',
            items: [
              { text: 'Playground', link: '/en/playground/' },
            ],
          },
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/wyatex/bottom-sheet' },
        ],
      },
    },
  },
})
