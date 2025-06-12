<template>
  <div class="mobile-admin-dashboard">
    <!-- 移动端头部 -->
    <header class="mobile-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">后台管理</h1>
          <p class="page-subtitle">LAY 张艺兴音乐管理系统</p>
        </div>
        <div class="header-right">
          <button @click="logout" class="logout-btn">
            <svg viewBox="0 0 24 24" class="logout-icon">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- 统计卡片 -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎵</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.songs }}</div>
            <div class="stat-label">歌曲总数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📀</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.albums }}</div>
            <div class="stat-label">专辑数量</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📺</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.videos }}</div>
            <div class="stat-label">视频作品</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.visitors }}</div>
            <div class="stat-label">访问量</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 快捷操作 -->
    <section class="actions-section">
      <h2 class="section-title">快捷操作</h2>
      <div class="actions-grid">
        <div class="action-card" @click="addSong">
          <div class="action-icon">➕</div>
          <div class="action-label">添加歌曲</div>
        </div>
        
        <div class="action-card" @click="uploadVideo">
          <div class="action-icon">📤</div>
          <div class="action-label">上传视频</div>
        </div>
        
        <div class="action-card" @click="manageAlbums">
          <div class="action-icon">📂</div>
          <div class="action-label">管理专辑</div>
        </div>
        
        <div class="action-card" @click="viewAnalytics">
          <div class="action-icon">📊</div>
          <div class="action-label">数据分析</div>
        </div>
      </div>
    </section>

    <!-- 最新活动 -->
    <section class="activity-section">
      <h2 class="section-title">最新活动</h2>
      <div class="activity-list">
        <div v-for="activity in activities" :key="activity.id" class="activity-item">
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <div class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">首页</span>
      </div>
      <div class="nav-item" @click="manageContent">
        <span class="nav-icon">📝</span>
        <span class="nav-label">内容</span>
      </div>
      <div class="nav-item" @click="viewStats">
        <span class="nav-icon">📈</span>
        <span class="nav-label">统计</span>
      </div>
      <div class="nav-item" @click="settings">
        <span class="nav-icon">⚙️</span>
        <span class="nav-label">设置</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const stats = ref({
  songs: 128,
  albums: 15,
  videos: 42,
  visitors: '2.1K'
})

// 活动数据
const activities = ref([
  {
    id: 1,
    icon: '🎵',
    title: '新歌《梦想》已上传',
    time: '2小时前'
  },
  {
    id: 2,
    icon: '📺',
    title: 'MV《青春》获得10万播放',
    time: '4小时前'
  },
  {
    id: 3,
    icon: '👥',
    title: '今日访客量突破500',
    time: '6小时前'
  },
  {
    id: 4,
    icon: '📀',
    title: '专辑《时光》完成更新',
    time: '1天前'
  }
])

// 方法
const logout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  showNotification('已退出登录')
  router.push('/x-back')
}

const addSong = () => {
  showNotification('跳转到添加歌曲页面')
}

const uploadVideo = () => {
  showNotification('跳转到视频上传页面')
}

const manageAlbums = () => {
  showNotification('跳转到专辑管理页面')
}

const viewAnalytics = () => {
  showNotification('跳转到数据分析页面')
}

const manageContent = () => {
  showNotification('内容管理功能')
}

const viewStats = () => {
  showNotification('统计分析功能')
}

const settings = () => {
  showNotification('设置页面')
}

// 简单通知函数
const showNotification = (message: string) => {
  const notification = document.createElement('div')
  notification.className = 'mobile-notification'
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 14px;
    z-index: 9999;
    backdrop-filter: blur(10px);
    animation: fadeInOut 3s ease;
  `
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

onMounted(() => {
  // 检查登录状态
  const token = localStorage.getItem('admin_token')
  if (!token) {
    router.push('/x-back')
  }
  
  // 添加CSS动画
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeInOut {
      0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `
  document.head.appendChild(style)
})
</script>

<style scoped>
.mobile-admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 80px;
}

/* 移动端头部 */
.mobile-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 5px;
}

.page-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.logout-icon {
  width: 20px;
  height: 20px;
  color: white;
}

/* 统计卡片 */
.stats-section {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  min-width: 40px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 快捷操作 */
.actions-section {
  padding: 0 20px 20px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 15px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.action-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.action-icon {
  font-size: 2rem;
}

.action-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  text-align: center;
}

/* 最新活动 */
.activity-section {
  padding: 0 20px 20px;
}

.activity-list {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.activity-icon {
  font-size: 1.5rem;
  min-width: 30px;
}

.activity-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 90;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.nav-item.active {
  color: #4facfe;
  background: rgba(79, 172, 254, 0.1);
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.nav-icon {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
}

/* 响应式优化 */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .stat-number {
    font-size: 1.3rem;
  }
}
</style> 