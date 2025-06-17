<template>
  <div class="shader-container">
    <!-- WebGL画布 -->
    <canvas 
      ref="canvasRef" 
      class="shader-canvas"
      @click="handleCanvasClick"
      @mousemove="handleMouseMove"
    ></canvas>
    
    <!-- 返回按钮 -->
    <div class="controls">
      <button @click="goBack" class="back-btn">
        返回首页
      </button>
    </div>

    <!-- 调试面板已移除 -->
  </div>
</template>

<script setup lang="ts">
import { videoData } from '@/database/videoData.js'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement | null>(null)

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let animationId: number | null = null
let startTime: number = 0

// 鼠标交互相关变量
let isMouseMoving = false
let mouseStopTimer: number | null = null
let speedMultiplier = 1.0
let isMouseOverCube = false // 鼠标是否悬停在方块上
let mouseX = 0 // 鼠标X坐标（归一化）
let mouseY = 0 // 鼠标Y坐标（归一化）
let videoTextures: WebGLTexture[] = []
let currentVideoIndex = 0

// 累积时间系统 - 用于平滑的时间暂停效果
let accumulatedTime = 0  // 累积的动画时间
let lastFrameTime = 0    // 上一帧的真实时间
let targetSpeed = 1.0    // 目标速度
let currentSpeed = 1.0   // 当前实际速度
const speedTransition = 0.1 // 速度过渡平滑度（更快的过渡）

// 调试相关变量已移除



// 顶点着色器代码
const vertexShaderSource = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`

// 片段着色器代码 - 包含中文注释和鼠标交互控制
const fragmentShaderSource = `
  precision mediump float;
  
  uniform float iTime;         // 时间uniform变量
  uniform vec2 iResolution;    // 分辨率uniform变量
  uniform sampler2D iChannel0; // 纹理采样器
  uniform sampler2D iVideoTex; // 视频缩略图纹理
  uniform float speedMult;     // 速度倍数控制（已弃用，保持兼容性）
  uniform vec2 iMouse;         // 鼠标位置uniform变量
  
  // 着色器专用变量
  
  // 快速原型代码
  #define MAXSTEPS 256              // 最大步进次数
  #define MAXDIST 30.0              // 最大距离
  #define PI 3.1415926535898        // 圆周率
  #define TWOPI 6.28318530718       // 2倍圆周率
  #define FUZZ 0.7                  // 模糊因子
  #define PHASELENGTH 60.0          // 相位长度（原来30.0，现在60.0让动画慢两倍）
  #define PHASE mod(iTime / PHASELENGTH, 1.0)  // 相机位置相位
  #define ANIM_TIME iTime  // 现在使用传入的累积时间，已包含速度控制
  #define PHASE_ANIM mod(ANIM_TIME / PHASELENGTH, 1.0)  // 动画相位
  #define CUBENUM 50.0              // 立方体数量
  #define DISTANCEPERPHASE 150.0    // 每相位距离
  #define EPSILON 0.005             // 精度阈值

  vec3 glow = vec3(0);        // 发光颜色累积
  vec3 lastglow = vec3(0);    // 上次发光颜色
  vec3 cubeColor = vec3(0);   // 立方体颜色
  float ringOffset = +0.6;    // 环形偏移
  bool isMainCube = false;    // 是否为主立方体

  // X轴旋转矩阵
  mat4 rotationX( in float angle ) {
      return mat4(	1.0,		0,			0,			0,
                      0, 	cos(angle),	-sin(angle),		0,
                      0, 	sin(angle),	 cos(angle),		0,
                      0, 			0,			  0, 		1);
  }

  // Y轴旋转矩阵
  mat4 rotationY( in float angle ) {
      return mat4(	cos(angle),		0,		sin(angle),	0,
                              0,		1.0,			 0,	0,
                      -sin(angle),	0,		cos(angle),	0,
                              0, 		0,				0,	1);
  }

  // Z轴旋转矩阵
  mat4 rotationZ( in float angle ) {
      return mat4(	cos(angle),		-sin(angle),	0,	0,
                      sin(angle),		cos(angle),		0,	0,
                              0,				0,		1,	0,
                              0,				0,		0,	1);
  }

  // 位移函数 - 创建螺旋路径（受速度控制）
  vec3 displacement(float p) {
      p *= 8.0*TWOPI/DISTANCEPERPHASE;
      return vec3(sin(p),cos(p*0.5+PI+ANIM_TIME*0.314)*0.37,0)*1.7;
  }

  // 平滑联合操作 - IQ的SDF函数
  float opSmoothUnion( float d1, float d2, float k ) {
      float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
      return mix( d2, d1, h ) - k*h*(1.0-h); 
  }

  // 立方体SDF（有符号距离场）- 调整大小并添加纹理显示
  float sdBox( vec3 p, vec3 b )
  {    
      float interval = DISTANCEPERPHASE/CUBENUM;
      vec3 offset = displacement(floor(p.z / interval + 1.0)*interval - ringOffset);
      vec3 originalP = p;
      p -= offset;

      float num = mod(floor(p.z/interval)+1.0,DISTANCEPERPHASE/interval)*4.0;
      
      // 检查是否为屏幕中央的主要立方体
      vec3 worldPos = originalP;
      float distFromCenter = length(worldPos.xy);
      isMainCube = (distFromCenter < 2.0 && abs(worldPos.z - PHASE_ANIM*DISTANCEPERPHASE) < interval * 2.0);
      
      if (isMainCube) {
          // 主立方体：使用视频纹理，不发光
          cubeColor = vec3(1.0); // 白色基础，让纹理颜色显示
      } else {
          // 其他立方体：使用程序化颜色
          cubeColor = vec3(0.5 + 0.5 * sin(num), 0.3 + 0.3 * cos(num * 1.3), 0.7 + 0.3 * sin(num * 0.7));
      }
      
      p.z = mod(p.z,interval) - interval*0.5;
      // 应用旋转变换（动画速度已通过speedMult调控）
      p = mat3(rotationX(ANIM_TIME*0.52) * rotationZ(ANIM_TIME*1.88))*p;

      // 增大方块尺寸（从0.05增加到0.12）
      vec3 d = abs(p) - b * 2.4;
      float res = length(max(d,0.0)) + min(max(d.x,max(d.y,d.z)),0.0);

      // 计算发光效果 - 主立方体不发光
      if (!isMainCube) {
          lastglow = pow(max(0.0,(1.0-(res/2.0))),4.0) * cubeColor * 0.1;
          glow += lastglow;
      } else {
          lastglow = vec3(0.0); // 主立方体不发光
      }

      return res;
  }

  // 管道SDF - 增加发光效果
  float sdTube(vec3 p, float r)
  {
      p.y += 0.8;
      p -= displacement(p.z);
      float dist = length(p.xy)-r;
      
      // 为管道添加发光效果
      float glowFactor = exp(-abs(dist) * 8.0) * 0.012;
      vec3 tubeGlow = vec3(0.3, 0.62, 0.96) * glowFactor; // 蓝色调发光
      glow += tubeGlow;
      
      return dist;
  }

  // 第二个管道SDF - 增加发光效果
  float sdTube2(vec3 p, float r)
  {
      p -= displacement(p.z+1.5 - ringOffset);
      float dist = min(length(p.xy - vec2(0,0.9)),min(length(p.xy + vec2(0.9,0)),length(p.xy- vec2(0.9,0))))-r;
      
      // 为辅助管道添加发光效果
      float glowFactor = exp(-abs(dist) * 10.0) * 0.017;
      vec3 tubeGlow = vec3(0.35, 0.3, 1.0) * glowFactor; // 蓝紫色调发光
      glow += tubeGlow;
      
      return dist;
  }

  // 环面SDF - 增加发光效果
  float sdTorus( vec3 p, float r1, float r2 )
  {
      float interval = DISTANCEPERPHASE/CUBENUM;
      vec3 offset = displacement(floor(p.z / interval + 1.0)*interval - ringOffset);
      p -= offset;
      p.z = mod(p.z,interval) - interval*0.5;
      float dist = length( vec2(length(p.xy)-r1,p.z) )-r2;
      
      // 为环面添加发光效果
      float glowFactor = exp(-abs(dist) * 12.0) * 0.028;
      vec3 torusGlow = vec3(0.39, 0.66, 1.0) * glowFactor; // 天蓝色调发光
      glow += torusGlow;
      
      return dist;
  }

  // 场景映射函数 - 组合所有几何体
  float map(vec3 pos)
  {
      vec3 p=pos;
      float d0 = sdTube(pos, 0.501);         // 主管道
      float d1 = sdTorus(pos, 0.9, 0.05);    // 环面
      float d2 = sdTube2(pos,0.05);          // 辅助管道
      d0 = opSmoothUnion(d0,d1,0.5);         // 平滑合并
      d0 = opSmoothUnion(d0,d2,0.1);         // 平滑合并
      d1 = sdBox(pos, vec3(0.05));           // 立方体（尺寸已在sdBox内部调整）
      return min(d0,d1);
  }

  // 光线步进算法
  void intersect(vec3 ro, vec3 rd)
  {
      float res;
      float d = 0.01;
      bool hitMainCube = false;
      vec3 hitPoint;
      
      for(int i = 0; i < MAXSTEPS; i++)
      {
          vec3 p = ro + rd * d;      // 当前采样点
          
          // 分别计算各个几何体的距离
          float cubeRes = sdBox(p, vec3(0.05));
          float tubeRes = sdTube(p, 0.501);
          float torusRes = sdTorus(p, 0.9, 0.05);
          float tube2Res = sdTube2(p, 0.05);
          
          res = map(p);              // 计算到场景的距离
          
          // 检查是否碰撞到主立方体（只有立方体可以有纹理）
          if (res < EPSILON * d && cubeRes <= min(min(tubeRes, torusRes), tube2Res) && isMainCube) {
              hitMainCube = true;
              hitPoint = p;
              break;
          }
          
          if(res < EPSILON * d || res > MAXDIST) {
              break;                 // 碰撞或超出最大距离
          }
          d += res*FUZZ;             // 步进
      }
      
      // 只有碰撞到主立方体时才添加纹理效果
      if (hitMainCube) {
          // 改进的立方体纹理映射 - 每个面显示完整图片
          vec3 normal = normalize(hitPoint);
          vec2 uv;
          
          // 根据法向量确定是哪个面，并生成对应的UV坐标
          vec3 absNormal = abs(normal);
          if (absNormal.x > absNormal.y && absNormal.x > absNormal.z) {
              // X面（左右面）
              uv = vec2(hitPoint.z * 0.5 + 0.5, hitPoint.y * 0.5 + 0.5);
          } else if (absNormal.y > absNormal.z) {
              // Y面（上下面）
              uv = vec2(hitPoint.x * 0.5 + 0.5, hitPoint.z * 0.5 + 0.5);
          } else {
              // Z面（前后面）- 主要可见面
              uv = vec2(hitPoint.x * 0.5 + 0.5, hitPoint.y * 0.5 + 0.5);
          }
          
          vec3 texColor = texture2D(iVideoTex, uv).rgb;
          glow += texColor * 1.2; // 增强纹理亮度
      } else {
          glow += lastglow*6.0;          // 其他物体的发光效果
      }
  }

  // 主渲染函数
  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      // 将屏幕坐标转换为UV坐标
      vec2 uv = (fragCoord.xy - iResolution.xy * 0.5)/ iResolution.xy;
      uv.x *= iResolution.x / iResolution.y;

      float fov = 0.25 * PI;                           // 视场角
      vec3 origin = vec3(0,0, PHASE_ANIM*DISTANCEPERPHASE); // 相机原点（也受动画控制）
      vec3 target = origin -vec3(0.0, 0.001, -0.05);   // 目标点

      // 应用位移动画
      target += displacement(target.z*1.0);
      origin += displacement(origin.z*1.0);

      // 构建相机坐标系
      vec3 forward = normalize(target - origin);
      vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));   
      vec3 up = cross(right, forward);
      vec3 dir = normalize(uv.x * right + uv.y * up + fov * forward);

      // 执行光线步进
      intersect(origin, dir);
      
      // 无环境光（设置为0）
      vec3 ambient = vec3(0.0, 0.0, 0.0);
      
      // 无雾化效果（设置为0）
      float depth = length(origin);
      vec3 fog = vec3(0.0, 0.0, 0.0);
      
      // 组合最终颜色，确保可见度
      vec3 finalColor = glow + ambient + fog;
      
      // 减少色调映射强度
      finalColor = finalColor / (1.0 + finalColor * 0.02);
      
      fragColor = vec4(finalColor, 1.0);  // 输出最终颜色
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`

// 创建着色器
const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
  const shader = gl.createShader(type)
  if (!shader) return null
  
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('着色器编译错误:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  
  return shader
}

// 创建着色器程序
const createShaderProgram = (gl: WebGLRenderingContext): WebGLProgram | null => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  
  if (!vertexShader || !fragmentShader) return null
  
  const program = gl.createProgram()
  if (!program) return null
  
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('着色器程序链接错误:', gl.getProgramInfoLog(program))
    return null
  }
  
  return program
}

// 创建简单纹理
const createTexture = (gl: WebGLRenderingContext): WebGLTexture | null => {
  const texture = gl.createTexture()
  if (!texture) return null
  
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // 创建简单的渐变纹理
  const size = 256
  const data = new Uint8Array(size * size * 4)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = (i * size + j) * 4
      data[index] = Math.floor(255 * Math.sin(i / size * Math.PI))     // R
      data[index + 1] = Math.floor(255 * Math.cos(j / size * Math.PI)) // G  
      data[index + 2] = Math.floor(255 * (i + j) / (2 * size))         // B
      data[index + 3] = 255                                            // A
    }
  }
  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  
  return texture
}

// 加载视频缩略图纹理
const loadVideoTexture = (gl: WebGLRenderingContext, imageSrc: string): Promise<WebGLTexture | null> => {
  return new Promise((resolve) => {
    const texture = gl.createTexture()
    if (!texture) {
      resolve(null)
      return
    }
    
    const image = new Image()
    image.crossOrigin = 'anonymous'
    
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      resolve(texture)
    }
    
    image.onerror = () => {
      console.error('加载图片失败:', imageSrc)
      // 创建默认纹理
      gl.bindTexture(gl.TEXTURE_2D, texture)
      const defaultData = new Uint8Array([255, 100, 150, 255]) // 粉色默认纹理
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, defaultData)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      resolve(texture)
    }
    
    image.src = imageSrc
  })
}

// 加载所有视频纹理
const loadAllVideoTextures = async (gl: WebGLRenderingContext) => {
  videoTextures = []
  for (const video of videoData) {
    const texture = await loadVideoTexture(gl, video.thumbnail)
    if (texture) {
      videoTextures.push(texture)
    }
  }
}

// 鼠标移动处理
const handleMouseMove = (event: MouseEvent) => {
  if (!canvasRef.value) return
  
  // 更新鼠标位置（归一化到-1到1）
  const rect = canvasRef.value.getBoundingClientRect()
  mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1) // Y轴翻转
  
  // 简单的方块碰撞检测（基于屏幕中心区域）
  const distFromCenter = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
  isMouseOverCube = distFromCenter < 0.3 // 中心区域半径
  
  // 设置目标速度倍数（基于初始速度0.5）
  if (isMouseOverCube) {
    targetSpeed = 0.0 // 鼠标在方块上，完全停止
    console.log('鼠标在方块上，动画停止')
  } else {
    targetSpeed = 0.15 // 鼠标移动，减速到30% (0.5 * 0.3 = 0.15)
    console.log('鼠标移动，动画减速到30%')
  }
  
  isMouseMoving = true
  
  // 清除之前的计时器
  if (mouseStopTimer) {
    clearTimeout(mouseStopTimer)
  }
  
  // 设置新的计时器，3000ms后认为鼠标停止
  mouseStopTimer = setTimeout(() => {
    isMouseMoving = false
    isMouseOverCube = false
    targetSpeed = 0.5 // 恢复正常速度（原来的减半速度）
    console.log('鼠标停止，恢复正常速度')
  }, 3000)
}

// 渲染循环
const render = (currentTime: number) => {
  if (!gl || !program || !canvasRef.value) return
  
  const realTime = (currentTime - startTime) * 0.001 // 转换为秒
  
  // 初始化时间系统
  if (lastFrameTime === 0) {
    lastFrameTime = realTime
  }
  
  const deltaTime = realTime - lastFrameTime
  lastFrameTime = realTime
  
  // 平滑过渡当前速度到目标速度
  currentSpeed += (targetSpeed - currentSpeed) * speedTransition
  
  // 累积动画时间 - 这样停止时就会保持在当前位置
  accumulatedTime += deltaTime * currentSpeed
  
  gl.viewport(0, 0, canvasRef.value.width, canvasRef.value.height)
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  gl.useProgram(program)
  
  // 设置uniform变量
  const timeLocation = gl.getUniformLocation(program, 'iTime')
  const resolutionLocation = gl.getUniformLocation(program, 'iResolution')
  const channel0Location = gl.getUniformLocation(program, 'iChannel0')
  const speedMultLocation = gl.getUniformLocation(program, 'speedMult')
  const videoTexLocation = gl.getUniformLocation(program, 'iVideoTex')
  const mouseLocation = gl.getUniformLocation(program, 'iMouse')
  
  // 使用累积时间而不是实时时间，这样暂停时就会保持在当前位置
  gl.uniform1f(timeLocation, accumulatedTime) 
  gl.uniform2f(resolutionLocation, canvasRef.value.width, canvasRef.value.height)
  gl.uniform1i(channel0Location, 0)
  gl.uniform1f(speedMultLocation, 1.0) // 速度控制已通过累积时间实现，这里固定为1
  gl.uniform1i(videoTexLocation, 1)
  if (mouseLocation) gl.uniform2f(mouseLocation, mouseX, mouseY)
  
  // 调试uniform设置已移除，使用着色器内硬编码值
  
  // 绑定视频纹理
  if (videoTextures.length > 0) {
    gl.activeTexture(gl.TEXTURE1)
    currentVideoIndex = Math.floor(accumulatedTime * 0.2) % videoTextures.length // 每5秒切换一张图片，也受动画控制
    gl.bindTexture(gl.TEXTURE_2D, videoTextures[currentVideoIndex])
  }
  
  // 绘制全屏四边形
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  
  animationId = requestAnimationFrame(render)
}

// 初始化WebGL
const initWebGL = async () => {
  if (!canvasRef.value) return
  
  gl = canvasRef.value.getContext('webgl')
  if (!gl) {
    console.error('WebGL不支持')
    return
  }
  
  program = createShaderProgram(gl)
  if (!program) return
  
  // 创建全屏四边形顶点
  const vertices = new Float32Array([
    -1, -1,  1, -1,  -1, 1,  1, 1
  ])
  
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  
  const positionLocation = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
  
  // 创建基础纹理
  const texture = createTexture(gl)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // 加载视频缩略图纹理
  await loadAllVideoTextures(gl)
  
  gl.clearColor(0, 0, 0, 1)
  
  // 初始化累积时间系统
  accumulatedTime = 0
  lastFrameTime = 0
  currentSpeed = 0.5  // 初始速度减半（原来的动画慢2倍效果）
  targetSpeed = 0.5
  
  startTime = performance.now()
  render(startTime)
}

// 调整画布大小
const resizeCanvas = () => {
  if (!canvasRef.value) return
  
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

// 处理画布点击
const handleCanvasClick = () => {
  // 切换到下一张视频缩略图
  if (videoTextures.length > 0) {
    currentVideoIndex = (currentVideoIndex + 1) % videoTextures.length
  }
  console.log('画布被点击，切换到视频:', videoData[currentVideoIndex]?.title)
}

// 返回首页
const goBack = () => {
  router.push('/')
}

// 调试函数已移除

// 生命周期
onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  initWebGL()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (mouseStopTimer) {
    clearTimeout(mouseStopTimer)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.shader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.shader-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.controls {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.back-btn:active {
  transform: translateY(0);
}

/* 调试面板样式已移除 */
</style> 