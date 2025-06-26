const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const PORT = 8081;

// 数据库连接配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'lay_music',
  charset: 'utf8mb4'
};

// MD5加密函数
function md5Hash(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

// 处理CORS
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '3600');
}

// 处理登录请求
async function handleLogin(req, res) {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      const loginData = JSON.parse(body);
      const { username, password } = loginData;
      
      console.log('登录请求:', { username, password });
      
      if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 400,
          message: '用户名和密码不能为空',
          data: null,
          timestamp: Date.now()
        }));
        return;
      }
      
      // 连接数据库验证用户
      const connection = await mysql.createConnection(dbConfig);
      
      try {
        // 查询用户
        const [rows] = await connection.execute(
          'SELECT id, username, password, real_name, email, role, status FROM users WHERE username = ?',
          [username]
        );
        
        if (rows.length === 0) {
          console.log('登录失败 - 用户不存在:', username);
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            message: '用户名或密码错误',
            data: null,
            timestamp: Date.now()
          }));
          return;
        }
        
        const user = rows[0];
        
        // 检查用户状态
        if (user.status !== 1) {
          console.log('登录失败 - 用户被禁用:', username);
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 403,
            message: '用户已被禁用',
            data: null,
            timestamp: Date.now()
          }));
          return;
        }
        
        // 验证密码（MD5加密）
        const encryptedPassword = md5Hash(password);
        if (encryptedPassword === user.password) {
          // 登录成功
          console.log('登录成功:', username);
          
          // 更新最后登录时间
          await connection.execute(
            'UPDATE users SET last_login_time = NOW() WHERE id = ?',
            [user.id]
          );
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 200,
            message: '登录成功',
            data: {
              token: `LAY-JWT-TOKEN-${Date.now()}`,
              userInfo: {
                id: user.id.toString(),
                username: user.username,
                realName: user.real_name,
                email: user.email || '',
                role: user.role,
                lastLoginTime: Date.now()
              }
            },
            timestamp: Date.now()
          }));
        } else {
          console.log('登录失败 - 密码错误:', username);
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            message: '用户名或密码错误',
            data: null,
            timestamp: Date.now()
          }));
        }
        
      } finally {
        await connection.end();
      }
      
    } catch (error) {
      console.error('登录验证异常:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        code: 500,
        message: '登录过程中发生错误',
        data: null,
        timestamp: Date.now()
      }));
    }
  });
}

// 处理获取用户列表请求
async function handleGetUsers(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
      const [rows] = await connection.execute(
        'SELECT id, username, real_name, email, role, status, create_time, last_login_time FROM users ORDER BY create_time DESC'
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        code: 200,
        message: '获取用户列表成功',
        data: rows.map(user => ({
          id: user.id,
          username: user.username,
          realName: user.real_name,
          email: user.email,
          role: user.role,
          status: user.status,
          createTime: user.create_time,
          lastLoginTime: user.last_login_time
        })),
        timestamp: Date.now()
      }));
      
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error('获取用户列表异常:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      code: 500,
      message: '获取用户列表失败',
      data: null,
      timestamp: Date.now()
    }));
  }
}

// 处理添加用户请求
async function handleAddUser(req, res) {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      const userData = JSON.parse(body);
      const { username, password, realName, email, role } = userData;
      
      console.log('添加用户请求:', { username, realName, email, role });
      
      if (!username || !password || !realName) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 400,
          message: '用户名、密码和真实姓名不能为空',
          data: null,
          timestamp: Date.now()
        }));
        return;
      }
      
      const connection = await mysql.createConnection(dbConfig);
      
      try {
        // 检查用户名是否已存在
        const [existingUsers] = await connection.execute(
          'SELECT id FROM users WHERE username = ?',
          [username]
        );
        
        if (existingUsers.length > 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 400,
            message: '用户名已存在',
            data: null,
            timestamp: Date.now()
          }));
          return;
        }
        
        // 插入新用户
        const encryptedPassword = md5Hash(password);
        const [result] = await connection.execute(
          'INSERT INTO users (username, password, real_name, email, role, status) VALUES (?, ?, ?, ?, ?, ?)',
          [username, encryptedPassword, realName, email || null, role || 'USER', 1]
        );
        
        console.log('用户添加成功:', username);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          message: '用户添加成功',
          data: {
            id: result.insertId,
            username,
            realName,
            email: email || '',
            role: role || 'USER',
            status: 1
          },
          timestamp: Date.now()
        }));
        
      } finally {
        await connection.end();
      }
      
    } catch (error) {
      console.error('添加用户异常:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        code: 500,
        message: '添加用户失败',
        data: null,
        timestamp: Date.now()
      }));
    }
  });
}

// 处理更新用户请求
async function handleUpdateUser(req, res, userId) {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      const userData = JSON.parse(body);
      const { realName, email, role, status } = userData;
      
      console.log('更新用户请求:', { userId, realName, email, role, status });
      
      const connection = await mysql.createConnection(dbConfig);
      
      try {
        // 更新用户信息
        await connection.execute(
          'UPDATE users SET real_name = ?, email = ?, role = ?, status = ? WHERE id = ?',
          [realName, email || null, role, status, userId]
        );
        
        console.log('用户更新成功:', userId);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          message: '用户更新成功',
          data: null,
          timestamp: Date.now()
        }));
        
      } finally {
        await connection.end();
      }
      
    } catch (error) {
      console.error('更新用户异常:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        code: 500,
        message: '更新用户失败',
        data: null,
        timestamp: Date.now()
      }));
    }
  });
}

// 处理删除用户请求
async function handleDeleteUser(req, res, userId) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
      // 检查是否为管理员用户
      const [users] = await connection.execute(
        'SELECT username, role FROM users WHERE id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 404,
          message: '用户不存在',
          data: null,
          timestamp: Date.now()
        }));
        return;
      }
      
      const user = users[0];
      if (user.username === 'admin') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 400,
          message: '不能删除管理员用户',
          data: null,
          timestamp: Date.now()
        }));
        return;
      }
      
      // 删除用户
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
      
      console.log('用户删除成功:', userId);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        code: 200,
        message: '用户删除成功',
        data: null,
        timestamp: Date.now()
      }));
      
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error('删除用户异常:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      code: 500,
      message: '删除用户失败',
      data: null,
      timestamp: Date.now()
    }));
  }
}

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  // 设置CORS头
  setCORSHeaders(res);
  
  // 处理OPTIONS请求
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`${method} ${path}`);
  
  // 登录接口
  if (path === '/api/admin/login' && method === 'POST') {
    await handleLogin(req, res);
    return;
  }
  
  // 用户管理接口
  if (path === '/api/admin/users' && method === 'GET') {
    await handleGetUsers(req, res);
    return;
  }
  
  if (path === '/api/admin/users' && method === 'POST') {
    await handleAddUser(req, res);
    return;
  }
  
  // 更新用户接口
  const updateUserMatch = path.match(/^\/api\/admin\/users\/(\d+)$/);
  if (updateUserMatch && method === 'PUT') {
    const userId = updateUserMatch[1];
    await handleUpdateUser(req, res, userId);
    return;
  }
  
  // 删除用户接口
  const deleteUserMatch = path.match(/^\/api\/admin\/users\/(\d+)$/);
  if (deleteUserMatch && method === 'DELETE') {
    const userId = deleteUserMatch[1];
    await handleDeleteUser(req, res, userId);
    return;
  }
  
  // 其他接口返回404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    code: 404,
    message: '接口不存在',
    data: null,
    timestamp: Date.now()
  }));
});

// 启动服务器
server.listen(PORT, () => {
  console.log('==============================================');
  console.log('🚀 LAY张艺兴音乐网站后端服务启动成功！');
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🔐 登录接口: http://localhost:${PORT}/api/admin/login`);
  console.log(`👥 用户管理: http://localhost:${PORT}/api/admin/users`);
  console.log('💾 数据库: MySQL (lay_music)');
  console.log('👤 测试账号: admin / LayMusic@2025');
  console.log('==============================================');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🔻 服务器正在关闭...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
}); 