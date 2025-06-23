<template>
  <section class="carousel relative w-full h-screen overflow-hidden text-white">
    <!-- Slides Wrapper -->
    <div
      class="slides flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] h-full"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="slide flex-shrink-0 w-full h-full relative"
      >
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
        <!-- Overlay & Caption -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none z-10"></div>
        <h2
          v-if="item.title"
          class="absolute bottom-20 left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-semibold drop-shadow-lg pointer-events-none z-20"
        >
          {{ item.title }}
        </h2>
      </div>
    </div>

    <!-- Navigation -->
    <button @click="prev" class="nav-btn left-4 md:left-8 z-30 cursor-pointer">
      <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button @click="next" class="nav-btn right-4 md:right-8 z-30 cursor-pointer">
      <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Indicators -->
    <div class="indicators absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-4 z-30">
      <button
        v-for="(item, idx) in items"
        :key="idx"
        @click="go(idx)"
        class="indicator w-3 h-3 rounded-full transition-all duration-300"
        :class="idx === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/40 hover:bg-white/70'"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface MediaItem {
  type: 'image' | 'video'
  src: string
  poster?: string
  title?: string
}

const props = defineProps<{ items: MediaItem[]; auto?: boolean }>()
const currentIndex = ref(0)
const timer = ref<number | null>(null)
const mediaVideos = ref<HTMLVideoElement[]>()

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length
  pauseOthers()
}
const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
  pauseOthers()
}
const go = (idx: number) => {
  currentIndex.value = idx
  pauseOthers()
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

onMounted(() => {
  startAuto()
  nextTick(() => {
    mediaVideos.value?.forEach(v => {
      v.addEventListener('enterpictureinpicture', handleEnterPiP)
      v.addEventListener('leavepictureinpicture', handleLeavePiP)
    })
  })
})
onUnmounted(() => {
  stopAuto()
  mediaVideos.value?.forEach(v => {
    v.removeEventListener('enterpictureinpicture', handleEnterPiP)
    v.removeEventListener('leavepictureinpicture', handleLeavePiP)
  })
})
</script>

<style scoped>
.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 dark:bg-neutral-700/50 backdrop-blur-xl rounded-full p-3 md:p-4 transition shadow-lg;
}
.indicator {
  @apply ring-1 ring-white/70;
}
button:focus {
  outline: none;
}
.slide.active img,
.slide.active video {
  @apply scale-105 transition-transform duration-700 ease-out;
}
.indicators {
  bottom: 2.5rem;
}
</style> 