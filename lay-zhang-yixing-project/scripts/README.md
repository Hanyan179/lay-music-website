# 用户数据生成脚本使用指南

## 🎵 LAY张艺兴音乐网站 - 用户管理脚本

这个脚本用于自动生成和管理用户账号数据，支持单个创建、批量创建和随机生成功能。

## 📋 功能特性

- ✅ 单个用户创建
- ✅ 批量用户创建（从JSON文件）
- ✅ 随机用户数据生成
- ✅ 密码自动加密
- ✅ 数据验证和错误处理
- ✅ 详细的执行日志

## 🚀 快速开始

### 1. 安装依赖

```bash
# 在项目根目录下安装axios
npm install axios
```

### 2. 确保后端服务运行

```bash
# 启动后端服务
cd backend
java -jar target/music-admin-1.0.0.jar
```

### 3. 运行脚本

```bash
cd scripts

# 查看帮助
node create-users.js --help

# 创建示例文件
node create-users.js --sample
```

## 📖 使用方法

### 单个用户创建

```bash
# 基础创建
node create-users.js --username test1 --password 123456 --realName "测试用户1"

# 完整信息创建
node create-users.js \
  --username admin2 \
  --password admin123 \
  --realName "管理员2" \
  --email admin2@laymusic.com \
  --department "技术部" \
  --position "系统管理员" \
  --role "ADMIN"
```

### 批量创建（从文件）

```bash
# 1. 先创建示例文件
node create-users.js --sample

# 2. 编辑 sample-users.json 文件添加用户数据

# 3. 批量创建
node create-users.js --batch --file sample-users.json
```

### 快速生成随机用户

```bash
# 生成10个随机用户
node create-users.js --generate 10

# 生成50个随机用户
node create-users.js --generate 50
```

## 📁 JSON文件格式

### 用户数组格式
```json
[
  {
    "username": "user1",
    "password": "password123",
    "realName": "用户1",
    "email": "user1@laymusic.com",
    "department": "技术部",
    "position": "开发工程师",
    "role": "USER"
  },
  {
    "username": "user2",
    "password": "password456",
    "realName": "用户2",
    "email": "user2@laymusic.com",
    "department": "产品部",
    "position": "产品经理",
    "role": "USER"
  }
]
```

### 包含users字段的对象格式
```json
{
  "users": [
    {
      "username": "user1",
      "password": "password123",
      "realName": "用户1"
    }
  ]
}
```

## 🔧 参数说明

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `--username` | 用户名 | ✅ | - |
| `--password` | 密码 | ✅ | - |
| `--realName` | 真实姓名 | ✅ | - |
| `--email` | 邮箱地址 | ❌ | 空字符串 |
| `--department` | 部门 | ❌ | 空字符串 |
| `--position` | 职位 | ❌ | 空字符串 |
| `--role` | 角色 | ❌ | USER |
| `--batch` | 批量模式 | ❌ | false |
| `--file` | JSON文件路径 | ❌ | - |
| `--generate` | 生成随机用户数量 | ❌ | - |
| `--sample` | 创建示例文件 | ❌ | false |
| `--help` | 显示帮助 | ❌ | false |

## 💡 使用示例

### 示例1：创建管理员用户
```bash
node create-users.js \
  --username superadmin \
  --password SuperAdmin@2025 \
  --realName "超级管理员" \
  --email superadmin@laymusic.com \
  --department "管理层" \
  --position "系统超级管理员" \
  --role "ADMIN"
```

### 示例2：批量创建测试用户
```bash
# 1. 创建示例文件
node create-users.js --sample

# 2. 修改 sample-users.json，添加更多用户

# 3. 执行批量创建
node create-users.js --batch --file sample-users.json
```

### 示例3：快速生成演示数据
```bash
# 生成20个随机用户用于演示
node create-users.js --generate 20
```

## ⚠️ 注意事项

1. **后端服务**：确保后端服务在 `http://localhost:8080` 正常运行
2. **权限验证**：脚本需要有效的管理员Token，实际使用时需要先登录获取真实Token
3. **数据安全**：密码会自动使用SHA-256+盐值进行加密存储
4. **唯一性**：用户名必须唯一，重复的用户名会创建失败
5. **网络连接**：确保网络连接正常，API调用超时时间为10秒

## 🛠️ 故障排除

### 常见错误

1. **连接被拒绝**
   ```
   ❌ 用户创建异常: user1 - connect ECONNREFUSED 127.0.0.1:8080
   ```
   **解决方案**：确保后端服务正在运行

2. **用户名已存在**
   ```
   ❌ 用户创建失败: user1 - 用户名已存在
   ```
   **解决方案**：更换用户名或删除现有用户

3. **文件不存在**
   ```
   ❌ 文件不存在: /path/to/users.json
   ```
   **解决方案**：检查文件路径是否正确

4. **JSON格式错误**
   ```
   ❌ 读取文件失败: Unexpected token } in JSON
   ```
   **解决方案**：检查JSON文件格式是否正确

### 调试模式

如需查看详细的API请求信息，可以在脚本中启用调试模式：

```javascript
// 在脚本开头添加
process.env.NODE_DEBUG = 'axios';
```

## 📞 技术支持

如遇到问题，请检查：
1. 后端服务是否正常运行
2. 网络连接是否正常
3. JSON文件格式是否正确
4. 参数是否完整

## 🔄 更新日志

- **v1.0.0** (2025-06-08)
  - 初始版本发布
  - 支持单个和批量用户创建
  - 支持随机用户生成
  - 完整的错误处理和日志 