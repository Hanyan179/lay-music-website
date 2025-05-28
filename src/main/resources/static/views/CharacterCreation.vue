<!-- src/views/CharacterCreation.vue -->
<template>
  <div class="hero-container">
    <h1 class="hero-title">宿命回响</h1>
    <button
        class="hero-button"
        @click="startJourney"
    >
      开始旅途
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 动态加载字体
onMounted(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900&display=swap'
  document.head.appendChild(link)
})

const startJourney = () => {
  router.push('/test-book')
}
</script>

<style scoped>
:root {
  --responsive-scale: calc(100vw / 1920);
}

.hero-container {
  width: min(92%, 1600px);
  margin: clamp(10px, 3vh, 40px) auto;
  aspect-ratio: 16/9;
  max-height: 90vh;
  background:
      linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),
      url('https://cdn.usegalileo.ai/sdxl10/d0a12433-c400-42f9-81c2-7598d3a4511e.png') center/cover;
  border-radius: clamp(8px, 1vw, 20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(16px, 3vh, 32px);
  padding: clamp(10px, 5vw, 40px);
  box-sizing: border-box;
}

.hero-title {
  color: white;
  font-weight: 900;
  text-align: center;
  margin: 0;
  font-size: clamp(24px, 6vw, 72px);
  line-height: 1.2;
  letter-spacing: -0.033em;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.hero-button {
  background: #359EFF;
  color: white;
  border: none;
  border-radius: clamp(6px, 0.8vw, 12px);
  padding: clamp(8px, 1.5vh, 16px) clamp(16px, 3vw, 32px);
  font-size: clamp(14px, 2vw, 20px);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: max(120px, 15vw);
}

.hero-button:hover {
  background: #2B8ADA;
  transform: scale(1.05);
}

@media (max-aspect-ratio: 1/1) {
  .hero-container {
    aspect-ratio: unset;
    height: auto;
    min-height: min(80vh, 1000px);
  }
}
</style>
