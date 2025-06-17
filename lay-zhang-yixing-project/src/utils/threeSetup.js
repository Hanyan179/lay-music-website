import * as THREE from 'three'

// 创建一个不被Vue响应式系统监听的Three.js管理器
export class ThreeManager {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.particleSystem = null
    this.velocities = null
    this.wireframe = null
    this.animationId = null
    this.clock = new THREE.Clock()
    
    // 防止Vue对Three.js对象进行响应式包装
    Object.defineProperty(this, '_isThreeManager', {
      value: true,
      enumerable: false,
      writable: false
    })
  }

  initScene(canvas) {
    // 创建场景
    this.scene = new THREE.Scene()
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 50
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true 
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    
    // 创建环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    this.scene.add(ambientLight)
    
    return this
  }

  createParticleSystem() {
    const particleCount = 150
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = []
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // 随机位置
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = (Math.random() - 0.5) * 100
      positions[i3 + 2] = (Math.random() - 0.5) * 30
      
      // 存储速度信息
      velocities.push({
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.05
      })
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.velocities = velocities
    
    // 创建点材质
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })
    
    this.particleSystem = new THREE.Points(geometry, material)
    this.scene.add(this.particleSystem)
    
    return this
  }

  createBackgroundGrid() {
    const gridSize = 50
    const divisions = 20
    
    // 创建网格
    const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x333333, 0x111111)
    gridHelper.position.y = -20
    gridHelper.material.transparent = true
    gridHelper.material.opacity = 0.1
    this.scene.add(gridHelper)
    
    // 创建几何体线框
    const wireframeGeometry = new THREE.SphereGeometry(15, 16, 16)
    const wireframeMaterial = new THREE.WireframeGeometry(wireframeGeometry)
    const wireframe = new THREE.LineSegments(wireframeMaterial, new THREE.LineBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.1
    }))
    wireframe.position.set(0, 0, -10)
    this.scene.add(wireframe)
    this.wireframe = wireframe
    
    return this
  }

  updateParticles(mouse) {
    if (!this.particleSystem || !this.velocities) return
    
    const positions = this.particleSystem.geometry.attributes.position.array
    const time = this.clock.getElapsedTime()
    
    for (let i = 0; i < this.velocities.length; i++) {
      const i3 = i * 3
      const velocity = this.velocities[i]
      
      // 基础移动
      positions[i3] += velocity.x
      positions[i3 + 1] += velocity.y
      positions[i3 + 2] += velocity.z
      
      // 鼠标影响
      const dx = positions[i3] - mouse.x * 50
      const dy = positions[i3 + 1] - mouse.y * 50
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 10) {
        const force = (10 - distance) / 10
        positions[i3] += dx * force * 0.01
        positions[i3 + 1] += dy * force * 0.01
      }
      
      // 边界处理
      if (positions[i3] > 50) positions[i3] = -50
      if (positions[i3] < -50) positions[i3] = 50
      if (positions[i3 + 1] > 50) positions[i3 + 1] = -50
      if (positions[i3 + 1] < -50) positions[i3 + 1] = 50
    }
    
    this.particleSystem.geometry.attributes.position.needsUpdate = true
    
    // 旋转线框
    if (this.wireframe) {
      this.wireframe.rotation.y = time * 0.05
      this.wireframe.rotation.x = Math.sin(time * 0.03) * 0.1
    }
  }

  pushParticles(mouseWorldX, mouseWorldY) {
    if (!this.particleSystem || !this.velocities) return
    
    const positions = this.particleSystem.geometry.attributes.position.array
    
    for (let i = 0; i < this.velocities.length; i++) {
      const i3 = i * 3
      const distance = Math.sqrt(
        Math.pow(positions[i3] - mouseWorldX * 50, 2) + 
        Math.pow(positions[i3 + 1] - mouseWorldY * 50, 2)
      )
      
      if (distance < 15) {
        const force = (15 - distance) * 0.1
        const angle = Math.atan2(
          positions[i3 + 1] - mouseWorldY * 50, 
          positions[i3] - mouseWorldX * 50
        )
        this.velocities[i].x += Math.cos(angle) * force
        this.velocities[i].y += Math.sin(angle) * force
      }
    }
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  onWindowResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    if (this.renderer) {
      this.renderer.dispose()
    }
    
    if (this.particleSystem) {
      this.particleSystem.geometry.dispose()
      this.particleSystem.material.dispose()
    }
    
    // 清理所有对象引用
    this.scene = null
    this.camera = null
    this.renderer = null
    this.particleSystem = null
    this.velocities = null
    this.wireframe = null
  }
} 