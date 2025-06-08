const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// 中间件
app.use(cors());
app.use(express.json());

// 测试接口
app.get('/test/hello', (req, res) => {
  res.json({
    code: 200,
    message: 'LAY张艺兴音乐后台API服务正常运行',
    data: null,
    timestamp: Date.now()
  });
});

// 管理员登录
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        userInfo: {
          id: '1',
          username: 'admin',
          realName: '系统管理员',
          department: '技术部',
          position: '后台管理员'
        }
      },
      timestamp: Date.now()
    });
  } else {
    res.json({
      code: 401,
      message: '用户名或密码错误',
      data: null,
      timestamp: Date.now()
    });
  }
});

// 管理员登出
app.post('/api/admin/logout', (req, res) => {
  res.json({
    code: 200,
    message: '登出成功',
    data: null,
    timestamp: Date.now()
  });
});

// 验证token
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    res.json({
      code: 200,
      message: '验证成功',
      data: {
        id: '1',
        username: 'admin',
        realName: '系统管理员',
        department: '技术部',
        position: '后台管理员'
      },
      timestamp: Date.now()
    });
  } else {
    res.json({
      code: 401,
      message: '无效的token',
      data: null,
      timestamp: Date.now()
    });
  }
});

// 获取管理员信息
app.get('/api/admin/info', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        encryptedId: 'LM_admin_001',
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@laymusic.com',
        department: '技术部',
        position: '后台管理员'
      },
      timestamp: Date.now()
    });
  } else {
    res.json({
      code: 401,
      message: '无效的token',
      data: null,
      timestamp: Date.now()
    });
  }
});

// 专辑管理API
app.get('/api/admin/albums', (req, res) => {
  const mockAlbums = [
    {
      encryptedId: 'LM_album_001',
      albumName: 'NAMANANA',
      songCount: 6,
      totalDuration: 1320,
      songType: '流行',
      releaseYear: 2018,
      albumDescription: 'LAY第二张个人专辑，展现了他的多样化音乐风格',
      achievements: JSON.stringify({
        awards: ['iTunes全球专辑榜第4名', '美国iTunes专辑榜第21名']
      }),
      status: 1
    },
    {
      encryptedId: 'LM_album_002',
      albumName: 'LOSE CONTROL',
      songCount: 7,
      totalDuration: 1680,
      songType: '流行',
      releaseYear: 2016,
      albumDescription: 'LAY首张个人专辑',
      achievements: JSON.stringify({
        awards: ['iTune中国区专辑榜第1名']
      }),
      status: 1
    }
  ];
  
  res.json({
    code: 200,
    message: '获取成功',
    data: mockAlbums,
    timestamp: Date.now()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('==============================================');
  console.log(`LAY张艺兴音乐后台API服务器启动成功！`);
  console.log(`访问地址：http://localhost:${PORT}`);
  console.log(`测试接口：http://localhost:${PORT}/test/hello`);
  console.log('==============================================');
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null,
    timestamp: Date.now()
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null,
    timestamp: Date.now()
  });
}); 