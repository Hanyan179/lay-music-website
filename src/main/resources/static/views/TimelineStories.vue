<template>
  <div class="stories-container" ref="containerRef">
    <!-- 3D鼠标跟踪容器 -->
    <div class="mouse-tracker" ref="mouseTracker">
      <!-- 高级背景效果 -->
      <div class="background-effects">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="fluid-mesh"></div>
      </div>

      <!-- 高级粒子系统 -->
      <canvas ref="particlesCanvas" class="particles-canvas"></canvas>

      <!-- 主要内容 -->
      <main class="stories-main">
        <!-- 3D导航栏 -->
        <nav class="stories-nav">
          <div class="nav-container">
            <div class="nav-left">
              <button @click="goBack" class="nav-back">
                <div class="btn-content">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  <span>返回</span>
                </div>
              </button>
              <div class="nav-brand">
                <h1 class="nav-title">时间线故事</h1>
                <span class="nav-subtitle">Stories</span>
              </div>
            </div>
          </div>
        </nav>

        <!-- 3D英雄区域 -->
        <section class="stories-header">
          <div class="header-container">
            <div class="header-content">
              <div class="header-badge">
                <span class="badge-icon">✨</span>
                <span class="badge-text">精选历史故事</span>
              </div>
              <h1 class="header-title">
                探索改变世界的
                <span class="title-highlight">关键时刻</span>
              </h1>
              <p class="header-description">
                从科技革命到文化觉醒，每个故事都承载着历史的重量。
                深入了解那些塑造现代世界的决定性瞬间。
              </p>
              <div class="header-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ filteredStories.length }}</span>
                  <span class="stat-label">个故事</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">6</span>
                  <span class="stat-label">个分类</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">∞</span>
                  <span class="stat-label">种可能</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3D分类过滤器 -->
        <section class="filter-section">
          <div class="filter-container">
            <div class="filter-grid">
              <button 
                v-for="category in categories" 
                :key="category.id"
                @click="setActiveCategory(category.id)"
                :class="['filter-card', { active: activeCategory === category.id }]"
              >
                <div class="filter-content">
                  <div class="filter-icon">{{ category.icon }}</div>
                  <div class="filter-text">
                    <div class="filter-name">{{ category.name }}</div>
                    <div class="filter-count">{{ getCategoryCount(category.id) }} 个故事</div>
                  </div>
                  <div class="filter-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>

        <!-- 3D故事网格 -->
        <section class="stories-grid-section">
          <div class="grid-container">
            <div class="stories-grid">
              <div 
                v-for="(story, index) in filteredStories" 
                :key="story.id"
                class="story-card"
                :style="{ 
                  animationDelay: `${index * 0.1}s`,
                  '--story-color': story.color 
                }"
                @click="openStory(story)"
              >
                <div class="story-content">
                  <div class="story-header">
                    <div class="story-category">{{ story.categoryName }}</div>
                    <div class="story-year">{{ story.year }}</div>
                  </div>
                  
                  <div class="story-visual">
                    <div class="story-background" :style="{ background: story.gradient }"></div>
                  </div>

                  <div class="story-info">
                    <h3 class="story-title">{{ story.title }}</h3>
                    <p class="story-description">{{ story.description }}</p>
                    
                    <div class="story-meta">
                      <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        <span>{{ story.eventCount }} 个事件</span>
                      </div>
                      <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="m22 21-3-3"/>
                        </svg>
                        <span>{{ story.readers || Math.floor(Math.random() * 1000 + 100) }} 人阅读</span>
                      </div>
                    </div>

                    <button class="story-action">
                      <span>开始阅读</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3D底部CTA -->
        <section class="bottom-cta">
          <div class="cta-container">
            <div class="cta-content">
              <h2 class="cta-title">想要创建自己的故事？</h2>
              <p class="cta-description">加入我们，分享你的独特见解和历史故事</p>
              <button @click="goToCreate" class="cta-button">
                <span>开始创作</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Refs
const containerRef = ref(null)
const mouseTracker = ref(null)
const particlesCanvas = ref(null)

// 状态管理
const activeCategory = ref('all')
const mouse = reactive({
  x: 0,
  y: 0,
  normalized: { x: 0, y: 0 }
})

// 分类数据
const categories = reactive([
  { id: 'all', name: '全部', icon: '🌟' },
  { id: 'technology', name: '科技', icon: '💻' },
  { id: 'politics', name: '政治', icon: '🏛️' },
  { id: 'culture', name: '文化', icon: '🎭' },
  { id: 'science', name: '科学', icon: '🔬' },
  { id: 'economics', name: '经济', icon: '💰' }
])

// 故事数据
const stories = reactive([
  {
    id: 1,
    title: '互联网的诞生',
    description: '从ARPANET到万维网，见证信息时代的黎明。',
    year: 1969,
    category: 'technology',
    categoryName: '科技革命',
    eventCount: 12,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    readers: 1247
  },
  {
    id: 2,
    title: '柏林墙的倒塌',
    description: '冷战结束的象征，东西德统一的历史时刻。',
    year: 1989,
    category: 'politics',
    categoryName: '政治变革',
    eventCount: 8,
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    readers: 892
  },
  {
    id: 3,
    title: '人类基因组计划',
    description: '破译生命密码，开启精准医学新时代。',
    year: 1990,
    category: 'science',
    categoryName: '科学突破',
    eventCount: 15,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    readers: 654
  },
  {
    id: 4,
    title: '智能手机革命',
    description: 'iPhone发布如何改变了整个世界。',
    year: 2007,
    category: 'technology',
    categoryName: '科技革命',
    eventCount: 10,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    readers: 1543
  },
  {
    id: 5,
    title: '气候变化觉醒',
    description: '从《巴黎协定》到全球气候行动。',
    year: 2015,
    category: 'science',
    categoryName: '环境科学',
    eventCount: 9,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    readers: 1089
  },
  {
    id: 6,
    title: '加密货币兴起',
    description: '比特币诞生，开启数字货币新纪元。',
    year: 2009,
    category: 'economics',
    categoryName: '经济创新',
    eventCount: 14,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    readers: 1876
  }
])

// 计算属性
const filteredStories = computed(() => {
  if (activeCategory.value === 'all') {
    return stories
  }
  return stories.filter(story => story.category === activeCategory.value)
})

// 粒子系统
let particleSystem = null

const initParticles = () => {
  const canvas = particlesCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const particles = []
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // 创建粒子
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2
    })
  }
  
  const animate = () => {
    ctx.fillStyle = 'rgba(15, 15, 35, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = '#6366f1'
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    
    requestAnimationFrame(animate)
  }
  
  animate()
}

// 鼠标跟踪
const initMouseTracking = () => {
  const updateMouse = (e) => {
    if (!containerRef.value) return
    
    const rect = containerRef.value.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
    mouse.normalized.x = (mouse.x / rect.width) * 2 - 1
    mouse.normalized.y = -(mouse.y / rect.height) * 2 + 1
    
    // 应用3D变换
    if (mouseTracker.value) {
      const intensity = 10
      const rotateX = mouse.normalized.y * intensity
      const rotateY = mouse.normalized.x * intensity
      
      mouseTracker.value.style.transform = 
        `perspective(1000px) rotateX(${rotateX * 0.3}deg) rotateY(${rotateY * 0.3}deg)`
    }
  }
  
  containerRef.value.addEventListener('mousemove', updateMouse)
  containerRef.value.addEventListener('mouseleave', () => {
    if (mouseTracker.value) {
      mouseTracker.value.style.transform = ''
    }
  })
}

// 方法
const goBack = () => {
  router.push('/')
}

const goToCreate = () => {
  router.push('/')
}

const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId
}

const getCategoryCount = (categoryId) => {
  if (categoryId === 'all') return stories.length
  return stories.filter(story => story.category === categoryId).length
}

const openStory = (story) => {
  console.log('Opening story:', story.title)
}

// 生命周期
onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    initParticles()
    initMouseTracking()
  }, 100)
})
</script>

<style scoped>
/* 核心容器 */
.stories-container {
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at top left, #0a0a1a 0%, #000000 40%),
    radial-gradient(ellipse at bottom right, #1a0530 0%, #000000 40%),
    linear-gradient(135deg, #000000 0%, #0f0f23 100%);
  color: white;
  position: relative;
  overflow: hidden;
  perspective: 2000px;
  transform-style: preserve-3d;
}

.mouse-tracker {
  position: relative;
  min-height: 100vh;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
  will-change: transform;
}

/* 背景效果 */
.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  animation: orbFloat 8s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #6366f1 0%, #8b5cf6 50%, transparent 80%);
  top: 10%;
  left: 10%;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #8b5cf6 0%, #f43f5e 50%, transparent 80%);
  bottom: 20%;
  right: 15%;
  animation-delay: 2.7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #06b6d4 0%, #10b981 50%, transparent 80%);
  top: 60%;
  left: 70%;
  animation-delay: 5.4s;
}

@keyframes orbFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  33% { transform: translateY(-40px) scale(1.1); }
  66% { transform: translateY(30px) scale(0.9); }
}

.fluid-mesh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.01) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.01) 1px, transparent 1px);
  background-size: 80px 80px;
  animation: meshFlow 12s ease-in-out infinite;
}

@keyframes meshFlow {
  0%, 100% { 
    background-position: 0 0;
    opacity: 0.3;
  }
  50% { 
    background-position: 20px 20px;
    opacity: 0.6;
  }
}

/* 粒子画布 */
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: screen;
}

/* 导航栏 */
.stories-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%);
  backdrop-filter: blur(30px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-back {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 2px solid rgba(99, 102, 241, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-back:hover {
  transform: translateY(-3px);
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-brand {
  display: flex;
  flex-direction: column;
}

.nav-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleShimmer 3s ease-in-out infinite;
}

@keyframes titleShimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.nav-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* 英雄区域 */
.stories-header {
  padding: 6rem 2rem 4rem;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 2px solid rgba(99, 102, 241, 0.4);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  margin-bottom: 2.5rem;
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  font-size: 0.9rem;
  color: #6366f1;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.header-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 2rem 0;
  letter-spacing: -0.02em;
}

.title-highlight {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #06b6d4 50%, #10b981 75%, #f59e0b 100%);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: highlightFlow 4s ease-in-out infinite;
}

@keyframes highlightFlow {
  0%, 100% { background-position: 0% 50%; }
  33% { background-position: 100% 0%; }
  66% { background-position: 0% 100%; }
}

.header-description {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 0 0 4rem 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

/* 过滤器 */
.filter-section {
  padding: 4rem 2rem;
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.filter-card {
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
}

.filter-card:hover {
  border-color: rgba(99, 102, 241, 0.6);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.3);
}

.filter-card.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-color: rgba(99, 102, 241, 0.8);
  transform: translateY(-5px);
}

.filter-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-icon {
  font-size: 1.8rem;
  transition: transform 0.3s ease;
}

.filter-card:hover .filter-icon {
  transform: scale(1.1);
}

.filter-text {
  flex: 1;
}

.filter-name {
  font-weight: 700;
  color: white;
  margin-bottom: 0.3rem;
  font-size: 1.1rem;
}

.filter-count {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.filter-arrow {
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.filter-card:hover .filter-arrow {
  color: #6366f1;
  transform: translateX(5px);
}

/* 故事网格 */
.stories-grid-section {
  padding: 4rem 2rem;
}

.grid-container {
  max-width: 1200px;
  margin: 0 auto;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2.5rem;
}

.story-card {
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%);
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  animation: fadeInUp 0.8s ease forwards;
  opacity: 0;
  backdrop-filter: blur(25px);
}

.story-card:hover {
  border-color: rgba(99, 102, 241, 0.6);
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.story-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 1rem;
}

.story-category {
  font-size: 0.85rem;
  color: var(--story-color);
  background: rgba(255, 255, 255, 0.15);
  padding: 0.4rem 1rem;
  border-radius: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.story-year {
  font-size: 1.2rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
}

.story-visual {
  height: 220px;
  margin: 0 2rem 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.story-background {
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
}

.story-card:hover .story-background {
  transform: scale(1.08);
}

.story-info {
  padding: 0 2rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.story-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.story-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 0 0 1.5rem 0;
  flex: 1;
}

.story-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.story-action {
  background: linear-gradient(135deg, var(--story-color) 0%, rgba(139, 92, 246, 0.8) 100%);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
}

.story-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

/* 底部CTA */
.bottom-cta {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
}

.cta-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.cta-content {
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%);
  border: 2px solid rgba(99, 102, 241, 0.3);
  border-radius: 25px;
  padding: 4rem 3rem;
  backdrop-filter: blur(30px);
  transition: all 0.3s ease;
}

.cta-content:hover {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 30px 60px rgba(99, 102, 241, 0.3);
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 0 0 2.5rem 0;
  font-size: 1.1rem;
}

.cta-button {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
  border: none;
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 15px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.cta-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-left {
    width: 100%;
    justify-content: space-between;
  }

  .stories-header {
    padding: 4rem 1rem 3rem;
  }

  .header-title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .header-stats {
    gap: 2rem;
  }

  .filter-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .story-card {
    max-width: 400px;
    margin: 0 auto;
  }

  .cta-content {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }

  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .header-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .story-visual {
    height: 150px;
  }

  .cta-title {
    font-size: 1.8rem;
  }
}
</style> 