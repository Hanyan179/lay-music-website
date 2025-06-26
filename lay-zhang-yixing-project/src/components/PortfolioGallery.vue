<!-- 沉浸式滚动照片墙组件 - 复刻 hajimewatanabe.jp 效果 -->
<template>
  <div class="portfolio-gallery" ref="galleryContainer">
    <!-- 滚动容器 - 高度基于图片数量动态计算 -->
    <div 
      class="scroll-container" 
      :style="{ height: scrollHeight + 'px' }"
      ref="scrollContainer"
    >
      <!-- Three.js 渲染画布 - 固定在视口中央 -->
      <canvas 
        ref="canvasRef" 
        class="gallery-canvas"
        @click="handleCanvasClick"
      />
      
      <!-- 项目详情弹窗 -->
      <Teleport to="body">
        <div 
          v-if="selectedProject" 
          class="project-detail-overlay"
          @click="closeProjectDetail"
        >
          <div class="project-detail" @click.stop>
            <button 
              class="close-btn" 
              @click="closeProjectDetail"
              aria-label="关闭项目详情"
            >
              ✕
            </button>
            <img 
              :src="selectedProject.url" 
              :alt="selectedProject.title"
              class="project-image"
            />
            <div class="project-info">
              <h3>{{ selectedProject.title }}</h3>
              <p>{{ selectedProject.description }}</p>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'
import Lenis from 'lenis'
import { gsap } from 'gsap'

// ================= TypeScript 类型定义 =================
interface ImageData {
  url: string
  title: string
  description: string
}

interface PlaneObject extends THREE.Mesh {
  userData: {
    index: number
    initialPosition: THREE.Vector3
    material: THREE.ShaderMaterial
    imageData: ImageData
  }
}

// ================= 响应式数据 =================
const galleryContainer = ref<HTMLElement>()
const scrollContainer = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const selectedProject = ref<ImageData | null>(null)

// ================= 图片数据配置 =================
const imageDataList: ImageData[] = [
  { url: '/img/music/LIT.png', title: 'LIT', description: '点燃内心的光芒，释放无限能量' },
  { url: '/img/music/NANANA.png', title: 'NANANA', description: '节拍与旋律的完美融合' },
  { url: '/img/music/PRODUCER.png', title: 'PRODUCER', description: '音乐制作人的创作之路' },
  { url: '/img/music/STEP.png', title: 'STEP', description: '每一步都是新的开始' },
  { url: '/img/music/LIT-ba.png', title: 'LIT Background', description: 'LIT专辑的视觉设计背景' },
  { url: '/img/music/NANANA-ba.png', title: 'NANANA Background', description: 'NANANA的艺术视觉呈现' },
  { url: '/img/music/PRODUCER-ba.png', title: 'PRODUCER Background', description: '制作人专辑的背景设计' },
  { url: '/img/music/step-ba.png', title: 'STEP Background', description: 'STEP单曲的背景艺术' }
]

// ================= Three.js 核心对象 =================
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let planes: PlaneObject[] = []
let backgroundPlane: THREE.Mesh
let clock: THREE.Clock

// ================= 滚动控制 =================
let lenis: Lenis
let scrollProgress = 0
const scrollHeight = ref(imageDataList.length * 100 * window.innerHeight / 100) // 每张图片100vh

// ================= 噪声生成器 =================
const noise2D = createNoise2D()

// ================= 布局参数 =================
const layoutParams = {
  // 桌面端三列布局参数
  desktop: {
    columnWidth: 8,
    columns: [-8, 0, 8], // X轴三列位置
    verticalSpacing: 15,
    planeWidth: 6,
    planeHeight: 4
  },
  // 移动端单列布局参数
  mobile: {
    columnWidth: 0,
    columns: [0], // X轴单列位置
    verticalSpacing: 12,
    planeWidth: 5,
    planeHeight: 3.5
  }
}

// ================= 响应式检测 =================
const isMobile = ref(window.innerWidth < 768)

// ================= 着色器代码 =================
// 背景失真顶点着色器
const backgroundVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// 背景失真片段着色器 - 实现波纹和RGB分离效果
const backgroundFragmentShader = `
  uniform float u_time;
  uniform float u_scroll;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  
  varying vec2 vUv;
  
  // 生成平滑噪声
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // 创建波纹效果
  float ripple(vec2 uv, vec2 center, float time) {
    float dist = distance(uv, center);
    return sin(dist * 20.0 - time * 8.0) * exp(-dist * 3.0);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // 鼠标位置影响
    vec2 mouse = u_mouse / u_resolution;
    
    // 时间和滚动影响的失真
    float distortion = 0.02;
    float scrollInfluence = u_scroll * 0.001;
    
    // 创建多层波纹效果
    float wave1 = ripple(uv, mouse, u_time);
    float wave2 = ripple(uv, vec2(0.5, 0.5), u_time * 0.7);
    float wave3 = ripple(uv, vec2(0.3, 0.8), u_time * 0.5);
    
    float totalWave = (wave1 + wave2 + wave3) * distortion;
    
    // RGB 分离效果
    vec2 redOffset = vec2(totalWave + scrollInfluence, 0.0);
    vec2 greenOffset = vec2(0.0, totalWave * 0.5);
    vec2 blueOffset = vec2(-totalWave + scrollInfluence, totalWave);
    
    // 采样颜色通道
    float r = noise(uv + redOffset) * 0.1;
    float g = noise(uv + greenOffset) * 0.15;
    float b = noise(uv + blueOffset) * 0.2;
    
    // 基础渐变背景
    vec3 bgGradient = mix(
      vec3(0.05, 0.05, 0.15), 
      vec3(0.1, 0.05, 0.2), 
      uv.y + sin(u_time * 0.5) * 0.1
    );
    
    vec3 finalColor = bgGradient + vec3(r, g, b);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// 图片平面顶点着色器
const planeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// 图片平面片段着色器 - 支持悬停效果
const planeFragmentShader = `
  uniform sampler2D u_texture;
  uniform float u_time;
  uniform float u_hover;
  uniform float u_opacity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 textureColor = texture2D(u_texture, vUv);
    
    // 悬停时的发光效果
    float glow = u_hover * 0.3 * (1.0 + sin(u_time * 4.0) * 0.2);
    
    // 边缘发光
    vec2 center = vec2(0.5);
    float dist = distance(vUv, center);
    float edgeGlow = (1.0 - dist) * u_hover * 0.5;
    
    vec3 finalColor = textureColor.rgb + vec3(glow + edgeGlow);
    
    gl_FragColor = vec4(finalColor, textureColor.a * u_opacity);
  }
`

// ================= 初始化 Three.js 场景 =================
const initThreeScene = async (): Promise<void> => {
  if (!canvasRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    50, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  )
  camera.position.set(0, 0, 20)
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: false
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  
  // 创建时钟
  clock = new THREE.Clock()
  
  // 创建背景失真平面
  createBackgroundPlane()
  
  // 预加载纹理并创建图片平面
  await loadTexturesAndCreatePlanes()
  
  // 启动渲染循环
  animate()
}

// ================= 创建背景失真平面 =================
const createBackgroundPlane = (): void => {
  const geometry = new THREE.PlaneGeometry(50, 50)
  const material = new THREE.ShaderMaterial({
    vertexShader: backgroundVertexShader,
    fragmentShader: backgroundFragmentShader,
    uniforms: {
      u_time: { value: 0 },
      u_scroll: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }
  })
  
  backgroundPlane = new THREE.Mesh(geometry, material)
  backgroundPlane.position.z = -10
  scene.add(backgroundPlane)
}

// ================= 加载纹理并创建图片平面 =================
const loadTexturesAndCreatePlanes = async (): Promise<void> => {
  const textureLoader = new THREE.TextureLoader()
  
  // 启用纹理缓存
  THREE.Cache.enabled = true
  
  // 获取当前布局参数
  const layout = isMobile.value ? layoutParams.mobile : layoutParams.desktop
  
  // 为每张图片创建平面
  for (let i = 0; i < imageDataList.length; i++) {
    const imageData = imageDataList[i]
    
    try {
      // 加载纹理
      const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          imageData.url,
          resolve,
          undefined,
          reject
        )
      })
      
      // 创建几何体
      const geometry = new THREE.PlaneGeometry(layout.planeWidth, layout.planeHeight)
      
      // 创建材质
      const material = new THREE.ShaderMaterial({
        vertexShader: planeVertexShader,
        fragmentShader: planeFragmentShader,
        uniforms: {
          u_texture: { value: texture },
          u_time: { value: 0 },
          u_hover: { value: 0 },
          u_opacity: { value: 1 }
        },
        transparent: true
      })
      
      // 创建网格
      const plane = new THREE.Mesh(geometry, material) as unknown as PlaneObject
      
      // 计算位置
      const columnIndex = i % layout.columns.length
      const rowIndex = Math.floor(i / layout.columns.length)
      
      const x = layout.columns[columnIndex]
      const y = -rowIndex * layout.verticalSpacing
      
      plane.position.set(x, y, 0)
      
      // 存储用户数据
      plane.userData = {
        index: i,
        initialPosition: new THREE.Vector3(x, y, 0),
        material,
        imageData
      }
      
      planes.push(plane)
      scene.add(plane)
      
    } catch (error) {
      console.error(`纹理加载失败: ${imageData.url}`, error)
    }
  }
}

// ================= 初始化平滑滚动 =================
const initSmoothScroll = (): void => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2
  })
  
  // 滚动事件监听
  lenis.on('scroll', ({ scroll, progress }: { scroll: number; progress: number }) => {
    scrollProgress = progress
    updateCameraAndPlanes(scroll)
  })
  
  // RAF集成
  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

// ================= 更新相机和平面位置 =================
const updateCameraAndPlanes = (scrollValue: number): void => {
  if (!scene || !camera) return
  
  // 相机Z轴移动 - 基于滚动进度
  const maxCameraZ = imageDataList.length * 15
  camera.position.z = 20 - scrollProgress * maxCameraZ
  
  // 更新所有平面的位置和效果
  planes.forEach((plane, index) => {
    const { material, initialPosition } = plane.userData
    
    // 使用噪声创建漂浮效果
    const time = clock.getElapsedTime()
    const noiseX = noise2D(time * 0.5 + index, time * 0.3) * 0.5
    const noiseY = noise2D(time * 0.3 + index, time * 0.5) * 0.3
    const noiseRotationZ = noise2D(time * 0.2 + index, time * 0.4) * 0.1
    
    // 滚动影响位置
    const scrollInfluence = scrollProgress * 2
    
    plane.position.x = initialPosition.x + noiseX + Math.sin(scrollInfluence + index) * 0.8
    plane.position.y = initialPosition.y + noiseY + Math.cos(scrollInfluence + index) * 0.5
    plane.rotation.z = noiseRotationZ
    
    // 更新着色器时间
    material.uniforms.u_time.value = time
  })
  
  // 更新背景着色器
  if (backgroundPlane) {
    const bgMaterial = backgroundPlane.material as THREE.ShaderMaterial
    bgMaterial.uniforms.u_scroll.value = scrollValue
    bgMaterial.uniforms.u_time.value = clock.getElapsedTime()
  }
}

// ================= 鼠标移动事件 =================
const handleMouseMove = (event: MouseEvent): void => {
  if (!backgroundPlane) return
  
  const bgMaterial = backgroundPlane.material as THREE.ShaderMaterial
  bgMaterial.uniforms.u_mouse.value.set(
    event.clientX,
    window.innerHeight - event.clientY
  )
}

// ================= 画布点击事件 - 项目详情 =================
const handleCanvasClick = (event: MouseEvent): void => {
  if (!camera || !renderer) return
  
  // 计算鼠标在标准化设备坐标中的位置
  const rect = canvasRef.value!.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  )
  
  // 创建射线
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  
  // 检测相交的平面
  const intersects = raycaster.intersectObjects(planes)
  
  if (intersects.length > 0) {
    const clickedPlane = intersects[0].object as PlaneObject
    const imageData = clickedPlane.userData.imageData
    
    // 显示项目详情
    showProjectDetail(imageData, clickedPlane)
  }
}

// ================= 显示项目详情 =================
const showProjectDetail = (imageData: ImageData, plane: PlaneObject): void => {
  selectedProject.value = imageData
  
  // 暂停滚动
  if (lenis) {
    lenis.stop()
  }
  
  // 动画效果：放大选中的平面，淡出其他平面
  gsap.to(plane.scale, {
    x: 1.4,
    y: 1.4,
    z: 1.4,
    duration: 0.8,
    ease: "power2.out"
  })
  
  gsap.to(plane.rotation, {
    x: 0,
    y: 0,
    z: 0,
    duration: 0.8,
    ease: "power2.out"
  })
  
  // 淡出其他平面
  planes.forEach((otherPlane) => {
    if (otherPlane !== plane) {
      gsap.to(otherPlane.userData.material.uniforms.u_opacity, {
        value: 0.2,
        duration: 0.6,
        ease: "power2.out"
      })
    }
  })
}

// ================= 关闭项目详情 =================
const closeProjectDetail = (): void => {
  if (!selectedProject.value) return
  
  // 恢复滚动
  if (lenis) {
    lenis.start()
  }
  
  // 恢复所有平面
  planes.forEach((plane) => {
    gsap.to(plane.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.6,
      ease: "power2.out"
    })
    
    gsap.to(plane.userData.material.uniforms.u_opacity, {
      value: 1,
      duration: 0.6,
      ease: "power2.out"
    })
  })
  
  selectedProject.value = null
}

// ================= 窗口大小调整 =================
const handleResize = (): void => {
  if (!camera || !renderer) return
  
  const newIsMobile = window.innerWidth < 768
  
  // 更新相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  
  // 更新渲染器大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  // 更新背景着色器分辨率
  if (backgroundPlane) {
    const bgMaterial = backgroundPlane.material as THREE.ShaderMaterial
    bgMaterial.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight)
  }
  
  // 如果移动端状态改变，重新布局
  if (newIsMobile !== isMobile.value) {
    isMobile.value = newIsMobile
    repositionPlanes()
  }
}

// ================= 重新定位平面 =================
const repositionPlanes = (): void => {
  const layout = isMobile.value ? layoutParams.mobile : layoutParams.desktop
  
  planes.forEach((plane, index) => {
    const columnIndex = index % layout.columns.length
    const rowIndex = Math.floor(index / layout.columns.length)
    
    const x = layout.columns[columnIndex]
    const y = -rowIndex * layout.verticalSpacing
    
    // 更新初始位置
    plane.userData.initialPosition.set(x, y, 0)
    
    // 平滑动画到新位置
    gsap.to(plane.position, {
      x,
      y,
      duration: 0.8,
      ease: "power2.out"
    })
    
    // 更新几何体大小
    const geometry = new THREE.PlaneGeometry(layout.planeWidth, layout.planeHeight)
    plane.geometry.dispose()
    plane.geometry = geometry
  })
}

// ================= 渲染循环 =================
const animate = (): void => {
  if (!renderer || !scene || !camera) return
  
  // 渲染场景
  renderer.render(scene, camera)
  
  // 继续下一帧
  requestAnimationFrame(animate)
}

// ================= 生命周期钩子 =================
onMounted(async () => {
  await nextTick()
  
  // 初始化Three.js场景
  await initThreeScene()
  
  // 初始化平滑滚动
  initSmoothScroll()
  
  // 添加事件监听
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  
  // 销毁Lenis
  if (lenis) {
    lenis.destroy()
  }
  
  // 清理Three.js资源
  if (renderer) {
    renderer.dispose()
  }
  
  if (scene) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (object.material instanceof THREE.Material) {
          object.material.dispose()
        }
      }
    })
  }
})
</script>

<style scoped>
/* ================= 主容器样式 ================= */
.portfolio-gallery {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

/* ================= 滚动容器 ================= */
.scroll-container {
  position: relative;
  width: 100%;
  pointer-events: none;
}

/* ================= Three.js 画布 ================= */
.gallery-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: auto;
  cursor: pointer;
}

/* ================= 项目详情弹窗 ================= */
.project-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.project-detail {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.4s ease-out;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.project-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.project-info h3 {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.project-info p {
  color: #ccc;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* ================= 动画效果 ================= */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ================= 响应式设计 ================= */
@media (max-width: 768px) {
  .project-detail {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .project-info h3 {
    font-size: 1.5rem;
  }
  
  .project-info p {
    font-size: 1rem;
  }
}

/* ================= 性能优化 ================= */
.gallery-canvas,
.project-detail-overlay,
.project-detail {
  will-change: transform;
}
</style>