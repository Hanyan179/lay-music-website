const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3002

// 中间件
app.use(cors())
app.use(express.json())

// 测试路由
app.get('/', (req, res) => {
  res.json({
    message: '测试服务器运行正常',
    status: 'ok'
  })
})

// 测试API路由
app.post('/api/test', (req, res) => {
  res.json({
    message: 'API测试成功',
    body: req.body
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`测试服务器运行在 http://localhost:${PORT}`)
}) 