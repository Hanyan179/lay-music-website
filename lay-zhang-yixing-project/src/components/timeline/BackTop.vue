<!--
 * @file src/components/timeline/BackTop.vue
 * 返回顶部按钮组件
 -->

<template>
  <button
    class="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-black/60 text-white
           hover:bg-black/80 transition-colors backdrop-blur"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script> 