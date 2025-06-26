const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

// 数据库配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'lay_music',
  charset: 'utf8mb4'
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// MD5加密函数
function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// 生成JWT Token (简化版)
function generateToken(userId) {
  const payload = {
    userId: userId,
    timestamp: Date.now()
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// 解析Token
function parseToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload;
  } catch (error) {
    return null;
  }
}

// 生成验证码UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 生成简单验证码
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const result = num1 + num2;
  return {
    text: `${num1} + ${num2} = ?`,
    answer: result.toString()
  };
}

// 验证码存储
const captchaStore = new Map();

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, isToken, repeatSubmit');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // 获取请求体
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      let requestData = {};
      if (body) {
        requestData = JSON.parse(body);
      }

      // 路由处理
      if (path === '/captchaImage' && method === 'GET') {
        // 获取验证码
        const uuid = generateUUID();
        const captcha = generateCaptcha();
        captchaStore.set(uuid, captcha.answer);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          msg: "操作成功",
          data: {
            uuid: uuid,
            img: `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><text x="10" y="25" font-family="Arial" font-size="16" fill="blue">${captcha.text}</text></svg>`).toString('base64')}`
          }
        }));

      } else if (path === '/login' && method === 'POST') {
        // 登录接口
        const { username, password, code, uuid } = requestData;
        console.log('登录请求:', { username, password, code, uuid });

        // 验证码检查
        if (uuid && code) {
          const correctCode = captchaStore.get(uuid);
          if (!correctCode || correctCode !== code) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              code: 500,
              msg: "验证码错误"
            }));
            return;
          }
          captchaStore.delete(uuid); // 使用后删除
        }

        try {
          // 查询用户
          const connection = await pool.getConnection();
          const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
          );
          connection.release();

          if (rows.length === 0) {
            console.log('用户不存在:', username);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              code: 500,
              msg: "用户不存在"
            }));
            return;
          }

          const user = rows[0];
          const hashedPassword = md5(password);

          if (user.password !== hashedPassword) {
            console.log('密码错误:', username);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              code: 500,
              msg: "密码错误"
            }));
            return;
          }

          // 更新最后登录时间
          const updateConnection = await pool.getConnection();
          await updateConnection.execute(
            'UPDATE users SET last_login_time = NOW() WHERE id = ?',
            [user.id]
          );
          updateConnection.release();

          const token = generateToken(user.id);
          console.log('登录成功:', username);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 200,
            msg: "操作成功",
            token: token
          }));

        } catch (error) {
          console.error('登录错误:', error);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 500,
            msg: "登录失败"
          }));
        }

      } else if (path === '/getInfo' && method === 'GET') {
        // 获取用户信息
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "未授权"
          }));
          return;
        }

        const token = authHeader.substring(7);
        const payload = parseToken(token);
        
        if (!payload) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "Token无效"
          }));
          return;
        }

        try {
          const connection = await pool.getConnection();
          const [rows] = await connection.execute(
            'SELECT * FROM users WHERE id = ?',
            [payload.userId]
          );
          connection.release();

          if (rows.length === 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              code: 401,
              msg: "用户不存在"
            }));
            return;
          }

          const user = rows[0];
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 200,
            msg: "操作成功",
            user: {
              userId: user.id,
              userName: user.username,
              nickName: user.real_name || user.username,
              email: user.email,
              phonenumber: user.phone || '',
              sex: "0",
              avatar: "",
              admin: user.role === 'ADMIN',
              createBy: "admin",
              createTime: user.created_at,
              updateBy: null,
              updateTime: user.updated_at,
              remark: null,
              params: {},
              roleId: user.role === 'ADMIN' ? 1 : 2,
              roleIds: [user.role === 'ADMIN' ? 1 : 2],
              postIds: [],
              roles: [{
                roleId: user.role === 'ADMIN' ? 1 : 2,
                roleName: user.role === 'ADMIN' ? '超级管理员' : '普通用户',
                roleKey: user.role === 'ADMIN' ? 'admin' : 'user',
                roleSort: user.role === 'ADMIN' ? 1 : 2,
                dataScope: "1",
                status: "0",
                flag: false,
                admin: user.role === 'ADMIN'
              }]
            },
            roles: [user.role === 'ADMIN' ? 'admin' : 'user'],
            permissions: user.role === 'ADMIN' ? [
              "*:*:*",
              "system:user:list",
              "system:user:add",
              "system:user:edit",
              "system:user:remove",
              "system:role:list",
              "system:role:add",
              "system:role:edit",
              "system:role:remove"
            ] : [
              "system:user:list"
            ]
          }));

        } catch (error) {
          console.error('获取用户信息错误:', error);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 500,
            msg: "获取用户信息失败"
          }));
        }

      } else if (path === '/getRouters' && method === 'GET') {
        // 获取路由信息
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "未授权"
          }));
          return;
        }

        const token = authHeader.substring(7);
        const payload = parseToken(token);
        
        if (!payload) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "Token无效"
          }));
          return;
        }

        // 获取用户角色
        try {
          const connection = await pool.getConnection();
          const [rows] = await connection.execute(
            'SELECT role FROM users WHERE id = ?',
            [payload.userId]
          );
          connection.release();

          const isAdmin = rows.length > 0 && rows[0].role === 'ADMIN';

          // 基础菜单
          const menus = [
            {
              name: "System",
              path: "/system",
              hidden: false,
              redirect: "noRedirect",
              component: "Layout",
              alwaysShow: true,
              meta: {
                title: "系统管理",
                icon: "system",
                noCache: false,
                link: null
              },
              children: [
                {
                  name: "User",
                  path: "user",
                  hidden: false,
                  component: "system/user/index",
                  meta: {
                    title: "用户管理",
                    icon: "user",
                    noCache: false,
                    link: null
                  }
                }
              ]
            }
          ];

          // 管理员额外菜单
          if (isAdmin) {
            menus[0].children.push({
              name: "Role",
              path: "role",
              hidden: false,
              component: "system/role/index",
              meta: {
                title: "角色管理",
                icon: "peoples",
                noCache: false,
                link: null
              }
            });
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 200,
            msg: "操作成功",
            data: menus
          }));

        } catch (error) {
          console.error('获取路由错误:', error);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 500,
            msg: "获取路由失败"
          }));
        }

      } else if (path === '/logout' && method === 'POST') {
        // 退出登录
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          msg: "退出成功"
        }));

      } else if (path.startsWith('/system/user') && method === 'GET') {
        // 用户列表 - 集成之前的用户管理功能
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "未授权"
          }));
          return;
        }

        try {
          const connection = await pool.getConnection();
          const [rows] = await connection.execute('SELECT * FROM users ORDER BY created_at DESC');
          connection.release();

          const users = rows.map(user => ({
            userId: user.id,
            userName: user.username,
            nickName: user.real_name || user.username,
            email: user.email,
            phonenumber: user.phone || '',
            sex: "0",
            avatar: "",
            status: user.status === 1 ? "0" : "1",
            createTime: user.created_at,
            remark: null,
            admin: user.role === 'ADMIN',
            roles: [{
              roleId: user.role === 'ADMIN' ? 1 : 2,
              roleName: user.role === 'ADMIN' ? '超级管理员' : '普通用户',
              roleKey: user.role === 'ADMIN' ? 'admin' : 'user'
            }]
          }));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 200,
            msg: "查询成功",
            rows: users,
            total: users.length
          }));

        } catch (error) {
          console.error('获取用户列表错误:', error);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 500,
            msg: "查询失败"
          }));
        }

      } else {
        // 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 404,
          msg: "接口不存在"
        }));
      }

    } catch (error) {
      console.error('服务器错误:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        code: 500,
        msg: "服务器内部错误"
      }));
    }
  });
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log('==============================================');
  console.log('🚀 Ruoyi兼容后端服务启动成功！');
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log('🔐 登录接口: http://localhost:8081/login');
  console.log('🖼️ 验证码接口: http://localhost:8081/captchaImage');
  console.log('👤 用户信息: http://localhost:8081/getInfo');
  console.log('🗂️ 路由信息: http://localhost:8081/getRouters');
  console.log('💾 数据库: MySQL (lay_music)');
  console.log('👤 测试账号: admin / LayMusic@2025');
  console.log('==============================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用，请先关闭占用该端口的进程`);
  } else {
    console.error('❌ 服务器启动失败:', err);
  }
}); 