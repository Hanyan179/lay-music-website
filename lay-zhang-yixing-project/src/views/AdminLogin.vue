<template>
  <div class="admin-login-container">
    <!-- 音波粒子背景画布 -->
    <canvas id="particles-canvas"></canvas>
    
    <!-- 海浪波纹背景 -->
    <div class="wave-background">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="wave wave4"></div>
      <!-- 装饰性气泡 -->
      <div class="bubble-container">
        <div class="bubble bubble1"></div>
        <div class="bubble bubble2"></div>
        <div class="bubble bubble3"></div>
        <div class="bubble bubble4"></div>
        <div class="bubble bubble5"></div>
        <div class="bubble bubble6"></div>
      </div>
    </div>
    
    <!-- 音乐装饰元素 -->
    <div class="music-decorations">
      <div class="music-note note1">♪</div>
      <div class="music-note note2">♫</div>
      <div class="music-note note3">♬</div>
      <div class="music-note note4">♪</div>
      <div class="music-note note5">♫</div>
    </div>
    
    <div class="login-box glass-card">
      <div class="login-header">
        <div class="brand-logo">
          <div class="logo-icon">🎵</div>
          <h1 class="login-title">LAY 张艺兴</h1>
          <p class="login-subtitle">音乐后台管理系统</p>
        </div>
        <div class="rhythm-dots">
          <div class="rhythm-dot"></div>
          <div class="rhythm-dot"></div>
          <div class="rhythm-dot"></div>
          <div class="rhythm-dot"></div>
          <div class="rhythm-dot"></div>
        </div>
      </div>
      
      <div class="login-form">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名"
              required
              :disabled="loading"
              autocomplete="username"
              spellcheck="false"
            />
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              required
              :disabled="loading"
              autocomplete="current-password"
              spellcheck="false"
            />
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="login-btn"
              :disabled="loading"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>
      </div>
      
      <div class="login-footer">
        <p>© 2024 Lay Zhang Music Project</p>
      </div>
    </div>
  </div>
</template>

<script>
import { adminLogin } from '@/api/admin'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    // 粒子动画
    let animationId = null
    let particles = []
    
    // 初始化粒子背景
    const initParticles = () => {
      const canvas = document.getElementById('particles-canvas')
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // 创建粒子
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          opacity: Math.random() * 0.5 + 0.2
        })
      }
      
      // 动画循环
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        particles.forEach(particle => {
          // 更新位置
          particle.x += particle.speedX
          particle.y += particle.speedY
          
          // 边界检测
          if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
          
          // 绘制粒子
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
          ctx.fill()
        })
        
        animationId = requestAnimationFrame(animate)
      }
      
      animate()
    }
    
    // 处理窗口大小变化
    const handleResize = () => {
      const canvas = document.getElementById('particles-canvas')
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    
    const handleLogin = async () => {
      if (!loginForm.username || !loginForm.password) {
        showNotification('请输入用户名和密码', 'warning')
        return
      }
      
      loading.value = true
      
      try {
        const response = await adminLogin(loginForm)
        
        if (response.success) {
          // 保存token到localStorage
          localStorage.setItem('admin_token', response.data.token || 'temp_token')
          localStorage.setItem('admin_user', JSON.stringify(response.data.userInfo))
          
          showNotification('登录成功！正在跳转...', 'success')
          
          // 设备检测和页面跳转
          setTimeout(() => {
            // 动态导入设备检测工具
            import('@/utils/deviceDetector').then(({ isMobileDevice }) => {
              const isMobile = isMobileDevice()
              
              if (isMobile) {
                // 移动端跳转到移动端管理页面
                router.push('/x-back/mobile-dashboard')
              } else {
                // PC端跳转到正常管理页面
                router.push('/x-back/dashboard')
              }
            }).catch(error => {
              console.error('设备检测失败:', error)
              // 检测失败时默认跳转到PC端页面
              router.push('/x-back/dashboard')
            })
          }, 1500)
        } else {
          showNotification(response.message || '登录失败', 'error')
        }
      } catch (error) {
        console.error('登录失败:', error)
        showNotification('登录失败，请检查网络连接', 'error')
      } finally {
        loading.value = false
      }
    }
    
    // 简单的通知函数
    const showNotification = (message, type = 'info') => {
      // 创建通知元素
      const notification = document.createElement('div')
      notification.className = `notification notification-${type}`
      notification.textContent = message
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        ${type === 'success' ? 'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);' : ''}
        ${type === 'error' ? 'background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);' : ''}
        ${type === 'warning' ? 'background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);' : ''}
      `
      
      document.body.appendChild(notification)
      
      // 3秒后移除
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out'
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    }
    
    // 添加键盘事件监听
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && !loading.value) {
        handleLogin()
      }
    }
    
    onMounted(() => {
      initParticles()
      window.addEventListener('resize', handleResize)
      document.addEventListener('keypress', handleKeyPress)
      
      // 添加CSS动画关键帧
      const style = document.createElement('style')
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    })
    
    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keypress', handleKeyPress)
    })
    
    return {
      loginForm,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* CSS变量定义 - 与首页保持一致 */
.admin-login-container {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-music: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --gradient-secondary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}

.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 后备背景色 */
  background: #667eea;
  /* 主要渐变背景 */
  background: var(--gradient-primary);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* 粒子背景画布 */
#particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 海浪背景 */
.wave-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 200px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 50%;
  animation: wave 10s linear infinite;
}

.wave1 { animation-delay: 0s; }
.wave2 { animation-delay: -2s; }
.wave3 { animation-delay: -4s; }
.wave4 { animation-delay: -6s; }

@keyframes wave {
  0% { transform: translateX(-50%) rotate(0deg); }
  100% { transform: translateX(-50%) rotate(360deg); }
}

/* 气泡装饰 */
.bubble-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bubble {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 15s ease-in-out infinite;
}

.bubble1 { width: 20px; height: 20px; left: 10%; top: 60%; animation-delay: 0s; }
.bubble2 { width: 30px; height: 30px; left: 80%; top: 30%; animation-delay: 2s; }
.bubble3 { width: 15px; height: 15px; left: 30%; top: 80%; animation-delay: 4s; }
.bubble4 { width: 25px; height: 25px; left: 70%; top: 70%; animation-delay: 6s; }
.bubble5 { width: 18px; height: 18px; left: 20%; top: 20%; animation-delay: 8s; }
.bubble6 { width: 22px; height: 22px; left: 90%; top: 80%; animation-delay: 10s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateY(-30px) scale(1.1); opacity: 1; }
}

/* 音乐装饰元素 */
.music-decorations {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.music-note {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.3);
  animation: musicFloat 8s ease-in-out infinite;
}

.note1 { top: 10%; left: 15%; animation-delay: 0s; }
.note2 { top: 20%; right: 20%; font-size: 2.5rem; animation-delay: 2s; }
.note3 { bottom: 30%; left: 10%; font-size: 1.8rem; animation-delay: 4s; }
.note4 { top: 70%; right: 15%; animation-delay: 6s; }
.note5 { bottom: 15%; right: 30%; font-size: 2.2rem; animation-delay: 8s; }

@keyframes musicFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-20px) rotate(10deg); opacity: 0.6; }
}

/* 玻璃态卡片 */
.glass-card {
  /* 后备背景 */
  background: rgba(255, 255, 255, 0.15);
  /* 主要背景 */
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.login-box {
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 10;
  animation: slideInUp 1s ease-out;
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 3rem;
}

.brand-logo {
  margin-bottom: 1.5rem;
}

.logo-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.login-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: var(--gradient-music);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.login-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 1px;
}

/* 节拍点装饰 */
.rhythm-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
}

.rhythm-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: rhythm 1.5s ease-in-out infinite;
}

.rhythm-dot:nth-child(1) { animation-delay: 0s; }
.rhythm-dot:nth-child(2) { animation-delay: 0.2s; }
.rhythm-dot:nth-child(3) { animation-delay: 0.4s; }
.rhythm-dot:nth-child(4) { animation-delay: 0.6s; }
.rhythm-dot:nth-child(5) { animation-delay: 0.8s; }

@keyframes rhythm {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
}

/* 表单样式 */
.login-form {
  margin-bottom: 2.5rem;
}

.form-group {
  margin-bottom: 1.8rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  padding: 1.2rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.form-group input:disabled {
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
  opacity: 0.6;
}

.form-actions {
  margin-top: 2.5rem;
}

.login-btn {
  width: 100%;
  padding: 1.2rem;
  background: var(--gradient-music);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(79, 172, 254, 0.4);
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 80%);
}

.login-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.2);
}

/* 页脚样式 */
.login-footer {
  text-align: center;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.login-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    margin: 1rem;
    padding: 2rem;
    max-width: 90%;
  }
  
  .login-title {
    font-size: 2rem;
  }
  
  .logo-icon {
    font-size: 2.5rem;
  }
  
  .music-note {
    font-size: 1.5rem;
  }
  
  .note2 { font-size: 2rem; }
  .note5 { font-size: 1.8rem; }
}

@media (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
  
  .form-group input {
    padding: 1rem 1.2rem;
  }
  
  .login-btn {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style> 