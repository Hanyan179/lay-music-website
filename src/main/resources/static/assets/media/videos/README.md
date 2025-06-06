# 视频媒体资源说明

这个目录用于存放应用程序中事件和问题相关的视频文件。

## 目录结构

```
/assets/media/videos/
├── toy-story-trailer.mp4          # 玩具总动员预告片
├── windows95-demo.mp4             # Windows 95 演示视频
├── iphone-launch.mp4              # iPhone 发布会视频
├── financial-crisis-news.mp4      # 金融危机新闻视频
├── personal-events/               # 个人事件视频目录
│   ├── graduation-ceremony.mp4    # 毕业典礼视频
│   ├── wedding-moments.mp4        # 婚礼时刻视频
│   ├── career-milestone.mp4       # 职业里程碑视频
│   └── family-gathering.mp4       # 家庭聚会视频
└── README.md                      # 本说明文件
```

## 使用方法

### 1. 年度事件视频

在 `Timeline.vue` 文件的 `annualEvents` 中配置：

```javascript
annualEvents: {
  1995: [
    {
      title: '《玩具总动员》首映',
      description: '...',
      media: {
        type: 'video',
        url: '/assets/media/videos/toy-story-trailer.mp4',
        poster: '/assets/media/images/toy-story-poster.jpg' // 可选的缩略图
      },
      // 保持向后兼容的图片字段
      image: '...',
      date: '1995年11月',
      tags: ['电影', '动画', '皮克斯'],
      impact: '高'
    }
  ]
}
```

### 2. 个人事件问题视频

个人事件的问题部分也支持视频：

```javascript
personalEvents: {
  1995: [
    {
      question: "您想如何度过大学时光？",
      description: "...",
      media: {
        type: 'video',
        url: '/assets/media/videos/personal-events/college-life.mp4',
        poster: '/assets/media/images/college-life-poster.jpg'
      },
      options: [...]
    }
  ]
}
```

## 媒体对象结构

```javascript
media: {
  type: 'video',                    // 必须，媒体类型：'video' 或 'image'
  url: '/path/to/video.mp4',        // 必须，视频文件路径
  poster: '/path/to/poster.jpg'     // 可选，视频封面图片
}
```

## 视频规格建议

### 年度事件视频
- **分辨率**: 1280x720 (720p) 或 1920x1080 (1080p)
- **时长**: 30秒 - 2分钟
- **格式**: MP4 (H.264编码)
- **文件大小**: 5-20MB
- **帧率**: 30fps

### 个人事件问题视频
- **分辨率**: 1280x720 (720p)
- **时长**: 15-60秒
- **格式**: MP4 (H.264编码)
- **文件大小**: 2-10MB
- **帧率**: 30fps

## 视频优化建议

1. **编码设置**:
   - 使用 H.264 编码
   - 使用 AAC 音频编码
   - 比特率：1-3 Mbps (720p)，2-5 Mbps (1080p)

2. **压缩工具推荐**:
   - FFmpeg (命令行)
   - HandBrake (GUI)
   - Adobe Media Encoder

3. **FFmpeg 压缩命令示例**:
   ```bash
   # 压缩为适合网页的MP4
   ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k output.mp4
   
   # 生成封面图片
   ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 -q:v 2 poster.jpg
   ```

## 文件命名规范

- 使用小写字母和连字符
- 避免空格和特殊字符
- 包含描述性信息

**示例**:
- `toy-story-1995-trailer.mp4`
- `windows95-launch-demo.mp4`
- `personal-graduation-ceremony.mp4`

## 性能优化

1. **懒加载**: 使用 `preload="metadata"` 属性
2. **自适应**: 考虑提供多种分辨率版本
3. **缓存**: 设置适当的 HTTP 缓存头
4. **CDN**: 大型视频文件建议使用 CDN

## 添加新视频

1. **准备视频文件**:
   - 按照规格建议进行优化
   - 生成封面图片（可选）

2. **上传文件**:
   ```bash
   # 复制到相应目录
   cp your-video.mp4 /assets/media/videos/
   cp your-poster.jpg /assets/media/images/
   ```

3. **更新配置**:
   ```javascript
   // 在相应的事件数据中添加
   media: {
     type: 'video',
     url: '/assets/media/videos/your-video.mp4',
     poster: '/assets/media/images/your-poster.jpg'
   }
   ```

## 浏览器兼容性

- **MP4 + H.264**: 所有现代浏览器支持
- **WebM**: Chrome, Firefox, Edge 支持
- **自动回退**: 如果视频加载失败，系统会自动显示封面图片或默认图片

## 版权和法律

- 确保所有视频内容都有适当的使用权限
- 遵守相关的版权法律
- 为历史事件视频，建议使用公共领域或知识共享许可的内容
- 个人事件视频应该是原创或有授权的内容 