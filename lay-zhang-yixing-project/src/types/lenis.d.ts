// Lenis 平滑滚动库类型定义
declare module 'lenis' {
  interface LenisOptions {
    duration?: number
    easing?: (t: number) => number
    smoothWheel?: boolean
    touchMultiplier?: number
    infinite?: boolean
    wrapper?: HTMLElement
    content?: HTMLElement
    wheelMultiplier?: number
    touchInertiaMultiplier?: number
    gestureOrientation?: 'vertical' | 'horizontal' | 'both'
    normalizeWheel?: boolean
    overscroll?: boolean
  }

  interface LenisScrollData {
    scroll: number
    limit: number
    velocity: number
    direction: number
    progress: number
  }

  export default class Lenis {
    constructor(options?: LenisOptions)
    
    raf(time: number): void
    scrollTo(target: number | string | HTMLElement, options?: {
      offset?: number
      lerp?: number
      duration?: number
      easing?: (t: number) => number
      immediate?: boolean
      lock?: boolean
      force?: boolean
      onComplete?: () => void
    }): void
    
    on(event: 'scroll', callback: (data: LenisScrollData) => void): void
    off(event: 'scroll', callback: (data: LenisScrollData) => void): void
    
    start(): void
    stop(): void
    destroy(): void
    
    readonly scroll: number
    readonly limit: number
    readonly velocity: number
    readonly direction: number
    readonly progress: number
  }
} 