<!-- 沉浸式照片墙演示页面 -->
<template>
  <div class="demo-page">
    <!-- 顶部导航条 -->
    <nav class="demo-nav">
      <div class="nav-content">
        <h1 class="nav-title">LAY 沉浸式作品集</h1>
        <div class="nav-info">
          <span class="scroll-hint">滚动探索 • 点击查看详情</span>
        </div>
      </div>
    </nav>
    
    <!-- 照片墙组件 -->
    <PortfolioGallery />
    
    <!-- 底部提示信息 -->
    <div class="demo-footer">
      <div class="footer-content">
        <p class="footer-text">
          体验说明：使用鼠标滚轮或触摸手势浏览作品集，点击任意作品查看详细信息
        </p>
        <div class="tech-stack">
          <span class="tech-tag">Vue 3</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Three.js</span>
          <span class="tech-tag">GSAP</span>
          <span class="tech-tag">Lenis</span>
          <span class="tech-tag">WebGL Shaders</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PortfolioGallery from '@/components/PortfolioGallery.vue'
</script>

<style scoped>
/* ================= 演示页面基础样式 ================= */
.demo-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #000;
  overflow-x: hidden;
}

/* ================= 顶部导航条 ================= */
.demo-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  display: flex;
  align-items: center;
}

.nav-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0;
}

.nav-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.scroll-hint {
  color: #888;
  font-size: 0.9rem;
  font-style: italic;
}

/* ================= 底部信息条 ================= */
.demo-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  padding: 1rem 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.footer-text {
  color: #ccc;
  font-size: 0.9rem;
  margin: 0 0 0.8rem 0;
  line-height: 1.4;
}

.tech-stack {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tech-tag:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

/* ================= 响应式设计 ================= */
@media (max-width: 768px) {
  .demo-nav {
    height: 60px;
  }
  
  .nav-content {
    padding: 0 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-title {
    font-size: 1.2rem;
  }
  
  .scroll-hint {
    font-size: 0.8rem;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
  
  .footer-text {
    font-size: 0.8rem;
  }
  
  .tech-stack {
    gap: 0.3rem;
  }
  
  .tech-tag {
    font-size: 0.7rem;
    padding: 0.25rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .nav-content {
    text-align: center;
  }
  
  .nav-info {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .demo-footer {
    padding: 0.8rem 0;
  }
}

/* ================= 性能优化 ================= */
.demo-nav,
.demo-footer {
  will-change: transform;
}
</style> 