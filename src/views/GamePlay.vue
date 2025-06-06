<template>
  <div class="min-h-screen bg-game-pattern">
    <!-- 年份指示器 -->
    <div v-if="currentYear" class="year-indicator">
      {{ currentYear }}
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen apple-glass">
      <div class="text-center p-8">
        <div class="apple-loading mx-auto mb-4"></div>
        <p class="text-gray-700 text-lg">正在准备你的人生故事...</p>
      </div>
    </div>

    <!-- 游戏内容 -->
    <div v-else-if="book" class="min-h-screen">
      <!-- 顶部导航 -->
      <nav class="apple-glass border-b border-white/20">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <router-link
                to="/books"
                class="apple-btn-secondary text-sm px-4 py-2"
              >
                ← 返回书籍
              </router-link>
              <h1 class="text-xl font-bold text-gray-800">{{ book.title }}</h1>
            </div>
            <div class="flex items-center space-x-4">
              <div class="progress-bar w-32">
                <div class="progress-fill" :style="{ width: gameProgress + '%' }"></div>
              </div>
              <span class="text-sm text-gray-700">{{ Math.round(gameProgress) }}%</span>
            </div>
          </div>
        </div>
      </nav>

      <!-- 年度事件轮播图 -->
      <div v-if="timelineEvents.length > 0" class="py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="timeline-carousel h-64 mb-8">
            <div
              v-for="(event, index) in timelineEvents"
              :key="event.id"
              :class="['timeline-slide', { active: currentSlide === index }]"
            >
              <div class="timeline-event-card h-full">
                <SafeImage
                  v-if="event.mediaUrl"
                  :src="event.mediaUrl"
                  :alt="event.title"
                  class="timeline-event-image"
                  :width="400"
                  :height="160"
                  :fallback-text="event.title"
                />
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 mb-2">{{ event.title }}</h3>
                  <p class="text-gray-600">{{ event.description }}</p>
                  <div class="flex items-center justify-between mt-4">
                    <span class="text-sm text-gray-500">{{ event.year }}年</span>
                    <div class="flex space-x-1">
                      <span
                        v-for="i in event.impact"
                        :key="i"
                        class="w-2 h-2 bg-yellow-400 rounded-full"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏主体 -->
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <!-- 当前事件 -->
        <div v-if="currentEvent && !gameEnded" class="apple-card overflow-hidden">
          <!-- 选择结果显示 -->
          <div v-if="showChoiceResult" class="text-center p-6 sm:p-8">
            <!-- 选择结果图片 -->
            <div v-if="selectedChoice?.mediaUrl" class="mb-6">
              <div class="relative h-60 sm:h-80 overflow-hidden rounded-2xl shadow-lg">
                <SafeImage
                  :src="selectedChoice.mediaUrl"
                  :alt="selectedChoice.effect"
                  class="w-full h-full object-cover transition-transform duration-300"
                  :width="600"
                  :height="320"
                  :fallback-text="selectedChoice.optionText"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
            
            <!-- 选择结果标题 -->
            <h3 class="text-2xl font-bold text-gray-900 mb-4">选择的影响</h3>
            
            <!-- 选择结果描述 -->
            <p class="text-lg text-gray-700 mb-6">
              {{ selectedChoice?.correctDescription || selectedChoice?.effect }}
            </p>
            
            <!-- 事件后续描述 -->
            <div v-if="currentEvent?.afterDescription" class="apple-card bg-gray-50 p-6 mb-6">
              <p class="text-gray-800">{{ currentEvent.afterDescription }}</p>
            </div>

            <!-- 继续按钮 -->
            <button
              @click="continueGame"
              class="apple-btn-primary px-8 py-3 text-lg"
            >
              {{ nextButtonText }}
            </button>
          </div>

          <!-- 正常游戏内容 -->
          <div v-else>
            <!-- 事件标题和描述（文字在上） -->
            <div class="p-6 sm:p-8 pb-4 text-center">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">{{ currentEvent.question }}</h2>
              <p class="text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">{{ currentEvent.description }}</p>
            </div>

            <!-- 事件图片（图片在中） -->
            <div v-if="currentEvent.mediaUrl" class="px-6 sm:px-8 mb-6">
              <div class="relative h-60 sm:h-80 overflow-hidden rounded-2xl shadow-lg">
                <SafeImage
                  v-if="currentEvent.mediaType === 'image'"
                  :src="currentEvent.mediaUrl"
                  :alt="currentEvent.question"
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  :width="600"
                  :height="320"
                  :fallback-text="currentEvent.question"
                />
                <video
                  v-else-if="currentEvent.mediaType === 'video'"
                  :src="currentEvent.mediaUrl"
                  :poster="currentEvent.mediaPoster"
                  class="w-full h-full object-cover"
                  controls
                />
                <!-- 图片遮罩效果 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            <!-- 选择选项（选择在下） -->
            <div class="p-6 sm:p-8 pt-4">
              <div class="space-y-4">
                <h3 class="text-xl font-semibold text-gray-900 mb-6 text-center">请做出你的选择：</h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div
                    v-for="option in currentEvent.options"
                    :key="option.id"
                    @click="makeChoice(option)"
                    class="choice-card transition-all duration-300 transform hover:scale-105"
                    :class="{ 
                      'incorrect ring-2 ring-red-400 bg-red-50': incorrectChoices.includes(option.id),
                      'pointer-events-none opacity-50': incorrectChoices.includes(option.id)
                    }"
                  >
                    <div class="flex flex-col h-full">
                      <div class="flex-1">
                        <p class="font-semibold text-gray-900 text-lg mb-3">{{ option.optionText }}</p>
                        <p class="text-gray-600 mb-4 flex-1 leading-relaxed">{{ option.effect }}</p>
                      </div>
                      <div v-if="option.tags.length > 0" class="flex flex-wrap gap-2 mt-auto">
                        <span
                          v-for="tag in option.tags"
                          :key="tag"
                          class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏结束 -->
        <div v-else-if="gameEnded" class="text-center py-16">
          <div class="apple-card p-8 sm:p-12 max-w-3xl mx-auto">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">人生故事完结</h2>
            <p class="text-lg sm:text-xl text-gray-700 mb-8">
              你的{{ book.title }}之旅已经完成。每一个选择都塑造了独特的人生轨迹。
            </p>
            
            <!-- 选择回顾 -->
            <div class="apple-card bg-gray-50 p-6 mb-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">你的人生选择回顾：</h3>
              <div class="space-y-3">
                <div
                  v-for="(choice, index) in gameState.choiceHistory"
                  :key="index"
                  class="text-left p-3 bg-white rounded-lg"
                >
                  <span class="text-sm text-gray-500">第{{ index + 1 }}个选择</span>
                  <p class="text-gray-800 font-medium">{{ choice }}</p>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-4 justify-center">
              <button
                @click="restartGame"
                class="apple-btn-primary px-8 py-3"
              >
                重新体验
              </button>
              <router-link
                :to="`/book/${book.id}`"
                class="apple-btn-secondary px-8 py-3"
              >
                查看时间线
              </router-link>
              <router-link
                to="/books"
                class="apple-btn-secondary px-8 py-3"
              >
                探索其他人生
              </router-link>
            </div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else class="text-center py-16">
          <div class="apple-card p-8">
            <p class="text-gray-600 text-lg">游戏配置错误，请联系管理员</p>
            <router-link
              to="/books"
              class="apple-btn-primary mt-4"
            >
              返回书籍列表
            </router-link>
          </div>
        </div>
      </main>
    </div>

    <!-- 书籍不存在 -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="apple-card p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">书籍不存在</h2>
        <router-link
          to="/books"
          class="apple-btn-primary"
        >
          返回书籍列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '../stores/dataStore'
import SafeImage from '../components/SafeImage.vue'
import type { CharacterBook, PersonalChoiceEvent, ChoiceOption, GameState, TimelineEvent } from '../types'

const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()

// 响应式状态
const loading = ref(true)
const book = ref<CharacterBook | null>(null)
const currentEvent = ref<PersonalChoiceEvent | null>(null)
const gameState = ref<GameState>({
  bookId: 0,
  currentYear: 0,
  choiceHistory: [],
  completedEvents: [],
  playerStats: {}
})
const showChoiceResult = ref(false)
const selectedChoice = ref<ChoiceOption | null>(null)
const gameEnded = ref(false)
const incorrectChoices = ref<number[]>([])
const timelineEvents = ref<TimelineEvent[]>([])
const currentSlide = ref(0)

// 轮播图相关
let slideInterval: number | null = null

// 计算属性
const currentYear = computed(() => currentEvent.value?.year || gameState.value.currentYear)
const gameProgress = computed(() => {
  const totalEvents = dataStore.getPersonalChoiceEventsByBookId(gameState.value.bookId).length
  return totalEvents > 0 ? (gameState.value.choiceHistory.length / totalEvents) * 100 : 0
})

const nextButtonText = computed(() => {
  if (!selectedChoice.value) return '继续'
  switch (selectedChoice.value.actionType) {
    case 'END':
      return '完成人生'
    case 'NEXT_EVENT':
      return selectedChoice.value.isNextYear ? '前往下一年' : '继续故事'
    default:
      return '继续'
  }
})

// 轮播图控制
const startSlideshow = () => {
  if (timelineEvents.value.length > 1) {
    slideInterval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % timelineEvents.value.length
    }, 4000)
  }
}

const stopSlideshow = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

// 初始化游戏
const initGame = () => {
  const bookId = parseInt(route.params.id as string)
  console.log('🎮 初始化游戏 - 书籍ID:', bookId)
  
  const foundBook = dataStore.getBookById(bookId)
  console.log('📚 找到的书籍:', foundBook)
  
  if (!foundBook) {
    console.error('❌ 未找到书籍，ID:', bookId)
    loading.value = false
    return
  }
  
  book.value = foundBook

  // 加载时间线事件
  timelineEvents.value = dataStore.getTimelineEventsByBookId(bookId)
  console.log('⏰ 时间线事件数量:', timelineEvents.value.length)

  // 增加游玩次数
  dataStore.incrementPlayCount(bookId)

  // 检查URL参数，如果有restart参数，则强制重新开始
  const urlParams = new URLSearchParams(window.location.search)
  const shouldRestart = urlParams.get('restart') === 'true'
  console.log('🔄 是否重新开始:', shouldRestart)

  // 初始化游戏状态
  let savedGameState = dataStore.getGameState(bookId)
  console.log('💾 保存的游戏状态:', savedGameState)
  
  if (!savedGameState || shouldRestart) {
    // 创建新的游戏状态或强制重新开始
    if (shouldRestart) {
      dataStore.deleteGameState(bookId)
    }
    
    gameState.value = {
      bookId,
      currentYear: foundBook.startYear,
      choiceHistory: [],
      completedEvents: [],
      playerStats: {}
    }
    
    // 获取起始事件
    const startingEvent = dataStore.getStartingEvent(bookId)
    console.log('🚀 起始事件:', startingEvent)
    
    // 获取所有个人选择事件进行调试
    const allEvents = dataStore.getPersonalChoiceEventsByBookId(bookId)
    console.log('📋 所有个人选择事件:', allEvents)
    console.log('📋 事件数量:', allEvents.length)
    if (allEvents.length > 0) {
      console.log('📋 第一个事件的isStartingEvent:', allEvents[0].isStartingEvent)
    }
    
    if (startingEvent) {
      currentEvent.value = startingEvent
      gameState.value.currentYear = startingEvent.year
      console.log('✅ 成功设置当前事件')
    } else {
      console.error('❌ 未找到起始事件，书籍ID:', bookId)
      
      // 如果有事件但没有起始事件，使用第一个事件
      if (allEvents.length > 0) {
        currentEvent.value = allEvents[0]
        gameState.value.currentYear = allEvents[0].year
        console.log('🔧 使用第一个事件作为起始事件:', allEvents[0])
      } else {
        console.error('❌ 没有找到任何个人选择事件')
      }
    }
  } else {
    // 恢复保存的游戏状态
    gameState.value = { ...savedGameState }
    loadCurrentEvent()
  }
  
  console.log('🎯 最终当前事件:', currentEvent.value)
  console.log('🎲 最终游戏状态:', gameState.value)
  
  loading.value = false
  startSlideshow()
}

// 加载当前事件
const loadCurrentEvent = () => {
  if (gameState.value.choiceHistory.length === 0) {
    const startingEvent = dataStore.getStartingEvent(gameState.value.bookId)
    if (startingEvent) {
      currentEvent.value = startingEvent
    }
  } else {
    const events = dataStore.getPersonalChoiceEventsByBookId(gameState.value.bookId)
    const currentIndex = gameState.value.choiceHistory.length
    
    if (currentIndex < events.length) {
      currentEvent.value = events[currentIndex]
      gameState.value.currentYear = currentEvent.value.year
    } else {
      gameEnded.value = true
    }
  }
}

// 做出选择
const makeChoice = (choice: ChoiceOption) => {
  // 检查是否是之前的错误选择
  if (incorrectChoices.value.includes(choice.id)) {
    return
  }

  // 如果选择错误，记录错误选择并返回
  if (!choice.isCorrect) {
    incorrectChoices.value.push(choice.id)
    return
  }

  // 选择正确，直接显示选择结果
  selectedChoice.value = choice
  showChoiceResult.value = true
  
  // 记录选择
  gameState.value.choiceHistory.push(choice.optionText)
  gameState.value.completedEvents.push(currentEvent.value?.eventCode || '')
  
  // 清除错误选择记录
  incorrectChoices.value = []
  
  // 保存游戏状态
  dataStore.saveGameState(gameState.value)
}

// 继续游戏
const continueGame = () => {
  if (!selectedChoice.value) return
  
  showChoiceResult.value = false
  
  switch (selectedChoice.value.actionType) {
    case 'END':
      gameEnded.value = true
      break
      
    case 'NEXT_EVENT':
      if (selectedChoice.value.nextEventCode) {
        const nextEvent = dataStore.getEventByCode(
          gameState.value.bookId,
          selectedChoice.value.nextEventCode
        )
        
        if (nextEvent) {
          currentEvent.value = nextEvent
          if (selectedChoice.value.isNextYear) {
            gameState.value.currentYear = nextEvent.year
          }
        } else {
          gameEnded.value = true
        }
      } else {
        loadNextSequentialEvent()
      }
      break
      
    default:
      loadNextSequentialEvent()
      break
  }
  
  selectedChoice.value = null
}

// 加载序列中的下一个事件
const loadNextSequentialEvent = () => {
  const events = dataStore.getPersonalChoiceEventsByBookId(gameState.value.bookId)
  const currentIndex = events.findIndex(e => e.id === currentEvent.value?.id)
  
  if (currentIndex >= 0 && currentIndex < events.length - 1) {
    currentEvent.value = events[currentIndex + 1]
    gameState.value.currentYear = currentEvent.value.year
  } else {
    gameEnded.value = true
  }
}

// 重新开始游戏
const restartGame = () => {
  console.log('🔄 点击重新体验，当前游戏状态:', gameState.value)
  
  // 完全清除localStorage中的游戏状态
  dataStore.deleteGameState(gameState.value.bookId)
  console.log('🗑️ 已删除游戏状态，书籍ID:', gameState.value.bookId)
  
  // 重置所有状态
  gameEnded.value = false
  showChoiceResult.value = false
  selectedChoice.value = null
  incorrectChoices.value = []
  
  console.log('🔄 准备重新初始化游戏')
  
  // 直接重新初始化游戏，而不是通过路由导航
  const bookId = gameState.value.bookId
  const foundBook = dataStore.getBookById(bookId)
  
  if (foundBook) {
    // 创建全新的游戏状态
    gameState.value = {
      bookId,
      currentYear: foundBook.startYear,
      choiceHistory: [],
      completedEvents: [],
      playerStats: {}
    }
    
    // 获取起始事件
    const startingEvent = dataStore.getStartingEvent(bookId)
    console.log('🚀 重新体验 - 起始事件:', startingEvent)
    
    if (startingEvent) {
      currentEvent.value = startingEvent
      gameState.value.currentYear = startingEvent.year
      console.log('✅ 重新体验 - 成功设置起始事件')
    } else {
      // 如果没有起始事件，使用第一个事件
      const allEvents = dataStore.getPersonalChoiceEventsByBookId(bookId)
      if (allEvents.length > 0) {
        currentEvent.value = allEvents[0]
        gameState.value.currentYear = allEvents[0].year
        console.log('🔧 重新体验 - 使用第一个事件作为起始事件')
      }
    }
    
    console.log('🎯 重新体验 - 最终当前事件:', currentEvent.value)
    console.log('🎲 重新体验 - 最终游戏状态:', gameState.value)
  }
}

// 监听路由变化，处理重新体验的情况
watch(
  () => route.query.restart,
  (newVal) => {
    if (newVal === 'true') {
      console.log('🔄 检测到restart参数，重新初始化游戏')
      initGame()
    }
  },
  { immediate: false }
)

onMounted(() => {
  initGame()
})

onUnmounted(() => {
  stopSlideshow()
})
</script> 