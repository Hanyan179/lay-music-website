<template>
  <div class="min-h-screen bg-books-pattern">
    <!-- 顶部导航 -->
    <nav class="apple-glass border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <router-link
              to="/"
              class="apple-btn-secondary text-sm px-4 py-2"
            >
              ← 首页
            </router-link>
            <h1 class="text-xl font-bold text-gray-800">书籍图书馆</h1>
          </div>
          <div class="text-sm text-gray-700">
            共 {{ books.length }} 本书籍
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            求索
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          指间旅叩问千百人生
        </p>
      </div>

      <!-- 书籍网格 -->
      <div v-if="books.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div
          v-for="book in books"
          :key="book.id"
          class="apple-card group overflow-hidden"
        >
          <!-- 封面区域 -->
          <div class="relative h-56 overflow-hidden">
            <img
              v-if="book.coverImage"
              :src="book.coverImage"
              :alt="book.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="h-full bg-gradient-to-br"
              :style="{ background: `linear-gradient(135deg, ${book.primaryColor}, ${adjustColor(book.primaryColor, -30)})` }"
            >
              <div class="h-full flex items-center justify-center text-white text-xl font-bold p-4 text-center">
                {{ book.title }}
              </div>
            </div>

            <!-- 渐变遮罩 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <!-- 悬停操作按钮 -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="flex space-x-3">
                <button
                  @click="startGame(book.id)"
                  class="apple-btn-primary px-6 py-2 text-sm transform scale-90 hover:scale-100"
                >
                  开始游戏
                </button>
                <router-link
                  :to="`/book/${book.id}`"
                  class="apple-btn-secondary px-6 py-2 text-sm transform scale-90 hover:scale-100"
                >
                  查看详情
                </router-link>
              </div>
            </div>
          </div>

          <!-- 书籍信息 -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {{ book.title }}
              </h3>
              <button
                @click="likeBook(book.id)"
                class="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                :class="{ 'text-red-500': hasLiked(book.id), 'text-gray-400': !hasLiked(book.id) }"
              >
                <svg class="w-5 h-5" :fill="hasLiked(book.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <p v-if="book.subtitle" class="text-sm text-gray-600 mb-3 font-medium">{{ book.subtitle }}</p>
            <p class="text-gray-700 text-sm mb-4 line-clamp-2">{{ book.description }}</p>

            <!-- 作者和年份 -->
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ book.author }}
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ book.startYear }} - {{ book.endYear }}
              </span>
            </div>

            <!-- 统计信息 -->
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-4 text-gray-500">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ book.playCount }} 次游玩
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ book.likeCount }} 点赞
                </span>
              </div>

              <!-- 书籍状态标签 -->
              <div class="flex items-center space-x-2">
                <span v-if="book.isCompleted" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  已完成
                </span>
                <span v-if="hasGameProgress(book.id)" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  有进度
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-20">
        <div class="apple-card p-12 max-w-md mx-auto">
          <svg class="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">图书馆正在整理中</h3>
          <p class="text-gray-600 mb-6">精彩的人生故事即将上架，敬请期待！</p>
          <router-link
            to="/"
            class="apple-btn-primary"
          >
            返回首页
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../stores/dataStore'

const router = useRouter()
const dataStore = useDataStore()

// 计算属性
const books = computed(() => dataStore.getAllBooks)

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

const likeBook = (bookId: number) => {
  dataStore.toggleLike(bookId)
}

const hasLiked = (bookId: number): boolean => {
  return dataStore.hasLiked(bookId)
}

const hasGameProgress = (bookId: number): boolean => {
  const gameState = dataStore.getGameState(bookId)
  return gameState ? gameState.choiceHistory.length > 0 : false
}

const getGameProgress = (bookId: number): number => {
  const gameState = dataStore.getGameState(bookId)
  if (!gameState) return 0

  const totalEvents = dataStore.getPersonalChoiceEventsByBookId(bookId).length
  return totalEvents > 0 ? Math.round((gameState.choiceHistory.length / totalEvents) * 100) : 0
}

// 新增：根据书籍ID跳转到对应页面
const startGame = (bookId: number) => {
  const pageRoute = dataStore.getBookPageRoute(bookId)
  if (pageRoute === 'play') {
    router.push(`/play/${bookId}`)
  } else {
    window.location.href = `/${pageRoute}/index.html`
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
