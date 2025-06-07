<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
    <!-- Glass Card Container -->
    <div class="max-w-lg mx-auto p-8 mb-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <h1 class="text-4xl font-bold text-white text-center mb-6">艺术家之旅</h1>
      
      <!-- Lottie Animation Container -->
      <div 
        ref="lottieContainer" 
        class="w-64 h-64 mx-auto mb-6 cursor-pointer"
        @mouseover="playAnimation"
        @mouseleave="pauseAnimation"
        @click="handleClick"
      ></div>
      
      <!-- Status Display -->
      <div class="text-center text-white/80 space-y-2">
        <p class="text-lg">欢迎来到张艺兴的音乐世界</p>
        <div class="text-sm space-y-1">
          <p>悬停次数: {{ hoverCount }}</p>
          <p>点击次数: {{ clickCount }}</p>
          <p>动画状态: {{ animationStatus }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import lottie from 'lottie-web'

export default {
  name: 'ArtistJourney',
  setup() {
    const lottieContainer = ref(null)
    let animationInstance = null
    const hoverCount = ref(0)
    const clickCount = ref(0)
    const animationStatus = ref('未加载')

    const loadAnimation = () => {
      if (!lottieContainer.value) return

      try {
        animationInstance = lottie.loadAnimation({
          container: lottieContainer.value,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          path: '/lottie/Animation - 1749135116565(1).json'
        })

        animationInstance.addEventListener('DOMLoaded', () => {
          animationStatus.value = '已加载'
          console.log('Lottie animation loaded successfully')
        })

        animationInstance.addEventListener('error', (error) => {
          animationStatus.value = '加载错误'
          console.error('Lottie animation error:', error)
        })

      } catch (error) {
        animationStatus.value = '初始化错误'
        console.error('Failed to initialize lottie animation:', error)
      }
    }

    const playAnimation = () => {
      if (animationInstance) {
        hoverCount.value++
        animationInstance.play()
        animationStatus.value = '播放中'
        console.log('Animation playing, hover count:', hoverCount.value)
      }
    }

    const pauseAnimation = () => {
      if (animationInstance) {
        animationInstance.pause()
        animationStatus.value = '已暂停'
        console.log('Animation paused')
      }
    }

    const handleClick = () => {
      clickCount.value++
      console.log('Click count:', clickCount.value)
    }

    onMounted(() => {
      console.log('ArtistJourney component mounted')
      loadAnimation()
    })

    onUnmounted(() => {
      if (animationInstance) {
        animationInstance.destroy()
        animationInstance = null
      }
    })

    return {
      lottieContainer,
      hoverCount,
      clickCount,
      animationStatus,
      playAnimation,
      pauseAnimation,
      handleClick
    }
  }
}
</script>

<style scoped>
/* 额外的样式增强 */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
</style> 