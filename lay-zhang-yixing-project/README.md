# LAY张艺兴音乐网站 (Lay Music Website)

## 项目简介

本仓库是「LAY张艺兴音乐网站」的完整源码，采用 **Vue 3 + Vite** 构建前端，**Spring Boot 3** 提供后端 REST API，展示张艺兴（LAY）音乐作品的 3D 时间轴、专辑信息及后台管理。

* 前端技术：Vue 3、Pinia、Vue-Router、Three.js、GSAP、TailwindCSS
* 后端技术：Spring Boot、Spring Security、JPA、MySQL
* 开发脚本：Windows 批处理 (.bat) 与 PowerShell (.ps1)

---

## 目录结构 (关键层)

```text
lay-zhang-yixing-project/
├─ backend/                        # Spring Boot 后端
│  └─ src/main/java/com/lay/music/ …
├─ public/                         # 静态资源 (模型、图片、视频)
├─ src/                            # Vue3 前端源码
│  ├─ views/                       # 页面组件
│  ├─ components/                  # 公共组件
│  ├─ api/                         # axios 封装 & 接口函数
│  └─ store/                       # Pinia 状态管理
├─ start-backend.bat               # 后端启动脚本
├─ start-frontend.bat              # 前端启动脚本
└─ start-system.ps1                # 一键启动脚本 (可选)
```

---

## 快速开始 (Windows)

1. 克隆仓库并进入根目录：
   ```powershell
   git clone https://github.com/your-org/lay-music-website.git
   cd lay-music-website/lay-zhang-yixing-project
   ```
2. 双击 `start-backend.bat` 启动后端 (8080)。
3. 另开终端或双击 `start-frontend.bat` 启动前端 (3004)。
4. 浏览器访问 http://localhost:3004 查看 3D 音乐时间轴。

如需一键打包并同时启动两端，可运行 `.\start-system.ps1 -BackgroundMode`：
```powershell
.\start-system.ps1 -BackgroundMode
```

---

## 生产构建

```bash
# 前端
npm install
npm run build        # 产物在 dist/

# 后端 (需先配置数据库)
cd backend
mvn clean package -DskipTests
java -jar target/music-admin-1.0.0.jar
```
`backend/src/main/resources/static/` 已设置为静态目录，可将前端 `dist` 内容复制进去实现单端部署。

---

## 数据库初始化

MySQL 脚本位于 `backend/src/main/resources/schema.sql` (若存在)；亦可在后台管理 > 用户管理中使用脚本 `scripts/create-users.js` 导入初始管理员。

---

## License

MIT © 2025 LAY Music Team 