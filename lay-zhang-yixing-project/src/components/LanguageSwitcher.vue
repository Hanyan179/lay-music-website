<template>
  <div class="language-switcher" :class="{ 'open': isOpen }">
    <!-- 当前语言按钮 -->
    <button 
      class="language-button current-lang"
      @click="toggleDropdown"
      @blur="handleBlur"
    >
      <span class="language-flag">{{ getFlagEmoji(currentLanguage) }}</span>
      <span class="language-name">{{ languageNames[currentLanguage] }}</span>
      <svg 
        class="dropdown-icon" 
        :class="{ 'rotated': isOpen }"
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <!-- 语言选项下拉菜单 -->
    <div class="language-dropdown" v-show="isOpen">
      <button
        v-for="(name, code) in languageNames"
        :key="code"
        class="language-option"
        :class="{ 'active': code === currentLanguage }"
        @click="selectLanguage(code as LanguageCode)"
      >
        <span class="language-flag">{{ getFlagEmoji(code as LanguageCode) }}</span>
        <span class="language-name">{{ name }}</span>
        <svg 
          v-if="code === currentLanguage"
          class="check-icon"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { languageNames, type LanguageCode } from '@/data/languages'

// Props
interface Props {
  currentLanguage: LanguageCode
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  languageChange: [language: LanguageCode]
}>()

// State
const isOpen = ref(false)

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleBlur = (event: FocusEvent) => {
  // 延迟关闭，确保点击选项能正常工作
  setTimeout(() => {
    const activeElement = document.activeElement
    const container = (event.target as HTMLElement)?.closest('.language-switcher')
    
    if (!container?.contains(activeElement)) {
      isOpen.value = false
    }
  }, 150)
}

const selectLanguage = (language: LanguageCode) => {
  emit('languageChange', language)
  isOpen.value = false
}

const getFlagEmoji = (language: LanguageCode): string => {
  const flags = {
    'zh-CN': '🇨🇳',
    'en-US': '🇺🇸', 
    'ko-KR': '🇰🇷'
  }
  return flags[language]
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const switcher = document.querySelector('.language-switcher')
  
  if (switcher && !switcher.contains(target)) {
    isOpen.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-switcher {
  --lang-hue1: 260;
  --lang-hue2: 200;
  
  position: relative;
  z-index: 1000;
}

/* 当前语言按钮 */
.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid hsl(var(--lang-hue2), 40%, 30%, 0.5);
  background: linear-gradient(
    135deg,
    hsl(var(--lang-hue1), 50%, 10%, 0.4),
    hsl(var(--lang-hue2), 50%, 10%, 0.3)
  );
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  min-width: 100px;
}

.language-button:hover {
  border-color: hsl(var(--lang-hue2), 50%, 50%, 0.7);
  background: linear-gradient(
    135deg,
    hsl(var(--lang-hue1), 50%, 15%, 0.6),
    hsl(var(--lang-hue2), 50%, 15%, 0.5)
  );
  color: #ffffff;
  box-shadow: 
    0 0 12px hsl(var(--lang-hue2), 60%, 50%, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3) inset;
}

.language-flag {
  font-size: 1.1rem;
  line-height: 1;
}

.language-name {
  flex: 1;
  text-align: left;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

/* 下拉菜单 */
.language-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  border-radius: 12px;
  border: 1px solid hsl(var(--lang-hue2), 40%, 30%, 0.5);
  background: linear-gradient(
    135deg,
    hsl(var(--lang-hue1), 50%, 8%, 0.9),
    hsl(var(--lang-hue2), 50%, 8%, 0.8)
  );
  backdrop-filter: blur(16px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 20px hsl(var(--lang-hue2), 60%, 50%, 0.2),
    0 1px 0 rgba(255, 255, 255, 0.1) inset;
  overflow: hidden;
  animation: dropdownSlide 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.language-option:hover {
  background: linear-gradient(
    90deg,
    hsl(var(--lang-hue1), 50%, 15%, 0.3),
    hsl(var(--lang-hue2), 50%, 15%, 0.2)
  );
  color: #ffffff;
}

.language-option.active {
  background: linear-gradient(
    90deg,
    hsl(var(--lang-hue1), 60%, 20%, 0.4),
    hsl(var(--lang-hue2), 60%, 20%, 0.3)
  );
  color: #ffffff;
  font-weight: 500;
}

.language-option .language-flag {
  font-size: 1rem;
}

.language-option .language-name {
  flex: 1;
}

.check-icon {
  width: 14px;
  height: 14px;
  color: hsl(var(--lang-hue2), 70%, 60%);
}

/* 动画 */
@keyframes dropdownSlide {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .language-button {
    padding: 0.4rem 0.8rem;
    min-width: 90px;
    font-size: 0.8rem;
  }
  
  .language-flag {
    font-size: 1rem;
  }
  
  .dropdown-icon {
    width: 14px;
    height: 14px;
  }
  
  .language-option {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .language-button {
    padding: 0.3rem 0.6rem;
    min-width: 80px;
  }
  
  .language-dropdown {
    top: calc(100% + 6px);
  }
}
</style> 