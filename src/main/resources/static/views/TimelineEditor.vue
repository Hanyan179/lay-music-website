<template>
  <div class="timeline-editor-container" :style="containerStyle">
    <!-- 加载状态 -->
    <div v-if="!bookData && !loadError" class="loading-overlay">
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <h2 class="loading-title">正在加载书籍信息...</h2>
        <p class="loading-subtitle">请稍候，正在为您准备编辑器</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="loadError" class="error-overlay">
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">加载失败</h2>
        <p class="error-message">{{ loadError }}</p>
        <button @click="goBack" class="error-button">返回</button>
      </div>
    </div>

    <!-- 主要内容 -->
    <template v-if="bookData && !loadError">
      <!-- 头部工具栏 -->
      <header class="editor-header">
        <div class="header-content">
          <div class="header-left">
            <button @click="goBack" class="back-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              返回
            </button>
            <div class="book-info">
              <h1 class="book-title">{{ bookData?.title || '时间线编辑器' }}</h1>
              <p class="book-author">作者：{{ bookData?.author || '未知' }}</p>
            </div>
          </div>
          
          <div class="header-actions">
            <button @click="uploadBackground" class="background-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14,2 14,8 20,8"/>
                <circle cx="10" cy="13" r="2"/>
                <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22"/>
              </svg>
              上传背景
            </button>
            
            <button @click="previewTimeline" class="preview-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              预览
            </button>
            
            <button @click="saveCurrentYear" class="save-btn" :disabled="isSaving">
              <span v-if="isSaving" class="loading-spinner"></span>
              {{ isSaving ? '保存中...' : '保存当前年' }}
            </button>
          </div>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <div class="editor-main">
        <!-- 左侧边栏 - 基本信息和年份列表 -->
        <aside class="editor-sidebar">
          <div class="sidebar-section">
            <h3>基本信息</h3>
            
            <div class="form-group">
              <label>副标题</label>
              <input 
                v-model="bookData.subtitle" 
                type="text" 
                class="form-input"
                :placeholder="`见证${bookData?.theme?.startYear || 1995}-${bookData?.theme?.endYear || 2025}年的人生历程`"
              />
            </div>
            
            <div class="form-group">
              <label>时间范围</label>
              <div class="year-range">
                <input 
                  v-model.number="bookData.theme.startYear" 
                  type="number" 
                  class="form-input"
                  min="1900" 
                  max="2100"
                />
                <span>-</span>
                <input 
                  v-model.number="bookData.theme.endYear" 
                  type="number" 
                  class="form-input"
                  min="1900" 
                  max="2100"
                />
              </div>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3>年份列表</h3>
            <div class="year-list">
              <div 
                v-for="year in yearList" 
                :key="year"
                @click="selectYear(year)"
                :class="['year-item', { 'active': selectedYear === year, 'has-events': hasEventsInYear(year) }]"
              >
                <span class="year-number">{{ year }}</span>
                <span class="event-count" v-if="hasEventsInYear(year)">
                  {{ getEventCountInYear(year) }}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <!-- 中间区域 - 人生抉择事件编辑 -->
        <main class="choice-events-panel">
          <div class="panel-header">
            <h2>{{ selectedYear }}年 - 人生抉择事件</h2>
            <button @click="addChoiceEvent" class="add-choice-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              添加人生抉择
            </button>
          </div>

          <div class="choice-events-list">
            <div 
              v-for="(choice, index) in currentYearChoices" 
              :key="choice.id || index"
              class="choice-card"
            >
              <div class="choice-header">
                <input 
                  v-model="choice.eventCode" 
                  type="text" 
                  class="choice-code-input"
                  placeholder="事件代码(如A,B,C)"
                  maxlength="5"
                />
                <input 
                  v-model="choice.question" 
                  type="text" 
                  class="choice-question-input"
                  placeholder="人生抉择问题"
                />
                <button @click="removeChoiceEvent(index)" class="remove-choice-btn">
                  删除
                </button>
              </div>
              
              <div class="choice-content">
                <div class="form-group">
                  <label>问题描述</label>
                  <textarea 
                    v-model="choice.description" 
                    class="form-textarea"
                    placeholder="详细描述这个人生抉择的背景..."
                    rows="2"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label>媒体文件</label>
                  <div class="media-upload-section">
                    <button @click="uploadChoiceMedia(choice)" class="media-upload-btn" :disabled="choice.uploading">
                      <span v-if="choice.uploading" class="loading-spinner-small"></span>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <circle cx="10" cy="13" r="2"/>
                        <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22"/>
                      </svg>
                      {{ choice.uploading ? '上传中...' : '上传图片/视频' }}
                    </button>
                    <div v-if="choice.mediaUrl" class="media-preview">
                      <img v-if="choice.mediaType === 'image'" :src="'http://localhost:8080' + choice.mediaUrl" alt="预览" class="media-preview-img" />
                      <video v-else-if="choice.mediaType === 'video'" :src="'http://localhost:8080' + choice.mediaUrl" controls class="media-preview-video"></video>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>选项列表</label>
                  <div class="options-list">
                    <div 
                      v-for="(option, optionIndex) in choice.options" 
                      :key="optionIndex"
                      class="option-item"
                    >
                      <input 
                        v-model="option.optionText" 
                        type="text" 
                        class="option-text-input"
                        placeholder="选项内容"
                      />
                      <textarea 
                        v-model="option.effect" 
                        class="option-effect-textarea"
                        placeholder="影响描述（详细描述选择这个选项后会发生什么...）"
                        rows="2"
                      ></textarea>
                      <select v-model="option.actionType" class="option-action-select">
                        <option value="SHOW_EFFECT">显示影响</option>
                        <option value="JUMP_TO_NEXT">跳转下一个</option>
                      </select>
                      <input 
                        v-if="option.actionType === 'JUMP_TO_NEXT'"
                        v-model="option.nextEventCode" 
                        type="text" 
                        class="option-next-input"
                        placeholder="下一事件代码"
                      />
                      <label class="option-checkbox">
                        <input type="checkbox" v-model="option.isNextYear" />
                        下一年
                      </label>
                      <button @click="removeOption(choice, optionIndex)" class="remove-option-btn">×</button>
                    </div>
                    <button @click="addOption(choice)" class="add-option-btn">
                      + 添加选项
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentYearChoices.length === 0" class="no-events">
              <div class="no-events-icon">🤔</div>
              <p>{{ selectedYear }}年暂无人生抉择</p>
              <button @click="addChoiceEvent" class="add-first-event-btn">
                添加第一个人生抉择
              </button>
            </div>
          </div>
        </main>

        <!-- 右侧区域 - 年度事件编辑 -->
        <aside class="editor-content">
          <div class="content-header">
            <h3>{{ selectedYear }}年 - 年度事件</h3>
            <button @click="addYearEvent" class="add-event-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              添加年度事件
            </button>
          </div>

          <!-- 年度事件列表 -->
          <div class="year-events-list">
            <div 
              v-for="(event, index) in currentYearEvents" 
              :key="event.id || index"
              class="event-card"
            >
              <div class="event-header">
                <input 
                  v-model="event.title" 
                  type="text" 
                  class="event-title-input"
                  placeholder="事件标题"
                />
                <button @click="removeYearEvent(index)" class="remove-event-btn">
                  删除
                </button>
              </div>
              
              <div class="event-content">
                <div class="form-group">
                  <label>事件描述</label>
                  <textarea 
                    v-model="event.description" 
                    class="form-textarea"
                    placeholder="详细描述这个事件..."
                    rows="3"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label>媒体文件</label>
                  <div class="media-upload-section">
                    <button @click="uploadEventMedia(event)" class="media-upload-btn" :disabled="event.uploading">
                      <span v-if="event.uploading" class="loading-spinner-small"></span>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <circle cx="10" cy="13" r="2"/>
                        <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22"/>
                      </svg>
                      {{ event.uploading ? '上传中...' : '上传图片/视频' }}
                    </button>
                    <div v-if="event.mediaUrl" class="media-preview">
                      <img v-if="event.mediaType === 'image'" :src="'http://localhost:8080' + event.mediaUrl" alt="预览" class="media-preview-img" />
                      <video v-else-if="event.mediaType === 'video'" :src="'http://localhost:8080' + event.mediaUrl" controls class="media-preview-video"></video>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>事件标签</label>
                  <div class="tags-input">
                    <div class="tags-list">
                      <span 
                        v-for="(tag, tagIndex) in event.tags" 
                        :key="tagIndex"
                        class="tag-item"
                      >
                        {{ tag }}
                        <button @click="removeTag(event, tagIndex)" class="tag-remove">×</button>
                      </span>
                    </div>
                    <input 
                      v-model="newTag"
                      @keyup.enter="addTag(event)"
                      type="text" 
                      class="tag-input"
                      placeholder="输入标签并按回车"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>影响等级</label>
                  <select v-model="event.impact" class="form-select">
                    <option value="低">低</option>
                    <option value="中等">中等</option>
                    <option value="高">高</option>
                    <option value="极高">极高</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div v-if="currentYearEvents.length === 0" class="no-events">
              <div class="no-events-icon">📅</div>
              <p>{{ selectedYear }}年暂无事件</p>
              <button @click="addYearEvent" class="add-first-event-btn">
                添加第一个事件
              </button>
            </div>
          </div>
        </aside>
      </div>

      <!-- 年份切换提示 -->
      <div v-if="showYearSavePrompt" class="year-save-prompt">
        <div class="prompt-overlay" @click="cancelYearChange"></div>
        <div class="prompt-card">
          <h3>保存当前年份数据？</h3>
          <p>您即将切换到{{ pendingYear }}年，是否保存{{ selectedYear }}年的修改？</p>
          <div class="prompt-actions">
            <button @click="cancelYearChange" class="cancel-btn">取消</button>
            <button @click="discardAndSwitch" class="discard-btn">不保存</button>
            <button @click="saveAndSwitch" class="save-btn">保存并切换</button>
          </div>
        </div>
      </div>
    </template>

    <!-- 隐藏的文件输入 -->
    <input 
      ref="backgroundInput" 
      type="file" 
      accept="image/*,video/*" 
      @change="handleBackgroundUpload" 
      style="display: none"
    />
    <input 
      ref="mediaInput" 
      type="file" 
      accept="image/*,video/*" 
      @change="handleMediaUpload" 
      style="display: none"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 响应式数据
const bookData = ref(null)
const selectedYear = ref(1995)
const isSaving = ref(false)
const newTag = ref('')
const loadError = ref(null)

// 页面背景相关数据
const pageBackgroundImage = ref(null)
const pageBackgroundType = ref('default') // 'default', 'image', 'video'
const backgroundInput = ref(null)
const mediaInput = ref(null)

// 年份切换提示相关
const showYearSavePrompt = ref(false)
const pendingYear = ref(null)

// 当前操作的媒体目标（用于媒体上传）
const currentMediaTarget = ref(null)

// 模拟的年度事件和人生抉择数据
const yearEvents = reactive({})
const choiceEvents = reactive({})

// 计算属性
const yearList = computed(() => {
  if (!bookData.value?.theme) return []
  const start = bookData.value.theme.startYear || 1995
  const end = bookData.value.theme.endYear || 2025
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const currentYearEvents = computed(() => {
  return yearEvents[selectedYear.value] || []
})

const currentYearChoices = computed(() => {
  return choiceEvents[selectedYear.value] || []
})

const containerStyle = computed(() => {
  const style = {}
  if (pageBackgroundImage.value) {
    if (pageBackgroundType.value === 'image') {
      // 如果背景图片路径不是完整URL，则加上服务器地址前缀
      const imageUrl = pageBackgroundImage.value.startsWith('http') 
        ? pageBackgroundImage.value 
        : 'http://localhost:8080' + pageBackgroundImage.value
      style.backgroundImage = `url(${imageUrl})`
      style.backgroundSize = 'cover'
      style.backgroundPosition = 'center'
      style.backgroundRepeat = 'no-repeat'
    }
  }
  return style
})

// 页面加载时初始化
onMounted(async () => {
  await loadBookData()
  await initializeYearData()
})

// 加载书籍数据
const loadBookData = async () => {
  let bookId = route.params.bookId || route.query.bookId
  console.log('原始书籍ID:', bookId)
  
  if (!bookId) {
    loadError.value = '缺少书籍ID参数'
    return
  }

  // 不要去掉下划线前缀，直接传递完整参数给后端
  console.log('传递给后端的书籍ID:', bookId)

  try {
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/books/${bookId}`)
    console.log('API响应状态:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('获取到的书籍数据:', data)
      bookData.value = data
      selectedYear.value = data.theme?.startYear || 1995
    } else {
      const errorText = await response.text()
      console.error('API响应错误:', errorText)
      throw new Error(`获取书籍信息失败: ${response.status}`)
    }
  } catch (error) {
    console.error('加载书籍数据失败:', error)
    loadError.value = error.message
  }
}

// 初始化年份数据
const initializeYearData = async () => {
  yearList.value.forEach(year => {
    if (!yearEvents[year]) {
      yearEvents[year] = []
    }
    if (!choiceEvents[year]) {
      choiceEvents[year] = []
    }
  })
  
  // 加载当前年份的数据
  if (selectedYear.value) {
    await loadYearData(selectedYear.value)
  }
  
  // 加载年份概览
  await loadYearSummary()
}

// 选择年份
const selectYear = async (year) => {
  if (hasUnsavedChanges()) {
    showYearSavePrompt.value = true
    pendingYear.value = year
  } else {
    selectedYear.value = year
    // 加载该年份的数据
    await loadYearData(year)
  }
}

// 检查是否有未保存的更改
const hasUnsavedChanges = () => {
  return currentYearEvents.value.length > 0 || currentYearChoices.value.length > 0
}

// 检查年份是否有事件
const hasEventsInYear = (year) => {
  return (yearEvents[year] && yearEvents[year].length > 0) || 
         (choiceEvents[year] && choiceEvents[year].length > 0)
}

// 获取年份事件数量
const getEventCountInYear = (year) => {
  const yearEventCount = yearEvents[year] ? yearEvents[year].length : 0
  const choiceEventCount = choiceEvents[year] ? choiceEvents[year].length : 0
  return yearEventCount + choiceEventCount
}

// 添加年度事件
const addYearEvent = () => {
  if (!yearEvents[selectedYear.value]) {
    yearEvents[selectedYear.value] = []
  }
  
  yearEvents[selectedYear.value].push({
    id: Date.now(),
    title: '',
    description: '',
    date: `${selectedYear.value}年`,
    impact: '中等',
    tags: [],
    mediaType: null,
    mediaUrl: null,
    mediaPoster: null
  })
}

// 删除年度事件
const removeYearEvent = (index) => {
  if (confirm('确定要删除这个年度事件吗？')) {
    yearEvents[selectedYear.value].splice(index, 1)
  }
}

// 添加人生抉择事件
const addChoiceEvent = () => {
  if (!choiceEvents[selectedYear.value]) {
    choiceEvents[selectedYear.value] = []
  }
  
  choiceEvents[selectedYear.value].push({
    id: Date.now(),
    eventCode: '',
    question: '',
    description: '',
    mediaType: null,
    mediaUrl: null,
    mediaPoster: null,
    isStartingEvent: false,
    displayOrder: 0,
    options: []
  })
}

// 删除人生抉择事件
const removeChoiceEvent = (index) => {
  if (confirm('确定要删除这个人生抉择吗？')) {
    choiceEvents[selectedYear.value].splice(index, 1)
  }
}

// 添加选项
const addOption = (choice) => {
  choice.options.push({
    optionText: '',
    effect: '',
    nextEventCode: '',
    isNextYear: false,
    actionType: 'SHOW_EFFECT', // 默认显示影响
    sortOrder: choice.options.length
  })
}

// 删除选项
const removeOption = (choice, index) => {
  choice.options.splice(index, 1)
  // 重新排序
  choice.options.forEach((option, idx) => {
    option.sortOrder = idx
  })
}

// 添加标签
const addTag = (event) => {
  if (newTag.value.trim() && !event.tags.includes(newTag.value.trim())) {
    event.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

// 删除标签
const removeTag = (event, index) => {
  event.tags.splice(index, 1)
}

// 背景上传
const uploadBackground = () => {
  backgroundInput.value.click()
}

const handleBackgroundUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    alert('请选择图片或视频文件')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('文件大小不能超过 10MB')
    return
  }

  try {
    // 确定文件类型
    const fileType = file.type.startsWith('image/') ? 'image' : 'video'
    
    // 创建FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', fileType)
    formData.append('bookId', bookData.value.id.toString())
    
    // 调用后端API上传文件
    const response = await fetch('http://localhost:8080/fate-echoes/api/v1/media/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        // 设置背景文件URL和类型
        pageBackgroundImage.value = result.fileUrl
        pageBackgroundType.value = result.fileType
        
        console.log('背景上传成功:', result)
        alert('背景文件上传成功！')
      } else {
        alert('上传失败：' + result.message)
      }
    } else {
      const errorText = await response.text()
      alert('上传失败：服务器错误 ' + response.status)
      console.error('上传失败:', errorText)
    }
    
  } catch (error) {
    console.error('背景上传失败:', error)
    alert('上传失败：网络错误，请检查连接后重试')
  }
}

// 人生抉择媒体上传
const uploadChoiceMedia = (choice) => {
  currentMediaTarget.value = { type: 'choice', target: choice }
  mediaInput.value.click()
}

// 年度事件媒体上传
const uploadEventMedia = (event) => {
  currentMediaTarget.value = { type: 'event', target: event }
  mediaInput.value.click()
}

// 处理媒体上传
const handleMediaUpload = async (e) => {
  const file = e.target.files[0]
  if (!file || !currentMediaTarget.value) return

  // 验证文件类型
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    alert('请选择图片或视频文件')
    return
  }

  // 验证文件大小（限制10MB）
  if (file.size > 10 * 1024 * 1024) {
    alert('文件大小不能超过 10MB')
    return
  }

  try {
    // 确定文件类型
    const fileType = file.type.startsWith('image/') ? 'image' : 'video'
    
    // 创建FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', fileType)
    formData.append('bookId', bookData.value.id.toString())
    
    // 显示上传进度
    const target = currentMediaTarget.value.target
    target.uploading = true
    
    // 调用后端API上传文件
    const response = await fetch('http://localhost:8080/fate-echoes/api/v1/media/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        // 设置文件URL和类型
        target.mediaUrl = result.fileUrl
        target.mediaType = result.fileType
        
        // 如果是视频，可以设置poster（这里暂时使用默认值）
        if (target.mediaType === 'video') {
          target.mediaPoster = null
        }
        
        console.log('媒体上传成功:', result)
        alert('文件上传成功！')
      } else {
        alert('上传失败：' + result.message)
      }
    } else {
      const errorText = await response.text()
      alert('上传失败：服务器错误 ' + response.status)
      console.error('上传失败:', errorText)
    }
    
  } catch (error) {
    console.error('上传失败:', error)
    alert('上传失败：网络错误，请检查连接后重试')
  } finally {
    // 清除上传状态
    if (currentMediaTarget.value?.target) {
      currentMediaTarget.value.target.uploading = false
    }
    currentMediaTarget.value = null
  }
}

// 保存当前年份数据
const saveCurrentYear = async () => {
  if (isSaving.value) return
  
  isSaving.value = true
  
  try {
    // 准备保存数据
    const saveData = {
      bookId: bookData.value.id,
      year: selectedYear.value,
      backgroundImage: pageBackgroundImage.value,
      backgroundType: pageBackgroundType.value,
      events: currentYearEvents.value.map(event => ({
        id: event.id,
        title: event.title || '',
        description: event.description || '',
        mediaType: event.mediaType,
        mediaUrl: event.mediaUrl,
        mediaPoster: event.mediaPoster,
        impact: event.impact || '中等',
        tags: event.tags || [],
        displayOrder: event.displayOrder || 0,
        date: event.date
      })),
      choiceEvents: currentYearChoices.value.map(choice => ({
        id: choice.id,
        eventCode: choice.eventCode || '',
        question: choice.question || '',
        description: choice.description || '',
        mediaType: choice.mediaType,
        mediaUrl: choice.mediaUrl,
        mediaPoster: choice.mediaPoster,
        isStartingEvent: choice.isStartingEvent || false,
        displayOrder: choice.displayOrder || 0,
        options: (choice.options || []).map(option => ({
          optionText: option.optionText || '',
          effect: option.effect || '',
          nextEventCode: option.nextEventCode || '',
          isNextYear: option.isNextYear || false,
          actionType: option.actionType || 'SHOW_EFFECT',
          sortOrder: option.sortOrder || 0
        }))
      }))
    }
    
    console.log('保存数据:', saveData)
    
    // 调用后端API保存数据
    const response = await fetch('http://localhost:8080/fate-echoes/api/v1/timeline-editor/save-year', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveData)
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        alert(`${selectedYear.value}年的数据保存成功！保存了 ${result.eventCount} 个年度事件和 ${result.choiceCount} 个人生抉择事件。`)
        // 刷新年份概览
        await loadYearSummary()
      } else {
        alert('保存失败：' + result.message)
      }
    } else {
      const errorText = await response.text()
      alert('保存失败：服务器错误 ' + response.status)
      console.error('保存失败:', errorText)
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败：网络错误，请检查连接后重试')
  } finally {
    isSaving.value = false
  }
}

// 加载指定年份的数据
const loadYearData = async (year) => {
  if (!bookData.value?.id) return
  
  try {
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/timeline-editor/load-year/${bookData.value.id}/${year}`)
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        // 加载年度事件
        yearEvents[year] = (result.events || []).map(event => ({
          id: event.id,
          title: event.title || '',
          description: event.description || '',
          date: `${year}年`,
          impact: event.impact || '中等',
          tags: parseJsonTags(event.tags) || [],
          mediaType: event.mediaType,
          mediaUrl: event.mediaUrl,
          mediaPoster: event.mediaPoster,
          displayOrder: event.displayOrder || 0
        }))
        
        // 加载人生抉择事件
        choiceEvents[year] = (result.choiceEvents || []).map(choice => ({
          id: choice.id,
          eventCode: choice.eventCode || '',
          question: choice.question || '',
          description: choice.description || '',
          mediaType: choice.mediaType,
          mediaUrl: choice.mediaUrl,
          mediaPoster: choice.mediaPoster,
          isStartingEvent: choice.isStartingEvent || false,
          displayOrder: choice.displayOrder || 0,
          options: (choice.options || []).map(option => ({
            optionText: option.optionText || '',
            effect: option.effect || '',
            nextEventCode: option.nextEventCode || '',
            isNextYear: option.isNextYear || false,
            actionType: option.actionType || 'SHOW_EFFECT',
            sortOrder: option.sortOrder || 0
          }))
        }))
        
        console.log(`成功加载${year}年数据:`, {
          events: yearEvents[year].length,
          choices: choiceEvents[year].length
        })
      }
    }
  } catch (error) {
    console.error(`加载${year}年数据失败:`, error)
  }
}

// 加载年份概览
const loadYearSummary = async () => {
  if (!bookData.value?.id) return
  
  try {
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/timeline-editor/year-summary/${bookData.value.id}`)
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        // 这里可以根据概览数据更新UI显示
        console.log('年份概览:', result)
      }
    }
  } catch (error) {
    console.error('加载年份概览失败:', error)
  }
}

// 解析JSON标签
const parseJsonTags = (jsonStr) => {
  if (!jsonStr) return []
  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.warn('解析标签JSON失败:', jsonStr)
    return []
  }
}

// 年份切换相关方法
const cancelYearChange = () => {
  showYearSavePrompt.value = false
  pendingYear.value = null
}

const discardAndSwitch = async () => {
  selectedYear.value = pendingYear.value
  // 加载新年份的数据
  await loadYearData(pendingYear.value)
  showYearSavePrompt.value = false
  pendingYear.value = null
}

const saveAndSwitch = async () => {
  await saveCurrentYear()
  selectedYear.value = pendingYear.value
  // 加载新年份的数据
  await loadYearData(pendingYear.value)
  showYearSavePrompt.value = false
  pendingYear.value = null
}

// 预览时间线
const previewTimeline = () => {
  const bookId = bookData.value?.id
  if (bookId) {
    window.open(`/timeline/${bookId}`, '_blank')
  }
}

// 返回
const goBack = () => {
  if (hasUnsavedChanges()) {
    if (confirm('确定要返回吗？未保存的更改将丢失。')) {
      router.back()
    }
  } else {
    router.back()
  }
}
</script>

<style scoped>
.timeline-editor-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
  position: relative;
}

/* 加载和错误状态样式 */
.loading-overlay, .error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-overlay {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
}

.error-overlay {
  background: linear-gradient(135deg, #fee 0%, #fdd 50%, #fee 100%);
}

.loading-container, .error-container {
  text-align: center;
  max-width: 400px;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 122, 255, 0.2);
  border-top: 4px solid #007aff;
  border-radius: 50%;
  animation: loadingSpin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes loadingSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: loadingSpin 1s linear infinite;
  display: inline-block;
}

.media-upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-title, .error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.5rem 0;
}

.error-title {
  color: #ff3b30;
}

.loading-subtitle, .error-message {
  color: #86868b;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.error-button {
  background: #007aff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

/* 头部样式 */
.editor-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #495057;
}

.book-info {
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

.book-author {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.background-btn, .preview-btn, .save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.background-btn {
  background: #007bff;
  color: white;
}

.background-btn:hover {
  background: #0056b3;
}

.preview-btn {
  background: #6f42c1;
  color: white;
}

.preview-btn:hover {
  background: #563d7c;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #1e7e34;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 主要内容区域 */
.editor-main {
  flex: 1;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

/* 左侧边栏 */
.editor-sidebar {
  width: 280px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  height: fit-content;
  min-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.sidebar-section {
  margin-bottom: 2rem;
  flex-shrink: 0;
}

.sidebar-section:last-child {
  flex: 1;
  margin-bottom: 0;
}

.sidebar-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 1rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #007bff;
}

.year-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.year-range input {
  flex: 1;
}

/* 年份列表 */
.year-list {
  max-height: none;
  overflow-y: auto;
  flex: 1;
}

.year-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.25rem;
}

.year-item:hover {
  background: #f8f9fa;
}

.year-item.active {
  background: #007bff;
  color: white;
}

.year-item.has-events .year-number {
  font-weight: 600;
}

.event-count {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* 中间内容区域 - 人生抉择面板 */
.choice-events-panel {
  flex: 2;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.panel-header h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.add-choice-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.add-choice-btn:hover {
  background: #1e7e34;
}

/* 人生抉择卡片 */
.choice-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f8f9fa;
}

.choice-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.choice-code-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
}

.choice-question-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
}

.remove-choice-btn {
  padding: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-choice-btn:hover {
  background: #c82333;
}

/* 选项列表 */
.options-list {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.5rem;
  background: white;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background: #fafafa;
  flex-wrap: wrap;
}

.option-text-input, .option-effect-textarea {
  flex: 1;
  min-width: 120px;
  padding: 0.25rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  font-size: 0.8rem;
}

.option-action-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  font-size: 0.8rem;
}

.option-next-input {
  flex: 1;
  min-width: 80px;
  padding: 0.25rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  font-size: 0.8rem;
}

.option-checkbox {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  white-space: nowrap;
}

.remove-option-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.8rem;
}

.add-option-btn {
  width: 100%;
  padding: 0.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.add-option-btn:hover {
  background: #495057;
}

/* 右侧区域 - 年度事件 */
.editor-content {
  flex: 1.5;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.content-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.add-event-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-event-btn:hover {
  background: #0056b3;
}

/* 事件卡片 */
.event-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fafafa;
}

.event-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.event-title-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
}

.remove-event-btn {
  padding: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-event-btn:hover {
  background: #c82333;
}

/* 标签输入 */
.tags-input {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.5rem;
  min-height: 40px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.tag-item {
  background: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.tag-input {
  border: none;
  outline: none;
  font-size: 0.9rem;
  width: 100%;
}

/* 媒体上传相关样式 */
.media-upload-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.media-upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #6f42c1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  align-self: flex-start;
}

.media-upload-btn:hover {
  background: #563d7c;
}

.media-preview {
  width: 150px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dee2e6;
}

.media-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 空状态 */
.no-events {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.no-events-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.add-first-event-btn {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.add-first-event-btn:hover {
  background: #0056b3;
}

/* 年份保存提示 */
.year-save-prompt {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.prompt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.prompt-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.prompt-card h3 {
  margin: 0 0 1rem 0;
  color: #1d1d1f;
  font-size: 1.2rem;
}

.prompt-card p {
  margin: 0 0 1.5rem 0;
  color: #6c757d;
  line-height: 1.5;
}

.prompt-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.cancel-btn, .discard-btn, .save-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.discard-btn {
  background: #dc3545;
  color: white;
}

.prompt-actions .save-btn {
  background: #28a745;
  color: white;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .editor-main {
    flex-direction: column;
    gap: 1rem;
  }
  
  .editor-sidebar, .choice-events-panel, .editor-content {
    width: 100%;
  }
  
  .choice-events-panel {
    order: -1;
  }
  
  .option-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .option-text-input, .option-effect-textarea, .option-next-input {
    width: 100%;
    min-width: auto;
  }
}
</style> 