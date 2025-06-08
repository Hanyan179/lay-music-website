<!--
 * @file src/views/TimelinePage.vue
 * 时间轴页面组件
 -->

<template>
  <BackTop text="返回艺人历程" @click="router.back()" />
  <Timeline3D />
</template>

<script setup lang="ts">
import BackTop from '@/components/timeline/BackTop.vue';
import Timeline3D from '@/views/Timeline3D.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
:global(body) {
  overflow: hidden;
}
</style> 