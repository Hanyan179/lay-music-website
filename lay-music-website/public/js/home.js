console.log('🔥 home.js 开始加载...')

import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'

console.log('📦 Three.js 导入完成:', THREE)

/* ——————————————— 参数配置 ——————————————— */
const isMobile = window.innerWidth < 768
const PARTICLES = isMobile ? 8000 : 15000
const DEPTH = 100
const SHAPE_SCALE = 1.2

console.log('⚙️ 配置完成 - 移动端:', isMobile, '粒子数:', PARTICLES)

/* ——————————————— 全局变量 ——————————————— */
let camera, scene, renderer, particleSystem, uniforms
let autoRotate = true
let isExiting = false
let mouse = new THREE.Vector2()
let audioContext, analyser, audioElement, dataArray

/* ——————————————— WebGL 检测 ——————————————— */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    console.log('🔍 WebGL 检测结果:', !!gl)
    return !!gl
  } catch (e) {
    console.error('❌ WebGL 检测错误:', e)
    return false
  }
}

/* ——————————————— 初始化 ——————————————— */
function init() {
  console.log('🚀 初始化 3D 场景...')
  
  // 首先隐藏fallback
  const fallback = document.getElementById('no-webgl')
  if (fallback) {
    fallback.classList.add('hidden')
    console.log('👻 隐藏fallback元素')
  }
  
  // WebGL 检测
  if (!isWebGLAvailable()) {
    console.log('❌ WebGL 不可用，显示fallback')
    if (fallback) fallback.classList.remove('hidden')
    return
  }
  
  console.log('✅ WebGL 可用，开始创建场景')

  try {
    // 场景设置
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 200

    const canvas = document.getElementById('webgl-canvas')
    console.log('🎯 Canvas 元素:', canvas)
    
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0) // 透明背景

    console.log('✅ 渲染器创建成功')

    // 创建粒子系统
    createParticleSystem()

    // 事件监听
    setupEventListeners()

    // UI 动画
    animateUI()

    // 音频设置
    setupAudio()

    // SVG 动画效果
    initSVGEffect()

    // 开始渲染
    animate()
    
    console.log('🎉 3D 场景初始化完成')
  } catch (error) {
    console.error('💥 场景创建错误:', error)
    if (fallback) fallback.classList.remove('hidden')
  }
}

/* ——————————————— 粒子系统 ——————————————— */
function createParticleSystem() {
  console.log('🎯 创建粒子系统...')
  
  // 创建 "50" 形状的粒子点
  const positions = generateShapePositions()
  console.log('📍 生成粒子位置数量:', positions.length / 3)
  
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  // 添加随机属性
  const sizes = new Float32Array(PARTICLES)
  const randoms = new Float32Array(PARTICLES)
  
  for (let i = 0; i < PARTICLES; i++) {
    sizes[i] = Math.random() * 2 + 1
    randoms[i] = Math.random()
  }
  
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

  console.log('🔧 几何体属性设置完成')

  // Shader 材质
  uniforms = {
    uTime: { value: 0 },
    uSize: { value: 0 },
    uOpacity: { value: 0 },
    uDepth: { value: DEPTH },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uAudioLevel: { value: 0 },  // 音频强度
    uAudioFreq: { value: 0 }    // 音频频率
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      uniform float uDepth;
      uniform float uPixelRatio;
      uniform float uAudioLevel;
      uniform float uAudioFreq;
      
      attribute float size;
      attribute float aRandom;
      
      varying float vOpacity;
      varying float vRandom;
      
      void main() {
        vRandom = aRandom;
        
        vec3 pos = position;
        
        // 基础浮动效果
        pos.x += sin(uTime + aRandom * 6.28) * 2.0;
        pos.y += cos(uTime * 0.7 + aRandom * 6.28) * 1.5;
        
        // 音频反应效果
        float audioEffect = uAudioLevel * 0.5;
        pos.x += sin(uTime * 2.0 + aRandom * 10.0) * audioEffect;
        pos.y += cos(uTime * 1.5 + aRandom * 8.0) * audioEffect;
        pos.z += sin(uTime + uAudioFreq * 0.1) * audioEffect * 20.0;
        
        // 根据深度计算透明度
        vOpacity = 1.0 - abs(pos.z) / uDepth;
        vOpacity = smoothstep(0.1, 1.0, vOpacity);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // 适中的粒子大小，带音频反应
        float sizeMultiplier = 1.0 + audioEffect;
        float sizeAttenuation = 200.0 / length(mvPosition.xyz);
        gl_PointSize = uSize * size * vOpacity * sizeAttenuation * uPixelRatio * sizeMultiplier;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      uniform float uAudioLevel;
      
      varying float vOpacity;
      varying float vRandom;
      
      void main() {
        // 圆形粒子
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha *= vOpacity * uOpacity;
        
        // 音频反应的发光效果
        alpha += (1.0 - smoothstep(0.0, 0.4, dist)) * uAudioLevel * 0.3;
        
        // 颜色渐变，带音频变化
        vec3 baseColor = vec3(1.0, 1.0, 1.0);
        vec3 audioColor = vec3(1.0, 0.7, 0.2);
        vec3 color = mix(baseColor, audioColor, vRandom * 0.4 + uAudioLevel * 0.2);
        
        gl_FragColor = vec4(color, alpha);
      }
    `
  })

  console.log('🎨 Shader 材质创建完成')

  particleSystem = new THREE.Points(geometry, material)
  scene.add(particleSystem)

  console.log('✨ 粒子系统添加到场景')

  // 入场动画 - 适中的大小
  gsap.timeline()
    .to(uniforms.uOpacity, { value: 1, duration: 1.2, ease: "power2.out" })
    .to(uniforms.uSize, { value: 6, duration: 1.2, ease: "power2.out" }, 0)
    .to(particleSystem.rotation, { 
      y: Math.PI * 2, 
      duration: 3, 
      ease: "none"
    }, 1.2)
    
  console.log('🎬 入场动画启动 - 粒子将持续旋转并响应音频')
}

/* ——————————————— 生成形状位置 ——————————————— */
function generateShapePositions() {
  const positions = new Float32Array(PARTICLES * 3)
  
  // 创建 "50" 数字的简化形状
  const shapes = [
    // "5" 的形状点
    ...generateDigit5(),
    // "0" 的形状点  
    ...generateDigit0()
  ]

  for (let i = 0; i < PARTICLES; i++) {
    const shapePoint = shapes[i % shapes.length]
    
    // 增大随机偏移范围，让粒子分布更广
    const offset = 25
    positions[i * 3] = (shapePoint.x + (Math.random() - 0.5) * offset) * SHAPE_SCALE
    positions[i * 3 + 1] = (shapePoint.y + (Math.random() - 0.5) * offset) * SHAPE_SCALE
    positions[i * 3 + 2] = (Math.random() - 0.5) * DEPTH
  }

  return positions
}

function generateDigit5() {
  const points = []
  const segments = 80  // 增加段数
  
  // 水平顶线
  for (let i = 0; i <= segments; i++) {
    points.push({ x: -80 + (i / segments) * 60, y: 80 })
  }
  
  // 左侧竖线
  for (let i = 0; i <= segments; i++) {
    points.push({ x: -80, y: 80 - (i / segments) * 40 })
  }
  
  // 中间横线
  for (let i = 0; i <= segments; i++) {
    points.push({ x: -80 + (i / segments) * 50, y: 40 })
  }
  
  // 右侧弧线
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI
    points.push({ 
      x: -30 + Math.cos(angle) * 35, 
      y: 40 - Math.sin(angle) * 40 
    })
  }
  
  // 额外填充点
  for (let i = 0; i < 200; i++) {
    points.push({
      x: -80 + Math.random() * 60,
      y: -20 + Math.random() * 100
    })
  }
  
  return points
}

function generateDigit0() {
  const points = []
  const segments = 150  // 增加段数
  const offsetX = 80
  
  // 椭圆形状
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    points.push({
      x: offsetX + Math.cos(angle) * 35,
      y: Math.sin(angle) * 70
    })
  }
  
  // 内部填充
  for (let i = 0; i < 300; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 25
    points.push({
      x: offsetX + Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 2
    })
  }
  
  return points
}

/* ——————————————— 事件监听 ——————————————— */
function setupEventListeners() {
  window.addEventListener('resize', onWindowResize)
  
  if (!isMobile) {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('wheel', onFirstInteraction, { once: true })
  }
  
  // 更新为SVG和CTA点击
  document.getElementById('wave-svg').addEventListener('click', onFirstInteraction, { once: true })
  document.getElementById('cta').addEventListener('click', onFirstInteraction, { once: true })
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
}

function onMouseMove(event) {
  if (isExiting) return
  
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  
  // 保持自动旋转，只添加视差效果
  // autoRotate = false  // 注释掉这行，保持持续旋转
  
  // 相机跟随鼠标（视差效果）
  const targetX = mouse.x * 0.05  // 减小视差幅度，避免干扰旋转
  const targetY = mouse.y * 0.05
  
  gsap.to(camera.rotation, {
    x: targetY,
    y: targetX,
    duration: 1.2,
    ease: "power2.out"
  })
}

function onFirstInteraction() {
  if (isExiting) return
  exitIntro()
}

/* ——————————————— UI 动画 ——————————————— */
function animateUI() {
  // 移除原来的简单淡入动画，让CSS的逐字动画生效
  console.log('🎬 使用CSS逐字动画替代简单的淡入效果')
  
  // 可以在这里添加其他UI元素的动画
  gsap.fromTo('.cta', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 3.5 }
  )
}

/* ——————————————— 音频设置 ——————————————— */
function setupAudio() {
  const musicPlayer = document.getElementById('music-player')
  const muteBtn = document.getElementById('mute-btn')
  
  // 移动端默认隐藏音乐播放器
  if (isMobile) {
    musicPlayer.style.display = 'none'
    muteBtn.classList.add('hidden')
    return
  }
  
  let isPlayerVisible = true
  
  // 设置音频分析
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    dataArray = new Uint8Array(analyser.frequencyBinCount)
    
    // 尝试连接到iframe中的音频
    audioElement = musicPlayer.querySelector('iframe')
    console.log('🎵 音频分析器设置完成')
  } catch (error) {
    console.log('🎵 音频分析器设置失败，使用默认动画:', error)
  }
  
  // 音量按钮现在控制播放器的显示/隐藏
  muteBtn.addEventListener('click', () => {
    isPlayerVisible = !isPlayerVisible
    
    if (isPlayerVisible) {
      musicPlayer.style.display = 'block'
      muteBtn.classList.remove('muted')
      // 重新加载iframe以恢复播放
      const iframe = musicPlayer.querySelector('iframe')
      const src = iframe.src
      iframe.src = ''
      setTimeout(() => { iframe.src = src }, 100)
    } else {
      musicPlayer.style.display = 'none'
      muteBtn.classList.add('muted')
    }
  })
  
  // 添加播放器入场动画
  setTimeout(() => {
    gsap.fromTo(musicPlayer, 
      { opacity: 0, y: 20 }, 
      { opacity: 0.7, y: 0, duration: 1, ease: "power2.out" }
    )
  }, 2000)
}

/* ——————————————— SVG 动画效果 ——————————————— */
function initSVGEffect() {
  const waveSvg = document.getElementById('wave-svg')
  if (!waveSvg) return
  
  // 添加悬停效果
  waveSvg.addEventListener('mouseenter', () => {
    gsap.to(waveSvg, { scale: 1.1, duration: 0.3, ease: "power2.out" })
  })
  
  waveSvg.addEventListener('mouseleave', () => {
    gsap.to(waveSvg, { scale: 1, duration: 0.3, ease: "power2.out" })
  })
  
  // 整个SVG的轻微浮动
  gsap.to(waveSvg, {
    y: -3,
    duration: 2,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
  })
  
  // 添加入场动画
  gsap.fromTo(waveSvg, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 1.5 }
  )
}

/* ——————————————— 退出动画 ——————————————— */
function exitIntro() {
  if (isExiting) return
  isExiting = true
  
  autoRotate = false
  
  const timeline = gsap.timeline({
    onComplete: () => {
      window.dispatchEvent(new Event('introComplete'))
    }
  })
  
  timeline
    .to(camera.position, { z: 50, duration: 0.8, ease: "power2.in" })
    .to(uniforms.uOpacity, { value: 0, duration: 0.8, ease: "power2.in" }, 0)
    .to(uniforms.uSize, { value: 0, duration: 0.8, ease: "power2.in" }, 0)
    .to(particleSystem.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 0.8, ease: "power2.in" }, 0)
}

/* ——————————————— 渲染循环 ——————————————— */
function animate() {
  requestAnimationFrame(animate)
  
  if (uniforms) {
    uniforms.uTime.value += 0.008
    
    // 音频分析更新
    if (analyser && dataArray) {
      try {
        analyser.getByteFrequencyData(dataArray)
        
        // 计算平均音频强度
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        const audioLevel = sum / (dataArray.length * 255) // 归一化到0-1
        
        // 计算低频强度
        const lowFreq = dataArray.slice(0, 32).reduce((a, b) => a + b, 0) / (32 * 255)
        
        uniforms.uAudioLevel.value = audioLevel
        uniforms.uAudioFreq.value = lowFreq
      } catch (error) {
        // 如果音频分析失败，使用模拟数据
        uniforms.uAudioLevel.value = 0.1 + Math.sin(uniforms.uTime.value * 2) * 0.05
        uniforms.uAudioFreq.value = 0.1 + Math.cos(uniforms.uTime.value * 1.5) * 0.05
      }
    } else {
      // 无音频时使用模拟数据
      uniforms.uAudioLevel.value = 0.1 + Math.sin(uniforms.uTime.value * 2) * 0.05
      uniforms.uAudioFreq.value = 0.1 + Math.cos(uniforms.uTime.value * 1.5) * 0.05
    }
  }
  
  // 确保粒子持续旋转
  if (particleSystem && !isExiting) {
    particleSystem.rotation.y += 0.003  // 稍微加快旋转速度
    particleSystem.rotation.x += 0.001  // 添加轻微的X轴旋转
  }
  
  renderer.render(scene, camera)
}

/* ——————————————— 启动 ——————————————— */
console.log('🚀 准备启动应用...')

function bootstrap() {
  console.log('🔧 Bootstrap 开始执行')
  console.log('📊 检查依赖:', {
    THREE: typeof THREE,
    gsap: typeof gsap,
    document: typeof document
  })
  
  try {
    init()
  } catch (error) {
    console.error('❌ 初始化失败:', error)
    // 显示fallback
    const fallback = document.getElementById('no-webgl')
    if (fallback) {
      fallback.classList.remove('hidden')
    }
  }
}

// 立即尝试启动
console.log('⏰ 文档状态:', document.readyState)
bootstrap() 