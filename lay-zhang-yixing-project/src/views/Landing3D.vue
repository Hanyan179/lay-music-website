<template>
  <div class="timeline-3d-container" ref="containerRef">
    <!-- 3D 场景容器 -->
    <div class="timeline-canvas" ref="canvasRef"></div>
    
    <!-- 年份显示 -->
    <div 
      class="year-display" 
      ref="yearDisplayRef"
      :class="{ 'visible': showYear }"
    >
      {{ currentYear }}
    </div>
    
    <!-- 年份选择器 -->
    <div 
      class="year-selector" 
      ref="yearSelectorRef"
      :class="{ 'visible': showYearSelector }"
    >
      <h3>选择年份</h3>
      <div class="year-grid">
        <button 
          v-for="event in timelineEvents" 
          :key="event.year"
          class="year-button"
          :class="{ 'active': event.year === currentYear }"
          @click="goToYear(event.year)"
        >
          {{ event.year }}
        </button>
      </div>
    </div>
    
    <!-- 事件信息面板 -->
    <div 
      class="event-info" 
      ref="eventInfoRef"
      :class="{ 'visible': showEventInfo }"
    >
      <h3>{{ currentEvent?.title }}</h3>
      <p>{{ currentEvent?.description }}</p>
    </div>
    
    <!-- 导航提示 -->
    <div class="navigation-hints">
      <div class="hint">
        <span class="icon">🖱️</span>
        <span>长按显示年份选择</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import gsap from 'gsap'

// 路由和引用
const router = useRouter()
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLElement>()
const yearDisplayRef = ref<HTMLElement>()
const yearSelectorRef = ref<HTMLElement>()
const eventInfoRef = ref<HTMLElement>()

// 状态管理
const showYear = ref(false)
const showYearSelector = ref(false)
const showEventInfo = ref(false)
const currentYear = ref(2019)
const currentEvent = ref<TimelineEvent | null>(null)
const isMousePressed = ref(false)

// Three.js 相关变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let timelineGroup: THREE.Group
let particleSystem: THREE.Points
let animationId: number
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2
let hoveredObject: THREE.Group | null = null

// 时间轴数据接口
interface TimelineEvent {
  year: number
  title: string
  description: string
  image: string
  position: THREE.Vector3
  side: 'left' | 'right' // 左侧或右侧
  color: string
  isVideo?: boolean // 是否为视频
}

// 张艺兴音乐生涯时间轴数据 - 走廊式排列（纵深+左右交替）
const timelineEvents: TimelineEvent[] = [
  {
    year: 2016,
    title: "首张个人专辑",
    description: "发行个人首张专辑《LOSE CONTROL》，标志着solo生涯的正式开始",
    image: "/img/music/PRODUCER.png", // 使用本地图片避免CORS
    position: new THREE.Vector3(-250, 0, -800), // 增大间距，左侧，最远
    side: 'left',
    color: "#FF6B6B"
  },
  {
    year: 2017,
    title: "SHEEP 专辑",
    description: "第二张个人专辑，展现更加成熟的音乐风格",
    image: "/img/music/LIT.png",
    position: new THREE.Vector3(250, 0, -600), // 增大间距，右侧
    side: 'right',
    color: "#4ECDC4"
  },
  {
    year: 2018,
    title: "梦不落雨林",
    description: "NAMANANA 全球发行，国际化音乐道路的重要里程碑",
    image: "/timeline.mp4", // 使用本地视频
    position: new THREE.Vector3(-250, 0, -400), // 增大间距，左侧
    side: 'left',
    color: "#45B7D1",
    isVideo: true
  },
  {
    year: 2019,
    title: "HONEY 甜蜜时光",
    description: "甜蜜风格专辑，展现多元化的音乐表达",
    image: "/img/music/STEP.png", // 改为本地图片
    position: new THREE.Vector3(250, 0, -200), // 增大间距，右侧，中心位置
    side: 'right',
    color: "#96CEB4"
  },
  {
    year: 2020,
    title: "莲 (LIT) 中华文化",
    description: "中华文化与现代音乐的完美融合，获得广泛认可",
    image: "/img/music/LIT.png",
    position: new THREE.Vector3(-250, 0, 0), // 增大间距，左侧
    side: 'left',
    color: "#FECA57"
  },
  {
    year: 2021,
    title: "PRODUCER 制作人",
    description: "《我是唱作人2》冠军专辑，制作人才华的全面展现",
    image: "/img/music/PRODUCER.png",
    position: new THREE.Vector3(250, 0, 200), // 增大间距，右侧
    side: 'right',
    color: "#FF9FF3"
  },
  {
    year: 2024,
    title: "STEP 新的征程",
    description: "最新专辑《STEP》，踏向更广阔的音乐世界",
    image: "/img/music/STEP.png",
    position: new THREE.Vector3(-250, 0, 400), // 增大间距，左侧，最近
    side: 'left',
    color: "#54A0FF"
  }
]

// 当前相机位置（Z轴走廊移动）
let currentCameraZ = -200 // 调整初始位置
let targetCameraZ = -200
const walkSpeed = 150 // 增大移动步长，适应新间距

// 3D 对象数组和加载管理
const eventObjects: THREE.Group[] = []
const loadedCards = new Set<number>() // 已加载的卡片索引
const visibleRange = 3 // 一次显示的卡片数量

// 初始化 Three.js 场景
const initThreeJS = () => {
  if (!canvasRef.value) return

  // 场景
  scene = new THREE.Scene()
  
  // 创建简约背景
  createMinimalBackground()

  // 相机 - 调整视角以适应更大的图片
  camera = new THREE.PerspectiveCamera(
    60, // 减小视角，让图片显得更大
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )
  camera.position.set(0, 0, currentCameraZ)

  // 渲染器 - 高清晰度设置
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 高清显示
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
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

  // 添加简化光照
  setupMinimalLighting()

  // 开始渲染循环
  animate()
}

// 创建简约背景
const createMinimalBackground = () => {
  // 纯色背景（暂时用纯色，等用户提供素材）
  scene.background = new THREE.Color(0xf8f9fa)
}

// 创建简约走廊结构
const createMinimalCorridor = () => {
  // 完全移除地板 - 用户要求去掉
  // 不添加任何几何体，保持纯净背景
}

// 设置简化光照
const setupMinimalLighting = () => {
  // 主环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  // 顶部定向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
  directionalLight.position.set(0, 200, 100)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  scene.add(directionalLight)

  // 补充填充光
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
  fillLight.position.set(0, -50, -100)
  scene.add(fillLight)
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

// 加载可见卡片 - 适应新间距
const loadVisibleCards = () => {
  const currentIndex = getCurrentCenterIndex()
  const startIndex = Math.max(0, currentIndex - 1)
  const endIndex = Math.min(timelineEvents.length - 1, currentIndex + 1)
  
  // 加载当前视野内的卡片（2个相邻的）
  for (let i = startIndex; i <= endIndex; i++) {
    if (!loadedCards.has(i)) {
      loadCard(i)
      loadedCards.add(i)
    }
  }
  
  // 卸载远离的卡片以节省内存 - 调整距离阈值
  loadedCards.forEach(index => {
    if (index < startIndex - 1 || index > endIndex + 1) {
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

// 创建图片卡片（平面纸张效果）- 提高清晰度
const createImageCard = (group: THREE.Group, event: TimelineEvent) => {
  // 创建高清占位符 - 增大尺寸
  const placeholderGeometry = new THREE.PlaneGeometry(200, 200)
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
      texture.flipY = true // 修复图片翻转问题
      
      // 移除占位符
      group.remove(placeholder)
      
      // 根据图片尺寸调整卡片大小 - 增大基础尺寸
      const aspectRatio = texture.image.width / texture.image.height
      let cardWidth = 200  // 增大基础尺寸
      let cardHeight = 200
      
      // 保持纵横比，最大边200px
      if (aspectRatio > 1) {
        cardHeight = cardWidth / aspectRatio
      } else {
        cardWidth = cardHeight * aspectRatio
      }
      
      // 创建平面纸张卡片
      const cardGroup = new THREE.Group()
      
      // 主卡片（高清图片）- 无雾蒙效果
      const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight)
      const cardMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: false, // 移除透明效果避免雾蒙感
        side: THREE.DoubleSide
      })
      const card = new THREE.Mesh(cardGeometry, cardMaterial)
      card.castShadow = true
      card.receiveShadow = true
      cardGroup.add(card)
      
      // 纸张阴影层（增强纸张感）
      const shadowGeometry = new THREE.PlaneGeometry(cardWidth + 8, cardHeight + 8)
      const shadowMaterial = new THREE.MeshLambertMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.15
      })
      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
      shadow.position.z = -1
      shadow.position.x = 4
      shadow.position.y = -4
      cardGroup.add(shadow)
      
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
      // CORS错误时显示错误信息
      console.warn('图片加载失败，可能是CORS问题。请确保图片在本地或允许跨域访问。')
    }
  )
}

// 创建视频卡片（平面纸张效果）- 提高清晰度
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
  videoTexture.flipY = true // 修复视频翻转问题
  
  // 等视频加载后获取尺寸
  video.addEventListener('loadedmetadata', () => {
    // 根据视频尺寸调整卡片大小 - 增大基础尺寸
    const aspectRatio = video.videoWidth / video.videoHeight
    let cardWidth = 200  // 增大基础尺寸
    let cardHeight = 200
    
    // 保持纵横比，最大边200px
    if (aspectRatio > 1) {
      cardHeight = cardWidth / aspectRatio
    } else {
      cardWidth = cardHeight * aspectRatio
    }
    
    // 更新几何体
    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight)
    const card = cardGroup.children[0] as THREE.Mesh
    card.geometry.dispose()
    card.geometry = cardGeometry
    
    // 更新阴影
    const shadow = cardGroup.children[1] as THREE.Mesh
    const shadowGeometry = new THREE.PlaneGeometry(cardWidth + 8, cardHeight + 8)
    shadow.geometry.dispose()
    shadow.geometry = shadowGeometry
    
    // 存储尺寸
    group.userData.cardWidth = cardWidth
    group.userData.cardHeight = cardHeight
  })
  
  // 创建平面纸张卡片
  const cardGroup = new THREE.Group()
  
  // 主卡片（高清视频）- 无雾蒙效果
  const cardGeometry = new THREE.PlaneGeometry(200, 200) // 增大默认尺寸
  const cardMaterial = new THREE.MeshBasicMaterial({ 
    map: videoTexture,
    transparent: false, // 移除透明效果避免雾蒙感
    side: THREE.DoubleSide
  })
  const card = new THREE.Mesh(cardGeometry, cardMaterial)
  card.castShadow = true
  card.receiveShadow = true
  cardGroup.add(card)
  
  // 纸张阴影层
  const shadowGeometry = new THREE.PlaneGeometry(208, 208) // 增大默认尺寸
  const shadowMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.15
  })
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
  shadow.position.z = -1
  shadow.position.x = 4
  shadow.position.y = -4
  cardGroup.add(shadow)
  
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

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)

  // 平滑移动相机（走廊行走）
  const easing = 0.05
  currentCameraZ += (targetCameraZ - currentCameraZ) * easing
  camera.position.z = currentCameraZ

  // 检查是否需要加载新卡片
  if (Math.abs(currentCameraZ - targetCameraZ) < 50) {
    loadVisibleCards()
  }

  // 更新事件对象的效果
  updateEventObjects()

  // 更新相机效果
  updateCamera()

  // 渲染场景
  renderer.render(scene, camera)
}

// 更新事件对象效果 - 适应新尺寸
const updateEventObjects = () => {
  eventObjects.forEach((obj, index) => {
    if (!obj.userData.loaded) return
    
    const distance = Math.abs(obj.position.z - currentCameraZ)
    
    // 景深效果 - 调整为新的间距
    const maxDistance = 300 // 增大最大距离以适应新间距
    const normalizedDistance = Math.min(distance / maxDistance, 1)
    const scale = Math.max(0.5, 1 - normalizedDistance * 0.5) // 调整缩放范围
    
    // 应用缩放
    obj.scale.setScalar(scale)
    
    // 根据距离调整材质（仅对阴影应用透明度）
    const cardGroup = obj.userData.cardGroup
    if (cardGroup && cardGroup.children.length > 1) {
      const shadow = cardGroup.children[1] as THREE.Mesh
      const shadowMaterial = shadow.material as THREE.MeshLambertMaterial
      if (shadowMaterial) {
        const shadowOpacity = Math.max(0.05, 0.15 - normalizedDistance * 0.1)
        shadowMaterial.opacity = shadowOpacity
      }
    }
    
    // 轻微浮动动画 - 减小幅度以适应更大的图片
    const time = Date.now() * 0.001
    obj.position.y = timelineEvents[index].position.y + Math.sin(time + index) * 2
  })
}

// 更新相机效果
const updateCamera = () => {
  const time = Date.now() * 0.001
  
  // 轻微的行走摇摆效果
  camera.position.y = Math.sin(time * 2) * 1
  camera.position.x = Math.cos(time * 1.5) * 0.5
  
  // 轻微的头部转动
  camera.rotation.z = Math.sin(time * 0.8) * 0.005
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

// 处理滚轮事件 - 调整范围
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  
  const delta = event.deltaY > 0 ? 1 : -1
  targetCameraZ += delta * walkSpeed
  
  // 限制行走范围 - 调整为新间距
  const minZ = -900
  const maxZ = 500
  targetCameraZ = Math.max(minZ, Math.min(maxZ, targetCameraZ))
  
  // 更新当前年份
  updateCurrentYear()
  
  // 显示事件信息
  showEventInfoPanel()
  
  // 触发加载检查
  loadVisibleCards()
}

// 更新当前年份
const updateCurrentYear = () => {
  let closestEvent = timelineEvents[0]
  let minDistance = Infinity
  
  timelineEvents.forEach(event => {
    const distance = Math.abs(event.position.z - currentCameraZ)
    if (distance < minDistance) {
      minDistance = distance
      closestEvent = event
    }
  })
  
  if (currentYear.value !== closestEvent.year) {
    currentYear.value = closestEvent.year
    currentEvent.value = closestEvent
    
    // 年份变化时的特效
    if (showYear.value && yearDisplayRef.value) {
      gsap.fromTo(yearDisplayRef.value, {
        scale: 0.8,
        rotationY: -90
      }, {
        scale: 1,
        rotationY: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      })
    }
  }
}

// 显示事件信息面板
const showEventInfoPanel = () => {
  showEventInfo.value = true
  
  if (eventInfoRef.value) {
    gsap.fromTo(eventInfoRef.value, {
      y: 50,
      opacity: 0,
      scale: 0.9
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    })
  }
  
  // 3秒后隐藏
  setTimeout(() => {
    if (showEventInfo.value && eventInfoRef.value) {
      gsap.to(eventInfoRef.value, {
        y: 30,
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          showEventInfo.value = false
        }
      })
    }
  }, 3000)
}

// 长按显示年份选择器
let longPressTimer: number | null = null

const handleMouseDown = (event: MouseEvent) => {
  if (event.button === 0) { // 左键
    isMousePressed.value = true
    
    // 短按显示年份
    showYear.value = true
    if (yearDisplayRef.value) {
      gsap.fromTo(yearDisplayRef.value, {
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
  if (yearDisplayRef.value) {
    gsap.to(yearDisplayRef.value, {
      scale: 0.3,
      opacity: 0,
      rotationY: 180,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        showYear.value = false
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

// 跳转到指定年份
const goToYear = (year: number) => {
  const targetEvent = timelineEvents.find(e => e.year === year)
  if (targetEvent) {
    targetCameraZ = targetEvent.position.z
    currentYear.value = year
    currentEvent.value = targetEvent
    
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
    updateCurrentYear()
    
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
  
  if (animationId) {
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

/* 年份显示 */
.year-display {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  font-weight: 300;
  color: #495057;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  letter-spacing: 2px;
}

.year-display.visible {
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

/* 事件信息面板 */
.event-info {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px 28px;
  max-width: 400px;
  text-align: center;
  z-index: 90;
  opacity: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.event-info.visible {
  opacity: 1;
}

.event-info h3 {
  color: #212529;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.event-info p {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
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
  .year-display {
    font-size: 60px;
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
    bottom: 20px;
    left: 20px;
    right: 20px;
    transform: none;
    padding: 16px 20px;
    max-width: none;
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
  .year-display {
    font-size: 48px;
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
    font-size: 16px;
  }
  
  .event-info p {
    font-size: 13px;
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

/* 确保全屏显示 */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
