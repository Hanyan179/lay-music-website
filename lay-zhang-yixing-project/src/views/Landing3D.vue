<template>
  <div class="landing-container">
    <Canvas3D/>
    
    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 标题区域 -->
      <div class="title-section">
        <h1 class="main-title" ref="titleRef">
          <span class="title-line">LAY</span>
          <span class="title-line">MUSIC</span>
          <span class="title-line">JOURNEY</span>
        </h1>
        <p class="subtitle">探索张艺兴的音乐世界，感受每一个音符背后的故事</p>
      </div>
      
      <!-- 按钮区域 -->
      <div class="action-section">
        <button 
          class="enter-btn"
          @click="enterJourney"
          @mouseenter="onButtonHover"
          @mouseleave="onButtonLeave"
        >
          <span class="btn-text">进入音乐时光</span>
          <div class="btn-bg"></div>
          <div class="btn-wave"></div>
        </button>
        
        <button 
          class="mute-btn"
          @click="toggleAudio"
          :class="{ 'muted': isMuted }"
        >
          <span class="btn-text">{{ isMuted ? '开启音效' : '静音体验' }}</span>
        </button>
      </div>
    </div>
    
    <!-- 装饰元素 -->
    <div class="decorative-elements">
      <div class="floating-text">
        <span class="year">2025</span>
      </div>
      <div class="corner-text">
        <span>向下滑动探索</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Canvas3D from '@/components/three/Canvas3D.vue'
import gsap from 'gsap'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const titleRef = ref<HTMLElement>()
const isMuted = ref(true)

onMounted(() => {
  // 页面加载动画
  const timeline = gsap.timeline()
  
  // 标题出现动画
  timeline.from('.title-line', {
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out"
  })
  
  // 副标题动画
  timeline.from('.subtitle', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.5")
  
  // 按钮动画
  timeline.from('.enter-btn, .mute-btn', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out"
  }, "-=0.3")
  
  // 装饰元素动画
  timeline.from('.decorative-elements', {
    opacity: 0,
    duration: 0.5
  }, "-=0.2")

  // 文字悬停效果
  setupTextHoverEffects()
})

function setupTextHoverEffects() {
  const titleLines = document.querySelectorAll('.title-line')
  
  titleLines.forEach(line => {
    line.addEventListener('mouseenter', () => {
      gsap.to(line, {
        color: '#64B5F6',
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
    })
    
    line.addEventListener('mouseleave', () => {
      gsap.to(line, {
        color: '#ffffff',
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })
}

function onButtonHover() {
  gsap.to('.btn-wave', {
    scale: 1.2,
    opacity: 0.8,
    duration: 0.3
  })
}

function onButtonLeave() {
  gsap.to('.btn-wave', {
    scale: 1,
    opacity: 0.3,
    duration: 0.3
  })
}

function enterJourney() {
  // 创建场景切换动画
  const timeline = gsap.timeline()
  
  // 按钮点击效果
  timeline.to('.enter-btn', {
    scale: 0.95,
    duration: 0.1
  })
  
  timeline.to('.enter-btn', {
    scale: 1,
    duration: 0.2
  })
  
  // 页面淡出动画
  timeline.to('.main-content', {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.in"
  }, "+=0.2")
  
  timeline.to('.decorative-elements', {
    opacity: 0,
    duration: 0.5
  }, "-=0.5")
  
  // 路由跳转
  timeline.call(() => {
    router.push('/timeline')
  })
}

function toggleAudio() {
  isMuted.value = !isMuted.value
  
  // 按钮状态动画
  gsap.to('.mute-btn', {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  })
}
</script>

<style scoped>
.landing-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
}

.main-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none;
}

.title-section {
  text-align: center;
  margin-bottom: 4rem;
}

.main-title {
  font-family: 'Arial', sans-serif;
  font-size: clamp(4rem, 8vw, 8rem);
  font-weight: 900;
  line-height: 0.9;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin: 0;
  overflow: hidden;
}

.title-line {
  display: block;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 30px rgba(100, 181, 246, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  max-width: 600px;
  line-height: 1.6;
}

.action-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  pointer-events: auto;
}

.enter-btn {
  position: relative;
  padding: 1.2rem 3rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
}

.enter-btn:hover {
  border-color: #64B5F6;
  box-shadow: 0 10px 30px rgba(100, 181, 246, 0.3);
  transform: translateY(-2px);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.2), transparent);
  transition: left 0.5s ease;
}

.enter-btn:hover .btn-bg {
  left: 100%;
}

.btn-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(100, 181, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.mute-btn {
  padding: 0.8rem 2rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.mute-btn:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.4);
}

.mute-btn.muted {
  color: #64B5F6;
  border-color: rgba(100, 181, 246, 0.4);
}

.decorative-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
  pointer-events: none;
}

.floating-text {
  position: absolute;
  top: 3rem;
  right: 3rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.2em;
}

.corner-text {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  animation: fadeInOut 3s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: clamp(3rem, 10vw, 6rem);
  }
  
  .subtitle {
    font-size: 1rem;
    padding: 0 2rem;
  }
  
  .floating-text {
    top: 2rem;
    right: 2rem;
    font-size: 0.9rem;
  }
  
  .corner-text {
    bottom: 2rem;
    font-size: 0.8rem;
  }
}

/* 加载动画 */
@keyframes shimmer {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

.title-line {
  animation: shimmer 2s ease-in-out infinite;
  animation-delay: calc(var(--line-index, 0) * 0.3s);
}
</style>
