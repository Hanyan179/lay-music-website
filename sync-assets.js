// 自动同步静态资源脚本
const fs = require('fs-extra')
const path = require('path')

const sourceDir = 'src/main/resources/static/assets'
const targetDir = 'public/assets'

async function syncAssets() {
  try {
    console.log('开始同步静态资源...')
    
    // 确保目标目录存在
    await fs.ensureDir(targetDir)
    
    // 复制整个assets目录
    await fs.copy(sourceDir, targetDir)
    
    console.log('✅ 静态资源同步完成！')
    console.log(`从 ${sourceDir} 复制到 ${targetDir}`)
    
    // 列出复制的文件
    const files = await fs.readdir(path.join(targetDir, 'backgrounds'))
    console.log('背景文件:', files)
    
  } catch (error) {
    console.error('❌ 同步失败:', error)
  }
}

syncAssets() 