<template>
  <div class="mobile-artist-journey" :class="`style-${currentStyle}`">
    <!-- Apple 风格移动端导航栏 -->
    <nav class="mobile-nav" :class="{ 'nav-scrolled': isScrolled }">
      <div class="nav-container">
        <!-- Logo 区域 -->
        <div class="brand-logo">
          <a href="/" class="logo-link">
            <img 
              src="/img/music/logo_transparent.png" 
              alt="LAY 张艺兴" 
              class="logo-image"
            />
          </a>
        </div>
        
        <!-- 导航链接区域 -->
        <div class="nav-links">
          <a href="#home" @click="scrollToSection('home')" class="nav-link">首页</a>
          <a href="#music" @click="scrollToSection('music')" class="nav-link">音乐</a>
          <a href="#videos" @click="scrollToSection('videos')" class="nav-link">视频</a>
          <a href="#timeline" @click="scrollToSection('timeline')" class="nav-link">时间轴</a>
        </div>
        
        <!-- 右侧操作区 -->
        <div class="nav-actions">
          <button @click="switchToPC" class="secondary-btn">切换PC版</button>
          <button @click="scrollToSection('timeline')" class="primary-btn">立即体验</button>
          <button @click="toggleMenu" class="menu-toggle" :class="{ 'menu-active': menuOpen }">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
      
      <!-- 移动端全屏菜单 -->
      <div class="mobile-menu-overlay" :class="{ 'menu-open': menuOpen }" @click="closeMenu">
        <div class="mobile-menu" :class="{ 'menu-open': menuOpen }" @click.stop>
          <div class="menu-header">
            <img src="/img/music/logo_transparent.png" alt="LAY 张艺兴" class="menu-logo" />
            <button @click="closeMenu" class="close-btn">
              <span class="close-icon">×</span>
            </button>
          </div>
          <nav class="menu-nav">
            <a href="#home" @click="scrollToSection('home')" class="menu-item">首页</a>
            <a href="#about" @click="scrollToSection('about')" class="menu-item">个人简介</a>
            <a href="#music" @click="scrollToSection('music')" class="menu-item">音乐</a>
            <a href="#videos" @click="scrollToSection('videos')" class="menu-item">视频</a>
            <a href="#timeline" @click="scrollToSection('timeline')" class="menu-item">时间轴</a>
          </nav>
          <div class="menu-actions">
            <button @click="openStyleModal" class="menu-style-btn">更改风格</button>
            <button @click="switchToPC" class="menu-secondary-btn">切换PC版</button>
            <button @click="scrollToSection('timeline')" class="menu-primary-btn">立即体验</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主页 Hero Section -->
    <section id="home" class="hero-section">
      <!-- 默认风格内容 -->
      <div class="hero-content default-style">
        <div class="artist-avatar">
          <img src="/artist-journey/assets/background.jpg" alt="LAY 张艺兴" />
          <div class="avatar-ring"></div>
        </div>
        
        <h1 class="hero-title">
          <span class="title-char">张</span>
          <span class="title-char">艺</span>
          <span class="title-char">兴</span>
        </h1>
        
        <div class="hero-subtitle">
          <span class="subtitle-word">音乐</span>
          <span class="subtitle-dot">·</span>
          <span class="subtitle-word">梦想</span>
          <span class="subtitle-dot">·</span>
          <span class="subtitle-word">永恒</span>
        </div>
        
        <p class="hero-intro">努力努力再努力！！！</p>
        
        <div class="hero-buttons">
          <button @click="scrollToSection('about')" class="about-btn">个人简介</button>
          <button @click="scrollToSection('timeline')" class="enter-btn">探索音乐之旅</button>
        </div>
        
        <div class="scroll-indicator">
          <div class="scroll-text">向下滑动探索更多</div>
          <div class="scroll-arrow">
            <span class="arrow-line"></span>
            <span class="arrow-point"></span>
          </div>
        </div>
      </div>

      <!-- LAY Zhang 风格 - 中国古典音乐之旅 -->
      <div class="chinese-musical-journey lay-zhang-style">
        <!-- 水墨背景 -->
        <div class="ink-wash-bg">
          <div class="mountain-silhouette"></div>
          <div class="floating-notes"></div>
          <canvas id="inkCanvas" class="ink-canvas"></canvas>
        </div>
        
        <!-- 太极主视觉 -->
        <div class="taiji-main-visual">
          <div class="taiji-container">
            <div class="taiji-symbol">
              <div class="taiji-half taiji-yin"></div>
              <div class="taiji-half taiji-yang"></div>
              <div class="taiji-dot taiji-yin-dot"></div>
              <div class="taiji-dot taiji-yang-dot"></div>
            </div>
            <div class="taiji-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
            </div>
          </div>
          
          <!-- 艺术家肖像 -->
          <div class="artist-portrait-container">
            <div class="portrait-frame">
              <div class="dragon-ornament dragon-left"></div>
              <div class="dragon-ornament dragon-right"></div>
              <img src="/artist-journey/assets/background.jpg" alt="张艺兴" class="artist-portrait" />
              <div class="portrait-glow"></div>
            </div>
          </div>
        </div>
        
        <!-- 书法风格标题 -->
        <div class="calligraphy-title">
          <div class="name-calligraphy">
            <span class="char-张">张</span>
            <span class="char-艺">艺</span>
            <span class="char-兴">兴</span>
          </div>
          <div class="title-seal">
            <div class="seal-border"></div>
            <div class="seal-text">LAY</div>
          </div>
        </div>
        
        <!-- 诗意描述 -->
        <div class="poetic-description">
          <div class="poem-line">「 音 律 如 流 水 」</div>
          <div class="poem-line">「 梦 想 载 青 云 」</div>
          <div class="poem-line">「 艺 海 无 涯 境 」</div>
        </div>
        
        <!-- 古典导航符号 -->
        <div class="classical-navigation">
          <div class="nav-ornament"></div>
          <button @click="scrollToSection('about')" class="classical-btn primary">
            <span class="btn-text">观其志</span>
            <div class="btn-decoration"></div>
          </button>
          <button @click="scrollToSection('music')" class="classical-btn secondary">
            <span class="btn-text">听其音</span>
            <div class="btn-decoration"></div>
          </button>
          <div class="nav-ornament"></div>
        </div>
        
        <!-- 垂直滚动提示 -->
        <div class="scroll-hint-chinese">
          <div class="hint-text">下滑赏音</div>
          <div class="scroll-symbol">
            <div class="symbol-line"></div>
            <div class="symbol-arrow">↓</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 个人简介区域 -->
    <section id="about" class="content-section about-section">
      <div class="section-container">
        <div class="about-content">
          <div class="about-header">
            <div class="name-display">
              <span class="name-char">张</span>
              <span class="name-char">艺</span>
              <span class="name-char">兴</span>
            </div>
          </div>
          
          <div class="about-intro-section">
            <div class="intro-content">
              <p class="intro-line primary">湖南长沙人，中国音乐制作人、歌手、舞者</p>
              <p class="intro-line secondary">致力于音乐创作与中华文化传承</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 音乐作品区域 -->
    <section id="music" class="content-section music-section">
      <div class="section-container">
        <!-- 默认风格 -->
        <div class="default-style">
          <h2 class="section-title">音乐作品</h2>
          <p class="section-description">探索张艺兴的音乐历程</p>
          
          <div class="works-grid">
            <div class="work-card" v-for="album in musicWorks" :key="album.id">
              <div class="work-image">
                <img :src="album.cover" :alt="album.title" />
              </div>
              <div class="work-info">
                <h3 class="work-title">{{ album.title }}</h3>
                <p class="work-year">{{ album.year }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- LAY Zhang风格 - 古典音乐殿堂 -->
        <div class="musical-palace lay-zhang-style">
          <div class="palace-header">
            <h2 class="palace-title">音乐殿堂</h2>
            <div class="classical-subtitle">「 声声入耳 · 韵韵动心 」</div>
          </div>
          
          <div class="classical-albums-container">
            <div class="album-scroll-view">
              <div class="album-classical-card" v-for="album in musicWorks" :key="album.id" @click="playAlbum(album)">
                <div class="album-cover-container">
                  <img :src="album.cover" :alt="album.title" class="classical-cover" />
                </div>
                <div class="album-classical-info">
                  <div class="album-year-classical">{{ album.year }}</div>
                  <h3 class="album-title-classical">{{ album.title }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 视频作品区域 -->
    <section id="videos" class="content-section videos-section">
      <div class="section-container">
        <!-- 默认风格 -->
        <div class="default-style">
          <h2 class="section-title">视频作品</h2>
          <p class="section-description">精彩的MV、舞台表演和幕后花絮</p>
          
          <div class="videos-grid">
            <div class="video-card" v-for="video in videoWorks" :key="video.id">
              <div class="video-thumbnail">
                <img :src="video.thumbnail" :alt="video.title" />
              </div>
              <div class="video-info">
                <h3 class="video-title">{{ video.title }}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <!-- LAY Zhang风格 - 影像画卷 -->
        <div class="video-gallery lay-zhang-style">
          <div class="gallery-header">
            <h2 class="gallery-title">影像画卷</h2>
            <div class="classical-subtitle">「 光影流转 · 情韵悠长 」</div>
          </div>
          
          <div class="classical-videos-container">
            <div class="video-scroll-container" v-for="(column, columnIndex) in videoColumns" :key="columnIndex">
              <div class="video-classical-item" v-for="video in column" :key="video.id" @click="playVideo(video)">
                <div class="scroll-frame">
                  <div class="scroll-content">
                    <div class="video-thumbnail-classical">
                      <img :src="video.thumbnail" :alt="video.title" class="classical-video-img" />
                    </div>
                    <div class="video-info-classical">
                      <h4 class="video-title-classical">{{ video.title }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 风格选择弹窗 -->
    <div class="style-modal-overlay" :class="{ 'modal-open': styleModalOpen }" @click="closeStyleModal">
      <div class="style-modal" :class="{ 'modal-open': styleModalOpen }" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">选择页面风格</h3>
          <button @click="closeStyleModal" class="modal-close-btn">
            <span class="close-icon">×</span>
          </button>
        </div>
        
        <div class="style-options">
          <div 
            class="style-option" 
            :class="{ 'active': currentStyle === 'minimalism' }"
            @click="changeStyle('minimalism')"
          >
            <div class="style-icon">⬜</div>
            <h4 class="style-option-name">Minimalism</h4>
            <div class="style-check" v-if="currentStyle === 'minimalism'">✓</div>
          </div>
          
          <div 
            class="style-option" 
            :class="{ 'active': currentStyle === 'lay-zhang' }"
            @click="changeStyle('lay-zhang')"
          >
            <div class="style-icon">
              <img src="/img/music/logo_transparent.png" alt="LAY" class="logo-icon" />
            </div>
            <h4 class="style-option-name">LAY Zhang</h4>
            <div class="style-check" v-if="currentStyle === 'lay-zhang'">✓</div>
          </div>
          
          <div 
            class="style-option" 
            :class="{ 'active': currentStyle === 'x-back' }"
            @click="changeStyle('x-back')"
          >
            <div class="style-icon">🐚</div>
            <h4 class="style-option-name">X-Back</h4>
            <div class="style-check" v-if="currentStyle === 'x-back'">✓</div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeStyleModal" class="modal-cancel-btn">取消</button>
          <button @click="applyStyle" class="modal-apply-btn">应用风格</button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="page-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="/img/music/logo_transparent.png" alt="LAY 张艺兴" />
        </div>
        <p class="footer-text">© 2024 张艺兴工作室. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { musicData, videoData } from '@/database'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const menuOpen = ref(false)
const isScrolled = ref(false)
const styleModalOpen = ref(false)
const currentStyle = ref<'minimalism' | 'lay-zhang' | 'x-back'>('minimalism')

// 从数据库获取音乐作品数据
const musicWorks = computed(() => {
  return musicData.slice(0, 4).map(album => ({
    id: album.id,
    title: album.albumTitle,
    year: album.year.toString(),
    cover: album.albumCover,
    description: album.description
  }))
})

// 从数据库获取视频作品数据
const videoWorks = computed(() => {
  return videoData.slice(0, 3).map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    duration: video.duration,
    views: video.views
  }))
})

// 视频瀑布流布局 - 分成两列
const videoColumns = computed(() => {
  const videos = videoWorks.value
  const columns: any[][] = [[], []]
  videos.forEach((video: any, index: number) => {
    columns[index % 2].push(video)
  })
  return columns
})

// 滚动监听
const handleScroll = () => {
  isScrolled.value = window.scrollY > 32
}

// 平滑滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
  closeMenu()
}

// 切换菜单
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    document.body.style.overflow = 'hidden'
    document.body.classList.add('menu-open')
  } else {
    document.body.style.overflow = ''
    document.body.classList.remove('menu-open')
  }
}

const closeMenu = () => {
  menuOpen.value = false
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open')
}

// 切换到PC版
const switchToPC = () => {
  router.push('/?forcePC=true')
}

// 风格切换相关函数
const openStyleModal = () => {
  styleModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeStyleModal = () => {
  styleModalOpen.value = false
  document.body.style.overflow = ''
}

const changeStyle = (style: 'minimalism' | 'lay-zhang' | 'x-back') => {
  currentStyle.value = style
}

const applyStyle = () => {
  document.documentElement.className = `style-${currentStyle.value}`
  
  if (currentStyle.value === 'lay-zhang') {
    setTimeout(() => {
      initChineseInkAnimation()
    }, 200)
  }
  
  closeStyleModal()
}

// 音乐播放函数
const playAlbum = (album: any) => {
  console.log('播放专辑:', album.title)
}

// 视频播放函数
const playVideo = (video: any) => {
  console.log('播放视频:', video.title)
}

// 中国水墨画动画
const initChineseInkAnimation = () => {
  const canvas = document.getElementById('inkCanvas') as HTMLCanvasElement
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const inkDrops: Array<{
    x: number
    y: number
    size: number
    opacity: number
    speed: number
  }> = []
  
  for (let i = 0; i < 10; i++) {
    inkDrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 10,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 2 + 1
    })
  }
  
  const animateInk = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    inkDrops.forEach(drop => {
      ctx.globalAlpha = drop.opacity
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath()
      ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2)
      ctx.fill()
      
      drop.y += drop.speed
      if (drop.y > canvas.height + drop.size) {
        drop.y = -drop.size
        drop.x = Math.random() * canvas.width
      }
    })
    
    requestAnimationFrame(animateInk)
  }
  
  animateInk()
}

// 组件挂载时的操作
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // 检测设备类型
  const userAgent = navigator.userAgent
  const isMobile = /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  if (isMobile) {
    document.body.classList.add('mobile-device')
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 清理样式
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open', 'mobile-device')
})
</script>

<style scoped>
/* 基础变量定义 */
:root {
  --primary-color: #000;
  --secondary-color: #666;
  --accent-color: #007AFF;
  --bg-color: #fff;
  --text-color: #000;
  --border-color: #e5e5e7;
  --transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* LAY Zhang 中国古典风格变量 */
.style-lay-zhang {
  --ink-black: #1a1a1a;
  --gold-accent: #d4af37;
  --ochre-color: #cc7722;
  --mountain-grey: #4a4a4a;
  --paper-white: #faf9f6;
  --classical-transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 全局容器 */
.mobile-artist-journey {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 移动端导航栏样式 */
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.nav-scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.brand-logo {
  flex-shrink: 0;
}

.logo-image {
  height: 32px;
  width: auto;
}

.nav-links {
  display: none;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.secondary-btn, .primary-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.secondary-btn {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.primary-btn {
  background: var(--accent-color);
  color: white;
}

.menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--text-color);
  margin: 2px 0;
  border-radius: 1px;
  transition: var(--transition);
}

.menu-active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.menu-active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 移动端菜单 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
}

.mobile-menu-overlay.menu-open {
  opacity: 1;
  visibility: visible;
}

.mobile-menu {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: white;
  transform: translateX(100%);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.mobile-menu.menu-open {
  transform: translateX(0);
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.menu-logo {
  height: 28px;
  width: auto;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  transition: var(--transition);
}

.close-icon {
  font-size: 24px;
  color: var(--text-color);
}

.menu-nav {
  flex: 1;
  padding: 20px 0;
}

.menu-item {
  display: block;
  padding: 16px 20px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: var(--transition);
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.menu-actions {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-style-btn, .menu-secondary-btn, .menu-primary-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.menu-style-btn {
  background: rgba(116, 116, 128, 0.08);
  color: var(--text-color);
}

.menu-secondary-btn {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.menu-primary-btn {
  background: var(--accent-color);
  color: white;
}

/* Hero Section 样式 */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 100px 20px 50px;
}

/* 默认风格Hero内容 */
.hero-content.default-style {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.artist-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}

.artist-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid var(--accent-color);
  border-radius: 50%;
  opacity: 0.6;
}

.hero-title {
  margin-bottom: 20px;
}

.title-char {
  display: inline-block;
  font-size: 48px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 8px;
  animation: fadeInUp 0.6s ease-out forwards;
}

.title-char:nth-child(1) { animation-delay: 0.1s; }
.title-char:nth-child(2) { animation-delay: 0.2s; }
.title-char:nth-child(3) { animation-delay: 0.3s; }

.hero-subtitle {
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out 0.5s forwards;
}

.subtitle-word {
  font-size: 18px;
  color: var(--secondary-color);
  font-weight: 500;
}

.subtitle-dot {
  margin: 0 10px;
  color: var(--accent-color);
}

.hero-intro {
  font-size: 16px;
  color: var(--secondary-color);
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out 0.7s forwards;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 60px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out 0.9s forwards;
}

.about-btn, .enter-btn {
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}

.about-btn {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.enter-btn {
  background: var(--accent-color);
  color: white;
}

.scroll-indicator {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out 1.1s forwards;
}

.scroll-text {
  font-size: 14px;
  color: var(--secondary-color);
  margin-bottom: 10px;
}

.scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.arrow-line {
  width: 1px;
  height: 20px;
  background: var(--secondary-color);
  margin-bottom: 5px;
}

.arrow-point {
  width: 8px;
  height: 8px;
  border-right: 1px solid var(--secondary-color);
  border-bottom: 1px solid var(--secondary-color);
  transform: rotate(45deg);
  animation: bounce 2s infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) rotate(45deg);
  }
  40% {
    transform: translateY(-10px) rotate(45deg);
  }
  60% {
    transform: translateY(-5px) rotate(45deg);
  }
}

/* 内容区域通用样式 */
.content-section {
  padding: 80px 20px;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  color: var(--text-color);
}

.section-description {
  font-size: 16px;
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: 50px;
}

/* 个人简介区域 */
.about-section {
  background: var(--bg-color);
}

.about-content {
  text-align: center;
}

.about-header {
  margin-bottom: 40px;
}

.name-display {
  margin-bottom: 20px;
}

.name-char {
  display: inline-block;
  font-size: 40px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 8px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.name-char:nth-child(1) { animation-delay: 0.1s; }
.name-char:nth-child(2) { animation-delay: 0.2s; }
.name-char:nth-child(3) { animation-delay: 0.3s; }

.about-intro-section {
  max-width: 600px;
  margin: 0 auto;
}

.intro-content {
  text-align: center;
}

.intro-line {
  margin-bottom: 12px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.intro-line.primary {
  font-size: 18px;
  color: var(--text-color);
  font-weight: 500;
  animation-delay: 0.5s;
}

.intro-line.secondary {
  font-size: 16px;
  color: var(--secondary-color);
  animation-delay: 0.7s;
}

/* 音乐作品区域 */
.music-section {
  background: #f8f9fa;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.work-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.work-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.work-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-info {
  padding: 20px;
}

.work-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

.work-year {
  font-size: 14px;
  color: var(--secondary-color);
  margin-bottom: 8px;
}

/* 视频作品区域 */
.videos-section {
  background: var(--bg-color);
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.video-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-info {
  padding: 20px;
}

.video-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

/* 风格切换弹窗 */
.style-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
}

.style-modal-overlay.modal-open {
  opacity: 1;
  visibility: visible;
}

.style-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: var(--transition);
}

.style-modal.modal-open {
  transform: scale(1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.modal-close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  transition: var(--transition);
}

.style-options {
  padding: 20px;
}

.style-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 12px;
  border: 2px solid transparent;
}

.style-option:hover {
  background: rgba(0, 0, 0, 0.05);
}

.style-option.active {
  border-color: var(--accent-color);
  background: rgba(0, 122, 255, 0.1);
}

.style-icon {
  width: 40px;
  height: 40px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.style-option-name {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.style-check {
  color: var(--accent-color);
  font-size: 18px;
  font-weight: 600;
}

.modal-actions {
  padding: 20px;
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--border-color);
}

.modal-cancel-btn, .modal-apply-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}

.modal-cancel-btn {
  background: rgba(116, 116, 128, 0.08);
  color: var(--text-color);
}

.modal-apply-btn {
  background: var(--accent-color);
  color: white;
}

/* 页脚 */
.page-footer {
  background: var(--text-color);
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  margin-bottom: 20px;
}

.footer-logo img {
  height: 40px;
  width: auto;
  filter: brightness(0) invert(1);
}

.footer-text {
  font-size: 14px;
  opacity: 0.8;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .nav-links {
    display: flex;
    gap: 24px;
  }
  
  .nav-link {
    color: var(--text-color);
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    transition: var(--transition);
  }
  
  .nav-link:hover {
    color: var(--accent-color);
  }
  
  .menu-toggle {
    display: none;
  }
  
  .hero-buttons {
    flex-direction: row;
  }
  
  .title-char {
    font-size: 64px;
  }
}

/* LAY Zhang 中国古典风格样式 */
.style-lay-zhang .default-style {
  display: none !important;
}

.style-lay-zhang .lay-zhang-style {
  display: block !important;
}

.lay-zhang-style {
  display: none;
}

/* 中国古典音乐之旅 Hero */
.chinese-musical-journey {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--paper-white) 0%, #f0f0f0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 50px;
  overflow: hidden;
}

/* 水墨背景 */
.ink-wash-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.mountain-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200"><path d="M0,200 L0,100 Q300,20 600,80 Q900,140 1200,60 L1200,200 Z" fill="%23000" opacity="0.1"/></svg>') bottom center/cover no-repeat;
}

.floating-notes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="10" y="30" font-family="serif" font-size="16" fill="%23000" opacity="0.1">♪</text><text x="70" y="60" font-family="serif" font-size="12" fill="%23000" opacity="0.08">♫</text><text x="30" y="80" font-family="serif" font-size="14" fill="%23000" opacity="0.06">♪</text></svg>') repeat;
  animation: float 20s infinite linear;
}

.ink-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
}

/* 太极主视觉 */
.taiji-main-visual {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.taiji-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
}

.taiji-symbol {
  width: 120px;
  height: 120px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
  animation: rotate 20s infinite linear;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
}

.taiji-half {
  position: absolute;
  width: 60px;
  height: 120px;
}

.taiji-yin {
  left: 0;
  background: var(--ink-black);
  border-radius: 60px 0 0 60px;
}

.taiji-yin::before {
  content: '';
  position: absolute;
  top: 0;
  right: -30px;
  width: 60px;
  height: 60px;
  background: var(--ink-black);
  border-radius: 50%;
}

.taiji-yin::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: -30px;
  width: 60px;
  height: 60px;
  background: var(--paper-white);
  border-radius: 50%;
}

.taiji-yang {
  right: 0;
  background: var(--paper-white);
  border-radius: 0 60px 60px 0;
}

.taiji-dot {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.taiji-yin-dot {
  left: 20px;
  background: var(--paper-white);
}

.taiji-yang-dot {
  right: 20px;
  background: var(--ink-black);
}

.taiji-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring {
  position: absolute;
  border: 1px solid var(--gold-accent);
  border-radius: 50%;
  opacity: 0.6;
}

.ring-1 {
  width: 140px;
  height: 140px;
  top: -70px;
  left: -70px;
  animation: pulse 4s infinite ease-in-out;
}

.ring-2 {
  width: 160px;
  height: 160px;
  top: -80px;
  left: -80px;
  animation: pulse 4s infinite ease-in-out 1s;
}

.ring-3 {
  width: 180px;
  height: 180px;
  top: -90px;
  left: -90px;
  animation: pulse 4s infinite ease-in-out 2s;
}

/* 艺术家肖像 */
.artist-portrait-container {
  position: relative;
}

.portrait-frame {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--gold-accent);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
}

.dragon-ornament {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--gold-accent);
  border-radius: 50%;
  z-index: 10;
}

.dragon-left {
  top: 10px;
  left: -10px;
  animation: glow 3s infinite ease-in-out;
}

.dragon-right {
  bottom: 10px;
  right: -10px;
  animation: glow 3s infinite ease-in-out 1.5s;
}

.artist-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portrait-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--gold-accent), transparent, var(--gold-accent));
  animation: rotate 8s infinite linear;
  z-index: -1;
}

/* 书法风格标题 */
.calligraphy-title {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.name-calligraphy {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.name-calligraphy span {
  font-family: 'Ma Shan Zheng', 'LXGW WenKai', 'PingFang SC', cursive;
  font-size: 48px;
  color: var(--ink-black);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  animation: brushStroke 0.8s ease-out forwards;
}

.char-张 { animation-delay: 0.2s; }
.char-艺 { animation-delay: 0.6s; }
.char-兴 { animation-delay: 1.0s; }

.title-seal {
  position: relative;
  width: 60px;
  height: 60px;
  background: var(--ochre-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(5deg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  animation: sealStamp 0.5s ease-out 1.5s forwards;
}

.seal-border {
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  border: 2px solid var(--paper-white);
  border-radius: 4px;
}

.seal-text {
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  font-weight: bold;
  color: var(--paper-white);
  z-index: 1;
}

/* 诗意描述 */
.poetic-description {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 40px;
}

.poem-line {
  font-family: 'LXGW WenKai', 'PingFang SC', serif;
  font-size: 16px;
  color: var(--mountain-grey);
  letter-spacing: 4px;
  margin-bottom: 8px;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

.poem-line:nth-child(1) { animation-delay: 2.0s; }
.poem-line:nth-child(2) { animation-delay: 2.3s; }
.poem-line:nth-child(3) { animation-delay: 2.6s; }

/* 古典导航 */
.classical-navigation {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 3.0s forwards;
}

.nav-ornament {
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-accent), transparent);
}

.classical-btn {
  position: relative;
  padding: 12px 24px;
  border: 2px solid var(--gold-accent);
  background: transparent;
  border-radius: 25px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--classical-transition);
}

.classical-btn.primary {
  background: var(--gold-accent);
  color: var(--ink-black);
}

.classical-btn.secondary {
  color: var(--gold-accent);
}

.classical-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.btn-text {
  font-family: 'LXGW WenKai', 'PingFang SC', serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
  position: relative;
  z-index: 2;
}

.btn-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, var(--gold-accent) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: var(--classical-transition);
  z-index: 1;
}

.classical-btn:hover .btn-decoration {
  width: 200px;
  height: 200px;
}

/* 滚动提示 */
.scroll-hint-chinese {
  position: relative;
  z-index: 10;
  text-align: center;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 3.5s forwards;
}

.hint-text {
  font-family: 'LXGW WenKai', 'PingFang SC', serif;
  font-size: 14px;
  color: var(--mountain-grey);
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.scroll-symbol {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.symbol-line {
  width: 1px;
  height: 20px;
  background: var(--gold-accent);
  margin-bottom: 5px;
}

.symbol-arrow {
  color: var(--gold-accent);
  font-size: 16px;
  animation: bounce 2s infinite;
}

/* 音乐殿堂样式 */
.musical-palace {
  padding: 60px 0;
}

.palace-header {
  text-align: center;
  margin-bottom: 50px;
}

.palace-title {
  font-family: 'Ma Shan Zheng', 'LXGW WenKai', 'PingFang SC', cursive;
  font-size: 36px;
  color: var(--ink-black);
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.classical-subtitle {
  font-family: 'LXGW WenKai', 'PingFang SC', serif;
  font-size: 16px;
  color: var(--mountain-grey);
  letter-spacing: 4px;
}

.classical-albums-container {
  max-width: 800px;
  margin: 0 auto;
}

.album-scroll-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.album-classical-card {
  background: var(--paper-white);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gold-accent);
  cursor: pointer;
  transition: var(--classical-transition);
  position: relative;
  overflow: hidden;
}

.album-classical-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(212, 175, 55, 0.2);
}

.album-cover-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.classical-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--classical-transition);
}

.album-classical-card:hover .classical-cover {
  transform: scale(1.05);
}

.album-classical-info {
  text-align: center;
}

.album-year-classical {
  font-family: 'LXGW WenKai', 'PingFang SC', serif;
  font-size: 12px;
  color: var(--gold-accent);
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.album-title-classical {
  font-family: 'LXGW WenKai', 'PingFang SC', serif;
  font-size: 16px;
  color: var(--ink-black);
  font-weight: 600;
  letter-spacing: 1px;
}

/* 影像画卷样式 */
.video-gallery {
  padding: 60px 0;
}

.gallery-header {
  text-align: center;
  margin-bottom: 50px;
}

.gallery-title {
  font-family: 'Ma Shan Zheng', 'LXGW WenKai', 'PingFang SC', cursive;
  font-size: 36px;
  color: var(--ink-black);
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.classical-videos-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.video-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-classical-item {
  cursor: pointer;
  transition: var(--classical-transition);
}

.video-classical-item:hover {
  transform: translateY(-4px);
}

.scroll-frame {
  background: var(--paper-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gold-accent);
}

.scroll-content {
  position: relative;
}

.video-thumbnail-classical {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.classical-video-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--classical-transition);
}

.video-classical-item:hover .classical-video-img {
  transform: scale(1.05);
}

.video-info-classical {
  padding: 16px;
  text-align: center;
}

.video-title-classical {
  font-family: 'LXGW WenKai', 'PingFang SC', serif;
  font-size: 14px;
  color: var(--ink-black);
  font-weight: 500;
  letter-spacing: 1px;
}

/* 动画定义 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(1);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.05);
  }
}

@keyframes glow {
  0%, 100% { 
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
  }
  50% { 
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
  }
}

@keyframes brushStroke {
  from {
    opacity: 0;
    transform: translateY(20px) rotate(-5deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes sealStamp {
  from {
    opacity: 0;
    transform: scale(0.8) rotate(5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(5deg);
  }
}

@keyframes float {
  from { transform: translateY(0); }
  to { transform: translateY(-100vh); }
}

/* 移动端响应式调整 */
@media (max-width: 767px) {
  .taiji-container {
    width: 150px;
    height: 150px;
  }
  
  .taiji-symbol {
    width: 100px;
    height: 100px;
  }
  
  .name-calligraphy span {
    font-size: 36px;
  }
  
  .classical-videos-container {
    grid-template-columns: 1fr;
  }
  
  .album-scroll-view {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
  }
  
  .classical-navigation {
    flex-direction: column;
    gap: 16px;
  }
  
  .nav-ornament {
    width: 50px;
  }
}

/* 保证风格切换时的平滑过渡 */
.mobile-artist-journey {
  transition: var(--classical-transition);
}

.style-lay-zhang .mobile-nav {
  background: rgba(250, 249, 246, 0.9);
  backdrop-filter: blur(20px);
}

.style-lay-zhang .nav-scrolled {
  background: rgba(250, 249, 246, 0.95);
  border-bottom-color: var(--gold-accent);
}

.style-lay-zhang .music-section {
  background: var(--paper-white);
}

.style-lay-zhang .videos-section {
  background: #f8f8f6;
}
</style> 