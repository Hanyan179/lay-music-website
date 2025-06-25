<template>
    <!-- 全屏 Canvas 用于 Three.js 渲染 -->
    <canvas ref="canvasRef" class="webgl-canvas" />
    <!-- 噪点覆层，用于提升质感 (功能 C) -->
    <div class="noise-overlay"></div>

    <!-- ========== 功能 B：DOM 卡片层 ========== -->
    <div class="card-layer">
      <div
        v-for="(url, idx) in imageUrls"
        :key="idx"
        class="card"
        :style="{ backgroundImage: `url(${url})` }"
      ></div>
    </div>
  </template>
  
  <script setup lang="ts">
  /**
   * MessageWall.vue (重写)
   * 功能概述：
   * 1. 使用 Three.js 创建全屏 WebGL 场景。
   * 2. 纯黑背景，中心放置线框球体。
   * 3. 透视相机 + 受限 OrbitControls（仅水平旋转）。
   * 4. 基本渲染循环及自适应窗口。
   * 每个功能段落均附中文注释。
   */
  
  // ================= Vue =================
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  
  // ================= Three.js 类型引入（仅做类型提示） =================
  import type {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Group,
    Mesh,
    Vector3,
    Clock
  } from 'three'
  
  // ====== 运行时 THREE 占位变量（将由动态 import 赋值） ======
  let THREE: any
  
  // ================= 变量声明 =================
  let scene: Scene
  let camera: PerspectiveCamera
  let renderer: WebGLRenderer
  let gridGroup: Group
  let solidSphere: Mesh
  let carouselGroup: Group
  let clock: Clock
  let animationId: number | null = null
  
  // ================= 常量定义 =================
  // 球体半径常量，后续所有与球体相关尺寸引用此值
  const SPHERE_RADIUS = 18
  
  // 卡片圆环半径：在球体外侧一定距离处，可根据需求微调
  const CARD_RING_RADIUS = SPHERE_RADIUS + 8
  
  // ====== 功能 B：卡片图片 URL 列表，供模板 v-for 使用 ======
  const imageUrls = Array.from({ length: 8 }, (_, i) => `https://picsum.photos/seed/${i + 1}/600/400`)
  
  // ================= DOM 引用 =================
  const canvasRef = ref<HTMLCanvasElement>()
  
  // ================= 初始化 Three.js 场景 =================
  const initThree = async () => {
    /* 修复浏览器内 __THREE_DEVTOOLS__ 抛错的问题：
       部分环境中 Three.js DevTools 会注入全局变量，但若其内部方法为空会导致报错。
       这里提前定义空实现，确保安全。*/
    if (typeof window !== 'undefined') {
      (window as any).__THREE_DEVTOOLS__ = {
        dispatchEvent: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      }
    }
    // 动态导入 Three.js 与 OrbitControls，避免 SSR 环境报错
    THREE = await import('three')
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
  
    if (!canvasRef.value) return
  
    /* 1. 创建渲染器：窗口大小 + 抗锯齿 + alpha 通道 */
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
    /* 2. 创建场景并设定背景为纯黑 */
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#000')
  
    /* 3. 创建透视相机并置于 (0, 0, 45) */
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 45)
    scene.add(camera)
  
    /* 4. 创建实体球体（面片）用于遮挡内部，防止透视看到内部结构 */
    const radius = SPHERE_RADIUS // 使用常量统一球体半径
    const solidGeo = new THREE.SphereGeometry(radius - 0.1, 64, 32) // 略小以避免 Z-fighting
    const solidMat = new THREE.MeshBasicMaterial({ color: '#000', side: THREE.FrontSide })
    solidSphere = new THREE.Mesh(solidGeo, solidMat)
    scene.add(solidSphere)
  
    /* 5. 自定义经纬网格线：仅水平圈与垂直圈，无斜线 */
    gridGroup = new THREE.Group()
    const latCount = 48  // 水平圈数量（提高密度）
    const lonCount = 60  // 垂直圈数量（提高密度）
    const segments = 64  // 每条圆环细分段数
  
    // ===== 功能 B：提亮线框球体材质 =====
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x444444,    // 浅灰色
      transparent: true,
      opacity: 0.22       // 22% 透明度，适当提亮
    })
  
    // 创建水平圈（纬线）
    for (let i = 1; i < latCount; i++) {
      const theta = (i / latCount) * Math.PI - Math.PI / 2 // -90° 到 90°
      const y = radius * Math.sin(theta)
      const ringRadius = radius * Math.cos(theta)
  
      const points: Vector3[] = []
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI * 2
        const x = ringRadius * Math.cos(phi)
        const z = ringRadius * Math.sin(phi)
        points.push(new THREE.Vector3(x, y, z))
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geo, lineMaterial)
      gridGroup.add(line)
    }
  
    // 创建垂直圈（经线）
    for (let i = 0; i < lonCount; i++) {
      const phi = (i / lonCount) * Math.PI * 2
      const points: Vector3[] = []
      for (let j = 0; j <= segments; j++) {
        const theta = -Math.PI / 2 + (j / segments) * Math.PI // -90° 到 90°
        const x = radius * Math.cos(theta) * Math.cos(phi)
        const y = radius * Math.sin(theta)
        const z = radius * Math.cos(theta) * Math.sin(phi)
        points.push(new THREE.Vector3(x, y, z))
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geo, lineMaterial)
      gridGroup.add(line)
    }
  
    scene.add(gridGroup)
  
    // 功能 D：前端 DOM 卡片层视差位移
    const gsap = (await import('gsap')).default
    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 45 // 最大 45px 位移
      const y = (e.clientY / window.innerHeight - 0.5) * 45
  
      gsap.to('.card-layer', {
        duration: 1,
        ease: 'power3.out',
        x: -x,
        y: -y
      })
    }
  
    window.addEventListener('pointermove', handlePointerMove)
  
    // 功能 D：自定义光标
    const enterCursor = () => {
      document.body.style.cursor = "url('https://cdn.jsdelivr.net/gh/yeemachine/hand-cursor@main/hand_white_32.png') 16 16, pointer"
    }
    const leaveCursor = () => {
      document.body.style.cursor = 'default'
    }
    canvasRef.value.addEventListener('pointerenter', enterCursor)
    canvasRef.value.addEventListener('pointerleave', leaveCursor)
  
    // 在卸载时清理事件（挂到返回值上供 onUnmounted 使用）
    cleanupFns.push(() => {
      window.removeEventListener('pointermove', handlePointerMove)
      canvasRef.value?.removeEventListener('pointerenter', enterCursor)
      canvasRef.value?.removeEventListener('pointerleave', leaveCursor)
    })
  
    // 启动渲染循环
    animate()

    // ===== 功能 B：首次渲染后随机排布 DOM 卡片 =====
    await nextTick()
    const cards = Array.from(document.querySelectorAll('.card')) as HTMLElement[]

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    cards.forEach((el, idx) => {
      if (idx === 0) {
        // 主卡片：居中且尺寸最大
        el.style.width = '380px'
        el.style.height = '260px'
        el.style.transform = 'translate(-50%, -50%)'
        el.style.zIndex = '3'
        el.style.boxShadow = '0 0 20px rgba(0,0,0,.4)'
      } else {
        const angle = Math.random() * Math.PI * 2
        const radius = lerp(300, 480, Math.random())
        const offsetY = lerp(-180, 180, Math.random())
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius * 0.45 + offsetY

        // 随机尺寸 70%~100%
        const s = lerp(0.7, 1.0, Math.random())
        el.style.width = 240 * s + 'px'
        el.style.height = 160 * s + 'px'

        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
        el.style.zIndex = '1'

        // 悬停交互（提升层级 + 轻微放大）
        el.addEventListener('mouseenter', () => {
          el.style.zIndex = '2'
          el.style.transform += ' scale(1.05)'
        })
        el.addEventListener('mouseleave', () => {
          el.style.zIndex = '1'
          // 去掉 scale 部分，只保留 translate
          const parts = el.style.transform.split(' ')
          el.style.transform = parts[0] + ' ' + parts[1]
        })

        // 清理事件
        cleanupFns.push(() => {
          el.removeEventListener('mouseenter', () => {})
          el.removeEventListener('mouseleave', () => {})
        })
      }
    })
  }
  
  // ================= 渲染循环 =================
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    // （功能 A）渲染循环仅保留 WebGL 场景渲染
    renderer.render(scene, camera)
  }
  
  // ================= 自适应窗口尺寸 =================
  const onResize = () => {
    if (!camera || !renderer) return
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  
  // ================= 生命周期 =================
  onMounted(() => {
    initThree()
    window.addEventListener('resize', onResize)
  })
  
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
    // 可在此处调用 renderer.dispose() / geometry.dispose() 等进行资源释放
    cleanupFns.forEach(fn => fn())
  })
  
  // ================= 清理函数集合，用于统一卸载监听 =================
  const cleanupFns: Array<() => void> = []
  </script>
  
  <style scoped>
  /* 全屏 Canvas 样式 */
  .webgl-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: block;
  }
  </style>
  
  <style scoped>
  /* ========== 功能 C：卡片层样式 ========== */
  .card-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    perspective: 1000px;
  }
  
  .card {
    position: absolute;
    left: 50%;
    top: 50%;
    background-size: cover;
    background-position: center;
    filter: brightness(0.92) contrast(1.05);
    transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    will-change: transform;
  }
  </style>
  
  <style scoped>
  /* 功能 D：文本锐化 */
  :global(body) {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  </style> 