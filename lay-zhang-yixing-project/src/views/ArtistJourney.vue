<template>
    <div class="artist-journey">
      <!-- 调试模式开关按钮 -->
      <button @click="toggleDebugMode" class="debug-toggle" :title="debugMode ? '关闭调试模式' : '开启调试模式'">
        {{ debugMode ? '关闭调试' : '开启调试' }}
      </button>
      
      <!-- 调试信息面板 -->
      <div v-if="debugMode" class="debug-info-panel">
        <h4>🔧 布局调试器</h4>
        <div class="debug-item">
          <span class="debug-label">主页高度:</span>
          <span class="debug-value">75vh (3/4视口)</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">轮播图高度:</span>
          <span class="debug-value">100vh (全视口)</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">背景图片:</span>
          <span class="debug-value">45% × 96%</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">内容区域:</span>
          <span class="debug-value">max-w-4xl</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">标题尺寸:</span>
          <span class="debug-value">4xl/6xl/7xl</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">当前轮播:</span>
          <span class="debug-value">{{ currentSlideIndex + 1 }}/{{ carouselItems.length }}</span>
        </div>
      </div>
      
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
              <a href="#about" class="nav-link">简介</a>
              <router-link to="/music3d" class="nav-link">音乐</router-link>
              <a href="#videos" class="nav-link">视频</a>
              <a href="#timeline" class="nav-link">时间轴</a>
              <a href="#other" class="nav-link">风格</a>
              <button @click="switchToMobile" class="switch-mobile-btn" title="切换到移动版">
                📱
              </button>
            </div>
            <button id="menu-toggle" class="md:hidden control-button" title="菜单">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
  
      <!-- 主页 Hero Section -->
      <section id="home" class="h-[75vh] flex items-center justify-center section-padding relative">
        <!-- 左侧背景图片区域 -->
        <div class="hero-background-right"></div>
        
        <div class="container flex items-center relative z-10">
          <!-- 个人简介右侧展示，避免与背景重叠 -->
          <div class="max-w-4xl text-center px-8 py-8 ml-auto mr-8 md:mr-16 lg:mr-20 backdrop-blur-sm bg-white/10 rounded-2xl">
            <!-- 装饰线条 -->
            <div class="decorative-line mb-8 flex justify-center">
              <span class="line"></span>
              <span class="dot"></span>
              <span class="line"></span>
            </div>
            
            <!-- 主标题打字效果 - 适中尺寸 -->
            <div class="title-container mb-8 relative">
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
      <section id="about" class="relative overflow-hidden h-screen max-h-screen bg-gray-900">
        <!-- 轮播图容器 - 完整视口高度 -->
        <div class="music-carousel relative w-full h-full">
            <div class="carousel-container relative overflow-hidden h-full">
              <!-- 轮播项 -->
              <div class="carousel-slides flex transition-transform duration-500 ease-in-out h-full" :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }">
                <div v-for="(item, index) in carouselItems" :key="index" class="carousel-slide flex-shrink-0 w-full h-full">
                  <div class="relative w-full h-full">
                    <!-- 图片 -->
                    <img v-if="item.type === 'image'" 
                         :src="item.src" 
                         :alt="item.title"
                         class="w-full h-full object-contain bg-gray-900">
                    
                    <!-- 视频 -->
                    <video v-if="item.type === 'video'" 
                           :src="item.src" 
                           class="w-full h-full object-contain bg-gray-900"
                           controls
                           :poster="item.poster">
                    </video>
                    
                    <!-- 轻微覆盖层效果 -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
              
              <!-- 导航按钮 -->
              <button @click="previousSlide" 
                      class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              
              <button @click="nextSlide" 
                      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <!-- 指示器 -->
            <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              <button v-for="(item, index) in carouselItems" 
                      :key="index"
                      @click="goToSlide(index)"
                      class="w-4 h-4 rounded-full transition-all duration-300 border-2"
                      :class="index === currentSlideIndex ? 'bg-white border-white scale-125 shadow-lg' : 'bg-transparent border-white/60 hover:border-white'">
              </button>
            </div>
          </div>
      </section>
  
      <!-- 页面过渡遮罩 -->
      <div class="page-transition-mask"></div>
  
      <!-- 音乐作品 -->
      <section id="music" class="section-padding relative scroll-reveal music-album-section">

        
        <div class="container">
          <!-- 音乐装饰背景 -->
          <div class="music-decorations absolute inset-0 pointer-events-none overflow-hidden">     
            <div class="music-note absolute bottom-16 right-1/3 text-purple-300/20 text-4xl animate-bounce delay-500">♫</div>
            <div class="music-note absolute top-32 right-1/4 text-cyan-400/15 text-2xl animate-pulse delay-700">♪</div>
            
   
      
        
            <!-- 流动的音乐线条 -->
            <div class="music-lines absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
            <div class="music-lines absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/15 to-transparent animate-pulse delay-500"></div>
          </div>
          
          <div class="text-center mb-16 relative z-10">
            <h2 class="section-title animate-title" data-animate="fadeInDown">音乐作品</h2>
            <p class="section-subtitle animate-subtitle" data-animate="fadeInUp" data-delay="0.2">
              探索每一首歌曲背后的故事与情感
            </p>
            <div class="current-album-info mt-4 text-sm text-gray-600">
              当前展示：<span class="font-semibold text-blue-600">{{ currentAlbum.albumTitle }}</span> ({{ currentAlbum.year }})
            </div>
    
            
     
            
            <!-- 跳转网易云按钮 -->
            <div class="absolute top-0 right-0">
              <a href="https://music.163.com/#/search/m/?s=%E5%BC%A0%E8%89%BA%E5%85%B4&type=1" 
                 target="_blank" 
                 class="netease-btn animate-card" 
                 data-animate="fadeInRight" 
                 data-delay="0.6">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568c-.146.146-.338.22-.531.22s-.385-.074-.531-.22L12 13.061l-4.506 4.507c-.146.146-.338.22-.531.22s-.385-.074-.531-.22c-.293-.293-.293-.768 0-1.061L10.939 12 6.432 7.494c-.293-.293-.293-.768 0-1.061s.768-.293 1.061 0L12 10.939l4.507-4.506c.293-.293.768-.293 1.061 0s.293.768 0 1.061L13.061 12l4.507 4.507c.293.293.293.768 0 1.061z"/>
                </svg>
                <span>网易云音乐</span>
              </a>
            </div>
          </div>
          
          <!-- 专辑展示区域 -->
          <div class="album-showcase-container relative" 
               :style="{ '--album-bg': `url(${currentAlbum.albumBackground})` }">
            <div class="album-showcase flex items-center justify-center min-h-[600px] px-8">
              <!-- 左侧：圆形专辑封面 -->
              <div class="album-visual flex-shrink-0 mr-16">
                <div class="album-circle group relative">
                  <div class="w-80 h-80 rounded-full overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-music">
                    <img :src="currentAlbum.albumCover" 
                         :alt="currentAlbum.albumTitle" 
                         class="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110">
                    
                    <!-- 专辑封面overlay -->
                    <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <!-- 播放按钮覆盖层 -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button @click="playCurrentAlbum" 
                              class="play-overlay-btn bg-white/20 backdrop-blur-sm rounded-full p-6 transform scale-90 group-hover:scale-100 transition-all duration-300">
                        <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- 年份环形标签 -->
                  <div class="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg">
                    {{ currentAlbum.year }}
                  </div>
                </div>
              </div>
              
              <!-- 右侧：专辑信息 -->
              <div class="album-info flex-1 max-w-2xl">
                <div class="space-y-8">
                  <!-- 专辑标题 -->
                  <div class="album-header">
                    <h1 class="album-title text-5xl font-black text-gray-900 mb-4 leading-tight">
                      {{ currentAlbum.albumTitle }}
                    </h1>
                    <div class="album-meta flex items-center space-x-6 text-lg text-gray-600">
                      <span class="genre-tag px-4 py-2 bg-gray-100 rounded-full">{{ currentAlbum.genre }}</span>
                      <span class="year-tag">{{ currentAlbum.year }}</span>
                    </div>
                  </div>
                  
                  <!-- 专辑描述 -->
                  <div class="album-description">
                    <p class="text-gray-700 text-lg leading-relaxed">
                      {{ currentAlbum.description }}
                    </p>
                  </div>
                  
                  <!-- 成就/特色 -->
                  <div class="album-achievements" v-if="currentAlbum.achievements">
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">专辑成就</h3>
                    <div class="achievements-list space-y-3">
                      <div v-for="(achievement, index) in currentAlbum.achievements" 
                           :key="index" 
                           class="achievement-item flex items-center space-x-3 text-gray-600">
                        <div class="achievement-icon w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{{ achievement }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 专辑统计 -->
                  <div class="album-stats" v-if="currentAlbum.stats">
                    <div class="stats-grid grid grid-cols-3 gap-6">
                      <div class="stat-item text-center">
                        <div class="stat-number text-2xl font-bold text-blue-600">{{ currentAlbum.stats.tracks || '12' }}</div>
                        <div class="stat-label text-sm text-gray-500">首歌曲</div>
                      </div>
                      <div class="stat-item text-center">
                        <div class="stat-number text-2xl font-bold text-purple-600">{{ currentAlbum.stats.duration || '45:30' }}</div>
                        <div class="stat-label text-sm text-gray-500">总时长</div>
                      </div>
                      <div class="stat-item text-center">
                        <div class="stat-number text-2xl font-bold text-pink-600">{{ currentAlbum.stats.plays || '2.1M' }}</div>
                        <div class="stat-label text-sm text-gray-500">播放量</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 导航按钮 -->
            <div class="album-navigation absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-12">
              <!-- 上一个专辑 -->
              <button @click="previousAlbum" 
                      :disabled="currentAlbumIndex === 0"
                      class="nav-btn prev-btn group disabled:opacity-30 disabled:cursor-not-allowed">
                <div class="nav-btn-inner bg-white shadow-lg rounded-full p-4 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <svg class="w-6 h-6 text-gray-700 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </div>
              </button>
              
              <!-- 专辑指示器 -->
              <div class="album-indicators flex items-center space-x-2">
                <div v-for="(album, index) in musicData" 
                     :key="album.id"
                     @click="goToAlbum(index)"
                     class="indicator w-2 h-2 rounded-full cursor-pointer transition-all duration-300"
                     :class="index === currentAlbumIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'">
                </div>
              </div>
              
              <!-- 下一个专辑 -->
              <button @click="nextAlbum" 
                      :disabled="currentAlbumIndex === musicData.length - 1"
                      class="nav-btn next-btn group disabled:opacity-30 disabled:cursor-not-allowed">
                <div class="nav-btn-inner bg-white shadow-lg rounded-full p-4 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <svg class="w-6 h-6 text-gray-700 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
          
     
          <!-- 音乐板块Lottie动画 -->
          <div id="music-lottie" class="music-section-lottie"></div>
        </div>
      </section>
  
      <!-- 视频作品 -->
      <section id="videos" class="section-padding bg-gray-50 scroll-reveal">
        <div class="container">
          <div class="text-center mb-16">
            <h2 class="section-title animate-title" data-animate="fadeInDown">视频作品</h2>
            <p class="section-subtitle animate-subtitle" data-animate="fadeInUp" data-delay="0.2">
              用影像记录音乐的视觉表达
            </p>
          </div>
          
          <div class="grid grid-3 gap-8">
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
  
      <!-- 作者的抖音精选 -->
      <section id="douyin-highlights" class="section-padding scroll-reveal">
        <div class="container">
          <div class="text-center mb-16">
            <h2 class="section-title animate-title" data-animate="fadeInDown">作者的抖音精选</h2>
            <p class="section-subtitle animate-subtitle" data-animate="fadeInUp" data-delay="0.2">
              获取作者最新抖音需要后端API及授权，所以只能精选了
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
          
          <div class="grid grid-2 gap-8">
            <!-- 抖音视频 -->
            <div v-for="(video, index) in douyinData" :key="video.id" 
                 class="douyin-card animate-card" 
                 :data-animate="'rotateInUpLeft'" 
                 :data-delay="1.2 + index * 0.6">
              <div class="douyin-video aspect-[9/16] max-w-sm mx-auto relative">
                <img :src="video.thumbnail" :alt="video.title" class="w-full h-full object-cover rounded-xl">
                <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100 rounded-xl">
                  <button class="play-button" @click="playDouyinVideo(video)">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                
                <!-- 抖音样式的UI元素 -->
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="flex items-end justify-between">
                    <div class="flex-1">
                      <h3 class="text-white font-semibold text-sm mb-2">{{ video.title }}</h3>
                      <p class="text-white text-xs opacity-90">{{ video.description }}</p>
                      <div class="flex items-center mt-2 text-xs text-white opacity-75">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {{ video.likes }}
                      </div>
                    </div>
                    
                    <div class="flex flex-col items-center space-y-3 ml-4">
                      <div class="w-10 h-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
                        </svg>
                      </div>
                      <div class="w-10 h-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 时长显示 -->
                <div class="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {{ video.duration }}
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
            <a href="#about" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">简介</a>
            <router-link to="/music3d" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">音乐</router-link>
            <a href="#videos" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">视频</a>
            <a href="#timeline" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">时间轴</a>
          </nav>
        </div>
      </div>
      <!-- 页面底部插入按钮 -->
            
    </div>
    
  
  
</template>
  
  <script setup lang="ts">
import VideoTransition from '@/components/VideoTransition.vue'
import { douyinData, musicData, videoData } from '@/database/index.js'
import '@/styles/debug.css'
import '@/styles/index.css'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
  
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
  let carouselTimer: number | null = null
  
  // 调试模式相关状态
  const debugMode = ref(false)
  const carouselItems = ref([
    {
      type: 'image',
      src: '/img/music/NANANA.png',
      title: 'NANANA',
      description: 'LAY张艺兴全新单曲作品'
    },
    {
      type: 'image', 
      src: '/img/music/STEP.png',
      title: 'STEP',
      description: '节拍律动，舞蹈人生'
    },
    {
      type: 'image',
      src: '/img/music/LIT.png', 
      title: 'LIT',
      description: '点燃音乐激情'
    },
    {
      type: 'image',
      src: '/img/music/PRODUCER.png',
      title: 'PRODUCER',
      description: '制作人的音乐态度'
    },
    {
      type: 'video',
      src: '/img/music/WeChat_20250609212625.mp4',
      poster: '/img/music/微信图片_20250610234658.png',
      title: '音乐现场',
      description: '精彩演出现场记录'
    },
    {
      type: 'video', 
      src: '/img/music/WeChat_20250609212630.mp4',
      poster: '/img/music/微信图片_20250610234658.png',
      title: '幕后花絮',
      description: '音乐制作幕后故事'
    }
  ])
  
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
    currentSlideIndex.value = (currentSlideIndex.value + 1) % carouselItems.value.length
    resetCarouselTimer()
  }
  
  const previousSlide = () => {
    currentSlideIndex.value = currentSlideIndex.value === 0 
      ? carouselItems.value.length - 1 
      : currentSlideIndex.value - 1
    resetCarouselTimer()
  }
  
  const goToSlide = (index) => {
    currentSlideIndex.value = index
    resetCarouselTimer()
  }
  
  // 自动播放轮播图
  const startCarouselAutoPlay = () => {
    carouselTimer = setInterval(() => {
      nextSlide()
    }, 4000) // 每4秒自动切换
  }
  
  const resetCarouselTimer = () => {
    if (carouselTimer) {
      clearInterval(carouselTimer)
    }
    startCarouselAutoPlay()
  }
  
  // 调试模式切换
  const toggleDebugMode = () => {
    debugMode.value = !debugMode.value
    document.body.classList.toggle('debug-mode', debugMode.value)
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
 