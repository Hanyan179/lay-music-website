<template>
  <div class="intro-container">
    <!-- 背景视觉效果 -->
    <div class="background-effects">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="mesh-pattern"></div>
    </div>

    <!-- 粒子系统 -->
    <canvas ref="particlesCanvas" class="particles-canvas"></canvas>

    <!-- 主要内容 -->
    <main class="intro-main">
      <!-- 导航栏 -->
      <nav class="intro-nav">
        <div class="nav-logo">
          <span class="logo-text">时间线</span>
        </div>
        <div class="nav-actions">
          <button @click="goBack" class="nav-link">返回首页</button>
        </div>
      </nav>

      <!-- 英雄区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-text">探索历史</span>
            <div class="badge-glow"></div>
          </div>
          
          <h1 class="hero-title">
            <span class="title-word" data-delay="0">时间</span>
            <span class="title-word" data-delay="100">的</span>
            <span class="title-word gradient-text" data-delay="200">故事</span>
          </h1>
          
          <p class="hero-subtitle">
            每一个瞬间都承载着改变世界的力量。从科技革命到文化觉醒，
            从政治变革到科学突破，探索那些塑造了我们今天的关键时刻。
          </p>

          <div class="hero-stats">
            <div class="stat-card" data-delay="300">
              <div class="stat-number">127+</div>
              <div class="stat-label">个故事</div>
            </div>
            <div class="stat-card" data-delay="400">
              <div class="stat-number">2024</div>
              <div class="stat-label">年跨度</div>
            </div>
            <div class="stat-card" data-delay="500">
              <div class="stat-number">1856+</div>
              <div class="stat-label">个事件</div>
            </div>
          </div>

          <div class="hero-actions">
            <button @click="goToStories" class="cta-primary">
              <span class="cta-text">开始探索</span>
              <div class="cta-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
              <div class="cta-glow"></div>
            </button>
            
            <button @click="scrollToFeatures" class="cta-secondary">
              <span class="cta-text">了解更多</span>
            </button>
          </div>
        </div>

        <!-- 视觉元素 -->
        <div class="hero-visual">
          <div class="visual-container">
            <div class="timeline-preview">
              <div class="timeline-line"></div>
              <div class="timeline-dot" data-year="1969"></div>
              <div class="timeline-dot" data-year="1989"></div>
              <div class="timeline-dot" data-year="2007"></div>
              <div class="timeline-dot" data-year="2024"></div>
            </div>
            <div class="floating-cards">
              <div class="preview-card card-1">
                <div class="card-content">
                  <div class="card-year">1969</div>
                  <div class="card-title">互联网诞生</div>
                </div>
              </div>
              <div class="preview-card card-2">
                <div class="card-content">
                  <div class="card-year">2007</div>
                  <div class="card-title">智能手机革命</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 特性区域 -->
      <section class="features-section" ref="featuresSection">
        <div class="features-container">
          <div class="section-header">
            <h2 class="section-title">为什么选择时间线故事？</h2>
            <p class="section-subtitle">沉浸式的历史体验，让每个重要时刻都栩栩如生</p>
          </div>

          <div class="features-grid">
            <div class="feature-card" data-delay="0">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <h3 class="feature-title">时间轴体验</h3>
              <p class="feature-description">以时间为主线，清晰展现历史事件的发展脉络和相互关系。</p>
            </div>

            <div class="feature-card" data-delay="100">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 class="feature-title">互动故事</h3>
              <p class="feature-description">不只是阅读，更是参与。每个故事都有丰富的互动元素和深度内容。</p>
            </div>

            <div class="feature-card" data-delay="200">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3 class="feature-title">精选内容</h3>
              <p class="feature-description">每个故事都经过精心挑选和专业编辑，确保内容的准确性和吸引力。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="cta-section">
        <div class="cta-container">
          <div class="cta-content">
            <h2 class="cta-title">准备好开始你的时间线之旅了吗？</h2>
            <p class="cta-subtitle">现在就开始探索那些改变世界的关键时刻</p>
            <button @click="goToStories" class="cta-block">
              <div class="cta-block-content">
                <div class="cta-block-icon">🚀</div>
                <div class="cta-block-text">
                  <div class="cta-block-title">开始探索故事</div>
                  <div class="cta-block-subtitle">发现历史的精彩瞬间</div>
                </div>
                <div class="cta-block-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </div>
              <div class="cta-block-glow"></div>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const particlesCanvas = ref(null)
const featuresSection = ref(null)

// 粒子系统
let animationFrame = null
let particles = []

const goBack = () => {
  router.push('/')
}

const goToStories = () => {
  router.push({ name: 'timeline-stories' })
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 增强的粒子系统
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
  
  // 鼠标跟踪
  let mouse = { x: 0, y: 0 }
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })
  
  // 创建粒子
  particles = []
  const particleCount = 30
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() * 60 + 220 // 蓝紫色系
    })
  }
  
  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 绘制动态曲线
    drawDynamicCurves(ctx)
    
    particles.forEach((particle, index) => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      // 边界处理
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      // 鼠标交互
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        const force = (100 - distance) / 100
        particle.vx += (dx / distance) * force * 0.01
        particle.vy += (dy / distance) * force * 0.01
        particle.opacity = Math.min(0.8, particle.opacity + force * 0.02)
      } else {
        particle.opacity = Math.max(0.1, particle.opacity - 0.005)
      }
      
      // 绘制粒子
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`
      ctx.shadowBlur = 10
      ctx.shadowColor = `hsl(${particle.hue}, 70%, 60%)`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      
      // 连接线
      particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 80) {
            ctx.save()
            ctx.globalAlpha = (80 - distance) / 80 * 0.3
            ctx.strokeStyle = `hsl(${(particle.hue + otherParticle.hue) / 2}, 70%, 60%)`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        }
      })
    })
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}

// 绘制动态曲线
const drawDynamicCurves = (ctx) => {
  const time = Date.now() * 0.001
  
  const curves = [
    { amplitude: 40, frequency: 0.01, offset: 0, color: '#6366f1' },
    { amplitude: 25, frequency: 0.015, offset: Math.PI / 2, color: '#8b5cf6' },
    { amplitude: 30, frequency: 0.008, offset: Math.PI, color: '#06b6d4' }
  ]
  
  curves.forEach(curve => {
    ctx.save()
    ctx.globalAlpha = 0.1
    ctx.strokeStyle = curve.color
    ctx.lineWidth = 2
    ctx.shadowBlur = 15
    ctx.shadowColor = curve.color
    
    ctx.beginPath()
    for (let x = 0; x < ctx.canvas.width; x += 3) {
      const y = ctx.canvas.height / 2 + 
                Math.sin(x * curve.frequency + time + curve.offset) * curve.amplitude +
                Math.sin(x * curve.frequency * 2 + time * 1.5) * curve.amplitude * 0.3
      
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
    ctx.restore()
  })
}

// 创建悬浮粒子效果
const createHoverParticles = (x, y, color = '#6366f1') => {
  const canvas = particlesCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const hoverParticles = []
  
  for (let i = 0; i < 6; i++) {
    hoverParticles.push({
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 4 + 2,
      life: 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: color
    })
  }
  
  const animateHoverParticles = () => {
    hoverParticles.forEach((particle, index) => {
      particle.life -= 0.03
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vx *= 0.97
      particle.vy *= 0.97
      particle.size *= 0.98
      
      if (particle.life > 0) {
        ctx.save()
        ctx.globalAlpha = particle.life * particle.opacity
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 12
        ctx.shadowColor = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    })
    
    if (hoverParticles.some(p => p.life > 0)) {
      requestAnimationFrame(animateHoverParticles)
    }
  }
  
  animateHoverParticles()
}

// 为统计数字添加交互效果
const addStatsHoverEffect = () => {
  const statNumbers = document.querySelectorAll('.stat-number')
  statNumbers.forEach(statNumber => {
    statNumber.addEventListener('mouseenter', (e) => {
      const rect = e.target.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      createHoverParticles(x, y, '#6366f1')
    })
  })
}

// 初始化动画
const initAnimations = () => {
  // 标题词汇动画
  const titleWords = document.querySelectorAll('.title-word')
  titleWords.forEach((word, index) => {
    setTimeout(() => {
      word.style.opacity = '1'
      word.style.transform = 'translateY(0)'
    }, index * 100 + 500)
  })

  // 统计卡片动画
  const statCards = document.querySelectorAll('.stat-card')
  statCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1'
      card.style.transform = 'translateY(0)'
    }, index * 100 + 1000)
  })

  // 特性卡片动画
  const featureCards = document.querySelectorAll('.feature-card')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0
        setTimeout(() => {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }, delay)
      }
    })
  })

  featureCards.forEach(card => observer.observe(card))
}

onMounted(() => {
  setTimeout(() => {
    initParticles()
    initAnimations()
    addStatsHoverEffect()
  }, 100)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.intro-container {
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #0f0f23 0%, #000000 100%);
  color: white;
  overflow-x: hidden;
  position: relative;
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
  animation: float 15s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  top: -10%;
  left: -10%;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: -10%;
  right: -10%;
  animation-delay: 7s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: 50%;
  left: 70%;
  animation-delay: 3s;
}

.mesh-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 主要内容 */
.intro-main {
  position: relative;
  z-index: 10;
}

/* 导航栏 */
.intro-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-logo .logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-link {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* 英雄区域 */
.hero-section {
  display: flex;
  align-items: center;
  min-height: 90vh;
  padding: 4rem 2rem;
  gap: 4rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.badge-text {
  font-size: 0.8rem;
  color: #6366f1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 2rem 0;
  letter-spacing: -0.02em;
}

.title-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-right: 0.3em;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0 0 3rem 0;
  max-width: 500px;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.stat-card {
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 0.5rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-number::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
  pointer-events: none;
}

.stat-number:hover::before {
  width: 120px;
  height: 120px;
  animation: magneticField 0.6s ease-out;
}

.stat-number:hover {
  transform: scale(1.15);
  text-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
  color: #8b5cf6;
}

@keyframes magneticField {
  0% { 
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
    box-shadow: 0 0 0 20px rgba(99, 102, 241, 0.3);
  }
  100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
    box-shadow: 0 0 0 40px rgba(99, 102, 241, 0);
  }
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-primary {
  position: relative;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cta-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.cta-primary:hover::before {
  left: 100%;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 30px rgba(99, 102, 241, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.cta-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.cta-primary:hover .cta-glow {
  transform: translateX(100%);
}

.cta-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* 视觉元素 */
.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-container {
  position: relative;
  width: 400px;
  height: 400px;
}

.timeline-preview {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
}

.timeline-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, #6366f1, #8b5cf6, #06b6d4);
  transform: translateX(-50%);
}

.timeline-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #6366f1;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  animation: pulse 2s ease-in-out infinite;
}

.timeline-dot:nth-child(2) { top: 10%; animation-delay: 0s; }
.timeline-dot:nth-child(3) { top: 40%; animation-delay: 0.5s; }
.timeline-dot:nth-child(4) { top: 70%; animation-delay: 1s; }
.timeline-dot:nth-child(5) { top: 90%; animation-delay: 1.5s; }

@keyframes pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
    transform: translateX(-50%) scale(1);
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
    transform: translateX(-50%) scale(1.1);
  }
}

.floating-cards {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.preview-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  animation: floatCard 6s ease-in-out infinite;
}

.card-1 {
  top: 20%;
  right: 0;
  animation-delay: 0s;
}

.card-2 {
  bottom: 20%;
  left: 0;
  animation-delay: 3s;
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.card-year {
  font-size: 0.7rem;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-title {
  font-size: 0.8rem;
  color: white;
  font-weight: 500;
}

/* 特性区域 */
.features-section {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.2), transparent);
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  background-size: 200% 200%;
  animation: gradientRotate 4s linear infinite;
}

.feature-card:hover::before {
  opacity: 1;
}

@keyframes gradientRotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 15px 35px rgba(99, 102, 241, 0.2);
}

.feature-icon {
  color: #6366f1;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.feature-description {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0;
}

/* CTA区域 */
.cta-section {
  padding: 6rem 2rem;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: white;
}

.cta-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 3rem 0;
}

.cta-block {
  position: relative;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s ease;
  overflow: hidden;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.cta-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(99, 102, 241, 0.2),
    rgba(139, 92, 246, 0.2),
    transparent
  );
  animation: flowingCurve 3s ease-in-out infinite;
}

.cta-block::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 60%);
  animation: pulseField 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes flowingCurve {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes pulseField {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.05);
  }
}

.cta-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
}

.cta-block-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

.cta-block-icon {
  font-size: 2rem;
}

.cta-block-text {
  flex: 1;
  text-align: left;
}

.cta-block-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.cta-block-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.cta-block-arrow {
  color: #6366f1;
}

.cta-block-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cta-block:hover .cta-block-glow {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .intro-nav {
    padding: 1rem;
  }

  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .visual-container {
    width: 300px;
    height: 300px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-block-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .cta-block-text {
    text-align: center;
  }
}
</style> 