<template>
  <div class="hajime-portfolio">
    <!-- 主标题区域 -->
    <header class="site-header">
      <h1 class="site-title">
        <router-link to="/" class="title-link">L A Y &nbsp;&nbsp; Z H A N G &nbsp;&nbsp; Y I X I N G</router-link>
      </h1>
    </header>



    <!-- 页面数字显示 -->
    <div class="page-indicator">
      <div class="page-number">{{ currentPage }}</div>
    </div>

    <!-- 主图片展示区域 -->
    <main class="main-content">
      <div class="image-carousel">
        <!-- 左侧部分图片 -->
        <div class="image-preview left-preview">
          <img :src="getPreviousImage()" alt="Previous" />
        </div>
        
        <!-- 中央主图片 -->
        <div class="image-main">
          <img :src="getCurrentImage()" :alt="getCurrentTitle()" />
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

    <!-- 底部数字导航 -->
    <nav class="bottom-navigation">
      <ul class="page-list">
        <li 
          v-for="page in totalPages" 
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
          @click="setCurrentPage(page)"
        >
          {{ page }}
        </li>
        <li class="page-item chinese-char">音</li>
      </ul>
    </nav>

    <!-- 幻灯片指示文字 -->
    <div class="slide-indicator">
      <span class="slide-text">DIAPOSITIVE</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestMusic',
  data() {
    return {
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
      ]
    }
  },
  methods: {
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
    }
  },
  mounted() {
    // 自动轮播
    setInterval(() => {
      this.currentPage = this.currentPage >= this.totalPages ? 1 : this.currentPage + 1;
    }, 5000);
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
  background-color: #000000;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  position: relative;
  overflow: hidden;
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
  background: rgba(0, 0, 0, 0.8);
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



/* 页面数字指示器 */
.page-indicator {
  position: fixed;
  right: 80px;
  top: 200px;
  z-index: 100;
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
}

.image-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
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
}

.image-year {
  font-size: 14px;
  color: #888888;
  letter-spacing: 3px;
}

/* 左右预览图片 */
.image-preview {
  width: 200px;
  height: 300px;
  opacity: 0.3;
  transition: all 0.5s ease;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.left-preview {
  transform: translateX(50px);
}

.right-preview {
  transform: translateX(-50px);
}

/* 底部数字导航 */
.bottom-navigation {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.page-list {
  display: flex;
  list-style: none;
  gap: 30px;
  align-items: center;
}

.page-item {
  font-size: 14px;
  color: #444444;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 10px;
}

.page-item:hover,
.page-item.active {
  color: #ffffff;
}

.chinese-char {
  margin-left: 20px;
  font-size: 16px;
  color: #444444;
  cursor: default;
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
  color: #444444;
  letter-spacing: 3px;
  font-weight: normal;
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
  .page-indicator,
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
  
  .page-indicator,
  .slide-indicator {
    display: none;
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
  
  .page-list {
    gap: 20px;
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
</style>
