<template>
    <div class="artist-journey">
       <!-- 音波粒子背景画布 -->
       <canvas id="particles-canvas"></canvas>
      
    
      <!-- 导航栏 -->
      <nav class="fixed top-0 w-full z-[90] bg-transparent">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="music-brand text-gray-800">
              LAY 张艺兴
            </div>
            <div class="flex space-x-8">
              <a href="#home" class="nav-link">首页</a>
              <router-link to="/music3d" class="nav-link">音乐</router-link>
              <a href="#videos" class="nav-link">视频</a>
              <a href="#timeline" class="nav-link">时间轴</a>
              <a href="#latest-updates" class="nav-link">最新动态</a>
            </div>
            <button id="menu-toggle" class="md:hidden control-button" title="菜单">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
  
      <!-- 主页 Hero Section -->
      <section id="home" class="h-screen flex items-center justify-center section-padding relative">
        <!-- 左侧背景图片区域 -->
        <div class="hero-background-right" 
             :class="{ 'draggable-element': draggableElements.includes('hero-background') }"
             data-element-id="hero-background">
          <!-- 拖拽句柄 -->
          <div v-if="debugMode && draggableElements.includes('hero-background')" 
               class="drag-handle"
               @mousedown="startDrag($event, 'hero-background')"
               title="拖拽移动背景图片">
            ⋮⋮
          </div>
        </div>
        
        <div class="container flex items-center relative z-10">
          <!-- 个人简介右侧展示，避免与背景重叠 -->
          <div class="max-w-4xl text-center px-8 py-8 ml-auto mr-8 md:mr-16 lg:mr-20 backdrop-blur-sm bg-white/10 rounded-2xl"
               :class="{ 'draggable-element': draggableElements.includes('hero-content') }"
               data-element-id="hero-content"
               :style="getElementStyle('hero-content')">
            <!-- 拖拽句柄 -->
            <div v-if="debugMode && draggableElements.includes('hero-content')" 
                 class="drag-handle"
                 @mousedown="startDrag($event, 'hero-content')"
                 title="拖拽移动内容区域">
              ⋮⋮
            </div>
            <!-- 装饰线条 -->
            <div class="decorative-line mb-8 flex justify-center">
              <span class="line"></span>
              <span class="dot"></span>
              <span class="line"></span>
            </div>
            
            <!-- 主标题打字效果 - 适中尺寸 -->
            <div class="title-container mb-8 relative"
                 :class="{ 'draggable-element': draggableElements.includes('title-container') }"
                 data-element-id="title-container">
              <!-- 拖拽句柄 -->
              <div v-if="debugMode && draggableElements.includes('title-container')" 
                   class="drag-handle"
                   @mousedown="startDrag($event, 'title-container')"
                   title="拖拽移动标题容器">
                ⋮⋮
              </div>
              <div class="title-bg"></div>
              <h1 class="typewriter-text text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight" ref="typewriterText">
                LAY ZHANG
              </h1>
            </div>
            
            <!-- 简介和标签内容 -->
            <div class="max-w-2xl mx-auto space-y-6">
              <!-- 简介文字 -->
              <p class="artist-intro text-lg md:text-xl lg:text-2xl text-gray-700 font-light tracking-wide leading-relaxed opacity-0 transform translate-y-8" ref="artistIntro">
                努力努力再努力！！！
              </p>
              
              <!-- 身份标签轮播 -->
              <div class="identity-showcase relative opacity-0 transform translate-y-8" ref="identityShowcase">
                <div class="identity-carousel text-base md:text-lg lg:text-xl text-gray-500 font-light" ref="identityCarousel">
                  <span class="identity-text">全民制作人</span>
                  <span class="identity-text">舞者</span>
                  <span class="identity-text">歌手</span>
                  <span class="identity-text">创作者</span>
                </div>
                <!-- 装饰元素 -->
                <div class="identity-decor left"></div>
                <div class="identity-decor right"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 音乐轮播图 -->
      <section id="latest-updates" class="relative h-screen flex items-center justify-center section-padding overflow-hidden bg-transparent">
        <LatestUpdates :items="carouselItems" auto :onScrollProgress="handleLatestUpdatesScroll">
          <template #main-content>
            <TestMusic />
          </template>
        </LatestUpdates>
      </section>
  
      <!-- 页面过渡遮罩 -->
      <div class="page-transition-mask"></div>
  
      <!-- 视频作品 -->
      <section id="videos" class="section-padding bg-gray-50 scroll-reveal">
        <div class="container">
          <div class="text-center mb-16">
            <h2 class="section-title animate-title" data-animate="fadeInDown">视频作品</h2>
            <p class="section-subtitle animate-subtitle" data-animate="fadeInUp" data-delay="0.2">
              用影像记录音乐的视觉表达
            </p>
          </div>
          
          <div class="grid grid-cols-3 gap-8">
            <!-- 视频卡片 -->
            <div v-for="(video, index) in videoData" :key="video.id" 
                 class="video-card animate-card" 
                 :data-animate="'slideInUp'" 
                 :data-delay="1.0 + index * 0.4">
              <div class="video-thumbnail aspect-video mb-4 relative">
                <img :src="video.thumbnail" :alt="video.title" class="w-full h-full object-cover rounded-lg">
                <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100 rounded-lg">
                  <button class="play-button" @click="playVideo(video)">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                <div class="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {{ video.duration }}
                </div>
                <div class="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  {{ video.platform }}
                </div>
              </div>
              
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ video.title }}</h3>
                <p class="text-gray-600 text-sm">{{ video.description }}</p>
                <div class="flex items-center text-xs text-gray-400">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  {{ video.views }} 次观看
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  
      <!-- 3D 交互时间轴 -->
      <section id="timeline" class="section-padding min-h-[67vh] bg-gray-50 scroll-reveal">
        <div class="container">
          <div class="text-center mb-16">
            <h2 class="section-title animate-title" data-animate="fadeInDown">音乐时间轴</h2>
            <p class="section-subtitle max-w-3xl mx-auto animate-subtitle" data-animate="fadeInUp" data-delay="0.2">
              沉浸式 3D 音乐时光隧道，悬停节点查看预览，点击触发音乐节拍动效。
              每一次点击都伴随着专属的音波扩散与旋律共鸣，让时光在音符中流淌。
            </p>
            <!-- 节拍点装饰 -->
            <div class="rhythm-dots animate-dots" data-animate="fadeInUp" data-delay="0.4">
              <div class="rhythm-dot"></div>
              <div class="rhythm-dot"></div>
              <div class="rhythm-dot"></div>
              <div class="rhythm-dot"></div>
              <div class="rhythm-dot"></div>
            </div>
          </div>
        </div>
        
        <!-- 3D 时间轴容器 -->
        <div id="timeline-3d" class="w-full h-96 md:h-screen animate-timeline" data-animate="fadeIn" data-delay="0.6"></div>
        
        <!-- 时间轴控制器 -->
        
      </section>
  
      <!-- 移动端菜单 -->
      <div id="mobile-menu" class="fixed inset-0 z-50 hidden md:hidden">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeMobileMenu"></div>
        <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-xl font-bold text-gray-900">菜单</h3>
            <button @click="closeMobileMenu" class="control-button" title="关闭菜单">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav class="space-y-6">
            <a href="#home" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">首页</a>
            <router-link to="/music3d" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">音乐</router-link>
            <a href="#videos" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">视频</a>
            <a href="#timeline" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">时间轴</a>
            <a href="#latest-updates" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">最新动态</a>
          </nav>
        </div>
      </div>
      <!-- 页面底部插入按钮 -->
            
    </div>
    
  
  
</template>
  
  <script setup lang="ts">
import VideoTransition from '@/components/VideoTransition.vue'
import { getLatestCarouselItems } from '@/database/Carousel.js'
import { musicData, videoData } from '@/database/index.js'
import '@/styles/debug.css'
import '@/styles/index.css'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import LatestUpdates from '@/components/LatestUpdates.vue'
import TestMusic from './TestMusic.vue'
  
  const router = useRouter()
  
  // 响应式数据
  const hoverCount = ref(0)
  const clickCount = ref(0)
  const animationStatus = ref('初始化中...')
  const currentPlayingId = ref(null)
  const isLoading = ref(false)
  const failedAlbumId = ref(null)
  
  // 高设计感鼠标交互相关

  
  // 转场相关状态
  const showVideoTransition = ref(false)
  const videoTransitionRef = ref<InstanceType<typeof VideoTransition>>()
  
  // 专辑展示相关状态
  const currentAlbumIndex = ref(0)
  const isPlaying = ref(false)
  const progressPercent = ref(0)
  const currentTime = ref('0:00')
  const totalTime = ref('3:45')
  
  // 轮播图相关状态
  const currentSlideIndex = ref(0)
  const isVideoPlaying = ref(false)
  let carouselTimer: number | null = null
  
  // 调试模式相关状态
  const debugMode = ref(false)
  
  // 拖拽和调试功能相关状态
  const draggableElements = ref([])
  const elementPositions = ref({})
  const copyStatus = ref(null)
  const isDragging = ref(false)
  const dragStartPos = ref({ x: 0, y: 0 })
  const elementStartPos = ref({ x: 0, y: 0 })
  const currentDragElement = ref(null)
  
  const carouselItems = ref(getLatestCarouselItems(6))
  
  // 页面过渡效果相关
  
  // 静态资源
  const artistImage = '/artist-journey/assets/background.jpg'
  
  // Lottie 动画相关
  let glassCardLottieAnimation = null
  let globalClickLottieAnimation = null
  let particlesCanvas = null
  let animationId = null
  let hoverTimer = null
  
  // 音乐数据从外部文件导入
  
  // 视频数据和抖音数据从外部文件导入
  
  // 计算属性：当前专辑
  const currentAlbum = ref(musicData[0]) // 直接使用 ref 包装当前专辑
  
  // 专辑导航方法
  const previousAlbum = () => {
    if (currentAlbumIndex.value > 0) {
      currentAlbumIndex.value--
      currentAlbum.value = musicData[currentAlbumIndex.value]
      updateAlbumBackground()
    }
  }
  
  const nextAlbum = () => {
    if (currentAlbumIndex.value < musicData.length - 1) {
      currentAlbumIndex.value++
      currentAlbum.value = musicData[currentAlbumIndex.value]
      updateAlbumBackground()
    }
  }
  
  const goToAlbum = (index) => {
    currentAlbumIndex.value = index
    currentAlbum.value = musicData[index]
    updateAlbumBackground()
  }
  
    // 轮播图控制方法
  const nextSlide = () => {
    // 暂停当前播放的视频
    pauseAllVideos()
    currentSlideIndex.value = (currentSlideIndex.value + 1) % carouselItems.value.length
    resetCarouselTimer()
  }

  const previousSlide = () => {
    // 暂停当前播放的视频
    pauseAllVideos()
    currentSlideIndex.value = currentSlideIndex.value === 0 
      ? carouselItems.value.length - 1 
      : currentSlideIndex.value - 1
    resetCarouselTimer()
  }

  const goToSlide = (index) => {
    // 暂停当前播放的视频
    pauseAllVideos()
    currentSlideIndex.value = index
    resetCarouselTimer()
  }

  // 暂停所有视频
  const pauseAllVideos = () => {
    const videos = document.querySelectorAll('.carousel-slide video')
    videos.forEach(video => {
      if (!video.paused) {
        video.pause()
      }
    })
  }
  
  // 自动播放轮播图
  const startCarouselAutoPlay = () => {
    // 如果有视频在播放，不启动自动轮播
    if (isVideoPlaying.value) {
      console.log('有视频在播放，不启动自动轮播')
      return
    }
    
    carouselTimer = setInterval(() => {
      // 如果有视频在播放，跳过这次切换
      if (isVideoPlaying.value) {
        console.log('有视频在播放，跳过自动切换')
        return
      }
      nextSlide()
    }, 8000) // 每8秒自动切换（慢一倍速度）
  }
  
  const resetCarouselTimer = () => {
    if (carouselTimer) {
      clearInterval(carouselTimer)
      carouselTimer = null
    }
    // 只有在没有视频播放时才重新启动
    if (!isVideoPlaying.value) {
      startCarouselAutoPlay()
    }
  }
  
  // 处理最新动态滚动进度
  const handleLatestUpdatesScroll = (progress: number) => {
    // 滚动进度回调处理（可用于其他目的）
    console.log('Latest updates scroll progress:', progress)
  }
  
  // 调试模式切换
  const toggleDebugMode = () => {
    debugMode.value = !debugMode.value
    document.body.classList.toggle('debug-mode', debugMode.value)
    
    // 如果关闭调试模式，清除所有拖拽状态
    if (!debugMode.value) {
      draggableElements.value = []
      elementPositions.value = {}
      cleanupDragStyles()
    }
  }

  // 切换元素拖拽状态
  const toggleDraggable = (elementId) => {
    const index = draggableElements.value.indexOf(elementId)
    if (index > -1) {
      draggableElements.value.splice(index, 1)
      delete elementPositions.value[elementId]
      resetElementPosition(elementId)
    } else {
      draggableElements.value.push(elementId)
      initializeElementPosition(elementId)
    }
  }

  // 初始化元素位置
  const initializeElementPosition = (elementId) => {
    const element = document.querySelector(`[data-element-id="${elementId}"]`)
    if (element) {
      const rect = element.getBoundingClientRect()
      elementPositions.value[elementId] = {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        originalX: Math.round(rect.left),
        originalY: Math.round(rect.top)
      }
    }
  }

  // 开始拖拽
  const startDrag = (event, elementId) => {
    event.preventDefault()
    event.stopPropagation()
    
    isDragging.value = true
    currentDragElement.value = elementId
    
    dragStartPos.value = {
      x: event.clientX,
      y: event.clientY
    }
    
    const position = elementPositions.value[elementId]
    if (position) {
      elementStartPos.value = {
        x: position.x,
        y: position.y
      }
    }
    
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
    
    // 添加拖拽样式
    const element = document.querySelector(`[data-element-id="${elementId}"]`)
    if (element) {
      element.classList.add('dragging')
    }
  }

  // 处理拖拽移动
  const handleDrag = (event) => {
    if (!isDragging.value || !currentDragElement.value) return
    
    const deltaX = event.clientX - dragStartPos.value.x
    const deltaY = event.clientY - dragStartPos.value.y
    
    const newX = elementStartPos.value.x + deltaX
    const newY = elementStartPos.value.y + deltaY
    
    // 更新位置
    elementPositions.value[currentDragElement.value] = {
      ...elementPositions.value[currentDragElement.value],
      x: Math.round(newX),
      y: Math.round(newY)
    }
    
    // 应用位置变换
    const element = document.querySelector(`[data-element-id="${currentDragElement.value}"]`)
    if (element) {
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      element.style.position = 'relative'
      element.style.zIndex = '9999'
    }
  }

  // 停止拖拽
  const stopDrag = () => {
    if (currentDragElement.value) {
      const element = document.querySelector(`[data-element-id="${currentDragElement.value}"]`)
      if (element) {
        element.classList.remove('dragging')
      }
    }
    
    isDragging.value = false
    currentDragElement.value = null
    
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  // 重置元素位置
  const resetElementPosition = (elementId) => {
    const element = document.querySelector(`[data-element-id="${elementId}"]`)
    if (element) {
      element.style.transform = ''
      element.style.position = ''
      element.style.zIndex = ''
    }
    
    // 重新初始化位置
    if (draggableElements.value.includes(elementId)) {
      initializeElementPosition(elementId)
    }
  }

  // 清理拖拽样式
  const cleanupDragStyles = () => {
    const draggableElements = document.querySelectorAll('[data-element-id]')
    draggableElements.forEach(element => {
      element.style.transform = ''
      element.style.position = ''
      element.style.zIndex = ''
      element.classList.remove('dragging')
    })
  }

  // 获取元素显示名称
  const getElementDisplayName = (elementId) => {
    const names = {
      'hero-content': '🏠 首页内容区',
      'hero-background': '🖼️ 背景图片',
      'title-container': '📝 标题容器',
      'album-showcase': '💿 专辑展示'
    }
    return names[elementId] || elementId
  }

  // 复制单个参数
  const copyParam = async (label, value) => {
    try {
      await navigator.clipboard.writeText(`${label}: ${value}`)
      showCopyStatus('success', `已复制: ${label}`)
    } catch (err) {
      showCopyStatus('error', '复制失败')
      console.error('复制失败:', err)
    }
  }

  // 复制元素位置
  const copyElementPosition = async (elementId, position) => {
    const displayName = getElementDisplayName(elementId)
    const positionText = `${displayName}\nX: ${position.x}px\nY: ${position.y}px\ntransform: translate(${position.x - position.originalX}px, ${position.y - position.originalY}px)`
    
    try {
      await navigator.clipboard.writeText(positionText)
      showCopyStatus('success', `已复制 ${displayName} 位置参数`)
    } catch (err) {
      showCopyStatus('error', '复制失败')
      console.error('复制失败:', err)
    }
  }

  // 复制所有参数
  const copyAllParams = async () => {
    const allParams = [
      '=== LAY张艺兴首页布局参数 ===',
      '',
      '📐 基础布局:',
      '主页高度: 75vh (3/4视口)',
      '轮播图高度: 100vh (全视口)',
      '背景图片: 45% × 96%',
      '内容区域: max-w-4xl',
      '标题尺寸: 4xl/6xl/7xl',
      '',
      '📍 元素位置参数:',
      ...Object.entries(elementPositions.value).map(([elementId, position]) => {
        const displayName = getElementDisplayName(elementId)
        return `${displayName}: X=${position.x}px, Y=${position.y}px, 偏移=(${position.x - position.originalX}, ${position.y - position.originalY})`
      }),
      '',
      `轮播状态: ${currentSlideIndex.value + 1}/${carouselItems.value.length}`,
      `当前专辑: ${currentAlbum.value.albumTitle}`,
      '',
      '=========================='
    ].join('\n')
    
    try {
      await navigator.clipboard.writeText(allParams)
      showCopyStatus('success', '已复制所有参数到剪贴板')
    } catch (err) {
      showCopyStatus('error', '复制失败')
      console.error('复制失败:', err)
    }
  }

  // 显示复制状态
  const showCopyStatus = (type, message) => {
    copyStatus.value = { type, message }
    setTimeout(() => {
      copyStatus.value = null
    }, 3000)
  }

  // 打开微博链接
  const openWeiboLink = (link) => {
    if (link) {
      window.open(link, '_blank')
      showNotification('🔗 正在跳转到微博查看原文')
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 处理视频播放事件
  const handleVideoPlay = () => {
    console.log('🎥 视频开始播放，暂停轮播')
    isVideoPlaying.value = true
    // 暂停自动轮播
    if (carouselTimer) {
      clearInterval(carouselTimer)
      carouselTimer = null
    }
    showNotification('📺 视频播放中，轮播已暂停')
  }

  // 处理视频暂停事件
  const handleVideoPause = () => {
    console.log('⏸️ 视频暂停，恢复轮播')
    isVideoPlaying.value = false
    // 恢复自动轮播
    if (!carouselTimer) {
      startCarouselAutoPlay()
    }
    showNotification('⏸️ 视频暂停，轮播已恢复')
  }

  // 处理视频结束事件
  const handleVideoEnded = () => {
    console.log('✅ 视频播放结束，恢复轮播')
    isVideoPlaying.value = false
    // 恢复自动轮播
    if (!carouselTimer) {
      startCarouselAutoPlay()
    }
    showNotification('✅ 视频播放完毕，轮播已恢复')
  }

  // 处理视频加载开始事件
  const handleVideoLoadStart = () => {
    console.log('🔄 视频开始加载')
  }

  // 处理视频错误事件
  const handleVideoError = (event) => {
    console.error('❌ 视频加载错误:', event)
    const video = event.target
    const errorMessage = video.error ? 
      `错误代码: ${video.error.code}, 信息: ${video.error.message}` : 
      '未知视频错误'
    console.error('详细错误信息:', errorMessage)
    showNotification(`❌ 视频加载失败: ${errorMessage}`)
    isVideoPlaying.value = false
    // 确保轮播恢复
    if (!carouselTimer) {
      startCarouselAutoPlay()
    }
  }

  // 处理视频可以播放事件
  const handleVideoCanPlay = (event) => {
    console.log('✅ 视频已准备好播放')
    showNotification('✅ 视频已加载完成，可以播放')
  }

  // 处理视频数据加载完成事件
  const handleVideoLoaded = (event) => {
    const video = event.target
    console.log('📊 视频元数据已加载:', {
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      src: video.src
    })
  }

  // 处理轮播项点击事件
  const handleSlideClick = (event, item) => {
    // 如果点击的是视频控制栏区域，不处理微博跳转
    if (event.target.tagName === 'VIDEO' || event.target.closest('video')) {
      console.log('点击了视频区域，不跳转微博')
      return
    }
    
    // 如果是图片或其他区域，跳转到微博
    if (item.type === 'image') {
      openWeiboLink(item.link)
    }
  }

  // 获取元素样式（支持调试模式下的位置调整）
  const getElementStyle = (elementId) => {
    if (!debugMode.value || !draggableElements.value.includes(elementId)) {
      return {}
    }
    
    const position = elementPositions.value[elementId]
    if (!position) {
      return {}
    }
    
    // 计算相对于原始位置的偏移
    const offsetX = position.x - position.originalX
    const offsetY = position.y - position.originalY
    
    return {
      transform: `translate(${offsetX}px, ${offsetY}px)`,
      position: 'relative',
      zIndex: isDragging.value && currentDragElement.value === elementId ? '9999' : 'auto'
    }
  }

  // 定位内容 - 滚动到首页并高亮显示内容
  const locateContent = () => {
    // 首先滚动到首页顶部
    document.getElementById('home')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
    
    // 高亮显示所有可拖拽元素
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-element-id]')
      elements.forEach(element => {
        element.style.outline = '3px solid #ff0066'
        element.style.outlineOffset = '5px'
        element.style.animation = 'pulse 2s infinite'
      })
      
      // 3秒后移除高亮
      setTimeout(() => {
        elements.forEach(element => {
          element.style.outline = ''
          element.style.outlineOffset = ''
          element.style.animation = ''
        })
      }, 3000)
      
      showCopyStatus('success', '📍 已定位到内容区域')
    }, 500)
  }

  // 重置所有位置
  const resetAllPositions = () => {
    // 重置所有拖拽元素
    draggableElements.value.forEach(elementId => {
      resetElementPosition(elementId)
    })
    
    // 清空拖拽元素列表和位置记录
    draggableElements.value = []
    elementPositions.value = {}
    
    showCopyStatus('success', '🔄 已重置所有元素位置')
  }

  // 切换轮播自动播放
  const toggleCarouselAutoPlay = () => {
    if (carouselTimer) {
      // 停止自动轮播
      clearInterval(carouselTimer)
      carouselTimer = null
      showCopyStatus('success', '⏸️ 轮播已暂停')
    } else {
      // 启动自动轮播
      startCarouselAutoPlay()
      showCopyStatus('success', '▶️ 轮播已启动')
    }
  }

  // 测试当前视频
  const testCurrentVideo = () => {
    const currentItem = carouselItems.value[currentSlideIndex.value]
    if (currentItem.type !== 'video') {
      showCopyStatus('error', '❌ 当前项不是视频')
      return
    }
    
    const currentSlide = document.querySelector('.carousel-slide:nth-child(' + (currentSlideIndex.value + 1) + ')')
    const video = currentSlide?.querySelector('video')
    
    if (video) {
      console.log('🎥 视频元素信息:', {
        src: video.src,
        currentSrc: video.currentSrc,
        readyState: video.readyState,
        networkState: video.networkState,
        error: video.error
      })
      
      if (video.paused) {
        video.play().then(() => {
          showCopyStatus('success', '🎥 视频开始播放')
        }).catch(error => {
          console.error('视频播放失败:', error)
          showCopyStatus('error', '❌ 视频播放失败: ' + error.message)
        })
      } else {
        video.pause()
        showCopyStatus('success', '⏸️ 视频已暂停')
      }
    } else {
      showCopyStatus('error', '❌ 未找到视频元素')
    }
  }

  // 检查视频文件
  const checkVideoFiles = () => {
    console.log('🔍 开始检查视频文件...')
    
    carouselItems.value.forEach((item, index) => {
      if (item.type === 'video') {
        const testVideo = document.createElement('video')
        testVideo.src = item.src
        
        testVideo.addEventListener('loadeddata', () => {
          console.log(`✅ 视频 ${index + 1} 加载成功:`, item.src)
        })
        
        testVideo.addEventListener('error', (e) => {
          console.error(`❌ 视频 ${index + 1} 加载失败:`, item.src, e)
        })
        
        // 清理
        setTimeout(() => {
          testVideo.removeEventListener('loadeddata', () => {})
          testVideo.removeEventListener('error', () => {})
        }, 5000)
      }
    })
    
    showCopyStatus('success', '🔍 已开始检查视频文件，请查看控制台')
  }


  
  // 切换到移动端
  const switchToMobile = () => {
    router.push('/mobile')
  }


  
  // 转场开始事件
  const onTransitionStarted = () => {
    console.log('🎬 视频转场已开始')
    // 可以在这里添加一些额外的效果，比如停止背景音乐等
  }
  
  // 转场结束事件
  const onTransitionEnded = () => {
    console.log('✅ 视频转场已完成')
    showVideoTransition.value = false
  }
  
  // 转场错误事件
  const onTransitionError = (error: Event) => {
    console.error('❌ 视频转场出错:', error)
    console.warn('转场视频加载失败，将直接跳转')
    
    // 发生错误时直接跳转
    setTimeout(() => {
      router.push('/landing-3d')
      showVideoTransition.value = false
    }, 1000)
  }
  
  // 更新专辑背景
  const updateAlbumBackground = () => {
    const container = document.querySelector('.album-showcase-container')
    if (container && currentAlbum.value.albumBackground) {
      container.style.setProperty('--album-bg', `url(${currentAlbum.value.albumBackground})`)
    }
  }
  
  // 播放器方法
  const togglePlay = () => {
    isPlaying.value = !isPlaying.value
    if (isPlaying.value) {
      startProgress()
    } else {
      stopProgress()
    }
  }
  
  const playCurrentAlbum = () => {
    isPlaying.value = true
    startProgress()
  }
  
  // 模拟播放进度
  let progressInterval = null
  
  const startProgress = () => {
    if (progressInterval) clearInterval(progressInterval)
    progressInterval = setInterval(() => {
      if (progressPercent.value < 100) {
        progressPercent.value += 0.5
        updateCurrentTime()
      } else {
        progressPercent.value = 0
        updateCurrentTime()
      }
    }, 200)
  }
  
  const stopProgress = () => {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }
  
  const updateCurrentTime = () => {
    const totalSeconds = 225 // 3:45 的总秒数
    const currentSeconds = Math.floor((progressPercent.value / 100) * totalSeconds)
    const minutes = Math.floor(currentSeconds / 60)
    const seconds = currentSeconds % 60
    currentTime.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  
  // 初始化Lottie动画
  const initGlassCardLottie = () => {
    const container = document.getElementById('lottie-container')
    if (container && window.lottie) {
      try {
    
        
        glassCardLottieAnimation = window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          path: '/lottie/Animation - 1749135116565(1).json'
        })
        
        glassCardLottieAnimation.addEventListener('data_ready', () => {
          
          animationStatus.value = '已加载，悬浮2秒触发'
        })
        
        glassCardLottieAnimation.addEventListener('data_failed', () => {
          console.error('玻璃卡片边框Lottie动画数据加载失败')
          animationStatus.value = '加载失败'
          
          // 如果Lottie加载失败，使用CSS动画作为备用
          const card = document.getElementById('lottie-glass-card')
          if (card) {
            card.classList.add('fallback-animation')
          }
        })
        
      } catch (error) {
        console.error('玻璃卡片边框Lottie动画初始化错误:', error)
        animationStatus.value = '初始化失败'
      }
    } else {
      console.warn('Lottie库未加载或容器不存在，使用CSS动画备用方案')
      animationStatus.value = 'CSS动画备用'
    }
  }
  
  // 初始化全局点击Lottie动画
  const initGlobalClickLottie = () => {
    // 创建全局点击动画容器
    const existingContainer = document.getElementById('global-click-lottie')
    if (existingContainer) {
      existingContainer.remove()
    }
    
    const container = document.createElement('div')
    container.id = 'global-click-lottie'
    container.style.cssText = `
      position: fixed;
      width: 200px;
      height: 200px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `
    document.body.appendChild(container)
    
    if (window.lottie) {
      try {
  
        
        globalClickLottieAnimation = window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: '/lottie/Animation - 1749135273451.json'
        })
        
                  globalClickLottieAnimation.addEventListener('data_ready', () => {
            // 全局点击动画数据加载完成
          })
        
        globalClickLottieAnimation.addEventListener('complete', () => {
          container.style.opacity = '0'
        })
        
      } catch (error) {
        console.error('全局点击Lottie动画初始化错误:', error)
      }
    }
  }
  
  // 初始化标题Lottie动画
  const initTitleLotties = () => {
    const lottieIds = ['title-lottie-1', 'title-lottie-2', 'title-lottie-3']
    
    lottieIds.forEach((id, index) => {
      const container = document.getElementById(id)
      if (container && window.lottie) {
        try {
  
          
          window.lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/lottie/Animation - 1749135116565(1).json'
          })
          
        } catch (error) {
          console.error(`标题Lottie动画初始化错误 (${id}):`, error)
        }
      }
    })
  }
  
  // 全局点击事件处理
  const handleGlobalClick = (event) => {
    if (globalClickLottieAnimation && event.target) {
      const container = document.getElementById('global-click-lottie')
      if (container) {
        // 设置动画位置为点击位置
        const x = event.clientX - 100 // 减去动画宽度的一半
        const y = event.clientY - 100 // 减去动画高度的一半
        
        container.style.left = `${x}px`
        container.style.top = `${y}px`
        container.style.opacity = '0.3' // 降低透明度，从1降到0.3
        
        // 播放动画
        globalClickLottieAnimation.goToAndPlay(0)
        
    
      }
    }
  }
  
  // 事件处理函数
  const onCardHover = () => {

    
    const card = document.getElementById('lottie-glass-card')
    if (card) {
      card.style.transform = 'translateY(-5px)'
      card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
    }
    
    // 清除之前的定时器
    if (hoverTimer) {
      clearTimeout(hoverTimer)
    }
    
    // 设置2秒延迟触发
    hoverTimer = setTimeout(() => {
      hoverCount.value++
      
      
      if (glassCardLottieAnimation) {
        glassCardLottieAnimation.play()
        animationStatus.value = '播放中'
        
        // 添加边框发光效果
        const card = document.getElementById('lottie-glass-card')
        if (card) {
          card.style.boxShadow = '0 25px 50px -12px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
        }
      }
    }, 2000) // 2秒延迟
  }
  
  const onCardLeave = () => {

    
    // 清除悬浮定时器
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }
    
    const card = document.getElementById('lottie-glass-card')
    if (card) {
      card.style.transform = 'translateY(0)'
      card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }
    
    if (glassCardLottieAnimation) {
      glassCardLottieAnimation.pause()
      animationStatus.value = '已暂停'
    }
  }
  
  const onCardClick = () => {
    clickCount.value++
    
    
    const card = document.getElementById('lottie-glass-card')
    if (card) {
      card.style.transform = 'translateY(-20px) scale(1.05)'
      card.style.boxShadow = '0 25px 50px -12px rgba(236, 72, 153, 0.3)'
      
      setTimeout(() => {
        card.style.transform = 'translateY(0) scale(1)'
        card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }, 300)
    }
    
    // 点击时立即播放动画
    if (glassCardLottieAnimation) {
      glassCardLottieAnimation.goToAndPlay(0)
      animationStatus.value = '点击播放中'
    }
  }
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  const playMusic = () => {

    showNotification('♪ 开始播放音乐')
  }
  
  const playAlbum = (album) => {
    
    showNotification(`🎵 正在播放: ${album.albumTitle}`)
  }
  
  const startPlaying = async (album) => {
    if (isLoading.value) return
    
    isLoading.value = true
    failedAlbumId.value = null
    
    try {
      // 模拟资源加载等待
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟20%的失败率
      if (Math.random() < 0.2) {
        throw new Error('资源加载失败')
      }
      
      currentPlayingId.value = album.id
      
    } catch (error) {
      console.error('播放失败:', error)
      failedAlbumId.value = album.id
    } finally {
      isLoading.value = false
    }
  }
  
  const stopPlaying = () => {
    currentPlayingId.value = null
    
  }
  
  const retryPlaying = (album) => {
    failedAlbumId.value = null
    startPlaying(album)
  }
  
  const playVideo = (video) => {
    
    showNotification(`📺 正在播放: ${video.title}`)
  }
  
  const playDouyinVideo = (video) => {
    
    showNotification(`🎬 正在播放: ${video.title}`)
  }
  
  const resetTimeline = () => {
    const timelineContainer = document.getElementById('timeline-3d')
    if (timelineContainer) {
      timelineContainer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      })
    }
    showNotification('🔄 时间轴已重置到初始状态')
  }
  
  const closeMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu')
    if (mobileMenu) {
      mobileMenu.classList.add('hidden')
    }
  }
  

  
  const showNotification = (message) => {
    const notification = document.createElement('div')
    notification.className = 'fixed top-20 right-6 z-50 p-4 rounded-xl shadow-lg transform translate-x-full transition-all duration-300 success-message'
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 3000)
  }
  

  
  // 设置事件监听器
  const setupEventListeners = () => {
    const menuToggle = document.getElementById('menu-toggle')
    const mobileMenu = document.getElementById('mobile-menu')
    
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden')
      })
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = link.getAttribute('href').substring(1)
        scrollToSection(targetId)
      })
    })
    
    // 添加全局点击事件监听器
    document.addEventListener('click', handleGlobalClick)
  }
  
  // 初始化滚动动画观察器
  const initScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target
          const animationType = element.dataset.animate
          const delay = parseFloat(element.dataset.delay || 0) * 1000
          
          setTimeout(() => {
            element.classList.add('animate-visible')
            
            // 特殊处理文字掉落效果
            if (animationType === 'fadeInDown' && element.classList.contains('animate-title')) {
              element.style.animation = 'titleDrop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
            }
            
            // 特殊处理卡片弹入效果
            if (element.classList.contains('animate-card')) {
              element.style.animation = `${animationType} 1.0s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`
            }
            
            // 标签弹跳效果
            if (element.classList.contains('animate-badge')) {
              element.style.animation = 'bounceIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
            }
            
            // 文字弹跳效果
            if (element.classList.contains('animate-bounce-text')) {
              element.style.animation = `${animationType} 1.0s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`
            }
            
          }, delay)
          
          observer.unobserve(element)
        }
      })
    }, observerOptions)
    
    // 观察所有带动画的元素
    const animateElements = document.querySelectorAll('[data-animate]')
    animateElements.forEach(el => {
      el.classList.add('animate-hidden')
      observer.observe(el)
    })
  }
  
  // 添加鼠标滚轮动态效果
  const addScrollDynamics = () => {
    let ticking = false
    
    const updateScrollEffect = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.5
      
      // 背景粒子动态效果
      const particlesCanvas = document.getElementById('particles-canvas')
      if (particlesCanvas) {
        particlesCanvas.style.transform = `translate3d(0, ${rate}px, 0)`
      }
      
      // 浮动元素动态效果
      const floatingElements = document.querySelectorAll('.floating-card, .music-section-lottie')
      floatingElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1
        element.style.transform = `translateY(${scrolled * speed * 0.1}px)`
      })
      
      ticking = false
    }
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffect)
        ticking = true
      }
    }
    
    window.addEventListener('scroll', requestTick)
  }
  
  // 粒子系统清理函数和接口
  let particlesCleanup = null
  let particlesInterface = null
  

  
  // 初始化应用
  const initApp = async () => {
    try {
      setupEventListeners()
      
      // 初始化粒子背景
      setTimeout(() => {
        particlesInterface = initParticlesBackground()
        particlesCleanup = particlesInterface.cleanup
      }, 100)
      

      
      // 初始化Lottie动画
      setTimeout(() => {
        initGlassCardLottie()
      }, 500)
      
      // 初始化全局点击Lottie动画
      setTimeout(() => {
        initGlobalClickLottie()
      }, 800)
      
      // 初始化标题Lottie动画
      setTimeout(() => {
        initTitleLotties()
      }, 1000)
      
      // 初始化滚动动画
      setTimeout(() => {
        initScrollAnimations()
      }, 1000)
      
      // 添加滚动动态效果
      setTimeout(() => {
        addScrollDynamics()
      }, 1200)
      

      
      // 初始化节拍点动画
      setTimeout(() => {
        const rhythmDots = document.querySelectorAll('.rhythm-dot')
        rhythmDots.forEach((dot, index) => {
          dot.style.animationDelay = `${index * 0.2}s`
        })
      }, 1200)
      
    
      
    } catch (error) {
      console.error('初始化失败:', error)
    }
  }
  
  onMounted(() => {
    // 设备检测和自动跳转
    import('@/utils/deviceDetector').then(({ isMobileDevice }) => {
      const isMobile = isMobileDevice()
      
      // 检查URL参数，如果有forcePC标记，则不自动跳转
      const urlParams = new URLSearchParams(window.location.search)
      const forcePC = urlParams.get('forcePC') === 'true'
      
      if (isMobile && !forcePC) {
        // 移动设备跳转到移动端页面，但添加来源标记
        console.log('检测到移动设备，跳转到移动端页面')
        router.replace('/mobile?fromPC=true')
        return
      } else {
        console.log('检测到PC设备或强制PC模式，继续加载PC端页面')
      }
      
      // 只有PC端才继续初始化
      initApp()
      // 初始化专辑背景
      setTimeout(() => {
        updateAlbumBackground()
      }, 100)
      
      // 启动轮播图自动播放
      setTimeout(() => {
        startCarouselAutoPlay()
      }, 2000)
    }).catch(error => {
      console.error('设备检测失败:', error)
      // 检测失败时默认继续PC端逻辑
      initApp()
      setTimeout(() => {
        updateAlbumBackground()
      }, 100)
    })
  })
  
  onUnmounted(() => {
    if (glassCardLottieAnimation) {
      glassCardLottieAnimation.destroy()
    }
    if (globalClickLottieAnimation) {
      globalClickLottieAnimation.destroy()
    }
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    if (hoverTimer) {
      clearTimeout(hoverTimer)
    }
    
    // 清理播放器定时器
    if (progressInterval) {
      clearInterval(progressInterval)
    }
    
    // 清理轮播图定时器
    if (carouselTimer) {
      clearInterval(carouselTimer)
    }
    
    // 清理粒子系统
    if (particlesInterface && particlesInterface.cleanup) {
      particlesInterface.cleanup()
    }
    
    // 移除全局点击事件监听器
    document.removeEventListener('click', handleGlobalClick)
    
    // 移除全局点击动画容器
    const container = document.getElementById('global-click-lottie')
    if (container) {
      container.remove()
    }
  })
  
  // 粒子背景系统
  const initParticlesBackground = () => {
    const canvas = document.getElementById('particles-canvas')
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles = []
    const baseParticleCount = 80 // 增加基础粒子数量，补偿移除的交互粒子
    
    // 创建基础粒子
    for (let i = 0; i < baseParticleCount; i++) {
      particles.push(createParticle())
    }
    
    // 创建粒子的函数
    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.6 + 0.3,
        hue: Math.random() * 60 + 180 // 蓝色系
      }
    }
    
    
    
          const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // 绘制基础粒子
        particles.forEach((particle) => {
          // 更新位置
          particle.x += particle.vx
          particle.y += particle.vy
          
          // 边界检测
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
          
          // 绘制粒子
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.alpha})`
          ctx.fill()
        })
        
        // 绘制连接线
        for (let i = 0; i < particles.length; i += 2) {
          const particle = particles[i]
          for (let j = i + 2; j < particles.length && j < i + 8; j += 2) {
            const otherParticle = particles[j]
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 80) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${0.1 * (1 - distance / 80)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
        
        animationId = requestAnimationFrame(animate)
      }
    
    animate()
    
    // 窗口大小变化处理
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // 重新分布粒子
      particles.forEach(particle => {
        if (particle.x > canvas.width) particle.x = canvas.width - 10
        if (particle.y > canvas.height) particle.y = canvas.height - 10
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    // 滚动监听器
    const handleScroll = () => {
      // 简化的滚动处理，如果需要的话可以在这里添加其他滚动相关逻辑
    }
    
    window.addEventListener('scroll', handleScroll)
    
    // 粒子系统初始化完成
    
    // 清理函数和接口
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
        
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
        
        // 粒子系统已清理
      },

      getStatus: () => {
        return {
          baseParticles: particles.length,
          total: particles.length
        }
      }
    }
  }
  
  // 视频播放结束事件
  const onVideoEnded = () => {
    console.log('🎬 视频播放已结束，准备开始过渡动画')
    // 可以在这里添加一些视频结束时的特效
  }
  
  // 过渡动画开始事件
  const onTransitionAnimationStarted = () => {
    console.log('✨ 过渡动画已开始')
    // 可以在这里暂停背景音乐、停止粒子系统等
    if (particlesInterface && particlesInterface.cleanup) {
      particlesInterface.cleanup()
    }
  }

  const typewriterText = ref(null)
  const artistIntro = ref(null)
  const identityShowcase = ref(null)
  const identityCarousel = ref(null)
  const scrollHint = ref(null)
  let currentIdentityIndex = 0

  // 打字效果实现
  const startTypewriter = () => {
    if (!typewriterText.value) return
    
    const text = typewriterText.value.textContent
    typewriterText.value.textContent = ''
    typewriterText.value.classList.add('typing')
    
    let i = 0
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        typewriterText.value.textContent += text.charAt(i)
        i++
      } else {
        clearInterval(typeInterval)
        // 打字效果完成后显示简介和身份标签
        setTimeout(() => {
          if (artistIntro.value) {
            artistIntro.value.classList.add('show')
          }
          setTimeout(() => {
            if (identityShowcase.value) {
              identityShowcase.value.classList.add('show')
              startIdentityCarousel()
            }
            // 最后显示滚动提示
            setTimeout(() => {
              if (scrollHint.value) {
                scrollHint.value.classList.add('show')
              }
            }, 500)
          }, 400)
        }, 400)
      }
    }, 100)
  }

  // 身份标签轮播实现
  const startIdentityCarousel = () => {
    if (!identityCarousel.value) return
    
    const identities = identityCarousel.value.querySelectorAll('.identity-text')
    identities[0].classList.add('active')
    
    setInterval(() => {
      identities[currentIdentityIndex].classList.remove('active')
      currentIdentityIndex = (currentIdentityIndex + 1) % identities.length
      identities[currentIdentityIndex].classList.add('active')
    }, 2000)
  }

  // 监听滚动事件，处理过渡效果
  const handleScroll = () => {
    const aboutSection = document.getElementById('about')
    
    if (aboutSection && scrollHint.value) {
      const aboutRect = aboutSection.getBoundingClientRect()
      // 只在about部分且未滚动时显示滚动提示
      if (aboutRect.top === 0 || (aboutRect.top > 0 && aboutRect.bottom > window.innerHeight)) {
        scrollHint.value.classList.remove('hide')
        scrollHint.value.classList.add('show')
      } else {
        scrollHint.value.classList.remove('show')
        scrollHint.value.classList.add('hide')
      }
    }
    
    // 处理页面过渡效果
    const sections = document.querySelectorAll('section')
    sections.forEach(section => {
      const rect = section.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2
      
      if (isVisible) {
        section.classList.remove('transitioning')
      } else {
        section.classList.add('transitioning')
      }
    })
  }

  // 监听滚动事件，触发打字效果
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTypewriter()
        observer.disconnect()
      }
    })
  }, { threshold: 0.5 })

  onMounted(() => {
    if (typewriterText.value) {
      observer.observe(typewriterText.value)
    }
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })


</script>
 
<style scoped>
/* 波形过渡通用样式 */
.section-wave {
  position: absolute;
  left: 0;
  width: 100%;
  height: 120px;
  pointer-events: none;
  background-repeat: no-repeat;
  background-size: cover;
}

/* 顶部波形：与上一部分深色背景衔接 */
.section-wave-top {
  top: -1px;
  transform: translateY(-100%); /* 将波形放在上一节内 */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1440v40c-120 24-240 48-360 56s-240 0-360-16S480 40 360 24 120 8 0 0z' fill='%230d1b2b'/%3E%3C/svg%3E");
}

/* 底部波形：淡入下一节浅背景 */
.section-wave-bottom {
  bottom: -1px;
  transform: rotate(180deg) translateY(-100%);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1440v40c-120 24-240 48-360 56s-240 0-360-16S480 40 360 24 120 8 0 0z' fill='%23ffffff'/%3E%3C/svg%3E");
}

/* 让音乐区去掉默认 padding 以无缝衔接 */
#music.section-padding {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
 