<template>
  <div class="portfolio-container">
    <!-- Header -->
    <header class="header">
      <h1 class="main-title">LAY ZHANG YIXING</h1>
    </header>

    <!-- Navigation -->
    <nav class="main-navigation">
      <ul class="nav-list">
        <li class="nav-item">
          <a href="#" class="nav-link" @click="setActiveCategory('music')">音乐</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="setActiveCategory('album')">专辑</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="setActiveCategory('mv')">MV</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="setActiveCategory('live')">演唱会</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="setActiveCategory('behind')">幕后</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="setActiveCategory('about')">关于</a>
        </li>
      </ul>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
      <div class="content-section">
        <h2 class="section-title">{{ getSectionTitle() }}</h2>
        
        <!-- Content Grid -->
        <div class="content-grid" v-if="activeCategory !== 'about'">
          <div 
            v-for="item in getCurrentContent()" 
            :key="item.id"
            class="content-item"
            @click="selectItem(item)"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="item-info">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-description">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="about-section" v-if="activeCategory === 'about'">
          <div class="about-content">
            <p class="about-text">
              张艺兴（LAY），中国内地男歌手、演员、音乐制作人。<br>
              以其独特的音乐风格和卓越的创作才华，在华语乐坛占有重要地位。<br>
              致力于将中国传统文化与现代音乐完美融合。
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <footer class="bottom-navigation">
      <div class="page-numbers">
        <span 
          v-for="page in totalPages" 
          :key="page"
          class="page-number"
          :class="{ active: page === currentPage }"
          @click="setCurrentPage(page)"
        >
          {{ page }}
        </span>
        <span class="page-number chinese" @click="setCurrentPage('about')">关</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// 响应式数据
const activeCategory = ref('music')
const currentPage = ref(1)
const totalPages = ref(5)

// 模拟数据
const contentData = {
  music: [
    { id: 1, title: '莲', description: '2021年专辑主打曲', image: '/api/placeholder/300/200' },
    { id: 2, title: '飞天', description: '传统与现代的完美融合', image: '/api/placeholder/300/200' },
    { id: 3, title: '祖国', description: '爱国主题作品', image: '/api/placeholder/300/200' },
    { id: 4, title: 'Honey', description: '国际化音乐作品', image: '/api/placeholder/300/200' }
  ],
  album: [
    { id: 1, title: 'LIT', description: '2020年个人专辑', image: '/api/placeholder/300/200' },
    { id: 2, title: 'NAMANANA', description: '2018年迷你专辑', image: '/api/placeholder/300/200' },
    { id: 3, title: 'LOSE CONTROL', description: '首张个人专辑', image: '/api/placeholder/300/200' }
  ],
  mv: [
    { id: 1, title: '莲 MV', description: '东方美学视觉盛宴', image: '/api/placeholder/300/200' },
    { id: 2, title: '飞天 MV', description: '敦煌文化致敬之作', image: '/api/placeholder/300/200' }
  ],
  live: [
    { id: 1, title: '2023世界巡回演唱会', description: '全球巡演精彩瞬间', image: '/api/placeholder/300/200' },
    { id: 2, title: '《莲》专辑发布会', description: '专辑发布现场', image: '/api/placeholder/300/200' }
  ],
  behind: [
    { id: 1, title: '录音室纪录', description: '创作过程幕后花絮', image: '/api/placeholder/300/200' },
    { id: 2, title: 'MV拍摄花絮', description: 'MV制作过程记录', image: '/api/placeholder/300/200' }
  ]
}

// 计算属性
const getCurrentContent = () => {
  return contentData[activeCategory.value] || []
}

const getSectionTitle = () => {
  const titles = {
    music: '音乐作品',
    album: '专辑',
    mv: '音乐视频',
    live: '演唱会',
    behind: '幕后记录',
    about: '关于艺兴'
  }
  return titles[activeCategory.value] || ''
}

// 方法
const setActiveCategory = (category) => {
  activeCategory.value = category
  currentPage.value = 1
}

const setCurrentPage = (page) => {
  if (page === 'about') {
    activeCategory.value = 'about'
    currentPage.value = 'about'
  } else {
    currentPage.value = page
  }
}

const selectItem = (item) => {
  console.log('Selected item:', item)
  // 这里可以添加跳转到详情页的逻辑
}

onMounted(() => {
  console.log('Portfolio page loaded')
})
</script>

<style scoped>
.portfolio-container {
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.header {
  padding: 60px 0 40px;
  text-align: center;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0;
  color: #000000;
}

/* Navigation Styles */
.main-navigation {
  padding: 0 60px;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 60px;
}

.nav-item {
  padding: 20px 0;
}

.nav-link {
  color: #000000;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.nav-link:hover {
  opacity: 0.6;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 80px 60px;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 300;
  text-align: center;
  margin-bottom: 60px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
}

.content-item {
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.content-item:hover {
  transform: translateY(-5px);
  opacity: 0.9;
}

.item-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f5f5f5;
  margin-bottom: 20px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.content-item:hover .item-image img {
  transform: scale(1.05);
}

.item-info {
  text-align: center;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.item-description {
  font-size: 0.85rem;
  color: #666666;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

/* About Section */
.about-section {
  text-align: center;
  padding: 40px 0;
}

.about-content {
  max-width: 600px;
  margin: 0 auto;
}

.about-text {
  font-size: 1.1rem;
  line-height: 2;
  color: #333333;
  letter-spacing: 0.05em;
}

/* Bottom Navigation */
.bottom-navigation {
  padding: 40px 60px;
  border-top: 1px solid #e0e0e0;
}

.page-numbers {
  display: flex;
  justify-content: center;
  gap: 30px;
  align-items: center;
}

.page-number {
  font-size: 0.9rem;
  color: #999999;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 5px 10px;
}

.page-number:hover,
.page-number.active {
  color: #000000;
}

.page-number.chinese {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 40px 0 30px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .main-navigation {
    padding: 0 30px;
  }
  
  .nav-list {
    gap: 30px;
    flex-wrap: wrap;
  }
  
  .main-content {
    padding: 60px 30px;
  }
  
  .content-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }
  
  .bottom-navigation {
    padding: 30px;
  }
  
  .page-numbers {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.5rem;
    letter-spacing: 0.1em;
  }
  
  .nav-list {
    gap: 20px;
  }
  
  .nav-link {
    font-size: 0.8rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
