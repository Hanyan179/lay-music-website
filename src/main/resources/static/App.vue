<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
// 组件逻辑
</script>

<style>
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --background-color: #f5f6fa;
  --text-color: #2c3e50;
  --timeline-width: 4px;
  --event-gap: 60px;
  --font-sans: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
}

#root {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
}

/* Timeline styles */
.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
}

.timeline {
  position: relative;
  padding: 40px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: var(--timeline-width);
  height: 100%;
  background-color: var(--primary-color);
}

.timeline-event {
  position: relative;
  margin-bottom: var(--event-gap);
  width: calc(50% - 30px);
}

.event-content {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.event-content:hover {
  transform: translateY(-5px);
}

.event-year {
  position: absolute;
  top: 0;
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.timeline-event:nth-child(odd) .event-year {
  right: -90px;
}

.timeline-event:nth-child(even) .event-year {
  left: -90px;
}

.event-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
}

.event-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.event-description {
  margin-bottom: 15px;
  color: #666;
}

.event-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.event-option {
  padding: 8px 16px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.event-option:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .timeline::before {
    left: 30px;
  }

  .timeline-event {
    width: calc(100% - 60px);
    left: 60px !important;
  }

  .event-year {
    left: -60px !important;
    width: 40px;
    height: 40px;
    font-size: 0.9em;
  }
}
</style> 