<script setup lang="ts">
import { BottomSheet } from '@wyatex/bottom-sheet' // 确保路径正确
import { onMounted, ref } from 'vue'
import '@wyatex/bottom-sheet/dist/style.css'

interface ListItem {
  id: number
  title: string
  desc: string
}

const items = ref<ListItem[]>([])
const loading = ref(false)

onMounted(() => {
  loadMoreData()
})

// 处理数据加载
function loadMoreData() {
  if (loading.value)
    return
  loading.value = true

  setTimeout(() => {
    const start = items.value.length
    for (let i = 0; i < 20; i++) {
      items.value.push({
        id: start + i,
        title: `附近地点 ${start + i + 1}`,
        desc: `距离 ${(start + i + 1) * 100} 米`,
      })
    }
    loading.value = false
  }, 500)
}
</script>

<template>
  <div class="map-app-container">
    <!-- 底层：模拟地图背景 -->
    <img
      class="map-bg"
      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      alt="map"
    >

    <!-- 顶部：搜索栏 -->
    <div class="search-bar">
      🔍 搜地点、查公交、找路线
    </div>

    <!-- 核心组件：调用抽离出来的 BottomSheet -->
    <BottomSheet
      @load-more="loadMoreData"
    >
      <!-- 这里的内容会被分发到 BottomSheet 的默认插槽中 -->
      <div v-for="item in items" :key="item.id" class="list-item">
        <div class="icon">
          📍
        </div>
        <div class="info">
          <div class="title">
            {{ item.title }}
          </div>
          <div class="subtitle">
            {{ item.desc }}
          </div>
        </div>
      </div>

      <!-- 加载更多提示 -->
      <div v-if="loading" class="loading-more">
        正在加载更多数据...
      </div>
    </BottomSheet>
  </div>
</template>

<style scoped>
/* 业务层的样式：背景、搜索框和列表项的具体样式 */
.map-app-container {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow: hidden;
  background: #eee;
  font-family: sans-serif;
}

.map-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-bar {
  position: absolute;
  top: 50px; left: 20px; right: 20px;
  height: 50px;
  background: white;
  border-radius: 25px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #888;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.icon {
  font-size: 24px;
  margin-right: 15px;
}

.title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.subtitle {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

.loading-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>
