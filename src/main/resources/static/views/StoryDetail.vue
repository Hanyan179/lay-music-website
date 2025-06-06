<template>
  <div class="story-detail-container">
    <!-- 背景效果 -->
    <div class="background-effects">
      <div class="story-bg" :style="{ background: currentStory?.gradient }"></div>
      <div class="overlay-pattern"></div>
      <canvas ref="particlesCanvas" class="particles-canvas"></canvas>
    </div>

    <!-- 导航栏 -->
    <nav class="story-nav">
      <div class="nav-container">
        <button @click="goBack" class="nav-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span>返回故事列表</span>
        </button>
        <div class="nav-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${scrollProgress}%` }"></div>
          </div>
          <span class="progress-text">{{ Math.round(scrollProgress) }}%</span>
        </div>
      </div>
    </nav>

    <!-- 故事头部 -->
    <header class="story-header">
      <div class="header-container">
        <div class="header-content">
          <div class="story-meta">
            <span class="story-category">{{ currentStory?.categoryName }}</span>
            <span class="story-year">{{ currentStory?.year }}</span>
          </div>
          <h1 class="story-title">{{ currentStory?.title }}</h1>
          <p class="story-subtitle">{{ currentStory?.description }}</p>
          <div class="story-stats">
            <div class="stat-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>{{ currentStory?.eventCount }} 个事件</span>
            </div>
            <div class="stat-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3"/>
              </svg>
              <span>{{ currentStory?.readers }} 人阅读</span>
            </div>
            <div class="stat-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>4.8 评分</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 时间线内容 -->
    <main class="story-main">
      <div class="timeline-container">
        <div class="timeline-line"></div>
        
        <div 
          v-for="(event, index) in storyEvents" 
          :key="event.id"
          class="timeline-event"
          :class="{ 
            'event-visible': visibleEvents.includes(event.id),
            'event-left': index % 2 === 0,
            'event-right': index % 2 === 1
          }"
          :style="{ '--event-color': currentStory?.color }"
        >
          <div class="event-marker">
            <div class="marker-dot"></div>
            <div class="marker-ring"></div>
          </div>
          
          <div class="event-card">
            <div class="event-visual">
              <div class="event-image" :style="{ background: event.gradient }">
                <div class="event-overlay"></div>
                <div class="event-icon">{{ event.icon }}</div>
              </div>
            </div>
            
            <div class="event-content">
              <div class="event-header">
                <span class="event-date">{{ event.date }}</span>
                <span class="event-type">{{ event.type }}</span>
              </div>
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
              
              <div class="event-impact">
                <h4 class="impact-title">影响与意义</h4>
                <ul class="impact-list">
                  <li v-for="impact in event.impacts" :key="impact">{{ impact }}</li>
                </ul>
              </div>
              
              <div class="event-actions">
                <button @click="toggleDetails(event.id)" class="action-btn primary">
                  <span>{{ expandedEvents.includes(event.id) ? '收起' : '了解更多' }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path :d="expandedEvents.includes(event.id) ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'"/>
                  </svg>
                </button>
                <button class="action-btn secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- 展开的详细内容 -->
            <div v-if="expandedEvents.includes(event.id)" class="event-details">
              <div class="details-content">
                <div class="details-section">
                  <h4>背景信息</h4>
                  <p>{{ event.background || '这个事件发生在特定的历史背景下，是多种因素综合作用的结果。' }}</p>
                </div>
                <div class="details-section">
                  <h4>关键人物</h4>
                  <div class="key-figures">
                    <div v-for="figure in event.keyFigures || []" :key="figure.name" class="figure-item">
                      <div class="figure-avatar">{{ figure.name.charAt(0) }}</div>
                      <div class="figure-info">
                        <div class="figure-name">{{ figure.name }}</div>
                        <div class="figure-role">{{ figure.role }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="details-section">
                  <h4>相关资源</h4>
                  <div class="resources">
                    <a href="#" class="resource-link">深度文章</a>
                    <a href="#" class="resource-link">相关视频</a>
                    <a href="#" class="resource-link">历史文档</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 相关故事推荐 -->
    <section class="related-stories">
      <div class="related-container">
        <h2 class="related-title">相关故事推荐</h2>
        <div class="related-grid">
          <div 
            v-for="story in relatedStories" 
            :key="story.id"
            class="related-card"
            @click="goToStory(story.id)"
          >
            <div class="related-visual" :style="{ background: story.gradient }">
              <div class="related-overlay"></div>
            </div>
            <div class="related-content">
              <div class="related-year">{{ story.year }}</div>
              <h3 class="related-title-text">{{ story.title }}</h3>
              <p class="related-description">{{ story.shortDescription }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const particlesCanvas = ref(null)
const scrollProgress = ref(0)
const visibleEvents = ref([])
const expandedEvents = ref([])

// 当前故事数据
const currentStory = ref({
  id: 1,
  title: '互联网的诞生',
  description: '从ARPANET到万维网，见证信息时代的黎明。探索那些改变世界连接方式的关键时刻。',
  year: 1969,
  categoryName: '科技革命',
  eventCount: 12,
  color: '#6366f1',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  readers: 1247
})

// 故事事件数据
const storyEvents = reactive([
  {
    id: 1,
    date: '1969年10月29日',
    type: '网络连接',
    title: 'ARPANET首次连接成功',
    description: '加州大学洛杉矶分校与斯坦福研究院之间建立了第一个ARPANET连接，标志着互联网的诞生。',
    icon: '🌐',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    impacts: [
      '建立了分组交换网络的基础',
      '证明了远程计算机通信的可行性',
      '为现代互联网奠定了技术基础'
    ],
    background: '冷战时期，美国国防部需要一个能够在核攻击后仍能正常运行的通信网络。',
    keyFigures: [
      { name: 'Leonard Kleinrock', role: 'UCLA教授，分组交换理论奠基人' },
      { name: 'Charley Kline', role: '发送第一条ARPANET消息的学生' }
    ]
  },
  {
    id: 2,
    date: '1971年',
    type: '电子邮件',
    title: '第一封电子邮件发送',
    description: 'Ray Tomlinson发送了历史上第一封电子邮件，并引入了@符号来分隔用户名和主机名。',
    icon: '📧',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    impacts: [
      '创立了现代电子邮件系统',
      '引入了@符号作为邮件地址标识',
      '为远程协作提供了新的工具'
    ]
  },
  {
    id: 3,
    date: '1973年',
    type: '协议发展',
    title: 'TCP/IP协议概念提出',
    description: 'Vint Cerf和Bob Kahn提出了TCP/IP协议的概念，为网络间通信提供了标准化解决方案。',
    icon: '🔗',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    impacts: [
      '统一了网络通信标准',
      '实现了不同网络间的互联',
      '为全球互联网奠定了协议基础'
    ]
  },
  {
    id: 4,
    date: '1989年',
    type: '万维网',
    title: 'Tim Berners-Lee发明万维网',
    description: '在CERN工作的Tim Berners-Lee提出了万维网的概念，并创建了第一个网站。',
    icon: '🌍',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    impacts: [
      '创建了现代网页浏览体验',
      '引入了HTML、HTTP、URL概念',
      '使互联网对普通用户变得友好'
    ]
  },
  {
    id: 5,
    date: '1995年',
    type: '商业化',
    title: '互联网商业化开始',
    description: 'NSF解除了对ARPANET商业使用的限制，互联网开始向商业化发展。',
    icon: '💼',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    impacts: [
      '开启了互联网商业时代',
      '催生了电子商务的发展',
      '为数字经济奠定了基础'
    ]
  }
])

// 相关故事
const relatedStories = reactive([
  {
    id: 4,
    title: '智能手机革命',
    year: 2007,
    shortDescription: 'iPhone发布如何改变了整个世界',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 6,
    title: '加密货币兴起',
    year: 2009,
    shortDescription: '比特币诞生，开启数字货币新纪元',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    id: 3,
    title: '人类基因组计划',
    year: 1990,
    shortDescription: '破译生命密码，开启精准医学新时代',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
])

// 粒子系统
let animationFrame = null
let particles = []

// 方法
const goBack = () => {
  router.push({ name: 'timeline-stories' })
}

const goToStory = (storyId) => {
  router.push({ name: 'story-detail', params: { id: storyId } })
}

const toggleDetails = (eventId) => {
  const index = expandedEvents.value.indexOf(eventId)
  if (index > -1) {
    expandedEvents.value.splice(index, 1)
  } else {
    expandedEvents.value.push(eventId)
  }
}

// 滚动进度计算
const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
}

// 可见性检测
const checkVisibility = () => {
  const events = document.querySelectorAll('.timeline-event')
  events.forEach(event => {
    const rect = event.getBoundingClientRect()
    const eventId = parseInt(event.querySelector('.event-card').dataset.eventId || event.getAttribute('data-event-id'))
    
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
      if (!visibleEvents.value.includes(eventId)) {
        visibleEvents.value.push(eventId)
      }
    }
  })
}

// 粒子系统初始化
const initParticles = () => {
  const canvas = particlesCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  particles = []
  const particleCount = 20
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.2 + 0.1
    })
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}

onMounted(() => {
  setTimeout(() => {
    initParticles()
    checkVisibility()
  }, 100)
  
  window.addEventListener('scroll', updateScrollProgress)
  window.addEventListener('scroll', checkVisibility)
  
  // 添加事件ID到DOM元素
  setTimeout(() => {
    const eventCards = document.querySelectorAll('.event-card')
    eventCards.forEach((card, index) => {
      card.dataset.eventId = storyEvents[index]?.id
    })
  }, 200)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('scroll', checkVisibility)
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.story-detail-container {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  position: relative;
  overflow-x: hidden;
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

.story-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60vh;
  opacity: 0.1;
}

.overlay-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
}

.particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 导航栏 */
.story-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

.nav-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-back:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-2px);
}

.nav-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.1s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  min-width: 40px;
}

/* 故事头部 */
.story-header {
  position: relative;
  z-index: 10;
  padding: 8rem 2rem 4rem;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-content {
  max-width: 800px;
}

.story-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.story-category {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.story-year {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.story-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.story-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 3rem 0;
}

.story-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.stat-item svg {
  width: 18px;
  height: 18px;
}

/* 时间线主体 */
.story-main {
  position: relative;
  z-index: 10;
  padding: 4rem 2rem;
}

.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent 0%, #6366f1 10%, #8b5cf6 90%, transparent 100%);
  transform: translateX(-50%);
}

.timeline-event {
  position: relative;
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.timeline-event.event-visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline-event.event-left {
  padding-right: 50%;
}

.timeline-event.event-right {
  padding-left: 50%;
}

.event-marker {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.marker-dot {
  width: 16px;
  height: 16px;
  background: var(--event-color, #6366f1);
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.8);
  animation: pulse 2s ease-in-out infinite;
}

.marker-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 32px;
  height: 32px;
  border: 2px solid var(--event-color, #6366f1);
  border-radius: 50%;
  opacity: 0.3;
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.event-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin: 0 2rem;
}

.event-left .event-card {
  margin-right: 4rem;
}

.event-right .event-card {
  margin-left: 4rem;
}

.event-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.event-visual {
  position: relative;
  height: 200px;
}

.event-image {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%);
}

.event-icon {
  font-size: 3rem;
  position: relative;
  z-index: 2;
}

.event-content {
  padding: 2rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.event-date {
  font-weight: 700;
  color: var(--event-color, #6366f1);
  font-size: 0.9rem;
}

.event-type {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.event-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.event-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.event-impact {
  margin-bottom: 2rem;
}

.impact-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.impact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.impact-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.impact-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--event-color, #6366f1);
  font-weight: bold;
}

.event-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: var(--event-color, #6366f1);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem;
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 事件详情展开 */
.event-details {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.details-content {
  padding: 2rem;
}

.details-section {
  margin-bottom: 2rem;
}

.details-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.details-section p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
}

.key-figures {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.figure-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.figure-avatar {
  width: 40px;
  height: 40px;
  background: var(--event-color, #6366f1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.figure-name {
  font-weight: 600;
  color: white;
}

.figure-role {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.resources {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.resource-link {
  color: var(--event-color, #6366f1);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid var(--event-color, #6366f1);
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.resource-link:hover {
  background: var(--event-color, #6366f1);
  color: white;
}

/* 相关故事推荐 */
.related-stories {
  position: relative;
  z-index: 10;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.related-container {
  max-width: 1200px;
  margin: 0 auto;
}

.related-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 3rem 0;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.related-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.related-visual {
  height: 150px;
  position: relative;
}

.related-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%);
}

.related-content {
  padding: 1.5rem;
}

.related-year {
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.related-title-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.related-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-progress {
    order: -1;
  }

  .progress-bar {
    width: 150px;
  }

  .story-header {
    padding: 6rem 1rem 3rem;
  }

  .story-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .timeline-line {
    left: 2rem;
  }

  .timeline-event {
    padding-left: 4rem !important;
    padding-right: 1rem !important;
  }

  .event-marker {
    left: 2rem;
  }

  .event-card {
    margin: 0 !important;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .event-actions {
    flex-direction: column;
  }

  .key-figures {
    gap: 0.75rem;
  }

  .resources {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style> 