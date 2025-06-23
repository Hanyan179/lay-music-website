<template>
  <div class="ripple-demo">
    <!-- 底层背景 -->
    <div class="background"></div>
    
    <!-- 标题 -->
    <h1 class="title">
      下面应该能看到半透明的白色波纹
    </h1>

    <!-- 透明波纹 Canvas -->
    <canvas ref="canvas" class="ripple-canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let gl = null
let program = null
let animationId = null
let startTime = 0

const vertexShaderSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision highp float;
  uniform float iTime;
  uniform vec2  iResolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    // 波纹中心在屏幕中央
    vec2 c = uv - 0.5;
    float dist = length(c) * 2.0;
    // ripples: 多条同心圆，随时间移动
    float ripple = 0.5 + 0.5 * cos(10.0 * dist - iTime * 2.0);
    // 只保留强度在一定阈值内，产生条纹
    ripple = smoothstep(0.45, 0.47, ripple);
    // 输出：白色通道，alpha = ripple * 0.3
    gl_FragColor = vec4(vec3(1.0), ripple * 0.3);
  }
`

function compileShader(source, type) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('着色器编译错误:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initWebGL() {
  gl = canvas.value.getContext('webgl', { alpha: true })
  if (!gl) {
    alert('无法获取 WebGL 上下文')
    return false
  }

  // 编译着色器
  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)

  if (!vertexShader || !fragmentShader) {
    return false
  }

  // 创建程序
  program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('程序链接错误:', gl.getProgramInfoLog(program))
    return false
  }

  gl.useProgram(program)

  // —— 新增：开启透明混合，并设置清屏颜色为全透明 ——
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  // 设置全屏三角形顶点
  const vertices = new Float32Array([
    -1, -1,
     3, -1,
    -1,  3,
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const positionLocation = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

  return true
}

function resize() {
  const width = window.innerWidth
  const height = window.innerHeight
  
  canvas.value.width = width
  canvas.value.height = height
  gl.viewport(0, 0, width, height)
}

function draw() {
  // —— 新增：每帧清除上一次的残留 ——  
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  const currentTime = performance.now()
  const time = (currentTime - startTime) / 1000

  // 设置uniform变量
  const timeLocation = gl.getUniformLocation(program, 'iTime')
  const resolutionLocation = gl.getUniformLocation(program, 'iResolution')
  
  gl.uniform1f(timeLocation, time)
  gl.uniform2f(resolutionLocation, canvas.value.width, canvas.value.height)

  // 绘制
  gl.drawArrays(gl.TRIANGLES, 0, 3)

  animationId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (initWebGL()) {
    startTime = performance.now()
    resize()
    window.addEventListener('resize', resize)
    draw()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.ripple-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://picsum.photos/800/600') center/cover no-repeat;
  z-index: 1;
}

.title {
  position: absolute;
  top: 40vh;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 3;
  margin: 0;
  padding: 20px;
}

.ripple-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
  background: transparent;
}
</style> 