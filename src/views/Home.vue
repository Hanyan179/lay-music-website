<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 头部导航 -->
    <nav class="apple-glass border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">宿命回响</h1>
            <span class="ml-2 text-sm text-gray-500">Fate Echoes</span>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/books"
              class="apple-btn-secondary text-sm px-4 py-2"
            >
              图书馆
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="bounce-enter-active">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              宿命回响
            </span>
          </h1>
        </div>
        <div class="fade-enter-active" style="animation-delay: 0.3s;">
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            体验不同的人生选择，探索每个决定带来的独特结果。
            在时间线中见证你的故事，感受选择的力量。
          </p>
        </div>
        <div class="fade-enter-active" style="animation-delay: 0.6s;">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/books"
              class="apple-btn-primary px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200"
            >
              开始探索
            </router-link>
          </div>
        </div>
      </div>

      <!-- 精选书籍 - 限制9本 -->
      <section class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">精选人生故事</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            每一个故事都是一次独特的人生体验，选择不同的道路，感受命运的回响
          </p>
        </div>
        
        <div v-if="featuredBooks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(book, index) in featuredBooks"
            :key="book.id"
            class="apple-card group overflow-hidden cursor-pointer"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="startGame(book.id)"
          >
            <!-- 封面区域 -->
            <div class="relative h-64 overflow-hidden">
              <img
                v-if="book.coverImage"
                :src="book.coverImage"
                :alt="book.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
              
              <!-- 悬停遮罩 -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              
              <!-- 悬停信息 -->
              <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div class="text-white space-y-2">
                  <div class="flex items-center justify-between text-sm">
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
                      {{ book.likeCount }}
                    </span>
                  </div>
                  <div class="text-sm">{{ book.startYear }} - {{ book.endYear }} • {{ book.author }}</div>
                  <div v-if="hasGameProgress(book.id)" class="text-xs bg-blue-500 px-2 py-1 rounded-full inline-block">
                    有游戏进度
                  </div>
                </div>
              </div>
            </div>

            <!-- 书籍信息 -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {{ book.title }}
                </h3>
                <button
                  @click.stop="likeBook(book.id)"
                  class="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
                  :class="{ 'text-red-500': hasLiked(book.id), 'text-gray-400': !hasLiked(book.id) }"
                >
                  <svg class="w-5 h-5" :fill="hasLiked(book.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <p v-if="book.subtitle" class="text-sm text-gray-600 mb-3 font-medium">{{ book.subtitle }}</p>
              <p class="text-gray-700 text-sm line-clamp-2 mb-4">{{ book.description }}</p>
              
              <!-- 快速开始按钮 -->
              <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  @click.stop="startGame(book.id)"
                  class="w-full apple-btn-primary py-2 text-sm"
                >
                  开始体验
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div class="text-center mt-12">
          <router-link
            to="/books"
            class="apple-btn-secondary px-8 py-3 text-lg"
          >
            查看全部书籍
          </router-link>
        </div>
      </section>

      <!-- 功能介绍 -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="text-center p-8 apple-card transform hover:scale-105 transition-all duration-300">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">人生选择</h3>
          <p class="text-gray-600">在关键时刻做出选择，体验不同路径带来的结果</p>
        </div>
        
        <div class="text-center p-8 apple-card transform hover:scale-105 transition-all duration-300">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">时间线体验</h3>
          <p class="text-gray-600">以时间线形式呈现人生历程，见证每个重要时刻</p>
        </div>
        
        <div class="text-center p-8 apple-card transform hover:scale-105 transition-all duration-300">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">即时反馈</h3>
          <p class="text-gray-600">选择后立即看到结果，了解决定的影响和意义</p>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="mt-20 py-12 text-center">
      <div class="apple-card p-8">
        <p class="text-gray-600 mb-4">
          探索无限可能的人生故事，每一个选择都将塑造独特的命运轨迹
        </p>
        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <router-link to="/books" class="hover:text-blue-600 transition-colors">
            浏览所有书籍
          </router-link>
          <span>•</span>
          <a href="#" class="hover:text-blue-600 transition-colors">关于我们</a>
          <span>•</span>
          <a href="#" class="hover:text-blue-600 transition-colors">联系方式</a>
          <span>•</span>
          <router-link to="/admin" class="hover:text-blue-600 transition-colors">
            管理员入口
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../stores/dataStore'

const router = useRouter()
const dataStore = useDataStore()

// 使用精选书籍（限制9本）
const featuredBooks = computed(() => dataStore.getFeaturedBooks)

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

const startGame = (bookId: number) => {
  const pageRoute = dataStore.getBookPageRoute(bookId)
  if (pageRoute === 'play') {
    router.push(`/play/${bookId}`)
  } else {
    window.location.href = `/${pageRoute}/index.html`
  }
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
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 动画样式 */
.fade-enter-active {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.bounce-enter-active {
  animation: bounceIn 1s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 书籍卡片动画 */
.apple-card {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 