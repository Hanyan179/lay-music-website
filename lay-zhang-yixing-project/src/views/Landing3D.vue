<template>
  <div class="timeline-3d-container" ref="containerRef">
    <!-- 3D 场景容器 -->
    <div class="timeline-canvas" ref="canvasRef"></div>
    
    <!-- 右上角日期显示 -->
    <div 
      class="date-display" 
      ref="dateDisplayRef"
      :class="{ 'visible': showEventInfo }"
    >
      {{ currentEvent?.date || '' }}
    </div>
      
    <!-- 年份选择器 -->
    <div 
      class="year-selector" 
      ref="yearSelectorRef"
      :class="{ 'visible': showYearSelector }"
    >
      <h3>选择事件</h3>
      <div class="year-grid">
        <button 
          v-for="event in timelineEvents" 
          :key="event.id"
          class="year-button"
          :class="{ 'active': event.id === currentEvent?.id }"
          @click="goToEvent(event.id)"
        >
          {{ event.date }}
        </button>
      </div>
    </div>
    
    <!-- 简化的事件信息展示 -->
    <div 
      class="event-info" 
      ref="eventInfoRef"
      :class="{ 
        'visible': showEventInfo,
        'layout-image-left': currentEvent?.side === 'left',
        'layout-image-right': currentEvent?.side === 'right'
      }"
    >
      <div class="event-info-content">
        <!-- 错位3D标题 -->
        <h3 
          :data-title="currentEvent?.title"
        >{{ currentEvent?.title }}</h3>
        
        <!-- 垂直艺术状态标签 -->
        <div class="distance-status">{{ currentDistanceStatus }}</div>
        
        <!-- 分层描述文本 -->
        <p 
          :data-description="currentEvent?.description"
        >{{ currentEvent?.description }}</p>
      </div>
    </div>
    
    <!-- 导航提示 -->
    <div class="navigation-hints">
      <div class="hint">
        <span class="icon">🖱️</span>
        <span>长按显示事件选择</span>
      </div>
      <div class="hint">
        <span class="icon">🔄</span>
        <span>滚轮在走廊中前进后退</span>
    </div>
    </div>

    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <span class="icon">←</span>
      <span>返回</span>
    </button>

    <!-- 调试信息面板 -->
    <div class="debug-info">
      <div class="debug-header">
        <span>调试信息</span>
        <button class="copy-btn" @click="copyDebugInfo" title="复制调试信息">📋</button>
      </div>
      <div class="debug-line">相机位置: {{ Math.round(debugCameraZ) }}</div>
      <div class="debug-line">当前事件: {{ currentEvent?.date || '无' }} ({{ currentEvent?.title || '无' }})</div>
      <div class="debug-line">距离状态: {{ currentDistanceStatus }}</div>
      <div class="debug-line">信息显示: {{ showEventInfo ? '是' : '否' }}</div>
      <div class="debug-line" v-if="debugNearestEvent">
        最近图片: #{{ getEventIndex(debugNearestEvent) + 1 }} - {{ debugNearestEvent.date }} 
      </div>
      <div class="debug-line" v-if="debugNearestEvent">
        距离: {{ Math.round(debugNearestDistance) }}
      </div>
      <div class="debug-line">
        <small>{{ debugCopyStatus }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// 路由和引用
const router = useRouter()
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLElement>()
const dateDisplayRef = ref<HTMLElement>()
const yearSelectorRef = ref<HTMLElement>()
const eventInfoRef = ref<HTMLElement>()

// 状态管理
const showDate = ref(false)
const showYearSelector = ref(false)
const showEventInfo = ref(false)
const currentEvent = ref<TimelineEvent | null>(null)
const isMousePressed = ref(false)
const currentDistanceStatus = ref('中等')
const debugNearestEvent = ref<TimelineEvent | null>(null)
const debugNearestDistance = ref(0)
const debugCameraZ = ref(-400)
const debugCopyStatus = ref('')

// Three.js 相关变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let timelineGroup: THREE.Group
let particleSystem: THREE.Points
let animationId: number | null = null
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2
let hoveredObject: THREE.Group | null = null

// D&G风格滚轮效果变量
let scrollProgress = 0
let parallaxLayers = new Map() // 视差分层
let isScrolling = false
let scrollTimeout: number | null = null

// 时间轴数据接口
interface TimelineEvent {
  id: number
  year: number
  date: string
  title: string
  description: string
  image: string
  position: THREE.Vector3
  side: 'left' | 'right' // 左侧或右侧
  color: string
  isVideo?: boolean // 是否为视频
}

// 张艺兴音乐生涯时间轴数据 - 按时间从早到晚排序
const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    year: 2016,
    date: "2016年6月18日",
    title: "LOSE CONTROL 首张专辑",
    description: "图片#1 位置Z=0 左侧 文字右侧 - 发行个人首张专辑《LOSE CONTROL》，标志着solo生涯的正式开始",
    image: "/img/music/PRODUCER.png",
    position: new THREE.Vector3(-350, 0, 0), // 最早的事件在起始位置
    side: 'left',
    color: "#FF6B6B"
  },
  {
    id: 2,
    year: 2016,
    date: "2016年10月7日",
    title: "第二首单曲发布",
    description: "图片#2 位置Z=1000 右侧 文字左侧 - 继续solo音乐道路的探索，发布第二首个人单曲《SHEEP》",
    image: "/img/music/STEP.png",
    position: new THREE.Vector3(350, 0, 1000), // 第二个事件
    side: 'right',
    color: "#FF6B6B"
  },
  {
    id: 3,
    year: 2017,
    date: "2017年3月15日",
    title: "SHEEP 专辑",
    description: "图片#3 位置Z=2000 左侧 - 第二张个人专辑《SHEEP》，展现更加成熟的音乐风格",
    image: "/img/music/LIT.png",
    position: new THREE.Vector3(-350, 0, 2000), // 第三个事件
    side: 'left',
    color: "#4ECDC4"
  },
  {
    id: 4,
    year: 2018,
    date: "2018年11月22日",
    title: "梦不落雨林",
    description: "图片#4 位置Z=3000 右侧 文字左侧 - NAMANANA MV全球发行，国际化音乐道路的重要里程碑",
    image: "/timeline.mp4",
    position: new THREE.Vector3(350, 0, 3000), // 第四个事件
    side: 'right',
    color: "#45B7D1",
    isVideo: true
  },
  {
    id: 5,
    year: 2019,
    date: "2019年9月6日",
    title: "HONEY 甜蜜时光",
    description: "图片#5 位置Z=4000 左侧 - 甜蜜风格专辑《HONEY》，展现多元化的音乐表达",
    image: "/img/music/STEP.png",
    position: new THREE.Vector3(-350, 0, 4000), // 第五个事件
    side: 'left',
    color: "#96CEB4"
  },
  {
    id: 6,
    year: 2020,
    date: "2020年7月23日",
    title: "莲 (LIT) 中华文化",
    description: "图片#6 位置Z=5000 右侧 - 专辑《莲》中华文化与现代音乐的完美融合，获得广泛认可",
    image: "/img/music/LIT.png",
    position: new THREE.Vector3(350, 0, 5000), // 第六个事件
    side: 'right',
    color: "#FECA57"
  },
  {
    id: 7,
    year: 2021,
    date: "2021年5月12日",
    title: "PRODUCER 制作人", 
    description: "图片#7 位置Z=6000 左侧 - 《我是唱作人2》冠军专辑《PRODUCER》，制作人才华的全面展现",
    image: "/img/music/PRODUCER.png",
    position: new THREE.Vector3(-350, 0, 6000), // 第七个事件
    side: 'left',
    color: "#FF9FF3"
  },
  {
    id: 8,
    year: 2024,
    date: "2024年1月25日",
    title: "STEP 新的征程",
    description: "图片#8 位置Z=7000 右侧 文字左侧 - 最新专辑《STEP》，踏向更广阔的音乐世界，开启新篇章",
    image: "/img/music/STEP.png",
    position: new THREE.Vector3(350, 0, 7000), // 最新的事件在最远位置
    side: 'right',
    color: "#54A0FF"
  }
]

// 当前相机位置（Z轴走廊移动）- 从最新事件开始
let currentCameraZ = 7500 // 从最新事件开始（距离2024年1月500像素）
let targetCameraZ = 7500
const walkSpeed = 250 // 进一步减小移动步长，确保精确停在每个事件

// 3D 对象数组和加载管理
const eventObjects: THREE.Group[] = []
const loadedCards = new Set<number>() // 已加载的卡片索引
const visibleRange = 3 // 一次显示的卡片数量

// 初始化 Three.js 场景
const initThreeJS = () => {
  if (!canvasRef.value) return

  // 场景
  scene = new THREE.Scene()
  
  // 创建D&G风格背景
  createMinimalBackground()
  
  // 创建视差环境
  createParallaxEnvironment()

  // 相机 - 调整视角确保图片完整显示
  camera = new THREE.PerspectiveCamera(
    75, // 进一步增大FOV确保大图片完全可见
    window.innerWidth / window.innerHeight,
    0.1,
    8500 // 扩大远裁剪面以容纳更大的移动范围
  )
  camera.position.set(0, 0, 7500) // 从最新事件开始（距离2024年1月500像素）

  // 渲染器 - 高清晰度设置
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  
  // D&G风格渲染设置
  renderer.toneMappingExposure = 1.2
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  
  canvasRef.value.appendChild(renderer.domElement)

  // 鼠标射线检测
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // 时间轴组
  timelineGroup = new THREE.Group()
  scene.add(timelineGroup)

  // 创建简约走廊结构
  createMinimalCorridor()

  // 初始化空的卡片容器
  initializeCardContainers()

  // 加载当前视野内的卡片
  loadVisibleCards()

  // 添加D&G风格光照
  setupMinimalLighting()

  // 开始渲染循环
  animate()
}

// 优化的动画循环 - 减少频闪，增强响应性
let frameCount = 0
let initialCheckDone = false
let initializationComplete = false // 新增：初始化完成标志

const animate = () => {
  animationId = requestAnimationFrame(animate) as number
  frameCount++

  // 减少加载检查频率 - 每5帧检查一次，确保及时加载
  if (frameCount % 5 === 0 && Math.abs(currentCameraZ - targetCameraZ) < 100) {
    loadVisibleCards()
  }

  // 每帧都检查当前事件，确保不遗漏事件
  // 如果初始化完成，或者相机位置发生了显著变化（用户开始滚动），都要检测事件
  const cameraHasMoved = Math.abs(currentCameraZ - 7500) > 100 // 距离初始位置超过100像素
  if (initializationComplete || cameraHasMoved) {
    updateCurrentEvent()
  }

  // 初始化完成后才开始正常检查（避免覆盖初始设置）
  if (frameCount === 10 && !initialCheckDone) {
    initialCheckDone = true
    // 不调用updateCurrentEvent，保持初始设置
  }

  // 更新简化的视差层
  updateParallaxLayers()

  // 更新简化的事件对象
  updateEventObjects()

  // 更新简化的相机
  updateCamera()

  // 渲染场景
  renderer.render(scene, camera)
}

// 创建简约背景 - 增强D&G风格
const createMinimalBackground = () => {
  // 创建渐变背景几何体（类似香水广告的背景）
  const bgGeometry = new THREE.SphereGeometry(1000, 32, 32)
  const bgMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xf5f5f5),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.95
  })
  const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial)
  scene.add(bgSphere)
  
  // 添加环境雾效（营造香水广告的朦胧感）
  scene.fog = new THREE.Fog(0xf8f9fa, 300, 1500)
  
  // 存储背景引用用于动画
  parallaxLayers.set('background', bgSphere)
}

// 创建D&G风格视差环境
const createParallaxEnvironment = () => {
  // 创建浮动粒子（模拟香水分子）
  const particleCount = 50
  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 2000
    positions[i + 1] = (Math.random() - 0.5) * 1000
    positions[i + 2] = (Math.random() - 0.5) * 2000
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xdedede,
    size: 2,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  })
  
  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)
  parallaxLayers.set('particles', particles)
  
  // 创建光晕几何体（背景装饰）
  const ringGeometry = new THREE.RingGeometry(200, 220, 32)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide
  })
  
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone())
    ring.position.set(
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 1500
    )
    ring.rotation.x = Math.random() * Math.PI
    ring.rotation.y = Math.random() * Math.PI
    scene.add(ring)
    parallaxLayers.set(`ring${i}`, ring)
  }
}

// 创建简约走廊结构
const createMinimalCorridor = () => {
  // 完全移除地板 - 用户要求去掉
  // 不添加任何几何体，保持纯净背景
}

// 设置简化光照 - D&G风格增强
const setupMinimalLighting = () => {
  // 主环境光（香水广告式柔和光照）
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  // 主要定向光（模拟摄影棚光照）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(100, 200, 100)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500
  scene.add(directionalLight)

  // 侧面补光（增强立体感）
  const sideLight1 = new THREE.DirectionalLight(0xffffff, 0.3)
  sideLight1.position.set(-200, 100, 50)
  scene.add(sideLight1)
  
  const sideLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
  sideLight2.position.set(200, 100, 50)
  scene.add(sideLight2)

  // 背光（营造轮廓光效果）
  const backLight = new THREE.DirectionalLight(0xffffff, 0.4)
  backLight.position.set(0, 50, -200)
  scene.add(backLight)
}

// 初始化卡片容器
const initializeCardContainers = () => {
  timelineEvents.forEach((event, index) => {
    const group = new THREE.Group()
    group.position.copy(event.position)
    group.userData = event
    group.userData.index = index
    group.userData.loaded = false
    
    timelineGroup.add(group)
    eventObjects.push(group)
  })
}

// 优化的可见卡片加载 - 减少频繁加载卸载
const loadVisibleCards = () => {
  const currentIndex = getCurrentCenterIndex()
  const startIndex = Math.max(0, currentIndex - 2) // 增大预加载范围
  const endIndex = Math.min(timelineEvents.length - 1, currentIndex + 2)
  
  // 加载当前视野内的卡片（更大范围预加载）
  for (let i = startIndex; i <= endIndex; i++) {
    if (!loadedCards.has(i)) {
      loadCard(i)
      loadedCards.add(i)
    }
  }
  
  // 更保守的卸载策略，减少频繁卸载
  loadedCards.forEach(index => {
    if (index < startIndex - 3 || index > endIndex + 3) { // 更大的保留范围
      unloadCard(index)
      loadedCards.delete(index)
    }
  })
}

// 获取当前中心卡片索引
const getCurrentCenterIndex = () => {
  let closestIndex = 0
  let minDistance = Infinity
  
  timelineEvents.forEach((event, index) => {
    const distance = Math.abs(event.position.z - currentCameraZ)
    if (distance < minDistance) {
      minDistance = distance
      closestIndex = index
    }
  })
  
  return closestIndex
}

// 加载单个卡片
const loadCard = (index: number) => {
  const event = timelineEvents[index]
  const group = eventObjects[index]
  
  if (group.userData.loaded) return
  
  if (event.isVideo) {
    createVideoCard(group, event)
  } else {
    createImageCard(group, event)
  }
  
  group.userData.loaded = true
}

// 卸载单个卡片
const unloadCard = (index: number) => {
  const group = eventObjects[index]
  
  if (!group.userData.loaded) return
  
  // 清理视频资源
  const video = group.userData.video
  if (video) {
    video.pause()
    video.src = ''
    video.load()
  }
  
  // 清理纹理
  const videoTexture = group.userData.videoTexture
  if (videoTexture) {
    videoTexture.dispose()
  }
  
  // 移除所有子对象
  while (group.children.length > 0) {
    const child = group.children[0]
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach(mat => mat.dispose())
      } else {
        child.material?.dispose()
      }
    }
    group.remove(child)
  }
  
  group.userData.loaded = false
  group.userData.cardGroup = null
  group.userData.frontMaterial = null
}

// 计算距离状态 - 扩大最佳范围，包含用户认为的最佳视角
const getDistanceStatus = (distance: number): { text: string, color: string } => {
  if (distance <= 450) return { text: '最佳', color: '#51cf66' }  // 扩大到450，包含距离400的情况
  if (distance < 600) return { text: '近', color: '#74c0fc' }
  if (distance < 800) return { text: '中等', color: '#ffd43b' }
  if (distance < 1000) return { text: '远', color: '#ff922b' }
  return { text: '很远', color: '#868e96' }
}

// 创建动态距离状态标签
const createDistanceLabel = (cardWidth: number, cardHeight: number) => {
  // 创建画布来生成文字纹理
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  
  // 设置画布尺寸
  canvas.width = 120
  canvas.height = 60
  
  // 初始状态
  context.fillStyle = 'rgba(0, 0, 0, 0.8)'
  context.fillRect(0, 0, canvas.width, canvas.height)
  
  context.fillStyle = '#ffffff'
  context.font = 'bold 24px Arial'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText('中等', canvas.width / 2, canvas.height / 2)
  
  // 创建纹理
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  
  // 创建标签几何体和材质
  const labelGeometry = new THREE.PlaneGeometry(40, 20)
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  })
  
  // 创建标签网格
  const label = new THREE.Mesh(labelGeometry, labelMaterial)
  
  // 定位标签到卡片右上角
  label.position.x = cardWidth / 2 - 20
  label.position.y = cardHeight / 2 - 10
  label.position.z = 1 // 稍微前置以确保可见
  
  // 存储画布和上下文引用以便更新
  label.userData = { canvas, context, texture }
  
  return label
}

// 更新距离状态标签
const updateDistanceLabel = (label: THREE.Mesh, distance: number) => {
  const { canvas, context, texture } = label.userData
  const status = getDistanceStatus(distance)
  
  // 清除画布
  context.clearRect(0, 0, canvas.width, canvas.height)
  
  // 设置背景颜色
  context.fillStyle = 'rgba(0, 0, 0, 0.8)'
  context.fillRect(0, 0, canvas.width, canvas.height)
  
  // 设置文字颜色
  context.fillStyle = status.color
  context.font = 'bold 24px Arial'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  
  // 绘制文字
  context.fillText(status.text, canvas.width / 2, canvas.height / 2)
  
  // 更新纹理
  texture.needsUpdate = true
}

// 创建图片序号标签（方便用户描述位置）
const createIndexLabel = (index: number, cardWidth: number, cardHeight: number) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  
  canvas.width = 80
  canvas.height = 80
  
  // 背景圆形
  context.fillStyle = 'rgba(0, 123, 255, 0.9)'
  context.beginPath()
  context.arc(40, 40, 35, 0, Math.PI * 2)
  context.fill()
  
  // 白色边框
  context.strokeStyle = '#ffffff'
  context.lineWidth = 3
  context.stroke()
  
  // 数字
  context.fillStyle = '#ffffff'
  context.font = 'bold 28px Arial'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText((index + 1).toString(), 40, 40)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  
  const labelGeometry = new THREE.PlaneGeometry(30, 30)
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  })
  
  const label = new THREE.Mesh(labelGeometry, labelMaterial)
  label.position.x = -cardWidth / 2 + 15
  label.position.y = cardHeight / 2 - 15
  label.position.z = 1
  
  return label
}

// 创建图片卡片（D&G香水瓶风格）- 提高清晰度和艺术性
const createImageCard = (group: THREE.Group, event: TimelineEvent) => {
  // 创建占位符 - 大尺寸
  const placeholderGeometry = new THREE.PlaneGeometry(500, 500)
  const placeholderMaterial = new THREE.MeshLambertMaterial({ 
    color: event.color,
    transparent: true,
    opacity: 0.3
  })
  const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial)
  placeholder.castShadow = true
  placeholder.receiveShadow = true
  group.add(placeholder)
  
  // 异步加载高清纹理
  const textureLoader = new THREE.TextureLoader()
  
  // 设置跨域处理
  textureLoader.crossOrigin = 'anonymous'
  
  textureLoader.load(
    event.image,
    (texture) => {
      // 优化纹理设置以获得最佳清晰度
      texture.generateMipmaps = false
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.flipY = true
      
      // 移除占位符
      group.remove(placeholder)
      
      // 根据图片尺寸调整卡片大小 - 大尺寸确保清晰可见
      const aspectRatio = texture.image.width / texture.image.height
      let cardWidth = 500   // 显著增大基础宽度
      let cardHeight = 500  // 显著增大基础高度
      
      if (aspectRatio > 1) {
        cardHeight = cardWidth / aspectRatio
        // 确保最小高度
        if (cardHeight < 350) {
          cardHeight = 350
          cardWidth = cardHeight * aspectRatio
        }
      } else {
        cardWidth = cardHeight * aspectRatio
        // 确保最小宽度
        if (cardWidth < 350) {
          cardWidth = 350
          cardHeight = cardWidth / aspectRatio
        }
      }
      
      // 创建简洁的卡片容器
      const cardGroup = new THREE.Group()
      
      // 主卡片（保持真实自然）
      const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight)
      const cardMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: false,
        side: THREE.DoubleSide
      })
      const card = new THREE.Mesh(cardGeometry, cardMaterial)
      cardGroup.add(card)
      
      // 添加距离状态标识
      const distanceLabel = createDistanceLabel(cardWidth, cardHeight)
      cardGroup.add(distanceLabel)
      
      // 添加序号标签
      const indexLabel = createIndexLabel(group.userData.index, cardWidth, cardHeight)
      cardGroup.add(indexLabel)
      
      // 确保卡片正面朝向用户
      cardGroup.rotation.x = 0
      cardGroup.rotation.y = 0
      cardGroup.rotation.z = 0
      
      // 添加到组
      group.add(cardGroup)
      
      // 存储引用
      group.userData.frontMaterial = cardMaterial
      group.userData.cardGroup = cardGroup
      group.userData.cardWidth = cardWidth
      group.userData.cardHeight = cardHeight
    },
    undefined,
    (error) => {
      console.error('Error loading texture:', error)
      console.warn('图片加载失败，可能是CORS问题。请确保图片在本地或允许跨域访问。')
    }
  )
}

// 创建视频卡片（D&G香水瓶风格）
const createVideoCard = (group: THREE.Group, event: TimelineEvent) => {
  // 创建视频元素
  const video = document.createElement('video')
  video.src = event.image
  video.crossOrigin = 'anonymous'
  video.loop = true
  video.muted = true
  video.autoplay = true
  video.playsInline = true
  
  // 创建高清视频纹理
  const videoTexture = new THREE.VideoTexture(video)
  videoTexture.generateMipmaps = false
  videoTexture.minFilter = THREE.LinearFilter
  videoTexture.magFilter = THREE.LinearFilter
  videoTexture.wrapS = THREE.ClampToEdgeWrapping
  videoTexture.wrapT = THREE.ClampToEdgeWrapping
  videoTexture.flipY = true
  
  // 等视频加载后获取尺寸
  video.addEventListener('loadedmetadata', () => {
    const aspectRatio = video.videoWidth / video.videoHeight
    let cardWidth = 500   // 显著增大基础宽度
    let cardHeight = 500  // 显著增大基础高度
    
    if (aspectRatio > 1) {
      cardHeight = cardWidth / aspectRatio
      // 确保最小高度
      if (cardHeight < 350) {
        cardHeight = 350
        cardWidth = cardHeight * aspectRatio
      }
    } else {
      cardWidth = cardHeight * aspectRatio
      // 确保最小宽度
      if (cardWidth < 350) {
        cardWidth = 350
        cardHeight = cardWidth / aspectRatio
      }
    }
    
    // 更新几何体
    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight)
    const card = cardGroup.children[0] as THREE.Mesh
    card.geometry.dispose()
    card.geometry = cardGeometry
    
    // 更新距离标识位置
    const distanceLabel = cardGroup.children[1] as THREE.Mesh
    if (distanceLabel) {
      distanceLabel.position.x = cardWidth / 2 - 20
      distanceLabel.position.y = cardHeight / 2 - 10
    }
    
    // 更新序号标签位置
    const indexLabel = cardGroup.children[2] as THREE.Mesh
    if (indexLabel) {
      indexLabel.position.x = -cardWidth / 2 + 15
      indexLabel.position.y = cardHeight / 2 - 15
    }
    
    group.userData.cardWidth = cardWidth
    group.userData.cardHeight = cardHeight
  })
  
  // 创建简洁的视频卡片
  const cardGroup = new THREE.Group()
  
  // 主卡片（视频）- 保持真实自然，大尺寸显示
  const cardGeometry = new THREE.PlaneGeometry(500, 500)
  const cardMaterial = new THREE.MeshBasicMaterial({ 
    map: videoTexture,
    transparent: false,
    side: THREE.DoubleSide
  })
  const card = new THREE.Mesh(cardGeometry, cardMaterial)
  cardGroup.add(card)
  
  // 添加距离状态标识
  const distanceLabel = createDistanceLabel(500, 500)
  cardGroup.add(distanceLabel)
  
  // 添加序号标签
  const indexLabel = createIndexLabel(group.userData.index, 500, 500)
  cardGroup.add(indexLabel)
  
  // 添加到组
  group.add(cardGroup)
  
  // 存储引用
  group.userData.video = video
  group.userData.videoTexture = videoTexture
  group.userData.frontMaterial = cardMaterial
  group.userData.cardGroup = cardGroup
  
  // 开始播放视频
  video.play().catch(console.error)
}

// 简化的视差更新 - 减少动画复杂度
const updateParallaxLayers = () => {
  const time = Date.now() * 0.001
  const scrollFactor = scrollProgress * 0.005 // 减少滚动影响
  
  // 简化背景球体动画
  const bgSphere = parallaxLayers.get('background')
  if (bgSphere) {
    bgSphere.rotation.y = time * 0.01 + scrollFactor * 0.2 // 减慢旋转
  }
  
  // 简化粒子系统动画
  const particles = parallaxLayers.get('particles')
  if (particles) {
    particles.rotation.y = time * 0.02 + scrollFactor * 0.1 // 减慢旋转
    // 移除频繁的位置更新
  }
  
  // 简化光晕环动画
  for (let i = 0; i < 3; i++) {
    const ring = parallaxLayers.get(`ring${i}`)
    if (ring) {
      ring.rotation.z = time * (0.05 + i * 0.02) // 减慢旋转
      // 移除缩放动画
    }
  }
}

// 简化的卡片更新 - 移除频闪效果，添加距离状态更新
const updateEventObjects = () => {
  let closestDistance = Infinity
  let closestStatus = '中等'
  
  eventObjects.forEach((obj, index) => {
    if (!obj.userData.loaded) return
    
    const distance = Math.abs(obj.position.z - currentCameraZ)
    const maxDistance = 800 // 适应更大的间距
    const normalizedDistance = Math.min(distance / maxDistance, 1)
    
    // 简单的距离缩放，无动画
    const baseScale = Math.max(0.5, 1 - normalizedDistance * 0.5)
    obj.scale.setScalar(baseScale)
    
    // 更新距离标签
    const cardGroup = obj.userData.cardGroup
    if (cardGroup && cardGroup.children.length > 1) {
      const distanceLabel = cardGroup.children[1] as THREE.Mesh
      if (distanceLabel && distanceLabel.userData) {
        updateDistanceLabel(distanceLabel, distance)
      }
    }
    
    // 记录最近的距离状态
    if (distance < closestDistance) {
      closestDistance = distance
      closestStatus = getDistanceStatus(distance).text
    }
    
    // 保持图片稳定，不添加任何动画效果
  })
  
  // 更新当前距离状态
  currentDistanceStatus.value = closestStatus
}

// 简化的相机更新 - 移除频闪和摇摆
const updateCamera = () => {
  // 在初始化完成之前，强制保持在初始位置（7500，距离2024年1月500像素）
  if (!initializationComplete) {
    const initialPosition = 7500
    currentCameraZ = initialPosition
    targetCameraZ = initialPosition
    camera.position.z = initialPosition
    debugCameraZ.value = initialPosition
    return
  }
  
  // 平滑相机移动
  const easing = 0.15 // 稍微增加响应速度，确保精确到达目标位置
  currentCameraZ += (targetCameraZ - currentCameraZ) * easing
  
  // 临时禁用磁性效果，让用户可以自由滚动到任何位置
  // 这样事件才能正常切换
  // 磁性效果：当接近事件时，微调到最佳位置
  // let bestPosition = targetCameraZ
  // let minSnapDistance = 100
  // 
  // timelineEvents.forEach(event => {
  //   const eventDistance = Math.abs(currentCameraZ - event.position.z)
  //   if (eventDistance < minSnapDistance) {
  //     bestPosition = event.position.z + 200 // 距离事件200像素的最佳观看位置
  //     minSnapDistance = eventDistance
  //   }
  // })
  // 
  // // 如果找到更好的位置，缓慢调整过去
  // if (bestPosition !== targetCameraZ && Math.abs(currentCameraZ - bestPosition) < 300) {
  //   currentCameraZ += (bestPosition - currentCameraZ) * 0.05
  // }
  
  camera.position.z = currentCameraZ
  
  // 更新调试信息
  debugCameraZ.value = currentCameraZ
  
  // 保持相机稳定，移除所有动画效果
  camera.position.x = 0
  camera.position.y = 0
  camera.rotation.x = 0
  camera.rotation.y = 0
  camera.rotation.z = 0
  
  // 保持固定FOV
  camera.fov = 75
  camera.updateProjectionMatrix()
}

// 处理鼠标移动（悬停检测）
const handleMouseMove = (event: MouseEvent) => {
  // 更新鼠标位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  
  // 射线检测
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(eventObjects, true)
  
  // 重置之前悬停的对象
  if (hoveredObject && hoveredObject !== intersects[0]?.object.parent?.parent) {
    resetCardAnimation(hoveredObject)
    hoveredObject = null
  }
  
  // 处理新的悬停对象
  if (intersects.length > 0) {
    const intersectedGroup = intersects[0].object.parent?.parent as THREE.Group
    if (intersectedGroup && intersectedGroup !== hoveredObject && intersectedGroup.userData.loaded) {
      hoveredObject = intersectedGroup
      animateCardHover(intersectedGroup)
    }
  }
}

// 卡片悬停动画（简化版）
const animateCardHover = (group: THREE.Group) => {
  const cardGroup = group.userData.cardGroup
  
  if (!cardGroup) return
  
  // 轻微的纸张抬起效果
  gsap.to(cardGroup.position, {
    z: 5,
        duration: 0.3,
        ease: "power2.out"
  })
  
  // 轻微缩放
  gsap.to(cardGroup.scale, {
    x: 1.05,
    y: 1.05,
    z: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
}

// 重置卡片动画（简化版）
const resetCardAnimation = (group: THREE.Group) => {
  const cardGroup = group.userData.cardGroup
  
  if (!cardGroup) return
  
  // 恢复原始状态
  gsap.to(cardGroup.position, {
    x: 0,
    y: 0,
    z: 0,
    duration: 0.5,
    ease: "power2.out"
  })
  
  gsap.to(cardGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 0.5,
    ease: "power2.out"
  })
}

// 优化的滚轮处理 - 减少频闪
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  
  // 在初始化期间阻止滚轮操作
  if (!initializationComplete) {
    console.log('初始化期间阻止滚轮操作')
    return
  }
  
  const delta = event.deltaY > 0 ? 1 : -1
  const scrollSensitivity = 1.0 // 调整滚动步长，确保精确控制
  
  // 更新滚动进度
  scrollProgress += delta * 10
  
  // 设置滚动状态
  isScrolling = true
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = window.setTimeout(() => {
    isScrolling = false
  }, 150)
  
  // 调整滚动步长，让用户每2次滚动到达下一个最佳视角
  const smoothDelta = delta * walkSpeed * scrollSensitivity
  const oldTargetZ = targetCameraZ
  targetCameraZ += smoothDelta
  
  console.log('🖱️ 滚轮事件:', {
    oldTargetZ: Math.round(oldTargetZ),
    newTargetZ: Math.round(targetCameraZ),
    delta: Math.round(smoothDelta),
    currentCameraZ: Math.round(currentCameraZ),
    currentEventId: currentEvent.value?.id
  })
  
  // 限制范围 - 每2次滚动到达下一个最佳视角
  const minZ = -500   // 第一张图片在0，向左留缓冲
  const maxZ = 7500   // 最后一张图片在7000，向右留缓冲
  
  // 简单边界限制，暂不循环
  targetCameraZ = Math.max(minZ, Math.min(maxZ, targetCameraZ))
  
  // 移除震动效果，保持相机稳定
  
  // 立即触发加载检查，确保新位置的卡片及时加载
  loadVisibleCards()
  
  // 额外在下一帧也检查一次，确保不遗漏
  setTimeout(() => {
    loadVisibleCards()
  }, 16)
}

// 简化的事件更新 - 完全跟随图片逻辑
const updateCurrentEvent = () => {
  // 直接使用getCurrentCenterIndex()找到最近的图片
  const closestIndex = getCurrentCenterIndex()
  const closestEvent = timelineEvents[closestIndex]
  const distance = Math.abs(closestEvent.position.z - currentCameraZ)
  
  // 检查是否切换了事件
  const eventChanged = currentEvent.value?.id !== closestEvent.id
  
  // 暂时注释调试信息，减少日志输出
  // if (eventChanged) {
  //   console.log('🔍 详细调试信息 (事件切换时):', {
  //     currentCameraZ: Math.round(currentCameraZ),
  //     closestIndex,
  //     closestEventId: closestEvent.id,
  //     closestEventTitle: closestEvent.title,
  //     closestEventDate: closestEvent.date,
  //     distance: Math.round(distance),
  //     allDistances: timelineEvents.map(event => ({
  //       id: event.id,
  //       title: event.title,
  //       position: event.position.z,
  //       distance: Math.abs(event.position.z - currentCameraZ)
  //     }))
  //   })
  // }
  
  // 更新调试信息
  debugNearestEvent.value = closestEvent
  debugNearestDistance.value = distance
  
  // 使用与图片相同的最佳距离判断逻辑
  const isOptimalViewing = distance <= 450  // 与getDistanceStatus中的'最佳'范围一致
  
  if (eventChanged) {
    const oldEvent = currentEvent.value
    currentEvent.value = closestEvent
    console.log('🔄 事件切换:', {
      from: oldEvent ? `ID${oldEvent.id} ${oldEvent.title}` : '无',
      to: `ID${closestEvent.id} ${closestEvent.title}`,
      distance: Math.round(distance),
      side: closestEvent.side
    })
  }
  
  // 完全跟随图片的最佳视角状态
  if (isOptimalViewing && !showEventInfo.value) {
    console.log('📝 显示图片对应的事件信息:', closestEvent.title, '距离:', Math.round(distance))
    showEventInfoPanel()
  } else if (!isOptimalViewing && showEventInfo.value) {
    console.log('📝 离开最佳视角，隐藏事件信息')
    hideEventInfoPanel()
  } else if (isOptimalViewing && showEventInfo.value && eventChanged) {
    console.log('📝 切换到新图片，更新事件信息:', closestEvent.title)
    showEventInfoPanel()
  }
}

// 显示事件信息面板 - 简化版本确保内容正常显示
const showEventInfoPanel = () => {
  // 确保有当前事件数据
  if (!currentEvent.value) {
    console.log('❌ 没有当前事件数据，无法显示面板')
    return
  }
  
  console.log('📄 显示事件面板:', {
    eventId: currentEvent.value.id,
    title: currentEvent.value.title,
    date: currentEvent.value.date,
    side: currentEvent.value.side
  })
  
  showEventInfo.value = true
  
  if (eventInfoRef.value) {
    // 简化的显示动画，确保内容可见
    gsap.to(eventInfoRef.value, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    })
    
    console.log('✅ 事件面板动画完成')
  }
}

// 隐藏事件信息面板 - 简化版本
const hideEventInfoPanel = () => {
  if (!showEventInfo.value) return  // 已经隐藏
  
  console.log('📄 隐藏事件面板')
  
  if (eventInfoRef.value) {
    // 简单的淡出动画
    gsap.to(eventInfoRef.value, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        showEventInfo.value = false
        console.log('✅ 事件面板已隐藏')
      }
    })
  } else {
    showEventInfo.value = false
  }
}

// 长按显示年份选择器
let longPressTimer: number | null = null

const handleMouseDown = (event: MouseEvent) => {
  if (event.button === 0) { // 左键
    isMousePressed.value = true
    
    // 短按显示年份
    showDate.value = true
    if (dateDisplayRef.value) {
      gsap.fromTo(dateDisplayRef.value, {
        scale: 0,
        opacity: 0,
        rotationY: -180
      }, {
    scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      })
    }
    
    // 长按定时器 - 1.5秒后显示年份选择器
    longPressTimer = window.setTimeout(() => {
      showYearSelector.value = true
      if (yearSelectorRef.value) {
        gsap.fromTo(yearSelectorRef.value, {
          scale: 0.8,
    opacity: 0,
          y: 50
        }, {
          scale: 1,
          opacity: 1,
          y: 0,
    duration: 0.8,
          ease: "elastic.out(1, 0.5)"
        })
      }
    }, 1500)
  }
}

const handleMouseUp = () => {
  isMousePressed.value = false
  
  // 清除长按定时器
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
  
  // 隐藏年份显示
  if (dateDisplayRef.value) {
    gsap.to(dateDisplayRef.value, {
      scale: 0.3,
    opacity: 0,
      rotationY: 180,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        showDate.value = false
      }
    })
  }
  
  // 隐藏年份选择器
  if (showYearSelector.value && yearSelectorRef.value) {
    gsap.to(yearSelectorRef.value, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        showYearSelector.value = false
      }
    })
  }
}

// 跳转到指定事件
const goToEvent = (eventId: number) => {
  // 在初始化期间阻止跳转
  if (!initializationComplete) {
    console.log('初始化期间阻止goToEvent调用:', eventId)
    return
  }
  
  const targetEvent = timelineEvents.find(e => e.id === eventId)
  if (targetEvent) {
    const oldTargetZ = targetCameraZ
    targetCameraZ = targetEvent.position.z
    currentEvent.value = targetEvent
    
    console.log('goToEvent改变targetCameraZ:', oldTargetZ, '→', targetCameraZ, '事件ID:', eventId)
    
    // 隐藏选择器
    if (yearSelectorRef.value) {
      gsap.to(yearSelectorRef.value, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          showYearSelector.value = false
        }
      })
    }
    
    // 显示信息面板
    setTimeout(() => {
      showEventInfoPanel()
    }, 500)
  }
}

// 获取事件索引
const getEventIndex = (event: TimelineEvent) => {
  return timelineEvents.findIndex(e => e.id === event.id)
}

// 复制调试信息
const copyDebugInfo = async () => {
  const debugInfo = [
    `=== 调试信息 ===`,
    `相机位置: ${Math.round(debugCameraZ.value)}`,
    `当前事件: ${currentEvent.value?.date || '无'} (${currentEvent.value?.title || '无'})`,
    `距离状态: ${currentDistanceStatus.value}`,
    `信息显示: ${showEventInfo.value ? '是' : '否'}`,
    debugNearestEvent.value ? `最近图片: #${getEventIndex(debugNearestEvent.value) + 1} - ${debugNearestEvent.value.date}` : '',
    debugNearestEvent.value ? `距离: ${Math.round(debugNearestDistance.value)}` : '',
    `==============`
  ].filter(line => line).join('\n')
  
  try {
    await navigator.clipboard.writeText(debugInfo)
    debugCopyStatus.value = '✅ 已复制到剪贴板'
    setTimeout(() => {
      debugCopyStatus.value = ''
    }, 2000)
  } catch (err) {
    debugCopyStatus.value = '❌ 复制失败'
    console.error('复制失败:', err)
    setTimeout(() => {
      debugCopyStatus.value = ''
    }, 2000)
  }
}

// 返回上一页
const goBack = () => {
  if (containerRef.value) {
    gsap.to(containerRef.value, {
      opacity: 0,
    scale: 0.9,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        router.back()
      }
    })
  } else {
    router.back()
  }
}

// 窗口大小变化处理
const handleResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

// 处理鼠标离开页面
const handleMouseLeave = () => {
  if (hoveredObject) {
    resetCardAnimation(hoveredObject)
    hoveredObject = null
  }
}

// 设置事件监听器
const setupEventListeners = () => {
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  window.addEventListener('resize', handleResize)
  window.addEventListener('contextmenu', (e) => e.preventDefault())
}

// 清理事件监听器
const cleanupEventListeners = () => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('contextmenu', (e) => e.preventDefault())
}

// 组件挂载
onMounted(() => {
  setTimeout(() => {
    initThreeJS()
    setupEventListeners()
    
          // 确保初始状态正确 - 从最新事件开始（距离2024年1月500像素）
    const initialEvent = timelineEvents[timelineEvents.length - 1] // 最后一个元素是2024年1月STEP
    const initialPosition = 7500 // 距离2024年1月500像素，状态为"近"
    currentCameraZ = initialPosition
    targetCameraZ = initialPosition
    currentEvent.value = initialEvent // 2024年1月STEP新的征程
    
    // 强制立即更新相机位置到初始位置
    if (camera) {
      camera.position.z = initialPosition
    }
    
    // 添加调试信息
    console.log('初始化设置完成:', {
      currentCameraZ,
      targetCameraZ,
      currentEvent: currentEvent.value?.title,
      distance: Math.abs(currentEvent.value?.position.z - currentCameraZ),
      expectedDistance: 500
    })
    
    // 初始化后稍等片刻，确保3D场景完全加载
    setTimeout(() => {
      // 启用正常的事件检查（在初始化完成后）
      initializationComplete = true
      
      // 立即显示初始事件信息，因为距离是500像素（在最佳观看距离内）
      console.log('初始化完成，显示初始事件:', initialEvent.date, initialEvent.title)
      showEventInfoPanel()
      
      // 强制执行一次事件检查，确保初始状态正确
      setTimeout(() => {
        updateCurrentEvent()
        console.log('强制执行初始事件检查完成')
      }, 50)
    }, 200)
    
    if (containerRef.value) {
      gsap.fromTo(containerRef.value, {
        opacity: 0,
        scale: 1.1
      }, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out"
      })
    }
  }, 100)
})

// 组件卸载
onUnmounted(() => {
  cleanupEventListeners()
  
  if (longPressTimer) {
    clearTimeout(longPressTimer)
  }
  
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  
  // 清理所有已加载的卡片
  loadedCards.forEach(index => {
    unloadCard(index)
  })
  loadedCards.clear()
  
  if (renderer) {
    renderer.dispose()
  }
  
  if (scene) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material?.dispose()
        }
      }
    })
  }
})
</script>

<style scoped>
.timeline-3d-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  cursor: grab;
  user-select: none;
}

.timeline-3d-container:active {
  cursor: grabbing;
}

.timeline-canvas {
  width: 100%;
  height: 100%;
}

/* 右上角日期显示 */
.date-display {
  position: fixed;
  top: 80px;
  right: 24px;
  font-size: 24px;
  font-weight: 400;
  color: #495057;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.date-display.visible {
  opacity: 1;
}

/* 年份选择器 */
.year-selector {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 32px;
  z-index: 110;
  opacity: 0;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.year-selector.visible {
  opacity: 1;
}

.year-selector h3 {
  color: #495057;
  font-size: 20px;
  margin-bottom: 24px;
  font-weight: 300;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 240px;
}

.year-button {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: #495057;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.year-button:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.year-button.active {
  background: #495057;
  color: white;
  border-color: #495057;
}

/* 解构主义3D艺术文字展示 - 智能布局避免与图片冲突 */
.event-info {
  position: fixed;
  top: 50%;
  background: none;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  padding: 0;
  max-width: 350px;
  min-width: auto;
  text-align: left;
  z-index: 90;
  opacity: 0;
  transform-style: preserve-3d;
  perspective: 2000px;
  pointer-events: none;
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

/* 图片在左侧（side: 'left'）时，文字显示在右边 */
.event-info.layout-image-left {
  right: 8%; /* 增大一点边距确保不重叠 */
  transform: translateY(-50%) translateZ(0);
  transform-origin: right center;
}

/* 图片在右侧（side: 'right'）时，文字显示在左边 */
.event-info.layout-image-right {
  left: 8%; /* 增大一点边距确保不重叠 */
  transform: translateY(-50%) translateZ(0);
  transform-origin: left center;
}

.event-info.visible {
  opacity: 1;
}

.event-info.visible.layout-image-left {
  animation: artisticShowLeft 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.event-info.visible.layout-image-right {
  animation: artisticShowRight 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

/* 图片在左边时的动画（文字在右边） */
@keyframes artisticShowLeft {
  0% {
    opacity: 0;
    transform: translateY(-50%) translateZ(0) rotateX(-45deg) rotateY(25deg) rotateZ(-5deg) scale(0.6);
    filter: blur(30px) hue-rotate(180deg);
  }
  30% {
    opacity: 0.3;
    transform: translateY(-50%) translateZ(0) rotateX(-20deg) rotateY(10deg) rotateZ(-2deg) scale(0.8);
    filter: blur(15px) hue-rotate(90deg);
  }
  70% {
    opacity: 0.8;
    transform: translateY(-50%) translateZ(0) rotateX(-5deg) rotateY(2deg) rotateZ(0deg) scale(1.05);
    filter: blur(3px) hue-rotate(20deg);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) translateZ(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
    filter: blur(0px) hue-rotate(0deg);
  }
}

/* 图片在右边时的动画（文字在左边） */
@keyframes artisticShowRight {
  0% {
    opacity: 0;
    transform: translateY(-50%) translateZ(0) rotateX(-45deg) rotateY(-25deg) rotateZ(5deg) scale(0.6);
    filter: blur(30px) hue-rotate(180deg);
  }
  30% {
    opacity: 0.3;
    transform: translateY(-50%) translateZ(0) rotateX(-20deg) rotateY(-10deg) rotateZ(2deg) scale(0.8);
    filter: blur(15px) hue-rotate(90deg);
  }
  70% {
    opacity: 0.8;
    transform: translateY(-50%) translateZ(0) rotateX(-5deg) rotateY(-2deg) rotateZ(0deg) scale(1.05);
    filter: blur(3px) hue-rotate(20deg);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) translateZ(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
    filter: blur(0px) hue-rotate(0deg);
  }
}

/* 移除所有装饰元素和背景 */
.event-info::before,
.event-info::after {
  display: none;
}

/* 解构主义内容容器 - 优化为侧边布局 */
.event-info-content {
  position: relative;
  transform-style: preserve-3d;
  padding: 0;
  /* 简化为单列布局，适合侧边显示 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
  min-height: auto;
}

/* 移除装饰元素 */
.event-info-decoration {
  display: none;
}

/* 解构主义年份 - 艺术化字体，适配侧边布局 */
.event-info-year {
  font-size: 120px;
  font-weight: 100;
  font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* 简化渐变背景 */
  background: linear-gradient(45deg, 
    #2c3e50 0%,
    #34495e 50%,
    #2c3e50 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  margin: 0;
  line-height: 0.8;
  letter-spacing: -8px;
  position: relative;
  
  /* 简化阴影效果 */
  text-shadow: 
    0 2px 0 #bbb, 0 4px 0 #999, 0 6px 0 #777,
    0 8px 1px rgba(0,0,0,0.1), 0 10px 15px rgba(0,0,0,0.2);
  
  transform: translateZ(80px) rotateX(-10deg) rotateY(-3deg);
  
  /* 渐变动画 */
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* 年份数字分离效果 */
.event-info-year::before {
  content: attr(data-year);
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, 
    rgba(52, 73, 94, 0.3) 0%,
    rgba(44, 62, 80, 0.2) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateZ(-20px) translateX(8px) translateY(4px) skew(1deg, -0.5deg);
  filter: blur(1px);
}

.event-info-year::after {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(ellipse at center, 
    rgba(52, 73, 94, 0.05) 0%,
    transparent 70%
  );
  transform: translateZ(-50px);
  border-radius: 50%;
}

/* 解构主义标题 - 错位艺术字，适配侧边布局 */
.event-info h3 {
  color: #2c3e50;
  font-size: 32px;
  font-weight: 200;
  margin: -20px 0 0 0;
  line-height: 1.2;
  letter-spacing: 1px;
  font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  
  /* 简化文字效果 */
  text-shadow: 
    0 1px 0 #ddd, 0 2px 0 #ccc, 0 3px 0 #bbb,
    0 4px 1px rgba(0,0,0,0.1), 0 8px 15px rgba(0,0,0,0.15);
  
  transform: translateZ(60px) rotateX(-6deg) rotateZ(-1deg);
}

/* 标题的分离图层效果 */
.event-info h3::before {
  content: attr(data-title);
  position: absolute;
  top: 0;
  left: 0;
  color: rgba(231, 76, 60, 0.4);
  transform: translateZ(-30px) translateX(6px) translateY(3px) rotateZ(0.5deg);
  filter: blur(1px);
  mix-blend-mode: overlay;
}

.event-info h3::after {
  content: attr(data-title);
  position: absolute;
  top: 0;
  left: 0;
  color: rgba(52, 152, 219, 0.3);
  transform: translateZ(-60px) translateX(-4px) translateY(-2px) rotateZ(-0.3deg);
  filter: blur(2px);
  mix-blend-mode: soft-light;
}

/* 艺术化状态标签 - 简化设计，移除垂直排列 */
.distance-status {
  display: none; /* 暂时隐藏状态标签，保持简洁 */
}

/* 移除状态标签相关的动画和伪元素 */

/* 艺术化描述 - 简洁设计，适配侧边布局 */
.event-info p {
  color: #34495e;
  font-size: 18px;
  line-height: 1.6;
  margin: 10px 0 0 0;
  font-weight: 300;
  letter-spacing: 0.5px;
  font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  
  /* 简化文字效果 */
  text-shadow: 
    0 1px 0 rgba(248, 249, 250, 0.8),
    0 2px 1px rgba(0,0,0,0.05),
    0 4px 8px rgba(0,0,0,0.08);
  
  transform: translateZ(40px) rotateX(-3deg);
  opacity: 0.85;
}

/* 描述文字的装饰元素 */
.event-info p::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -30px;
  width: 4px;
  height: calc(100% + 20px);
  background: linear-gradient(180deg, 
    transparent 0%,
    rgba(52, 73, 94, 0.2) 20%,
    rgba(52, 73, 94, 0.4) 50%,
    rgba(52, 73, 94, 0.2) 80%,
    transparent 100%
  );
  transform: translateZ(-20px) skew(0deg, -2deg);
  border-radius: 2px;
}

.event-info p::after {
  content: attr(data-description);
  position: absolute;
  top: 0;
  left: 0;
  color: rgba(52, 152, 219, 0.15);
  transform: translateZ(-40px) translateX(4px) translateY(2px) rotateX(-2deg);
  filter: blur(2px);
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* 简化装饰元素，适配侧边布局 */
.event-info-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -20px;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, 
    transparent 0%,
    rgba(52, 73, 94, 0.3) 50%,
    transparent 100%
  );
  border-radius: 2px;
  transform: translateZ(-20px);
}

@keyframes geometryFloat {
  0%, 100% { 
    transform: translateZ(-100px) rotateX(45deg) rotateY(45deg) scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: translateZ(-80px) rotateX(60deg) rotateY(60deg) scale(1.2);
    opacity: 0.1;
  }
}

/* 移除分割线 */
.event-info-divider {
  display: none;
}

/* 简化悬浮动画效果，适配侧边布局 */
.event-info.layout-image-left:hover .event-info-year {
  transform: translateZ(100px) rotateX(-12deg) rotateY(4deg) scale(1.05);
  filter: contrast(1.1);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.event-info.layout-image-right:hover .event-info-year {
  transform: translateZ(100px) rotateX(-12deg) rotateY(-4deg) scale(1.05);
  filter: contrast(1.1);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.event-info.layout-image-left:hover h3 {
  transform: translateZ(80px) rotateX(-8deg) rotateZ(1deg) scale(1.03);
  filter: contrast(1.1);
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.event-info.layout-image-right:hover h3 {
  transform: translateZ(80px) rotateX(-8deg) rotateZ(-1deg) scale(1.03);
  filter: contrast(1.1);
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.event-info:hover p {
  transform: translateZ(60px) rotateX(-4deg) scale(1.02);
  filter: contrast(1.05);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

/* 悬停时的整体容器效果 */
.event-info:hover {
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

/* 导航提示 */
.navigation-hints {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hint {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  color: #6c757d;
  font-size: 12px;
  font-weight: 400;
}

.hint .icon {
  font-size: 14px;
}

/* 返回按钮 */
.back-button {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  color: #6c757d;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.back-button .icon {
  font-size: 12px;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .date-display {
    font-size: 18px;
    top: 70px;
    right: 20px;
    padding: 6px 12px;
  }
  
  .year-selector {
    padding: 24px 20px;
    left: 20px;
    right: 20px;
    transform: translateY(-50%);
    max-width: none;
  }
  
  .year-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    max-width: none;
  }
  
  .year-button {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .event-info {
    top: 50%;
    left: 5% !important;
    right: 5% !important;
    transform: translateY(-50%) !important;
    max-width: none;
    text-align: center;
  }
  
  .event-info-content {
    padding: 0;
    text-align: center;
  }
  
  .event-info-year {
    font-size: 80px;
    letter-spacing: -4px;
    margin-bottom: 15px;
    transform: translateZ(60px) rotateX(-8deg);
  }
  
  .event-info h3 {
    font-size: 24px;
    margin: 0 0 15px 0;
    transform: translateZ(40px) rotateX(-4deg);
  }
  
  .event-info p {
    font-size: 16px;
    line-height: 1.5;
    margin: 10px 0 0 0;
    transform: translateZ(30px) rotateX(-2deg);
  }
  
  /* 移动端隐藏装饰元素 */
  .event-info-content::before {
    display: none;
  }
  
  .navigation-hints {
    top: 20px;
    right: 20px;
    gap: 6px;
  }
  
  .back-button {
    top: 20px;
    left: 20px;
  }
}

@media (max-width: 480px) {
  .date-display {
    font-size: 16px;
    top: 60px;
    right: 16px;
    padding: 4px 8px;
  }
  
  .year-selector h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .year-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .year-button {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .event-info h3 {
    font-size: 20px;
    margin: 0 0 12px 0;
    transform: translateZ(30px) rotateX(-2deg);
  }
  
  .event-info p {
    font-size: 14px;
    line-height: 1.4;
    transform: translateZ(20px) rotateX(-1deg);
  }
  
  .event-info-year {
    font-size: 60px;
    letter-spacing: -3px;
    margin-bottom: 12px;
    transform: translateZ(40px) rotateX(-5deg);
  }
  
  .event-info-content {
    padding: 0;
    text-align: center;
  }
  
  /* 小屏幕简化效果 */
  .event-info-year::before,
  .event-info-year::after,
  .event-info h3::before,
  .event-info h3::after,
  .event-info p::before,
  .event-info p::after {
    display: none;
  }
}

/* 简约设计优化 */
.timeline-3d-container * {
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 调试信息面板 */
.debug-info {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  z-index: 1000;
  min-width: 280px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
  font-weight: bold;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.copy-btn:active {
  transform: scale(0.95);
}

.debug-line {
  margin-bottom: 4px;
  padding: 2px 12px;
}

.debug-line:first-of-type {
  padding-top: 8px;
}

.debug-line:last-child {
  margin-bottom: 0;
  padding-bottom: 8px;
}

.debug-line small {
  color: #4CAF50;
  font-size: 10px;
}

/* 确保全屏显示 */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
