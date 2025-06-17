# Gitee推送指令

## 第一步：在Gitee上创建仓库
1. 登录 [Gitee.com](https://gitee.com)
2. 点击右上角 "+" -> "新建仓库"
3. 仓库名称：`HighSchool-Survivor-Game`
4. 仓库介绍：`高中生存者游戏 - Unity教育类Roguelike游戏`
5. 选择"公开"，不要勾选"使用Readme文件初始化"
6. 点击"创建"

## 第二步：连接本地仓库到Gitee
在 `E:\HighSchool-Survivor-Game` 目录下执行：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为实际的Gitee用户名）
git remote add origin https://gitee.com/YOUR_USERNAME/HighSchool-Survivor-Game.git

# 推送到Gitee
git push -u origin master
```

## 第三步：常用命令模板

### 如果用户名是 lay-music：
```bash
git remote add origin https://gitee.com/lay-music/HighSchool-Survivor-Game.git
git push -u origin master
```

### 如果用户名是 zhang-yixing：
```bash
git remote add origin https://gitee.com/zhang-yixing/HighSchool-Survivor-Game.git
git push -u origin master
```

### 如果用户名是 lay-zhang-yixing：
```bash
git remote add origin https://gitee.com/lay-zhang-yixing/HighSchool-Survivor-Game.git
git push -u origin master
```

## 第四步：验证推送成功
推送成功后，访问您的Gitee仓库页面应该能看到：
- README.md
- .gitignore
- Docs/ 文件夹
  - 游戏设定文档.md
  - 怪物与Boss设定.md
  - 项目部署说明.md
  - Gitee推送指令.md
- Assets/, Prefabs/, Scenes/, Scripts/ 文件夹

## 第五步：后续开发提交流程
```bash
# 添加修改的文件
git add .

# 提交到本地仓库
git commit -m "提交说明"

# 推送到Gitee
git push origin master
```

---

**注意**：首次推送时可能需要输入Gitee账号密码进行验证。 