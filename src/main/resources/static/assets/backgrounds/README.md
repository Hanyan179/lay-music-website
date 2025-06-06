# 背景资源说明

这个目录用于存放应用程序的背景图片和视频文件。

## 目录结构

```
/assets/backgrounds/
├── character-creation-bg.jpg     # 角色创建页面默认背景图片
├── fantasy-library.jpg           # 奇幻图书馆背景
├── modern-study.jpg              # 现代书房背景
├── vintage-timeline.jpg          # 复古时间线背景
├── modern-timeline.jpg           # 现代时间线背景
├── cosmic-timeline.jpg           # 宇宙时间线背景
├── floating-books.mp4            # 浮动书籍视频背景
├── magical-library.mp4           # 魔法图书馆视频背景
├── flowing-time.mp4              # 流动时间视频背景
├── particle-waves.mp4            # 粒子波浪视频背景
└── README.md                     # 本说明文件
```

## 使用方法

### 1. 角色创建页面背景

在 `CharacterCreation.vue` 文件中，您可以通过修改以下代码来更换背景：

```javascript
// 背景媒体配置（您可以在这里修改背景）
const backgroundMedia = ref({
  type: 'image', // 可以是 'image' | 'video' | 'default'
  url: '/assets/backgrounds/character-creation-bg.jpg' // 背景文件路径
})
```

或者使用预设的背景：

```javascript
// 切换到奇幻图书馆背景
switchBackground('fantasy')

// 切换到浮动书籍视频背景
switchBackground('floating_books')

// 切换到默认渐变背景
switchBackground('gradient')
```

### 2. 时间线页面背景

在 `Timeline.vue` 文件中，您可以通过修改以下代码来更换背景：

```javascript
// Timeline页面背景媒体配置
const timelineBackgroundMedia = ref({
  type: 'default', // 可以是 'image' | 'video' | 'default'
  url: null // 背景文件路径
})
```

或者使用预设的背景：

```javascript
// 切换到复古时间线背景
switchTimelineBackground('vintage')

// 切换到流动时间视频背景
switchTimelineBackground('flowing_time')

// 切换到默认年份动态背景
switchTimelineBackground('default')
```

## 支持的文件格式

### 图片格式
- JPG/JPEG
- PNG
- WebP
- SVG

### 视频格式
- MP4 (推荐)
- WebM
- OGV

## 文件大小建议

- **背景图片**: 建议不超过 2MB，分辨率 1920x1080 或更高
- **背景视频**: 建议不超过 20MB，分辨率 1920x1080，时长 10-30 秒，循环播放

## 添加新背景

1. 将您的背景文件复制到此目录
2. 在相应的 Vue 文件中添加配置：

```javascript
// 在 availableBackgrounds 或 availableTimelineBackgrounds 中添加
your_background: {
  type: 'image', // 或 'video'
  url: '/assets/backgrounds/your-file.jpg'
}
```

3. 调用切换方法：
```javascript
switchBackground('your_background')
// 或
switchTimelineBackground('your_background')
```

## 性能优化建议

1. **图片优化**: 使用适当的压缩比，推荐使用 WebP 格式
2. **视频优化**: 使用 H.264 编码，较低的比特率，启用硬件加速
3. **懒加载**: 大型背景文件建议实现懒加载
4. **缓存**: 确保服务器正确设置缓存头

## 注意事项

- 所有背景文件都应该是您有权使用的版权内容
- 视频背景会自动静音并循环播放
- 在移动设备上，视频背景可能会被自动禁用以节省流量
- 背景遮罩层会自动应用以确保内容可读性 