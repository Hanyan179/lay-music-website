<template>
  <div class="home">
    <h1 style="color: red; font-size: 32px; text-align: center; margin-top: 50px;">
      张艺兴音乐网站测试页面
    </h1>
    <p style="text-align: center; font-size: 18px; margin: 20px;">
      如果您看到这段文字，说明Vue应用正在正常运行
    </p>
    
    <!-- 导航栏 -->
    <nav style="background-color: black; color: white; padding: 20px; text-align: center;">
      <div style="font-size: 24px; font-weight: bold;">张艺兴 LAY</div>
      <div style="margin-top: 10px;">
        <router-link to="/" style="color: yellow; margin-right: 20px; text-decoration: none;">首页</router-link>
        <router-link to="/artist-journey" style="color: yellow; text-decoration: none;">音乐时光</router-link>
      </div>
    </nav>

    <!-- 主视觉区域 -->
    <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 500px; display: flex; align-items: center; justify-content: center; color: white; text-align: center;">
      <div>
        <h1 style="font-size: 64px; font-weight: bold; margin-bottom: 20px; animation: pulse 2s infinite;">张艺兴</h1>
        <p style="font-size: 24px; margin-bottom: 20px; opacity: 0.9;">LAY Music Journey</p>
        <p style="font-size: 18px; margin-bottom: 40px; opacity: 0.8; max-width: 600px;">
          探索音乐的无限可能，感受每一个音符背后的故事与情感
        </p>
        <router-link 
          to="/artist-journey" 
          style="display: inline-block; background-color: #f59e0b; color: black; font-weight: bold; padding: 16px 32px; border-radius: 50px; text-decoration: none; transition: transform 0.3s;"
          @mouseover="$event.target.style.transform = 'scale(1.05)'"
          @mouseout="$event.target.style.transform = 'scale(1)'"
        >
          开始音乐之旅
        </router-link>
      </div>
    </section>

    <!-- 玻璃卡片区域 -->
    <section style="padding: 80px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 400px; display: flex; align-items: center; justify-content: center;">
      <div 
        ref="glassCard"
        class="glass-card"
        style="max-width: 32rem; margin: 0 auto; padding: 2rem; margin-bottom: 3rem; cursor: pointer; transition: all 0.3s ease;"
        @click="triggerCardClick"
        @mouseover="onCardHover"
        @mouseout="onCardLeave"
      >
        <div style="text-align: center;">
          <div ref="lottieContainer" style="width: 200px; height: 200px; margin: 0 auto 20px; border: 2px solid rgba(255,255,255,0.2); border-radius: 10px;"></div>
          <h3 style="font-size: 24px; font-weight: bold; color: white; margin-bottom: 16px;">🎵 音乐魔法</h3>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.6;">
            悬浮在卡片上感受音乐的力量。动画会在您悬浮时播放，离开时暂停。
          </p>
          <div style="margin-top: 20px; font-size: 14px; color: rgba(255,255,255,0.7);">
            💫 悬浮次数 {{ hoverCount }} 次 | 点击次数 {{ clickCount }} 次
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.6);">
            动画状态: {{ animationStatus }}
          </div>
        </div>
      </div>
    </section>

    <!-- 特色介绍区域 -->
    <section style="padding: 80px 20px; background-color: #f9fafb;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 60px; color: #374151;">音乐世界</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 30px;">
              🎵
            </div>
            <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">音乐创作</h3>
            <p style="color: #6b7280;">原创音乐作品，展现独特的音乐风格与创作理念</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 30px;">
              🎬
            </div>
            <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">视觉呈现</h3>
            <p style="color: #6b7280;">精美的MV制作，用视觉语言诠释音乐的深层含义</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 30px;">
              ⏰
            </div>
            <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">时光轴</h3>
            <p style="color: #6b7280;">记录音乐历程的每一个重要时刻与里程碑</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer style="background-color: black; color: white; padding: 48px 20px; text-align: center;">
      <p style="color: #9ca3af;">&copy; 2024 张艺兴音乐工作室. All rights reserved.</p>
    </footer>

    <!-- 底部浮动导航菜单 -->
    <div class="menu-float__wrapper fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
      <div class="menu-float__container">
        <!-- 主导航区域 -->
        <div class="menu-float__layout menu-float__layout--primary">
          <div class="menu-float__content">
            <!-- Logo -->
            <router-link to="/" class="menu-float__logo" aria-label="LAY 张艺兴首页">
              <div class="logo-container">
                <span class="logo-text">LAY</span>
                <div class="logo-subtitle">张艺兴</div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- 导航菜单区域 -->
        <div class="menu-float__layout menu-float__layout--secondary">
          <div class="menu-float__content">
            <!-- 进度条 -->
            <div class="menu-float__progress">
              <div class="menu-float__bar" :style="{ width: scrollProgress + '%' }"></div>
            </div>
            <!-- 导航链接 -->
            <ul class="menu-float__nav">
              <li><router-link class="menu-float__item" to="/">首页</router-link></li>
              <li><router-link class="menu-float__item" to="/artist-journey">音乐时光</router-link></li>
              <li><a class="menu-float__item" href="#timeline" @click="scrollToSection('timeline')">时间轴</a></li>
              <li><a class="menu-float__item" href="#music" @click="scrollToSection('music')">音乐作品</a></li>
            </ul>
          </div>
        </div>

        <!-- 行动按钮区域 -->
        <div class="menu-float__layout menu-float__layout--tertiary">
          <div class="menu-float__content">
            <a 
              href="https://music.163.com/#/search/m/?s=%E5%BC%A0%E8%89%BA%E5%85%B4&type=1" 
              target="_blank" 
              rel="noopener noreferrer"
              class="menu-float__button"
            >
              <span>网易云音乐</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import lottie from 'lottie-web'

const glassCard = ref(null)
const lottieContainer = ref(null)
const clickCount = ref(0)
const hoverCount = ref(0)
const animationStatus = ref('初始化中...')
const scrollProgress = ref(0)
let lottieAnimation = null

onMounted(() => {
  console.log('张艺兴首页加载完成 - 测试版本')
  console.log('Vue组件已成功挂载')
  
  // 延迟初始化Lottie动画，确保DOM已完全渲染
  setTimeout(() => {
    initLottieAnimation()
  }, 100)
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化进度条
})

onUnmounted(() => {
  // 清理滚动监听
  window.removeEventListener('scroll', handleScroll)
})

const initLottieAnimation = () => {
  if (lottieContainer.value) {
    try {
      console.log('开始初始化Lottie动画...')
      console.log('容器元素:', lottieContainer.value)
      
      lottieAnimation = lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg',
        loop: true,
        autoplay: false, // 改为不自动播放
        path: '/lottie/Animation - 1749135116565(1).json'
      })
      
      lottieAnimation.addEventListener('complete', () => {
        console.log('Lottie动画播放完成')
        animationStatus.value = '播放完成'
      })
      
      lottieAnimation.addEventListener('loopComplete', () => {
        console.log('Lottie动画循环完成')
        animationStatus.value = '循环播放中'
      })
      
      lottieAnimation.addEventListener('data_ready', () => {
        console.log('Lottie动画数据加载完成')
        animationStatus.value = '已加载，等待悬浮'
      })
      
      lottieAnimation.addEventListener('data_failed', () => {
        console.error('Lottie动画数据加载失败')
        animationStatus.value = '加载失败'
      })
      
      console.log('Lottie动画初始化完成')
      
    } catch (error) {
      console.error('Lottie动画初始化错误:', error)
      animationStatus.value = '初始化失败'
    }
  } else {
    console.error('Lottie容器未找到')
    animationStatus.value = '容器未找到'
  }
}

const triggerCardClick = () => {
  clickCount.value++
  console.log('卡片被点击，点击次数:', clickCount.value)
  
  // 触发卡片浮动效果
  if (glassCard.value) {
    glassCard.value.style.transform = 'translateY(-20px) scale(1.05)'
    glassCard.value.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    
    setTimeout(() => {
      glassCard.value.style.transform = 'translateY(0) scale(1)'
      glassCard.value.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }, 300)
  }
}

const onCardHover = () => {
  hoverCount.value++
  console.log('鼠标悬浮在卡片上，悬浮次数:', hoverCount.value)
  
  // 卡片悬浮效果
  if (glassCard.value) {
    glassCard.value.style.transform = 'translateY(-5px)'
    glassCard.value.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
  }
  
  // 播放Lottie动画
  if (lottieAnimation) {
    console.log('开始播放Lottie动画')
    lottieAnimation.play()
    animationStatus.value = '播放中'
  } else {
    console.log('Lottie动画未初始化')
    animationStatus.value = '动画未初始化'
  }
}

const onCardLeave = () => {
  console.log('鼠标离开卡片')
  
  // 卡片恢复效果
  if (glassCard.value) {
    glassCard.value.style.transform = 'translateY(0)'
    glassCard.value.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
  
  // 暂停Lottie动画
  if (lottieAnimation) {
    console.log('暂停Lottie动画')
    lottieAnimation.pause()
    animationStatus.value = '已暂停'
  }
}

// 滚动进度处理
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = (scrollTop / docHeight) * 100
  scrollProgress.value = Math.min(100, Math.max(0, progress))
}

// 平滑滚动到指定区域
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  } else {
    // 如果当前页面没有该section，导航到对应页面
    if (sectionId === 'timeline' || sectionId === 'music') {
      window.location.href = `/artist-journey#${sectionId}`
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 底部浮动菜单样式 */
.menu-float__wrapper {
  animation: slideUp 0.8s ease-out;
}

.menu-float__container {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 50px;
  padding: 8px 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.menu-float__container:hover {
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.menu-float__layout {
  display: flex;
  align-items: center;
}

.menu-float__layout--primary {
  margin-right: 16px;
}

.menu-float__layout--secondary {
  flex: 1;
  margin-right: 16px;
}

.menu-float__layout--tertiary {
  margin-left: 8px;
}

.menu-float__content {
  display: flex;
  align-items: center;
  width: 100%;
}

/* Logo 样式 */
.menu-float__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.menu-float__logo:hover {
  transform: scale(1.05);
}

.logo-container {
  text-align: center;
  padding: 8px 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  line-height: 1;
}

.logo-subtitle {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
  line-height: 1;
}

/* 进度条 */
.menu-float__progress {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
  margin-right: 16px;
  overflow: hidden;
}

.menu-float__bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
  border-radius: 1px;
}

/* 导航菜单 */
.menu-float__nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.menu-float__item {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.menu-float__item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.menu-float__item.router-link-active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 行动按钮 */
.menu-float__button {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.menu-float__button:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* SVG 图标样式 */
.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.ml-1 {
  margin-left: 0.25rem;
}

/* 动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .menu-float__container {
    padding: 6px 8px;
    border-radius: 40px;
  }
  
  .menu-float__layout--primary {
    margin-right: 8px;
  }
  
  .menu-float__layout--secondary {
    margin-right: 8px;
  }
  
  .logo-container {
    padding: 6px 8px;
  }
  
  .logo-text {
    font-size: 16px;
  }
  
  .logo-subtitle {
    font-size: 9px;
  }
  
  .menu-float__progress {
    width: 40px;
    margin-right: 8px;
  }
  
  .menu-float__item {
    padding: 6px 8px;
    font-size: 13px;
  }
  
  .menu-float__button {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .menu-float__nav {
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .menu-float__nav {
    display: none;
  }
  
  .menu-float__progress {
    width: 30px;
  }
  
  .logo-subtitle {
    display: none;
  }
}
</style> 