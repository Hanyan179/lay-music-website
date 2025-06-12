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
              <a href="#about" class="nav-link">简介</a>
              <a href="#music" class="nav-link">音乐</a>
              <a href="#videos" class="nav-link">视频</a>
              <a href="#timeline" class="nav-link">时间轴</a>
              <a href="#kindredSpirit" class="nav-link">她们</a>
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
      <section id="home" class="min-h-screen flex items-center justify-center section-padding relative">
        <!-- 左侧背景图片区域 -->
        <div class="hero-background-right"></div>
        
        <div class="container text-center relative z-10">
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
          <!-- 3D模型展示区域 -->
          <div class="model-container max-w-4xl mx-auto p-8 mb-12 relative" ref="modelContainer">
            <div class="flex gap-8">
              <!-- 模型展示 -->
              <div class="flex-1">
                <canvas ref="modelCanvas" class="w-full h-[600px] rounded-lg"></canvas>
              </div>
              
              <!-- 参数控制面板 -->
              <div class="w-80 bg-white/80 backdrop-blur rounded-lg p-6 overflow-y-auto max-h-[400px] model-params-panel">
                <h3 class="text-lg font-bold mb-4">模型参数控制</h3>
                
                <!-- 模型变换 -->
                <div class="param-group mb-6">
                  <h4 class="font-medium mb-2">模型变换</h4>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <span class="w-20 text-sm">缩放:</span>
                      <input type="range" v-model="modelParams.scale" min="0.1" max="5" step="0.1" class="flex-1" @input="updateModelParams">
                      <span class="w-12 text-right text-sm">{{ modelParams.scale }}</span>
                    </div>
                    <div v-for="axis in ['X', 'Y', 'Z']" :key="axis" class="flex items-center">
                      <span class="w-20 text-sm">旋转{{ axis }}:</span>
                      <input type="range" v-model="modelParams['rotation'+axis]" min="-180" max="180" step="1" class="flex-1" @input="updateModelParams">
                      <span class="w-12 text-right text-sm">{{ modelParams['rotation'+axis] }}°</span>
                    </div>
                    <div v-for="axis in ['X', 'Y', 'Z']" :key="axis" class="flex items-center">
                      <span class="w-20 text-sm">位置{{ axis }}:</span>
                      <input type="range" v-model="modelParams['position'+axis]" min="-5" max="5" step="0.1" class="flex-1" @input="updateModelParams">
                      <span class="w-12 text-right text-sm">{{ modelParams['position'+axis] }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- 相机参数 -->
                <div class="param-group mb-6">
                  <h4 class="font-medium mb-2">相机参数</h4>
                  <div class="space-y-2">
                    <div v-for="axis in ['X', 'Y', 'Z']" :key="axis" class="flex items-center">
                      <span class="w-20 text-sm">相机{{ axis }}:</span>
                      <input type="range" v-model="modelParams['cameraPosition'+axis]" min="-10" max="10" step="0.1" class="flex-1" @input="updateModelParams">
                      <span class="w-12 text-right text-sm">{{ modelParams['cameraPosition'+axis] }}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="w-20 text-sm">视角:</span>
                      <input type="range" v-model="modelParams.cameraFov" min="20" max="90" step="1" class="flex-1" @input="updateModelParams">
                      <span class="w-12 text-right text-sm">{{ modelParams.cameraFov }}°</span>
                    </div>
                  </div>
                </div>
                
                <!-- 灯光参数 -->
                <div class="param-group mb-6">
                  <h4 class="font-medium mb-2">灯光参数</h4>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <span class="w-20 text-sm">环境光:</span>
                      <input type="range" v-model="modelParams.ambientIntensity" min="0" max="2" step="0.1" class="flex-1" @input="updateModelParams">
                      <span class="w-12 text-right text-sm">{{ modelParams.ambientIntensity }}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="w-20 text-sm">平行光:</span>
                      <input type="range" v-model="modelParams.directionalIntensity" min="0" max="2" step="0.1" class="flex-1" @input="updateModelParams">
                      <span class="w-12 text-right text-sm">{{ modelParams.directionalIntensity }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- 控制参数 -->
                <div class="param-group mb-6">
                  <h4 class="font-medium mb-2">控制参数</h4>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <label class="flex items-center cursor-pointer">
                        <input type="checkbox" v-model="modelParams.autoRotate" class="mr-2">
                        <span class="text-sm">自动旋转</span>
                      </label>
                    </div>
                    <div class="flex items-center" v-if="modelParams.autoRotate">
                      <span class="w-20 text-sm">旋转速度:</span>
                      <input type="range" v-model="modelParams.autoRotateSpeed" min="0.001" max="0.02" step="0.001" class="flex-1">
                      <span class="w-12 text-right text-sm">{{ modelParams.autoRotateSpeed }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- 导入导出 -->
                <div class="flex gap-4">
                  <button @click="exportParams" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                    导出参数
                  </button>
                  <label class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer text-sm">
                    导入参数
                    <input type="file" class="hidden" accept=".json" @change="e => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = () => importParams(reader.result)
                        reader.readAsText(file)
                      }
                    }">
                  </label>
                </div>
              </div>
            </div>
          </div>
          
      
          
          <!-- 音频可视化器 -->
          <div class="audio-visualizer">
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
          </div>
          
          <!-- 3D时间轴入口按钮 -->
          <div class="mt-16 flex justify-center">
            <EnterButton @click="enterTimeline" />
          </div>

        </div>
      </section>
  
      <!-- 个人简介 -->
      <section id="about" class="section-padding bg-gray-50 scroll-reveal min-h-screen flex items-center justify-center relative overflow-hidden">
        <!-- 艺术背景效果 -->
        <div class="artistic-bg absolute inset-0">
          <div class="artistic-circle"></div>
          <!-- 动态线条背景 -->
          <div class="flowing-lines">
            <div class="line-group diagonal">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
            <div class="line-group horizontal">
              <div class="line"></div>
              <div class="line"></div>
            </div>
            <div class="line-group vertical">
              <div class="line"></div>
              <div class="line"></div>
            </div>
          </div>
          <div class="grain-overlay"></div>
        </div>

        <div class="container relative z-10">
          <div class="text-center">
            <!-- 装饰线条 -->
            <div class="decorative-line mb-16">
              <span class="line"></span>
              <span class="dot"></span>
              <span class="line"></span>
            </div>
            
            <!-- 主标题打字效果 -->
            <div class="title-container mb-16 relative">
              <div class="title-bg"></div>
              <h2 class="typewriter-text text-6xl md:text-8xl font-black tracking-tighter" ref="typewriterText">
                LAY ZHANG
              </h2>
            </div>
            
            <!-- 简介文字 -->
            <div class="max-w-2xl mx-auto px-6">
              <p class="artist-intro text-xl md:text-2xl mb-12 text-gray-600 font-light tracking-wide opacity-0 transform translate-y-8" ref="artistIntro">
              努力努力再努力！！！
              </p>
              
              <!-- 身份标签轮播 -->
              <div class="identity-showcase relative opacity-0 transform translate-y-8" ref="identityShowcase">
                <div class="identity-carousel text-lg md:text-xl text-gray-500 font-light" ref="identityCarousel">
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

        <!-- 下滑提示 -->
        <div class="scroll-hint absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0" ref="scrollHint">
          <div class="scroll-text mb-4 text-sm tracking-widest text-gray-400 uppercase">探索更多</div>
          <div class="scroll-line">
            <div class="scroll-dot"></div>
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
      <!-- 页面底部插入按钮 -->
      <button
        class="mt-10 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white
               hover:scale-105 transition-transform"
        @click="router.push({ name: 'Timeline' })"
      >
        进入 3D 时间轴
      </button>
    </div>
    
  
  
</template>
  
  <script setup lang="ts">
import EnterButton from '@/components/EnterButton.vue'
import VideoTransition from '@/components/VideoTransition.vue'
import { defaultModelParams, douyinData, musicData, videoData } from '@/database/index.js'
import '@/styles/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
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

  // 进入3D时间轴首页
  const enterTimeline = () => {
    console.log('🎬 启动视频转场到 3D 时间轴')
    
    // 显示视频转场组件
    showVideoTransition.value = true
    
    // 等待下一个渲染周期，然后启动转场
    nextTick(() => {
      if (videoTransitionRef.value) {
        videoTransitionRef.value.startTransition()
      } else {
        console.warn('⚠️ 视频转场组件未找到，使用直接跳转')
        router.push('/landing-3d')
      }
    })
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
    const maxParticles = 800 // 降低粒子上限以提升性能
    const baseParticleCount = 60 // 减少基础粒子数量
    const rightAreaBonus = 30 // 减少右侧区域额外粒子数量
    let mouseParticles = [] // 鼠标交互生成的粒子
    let particlesPerClick = 15 // 减少每次点击生成的粒子数量
    
    // 创建基础粒子
    for (let i = 0; i < baseParticleCount; i++) {
      particles.push(createParticle())
    }
    
    // 在右侧区域创建更多粒子
    for (let i = 0; i < rightAreaBonus; i++) {
      particles.push(createParticle(canvas.width * 0.5, canvas.width)) // 右半部分
    }
    
    // 创建粒子的函数
    function createParticle(minX = 0, maxX = null) {
      const actualMaxX = maxX || canvas.width
      return {
        x: Math.random() * (actualMaxX - minX) + minX,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.6 + 0.3,
        hue: Math.random() * 60 + 180, // 蓝色系
        life: 1, // 生命值，用于临时粒子
        maxLife: 1,
        isTemporary: false
      }
    }
    
    // 创建临时交互粒子
    function createInteractiveParticle(x, y, vx = 0, vy = 0) {
      const particle = {
        x: x,
        y: y,
        vx: vx || (Math.random() - 0.5) * 3,
        vy: vy || (Math.random() - 0.5) * 3,
        radius: Math.random() * 1.5 + 1, // 进一步缩小粒子大小
        alpha: 0.8,
        hue: Math.random() * 60 + 180,
        life: 1,
        maxLife: 1,
        isTemporary: true,
        decay: 0, // 不自动衰减，持续存在
        isPersistent: true // 标记为持久粒子
      }
      return particle
    }
    
    // 鼠标交互状态
    let mouseX = 0
    let mouseY = 0
    let isMouseInRightArea = false
    let isMousePressed = false
    let isDragging = false
    let dragStartX = 0
    let dragStartY = 0
    let longPressTimer = null
    let isLongPress = false
    let isInHeroSection = true // 是否在hero区域
    
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      const newMouseX = event.clientX - rect.left
      const newMouseY = event.clientY - rect.top
      
              // 检查是否在右侧区域（虚线左侧就开始，实际是右侧50%）
        const wasInRightArea = isMouseInRightArea
        isMouseInRightArea = newMouseX > canvas.width * 0.5
      

      
      // 检测拖动（在右侧区域内且在hero区域）
      if (isMousePressed && !isLongPress && isMouseInRightArea && isInHeroSection) {
        const dragDistance = Math.sqrt(
          Math.pow(newMouseX - dragStartX, 2) + Math.pow(newMouseY - dragStartY, 2)
        )
        
        if (dragDistance > 5) { // 降低拖动阈值，更容易触发
          isDragging = true
          // 清除长按定时器
          if (longPressTimer) {
            clearTimeout(longPressTimer)
            longPressTimer = null
          }
        }
      }
      
      mouseX = newMouseX
      mouseY = newMouseY
    }
    
    // 鼠标按下事件
    const handleMouseDown = (event) => {
      if (event.button !== 0 || !isInHeroSection) return // 只响应左键且只在hero区域
      
      const rect = canvas.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const clickY = event.clientY - rect.top
      

      
      isMousePressed = true
      isDragging = false
      isLongPress = false
      dragStartX = clickX
      dragStartY = clickY
      
              // 设置长按定时器（500ms后视为长按）
        longPressTimer = setTimeout(() => {
          if (isMousePressed && !isDragging && clickX > canvas.width * 0.5) {
            isLongPress = true
          }
        }, 500)
    }
    
        // 鼠标抬起事件
    const handleMouseUp = (event) => {
      if (!isInHeroSection) return // 只在hero区域响应
      
      const rect = canvas.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const clickY = event.clientY - rect.top
      

      
      // 清除长按定时器
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
      
              // 只在右侧区域响应
        if (clickX > canvas.width * 0.5) {
          // 如果是普通点击（非拖动，非长按）
          if (!isDragging && !isLongPress && particles.length + mouseParticles.length + particlesPerClick <= maxParticles) {
            // 生成粒子向四周扩散（小范围）
            for (let i = 0; i < particlesPerClick; i++) {
              const angle = Math.random() * Math.PI * 2 // 360度全方向
              const speed = Math.random() * 3 + 2 // 减小扩散速度，类似lottie动画范围
              const vx = Math.cos(angle) * speed
              const vy = Math.sin(angle) * speed
              
              mouseParticles.push(createInteractiveParticle(clickX, clickY, vx, vy))
            }
            // 粒子生成成功
          } else {
            // 无法生成粒子 - 已达上限或状态不符
          }
        } else {
          // 点击位置不在右侧区域
        }
      
      isMousePressed = false
      isDragging = false
      isLongPress = false

    }
    
    // 添加事件监听器
    canvas.addEventListener('mousemove', handleMouseMove, { passive: false })
    canvas.addEventListener('mousedown', handleMouseDown, { passive: false })
    canvas.addEventListener('mouseup', handleMouseUp, { passive: false })
    canvas.addEventListener('click', (event) => {
      // 直接调用mouseUp处理
      handleMouseUp(event)
    }, { passive: false })
    
    // 防止右键菜单和事件冒泡
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
    
    // 确保canvas能够获得焦点
    canvas.setAttribute('tabindex', '0')
    canvas.style.outline = 'none'
    
    // 性能监控
    let frameCount = 0
    let lastTime = performance.now()
    let fps = 60
    
    const animate = () => {
      // 性能监控
      const currentTime = performance.now()
      frameCount++
      if (currentTime - lastTime >= 1000) {
        fps = frameCount
        frameCount = 0
        lastTime = currentTime
        
        // 如果FPS过低，自动清理部分粒子
        if (fps < 30 && mouseParticles.length > 200) {
          const removeCount = Math.floor(mouseParticles.length * 0.3)
          mouseParticles.splice(0, removeCount)
          // 性能优化: 自动清理部分粒子
        }
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 绘制基础粒子
      particles.forEach((particle, index) => {
        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy
        
        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        
        // 长按吸引效果 - 只对右侧区域的粒子且在hero区域
        if (isLongPress && isMouseInRightArea && isInHeroSection && particle.x > canvas.width * 0.5) {
          const dx = mouseX - particle.x
          const dy = mouseY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 400) { // 增大吸引范围
            // 如果距离很近，直接跟随鼠标移动
            if (distance < 50) {
              particle.vx = dx * 0.3 // 强力跟随
              particle.vy = dy * 0.3
            } else {
              const force = (400 - distance) / 400 * 0.2 // 增强吸引力
              particle.vx += (dx / distance) * force
              particle.vy += (dy / distance) * force
            }
            
            // 限制速度
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
            if (speed > 12) {
              particle.vx = (particle.vx / speed) * 12
              particle.vy = (particle.vy / speed) * 12
            }
          }
        }
        
        // 拖动冲散效果 - 只对右侧区域的粒子且在hero区域
        if (isDragging && isMouseInRightArea && isInHeroSection && particle.x > canvas.width * 0.5) {
          const dx = particle.x - mouseX
          const dy = particle.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 250) { // 增大冲散范围
            const force = (250 - distance) / 250 * 0.2 // 增强冲散力
            particle.vx += (dx / distance) * force
            particle.vy += (dy / distance) * force
            
            // 限制速度
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
            if (speed > 10) {
              particle.vx = (particle.vx / speed) * 10
              particle.vy = (particle.vy / speed) * 10
            }
          }
        }
        
        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.alpha})`
        ctx.fill()
      })
      
      // 绘制和更新鼠标交互粒子
      for (let i = mouseParticles.length - 1; i >= 0; i--) {
        const particle = mouseParticles[i]
        
        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy
        
        // 应用摩擦力
        particle.vx *= 0.995
        particle.vy *= 0.995
        
        // 边界反弹
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8
        
        // 长按吸引效果 - 只对右侧区域的交互粒子且在hero区域
        if (isLongPress && isMouseInRightArea && isInHeroSection && particle.x > canvas.width * 0.5) {
          const dx = mouseX - particle.x
          const dy = mouseY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 400) { // 增大吸引范围
            // 如果距离很近，直接跟随鼠标移动
            if (distance < 50) {
              particle.vx = dx * 0.4 // 交互粒子更强的跟随
              particle.vy = dy * 0.4
            } else {
              const force = (400 - distance) / 400 * 0.25 // 更强吸引力
              particle.vx += (dx / distance) * force
              particle.vy += (dy / distance) * force
            }
          }
        }
        
        // 拖动冲散效果 - 只对右侧区域的交互粒子且在hero区域
        if (isDragging && isMouseInRightArea && isInHeroSection && particle.x > canvas.width * 0.5) {
          const dx = particle.x - mouseX
          const dy = particle.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 250) { // 增大冲散范围
            const force = (250 - distance) / 250 * 0.25 // 增强冲散力
            particle.vx += (dx / distance) * force
            particle.vy += (dy / distance) * force
          }
        }
        
        // 限制交互粒子在右侧区域
        if (particle.x < canvas.width * 0.5) {
          particle.x = canvas.width * 0.5
          particle.vx = Math.abs(particle.vx) * 0.5
        }
        
        // 更新生命值（只有非持久粒子才衰减）
        if (!particle.isPersistent) {
          particle.life -= particle.decay
          particle.alpha = particle.life * 0.9
        }
        
        // 绘制粒子
        if (particle.life > 0) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.alpha})`
          ctx.fill()
          
          // 添加发光效果
          ctx.shadowColor = `hsla(${particle.hue}, 80%, 70%, ${particle.alpha * 0.6})`
          ctx.shadowBlur = particle.radius * 1.5
          ctx.fill()
          ctx.shadowBlur = 0
        } else if (!particle.isPersistent) {
          // 只移除非持久的死亡粒子
          mouseParticles.splice(i, 1)
        }
      }
      
      // 绘制连接线（性能优化：只渲染部分连接线）
      if (fps > 40) { // 只在性能良好时绘制连接线
        for (let i = 0; i < particles.length; i += 2) { // 每隔一个粒子才处理连接线
          const particle = particles[i]
          for (let j = i + 2; j < particles.length && j < i + 10; j += 2) { // 限制连接数量
            const otherParticle = particles[j]
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 80) { // 减小连接距离
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${0.1 * (1 - distance / 80)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
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
    
    // 滚动监听器 - 检测hero区域和清理粒子
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > lastScrollY
      
      // 检测是否在hero区域（首屏高度内）
      const heroHeight = window.innerHeight
      isInHeroSection = currentScrollY < heroHeight * 0.8 // 滚动超过80%视口高度时禁用交互
      
      // 当离开hero区域时，清理所有交互状态
      if (!isInHeroSection) {
        isMousePressed = false
        isDragging = false
        isLongPress = false
        if (longPressTimer) {
          clearTimeout(longPressTimer)
          longPressTimer = null
        }
      }
      
      if (isScrollingDown) {
        const aboutSection = document.getElementById('about')
        if (aboutSection) {
          const rect = aboutSection.getBoundingClientRect()
          // 当向下滑动且艺术家简介页面进入视口时清理粒子
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            if (mouseParticles.length > 0) {
              mouseParticles.length = 0 // 清空数组
            }
          }
        }
      }
      
      lastScrollY = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll)
    
    // 粒子系统初始化完成
    
    // 清理函数和接口
    return {
      cleanup: () => {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mouseup', handleMouseUp)
        canvas.removeEventListener('click', handleMouseUp)
        canvas.removeEventListener('contextmenu', (e) => e.preventDefault())
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
        
        // 清理定时器
        if (longPressTimer) {
          clearTimeout(longPressTimer)
          longPressTimer = null
        }
        
        // 粒子系统已清理
      },

      getStatus: () => {
        return {
          baseParticles: particles.length,
          interactiveParticles: mouseParticles.length,
          total: particles.length + mouseParticles.length,
          maxParticles: maxParticles
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

  const modelContainer = ref(null)
const modelCanvas = ref(null)
let scene, camera, renderer, controls, model
let animationFrameId = null

// 模型参数从外部文件导入
const modelParams = ref(defaultModelParams)

// 更新模型参数
const updateModelParams = () => {
  if (!model) return
  
  // 更新模型变换
  model.scale.set(modelParams.value.scale, modelParams.value.scale, modelParams.value.scale)
  model.rotation.set(
    modelParams.value.rotationX * Math.PI / 180,
    modelParams.value.rotationY * Math.PI / 180,
    modelParams.value.rotationZ * Math.PI / 180
  )
  model.position.set(modelParams.value.positionX, modelParams.value.positionY, modelParams.value.positionZ)
  
  // 更新相机
  camera.position.set(
    modelParams.value.cameraPositionX,
    modelParams.value.cameraPositionY,
    modelParams.value.cameraPositionZ
  )
  camera.fov = modelParams.value.cameraFov
  camera.updateProjectionMatrix()
  
  // 更新灯光
  if (scene.children.length > 0) {
    const ambientLight = scene.children.find(child => child instanceof THREE.AmbientLight)
    const directionalLight = scene.children.find(child => child instanceof THREE.DirectionalLight)
    
    if (ambientLight) {
      ambientLight.intensity = modelParams.value.ambientIntensity
    }
    if (directionalLight) {
      directionalLight.intensity = modelParams.value.directionalIntensity
      directionalLight.position.set(
        modelParams.value.directionalPositionX,
        modelParams.value.directionalPositionY,
        modelParams.value.directionalPositionZ
      )
    }
  }
  
  // 更新控制器
  if (controls) {
    controls.enableDamping = modelParams.value.enableDamping
    controls.dampingFactor = modelParams.value.dampingFactor
  }
}

// 导出参数为JSON
const exportParams = () => {
  const json = JSON.stringify(modelParams.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'model-params.json'
  a.click()
  URL.revokeObjectURL(url)
}

// 导入参数
const importParams = (json) => {
  try {
    const params = JSON.parse(json)
    modelParams.value = { ...modelParams.value, ...params }
    updateModelParams()
  } catch (error) {
    console.error('导入参数失败:', error)
  }
}

  // 初始化3D场景
  const initScene = () => {
    scene = new THREE.Scene()
    
    // 设置相机
    camera = new THREE.PerspectiveCamera(
      45,
      modelCanvas.value.clientWidth / modelCanvas.value.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 5)

      // 设置渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: modelCanvas.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(modelCanvas.value.clientWidth, modelCanvas.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.setClearColor(0x000000, 0) // 设置透明背景
    
    // 添加环境光和平行光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // 添加轨道控制器
    controls = new OrbitControls(camera, modelCanvas.value)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    
      // 加载模型
  const loader = new GLTFLoader()
  loader.load(
    './models/model.glb',
      (gltf) => {
        model = gltf.scene
        scene.add(model)
        
              // 应用初始参数
      updateModelParams()
      
      // 动画循环
      const animate = () => {
        if (model && modelParams.value.autoRotate) {
          model.rotation.y += modelParams.value.autoRotateSpeed
          modelParams.value.rotationY = (model.rotation.y * 180 / Math.PI) % 360
        }
        controls.update()
        renderer.render(scene, camera)
        animationFrameId = requestAnimationFrame(animate)
      }
      animate()
      },
      (progress) => {
        console.log('Loading model...', (progress.loaded / progress.total * 100) + '%')
      },
      (error) => {
        console.error('Error loading model:', error)
      }
    )
  }

  // 处理窗口大小变化
  const handleResize = () => {
    if (camera && renderer && modelCanvas.value) {
      camera.aspect = modelCanvas.value.clientWidth / modelCanvas.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(modelCanvas.value.clientWidth, modelCanvas.value.clientHeight)
    }
  }

  onMounted(() => {
    initScene()
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  if (controls) {
    controls.dispose()
  }
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    while(scene.children.length > 0) { 
      scene.remove(scene.children[0])
    }
  }
})
</script>
 