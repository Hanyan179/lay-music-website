<template>
    <div class="artist-journey">
      <!-- 音波粒子背景画布 -->
      <canvas id="particles-canvas"></canvas>
      
      <!-- 导航栏 -->
      <nav class="fixed top-0 w-full z-50">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="music-brand">
              LAY 张艺兴
            </div>
            <div class="hidden md:flex space-x-8">
              <a href="#home" class="nav-link">首页</a>
              <a href="#about" class="nav-link">简介</a>
              <a href="#music" class="nav-link">音乐</a>
              <a href="#videos" class="nav-link">视频</a>
              <a href="#timeline" class="nav-link">时间轴</a>
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
      <section id="home" class="min-h-screen flex items-center justify-center section-padding">
        <div class="container text-center">
          <!-- 主标题 -->
          <div class="hero-title mb-16">
            <h1 class="mb-8">
              <span data-char="张">张</span>
              <span data-char="艺">艺</span>
              <span data-char="兴">兴</span>
            </h1>
            <div class="hero-subtitle">
              <span class="word" data-word="音">音</span>
              <span class="word" data-word="乐">乐</span>
              <span class="word" data-word="·">·</span>
              <span class="word" data-word="梦">梦</span>
              <span class="word" data-word="想">想</span>
              <span class="word" data-word="·">·</span>
              <span class="word" data-word="永">永</span>
              <span class="word" data-word="恒">恒</span>
            </div>
          </div>
          
          <!-- 介绍卡片 -->
          <div class="glass-card max-w-lg mx-auto p-8 mb-12 lottie-glass-card" 
               id="lottie-glass-card"
               style="cursor: pointer; transition: all 0.3s ease; position: relative;"
               @mouseover="onCardHover" 
               @mouseout="onCardLeave" 
               @click="onCardClick">
            
            <!-- Lottie动画容器 - 放在卡片边框 -->
            <div id="lottie-container" 
                 style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; 
                        width: calc(100% + 20px); height: calc(100% + 20px); 
                        border-radius: 20px; overflow: hidden; pointer-events: none; z-index: -1;"></div>
            
            <div class="text-center">
              <h3 class="text-2xl font-bold mb-4 text-gray-900">🎵 音乐魔法</h3>
              <p class="text-gray-600 leading-relaxed mb-6">
                悬浮在卡片上2秒感受音乐的力量。动画会在您悬浮时播放，离开时暂停。
              </p>
              
              <!-- 统计信息 -->
              <div style="display: flex; justify-content: center; gap: 20px; font-size: 14px; color: #666; margin-bottom: 16px;">
                <div>💫 悬浮 <span id="hover-count">{{ hoverCount }}</span> 次</div>
                <div>✨ 点击 <span id="click-count">{{ clickCount }}</span> 次</div>
              </div>
              <div style="font-size: 12px; color: #999;">
                动画状态: <span id="animation-status">{{ animationStatus }}</span>
              </div>
              
              <!-- 节拍点装饰 -->
              <div class="rhythm-dots mt-6">
                <div class="rhythm-dot"></div>
                <div class="rhythm-dot"></div>
                <div class="rhythm-dot"></div>
                <div class="rhythm-dot"></div>
                <div class="rhythm-dot"></div>
              </div>
            </div>
          </div>
          
          <!-- CTA 按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button class="btn-primary" @click="scrollToSection('timeline')">
              <span>开始探索</span>
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </button>
            <button class="btn-secondary music-play-button" @click="playMusic()">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>播放音乐</span>
            </button>
          </div>
          
          <!-- 音频可视化器 -->
          <div class="audio-visualizer">
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
          </div>
        </div>
      </section>
  
      <!-- 个人简介 -->
      <section id="about" class="section-padding bg-gray-50 scroll-reveal">
        <div class="container">
          <div class="text-center mb-16">
            <h2 class="section-title animate-title" data-animate="fadeInDown">艺术家简介</h2>
            <p class="section-subtitle animate-subtitle" data-animate="fadeInUp" data-delay="0.2">
              多才多艺的音乐人，在创作、制作、表演等方面都有着卓越的表现
            </p>
          </div>
          
          <div class="grid grid-2 gap-16 items-center">
            <!-- 图片容器 -->
            <div class="order-2 md:order-1">
              <div class="floating-card animate-slide-left" data-animate="slideInLeft" data-delay="0.4">
                <div class="album-cover aspect-square">
                  <img :src="artistImage" alt="张艺兴" class="rounded-2xl">
                </div>
              </div>
            </div>
            
            <!-- 文字内容 -->
            <div class="order-1 md:order-2">
              <div class="glass-card p-8 animate-slide-right" data-animate="slideInRight" data-delay="0.6">
                <h3 class="text-4xl font-black mb-6 animate-text animate-bounce-text" data-animate="bounceInDown" data-delay="0.8" style="background: var(--gradient-music); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  张艺兴 LAY
                </h3>
                <div class="space-y-6 text-gray-600 leading-relaxed">
                  <p class="animate-text animate-bounce-text" data-animate="bounceInUp" data-delay="1.2">中国内地流行乐男歌手、音乐制作人、演员、舞者，男子演唱组合EXO/EXO-M中国籍成员。</p>
                  <p class="animate-text animate-bounce-text" data-animate="bounceInUp" data-delay="1.6">2012年4月8日以EXO/EXO-M成员身份正式出道。2016年10月7日发行首张个人专辑《LOSE CONTROL》。</p>
                  <p class="animate-text animate-bounce-text" data-animate="bounceInUp" data-delay="2.0">多才多艺的音乐人，在创作、制作、表演等方面都有着卓越的表现，是当代华语流行音乐的重要力量。</p>
                </div>
                
                <!-- 成就标签 -->
                <div class="flex flex-wrap gap-3 mt-8">
                  <span class="achievement-tag animate-badge" data-animate="bounceIn" data-delay="2.4">歌手</span>
                  <span class="achievement-tag animate-badge" data-animate="bounceIn" data-delay="2.6">制作人</span>
                  <span class="achievement-tag animate-badge" data-animate="bounceIn" data-delay="2.8">演员</span>
                  <span class="achievement-tag animate-badge" data-animate="bounceIn" data-delay="3.0">舞者</span>
                  <span class="achievement-tag animate-badge" data-animate="bounceIn" data-delay="3.2">创作人</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 音乐作品 -->
      <section id="music" class="section-padding relative scroll-reveal">
        <div class="container">
          <div class="text-center mb-16">
            <h2 class="section-title animate-title" data-animate="fadeInDown">音乐作品</h2>
            <p class="section-subtitle animate-subtitle" data-animate="fadeInUp" data-delay="0.2">
              探索每一首歌曲背后的故事与情感
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
          
          <div class="grid grid-3 gap-8">
            <!-- 音乐卡片 -->
            <div v-for="(album, index) in musicData" :key="album.id" 
                 class="music-card album-card animate-card" 
                 :data-animate="'fadeInUp'" 
                 :data-delay="1.2 + index * 0.3">
              <div class="album-cover aspect-square mb-6">
                <img :src="album.albumCover" :alt="album.albumTitle" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <button class="play-button" @click="playAlbum(album)">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                <div class="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                  {{ album.year }}
                </div>
              </div>
              
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-gray-900">{{ album.albumTitle }}</h3>
                <p class="text-gray-500 text-sm">{{ album.description }}</p>
                <div class="text-gray-400 text-xs">{{ album.genre }} · {{ album.year }}</div>
                
                <!-- 歌曲列表 -->
                <div class="songs-preview mt-4">
                  <div v-for="(song, index) in album.songs.slice(0, 2)" :key="index" class="flex justify-between items-center py-2 text-sm">
                    <span class="text-gray-600">{{ song.title }}</span>
                    <span class="text-gray-400">{{ song.duration }}</span>
                  </div>
                  <div v-if="album.songs.length > 2" class="text-xs text-gray-400 mt-2">
                    +{{ album.songs.length - 2 }} 更多歌曲
                  </div>
                </div>
              </div>
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
      <section id="timeline" class="section-padding min-h-screen bg-gray-50 scroll-reveal">
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
        <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div class="glass-card p-4 flex items-center space-x-4 animate-controls" data-animate="slideInUp" data-delay="0.8">
            <button id="timeline-reset" class="control-button" @click="resetTimeline" title="重置视角">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
            <span class="text-sm text-gray-500 hidden sm:block">悬停预览 | 拖拽旋转 | 滚轮缩放 | 点击体验节拍动效</span>
          </div>
        </div>
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
            <a href="#music" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">音乐</a>
            <a href="#videos" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">视频</a>
            <a href="#timeline" class="block text-lg text-gray-700 hover:text-blue-500" @click="closeMobileMenu">时间轴</a>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  // 响应式数据
  const hoverCount = ref(0)
  const clickCount = ref(0)
  const animationStatus = ref('初始化中...')
  
  // 静态资源
  const artistImage = '/artist-journey/assets/background.jpg'
  
  // Lottie 动画相关
  let glassCardLottieAnimation = null
  let globalClickLottieAnimation = null
  let particlesCanvas = null
  let animationId = null
  let hoverTimer = null
  
  // 音乐数据
  const musicData = [
    {
      id: 1,
      albumTitle: "莲 (LIT)",
      albumCover: "/artist-journey/assets/background.jpg",
      year: 2020,
      genre: "中式流行",
      description: "中华文化与现代音乐的完美融合",
      songs: [
        { title: "莲 (Lit)", duration: "04:32" },
        { title: "飞天", duration: "04:15" },
        { title: "玉", duration: "03:48" },
        { title: "祖国", duration: "04:22" }
      ]
    },
    {
      id: 2,
      albumTitle: "NAMANANA",
      albumCover: "/artist-journey/assets/background.jpg",
      year: 2018,
      genre: "流行舞曲",
      description: "充满活力的音乐探索",
      songs: [
        { title: "NAMANANA", duration: "03:45" },
        { title: "HONEY", duration: "03:28" },
        { title: "SHEEP", duration: "03:52" },
        { title: "BOOM", duration: "03:33" }
      ]
    },
    {
      id: 3,
      albumTitle: "LOSE CONTROL",
      albumCover: "/artist-journey/assets/background.jpg",
      year: 2016,
      genre: "流行",
      description: "首张个人专辑的突破之作",
      songs: [
        { title: "LOSE CONTROL", duration: "04:28" },
        { title: "MYM", duration: "03:55" },
        { title: "YESTERDAY", duration: "04:12" },
        { title: "MONODRAMA", duration: "03:39" }
      ]
    },
    {
      id: 4,
      albumTitle: "LAY 02 SHEEP",
      albumCover: "/artist-journey/assets/background.jpg",
      year: 2017,
      genre: "嘻哈",
      description: "独特风格的嘻哈音乐表达",
      songs: [
        { title: "SHEEP", duration: "03:52" },
        { title: "PEACH", duration: "03:25" },
        { title: "MASK", duration: "04:08" },
        { title: "TONIGHT", duration: "03:47" }
      ]
    },
    {
      id: 5,
      albumTitle: "PRODUCER",
      albumCover: "/artist-journey/assets/background.jpg",
      year: 2019,
      genre: "制作专辑",
      description: "展现制作人才华的音乐作品",
      songs: [
        { title: "LATE NIGHT", duration: "04:15" },
        { title: "COCKTAIL", duration: "03:33" },
        { title: "RUSH", duration: "03:58" },
        { title: "ELEVATOR", duration: "04:02" }
      ]
    },
    {
      id: 6,
      albumTitle: "EAST",
      albumCover: "/artist-journey/assets/background.jpg",
      year: 2022,
      genre: "东方音乐",
      description: "东方韵味的现代诠释",
      songs: [
        { title: "EAST", duration: "04:20" },
        { title: "SOUL", duration: "03:55" },
        { title: "KARMA", duration: "04:08" },
        { title: "DYNASTY", duration: "04:35" }
      ]
    }
  ]
  
  // 视频数据
  const videoData = [
    {
      id: 1,
      title: "莲 (Lit) MV",
      duration: "04:32",
      views: "2.1M",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "中式古典美学与现代音乐的完美融合",
      platform: "bilibili"
    },
    {
      id: 2,
      title: "飞天 MV",
      duration: "04:15",
      views: "1.8M",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "敦煌文化的音乐视觉表达",
      platform: "bilibili"
    },
    {
      id: 3,
      title: "HONEY MV",
      duration: "03:28",
      views: "5.2M",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "甜蜜律动的都市风情",
      platform: "douyin"
    },
    {
      id: 4,
      title: "NAMANANA MV",
      duration: "03:45",
      views: "12.5M",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "充满活力的舞蹈盛宴",
      platform: "bilibili"
    },
    {
      id: 5,
      title: "SHEEP MV",
      duration: "03:52",
      views: "3.7M",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "创意十足的嘻哈风格",
      platform: "douyin"
    },
    {
      id: 6,
      title: "LOSE CONTROL MV",
      duration: "04:28", 
      views: "8.9M",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "情感释放的音乐故事",
      platform: "bilibili"
    }
  ]
  
  // 抖音数据
  const douyinData = [
    {
      id: 1,
      title: "莲花舞蹈挑战",
      duration: "0:15",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "经典莲花手势舞蹈",
      likes: "128.5K",
      platform: "抖音"
    },
    {
      id: 2,
      title: "HONEY节拍挑战",
      duration: "0:30",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "跟着节拍一起摇摆",
      likes: "89.2K",
      platform: "抖音"
    },
    {
      id: 3,
      title: "飞天敦煌风",
      duration: "0:20",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "敦煌文化创意表演",
      likes: "156.8K",
      platform: "抖音"
    },
    {
      id: 4,
      title: "NAMANANA炫舞",
      duration: "0:25",
      thumbnail: "/artist-journey/assets/background.jpg",
      description: "动感十足的舞蹈表演",
      likes: "203.4K",
      platform: "抖音"
    }
  ]
  
  // 初始化Lottie动画
  const initGlassCardLottie = () => {
    const container = document.getElementById('lottie-container')
    if (container && window.lottie) {
      try {
        console.log('开始初始化玻璃卡片边框Lottie动画...')
        
        glassCardLottieAnimation = window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          path: '/lottie/Animation - 1749135116565(1).json'
        })
        
        glassCardLottieAnimation.addEventListener('data_ready', () => {
          console.log('玻璃卡片边框Lottie动画数据加载完成')
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
        console.log('初始化全局点击Lottie动画...')
        
        globalClickLottieAnimation = window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: '/lottie/Animation - 1749135273451.json'
        })
        
        globalClickLottieAnimation.addEventListener('data_ready', () => {
          console.log('全局点击Lottie动画数据加载完成')
        })
        
        globalClickLottieAnimation.addEventListener('complete', () => {
          container.style.opacity = '0'
        })
        
      } catch (error) {
        console.error('全局点击Lottie动画初始化错误:', error)
      }
    }
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
        
        console.log(`全局点击动画触发，位置: (${event.clientX}, ${event.clientY})`)
      }
    }
  }
  
  // 事件处理函数
  const onCardHover = () => {
    console.log('鼠标悬浮在玻璃卡片上')
    
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
      console.log('悬浮2秒触发，悬浮次数:', hoverCount.value)
      
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
    console.log('鼠标离开玻璃卡片')
    
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
    console.log('玻璃卡片被点击，点击次数:', clickCount.value)
    
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
    console.log('播放音乐')
    showNotification('♪ 开始播放音乐')
  }
  
  const playAlbum = (album) => {
    console.log('播放专辑:', album.albumTitle)
    showNotification(`🎵 正在播放: ${album.albumTitle}`)
  }
  
  const playVideo = (video) => {
    console.log('播放视频:', video.title)
    showNotification(`📺 正在播放: ${video.title}`)
  }
  
  const playDouyinVideo = (video) => {
    console.log('播放抖音视频:', video.title)
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
  
  // 初始化应用
  const initApp = async () => {
    try {
      setupEventListeners()
      
      // 初始化粒子背景
      setTimeout(() => {
        initParticlesBackground()
      }, 100)
      
      // 初始化Lottie动画
      setTimeout(() => {
        initGlassCardLottie()
      }, 500)
      
      // 初始化全局点击Lottie动画
      setTimeout(() => {
        initGlobalClickLottie()
      }, 800)
      
      // 初始化滚动动画
      setTimeout(() => {
        initScrollAnimations()
      }, 1000)
      
      // 添加滚动动态效果
      setTimeout(() => {
        addScrollDynamics()
      }, 1200)
      
      // 初始化音频可视化器动画
      setTimeout(() => {
        const audioVisualizerBars = document.querySelectorAll('.audio-bar')
        audioVisualizerBars.forEach((bar, index) => {
          bar.style.animationDelay = `${index * 0.1}s`
        })
      }, 1000)
      
      // 初始化节拍点动画
      setTimeout(() => {
        const rhythmDots = document.querySelectorAll('.rhythm-dot')
        rhythmDots.forEach((dot, index) => {
          dot.style.animationDelay = `${index * 0.2}s`
        })
      }, 1200)
      
      console.log('🎵 Artist Journey Vue组件加载完成')
      
    } catch (error) {
      console.error('初始化失败:', error)
    }
  }
  
  onMounted(() => {
    initApp()
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
    const particleCount = 120 // 增加粒子数量
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 180 // 蓝色系
      })
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
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
        
        // 连接线
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    // 窗口大小变化处理
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })
  }
  </script>
  
  <style>
  /* ================================
     张艺兴纯白简约音乐主题页面 CSS
     版本：2025.01.05 - 极简音乐设计
     ================================ */
  
  /* —— 全局重置与基础样式 —— */
  :root {
    /* 纯白简约色彩系统 */
    --white: #FFFFFF;
    --gray-50: #FAFAFA;
    --gray-100: #F5F5F5;
    --gray-200: #E5E5E5;
    --gray-300: #D4D4D4;
    --gray-400: #A3A3A3;
    --gray-500: #737373;
    --gray-600: #525252;
    --gray-700: #404040;
    --gray-800: #262626;
    --gray-900: #171717;
    
    /* 音乐主题色彩 */
    --music-primary: #3B82F6;    /* 蓝色 - 主旋律 */
    --music-secondary: #8B5CF6;  /* 紫色 - 和声 */
    --music-accent: #EC4899;     /* 粉色 - 强调音 */
    --music-warm: #F59E0B;       /* 橙色 - 节拍 */
    --music-cool: #10B981;       /* 绿色 - 低音 */
    
    /* 渐变定义 */
    --gradient-music: linear-gradient(135deg, var(--music-primary) 0%, var(--music-secondary) 50%, var(--music-accent) 100%);
    --gradient-subtle: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
    --gradient-card: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
    
    /* 阴影系统 */
    --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.05);
    --shadow-soft: 0 4px 6px rgba(0, 0, 0, 0.05);
    --shadow-medium: 0 10px 15px rgba(0, 0, 0, 0.08);
    --shadow-large: 0 20px 25px rgba(0, 0, 0, 0.1);
    --shadow-music: 0 8px 32px rgba(59, 130, 246, 0.15);
    
    /* 字体系统 */
    --font-primary: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-black: 900;
    
    /* 音乐节拍动画函数 */
    --ease-beat: cubic-bezier(0.25, 0.46, 0.45, 0.94);      /* 基础节拍 */
    --ease-rhythm: cubic-bezier(0.165, 0.84, 0.44, 1);      /* 律动感 */
    --ease-melody: cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* 旋律起伏 */
    --ease-harmony: cubic-bezier(0.19, 1, 0.22, 1);         /* 和谐过渡 */
    --ease-pulse: cubic-bezier(0.4, 0, 0.6, 1);            /* 脉冲效果 */
    --ease-wave: cubic-bezier(0.25, 0.1, 0.25, 1);         /* 波形效果 */
    
    /* 间距系统 */
    --space-1: 0.25rem;   /* 4px */
    --space-2: 0.5rem;    /* 8px */
    --space-3: 0.75rem;   /* 12px */
    --space-4: 1rem;      /* 16px */
    --space-5: 1.25rem;   /* 20px */
    --space-6: 1.5rem;    /* 24px */
    --space-8: 2rem;      /* 32px */
    --space-10: 2.5rem;   /* 40px */
    --space-12: 3rem;     /* 48px */
    --space-16: 4rem;     /* 64px */
    --space-20: 5rem;     /* 80px */
    --space-24: 6rem;     /* 96px */
  }
  
  .artist-journey {
    width: 100%;
    min-height: 100vh;
    font-family: var(--font-primary);
    color: var(--gray-800);
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.9) 0%, 
      rgba(248, 250, 252, 0.95) 25%,
      rgba(241, 245, 249, 0.9) 50%,
      rgba(248, 250, 252, 0.95) 75%,
      rgba(255, 255, 255, 0.9) 100%);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  /* —— 粒子背景（音波可视化） —— */
  #particles-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.4; /* 增加透明度 */
    transition: opacity 0.3s ease;
  }
  
  /* —— 导航栏样式 —— */
  nav {
    background: rgba(255, 255, 255, 0.7); /* 增强透明感 */
    backdrop-filter: blur(30px); /* 增强毛玻璃效果 */
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s var(--ease-harmony);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06); /* 增加轻微阴影 */
  }
  
  .nav-link {
    position: relative;
    padding: var(--space-3) var(--space-4);
    color: var(--gray-600);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: all 0.3s var(--ease-beat);
  }
  
  .nav-link:hover {
    color: var(--music-primary);
    transform: translateY(-1px);
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--gradient-music);
    transition: all 0.4s var(--ease-rhythm);
    transform: translateX(-50%);
    border-radius: 1px;
  }
  
  .nav-link:hover::after {
    width: 80%;
  }
  
  /* —— 音乐品牌标识 —— */
  .music-brand {
    font-size: 1.5rem;
    font-weight: var(--font-weight-bold);
    background: var(--gradient-music);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
  }
  
  .music-brand::before {
    content: '♪';
    position: absolute;
    left: -1.5rem;
    top: 0;
    color: var(--music-accent);
    animation: musicNote 2s var(--ease-melody) infinite;
  }
  
  @keyframes musicNote {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
    50% { transform: translateY(-3px) rotate(5deg); opacity: 1; }
  }
  
  /* —— 卡片系统 —— */
  .glass-card {
    background: rgba(255, 255, 255, 0.6); /* 降低不透明度 */
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    box-shadow: 
      0 12px 24px rgba(0, 0, 0, 0.08),
      0 4px 12px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: all 0.4s var(--ease-harmony);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(25px); /* 增强毛玻璃效果 */
  }
  
  .glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(99, 102, 241, 0.8), 
      rgba(139, 92, 246, 0.8), 
      rgba(59, 130, 246, 0.8));
    opacity: 0;
    transition: opacity 0.3s var(--ease-beat);
  }
  
  .glass-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.8); /* 悬浮时增加不透明度 */
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.12),
      0 8px 20px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .glass-card:hover::before {
    opacity: 1;
  }
  
  /* —— Lottie玻璃卡片特殊样式 —— */
  .lottie-glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 28px; /* 更加圆润 */
    overflow: visible; /* 允许边框动画溢出 */
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.08),
      0 8px 20px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8); /* 苹果风格内阴影 */
  }
  
  .lottie-glass-card::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      rgba(99, 102, 241, 0.6), 
      rgba(139, 92, 246, 0.6), 
      rgba(59, 130, 246, 0.6), 
      rgba(236, 72, 153, 0.6));
    border-radius: 30px; /* 适应更圆润的边框 */
    z-index: -1;
    opacity: 0;
    animation: gradientShift 3s linear infinite;
    transition: opacity 0.3s ease;
  }
  
  .lottie-glass-card:hover {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 
      0 24px 48px rgba(0, 0, 0, 0.12),
      0 12px 24px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9); /* 悬浮时的高级阴影 */
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .lottie-glass-card:hover::after {
    opacity: 0.6; /* 降低边框动画的透明度 */
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  /* —— Lottie容器样式 —— */
  #lottie-container {
    opacity: 0;
    transition: opacity 0.5s ease;
    filter: blur(1px);
    border-radius: 26px; /* 适应卡片的圆润度 */
  }
  
  .lottie-glass-card:hover #lottie-container {
    opacity: 0.8;
    filter: blur(0);
  }
  
  /* —— 按钮样式 —— */
  .btn-primary {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.95) 0%, 
      rgba(139, 92, 246, 0.95) 50%, 
      rgba(59, 130, 246, 0.95) 100%);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 14px 32px;
    font-weight: var(--font-weight-semibold);
    font-size: 15px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 
      0 8px 32px rgba(99, 102, 241, 0.2),
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: all 0.6s ease;
  }
  
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 12px 40px rgba(99, 102, 241, 0.3),
      0 8px 24px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  .btn-primary:hover::before {
    left: 100%;
  }
  
  .btn-primary:active {
    transform: translateY(-1px);
    transition: all 0.1s ease;
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: var(--gray-700);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    padding: 14px 32px;
    font-weight: var(--font-weight-semibold);
    font-size: 15px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    position: relative;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  
  .btn-secondary:hover {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.95) 0%, 
      rgba(139, 92, 246, 0.95) 50%, 
      rgba(59, 130, 246, 0.95) 100%);
    color: white;
    transform: translateY(-3px);
    box-shadow: 
      0 12px 40px rgba(99, 102, 241, 0.3),
      0 8px 24px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .btn-secondary:active {
    transform: translateY(-1px);
    transition: all 0.1s ease;
  }
  
  /* —— 播放音乐按钮特殊样式（与开始探索按钮统一） —— */
  .music-play-button {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.95) 0%, 
      rgba(139, 92, 246, 0.95) 50%, 
      rgba(59, 130, 246, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 
      0 8px 32px rgba(99, 102, 241, 0.2),
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  .music-play-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: all 0.6s ease;
  }
  
  .music-play-button:hover {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.95) 0%, 
      rgba(139, 92, 246, 0.95) 50%, 
      rgba(59, 130, 246, 0.95) 100%);
    transform: translateY(-3px);
    box-shadow: 
      0 12px 40px rgba(99, 102, 241, 0.3),
      0 8px 24px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  .music-play-button:hover::before {
    left: 100%;
  }
  
  .music-play-button svg {
    animation: musicPulse 2s var(--ease-pulse) infinite;
  }
  
  @keyframes musicPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  .music-play-button:active {
    transform: translateY(-1px);
    transition: all 0.1s ease;
  }
  
  /* —— 标题样式 —— */
  .section-title {
    font-size: 3rem;
    font-weight: var(--font-weight-black);
    text-align: center;
    margin-bottom: var(--space-4);
    background: var(--gradient-music);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    width: 60px;
    height: 3px;
    background: var(--gradient-music);
    transform: translateX(-50%);
    border-radius: 2px;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
    color: var(--gray-600);
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  /* —— Hero 区域样式 —— */
  .hero-title h1 {
    font-size: 6rem;
    font-weight: var(--font-weight-black);
    line-height: 1;
    margin: 0;
  }
  
  .hero-title h1 span {
    display: inline-block;
    animation: heroTitleFall 1s var(--ease-melody) forwards;
    opacity: 0;
    transform: translateY(-100px);
  }
  
  .hero-title h1 span:nth-child(1) { animation-delay: 0.1s; }
  .hero-title h1 span:nth-child(2) { animation-delay: 0.2s; }
  .hero-title h1 span:nth-child(3) { animation-delay: 0.3s; }
  
  @keyframes heroTitleFall {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    font-weight: var(--font-weight-medium);
    color: var(--gray-600);
    display: flex;
    justify-content: center;
    gap: var(--space-2);
  }
  
  .hero-subtitle .word {
    display: inline-block;
    animation: wordFloat 1s var(--ease-harmony) forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  
  .hero-subtitle .word:nth-child(1) { animation-delay: 0.6s; }
  .hero-subtitle .word:nth-child(2) { animation-delay: 0.7s; }
  .hero-subtitle .word:nth-child(3) { animation-delay: 0.8s; }
  .hero-subtitle .word:nth-child(4) { animation-delay: 0.9s; }
  .hero-subtitle .word:nth-child(5) { animation-delay: 1.0s; }
  .hero-subtitle .word:nth-child(6) { animation-delay: 1.1s; }
  .hero-subtitle .word:nth-child(7) { animation-delay: 1.2s; }
  .hero-subtitle .word:nth-child(8) { animation-delay: 1.3s; }
  
  @keyframes wordFloat {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* —— 音频可视化器 —— */
  .audio-visualizer {
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 6px; /* 增加间距 */
    height: 50px; /* 增加高度 */
  }
  
  .audio-bar {
    width: 5px; /* 增加宽度 */
    background: var(--gradient-music);
    border-radius: 3px;
    animation: audioWave 1.2s var(--ease-rhythm) infinite;
    transition: all 0.3s ease;
  }
  
  .audio-bar:hover {
    animation-duration: 0.3s;
    filter: brightness(1.3);
  }
  
  /* —— 卡片系统 —— */
  .music-card, .video-card {
    background: rgba(255, 255, 255, 0.5); /* 增强透明感 */
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 
      0 12px 24px rgba(0, 0, 0, 0.08),
      0 4px 12px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.3s var(--ease-beat);
    position: relative;
    padding: var(--space-6);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);
  }
  
  .music-card::before, .video-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(99, 102, 241, 0.8), 
      rgba(139, 92, 246, 0.8), 
      rgba(59, 130, 246, 0.8));
    transform: scaleX(0);
    transition: transform 0.3s var(--ease-rhythm);
  }
  
  .music-card:hover::before, .video-card:hover::before {
    transform: scaleX(1);
  }
  
  .music-card:hover, .video-card:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.8); /* 悬浮时增加不透明度 */
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.12),
      0 8px 20px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .album-cover {
    position: relative;
    overflow: hidden;
    border-radius: 16px; /* 内部元素也更圆润 */
  }
  
  .album-cover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s var(--ease-beat);
  }
  
  .album-cover:hover::after {
    opacity: 1;
  }
  
  .album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s var(--ease-beat);
  }
  
  .album-cover:hover img {
    transform: scale(1.05);
  }
  
  .play-button {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    backdrop-filter: blur(15px);
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }
  
  .play-button::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--gradient-music);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: -1;
  }
  
  .play-button:hover {
    transform: scale(1.2) rotate(360deg);
    color: white;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }
  
  .play-button:hover::after {
    opacity: 1;
  }
  
  /* —— 成就标签 —— */
  .achievement-tag {
    background: rgba(243, 244, 246, 0.8); /* 增加透明感 */
    color: var(--gray-700);
    padding: var(--space-2) var(--space-4);
    border-radius: 24px;
    font-size: 0.875rem;
    font-weight: var(--font-weight-medium);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }
  
  .achievement-tag::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s ease;
  }
  
  .achievement-tag:hover {
    background: var(--music-primary);
    color: white;
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }
  
  .achievement-tag:hover::before {
    left: 100%;
  }
  
  /* —— 浮动卡片 —— */
  .floating-card {
    animation: float 6s var(--ease-wave) infinite;
    transition: transform 0.3s ease;
  }
  
  .floating-card:hover {
    animation-play-state: paused;
    transform: translateY(-10px) scale(1.02);
  }
  
  /* —— 动态文字效果 —— */
  .animate-text {
    transition: all 0.3s ease;
  }
  
  .animate-text:hover {
    transform: translateY(-2px);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* —— 增强节拍点动画 —— */
  .rhythm-dots {
    display: flex;
    justify-content: center;
    gap: 12px; /* 增加间距 */
    margin: var(--space-8) 0;
  }
  
  .rhythm-dot {
    width: 10px; /* 增大尺寸 */
    height: 10px;
    border-radius: 50%;
    background: var(--music-primary);
    animation: rhythmPulse 1.5s var(--ease-pulse) infinite;
    transition: all 0.3s ease;
  }
  
  .rhythm-dot:hover {
    animation-duration: 0.5s;
    transform: scale(1.5);
  }
  
  /* —— 增强控制按钮透明感 —— */
  .control-button {
    background: rgba(255, 255, 255, 0.7); /* 增强透明感 */
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: var(--space-2);
    cursor: pointer;
    transition: all 0.3s var(--ease-beat);
    backdrop-filter: blur(15px);
    color: var(--gray-600);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .control-button:hover {
    background: var(--music-primary);
    color: white;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  /* —— 播放按钮增强效果 —— */
  .play-button {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    backdrop-filter: blur(15px);
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }
  
  .play-button::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--gradient-music);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: -1;
  }
  
  .play-button:hover {
    transform: scale(1.2) rotate(360deg);
    color: white;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }
  
  .play-button:hover::after {
    opacity: 1;
  }
  
  /* —— 响应式动画优化 —— */
  @media (prefers-reduced-motion: reduce) {
    .animate-hidden,
    .animate-visible,
    .floating-card {
      animation: none;
      transition: none;
    }
    
    .rhythm-dot,
    .audio-bar {
      animation: none;
    }
  }
  
  @media (max-width: 768px) {
    .animate-hidden {
      transform: translateY(20px);
    }
    
    @keyframes titleDrop {
      0% {
        opacity: 0;
        transform: translateY(-50px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
  
  /* —— 补充缺失的动画关键帧 —— */
  @keyframes audioWave {
    0%, 100% {
      transform: scaleY(1);
      opacity: 0.7;
    }
    50% {
      transform: scaleY(1.5);
      opacity: 1;
    }
  }
  
  .audio-bar:nth-child(1) { animation-delay: 0s; height: 20px; }
  .audio-bar:nth-child(2) { animation-delay: 0.1s; height: 12px; }
  .audio-bar:nth-child(3) { animation-delay: 0.2s; height: 24px; }
  .audio-bar:nth-child(4) { animation-delay: 0.3s; height: 16px; }
  .audio-bar:nth-child(5) { animation-delay: 0.4s; height: 18px; }
  
  @keyframes rhythmPulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.5); opacity: 1; }
  }
  
  .rhythm-dot:nth-child(1) { animation-delay: 0s; }
  .rhythm-dot:nth-child(2) { animation-delay: 0.2s; }
  .rhythm-dot:nth-child(3) { animation-delay: 0.4s; }
  .rhythm-dot:nth-child(4) { animation-delay: 0.6s; }
  .rhythm-dot:nth-child(5) { animation-delay: 0.8s; }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  @keyframes glow {
    0% { opacity: 0.1; }
    100% { opacity: 0.3; }
  }
  
  /* —— 动态背景增强 —— */
  .artist-journey {
    width: 100%;
    min-height: 100vh;
    font-family: var(--font-primary);
    color: var(--gray-800);
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.9) 0%, 
      rgba(248, 250, 252, 0.95) 25%,
      rgba(241, 245, 249, 0.9) 50%,
      rgba(248, 250, 252, 0.95) 75%,
      rgba(255, 255, 255, 0.9) 100%);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  /* —— 滚动动画基础样式 —— */
  .animate-hidden {
    opacity: 0;
    transform: translateY(30px);
    transition: none;
  }
  
  .animate-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  /* —— 页面滚动时的动态效果 —— */
  .scroll-reveal {
    overflow: hidden;
  }
  
  /* —— 浮动卡片完整样式 —— */
  .floating-card::before {
    content: '';
    position: absolute;
    inset: -10px;
    background: conic-gradient(from 0deg, var(--music-primary), var(--music-secondary), var(--music-accent), var(--music-primary));
    border-radius: 20px;
    opacity: 0.1;
    animation: glow 4s var(--ease-pulse) infinite alternate;
    z-index: -1;
  }
  
  /* —— 成功消息 —— */
  .success-message {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
  }
  
  /* —— 歌曲预览样式 —— */
  .songs-preview {
    border-top: 1px solid var(--gray-100);
    padding-top: var(--space-4);
  }
  
  .songs-preview .flex {
    border-bottom: 1px solid var(--gray-50);
  }
  
  .songs-preview .flex:last-child {
    border-bottom: none;
  }
  
  /* —— 抖音卡片样式 —— */
  .douyin-card {
    background: rgba(255, 255, 255, 0.5); /* 增强透明感 */
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
    transition: all 0.3s var(--ease-beat);
    padding: var(--space-4);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);
  }
  
  .douyin-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  
  .douyin-video {
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
    border-radius: 20px; /* 更圆润 */
    overflow: hidden;
    position: relative;
  }
  
  /* —— 视频缩略图样式 —— */
  .video-thumbnail {
    background: var(--gray-100);
    border-radius: 16px; /* 更圆润 */
    overflow: hidden;
  }
  
  /* —— 音乐部分Lottie动画容器 —— */
  .music-section-lottie {
    position: absolute;
    top: 50%;
    right: 2rem;
    width: 100px;
    height: 100px;
    transform: translateY(-50%);
    opacity: 0.3;
    pointer-events: none;
    animation: musicSectionFloat 4s var(--ease-wave) infinite;
  }
  
  @keyframes musicSectionFloat {
    0%, 100% { transform: translateY(-50%) scale(1); }
    50% { transform: translateY(-60%) scale(1.1); }
  }
  
  /* —— 基础布局 —— */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-6);
  }
  
  .section-padding {
    padding: var(--space-20) 0;
  }
  
  .fixed { position: fixed; }
  .hidden { display: none; }
  .z-50 { z-index: 50; }
  .z-40 { z-index: 40; }
  .z-30 { z-index: 30; }
  
  /* —— 响应式网格 —— */
  .grid {
    display: grid;
    gap: var(--space-8);
  }
  
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  
  /* —— TailwindCSS 风格类 —— */
  .bg-gray-50 { background-color: var(--gray-50); }
  .text-gray-900 { color: var(--gray-900); }
  .text-gray-800 { color: var(--gray-800); }
  .text-gray-700 { color: var(--gray-700); }
  .text-gray-600 { color: var(--gray-600); }
  .text-gray-500 { color: var(--gray-500); }
  .text-gray-400 { color: var(--gray-400); }
  
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  
  .mb-0 { margin-bottom: 0; }
  .mb-4 { margin-bottom: var(--space-4); }
  .mb-6 { margin-bottom: var(--space-6); }
  .mb-8 { margin-bottom: var(--space-8); }
  .mb-12 { margin-bottom: var(--space-12); }
  .mb-16 { margin-bottom: var(--space-16); }
  
  .mt-6 { margin-top: var(--space-6); }
  .mt-8 { margin-top: var(--space-8); }
  
  .p-4 { padding: var(--space-4); }
  .p-6 { padding: var(--space-6); }
  .p-8 { padding: var(--space-8); }
  
  .px-3 { padding-left: var(--space-3); padding-right: var(--space-3); }
  .px-6 { padding-left: var(--space-6); padding-right: var(--space-6); }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .py-4 { padding-top: var(--space-4); padding-bottom: var(--space-4); }
  
  .rounded-2xl { border-radius: 1rem; }
  .rounded-xl { border-radius: 0.75rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .rounded-full { border-radius: 9999px; }
  
  .text-xs { font-size: 0.75rem; }
  .text-sm { font-size: 0.875rem; }
  .text-lg { font-size: 1.125rem; }
  .text-xl { font-size: 1.25rem; }
  .text-2xl { font-size: 1.5rem; }
  .text-4xl { font-size: 2.25rem; }
  
  .font-medium { font-weight: var(--font-weight-medium); }
  .font-semibold { font-weight: var(--font-weight-semibold); }
  .font-bold { font-weight: var(--font-weight-bold); }
  .font-black { font-weight: var(--font-weight-black); }
  
  .w-5 { width: 1.25rem; }
  .h-5 { height: 1.25rem; }
  .w-6 { width: 1.5rem; }
  .h-6 { height: 1.5rem; }
  .w-8 { width: 2rem; }
  .h-8 { height: 2rem; }
  .w-10 { width: 2.5rem; }
  .h-10 { height: 2.5rem; }
  .w-12 { width: 3rem; }
  .h-12 { height: 3rem; }
  .w-80 { width: 20rem; }
  .w-full { width: 100%; }
  .h-96 { height: 24rem; }
  .h-screen { height: 100vh; }
  
  .min-h-screen { min-height: 100vh; }
  .max-w-lg { max-width: 32rem; }
  .max-w-3xl { max-width: 48rem; }
  .max-w-sm { max-width: 24rem; }
  
  .flex { display: flex; }
  .items-center { align-items: center; }
  .items-end { align-items: flex-end; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .flex-col { flex-direction: column; }
  .flex-wrap { flex-wrap: wrap; }
  .flex-1 { flex: 1 1 0%; }
  
  .space-x-4 > * + * { margin-left: var(--space-4); }
  .space-x-8 > * + * { margin-left: var(--space-8); }
  .space-y-2 > * + * { margin-top: 0.5rem; }
  .space-y-4 > * + * { margin-top: var(--space-4); }
  .space-y-6 > * + * { margin-top: var(--space-6); }
  .space-y-3 > * + * { margin-top: var(--space-3); }
  .gap-3 { gap: var(--space-3); }
  .gap-4 { gap: var(--space-4); }
  .gap-8 { gap: var(--space-8); }
  
  .absolute { position: absolute; }
  .relative { position: relative; }
  .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
  .top-0 { top: 0; }
  .top-3 { top: var(--space-3); }
  .right-3 { right: var(--space-3); }
  .left-3 { left: var(--space-3); }
  .bottom-3 { bottom: var(--space-3); }
  .bottom-4 { bottom: var(--space-4); }
  .left-4 { left: var(--space-4); }
  .right-4 { right: var(--space-4); }
  .bottom-8 { bottom: var(--space-8); }
  .left-1\/2 { left: 50%; }
  
  .transform { transform: translateZ(0); }
  .-translate-x-1\/2 { transform: translateX(-50%); }
  .translate-y-full { transform: translateY(100%); }
  
  .transition-all { transition: all 0.3s ease; }
  .duration-300 { transition-duration: 300ms; }
  
  .opacity-0 { opacity: 0; }
  .opacity-75 { opacity: 0.75; }
  .opacity-90 { opacity: 0.9; }
  .opacity-100 { opacity: 1; }
  
  .overflow-hidden { overflow: hidden; }
  .cursor-pointer { cursor: pointer; }
  
  .aspect-square { aspect-ratio: 1 / 1; }
  .aspect-video { aspect-ratio: 16 / 9; }
  .aspect-\[9\/16\] { aspect-ratio: 9 / 16; }
  
  .object-cover { object-fit: cover; }
  
  .leading-relaxed { line-height: 1.625; }
  
  .bg-opacity-0 { background-color: rgba(0, 0, 0, 0); }
  .bg-opacity-20 { background-color: rgba(0, 0, 0, 0.2); }
  .bg-opacity-30 { background-color: rgba(0, 0, 0, 0.3); }
  .bg-opacity-50 { background-color: rgba(0, 0, 0, 0.5); }
  .bg-opacity-75 { background-color: rgba(0, 0, 0, 0.75); }
  .bg-opacity-90 { background-color: rgba(255, 255, 255, 0.9); }
  
  .backdrop-blur-sm { backdrop-filter: blur(4px); }
  
  .shadow-xl { box-shadow: var(--shadow-large); }
  
  /* —— 响应式设计 —— */
  @media (max-width: 768px) {
    .hero-title h1 {
      font-size: 3rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .glass-card {
      margin: var(--space-4);
    }
    
    .grid-2,
    .grid-3 {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }
    
    .md\\:hidden {
      display: none;
    }
    
    .sm\\:flex-row {
      flex-direction: column;
    }
    
    .sm\\:block {
      display: none;
    }
    
    .music-section-lottie {
      display: none;
    }
  }
  
  @media (min-width: 769px) {
    .md\\:flex {
      display: flex;
    }
    
    .md\\:order-1 {
      order: 1;
    }
    
    .md\\:order-2 {
      order: 2;
    }
    
    .md\\:h-screen {
      height: 100vh;
    }
    
    .md\\:hidden {
      display: block;
    }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    .grid-3 {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .music-section-lottie {
      width: 80px;
      height: 80px;
      right: 1rem;
    }
  }
  
  @media (min-width: 640px) {
    .sm\\:flex-row {
      flex-direction: row;
    }
    
    .sm\\:block {
      display: block;
    }
  }
  
  @media (max-width: 1024px) {
    .music-section-lottie {
      opacity: 0.2;
    }
  }
  
  /* —— CSS动画备用方案 —— */
  .fallback-animation::after {
    opacity: 1 !important;
    animation: fallbackGlow 2s ease-in-out infinite alternate;
  }
  
  @keyframes fallbackGlow {
    0% { 
      opacity: 0.3;
      filter: hue-rotate(0deg) brightness(1);
    }
    100% { 
      opacity: 0.8;
      filter: hue-rotate(180deg) brightness(1.2);
    }
  }
  
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3) translateY(-50px);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.1) translateY(-10px);
    }
    80% {
      opacity: 1;
      transform: scale(0.95) translateY(2px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes bounceInDown {
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(-80px) rotateX(90deg);
    }
    30% {
      opacity: 0.5;
      transform: scale(1.1) translateY(20px) rotateX(-20deg);
    }
    65% {
      opacity: 0.9;
      transform: scale(0.95) translateY(-5px) rotateX(5deg);
    }
    85% {
      opacity: 1;
      transform: scale(1.02) translateY(2px) rotateX(-2deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0) rotateX(0);
    }
  }
  
  @keyframes bounceInUp {
    0% {
      opacity: 0;
      transform: scale(0.7) translateY(60px);
    }
    25% {
      opacity: 0.4;
      transform: scale(1.05) translateY(-15px);
    }
    60% {
      opacity: 0.8;
      transform: scale(0.98) translateY(5px);
    }
    80% {
      opacity: 0.95;
      transform: scale(1.01) translateY(-2px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes rotateInUpLeft {
    from {
      opacity: 0;
      transform: rotate3d(0, 0, 1, 45deg) translate3d(-100px, 100px, 0) scale(0.5);
      transform-origin: left bottom;
    }
    50% {
      opacity: 0.7;
      transform: rotate3d(0, 0, 1, -10deg) translate3d(-20px, 20px, 0) scale(1.1);
      transform-origin: left bottom;
    }
    80% {
      opacity: 0.9;
      transform: rotate3d(0, 0, 1, 5deg) translate3d(5px, -5px, 0) scale(0.95);
      transform-origin: left bottom;
    }
    100% {
      opacity: 1;
      transform: rotate3d(0, 0, 1, 0deg) translate3d(0, 0, 0) scale(1);
      transform-origin: left bottom;
    }
  }
  
  /* —— 文字弹跳特效 —— */
  .animate-bounce-text {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .animate-bounce-text:hover {
    transform: translateY(-3px);
    text-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    animation: textBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  @keyframes textBounce {
    0%, 100% { transform: translateY(-3px); }
    25% { transform: translateY(-8px) scale(1.02); }
    50% { transform: translateY(-2px) scale(1.01); }
    75% { transform: translateY(-5px) scale(1.01); }
  }
  </style> 