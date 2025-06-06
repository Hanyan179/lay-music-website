<!-- src/views/CharacterCreation.vue -->
<template>
  <div class="bookshelf-container">
    <!-- 动态背景容器 -->
    <div class="page-background">
      <!-- 视频背景 -->
      <video
        v-if="backgroundMedia.type === 'video'"
        :src="backgroundMedia.url"
        class="background-video"
        autoplay
        muted
        loop
        playsinline
        @loadstart="onVideoLoadStart"
        @canplay="onVideoCanPlay"
        @error="onVideoError"
      ></video>

      <!-- 图片背景 -->
      <div
        v-else-if="backgroundMedia.type === 'image'"
        class="background-image"
        :style="{ backgroundImage: `url(${backgroundMedia.url})` }"
      ></div>

      <!-- 默认渐变背景 -->
      <div v-else class="background-gradient"></div>

      <!-- 背景遮罩层 -->
      <div
        class="background-overlay"
        :style="{
          background: `rgba(0, 0, 0, ${backgroundOpacity / 100})`,
          backdropFilter: `blur(${backgroundBlur}px)`
        }"
      ></div>
    </div>

    <!-- 调试面板 -->
    <div v-if="showDebugPanel" class="debug-panel">
      <h3>背景调试信息</h3>
      <p><strong>类型:</strong> {{ backgroundMedia.type }}</p>
      <p><strong>URL:</strong> {{ backgroundMedia.url }}</p>
      <p><strong>视频状态:</strong> {{ videoStatus }}</p>

      <!-- 背景透明度调整 -->
      <div class="debug-section">
        <label class="debug-label">背景遮罩透明度: {{ backgroundOpacity }}%</label>
        <input
          type="range"
          min="0"
          max="80"
          v-model="backgroundOpacity"
          class="debug-slider"
          @input="updateBackgroundOpacity"
        />
      </div>

      <!-- 模糊程度调整 -->
      <div class="debug-section">
        <label class="debug-label">背景模糊程度: {{ backgroundBlur }}px</label>
        <input
          type="range"
          min="0"
          max="10"
          v-model="backgroundBlur"
          class="debug-slider"
          @input="updateBackgroundBlur"
        />
      </div>

      <div class="debug-actions">
        <button @click="testVideoUrl" class="debug-btn">测试视频链接</button>
        <button @click="switchBackground('gradient')" class="debug-btn">切换到渐变</button>
        <button @click="switchBackground('floating_books')" class="debug-btn">重新加载视频</button>
        <button @click="resetBackgroundSettings" class="debug-btn">重置设置</button>
      </div>
    </div>

    <!-- 调试按钮 -->
    <button @click="showDebugPanel = !showDebugPanel" class="debug-toggle">🔧</button>

    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-light light-1"></div>
      <div class="floating-light light-2"></div>
      <div class="floating-light light-3"></div>
    </div>

    <!-- 书架头部 -->
    <header class="bookshelf-header">
      <h1 class="main-title">那些人</h1>
      <p class="main-subtitle">指尖触碰的，都是待翻阅的生命</p>
      
      <!-- 搜索和排序控制区域 -->
      <div class="search-and-sort-container">
        <!-- 操作按钮区域 -->
        <div class="action-buttons">
          <button 
            @click="switchViewMode('public')" 
            :class="['mode-btn', { active: viewMode === 'public' }]"
          >
            📚 公开作品
          </button>
          <button 
            @click="switchViewMode('my')" 
            :class="['mode-btn', { active: viewMode === 'my' }]"
          >
            👤 我的人生
          </button>
          <button 
            @click="goToTimelineStories" 
            class="mode-btn timeline-btn"
          >
            ⏰ 时间线
          </button>
        </div>
        
        <!-- 搜索栏 -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              :placeholder="viewMode === 'my' ? '搜索我的作品...' : '搜索已发布的作品...'"
              class="search-input"
              v-model="searchQuery"
              @input="handleSearch"
            />
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              class="search-clear"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 排序选择器（仅在公开作品模式下显示） -->
        <div v-if="viewMode === 'public'" class="sort-container">
          <label class="sort-label">排序方式：</label>
          <select v-model="sortBy" @change="handleSort" class="sort-select">
            <option value="default">默认排序</option>
            <option value="likeCount">按点赞数排序</option>
            <option value="playCount">按阅读数排序</option>
            <option value="title">按标题排序</option>
            <option value="author">按作者排序</option>
          </select>
          <select v-model="sortOrder" @change="handleSort" class="sort-order">
            <option value="desc">降序</option>
            <option value="asc">升序</option>
          </select>
        </div>
        
        <!-- 搜索结果统计 -->
        <div v-if="searchQuery || viewMode === 'my'" class="search-results-info">
          <span v-if="viewMode === 'my'">我的作品：{{ filteredAndSortedBooks.length }} 本</span>
          <span v-else>找到 {{ filteredAndSortedBooks.length }} 本书籍</span>
        </div>
      </div>
    </header>

    <!-- 书架主体 -->
    <main class="bookshelf-main">
      <div class="shelf-container">
        <!-- 书架背景 -->
        <div class="shelf-background">
          <div class="shelf-wood"></div>
          <div class="shelf-shadow"></div>
        </div>

        <!-- 书籍网格 -->
        <div class="books-grid" v-if="!isLoading && !loadError">
          <!-- 显示过滤和排序后的书籍 -->
          <div
            v-for="(book, index) in displayedFilteredBooks"
            :key="book.id"
            class="book-item"
            :class="{ 'editable-book': viewMode === 'my' && book.isCompleted === 0 }"
            :style="{
              animationDelay: `${index * 0.1}s`,
              '--book-color': book.theme?.primaryColor || '#86868b'
            }"
            @click="selectBook(book)"
          >
            <!-- 编辑状态指示器 -->
            <div v-if="viewMode === 'my' && book.isCompleted === 0" class="edit-indicator">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>编辑</span>
            </div>

            <!-- 书籍封面 -->
            <div class="book-cover">
              <div class="book-spine"></div>
              <div class="book-front">
                <img :src="book.cover" :alt="book.title" class="cover-image" />
                <div class="cover-overlay"></div>
                <div class="book-info">
                  <h3 class="book-title">{{ book.title }}</h3>
                  <p class="book-subtitle">{{ book.subtitle }}</p>
                </div>

                <!-- 点赞按钮 -->
                <div class="like-button" @click.stop="likeBook(book)">
                  <span class="like-icon">❤️</span>
                  <span class="like-count">{{ book.likeCount || 0 }}</span>
                </div>
              </div>

              <!-- 悬停效果 -->
              <div class="book-hover-effect">
                <div class="glow-effect"></div>
                <div class="selection-indicator">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- 书籍描述卡片 -->
            <div class="book-description-card">
              <div class="description-content">
                <h4 class="description-title">{{ book.title }}</h4>
                <p class="description-text">{{ book.description }}</p>
                <div class="book-stats">
                  <div class="stat-item">
                    <span class="stat-label">起始年份</span>
                    <span class="stat-value">{{ book.theme?.startYear || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">结束年份</span>
                    <span class="stat-value">{{ book.theme?.endYear || 9999 }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">作者</span>
                    <span class="stat-value">{{ book.author }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">点赞数</span>
                    <span class="stat-value">{{ book.likeCount || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">阅读数</span>
                    <span class="stat-value">{{ book.playCount || book.play_count || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 新增书籍按钮（仅在"我的人生"模式且没有搜索时显示） -->
          <div
            v-if="viewMode === 'my' && !searchQuery"
            class="book-item add-book-item"
            :style="{ animationDelay: `${displayedFilteredBooks.length * 0.1}s` }"
            @click="goToAddBook"
          >
            <div class="add-book-cover">
              <div class="add-book-content">
                <div class="add-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
                <h3 class="add-title">新增书籍</h3>
                <p class="add-subtitle">创建您的专属人生故事</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在加载书籍...</p>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-if="loadError && !isLoading" class="error-state">
          <div class="error-content">
            <div class="error-icon">📚</div>
            <h3 class="error-title">加载失败</h3>
            <p class="error-message">{{ loadError }}</p>
            <p class="error-fallback">已使用备用数据，您仍可以正常体验</p>
            <button @click="retryLoad" class="retry-button">
              重试加载
            </button>
          </div>
        </div>
      </div>

      <!-- 选择提示 -->
      <div class="selection-hint">
        <div class="hint-content">
          <div class="hint-icon">📚</div>
          <p class="hint-text">每本书都代表着不同的人生轨迹与选择，点击选择您想要体验的人生故事</p>
        </div>
      </div>
    </main>

    <!-- 底部信息 -->
    <footer class="bookshelf-footer">
      <div class="footer-content">
        <p class="footer-text">您的选择将决定整个人生故事的走向</p>
        <div class="footer-stats">
          <div class="footer-stat">
            <span class="stat-number">{{ filteredAndSortedBooks.length }}</span>
            <span class="stat-label">{{ searchQuery ? '匹配结果' : '既定宿命' }}</span>
          </div>
          <div class="footer-stat">
            <span class="stat-number">∞</span>
            <span class="stat-label">未来</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { books, setSelectedBook, initializeBooks, isLoading, loadError } from '../store/bookStore.js'

const router = useRouter()

// 计算属性：限制显示的书籍数量（最多8本）
const displayedBooks = computed(() => {
  return books.slice(0, 8)
})

// 背景媒体配置（您可以在这里修改背景）
const backgroundMedia = ref({
  type: 'video', // 可以是 'image' | 'video' | 'default'
  url: '/assets/backgrounds/floating-books.MP4' // 背景文件路径 - 修正大小写
})

// 可用的背景配置示例
const availableBackgrounds = {
  // 图片背景
  default: {
    type: 'image',
    url: '/assets/backgrounds/character-creation-bg.jpg'
  },
  fantasy: {
    type: 'image',
    url: '/assets/backgrounds/fantasy-library.jpg'
  },
  modern: {
    type: 'image',
    url: '/assets/backgrounds/modern-study.jpg'
  },
  // 视频背景
  floating_books: {
    type: 'video',
    url: '/assets/backgrounds/floating-books.MP4' // 修正大小写
  },
  magical_library: {
    type: 'video',
    url: '/assets/backgrounds/magical-library.MP4' // 修正大小写
  },
  // 默认渐变
  gradient: {
    type: 'default',
    url: null
  }
}

// 切换背景的方法
const switchBackground = (backgroundKey) => {
  if (availableBackgrounds[backgroundKey]) {
    backgroundMedia.value = { ...availableBackgrounds[backgroundKey] }
    console.log('切换背景到:', backgroundKey, backgroundMedia.value) // 添加调试信息
  }
}

// 新增的视图模式逻辑
const viewMode = ref('public')

// 用户Token管理
const userToken = ref('')

// 初始化用户Token
const initUserToken = () => {
  let token = localStorage.getItem('userToken')
  if (!token) {
    token = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('userToken', token)
  }
  userToken.value = token
  console.log('用户Token:', token)
}

const switchViewMode = async (mode) => {
  viewMode.value = mode
  console.log('切换视图模式:', mode)
  
  // 重新加载书籍数据
  await loadBooksData()
}

// 加载书籍数据
const loadBooksData = async () => {
  try {
    const params = new URLSearchParams()
    params.append('type', viewMode.value)
    
    if (viewMode.value === 'my') {
      params.append('userToken', userToken.value)
    }
    
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/books?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log(`成功获取${viewMode.value === 'my' ? '我的' : '公开'}书籍:`, data.length, '本')
      
      // 清空原有数据并更新
      books.splice(0, books.length, ...data)
    } else {
      console.warn('获取书籍数据失败:', response.status)
    }
  } catch (error) {
    console.error('获取书籍数据时发生错误:', error)
  }
}

// 组件挂载时初始化
onMounted(async () => {
  console.log('当前背景配置:', backgroundMedia.value)
  initUserToken()
  await loadBooksData()
})

// 重试加载书籍数据
const retryLoad = async () => {
  console.log('用户点击重试加载')
  await loadBooksData()
}

// 点赞书籍
const likeBook = async (book) => {
  try {
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/books/${book.id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      // 更新本地数据
      if (book.likeCount) {
        book.likeCount++
      } else {
        book.likeCount = 1
      }
      console.log(`书籍 ${book.title} 点赞成功`)
    } else {
      console.warn('点赞失败:', response.status)
    }
  } catch (error) {
    console.error('点赞请求失败:', error)
  }
}

// 打开新增书籍模态框
const goToAddBook = () => {
  console.log('打开新增书籍页面')
  // 在新标签页中打开新增书籍页面
  window.open('/add-book', '_blank')
}

// 跳转到时间线故事页面
const goToTimelineStories = () => {
  console.log('跳转到时间线intro页面')
  // 跳转到intro页面
  router.push({ name: 'intro' })
}

// 视频加载状态
const videoStatus = ref('未加载')

// 视频加载开始
const onVideoLoadStart = () => {
  videoStatus.value = '加载中'
}

// 视频可以播放
const onVideoCanPlay = () => {
  videoStatus.value = '已加载'
}

// 视频加载错误
const onVideoError = () => {
  videoStatus.value = '加载失败'
}

// 测试视频链接
const testVideoUrl = async () => {
  if (backgroundMedia.value.type === 'video') {
    try {
      // 尝试创建一个临时的video元素来测试链接
      const testVideo = document.createElement('video')
      testVideo.src = backgroundMedia.value.url

      const loadPromise = new Promise((resolve, reject) => {
        testVideo.onloadedmetadata = () => resolve('视频链接有效')
        testVideo.onerror = () => reject('视频链接无效')
        setTimeout(() => reject('加载超时'), 5000)
      })

      const result = await loadPromise
      console.log('✅ 测试结果:', result)
      alert('✅ 视频链接测试成功！')
    } catch (error) {
      console.error('❌ 测试结果:', error)
      alert('❌ 视频链接测试失败: ' + error)
    }
  } else {
    console.log('当前不是视频背景，无需测试')
    alert('当前不是视频背景')
  }
}

// 调试面板
const showDebugPanel = ref(false)

// 背景透明度调整
const backgroundOpacity = ref(0)

// 模糊程度调整
const backgroundBlur = ref(0)

// 更新背景透明度
const updateBackgroundOpacity = () => {
  console.log('背景透明度已调整为:', backgroundOpacity.value + '%')
}

// 更新背景模糊程度
const updateBackgroundBlur = () => {
  console.log('背景模糊程度已调整为:', backgroundBlur.value + 'px')
}

// 重置背景设置
const resetBackgroundSettings = () => {
  backgroundOpacity.value = 0
  backgroundBlur.value = 0
  console.log('背景设置已重置')
}

// 选择书籍
const selectBook = (book) => {
  // 设置全局选择的书籍
  setSelectedBook(book.id)

  // 添加选择动画效果
  const bookElement = event.currentTarget
  bookElement.style.transform = 'scale(0.95)'

  setTimeout(() => {
    // 如果是"我的人生"模式且书籍未完成，跳转到编辑页面
    if (viewMode.value === 'my' && book.isCompleted === 0) {
      // 跳转到编辑页面 - 这里暂时使用AddBook页面，后续可以创建专门的编辑页面
      window.open(`/add-book?edit=${book.id}`, '_blank')
    } else {
      // 否则跳转到时间线页面
    router.push({
      name: 'timeline',
      params: { bookId: book.id }
    })
    }
  }, 200)
}

// 搜索和排序逻辑
const searchQuery = ref('')
const sortBy = ref('default')
const sortOrder = ref('desc')

const handleSearch = () => {
  // 搜索逻辑已通过 computed 属性 filteredAndSortedBooks 自动处理
  console.log('搜索:', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
}

const handleSort = () => {
  // 排序逻辑已通过 computed 属性 filteredAndSortedBooks 自动处理
  console.log('排序:', sortBy.value, sortOrder.value)
}

// 过滤和排序后的书籍列表
const filteredAndSortedBooks = computed(() => {
  let result = [...books]
  
  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(book => {
      return (
        book.title?.toLowerCase().includes(query) ||
        book.subtitle?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query)
      )
    })
  }
  
  // 排序
  if (sortBy.value !== 'default') {
    result.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy.value) {
        case 'likeCount':
          aValue = a.likeCount || 0
          bValue = b.likeCount || 0
          break
        case 'playCount':
          aValue = a.playCount || a.play_count || 0
          bValue = b.playCount || b.play_count || 0
          break
        case 'title':
          aValue = a.title || ''
          bValue = b.title || ''
          break
        case 'author':
          aValue = a.author || ''
          bValue = b.author || ''
          break
        default:
          return 0
      }
      
      // 字符串比较
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'zh-CN')
        return sortOrder.value === 'asc' ? comparison : -comparison
      }
      
      // 数值比较
      const comparison = aValue - bValue
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }
  
  return result
})

// 显示的书籍列表（限制数量）
const displayedFilteredBooks = computed(() => {
  // 如果有搜索查询，显示所有搜索结果
  if (searchQuery.value.trim()) {
    return filteredAndSortedBooks.value
  }
  // 否则限制显示前8本书
  return filteredAndSortedBooks.value.slice(0, 8)
})
</script>

<style scoped>
.bookshelf-container {
  min-height: 100vh;
  background: transparent; /* 移除原有背景，使用动态背景 */
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 动态背景容器 */
.page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* 视频背景 */
.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 图片背景 */
.background-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

/* 默认渐变背景 */
.background-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
}

/* 背景遮罩层 */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2); /* 降低透明度从默认到0.2 */
  backdrop-filter: blur(1px); /* 减少模糊效果 */
  z-index: 1;
}

/* 背景装饰 */
.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-light {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: floatLight 15s ease-in-out infinite;
}

.light-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  top: 20%;
  left: 10%;
}

.light-2 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 165, 0, 0.08) 0%, transparent 70%);
  bottom: 30%;
  right: 20%;
  animation-delay: 5s;
}

.light-3 {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  top: 60%;
  left: 60%;
  animation-delay: 10s;
}

@keyframes floatLight {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

/* 头部样式 */
.bookshelf-header {
  position: relative;
  z-index: 10;
  padding: clamp(2rem, 5vw, 3rem) clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem);
  text-align: center;
  /* 移除原有背景，让动态背景穿透 */
  background: transparent;
  /* 移除边框和阴影 */
}

.main-title {
  font-size: clamp(2rem, 6.4vw, 3.2rem);
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  /* 增强文字阴影以确保在任何背景下都可读 */
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.9),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 20px rgba(255, 255, 255, 0.6);
}

.main-subtitle {
  font-size: clamp(1rem, 3vw, 1.3rem);
  color: #1d1d1f; /* 更深的颜色提高对比度 */
  margin: 0;
  font-weight: 500; /* 增加字重 */
  line-height: 1.5;
  /* 增强文字阴影以确保可读性 */
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 4px 15px rgba(255, 255, 255, 0.5);
}

/* 搜索和排序控制区域 */
.search-and-sort-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  max-width: 1000px; /* 限制最大宽度 */
  margin-left: auto;
  margin-right: auto;
}

/* 操作按钮区域 */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center; /* 居中对齐 */
  margin-bottom: 1rem;
}

.mode-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 122, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 0 1 auto; /* 不强制等宽 */
  min-width: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(0, 122, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2);
}

.mode-btn.active {
  background: linear-gradient(135deg, #007aff 0%, #5856d6 100%);
  border-color: #007aff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
}

/* 时间线按钮特殊样式 */
.mode-btn.timeline-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border-color: #ff6b35;
  color: white;
  position: relative;
  overflow: hidden;
}

.mode-btn.timeline-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.mode-btn.timeline-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
  pointer-events: none;
}

.mode-btn.timeline-btn:hover::before {
  transform: translateX(100%);
}

.mode-btn.timeline-btn:hover::after {
  width: 200px;
  height: 200px;
  animation: energyWave 0.8s ease-out;
}

@keyframes energyWave {
  0% { 
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
    box-shadow: 0 0 0 30px rgba(255, 107, 53, 0.3);
  }
  100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.2;
    box-shadow: 0 0 0 60px rgba(255, 107, 53, 0);
  }
}

.mode-btn.timeline-btn:hover {
  background: linear-gradient(135deg, #ff8c61 0%, #ffa94d 100%);
  border-color: #ff8c61;
  transform: translateY(-3px);
  box-shadow: 
    0 6px 25px rgba(255, 107, 53, 0.4),
    0 0 0 2px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* 搜索栏 */
.search-container {
  position: relative;
  width: 100%;
  max-width: 500px; /* 限制搜索框最大宽度 */
  margin: 0 auto; /* 居中 */
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #86868b;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: 2.75rem;
  padding-right: 2.5rem;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #007aff;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.search-input::placeholder {
  color: #86868b;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #86868b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  z-index: 1;
}

.search-clear:hover {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.1);
}

/* 排序选择器 */
.sort-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center; /* 居中对齐 */
}

.sort-label {
  font-size: 0.9rem;
  color: #1d1d1f;
  font-weight: 600;
  white-space: nowrap;
}

.sort-select,
.sort-order {
  padding: 0.625rem 0.875rem;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
}

.sort-select:focus,
.sort-order:focus {
  border-color: #007aff;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.sort-select {
  min-width: 140px;
}

.sort-order {
  min-width: 80px;
}

/* 搜索结果统计 */
.search-results-info {
  font-size: 0.85rem;
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  border: 1px solid rgba(0, 122, 255, 0.2);
}

/* 书架主体 */
.bookshelf-main {
  position: relative;
  z-index: 10;
  padding: 0 clamp(1rem, 4vw, 2rem) 3rem;
}

.shelf-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

/* 书架背景 */
.shelf-background {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  z-index: 1;
}

.shelf-wood {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #8b4513 0%, #654321 50%, #5a3a1a 100%);
  border-radius: 0 0 10px 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.shelf-shadow {
  position: absolute;
  bottom: -10px;
  left: 5%;
  right: 5%;
  height: 20px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.2) 0%, transparent 70%);
  filter: blur(8px);
}

/* 书籍网格 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(2rem, 4vw, 3rem);
  padding: 2rem 0 5rem;
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}

/* 书籍项目 */
.book-item {
  position: relative;
  animation: bookAppear 0.8s ease forwards;
  opacity: 0;
  transform: translateY(30px);
  /* 确保悬浮描述卡片能够正常显示 */
  isolation: isolate;
  /* 重要：确保每个book-item都有独立的层叠上下文 */
  z-index: 1;
}

/* 悬浮时提升整个book-item的层级 */
.book-item:hover {
  z-index: 1000;
}

@keyframes bookAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 书籍封面 */
.book-cover {
  position: relative;
  width: 100%;
  height: 280px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
  perspective: 1000px;
  /* 确保封面本身的z-index较低 */
  z-index: 1;
}

.book-cover:hover {
  transform: translateY(-10px) rotateY(-5deg);
  filter: brightness(1.1); /* 悬浮时轻微增亮 */
}

.book-spine {
  position: absolute;
  left: -8px;
  top: 0;
  width: 16px;
  height: 100%;
  background: linear-gradient(180deg, var(--book-color), color-mix(in srgb, var(--book-color) 80%, black));
  border-radius: 8px 0 0 8px;
  transform: rotateY(-90deg) translateZ(8px);
  z-index: 1;
}

.book-front {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.98); /* 提高不透明度 */
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.3), /* 增强阴影 */
    0 8px 16px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.15); /* 增强边框 */
}

.cover-image {
  width: 100%;
  height: 70%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.book-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.book-subtitle {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.3;
}

/* 悬停效果 */
.book-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.book-cover:hover .book-hover-effect {
  opacity: 1;
}

.glow-effect {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: var(--book-color);
  border-radius: 12px;
  filter: blur(20px);
  opacity: 0.3;
  z-index: -1;
}

.selection-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: var(--book-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transform: scale(0);
  animation: indicatorPop 0.3s ease 0.2s forwards;
}

@keyframes indicatorPop {
  0% { transform: scale(0); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 书籍描述卡片 */
.book-description-card {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(15px) scale(0.95);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.12),
    0 8px 16px rgba(0, 0, 0, 0.06);
  z-index: 1002;
  pointer-events: none;
  max-width: 400px; /* 增加最大宽度 */
  min-width: 320px; /* 设置最小宽度 */
  width: max-content; /* 根据内容自适应宽度 */
  max-height: 80vh; /* 设置最大高度 */
  overflow-y: auto; /* 当内容超出时显示滚动条 */
}

.book-item:hover .book-description-card {
  opacity: 1;
  transform: translateY(0) scale(1);
  z-index: 1003;
  pointer-events: auto;
}

.description-content {
  /* 为内容容器添加样式 */
}

.description-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
  word-wrap: break-word; /* 长标题自动换行 */
}

.description-text {
  color: #6c757d;
  line-height: 1.5;
  margin: 0 0 1.25rem 0;
  font-size: 0.9rem;
  font-weight: 400;
  word-wrap: break-word; /* 长文本自动换行 */
  /* 移除行数限制，显示完整描述 */
  max-height: 200px; /* 设置描述文本的最大高度 */
  overflow-y: auto; /* 当描述过长时显示滚动条 */
  padding-right: 0.5rem; /* 为滚动条留出空间 */
}

.book-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* 自适应列数 */
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.75rem 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
  min-width: 80px; /* 设置最小宽度 */
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

.stat-label {
  font-size: 0.7rem;
  color: #8e8e93;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.25rem;
  font-weight: 600;
  white-space: nowrap; /* 防止标签换行 */
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--book-color);
  line-height: 1;
  word-wrap: break-word; /* 长值自动换行 */
  text-align: center;
}

.select-book-btn {
  width: 100%;
  padding: 0.875rem 1.25rem; /* 减少内边距 */
  background: linear-gradient(135deg, var(--book-color), color-mix(in srgb, var(--book-color) 85%, black));
  color: white;
  border: none;
  border-radius: 10px; /* 减小圆角 */
  font-size: 0.95rem; /* 减小字号 */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* 减少间距 */
  position: relative;
  z-index: 1004;
  overflow: hidden;
  box-shadow:
    0 3px 12px rgba(0, 0, 0, 0.12),
    0 1px 4px rgba(0, 0, 0, 0.08);
}

.select-book-btn:hover {
  transform: translateY(-2px) scale(1.01); /* 减少悬浮效果 */
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.16),
    0 3px 8px rgba(0, 0, 0, 0.12);
}

.select-book-btn:active {
  transform: translateY(-1px) scale(0.99);
}

.btn-text {
  font-weight: 600;
  letter-spacing: -0.01em;
}

.btn-icon {
  font-size: 1rem; /* 减小图标大小 */
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.select-book-btn:hover .btn-icon {
  transform: translateX(3px); /* 减少箭头移动效果 */
}

/* 选择提示 */
.selection-hint {
  margin: 3rem 0;
  text-align: center;
}

.hint-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95); /* 提高不透明度 */
  backdrop-filter: blur(20px); /* 增强模糊效果 */
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15); /* 增强阴影 */
}

.hint-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hint-text {
  color: #4a4a4a; /* 更深的颜色 */
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
}

/* 底部样式 */
.bookshelf-footer {
  position: relative;
  z-index: 10;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95); /* 提高不透明度 */
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1); /* 添加向上阴影 */
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-text {
  color: #6c757d;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.footer-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.footer-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .search-and-sort-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .search-container {
    flex: 1;
    max-width: 400px;
  }
  
  .sort-container {
    flex-shrink: 0;
  }
  
  .search-results-info {
    flex-shrink: 0;
    text-align: right;
  }
}

@media (max-width: 768px) {
  .search-and-sort-container {
    padding: 1rem;
  }
  
  .sort-container {
    justify-content: space-between;
  }
  
  .sort-select,
  .sort-order {
    flex: 1;
  }

  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    max-width: 600px;
  }

  .add-book-cover {
    height: 240px;
  }

  .book-cover {
    height: 240px;
  }

  .footer-stats {
    gap: 2rem;
  }

  .book-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .book-description-card {
    max-width: 350px;
    min-width: 280px;
  }

  .debug-panel {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }

  .debug-toggle {
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .search-and-sort-container {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .sort-container {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .sort-label {
    text-align: center;
  }
  
  .books-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 400px;
  }

  .add-book-cover,
  .book-cover {
    height: 200px;
  }

  .book-description-card {
    padding: 1rem;
    max-width: 300px;
    min-width: 250px;
  }

  .book-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .like-button {
    padding: 0.4rem 0.6rem;
    top: 0.75rem;
    right: 0.75rem;
  }

  .like-icon {
    font-size: 0.9rem;
  }

  .like-count {
    font-size: 0.7rem;
  }

  .debug-panel {
    padding: 1rem;
  }

  .debug-actions {
    flex-direction: column;
  }

  .debug-btn {
    min-width: auto;
  }
}

/* 加载状态样式 */
.loading-state {
  padding: 4rem 2rem;
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

/* 错误状态样式 */
.error-state {
  padding: 4rem 2rem;
  text-align: center;
}

.error-content {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(255, 59, 48, 0.2);
  box-shadow: 0 4px 20px rgba(255, 59, 48, 0.1);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  color: #ff3b30;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.error-message {
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}

.error-fallback {
  color: #86868b;
  font-size: 0.9rem;
  margin: 0 0 2rem 0;
}

.retry-button {
  background: #007aff;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #0056cc;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.3);
}

/* 点赞按钮样式 */
.like-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.like-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.like-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.like-button:hover .like-icon {
  transform: scale(1.2);
}

.like-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ff3b30;
  min-width: 20px;
  text-align: center;
}

/* 新增书籍项目样式 */
.add-book-item {
  cursor: pointer;
}

.add-book-cover {
  position: relative;
  width: 100%;
  height: 280px;
  background: rgba(255, 255, 255, 0.95); /* 提高不透明度 */
  border: 2px dashed #86868b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  backdrop-filter: blur(10px); /* 添加模糊效果 */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.add-book-item:hover .add-book-cover {
  border-color: #007aff;
  background: rgba(240, 248, 255, 0.98); /* 更高不透明度 */
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 122, 255, 0.25); /* 增强阴影 */
}

.add-book-content {
  text-align: center;
  padding: 2rem;
}

.add-icon {
  color: #86868b;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.add-book-item:hover .add-icon {
  color: #007aff;
  transform: scale(1.1);
}

.add-title {
  color: #1d1d1f;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
}

.add-subtitle {
  color: #86868b;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.add-book-item:hover .add-title {
  color: #007aff;
}

.add-book-item:hover .add-subtitle {
  color: #5a5a5a;
}

/* 调试面板样式 */
.debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  min-width: 300px;
  max-width: 350px;
}

.debug-panel h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.debug-panel p {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0.5rem 0;
  word-break: break-all;
}

.debug-section {
  margin: 1rem 0;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.debug-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.debug-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.debug-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #007aff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
}

.debug-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #007aff;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
}

.debug-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.debug-btn {
  background: #007aff;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 100px;
}

.debug-btn:hover {
  background: #0056cc;
  transform: translateY(-1px);
}

/* 调试按钮样式 */
.debug-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #86868b;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 1999;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.debug-toggle:hover {
  color: #007aff;
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

/* 编辑指示器样式 */
.edit-indicator {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(255, 165, 0, 0.9);
  color: white;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transform: scale(0.9);
  transition: all 0.3s ease;
}

.edit-indicator svg {
  width: 12px;
  height: 12px;
}

/* 可编辑书籍样式 */
.editable-book .book-cover {
  border: 2px solid rgba(255, 165, 0, 0.5);
  position: relative;
}

.editable-book .book-cover::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, rgba(255, 165, 0, 0.2), rgba(255, 165, 0, 0.1));
  border-radius: 10px;
  z-index: -1;
  animation: editablePulse 2s ease-in-out infinite;
}

.editable-book:hover .edit-indicator {
  transform: scale(1);
  background: rgba(255, 165, 0, 1);
  box-shadow: 0 4px 15px rgba(255, 165, 0, 0.4);
}

@keyframes editablePulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
</style>
