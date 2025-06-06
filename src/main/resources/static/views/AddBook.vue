<!-- src/views/AddBook.vue -->
<template>
  <div class="add-book-container">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ isEditMode ? '编辑人生故事' : '创建新的人生故事' }}</h1>
        <p class="page-subtitle">{{ isEditMode ? '修改您的人生轨迹' : '设计属于您的独特人生轨迹' }}</p>
        <button @click="goBack" class="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          返回书架
        </button>
      </div>
    </header>

    <!-- 表单内容 -->
    <main class="form-main">
      <div class="form-container">
        <form @submit.prevent="submitNewBook" class="book-form">
          <!-- 基本信息 -->
          <div class="form-section">
            <h3 class="section-title">
              <div class="title-icon">📝</div>
              基本信息
            </h3>
            
            <div class="form-group">
              <label class="form-label">书籍标题 *</label>
              <input 
                v-model="newBook.title"
                type="text" 
                class="form-input"
                placeholder="请输入书籍标题"
                required
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label class="form-label">作者 *</label>
              <input 
                v-model="newBook.author"
                type="text" 
                class="form-input"
                placeholder="请输入作者姓名"
                required
                maxlength="50"
              />
            </div>

            <div class="form-group">
              <label class="form-label">副标题</label>
              <input 
                v-model="newBook.subtitle"
                type="text" 
                class="form-input"
                placeholder="请输入副标题"
                maxlength="200"
              />
            </div>

            <div class="form-group">
              <label class="form-label">书籍描述 *</label>
              <textarea 
                v-model="newBook.description"
                class="form-textarea"
                placeholder="请描述这本书的人生故事主题"
                required
                maxlength="500"
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- 封面图片 -->
          <div class="form-section">
            <h3 class="section-title">
              <div class="title-icon">🖼️</div>
              封面图片
            </h3>
            
            <div class="image-upload-area">
              <div 
                class="upload-zone"
                :class="{ 'drag-over': isDragOver }"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleImageDrop"
                @click="$refs.imageInput.click()"
              >
                <div v-if="!newBook.coverPreview" class="upload-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <circle cx="10" cy="13" r="2"/>
                    <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22"/>
                  </svg>
                  <p class="upload-text">点击或拖拽上传封面图片</p>
                  <p class="upload-hint">支持 JPG、PNG 格式，建议尺寸 200x280</p>
                </div>
                
                <div v-else class="image-preview">
                  <img :src="newBook.coverPreview" alt="封面预览" class="preview-image" />
                  <div class="image-actions">
                    <button type="button" @click.stop="removeImage" class="action-btn remove-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                    <button type="button" @click.stop="$refs.imageInput.click()" class="action-btn change-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <input 
                ref="imageInput"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                @change="handleImageSelect"
                style="display: none"
              />
            </div>
          </div>

          <!-- 主题配置 -->
          <div class="form-section">
            <h3 class="section-title">
              <div class="title-icon">🎨</div>
              主题配置
            </h3>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">主题色</label>
                <div class="color-picker-group">
                  <input 
                    v-model="newBook.primaryColor"
                    type="color" 
                    class="color-picker"
                  />
                  <input 
                    v-model="newBook.primaryColor"
                    type="text" 
                    class="color-input"
                    placeholder="#86868b"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">起始年份</label>
                <input 
                  v-model.number="newBook.startYear"
                  type="number" 
                  class="form-input"
                  min="1900"
                  max="2100"
                  required
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">结束年份</label>
                <input 
                  v-model.number="newBook.endYear"
                  type="number" 
                  class="form-input"
                  min="1900"
                  max="2100"
                  required
                />
              </div>
            </div>

            <!-- 主题色预览 -->
            <div class="theme-preview">
              <p class="preview-label">主题效果预览</p>
              <div class="preview-card" :style="{ '--theme-color': newBook.primaryColor }">
                <div class="preview-content">
                  <h4 class="preview-title">{{ newBook.title || '书籍标题预览' }}</h4>
                  <p class="preview-subtitle">{{ newBook.subtitle || '副标题预览' }}</p>
                </div>
              </div>
            </div>
          </div>
        </form>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn btn-secondary">
            重置表单
          </button>
          <button 
            type="button" 
            @click="submitNewBook" 
            class="btn btn-primary"
            :disabled="!isFormValid || isSubmitting"
          >
            <span v-if="isSubmitting" class="loading-spinner"></span>
            {{ isSubmitting ? (isEditMode ? '保存中...' : '创建中...') : (isEditMode ? '保存修改' : '创建书籍') }}
          </button>
          
          <!-- 编辑时间线按钮（仅在编辑模式显示） -->
          <button 
            v-if="isEditMode" 
            type="button" 
            @click="goToTimelineEditor" 
            class="btn btn-event"
            :disabled="isSubmitting"
          >
            ✏️ 编辑时间线
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'

// 表单数据
const newBook = reactive({
  title: '',
  author: '',
  subtitle: '',
  description: '',
  primaryColor: '#86868b',
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear() + 30,
  coverFile: null,
  coverPreview: null
})

// 编辑模式相关
const isEditMode = ref(false)
const editBookId = ref('')

// 表单状态
const isSubmitting = ref(false)
const isDragOver = ref(false)

// 生成或获取用户Token
const getUserToken = () => {
  let userToken = localStorage.getItem('userToken')
  if (!userToken) {
    // 生成新的用户Token
    userToken = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('userToken', userToken)
  }
  return userToken
}

// 表单验证
const isFormValid = computed(() => {
  return newBook.title.trim() && 
         newBook.author.trim() && 
         newBook.description.trim() && 
         newBook.startYear && 
         newBook.endYear && 
         newBook.startYear < newBook.endYear
})

// 返回书架
const goBack = () => {
  if (confirm('确定要返回书架吗？未保存的内容将丢失。')) {
    window.close() // 关闭当前标签页
    // 如果无法关闭，则跳转回主页
    setTimeout(() => {
      window.location.href = '/'
    }, 100)
  }
}

// 重置表单
const resetForm = () => {
  if (confirm('确定要重置表单吗？')) {
    newBook.title = ''
    newBook.author = ''
    newBook.subtitle = ''
    newBook.description = ''
    newBook.primaryColor = '#86868b'
    newBook.startYear = new Date().getFullYear()
    newBook.endYear = new Date().getFullYear() + 30
    newBook.coverFile = null
    newBook.coverPreview = null
    isDragOver.value = false
  }
}

// 处理图片选择
const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processImageFile(file)
  }
}

// 处理图片拖拽
const handleImageDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processImageFile(file)
  }
}

// 处理图片文件
const processImageFile = (file) => {
  // 验证文件类型
  if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
    alert('请选择 JPG 或 PNG 格式的图片')
    return
  }
  
  // 验证文件大小（限制5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB')
    return
  }
  
  newBook.coverFile = file
  
  // 创建预览
  const reader = new FileReader()
  reader.onload = (e) => {
    newBook.coverPreview = e.target.result
  }
  reader.readAsDataURL(file)
}

// 移除图片
const removeImage = () => {
  newBook.coverFile = null
  newBook.coverPreview = null
}

// 检查是否为编辑模式
const checkEditMode = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const editId = urlParams.get('edit')
  if (editId) {
    isEditMode.value = true
    editBookId.value = editId
    loadBookForEdit(editId)
  }
}

// 加载书籍信息用于编辑
const loadBookForEdit = async (bookId) => {
  try {
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/books/${bookId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const book = await response.json()
      // 填充表单数据
      newBook.title = book.title || ''
      newBook.author = book.author || ''
      newBook.subtitle = book.subtitle || ''
      newBook.description = book.description || ''
      newBook.primaryColor = book.theme?.primaryColor || '#86868b'
      newBook.startYear = book.theme?.startYear || new Date().getFullYear()
      newBook.endYear = book.theme?.endYear || new Date().getFullYear() + 30
      
      // 设置封面预览
      if (book.cover) {
        newBook.coverPreview = book.cover
      }
      
      console.log('成功加载书籍信息:', book)
    } else {
      console.error('加载书籍信息失败:', response.status)
      alert('加载书籍信息失败，请稍后重试')
    }
  } catch (error) {
    console.error('加载书籍信息时发生错误:', error)
    alert('网络错误，请检查连接后重试')
  }
}

// 提交新增书籍
const submitNewBook = async () => {
  if (!isFormValid.value || isSubmitting.value) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    if (isEditMode.value) {
      // 编辑模式 - 更新书籍
      await updateBook()
    } else {
      // 新增模式 - 创建书籍
      await createBook()
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert('网络错误，请检查连接后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 创建新书籍
const createBook = async () => {
    // 生成书籍代码（基于标题的拼音或英文）
    const bookCode = generateBookCode(newBook.title)
    
    // 准备表单数据
    const formData = new FormData()
    formData.append('bookCode', bookCode)
    formData.append('title', newBook.title)
  formData.append('author', newBook.author)
    formData.append('subtitle', newBook.subtitle || '')
    formData.append('description', newBook.description)
    formData.append('startYear', newBook.startYear.toString())
    formData.append('endYear', newBook.endYear.toString())
    formData.append('primaryColor', newBook.primaryColor)
  formData.append('userToken', getUserToken())
    
    if (newBook.coverFile) {
      formData.append('coverImage', newBook.coverFile)
    }
    
    // 发送请求到后端
    const response = await fetch('http://localhost:8080/fate-echoes/api/v1/books', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('书籍创建成功:', result)
      
      alert('书籍创建成功！即将返回书架页面。')
      
      // 返回书架页面
      window.location.href = '/'
    } else {
      const error = await response.text()
      console.error('创建失败:', error)
      alert('创建失败，请稍后重试')
    }
}

// 更新书籍
const updateBook = async () => {
  // 准备表单数据
  const formData = new FormData()
  formData.append('title', newBook.title)
  formData.append('author', newBook.author)
  formData.append('subtitle', newBook.subtitle || '')
  formData.append('description', newBook.description)
  formData.append('startYear', newBook.startYear.toString())
  formData.append('endYear', newBook.endYear.toString())
  formData.append('primaryColor', newBook.primaryColor)
  formData.append('userToken', getUserToken())
  
  if (newBook.coverFile) {
    formData.append('coverImage', newBook.coverFile)
  }
  
  // 发送更新请求到后端
  const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/books/${editBookId.value}`, {
    method: 'PUT',
    body: formData
  })
  
  if (response.ok) {
    const result = await response.json()
    console.log('书籍更新成功:', result)
    
    alert('书籍更新成功！')
    
    // 可以选择返回书架页面或留在当前页面
    // window.location.href = '/'
  } else {
    const error = await response.text()
    console.error('更新失败:', error)
    alert('更新失败，请稍后重试')
  }
}

// 生成书籍代码
const generateBookCode = (title) => {
  // 简单的代码生成逻辑
  const timestamp = Date.now().toString().slice(-6)
  const titleCode = title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 10)
  return `${titleCode}_${timestamp}`
}

// 编辑时间线
const goToTimelineEditor = () => {
  // 跳转到时间线编辑页面，传递书籍ID
  const bookId = isEditMode.value ? editBookId.value : 'new'
  window.open(`/timeline-editor/${bookId}`, '_blank')
}

// 页面加载时检查编辑模式
onMounted(() => {
  checkEditMode()
})
</script>

<style scoped>
.add-book-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
}

/* 页面头部 */
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 2rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  text-align: center;
  margin: 0;
}

.back-button {
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.back-button:hover {
  background: #495057;
  transform: translateY(-50%) translateX(-2px);
}

/* 表单主体 */
.form-main {
  padding: 3rem 2rem;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007aff;
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

.color-picker-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-picker {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.color-picker:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.color-input {
  width: 140px;
  font-family: monospace;
  text-transform: uppercase;
}

/* 图片上传区域 */
.image-upload-area {
  margin-top: 1rem;
}

.upload-zone {
  width: 100%;
  height: 240px;
  border: 2px dashed #86868b;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-zone:hover {
  border-color: #007aff;
  background: rgba(0, 122, 255, 0.05);
}

.upload-zone.drag-over {
  border-color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  transform: scale(1.02);
}

.upload-placeholder {
  text-align: center;
  color: #86868b;
}

.upload-placeholder svg {
  margin-bottom: 1rem;
  color: #86868b;
}

.upload-text {
  margin: 0.5rem 0;
  font-weight: 500;
  color: #1d1d1f;
  font-size: 1.1rem;
}

.upload-hint {
  margin: 0;
  font-size: 0.9rem;
  color: #86868b;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-actions {
  opacity: 1;
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #1d1d1f;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: white;
  transform: scale(1.1);
}

/* 主题预览 */
.theme-preview {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.preview-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 1rem;
}

.preview-card {
  background: linear-gradient(135deg, var(--theme-color), color-mix(in srgb, var(--theme-color) 85%, black));
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.preview-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.preview-subtitle {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #495057;
  transform: translateY(-2px);
}

.btn-primary {
  background: #007aff;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #0056cc;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4);
}

.btn-event {
  background: linear-gradient(135deg, #34c759, #28a745);
  color: white;
  box-shadow: 0 4px 15px rgba(52, 199, 89, 0.3);
}

.btn-event:hover:not(:disabled) {
  background: linear-gradient(135deg, #28a745, #20754e);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 199, 89, 0.4);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .back-button {
    position: static;
    margin-bottom: 1rem;
    align-self: flex-start;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .color-picker-group {
    justify-content: flex-start;
  }
}
</style> 