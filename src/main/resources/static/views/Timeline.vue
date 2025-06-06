<!-- src/views/Timeline.vue -->
<template>
  <div class="timeline-container"
       :class="`year-${currentYear}`"
       :style="{
         '--primary-color': timelineTheme.primaryColor,
         '--bg-gradient': timelineTheme.backgroundGradient,
         background: 'transparent'
       }">

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <h2 class="loading-title">正在加载书籍信息...</h2>
        <p class="loading-subtitle">请稍候，正在为您准备人生旅程</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="loadError && !isLoading" class="error-overlay">
      <div class="error-container">
        <div class="error-icon">📚</div>
        <h2 class="error-title">加载失败</h2>
        <p class="error-message">{{ loadError }}</p>
        <p class="error-hint">将在3秒后自动返回书架...</p>
        <button @click="router.push('/')" class="error-button">
          立即返回书架
        </button>
      </div>
    </div>

    <!-- 主要内容（只在加载完成且无错误时显示） -->
    <template v-if="!isLoading && !loadError && selectedBook">
      <!-- 页面背景容器 -->
      <div class="page-background">
        <!-- 视频背景 -->
        <video
          v-if="timelineBackgroundMedia.type === 'video'"
          :src="timelineBackgroundMedia.url"
          class="background-video"
          autoplay
          muted
          loop
          playsinline
        ></video>

        <!-- 图片背景 -->
        <div
          v-else-if="timelineBackgroundMedia.type === 'image'"
          class="background-image"
          :style="{ backgroundImage: `url(${timelineBackgroundMedia.url})` }"
        ></div>

        <!-- 默认年份动态背景 -->
        <div v-else class="dynamic-background" :style="{ background: timelineTheme.backgroundGradient }">
          <div class="background-layer layer-1"></div>
          <div class="background-layer layer-2"></div>
          <div class="background-layer layer-3"></div>
        </div>

        <!-- 背景遮罩层 -->
        <div class="background-overlay"></div>
      </div>

      <!-- 年份动态背景 -->
      <!-- 已移动到页面背景容器中 -->

      <!-- 背景装饰 -->
      <div class="bg-decoration">
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
      </div>

      <!-- 头部区域 -->
      <header class="timeline-header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="timeline-title">{{ selectedBook?.title || '人生时光轴' }}</h1>
            <p class="timeline-subtitle">{{ selectedBook?.subtitle || `见证${selectedBook?.theme.startYear || 1995}-${selectedBook?.theme.endYear || 2025}年的人生历程` }}</p>
          </div>

          <!-- 编辑按钮 -->
          <div class="header-actions">
            <button @click="goToEditor" class="edit-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v7"/>
                <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              编辑时间线
            </button>
          </div>

          <!-- 当前状态显示 -->
          <div class="current-status">
            <div class="status-card">
              <div class="status-item">
                <span class="status-label">当前年份</span>
                <span class="status-value">{{ currentYear }}年</span>
              </div>
              <div class="status-item">
                <span class="status-label">当前年龄</span>
                <span class="status-value">{{ currentAge }}岁</span>
              </div>
              <div class="status-item">
                <span class="status-label">人生阶段</span>
                <span class="status-value stage-badge">{{ currentLifeStage }}</span>
              </div>
            </div>

            <!-- 人生进度 -->
            <div class="life-progress">
              <div class="progress-header">
                <span>人生历程进度</span>
                <span>{{ lifeProgress }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${lifeProgress}%` }">
                  <div class="progress-glow"></div>
                </div>
                <div class="progress-marker" :style="{ left: `${lifeProgress}%` }">
                  <div class="marker-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 主内容区域 -->
      <main class="timeline-main">
        <div class="year-container">
          <!-- 个人抉择事件（优先显示） -->
          <section class="personal-events" v-if="currentPersonalEvent">
            <div class="section-header">
              <h3 class="section-title">人生抉择</h3>
              <div class="section-meta">
                <span class="year-badge">{{ currentYear }}年</span>
                <span class="age-badge">{{ currentAge }}岁</span>
              </div>
            </div>

            <!-- 问题阶段 -->
            <div v-if="eventState === 'question'" class="event-question-card">
              <div class="question-content">
                <div class="question-header">
                  <div class="question-icon">🤔</div>
                  <h4 class="question-title">{{ currentPersonalEvent.question }}</h4>
                </div>

                <!-- 问题图片/视频展示 -->
                <div v-if="currentPersonalEvent.media" class="question-media-section">
                  <div class="question-media">
                    <!-- 视频媒体 -->
                    <video
                      v-if="currentPersonalEvent.media.type === 'video'"
                      :src="currentPersonalEvent.media.url"
                      class="media-video"
                      controls
                      :poster="currentPersonalEvent.media.poster"
                    ></video>

                    <!-- 图片媒体 -->
                    <img
                      v-else
                      :src="currentPersonalEvent.media.url || currentPersonalEvent.image"
                      :alt="currentPersonalEvent.question"
                      class="media-image"
                    />

                    <div class="media-overlay"></div>
                  </div>
                </div>

                <p class="question-description">{{ currentPersonalEvent.description }}</p>

                <!-- 选项容器 -->
                <div class="options-container">
                  <button
                    v-for="(option, index) in currentPersonalEvent.options"
                    :key="index"
                    @click="selectOption(option)"
                    class="option-button"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                  >
                    <div class="option-content">
                      <span class="option-text">{{ option.text }}</span>
                      <div class="option-meta">
                        <span class="option-impact" :class="`impact-${option.type}`">
                          {{ option.type === 1 ? '需谨慎' : '积极选择' }}
                        </span>
                      </div>
                    </div>
                    <span class="option-arrow">→</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 结果阶段 -->
            <div v-if="eventState === 'result'" class="event-result-card">
              <!-- 弹幕容器 -->
              <div class="danmaku-container">
                <div
                  v-for="danmaku in danmakuTags"
                  :key="danmaku.id"
                  class="danmaku-item"
                  :style="{
                    top: `${danmaku.top}%`,
                    animationDuration: `${danmaku.duration}s`,
                    animationDelay: `${danmaku.delay}s`
                  }"
                >
                  {{ danmaku.text }}
                </div>
              </div>
              
              <div class="result-content">
                <div class="result-header">
                  <div class="result-icon" :class="selectedOption.isNextYear ? 'success' : 'error'">
                    {{ selectedOption.isNextYear ? '✨' : '⚠️' }}
                  </div>
                  <h4 class="result-title">
                    {{ currentPersonalEvent.afterDescription || (selectedOption.isNextYear ? '选择成功' : '需要重新考虑') }}
                  </h4>
                </div>
                <p class="result-description">{{ selectedOption.effect }}</p>

                <!-- 选项图片 -->
                <div v-if="selectedOption.mediaUrl" class="option-image-section">
                  <img :src="selectedOption.mediaUrl" :alt="selectedOption.text" class="option-image" />
                </div>

                <div class="result-actions">
                  <button
                    v-if="!selectedOption.isNextYear"
                    @click="returnToQuestion"
                    class="action-button secondary"
                  >
                    <span class="button-text">重新选择</span>
                    <span class="button-icon">↶</span>
                  </button>

                  <button
                    v-if="selectedOption.isNextYear"
                    @click="goToNextEvent"
                    class="action-button primary"
                  >
                    <span class="button-text">
                      {{ isLastChoiceEvent ? `进入${currentYear + 1}年` : '下一个事件' }}
                    </span>
                    <span class="button-icon">→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 那些年轮播图 -->
          <section class="annual-events-carousel">
            <div class="carousel-header">
              <div class="carousel-title-section">
                <h3 class="section-title">那些年</h3>
                <div class="carousel-subtitle">
                  <span>{{ currentYear }}年</span>
                  <span class="bullet">•</span>
                  <span>共同回忆</span>
                </div>
              </div>

              <div class="carousel-controls" v-if="currentYearEvents.length > 1">
                <button @click="prevSlide" class="carousel-btn prev" :disabled="currentSlide === 0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <div class="slide-indicator">
                  <span>{{ currentSlide + 1 }}</span>
                  <div class="indicator-divider"></div>
                  <span>{{ currentYearEvents.length }}</span>
                </div>
                <button @click="nextSlide" class="carousel-btn next" :disabled="currentSlide === currentYearEvents.length - 1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="carousel-container"
                 v-if="currentYearEvents.length > 0"
                 @mouseenter="handleCarouselMouseEnter"
                 @mouseleave="handleCarouselMouseLeave">
              <div class="carousel-wrapper" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <div
                  v-for="(event, index) in currentYearEvents"
                  :key="index"
                  class="carousel-slide"
                >
                  <div class="event-visual">
                    <div class="event-media">
                      <!-- 视频媒体 -->
                      <video
                        v-if="event.media && event.media.type === 'video'"
                        :src="event.media.url"
                        class="event-video"
                        :poster="event.media.poster"
                        controls
                        preload="metadata"
                      ></video>

                      <!-- 图片媒体 -->
                      <img
                        v-else
                        :src="event.media?.url || event.image"
                        :alt="event.title"
                        class="event-image"
                      />

                      <div class="media-gradient"></div>
                    </div>
                    <div class="event-date-badge">
                      <span>{{ event.date }}</span>
                    </div>
                  </div>

                  <div class="event-details">
                    <div class="event-header">
                      <h4 class="event-title">{{ event.title }}</h4>
                      <div class="event-impact-badge">
                        {{ event.impact || '中等' }}
                      </div>
                    </div>

                    <p class="event-description">{{ event.description }}</p>

                    <div class="event-footer">
                      <div class="event-tags">
                        <span v-for="tag in event.tags" :key="tag" class="event-tag">
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="no-events">
              <div class="no-events-icon">📭</div>
              <p>{{ currentYear }}年暂无重要事件记录</p>
              <small>继续探索其他年份的精彩时刻</small>
            </div>

            <!-- 轮播指示器 -->
            <div class="carousel-indicators" v-if="currentYearEvents.length > 1">
              <button
                v-for="(event, index) in currentYearEvents"
                :key="index"
                @click="goToSlide(index)"
                :class="['indicator-dot', { 'active': index === currentSlide }]"
              ></button>
            </div>
          </section>

          <!-- 年份完成状态 -->
          <section v-if="isCurrentYearCompleted && !currentPersonalEvent" class="year-completed">
            <div class="completion-card">
              <div class="completion-visual">
                <div class="completion-icon">🎉</div>
                <div class="completion-rings">
                  <div class="ring ring-1"></div>
                  <div class="ring ring-2"></div>
                  <div class="ring ring-3"></div>
                </div>
              </div>
              <div class="completion-content">
                <h3 class="completion-title">{{ currentYear }}年已过去</h3>
                <p class="completion-description">您已经经历了这一年的重要时刻</p>
                <div class="completion-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{ completedYears.length }}</span>
                    <span class="stat-label">年已走过</span>
                  </div>
                  <div class="stat-divider"></div>
                  <div class="stat-item">
                    <span class="stat-value">{{ totalChoicesMade }}</span>
                    <span class="stat-label">人生决策</span>
                  </div>
                </div>
                <button
                  v-if="hasNextYear"
                  @click="nextYear"
                  class="action-button primary large"
                >
                  <span class="button-text">迈向{{ currentYear + 1 }}</span>
                  <span class="button-icon">→</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- 底部导航 -->
      <footer class="timeline-footer">
        <div class="footer-content">
          <button @click="goBack" class="action-button secondary">
            <span class="button-text">返回起点</span>
            <span class="button-icon">←</span>
          </button>

          <div class="journey-summary">
            <div class="summary-stats">
              <div class="summary-item">
                <span class="summary-value">{{ lifeProgress }}%</span>
                <span class="summary-label">人生进度</span>
              </div>
              <div class="summary-item">
                <span class="summary-value">{{ currentYearEvents.length }}</span>
                <span class="summary-label">年度事件</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </template>

    <!-- 当年无个人事件时的提示 -->
    <section v-else-if="selectedBook && !currentPersonalEvent" class="no-personal-events">
      <div class="no-events-container">
        <div class="no-events-visual">
          <div class="no-events-icon">📅</div>
          <div class="year-indicator">{{ currentYear }}年</div>
        </div>
        <div class="no-events-content">
          <h3 class="no-events-title">这一年的故事还未开始</h3>
          <p class="no-events-description">
            {{ currentYear }}年对于{{ selectedBook.title }}来说是平静的一年，
            没有重大的人生抉择需要做出。
          </p>
          <div class="year-actions">
            <button
              v-if="hasNextYear"
              @click="nextYear"
              class="action-button primary"
            >
              <span class="button-text">跳过到{{ currentYear + 1 }}年</span>
              <span class="button-icon">→</span>
            </button>
            <button
              v-if="currentYear > (selectedBook.theme?.startYear || 1995)"
              @click="currentYear--; resetYearState()"
              class="action-button secondary"
            >
              <span class="button-text">回到{{ currentYear - 1 }}年</span>
              <span class="button-icon">←</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSelectedBook, clearSelectedBook, getBookFromAPI } from '../store/bookStore.js'

const router = useRouter()
const route = useRoute()

// 响应式数据
const selectedBook = ref(null)
const isLoading = ref(false)
const loadError = ref(null)

// 当前年份的数据存储
const currentYearData = ref({
  events: [],
  choiceEvents: []
})

// 加载指定年份的数据
const loadYearData = async (year) => {
  if (!selectedBook.value?.id) return
  
  try {
    console.log(`正在加载${year}年的数据...`)
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/timeline-editor/load-year/${selectedBook.value.id}/${year}`)
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        // 加载年度事件并转换格式
        currentYearData.value.events = (result.events || []).map(event => ({
          title: event.title || '',
          description: event.description || '',
          date: `${year}年`,
          impact: event.impact || '中等',
          tags: event.tags || [],
          media: event.mediaUrl ? {
            type: event.mediaType || 'image',
            url: event.mediaUrl.startsWith('http') ? event.mediaUrl : 'http://localhost:8080/fate-echoes' + event.mediaUrl,
            poster: event.mediaPoster ? (event.mediaPoster.startsWith('http') ? event.mediaPoster : 'http://localhost:8080/fate-echoes' + event.mediaPoster) : null
          } : null,
          // 保持向后兼容
          image: event.mediaUrl ? (event.mediaUrl.startsWith('http') ? event.mediaUrl : 'http://localhost:8080/fate-echoes' + event.mediaUrl) : null
        }))
        
        // 加载人生抉择事件并转换格式  
        currentYearData.value.choiceEvents = (result.choiceEvents || []).map(choice => ({
          id: choice.id,
          question: choice.question || '',
          description: choice.description || '',
          mediaType: choice.mediaType,
          mediaUrl: choice.mediaUrl,
          mediaPoster: choice.mediaPoster,
          media: choice.mediaUrl ? {
            type: choice.mediaType || 'image',
            url: choice.mediaUrl.startsWith('http') ? choice.mediaUrl : 'http://localhost:8080/fate-echoes' + choice.mediaUrl,
            poster: choice.mediaPoster ? (choice.mediaPoster.startsWith('http') ? choice.mediaPoster : 'http://localhost:8080/fate-echoes' + choice.mediaPoster) : null
          } : null,
          afterDescription: choice.afterDescription || '', // 加载事后描述
          options: (choice.options || []).map(option => ({
            text: option.optionText || '',
            effect: option.effect || '',
            isNextYear: option.isNextYear || false, // 直接使用isNextYear字段
            nextEventCode: option.nextEventCode || '',
            actionType: option.actionType || 'SHOW_EFFECT',
            tags: option.tags || [], // 加载标签数据
            mediaUrl: option.mediaUrl ? (option.mediaUrl.startsWith('http') ? option.mediaUrl : 'http://localhost:8080/fate-echoes' + option.mediaUrl) : null,
            mediaType: option.mediaType || null
          }))
        }))
        
        console.log(`成功加载${year}年数据:`, {
          events: currentYearData.value.events.length,
          choices: currentYearData.value.choiceEvents.length
        })
      }
    }
  } catch (error) {
    console.error(`加载${year}年数据失败:`, error)
  }
}

// 解析JSON标签
const parseJsonTags = (jsonStr) => {
  if (!jsonStr) return []
  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.warn('解析标签JSON失败:', jsonStr)
    return []
  }
}

// 从路由参数或store获取书籍信息
const initializeBook = async () => {
  isLoading.value = true
  loadError.value = null

  try {
    // 首先尝试从路由参数获取bookId
    const bookId = route.params.bookId

    if (bookId) {
      console.log('从路由参数获取书籍ID:', bookId)
      // 从API获取书籍详情
      const bookData = await getBookFromAPI(bookId)
      if (bookData) {
        selectedBook.value = bookData
        console.log('成功获取书籍数据:', bookData)

        // 获取年份参数，如果有的话
        const yearParam = route.query.year
        if (yearParam) {
          currentYear.value = parseInt(yearParam)
          console.log('从URL参数获取年份:', currentYear.value)
        } else {
          // 防护性检查：初始化年份为书籍的起始年份
          if (bookData.theme?.startYear) {
            currentYear.value = bookData.theme.startYear
          } else {
            console.warn('书籍数据缺少theme.startYear，使用默认年份1995')
            currentYear.value = 1995
          }
        }
      } else {
        throw new Error('未找到指定的书籍')
      }
    } else {
      // 如果没有路由参数，尝试从store获取
      const storedBook = getSelectedBook()
      if (storedBook) {
        selectedBook.value = storedBook
        console.log('从store获取书籍数据:', storedBook)

        // 获取年份参数，如果有的话
        const yearParam = route.query.year
        if (yearParam) {
          currentYear.value = parseInt(yearParam)
          console.log('从URL参数获取年份:', currentYear.value)
        } else {
          // 防护性检查：初始化年份
          if (storedBook.theme?.startYear) {
            currentYear.value = storedBook.theme.startYear
          } else {
            console.warn('存储的书籍数据缺少theme.startYear，使用默认年份1995')
            currentYear.value = 1995
          }
        }
      } else {
        throw new Error('未选择任何书籍，请返回书架选择')
      }
    }
  } catch (error) {
    console.error('获取书籍信息失败:', error)
    loadError.value = error.message || '获取书籍信息失败'

    // 如果获取失败，跳转回书架页面
    setTimeout(() => {
      router.push('/')
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// 基础状态
const currentYear = ref(1995)
const eventState = ref('question')
const selectedOption = ref(null)
const completedYears = ref([])
const currentEventIndex = ref(0)
const currentSlide = ref(0)

// 轮播自动播放状态
const autoPlayTimer = ref(null)
const isAutoPlaying = ref(true)
const autoPlayInterval = 5000 // 5秒自动切换

// Timeline页面背景媒体配置
const timelineBackgroundMedia = computed(() => {
  // 优先使用当前人生抉择事件的背景
  if (currentPersonalEvent.value && currentPersonalEvent.value.media) {
    return {
      type: currentPersonalEvent.value.media.type || 'default',
      url: currentPersonalEvent.value.media.url || null
    }
  }
  
  // 如果没有人生抉择事件背景，使用默认背景
  return {
    type: 'default',
    url: null
  }
})

// 可用的Timeline背景配置（保留备用）
const availableTimelineBackgrounds = {
  // 图片背景
  vintage: {
    type: 'image',
    url: '/assets/backgrounds/vintage-timeline.jpg'
  },
  modern: {
    type: 'image',
    url: '/assets/backgrounds/modern-timeline.jpg'
  },
  cosmic: {
    type: 'image',
    url: '/assets/backgrounds/cosmic-timeline.jpg'
  },
  // 视频背景
  flowing_time: {
    type: 'video',
    url: '/assets/backgrounds/flowing-time.mp4'
  },
  particle_waves: {
    type: 'video',
    url: '/assets/backgrounds/particle-waves.mp4'
  },
  // 默认年份动态背景
  default: {
    type: 'default',
    url: null
  }
}

// 切换Timeline背景的方法（保留备用）
const switchTimelineBackground = (backgroundKey) => {
  if (availableTimelineBackgrounds[backgroundKey]) {
    // 这个方法现在不再直接使用，因为背景由人生抉择事件控制
    console.log('手动切换背景:', backgroundKey)
  }
}

// 年度事件数据（统一结构，添加媒体支持）
const annualEvents = ref({
  1995: [
    {
      title: 'Windows 95发布',
      description: '微软发布Windows 95，带来革命性的图形用户界面，标志着个人电脑时代的真正开始。',
      // 支持媒体对象，可以是图片或视频
      media: {
        type: 'image',
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICMxZTNhOGEsICMzYjgyZjYpIi8+ICA8cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZmZmIiByeD0iMTAiLz4gIDx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iYm9sZCI+V2luZG93cyA5NTwvdGV4dD48L3N2Zz4=',
        poster: null // 视频缩略图（可选）
      },
      // 保持向后兼容
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICMxZTNhOGEsICMzYjgyZjYpIi8+ICA8cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZmZmIiByeD0iMTAiLz4gIDx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iYm9sZCI+V2luZG93cyA5NTwvdGV4dD48L3N2Zz4=',
      date: '1995年8月',
      tags: ['科技', '操作系统', '微软'],
      impact: '极高'
    },
    {
      title: '《玩具总动员》首映',
      description: '皮克斯制作的第一部完全由计算机动画制作的长篇电影，开创了动画电影的新时代。',
      // 视频媒体示例
      media: {
        type: 'video',
        url: '/assets/media/videos/toy-story-trailer.mp4',
        poster: '/assets/media/images/toy-story-poster.jpg'
      },
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNmZWY5ZTcsICNmZGY0ZmYpIi8+ICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjZmZkNzAwIi8+ICA8cmVjdCB4PSIyMDAiIHk9IjgwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMzYjgyZjYiLz4gIDx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIj7njqnlhbfmgLvliqjlkZg8L3RleHQ+PC9zdmc+',
      date: '1995年11月',
      tags: ['电影', '动画', '皮克斯'],
      impact: '高'
    }
  ],
  2000: [
    {
      title: '千年虫危机',
      description: 'Y2K问题引发全球关注，虽然最终影响有限，但推动了软件质量和系统安全意识的提升。',
      media: {
        type: 'image',
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNkYzI2MjYsICNmOTI1MjUpIi8+ICA8dGV4dCB4PSIyMDAiIHk9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2ZmZiIgZm9udC13ZWlnaHQ9ImJvbGQiPjIwMDA8L3RleHQ+ICA8dGV4dCB4PSIyMDAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiI+5Y2D5bm05Yqr5Y2x5py6PC90ZXh0Pjwvc3ZnPg==',
        poster: null
      },
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNkYzI2MjYsICNmOTI1MjUpIi8+ICA8dGV4dCB4PSIyMDAiIHk9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2ZmZiIgZm9udC13ZWlnaHQ9ImJvbGQiPjIwMDA8L3RleHQ+ICA8dGV4dCB4PSIyMDAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiI+5Y2D5bm05Yqr5Y2x5py6PC90ZXh0Pjwvc3ZnPg==',
      date: '2000年1月',
      tags: ['科技', '系统安全', '软件'],
      impact: '中等'
    }
  ]
  // ... 其他年份数据可以类似添加媒体支持
})

// 个人事件数据
// 移除静态数据，现在从选择的书籍中获取

// 计算属性
const availableYears = computed(() => {
  if (!selectedBook.value || !selectedBook.value.theme) return []

  const years = []
  const startYear = selectedBook.value.theme.startYear || 1995
  const endYear = selectedBook.value.theme.endYear || 2025

  for (let year = startYear; year <= endYear; year++) {
    years.push(year)
  }
  return years
})

const currentAge = computed(() => {
  if (!selectedBook.value || !selectedBook.value.theme) return 0
  const startYear = selectedBook.value.theme.startYear || 1995
  return currentYear.value - startYear
})

const currentLifeStage = computed(() => {
  const age = currentAge.value

  // 基于年龄的人生阶段划分
  if (age >= 0 && age <= 2) return '婴儿期'
  if (age >= 3 && age <= 5) return '幼儿期'
  if (age >= 6 && age <= 11) return '童年期'
  if (age >= 12 && age <= 17) return '青春期'
  if (age >= 18 && age <= 25) return '青年期'
  if (age >= 26 && age <= 35) return '成年期'
  if (age >= 36 && age <= 50) return '中年期'
  if (age >= 51) return '老年期'

  return '成年期'
})

const currentYearEvents = computed(() => {
  // 使用从API获取的年度事件数据
  return currentYearData.value.events || []
})

// 当前事件流转状态
const currentChoiceEventIndex = ref(0) // 当前显示的人生抉择事件索引

// 弹幕相关状态
const danmakuTags = ref([]) // 当前显示的弹幕标签
const danmakuId = ref(0) // 弹幕唯一ID计数器

const currentPersonalEvent = computed(() => {
  // 使用从API获取的人生抉择事件数据
  const choiceEvents = currentYearData.value.choiceEvents || []
  
  // 返回当前索引的人生抉择事件（如果有的话）
  if (choiceEvents.length > 0 && currentChoiceEventIndex.value < choiceEvents.length) {
    return choiceEvents[currentChoiceEventIndex.value]
  }
  
  return null
})

const isCurrentYearCompleted = computed(() => {
  if (currentPersonalEvent.value && eventState.value === 'question') {
    return false
  }
  return true
})

const isLastChoiceEvent = computed(() => {
  const choiceEvents = currentYearData.value.choiceEvents || []
  return currentChoiceEventIndex.value >= choiceEvents.length - 1
})

const hasNextYear = computed(() => {
  if (!selectedBook.value || !selectedBook.value.theme) return false
  const endYear = selectedBook.value.theme.endYear || 2025
  return currentYear.value < endYear
})

const totalChoicesMade = computed(() => {
  return completedYears.value.length
})

// 动态主题
const timelineTheme = computed(() => {
  if (!selectedBook.value || !selectedBook.value.theme) {
    return {
      primaryColor: '#86868b',
      backgroundColor: '#f5f5f7',
      backgroundGradient: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%)'
    }
  }
  return selectedBook.value.theme
})

// 人生进度计算
const lifeProgress = computed(() => {
  if (!selectedBook.value || !selectedBook.value.theme) return 0

  const startYear = selectedBook.value.theme.startYear || 1995
  const endYear = selectedBook.value.theme.endYear || 2025
  const totalYears = endYear - startYear
  const passedYears = currentYear.value - startYear

  return Math.round((passedYears / totalYears) * 100)
})

// 方法
const selectOption = (option) => {
  selectedOption.value = option
  eventState.value = 'result'
  
  // 创建弹幕效果
  if (option.tags && option.tags.length > 0) {
    createDanmaku(option.tags)
  }
}

const returnToQuestion = () => {
  selectedOption.value = null
  eventState.value = 'question'
}

const goToNextEvent = () => {
  const choiceEvents = currentYearData.value.choiceEvents || []
  
  // 检查是否还有下一个人生抉择事件
  if (currentChoiceEventIndex.value < choiceEvents.length - 1) {
    // 进入下一个人生抉择事件
    currentChoiceEventIndex.value++
    resetEventState()
  } else {
    // 这是最后一个人生抉择事件，进入下一年
    nextYear()
  }
}

const resetEventState = () => {
  eventState.value = 'question'
  selectedOption.value = null
  currentEventIndex.value = 0
  currentSlide.value = 0
  currentChoiceEventIndex.value = 0 // 重置人生抉择事件索引
  clearDanmaku() // 清除弹幕
}

const nextYear = async () => {
  if (!completedYears.value.includes(currentYear.value)) {
    completedYears.value.push(currentYear.value)
  }

  if (hasNextYear.value) {
    currentYear.value += 1
    
    // 更新URL参数中的年份
    await router.replace({
      ...route,
      query: { ...route.query, year: currentYear.value }
    })
    
    resetYearState()
    // 加载新年份的数据
    await loadYearData(currentYear.value)
  }
}

const resetYearState = () => {
  eventState.value = 'question'
  selectedOption.value = null
  currentEventIndex.value = 0
  currentSlide.value = 0
  currentChoiceEventIndex.value = 0 // 重置人生抉择事件索引
  clearDanmaku() // 清除弹幕
}

// 轮播图控制
const nextSlide = () => {
  pauseAutoPlay() // 用户操作时暂停自动播放
  if (currentSlide.value < currentYearEvents.value.length - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0 // 循环回到第一张
  }
  resumeAutoPlayDelayed() // 3秒后恢复自动播放
}

const prevSlide = () => {
  pauseAutoPlay() // 用户操作时暂停自动播放
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = currentYearEvents.value.length - 1 // 循环到最后一张
  }
  resumeAutoPlayDelayed() // 3秒后恢复自动播放
}

const goToSlide = (index) => {
  currentSlide.value = index
  pauseAutoPlay() // 用户操作时暂停自动播放
  resumeAutoPlayDelayed() // 3秒后恢复自动播放
}

const goBack = () => {
  clearSelectedBook() // 清除选择的书籍
  router.push('/')
}

// 跳转到编辑页面
const goToEditor = () => {
  if (selectedBook.value?.id) {
    window.open(`/timeline-editor/${selectedBook.value.id}`, '_blank')
  }
}

// 生命周期
onMounted(async () => {
  // 初始化书籍信息
  await initializeBook()

  // 如果书籍加载成功，初始化其他状态并加载当前年份数据
  if (selectedBook.value && !loadError.value) {
    resetYearState()
    
    // 加载当前年份的数据
    await loadYearData(currentYear.value)

    // 延迟启动自动播放，给页面加载留出时间
    setTimeout(() => {
      startAutoPlay()
    }, 1000)
  }
})

onUnmounted(() => {
  stopAutoPlay() // 组件卸载时清理定时器
})

// 自动播放控制方法
const startAutoPlay = () => {
  if (currentYearEvents.value.length <= 1) return // 只有一张图片时不自动播放

  stopAutoPlay() // 清除现有定时器
  autoPlayTimer.value = setInterval(() => {
    if (isAutoPlaying.value) {
      nextSlide()
    }
  }, autoPlayInterval)
}

const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

const pauseAutoPlay = () => {
  isAutoPlaying.value = false
}

const resumeAutoPlay = () => {
  isAutoPlaying.value = true
}

const resumeAutoPlayDelayed = () => {
  setTimeout(() => {
    resumeAutoPlay()
  }, 3000) // 3秒后恢复自动播放
}

// 轮播容器鼠标事件
const handleCarouselMouseEnter = () => {
  pauseAutoPlay()
}

const handleCarouselMouseLeave = () => {
  resumeAutoPlay()
}

// 监听事件变化，重新启动自动播放
watch(currentYearEvents, () => {
  currentSlide.value = 0 // 重置到第一张
  startAutoPlay() // 重新启动自动播放
}, { immediate: false })

// 监听年份变化
watch(currentYear, async (newYear) => {
  currentSlide.value = 0 // 重置轮播位置
  startAutoPlay() // 重新启动自动播放
  
  // 加载新年份的数据
  if (selectedBook.value) {
    await loadYearData(newYear)
  }
})

// 创建弹幕效果
const createDanmaku = (tags) => {
  tags.forEach((tag, index) => {
    setTimeout(() => {
      const danmaku = {
        id: danmakuId.value++,
        text: tag,
        top: Math.random() * 60 + 20, // 20% - 80% 的位置
        duration: 3 + Math.random() * 2, // 3-5秒的动画时长
        delay: index * 0.5 // 每个标签延迟0.5秒
      }
      danmakuTags.value.push(danmaku)
      
      // 在动画完成后移除弹幕
      setTimeout(() => {
        const idx = danmakuTags.value.findIndex(d => d.id === danmaku.id)
        if (idx !== -1) {
          danmakuTags.value.splice(idx, 1)
        }
      }, (danmaku.duration + danmaku.delay) * 1000)
    }, index * 500) // 每个标签延迟500ms出现
  })
}

// 清除所有弹幕
const clearDanmaku = () => {
  danmakuTags.value = []
}
</script>

<style scoped>
.timeline-container {
  min-height: 100vh;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
  overflow-x: hidden;
}

/* 页面背景容器 */
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
  background-repeat: no-repeat;
}

/* 背景遮罩层 */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2); /* 降低透明度，让背景更清晰 */
  backdrop-filter: blur(1px); /* 减少模糊效果 */
  z-index: 1;
}

/* 年份动态背景 */
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: all 0.8s ease;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  transition: all 1s ease;
}

/* 1990年代 - 复古怀旧风格 */
.year-1995 .background-layer.layer-1 {
  background: linear-gradient(135deg, #ff7b94 0%, #ffaaa5 50%, #ff8882 100%);
}
.year-1995 .background-layer.layer-2 {
  background: radial-gradient(circle at 30% 30%, rgba(255, 123, 148, 0.3) 0%, transparent 50%);
}
.year-1995 .background-layer.layer-3 {
  background: linear-gradient(45deg, transparent 0%, rgba(255, 170, 165, 0.2) 100%);
}

/* 2000年代 - 新千年科技感 */
.year-2000 .background-layer.layer-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
}
.year-2000 .background-layer.layer-2 {
  background: radial-gradient(circle at 70% 20%, rgba(102, 126, 234, 0.4) 0%, transparent 60%);
}
.year-2000 .background-layer.layer-3 {
  background: linear-gradient(-45deg, transparent 0%, rgba(118, 75, 162, 0.3) 100%);
}

/* 2007年 - iPhone时代 */
.year-2007 .background-layer.layer-1 {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
}
.year-2007 .background-layer.layer-2 {
  background: radial-gradient(circle at 50% 50%, rgba(42, 82, 152, 0.4) 0%, transparent 60%);
}
.year-2007 .background-layer.layer-3 {
  background: linear-gradient(90deg, transparent 0%, rgba(30, 60, 114, 0.2) 100%);
}

/* 2008年 - 金融危机 */
.year-2008 .background-layer.layer-1 {
  background: linear-gradient(135deg, #8b5a3c 0%, #d4af37 50%, #8b5a3c 100%);
}
.year-2008 .background-layer.layer-2 {
  background: radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.3) 0%, transparent 50%);
}
.year-2008 .background-layer.layer-3 {
  background: linear-gradient(180deg, transparent 0%, rgba(139, 90, 60, 0.2) 100%);
}

/* 2010年代 - 社交媒体时代 */
.year-2010 .background-layer.layer-1 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #4facfe 100%);
}
.year-2010 .background-layer.layer-2 {
  background: radial-gradient(circle at 80% 30%, rgba(79, 172, 254, 0.4) 0%, transparent 60%);
}
.year-2010 .background-layer.layer-3 {
  background: linear-gradient(45deg, transparent 0%, rgba(0, 242, 254, 0.3) 100%);
}

/* 默认年份 */
.timeline-container:not([class*="year-"]) .background-layer.layer-1 {
  background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%);
}

/* 背景装饰 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: float 12s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.1) 0%, transparent 70%);
  top: 10%;
  left: 10%;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 45, 85, 0.08) 0%, transparent 70%);
  bottom: 20%;
  right: 15%;
  animation-delay: 4s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(52, 199, 89, 0.06) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 8s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.1); }
}

/* 头部样式 */
.timeline-header {
  position: relative;
  z-index: 10;
  padding: clamp(2rem, 5vw, 3rem) clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem);
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.timeline-title {
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.timeline-subtitle {
  color: #86868b;
  font-size: clamp(0.9rem, 3vw, 1.2rem);
  margin: 0 0 2rem 0;
  font-weight: 400;
}

/* 当前状态显示 */
.current-status {
  margin-top: 2rem;
}

.status-card {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(1.5rem, 5vw, 3rem);
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.status-label {
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  font-weight: 500;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-value {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  color: var(--primary-color, #007aff);
}

.stage-badge {
  background: rgba(0, 122, 255, 0.1);
  color: var(--primary-color, #007aff);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}

/* 人生进度 */
.life-progress {
  margin-top: 2rem;
}

.progress-header {
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 4vw, 2rem);
  margin-bottom: 1rem;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  color: #86868b;
  flex-wrap: wrap;
}

.progress-track {
  max-width: min(600px, 90vw);
  margin: 0 auto;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color, #007aff), #34c759);
  border-radius: 2px;
  transition: width 1s ease;
  position: relative;
}

.progress-marker {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color, #007aff);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.2);
}

/* 主内容区 */
.timeline-main {
  position: relative;
  z-index: 10;
  padding: clamp(1rem, 3vw, 2rem);
}

.year-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 个人事件样式 */
.personal-events {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: clamp(1.4rem, 4vw, 1.75rem);
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.01em;
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.year-badge, .age-badge {
  background: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  font-weight: 500;
}

.event-question-card,
.event-result-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.question-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.question-icon {
  font-size: clamp(1.5rem, 4vw, 2rem);
  line-height: 1;
  flex-shrink: 0;
}

.question-title {
  color: #1d1d1f;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
  flex: 1;
}

.question-description {
  color: #86868b;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
}

/* 文字选项样式 */
.text-options .option-button {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1d1d1f;
  padding: clamp(1rem, 3vw, 1.5rem);
  border-radius: 16px;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  animation: slideInUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  width: 100%;
  margin-bottom: 1rem;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-options .option-button:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #007aff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.option-content {
  flex: 1;
}

.option-text {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.option-meta {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.option-impact {
  font-weight: 500;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
}

.impact-1 {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.1);
}

.impact-2 {
  color: #34c759;
  background: rgba(52, 199, 89, 0.1);
}

.option-arrow {
  font-size: clamp(1rem, 3vw, 1.2rem);
  color: #007aff;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-left: 1rem;
}

.option-button:hover .option-arrow {
  transform: translateX(5px);
}

/* 图片选项样式 */
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 1.5rem);
  margin-top: 1rem;
}

.image-option {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideInUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 300px;
}

.image-option:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: #007aff;
}

.option-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.option-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-option:hover .option-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.option-impact-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.option-impact-icon.impact-1 {
  background: rgba(255, 59, 48, 0.9);
  color: white;
}

.option-impact-icon.impact-2 {
  background: rgba(52, 199, 89, 0.9);
  color: white;
}

.image-option .option-content {
  padding: clamp(1rem, 3vw, 1.5rem);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.option-title {
  color: #1d1d1f;
  font-size: clamp(1rem, 3vw, 1.2rem);
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
}

.option-desc {
  color: #86868b;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  line-height: 1.5;
  margin: 0 0 1rem 0;
  flex: 1;
}

.option-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: auto;
}

/* 结果页面样式 */
.result-content {
  text-align: center;
}

.result-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-icon {
  font-size: clamp(2.5rem, 6vw, 3rem);
  margin: 0;
}

.result-icon.error {
  color: #ff3b30;
}

.result-icon.success {
  color: #34c759;
}

.result-title {
  color: #1d1d1f;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
}

.result-description {
  color: #86868b;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  text-align: left;
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* 选项图片样式 */
.option-image-section {
  margin: 1.5rem 0;
  text-align: center;
}

.option-image {
  max-width: 250px;
  max-height: 200px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  object-fit: cover;
  width: auto;
  height: auto;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 轮播图样式 */
.annual-events-carousel {
  margin-bottom: 3rem;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.carousel-title-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.carousel-subtitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #86868b;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.bullet {
  color: #86868b;
  font-weight: bold;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.carousel-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  color: #1d1d1f;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  border-color: #007aff;
  transform: scale(1.05);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slide-indicator {
  color: #86868b;
  font-weight: 500;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  min-width: 60px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.indicator-divider {
  width: 20px;
  height: 1px;
  background: rgba(0, 0, 0, 0.2);
}

.carousel-container {
  position: relative;
  width: 100%;
  height: clamp(300px, 50vw, 400px);
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.carousel-wrapper {
  display: flex;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.event-visual {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-width: 0;
}

.event-media {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%);
}

.event-date-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 122, 255, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.event-details {
  flex: 1;
  padding: clamp(1rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.event-title {
  color: #1d1d1f;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
  flex: 1;
  min-width: 0;
}

.event-impact-badge {
  font-weight: 500;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
  white-space: nowrap;
  flex-shrink: 0;
}

.event-description {
  color: #86868b;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  flex: 1;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
}

.event-footer {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.event-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.event-tag {
  background: rgba(0, 0, 0, 0.05);
  color: #86868b;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  font-weight: 500;
}

.no-events {
  text-align: center;
  padding: clamp(2rem, 6vw, 3rem);
  color: #86868b;
}

.no-events-icon {
  font-size: clamp(3rem, 8vw, 4rem);
  margin: 0 0 1rem 0;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: var(--primary-color, #007aff);
  transform: scale(1.2);
}

.indicator-dot:hover {
  background: rgba(0, 122, 255, 0.6);
}

/* 年份完成样式 */
.year-completed {
  text-align: center;
}

.completion-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2rem);
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.completion-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.completion-icon {
  font-size: clamp(3rem, 8vw, 4rem);
  margin: 0;
}

.completion-rings {
  display: flex;
  gap: 0.5rem;
}

.ring {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(52, 199, 89, 0.3);
  animation: ringPulse 2s infinite;
}

.ring-2 {
  animation-delay: 0.3s;
}

.ring-3 {
  animation-delay: 0.6s;
}

@keyframes ringPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

.completion-content {
  text-align: center;
}

.completion-title {
  color: #34c759;
  font-size: clamp(1.4rem, 5vw, 1.75rem);
  font-weight: 600;
  margin: 0 0 1rem 0;
  letter-spacing: -0.01em;
}

.completion-description {
  color: #86868b;
  margin: 0 0 2rem 0;
  line-height: 1.6;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
}

.completion-stats {
  display: flex;
  justify-content: center;
  gap: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
}

.stat-value {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 600;
  color: var(--primary-color, #007aff);
}

.stat-label {
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  color: #86868b;
}

.stat-divider {
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
}

/* 按钮样式 */
.action-button {
  position: relative;
  padding: clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem);
  border: none;
  border-radius: 25px;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 160px;
  justify-content: center;
  overflow: hidden;
}

.action-button.primary {
  background: var(--primary-color, #007aff);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
}

.action-button.primary:hover {
  background: color-mix(in srgb, var(--primary-color, #007aff) 80%, black);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.4);
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.9);
  color: #1d1d1f;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.action-button.large {
  padding: clamp(1rem, 4vw, 1.25rem) clamp(2rem, 5vw, 2.5rem);
  font-size: clamp(1rem, 3vw, 1.1rem);
  min-width: clamp(180px, 40vw, 200px);
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-icon {
  position: relative;
  z-index: 2;
  font-size: clamp(1rem, 3vw, 1.2rem);
  transition: transform 0.3s ease;
}

.action-button:hover .button-icon {
  transform: translateX(3px);
}

/* 底部样式 */
.timeline-footer {
  position: relative;
  z-index: 10;
  padding: clamp(1.5rem, 4vw, 2rem);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.journey-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #86868b;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  flex-wrap: wrap;
}

.summary-stats {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 2rem);
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 60px;
}

.summary-value {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 600;
  color: var(--primary-color, #007aff);
}

.summary-label {
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .carousel-slide {
    flex-direction: column;
  }

  .event-visual {
    height: 200px;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .image-option {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .timeline-header {
    padding: 2rem 1rem 1rem;
  }

  .timeline-main {
    padding: 1.5rem 1rem;
  }

  .status-card {
    gap: 1.5rem;
  }

  .carousel-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .carousel-controls {
    justify-content: center;
  }

  .carousel-container {
    height: 350px;
  }

  .event-details {
    padding: 1.5rem;
  }

  .event-question-card,
  .event-result-card {
    padding: 2rem 1.5rem;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .result-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-button {
    width: 100%;
    max-width: 300px;
  }

  .question-header {
    align-items: center;
  }

  .carousel-slide {
    padding: 0;
  }

  .event-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .options-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .text-options .option-button {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem;
  }

  .option-arrow {
    align-self: flex-end;
    margin-left: 0;
  }

  .summary-stats {
    justify-content: center;
    gap: 1rem;
  }

  .completion-visual {
    flex-direction: column;
    gap: 1rem;
  }

  .completion-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-divider {
    display: none;
  }

  .status-card {
    flex-direction: column;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .section-meta {
    gap: 0.5rem;
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .timeline-title {
    font-size: 2rem;
  }

  .options-grid {
    gap: 0.75rem;
  }

  .image-option {
    min-height: 250px;
  }

  .option-image {
    height: 120px;
  }
}

/* 高分辨率屏幕优化 */
@media (min-width: 1400px) {
  .year-container {
    max-width: 1400px;
  }

  .header-content {
    max-width: 1400px;
  }

  .footer-content {
    max-width: 1400px;
  }
}

/* 横屏手机适配 */
@media (max-height: 500px) and (orientation: landscape) {
  .timeline-header {
    padding: 1rem;
  }

  .status-card {
    flex-direction: row;
    gap: 2rem;
  }

  .life-progress {
    margin-top: 1rem;
  }

  .carousel-container {
    height: 250px;
  }
}

/* 问题图片展示样式 */
.question-image-section {
  margin: 1.5rem 0 2rem 0;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.question-image {
  position: relative;
  height: clamp(200px, 40vw, 300px);
  overflow: hidden;
}

.question-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.question-image:hover img {
  transform: scale(1.02);
}

.question-image .image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
}

/* 选项样式 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-button {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1d1d1f;
  padding: clamp(1rem, 3vw, 1.5rem);
  border-radius: 16px;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  animation: slideInUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  width: 100%;
  margin-bottom: 1rem;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-button:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #007aff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 问题媒体展示 */
.question-media-section {
  margin: 1.5rem 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.question-media {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.media-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.media-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
  pointer-events: none;
}

/* 事件媒体样式 */
.event-media {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.event-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-video:hover {
  transform: scale(1.05);
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-slide:hover .event-image {
  transform: scale(1.05);
}

.media-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.4) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
}

/* 加载状态样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-container {
  text-align: center;
  max-width: 400px;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 122, 255, 0.2);
  border-top: 4px solid #007aff;
  border-radius: 50%;
  animation: loadingSpin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes loadingSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.5rem 0;
}

.loading-subtitle {
  color: #86868b;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

/* 错误状态样式 */
.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fee 0%, #fdd 50%, #fee 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.error-container {
  text-align: center;
  max-width: 500px;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(255, 59, 48, 0.15);
  border: 1px solid rgba(255, 59, 48, 0.1);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ff3b30;
  margin: 0 0 1rem 0;
}

.error-message {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}

.error-hint {
  color: #86868b;
  font-size: 0.9rem;
  margin: 0 0 2rem 0;
}

.error-button {
  background: #007aff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
}

.error-button:hover {
  background: #0056cc;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4);
}

/* 当年无个人事件时的提示 */
.no-personal-events {
  text-align: center;
  padding: clamp(2rem, 6vw, 3rem);
  color: #86868b;
}

.no-events-container {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.no-events-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.no-events-icon {
  font-size: clamp(3rem, 8vw, 4rem);
}

.year-indicator {
  font-size: clamp(1.4rem, 4vw, 1.75rem);
  font-weight: 600;
  color: #1d1d1f;
}

.no-events-content {
  text-align: center;
}

.no-events-title {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.5rem 0;
}

.no-events-description {
  color: #86868b;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  line-height: 1.6;
}

.year-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

/* 编辑按钮样式 */
.header-actions {
  position: absolute;
  top: 0;
  right: 1rem;
  z-index: 20;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(0, 122, 255, 0.9);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
}

.edit-button:hover {
  background: rgba(0, 122, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.4);
}

.edit-button svg {
  flex-shrink: 0;
}

/* 弹幕容器样式 */
.danmaku-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.danmaku-item {
  position: absolute;
  right: -200px;
  color: #fff;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  background: linear-gradient(90deg, #007bff, #6f42c1);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  white-space: nowrap;
  animation: danmaku-move linear;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

@keyframes danmaku-move {
  0% { 
    right: -200px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% { 
    right: 100%;
    opacity: 0;
  }
}
</style>
