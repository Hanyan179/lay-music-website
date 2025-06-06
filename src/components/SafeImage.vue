<template>
  <img
    :src="imageSrc"
    :alt="alt"
    :class="imageClass"
    @error="handleImageError"
    @load="handleImageLoad"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { generatePlaceholderImage } from '../utils/imageUtils'

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  fallbackText?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 300,
  fallbackText: '图片加载失败',
  class: ''
})

const imageSrc = ref('')
const imageClass = ref(props.class)
const hasError = ref(false)

const generateFallback = () => {
  return generatePlaceholderImage(
    props.width,
    props.height,
    props.fallbackText,
    '#f8f9fa',
    '#6c757d'
  )
}

const handleImageError = () => {
  if (!hasError.value) {
    hasError.value = true
    imageSrc.value = generateFallback()
  }
}

const handleImageLoad = () => {
  hasError.value = false
}

const loadImage = () => {
  if (!props.src) {
    imageSrc.value = generateFallback()
    return
  }

  hasError.value = false
  imageSrc.value = props.src
}

// 监听 src 变化
watch(() => props.src, loadImage, { immediate: true })

onMounted(() => {
  loadImage()
})
</script> 