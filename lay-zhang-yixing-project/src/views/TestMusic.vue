<template>
  <div class="hajime-portfolio" :style="{ backgroundImage: `url(${getCurrentImage()})` }">
    <!-- 背景遮罩层 -->
    <div class="background-overlay"></div>
    
    <!-- 主图片展示区域 -->
    <main class="main-content">
      <div class="image-carousel">
        <!-- 左侧部分图片 -->
        <div class="image-preview left-preview">
          <img :src="getPreviousImage()" alt="Previous" />
        </div>
        
        <!-- 中央主图片 -->
        <div
          class="image-main"
          ref="imageMain"
          :style="{ backgroundImage: `url(${getCurrentImage()})` }"
        >
          <div class="image-info">
            <h2 class="image-title">{{ getCurrentTitle() }}</h2>
            <p class="image-year">{{ getCurrentYear() }}</p>
          </div>
        </div>
        
        <!-- 右侧部分图片 -->
        <div class="image-preview right-preview">
          <img :src="getNextImage()" alt="Next" />
        </div>
      </div>
    </main>

    <!-- 底部单点导航 -->
    <nav class="bottom-navigation">
      <div class="navigation-dot"></div>
    </nav>

    <!-- 幻灯片指示文字 -->
    <div class="slide-indicator">
      <span class="slide-text">DIAPOSITIVE</span>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import 'jquery.ripples';
// 将 jQuery 暴露到全局，供插件使用
window.$ = window.jQuery = $;

// IntersectionObserver 触发阈值
const OBSERVER_OPTIONS = {
  root: null,
  threshold: 0.2
};

export default {
  name: 'TestMusic',
  data() {
    return {
      // 水波纹参数，可在调试器中实时修改
      rippleOptions: {
        resolution: 512,
        dropRadius: 30,
        perturbance: 0.04,
        interactive: true
      },
      currentPage: 1,
      totalPages: 6,
      musicItems: [
        {
          title: 'LIT',
          year: '2020',
          image: '/img/music/LIT.png'
        },
        {
          title: 'NAMANANA',
          year: '2018',
          image: '/img/music/NANANA.png'
        },
        {
          title: 'PRODUCER',
          year: '2019',
          image: '/img/music/PRODUCER.png'
        },
        {
          title: 'STEP',
          year: '2021',
          image: '/img/music/STEP.png'
        },
        {
          title: 'NEXT ALBUM',
          year: '2024',
          image: '/img/music/LIT-ba.png'
        },
        {
          title: 'FUTURE PROJECT',
          year: '2025',
          image: '/img/music/PRODUCER-ba.png'
        }
      ],
      ripplesActive: false
    }
  },
  watch: {
    // 当页码变化时，更新背景图片和水波纹纹理
    currentPage() {
      this.updateRippleImage();
      this.updateMainRippleImage();
    },
    ripplesActive(val) {
      // 根据激活状态初始化或销毁
      if (val) {
        this.initRipples();
        this.initMainRipple();
      } else {
        this.destroyRipples();
      }
    }
  },
  methods: {
    /* 初始化水波纹效果 */
    initRipples() {
      this.$nextTick(() => {
        const $el = $(this.$el);
        // 如果已有实例，先销毁
        if ($el.data('ripples')) {
          $el.ripples('destroy');
        }
        // 使用当前参数重新创建
        $el.ripples({
          ...this.rippleOptions,
          // 使用当前主图作为纹理
          imageUrl: this.getCurrentImage()
        });
      });
    },

    /* 更新纹理（背景图片） */
    updateRippleImage() {
      const $el = $(this.$el);
      if ($el.data('ripples')) {
        $el.ripples('set', 'imageUrl', this.getCurrentImage());
      }
    },

    setCurrentPage(page) {
      this.currentPage = page;
    },
    getCurrentImage() {
      return this.musicItems[this.currentPage - 1]?.image || this.musicItems[0].image;
    },
    getCurrentTitle() {
      return this.musicItems[this.currentPage - 1]?.title || this.musicItems[0].title;
    },
    getCurrentYear() {
      return this.musicItems[this.currentPage - 1]?.year || this.musicItems[0].year;
    },
    getPreviousImage() {
      const prevIndex = this.currentPage === 1 ? this.musicItems.length - 1 : this.currentPage - 2;
      return this.musicItems[prevIndex]?.image || this.musicItems[0].image;
    },
    getNextImage() {
      const nextIndex = this.currentPage >= this.musicItems.length ? 0 : this.currentPage;
      return this.musicItems[nextIndex]?.image || this.musicItems[0].image;
    },
    /* 初始化主图水波纹 */
    initMainRipple() {
      this.$nextTick(() => {
        const $main = $(this.$refs.imageMain);
        if (!$main.length) return;
        if ($main.data('ripples')) {
          $main.ripples('destroy');
        }
        $main.ripples({
          resolution: 256,
          dropRadius: 20,
          perturbance: 0.04,
          interactive: true,
          imageUrl: this.getCurrentImage()
        });
      });
    },

    updateMainRippleImage() {
      const $main = $(this.$refs.imageMain);
      if ($main.data('ripples')) {
        $main.ripples('set', 'imageUrl', this.getCurrentImage());
      }
    },

    destroyRipples() {
      const $el = $(this.$el);
      if ($el.data('ripples')) {
        $el.ripples('destroy');
      }
      const $main = $(this.$refs.imageMain);
      if ($main && $main.data('ripples')) {
        $main.ripples('destroy');
      }
    },
  },
  mounted() {
    // 自动轮播
    setInterval(() => {
      this.currentPage = this.currentPage >= this.totalPages ? 1 : this.currentPage + 1;
    }, 5000);

    // 设置 IntersectionObserver 懒加载水波纹
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.ripplesActive = entry.isIntersecting;
      });
    }, OBSERVER_OPTIONS);

    observer.observe(this.$el);
  }
}
</script>

<style scoped>
/* 全局重置和基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.hajime-portfolio {
  min-height: 100vh;
  width: 100vw;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.8s ease-in-out;
}

/* 背景遮罩层 */
.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;


  z-index: 1;
}

/* 顶部标题 */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 60px 0 40px 0;
  text-align: center;
}

.site-title {
  font-size: 28px;
  font-weight: normal;
  letter-spacing: 12px;
  margin: 0;
}

.title-link {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.title-link:hover {
  color: #888888;
}

.page-number {
  font-size: 72px;
  font-weight: 100;
  color: #ffffff;
  text-align: center;
}

/* 主图片展示区域 */
.main-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 120px;
  position: relative;
  z-index: 10;
}

.image-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

/* 中央主图片 */
.image-main {
  position: relative;
  width: 500px;
  height: 500px;
  margin: 0 40px;
  z-index: 10;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 水波 canvas 会自动覆盖 */
canvas {
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.image-info {
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  text-align: center;
}

.image-title {
  font-size: 24px;
  font-weight: normal;
  letter-spacing: 6px;
  margin-bottom: 8px;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.image-year {
  font-size: 14px;
  color: #cccccc;
  letter-spacing: 3px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 左右预览图片 */
.image-preview {
  width: 200px;
  height: 300px;
  opacity: 0.6;
  transition: all 0.5s ease;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.left-preview {
  transform: translateX(50px);
}

.right-preview {
  transform: translateX(-50px);
}

/* 底部单点导航 */
.bottom-navigation {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.navigation-dot {
  width: 8px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navigation-dot:hover {
  background-color: #ffffff;
  transform: scale(1.2);
}

/* 幻灯片指示文字 */
.slide-indicator {
  position: fixed;
  bottom: 30px;
  right: 80px;
  z-index: 100;
}

.slide-text {
  font-size: 12px;
  color: #cccccc;
  letter-spacing: 3px;
  font-weight: normal;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.image-main {
  animation: fadeIn 0.8s ease-in-out;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .slide-indicator {
    right: 40px;
  }
  
  .image-carousel {
    max-width: 900px;
  }
  
  .image-main {
    width: 400px;
    height: 400px;
  }
  
  .image-preview {
    width: 150px;
    height: 225px;
  }
}

@media (max-width: 768px) {
  .site-title {
    font-size: 20px;
    letter-spacing: 6px;
  }
  
  .main-content {
    padding-top: 140px;
    padding-bottom: 120px;
  }
  
  .image-carousel {
    flex-direction: column;
    gap: 30px;
  }
  
  .image-main {
    width: 300px;
    height: 300px;
    margin: 0;
  }
  
  .image-preview {
    display: none;
  }
  
  .bottom-navigation {
    bottom: 30px;
  }
}

@media (max-width: 480px) {
  .image-main {
    width: 250px;
    height: 250px;
  }
  
  .image-title {
    font-size: 18px;
    letter-spacing: 3px;
  }
  
  .image-year {
    font-size: 12px;
    letter-spacing: 2px;
  }
}

/* 顶部/底部渐隐过渡 */
.hajime-portfolio::before,
.hajime-portfolio::after {
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 120px;
  pointer-events: none;
  z-index: 5;
}

.hajime-portfolio::before {
  top: 0;
  background: linear-gradient(to bottom, var(--divider-color-top, #0d1b2b) 0%, transparent 100%);
}

.hajime-portfolio::after {
  bottom: 0;
  background: linear-gradient(to top, var(--divider-color-bottom, #ffffff) 0%, transparent 100%);
}
</style>
