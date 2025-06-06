<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 主内容 -->
    <div v-else-if="book">
      <!-- 顶部导航 -->
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <router-link
                to="/books"
                class="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← 书籍列表
              </router-link>
              <h1 class="text-xl font-semibold text-gray-900">{{ book.title }}</h1>
            </div>
          </div>
        </div>
      </nav>

      <!-- 书籍封面和信息 -->
      <section class="bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- 封面 -->
            <div class="lg:col-span-1">
              <div
                class="w-full h-96 bg-gradient-to-br rounded-lg shadow-lg"
                :style="{ background: `linear-gradient(to bottom right, ${book.primaryColor}, ${adjustColor(book.primaryColor, -20)})` }"
              >
                <div class="h-full flex items-center justify-center text-white text-2xl font-bold p-8 text-center">
                  {{ book.title }}
                </div>
              </div>
            </div>

            <!-- 书籍信息 -->
            <div class="lg:col-span-2">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ book.title }}</h1>
              <p v-if="book.subtitle" class="text-xl text-gray-600 mb-6">{{ book.subtitle }}</p>
              
              <div class="grid grid-cols-2 gap-6 mb-8 text-sm">
                <div>
                  <span class="font-semibold text-gray-700">作者：</span>
                  <span class="text-gray-600">{{ book.author }}</span>
                </div>
                <div>
                  <span class="font-semibold text-gray-700">时间跨度：</span>
                  <span class="text-gray-600">{{ book.startYear }} - {{ book.endYear }} 年</span>
                </div>
                <div>
                  <span class="font-semibold text-gray-700">游玩次数：</span>
                  <span class="text-gray-600">{{ book.playCount }} 次</span>
                </div>
                <div>
                  <span class="font-semibold text-gray-700">点赞数：</span>
                  <span class="text-gray-600">{{ book.likeCount }} 个</span>
                </div>
              </div>

              <p class="text-gray-700 text-lg leading-relaxed mb-8">{{ book.description }}</p>

              <!-- 操作按钮 -->
              <div class="flex space-x-4">
                <router-link
                  :to="`/play/${book.id}`"
                  class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  开始游戏
                </router-link>
                <button
                  @click="likeBook"
                  class="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center"
                  :class="{ 'text-red-500 border-red-300 bg-red-50': liked }"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ liked ? '已点赞' : '点赞' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 时间线预览 -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">故事时间线</h2>
          
          <div class="relative">
            <!-- 时间线线条 -->
            <div class="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full"></div>
            
            <!-- 时间线事件 -->
            <div class="space-y-12">
              <div
                v-for="(event, index) in timelineEvents"
                :key="event.id"
                class="relative flex items-center"
                :class="index % 2 === 0 ? 'justify-start' : 'justify-end'"
              >
                <!-- 年份圆点 -->
                <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                
                <!-- 事件卡片 -->
                <div
                  class="w-5/12 bg-white rounded-lg shadow-lg p-6"
                  :class="index % 2 === 0 ? 'mr-auto' : 'ml-auto'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">{{ event.title }}</h3>
                    <span class="text-sm font-medium text-blue-600">{{ event.year }} 年</span>
                  </div>
                  <p class="text-gray-600 text-sm">{{ event.description }}</p>
                  <div v-if="event.tags.length > 0" class="mt-3 flex flex-wrap gap-1">
                    <span
                      v-for="tag in event.tags"
                      :key="tag"
                      class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 人生抉择预览 -->
      <section class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">关键抉择</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="choice in personalChoiceEvents"
              :key="choice.id"
              class="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ choice.question }}</h3>
                <span class="text-sm font-medium text-blue-600">{{ choice.year }} 年</span>
              </div>
              <p class="text-gray-600 text-sm mb-4">{{ choice.description }}</p>
              
              <div class="space-y-2">
                <p class="text-xs text-gray-500 font-medium">可选择的道路：</p>
                <div
                  v-for="option in choice.options.slice(0, 2)"
                  :key="option.id"
                  class="text-xs text-gray-600 bg-white rounded px-3 py-2"
                >
                  {{ option.optionText }}
                </div>
                <div v-if="choice.options.length > 2" class="text-xs text-gray-500 text-center">
                  还有 {{ choice.options.length - 2 }} 个选择...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 书籍不存在 -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">书籍不存在</h2>
        <router-link
          to="/books"
          class="text-blue-600 hover:text-blue-800"
        >
          返回书籍列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDataStore } from '../stores/dataStore'
import type { CharacterBook, TimelineEvent, PersonalChoiceEvent } from '../types'

const route = useRoute()
const dataStore = useDataStore()

// 响应式状态
const loading = ref(true)
const book = ref<CharacterBook | null>(null)
const liked = ref(false)

// 计算属性
const timelineEvents = computed((): TimelineEvent[] => {
  if (!book.value) return []
  return dataStore.getTimelineEventsByBookId(book.value.id)
    .sort((a, b) => a.year - b.year)
})

const personalChoiceEvents = computed((): PersonalChoiceEvent[] => {
  if (!book.value) return []
  return dataStore.getPersonalChoiceEventsByBookId(book.value.id)
    .sort((a, b) => a.year - b.year)
})

// 方法
const adjustColor = (color: string, amount: number): string => {
  const usePound = color[0] === '#'
  const col = usePound ? color.slice(1) : color
  const num = parseInt(col, 16)
  let r = (num >> 16) + amount
  let g = (num >> 8 & 0x00FF) + amount
  let b = (num & 0x0000FF) + amount
  r = r > 255 ? 255 : r < 0 ? 0 : r
  g = g > 255 ? 255 : g < 0 ? 0 : g
  b = b > 255 ? 255 : b < 0 ? 0 : b
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0')
}

const likeBook = () => {
  if (!book.value || liked.value) return
  
  dataStore.incrementLikeCount(book.value.id)
  liked.value = true
  saveLikedStatus()
}

const saveLikedStatus = () => {
  if (!book.value) return
  
  try {
    const saved = localStorage.getItem('fate-echoes-liked-books')
    const likedBooks = saved ? JSON.parse(saved) : []
    
    if (!likedBooks.includes(book.value.id)) {
      likedBooks.push(book.value.id)
      localStorage.setItem('fate-echoes-liked-books', JSON.stringify(likedBooks))
    }
  } catch (error) {
    console.error('Failed to save liked status:', error)
  }
}

const loadLikedStatus = () => {
  if (!book.value) return
  
  try {
    const saved = localStorage.getItem('fate-echoes-liked-books')
    if (saved) {
      const likedBooks = JSON.parse(saved)
      liked.value = likedBooks.includes(book.value.id)
    }
  } catch (error) {
    console.error('Failed to load liked status:', error)
  }
}

const initPage = () => {
  const bookId = parseInt(route.params.id as string)
  const foundBook = dataStore.getBookById(bookId)
  
  if (foundBook) {
    book.value = foundBook
    loadLikedStatus()
  }
  
  loading.value = false
}

onMounted(() => {
  initPage()
})
</script> 