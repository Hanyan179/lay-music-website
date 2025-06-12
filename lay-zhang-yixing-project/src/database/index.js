// 数据库统一导出文件
export { douyinData } from './douyinData.js'
export { defaultModelParams, modelPresets } from './modelParams.js'
export { musicData } from './musicData.js'
export { videoData } from './videoData.js'

// 统一数据导出
export const database = {
  musicData: () => import('./musicData.js').then(m => m.musicData),
  videoData: () => import('./videoData.js').then(m => m.videoData),
  douyinData: () => import('./douyinData.js').then(m => m.douyinData),
  modelParams: () => import('./modelParams.js').then(m => ({ 
    defaultModelParams: m.defaultModelParams, 
    modelPresets: m.modelPresets 
  }))
} 