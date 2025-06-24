<template>
    <div class="artist-journey">
       <!-- 鼠标粒子交互背景 - 全屏效果 -->
       <WaterRipple :maxParticles="200" :disabled="false" />
      
      <!-- 导航栏 -->
      <nav class="fixed top-0 w-full z-[100] bg-transparent">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="music-brand text-gray-800">
              LAY 张艺兴
            </div>
            <div class="flex space-x-8">
              <a href="#home" class="nav-link">首页</a>
              <router-link to="/music3d" class="nav-link">音乐</router-link>
              <a href="#about" class="nav-link">关于</a>
              <a href="#contact" class="nav-link">联系</a>
            </div>
            <button id="menu-toggle" class="md:hidden control-button" title="菜单">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
  
      <!-- 主页 Hero Section -->
      <section id="home" class="h-screen flex items-center justify-center section-padding relative overflow-hidden" @click="handleHeroClick">
        <!-- 左侧背景图片区域 -->
        <div class="hero-background-right"></div>
        
        <div class="container flex items-center relative z-10">
          <!-- 个人简介右侧展示，避免与背景重叠 -->
          <div class="max-w-4xl text-center px-8 py-8 ml-auto mr-8 md:mr-16 lg:mr-20 backdrop-blur-sm bg-white/10 rounded-2xl">
            <!-- 装饰线条 -->
            <div class="decorative-line mb-8 flex justify-center">
              <span class="line"></span>
              <span class="dot"></span>
              <span class="line"></span>
            </div>
            
            <!-- 主标题打字效果 - 上移10vh为标签预留空间 -->
            <div class="title-container mb-4 relative" :class="{ 'title-lifted': animationState >= 1 }">
              <div class="title-bg"></div>
              <h1 class="typewriter-text text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight" ref="typewriterText">
                LAY ZHANG
              </h1>
            </div>
            
            <!-- 身份标签爆发区域 -->
            <div class="identity-tags-area relative h-20" :class="{ aligned: animationState >= 2 }" ref="identityTagsArea">
              <div 
                v-for="(tag, index) in identityTags" 
                :key="index"
                class="identity-tag"
                :class="{
                  'tag-chaos': animationState === 1,
                  'tag-aligned': animationState >= 2,
                  'tag-breathing': animationState >= 2
                }"
                                 :ref="`identityTag${index}`"
                :style="getTagStyle(index)"
              >
                <span class="tag-text">{{ tag.title }}</span>
                <span v-if="animationState >= 2" class="tag-tooltip">{{ tag.description }}</span>
              </div>
            </div>
            
            <!-- 简介容器 - 自适应字数 -->
            <div 
              class="artist-bio-container"
              :class="{
                'bio-visible': animationState >= 3,
                'bio-large-text': bioText.length <= 40,
                'bio-small-text': bioText.length > 40
              }"
              ref="bioContainer"
            >
              <div class="bio-content backdrop-blur-md bg-white/5 rounded-2xl px-6 py-4">
                <p class="bio-text text-white/90 leading-relaxed" ref="bioText">
                  {{ bioText }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 移动端菜单 -->
      <div id="mobile-menu" class="fixed inset-0 z-[110] hidden md:hidden">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeMobileMenu"></div>
        <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-xl font-bold text-gray-900">菜单</h3>
            <button @click="closeMobileMenu" class="control-button" title="关闭菜单">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav class="space-y-6">
            <a href="#home" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">首页</a>
            <router-link to="/music3d" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">音乐</router-link>
            <a href="#about" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">关于</a>
            <a href="#contact" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">联系</a>
          </nav>
        </div>
      </div>
            
    </div>
</template>
  
<script setup lang="ts">
// ========== 导入部分 ==========
// 组件导入
import WaterRipple from '@/components/WaterRipple.vue'
import identityTagsData from '@/data/identityTags'

// 样式导入
import '@/styles/debug.css'
import '@/styles/index.css'

// Vue 核心导入
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// ========== 路由和初始化 ==========
const router = useRouter()

// ========== 高级交互动效状态管理 ==========
const animationState = ref(0) // 0: 初始, 1: 爆发, 2: 整列, 3: 简介显示
const identityTags = ref(identityTagsData)
const bioText = ref('努力努力再努力！！！一位集音乐制作、舞蹈、演唱、创作于一体的全能艺术家，在多个领域都展现出了非凡的才华和独特的艺术感悟。')

// 渲染与物理状态
const revealedCount = ref(0)
interface TagPhysics { x:number; y:number; vx:number; vy:number; rotation:number; visible:boolean }
const tagPositions = reactive<TagPhysics[]>(identityTags.value.map(() => ({ x:0, y:-100, vx:0, vy:0, rotation:0, visible:false })))

const identityTagsArea = ref<HTMLElement | null>(null)

// 物理参数
const GRAVITY = 0.5
const BOUNCE = 0.5
const FRICTION = 0.98

// ===== 物理增强 =====
const LEFT_BOUND = -200
const RIGHT_BOUND = 200

// Bump when hitting side walls
function handleSideWalls(p: TagPhysics) {
  if (p.x < LEFT_BOUND) {
    p.x = LEFT_BOUND
    p.vx *= -BOUNCE
  }
  if (p.x > RIGHT_BOUND) {
    p.x = RIGHT_BOUND
    p.vx *= -BOUNCE
  }
}

// 显示下一个标签
const revealNextTag = () => {
  if (revealedCount.value >= identityTags.value.length) return
  const idx = revealedCount.value
  revealedCount.value++
  const p = tagPositions[idx]
  p.visible = true
  p.x = 0
  p.y = -120 // 从上方掉落
  p.vx = (Math.random() - 0.5) * 6
  p.vy = 0

  // 进入混沌阶段
  if (animationState.value === 0) {
    animationState.value = 1
  }
}

// ========== 高级交互动效核心方法 ==========

/**
 * 统一推进阶段：
 * 0/1 -> reveal tags until all
 * 1 -> 2  标签整列
 * 2 -> 3  简介淡入
 */
const progressStage = () => {
  if (revealedCount.value < identityTags.value.length) {
    revealNextTag()
    return
  }

  if (animationState.value === 1) {
    animationState.value = 2
    return
  }

  if (animationState.value === 2) {
    animationState.value = 3
  }
}

/**
 * Hero 区域点击处理 - 标签爆发动效
 */
const handleHeroClick = () => {
  // 点击一次出现一个标签（在对齐前）
  if (animationState.value < 2) {
    revealNextTag()
  }
}

/**
 * 获取标签动态样式
 */
const getTagStyle = (index: number) => {
  const p = tagPositions[index]
  if (!p.visible) {
    return { display: 'none' }
  }

  // 物理阶段（未对齐）
  if (animationState.value < 2) {
    return {
      transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`
    }
  }

  // 对齐阶段
  const spacing = 140
  const totalWidth = (identityTags.value.length - 1) * spacing
  const startX = -totalWidth / 2
  const x = startX + index * spacing
  return {
    transform: `translate(${x}px, 0px)` ,
    transition: 'transform 1.6s cubic-bezier(0.25, 1, 0.5, 1)'
  }
}

/**
 * 设置滚动监听器
 */
const setupScrollListeners = () => {
  // scroll (页面真的滚动时)
  const handleScroll = () => {
    progressStage()
    if (animationState.value === 3) {
      window.removeEventListener('scroll', handleScroll)
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true })

  // wheel (即使页面未滚动也可触发)
  let wheelLock = false
  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY > 10 && !wheelLock) {
      wheelLock = true
      progressStage()
      setTimeout(() => { wheelLock = false }, 300)
    }
  }
  window.addEventListener('wheel', handleWheel, { passive: true })

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('wheel', handleWheel)
  })
}
  
// ========== 滚动和导航方法 ==========
/**
 * 滚动到指定区域
 * @param sectionId 区域ID
 */
const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}
  
/**
 * 关闭移动端菜单
 */
const closeMobileMenu = () => {
  const mobileMenu = document.getElementById('mobile-menu')
  if (mobileMenu) {
    mobileMenu.classList.add('hidden')
  }
}
  
// ========== 事件监听器设置 ==========
/**
 * 设置事件监听器
 */
const setupEventListeners = () => {
  const menuToggle = document.getElementById('menu-toggle')
  const mobileMenu = document.getElementById('mobile-menu')
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden')
    })
  }
  
  // 为所有锚点链接添加平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = (link as HTMLAnchorElement).getAttribute('href')?.substring(1)
      if (targetId) {
        scrollToSection(targetId)
      }
    })
  })
}

// ========== 应用初始化 ==========
/**
 * 初始化应用
 */
const initApp = async () => {
  try {
    // 设置事件监听器
    setupEventListeners()
    
    // 提前绑定滚动/滚轮监听，确保无需点击即可触发阶段推进
    setupScrollListeners()
    
    // 初始化打字效果
    setTimeout(() => {
      startTypewriter()
    }, 1000)
    
  } catch (error) {
    console.error('初始化失败:', error)
  }
}

// ========== 打字效果相关 ==========
// 打字效果相关的引用
const typewriterText = ref<HTMLElement | null>(null)
const artistIntro = ref<HTMLElement | null>(null)
const identityShowcase = ref<HTMLElement | null>(null)
const identityCarousel = ref<HTMLElement | null>(null)
let currentIdentityIndex = 0

/**
 * 打字效果实现
 */
const startTypewriter = () => {
  if (!typewriterText.value) return
  
  const text = typewriterText.value.textContent || ''
  typewriterText.value.textContent = ''
  typewriterText.value.classList.add('typing')
  
  let i = 0
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      if (typewriterText.value) {
        typewriterText.value.textContent += text.charAt(i)
      }
      i++
    } else {
      clearInterval(typeInterval)
      // 打字效果完成后显示简介和身份标签
      setTimeout(() => {
        if (artistIntro.value) {
          artistIntro.value.classList.add('show')
        }
        setTimeout(() => {
          if (identityShowcase.value) {
            identityShowcase.value.classList.add('show')
            startIdentityCarousel()
          }
        }, 400)
      }, 400)
    }
  }, 100)
}

/**
 * 身份标签轮播实现
 */
const startIdentityCarousel = () => {
  if (!identityCarousel.value) return
  
  const identities = identityCarousel.value.querySelectorAll('.identity-text')
  if (identities.length > 0) {
    identities[currentIdentityIndex].classList.add('active')
    
    setInterval(() => {
      identities[currentIdentityIndex].classList.remove('active')
      currentIdentityIndex = (currentIdentityIndex + 1) % identities.length
      identities[currentIdentityIndex].classList.add('active')
    }, 2000)
  }
}

// 监听滚动事件，触发打字效果
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startTypewriter()
      observer.disconnect()
    }
  })
}, { threshold: 0.5 })

// ========== 生命周期钩子 ==========
/**
 * 组件挂载时执行
 */
onMounted(() => {
  // 设备检测和自动跳转
  import('@/utils/deviceDetector').then(({ isMobileDevice }) => {
    const isMobile = isMobileDevice()
    
    // 检查URL参数，如果有forcePC标记，则不自动跳转
    const urlParams = new URLSearchParams(window.location.search)
    const forcePC = urlParams.get('forcePC') === 'true'
    
    if (isMobile && !forcePC) {
      // 移动设备跳转到移动端页面，但添加来源标记
      console.log('检测到移动设备，跳转到移动端页面')
      router.replace('/mobile?fromPC=true')
      return
    } else {
      console.log('检测到PC设备或强制PC模式，继续加载PC端页面')
    }
    
    // 只有PC端才继续初始化
    initApp()
    
  }).catch(error => {
    console.error('设备检测失败:', error)
    // 检测失败时默认继续PC端逻辑
    initApp()
  })

  // 初始化打字效果观察器
  if (typewriterText.value) {
    observer.observe(typewriterText.value)
  }

  // 启动物理引擎
  const mouse = { x: 0, y: 0 }
  const onMouseMove = (e: MouseEvent) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }
  window.addEventListener('mousemove', onMouseMove)

  const physicsLoop = () => {
    if (animationState.value < 2 && identityTagsArea.value) {
      const rect = identityTagsArea.value.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      tagPositions.forEach((p) => {
        if (!p.visible) return
        // 基础重力
        p.vy += GRAVITY
        p.x += p.vx
        p.y += p.vy

        // 碰撞左右墙
        handleSideWalls(p)
        
        // 碰撞地面
        const ground = centerY - 20
        if (p.y > ground) {
          p.y = ground
          p.vy *= -BOUNCE
          p.vx *= FRICTION
        }

        // 与鼠标简单碰撞
        const globalX = rect.left + centerX + p.x
        const globalY = rect.top + centerY + p.y
        const dx = globalX - mouse.x
        const dy = globalY - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 60) {
          const force = (60 - dist) / 60
          const nx = dx / dist
          const ny = dy / dist
          p.vx += nx * force * 4
          p.vy += ny * force * 4
        }

        p.rotation += p.vx
      })
    }
    requestAnimationFrame(physicsLoop)
  }
  physicsLoop()
})

/**
 * 组件卸载时执行清理
 */
onUnmounted(() => {
  // 清理观察器
  observer.disconnect()
})

</script>
 
<style scoped>
/* 确保主容器相对定位 */
.artist-journey {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动条 */
}

/* ========== 高级交互动效样式 ========== */

/* 主标题上移动画 */
.title-container {
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.title-lifted {
  transform: translateY(-10vh);
}

/* 身份标签容器 */
.identity-tags-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  margin: 1rem 0 0.5rem; /* 更靠近主标题 */
  overflow: visible; /* 允许 tooltip 溢出显示 */
  z-index: 2000; /* 高于 hero 背景 */
}

/* 整列状态使用 Flex 横排 */
.identity-tags-area.aligned {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
  height: auto;
}

/* 对齐完成后标签使用文档流，避免重叠 */
.identity-tags-area.aligned .identity-tag {
  position: relative; /* 使 tooltip 以自身为参考 */
  transform: none !important;
  top: auto;
  left: auto;
  right: auto;
  bottom: auto;
}

/* 身份标签基础样式 */
.identity-tag {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center;
  will-change: transform;
  z-index: 10;
}

/* 鼠标悬浮时抬高层级，避免被其他元素遮挡 */
.identity-tag:hover {
  z-index: 300;
}

/* 标签文字样式 - 毛玻璃胶囊 */
.tag-text {
  display: inline-block;
  padding: 8px 16px;
  /* 统一更显眼卡片样式 */
  background: linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.25));
  backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 24px;
  color: #000; /* 黑色文字提高可读性 */
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: none;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(255, 255, 255, 0.06) inset;
  white-space: nowrap;
  user-select: none;
}

/* 标签爆发混沌状态 */
.tag-chaos .tag-text {
  animation: chaosFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

/* 标签整列状态 */
.tag-aligned .tag-text {
  transform: scale(0.9);
  animation: none;
  pointer-events: none;
}

/* 标签呼吸效果 */
.tag-breathing .tag-text {
  animation: gentleBreath 4s ease-in-out infinite;
}

/* 简介容器 */
.artist-bio-container {
  width: min(70vw, 800px);
  margin: 2rem auto 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.bio-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 简介内容样式 */
.bio-content {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(255, 255, 255, 0.05) inset;
}

/* 字数自适应文字大小 */
.bio-large-text .bio-text {
  font-size: 1.5rem;
  line-height: 1.6;
  max-width: 68ch;
  margin: 0 auto;
}

.bio-small-text .bio-text {
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 68ch;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* ========== 动画关键帧 ========== */

@keyframes chaosFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  }
  25% {
    transform: translateY(-8px) rotate(2deg);
    filter: drop-shadow(0 0 12px rgba(173, 216, 230, 0.4));
  }
  50% {
    transform: translateY(4px) rotate(-1deg);
    filter: drop-shadow(0 0 10px rgba(221, 160, 221, 0.4));
  }
  75% {
    transform: translateY(-6px) rotate(1deg);
    filter: drop-shadow(0 0 14px rgba(255, 182, 193, 0.4));
  }
}

@keyframes gentleBreath {
  0%, 100% {
    transform: scale(0.9) translateY(0px);
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.2));
  }
  50% {
    transform: scale(0.92) translateY(-2px);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .identity-tag {
    font-size: 0.8rem;
  }
  
  .tag-text {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .bio-large-text .bio-text {
    font-size: 1.2rem;
  }
  
  .bio-small-text .bio-text {
    font-size: 1rem;
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 480px) {
  .identity-tags-area {
    height: 60px;
  }
  
  .tag-text {
    padding: 4px 8px;
    font-size: 0.7rem;
  }
  
  .artist-bio-container {
    width: 90vw;
  }
}

/* 波形过渡通用样式 */
.section-wave {
  position: absolute;
  left: 0;
  width: 100%;
  height: 120px;
  pointer-events: none;
  background-repeat: no-repeat;
  background-size: cover;
}

/* 顶部波形：与上一部分深色背景衔接 */
.section-wave-top {
  top: -1px;
  transform: translateY(-100%); /* 将波形放在上一节内 */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1440v40c-120 24-240 48-360 56s-240 0-360-16S480 40 360 24 120 8 0 0z' fill='%230d1b2b'/%3E%3C/svg%3E");
}

/* 底部波形：淡入下一节浅背景 */
.section-wave-bottom {
  bottom: -1px;
  transform: rotate(180deg) translateY(-100%);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1440v40c-120 24-240 48-360 56s-240 0-360-16S480 40 360 24 120 8 0 0z' fill='%23ffffff'/%3E%3C/svg%3E");
}

/* 让音乐区去掉默认 padding 以无缝衔接 */
#music.section-padding {
  padding-top: 0;
  padding-bottom: 0;
}

/* ---------- Tooltip 样式（高级毛玻璃 + 上方展示 + 细节箭头） ---------- */
.tag-tooltip {
  display:none;
  position:absolute;
  bottom: calc(100% + 12px); /* 默认向上展示 */
  left:50%;
  transform: translateX(-50%);

  /* 毛玻璃渐变卡片 */
  padding:12px 18px;
  min-width:220px;
  max-width:260px;
  text-align:center;
  font-size:0.8rem;
  line-height:1.5;
  color:#111;

  background:radial-gradient(circle at top left,rgba(255,255,255,0.65),rgba(255,255,255,0.4));
  backdrop-filter:blur(18px) saturate(150%);
  border:1px solid rgba(255,255,255,0.35);
  border-radius:14px;
  box-shadow:0 6px 24px rgba(0,0,0,0.18),0 2px 6px rgba(255,255,255,0.12) inset;

  pointer-events:none;
  z-index:2100;
}

/* 箭头 */
.tag-tooltip::after{
  content:"";
  position:absolute;
  top:100%;
  left:50%;
  transform:translateX(-50%);
  width:14px;
  height:14px;
  background:inherit;
  border-left:inherit;
  border-bottom:inherit;
  transform: translateX(-50%) rotate(45deg);
  filter: blur(0.2px);
}

/* data-pos="down" 可切换到下方展示 */
.identity-tag[data-pos="down"] .tag-tooltip{
  top: calc(100% + 12px);
  bottom:auto;
}
.identity-tag[data-pos="down"] .tag-tooltip::after{
  top:auto;
  bottom:100%;
  transform: translateX(-50%) rotate(225deg);
}

.identity-tag:hover .tag-tooltip{display:block;}

/* 左侧背景图片层级降低并禁用交互 */
.hero-background-right{
  z-index:100; /* 背景高于主体底色但低于标签/tooltip */
  pointer-events:none;
}

</style>
 