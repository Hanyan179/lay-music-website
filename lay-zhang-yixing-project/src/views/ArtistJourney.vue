<template>
    <div class="artist-journey">
      <!-- 音波粒子背景画布 -->
      <canvas id="particles-canvas"></canvas>
      
      <!-- 海浪波纹背景 -->
      <div class="wave-background">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
        <div class="wave wave4"></div>
        <!-- 装饰性气泡 -->
        <div class="bubble-container">
          <div class="bubble bubble1"></div>
          <div class="bubble bubble2"></div>
          <div class="bubble bubble3"></div>
          <div class="bubble bubble4"></div>
          <div class="bubble bubble5"></div>
          <div class="bubble bubble6"></div>
        </div>
      </div>
      
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
              <a href="#other" class="nav-link">其他废案</a>
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
        <!-- 高设计感鼠标交互背景 -->
        <div class="water-ripple-container" ref="waterRippleContainer">
          <canvas ref="waterCanvas" class="water-canvas"></canvas>
        </div>
        
        <div class="container">
          <!-- 音乐装饰背景 -->
          <div class="music-decorations absolute inset-0 pointer-events-none overflow-hidden">
            <!-- 音符装饰 -->
            <div class="music-note absolute top-8 left-16 text-blue-400/20 text-4xl animate-pulse">♪</div>
            <div class="music-note absolute top-20 right-20 text-purple-400/15 text-6xl animate-bounce slow">♫</div>
            <div class="music-note absolute bottom-32 left-1/4 text-pink-400/10 text-5xl animate-ping slow">♬</div>
            <div class="music-note absolute top-16 left-1/3 text-blue-300/25 text-3xl animate-pulse delay-300">♪</div>
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
    
    <!-- 视频转场组件 -->
    <VideoTransition
      v-if="showVideoTransition"
      ref="videoTransitionRef"
      video-src="/timeline.mp4"
      target-route="/landing-3d"
      :auto-start="false"
      :transition-duration="2500"
      @started="onTransitionStarted"
      @ended="onTransitionEnded"
      @error="onTransitionError"
      @video-ended="onVideoEnded"
      @transition-started="onTransitionAnimationStarted"
    />
  </template>
  
  <script setup lang="ts">
import EnterButton from '@/components/EnterButton.vue'
import VideoTransition from '@/components/VideoTransition.vue'
import { onMounted, onUnmounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  
  const router = useRouter()
  
  // 响应式数据
  const hoverCount = ref(0)
  const clickCount = ref(0)
  const animationStatus = ref('初始化中...')
  const currentPlayingId = ref(null)
  const isLoading = ref(false)
  const failedAlbumId = ref(null)
  
  // 高设计感鼠标交互相关
  const waterRippleContainer = ref<HTMLElement>()
  const waterCanvas = ref<HTMLCanvasElement>()
  
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
  
  // 音乐数据 - 按年份从最新到最久排序
  const musicData = [
    {
      id: 1,
      albumTitle: "STEP",
      albumCover: "/img/music/STEP.png",
      albumBackground: "/img/music/step-ba.png",
      year: 2024,
      genre: "流行、电子、Hip-Hop",
      description: "张艺兴最新专辑《STEP》，标志着他音乐生涯的全新阶段。专辑融合了现代电子音乐和传统东方元素，展现了艺术家在音乐探索道路上的又一次飞跃。每一首歌都是一个脚步，踏向更广阔的音乐世界。",
      neteaseId: "79177648",
      achievements: [
        "华语流行音乐榜首位专辑",
        "QQ音乐巅峰榜连续12周第一",
        "全球华语歌曲排行榜年度最佳制作"
      ],
      stats: {
        tracks: 12,
        duration: "42:16",
        plays: "3.5M"
      }
    },
    {
      id: 2,
      albumTitle: "PRODUCER",
      albumCover: "/img/music/PRODUCER.png",
      albumBackground: "/img/music/PRODUCER-ba.png",
      year: 2021,
      genre: "流行、电子、R&B",
      description: "收录张艺兴在《我是唱作人2》节目中的创作作品，展现他作为制作人的音乐才华。专辑融合了多种音乐风格，体现了张艺兴在创作和制作方面的成熟与突破。",
      neteaseId: "79177647",
      achievements: [
        "《我是唱作人2》总决赛冠军专辑",
        "网易云音乐年度华语专辑TOP10",
        "获得金曲奖最佳制作人提名"
      ],
      stats: {
        tracks: 10,
        duration: "38:24",
        plays: "1.8M"
      }
    },
    {
      id: 3,
      albumTitle: "莲 (LIT)",
      albumCover: "/img/music/LIT.png",
      albumBackground: "/img/music/LIT-ba.png",
      year: 2020,
      genre: "中式流行",
      description: "中华文化与现代音乐的完美融合，采用传统中国乐器与现代电子音乐的结合，展现了张艺兴对中华文化传承与创新的深刻理解。",
      neteaseId: "90225022",
      achievements: [
        "Billboard中国榜单第一名",
        "亚洲音乐大奖最佳华语专辑",
        "全球华语歌曲排行榜年度专辑"
      ],
      stats: {
        tracks: 12,
        duration: "45:12",
        plays: "3.2M"
      }
    },
    {
      id: 3,
      albumTitle: "HONEY",
      albumCover: "https://img0.baidu.com/it/u=4ec2d5628535e5dde7110f4ca68bb0ef&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
      year: 2019,
      genre: "流行、电子、R&B",
      description: "继续探索并巩固了张艺兴在音乐创作和制作方面的地位。专辑展现了更加成熟的音乐风格和情感表达，每首歌都充满了甜蜜与温暖。",
      neteaseId: "79177647",
      achievements: [
        "QQ音乐年度热门专辑",
        "酷狗音乐最受欢迎华语专辑",
        "微博音乐盛典年度专辑"
      ],
      stats: {
        tracks: 8,
        duration: "32:18",
        plays: "2.5M"
      }
    },
    {
      id: 4,
      albumTitle: "梦不落雨林 / NAMANANA",
      albumCover: "/img/music/NANANA.png",
      albumBackground: "/img/music/NANANA-ba.png",
      year: 2018,
      genre: "流行、R&B、电子",
      description: "张艺兴首次以个人身份在全球音乐市场发力，展示多元化的音乐风格。专辑充满了对梦想的追求和对音乐的热爱，每一首歌都讲述着不同的故事。",
      neteaseId: "2104506856",
      achievements: [
        "iTunes美国榜Hip-Hop/Rap榜第21名",
        "全球27个国家iTunes榜单前100",
        "YouTube MV播放量超5000万"
      ],
      stats: {
        tracks: 9,
        duration: "35:45",
        plays: "4.1M"
      }
    },
    {
      id: 5,
      albumTitle: "SHEEP",
      albumCover: "/img/music/LIT.png", // 临时使用LIT封面
      albumBackground: "/img/music/LIT-ba.png", // 临时使用LIT背景
      year: 2017,
      genre: "流行、电子、R&B",
      description: "张艺兴的第二张个人专辑，延续了他在音乐创作和制作方面的探索。专辑名寓意着坚持自我、不随波逐流的音乐态度。",
      neteaseId: "38796219",
      achievements: [
        "中国音乐排行榜年度专辑",
        "东方风云榜最佳新人专辑",
        "全球华语音乐榜中榜最受欢迎专辑"
      ],
      stats: {
        tracks: 7,
        duration: "28:33",
        plays: "1.9M"
      }
    },
    {
      id: 6,
      albumTitle: "LOSE CONTROL",
      albumCover: "/img/music/PRODUCER.png", // 临时使用PRODUCER封面
      albumBackground: "/img/music/PRODUCER-ba.png", // 临时使用PRODUCER背景
      year: 2016,
      genre: "R&B、电子流行",
      description: "张艺兴的首张个人专辑，标志着他从EXO成员转型为独立音乐人的第一步。专辑展现了他在音乐创作方面的天赋和对音乐的纯粹热爱。",
      neteaseId: "38358219",
      achievements: [
        "韩国Gaon专辑榜第2名",
        "中国内地首张破10万销量个人专辑",
        "MAMA亚洲音乐大奖最佳男歌手提名"
      ],
      stats: {
        tracks: 6,
        duration: "24:17",
        plays: "3.8M"
      }
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
  
  // 高设计感鼠标交互系统 - 综合粒子、磁性、流体效果
  const initAdvancedMouseInteraction = () => {
    if (!waterCanvas.value || !waterRippleContainer.value) return
    
    const canvas = waterCanvas.value
    const container = waterRippleContainer.value
    const ctx = canvas.getContext('2d')!
    
    // 设置画布尺寸 - 高清渲染
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // 鼠标状态追踪
    let mouseX = 0
    let mouseY = 0
    let isMousePressed = false
    let mouseVelocityX = 0
    let mouseVelocityY = 0
    let lastMouseX = 0
    let lastMouseY = 0
    
    // 粒子系统数据结构
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      opacity: number
      life: number
      maxLife: number
      hue: number
      type: 'trail' | 'magnetic' | 'explosion' | 'flow'
      targetX?: number
      targetY?: number
      magnetStrength?: number
    }
    
    interface FlowField {
      x: number
      y: number
      angle: number
      intensity: number
    }
    
    const particles: Particle[] = []
    const flowField: FlowField[] = []
    const maxParticles = 200
    
    // 初始化流场系统
    const initFlowField = () => {
      const gridSize = 30
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          flowField.push({
            x,
            y,
            angle: Math.random() * Math.PI * 2,
            intensity: Math.random() * 0.5 + 0.2
          })
        }
      }
    }
    
    initFlowField()
    
    // 智能粒子创建系统
    const createParticle = (x: number, y: number, type: Particle['type'], count = 1) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) {
          particles.shift()
        }
        
        let particle: Particle
        
        switch (type) {
          case 'trail':
            // 拖尾粒子 - 快速移动时
            particle = {
              x: x + (Math.random() - 0.5) * 20,
              y: y + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              radius: Math.random() * 4 + 2,
              opacity: 0.8,
              life: 1,
              maxLife: 1,
              hue: 220 + Math.random() * 60, // 蓝紫色系
              type: 'trail'
            }
            break
            
          case 'magnetic':
            // 磁性粒子 - 静止悬停时
            particle = {
              x: x + (Math.random() - 0.5) * 100,
              y: y + (Math.random() - 0.5) * 100,
              vx: 0,
              vy: 0,
              radius: Math.random() * 3 + 1,
              opacity: 0.6,
              life: 1,
              maxLife: 1,
              hue: 280 + Math.random() * 40, // 紫色系
              type: 'magnetic',
              targetX: x,
              targetY: y,
              magnetStrength: Math.random() * 0.1 + 0.05
            }
            break
            
          case 'explosion':
            // 爆炸粒子 - 点击时
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5
            const speed = Math.random() * 8 + 4
            particle = {
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: Math.random() * 6 + 3,
              opacity: 1,
              life: 1,
              maxLife: 1,
              hue: 200 + Math.random() * 80, // 蓝绿色系
              type: 'explosion'
            }
            break
            
          case 'flow':
            // 流动粒子 - 慢速移动时
            particle = {
              x: x + (Math.random() - 0.5) * 50,
              y: y + (Math.random() - 0.5) * 50,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              radius: Math.random() * 2 + 0.5,
              opacity: 0.4,
              life: 1,
              maxLife: 1,
              hue: 180 + Math.random() * 120, // 彩虹色系
              type: 'flow'
            }
            break
        }
        
        particles.push(particle)
      }
    }
    
    // 动态流场更新
    const updateFlowField = () => {
      const time = Date.now() * 0.001
      flowField.forEach(field => {
        const distToMouse = Math.sqrt(
          Math.pow(field.x - mouseX, 2) + Math.pow(field.y - mouseY, 2)
        )
        
        if (distToMouse < 150) {
          // 鼠标影响范围内
          const influence = (150 - distToMouse) / 150
          field.angle = Math.atan2(mouseY - field.y, mouseX - field.x) + 
                       Math.sin(time * 2) * influence * 0.5
          field.intensity = 0.8 * influence + 0.2
        } else {
          // 自然波动
          field.angle += Math.sin(time + field.x * 0.01) * 0.02
          field.intensity = 0.3
        }
      })
    }
    
    // 获取流场影响力
    const getFlowInfluence = (x: number, y: number) => {
      const gridSize = 30
      const gridX = Math.floor(x / gridSize) * gridSize
      const gridY = Math.floor(y / gridSize) * gridSize
      
      const field = flowField.find(f => f.x === gridX && f.y === gridY)
      if (field) {
        return {
          vx: Math.cos(field.angle) * field.intensity,
          vy: Math.sin(field.angle) * field.intensity
        }
      }
      return { vx: 0, vy: 0 }
    }
    
    // 智能鼠标事件处理
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const newMouseX = event.clientX - rect.left
      const newMouseY = event.clientY - rect.top
      
      // 计算鼠标速度
      mouseVelocityX = newMouseX - lastMouseX
      mouseVelocityY = newMouseY - lastMouseY
      lastMouseX = mouseX
      lastMouseY = mouseY
      
      mouseX = newMouseX
      mouseY = newMouseY
      
      // 根据鼠标速度智能创建粒子
      const velocity = Math.sqrt(mouseVelocityX ** 2 + mouseVelocityY ** 2)
      
      if (velocity > 15) {
        // 快速移动：拖尾效果
        createParticle(mouseX, mouseY, 'trail', Math.min(Math.floor(velocity / 10), 5))
      } else if (velocity > 5) {
        // 慢速移动：流动效果
        createParticle(mouseX, mouseY, 'flow', 2)
      } else {
        // 静止悬停：磁性效果
        createParticle(mouseX, mouseY, 'magnetic', 1)
      }
    }
    
    const handleMouseDown = () => {
      isMousePressed = true
      // 点击爆炸效果
      createParticle(mouseX, mouseY, 'explosion', 12)
    }
    
    const handleMouseUp = () => {
      isMousePressed = false
    }
    
    const handleMouseLeave = () => {
      isMousePressed = false
    }
    
    // 事件监听器
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mouseleave', handleMouseLeave)
    
    // 60fps 渲染引擎
    const animate = () => {
      // 微拖尾效果
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 更新流场
      updateFlowField()
      
      // 粒子系统更新与渲染
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        
        // 基于类型的物理行为
        switch (particle.type) {
          case 'trail':
            particle.vx *= 0.98
            particle.vy *= 0.98
            particle.life -= 0.02
            break
            
          case 'magnetic':
            if (particle.targetX !== undefined && particle.targetY !== undefined) {
              const dx = mouseX - particle.x
              const dy = mouseY - particle.y
              const distance = Math.sqrt(dx ** 2 + dy ** 2)
              
              if (distance > 5) {
                particle.vx += (dx / distance) * (particle.magnetStrength || 0.05)
                particle.vy += (dy / distance) * (particle.magnetStrength || 0.05)
              }
              
              // 速度限制
              const maxSpeed = 8
              const currentSpeed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2)
              if (currentSpeed > maxSpeed) {
                particle.vx = (particle.vx / currentSpeed) * maxSpeed
                particle.vy = (particle.vy / currentSpeed) * maxSpeed
              }
            }
            particle.life -= 0.01
            break
            
          case 'explosion':
            particle.vy += 0.1 // 重力
            particle.vx *= 0.995
            particle.vy *= 0.995
            particle.life -= 0.015
            break
            
          case 'flow':
            const flowInfluence = getFlowInfluence(particle.x, particle.y)
            particle.vx += flowInfluence.vx * 0.5
            particle.vy += flowInfluence.vy * 0.5
            particle.vx *= 0.99
            particle.vy *= 0.99
            particle.life -= 0.008
            break
        }
        
        // 位置更新
        particle.x += particle.vx
        particle.y += particle.vy
        
        // 透明度更新
        particle.opacity = particle.life * 0.8
        
        // 生命周期管理
        if (particle.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        
        // 高质量粒子渲染
        ctx.save()
        ctx.globalAlpha = particle.opacity
        
        // HSL色彩渐变
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        )
        
        const hsl = `hsl(${particle.hue}, 70%, 60%)`
        const hslTransparent = `hsl(${particle.hue}, 70%, 60%, 0)`
        
        gradient.addColorStop(0, hsl)
        gradient.addColorStop(0.5, hsl)
        gradient.addColorStop(1, hslTransparent)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // 发光效果
        if (particle.type === 'explosion' || particle.type === 'magnetic') {
          ctx.shadowColor = hsl
          ctx.shadowBlur = particle.radius * 2
          ctx.globalAlpha = particle.opacity * 0.5
          ctx.fill()
          ctx.shadowBlur = 0
        }
        
        ctx.restore()
      }
      
      // 鼠标光环系统
      if (mouseX > 0 && mouseY > 0) {
        const time = Date.now() * 0.005
        
        ctx.save()
        ctx.globalAlpha = 0.3
        
        // 3层呼吸光环
        for (let i = 0; i < 3; i++) {
          const radius = 20 + i * 15 + Math.sin(time + i) * 5
          const hue = 220 + Math.sin(time * 0.5 + i) * 40
          
          const gradient = ctx.createRadialGradient(
            mouseX, mouseY, radius * 0.5,
            mouseX, mouseY, radius
          )
          
          gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0)`)
          gradient.addColorStop(0.7, `hsla(${hue}, 70%, 60%, 0.2)`)
          gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2)
          ctx.stroke()
        }
        
        ctx.restore()
      }
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    // 清理函数
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', resizeCanvas)
      particles.length = 0
      flowField.length = 0
    }
  }
  
  // 初始化应用
  const initApp = async () => {
    try {
      setupEventListeners()
      
      // 初始化粒子背景
      setTimeout(() => {
        particlesInterface = initParticlesBackground()
        particlesCleanup = particlesInterface.cleanup
      }, 100)
      
      // 初始化高设计感鼠标交互
      setTimeout(() => {
        initAdvancedMouseInteraction()
      }, 200)
      
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
    initApp()
    // 初始化专辑背景
    setTimeout(() => {
      updateAlbumBackground()
    }, 100)
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

// 模型参数
const modelParams = ref({
  // 模型参数
  scale: 3.2,
  rotationX: -2,
  rotationY: 0,
  rotationZ: 0,
  positionX: 0.1,
  positionY: 0,
  positionZ: 0,
  
  // 相机参数
  cameraPositionX: 0,
  cameraPositionY: 0,
  cameraPositionZ: 5,
  cameraFov: 45,
  
  // 灯光参数
  ambientIntensity: 0.5,
  directionalIntensity: 1.0,
  directionalPositionX: 5,
  directionalPositionY: 5,
  directionalPositionZ: 5,
  
  // 控制参数
  autoRotate: false,
  autoRotateSpeed: 0.005,
  enableDamping: true,
  dampingFactor: 0.05
})

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
  
  /* —— Hero左侧背景图片区域 —— */
  .hero-background-right {
    position: absolute;
    top: 5%;
    left: 2%;
    width: 35%;
    height: 90%;
    background-image: url('/artist-journey/assets/background.jpg');
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 20px;
    z-index: 95;
    opacity: 0.8;
  }
  
  /* —— 粒子背景（音波可视化） —— */
  #particles-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10; /* 更高z-index确保可以接收事件 */
    pointer-events: auto; /* 允许交互 */
    opacity: 0.6; /* 提高可见度 */
    transition: opacity 0.3s ease;
    cursor: default; /* 默认光标 */
  }
  

  

  
  /* —— 海浪波纹背景 —— */
  .wave-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
  }
  
  .wave {
    position: absolute;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, 
      rgba(99, 102, 241, 0.03) 0%, 
      rgba(139, 92, 246, 0.05) 25%, 
      rgba(59, 130, 246, 0.03) 50%, 
      rgba(236, 72, 153, 0.04) 75%, 
      rgba(99, 102, 241, 0.03) 100%);
    border-radius: 45%;
    animation: waveFloat 20s ease-in-out infinite;
    transform-origin: center center;
  }
  
  .wave1 {
    top: -50%;
    left: -50%;
    animation-delay: 0s;
    animation-duration: 18s;
  }
  
  .wave2 {
    top: -60%;
    right: -50%;
    animation-delay: -5s;
    animation-duration: 22s;
    animation-direction: reverse;
  }
  
  .wave3 {
    bottom: -50%;
    left: -40%;
    animation-delay: -10s;
    animation-duration: 25s;
  }
  
  .wave4 {
    bottom: -60%;
    right: -60%;
    animation-delay: -15s;
    animation-duration: 20s;
    animation-direction: reverse;
  }
  
  @keyframes waveFloat {
    0%, 100% {
      transform: rotate(0deg) scale(1) translate(0, 0);
      opacity: 0.3;
    }
    25% {
      transform: rotate(90deg) scale(1.1) translate(20px, -10px);
      opacity: 0.5;
    }
    50% {
      transform: rotate(180deg) scale(0.9) translate(-10px, 20px);
      opacity: 0.4;
    }
    75% {
      transform: rotate(270deg) scale(1.05) translate(15px, 15px);
      opacity: 0.6;
    }
  }
  
  /* —— 装饰性气泡 —— */
  .bubble-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  
  .bubble {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 20%, 
      rgba(99, 102, 241, 0.1), 
      rgba(139, 92, 246, 0.05), 
      transparent);
    border: 1px solid rgba(99, 102, 241, 0.08);
    animation: bubbleFloat 25s linear infinite;
  }
  
  .bubble1 {
    width: 60px;
    height: 60px;
    left: 10%;
    animation-delay: -5s;
    animation-duration: 30s;
  }
  
  .bubble2 {
    width: 40px;
    height: 40px;
    left: 20%;
    animation-delay: -10s;
    animation-duration: 35s;
  }
  
  .bubble3 {
    width: 80px;
    height: 80px;
    left: 70%;
    animation-delay: -15s;
    animation-duration: 25s;
  }
  
  .bubble4 {
    width: 30px;
    height: 30px;
    left: 85%;
    animation-delay: -20s;
    animation-duration: 40s;
  }
  
  .bubble5 {
    width: 50px;
    height: 50px;
    left: 45%;
    animation-delay: -25s;
    animation-duration: 28s;
  }
  
  .bubble6 {
    width: 35px;
    height: 35px;
    left: 60%;
    animation-delay: -30s;
    animation-duration: 32s;
  }
  
  @keyframes bubbleFloat {
    0% {
      transform: translateY(100vh) rotate(0deg) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 0.4;
    }
    50% {
      transform: translateY(50vh) rotate(180deg) scale(1.1);
      opacity: 0.6;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-10vh) rotate(360deg) scale(0.8);
      opacity: 0;
    }
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
    padding: 0.75rem 1rem;
    color: rgba(31, 41, 55, 0.8);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .nav-link:hover {
    color: rgba(31, 41, 55, 1);
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
    background: rgba(255, 255, 255, 0.6); /* 增强透明感 */
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 
      0 8px 20px rgba(0, 0, 0, 0.06),
      0 2px 8px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.3s var(--ease-beat);
    position: relative;
    padding: var(--space-4);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);
    min-height: 120px; /* 设置最小高度保持一致性 */
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
    position: relative;
    overflow-x: hidden; /* 防止水平滚动 */
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
  
  /* —— 播放专辑按钮 —— */
  .play-album-btn {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.1) 0%, 
      rgba(139, 92, 246, 0.1) 50%, 
      rgba(59, 130, 246, 0.1) 100%);
    color: var(--music-primary);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    padding: 10px 14px;
    font-weight: var(--font-weight-medium);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s var(--ease-beat);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }
  
  .play-album-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  .play-album-btn:hover {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.9) 0%, 
      rgba(139, 92, 246, 0.9) 50%, 
      rgba(59, 130, 246, 0.9) 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    border-color: rgba(99, 102, 241, 0.4);
  }
  
  .play-album-btn:hover::before {
    left: 100%;
  }
  
  .play-album-btn:active {
    transform: translateY(0);
    transition: all 0.1s ease;
  }
  
  .play-album-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .play-album-btn.loading {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.3) 0%, 
      rgba(139, 92, 246, 0.3) 50%, 
      rgba(59, 130, 246, 0.3) 100%);
    animation: loadingPulse 1.5s ease-in-out infinite;
  }
  
  @keyframes loadingPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  
  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* —— 播放模式卡片样式 —— */
  .playing-mode {
    background: rgba(255, 255, 255, 0.95) !important;
    border: 2px solid rgba(99, 102, 241, 0.3) !important;
    box-shadow: 
      0 20px 40px rgba(99, 102, 241, 0.15),
      0 8px 20px rgba(0, 0, 0, 0.08) !important;
    transform: translateY(-5px) !important;
    animation: cardPulse 2s ease-in-out infinite;
  }
  
  @keyframes cardPulse {
    0%, 100% {
      box-shadow: 
        0 20px 40px rgba(99, 102, 241, 0.15),
        0 8px 20px rgba(0, 0, 0, 0.08),
        0 0 0 0 rgba(99, 102, 241, 0.3);
    }
    50% {
      box-shadow: 
        0 20px 40px rgba(99, 102, 241, 0.2),
        0 8px 20px rgba(0, 0, 0, 0.08),
        0 0 0 4px rgba(99, 102, 241, 0.1);
    }
  }
  
  .iframe-container {
    padding: var(--space-4);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .iframe-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--gray-100);
  }
  
  .close-btn {
    background: rgba(244, 63, 94, 0.1);
    color: #f43f5e;
    border: 1px solid rgba(244, 63, 94, 0.2);
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s var(--ease-beat);
    backdrop-filter: blur(10px);
    flex-shrink: 0;
  }
  
  .close-btn:hover {
    background: #f43f5e;
    color: white;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(244, 63, 94, 0.3);
  }
  
  .iframe-wrapper {
    flex: 1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    background: var(--gray-50);
  }
  
  .iframe-wrapper iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
  }
  
  /* —— 网易云按钮样式 —— */
  .netease-btn {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.1) 0%, 
      rgba(139, 92, 246, 0.1) 50%, 
      rgba(59, 130, 246, 0.1) 100%);
    color: var(--music-primary);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    padding: 8px 16px;
    font-weight: var(--font-weight-medium);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s var(--ease-beat);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    text-decoration: none;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
    position: relative;
    overflow: hidden;
  }
  
  .netease-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  .netease-btn:hover {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.9) 0%, 
      rgba(139, 92, 246, 0.9) 50%, 
      rgba(59, 130, 246, 0.9) 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    border-color: rgba(99, 102, 241, 0.4);
  }
  
  .netease-btn:hover::before {
    left: 100%;
  }
  
  /* —— 标题Lottie动画容器 —— */
  .title-lottie-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1;
  }
  
  .title-lottie {
    position: absolute;
    width: 80px;
    height: 80px;
    opacity: 0.6;
    animation: titleLottieFloat 8s ease-in-out infinite;
  }
  
  .title-lottie-1 {
    top: -20px;
    left: 20%;
    animation-delay: 0s;
  }
  
  .title-lottie-2 {
    top: 40px;
    right: 25%;
    animation-delay: -3s;
  }
  
  .title-lottie-3 {
    top: -10px;
    left: 70%;
    animation-delay: -6s;
  }
  
  @keyframes titleLottieFloat {
    0%, 100% {
      transform: translateY(0) rotate(0deg) scale(1);
      opacity: 0.4;
    }
    50% {
      transform: translateY(-15px) rotate(180deg) scale(1.1);
      opacity: 0.7;
    }
  }
  
  /* —— 错误状态样式 —— */
  .error-state {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    background: rgba(254, 226, 226, 0.8);
    border: 1px solid rgba(248, 113, 113, 0.3);
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }
  
  .error-message {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .retry-btn {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all 0.3s var(--ease-beat);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
  }
  
  .retry-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
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
    
    /* 移动设备上的音乐卡片和iframe */
    .music-card {
      min-height: 120px;
      padding: var(--space-3);
    }
    
    .iframe-wrapper iframe {
      height: 350px;
    }
    
    .iframe-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-2);
    }
    
    .close-btn {
      align-self: flex-end;
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

  /* —— 音乐专辑装饰动画 —— */
  .music-album-section {
    position: relative;
    overflow: hidden;
  }

  .animate-spin-slow {
    animation: spin 8s linear infinite;
  }

  .animate-spin-slow-reverse {
    animation: spin 12s linear infinite reverse;
  }

  .animate-spin-slow.delay-1000 {
    animation-delay: 1s;
  }

  .animate-bounce.slow {
    animation: bounce 3s infinite;
  }

  .animate-ping.slow {
    animation: ping 4s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .animate-pulse.delay-300 {
    animation-delay: 0.3s;
  }

  .animate-pulse.delay-500 {
    animation-delay: 0.5s;
  }

  .animate-pulse.delay-700 {
    animation-delay: 0.7s;
  }

  .animate-bounce.delay-500 {
    animation-delay: 0.5s;
  }

  /* 音波动画 */
  .animate-wave-1 {
    animation: wave1 2s ease-in-out infinite;
  }

  .animate-wave-2 {
    animation: wave2 2.2s ease-in-out infinite;
  }

  .animate-wave-3 {
    animation: wave3 1.8s ease-in-out infinite;
  }

  .animate-wave-4 {
    animation: wave4 2.4s ease-in-out infinite;
  }

  .animate-wave-1.delay-200 {
    animation-delay: 0.2s;
  }

  .animate-wave-2.delay-300 {
    animation-delay: 0.3s;
  }

  @keyframes wave1 {
    0%, 100% { 
      height: 2rem; 
      opacity: 0.8;
    }
    50% { 
      height: 3.5rem; 
      opacity: 1;
    }
  }

  @keyframes wave2 {
    0%, 100% { 
      height: 3rem; 
      opacity: 0.7;
    }
    50% { 
      height: 4rem; 
      opacity: 1;
    }
  }

  @keyframes wave3 {
    0%, 100% { 
      height: 1.5rem; 
      opacity: 0.6;
    }
    50% { 
      height: 2.5rem; 
      opacity: 1;
    }
  }

  @keyframes wave4 {
    0%, 100% { 
      height: 2.5rem; 
      opacity: 0.8;
    }
    50% { 
      height: 4.5rem; 
      opacity: 1;
    }
  }

  /* 音符悬浮效果 */
  .music-note {
    animation-fill-mode: both;
    transform-origin: center;
  }

  .music-note:nth-child(odd) {
    animation-direction: alternate;
  }

  .music-note:nth-child(even) {
    animation-direction: alternate-reverse;
  }

  /* 唱片特效 */
  .vinyl-record {
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.1);
  }

  .vinyl-record::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }

  /* 音乐线条流动效果 */
  .music-lines {
    animation: flow 6s ease-in-out infinite;
  }

  @keyframes flow {
    0%, 100% {
      opacity: 0.1;
      transform: translateX(-100%);
    }
    50% {
      opacity: 0.8;
      transform: translateX(100%);
    }
  }

  /* 专辑卡片增强效果 */
  .music-card {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .music-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.03), transparent);
    transform: rotate(45deg);
    transition: all 0.5s;
    opacity: 0;
  }

  .music-card:hover::before {
    opacity: 1;
    animation: shimmer 1.5s ease-in-out;
  }

  .music-card:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }

  .album-cover img {
    transition: all 0.3s ease;
  }

  .music-card:hover .album-cover img {
    transform: scale(1.05);
  }

  /* 专辑装饰点动画增强 */
  .animate-pulse.delay-100 {
    animation-delay: 0.1s;
  }

  .animate-pulse.delay-200 {
    animation-delay: 0.2s;
  }

  /* 文字截断样式 */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 响应式调整音乐装饰 */
  @media (max-width: 768px) {
    .music-decorations .music-note {
      font-size: 1.5rem;
    }
    
    .vinyl-record {
      width: 3rem !important;
      height: 3rem !important;
    }
    
    .sound-waves {
      transform: scale(0.7);
    }

    .music-card:hover {
      transform: translateY(-1px) scale(1.01);
    }
  }

  /* —— 专辑展示区域样式 —— */
  .album-showcase-container {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(248, 250, 252, 0.9) 100%);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    margin: 2rem auto;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .album-showcase-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--album-bg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.25;
    z-index: -1;
    transition: all 0.5s ease;
    filter: blur(0.3px);
  }
  
  .album-showcase-container:hover::before {
    opacity: 0.35;
    filter: blur(0px);
    transform: scale(1.01);
  }
  
  .album-circle {
    position: relative;
  }
  
  .album-circle .w-80 {
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .shadow-music {
    box-shadow: 0 40px 80px rgba(59, 130, 246, 0.3) !important;
  }
  
  .album-title {
    background: linear-gradient(135deg, #1f2937, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .achievement-item {
    transition: all 0.3s ease;
    padding: 0.5rem;
    border-radius: 8px;
  }
  
  .achievement-item:hover {
    background: rgba(59, 130, 246, 0.05);
    transform: translateX(8px);
  }
  
  .album-stats .stat-item {
    transition: transform 0.3s ease;
  }
  
  .album-stats .stat-item:hover {
    transform: translateY(-4px);
  }
  
  /* 导航按钮样式 */
  .nav-btn-inner {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .nav-btn:hover .nav-btn-inner {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  }
  
  .nav-btn:hover svg {
    color: white !important;
  }
  
  .indicator {
    transition: all 0.3s ease;
  }
  
  .indicator:hover {
    transform: scale(1.5);
  }
  
  /* 音频播放器样式 */
  .music-player {
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }
  
  .music-player:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  .progress-bar {
    position: relative;
    overflow: hidden;
  }
  
  .progress-fill {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    position: relative;
  }
  
  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* 专辑展示区域响应式 */
  @media (max-width: 768px) {
    .album-showcase {
      flex-direction: column;
      text-align: center;
      min-height: auto !important;
      padding: 1rem;
    }

    .album-visual {
      margin-right: 0;
      margin-bottom: 2rem;
    }

    .album-circle .w-80 {
      width: 16rem !important;
      height: 16rem !important;
    }

    .album-title {
      font-size: 2.5rem !important;
    }

    .album-navigation {
      bottom: 1rem;
      space-x: 2rem;
    }

    .nav-btn-inner {
      padding: 0.75rem;
    }

    .music-player {
      margin-top: 2rem;
    }
  }

  /* —— 高设计感鼠标交互背景 —— */
  .water-ripple-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    pointer-events: auto;
    cursor: crosshair;
    background: 
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.01) 0%, transparent 50%),
      linear-gradient(135deg, 
        rgba(248, 250, 252, 0.98) 0%,
        rgba(241, 245, 249, 0.95) 25%,
        rgba(235, 238, 243, 0.92) 50%,
        rgba(241, 245, 249, 0.95) 75%,
        rgba(248, 250, 252, 0.98) 100%);
    background-size: 800px 800px, 600px 600px, 1000px 1000px, 400% 400%;
    animation: ambientFlow 25s ease-in-out infinite;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .water-ripple-container:hover {
    background: 
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.02) 0%, transparent 50%),
      linear-gradient(135deg, 
        rgba(248, 250, 252, 0.95) 0%,
        rgba(241, 245, 249, 0.92) 25%,
        rgba(235, 238, 243, 0.88) 50%,
        rgba(241, 245, 249, 0.92) 75%,
        rgba(248, 250, 252, 0.95) 100%);
    cursor: none; /* 隐藏默认光标，显示自定义光环 */
  }

  .water-canvas {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    opacity: 0.9;
    mix-blend-mode: screen;
    filter: blur(0.3px) contrast(1.15) brightness(1.05);
    transition: all 0.3s ease;
  }

  .water-ripple-container:hover .water-canvas {
    opacity: 1;
    filter: blur(0px) contrast(1.25) brightness(1.1);
  }

  @keyframes ambientFlow {
    0%, 100% {
      background-position: 0% 0%, 100% 100%, 50% 50%, 0% 50%;
    }
    25% {
      background-position: 100% 0%, 0% 100%, 80% 20%, 100% 0%;
    }
    50% {
      background-position: 100% 100%, 0% 0%, 20% 80%, 200% 50%;
    }
    75% {
      background-position: 0% 100%, 100% 0%, 50% 50%, 100% 100%;
    }
  }

  /* 音乐模块内容层级提升 */
  .music-album-section .container {
    position: relative;
    z-index: 10;
  }

  /* 导航按钮增强透明度 */
  .nav-btn .nav-btn-inner {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.4);
  }

  .nav-btn:hover .nav-btn-inner {
    background: rgba(255, 255, 255, 0.95) !important;
    border-color: rgba(59, 130, 246, 0.3);
  }

  /* 专辑展示容器透明度调整 */
  .album-showcase-container {
    background: rgba(255, 255, 255, 0.85) !important;
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.4);
  }

  .album-showcase-container:hover {
    background: rgba(255, 255, 255, 0.9) !important;
  }

  /* 响应式交互效果 */
  @media (max-width: 768px) {
    .water-ripple-container {
      opacity: 0.8;
      cursor: default; /* 移动端保持默认光标 */
    }
    
    .water-canvas {
      opacity: 0.7;
      filter: blur(0.2px) contrast(1.1);
    }

    .water-ripple-container:hover {
      cursor: default;
    }
  }

  /* 粒子系统性能优化 */
  @media (prefers-reduced-motion: reduce) {
    .water-ripple-container {
      animation: none;
    }
    
    .ambientFlow {
      animation: none;
    }
  }

  /* 高刷新率显示器优化 */
  @media (min-resolution: 120dpi) {
    .water-canvas {
      image-rendering: crisp-edges;
    }
  }

  /* 打字效果样式 */
  .typewriter-text {
    opacity: 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #404040 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    transform: translateY(30px);
    transition: transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1),
                opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .typewriter-text.typing {
    opacity: 1;
    transform: translateY(0);
  }

  /* 身份标签轮播样式 */
  .identity-carousel {
    position: relative;
    height: 1.5em;
    overflow: hidden;
  }

  .identity-text {
    position: absolute;
    width: 100%;
    left: 0;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }

  .identity-text.active {
    opacity: 1;
    transform: translateY(0);
  }

  /* 下滑提示动画 */
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce {
    animation: bounce 2s infinite;
  }

  /* 艺术背景效果 */
  .artistic-bg {
    background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9));
    overflow: hidden;
  }

  .artistic-circle {
    position: absolute;
    width: 80vw;
    height: 80vw;
    border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.03);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: rotateCircle 30s linear infinite;
  }

  /* 流动线条背景 */
  .flowing-lines {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .line-group {
    position: absolute;
    inset: -20%;
  }

  .line-group.diagonal {
    transform: rotate(-45deg);
  }

  .line-group.horizontal {
    transform: rotate(0deg);
  }

  .line-group.vertical {
    transform: rotate(90deg);
  }

  .line {
    position: absolute;
    background: linear-gradient(90deg, 
      transparent,
      rgba(99, 102, 241, 0.01) 20%,
      rgba(99, 102, 241, 0.02) 50%,
      rgba(99, 102, 241, 0.01) 80%,
      transparent
    );
    height: 1px;
    width: 140%;
    left: -20%;
    animation: flowLine 15s infinite linear;
  }

  .line-group.diagonal .line:nth-child(1) {
    top: 30%;
    animation-delay: 0s;
    opacity: 0.7;
  }

  .line-group.diagonal .line:nth-child(2) {
    top: 50%;
    animation-delay: -5s;
    opacity: 0.5;
  }

  .line-group.diagonal .line:nth-child(3) {
    top: 70%;
    animation-delay: -10s;
    opacity: 0.3;
  }

  .line-group.horizontal .line:nth-child(1) {
    top: 40%;
    animation-delay: -3s;
    opacity: 0.4;
  }

  .line-group.horizontal .line:nth-child(2) {
    top: 60%;
    animation-delay: -8s;
    opacity: 0.6;
  }

  .line-group.vertical .line:nth-child(1) {
    top: 45%;
    animation-delay: -2s;
    opacity: 0.3;
  }

  .line-group.vertical .line:nth-child(2) {
    top: 65%;
    animation-delay: -7s;
    opacity: 0.5;
  }

  @keyframes flowLine {
    0% {
      transform: translateX(-10%) scaleX(0.9);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    45% {
      transform: translateX(30%) scaleX(1.1);
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      transform: translateX(70%) scaleX(0.9);
      opacity: 0;
    }
  }

  @keyframes rotateCircle {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .grain-overlay {
    position: absolute;
    inset: 0;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+');
    opacity: 0.2;
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  /* 添加模糊光晕效果 */
   .artistic-bg::before {
     content: '';
     position: absolute;
     inset: 0;
     background: radial-gradient(
       circle at 50% 50%,
       rgba(99, 102, 241, 0.03) 0%,
       transparent 70%
     );
     animation: pulseGlow 8s ease-in-out infinite alternate;
   }

   @keyframes pulseGlow {
     0% {
       opacity: 0.5;
       transform: scale(1);
     }
     100% {
       opacity: 1;
       transform: scale(1.1);
     }
   }

   /* 装饰线条 */
   .decorative-line {
     display: flex;
     align-items: center;
     justify-content: center;
     gap: 2rem;
   }

   .decorative-line .line {
     width: 60px;
     height: 1px;
     background: linear-gradient(90deg, transparent, var(--gray-300), transparent);
   }

   .decorative-line .dot {
     width: 4px;
     height: 4px;
     background: var(--gray-400);
     border-radius: 50%;
   }

   /* 标题容器 */
   .title-container {
     perspective: 1000px;
   }

   .title-bg {
     position: absolute;
     inset: -2rem;
     background: radial-gradient(circle at center, rgba(99,102,241,0.05) 0%, transparent 70%);
     transform: translateZ(-100px);
     opacity: 0;
     transition: opacity 1s ease;
   }

   .typewriter-text {
     opacity: 0;
     background: linear-gradient(135deg, #1a1a1a 0%, #404040 100%);
     background-clip: text;
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     position: relative;
     transform: translateZ(50px);
     letter-spacing: -0.02em;
   }

   .typewriter-text.typing {
     opacity: 1;
   }

   .typewriter-text.typing + .title-bg {
     opacity: 1;
   }

   /* 艺术家简介文字 */
   .artist-intro {
     position: relative;
     display: inline-block;
     padding: 0 1rem;
   }

   .artist-intro::before,
   .artist-intro::after {
     content: '';
     position: absolute;
     top: 50%;
     width: 20px;
     height: 1px;
     background: var(--gray-300);
   }

   .artist-intro::before {
     left: -30px;
     transform: rotate(-45deg);
   }

   .artist-intro::after {
     right: -30px;
     transform: rotate(45deg);
   }

   /* 身份标签展示区 */
   .identity-showcase {
     padding: 2rem 0;
   }

   .identity-carousel {
     position: relative;
     height: 1.5em;
     overflow: hidden;
   }

   .identity-text {
     position: absolute;
     width: 100%;
     left: 0;
     opacity: 0;
     transform: translateY(20px) rotateX(-20deg);
     transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
   }

   .identity-text.active {
     opacity: 1;
     transform: translateY(0) rotateX(0);
   }

   .identity-decor {
     position: absolute;
     width: 40px;
     height: 1px;
     background: linear-gradient(90deg, transparent, var(--gray-300));
     top: 50%;
   }

   .identity-decor.left {
     left: 20%;
     transform: translateX(-100%);
   }

   .identity-decor.right {
     right: 20%;
     transform: translateX(100%);
     background: linear-gradient(90deg, var(--gray-300), transparent);
   }

   /* 下滑提示 */
   .scroll-hint {
     opacity: 0.7;
   }

   .scroll-line {
     width: 1px;
     height: 60px;
     background: linear-gradient(to bottom, var(--gray-300), transparent);
     margin: 0 auto;
     position: relative;
   }

   .scroll-dot {
     position: absolute;
     width: 3px;
     height: 3px;
     background: var(--gray-400);
     border-radius: 50%;
     left: -1px;
     animation: scrollDot 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
   }

   @keyframes scrollDot {
     0% {
       top: 0;
       opacity: 1;
     }
     100% {
       top: 100%;
       opacity: 0;
     }
   }

   /* 响应式调整 */
   @media (max-width: 768px) {
     .artistic-circle {
       width: 120vw;
       height: 120vw;
     }
     
     .identity-decor {
       width: 20px;
     }
     
     .identity-decor.left {
       left: 10%;
     }
     
     .identity-decor.right {
       right: 10%;
     }
   }

   /* 修改和新增的样式 */
   .artist-intro,
   .identity-showcase {
     transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
   }

   .artist-intro.show,
   .identity-showcase.show {
     opacity: 1;
     transform: translateY(0);
   }

   /* 滚动提示样式优化 */
   .scroll-hint {
     transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
     z-index: 50;
   }

   .scroll-hint.show {
     opacity: 0.7;
   }

   .scroll-hint.hide {
     opacity: 0;
     transform: translate(-50%, 20px);
   }

   /* 页面过渡遮罩 */
   .page-transition-mask {
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: rgba(255, 255, 255, 0.98);
     z-index: 100;
     pointer-events: none;
     opacity: 0;
     transition: opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
   }

   .page-transition-mask.active {
     opacity: 1;
   }

   /* 优化section过渡 */
   section {
     transition: transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1),
                opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
   }

   section.transitioning {
     transform: scale(0.95);
     opacity: 0;
   }

   /* 调整打字效果动画 */
   .typewriter-text {
     opacity: 0;
     background: linear-gradient(135deg, #1a1a1a 0%, #404040 100%);
     background-clip: text;
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     position: relative;
     transform: translateY(30px);
     transition: transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1),
                opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
   }

   .typewriter-text.typing {
     opacity: 1;
     transform: translateY(0);
   }

   /* 3D模型容器样式 */
   .model-container {
     perspective: 1000px;
   }

   .model-container canvas {
  background: transparent;
  transition: all 0.3s ease;
  overflow: hidden;
}

   .model-container canvas:hover {
     transform: translateY(-5px);
   }
   </style>  