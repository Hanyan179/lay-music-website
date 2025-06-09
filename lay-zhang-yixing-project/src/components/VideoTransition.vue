<!--
 * @file src/components/VideoTransition.vue
 * MP4 转场过渡组件 - 无缝播放转场视频
 -->

<template>
  <div 
    v-if="isVisible"
    class="video-transition-overlay"
    :class="{ 
      'fade-in': fadeIn, 
      'fade-out': fadeOut,
      'transition-stage': isInTransitionStage 
    }"
  >
    <!-- 视频元素 -->
    <video
      ref="videoRef"
      class="transition-video"
      :class="{ 'video-ending': isVideoEnding }"
      :src="videoSrc"
      autoplay
      muted
      playsinline
      preload="auto"
      @ended="onVideoEnded"
      @canplay="onVideoCanPlay"
      @error="onVideoError"
      @loadstart="onVideoLoadStart"
    ></video>
    
    <!-- 过渡动画层 -->
    <div 
      v-if="isInTransitionStage" 
      class="transition-animation-layer"
    >
      <!-- 粒子效果 -->
      <div class="particles-container">
        <div 
          v-for="particle in particles" 
          :key="particle.id"
          class="particle"
          :style="{
            left: particle.x + '%',
            top: particle.y + '%',
            animationDelay: particle.delay + 's',
            animationDuration: particle.duration + 's'
          }"
        ></div>
      </div>
      
      <!-- 光线效果 -->
      <div class="light-rays">
        <div class="ray ray-1"></div>
        <div class="ray ray-2"></div>
        <div class="ray ray-3"></div>
        <div class="ray ray-4"></div>
      </div>
      
      <!-- 中心扩散效果 -->
      <div class="center-ripple">
        <div class="ripple ripple-1"></div>
        <div class="ripple ripple-2"></div>
        <div class="ripple ripple-3"></div>
      </div>
      
      <!-- 过渡文字（可选） -->
      <div class="transition-text">
        <div class="text-particle">进</div>
        <div class="text-particle">入</div>
        <div class="text-particle">音</div>
        <div class="text-particle">乐</div>
        <div class="text-particle">世</div>
        <div class="text-particle">界</div>
      </div>
    </div>
    
    <!-- 加载指示器 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="loading-text">正在加载转场动画...</div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="hasError" class="error-overlay">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <div class="error-message">转场视频加载失败</div>
        <button class="retry-btn" @click="handleDirectTransition">
          直接跳转
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// Props
interface Props {
  videoSrc: string
  targetRoute: string
  autoStart?: boolean
  transitionDuration?: number // 过渡动画持续时间
}

const props = withDefaults(defineProps<Props>(), {
  autoStart: true,
  transitionDuration: 2500 // 默认2.5秒过渡动画
})

// Emits
const emit = defineEmits<{
  started: []
  ended: []
  error: [error: Event]
  videoEnded: []
  transitionStarted: []
}>()

// Router
const router = useRouter()

// Refs
const videoRef = ref<HTMLVideoElement>()

// State
const isVisible = ref(false)
const isLoading = ref(true)
const hasError = ref(false)
const fadeIn = ref(false)
const fadeOut = ref(false)
const isTransitioning = ref(false)
const isVideoEnding = ref(false)
const isInTransitionStage = ref(false)

// 粒子数据
const particles = ref<Array<{
  id: number
  x: number
  y: number
  delay: number
  duration: number
}>>([])

// 生成粒子
const generateParticles = () => {
  const particleCount = 50
  const newParticles = []
  
  for (let i = 0; i < particleCount; i++) {
    newParticles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 2
    })
  }
  
  particles.value = newParticles
}

// 启动转场
const startTransition = async () => {
  if (isTransitioning.value) return
  
  console.log('🎬 启动视频转场:', props.videoSrc)
  isTransitioning.value = true
  isVisible.value = true
  isLoading.value = true
  hasError.value = false
  
  await nextTick()
  
  // 淡入效果
  setTimeout(() => {
    fadeIn.value = true
  }, 50)
  
  emit('started')
}

// 视频可以播放时
const onVideoCanPlay = () => {
  console.log('✅ 视频可以播放')
  isLoading.value = false
  
  // 确保视频自动播放
  if (videoRef.value) {
    videoRef.value.play().catch(error => {
      console.error('❌ 视频播放失败:', error)
      handleVideoPlayError()
    })
  }
}

// 视频开始加载
const onVideoLoadStart = () => {
  console.log('⏳ 视频开始加载')
  isLoading.value = true
}

// 视频播放结束
const onVideoEnded = () => {
  console.log('🎯 视频播放结束，开始过渡动画')
  
  isVideoEnding.value = true
  emit('videoEnded')
  
  // 开始过渡动画阶段
  setTimeout(() => {
    startTransitionAnimation()
  }, 300) // 给视频淡出一点时间
}

// 开始过渡动画
const startTransitionAnimation = () => {
  console.log('✨ 开始过渡动画阶段')
  
  isInTransitionStage.value = true
  generateParticles()
  emit('transitionStarted')
  
  // 过渡动画完成后跳转
  setTimeout(() => {
    completeTransition()
  }, props.transitionDuration)
}

// 视频错误处理
const onVideoError = (event: Event) => {
  console.error('❌ 视频加载/播放错误:', event)
  hasError.value = true
  isLoading.value = false
  emit('error', event)
}

// 视频播放错误处理
const handleVideoPlayError = () => {
  hasError.value = true
  isLoading.value = false
}

// 完成转场
const completeTransition = () => {
  console.log('🚀 转场完成，跳转到:', props.targetRoute)
  
  // 最终淡出效果
  fadeOut.value = true
  
  setTimeout(() => {
    // 跳转路由
    router.push(props.targetRoute).then(() => {
      // 清理状态
      resetState()
      emit('ended')
    }).catch(error => {
      console.error('❌ 路由跳转失败:', error)
      resetState()
    })
  }, 500) // 给最终淡出动画时间
}

// 直接转场（无视频）
const handleDirectTransition = () => {
  console.log('⚡ 直接转场到:', props.targetRoute)
  
  fadeOut.value = true
  
  setTimeout(() => {
    completeTransition()
  }, 300)
}

// 重置状态
const resetState = () => {
  isVisible.value = false
  isLoading.value = true
  hasError.value = false
  fadeIn.value = false
  fadeOut.value = false
  isTransitioning.value = false
  isVideoEnding.value = false
  isInTransitionStage.value = false
  particles.value = []
}

// 停止转场
const stopTransition = () => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
  resetState()
}

// 预加载视频
const preloadVideo = () => {
  if (videoRef.value) {
    videoRef.value.load()
  }
}

// 组件挂载
onMounted(() => {
  if (props.autoStart) {
    // 延迟启动，确保组件完全渲染
    setTimeout(() => {
      startTransition()
    }, 100)
  }
})

// 组件卸载
onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.src = ''
  }
})

// 暴露方法给父组件
defineExpose({
  startTransition,
  stopTransition,
  preloadVideo,
  resetState
})
</script>

<style scoped>
.video-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.video-transition-overlay.fade-in {
  opacity: 1;
}

.video-transition-overlay.fade-out {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.video-transition-overlay.transition-stage {
  background: radial-gradient(circle at center, #0a0a0a 0%, #000 70%);
}

.transition-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background: #000;
  transition: opacity 0.3s ease-out;
}

.transition-video.video-ending {
  opacity: 0;
}

/* 过渡动画层 */
.transition-animation-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

/* 粒子效果 */
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: linear-gradient(45deg, #64B5F6, #8B5CF6, #EC4899);
  border-radius: 50%;
  animation: particleFloat infinite ease-in-out;
  opacity: 0;
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translateY(100vh) scale(0);
  }
  20% {
    opacity: 1;
    transform: translateY(80vh) scale(1);
  }
  80% {
    opacity: 1;
    transform: translateY(20vh) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-10vh) scale(0);
  }
}

/* 光线效果 */
.light-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 100vh;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(100, 181, 246, 0.8) 45%, 
    rgba(139, 92, 246, 0.9) 50%, 
    rgba(236, 72, 153, 0.8) 55%, 
    transparent 100%);
  transform-origin: center top;
  animation: rayRotate 3s linear infinite;
  opacity: 0;
  animation-fill-mode: forwards;
}

.ray-1 {
  transform: translate(-50%, -50%) rotate(0deg);
  animation-delay: 0s;
}

.ray-2 {
  transform: translate(-50%, -50%) rotate(45deg);
  animation-delay: 0.2s;
}

.ray-3 {
  transform: translate(-50%, -50%) rotate(90deg);
  animation-delay: 0.4s;
}

.ray-4 {
  transform: translate(-50%, -50%) rotate(135deg);
  animation-delay: 0.6s;
}

@keyframes rayRotate {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) scale(0);
  }
  20% {
    opacity: 0.8;
    transform: translate(-50%, -50%) rotate(calc(var(--rotation, 0deg) + 90deg)) scale(1);
  }
  80% {
    opacity: 0.6;
    transform: translate(-50%, -50%) rotate(calc(var(--rotation, 0deg) + 270deg)) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(calc(var(--rotation, 0deg) + 360deg)) scale(0);
  }
}

/* 中心扩散效果 */
.center-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(100, 181, 246, 0.6);
  border-radius: 50%;
  animation: rippleExpand 2s ease-out infinite;
}

.ripple-1 {
  animation-delay: 0s;
}

.ripple-2 {
  animation-delay: 0.7s;
}

.ripple-3 {
  animation-delay: 1.4s;
}

@keyframes rippleExpand {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}

/* 过渡文字效果 */
.transition-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 20px;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 20px rgba(100, 181, 246, 0.8);
}

.text-particle {
  opacity: 0;
  transform: translateY(50px) scale(0);
  animation: textParticleAppear 0.8s ease-out forwards;
}

.text-particle:nth-child(1) { animation-delay: 0.2s; }
.text-particle:nth-child(2) { animation-delay: 0.4s; }
.text-particle:nth-child(3) { animation-delay: 0.6s; }
.text-particle:nth-child(4) { animation-delay: 0.8s; }
.text-particle:nth-child(5) { animation-delay: 1.0s; }
.text-particle:nth-child(6) { animation-delay: 1.2s; }

@keyframes textParticleAppear {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0) rotate(180deg);
  }
  50% {
    opacity: 1;
    transform: translateY(0) scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 0.8;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

/* 加载覆盖层 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner-ring {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  opacity: 0.9;
}

/* 错误覆盖层 */
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  padding: 2rem;
}

.error-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.error-message {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.9;
}

.retry-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.retry-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-text {
    font-size: 1rem;
  }
  
  .error-message {
    font-size: 1.1rem;
  }
  
  .retry-btn {
    font-size: 0.9rem;
    padding: 0.6rem 1.5rem;
  }
  
  .transition-text {
    font-size: 1.5rem;
    gap: 15px;
  }
  
  .particle {
    width: 2px;
    height: 2px;
  }
  
  .ray {
    width: 1px;
  }
}

/* 确保视频在各种设备上正确显示 */
@media (orientation: portrait) {
  .transition-video {
    object-fit: cover;
  }
}

@media (orientation: landscape) {
  .transition-video {
    object-fit: cover;
  }
}

/* 防止选择和右键菜单 */
.video-transition-overlay {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.transition-video {
  pointer-events: none;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .loading-overlay {
    background: rgba(0, 0, 0, 0.95);
  }
  
  .error-overlay {
    background: rgba(0, 0, 0, 0.98);
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .video-transition-overlay {
    transition: none;
  }
  
  .spinner-ring,
  .particle,
  .ray,
  .ripple,
  .text-particle {
    animation: none;
  }
  
  .retry-btn {
    transition: none;
  }
  
  .transition-text {
    opacity: 1;
  }
  
  .text-particle {
    opacity: 0.8;
    transform: none;
  }
}
</style> 