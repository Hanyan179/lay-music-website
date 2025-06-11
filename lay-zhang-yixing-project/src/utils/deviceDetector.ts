// 设备检测工具函数
export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  platform: string
  userAgent: string
  screenWidth: number
  screenHeight: number
}

/**
 * 检测用户设备类型
 * @returns DeviceInfo 设备信息对象
 */
export function detectDevice(): DeviceInfo {
  const userAgent = navigator.userAgent.toLowerCase()
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  
  // 移动设备关键词检测
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 
    'blackberry', 'windows phone', 'mobile', 'opera mini'
  ]
  
  // 平板设备关键词检测
  const tabletKeywords = [
    'ipad', 'android.*tablet', 'kindle', 'silk', 'playbook'
  ]
  
  // 检查是否为移动设备
  const isMobileByUserAgent = mobileKeywords.some(keyword => 
    userAgent.includes(keyword)
  )
  
  // 检查是否为平板设备
  const isTabletByUserAgent = tabletKeywords.some(keyword => 
    new RegExp(keyword).test(userAgent)
  )
  
  // 基于屏幕尺寸的判断
  const isMobileByScreen = screenWidth <= 768
  const isTabletByScreen = screenWidth > 768 && screenWidth <= 1024
  
  // 综合判断
  const isMobile = isMobileByUserAgent || (isMobileByScreen && !isTabletByUserAgent)
  const isTablet = isTabletByUserAgent || (isTabletByScreen && !isMobileByUserAgent)
  const isDesktop = !isMobile && !isTablet
  
  // 确定平台
  let platform = 'unknown'
  if (userAgent.includes('windows')) platform = 'windows'
  else if (userAgent.includes('mac')) platform = 'mac'
  else if (userAgent.includes('linux')) platform = 'linux'
  else if (userAgent.includes('android')) platform = 'android'
  else if (userAgent.includes('iphone') || userAgent.includes('ipad')) platform = 'ios'
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    platform,
    userAgent,
    screenWidth,
    screenHeight
  }
}

/**
 * 简单的移动设备检测（仅返回布尔值）
 * @returns boolean 是否为移动设备
 */
export function isMobileDevice(): boolean {
  return detectDevice().isMobile
}

/**
 * 检测是否为触摸设备
 * @returns boolean 是否支持触摸
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 获取设备方向
 * @returns string 设备方向 ('portrait' | 'landscape')
 */
export function getOrientation(): 'portrait' | 'landscape' {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

/**
 * 监听设备方向变化
 * @param callback 回调函数
 * @returns function 取消监听的函数
 */
export function onOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void {
  const handleOrientationChange = () => {
    callback(getOrientation())
  }
  
  window.addEventListener('orientationchange', handleOrientationChange)
  window.addEventListener('resize', handleOrientationChange)
  
  return () => {
    window.removeEventListener('orientationchange', handleOrientationChange)
    window.removeEventListener('resize', handleOrientationChange)
  }
} 