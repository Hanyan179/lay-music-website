<template>
  <aside 
    ref="menuRef"
    class="neon-glass-menu" 
    :class="{ 'open': isOpen }"
    :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }"
  >
    <!-- 发光效果层 -->
    <span class="shine shine-top"></span>
    <span class="shine shine-bottom"></span>
    <span class="glow glow-top"></span>
    <span class="glow glow-bottom"></span>
    <span class="glow glow-bright glow-top"></span>
    <span class="glow glow-bright glow-bottom"></span>
    
    <div class="inner">
      <!-- 搜索输入 -->
                <label class="search-label">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input type="text" :placeholder="t('contextMenu.search')" v-model="searchText" />
          </label>
          
          <!-- 主要导航 -->
          <section>
            <header>{{ t('contextMenu.mainNav') }}</header>
            <ul>
              <li 
                v-for="(item, index) in filteredMainItems" 
                :key="item.id"
                :class="{ 'selected': selectedIndex === index }"
                @click="handleItemClick(item)"
              >
                <component :is="'svg'" v-html="item.icon" />
                {{ getLocalizedLabel(item.id) }}
              </li>
            </ul>
          </section>
          
          <hr>
          
          <!-- 设置选项 -->
          <section>
            <header>{{ t('contextMenu.settings') }}</header>
            <ul>
              <li 
                v-for="(item, index) in filteredSettingsItems" 
                :key="item.id"
                :class="{ 'selected': selectedIndex === filteredMainItems.length + index }"
                @click="handleItemClick(item)"
              >
                <component :is="'svg'" v-html="item.icon" />
                {{ getLocalizedLabel(item.id) }}
              </li>
            </ul>
          </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'

// Props
interface Props {
  hue1?: number
  hue2?: number
}

const props = withDefaults(defineProps<Props>(), {
  hue1: 255,
  hue2: 222
})

// Emits
const emit = defineEmits<{
  itemClick: [item: MenuItem]
  open: [position: { x: number, y: number }]
  close: []
}>()

// Types
interface MenuItem {
  id: string
  label: string
  icon: string
  action?: string
  route?: string
}

// Router
const router = useRouter()

// 多语言支持
const { t } = useLanguage()

// Refs
const menuRef = ref<HTMLElement>()
const isOpen = ref(false)
const selectedIndex = ref(0)
const searchText = ref('')

// Menu position
const menuPosition = reactive({
  x: 0,
  y: 0
})

// Menu items
const mainItems: MenuItem[] = [
  {
    id: 'home',
    label: '首页',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>`,
    route: '/'
  },
  {
    id: 'music',
    label: '音乐',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
    </svg>`,
    route: '/music3d'
  },
  {
    id: 'messages',
    label: '留言墙',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>`,
    route: '/message-wall'
  }
]

const settingsItems: MenuItem[] = [
  {
    id: 'timeline',
    label: '时间线',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>`,
    route: '/timeline'
  },
  {
    id: 'admin',
    label: '管理员',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>`,
    route: '/x-back'
  }
]

// Computed
const filteredMainItems = computed(() => {
  if (!searchText.value) return mainItems
  return mainItems.filter(item => 
    item.label.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const filteredSettingsItems = computed(() => {
  if (!searchText.value) return settingsItems
  return settingsItems.filter(item => 
    item.label.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// Methods
const openMenu = (x: number, y: number) => {
  const menuBox = menuRef.value?.getBoundingClientRect()
  const bodyBox = { width: window.innerWidth, height: window.innerHeight }
  const padding = { x: 30, y: 20 }
  
  if (menuBox) {
    const hitX = x + menuBox.width >= bodyBox.width - padding.x
    const hitY = y + menuBox.height >= bodyBox.height - padding.y
    
    if (hitX) {
      x = bodyBox.width - menuBox.width - padding.x
    }
    
    if (hitY) {
      y = bodyBox.height - menuBox.height - padding.y
    }
  }
  
  menuPosition.x = x
  menuPosition.y = y
  isOpen.value = true
  selectedIndex.value = 0
  
  emit('open', { x, y })
}

const closeMenu = () => {
  isOpen.value = false
  searchText.value = ''
  emit('close')
}

const handleItemClick = (item: MenuItem) => {
  selectedIndex.value = [...filteredMainItems.value, ...filteredSettingsItems.value].indexOf(item)
  
  if (item.route) {
    router.push(item.route)
  }
  
  emit('itemClick', item)
  closeMenu()
}

// 获取本地化标签
const getLocalizedLabel = (itemId: string) => {
  const labelMap: Record<string, string> = {
    'home': t('nav.home'),
    'music': t('nav.music'),
    'messages': t('nav.messages'),
    'timeline': t('contextMenu.timeline'),
    'admin': t('contextMenu.admin')
  }
  return labelMap[itemId] || itemId
}

// Event handlers
const handleContextMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const isMenu = menuRef.value?.contains(target)
  
  event.preventDefault()
  
  if (!isMenu) {
    openMenu(event.clientX, event.clientY)
  }
}

const handlePointerDown = (event: PointerEvent) => {
  const target = event.target as HTMLElement
  const isMenu = menuRef.value?.contains(target)
  const isInput = target.matches('input')
  
  if (!isMenu && !isInput) {
    closeMenu()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('contextmenu', handleContextMenu)
  document.addEventListener('pointerdown', handlePointerDown)
  
  // 设置 CSS 变量
  document.documentElement.style.setProperty('--neon-hue1', props.hue1.toString())
  document.documentElement.style.setProperty('--neon-hue2', props.hue2.toString())
})

onUnmounted(() => {
  document.removeEventListener('contextmenu', handleContextMenu)
  document.removeEventListener('pointerdown', handlePointerDown)
})

// Expose methods
defineExpose({
  openMenu,
  closeMenu
})
</script>

<style scoped>
:root {
  --neon-hue1: 255;
  --neon-hue2: 222;
  --neon-border: 1px;
  --neon-border-color: hsl(var(--neon-hue2), 12%, 20%);
  --neon-radius: 22px;
  --neon-ease: cubic-bezier(0.5, 1, 0.89, 1);
}

.neon-glass-menu {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition-property: visibility, opacity, filter;
  transition-duration: 0s, 0.25s, 0.25s;
  transition-delay: 0.5s, 0s, 0s;
  transition-timing-function: var(--neon-ease);
  filter: blur(4px);
  
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #737985;
  
  position: fixed;
  top: 140px;
  left: 2vw;
  min-width: 275px;
  min-height: 275px;
  border-radius: var(--neon-radius);
  border: var(--neon-border) solid var(--neon-border-color);
  padding: 1em;
  background: linear-gradient(235deg, hsl(var(--neon-hue1) 50% 10% / 0.8), hsl(var(--neon-hue1) 50% 10% / 0) 33%), 
              linear-gradient(45deg, hsl(var(--neon-hue2) 50% 10% / 0.8), hsl(var(--neon-hue2) 50% 10% / 0) 33%), 
              linear-gradient(hsl(220deg 25% 4.8% / 0.66));
  backdrop-filter: blur(12px);
  box-shadow: hsl(var(--neon-hue2) 50% 2%) 0px 10px 16px -8px, 
              hsl(var(--neon-hue2) 50% 4%) 0px 20px 36px -14px;
  z-index: 9999;
}

.neon-glass-menu:not(.open)::before,
.neon-glass-menu:not(.open)::after,
.neon-glass-menu:not(.open) .glow {
  opacity: 0;
  pointer-events: none;
  animation: glowoff 0.25s var(--neon-ease) both;
}

.neon-glass-menu.open {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0s;
  filter: blur(0px);
}

.neon-glass-menu.open::before,
.neon-glass-menu.open::after,
.neon-glass-menu.open .glow,
.neon-glass-menu.open .shine {
  animation: glow 1s var(--neon-ease) both;
}

.neon-glass-menu.open .shine {
  animation-delay: 0s;
  animation-duration: 2s;
}

.neon-glass-menu.open .glow {
  animation-delay: 0.2s;
}

.neon-glass-menu.open .glow-bright {
  animation-delay: 0.1s;
  animation-duration: 1.5s;
}

.neon-glass-menu.open .shine-bottom {
  animation-delay: 0.1s;
  animation-duration: 1.8s;
}

.neon-glass-menu.open .glow-bottom {
  animation-delay: 0.3s;
}

.neon-glass-menu.open .glow-bright.glow-bottom {
  animation-delay: 0.3s;
  animation-duration: 1.1s;
}

.shine,
.glow {
  --hue: var(--neon-hue1);
}

.shine-bottom,
.glow-bottom {
  --hue: var(--neon-hue2);
  --conic: 135deg;
}

.shine,
.shine::before,
.shine::after {
  pointer-events: none;
  border-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-left-radius: inherit;
  border: 1px solid transparent;
  
  width: 75%;
  height: auto;
  min-height: 0px;
  aspect-ratio: 1;
  display: block;
  position: absolute;
  right: calc(var(--neon-border) * -1);
  top: calc(var(--neon-border) * -1);
  left: auto;
  
  z-index: 1;
  
  --start: 12%;
  background: conic-gradient(
    from var(--conic, -45deg) at center in oklch,
    transparent var(--start, 0%), 
    hsl(var(--hue), var(--sat, 80%), var(--lit, 60%)), 
    transparent var(--end, 50%)
  ) border-box;
  
  mask: linear-gradient(transparent), linear-gradient(black);
  mask-repeat: no-repeat;
  mask-clip: padding-box, border-box;
  mask-composite: subtract;
}

.shine::before,
.shine::after {
  content: "";
  width: auto;
  inset: -2px;
  mask: none;
}

.shine::after {
  z-index: 2;
  --start: 17%;
  --end: 33%;
  background: conic-gradient(
    from var(--conic, -45deg) at center in oklch,
    transparent var(--start, 0%), 
    hsl(var(--hue), var(--sat, 80%), var(--lit, 85%)), 
    transparent var(--end, 50%)
  );
}

.shine-bottom {
  top: auto;
  bottom: calc(var(--neon-border) * -1);
  left: calc(var(--neon-border) * -1);
  right: auto;
}

.glow {
  pointer-events: none;
  border-top-right-radius: calc(var(--neon-radius) * 2.5);
  border-bottom-left-radius: calc(var(--neon-radius) * 2.5);
  border: calc(var(--neon-radius) * 1.25) solid transparent;
  inset: calc(var(--neon-radius) * -2);
  
  width: 75%;
  height: auto;
  min-height: 0px;
  aspect-ratio: 1;
  display: block;
  position: absolute;
  left: auto;
  bottom: auto;
  
  opacity: 1;
  filter: blur(12px) saturate(1.25) brightness(0.5);
  mix-blend-mode: plus-lighter;
  z-index: 3;
}

.glow.glow-bottom {
  inset: calc(var(--neon-radius) * -2);
  top: auto;
  right: auto;
}

.glow::before,
.glow::after {
  content: "";
  position: absolute;
  inset: 0;
  border: inherit;
  border-radius: inherit;
  background: conic-gradient(
    from var(--conic, -45deg) at center in oklch,
    transparent var(--start, 0%), 
    hsl(var(--hue), var(--sat, 95%), var(--lit, 60%)), 
    transparent var(--end, 50%)
  ) border-box;
  mask: linear-gradient(transparent), linear-gradient(black);
  mask-repeat: no-repeat;
  mask-clip: padding-box, border-box;
  mask-composite: subtract;
  filter: saturate(2) brightness(1);
}

.glow::after {
  --lit: 70%;
  --sat: 100%;
  --start: 15%;
  --end: 35%;
  border-width: calc(var(--neon-radius) * 1.75);
  border-radius: calc(var(--neon-radius) * 2.75);
  inset: calc(var(--neon-radius) * -0.25);
  z-index: 4;
  opacity: 0.75;
}

.glow-bright {
  --lit: 80%;
  --sat: 100%;
  --start: 13%;
  --end: 37%;
  
  border-width: 5px;
  border-radius: calc(var(--neon-radius) + 2px);
  inset: -7px;
  left: auto;
  filter: blur(2px) brightness(0.66);
}

.glow-bright::after {
  content: none;
}

.glow-bright.glow-bottom {
  inset: -7px;
  right: auto;
  top: auto;
}

.inner,
section {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.inner {
  font-size: 0.875rem;
}

hr {
  width: 100%;
  height: 0.5px;
  background: var(--neon-border-color);
  border: none;
  margin: 0.25em 0 0.5em;
  opacity: 0.66;
}

input {
  font-family: inherit;
  font-weight: 300;
  box-shadow: 0 0 0 1px transparent;
  border: 1px solid hsl(var(--neon-hue2) 13% 18.5% / 0.5);
  background: hsl(var(--neon-hue1) 0% 40% / 0.05);
  border-radius: calc(var(--neon-radius) * 0.33333);
  padding: 0.5em;
  padding-left: 2.33em;
  color: #fff;
  outline: none;
}

.search-label {
  display: grid;
  grid-template: 1fr/1fr;
  margin-bottom: 1em;
  width: 100%;
}

.search-label > * {
  grid-area: 1/1;
  align-self: center;
}

.search-label svg {
  margin-left: 0.5em;
  opacity: 0.5;
  width: 20px;
  height: 20px;
  z-index: 1;
}

header {
  font-size: 0.75rem;
  font-weight: 300;
  padding: 0 0.66em;
  color: rgba(255, 255, 255, 0.6);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  position: relative;
  padding: 0.66em;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 0.5em;
  border-radius: calc(var(--neon-radius) * 0.33333);
  border: 1px solid transparent;
  transition: all 0.3s ease-in, --item-opacity 0.3s ease-in;
  background: linear-gradient(
    90deg in oklch,
    hsl(var(--neon-hue1) 29% 13% / var(--item-opacity)),
    hsl(var(--neon-hue1) 30% 15% / var(--item-opacity)) 24% 32%,
    hsl(var(--neon-hue1) 5% 7% / var(--item-opacity))
  ) border-box;
  cursor: pointer;
  user-select: none;
}

li::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: inherit;
  background: linear-gradient(
    90deg in oklch,
    hsl(var(--neon-hue1) 15% 16% / var(--item-opacity)),
    hsl(var(--neon-hue1) 40% 24% / var(--item-opacity)) 20% 32%,
    hsl(var(--neon-hue1) 2% 12% / var(--item-opacity))
  ) border-box;
  mask: linear-gradient(transparent), linear-gradient(black);
  mask-repeat: no-repeat;
  mask-clip: padding-box, border-box;
  mask-composite: subtract;
}

li:hover,
li.selected,
li:hover::after,
li.selected::after {
  --item-opacity: 0.5;
  transition: all 0.1s ease-out, --item-opacity 0.1s ease-out;
  color: white;
}

li.selected,
li.selected::after {
  animation: flash 0.75s ease-out 1 forwards;
}

li svg {
  fill: none;
  stroke-width: 1;
  height: 20px;
  width: 20px;
  flex-shrink: 0;
}

@property --item-opacity {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}

@keyframes glow {
  0% { opacity: 0; }
  3% { opacity: 1; }
  10% { opacity: 0; }
  12% { opacity: 0.7; }
  16% { 
    opacity: 0.3;
    animation-timing-function: var(--neon-ease);
  }
  100% { 
    opacity: 1;
    animation-timing-function: var(--neon-ease);
  }
}

@keyframes glowoff {
  to { opacity: 0; }
}

@keyframes flash {
  0% {
    opacity: 0;
    --item-opacity: 0;
  }
  7% {
    opacity: 0.5;
    --item-opacity: 1;
  }
  14% {
    opacity: 0;
    --item-opacity: 0.5;
  }
  21%, 100% {
    opacity: 1;
    --item-opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .neon-glass-menu {
    min-width: 250px;
    left: 1vw;
  }
}
</style> 