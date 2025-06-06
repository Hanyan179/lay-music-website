const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const multer = require('multer')

const app = express()
const PORT = 3001

// 配置multer用于处理文件上传
const upload = multer({ dest: 'temp/' })

// 中间件
app.use(cors())
app.use(express.json())

// 根路由 - 用于基本状态检查
app.get('/', (req, res) => {
  res.json({
    message: '图片上传服务器运行正常',
    status: 'ok',
    endpoints: [
      'POST /api/upload-image',
      'POST /api/copy-image'
    ]
  })
})

// 状态检查路由
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    message: '图片上传服务正常运行',
    timestamp: new Date().toISOString()
  })
})

// 确保临时目录存在
if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp')
}

// 图片上传API
app.post('/api/upload-image', upload.single('file'), async (req, res) => {
  try {
    const { category, targetFileName, targetPath, context } = req.body
    const uploadedFile = req.file
    const contextData = context ? JSON.parse(context) : {}

    // 验证参数
    if (!uploadedFile || !category || !targetFileName || !targetPath) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：file, category, targetFileName, targetPath'
      })
    }

    // 打印上传信息
    console.log('=== 图片上传信息 ===')
    console.log('原文件名:', uploadedFile.originalname)
    console.log('新文件名:', targetFileName)
    console.log('文件分类:', category)
    console.log('上下文信息:', contextData)
    console.log('目标路径:', targetPath)
    console.log('==================')

    // 确保目标目录存在
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    // 复制文件到目标位置
    fs.copyFileSync(uploadedFile.path, targetPath)

    // 删除临时文件
    fs.unlinkSync(uploadedFile.path)

    // 验证复制是否成功
    if (!fs.existsSync(targetPath)) {
      return res.status(500).json({
        success: false,
        message: '文件上传失败'
      })
    }

    res.json({
      success: true,
      message: '文件上传成功',
      targetPath,
      targetFileName,
      category,
      fileSize: uploadedFile.size,
      originalName: uploadedFile.originalname,
      context: contextData
    })

  } catch (error) {
    console.error('文件上传错误:', error)
    
    // 清理临时文件
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (cleanupError) {
        console.error('清理临时文件失败:', cleanupError)
      }
    }
    
    res.status(500).json({
      success: false,
      message: `文件上传失败: ${error.message}`
    })
  }
})

// 保留原有的复制API（用于其他用途）
app.post('/api/copy-image', async (req, res) => {
  try {
    const { sourcePath, targetPath, category } = req.body

    // 验证参数
    if (!sourcePath || !targetPath || !category) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：sourcePath, targetPath, category'
      })
    }

    // 检查源文件是否存在
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({
        success: false,
        message: `源文件不存在: ${sourcePath}`
      })
    }

    // 确保目标目录存在
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    // 复制文件
    fs.copyFileSync(sourcePath, targetPath)

    // 验证复制是否成功
    if (!fs.existsSync(targetPath)) {
      return res.status(500).json({
        success: false,
        message: '文件复制失败'
      })
    }

    res.json({
      success: true,
      message: '文件复制成功',
      sourcePath,
      targetPath,
      category
    })

  } catch (error) {
    console.error('文件复制错误:', error)
    res.status(500).json({
      success: false,
      message: `文件复制失败: ${error.message}`
    })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`图片复制服务器运行在 http://localhost:${PORT}`)
}) 