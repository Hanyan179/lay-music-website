<template>
  <div class="water-ripple-container" ref="waterRippleContainer">
    <canvas ref="waterCanvas" class="water-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

// Props
interface Props {
  maxParticles?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxParticles: 200,
  disabled: false
})

// Refs
const waterRippleContainer = ref<HTMLElement>()
const waterCanvas = ref<HTMLCanvasElement>()

// 清理函数
let cleanup: (() => void) | null = null

// 粒子系统接口
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  life: number
  maxLife: number
  hue: number
  type: 'trail' | 'magnetic' | 'explosion' | 'flow'
  targetX?: number
  targetY?: number
  magnetStrength?: number
}

interface FlowField {
  x: number
  y: number
  angle: number
  intensity: number
}

// 高设计感鼠标交互系统
const initAdvancedMouseInteraction = () => {
  if (!waterCanvas.value || !waterRippleContainer.value || props.disabled) return
  
  const canvas = waterCanvas.value
  const container = waterRippleContainer.value
  const ctx = canvas.getContext('2d')!
  
  // 设置画布尺寸 - 高清渲染
  const resizeCanvas = () => {
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // 鼠标状态追踪
  let mouseX = 0
  let mouseY = 0
  let isMousePressed = false
  let mouseVelocityX = 0
  let mouseVelocityY = 0
  let lastMouseX = 0
  let lastMouseY = 0
  
  // 粒子系统数据结构
  const particles: Particle[] = []
  const flowField: FlowField[] = []
  
  // 初始化流场系统
  const initFlowField = () => {
    const gridSize = 30
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        flowField.push({
          x,
          y,
          angle: Math.random() * Math.PI * 2,
          intensity: Math.random() * 0.5 + 0.2
        })
      }
    }
  }
  
  initFlowField()
  
  // 智能粒子创建系统
  const createParticle = (x: number, y: number, type: Particle['type'], count = 1) => {
    for (let i = 0; i < count; i++) {
      if (particles.length >= props.maxParticles) {
        particles.shift()
      }
      
      let particle: Particle
      
      switch (type) {
        case 'trail':
          // 拖尾粒子 - 快速移动时
          particle = {
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            radius: Math.random() * 4 + 2,
            opacity: 0.8,
            life: 1,
            maxLife: 1,
            hue: 220 + Math.random() * 60, // 蓝紫色系
            type: 'trail'
          }
          break
          
        case 'magnetic':
          // 磁性粒子 - 静止悬停时
          particle = {
            x: x + (Math.random() - 0.5) * 100,
            y: y + (Math.random() - 0.5) * 100,
            vx: 0,
            vy: 0,
            radius: Math.random() * 3 + 1,
            opacity: 0.6,
            life: 1,
            maxLife: 1,
            hue: 280 + Math.random() * 40, // 紫色系
            type: 'magnetic',
            targetX: x,
            targetY: y,
            magnetStrength: Math.random() * 0.1 + 0.05
          }
          break
          
        case 'explosion':
          // 爆炸粒子 - 点击时
          const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5
          const speed = Math.random() * 8 + 4
          particle = {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 6 + 3,
            opacity: 1,
            life: 1,
            maxLife: 1,
            hue: 200 + Math.random() * 80, // 蓝绿色系
            type: 'explosion'
          }
          break
          
        case 'flow':
          // 流动粒子 - 慢速移动时
          particle = {
            x: x + (Math.random() - 0.5) * 50,
            y: y + (Math.random() - 0.5) * 50,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 2 + 0.5,
            opacity: 0.4,
            life: 1,
            maxLife: 1,
            hue: 180 + Math.random() * 120, // 彩虹色系
            type: 'flow'
          }
          break
      }
      
      particles.push(particle)
    }
  }
  
  // 动态流场更新
  const updateFlowField = () => {
    const time = Date.now() * 0.001
    flowField.forEach(field => {
      const distToMouse = Math.sqrt(
        Math.pow(field.x - mouseX, 2) + Math.pow(field.y - mouseY, 2)
      )
      
      if (distToMouse < 150) {
        // 鼠标影响范围内
        const influence = (150 - distToMouse) / 150
        field.angle = Math.atan2(mouseY - field.y, mouseX - field.x) + 
                     Math.sin(time * 2) * influence * 0.5
        field.intensity = 0.8 * influence + 0.2
      } else {
        // 自然波动
        field.angle += Math.sin(time + field.x * 0.01) * 0.02
        field.intensity = 0.3
      }
    })
  }
  
  // 获取流场影响力
  const getFlowInfluence = (x: number, y: number) => {
    const gridSize = 30
    const gridX = Math.floor(x / gridSize) * gridSize
    const gridY = Math.floor(y / gridSize) * gridSize
    
    const field = flowField.find(f => f.x === gridX && f.y === gridY)
    if (field) {
      return {
        vx: Math.cos(field.angle) * field.intensity,
        vy: Math.sin(field.angle) * field.intensity
      }
    }
    return { vx: 0, vy: 0 }
  }
  
  // 智能鼠标事件处理
  const handleMouseMove = (event: MouseEvent) => {
    const rect = container.getBoundingClientRect()
    const newMouseX = event.clientX - rect.left
    const newMouseY = event.clientY - rect.top
    
    // 计算鼠标速度
    mouseVelocityX = newMouseX - lastMouseX
    mouseVelocityY = newMouseY - lastMouseY
    lastMouseX = mouseX
    lastMouseY = mouseY
    
    mouseX = newMouseX
    mouseY = newMouseY
    
    // 根据鼠标速度智能创建粒子
    const velocity = Math.sqrt(mouseVelocityX ** 2 + mouseVelocityY ** 2)
    
    if (velocity > 15) {
      // 快速移动：拖尾效果
      createParticle(mouseX, mouseY, 'trail', Math.min(Math.floor(velocity / 10), 5))
    } else if (velocity > 5) {
      // 慢速移动：流动效果
      createParticle(mouseX, mouseY, 'flow', 2)
    } else {
      // 静止悬停：磁性效果
      createParticle(mouseX, mouseY, 'magnetic', 1)
    }
  }
  
  const handleMouseDown = () => {
    isMousePressed = true
    // 点击爆炸效果
    createParticle(mouseX, mouseY, 'explosion', 12)
  }
  
  const handleMouseUp = () => {
    isMousePressed = false
  }
  
  const handleMouseLeave = () => {
    isMousePressed = false
  }
  
  // 事件监听器
  container.addEventListener('mousemove', handleMouseMove)
  container.addEventListener('mousedown', handleMouseDown)
  container.addEventListener('mouseup', handleMouseUp)
  container.addEventListener('mouseleave', handleMouseLeave)
  
  // 60fps 渲染引擎
  const animate = () => {
    // 微拖尾效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 更新流场
    updateFlowField()
    
    // 粒子系统更新与渲染
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      
      // 基于类型的物理行为
      switch (particle.type) {
        case 'trail':
          particle.vx *= 0.98
          particle.vy *= 0.98
          particle.life -= 0.02
          break
          
        case 'magnetic':
          if (particle.targetX !== undefined && particle.targetY !== undefined) {
            const dx = mouseX - particle.x
            const dy = mouseY - particle.y
            const distance = Math.sqrt(dx ** 2 + dy ** 2)
            
            if (distance > 5) {
              particle.vx += (dx / distance) * (particle.magnetStrength || 0.05)
              particle.vy += (dy / distance) * (particle.magnetStrength || 0.05)
            }
            
            // 速度限制
            const maxSpeed = 8
            const currentSpeed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2)
            if (currentSpeed > maxSpeed) {
              particle.vx = (particle.vx / currentSpeed) * maxSpeed
              particle.vy = (particle.vy / currentSpeed) * maxSpeed
            }
          }
          particle.life -= 0.01
          break
          
        case 'explosion':
          particle.vy += 0.1 // 重力
          particle.vx *= 0.995
          particle.vy *= 0.995
          particle.life -= 0.015
          break
          
        case 'flow':
          const flowInfluence = getFlowInfluence(particle.x, particle.y)
          particle.vx += flowInfluence.vx * 0.5
          particle.vy += flowInfluence.vy * 0.5
          particle.vx *= 0.99
          particle.vy *= 0.99
          particle.life -= 0.008
          break
      }
      
      // 位置更新
      particle.x += particle.vx
      particle.y += particle.vy
      
      // 透明度更新
      particle.opacity = particle.life * 0.8
      
      // 生命周期管理
      if (particle.life <= 0) {
        particles.splice(i, 1)
        continue
      }
      
      // 高质量粒子渲染
      ctx.save()
      ctx.globalAlpha = particle.opacity
      
      // HSL色彩渐变
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 2
      )
      
      const hsl = `hsl(${particle.hue}, 70%, 60%)`
      const hslTransparent = `hsl(${particle.hue}, 70%, 60%, 0)`
      
      gradient.addColorStop(0, hsl)
      gradient.addColorStop(0.5, hsl)
      gradient.addColorStop(1, hslTransparent)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fill()
      
      // 发光效果
      if (particle.type === 'explosion' || particle.type === 'magnetic') {
        ctx.shadowColor = hsl
        ctx.shadowBlur = particle.radius * 2
        ctx.globalAlpha = particle.opacity * 0.5
        ctx.fill()
        ctx.shadowBlur = 0
      }
      
      ctx.restore()
    }
    
    // 鼠标光环系统
    if (mouseX > 0 && mouseY > 0) {
      const time = Date.now() * 0.005
      
      ctx.save()
      ctx.globalAlpha = 0.3
      
      // 3层呼吸光环
      for (let i = 0; i < 3; i++) {
        const radius = 20 + i * 15 + Math.sin(time + i) * 5
        const hue = 220 + Math.sin(time * 0.5 + i) * 40
        
        const gradient = ctx.createRadialGradient(
          mouseX, mouseY, radius * 0.5,
          mouseX, mouseY, radius
        )
        
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0)`)
        gradient.addColorStop(0.7, `hsla(${hue}, 70%, 60%, 0.2)`)
        gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`)
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2)
        ctx.stroke()
      }
      
      ctx.restore()
    }
    
    requestAnimationFrame(animate)
  }
  
  animate()
  
  // 清理函数
  return () => {
    container.removeEventListener('mousemove', handleMouseMove)
    container.removeEventListener('mousedown', handleMouseDown)
    container.removeEventListener('mouseup', handleMouseUp)
    container.removeEventListener('mouseleave', handleMouseLeave)
    window.removeEventListener('resize', resizeCanvas)
    particles.length = 0
    flowField.length = 0
  }
}

// 生命周期
onMounted(() => {
  if (!props.disabled) {
    setTimeout(() => {
      cleanup = initAdvancedMouseInteraction() || null
    }, 100)
  }
})

onBeforeUnmount(() => {
  if (cleanup) {
    cleanup()
  }
})
</script>

<style scoped>
.water-ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  overflow: hidden;
  z-index: 1;
}

.water-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  cursor: crosshair;
}

.water-ripple-container:hover {
  z-index: 2;
}

.water-ripple-container:hover .water-canvas {
  opacity: 0.9;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .water-ripple-container {
    opacity: 0.8;
  }
  
  .water-canvas {
    cursor: auto;
  }
}

@media (max-width: 480px) {
  .water-ripple-container {
    opacity: 0.6;
  }
}
</style> 