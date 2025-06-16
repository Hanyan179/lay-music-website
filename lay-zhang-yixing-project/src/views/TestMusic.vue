<template>
  <div class="shader-container">
    <canvas ref="canvas" class="shader-canvas"></canvas>
    <div class="info-panel">
      <h2>自定义着色器测试</h2>
      <p>移动鼠标查看效果</p>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'TestMusic',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      uniforms: null,
      animationId: null
    }
  },
  mounted() {
    this.initShader()
    // 绑定 this 给 animate，避免 requestAnimationFrame 丢失上下文
    this.animate = this.animate.bind(this)
    this.animate()
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationId)
    this.renderer && this.renderer.dispose()
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    initShader() {
      const canvas = this.$refs.canvas

      // 场景、相机、渲染器
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      this.camera.position.z = 1

      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(window.devicePixelRatio)

      // 使用真实图片路径
      const textureLoader = new THREE.TextureLoader()
      const texture = textureLoader.load('/img/music/LIT.png')
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping

      // 只定义自定义 uniforms，让Three.js自动处理内置uniforms
      this.uniforms = {
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        time: { value: 0.0 },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        ratio: { value: 1.0 },
        waveLength: { value: 0.1 },
        texture: { value: texture },
        modelMatrix: { value: new THREE.Matrix4() } // 添加传递模型矩阵的 uniform
      }

      const vertexShader = `
        varying vec2 vUv;
        varying vec4 vPosition;
        
        uniform vec2 mouse;
        uniform float time;
        uniform float waveLength;
        uniform mat4 modelMatrix; // 接收模型矩阵

        void main() {
          vUv = uv;

          // 简化的鼠标偏移和波动效果
          vec2 m = mouse * -0.025;
          float vWave = sin(time + (position.x + position.y) * waveLength) * 0.1;

          // 更新顶点位置
          vec3 newPosition = position + vec3(m.x, m.y, vWave);

          // 使用传入的模型矩阵进行变换
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
        }
      `;

      const fragmentShader = `
        precision highp float;
        
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform float time;
        uniform float ratio;
        uniform sampler2D texture;
        
        varying vec2 vUv;
        varying vec4 vPosition;

        #define WAVE_RATIO 8
        #define LIGHT_RATIO float(WAVE_RATIO * 15)

        void main() {
          vec2 p = 7.68 * (gl_FragCoord.xy / resolution.xy - vec2(0.5, 1.0)) - vec2(mouse.x, -15.0);
          vec2 i = p;
          float c = 1.0;

          for(int n = 0; n < WAVE_RATIO; n++) {
            float t = (1.0 - (10.0 / float(n + 10))) * time;
            i = vec2(
              cos(t - (i.x + mouse.x)) + sin(t + (i.y + mouse.y)),
              sin(t - (i.y + mouse.y)) + cos(t + (i.x + mouse.x))
            ) + p;
            c += float(n) / length(vec2(
              p.x / (sin(t + i.x) / 1.1),
              p.y / (cos(t + i.y) / 1.1)
            )) * 20.0;
          }
          c = 1.8 - sqrt(c / LIGHT_RATIO);

          vec4 tx1 = texture2D(texture, vUv + 0.015);
          vec4 tx2 = texture2D(texture, vUv + cos(c) * mouse * 0.75);
          vec4 tx = (tx1 * tx2) * 0.75;

          float alpha = tx.a * ratio;
          vec4 color = vec4(c * c * c * tx.rgb, alpha);
          gl_FragColor = color;
        }
      `;

      const material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
      });

      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      this.scene.add(quad);

      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('resize', this.onWindowResize);
    },

    onMouseMove(event) {
      if (!this.uniforms) return;
      this.uniforms.mouse.value.x = event.clientX / window.innerWidth;
      this.uniforms.mouse.value.y = 1.0 - (event.clientY / window.innerHeight);
    },

    onWindowResize() {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate);
      this.renderer.clear();
      this.uniforms.time.value += 0.01;

      // 将模型矩阵传递给着色器
      this.uniforms.modelMatrix.value = this.scene.children[0].matrixWorld;

      this.renderer.render(this.scene, this.camera);
    }
  }
}
</script>

<style scoped>
.shader-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.shader-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.info-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
  backgrou
