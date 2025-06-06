<template>
  <div class="event-editor-container">
    <!-- 头部工具栏 -->
    <header class="editor-header">
      <div class="header-left">
        <button @click="goBack" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          返回
        </button>
        <h1 class="editor-title">事件流程编辑器</h1>
        <span class="book-info" v-if="bookInfo">{{ bookInfo.title }}</span>
      </div>
      
      <div class="header-actions">
        <button @click="addEvent" class="add-btn add-event-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          新增事件
        </button>
        
        <button @click="saveFlow" class="save-btn" :disabled="isSaving">
          <span v-if="isSaving" class="loading-spinner"></span>
          {{ isSaving ? '保存中...' : '保存流程' }}
        </button>
      </div>
    </header>

    <!-- 主体内容区域 -->
    <div class="editor-main">
      <!-- 侧边工具面板 -->
      <aside class="tool-panel">
        <div class="tool-section">
          <h3>工具箱</h3>
          <div class="tool-items">
            <div class="tool-item" @click="addEvent" title="添加事件">
              <div class="tool-icon event-icon">📝</div>
              <span>事件</span>
            </div>
            
            <div class="tool-item" @click="setStartEvent" title="设置起始事件">
              <div class="tool-icon start-icon">🚀</div>
              <span>起始点</span>
            </div>
          </div>
        </div>
        
        <div class="tool-section">
          <h3>属性面板</h3>
          <div class="property-panel" v-if="selectedNode">
            <!-- 事件属性编辑 -->
            <div v-if="selectedNode.type === 'event'" class="event-properties">
              <h4>事件属性</h4>
              
              <div class="property-group">
                <label>事件名称</label>
                <input v-model="selectedNode.data.name" type="text" class="property-input">
              </div>
              
              <div class="property-group">
                <label>事件年份</label>
                <input v-model.number="selectedNode.data.year" type="number" class="property-input">
              </div>
              
              <div class="property-group">
                <label>问题/描述</label>
                <textarea v-model="selectedNode.data.question" class="property-textarea"></textarea>
              </div>
              
              <div class="property-group">
                <label>详细描述</label>
                <textarea v-model="selectedNode.data.description" class="property-textarea"></textarea>
              </div>
              
              <div class="property-group">
                <label>是否为起始事件</label>
                <input v-model="selectedNode.data.isEntry" type="checkbox" class="property-checkbox">
              </div>
              
              <div class="property-group">
                <label>事件图片</label>
                <input type="file" @change="handleImageUpload" accept="image/*" class="property-file">
                <div v-if="selectedNode.data.image" class="image-preview">
                  <img :src="selectedNode.data.image" alt="事件图片" class="preview-img">
                </div>
              </div>
              
              <div class="property-actions">
                <button @click="addOption" class="add-option-btn">添加选项</button>
                <button @click="deleteNode" class="delete-btn">删除事件</button>
              </div>
            </div>
            
            <!-- 选项属性编辑 -->
            <div v-if="selectedNode.type === 'option'" class="option-properties">
              <h4>选项属性</h4>
              
              <div class="property-group">
                <label>选项文本</label>
                <textarea v-model="selectedNode.data.optionText" class="property-textarea"></textarea>
              </div>
              
              <div class="property-group">
                <label>影响描述</label>
                <textarea v-model="selectedNode.data.effect" class="property-textarea"></textarea>
              </div>
              
              <div class="property-group">
                <label>是否进入下一年</label>
                <input v-model="selectedNode.data.isNextYear" type="checkbox" class="property-checkbox">
              </div>
              
              <div class="property-actions">
                <button @click="deleteNode" class="delete-btn">删除选项</button>
              </div>
            </div>
          </div>
          
          <div v-else class="no-selection">
            点击选择事件或选项进行编辑
          </div>
        </div>
      </aside>

      <!-- 画布区域 -->
      <main class="canvas-container">
        <div class="canvas-wrapper">
          <svg 
            ref="canvas" 
            class="flow-canvas"
            :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`"
            @mousedown="handleCanvasMouseDown"
            @mousemove="handleCanvasMouseMove"
            @mouseup="handleCanvasMouseUp"
            @wheel="handleCanvasWheel"
          >
            <!-- 网格背景和渐变定义 -->
            <defs>
              <!-- 网格背景 -->
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(102, 126, 234, 0.1)" stroke-width="1"/>
                <circle cx="0" cy="0" r="1" fill="rgba(102, 126, 234, 0.2)"/>
              </pattern>
              
              <!-- 连接线渐变 -->
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
              
              <!-- 箭头标记 -->
              <marker 
                id="arrowhead" 
                markerWidth="12" 
                markerHeight="8" 
                refX="12" 
                refY="4" 
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0 0, 12 4, 0 8" fill="url(#connectionGradient)" />
              </marker>
              
              <!-- 起始事件光晕效果 -->
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <!-- 连接线 -->
            <g class="connections">
              <path 
                v-for="connection in connections" 
                :key="connection.id"
                :d="connection.path"
                class="connection-line"
                stroke="url(#connectionGradient)"
                stroke-width="3"
                fill="none"
                marker-end="url(#arrowhead)"
              />
            </g>
            
            <!-- 事件节点 -->
            <g class="events">
              <g 
                v-for="event in events" 
                :key="event.id"
                :transform="`translate(${event.x}, ${event.y})`"
                class="event-node"
                :class="{ 
                  'selected': selectedNode?.id === event.id,
                  'entry-event': event.data.isEntry 
                }"
                @mousedown.stop="handleNodeMouseDown(event, $event)"
                @click.stop="selectNode(event)"
              >
                <rect 
                  :width="event.width" 
                  :height="event.height"
                  rx="12"
                  class="event-rect"
                  :filter="event.data.isEntry ? 'url(#glow)' : ''"
                />
                <text 
                  :x="event.width / 2" 
                  :y="20" 
                  text-anchor="middle"
                  class="event-title"
                >
                  {{ event.data.name || '新事件' }}
                </text>
                <text 
                  :x="event.width / 2" 
                  :y="40" 
                  text-anchor="middle"
                  class="event-year"
                >
                  {{ event.data.year || '未设置年份' }}
                </text>
                
                <!-- 连接点 -->
                <circle 
                  :cx="event.width / 2" 
                  :cy="event.height"
                  r="6"
                  class="connection-point output"
                  @mousedown.stop="startConnection(event, 'output')"
                />
                <circle 
                  :cx="event.width / 2" 
                  :cy="0"
                  r="6"
                  class="connection-point input"
                  @mousedown.stop="startConnection(event, 'input')"
                />
              </g>
            </g>
            
            <!-- 选项节点 -->
            <g class="options">
              <g 
                v-for="option in options" 
                :key="option.id"
                :transform="`translate(${option.x}, ${option.y})`"
                class="option-node"
                :class="{ 'selected': selectedNode?.id === option.id }"
                @mousedown.stop="handleNodeMouseDown(option, $event)"
                @click.stop="selectNode(option)"
              >
                <ellipse 
                  :cx="option.width / 2" 
                  :cy="option.height / 2"
                  :rx="option.width / 2" 
                  :ry="option.height / 2"
                  class="option-ellipse"
                />
                <text 
                  :x="option.width / 2" 
                  :y="option.height / 2 + 5" 
                  text-anchor="middle"
                  class="option-text"
                >
                  {{ option.data.optionText || '新选项' }}
                </text>
                
                <!-- 连接点 -->
                <circle 
                  :cx="option.width / 2" 
                  :cy="option.height"
                  r="4"
                  class="connection-point output"
                  @mousedown.stop="startConnection(option, 'output')"
                />
                <circle 
                  :cx="option.width / 2" 
                  :cy="0"
                  r="4"
                  class="connection-point input"
                  @mousedown.stop="startConnection(option, 'input')"
                />
              </g>
            </g>
            
            <!-- 临时连接线 -->
            <path 
              v-if="tempConnection"
              :d="tempConnection.path"
              class="temp-connection"
              stroke="#ff6b6b"
              stroke-width="2"
              stroke-dasharray="5,5"
              fill="none"
            />
          </svg>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'

// 编辑器状态
const bookInfo = ref(null)
const bookId = ref('')
const isSaving = ref(false)

// 画布相关
const canvas = ref(null)
const viewBox = reactive({ x: 0, y: 0, width: 1200, height: 800 })
const scale = ref(1)

// 节点和连接
const events = ref([])
const options = ref([])
const connections = ref([])
const selectedNode = ref(null)

// 拖拽状态
const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })
const dragTarget = ref(null)

// 连接状态
const isConnecting = ref(false)
const connectionStart = ref(null)
const tempConnection = ref(null)

// 节点ID计数器
let nodeIdCounter = 1
let connectionIdCounter = 1

// 初始化编辑器
onMounted(() => {
  initEditor()
})

// 初始化
const initEditor = () => {
  // 获取URL参数
  const urlParams = new URLSearchParams(window.location.search)
  bookId.value = urlParams.get('bookId') || ''
  
  // 如果有书籍ID，加载书籍信息和现有事件
  if (bookId.value && bookId.value !== 'new') {
    loadBookInfo()
    loadEvents()
  }
  
  // 如果是新书籍，创建一个示例起始事件
  if (bookId.value === 'new') {
    addExampleEvent()
  }
}

// 加载书籍信息
const loadBookInfo = async () => {
  try {
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/books/${bookId.value}`)
    if (response.ok) {
      bookInfo.value = await response.json()
    }
  } catch (error) {
    console.error('加载书籍信息失败:', error)
  }
}

// 加载现有事件
const loadEvents = async () => {
  try {
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/events?bookCode=${bookId.value}`)
    if (response.ok) {
      const data = await response.json()
      // 将后端数据转换为编辑器格式
      convertBackendDataToEditor(data)
    }
  } catch (error) {
    console.error('加载事件失败:', error)
  }
}

// 添加示例事件
const addExampleEvent = () => {
  const event = createEventNode({
    name: '人生开始',
    year: 1990,
    question: '你的人生故事即将开始...',
    description: '这是你人生的起点',
    isEntry: true
  }, 100, 100)
  
  events.value.push(event)
  selectedNode.value = event
}

// 创建事件节点
const createEventNode = (data = {}, x = 200, y = 200) => {
  return {
    id: `event_${nodeIdCounter++}`,
    type: 'event',
    x,
    y,
    width: 160,
    height: 60,
    data: {
      name: data.name || '',
      year: data.year || new Date().getFullYear(),
      question: data.question || '',
      description: data.description || '',
      isEntry: data.isEntry || false,
      image: data.image || null,
      bookCode: bookId.value
    }
  }
}

// 创建选项节点
const createOptionNode = (data = {}, x = 200, y = 300) => {
  return {
    id: `option_${nodeIdCounter++}`,
    type: 'option',
    x,
    y,
    width: 120,
    height: 40,
    data: {
      optionText: data.optionText || '',
      effect: data.effect || '',
      isNextYear: data.isNextYear !== false,
      eventId: data.eventId || null
    }
  }
}

// 添加事件
const addEvent = () => {
  const event = createEventNode({}, 
    viewBox.x + Math.random() * 200 + 100, 
    viewBox.y + Math.random() * 200 + 100
  )
  events.value.push(event)
  selectedNode.value = event
}

// 添加选项
const addOption = () => {
  if (selectedNode.value?.type === 'event') {
    const parentEvent = selectedNode.value
    const option = createOptionNode({
      eventId: parentEvent.id
    }, parentEvent.x, parentEvent.y + 100)
    
    options.value.push(option)
    
    // 创建从事件到选项的连接
    createConnection(parentEvent, option)
  }
}

// 设置起始事件
const setStartEvent = () => {
  if (selectedNode.value?.type === 'event') {
    // 清除其他事件的起始标记
    events.value.forEach(event => {
      event.data.isEntry = false
    })
    
    // 设置当前选中事件为起始事件
    selectedNode.value.data.isEntry = true
  } else {
    alert('请先选择一个事件节点')
  }
}

// 选择节点
const selectNode = (node) => {
  selectedNode.value = node
}

// 节点拖拽处理
const handleNodeMouseDown = (node, event) => {
  if (isConnecting.value) return
  
  isDragging.value = true
  dragTarget.value = node
  
  const rect = canvas.value.getBoundingClientRect()
  const canvasX = (event.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x
  const canvasY = (event.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y
  
  dragOffset.x = canvasX - node.x
  dragOffset.y = canvasY - node.y
  
  event.preventDefault()
}

// 画布鼠标事件
const handleCanvasMouseDown = (event) => {
  selectedNode.value = null
}

const handleCanvasMouseMove = (event) => {
  if (isDragging.value && dragTarget.value) {
    const rect = canvas.value.getBoundingClientRect()
    const canvasX = (event.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x
    const canvasY = (event.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y
    
    dragTarget.value.x = canvasX - dragOffset.x
    dragTarget.value.y = canvasY - dragOffset.y
    
    // 更新相关连接线
    updateConnections()
  }
  
  if (isConnecting.value && connectionStart.value) {
    const rect = canvas.value.getBoundingClientRect()
    const canvasX = (event.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x
    const canvasY = (event.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y
    
    updateTempConnection(canvasX, canvasY)
  }
}

const handleCanvasMouseUp = () => {
  isDragging.value = false
  dragTarget.value = null
  
  if (isConnecting.value) {
    isConnecting.value = false
    connectionStart.value = null
    tempConnection.value = null
  }
}

// 开始连接
const startConnection = (node, type) => {
  isConnecting.value = true
  connectionStart.value = { node, type }
}

// 更新临时连接线
const updateTempConnection = (endX, endY) => {
  if (!connectionStart.value) return
  
  const startNode = connectionStart.value.node
  const startX = startNode.x + startNode.width / 2
  const startY = startNode.y + (connectionStart.value.type === 'output' ? startNode.height : 0)
  
  tempConnection.value = {
    path: `M ${startX} ${startY} L ${endX} ${endY}`
  }
}

// 创建连接
const createConnection = (fromNode, toNode) => {
  const connection = {
    id: `connection_${connectionIdCounter++}`,
    from: fromNode.id,
    to: toNode.id,
    path: calculateConnectionPath(fromNode, toNode)
  }
  
  connections.value.push(connection)
  return connection
}

// 计算连接路径
const calculateConnectionPath = (fromNode, toNode) => {
  const startX = fromNode.x + fromNode.width / 2
  const startY = fromNode.y + fromNode.height
  const endX = toNode.x + toNode.width / 2
  const endY = toNode.y
  
  const midY = startY + (endY - startY) / 2
  
  return `M ${startX} ${startY} Q ${startX} ${midY} ${endX} ${endY}`
}

// 更新所有连接线
const updateConnections = () => {
  connections.value.forEach(connection => {
    const fromNode = [...events.value, ...options.value].find(n => n.id === connection.from)
    const toNode = [...events.value, ...options.value].find(n => n.id === connection.to)
    
    if (fromNode && toNode) {
      connection.path = calculateConnectionPath(fromNode, toNode)
    }
  })
}

// 删除节点
const deleteNode = () => {
  if (!selectedNode.value) return
  
  if (confirm('确定要删除这个节点吗？')) {
    const nodeId = selectedNode.value.id
    
    // 删除相关连接
    connections.value = connections.value.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    )
    
    // 删除节点
    if (selectedNode.value.type === 'event') {
      events.value = events.value.filter(event => event.id !== nodeId)
    } else {
      options.value = options.value.filter(option => option.id !== nodeId)
    }
    
    selectedNode.value = null
  }
}

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && selectedNode.value?.type === 'event') {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedNode.value.data.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 画布缩放
const handleCanvasWheel = (event) => {
  event.preventDefault()
  
  const delta = event.deltaY > 0 ? 1.1 : 0.9
  const newScale = scale.value * delta
  
  if (newScale >= 0.5 && newScale <= 3) {
    scale.value = newScale
    
    const rect = canvas.value.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    const factor = 1 - delta
    viewBox.x += mouseX * factor * (viewBox.width / rect.width)
    viewBox.y += mouseY * factor * (viewBox.height / rect.height)
    viewBox.width *= delta
    viewBox.height *= delta
  }
}

// 保存流程
const saveFlow = async () => {
  isSaving.value = true
  
  try {
    // 准备数据
    const flowData = {
      bookCode: bookId.value,
      events: events.value.map(event => ({
        ...event.data,
        x: event.x,
        y: event.y
      })),
      options: options.value.map(option => ({
        ...option.data,
        x: option.x,
        y: option.y
      })),
      connections: connections.value
    }
    
    // 发送到后端
    const response = await fetch(`http://localhost:8080/fate-echoes/api/v1/events/flow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flowData)
    })
    
    if (response.ok) {
      alert('流程保存成功！')
    } else {
      alert('保存失败，请稍后重试')
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert('网络错误，请检查连接后重试')
  } finally {
    isSaving.value = false
  }
}

// 返回
const goBack = () => {
  if (confirm('确定要返回吗？未保存的更改将丢失。')) {
    window.close()
    setTimeout(() => {
      window.location.href = '/'
    }, 100)
  }
}

// 转换后端数据为编辑器格式
const convertBackendDataToEditor = (data) => {
  // 实现数据转换逻辑
  console.log('Loading backend data:', data)
}
</script>

<style scoped>
.event-editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
  overflow: hidden;
}

/* 头部工具栏 - 全新设计 */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.editor-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.book-info {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(108, 117, 125, 0.1);
  border-radius: 8px;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.6);
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #2d3748;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(168, 237, 234, 0.4);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(168, 237, 234, 0.6);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 主体布局 */
.editor-main {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 1rem;
  padding: 1rem;
}

/* 侧边工具面板 - 重新设计 */
.tool-panel {
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tool-section {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.tool-section:last-child {
  border-bottom: none;
  flex: 1;
  overflow-y: auto;
}

.tool-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
}

.tool-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.tool-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.3);
}

.tool-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.tool-item span {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
}

/* 属性面板 - 美化 */
.property-panel {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.property-panel::-webkit-scrollbar {
  width: 6px;
}

.property-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.property-panel::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 3px;
}

.event-properties h4,
.option-properties h4 {
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
}

.property-group {
  margin-bottom: 1.5rem;
}

.property-group label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.75rem;
}

.property-input,
.property-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-family: inherit;
}

.property-input:focus,
.property-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.property-textarea {
  min-height: 80px;
  resize: vertical;
  line-height: 1.5;
}

.property-checkbox {
  width: auto;
  margin-right: 0.5rem;
  transform: scale(1.2);
}

.property-file {
  width: 100%;
  padding: 0.5rem;
  border: 2px dashed rgba(102, 126, 234, 0.3);
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.05);
}

.image-preview {
  margin-top: 1rem;
  text-align: center;
}

.preview-img {
  max-width: 100%;
  max-height: 120px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.property-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.add-option-btn {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.add-option-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.delete-btn {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.no-selection {
  color: #a0aec0;
  text-align: center;
  padding: 3rem 1rem;
  font-style: italic;
  font-size: 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border-radius: 12px;
  margin: 1rem 0;
}

/* 画布区域 - 重新设计 */
.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.canvas-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.flow-canvas {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.03) 0%, transparent 50%);
  cursor: grab;
}

.flow-canvas:active {
  cursor: grabbing;
}

/* 节点样式 - 全新设计 */
.event-node {
  cursor: pointer;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.1));
}

.event-rect {
  fill: rgba(255, 255, 255, 0.95);
  stroke: #667eea;
  stroke-width: 3;
  transition: all 0.3s ease;
}

.event-node:hover .event-rect {
  fill: rgba(102, 126, 234, 0.1);
  stroke: #764ba2;
  stroke-width: 4;
  filter: drop-shadow(0 6px 20px rgba(102, 126, 234, 0.3));
}

.event-node.selected .event-rect {
  fill: rgba(102, 126, 234, 0.15);
  stroke: #4c51bf;
  stroke-width: 4;
}

.event-node.entry-event .event-rect {
  fill: rgba(255, 215, 0, 0.2);
  stroke: #ffd700;
  stroke-width: 4;
}

.event-title {
  font-size: 14px;
  font-weight: 700;
  fill: #2d3748;
}

.event-year {
  font-size: 12px;
  fill: #667eea;
  font-weight: 600;
}

/* 选项节点样式 - 重新设计 */
.option-node {
  cursor: pointer;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.1));
}

.option-ellipse {
  fill: rgba(255, 255, 255, 0.95);
  stroke: #4facfe;
  stroke-width: 3;
  transition: all 0.3s ease;
}

.option-node:hover .option-ellipse {
  fill: rgba(79, 172, 254, 0.1);
  stroke: #00f2fe;
  stroke-width: 4;
}

.option-node.selected .option-ellipse {
  fill: rgba(79, 172, 254, 0.15);
  stroke: #0ea5e9;
  stroke-width: 4;
}

.option-text {
  font-size: 11px;
  font-weight: 600;
  fill: #2d3748;
  text-anchor: middle;
}

/* 连接点样式 - 美化 */
.connection-point {
  fill: rgba(102, 126, 234, 0.8);
  stroke: white;
  stroke-width: 3;
  cursor: crosshair;
  opacity: 0;
  transition: all 0.3s ease;
}

.event-node:hover .connection-point,
.option-node:hover .connection-point {
  opacity: 1;
}

.connection-point:hover {
  fill: #764ba2;
  r: 8;
  stroke-width: 4;
}

/* 连接线样式 - 重新设计 */
.connection-line {
  stroke: url(#connectionGradient);
  stroke-width: 3;
  fill: none;
  transition: stroke-width 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
}

.connection-line:hover {
  stroke-width: 4;
}

.temp-connection {
  stroke: #ff6b6b;
  stroke-width: 3;
  stroke-dasharray: 8,4;
  fill: none;
  filter: drop-shadow(0 2px 4px rgba(255, 107, 107, 0.3));
}

/* 加载动画 - 美化 */
.loading-spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .tool-panel {
    width: 280px;
  }
  
  .editor-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .editor-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-left,
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .tool-panel {
    width: 100%;
    position: absolute;
    top: 0;
    left: -100%;
    transition: left 0.3s ease;
    z-index: 200;
  }
  
  .tool-items {
    grid-template-columns: 1fr;
  }
  
  .editor-main {
    flex-direction: column;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2, #667eea);
}
</style> 