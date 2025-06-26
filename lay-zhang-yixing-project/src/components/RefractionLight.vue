<template>
  <div class="refraction-light-container" ref="refractionContainer">
    <canvas ref="refractionCanvas" class="refraction-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as THREE from 'three';

// Props
interface Props {
  disabled?: boolean
  autoEffect?: boolean
  effectArea?: {
    left: number  // 百分比 0-100
    top: number   // 百分比 0-100  
    width: number // 百分比 0-100
    height: number // 百分比 0-100
  }
  effectInterval?: number // 效果变化间隔时间(毫秒)
  distortionStrength?: number // 折射强度 0.01-1.0
  animationSpeed?: number // 动画速度倍率
  backgroundOpacity?: number // 背景透明度
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  autoEffect: true,
  effectArea: () => ({ left: 0, top: 0, width: 100, height: 100 }),
  effectInterval: 5000,
  distortionStrength: 0.15,
  animationSpeed: 1.0,
  backgroundOpacity: 0.8
})

// Refs
const refractionContainer = ref<HTMLElement>()
const refractionCanvas = ref<HTMLCanvasElement>()

// Three.js 变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera  
let renderer: THREE.WebGLRenderer
let refractionMesh: THREE.Mesh
let material: THREE.ShaderMaterial
let animationId: number
let effectTimer: number | null = null

// 清理函数
let cleanup: (() => void) | null = null

// 初始化 Three.js 折射光效果
const initRefractionEffect = () => {
  if (!refractionCanvas.value || !refractionContainer.value || props.disabled) return
  
  const canvas = refractionCanvas.value
  const container = refractionContainer.value
  
  // 创建场景
  scene = new THREE.Scene()
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 3
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    alpha: true, 
    antialias: true 
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0) // 透明背景
  
  // 设置画布样式
  const resizeCanvas = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  
  // 创建透明的光效纹理（仅用于光线计算）
  const createLightTexture = () => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    
    // 创建完全透明的背景
    ctx.clearRect(0, 0, size, size)
    
    return new THREE.CanvasTexture(canvas)
  }
  
  // 创建几何体 - 使用平面来显示折射效果
  const geometry = new THREE.PlaneGeometry(8, 6, 64, 64)
  
  // 自定义着色器材质
  material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      distortionStrength: { value: props.distortionStrength },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      mouse: { value: new THREE.Vector2(0.5, 0.5) },
      colorTexture: { value: createLightTexture() },
      opacity: { value: props.backgroundOpacity }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      uniform float distortionStrength;
      uniform vec2 mouse;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // 添加顶点位移来创建波动效果
        vec3 newPosition = position;
        
        // 基础波动
        float wave1 = sin(position.x * 3.0 + time * 2.0) * 0.1;
        float wave2 = cos(position.y * 4.0 + time * 1.5) * 0.08;
        
        // 鼠标交互波动
        float mouseInfluence = 1.0 - distance(uv, mouse);
        float mouseWave = sin(distance(uv, mouse) * 10.0 - time * 8.0) * mouseInfluence * 0.15;
        
        newPosition.z += (wave1 + wave2 + mouseWave) * distortionStrength;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float distortionStrength;
      uniform vec2 resolution;
      uniform vec2 mouse;
      uniform sampler2D colorTexture;
      uniform float opacity;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      // 噪声函数
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      void main() {
        // 创建纯透明的基础颜色
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
        
        // 鼠标交互光效
        float mouseDistance = distance(vUv, mouse);
        float mouseEffect = smoothstep(0.2, 0.0, mouseDistance);
        
        if (mouseEffect > 0.0) {
          // 动态光线效果
          float lightIntensity = mouseEffect * 0.3;
          
          // 创建彩色光效
          float time_fast = time * 3.0;
          vec3 lightColor = vec3(
            sin(time_fast + mouseDistance * 10.0) * 0.5 + 0.5,
            cos(time_fast * 1.3 + mouseDistance * 8.0) * 0.5 + 0.5,
            sin(time_fast * 0.8 + mouseDistance * 12.0) * 0.5 + 0.5
          );
          
          // 添加扭曲效果
          float distortion = noise(vUv * 8.0 + time * 0.5) * distortionStrength;
          float wave = sin(mouseDistance * 15.0 - time * 8.0) * lightIntensity;
          
          color.rgb = lightColor * (lightIntensity + wave * 0.3);
          color.a = lightIntensity * 0.6;
        }
        
        // 微妙的环境光效（鼠标移动轨迹）
        float globalGlow = noise(vUv * 3.0 + time * 0.2) * 0.02;
        color.rgb += vec3(globalGlow * 0.5, globalGlow * 0.8, globalGlow);
        color.a += globalGlow * opacity * 0.1;
        
        // 边缘柔化
        float edge = smoothstep(0.0, 0.1, vUv.x) * 
                     smoothstep(1.0, 0.9, vUv.x) * 
                     smoothstep(0.0, 0.1, vUv.y) * 
                     smoothstep(1.0, 0.9, vUv.y);
        
        color.a *= edge;
        
        gl_FragColor = color;
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  })
  
  // 创建网格
  refractionMesh = new THREE.Mesh(geometry, material)
  scene.add(refractionMesh)
  
  // 鼠标交互
  let mouseX = 0.5
  let mouseY = 0.5
  
  const handleMouseMove = (event: MouseEvent) => {
    mouseX = event.clientX / window.innerWidth
    mouseY = 1.0 - (event.clientY / window.innerHeight) // 翻转Y坐标
    
    material.uniforms.mouse.value.set(mouseX, mouseY)
  }
  
  // 自动效果变化
  const startAutoEffect = () => {
    if (!props.autoEffect) return
    
    const scheduleNextChange = () => {
      effectTimer = setTimeout(() => {
        // 随机改变折射强度
        const newStrength = 0.05 + Math.random() * 0.2
        material.uniforms.distortionStrength.value = newStrength
        
        // 更新纹理
        material.uniforms.colorTexture.value = createLightTexture()
        
        scheduleNextChange()
      }, props.effectInterval * (0.8 + Math.random() * 0.4))
    }
    
    scheduleNextChange()
  }
  
  const stopAutoEffect = () => {
    if (effectTimer) {
      clearTimeout(effectTimer)
      effectTimer = null
    }
  }
  
  // 动画循环
  const animate = () => {
    // 更新时间
    material.uniforms.time.value += 0.01 * props.animationSpeed
    
    // 更新动态纹理
    if (Math.random() < 0.02) { // 偶尔更新纹理
      material.uniforms.colorTexture.value = createLightTexture()
    }
    
    // 轻微旋转
    refractionMesh.rotation.z += 0.001
    
    // 渲染场景
    renderer.render(scene, camera)
    
    animationId = requestAnimationFrame(animate)
  }
  
  // 事件监听器 - 全局监听鼠标移动
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('resize', resizeCanvas)
  
  // 启动动画和自动效果
  animate()
  startAutoEffect()
  
  // 清理函数
  return () => {
    document.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', resizeCanvas)
    
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    stopAutoEffect()
    
    // 清理 Three.js 资源
    if (renderer) {
      renderer.dispose()
    }
    if (material) {
      material.dispose()
    }
    if (geometry) {
      geometry.dispose()
    }
  }
}

// 生命周期
onMounted(() => {
  if (!props.disabled) {
    setTimeout(() => {
      cleanup = initRefractionEffect() || null
    }, 100)
  }
})

onBeforeUnmount(() => {
  if (cleanup) {
    cleanup()
  }
})
</script>

<style scoped>
.refraction-light-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* 完全不干扰页面交互 */
  overflow: hidden;
  z-index: 1;
  opacity: 0.8; /* 整体透明度 */
}

.refraction-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* 不拦截鼠标事件，只监听 */
  mix-blend-mode: screen; /* 混合模式让光效更自然 */
}

.refraction-light-container:hover {
  z-index: 2;
}

.refraction-light-container:hover .refraction-canvas {
  opacity: 0.95;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .refraction-light-container {
    opacity: 0.7;
  }
  
  .refraction-canvas {
    cursor: auto;
  }
}

@media (max-width: 480px) {
  .refraction-light-container {
    opacity: 0.5;
  }
}

/* 高性能模式 - 减少GPU负担 */
@media (prefers-reduced-motion: reduce) {
  .refraction-light-container {
    opacity: 0.3;
  }
}
</style> 