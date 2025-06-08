import { GUI } from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted, onUnmounted } from 'vue'

export function useThreeScene () {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  })
  const clock = new THREE.Clock()
  
  // 核心对象
  let gui: GUI | null = null
  let controls: OrbitControls | null = null
  let loadedModel: THREE.Group | null = null
  let mixer: THREE.AnimationMixer | null = null
  
  // 动画控制
  let isEnteringAnimation = true
  let animationProgress = 0
  let animationDuration = 5.0 // 5秒进入动画
  
  // 相机路径
  const entryPath = {
    startPosition: new THREE.Vector3(0, 50, 100),    // 起始位置（远距离）
    endPosition: new THREE.Vector3(0, 2, 0),         // 结束位置（模型内部）
    startTarget: new THREE.Vector3(0, 0, 0),         // 起始观看目标
    endTarget: new THREE.Vector3(0, 2, -5)           // 结束观看目标
  }

  // 场景参数
  const params = {
    // GLB模型设置
    modelPath: '/modules/colored_fixed_preview.glb',
    modelScale: 1.0,
    
    // 动画控制
    animationSpeed: 1.0,
    autoStart: true,
    
    // 光照系统
    ambientIntensity: 0.6,
    directionalIntensity: 1.0,
    pointLightIntensity: 0.8,
    
    // 相机控制
    enableControls: false,
    
    // 材质增强
    materialRoughness: 0.4,
    materialMetalness: 0.1
  }

  // 加载GLB模型
  function loadGLBModel() {
    const loader = new GLTFLoader()
    
    loader.load(
      params.modelPath,
      (gltf) => {
        console.log('🎯 GLB模型加载成功:', gltf)
        
        loadedModel = gltf.scene
        loadedModel.scale.setScalar(params.modelScale)
        
        // 计算模型包围盒
        const box = new THREE.Box3().setFromObject(loadedModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        console.log('📦 模型尺寸:', { center, size })
        
        // 调整相机路径基于模型尺寸
        const maxDimension = Math.max(size.x, size.y, size.z)
        entryPath.startPosition.set(
          center.x,
          center.y + maxDimension * 2,
          center.z + maxDimension * 3
        )
        entryPath.endPosition.copy(center)
        entryPath.endPosition.y += size.y * 0.3
        
        entryPath.startTarget.copy(center)
        entryPath.endTarget.copy(center)
        entryPath.endTarget.z -= size.z * 0.3
        
        // 增强材质
        enhanceModelMaterials(loadedModel)
        
        // 添加到场景
        scene.add(loadedModel)
        
        // 处理动画
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(loadedModel)
          gltf.animations.forEach((clip) => {
            if (mixer) {
              const action = mixer.clipAction(clip)
              action.play()
            }
          })
          console.log('🎬 找到', gltf.animations.length, '个动画')
        }
        
        // 开始进入动画
        if (params.autoStart) {
          startEntryAnimation()
        } else {
          completeEntryAnimation()
        }
      },
      (progress) => {
        const percentage = (progress.loaded / progress.total) * 100
        console.log('⏳ 模型加载进度:', percentage.toFixed(2) + '%')
      },
      (error) => {
        console.error('❌ GLB模型加载失败:', error)
        createFallbackScene()
      }
    )
  }

  // 增强模型材质
  function enhanceModelMaterials(model: THREE.Group) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.roughness = params.materialRoughness
          child.material.metalness = params.materialMetalness
          child.castShadow = true
          child.receiveShadow = true
        } else if (child.material instanceof THREE.MeshBasicMaterial) {
          // 将基础材质升级为标准材质
          const newMaterial = new THREE.MeshStandardMaterial({
            map: child.material.map,
            color: child.material.color,
            roughness: params.materialRoughness,
            metalness: params.materialMetalness
          })
          child.material = newMaterial
          child.castShadow = true
          child.receiveShadow = true
        }
      }
    })
  }

  // 创建后备场景
  function createFallbackScene() {
    const geometry = new THREE.BoxGeometry(10, 10, 10)
    const material = new THREE.MeshStandardMaterial({ 
      color: '#ff6b9d',
      roughness: 0.4,
      metalness: 0.1
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 0, 0)
    scene.add(cube)
    
    console.log('📦 使用后备场景')
    completeEntryAnimation()
  }

  // 开始进入动画
  function startEntryAnimation() {
    isEnteringAnimation = true
    animationProgress = 0
    
    camera.position.copy(entryPath.startPosition)
    camera.lookAt(entryPath.startTarget)
    
    console.log('🚀 开始进入动画')
  }

  // 完成进入动画
  function completeEntryAnimation() {
    isEnteringAnimation = false
    animationProgress = 1.0
    
    camera.position.copy(entryPath.endPosition)
    camera.lookAt(entryPath.endTarget)
    
    if (controls) {
      controls.enabled = true
      controls.target.copy(entryPath.endTarget)
      controls.update()
    }
    
    params.enableControls = true
    console.log('✅ 进入动画完成，控制器已启用')
  }

  // 更新进入动画
  function updateEntryAnimation(deltaTime: number) {
    if (!isEnteringAnimation) return
    
    animationProgress += (deltaTime * params.animationSpeed) / animationDuration
    
    if (animationProgress >= 1.0) {
      completeEntryAnimation()
      return
    }
    
    // 使用easeInOutCubic缓动函数
    const t = easeInOutCubic(animationProgress)
    
    // 插值相机位置
    camera.position.lerpVectors(entryPath.startPosition, entryPath.endPosition, t)
    
    // 插值观看目标
    const currentTarget = new THREE.Vector3()
    currentTarget.lerpVectors(entryPath.startTarget, entryPath.endTarget, t)
    camera.lookAt(currentTarget)
  }

  // 缓动函数
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // 设置光照系统
  function setupLighting() {
    // 环境光
    const ambientLight = new THREE.AmbientLight('#ffffff', params.ambientIntensity)
    scene.add(ambientLight)
    
    // 主方向光
    const directionalLight = new THREE.DirectionalLight('#ffffff', params.directionalIntensity)
    directionalLight.position.set(50, 50, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)
    
    // 补充点光源
    const pointLight1 = new THREE.PointLight('#ffc0cb', params.pointLightIntensity, 100)
    pointLight1.position.set(20, 20, 20)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight('#87ceeb', params.pointLightIntensity, 100)
    pointLight2.position.set(-20, 20, -20)
    scene.add(pointLight2)
  }

  // 设置轨道控制器
  function setupControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enabled = false // 初始禁用，动画完成后启用
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1
    controls.maxDistance = 100
  }

  // 创建GUI控制面板
  function createGUI() {
    gui = new GUI({ title: '🏛️ GLB模型探索器' })
    
    // 模型控制
    const modelFolder = gui.addFolder('🎯 模型控制')
    modelFolder.add(params, 'modelScale', 0.1, 5.0).name('模型缩放').onChange(() => {
      if (loadedModel) {
        loadedModel.scale.setScalar(params.modelScale)
      }
    })
    
    // 动画控制
    const animationFolder = gui.addFolder('🎬 动画控制')
    animationFolder.add(params, 'animationSpeed', 0.1, 3.0).name('动画速度')
    animationFolder.add({ 重新开始: () => {
      startEntryAnimation()
      if (controls) controls.enabled = false
      params.enableControls = false
    }}, '重新开始').name('🔄 重新开始动画')
    
    // 光照控制
    const lightFolder = gui.addFolder('💡 光照控制')
    lightFolder.add(params, 'ambientIntensity', 0, 2).name('环境光强度').onChange(() => {
      scene.traverse((child) => {
        if (child instanceof THREE.AmbientLight) {
          child.intensity = params.ambientIntensity
        }
      })
    })
    lightFolder.add(params, 'directionalIntensity', 0, 3).name('方向光强度').onChange(() => {
      scene.traverse((child) => {
        if (child instanceof THREE.DirectionalLight) {
          child.intensity = params.directionalIntensity
        }
      })
    })
    lightFolder.add(params, 'pointLightIntensity', 0, 2).name('点光源强度').onChange(() => {
      scene.traverse((child) => {
        if (child instanceof THREE.PointLight) {
          child.intensity = params.pointLightIntensity
        }
      })
    })
    
    // 相机控制
    const cameraFolder = gui.addFolder('📷 相机控制')
    cameraFolder.add(params, 'enableControls').name('启用控制器').onChange(() => {
      if (controls) {
        controls.enabled = params.enableControls
      }
    })
    
    // 材质控制
    const materialFolder = gui.addFolder('🎨 材质控制')
    materialFolder.add(params, 'materialRoughness', 0, 1).name('粗糙度').onChange(() => {
      if (loadedModel) {
        enhanceModelMaterials(loadedModel)
      }
    })
    materialFolder.add(params, 'materialMetalness', 0, 1).name('金属度').onChange(() => {
      if (loadedModel) {
        enhanceModelMaterials(loadedModel)
      }
    })
    
    // 操作指南
    const guideFolder = gui.addFolder('📖 操作指南')
    const guide = {
      '🎯 模型探索': '动画完成后可自由探索',
      '🖱️ 鼠标控制': '左键旋转，右键平移，滚轮缩放',
      '⌨️ 重新开始': '点击重新开始按钮重播动画',
      '🎛️ 参数调节': '使用控制面板自定义效果',
      '🏛️ 模型导航': '在模型内部自由移动探索'
    }
    
    Object.entries(guide).forEach(([action, description]) => {
      const obj = { [action]: () => console.log(description) }
      guideFolder.add(obj, action).name(`${description}`)
    })
  }

  // 初始化函数
  function init() {
    // 渲染器设置
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace
    
    // 场景背景
    scene.background = new THREE.Color('#000510')
    
    // 设置各个系统
    setupLighting()
    setupControls()
    createGUI()
    
    // 加载GLB模型
    loadGLBModel()
    
    // 窗口大小调整
    window.addEventListener('resize', onResize)
    
    // 主渲染循环
    function animate() {
      const deltaTime = clock.getDelta()
      
      // 更新进入动画
      updateEntryAnimation(deltaTime)
      
      // 更新模型动画
      if (mixer) {
        mixer.update(deltaTime)
      }
      
      // 更新轨道控制器
      if (controls && controls.enabled) {
        controls.update()
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
    
    if (gui) {
      gui.destroy()
    }
    if (controls) {
      controls.dispose()
    }
    if (mixer) {
      mixer.stopAllAction()
    }
    
    renderer.dispose()
  })

  return { scene, camera, renderer }
} 