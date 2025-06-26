<template>
  <div class="api-test-demo">
    <div class="demo-header">
      <h2>🎵 LAY音乐网站 - API调用演示</h2>
      <p>展示前端如何调用后端数据接口</p>
    </div>

    <!-- API状态检查 -->
    <div class="status-section">
      <h3>🔍 API服务状态</h3>
      <div class="status-card" :class="{ online: apiStatus, offline: !apiStatus }">
        <div class="status-indicator"></div>
        <span>{{ apiStatus ? '服务正常' : '服务离线' }}</span>
        <button @click="checkStatus" :disabled="checking">
          {{ checking ? '检查中...' : '重新检查' }}
        </button>
      </div>
    </div>

    <!-- 数据获取演示 -->
    <div class="data-section">
      <h3>📊 数据获取演示</h3>
      
      <!-- 音乐数据 -->
      <div class="data-card">
        <h4>🎵 音乐数据</h4>
        <button @click="loadMusicData" :disabled="loading.music">
          {{ loading.music ? '加载中...' : '获取音乐数据' }}
        </button>
        <div v-if="musicData" class="data-display">
          <p><strong>专辑数量:</strong> {{ musicData.stats?.totalAlbums || 0 }}</p>
          <p><strong>单曲数量:</strong> {{ musicData.stats?.totalSingles || 0 }}</p>
          <p><strong>总播放量:</strong> {{ musicData.stats?.totalPlays?.toLocaleString() || 0 }}</p>
          <div class="albums-list">
            <h5>专辑列表:</h5>
            <div v-for="album in musicData.albums" :key="album.id" class="album-item">
              <img :src="album.cover" :alt="album.title" class="album-cover">
              <div class="album-info">
                <h6>{{ album.title }}</h6>
                <p>{{ album.year }} · {{ album.tracks?.length || 0 }}首歌曲</p>
                <p>{{ album.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间线数据 -->
      <div class="data-card">
        <h4>📅 时间线数据</h4>
        <button @click="loadTimelineData" :disabled="loading.timeline">
          {{ loading.timeline ? '加载中...' : '获取时间线数据' }}
        </button>
        <div v-if="timelineData" class="data-display">
          <p><strong>里程碑数量:</strong> {{ timelineData.stats?.totalEvents || 0 }}</p>
          <p><strong>活跃年数:</strong> {{ timelineData.stats?.yearsActive || 0 }}</p>
          <div class="timeline-list">
            <h5>重要事件:</h5>
            <div v-for="event in timelineData.timeline" :key="event.id" class="timeline-item">
              <div class="timeline-year">{{ event.year }}</div>
              <div class="timeline-content">
                <h6>{{ event.title }}</h6>
                <p>{{ event.description }}</p>
                <div class="achievements">
                  <span v-for="achievement in event.achievements" :key="achievement" class="achievement-tag">
                    {{ achievement }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 留言数据 -->
      <div class="data-card">
        <h4>💬 留言数据</h4>
        <button @click="loadMessagesData" :disabled="loading.messages">
          {{ loading.messages ? '加载中...' : '获取留言数据' }}
        </button>
        <div v-if="messagesData" class="data-display">
          <p><strong>已审核留言:</strong> {{ messagesData.stats?.approvedMessages || 0 }}</p>
          <p><strong>总点赞数:</strong> {{ messagesData.stats?.totalLikes || 0 }}</p>
          <div class="messages-list">
            <h5>精选留言:</h5>
            <div v-for="message in messagesData.messages?.slice(0, 3)" :key="message.id" class="message-item">
              <div class="message-avatar">
                <img :src="message.avatar" :alt="message.username">
              </div>
              <div class="message-content">
                <h6>{{ message.username }}</h6>
                <p>{{ message.message }}</p>
                <div class="message-meta">
                  <span>{{ formatTime(message.timestamp) }}</span>
                  <span>❤️ {{ message.likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 管理功能演示 -->
    <div class="admin-section">
      <h3>🔐 管理功能演示</h3>
      
      <!-- 登录区域 -->
      <div v-if="!isLoggedIn" class="login-card">
        <h4>管理员登录</h4>
        <div class="login-form">
          <input v-model="loginForm.username" placeholder="用户名" />
          <input v-model="loginForm.password" type="password" placeholder="密码" />
          <button @click="login" :disabled="logging">
            {{ logging ? '登录中...' : '登录' }}
          </button>
        </div>
      </div>

      <!-- 管理面板 -->
      <div v-else class="admin-panel">
        <div class="admin-header">
          <h4>👋 欢迎，{{ userInfo?.userName }}</h4>
          <button @click="logout" class="logout-btn">退出登录</button>
        </div>
        
        <div class="admin-actions">
          <button @click="loadAdminMessages" :disabled="loading.adminMessages">
            {{ loading.adminMessages ? '加载中...' : '获取管理员留言数据' }}
          </button>
          
          <div v-if="adminMessagesData" class="admin-data">
            <p><strong>待审核留言:</strong> {{ adminMessagesData.stats?.pendingMessages || 0 }}</p>
            <div class="pending-messages">
              <div v-for="message in adminMessagesData.messages?.filter(m => !m.approved)" :key="message.id" class="pending-message">
                <strong>{{ message.username }}:</strong>
                <p>{{ message.message }}</p>
                <small>{{ formatTime(message.timestamp) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      ❌ {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import dataApi from '../api/dataApi.js'

export default {
  name: 'ApiTestDemo',
  setup() {
    // 响应式数据
    const apiStatus = ref(false)
    const checking = ref(false)
    const error = ref('')
    
    // 加载状态
    const loading = reactive({
      music: false,
      timeline: false,
      messages: false,
      adminMessages: false
    })
    
    // 数据存储
    const musicData = ref(null)
    const timelineData = ref(null)
    const messagesData = ref(null)
    const adminMessagesData = ref(null)
    
    // 登录相关
    const isLoggedIn = ref(false)
    const logging = ref(false)
    const userInfo = ref(null)
    const loginForm = reactive({
      username: 'admin',
      password: 'LayMusic@2025'
    })

    // 检查API状态
    const checkStatus = async () => {
      checking.value = true
      try {
        apiStatus.value = await dataApi.checkApiStatus()
        error.value = ''
      } catch (err) {
        error.value = '无法连接到API服务'
        apiStatus.value = false
      } finally {
        checking.value = false
      }
    }

    // 加载音乐数据
    const loadMusicData = async () => {
      loading.music = true
      try {
        musicData.value = await dataApi.getMusicData()
        error.value = ''
      } catch (err) {
        error.value = '获取音乐数据失败: ' + err.message
      } finally {
        loading.music = false
      }
    }

    // 加载时间线数据
    const loadTimelineData = async () => {
      loading.timeline = true
      try {
        timelineData.value = await dataApi.getTimelineData()
        error.value = ''
      } catch (err) {
        error.value = '获取时间线数据失败: ' + err.message
      } finally {
        loading.timeline = false
      }
    }

    // 加载留言数据
    const loadMessagesData = async () => {
      loading.messages = true
      try {
        messagesData.value = await dataApi.getMessagesData()
        error.value = ''
      } catch (err) {
        error.value = '获取留言数据失败: ' + err.message
      } finally {
        loading.messages = false
      }
    }

    // 管理员登录
    const login = async () => {
      logging.value = true
      try {
        const token = await dataApi.adminLogin(loginForm.username, loginForm.password)
        dataApi.tokenManager.setToken(token)
        
        userInfo.value = await dataApi.getUserInfo(token)
        isLoggedIn.value = true
        error.value = ''
      } catch (err) {
        error.value = '登录失败: ' + err.message
      } finally {
        logging.value = false
      }
    }

    // 退出登录
    const logout = () => {
      dataApi.tokenManager.clearToken()
      isLoggedIn.value = false
      userInfo.value = null
      adminMessagesData.value = null
    }

    // 加载管理员留言数据
    const loadAdminMessages = async () => {
      loading.adminMessages = true
      try {
        const token = dataApi.tokenManager.getToken()
        adminMessagesData.value = await dataApi.getAdminMessagesData(token)
        error.value = ''
      } catch (err) {
        error.value = '获取管理员数据失败: ' + err.message
      } finally {
        loading.adminMessages = false
      }
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      return dataApi.formatTimestamp(timestamp)
    }

    // 组件挂载时检查状态
    onMounted(() => {
      checkStatus()
      
      // 检查是否已登录
      if (dataApi.tokenManager.hasToken()) {
        const token = dataApi.tokenManager.getToken()
        dataApi.getUserInfo(token)
          .then(info => {
            userInfo.value = info
            isLoggedIn.value = true
          })
          .catch(() => {
            // Token过期，清除
            dataApi.tokenManager.clearToken()
          })
      }
    })

    return {
      // 状态
      apiStatus,
      checking,
      error,
      loading,
      
      // 数据
      musicData,
      timelineData,
      messagesData,
      adminMessagesData,
      
      // 登录
      isLoggedIn,
      logging,
      userInfo,
      loginForm,
      
      // 方法
      checkStatus,
      loadMusicData,
      loadTimelineData,
      loadMessagesData,
      login,
      logout,
      loadAdminMessages,
      formatTime
    }
  }
}
</script>

<style scoped>
.api-test-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
  color: white;
  border-radius: 10px;
}

.demo-header h2 {
  margin: 0 0 10px 0;
  font-size: 2em;
}

.status-section, .data-section, .admin-section {
  margin-bottom: 30px;
}

.status-section h3, .data-section h3, .admin-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.status-card.online {
  border-color: #28a745;
  background: #d4edda;
}

.status-card.offline {
  border-color: #dc3545;
  background: #f8d7da;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-card.online .status-indicator {
  background: #28a745;
}

.status-card.offline .status-indicator {
  background: #dc3545;
}

.data-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.data-card h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.data-card button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
}

.data-card button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.data-card button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.data-display {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
}

.data-display p {
  margin: 5px 0;
  color: #555;
}

.albums-list, .timeline-list, .messages-list {
  margin-top: 15px;
}

.album-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 5px;
}

.album-cover {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

.album-info h6 {
  margin: 0 0 5px 0;
  color: #333;
}

.album-info p {
  margin: 2px 0;
  font-size: 0.9em;
  color: #666;
}

.timeline-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 5px;
}

.timeline-year {
  font-weight: bold;
  color: #667eea;
  min-width: 60px;
}

.timeline-content h6 {
  margin: 0 0 5px 0;
  color: #333;
}

.achievements {
  margin-top: 8px;
}

.achievement-tag {
  display: inline-block;
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  margin: 2px 4px 2px 0;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 5px;
}

.message-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content h6 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 0.9em;
}

.message-content p {
  margin: 0 0 8px 0;
  color: #555;
  font-size: 0.9em;
}

.message-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8em;
  color: #888;
}

.login-card, .admin-panel {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.login-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.login-form input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.admin-data {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.pending-message {
  background: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border-left: 4px solid #ffc107;
}

.pending-message strong {
  color: #333;
}

.pending-message p {
  margin: 5px 0;
  color: #555;
}

.pending-message small {
  color: #888;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 5px;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
}
</style> 