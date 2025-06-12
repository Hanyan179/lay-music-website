<template>
  <div class="mobile-artist-journey">
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
          <button @click="switchToPC" class="secondary-btn" title="切换到PC版">
            切换PC版
          </button>
          <button @click="scrollToSection('timeline')" class="primary-btn">
            立即体验
          </button>
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
      <div class="hero-content">
        <!-- 艺术家头像 -->
        <div class="artist-avatar">
          <img src="/artist-journey/assets/background.jpg" alt="LAY 张艺兴" />
          <div class="avatar-ring"></div>
        </div>
        
        <!-- 主标题 -->
        <h1 class="hero-title">
          <span class="title-char">张</span>
          <span class="title-char">艺</span>
          <span class="title-char">兴</span>
        </h1>
        
        <!-- 副标题 -->
        <div class="hero-subtitle">
          <span class="subtitle-word">音乐</span>
          <span class="subtitle-dot">·</span>
          <span class="subtitle-word">梦想</span>
          <span class="subtitle-dot">·</span>
          <span class="subtitle-word">永恒</span>
        </div>
        
        <!-- 简介 -->
        <p class="hero-intro">努力努力再努力</p>
        
        <!-- 按钮组 -->
        <div class="hero-buttons">
          <button @click="scrollToSection('about')" class="about-btn">
            个人简介
          </button>
          <button @click="scrollToSection('timeline')" class="enter-btn">
            探索音乐之旅
          </button>
        </div>
        
        <!-- 滑动提示 -->
        <div class="scroll-indicator">
          <div class="scroll-text">向下滑动探索更多</div>
          <div class="scroll-arrow">
            <span class="arrow-line"></span>
            <span class="arrow-point"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- 个人简介区域 -->
    <section id="about" class="content-section about-section">
      <div class="section-container">
        <div class="about-content">
          <!-- 主标题区域 -->
          <div class="about-header">
            <div class="name-display">
              <span class="name-char" style="animation-delay: 0s;">张</span>
              <span class="name-char" style="animation-delay: 0.1s;">艺</span>
              <span class="name-char" style="animation-delay: 0.2s;">兴</span>
            </div>
            <div class="title-stack">
              <span class="role-tag primary">音乐制作人</span>
              <span class="role-tag secondary">歌手</span>
              <span class="role-tag tertiary">舞者</span>
            </div>
          </div>
          
          <!-- 个人介绍区域 -->
          <div class="about-intro-section">
            <div class="intro-content">
              <p class="intro-line primary">湖南长沙人，中国音乐制作人、歌手、舞者</p>
              <p class="intro-line secondary">致力于音乐创作与中华文化传承</p>
              <p class="intro-line tertiary">在国际舞台展现中国青年艺术家风采</p>
            </div>
                         <div class="intro-highlights">
               <span class="intro-tag">音乐创作</span>
               <span class="intro-tag">文化传承</span>
               <span class="intro-tag">国际舞台</span>
             </div>
          </div>
          
          <!-- 核心数据展示 -->
          <div class="about-metrics">
            <div class="metric-card featured">
              <div class="metric-number">{{ aboutStats.careerYears }}</div>
              <div class="metric-label">年音乐生涯</div>
              <div class="metric-accent"></div>
            </div>
            <div class="metric-card">
              <div class="metric-number">{{ aboutStats.totalTracks }}</div>
              <div class="metric-label">首原创作品</div>
            </div>
            <div class="metric-card">
              <div class="metric-number">{{ aboutStats.totalFans }}</div>
              <div class="metric-label">全球粉丝</div>
            </div>
          </div>
          
          <!-- 理念表达区域 -->
          <div class="about-philosophy">
            <div class="philosophy-quote">
              <span class="quote-mark">"</span>
              <span class="quote-text">努力努力再努力</span>
              <span class="quote-mark">"</span>
            </div>
            <div class="philosophy-description">
              <p class="philosophy-line">以音乐为媒介，传承中华文化精神</p>
              <p class="philosophy-line">在国际舞台上展现中国青年艺术家的风采与担当</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 音乐作品区域 -->
    <section id="music" class="content-section music-section">
      <div class="section-container">
        <h2 class="section-title">音乐作品</h2>
        <p class="section-description">探索张艺兴的音乐历程，从每一首歌曲中感受他的成长与蜕变</p>
        
        <div class="works-grid">
          <div class="work-card" v-for="album in musicWorks" :key="album.id">
            <div class="work-image">
              <img :src="album.cover" :alt="album.title" />
              <div class="work-overlay">
                <button class="play-btn">▶</button>
              </div>
            </div>
            <div class="work-info">
              <h3 class="work-title">{{ album.title }}</h3>
              <p class="work-year">{{ album.year }}</p>
              <p class="work-description">{{ album.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 视频作品区域 -->
    <section id="videos" class="content-section videos-section">
      <div class="section-container">
        <h2 class="section-title">视频作品</h2>
        <p class="section-description">精彩的MV、舞台表演和幕后花絮</p>
        
        <div class="videos-grid">
          <div class="video-card" v-for="video in videoWorks" :key="video.id">
            <div class="video-thumbnail">
              <img :src="video.thumbnail" :alt="video.title" />
              <div class="video-overlay">
                <button class="play-btn large">▶</button>
              </div>
              <div class="video-duration">{{ video.duration }}</div>
            </div>
            <div class="video-info">
              <h3 class="video-title">{{ video.title }}</h3>
              <p class="video-views">{{ video.views }} 次观看</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 时间轴区域 -->
    <section id="timeline" class="content-section timeline-section">
      <div class="section-container">
        <h2 class="section-title">成长时间轴</h2>
        <p class="section-description">记录每一个重要的音乐里程碑</p>
        
        <div class="timeline">
          <div class="timeline-item" v-for="event in timelineEvents" :key="event.id">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-year">{{ event.year }}</div>
              <h3 class="timeline-title">{{ event.title }}</h3>
              <p class="timeline-description">{{ event.description }}</p>
            </div>
          </div>
        </div>
        
        <!-- 进入3D时间轴按钮 -->
        <div class="timeline-action">
          <button @click="enterTimeline" class="timeline-btn">
            进入3D时间轴体验
          </button>
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

// 风格名称映射
const styleNames = {
  'minimalism': 'Minimalism',
  'lay-zhang': 'LAY Zhang',
  'x-back': 'X-Back'
} as const

// 当前风格名称
const currentStyleName = computed(() => styleNames[currentStyle.value])

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

// 计算个人简介统计数据
const aboutStats = computed(() => {
  const currentYear = new Date().getFullYear()
  const careerYears = currentYear - 2012 // 从2012年出道开始计算
  const totalTracks = musicData.reduce((total, album) => total + (album.stats?.tracks || 0), 0)
  const totalViews = videoData.reduce((total, video) => {
    const viewsStr = video.views.replace(/[^\d.]/g, '')
    const viewsNum = parseFloat(viewsStr)
    return total + (viewsNum * 1000000) // 假设单位是M
  }, 0)
  
  return {
    careerYears: `${careerYears}+`,
    totalTracks: `${totalTracks}+`,
    totalFans: `${Math.floor(totalViews / 1000000)}M+`
  }
})

// 时间轴事件数据
const timelineEvents = ref([
  {
    id: 1,
    year: "2012",
    title: "EXO 出道",
    description: "作为EXO成员正式出道，开始音乐生涯"
  },
  {
    id: 2,
    year: "2015",
    title: "回国发展",
    description: "开始在中国发展个人音乐事业"
  },
  {
    id: 3,
    year: "2018",
    title: "首张专辑",
    description: "发布个人首张专辑《NAMANANA》"
  },
  {
    id: 4,
    year: "2020",
    title: "音乐制作人",
    description: "担任多部作品制作人，展现全能才华"
  },
  {
    id: 5,
    year: "2024",
    title: "持续创新",
    description: "不断探索音乐新领域，传承文化精神"
  }
])

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
  // 阻止背景滚动并添加模糊效果
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

// 进入3D时间轴
const enterTimeline = () => {
  router.push('/timeline')
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
  // 应用风格变化的逻辑（稍后实现）
  console.log('应用风格:', currentStyle.value)
  closeStyleModal()
}

// 页面加载时的初始化
onMounted(() => {
  console.log('移动端页面已加载')
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open')
})
</script>

<style scoped>
/* 移动端专用样式 */
.mobile-artist-journey {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  overflow-x: hidden;
  position: relative;
}

/* Apple 风格移动端导航栏 */
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #e5e5e5;
  transition: all 150ms ease-out;
  height: 64px;
}

.mobile-nav.nav-scrolled {
  height: 56px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
}

.nav-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  height: 100%;
  padding: 0 clamp(16px, 4vw, 32px);
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
}

/* Logo 区域 */
.brand-logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 8px;
  border-radius: 8px;
  transition: all 150ms ease-out;
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
}

.logo-link:hover {
  background: rgba(0, 0, 0, 0.05);
}

.logo-link:focus {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}

.logo-image {
  height: 32px;
  width: auto;
  max-width: 120px;
  object-fit: contain;
}

/* 导航链接区域 - 桌面端显示 */
.nav-links {
  display: none;
  align-items: center;
  gap: 24px;
  justify-self: center;
}

.nav-link {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #4d4d4d;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 150ms ease-out;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-link:hover {
  color: #000;
  background: rgba(0, 0, 0, 0.05);
}

.nav-link:focus {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}

/* 右侧操作区 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-self: end;
}

.primary-btn {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 16px;
  height: 36px;
  padding: 0 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease-out;
  min-width: 44px;
  display: none;
}

.primary-btn:hover {
  background: #1a1a1a;
  transform: translateY(-1px);
}

.primary-btn:focus {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}

.secondary-btn {
  background: transparent;
  color: #4d4d4d;
  border: 1px solid #d0d0d0;
  border-radius: 16px;
  height: 36px;
  padding: 0 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease-out;
  display: none;
}

.secondary-btn:hover {
  color: #000;
  border-color: #b0b0b0;
  background: rgba(0, 0, 0, 0.02);
}

.secondary-btn:focus {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}

.style-btn {
  background: transparent;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  transition: all 150ms ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.style-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(1.1);
}

.style-btn:focus {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}

/* 汉堡菜单按钮 */
.menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 200ms ease-out;
  gap: 4px;
}

.menu-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}

.menu-toggle:focus {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: #4d4d4d;
  border-radius: 1px;
  transition: all 250ms ease;
  transform-origin: center;
}

.menu-toggle.menu-active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.menu-active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.menu-toggle.menu-active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* 移动端全屏菜单 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 250ms ease;
}

.mobile-menu-overlay.menu-open {
  opacity: 1;
  visibility: visible;
}

.mobile-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: min(400px, 85vw);
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateX(100%);
  transition: transform 250ms ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-menu.menu-open {
  transform: translateX(0);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
}

.menu-logo {
  height: 24px;
  width: auto;
}

.close-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease-out;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.close-icon {
  font-size: 24px;
  color: #4d4d4d;
  line-height: 1;
}

.menu-nav {
  flex: 1;
  padding: 24px 0;
}

.menu-item {
  display: block;
  color: #4d4d4d;
  text-decoration: none;
  padding: 16px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  font-size: 17px;
  font-weight: 500;
  transition: all 150ms ease-out;
  border-bottom: 1px solid rgba(229, 229, 229, 0.5);
  min-height: 48px;
  display: flex;
  align-items: center;
}

.menu-item:hover {
  color: #000;
  background: rgba(0, 0, 0, 0.02);
}

.menu-actions {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #e5e5e5;
}

.menu-primary-btn {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 16px;
  height: 48px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.menu-primary-btn:hover {
  background: #1a1a1a;
}

.menu-secondary-btn {
  background: transparent;
  color: #4d4d4d;
  border: 1px solid #d0d0d0;
  border-radius: 16px;
  height: 48px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.menu-secondary-btn:hover {
  color: #000;
  border-color: #b0b0b0;
}

.menu-style-btn {
  background: rgba(0, 0, 0, 0.05);
  color: #4d4d4d;
  border: none;
  border-radius: 16px;
  height: 48px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.menu-style-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #000;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
  
  .secondary-btn {
    display: block;
  }
}

@media (min-width: 1024px) {
  .primary-btn {
    display: block;
  }
  
  .menu-toggle {
    display: none;
  }
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px 60px;
  position: relative;
  text-align: center;
}

.hero-content {
  position: relative;
  z-index: 2;
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
  border: 3px solid rgba(0, 0, 0, 0.1);
}

.avatar-ring {
  position: absolute;
  inset: -10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-title {
  font-size: 3rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.title-char {
  display: inline-block;
  animation: bounce 2s ease infinite;
}

.title-char:nth-child(1) { animation-delay: 0s; }
.title-char:nth-child(2) { animation-delay: 0.2s; }
.title-char:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
  letter-spacing: 2px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.subtitle-word {
  display: inline-block;
}

.subtitle-dot {
  margin: 0 8px;
  opacity: 0.7;
}

.hero-intro {
  font-size: 1rem;
  color: #888;
  margin-bottom: 40px;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.about-btn {
  background: transparent;
  color: #666;
  border: 1px solid #e5e5e5;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 300ms ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.about-btn:hover {
  color: #1a1a1a;
  border-color: #ccc;
  background: rgba(0, 0, 0, 0.02);
  transform: translateY(-1px);
}

.enter-btn {
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 300ms ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.enter-btn:hover {
  background: #000;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 滑动提示 */
.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: float 2s ease-in-out infinite;
}

.scroll-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.scroll-arrow {
  position: relative;
  width: 24px;
  height: 24px;
}

.arrow-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 12px;
  background: #ccc;
  transform: translate(-50%, -50%);
}

.arrow-point {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #ccc;
  transform: translateX(-50%);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* 内容区域通用样式 */
.content-section {
  padding: 80px 0;
  min-height: auto;
}

/* 个人简介区域 - 现代动感风格 */
.about-section {
  background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 50%, #ffffff 100%);
  padding: 140px 0;
  position: relative;
  overflow: hidden;
}

.about-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

.about-content {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

/* 主标题区域 */
.about-header {
  margin-bottom: 80px;
}

.name-display {
  margin-bottom: 32px;
}

.name-char {
  display: inline-block;
  font-size: 4.2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  transform: translateY(20px);
  opacity: 0;
  animation: slideInUp 0.8s ease forwards;
}

@keyframes slideInUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.title-stack {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.role-tag {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  transform: translateY(10px);
  opacity: 0;
  animation: tagFadeIn 0.6s ease forwards;
}

.role-tag.primary {
  background: #000;
  color: #fff;
  animation-delay: 0.3s;
}

.role-tag.secondary {
  background: rgba(0, 0, 0, 0.08);
  color: #333;
  animation-delay: 0.4s;
}

.role-tag.tertiary {
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  animation-delay: 0.5s;
}

@keyframes tagFadeIn {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 个人介绍区域 */
.about-intro-section {
  margin-bottom: 100px;
}

.intro-content {
  max-width: 600px;
  margin: 0 auto 40px;
}

.intro-line {
  font-size: 1.2rem;
  line-height: 1.8;
  margin: 16px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  opacity: 0;
  transform: translateY(15px);
  animation: introFadeIn 0.6s ease forwards;
}

.intro-line.primary {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1.3rem;
  animation-delay: 0.6s;
}

.intro-line.secondary {
  font-weight: 500;
  color: #333;
  animation-delay: 0.8s;
}

.intro-line.tertiary {
  font-weight: 400;
  color: #666;
  animation-delay: 1.0s;
}

@keyframes introFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-highlights {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 40px;
}

.intro-tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  background: rgba(0, 0, 0, 0.06);
  color: #555;
  transform: translateY(10px);
  opacity: 0;
  animation: introTagFadeIn 0.5s ease forwards;
  transition: all 0.2s ease;
}

.intro-tag:nth-child(1) { animation-delay: 1.2s; }
.intro-tag:nth-child(2) { animation-delay: 1.3s; }
.intro-tag:nth-child(3) { animation-delay: 1.4s; }

@keyframes introTagFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-tag:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  transform: translateY(-1px);
}

/* 数据指标卡片 */
.about-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 100px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.metric-card {
  background: #fff;
  padding: 32px 24px;
  border-radius: 16px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  transform: translateY(20px);
  opacity: 0;
  animation: cardFadeIn 0.6s ease forwards;
}

.metric-card:nth-child(1) { animation-delay: 1.2s; }
.metric-card:nth-child(2) { animation-delay: 1.3s; }
.metric-card:nth-child(3) { animation-delay: 1.4s; }

@keyframes cardFadeIn {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.metric-card.featured {
  background: #1a1a1a;
  color: #fff;
  transform: scale(1.05) translateY(20px);
}

.metric-card.featured:hover {
  transform: scale(1.05) translateY(-4px);
}

.metric-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.metric-card.featured .metric-number {
  color: #fff;
}

.metric-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  letter-spacing: 0.02em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.metric-card.featured .metric-label {
  color: rgba(255, 255, 255, 0.8);
}

.metric-accent {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: #fff;
  border-radius: 2px;
}

/* 理念表达区域 */
.about-philosophy {
  max-width: 700px;
  margin: 0 auto;
}

.philosophy-quote {
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(20px);
  animation: quoteFadeIn 0.6s ease forwards;
  animation-delay: 1.6s;
}

@keyframes quoteFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quote-mark {
  font-size: 3rem;
  color: #e0e0e0;
  font-family: Georgia, serif;
  line-height: 1;
  vertical-align: top;
}

.quote-text {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
  letter-spacing: 0.02em;
}

.philosophy-description {
  opacity: 0;
  transform: translateY(15px);
  animation: descriptionFadeIn 0.6s ease forwards;
  animation-delay: 1.8s;
}

@keyframes descriptionFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.philosophy-line {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin: 12px 0;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

/* 风格选择弹窗 */
.style-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 250ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.style-modal-overlay.modal-open {
  opacity: 1;
  visibility: visible;
}

.style-modal {
  background: #fff;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(20px);
  transition: all 250ms ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.style-modal.modal-open {
  transform: scale(1) translateY(0);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e5e5;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms ease;
}

.modal-close-btn:hover {
  background: #f0f0f0;
}

.modal-close-btn .close-icon {
  font-size: 20px;
  color: #666;
  line-height: 1;
}

.style-options {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.style-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 200ms ease;
  position: relative;
  text-align: left;
}

.style-option:hover {
  border-color: #ccc;
  background: #f8f9fa;
  transform: translateY(-2px);
}

.style-option.active {
  border-color: #000;
  background: #f0f0f0;
}

.style-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 6px;
  flex-shrink: 0;
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

.style-option-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.style-check {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.modal-actions {
  padding: 24px 32px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-cancel-btn {
  background: transparent;
  color: #666;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 150ms ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.modal-cancel-btn:hover {
  border-color: #999;
  color: #333;
}

.modal-apply-btn {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 150ms ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.modal-apply-btn:hover {
  background: #1a1a1a;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 32px);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.section-description {
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  margin-bottom: 60px;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

/* 音乐作品区域 */
.music-section {
  background: #ffffff;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.work-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 300ms ease;
}

.work-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.work-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
}

.work-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 300ms ease;
}

.work-card:hover .work-overlay {
  opacity: 1;
}

.work-card:hover .work-image img {
  transform: scale(1.05);
}

.play-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #000;
  font-size: 20px;
  cursor: pointer;
  transition: all 200ms ease;
}

.play-btn:hover {
  background: #fff;
  transform: scale(1.1);
}

.work-info {
  padding: 24px;
}

.work-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.work-year {
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.work-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

/* 视频作品区域 */
.videos-section {
  background: #f8f9fa;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.video-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 300ms ease;
}

.video-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 300ms ease;
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.play-btn.large {
  width: 80px;
  height: 80px;
  font-size: 28px;
}

.video-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.video-info {
  padding: 20px;
}

.video-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.video-views {
  font-size: 0.9rem;
  color: #999;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

/* 时间轴区域 */
.timeline-section {
  background: #ffffff;
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto 60px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e5e5;
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
}

.timeline-item:nth-child(odd) {
  justify-content: flex-start;
}

.timeline-item:nth-child(even) {
  justify-content: flex-end;
}

.timeline-marker {
  position: absolute;
  left: 50%;
  width: 16px;
  height: 16px;
  background: #000;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.timeline-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 350px;
  margin: 0 40px;
}

.timeline-year {
  font-size: 0.9rem;
  color: #999;
  font-weight: 500;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.timeline-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.timeline-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.timeline-action {
  text-align: center;
}

.timeline-btn {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 300ms ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.timeline-btn:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 页脚 */
.page-footer {
  background: #1a1a1a;
  padding: 40px 0;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 32px);
}

.footer-logo img {
  height: 32px;
  width: auto;
  margin-bottom: 16px;
  opacity: 0.8;
}

.footer-text {
  color: #ccc;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .timeline::before {
    left: 20px;
  }
  
  .timeline-item {
    justify-content: flex-start !important;
  }
  
  .timeline-marker {
    left: 20px;
  }
  
  .timeline-content {
    margin-left: 50px;
    margin-right: 0;
  }
  
  .works-grid,
  .videos-grid {
    grid-template-columns: 1fr;
  }
  
  /* 个人简介移动端优化 */
  .about-section {
    padding: 100px 0;
  }
  
  .name-char {
    font-size: 3.2rem;
    margin: 0 4px;
  }
  
  .title-stack {
    flex-direction: column;
    gap: 12px;
  }
  
  .role-tag {
    font-size: 0.85rem;
    padding: 6px 14px;
  }
  
  .intro-content {
    max-width: 100%;
    padding: 0 20px;
  }
  
  .intro-line {
    font-size: 1.1rem;
    margin: 12px 0;
  }
  
  .intro-line.primary {
    font-size: 1.2rem;
  }
  
  .intro-highlights {
    gap: 8px;
    margin-top: 32px;
  }
  
  .intro-tag {
    padding: 5px 12px;
    font-size: 0.75rem;
  }
  
  .about-metrics {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 80px;
  }
  
  .metric-card {
    padding: 28px 20px;
  }
  
  .metric-card.featured {
    transform: scale(1) translateY(20px);
  }
  
  .metric-card.featured:hover {
    transform: scale(1) translateY(-4px);
  }
  
  .metric-number {
    font-size: 2.2rem;
  }
  
  .quote-text {
    font-size: 1.4rem;
    margin: 0 12px;
  }
  
  .quote-mark {
    font-size: 2.5rem;
  }
  
  .philosophy-line {
    font-size: 1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .about-btn,
  .enter-btn {
    width: 200px;
  }
  
  .style-modal {
    margin: 20px;
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  .style-options {
    padding: 20px;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .style-option {
    padding: 20px 16px;
    gap: 10px;
  }
  
  .modal-actions {
    padding: 20px 24px;
    flex-direction: column;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .mobile-nav {
    background: rgba(28, 28, 28, 0.7);
    border-bottom-color: #333;
  }
  
  .nav-link,
  .hamburger-line,
  .close-icon,
  .menu-item {
    color: #f2f2f2;
  }
  
  .mobile-menu {
    background: rgba(28, 28, 28, 0.95);
  }
  
  .secondary-btn,
  .menu-secondary-btn {
    color: #f2f2f2;
    border-color: #555;
  }
}

/* 菜单打开时的背景模糊效果 */
body.menu-open .mobile-artist-journey::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 900;
  pointer-events: none;
}

body.menu-open .mobile-artist-journey > * {
  filter: blur(1px);
  transition: filter 250ms ease;
}

body.menu-open .mobile-nav {
  filter: none;
}

body.menu-open .style-modal-overlay {
  filter: none;
}
</style> 