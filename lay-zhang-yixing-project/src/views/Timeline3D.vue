<template>
  <div class="timeline-3d">
    <!-- 粒子背景 -->
    <canvas id="timeline-particles" class="particles-bg"></canvas>
    
    <!-- 导航栏 -->
    <nav class="nav-glass">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-xl font-bold text-white">
            <router-link to="/" class="flex items-center space-x-2">
              <span>←</span>
              <span>LAY 张艺兴</span>
            </router-link>
          </div>
          <div class="text-white/80">音乐时光轴</div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="timeline-container">
      <!-- 标题区域 -->
      <div class="timeline-header">
        <h1 class="timeline-title">音乐历程时光轴</h1>
        <p class="timeline-subtitle">探索张艺兴的音乐人生轨迹</p>
      </div>

      <!-- 3D时间轴 -->
      <div class="timeline-3d-wrapper" ref="timelineWrapper">
        <div class="timeline-line"></div>
        
        <div 
          v-for="(event, index) in timelineEvents" 
          :key="index"
          class="timeline-event"
          :class="[
            `timeline-event-${index % 2 === 0 ? 'left' : 'right'}`,
            { 'active': activeEvent === index }
          ]"
          :style="{ animationDelay: `${index * 0.3}s` }"
          @click="selectEvent(index)"
        >
          <!-- 时间节点 -->
          <div class="timeline-node">
            <div class="node-inner">
              <span class="node-icon">{{ event.icon }}</span>
            </div>
            <div class="node-pulse"></div>
          </div>
          
          <!-- 事件卡片 -->
          <div class="event-card glass-card">
            <div class="event-image">
              <div 
                class="image-placeholder"
                :style="{ background: event.gradient }"
              >
                <span class="text-6xl">{{ event.icon }}</span>
              </div>
            </div>
            <div class="event-content">
              <div class="event-date">{{ event.date }}</div>
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
              <button 
                class="event-button"
                @click.stop="viewDetails(event)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Timeline3D',
  setup() {
    const activeEvent = ref(0)
    const showModal = ref(false)
    const selectedEvent = ref(null)
    const timelineWrapper = ref(null)

    // 时间轴数据
    const timelineEvents = ref([
      {
        date: '2012年',
        title: 'EXO出道',
        description: '作为EXO-M成员正式出道，开启音乐生涯。',
        icon: '🌟',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        date: '2015年',
        title: '个人发展',
        description: '开始个人音乐和演艺事业的探索。',
        icon: '🎭',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        date: '2016年',
        title: '《LOSE CONTROL》',
        description: '发行首张个人专辑，确立个人音乐风格。',
        icon: '🎵',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      {
        date: '2017年',
        title: '《LAY 02 SHEEP》',
        description: '第二张专辑，音乐制作能力进一步提升。',
        icon: '🐑',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      },
      {
        date: '2018年',
        title: '《NAMANANA》',
        description: '第三张专辑，融合更多元化的音乐元素。',
        icon: '🌈',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      },
      {
        date: '2019年',
        title: '《蹦》',
        description: '结合传统与现代，展现音乐创新力。',
        icon: '🥁',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
      },
      {
        date: '2020年',
        title: '《莲》',
        description: '疫情期间的音乐作品，传递正能量。',
        icon: '🪷',
        gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
      },
      {
        date: '2021年',
        title: '制作人身份',
        description: '作为制作人，帮助更多艺人实现音乐梦想。',
        icon: '🎛️',
        gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
      }
    ])

    // 选择事件
    const selectEvent = (index) => {
      activeEvent.value = index
    }

    // 查看详情
    const viewDetails = (event) => {
      console.log('查看详情:', event.title)
    }

    // 初始化粒子动画
    const initParticles = () => {
      const canvas = document.getElementById('timeline-particles')
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const particles = []
      const maxParticles = 80

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.vx = (Math.random() - 0.5) * 1.5
          this.vy = (Math.random() - 0.5) * 1.5
          this.radius = Math.random() * 2 + 1
          this.alpha = Math.random() * 0.4 + 0.1
          this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
        }

        update() {
          this.x += this.vx
          this.y += this.vy

          if (this.x < 0 || this.x > canvas.width) this.vx *= -1
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1
        }

        draw() {
          ctx.save()
          ctx.globalAlpha = this.alpha
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = this.color
          ctx.fill()
          ctx.restore()
        }
      }

      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle())
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        particles.forEach(particle => {
          particle.update()
          particle.draw()
        })

        requestAnimationFrame(animate)
      }

      animate()

      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      })
    }

    onMounted(() => {
      initParticles()
    })

    return {
      timelineEvents,
      activeEvent,
      showModal,
      selectedEvent,
      timelineWrapper,
      selectEvent,
      viewDetails
    }
  }
}
</script>

<style scoped>
.timeline-3d {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%, 
    #f093fb 50%, 
    #f5576c 75%, 
    #4facfe 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  position: relative;
}

.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.nav-glass {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.timeline-container {
  position: relative;
  z-index: 10;
  padding-top: 100px;
  padding-bottom: 100px;
}

.timeline-header {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.timeline-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timeline-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

.timeline-3d-wrapper {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.8), 
    rgba(255, 255, 255, 0.4), 
    rgba(255, 255, 255, 0.8));
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.timeline-event {
  position: relative;
  margin: 80px 0;
  opacity: 0;
  animation: slideInUp 0.8s ease forwards;
  cursor: pointer;
  transition: all 0.4s ease;
}

.timeline-event:hover {
  transform: scale(1.02);
}

.timeline-event-left {
  text-align: right;
}

.timeline-event-right {
  text-align: left;
}

.timeline-event-left .event-card {
  margin-right: calc(50% + 40px);
  transform-origin: right center;
}

.timeline-event-right .event-card {
  margin-left: calc(50% + 40px);
  transform-origin: left center;
}

.timeline-node {
  position: absolute;
  left: 50%;
  top: 50px;
  transform: translate(-50%, -50%);
  z-index: 20;
}

.node-inner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff, #f0f0f0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.node-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  animation: pulse 2s ease-in-out infinite;
}

.event-card {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  padding: 30px;
  max-width: 400px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  overflow: hidden;
  position: relative;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.2);
}

.event-image {
  margin-bottom: 20px;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 15px;
}

.event-content {
  color: white;
}

.event-date {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 10px;
  font-weight: 600;
}

.event-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.2;
}

.event-description {
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 20px;
}

.event-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.event-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

/* 动画 */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-title {
    font-size: 2.5rem;
  }
  
  .timeline-line {
    left: 30px;
  }
  
  .timeline-event-left .event-card,
  .timeline-event-right .event-card {
    margin-left: 60px;
    margin-right: 20px;
  }
  
  .timeline-node {
    left: 30px;
  }
}
</style> 