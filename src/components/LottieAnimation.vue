<template>
  <div ref="animationContainer" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import lottie, { AnimationItem } from 'lottie-web'

interface Props {
  animationData?: object
  width?: string
  height?: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: '100px',
  height: '100px',
  loop: true,
  autoplay: true,
  speed: 1
})

const animationContainer = ref<HTMLElement>()
let animation: AnimationItem | null = null

const loadAnimation = () => {
  if (!animationContainer.value || !props.animationData) return

  animation = lottie.loadAnimation({
    container: animationContainer.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
    animationData: props.animationData
  })

  animation.setSpeed(props.speed)
}

const play = () => {
  animation?.play()
}

const pause = () => {
  animation?.pause()
}

const stop = () => {
  animation?.stop()
}

const destroy = () => {
  animation?.destroy()
  animation = null
}

onMounted(() => {
  loadAnimation()
})

onUnmounted(() => {
  destroy()
})

watch(() => props.animationData, () => {
  destroy()
  loadAnimation()
})

defineExpose({
  play,
  pause,
  stop,
  destroy
})
</script> 