<template>
  <section ref="sectionRef" class="latest-updates w-full h-screen flex items-center justify-center bg-transparent text-white overflow-visible">
    <!-- 内部容器：带圆角阴影，尺寸会随滚动缩放 -->
    <div
      class="relative w-[90%] md:w-[60%] lg:w-[50%] aspect-video rounded-3xl overflow-hidden shadow-2xl transition-transform z-40"
      :style="wrapperStyle"
    >
      <!-- Slides -->
      <div
        class="slides flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] h-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div v-for="(item, idx) in items" :key="idx" class="slide flex-shrink-0 w-full h-full relative">
          <img
            v-if="item.type === 'image'"
            :src="item.src"
            :alt="item.title || 'image'"
            class="w-full h-full object-cover"
          />
          <video
            v-else
            ref="mediaVideos"
            :src="item.src"
            :poster="item.poster || ''"
            class="w-full h-full object-cover"
            controls
            playsinline
          />
          <!-- 渐变遮罩 -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none"></div>
          <!-- 标题 -->
          <h2
            v-if="item.title"
            class="absolute bottom-6 left-1/2 -translate-x-1/2 text-xl md:text-3xl font-semibold drop-shadow-lg pointer-events-none"
          >
            {{ item.title }}
          </h2>
        </div>
      </div>

      <!-- 导航按钮 -->
      <button @click="prev" class="nav-btn left-4 md:left-6 z-50 cursor-pointer">
        <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button @click="next" class="nav-btn right-4 md:right-6 z-50 cursor-pointer">
        <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- 指示器 -->
      <div class="indicators absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        <button
          v-for="(item, idx) in items"
          :key="idx"
          @click="go(idx)"
          class="indicator w-2.5 h-2.5 rounded-full transition-all duration-300"
          :class="idx === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/40 hover:bg-white/70'"
        />
      </div>
    </div>

    <!-- 继续下滑提示 -->
    <div 
      v-if="showScrollHint"
      class="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 text-center"
      :class="scrollHintClass"
    >
      <div class="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 text-white">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>{{ scrollHintText }}</span>
          <svg class="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Main Content 区域 -->
    <div 
      class="main-content-container fixed inset-0 z-30 flex items-center justify-center"
      :style="mainContentStyle"
    >
      <div class="w-full h-full">
        <slot name="main-content"></slot>
      </div>
    </div>

    <!-- 调试器面板 -->
    <div 
      v-if="showDebugger"
      class="fixed top-4 right-4 z-[9999] bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg text-sm font-mono max-w-sm"
    >
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-blue-400">滚轮调试器</h3>
        <button @click="showDebugger = false" class="text-red-400 hover:text-red-300">✕</button>
      </div>
      
      <!-- 实时状态 -->
      <div class="space-y-1 mb-3 text-xs">
        <div>滚动进度: <span class="text-yellow-400">{{ progress.toFixed(3) }}</span></div>
        <div>滚动距离: <span class="text-yellow-400">{{ scrollDistance.toFixed(1) }}px</span></div>
        <div>区域顶部: <span class="text-yellow-400">{{ sectionTop.toFixed(1) }}px</span></div>
        <div>区域底部: <span class="text-yellow-400">{{ sectionBottom.toFixed(1) }}px</span></div>
        <div>视口高度: <span class="text-yellow-400">{{ viewportHeight }}px</span></div>
        <div>滚轮计数: <span class="text-yellow-400">{{ wheelCount }}</span></div>
        <div>当前阶段: <span class="text-green-400">{{ currentStage }}</span></div>
      </div>

      <!-- 状态指示器 -->
      <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div class="flex items-center space-x-1">
          <div :class="slidesVisible ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full"></div>
          <span>Slides</span>
        </div>
        <div class="flex items-center space-x-1">
          <div :class="mainContentVisible ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full"></div>
          <span>Main</span>
        </div>
        <div class="flex items-center space-x-1">
          <div :class="wheelBlocked ? 'bg-red-500' : 'bg-green-500'" class="w-2 h-2 rounded-full"></div>
          <span>滚轮</span>
        </div>
        <div class="flex items-center space-x-1">
          <div :class="showScrollHint ? 'bg-blue-500' : 'bg-gray-500'" class="w-2 h-2 rounded-full"></div>
          <span>提示</span>
        </div>
      </div>

      <!-- 计算值 -->
      <div class="space-y-1 mb-3 text-xs">
        <div>Slides缩放: <span class="text-cyan-400">{{ slidesScale.toFixed(3) }}</span></div>
        <div>Slides透明度: <span class="text-cyan-400">{{ slidesOpacity.toFixed(3) }}</span></div>
        <div>Main缩放: <span class="text-purple-400">{{ mainScale.toFixed(3) }}</span></div>
        <div>Main透明度: <span class="text-purple-400">{{ mainOpacity.toFixed(3) }}</span></div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex space-x-2 text-xs">
        <button @click="resetProgress" class="bg-red-600 hover:bg-red-700 px-2 py-1 rounded">重置</button>
        <button @click="simulateProgress(0.5)" class="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded">50%</button>
        <button @click="simulateProgress(1)" class="bg-green-600 hover:bg-green-700 px-2 py-1 rounded">100%</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'

interface MediaItem {
  type: 'image' | 'video'
  src: string
  poster?: string
  title?: string
}

const props = defineProps<{ 
  items: MediaItem[]
  auto?: boolean
  onScrollProgress?: (progress: number) => void // 滚动进度回调
}>()

/* 轮播逻辑 */
const currentIndex = ref(0)
const timer = ref<number | null>(null)
const mediaVideos = ref<HTMLVideoElement[]>()

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length
  pauseOthers()
  nextTick(() => updateVideoVolume())
}
const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
  pauseOthers()
  nextTick(() => updateVideoVolume())
}
const go = (idx: number) => {
  currentIndex.value = idx
  pauseOthers()
  nextTick(() => updateVideoVolume())
}
const startAuto = () => {
  if (props.auto === false) return
  timer.value = window.setInterval(next, 8000)
}
const stopAuto = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}
const pauseOthers = () => {
  if (!mediaVideos.value) return
  mediaVideos.value.forEach((v, idx) => {
    if (idx !== currentIndex.value && !v.paused) v.pause()
  })
}
const handleEnterPiP = () => stopAuto()
const handleLeavePiP = () => startAuto()

// 视频播放事件处理
const handleVideoPlay = () => {
  stopAuto()
  updateVideoVolume()
}
const handleVideoPause = () => startAuto()
const handleVideoEnded = () => startAuto()

/* 高级滚轮控制逻辑 */
const sectionRef = ref<HTMLElement | null>(null)
const progress = ref(0) // 0~1
const showDebugger = ref(false)

// 调试状态
const scrollDistance = ref(0)
const sectionTop = ref(0)
const sectionBottom = ref(0)
const viewportHeight = ref(window.innerHeight)

// 滚轮控制状态
const wheelCount = ref(0) // 滚轮下滑次数计数
const wheelBlocked = ref(false) // 是否阻止滚轮
const showScrollHint = ref(false) // 是否显示滚动提示
const scrollHintText = ref('继续下滑') // 提示文字
const currentStage = ref('初始状态') // 当前阶段

// 阶段配置
const WHEEL_BLOCK_PROGRESS = 0.022 // 阻止滚轮的进度阈值
const HINT_SHOW_WHEELS = 2 // 下滑几次后显示提示
const MAIN_SHOW_WHEELS = 4 // 下滑几次后显示Main
const RESTORE_WHEELS_AFTER_100 = 2 // 100%后下滑几次恢复滚轮

// 计算属性
const slidesVisible = computed(() => progress.value < 1)
const mainContentVisible = computed(() => wheelCount.value >= MAIN_SHOW_WHEELS)
const slidesScale = computed(() => Math.max(0.2, 1 - progress.value * 0.8))
const slidesOpacity = computed(() => Math.max(0, 1 - progress.value))
const mainScale = computed(() => {
  if (wheelCount.value < MAIN_SHOW_WHEELS) return 0
  const mainProgress = Math.min(1, (wheelCount.value - MAIN_SHOW_WHEELS) / 4)
  return 0.3 + mainProgress * 0.7
})
const mainOpacity = computed(() => {
  if (wheelCount.value < MAIN_SHOW_WHEELS) return 0
  const mainProgress = Math.min(1, (wheelCount.value - MAIN_SHOW_WHEELS) / 4)
  return mainProgress
})

const scrollHintClass = computed(() => {
  return showScrollHint.value ? 'animate-pulse' : 'opacity-0'
})

const updateProgress = () => {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const sectionHeight = window.innerHeight
  
  // 更新调试信息
  sectionTop.value = rect.top
  sectionBottom.value = rect.bottom
  viewportHeight.value = window.innerHeight
  
  let scrollProgress = 0
  
  if (rect.top < 0) {
    const scrollDist = Math.abs(rect.top)
    scrollDistance.value = scrollDist
    const maxScroll = sectionHeight * 0.8
    scrollProgress = Math.min(1, scrollDist / maxScroll)
  }
  
  progress.value = scrollProgress
  
  // 检查是否需要阻止滚轮
  if (scrollProgress >= WHEEL_BLOCK_PROGRESS && !wheelBlocked.value) {
    wheelBlocked.value = true
    currentStage.value = '滚轮已阻止'
    console.log('🚫 滚轮已在进度', scrollProgress.toFixed(3), '时阻止')
  }
  
  // 通知父组件滚动进度
  if (props.onScrollProgress) {
    props.onScrollProgress(scrollProgress)
  }
  
  updateVideoVolume()
}

// 滚轮事件处理
const handleWheel = (event: WheelEvent) => {
  // 如果滚轮被阻止
  if (wheelBlocked.value) {
    event.preventDefault()
    event.stopPropagation()
    
    // 只处理向下滚动
    if (event.deltaY > 0) {
      wheelCount.value++
      console.log('🎯 滚轮下滑次数:', wheelCount.value)
      
      // 更新阶段和提示
      updateStageAndHint()
    }
    // 向上滚动处理
    else if (event.deltaY < 0) {
      if (wheelCount.value > 0) {
        wheelCount.value--
        console.log('🔄 滚轮上滑，次数减少:', wheelCount.value)
        updateStageAndHint()
      } else {
        // 如果已经回到初始状态，恢复正常滚动
        wheelBlocked.value = false
        currentStage.value = '恢复正常滚动'
        showScrollHint.value = false
        console.log('✅ 恢复正常滚动')
      }
    }
    
    return false
  }
}

// 更新阶段和提示
const updateStageAndHint = () => {
  if (wheelCount.value >= HINT_SHOW_WHEELS && wheelCount.value < MAIN_SHOW_WHEELS) {
    showScrollHint.value = true
    scrollHintText.value = '继续下滑查看更多'
    currentStage.value = '显示提示'
  } else if (wheelCount.value >= MAIN_SHOW_WHEELS) {
    showScrollHint.value = false
    currentStage.value = 'Main内容显示'
    
    // 检查是否达到100%进度
    if (progress.value >= 1) {
      if (wheelCount.value >= MAIN_SHOW_WHEELS + RESTORE_WHEELS_AFTER_100) {
        wheelBlocked.value = false
        currentStage.value = '恢复正常滚动'
        console.log('✅ 100%后恢复正常滚动')
      }
    }
  } else {
    showScrollHint.value = false
    currentStage.value = '等待下滑'
  }
}

const updateVideoVolume = () => {
  if (!mediaVideos.value) return
  const currentVideo = mediaVideos.value[currentIndex.value]
  if (currentVideo && !currentVideo.paused) {
    currentVideo.volume = Math.max(0, 1 - progress.value)
  }
}

const wrapperStyle = computed(() => {
  const scale = slidesScale.value
  const translateY = progress.value * 300
  const opacity = slidesOpacity.value
  
  return {
    transform: `scale(${scale}) translateY(${translateY}px)`,
    opacity: `${opacity}`,
    transition: progress.value > 0 ? 'transform 0.1s ease-out' : 'none',
  }
})

const mainContentStyle = computed(() => {
  const scale = mainScale.value
  const opacity = mainOpacity.value
  
  return {
    transform: `scale(${scale})`,
    opacity: `${opacity}`,
    pointerEvents: mainContentVisible.value ? 'auto' : 'none' as 'auto' | 'none',
    transition: 'all 0.3s ease-out',
  }
})

// 调试器功能
const resetProgress = () => {
  progress.value = 0
  wheelCount.value = 0
  wheelBlocked.value = false
  showScrollHint.value = false
  currentStage.value = '已重置'
  console.log('🔄 进度已重置')
}

const simulateProgress = (targetProgress: number) => {
  progress.value = targetProgress
  console.log('🎯 模拟进度:', targetProgress)
}

// 键盘快捷键
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'D' || event.key === 'd') {
    showDebugger.value = !showDebugger.value
    console.log('🔧 调试器:', showDebugger.value ? '已开启' : '已关闭')
  }
}

onMounted(() => {
  startAuto()
  updateProgress()
  nextTick(() => {
    mediaVideos.value?.forEach(v => {
      v.addEventListener('enterpictureinpicture', handleEnterPiP)
      v.addEventListener('leavepictureinpicture', handleLeavePiP)
      v.addEventListener('play', handleVideoPlay)
      v.addEventListener('pause', handleVideoPause)
      v.addEventListener('ended', handleVideoEnded)
    })
  })
  
  // 添加事件监听器
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('keydown', handleKeyDown)
  
  // 显示调试器提示
  console.log('🔧 按 D 键切换滚轮调试器')
})

onUnmounted(() => {
  stopAuto()
  mediaVideos.value?.forEach(v => {
    v.removeEventListener('enterpictureinpicture', handleEnterPiP)
    v.removeEventListener('leavepictureinpicture', handleLeavePiP)
    v.removeEventListener('play', handleVideoPlay)
    v.removeEventListener('pause', handleVideoPause)
    v.removeEventListener('ended', handleVideoEnded)
  })
  
  // 移除事件监听器
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.latest-updates {
  @apply relative;
}
.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 dark:bg-neutral-700/50 backdrop-blur-xl rounded-full p-3 md:p-4 transition shadow-lg;
}
.indicator {
  @apply ring-1 ring-white/70;
}
button:focus {
  outline: none;
}
.nav-btn{ pointer-events:auto; }
.slide video{ pointer-events:auto; }

/* 主内容容器样式 */
.main-content-container {
  transform-origin: center center;
}

/* 滚动提示动画 */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-8px,0);
  }
  70% {
    transform: translate3d(0,-4px,0);
  }
  90% {
    transform: translate3d(0,-2px,0);
  }
}
</style> 