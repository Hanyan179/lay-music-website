<template>
  <div v-if="showGradient" class="artist-journey-gradient-bg"></div>
</template>

<script setup lang="ts">
interface Props {
  showGradient?: boolean
}

withDefaults(defineProps<Props>(), {
  showGradient: false // 默认不显示白色渐变背景
})
</script>

<style scoped>
.artist-journey-gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(248, 250, 252, 0.95) 25%,
    rgba(241, 245, 249, 0.9) 50%,
    rgba(248, 250, 252, 0.95) 75%,
    rgba(255, 255, 255, 0.9) 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style> 