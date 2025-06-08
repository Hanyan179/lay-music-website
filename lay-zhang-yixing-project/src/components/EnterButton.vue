<!--
 * @file src/components/EnterButton.vue
 * 3D首页进入按钮组件
 -->

<template>
  <button
    class="enter-button pointer-events-auto fixed bottom-20 left-1/2 transform -translate-x-1/2 
           px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600
           text-white text-xl font-semibold hover:scale-105 transition-all duration-300 
           shadow-2xl hover:shadow-purple-500/50 backdrop-blur-sm border border-white/20
           animate-pulse-gentle"
    @click="$emit('click')"
  >
    <span class="flex items-center space-x-3">
      <span>进入 3D 时间轴</span>
      <svg 
        class="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </span>
    
    <!-- 发光边框效果 -->
    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 opacity-30 blur-xl -z-10 animate-glow"></div>
  </button>
</template>

<script setup lang="ts">
// 定义emits
defineEmits<{
  click: []
}>()
</script>

<style scoped>
.enter-button {
  position: relative;
  overflow: hidden;
  z-index: 50;
}

.enter-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.8s ease;
}

.enter-button:hover::before {
  left: 100%;
}

.enter-button:hover {
  transform: translateX(-50%) scale(1.05);
  box-shadow: 
    0 20px 40px rgba(139, 92, 246, 0.4),
    0 0 30px rgba(236, 72, 153, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.enter-button:active {
  transform: translateX(-50%) scale(0.98);
}

/* 自定义动画 */
@keyframes pulse-gentle {
  0%, 100% {
    box-shadow: 
      0 10px 30px rgba(139, 92, 246, 0.3),
      0 0 20px rgba(236, 72, 153, 0.2);
  }
  50% {
    box-shadow: 
      0 15px 40px rgba(139, 92, 246, 0.4),
      0 0 25px rgba(236, 72, 153, 0.3);
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.animate-pulse-gentle {
  animation: pulse-gentle 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enter-button {
    bottom: 4rem;
    padding: 0.75rem 2rem;
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .enter-button {
    bottom: 3rem;
    padding: 0.625rem 1.5rem;
    font-size: 1rem;
  }
  
  .enter-button span span:first-child {
    display: none;
  }
  
  .enter-button span::before {
    content: '进入';
  }
}
</style> 