# 视频转场设置说明

## 视频文件放置

为了实现无缝的视频转场效果，请按照以下步骤设置您的转场视频：

### 1. 视频文件位置
将您的转场视频文件 `timeline.mp4` 放置在以下位置：
```
public/timeline.mp4
```

### 2. 视频要求
- **格式**: MP4 (推荐使用 H.264 编码)
- **分辨率**: 建议使用 1920x1080 或更高
- **时长**: 建议 3-8 秒
- **文件大小**: 建议不超过 50MB 以确保快速加载
- **音频**: 可选，但建议保持简洁

### 3. 视频优化建议
- 使用较高的压缩比以减小文件大小
- 确保视频在各种设备上播放流畅
- 建议使用专业视频编辑软件进行优化

### 4. 当前设置
- **源路径**: `E:\360MoveData\Users\hanse\Pictures\jingzhen\timeline.mp4`
- **目标路径**: `public/timeline.mp4`
- **访问URL**: `/timeline.mp4`

### 5. 复制命令 (Windows)
```bash
copy "E:\360MoveData\Users\hanse\Pictures\jingzhen\timeline.mp4" "public\timeline.mp4"
```

### 6. 测试
1. 启动开发服务器
2. 在浏览器中访问项目
3. 点击 "进入 3D 时间轴" 按钮
4. 确认视频能够正常播放并完成转场

### 7. 故障排除
- 如果视频无法加载，检查文件路径和权限
- 如果视频无法播放，检查浏览器兼容性
- 如果转场失败，系统会自动进行直接跳转

## 技术实现

转场使用了 `VideoTransition` 组件，具有以下特性：
- 全屏视频播放
- 自动播放和静音
- 错误处理和降级方案
- 响应式设计
- 无缝路由跳转

## 自定义配置

如需修改视频路径或目标页面，请编辑 `src/views/ArtistJourney.vue` 中的 VideoTransition 组件配置：

```vue
<VideoTransition
  video-src="/your-video.mp4"
  target-route="/your-target-page"
  :auto-start="false"
/>
``` 