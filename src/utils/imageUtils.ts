// 图片工具函数

/**
 * 图片处理工具函数
 */

// 图片文件类型
export type ImageCategory = 'covers' | 'events' | 'options' | 'effects' | 'backgrounds' | 'choices'

// 图片上传上下文信息
export interface ImageUploadContext {
  bookTitle?: string
  bookId?: number
  eventTitle?: string
  eventId?: number
  optionText?: string
  optionIndex?: number
}

/**
 * 生成有意义的图片文件名
 */
export const generateImageFileName = (
  originalName: string, 
  category: ImageCategory, 
  context?: ImageUploadContext
): string => {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  
  // 清理文件名中的特殊字符
  const cleanText = (text: string) => {
    return text.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_').toLowerCase()
  }
  
  let fileName = ''
  
  switch (category) {
    case 'covers':
      // 书籍封面：书籍名_封面_时间戳.扩展名
      if (context?.bookTitle) {
        const cleanBookTitle = cleanText(context.bookTitle)
        fileName = `${cleanBookTitle}_封面_${timestamp}.${extension}`
      } else {
        fileName = `书籍封面_${timestamp}.${extension}`
      }
      break
      
    case 'events':
      // 事件图片：书籍名_事件名_时间戳.扩展名
      if (context?.bookTitle && context?.eventTitle) {
        const cleanBookTitle = cleanText(context.bookTitle)
        const cleanEventTitle = cleanText(context.eventTitle)
        fileName = `${cleanBookTitle}_${cleanEventTitle}_${timestamp}.${extension}`
      } else if (context?.bookTitle) {
        const cleanBookTitle = cleanText(context.bookTitle)
        fileName = `${cleanBookTitle}_事件_${timestamp}.${extension}`
      } else {
        fileName = `事件图片_${timestamp}.${extension}`
      }
      break
      
    case 'options':
      // 选项图片：书籍名_事件名_选项文本_时间戳.扩展名
      if (context?.bookTitle && context?.eventTitle && context?.optionText) {
        const cleanBookTitle = cleanText(context.bookTitle)
        const cleanEventTitle = cleanText(context.eventTitle)
        const cleanOptionText = cleanText(context.optionText).substring(0, 20) // 限制长度
        fileName = `${cleanBookTitle}_${cleanEventTitle}_${cleanOptionText}_${timestamp}.${extension}`
      } else if (context?.bookTitle && context?.eventTitle) {
        const cleanBookTitle = cleanText(context.bookTitle)
        const cleanEventTitle = cleanText(context.eventTitle)
        const optionIndex = context?.optionIndex ?? 0
        fileName = `${cleanBookTitle}_${cleanEventTitle}_选项${optionIndex + 1}_${timestamp}.${extension}`
      } else {
        fileName = `选项图片_${timestamp}.${extension}`
      }
      break
      
    default:
      fileName = `${category}_${timestamp}.${extension}`
  }
  
  return fileName
}

/**
 * 从选择的文件复制图片到项目目录
 * @param file 用户选择的图片文件
 * @param category 图片分类
 * @param context 上传上下文信息
 * @returns 返回复制后的图片URL
 */
export const copyImageFile = async (
  file: File, 
  category: ImageCategory, 
  context?: ImageUploadContext
): Promise<string> => {
  try {
    // 验证文件
    if (!file) {
      throw new Error('请选择有效的图片文件')
    }

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      throw new Error('不支持的图片格式，请使用 JPG、PNG、GIF 或 WebP 格式')
    }

    // 验证文件大小 (最大5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('图片文件过大，请选择小于5MB的图片')
    }

    // 生成目标文件名（使用上下文信息）
    const targetFileName = generateImageFileName(file.name, category, context)
    const targetPath = `E:\\Fate Echoes\\fate-echoes\\public\\images\\${category}\\${targetFileName}`
    
    // 创建FormData准备上传
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    formData.append('targetFileName', targetFileName)
    formData.append('targetPath', targetPath)
    formData.append('context', JSON.stringify(context || {}))
    
    // 调用后端API上传文件
    let response: Response
    try {
      response = await fetch('http://localhost:3001/api/upload-image', {
        method: 'POST',
        body: formData
      })
    } catch (networkError) {
      throw new Error('无法连接到图片上传服务器，请确保服务器正在运行 (端口3001)')
    }

    if (!response.ok) {
      let errorMessage = `上传失败 (状态码: ${response.status})`
      
      try {
        // 尝试解析JSON错误消息
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (jsonError) {
        // 如果不是JSON响应，尝试获取文本内容
        try {
          const textContent = await response.text()
          if (textContent.includes('Cannot GET') || textContent.includes('404')) {
            errorMessage = '图片上传服务API不可用，请检查服务器状态'
          } else if (textContent.includes('EADDRINUSE')) {
            errorMessage = '图片服务器端口被占用，请重启服务器'
          } else {
            errorMessage = `服务器错误: ${textContent.slice(0, 100)}`
          }
        } catch (textError) {
          errorMessage = '服务器返回了无效的响应格式'
        }
      }
      
      throw new Error(errorMessage)
    }

    let result
    try {
      result = await response.json()
    } catch (jsonError) {
      throw new Error('服务器返回了无效的JSON响应，请检查服务器状态')
    }
    
    // 返回相对URL路径
    return `/images/${category}/${targetFileName}`
  } catch (error) {
    console.error('图片上传失败:', error)
    throw error
  }
}

/**
 * 验证图片路径是否存在（模拟验证）
 */
export const validateImagePath = (path: string): boolean => {
  // 基本路径格式验证
  if (!path || !path.trim()) return false
  
  // Windows路径格式验证
  const windowsPathRegex = /^[a-zA-Z]:\\(?:[^\\/:*?"<>|]+\\)*[^\\/:*?"<>|]+\.[a-zA-Z0-9]+$/
  
  // Unix/Mac路径格式验证  
  const unixPathRegex = /^\/(?:[^\/\0]+\/)*[^\/\0]+\.[a-zA-Z0-9]+$/
  
  return windowsPathRegex.test(path) || unixPathRegex.test(path)
}

/**
 * 获取文件扩展名
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * 生成占位图片（Canvas生成）
 */
export const generatePlaceholderImage = (
  width: number, 
  height: number, 
  text: string,
  backgroundColor = '#f0f0f0',
  textColor = '#666666'
): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return ''
  
  canvas.width = width
  canvas.height = height
  
  // 背景
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)
  
  // 文字
  ctx.fillStyle = textColor
  ctx.font = `${Math.min(width, height) / 8}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  
  return canvas.toDataURL()
}

/**
 * 创建完整的图片目录路径说明
 */
export const getImageDirectoryInfo = (category: ImageCategory): {
  absolutePath: string
  description: string
} => {
  const basePath = 'E:\\Fate Echoes\\fate-echoes\\public\\images'
  
  const descriptions = {
    covers: '书籍封面图片',
    events: '事件相关图片', 
    options: '选择选项图片',
    effects: '效果图片',
    backgrounds: '背景图片',
    choices: '选择相关图片'
  }
  
  return {
    absolutePath: `${basePath}\\${category}`,
    description: descriptions[category]
  }
}

/**
 * 检查图片是否存在
 * @param url 图片URL
 * @returns Promise<boolean>
 */
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
    
    // 设置超时
    setTimeout(() => resolve(false), 3000)
  })
}

/**
 * 获取安全的图片URL，如果原图片不存在则返回占位图片
 * @param originalUrl 原始图片URL
 * @param fallbackText 占位图片文字
 * @param width 占位图片宽度
 * @param height 占位图片高度
 */
export async function getSafeImageUrl(
  originalUrl: string,
  fallbackText: string = '图片加载失败',
  width: number = 400,
  height: number = 300
): Promise<string> {
  if (!originalUrl) {
    return generatePlaceholderImage(width, height, fallbackText)
  }
  
  const exists = await checkImageExists(originalUrl)
  if (exists) {
    return originalUrl
  } else {
    return generatePlaceholderImage(width, height, fallbackText)
  }
} 