<template>
  <div class="music-3d-page">
    <!-- 导航栏 -->
    <nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-white font-bold text-xl">
            LAY ZHANG / 音乐作品
          </div>
          <div class="flex items-center space-x-8">
            <button @click="router.push('/')" class="text-white/80 hover:text-white transition-colors">
              返回首页
            </button>
            <div class="flex items-center space-x-4">
              <span class="text-white/60 text-sm">{{ currentIndex + 1 }} / {{ musicData.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 分类导航 -->
    <div class="category-nav fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
      <div class="flex flex-col space-y-4 p-4">
        <button 
          v-for="(category, index) in categories" 
          :key="category"
          @click="filterByCategory(category)"
          :class="[
            'category-btn px-4 py-2 text-sm font-medium transition-all duration-300',
            activeCategory === category 
              ? 'bg-white text-black' 
              : 'bg-black/20 text-white hover:bg-white/20'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="min-h-screen pt-20">
      <!-- 全屏轮播展示 -->
      <div class="slideshow-container relative w-full h-screen overflow-hidden">
        <div 
          class="slides-wrapper flex transition-transform duration-1000 ease-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div 
            v-for="(album, index) in filteredAlbums" 
            :key="album.id"
            class="slide w-full h-screen flex-shrink-0 relative"
          >
            <!-- 背景图片 -->
            <div 
              class="absolute inset-0 bg-cover bg-center"
              :style="{ backgroundImage: `url(${album.albumCover})` }"
            >
              <div class="absolute inset-0 bg-black/40"></div>
            </div>
            
            <!-- 专辑信息覆盖 -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="album-info text-center text-white max-w-4xl px-8">
                <div class="mb-8">
                  <div class="text-6xl md:text-8xl font-black mb-4 tracking-tighter">
                    {{ album.albumTitle }}
                  </div>
                  <div class="text-xl md:text-2xl text-white/80 mb-6">
                    {{ album.year }} · {{ album.genre }}
                  </div>
                  <div class="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                    {{ album.description }}
                  </div>
                </div>
                
                <!-- 播放按钮 -->
                <div class="flex justify-center space-x-6">
                  <button 
                    @click="playAlbum(album)"
                    class="play-btn bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform"
                  >
                    播放专辑
                  </button>
                  <button 
                    @click="showAlbumDetails(album)"
                    class="details-btn border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-colors"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>

            <!-- 下一张预览 -->
            <div 
              v-if="index < filteredAlbums.length - 1"
              class="absolute bottom-8 right-8 w-32 h-32 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              @click="nextSlide"
            >
              <div 
                class="w-full h-full bg-cover bg-center rounded-lg"
                :style="{ backgroundImage: `url(${filteredAlbums[index + 1].albumCover})` }"
              >
                <div class="absolute inset-0 bg-black/20 rounded-lg"></div>
                <div class="absolute bottom-2 right-2 text-white text-xs">
                  下一张
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 导航控制 -->
        <div class="slide-controls absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button 
            @click="prevSlide"
            :disabled="currentIndex === 0"
            class="control-btn w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-30"
          >
            ←
          </button>
          <button 
            @click="nextSlide"
            :disabled="currentIndex === filteredAlbums.length - 1"
            class="control-btn w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-30"
          >
            →
          </button>
        </div>

        <!-- 进度指示器 -->
        <div class="progress-indicators absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div 
            v-for="(album, index) in filteredAlbums"
            :key="album.id"
            @click="goToSlide(index)"
            :class="[
              'indicator w-2 h-2 rounded-full cursor-pointer transition-all',
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/40'
            ]"
          ></div>
        </div>
      </div>

      <!-- 网格视图切换 -->
      <div class="grid-toggle fixed bottom-8 left-8 z-40">
        <button 
          @click="toggleViewMode"
          class="view-toggle-btn bg-black/80 text-white p-3 rounded-full hover:bg-black transition-colors"
        >
          <svg v-if="viewMode === 'slideshow'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h8M4 4l5 5M20 16v4m0 0h-8m8 0l-5-5"/>
          </svg>
        </button>
      </div>

      <!-- 网格布局视图 -->
      <div 
        v-if="viewMode === 'grid'"
        class="grid-view bg-black min-h-screen pt-8 pb-16"
      >
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(album, index) in filteredAlbums"
              :key="album.id"
              @click="selectAlbum(index)"
              class="album-card group cursor-pointer"
            >
              <div class="relative overflow-hidden rounded-lg">
                <img 
                  :src="album.albumCover" 
                  :alt="album.albumTitle"
                  class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                >
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300">
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="text-center text-white">
                      <div class="text-2xl font-bold mb-2">{{ album.albumTitle }}</div>
                      <div class="text-sm">{{ album.year }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 专辑详情模态框 -->
    <div 
      v-if="showDetails"
      class="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-8"
      @click="hideAlbumDetails"
    >
      <div 
        class="album-details bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-8">
          <div class="flex items-start space-x-8">
            <img 
              :src="selectedAlbum.albumCover" 
              :alt="selectedAlbum.albumTitle"
              class="w-64 h-64 object-cover rounded-lg flex-shrink-0"
            >
            <div class="flex-1">
              <h2 class="text-4xl font-bold mb-4">{{ selectedAlbum.albumTitle }}</h2>
              <div class="text-xl text-gray-600 mb-6">{{ selectedAlbum.year }} · {{ selectedAlbum.genre }}</div>
              <p class="text-gray-800 leading-relaxed mb-6">{{ selectedAlbum.description }}</p>
              
              <div v-if="selectedAlbum.achievements" class="mb-6">
                <h3 class="text-xl font-semibold mb-3">专辑成就</h3>
                <ul class="space-y-2">
                  <li v-for="achievement in selectedAlbum.achievements" :key="achievement" class="text-gray-700">
                    • {{ achievement }}
                  </li>
                </ul>
              </div>

              <div v-if="selectedAlbum.stats" class="mb-6">
                <h3 class="text-xl font-semibold mb-3">专辑统计</h3>
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ selectedAlbum.stats.tracks }}</div>
                    <div class="text-sm text-gray-500">首歌曲</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">{{ selectedAlbum.stats.duration || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">总时长</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-pink-600">{{ selectedAlbum.stats.plays || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">播放量</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 pt-8 border-t border-gray-200 flex justify-end space-x-4">
            <button 
              @click="playAlbum(selectedAlbum)"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              播放专辑
            </button>
            <button 
              @click="hideAlbumDetails"
              class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { musicData } from '@/database/index.js'

const router = useRouter()

// 响应式数据
const currentIndex = ref(0)
const viewMode = ref('slideshow') // 'slideshow' | 'grid'
const activeCategory = ref('全部')
const showDetails = ref(false)
const selectedAlbum = ref(null)

// 分类
const categories = ref(['全部', '流行', '电子', 'Hip-Hop', 'R&B', '中式'])

// 计算属性：过滤后的专辑
const filteredAlbums = computed(() => {
  if (activeCategory.value === '全部') {
    return musicData
  }
  return musicData.filter(album => 
    album.genre.includes(activeCategory.value)
  )
})

// 方法
const nextSlide = () => {
  if (currentIndex.value < filteredAlbums.value.length - 1) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}

const selectAlbum = (index: number) => {
  currentIndex.value = index
  viewMode.value = 'slideshow'
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'slideshow' ? 'grid' : 'slideshow'
}

const filterByCategory = (category: string) => {
  activeCategory.value = category
  currentIndex.value = 0
}

const playAlbum = (album: any) => {
  console.log('播放专辑:', album.albumTitle)
  // 这里可以添加实际的播放逻辑
}

const showAlbumDetails = (album: any) => {
  selectedAlbum.value = album
  showDetails.value = true
}

const hideAlbumDetails = () => {
  showDetails.value = false
  selectedAlbum.value = null
}

// 键盘导航
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      prevSlide()
      break
    case 'ArrowRight':
      nextSlide()
      break
    case 'Escape':
      if (showDetails.value) {
        hideAlbumDetails()
      }
      break
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.music-3d-page {
  background: #000;
  color: #fff;
  overflow-x: hidden;
}

.category-btn {
  border-radius: 20px;
  backdrop-filter: blur(10px);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  min-height: 80px;
}

.slide {
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.album-info {
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.album-card {
  transition: transform 0.3s ease;
}

.album-card:hover {
  transform: translateY(-10px);
}

.control-btn {
  backdrop-filter: blur(10px);
}

.view-toggle-btn {
  backdrop-filter: blur(10px);
}

.album-details {
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 