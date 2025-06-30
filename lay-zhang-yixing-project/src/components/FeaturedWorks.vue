<template>
  <div>
    <!-- 节选作品区域 -->
    <section 
      v-if="showWorksSection"
      id="featured-works" 
      class="min-h-screen bg-gradient-to-b from-gray-50 to-white relative works-section" 
      ref="worksSection"
      style="z-index: 10; position: relative;"
    >
      <!-- 完全仿照 electrafilmworks.com 的设计 -->
      <div class="electra-container">


        <!-- 作品画廊 - 1独享行，2共享行，2共享行 循环布局 -->
        <div class="gallery-grid">
          <div 
            v-for="(item, index) in carouselItems" 
            :key="item.id"
            :class="getItemClass(index)"
            @click="openWorkModal(item)"
            :data-index="index"
            :data-layout="index % 5 === 0 ? 'wide' : 'half'"
          >
            <!-- 调试信息 -->
            <div class="debug-info" style="position: absolute; top: 0; left: 0; background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; font-size: 12px; z-index: 20;">
              {{ index }}: {{ index % 5 === 0 ? 'WIDE' : 'HALF' }}
            </div>
            
            <!-- 作品视频 -->
            <div class="item-video" @mouseenter="playVideo($event)" @mouseleave="pauseVideo($event)">
              <video 
                :src="item.src" 
                :poster="getVideoPoster(item)"
                muted 
                loop
                preload="metadata"
                @click="openWorkModal(item)"
              >
                您的浏览器不支持视频播放
              </video>
            </div>
            
            <!-- 作品信息 -->
            <div class="item-info">
              <h3 class="item-title">{{ getSimpleTitle(item.title) }}</h3>
              <p class="client">{{ item.source }}</p>
              <p class="director">{{ getWorkSubtitle(item) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 视频播放弹窗 - 优雅全屏样式 -->
    <div 
      v-if="selectedWork" 
      class="video-modal fixed inset-0 z-[200] bg-black"
      @click="closeWorkModal"
    >
      <!-- 关闭按钮 -->
      <button 
        @click="closeWorkModal" 
        class="close-btn fixed top-6 right-6 z-[210] w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- 视频容器 -->
      <div class="video-container w-full h-full flex items-center justify-center p-4" @click.stop>
        <!-- 加载动画 -->
        <div v-if="videoLoading" class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">加载中...</p>
        </div>
        
        <!-- 视频播放器 -->
        <video 
          v-show="!videoLoading"
          ref="modalVideo"
          :src="selectedWork.src" 
          controls 
          autoplay
          class="modal-video w-[95vw] h-[120vh] object-contain"
          @loadstart="handleVideoLoadStart"
          @canplay="handleVideoCanPlay"
          @error="handleVideoError"
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <!-- 视频信息 -->
      <div class="video-info fixed top-6 left-6 z-[210] max-w-md">
        <h3 class="text-xl font-bold text-white mb-1">{{ selectedWork.title }}</h3>
        <p class="text-white/80 text-sm">{{ selectedWork.source }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// @ts-ignore
import { getAllCarouselItems } from '@/database/Carousel'

// Props
interface Props {
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

// 组件状态
const carouselItems = ref(getAllCarouselItems())
const showWorksSection = ref(props.visible)
const worksAnimationStarted = ref(false)
const selectedWork = ref<any>(null)
const worksSection = ref<HTMLElement | null>(null)
const videoLoading = ref(false)
const modalVideo = ref<HTMLVideoElement | null>(null)

// 暴露给父组件的方法
defineExpose({
  show: () => {
    showWorksSection.value = true
    setTimeout(() => {
      worksAnimationStarted.value = true
    }, 300)
  },
  hide: () => {
    showWorksSection.value = false
    worksAnimationStarted.value = false
  }
})

/**
 * 打开作品详情弹窗
 */
const openWorkModal = (work: any) => {
  selectedWork.value = work
  videoLoading.value = true
}

/**
 * 视频加载处理方法
 */
const handleVideoLoadStart = () => {
  videoLoading.value = true
}

const handleVideoCanPlay = () => {
  videoLoading.value = false
}

const handleVideoError = () => {
  videoLoading.value = false
  console.error('视频加载失败')
}

/**
 * 关闭作品详情弹窗
 */
const closeWorkModal = () => {
  selectedWork.value = null
}

/**
 * 视频播放控制 - 鼠标悬停播放
 */
const playVideo = (e: Event) => {
  const container = e.currentTarget as HTMLElement
  const video = container.querySelector('video') as HTMLVideoElement
  if (video) {
    video.play().catch(() => {
      // 忽略播放失败
    })
  }
}

const pauseVideo = (e: Event) => {
  const container = e.currentTarget as HTMLElement
  const video = container.querySelector('video') as HTMLVideoElement
  if (video) {
    video.pause()
    video.currentTime = 0 // 重置到开始
  }
}

/**
 * 格式化日期
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * 获取简化标题 - 模仿 electrafilmworks 的标题风格
 */
const getSimpleTitle = (title: string) => {
  // 提取核心词汇，去掉 "LAY张艺兴" 等前缀
  return title.replace(/LAY张艺兴《?([^》]+)》?.*/, '$1').trim() || title
}

/**
 * 获取作品副标题 - 模仿 electrafilmworks 的副标题风格
 */
const getWorkSubtitle = (item: any) => {
  // 模仿原网站的副标题格式，使用品牌名或描述的关键部分
  const subtitles = [
    '音乐视频', '舞台表演', '创作花絮', 
    '幕后记录', '时尚大片', '现场演出'
  ]
  const randomIndex = item.id % subtitles.length
  return subtitles[randomIndex]
}

/**
 * 获取项目CSS类名 - 1独享行，2共享行，2共享行，循环... 布局模式
 */
const getItemClass = (index: number) => {
  // 布局模式：1独享行，2共享行，2共享行，循环...
  // 每5个为一组：independent, shared, shared, shared, shared
  // index 0: 独享行
  // index 1: 共享行（左）
  // index 2: 共享行（右）  
  // index 3: 共享行（左）
  // index 4: 共享行（右）
  // index 5: 独享行 (下一组开始)
  // index 6: 共享行（左）
  // index 7: 共享行（右）
  // index 8: 共享行（左）
  // index 9: 共享行（右）
  const groupPosition = index % 5
  if (groupPosition === 0) {
    return 'gallery-item wide'
  }
  return 'gallery-item half'
}

/**
 * 获取视频封面 - 根据视频项目获取对应封面
 */
const getVideoPoster = (item: any) => {
  // 如果项目有 poster 字段则使用
  if (item.poster) {
    return item.poster
  }
  
  // 如果项目有 thumbnail 字段则使用
  if (item.thumbnail) {
    return item.thumbnail
  }
  
  // 尝试根据视频文件名生成封面路径
  if (item.src) {
    // 将视频文件扩展名替换为 .jpg 或 .png
    const posterPath = item.src.replace(/\.(mp4|webm|ogg|avi|mov)$/i, '.jpg')
    return posterPath
  }
  
  // 如果有图片src则使用（兼容现有数据）
  if (item.type === 'image' && item.src) {
    return item.src
  }
  
  // 最后使用默认图片
  return '/img/music/logo_transparent.png'
}

// 生命周期
onMounted(() => {
  console.log('Carousel items loaded:', carouselItems.value)
})

onUnmounted(() => {
  // 清理工作
})
</script>

<style scoped>
/* ========== 模仿 electrafilmworks.com 的网格布局样式 ========== */
.works-section {
  background: #ffffff;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.electra-container {
  width: 100%;
  margin: 0 auto;
  padding: 4vh 3vw;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}



/* 画廊网格布局 */
.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5vw;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
}

/* 画廊项目基础样式 */
.gallery-item {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

/* 宽版卡片 - 独占一行 */
.gallery-item.wide {
  flex: 1 1 100%;
  width: 100%;
  max-width: 100%;
}

/* 半宽卡片 - 共享一行 */
.gallery-item.half {
  flex: 1 1 calc(50% - 0.75vw);
  width: calc(50% - 0.75vw);
  max-width: calc(50% - 0.75vw);
  min-width: calc(50% - 0.75vw);
}

/* 视频容器 */
.item-video {
  position: relative;
  width: 100%;
  aspect-ratio: 21/9;
  overflow: hidden;
  background: #000;
  cursor: pointer;
  border-radius: clamp(0.8rem, 1.2vw, 1.6rem);
}

.item-video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Hover 效果 */
.gallery-item:hover .item-video video {
  transform: scale(1.02);
}

/* 项目信息 - 覆盖在视频左下角 */
.item-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2vh 2vw;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent);
  transition: all 0.3s ease;
  z-index: 10;
  border-radius: 0 0 clamp(0.8rem, 1.2vw, 1.6rem) clamp(0.8rem, 1.2vw, 1.6rem);
}

.gallery-item:hover .item-info {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), transparent);
}

.item-title {
  font-size: clamp(1.2rem, 2vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  color: #ffffff;
  margin: 0 0 0.3rem 0;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.client {
  font-size: clamp(0.9rem, 1.3vw, 1.3rem);
  font-weight: 500;
  line-height: 1.3;
  color: #ffffff;
  margin: 0 0 0.2rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.director {
  font-size: clamp(0.8rem, 1.1vw, 1.1rem);
  font-weight: 400;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.work-modal {
  animation: modalFadeIn 0.3s ease-out;
}

.modal-content {
  animation: modalSlideUp 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

@keyframes sectionFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes listFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes itemSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 响应式设计 - 简化版，主要功能已通过 clamp 和视口单位实现 */
@media (max-width: 768px) {
  .electra-container {
    padding: 3vh 2vw;
  }
  
  /* 小屏幕单列布局 */
  .gallery-item.wide,
  .gallery-item.half {
    width: 100%;
    margin-bottom: 0;
  }
  
  .gallery-grid {
    gap: 2vw;
  }
  
  .item-info {
    padding: 1.5vh 3vw;
  }
  
  .modal-content {
    width: 95%;
    max-height: 85vh;
  }
}

@media (max-width: 480px) {
  .electra-container {
    padding: 3vh 1.5vw;
  }
  
  .gallery-grid {
    gap: 3vw;
  }
  
  .item-info {
    padding: 1.2vh 4vw;
  }
  }

/* 视频弹窗样式 */
.video-modal {
  animation: modalFadeIn 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.close-btn {
  backdrop-filter: blur(10px);
}

.modal-video {
  border-radius: clamp(0.8rem, 1vw, 1.2rem);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  max-width: 95vw;
  max-height: 120vh;
}

/* 加载动画 */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

.video-info {
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}
</style> 