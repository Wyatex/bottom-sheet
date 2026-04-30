<script setup lang="ts">
import { onMounted, ref } from 'vue'

// ========== 1. 暴露给外部的 Props 和 Emits ==========
const props = withDefaults(defineProps<{
  allowInertiaTransfer?: boolean
  maxVelocityLimit?: number
  // 以下为选填，如果不传则默认按照屏幕高度的比例(0.85, 0.6, 0.15)自动计算
  minTranslateY?: number | null
  midTranslateY?: number | null
  maxTranslateY?: number | null
}>(), {
  allowInertiaTransfer: false,
  maxVelocityLimit: 30,
  minTranslateY: null,
  midTranslateY: null,
  maxTranslateY: null,
})

const emit = defineEmits<{
  (e: 'load-more'): void
}>()

// ========== 2. 内部状态与配置 ==========
const listRef = ref<HTMLElement | null>(null)
const sheetTranslateY = ref(0)

// 实际采用的吸附点
let actualMinY = 0
let actualMidY = 0
let actualMaxY = 0

// ========== 3. 物理与手势状态 ==========
let lastTouchY = 0
let lastTime = 0
let velocityY = 0
let rafId: number | null = null

onMounted(() => {
  const windowHeight = window.innerHeight
  // 如果外部传入了确切的值，则使用传入值；否则使用默认的屏幕比例算法
  actualMinY = props.minTranslateY !== null ? props.minTranslateY : windowHeight * 0.85
  actualMidY = props.midTranslateY !== null ? props.midTranslateY : windowHeight * 0.6
  actualMaxY = props.maxTranslateY !== null ? props.maxTranslateY : windowHeight * 0.15

  sheetTranslateY.value = actualMidY
})

// ========== 4. 手势交接逻辑 ==========
function handleTouchStart(e: TouchEvent) {
  if (rafId)
    cancelAnimationFrame(rafId)
  lastTouchY = e.touches[0].clientY
  lastTime = performance.now()
  velocityY = 0
}

function handleTouchMove(e: TouchEvent) {
  const currentY = e.touches[0].clientY
  const currentTime = performance.now()

  const deltaY = lastTouchY - currentY
  const deltaTime = currentTime - lastTime

  if (deltaTime > 0) {
    const rawVelocity = (deltaY / deltaTime) * 16.6
    const sign = Math.sign(rawVelocity)
    velocityY = sign * Math.min(Math.abs(rawVelocity), props.maxVelocityLimit)
  }

  if (deltaY > 0) {
    if (sheetTranslateY.value > actualMaxY) {
      sheetTranslateY.value = Math.max(actualMaxY, sheetTranslateY.value - deltaY)
    }
    else if (listRef.value) {
      listRef.value.scrollTop += deltaY
      checkLoadMore()
    }
  }
  else {
    if (listRef.value && listRef.value.scrollTop > 0) {
      listRef.value.scrollTop += deltaY
    }
    else {
      sheetTranslateY.value = Math.min(actualMinY, sheetTranslateY.value - deltaY)
    }
  }

  lastTouchY = currentY
  lastTime = currentTime
}

// ========== 5. 物理惯性与吸附引擎 ==========
function handleTouchEnd() {
  startInertia()
}

function startInertia() {
  const friction = 0.95

  let initialTarget: 'sheet' | 'list' = 'sheet'
  if (velocityY > 0) {
    initialTarget = sheetTranslateY.value > actualMaxY ? 'sheet' : 'list'
  }
  else {
    initialTarget = (listRef.value && listRef.value.scrollTop > 0) ? 'list' : 'sheet'
  }

  const loop = () => {
    if (Math.abs(velocityY) < 0.5) {
      snapSheet()
      return
    }

    if (velocityY > 0) {
      if (sheetTranslateY.value > actualMaxY) {
        sheetTranslateY.value = Math.max(actualMaxY, sheetTranslateY.value - velocityY)
      }
      else if (listRef.value) {
        if (!props.allowInertiaTransfer && initialTarget === 'sheet') {
          velocityY = 0
          snapSheet()
          return
        }
        listRef.value.scrollTop += velocityY
        checkLoadMore()
      }
    }
    else {
      if (listRef.value && listRef.value.scrollTop > 0) {
        listRef.value.scrollTop += velocityY
      }
      else {
        if (!props.allowInertiaTransfer && initialTarget === 'list') {
          velocityY = 0
          snapSheet()
          return
        }
        sheetTranslateY.value = Math.min(actualMinY, sheetTranslateY.value - velocityY)
      }
    }

    velocityY *= friction
    rafId = requestAnimationFrame(loop)
  }
  loop()
}

function snapSheet() {
  if (sheetTranslateY.value <= actualMaxY && listRef.value && listRef.value.scrollTop > 0) {
    return
  }

  const anchors = [actualMinY, actualMidY, actualMaxY]
  const targetY = anchors.reduce((prev, curr) =>
    Math.abs(curr - sheetTranslateY.value) < Math.abs(prev - sheetTranslateY.value) ? curr : prev,
  )

  const springLoop = () => {
    const diff = targetY - sheetTranslateY.value
    if (Math.abs(diff) < 1) {
      sheetTranslateY.value = targetY
      return
    }
    sheetTranslateY.value += diff * 0.15
    rafId = requestAnimationFrame(springLoop)
  }
  springLoop()
}

function checkLoadMore() {
  if (!listRef.value)
    return
  const { scrollTop, scrollHeight, clientHeight } = listRef.value
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    emit('load-more')
  }
}
</script>

<template>
  <div
    class="bottom-sheet"
    :style="{ transform: `translateY(${sheetTranslateY}px)` }"
    @touchstart="handleTouchStart"
    @touchmove.prevent="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- 拖拽把手 -->
    <div class="drag-handle">
      <div class="bar" />
    </div>

    <!-- 内部列表容器 -->
    <div ref="listRef" class="list-container">
      <!-- 业务内容通过默认插槽传入 -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bottom-sheet {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 100vh;
  background: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  touch-action: none;
}

.drag-handle {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-handle .bar {
  width: 40px;
  height: 5px;
  background: #ccc;
  border-radius: 3px;
}

.list-container {
  flex: 1;
  overflow: hidden;
  padding-bottom: 20vh;
}
</style>
