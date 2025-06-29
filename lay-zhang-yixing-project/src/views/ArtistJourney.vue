<template>
    <div class="artist-journey">
       <!-- 可选的白色渐变背景 -->
       <ArtistJourneyBackground :show-gradient="false" />
       
       <!-- 鼠标粒子交互背景 - 全屏效果，取消自动烟花 -->
  
       <!-- 霓虹玻璃右键菜单 -->
       <NeonGlassMenu :hue1="280" :hue2="220" />
      
      <!-- 导航栏 - 霓虹玻璃风格 -->
      <nav class="neon-navbar fixed top-0 w-full z-[100]">
        <!-- 发光效果层 -->
        <span class="navbar-shine navbar-shine-left"></span>
        <span class="navbar-shine navbar-shine-right"></span>
        <span class="navbar-glow navbar-glow-left"></span>
        <span class="navbar-glow navbar-glow-right"></span>
        
                 <div class="container mx-auto px-6 py-4 relative z-10">
          <div class="flex items-center justify-between">
            <div class="music-brand neon-brand">
              LAY 张艺兴
            </div>
            <div class="flex space-x-8 flex-1 justify-center">
              <a href="#home" class="nav-link neon-nav-link">首页</a>
              <router-link to="/home" class="nav-link neon-nav-link">主页</router-link>
              <router-link to="/music3d" class="nav-link neon-nav-link">音乐</router-link>
              <router-link to="/message-wall" class="nav-link neon-nav-link">留言</router-link>
              <a href="#about" class="nav-link neon-nav-link">关于</a>
              <a href="#contact" class="nav-link neon-nav-link">联系</a>
            </div>
            <div class="flex items-center gap-4">
              <button id="menu-toggle" class="md:hidden neon-control-button" title="菜单">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- 主页 Hero Section -->
      <section id="home" class="h-screen flex items-center justify-center section-padding relative overflow-hidden hero-section" @click="handleHeroClick">
        <!-- 视差滚动背景 -->
        <div 
          class="page-header-bg"
          :style="{ 
            transform: `translate3d(0, ${parallaxOffset}px, 0)`
          }"
        >
          <!-- 滤镜层 -->
          <div class="filter"></div>
          
          <!-- 雾效果 -->
          <div class="fog-low">
            <img src="http://demos.creative-tim.com/paper-kit-2/assets/img/fog-low.png" alt="">
          </div>
          <div class="fog-low right">
            <img src="http://demos.creative-tim.com/paper-kit-2/assets/img/fog-low.png" alt="">
          </div>
          
          <!-- 移动云层 -->
          <div 
            class="moving-clouds" 
            style="background-image: url('http://demos.creative-tim.com/paper-kit-2/assets/img/clouds.png');"
          ></div>
        </div>
        
        <div class="container flex items-center relative z-10">
          <!-- 个人简介右侧展示，避免与背景重叠 -->
          <div class="max-w-4xl text-center px-8 py-8 ml-auto mr-8 md:mr-16 lg:mr-20">
            <!-- 装饰线条 -->
            <div class="decorative-line mb-8 flex justify-center">
              <span class="line"></span>
              <span class="dot"></span>
              <span class="line"></span>
            </div>
            
            <!-- 主标题打字效果 - 上移8vh为标签预留空间 -->
            <div class="title-container mb-2 relative" :class="{ 'title-lifted': animationState >= 1 }">
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
              @wheel="handleBioWheelAcceleration"
            >
              <div class="bio-content px-6 py-4">
                <p class="bio-text bio-typing-text leading-relaxed whitespace-pre-line" ref="bioTextElement">
                  <!-- 内容通过打字效果动态填充 -->
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 下滑提示 - 只在标签整列完成后显示 -->
        <div 
          class="scroll-hint"
          :class="{ 'scroll-hint-visible': animationState === 1 && revealedCount >= identityTags.length && !hasScrolled }"
        >
          <div class="scroll-hint-content">
            <span class="scroll-hint-text">向下滚动查看更多</span>
          </div>
        </div>
        
        <!-- 生平介绍完成后的下滑提示 -->
        <div 
          v-if="animationState === 3 && bioTypingCompleted && !hasScrolledToCarousel"
          class="scroll-hint scroll-hint-visible"
          style="bottom: 4vh;"
        >
          <div class="scroll-hint-content">
            <span class="scroll-hint-text">继续探索更多精彩内容</span>
          </div>
        </div>
        

      </section>

      <!-- 节选作品区域 -->
      <FeaturedWorks ref="featuredWorksRef" />
  
      <!-- 移动端菜单 -->
      <div id="mobile-menu" class="fixed inset-0 z-[110] hidden md:hidden">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeMobileMenu"></div>
        <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-xl font-bold text-gray-900">菜单</h3>
            <button @click="closeMobileMenu" class="control-button" title="菜单">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav class="space-y-6">
            <a href="#home" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">首页</a>
            <router-link to="/home" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">主页</router-link>
            <router-link to="/music3d" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">音乐</router-link>
            <router-link to="/message-wall" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">留言</router-link>
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
import FeaturedWorks from '@/components/FeaturedWorks.vue'
import NeonGlassMenu from '@/components/NeonGlassMenu.vue'
import ArtistJourneyBackground from '@/components/ArtistJourneyBackground.vue'
import identityTagsData, { artistBiography } from '@/data/identityTags'

// 样式导入
import '@/styles/debug.css'
import '@/styles/index.css'

// Vue 核心导入
import { onMounted, onUnmounted, ref, reactive, computed, watchEffect, watch } from 'vue'
import { useRouter } from 'vue-router'

// ========== 路由和初始化 ==========
const router = useRouter()



// ========== 高级交互动效状态管理 ==========
const animationState = ref(0) // 0: 初始, 1: 爆发, 2: 整列, 3: 简介显示
const identityTags = computed(() => identityTagsData) // 身份标签
const bioText = computed(() => artistBiography) // 简介
const hasScrolled = ref(false) // 用户是否已经滚动

// ========== 视差滚动效果状态 ==========
const parallaxOffset = ref(0) // 视差滚动偏移量

// ========== 节选作品相关状态 ==========
const bioTypingCompleted = ref(false)
const hasScrolledToCarousel = ref(false)
const featuredWorksRef = ref<InstanceType<typeof FeaturedWorks> | null>(null)

// ========== 生平介绍打字效果 ==========
const bioContainer = ref<HTMLElement | null>(null)
const bioTextElement = ref<HTMLElement | null>(null)
let bioTypingSpeed = ref(80) // 打字速度，值越小越快
let bioTypingInterval: number | null = null
let isBioTyping = ref(false)

// 滚轮加速相关状态
const wheelAccelerationLevel = ref(0) // 当前加速等级
const maxAccelerationLevel = 8 // 最大加速等级
const baseTypingSpeed = 80 // 基础打字速度
const minTypingSpeed = 10 // 最快打字速度
let wheelTimeout: number | null = null // 用于重置加速等级的计时器

// 渲染与物理状态
const revealedCount = ref(0)
interface TagPhysics { x:number; y:number; vx:number; vy:number; rotation:number; visible:boolean }

// 标签物理状态数组
const tagPositions = reactive<TagPhysics[]>([])

// 初始化标签物理状态
const initializeTagPositions = () => {
  tagPositions.length = 0 // 清空数组
  tagPositions.push(...identityTags.value.map(() => ({ 
    x:0, y:-100, vx:0, vy:0, rotation:0, visible:false 
  })))
  revealedCount.value = 0 // 重置显示计数
}

// 监听语言切换，重新初始化标签物理状态
watchEffect(() => {
  if (identityTags.value.length > 0) {
    initializeTagPositions()
    // 重置动画状态
    animationState.value = 0
    bioTypingCompleted.value = false
    hasScrolled.value = false
    hasScrolledToCarousel.value = false
  }
})

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
 * 2 -> 3  简介淡入并开始打字
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
    // 开始生平介绍打字效果
    setTimeout(() => {
      startBioTyping()
    }, 500)
  }
}

/**
 * 开始生平介绍打字效果
 */
const startBioTyping = () => {
  if (!bioTextElement.value || isBioTyping.value) return
  
  isBioTyping.value = true
  const fullText = bioText.value
  bioTextElement.value.textContent = ''
  
  // 重置加速相关状态
  wheelAccelerationLevel.value = 0
  bioTypingSpeed.value = baseTypingSpeed
  
  let currentIndex = 0
  
  const typeNextChar = () => {
    if (currentIndex < fullText.length && bioTextElement.value) {
      bioTextElement.value.textContent += fullText.charAt(currentIndex)
      currentIndex++
      
      // 自动滚动到底部，确保最新打字内容可见
      if (bioContainer.value) {
        const bioContent = bioContainer.value.querySelector('.bio-content') as HTMLElement
        if (bioContent) {
          bioContent.scrollTop = bioContent.scrollHeight
        }
      }
      
      bioTypingInterval = setTimeout(typeNextChar, bioTypingSpeed.value)
    } else {
      isBioTyping.value = false
      bioTypingInterval = null
      bioTypingCompleted.value = true
      // 生平介绍打字完成后，设置节选作品的滚动监听
      setTimeout(() => {
        setupWorksScrollListener()
      }, 1000)
    }
  }
  
  typeNextChar()
}

/**
 * 滚轮递进加速打字效果
 */
const handleBioWheelAcceleration = (e: WheelEvent) => {
  if (!isBioTyping.value) return
  
  // 防止事件默认行为，避免页面滚动
  e.preventDefault()
  
  // 滚轮向下递进加速打字
  if (e.deltaY > 0) {
    wheelAccelerationLevel.value = Math.min(maxAccelerationLevel, wheelAccelerationLevel.value + 1)
  }
  // 滚轮向上减少加速等级
  else if (e.deltaY < 0) {
    wheelAccelerationLevel.value = Math.max(0, wheelAccelerationLevel.value - 1)
  }
  
  // 根据加速等级计算打字速度（指数递减）
  const speedMultiplier = Math.pow(0.7, wheelAccelerationLevel.value)
  bioTypingSpeed.value = Math.max(minTypingSpeed, baseTypingSpeed * speedMultiplier)
  
  // 清除之前的重置计时器
  if (wheelTimeout) {
    clearTimeout(wheelTimeout)
  }
  
  // 1.5秒后直接重置到原始速度
  wheelTimeout = setTimeout(() => {
    wheelAccelerationLevel.value = 0
    bioTypingSpeed.value = baseTypingSpeed
  }, 1500)
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
    hasScrolled.value = true
    progressStage()
    
    // 视差滚动效果
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    parallaxOffset.value = scrollTop / 3 // 视差效果，背景移动速度为滚动速度的1/3
    
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
      hasScrolled.value = true
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

/**
 * 设置节选作品的滚动监听
 */
const setupWorksScrollListener = () => {
  const handleWorksScroll = () => {
    if (bioTypingCompleted.value && !hasScrolledToCarousel.value) {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      if (scrollY > windowHeight * 0.5) {
        hasScrolledToCarousel.value = true
        featuredWorksRef.value?.show()
        window.removeEventListener('scroll', handleWorksScroll)
      }
    }
  }
  
  const handleWorksWheel = (e: WheelEvent) => {
    if (bioTypingCompleted.value && !hasScrolledToCarousel.value && e.deltaY > 0) {
      hasScrolledToCarousel.value = true
      featuredWorksRef.value?.show()
      window.removeEventListener('wheel', handleWorksWheel)
    }
  }
  
  window.addEventListener('scroll', handleWorksScroll, { passive: true })
  window.addEventListener('wheel', handleWorksWheel, { passive: true })
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

// ========== 节选作品相关方法 ==========
// 节选作品相关方法已迁移到 FeaturedWorks 组件
  
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
      if (!hasTyped) {
        hasTyped = true
        startTypewriter()
      }
    }, 500) // 页面加载后立即开始打字效果
    
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
  
  // 获取原始文本，如果为空则使用默认值
  const originalText = typewriterText.value.textContent?.trim() || 'LAY ZHANG'
  
  // 清空内容并添加样式
  typewriterText.value.textContent = ''
  typewriterText.value.classList.add('typing')
  
  let i = 0
  const typeInterval = setInterval(() => {
    if (i < originalText.length) {
      if (typewriterText.value) {
        typewriterText.value.textContent += originalText.charAt(i)
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
let hasTyped = false // 防止重复执行
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasTyped) {
      hasTyped = true
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
  
  // 清理生平介绍打字定时器
  if (bioTypingInterval) {
    clearTimeout(bioTypingInterval)
    bioTypingInterval = null
  }
  
  // 清理滚轮加速重置定时器
  if (wheelTimeout) {
    clearTimeout(wheelTimeout)
    wheelTimeout = null
  }
})

</script>
 
<style scoped>
/* 确保主容器相对定位 */
.artist-journey {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动条 */
  padding-top: 0; /* 移除顶部间距，让导航栏完全覆盖背景 */
}

/* Hero Section 样式 - 背景延伸到顶部，内容避开导航栏 */
.hero-section {
  /* 背景从顶部开始 */
  margin-top: 0;
  /* 内容区域避开导航栏 */
  padding-top: 80px;
}

/* ========== 高级交互动效样式 ========== */

/* 主标题上移动画 */
.title-container {
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.title-lifted {
  transform: translateY(-8vh); /* 减少上移距离，让标题和标签更靠近 */
}

/* 身份标签容器 */
.identity-tags-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  margin: 0.5rem 0 0.5rem; /* 减少上边距，让标签更靠近标题 */
  overflow: visible; /* 允许 tooltip 溢出显示 */
  z-index: 1000; /* 低于导航栏但高于其他内容 */
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

/* 标签整列状态 - 静止但保持发光效果 */
.tag-aligned .tag-text {
  animation: none;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

/* 标签呼吸效果 - 整列后保持精致静止状态 */
.tag-breathing .tag-text {
  animation: none; /* 移除动画，保持精致静止 */
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  /* 添加微妙的静态发光效果 */
  box-shadow: 
    0 0 12px rgba(255, 255, 255, 0.15),
    0 2px 8px rgba(255, 255, 255, 0.1) inset;
}

/* 简介容器 */
.artist-bio-container {
  width: min(70vw, 800px);
  max-height: 60vh;
  margin: 2rem auto 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
}

.bio-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 简介内容样式 */
.bio-content {
  max-height: 50vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(30, 41, 59, 0.3) transparent;
}

/* 滚动条样式 - 隐藏滚动条但保留滚动功能 */
.bio-content {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

.bio-content::-webkit-scrollbar {
  width: 0; /* Chrome, Safari and Opera */
  display: none;
}

/* 生平介绍专用样式 */
.bio-typing-text {
  color: rgba(30, 41, 59, 0.9) !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.3px;
}

/* 字数自适应文字大小 */
.bio-large-text .bio-text {
  font-size: 1.5rem;
  line-height: 1.8;
  max-width: 68ch;
  margin: 0 auto;
}

.bio-small-text .bio-text {
  font-size: 1.25rem;
  line-height: 1.8;
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
    line-height: 1.7;
  }
  
  .bio-small-text .bio-text {
    font-size: 1rem;
    line-height: 1.7;
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

/* ========== 下滑提示样式 ========== */
.scroll-hint {
  position: fixed;
  bottom: 8vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.scroll-hint-visible {
  opacity: 1;
  visibility: visible;
}

.scroll-hint-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-hint-text {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
  user-select: none;
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .scroll-hint {
    bottom: 6vh;
  }
  
  .scroll-hint-content {
    padding: 12px 18px;
  }
  
  .scroll-hint-text {
    font-size: 0.8rem;
  }
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
  z-index:1100;
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



/* 节选作品相关样式已迁移到 FeaturedWorks 组件 */

/* ========== 霓虹玻璃导航栏样式 ========== */

/* 导航栏基础样式 - 完全透明融入背景 */
.neon-navbar {
  --navbar-hue1: 280;
  --navbar-hue2: 220;
  --navbar-border: 1px;
  --navbar-border-color: rgba(255, 255, 255, 0.08);
  --navbar-radius: 0px;
  
  /* 完全透明背景，自然融入页面背景 */
  background: transparent !important;
  
  /* 移除毛玻璃效果，让背景完全透明 */
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  
  /* 移除边框 */
  border: none !important;
  border-radius: var(--navbar-radius);
  
  /* 移除阴影 */
  box-shadow: none !important;
  
  /* 固定定位，确保不会滑动消失 */
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  
  /* 液态动画效果 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  /* 确保导航栏始终可见 */
  transform: translateY(0) !important;
  opacity: 1 !important;
}

/* 确保导航栏内部容器也透明 */
.neon-navbar .container {
  background: transparent !important;
}

.neon-navbar .container > div {
  background: transparent !important;
}

/* 覆盖components.css中nav的默认样式 */
nav.neon-navbar {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
}

/* 移除发光效果，保持简洁 */
.navbar-shine,
.navbar-glow {
  display: none;
}

/* 品牌文字样式 - 增强对比度适应透明背景 */
.neon-brand {
  color: #ffffff !important;
  font-weight: 700;
  font-size: 1.5rem;
  /* 覆盖components.css中的渐变背景设置 */
  background: none !important;
  -webkit-background-clip: unset !important;
  background-clip: unset !important;
  -webkit-text-fill-color: #ffffff !important;
  /* 添加文字阴影确保在任何背景下都清晰可见 */
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 1px 2px rgba(0, 0, 0, 0.6);
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
  animation: none;
}

/* 覆盖music-brand的样式 */
.music-brand.neon-brand {
  color: #ffffff !important;
  background: none !important;
  -webkit-background-clip: unset !important;
  background-clip: unset !important;
  -webkit-text-fill-color: #ffffff !important;
}

/* 导航链接样式 - 适应透明背景 */
.neon-nav-link {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  /* 添加文字阴影确保清晰可见 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.neon-nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  transition: left 0.5s ease;
}

.neon-nav-link:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.neon-nav-link:hover::before {
  left: 100%;
}

/* 控制按钮样式 - 适应透明背景 */
.neon-control-button {
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: none;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.neon-control-button:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(255, 255, 255, 0.3);
}

/* 液态玻璃动画关键帧 */
@keyframes liquidShine {
  0%, 100% {
    opacity: 0.4;
    transform: translateX(-30px) scale(0.95);
  }
  33% {
    opacity: 0.7;
    transform: translateX(10px) scale(1.02);
  }
  66% {
    opacity: 0.5;
    transform: translateX(25px) scale(0.98);
  }
}

@keyframes liquidGlow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.9) rotate(0deg);
  }
  25% {
    opacity: 0.6;
    transform: scale(1.05) rotate(1deg);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1) rotate(0deg);
  }
  75% {
    opacity: 0.5;
    transform: scale(0.95) rotate(-1deg);
  }
}

@keyframes liquidBrandGlow {
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.2));
    text-shadow: 
      0 0 20px rgba(0, 0, 0, 0.3),
      0 2px 4px rgba(255, 255, 255, 0.1);
  }
  50% {
    filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.4));
    text-shadow: 
      0 0 30px rgba(0, 0, 0, 0.5),
      0 2px 8px rgba(255, 255, 255, 0.15);
  }
}

/* 液态玻璃导航栏响应式优化 */
@media (max-width: 768px) {
  .neon-navbar {
    --navbar-radius: 0px;
    margin: 0; /* 移除边距，保持全宽 */
    width: 100%;
    left: 0;
    right: 0;
  }
  
  .artist-journey {
    padding-top: 0; /* 移动端也移除顶部间距 */
  }
  
  .hero-section {
    padding-top: 80px; /* 移动端保持导航栏高度 */
  }
  
  .navbar-shine,
  .navbar-glow {
    width: 120px;
  }
  
  .neon-brand {
    font-size: 1.25rem;
  }
  
  .neon-nav-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .neon-navbar {
    --navbar-radius: 0px;
    margin: 0;
    width: 100%;
    /* 移动端也保持完全透明 */
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  .artist-journey {
    padding-top: 0;
  }
  
  .hero-section {
    padding-top: 80px; /* 小屏幕也保持导航栏高度 */
  }
  
  .navbar-shine,
  .navbar-glow {
    display: none; /* 移动端禁用发光效果以提升性能 */
  }
  
  .neon-brand {
    font-size: 1.125rem;
  }
}

/* ========== 预加载器样式 ========== */



/* 响应式优化 */
@media (max-width: 768px) {
  #pre-load .loader-inner {
    height: 200px;
  }
  
  #pre-load .loader-inner .loader-logo {
    width: 60px;
    height: 60px;
  }
  
  #pre-load .loader-inner .loader-logo .logo-img {
    width: 45px;
    height: 45px;
  }
  
  .brand-logo {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  #pre-load .loader-inner {
    height: 180px;
  }
  
  .brand-logo {
    width: 24px;
    height: 24px;
  }
}

/* ========== 语言切换按钮响应式优化 ========== */

@media (max-width: 1024px) {
  .neon-navbar .flex.items-center.gap-4 {
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .neon-navbar .flex.space-x-8 {
    display: none; /* 隐藏桌面导航，显示移动端菜单 */
  }
  
  .neon-navbar .flex.items-center.gap-4 {
    gap: 0.5rem;
  }
  
  /* 移动端导航栏布局调整 */
  .neon-navbar .container .flex.items-center.justify-between {
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .neon-navbar .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .neon-brand {
    font-size: 1.125rem;
  }
  
  .neon-brand .brand-logo {
    width: 20px;
    height: 20px;
  }
}

/* 移动端语言切换样式 */
#mobile-menu .language-switcher {
  width: 100%;
}

#mobile-menu .language-button {
  width: 100%;
  justify-content: space-between;
}

/* ========== 云雾特效样式 ========== */

/* 视差背景容器 */
.page-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  will-change: transform;
  background-image: url('/img/ddee8f80-67aa-434a-8880-6b73179f0530.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

/* 滤镜层 */
.filter {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
  z-index: 1;
}

/* 雾效果 */
.fog-low {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  z-index: 2;
  opacity: 0.8;
}

.fog-low img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fog-low.right {
  right: 0;
  left: auto;
}

/* 移动云层 */
.moving-clouds {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 250.625em;
  height: 43.75em;
  -webkit-animation: cloudLoop 80s linear infinite;
  animation: cloudLoop 80s linear infinite;
}

/* 云层循环动画 */
@keyframes cloudLoop {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .page-header-bg {
    background-attachment: scroll; /* 移动设备上禁用固定背景 */
  }
  
  .moving-clouds {
    width: 200em;
    height: 35em;
  }
  
  .fog-low {
    height: 40px;
  }
}

@media (max-width: 480px) {
  .fog-low {
    height: 30px;
  }
  
  .moving-clouds {
    display: none; /* 小屏幕隐藏云层以提升性能 */
  }
}

</style>
 