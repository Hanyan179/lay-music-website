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
  // 更新新视频的音量
  nextTick(() => updateVideoVolume())
}
const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
  pauseOthers()
  // 更新新视频的音量
  nextTick(() => updateVideoVolume())
}
const go = (idx: number) => {
  currentIndex.value = idx
  pauseOthers()
  // 更新新视频的音量
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
  updateVideoVolume() // 播放时设置正确音量
}
const handleVideoPause = () => startAuto()
const handleVideoEnded = () => startAuto()

/* 滚动缩放逻辑 */
const sectionRef = ref<HTMLElement | null>(null)
const progress = ref(0) // 0~1

const updateProgress = () => {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const sectionHeight = window.innerHeight
  
  // 计算组件离开视口的进度
  // 当组件完全在视口内时 progress = 0
  // 当组件顶部开始离开视口时 progress 开始增加
  // 当组件完全离开视口时 progress = 1
  let scrollProgress = 0
  
  if (rect.top < 0) {
    // 组件开始向上滚出视口
    const scrollDistance = Math.abs(rect.top)
    const maxScroll = sectionHeight * 0.8 // 滚动80%视口高度时完全消失
    scrollProgress = Math.min(1, scrollDistance / maxScroll)
  }
  
  progress.value = scrollProgress
  
  // 通知父组件滚动进度，用于控制下一页面的透明度
  if (props.onScrollProgress) {
    props.onScrollProgress(scrollProgress)
  }
  
  // 更新当前播放视频的音量
  updateVideoVolume()
}

const updateVideoVolume = () => {
  if (!mediaVideos.value) return
  const currentVideo = mediaVideos.value[currentIndex.value]
  if (currentVideo && !currentVideo.paused) {
    // 音量从 1 逐渐减小到 0
    currentVideo.volume = Math.max(0, 1 - progress.value)
  }
}

const wrapperStyle = computed(() => {
  // 缩放：从 1 缩小到 0.2
  const scale = Math.max(0.2, 1 - progress.value * 0.8)
  // 下降：随着进度增加向下移动
  const translateY = progress.value * 300
  // 透明度：从 1 渐变到 0
  const opacity = Math.max(0, 1 - progress.value)
  
  return {
    transform: `scale(${scale}) translateY(${translateY}px)`,
    opacity: `${opacity}`,
    transition: progress.value > 0 ? 'transform 0.1s ease-out' : 'none', // 添加过渡效果
  }
})

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
  window.addEventListener('scroll', updateProgress, { passive: true })
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
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.latest-updates {
  /* 移除 padding，让组件在初始状态完全显示 */
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
</style> 