<template>
  <div class="home">
    <h1 style="color: red; font-size: 32px; text-align: center; margin-top: 50px;">
      张艺兴音乐网站测试页面
    </h1>
    <p style="text-align: center; font-size: 18px; margin: 20px;">
      如果您看到这段文字，说明Vue应用正在正常运行
    </p>
    
    <!-- 导航栏 -->
    <nav style="background-color: black; color: white; padding: 20px; text-align: center;">
      <div style="font-size: 24px; font-weight: bold;">张艺兴 LAY</div>
      <div style="margin-top: 10px;">
        <router-link to="/" style="color: yellow; margin-right: 20px; text-decoration: none;">首页</router-link>
        <router-link to="/artist-journey" style="color: yellow; text-decoration: none;">音乐时光</router-link>
      </div>
    </nav>

    <!-- 主视觉区域 -->
    <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 500px; display: flex; align-items: center; justify-content: center; color: white; text-align: center;">
      <div>
        <h1 style="font-size: 64px; font-weight: bold; margin-bottom: 20px; animation: pulse 2s infinite;">张艺兴</h1>
        <p style="font-size: 24px; margin-bottom: 20px; opacity: 0.9;">LAY Music Journey</p>
        <p style="font-size: 18px; margin-bottom: 40px; opacity: 0.8; max-width: 600px;">
          探索音乐的无限可能，感受每一个音符背后的故事与情感
        </p>
        <router-link 
          to="/artist-journey" 
          style="display: inline-block; background-color: #f59e0b; color: black; font-weight: bold; padding: 16px 32px; border-radius: 50px; text-decoration: none; transition: transform 0.3s;"
          @mouseover="$event.target.style.transform = 'scale(1.05)'"
          @mouseout="$event.target.style.transform = 'scale(1)'"
        >
          开始音乐之旅
        </router-link>
      </div>
    </section>

    <!-- 玻璃卡片区域 -->
    <section style="padding: 80px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 400px; display: flex; align-items: center; justify-content: center;">
      <div 
        ref="glassCard"
        class="glass-card"
        style="max-width: 32rem; margin: 0 auto; padding: 2rem; margin-bottom: 3rem; cursor: pointer; transition: all 0.3s ease;"
        @click="triggerCardClick"
        @mouseover="onCardHover"
        @mouseout="onCardLeave"
      >
        <div style="text-align: center;">
          <div ref="lottieContainer" style="width: 200px; height: 200px; margin: 0 auto 20px; border: 2px solid rgba(255,255,255,0.2); border-radius: 10px;"></div>
          <h3 style="font-size: 24px; font-weight: bold; color: white; margin-bottom: 16px;">🎵 音乐魔法</h3>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.6;">
            悬浮在卡片上感受音乐的力量。动画会在您悬浮时播放，离开时暂停。
          </p>
          <div style="margin-top: 20px; font-size: 14px; color: rgba(255,255,255,0.7);">
            💫 悬浮次数 {{ hoverCount }} 次 | 点击次数 {{ clickCount }} 次
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.6);">
            动画状态: {{ animationStatus }}
          </div>
        </div>
      </div>
    </section>

    <!-- 特色介绍区域 -->
    <section style="padding: 80px 20px; background-color: #f9fafb;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 60px; color: #374151;">音乐世界</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 30px;">
              🎵
            </div>
            <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">音乐创作</h3>
            <p style="color: #6b7280;">原创音乐作品，展现独特的音乐风格与创作理念</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 30px;">
              🎬
            </div>
            <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">视觉呈现</h3>
            <p style="color: #6b7280;">精美的MV制作，用视觉语言诠释音乐的深层含义</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 30px;">
              ⏰
            </div>
            <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">时光轴</h3>
            <p style="color: #6b7280;">记录音乐历程的每一个重要时刻与里程碑</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer style="background-color: black; color: white; padding: 48px 20px; text-align: center;">
      <p style="color: #9ca3af;">&copy; 2024 张艺兴音乐工作室. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import lottie from 'lottie-web'

const glassCard = ref(null)
const lottieContainer = ref(null)
const clickCount = ref(0)
const hoverCount = ref(0)
const animationStatus = ref('初始化中...')
let lottieAnimation = null

onMounted(() => {
  console.log('张艺兴首页加载完成 - 测试版本')
  console.log('Vue组件已成功挂载')
  
  // 延迟初始化Lottie动画，确保DOM已完全渲染
  setTimeout(() => {
    initLottieAnimation()
  }, 100)
})

const initLottieAnimation = () => {
  if (lottieContainer.value) {
    try {
      console.log('开始初始化Lottie动画...')
      console.log('容器元素:', lottieContainer.value)
      
      lottieAnimation = lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg',
        loop: true,
        autoplay: false, // 改为不自动播放
        path: '/lottie/Animation - 1749135116565(1).json'
      })
      
      lottieAnimation.addEventListener('complete', () => {
        console.log('Lottie动画播放完成')
        animationStatus.value = '播放完成'
      })
      
      lottieAnimation.addEventListener('loopComplete', () => {
        console.log('Lottie动画循环完成')
        animationStatus.value = '循环播放中'
      })
      
      lottieAnimation.addEventListener('data_ready', () => {
        console.log('Lottie动画数据加载完成')
        animationStatus.value = '已加载，等待悬浮'
      })
      
      lottieAnimation.addEventListener('data_failed', () => {
        console.error('Lottie动画数据加载失败')
        animationStatus.value = '加载失败'
      })
      
      console.log('Lottie动画初始化完成')
      
    } catch (error) {
      console.error('Lottie动画初始化错误:', error)
      animationStatus.value = '初始化失败'
    }
  } else {
    console.error('Lottie容器未找到')
    animationStatus.value = '容器未找到'
  }
}

const triggerCardClick = () => {
  clickCount.value++
  console.log('卡片被点击，点击次数:', clickCount.value)
  
  // 触发卡片浮动效果
  if (glassCard.value) {
    glassCard.value.style.transform = 'translateY(-20px) scale(1.05)'
    glassCard.value.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    
    setTimeout(() => {
      glassCard.value.style.transform = 'translateY(0) scale(1)'
      glassCard.value.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }, 300)
  }
}

const onCardHover = () => {
  hoverCount.value++
  console.log('鼠标悬浮在卡片上，悬浮次数:', hoverCount.value)
  
  // 卡片悬浮效果
  if (glassCard.value) {
    glassCard.value.style.transform = 'translateY(-5px)'
    glassCard.value.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
  }
  
  // 播放Lottie动画
  if (lottieAnimation) {
    console.log('开始播放Lottie动画')
    lottieAnimation.play()
    animationStatus.value = '播放中'
  } else {
    console.log('Lottie动画未初始化')
    animationStatus.value = '动画未初始化'
  }
}

const onCardLeave = () => {
  console.log('鼠标离开卡片')
  
  // 卡片恢复效果
  if (glassCard.value) {
    glassCard.value.style.transform = 'translateY(0)'
    glassCard.value.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
  
  // 暂停Lottie动画
  if (lottieAnimation) {
    console.log('暂停Lottie动画')
    lottieAnimation.pause()
    animationStatus.value = '已暂停'
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style> 