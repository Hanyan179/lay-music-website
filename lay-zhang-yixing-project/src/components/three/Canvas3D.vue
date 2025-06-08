<template>
  <div class="canvas-container" ref="canvasContainer">
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useThreeScene } from './useThreeScene'

const canvasContainer = ref<HTMLElement>()
const { scene, camera, renderer } = useThreeScene()

onMounted(() => {
  if (canvasContainer.value) {
    // 将renderer的DOM元素添加到容器中
    canvasContainer.value.appendChild(renderer.domElement)
    
    // 设置renderer样式
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
  }
})

onUnmounted(() => {
  // 清理DOM元素
  if (canvasContainer.value && renderer.domElement) {
    canvasContainer.value.removeChild(renderer.domElement)
  }
})
</script>

<style scoped>
.canvas-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
}
:deep(canvas){
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
