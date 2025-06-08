<template>
  <div class="admin-dashboard">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <h1 class="system-title">音乐后台管理系统</h1>
      </div>
      <div class="header-right">
        <span class="welcome-text">欢迎, {{ adminUser?.username || '管理员' }}</span>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </header>

    <div class="admin-content">
      <!-- 左侧导航栏 -->
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <ul class="nav-list">
            <li class="nav-item" :class="{ active: activeMenu === 'music' }">
              <a href="#" @click.prevent="setActiveMenu('music')" class="nav-link">
                <span class="nav-icon">🎵</span>
                <span class="nav-text">音乐作品维护</span>
              </a>
            </li>
            <!-- 未来可扩展更多菜单项 -->
          </ul>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="admin-main">
        <!-- 音乐作品维护页面 -->
        <div v-if="activeMenu === 'music'" class="music-management">
          <div class="page-header">
            <h2 class="page-title">音乐作品维护</h2>
            <button class="add-btn" @click="showAddModal = true">添加专辑</button>
          </div>

          <!-- 搜索栏 -->
          <div class="search-bar">
            <input 
              v-model="searchKeyword" 
              type="text" 
              placeholder="搜索专辑名称..." 
              class="search-input"
              @input="handleSearch"
            />
          </div>

          <!-- 专辑列表 -->
          <div class="album-list">
            <div class="list-header">
              <div class="header-item">专辑名</div>
              <div class="header-item">歌曲数</div>
              <div class="header-item">总时长</div>
              <div class="header-item">类型</div>
              <div class="header-item">发行年份</div>
              <div class="header-item">状态</div>
              <div class="header-item">操作</div>
            </div>

            <div v-if="loading" class="loading-row">
              <div class="loading-text">加载中...</div>
            </div>

            <div v-else-if="albumList.length === 0" class="empty-row">
              <div class="empty-text">暂无数据</div>
            </div>

            <div v-else>
              <div 
                v-for="album in albumList" 
                :key="album.encryptedId" 
                class="list-row"
              >
                <div class="row-item album-name">{{ album.albumTitle }}</div>
                <div class="row-item">{{ album.trackCount }}</div>
                <div class="row-item">{{ album.totalDuration }}</div>
                <div class="row-item">{{ album.genre }}</div>
                <div class="row-item">{{ album.releaseYear }}</div>
                <div class="row-item">
                  <span class="status-badge" :class="getStatusClass(album.status)">
                    {{ getStatusText(album.status) }}
                  </span>
                </div>
                <div class="row-item actions">
                  <button class="action-btn edit" @click="editAlbum(album)">编辑</button>
                  <button class="action-btn delete" @click="deleteAlbumConfirm(album)">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 添加/编辑专辑模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? '添加专辑' : '编辑专辑' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveAlbum">
            <div class="form-row">
              <div class="form-group">
                <label>专辑名 *</label>
                <input v-model="albumForm.albumTitle" type="text" required />
              </div>
              <div class="form-group">
                <label>歌曲数 *</label>
                <input v-model.number="albumForm.trackCount" type="number" min="1" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>总时长 *</label>
                <input v-model="albumForm.totalDuration" type="text" placeholder="格式：分:秒 (如 42:30)" required />
              </div>
              <div class="form-group">
                <label>歌曲类型 *</label>
                <select v-model="albumForm.genre" required>
                  <option value="">请选择</option>
                  <option value="流行">流行</option>
                  <option value="民谣">民谣</option>
                  <option value="摇滚">摇滚</option>
                  <option value="电子">电子</option>
                  <option value="嘻哈">嘻哈</option>
                  <option value="古典">古典</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>发行年份 *</label>
                <input v-model.number="albumForm.releaseYear" type="number" min="1900" :max="currentYear" required />
              </div>
              <div class="form-group">
                <label>网易云专辑ID</label>
                <input v-model="albumForm.neteaseAlbumId" type="text" />
              </div>
            </div>

            <div class="form-group full-width">
              <label>专辑描述</label>
              <textarea v-model="albumForm.description" rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>专辑封面地址</label>
                <input v-model="albumForm.coverImage" type="url" />
              </div>
              <div class="form-group">
                <label>背景图片地址</label>
                <input v-model="albumForm.backgroundImage" type="url" />
              </div>
            </div>

            <div class="form-group full-width">
              <label>成就（JSON格式）</label>
              <textarea v-model="albumForm.achievements" rows="3" placeholder='例如: {"award": "最佳专辑", "year": 2024}'></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeModal">取消</button>
              <button type="submit" class="save-btn" :disabled="saving">
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const activeMenu = ref('music')
    const loading = ref(false)
    const saving = ref(false)
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const searchKeyword = ref('')
    const albumList = ref([])
    const currentEditAlbum = ref(null)
    
    const adminUser = ref(null)
    
    const albumForm = reactive({
      albumTitle: '',
      trackCount: 1,
      totalDuration: '',
      genre: '',
      releaseYear: new Date().getFullYear(),
      description: '',
      achievements: '',
      neteaseAlbumId: '',
      backgroundImage: '',
      coverImage: ''
    })

    const currentYear = computed(() => new Date().getFullYear())

    onMounted(async () => {
      // 检查登录状态
      const token = localStorage.getItem('admin_token')
      const userStr = localStorage.getItem('admin_user')
      
      if (!token || !userStr) {
        router.push('/x-back')
        return
      }
      
      try {
        adminUser.value = JSON.parse(userStr)
      } catch (e) {
        console.error('用户信息解析失败:', e)
      }
      
      // 加载专辑列表
      await loadAlbumList()
    })

    const setActiveMenu = (menu) => {
      activeMenu.value = menu
    }

    const handleLogout = () => {
      if (confirm('确认退出登录？')) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        router.push('/x-back')
      }
    }

    const loadAlbumList = async () => {
      loading.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        albumList.value = [
                      {
              encryptedId: 'LM_demo1',
              albumTitle: '示例专辑1',
              trackCount: 12,
              totalDuration: '40:00',
              genre: '流行',
              releaseYear: 2024,
              description: '这是一个示例专辑',
              achievements: '{"award": "最佳专辑"}',
              status: 1
            },
            {
              encryptedId: 'LM_demo2',
              albumTitle: '示例专辑2',
              trackCount: 8,
              totalDuration: '30:00',
              genre: '民谣',
              releaseYear: 2023,
              description: '另一个示例专辑',
              achievements: '{}',
              status: 0
            }
        ]
      } catch (error) {
        console.error('加载专辑列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      console.log('搜索关键词:', searchKeyword.value)
    }

    const editAlbum = (album) => {
      currentEditAlbum.value = album
      Object.assign(albumForm, album)
      showEditModal.value = true
    }

    const deleteAlbumConfirm = async (album) => {
      if (!confirm(`确认删除专辑《${album.albumTitle}》？`)) {
        return
      }
      
      try {
        // 模拟删除API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        alert('删除成功')
        await loadAlbumList()
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败，请重试')
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      currentEditAlbum.value = null
      resetForm()
    }

    const resetForm = () => {
      Object.assign(albumForm, {
        albumTitle: '',
        trackCount: 1,
        totalDuration: '',
        genre: '',
        releaseYear: new Date().getFullYear(),
        description: '',
        achievements: '',
        neteaseAlbumId: '',
        backgroundImage: '',
        coverImage: ''
      })
    }

    const saveAlbum = async () => {
      saving.value = true
      
      try {
        // 模拟保存API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert(showAddModal.value ? '添加成功' : '更新成功')
        closeModal()
        await loadAlbumList()
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      } finally {
        saving.value = false
      }
    }



    const getStatusClass = (status) => {
      const statusMap = {
        0: 'draft',
        1: 'published',
        2: 'offline'
      }
      return statusMap[status] || 'draft'
    }

    const getStatusText = (status) => {
      const statusMap = {
        0: '未发布',
        1: '已发布',
        2: '已下线'
      }
      return statusMap[status] || '未知'
    }

    return {
      activeMenu,
      loading,
      saving,
      showAddModal,
      showEditModal,
      searchKeyword,
      albumList,
      albumForm,
      adminUser,
      currentYear,
      setActiveMenu,
      handleLogout,
      handleSearch,
      editAlbum,
      deleteAlbumConfirm,
      closeModal,
      saveAlbum,
      getStatusClass,
      getStatusText
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-header {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.system-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: #666;
  font-size: 0.9rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
}

.admin-content {
  display: flex;
  min-height: calc(100vh - 80px);
}

.admin-sidebar {
  width: 250px;
  background: #fff;
  border-right: 1px solid #e9ecef;
  padding: 2rem 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item.active .nav-link {
  background: #e3f2fd;
  color: #1976d2;
  border-right: 3px solid #1976d2;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #333;
}

.nav-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.admin-main {
  flex: 1;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #333;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  width: 300px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.album-list {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
}

.header-item {
  padding: 0 0.5rem;
}

.list-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  transition: background 0.2s ease;
}

.list-row:hover {
  background: #f8f9fa;
}

.row-item {
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
}

.album-name {
  font-weight: 500;
  color: #333;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
}

.status-badge.draft {
  background: #fef3cd;
  color: #856404;
}

.status-badge.published {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.offline {
  background: #f8d7da;
  color: #721c24;
}

.actions {
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn.edit {
  background: #17a2b8;
  color: white;
}

.action-btn.edit:hover {
  background: #138496;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.action-btn.delete:hover {
  background: #c82333;
}

.loading-row, .empty-row {
  padding: 3rem;
  text-align: center;
  color: #666;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}

.save-btn {
  background: #007bff;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #0056b3;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-content {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    order: 2;
  }
  
  .admin-main {
    order: 1;
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .list-header,
  .list-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .header-item,
  .row-item {
    padding: 0.25rem 0;
  }
}
</style> 