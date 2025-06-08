import { GUI } from 'lil-gui'
import * as THREE from 'three'
import { onMounted, onUnmounted } from 'vue'

export function useThreeScene () {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  })
  const clock = new THREE.Clock()
  
  // 核心对象
  let gui: GUI | null = null
  let raycaster: THREE.Raycaster | null = null
  let mouse = new THREE.Vector2()
  
  // 场景元素组
  let roomGroup: THREE.Group | null = null
  let furnitureGroup: THREE.Group | null = null
  let decorationGroup: THREE.Group | null = null
  let interactiveObjects: THREE.Object3D[] = []
  
  // 动画和交互
  let targetCameraPosition = new THREE.Vector3(0, 8, 15)
  let targetLookAt = new THREE.Vector3(0, 2, 0)
  let hoveredObject: THREE.Object3D | null = null

  // 少女心温馨屋子参数
  const params = {
    // 房间基础设置
    wallColor: '#FFE4E6',           // 温暖粉色墙壁
    floorColor: '#FFF8DC',          // 奶白色地板
    ceilingColor: '#F8F8FF',        // 幽灵白天花板
    
    // 光照系统
    ambientIntensity: 0.4,          // 环境光强度
    sunlightIntensity: 1.2,         // 阳光强度
    warmLightIntensity: 0.8,        // 温暖光强度
    sunlightColor: '#FFE4B5',       // 温暖阳光色
    lampColor: '#FFB6C1',           // 粉色台灯
    
    // 装饰效果（预留）
    decorativeElements: true,       // 装饰元素开关
    
    // 交互设置
    hoverScale: 1.1,                // 悬停缩放
    clickResponse: true,            // 点击响应
    mouseInfluence: 0.3,            // 鼠标影响强度
    autoRotate: false,              // 自动旋转
    
    // 相机控制
    cameraHeight: 8,                // 相机高度
    cameraDistance: 15,             // 相机距离
    cameraSpeed: 2.0,               // 相机移动速度
    lookAtHeight: 2,                // 视线高度
    
    // 音效（预留）
    enableSounds: true,
    ambientVolume: 0.3,
    interactVolume: 0.5
  }

  // 创建房间结构
  function createRoom() {
    roomGroup = new THREE.Group()
    
    const width = 20, height = 10, depth = 20
    
    // 地板
    const floorGeometry = new THREE.PlaneGeometry(width, depth)
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: params.floorColor
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    roomGroup.add(floor)
    
    // 墙壁
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: params.wallColor
    })
    
    // 后墙
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMaterial)
    backWall.position.set(0, height/2, -depth/2)
    roomGroup.add(backWall)
    
    // 左墙
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), wallMaterial)
    leftWall.position.set(-width/2, height/2, 0)
    leftWall.rotation.y = Math.PI / 2
    roomGroup.add(leftWall)
    
    // 右墙
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), wallMaterial)
    rightWall.position.set(width/2, height/2, 0)
    rightWall.rotation.y = -Math.PI / 2
    roomGroup.add(rightWall)
    
    // 天花板
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshLambertMaterial({ color: params.ceilingColor }))
    ceiling.position.y = height
    ceiling.rotation.x = Math.PI / 2
    roomGroup.add(ceiling)
    
    // 窗户
    const window = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 4), 
      new THREE.MeshBasicMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.3 })
    )
    window.position.set(6, 6, -depth/2 + 0.1)
    roomGroup.add(window)
    
    scene.add(roomGroup)
  }

  // 创建家具
  function createFurniture() {
    furnitureGroup = new THREE.Group()
    
    // 床
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(6, 1, 8),
      new THREE.MeshPhongMaterial({ color: '#FFB6C1', shininess: 30 })
    )
    bed.position.set(-5, 0.5, -5)
    bed.castShadow = true
    bed.userData = { interactive: true, name: 'bed' }
    furnitureGroup.add(bed)
    interactiveObjects.push(bed)
    
    // 枕头
    for (let i = 0; i < 3; i++) {
      const pillow = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 12),
        new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(0.9 + i * 0.05, 0.5, 0.9) })
      )
      pillow.position.set(-5 + i * 1.5, 1.5, -7)
      pillow.scale.set(1, 0.6, 1.2)
      pillow.castShadow = true
      pillow.userData = { interactive: true, name: 'pillow' }
      furnitureGroup.add(pillow)
      interactiveObjects.push(pillow)
    }
    
    // 书桌
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.2, 3),
      new THREE.MeshPhongMaterial({ color: '#F5DEB3' })
    )
    desk.position.set(0, 2, 6)
    desk.castShadow = true
    desk.userData = { interactive: true, name: 'desk' }
    furnitureGroup.add(desk)
    interactiveObjects.push(desk)
    
    scene.add(furnitureGroup)
  }

  // 创建装饰品
  function createDecorations() {
    decorationGroup = new THREE.Group()
    
    // 台灯
    const lamp = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 8),
      new THREE.MeshPhongMaterial({ 
        color: params.lampColor,
        emissive: params.lampColor,
        emissiveIntensity: 0.2
      })
    )
    lamp.position.set(-2, 3, 6)
    lamp.userData = { interactive: true, name: 'lamp' }
    decorationGroup.add(lamp)
    interactiveObjects.push(lamp)
    
    // 台灯光源
    const lampLight = new THREE.PointLight(params.lampColor, 0.8, 10)
    lampLight.position.set(-2, 4, 6)
    lampLight.castShadow = true
    decorationGroup.add(lampLight)
    
    // 花瓶
    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 1, 2, 16),
      new THREE.MeshPhongMaterial({ color: '#E6E6FA', shininess: 80 })
    )
    vase.position.set(2, 3, 6)
    vase.userData = { interactive: true, name: 'vase' }
    decorationGroup.add(vase)
    interactiveObjects.push(vase)
    
    // 毛绒玩具
    for (let i = 0; i < 4; i++) {
      const toy = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 12, 8),
        new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(0.9 + i * 0.1, 0.6, 0.8) })
      )
      toy.position.set(-8 + i * 2, 1.5, Math.random() * 8 - 4)
      toy.userData = { interactive: true, name: 'toy' }
      decorationGroup.add(toy)
      interactiveObjects.push(toy)
    }
    
    scene.add(decorationGroup)
  }

  // 设置光照
  function setupLighting() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xFFE4E6, params.ambientIntensity)
    scene.add(ambientLight)
    
    // 阳光
    const sunlight = new THREE.DirectionalLight(params.sunlightColor, params.sunlightIntensity)
    sunlight.position.set(10, 10, -5)
    sunlight.castShadow = true
    sunlight.shadow.mapSize.width = 2048
    sunlight.shadow.mapSize.height = 2048
    scene.add(sunlight)
    
    // 温暖补光
    const warmLight = new THREE.DirectionalLight('#FFB6C1', params.warmLightIntensity)
    warmLight.position.set(-10, 8, 10)
    scene.add(warmLight)
  }

  // 鼠标交互
  function setupInteraction() {
    raycaster = new THREE.Raycaster()
    
    // 鼠标移动
    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      
      // 相机跟随鼠标
      if (params.mouseInfluence > 0) {
        targetCameraPosition.x = mouse.x * 5
        targetCameraPosition.y = params.cameraHeight + mouse.y * 2
        targetLookAt.x = mouse.x * 3
        targetLookAt.y = params.lookAtHeight + mouse.y
      }
      
      // 射线检测悬停
      if (raycaster) {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(interactiveObjects)
        
        // 重置之前悬停的对象
        if (hoveredObject) {
          hoveredObject.scale.setScalar(1)
          hoveredObject = null
          document.body.style.cursor = 'default'
        }
        
        if (intersects.length > 0) {
          hoveredObject = intersects[0].object
          hoveredObject.scale.setScalar(params.hoverScale)
          document.body.style.cursor = 'pointer'
        }
      }
    })
    
    // 鼠标点击
    window.addEventListener('click', (event) => {
      if (!params.clickResponse || !raycaster) return
      
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(interactiveObjects)
      
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object
        const objectName = clickedObject.userData.name
        
        // 点击动画
        clickedObject.scale.setScalar(1.2)
        setTimeout(() => {
          clickedObject.scale.setScalar(1)
        }, 200)
        
        // 根据物品类型执行不同动作
        handleObjectClick(objectName, clickedObject)
      }
    })
  }

  // 处理物品点击
  function handleObjectClick(objectName: string, object: THREE.Object3D) {
    switch (objectName) {
      case 'lamp':
        // 切换灯光
        if (object instanceof THREE.Mesh) {
          const material = object.material as THREE.MeshPhongMaterial
          material.emissiveIntensity = material.emissiveIntensity > 0 ? 0 : 0.3
        }
        break
      case 'bed':
        // 相机飞向床边
        targetCameraPosition.set(-8, 5, -2)
        targetLookAt.set(-5, 1, -5)
        break
      case 'desk':
        // 相机飞向书桌
        targetCameraPosition.set(0, 6, 12)
        targetLookAt.set(0, 2, 6)
        break
      case 'toy':
        // 玩具跳跃
        const originalY = object.position.y
        object.position.y += 2
        setTimeout(() => {
          object.position.y = originalY
        }, 500)
        break
      default:
        // 默认旋转动画
        object.rotation.y += Math.PI / 4
        break
    }
    
    console.log(`🏠 点击了: ${objectName}`)
  }

  // 创建GUI控制面板
  function createGUI() {
    gui = new GUI({ title: '🏠 温馨少女屋控制台' })
    
    // 房间设置
    const roomFolder = gui.addFolder('🏠 房间设置')
    roomFolder.addColor(params, 'wallColor').name('墙壁颜色').onChange(updateRoomColors)
    roomFolder.addColor(params, 'floorColor').name('地板颜色').onChange(updateRoomColors)
    roomFolder.addColor(params, 'ceilingColor').name('天花板颜色').onChange(updateRoomColors)
    
    // 光照控制
    const lightFolder = gui.addFolder('💡 光照效果')
    lightFolder.add(params, 'ambientIntensity', 0, 2).name('环境光强度').onChange(updateLighting)
    lightFolder.add(params, 'sunlightIntensity', 0, 3).name('阳光强度').onChange(updateLighting)
    lightFolder.addColor(params, 'sunlightColor').name('阳光颜色').onChange(updateLighting)
    lightFolder.addColor(params, 'lampColor').name('台灯颜色').onChange(updateLighting)
    
    // 交互设置
    const interactionFolder = gui.addFolder('🎮 交互控制')
    interactionFolder.add(params, 'hoverScale', 1.0, 1.5).name('悬停缩放')
    interactionFolder.add(params, 'clickResponse').name('点击响应')
    interactionFolder.add(params, 'mouseInfluence', 0, 1).name('鼠标影响')
    
    // 相机控制
    const cameraFolder = gui.addFolder('📷 相机控制')
    cameraFolder.add(params, 'cameraHeight', 3, 15).name('相机高度')
    cameraFolder.add(params, 'cameraDistance', 8, 25).name('相机距离')
    cameraFolder.add(params, 'cameraSpeed', 0.5, 5.0).name('移动速度')
    cameraFolder.add(params, 'lookAtHeight', 0, 8).name('视线高度')
    cameraFolder.add(params, 'autoRotate').name('自动旋转')
    
    // 操作指南
    const guideFolder = gui.addFolder('📖 操作指南')
    const guide = {
      '🖱️ 鼠标移动': '相机跟随鼠标移动',
      '🎯 悬停物品': '物品高亮放大',
      '👆 点击物品': '触发特殊效果',
      '🛏️ 点击床铺': '飞向床边视角',
      '📚 点击书桌': '飞向学习视角',
      '💡 点击台灯': '切换灯光开关'
    }
    
    Object.entries(guide).forEach(([action, description]) => {
      const obj = { [action]: () => console.log(description) }
      guideFolder.add(obj, action).name(`${description}`)
    })
  }

  // 更新函数
  function updateRoomColors() {
    if (roomGroup) {
      roomGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshLambertMaterial) {
          if (child.rotation.x === -Math.PI / 2) {
            // 地板
            child.material.color.setStyle(params.floorColor)
          } else if (child.rotation.x === Math.PI / 2) {
            // 天花板
            child.material.color.setStyle(params.ceilingColor)
          } else {
            // 墙壁
            child.material.color.setStyle(params.wallColor)
          }
        }
      })
    }
  }

  function updateLighting() {
    scene.traverse((child) => {
      if (child instanceof THREE.AmbientLight) {
        child.intensity = params.ambientIntensity
      }
      if (child instanceof THREE.DirectionalLight) {
        child.intensity = params.sunlightIntensity
        child.color.setStyle(params.sunlightColor)
      }
    })
  }

  // 初始化函数
  function init() {
    // 渲染器设置
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    
    // 相机初始位置
    camera.position.copy(targetCameraPosition)
    camera.lookAt(targetLookAt)
    
    // 场景背景
    scene.background = new THREE.Color('#F0F8FF')
    scene.fog = new THREE.Fog('#F0F8FF', 15, 50)
    
    // 创建场景元素
    createRoom()
    createFurniture()
    createDecorations()
    setupLighting()
    setupInteraction()
    createGUI()
    
    // 窗口大小调整
    window.addEventListener('resize', onResize)
    
    // 主渲染循环
    function animate() {
      const time = clock.getElapsedTime()
      
      // 平滑相机运动
      camera.position.lerp(targetCameraPosition, 0.02 * params.cameraSpeed)
      
      const currentLookAt = new THREE.Vector3()
      camera.getWorldDirection(currentLookAt)
      currentLookAt.add(camera.position)
      currentLookAt.lerp(targetLookAt, 0.02 * params.cameraSpeed)
      camera.lookAt(currentLookAt)
      
      if (params.autoRotate) {
        const angle = time * 0.1
        camera.position.x = Math.cos(angle) * params.cameraDistance
        camera.position.z = Math.sin(angle) * params.cameraDistance
        camera.lookAt(0, params.lookAtHeight, 0)
      }
      
      // 装饰品动画
      if (decorationGroup) {
        decorationGroup.children.forEach((child, index) => {
          if (child.userData.name === 'toy') {
            child.rotation.y += 0.01
            child.position.y += Math.sin(time + index) * 0.002
          }
        })
      }
      
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    
    animate()
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  onMounted(init)
  
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', () => {})
    window.removeEventListener('click', () => {})
    
    if (gui) {
      gui.destroy()
    }
    renderer.dispose()
    
    // 重置鼠标样式
    document.body.style.cursor = 'default'
  })

  return { scene, camera, renderer }
} 