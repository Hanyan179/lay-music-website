// 3D模型参数配置
export const defaultModelParams = {
  // 模型参数
  scale: 3.2,
  rotationX: -2,
  rotationY: 0,
  rotationZ: 0,
  positionX: 0.1,
  positionY: 0,
  positionZ: 0,
  
  // 相机参数
  cameraPositionX: 0,
  cameraPositionY: 0,
  cameraPositionZ: 5,
  cameraFov: 45,
  
  // 灯光参数
  ambientIntensity: 0.5,
  directionalIntensity: 1.0,
  directionalPositionX: 5,
  directionalPositionY: 5,
  directionalPositionZ: 5,
  
  // 控制参数
  autoRotate: false,
  autoRotateSpeed: 0.005,
  enableDamping: true,
  dampingFactor: 0.05
}

// 预设配置
export const modelPresets = {
  default: {
    name: "默认配置",
    params: { ...defaultModelParams }
  },
  artistic: {
    name: "艺术视角",
    params: {
      ...defaultModelParams,
      scale: 2.8,
      rotationX: -15,
      rotationY: 30,
      cameraPositionY: 2,
      cameraFov: 60,
      autoRotate: true,
      autoRotateSpeed: 0.008
    }
  },
  dramatic: {
    name: "戏剧化视角",
    params: {
      ...defaultModelParams,
      scale: 4.0,
      rotationX: -30,
      cameraPositionZ: 3,
      cameraFov: 35,
      ambientIntensity: 0.3,
      directionalIntensity: 1.5
    }
  },
  close: {
    name: "特写视角",
    params: {
      ...defaultModelParams,
      scale: 5.0,
      cameraPositionZ: 2,
      cameraFov: 30,
      ambientIntensity: 0.7,
      directionalIntensity: 0.8
    }
  }
} 