const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

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

// 数据文件路径
const DATA_DIR = './data';
const UPLOAD_DIR = './uploads';

// 确保目录存在
async function ensureDirectories() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

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

// 读取JSON数据
async function readJsonData(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取文件 ${filename} 失败:`, error);
    return {};
  }
}

// 写入JSON数据
async function writeJsonData(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`写入文件 ${filename} 失败:`, error);
    return false;
  }
}

// 验证用户权限
async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = parseToken(token);
  
  if (!payload) {
    return null;
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [payload.userId]
    );
    connection.release();

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error('验证用户权限失败:', error);
    return null;
  }
}

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
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${pathname}`);

  // 获取请求体
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      let requestData = {};
      if (body && req.headers['content-type']?.includes('application/json')) {
        requestData = JSON.parse(body);
      }

      // ==================== 认证相关接口 ====================
      if (pathname === '/captchaImage' && method === 'GET') {
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

      } else if (pathname === '/login' && method === 'POST') {
        const { username, password, code, uuid } = requestData;
        console.log('登录请求:', { username, password, code, uuid });

        // 验证码检查（可选）
        if (uuid && code) {
          const correctCode = captchaStore.get(uuid);
          if (correctCode && correctCode !== code) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              code: 500,
              msg: "验证码错误"
            }));
            return;
          }
          if (uuid) captchaStore.delete(uuid);
        }

        try {
          const connection = await pool.getConnection();
          const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
          );
          connection.release();

          if (rows.length === 0) {
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
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              code: 500,
              msg: "密码错误"
            }));
            return;
          }

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

      } else if (pathname === '/getInfo' && method === 'GET') {
        const user = await verifyAuth(req);
        if (!user) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "未授权"
          }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          msg: "操作成功",
          user: {
            userId: user.id,
            userName: user.username,
            nickName: user.real_name || user.username,
            email: user.email,
            admin: user.role === 'ADMIN'
          },
          roles: [user.role === 'ADMIN' ? 'admin' : 'user'],
          permissions: user.role === 'ADMIN' ? [
            "*:*:*",
            "content:music:list",
            "content:music:edit",
            "content:timeline:list", 
            "content:timeline:edit",
            "content:messages:list",
            "content:messages:edit"
          ] : [
            "content:music:list",
            "content:timeline:list",
            "content:messages:list"
          ]
        }));

      } else if (pathname === '/getRouters' && method === 'GET') {
        const user = await verifyAuth(req);
        if (!user) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "未授权"
          }));
          return;
        }

        const isAdmin = user.role === 'ADMIN';
        const menus = [
          {
            name: "Content",
            path: "/content",
            hidden: false,
            redirect: "noRedirect",
            component: "Layout",
            alwaysShow: true,
            meta: {
              title: "内容管理",
              icon: "documentation",
              noCache: false
            },
            children: [
              {
                name: "Music",
                path: "music",
                hidden: false,
                component: "content/music/index",
                meta: {
                  title: "音乐管理",
                  icon: "music",
                  noCache: false
                }
              },
              {
                name: "Timeline", 
                path: "timeline",
                hidden: false,
                component: "content/timeline/index",
                meta: {
                  title: "时间线管理",
                  icon: "timeline",
                  noCache: false
                }
              },
              {
                name: "Messages",
                path: "messages", 
                hidden: false,
                component: "content/messages/index",
                meta: {
                  title: "留言管理",
                  icon: "message",
                  noCache: false
                }
              }
            ]
          }
        ];

        if (isAdmin) {
          menus.push({
            name: "System",
            path: "/system",
            hidden: false,
            redirect: "noRedirect", 
            component: "Layout",
            alwaysShow: true,
            meta: {
              title: "系统管理",
              icon: "system",
              noCache: false
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
                  noCache: false
                }
              }
            ]
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          msg: "操作成功",
          data: menus
        }));

      // ==================== 数据获取接口（公开） ====================
      } else if (pathname === '/api/data/music' && method === 'GET') {
        const musicData = await readJsonData('music-data.json');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          msg: "操作成功",
          data: musicData
        }));

      } else if (pathname === '/api/data/timeline' && method === 'GET') {
        const timelineData = await readJsonData('timeline-data.json');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          msg: "操作成功", 
          data: timelineData
        }));

      } else if (pathname === '/api/data/messages' && method === 'GET') {
        const messagesData = await readJsonData('messages-data.json');
        // 只返回已审核的留言
        const publicMessages = {
          ...messagesData,
          messages: messagesData.messages?.filter(msg => msg.approved) || []
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          msg: "操作成功",
          data: publicMessages
        }));

      // ==================== 管理接口（需要登录） ====================
      } else if (pathname === '/api/admin/data/music' && method === 'POST') {
        const user = await verifyAuth(req);
        if (!user || user.role !== 'ADMIN') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "权限不足"
          }));
          return;
        }

        const success = await writeJsonData('music-data.json', requestData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: success ? 200 : 500,
          msg: success ? "更新成功" : "更新失败"
        }));

      } else if (pathname === '/api/admin/data/timeline' && method === 'POST') {
        const user = await verifyAuth(req);
        if (!user || user.role !== 'ADMIN') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "权限不足"
          }));
          return;
        }

        const success = await writeJsonData('timeline-data.json', requestData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: success ? 200 : 500,
          msg: success ? "更新成功" : "更新失败"
        }));

      } else if (pathname === '/api/admin/data/messages' && method === 'POST') {
        const user = await verifyAuth(req);
        if (!user || user.role !== 'ADMIN') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "权限不足"
          }));
          return;
        }

        const success = await writeJsonData('messages-data.json', requestData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: success ? 200 : 500,
          msg: success ? "更新成功" : "更新失败"
        }));

      } else if (pathname === '/api/admin/data/messages' && method === 'GET') {
        const user = await verifyAuth(req);
        if (!user || user.role !== 'ADMIN') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 401,
            msg: "权限不足"
          }));
          return;
        }

        const messagesData = await readJsonData('messages-data.json');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          msg: "操作成功",
          data: messagesData
        }));

      // ==================== 静态文件服务 ====================
      } else if (pathname.startsWith('/uploads/')) {
        try {
          const filePath = path.join('.', pathname);
          const data = await fs.readFile(filePath);
          const ext = path.extname(filePath).toLowerCase();
          
          let contentType = 'application/octet-stream';
          if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
          else if (ext === '.png') contentType = 'image/png';
          else if (ext === '.gif') contentType = 'image/gif';
          else if (ext === '.mp4') contentType = 'video/mp4';
          else if (ext === '.webm') contentType = 'video/webm';
          
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        } catch (error) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            code: 404,
            msg: "文件不存在"
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

// 启动服务器
const PORT = 8082;
async function startServer() {
  await ensureDirectories();
  
  server.listen(PORT, () => {
    console.log('==============================================');
    console.log('🚀 LAY张艺兴音乐网站数据API服务启动成功！');
    console.log(`📡 服务地址: http://localhost:${PORT}`);
    console.log('🔐 登录接口: http://localhost:8082/login');
    console.log('🖼️ 验证码接口: http://localhost:8082/captchaImage');
    console.log('👤 用户信息: http://localhost:8082/getInfo');
    console.log('🗂️ 路由信息: http://localhost:8082/getRouters');
    console.log('');
    console.log('📊 数据接口:');
    console.log('  🎵 音乐数据: http://localhost:8082/api/data/music');
    console.log('  📅 时间线数据: http://localhost:8082/api/data/timeline');
    console.log('  💬 留言数据: http://localhost:8082/api/data/messages');
    console.log('');
    console.log('🔧 管理接口:');
    console.log('  📝 更新音乐: POST http://localhost:8082/api/admin/data/music');
    console.log('  📝 更新时间线: POST http://localhost:8082/api/admin/data/timeline');
    console.log('  📝 管理留言: GET/POST http://localhost:8082/api/admin/data/messages');
    console.log('');
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
}

startServer(); 