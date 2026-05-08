<script setup lang="ts">
import { BottomSheet } from '@wyatex/bottom-sheet'
import { onMounted, onUnmounted, ref } from 'vue'
import '@wyatex/bottom-sheet/dist/style.css'

interface ListItem {
  id: number
  title: string
  desc: string
}

const items = ref<ListItem[]>([])
const loading = ref(false)
const phoneScreen = ref<HTMLElement | null>(null)
const sheetRoot = ref<HTMLElement | null>(null)

let activePointerId: number | null = null

onMounted(() => {
  loadMoreData()
  // 在挂载后找到 BottomSheet 的根元素
  if (phoneScreen.value) {
    const el = phoneScreen.value.querySelector('.bottom-sheet') as HTMLElement | null
    if (el)
      sheetRoot.value = el
  }
})

onUnmounted(() => {
  if (activePointerId !== null && phoneScreen.value) {
    try {
      phoneScreen.value.releasePointerCapture(activePointerId)
    }
    catch {}
  }
})

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

function createSyntheticTouch(e: PointerEvent, type: string): TouchEvent {
  const touch = new Touch({
    identifier: 0,
    target: sheetRoot.value!,
    clientX: e.clientX,
    clientY: e.clientY,
    screenX: e.screenX,
    screenY: e.screenY,
    pageX: e.pageX,
    pageY: e.pageY,
  })
  return new TouchEvent(type, {
    cancelable: true,
    bubbles: true,
    touches: type === 'touchend' ? [] : [touch],
    targetTouches: type === 'touchend' ? [] : [touch],
    changedTouches: [touch],
  })
}

function onPointerDown(e: PointerEvent) {
  if (!sheetRoot.value || !phoneScreen.value)
    return
  // 只响应左键或触控笔
  if (e.button !== 0 && e.pointerType !== 'pen')
    return

  activePointerId = e.pointerId
  phoneScreen.value.setPointerCapture(e.pointerId)

  const touchEvent = createSyntheticTouch(e, 'touchstart')
  sheetRoot.value.dispatchEvent(touchEvent)
}

function onPointerMove(e: PointerEvent) {
  if (activePointerId === null || e.pointerId !== activePointerId || !sheetRoot.value)
    return

  const touchEvent = createSyntheticTouch(e, 'touchmove')
  sheetRoot.value.dispatchEvent(touchEvent)
}

function onPointerUp(e: PointerEvent) {
  if (activePointerId === null || e.pointerId !== activePointerId || !sheetRoot.value)
    return

  const touchEvent = createSyntheticTouch(e, 'touchend')
  sheetRoot.value.dispatchEvent(touchEvent)

  if (phoneScreen.value) {
    try {
      phoneScreen.value.releasePointerCapture(activePointerId)
    }
    catch {}
  }
  activePointerId = null
}

function onPointerCancel(e: PointerEvent) {
  if (activePointerId === null || e.pointerId !== activePointerId || !sheetRoot.value)
    return

  const touchEvent = createSyntheticTouch(e, 'touchend')
  sheetRoot.value.dispatchEvent(touchEvent)

  if (phoneScreen.value) {
    try {
      phoneScreen.value.releasePointerCapture(activePointerId)
    }
    catch {}
  }
  activePointerId = null
}
</script>

<template>
  <div class="phone-wrapper">
    <div class="phone-frame">
      <!-- 刘海 -->
      <div class="notch" />
      <!-- 屏幕区域 -->
      <div
        ref="phoneScreen"
        class="phone-screen"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      >
        <!-- 状态栏 -->
        <div class="status-bar">
          <span>9:41</span>
          <div class="status-icons">
            <span>&#9679;&#9679;&#9679;&#9679;&#9679;</span>
            <span>WiFi</span>
            <span>100%</span>
          </div>
        </div>

        <!-- 地图背景 -->
        <img
          class="map-bg"
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="map"
        >

        <!-- 搜索栏 -->
        <div class="search-bar">
          &#128269; 搜地点、查公交、找路线
        </div>

        <!-- BottomSheet -->
        <BottomSheet
          :min-translate-y="690"
          :mid-translate-y="487"
          :max-translate-y="122"
          @load-more="loadMoreData"
        >
          <div v-for="item in items" :key="item.id" class="list-item">
            <div class="item-icon">
              &#128205;
            </div>
            <div class="item-info">
              <div class="item-title">
                {{ item.title }}
              </div>
              <div class="item-desc">
                {{ item.desc }}
              </div>
            </div>
          </div>
          <div v-if="loading" class="loading-more">
            正在加载更多数据...
          </div>
        </BottomSheet>
      </div>
      <!-- 底部 Home 指示条 -->
      <div class="home-indicator" />
    </div>
    <div class="phone-tip">
      用鼠标拖拽体验 BottomSheet 交互
    </div>
  </div>
</template>

<style scoped>
.phone-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.phone-frame {
  width: 375px;
  height: 812px;
  border-radius: 44px;
  background: #000;
  padding: 12px;
  box-shadow:
    0 0 0 2px #333,
    0 20px 60px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  background: #000;
  border-radius: 0 0 18px 18px;
  z-index: 100;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  background: #eee;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  z-index: 50;
}

.status-icons {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.map-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-bar {
  position: absolute;
  top: 60px;
  left: 16px;
  right: 16px;
  height: 44px;
  background: white;
  border-radius: 22px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #888;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.item-icon {
  font-size: 22px;
  margin-right: 12px;
}

.item-title {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.item-desc {
  font-size: 12px;
  color: #888;
  margin-top: 3px;
}

.loading-more {
  text-align: center;
  padding: 16px;
  color: #999;
  font-size: 13px;
}

.home-indicator {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 134px;
  height: 5px;
  background: #fff;
  border-radius: 3px;
}

.phone-tip {
  margin-top: 16px;
  font-size: 14px;
  color: #888;
}
</style>
