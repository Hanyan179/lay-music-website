// 全局状态管理 - 书籍选择
import { ref, reactive } from 'vue'

// 当前选择的书籍
export const selectedBook = ref(null)

// 书籍数据（从API获取）
export const books = reactive([])

// 加载状态
export const isLoading = ref(false)
export const loadError = ref(null)

// 静态备用数据（当API不可用时使用）
const fallbackBooks = [
  {
    id: 'ordinary_life',
    title: '允许平凡',
    subtitle: '一个普通人的人生轨迹',
    description: '体验平凡而真实的人生，在平淡中寻找生活的意义和小确幸。',
    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxkZWZzPiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4gICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjVmNWY3O3N0b3Atb3BhY2l0eToxIiAvPiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U4ZThlZDtzdG9wLW9wYWNpdHk6MSIgLz4gICAgPC9saW5lYXJHcmFkaWVudD4gIDwvZGVmcz4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWQxKSIgcng9IjEwIi8+ICA8cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMjAiIGZpbGw9IiM4Njg2OGIiIHJ4PSI0Ii8+ICA8cmVjdCB4PSIyMCIgeT0iODAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTAiIGZpbGw9IiNjNmM2Y2QiIHJ4PSI0Ii8+ICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNjAiIHI9IjMwIiBmaWxsPSIjODY4NjhiIiBvcGFjaXR5PSIwLjMiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMWQxZDFmIiBmb250LXdlaWdodD0iNjAwIj7lhYHorrjlubPlh6E8L3RleHQ+PC9zdmc+',
    likeCount: 156,
    playCount: 89,
    theme: {
      primaryColor: '#86868b',
      backgroundColor: '#f5f5f7',
      startYear: 1995,
      endYear: 2025,
      backgroundGradient: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%)'
    },
    currentEventId: 'birth_moment',
    eventHistory: [],
    personalEvents: {
      'birth_moment': {
        question: '作为一个新生儿，您的第一个重要时刻是',
        description: '1995年，您来到这个世界。虽然您还无法做出选择，但这一年的世界正在发生巨变。',
        options: [
          {
            text: '健康成长，充满好奇心',
            consequence: '您展现出了对世界的强烈好奇心，这将成为您一生学习的动力。',
            nextEventId: 'millennium_bug_reaction',
            is_next_year: true
          }
        ]
      },
      'millennium_bug_reaction': {
        question: '5岁的您面对千年虫话题时',
        description: '虽然年幼，但您隐约感受到大人们对新千年的担忧和期待。',
        options: [
          {
            text: '对大人们讨论的"电脑问题"感到好奇',
            consequence: '早期对技术的好奇心为您日后的科技素养打下了基础。',
            nextEventId: 'school_choice',
            is_next_year: true
          },
          {
            text: '专注于自己的玩具和游戏',
            consequence: '虽然童真可贵，但错过了早期接触科技概念的机会。',
            nextEventId: 'school_choice',
            is_next_year: true
          }
        ]
      },
      'school_choice': {
        question: '小学时期，您更倾向于',
        description: '进入小学后，您需要在学习和兴趣之间找到平衡。',
        options: [
          {
            text: '专注学业，追求优异成绩',
            consequence: '您的学习成绩优秀，为未来的学术发展奠定了基础。',
            nextEventId: null,
            is_next_year: true
          },
          {
            text: '培养多样化的兴趣爱好',
            consequence: '您发展了丰富的兴趣爱好，性格更加开朗活泼。',
            nextEventId: null,
            is_next_year: true
          }
        ]
      }
    }
  },
  {
    id: 'ambitious_journey',
    title: '雄心壮志',
    subtitle: '追求卓越的人生之路',
    description: '踏上充满挑战的征程，在激烈竞争中追求成功与荣耀。',
    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxkZWZzPiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4gICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY5NTAwO3N0b3Atb3BhY2l0eToxIiAvPiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNWEwMDtzdG9wLW9wYWNpdHk6MSIgLz4gICAgPC9saW5lYXJHcmFkaWVudD4gIDwvZGVmcz4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWQyKSIgcng9IjEwIi8+ICA8cG9seWdvbiBwb2ludHM9IjEwMCw2MCA4MCwxMDAgMTIwLDEwMCIgZmlsbD0iI2ZmZiIvPiAgPHJlY3QgeD0iODAiIHk9IjEyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIiByeD0iNCIvPiAgPHRleHQgeD0iMTAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNmZmYiIGZvbnQtd2VpZ2h0PSI2MDAiPumboOW/gOWjiOW/lzwvdGV4dD48L3N2Zz4=',
    likeCount: 230,
    playCount: 145,
    theme: {
      primaryColor: '#ff9500',
      backgroundColor: '#ff6b35',
      startYear: 1990,
      endYear: 2030,
      backgroundGradient: 'linear-gradient(135deg, #ff9500 0%, #ff6b35 50%, #ff5a00 100%)'
    },
    currentEventId: 'early_talent_discovery',
    eventHistory: [],
    personalEvents: {
      'early_talent_discovery': {
        question: '5岁的您展现出了超人的学习天赋',
        description: '您比同龄人更早地表现出对知识的渴望和理解能力。',
        options: [
          {
            text: '全力开发天赋，追求卓越',
            consequence: '您的天赋得到了充分发挥，为日后的成功奠定了基础。',
            nextEventId: 'academic_excellence',
            is_next_year: true
          },
          {
            text: '保持正常的童年生活',
            consequence: '虽然童年快乐，但可能错过了发展天赋的黄金时期。',
            nextEventId: 'balanced_childhood',
            is_next_year: true
          }
        ]
      },
      'academic_excellence': {
        question: '在学校里，您被认为是天才学生',
        description: '老师和同学都对您的学习能力刮目相看。',
        options: [
          {
            text: '继续保持学术领先地位',
            consequence: '您在学术道路上越走越远，成为众人瞩目的焦点。',
            nextEventId: null,
            is_next_year: true
          },
          {
            text: '尝试帮助其他同学',
            consequence: '您不仅自己优秀，还帮助他人进步，培养了领导能力。',
            nextEventId: null,
            is_next_year: true
          }
        ]
      },
      'balanced_childhood': {
        question: '您选择了更平衡的成长方式',
        description: '虽然没有过度开发天赋，但您拥有了快乐的童年。',
        options: [
          {
            text: '重新发现自己的特长',
            consequence: '在后来的学习中，您重新找到了自己的优势领域。',
            nextEventId: null,
            is_next_year: true
          }
        ]
      }
    }
  },
  {
    id: 'creative_soul',
    title: '艺术人生',
    subtitle: '用创意点亮世界',
    description: '用艺术的眼光看世界，在创作中寻找自我表达和心灵的自由。',
    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxkZWZzPiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4gICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTc4YmZhO3N0b3Atb3BhY2l0eToxIiAvPiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhlNWNmNjtzdG9wLW9wYWNpdHk6MSIgLz4gICAgPC9saW5lYXJHcmFkaWVudD4gIDwvZGVmcz4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWQzKSIgcng9IjEwIi8+ICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjgwIiByPSIxNSIgZmlsbD0iI2ZmZiIvPiAgPGNpcmNsZSBjeD0iMTQwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+ICA8Y2lyY2xlIGN4PSI4MCIgY3k9IjE2MCIgcj0iMTAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPiAgPHBhdGggZD0iTTEwMCAxODBRMTIwIDIwMCAxNDAgMTgwUTE2MCAyMDAgMTgwIDE4MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iNjAwIj7opo/mnK/kurrnlJ88L3RleHQ+PC9zdmc+',
    likeCount: 189,
    playCount: 98,
    theme: {
      primaryColor: '#a78bfa',
      backgroundColor: '#8b5cf6',
      startYear: 1995,
      endYear: 2025,
      backgroundGradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)'
    },
    currentEventId: 'artistic_sensitivity',
    eventHistory: [],
    personalEvents: {
      'artistic_sensitivity': {
        question: '3岁的您对色彩和图案展现出天然的敏感',
        description: '您总是被美丽的事物吸引，喜欢用蜡笔涂鸦。',
        options: [
          {
            text: '鼓励艺术天赋的发展',
            consequence: '您的艺术细胞得到了早期的培养，为创意人生打下基础。',
            nextEventId: 'artistic_education',
            is_next_year: true
          },
          {
            text: '更注重实用技能的学习',
            consequence: '虽然学到了实用技能，但艺术天赋可能被埋没。',
            nextEventId: 'practical_focus',
            is_next_year: true
          }
        ]
      },
      'artistic_education': {
        question: '在艺术启蒙教育中，您最感兴趣的是',
        description: '父母为您报名了艺术班，您可以选择专攻的方向。',
        options: [
          {
            text: '绘画和色彩搭配',
            consequence: '您在视觉艺术方面展现出了卓越的天赋。',
            nextEventId: null,
            is_next_year: true
          },
          {
            text: '音乐和节奏感',
            consequence: '您发现自己对音乐有着天生的理解能力。',
            nextEventId: null,
            is_next_year: true
          }
        ]
      },
      'practical_focus': {
        question: '虽然专注于实用技能，但艺术的种子依然存在',
        description: '在学习实用技能的过程中，您偶尔还是会被美的事物吸引。',
        options: [
          {
            text: '重新拾起对艺术的兴趣',
            consequence: '您意识到艺术对于人生的重要意义，重新开始学习。',
            nextEventId: null,
            is_next_year: true
          }
        ]
      }
    }
  },
  {
    id: 'adventurous_spirit',
    title: '冒险精神',
    subtitle: '探索未知的勇敢征程',
    description: '拥抱未知，勇敢探索，在冒险中发现人生的无限可能。',
    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxkZWZzPiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQ0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4gICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzRjNzU5O3N0b3Atb3BhY2l0eToxIiAvPiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzEwYjk4MTtzdG9wLW9wYWNpdHk6MSIgLz4gICAgPC9saW5lYXJHcmFkaWVudD4gIDwvZGVmcz4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWQ0KSIgcng9IjEwIi8+ICA8cGF0aCBkPSJNNTAgODBMMTAwIDUwTDE1MCA4MEwxMDAgMTEwWiIgZmlsbD0iI2ZmZiIvPiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSI4IiBmaWxsPSIjZmZmIi8+ICA8bGluZSB4MT0iMTAwIiB5MT0iMTUwIiB4Mj0iMTAwIiB5Mj0iMTIwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIvPiAgPGxpbmUgeDE9IjEwMCIgeTE9IjE1MCIgeDI9IjEyMCIgeTI9IjE0MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjMiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iNjAwIj7lhqLpmanjsr7npZ48L3RleHQ+PC9zdmc+',
    likeCount: 98,
    playCount: 67,
    theme: {
      primaryColor: '#34c759',
      backgroundColor: '#10b981',
      startYear: 1995,
      endYear: 2025,
      backgroundGradient: 'linear-gradient(135deg, #34c759 0%, #10b981 50%, #059669 100%)'
    },
    currentEventId: 'exploration_desire',
    eventHistory: [],
    personalEvents: {
      'exploration_desire': {
        question: '童年的您总是对探索新地方充满兴趣',
        description: '您不满足于待在安全的地方，总想去看看外面的世界。',
        options: [
          {
            text: '支持探索欲望，培养冒险精神',
            consequence: '您的冒险精神得到培养，这将让您在人生中更勇于尝试。',
            nextEventId: 'adventure_training',
            is_next_year: true
          },
          {
            text: '出于安全考虑，限制探索活动',
            consequence: '虽然更安全，但可能限制了您的探索欲望和冒险精神。',
            nextEventId: 'cautious_approach',
            is_next_year: true
          }
        ]
      },
      'adventure_training': {
        question: '您参加了户外探险训练营',
        description: '在专业指导下，您学会了如何安全地进行户外探险。',
        options: [
          {
            text: '成为探险队的小队长',
            consequence: '您不仅掌握了探险技能，还培养了领导能力。',
            nextEventId: null,
            is_next_year: true
          },
          {
            text: '专注于学习野外生存技能',
            consequence: '您掌握了丰富的野外生存技能，变得更加独立。',
            nextEventId: null,
            is_next_year: true
          }
        ]
      },
      'cautious_approach': {
        question: '虽然被限制，但冒险的心依然在跳动',
        description: '即使被限制了探索活动，您内心的冒险精神依然存在。',
        options: [
          {
            text: '通过阅读来满足探险欲望',
            consequence: '您通过书籍了解了世界各地的奇妙之处，培养了想象力。',
            nextEventId: null,
            is_next_year: true
          }
        ]
      }
    }
  }
]

// API配置
const API_BASE_URL = 'http://localhost:8080/fate-echoes/api/v1/books'

// 数据标准化函数
const normalizeBookData = (bookData) => {
  if (!bookData) return null
  
  // 确保基本结构存在
  const normalized = {
    id: bookData.id || '',
    title: bookData.title || '未知书籍',
    subtitle: bookData.subtitle || '',
    description: bookData.description || '暂无描述',
    cover: bookData.cover || '',
    likeCount: bookData.likeCount || 0,
    playCount: bookData.playCount || bookData.play_count || 0,
    author: bookData.author || '未知作者',
    
    // 确保theme结构存在
    theme: {
      primaryColor: bookData.theme?.primaryColor || '#86868b',
      backgroundColor: bookData.theme?.backgroundColor || '#f5f5f7',
      startYear: bookData.theme?.startYear || 1995,
      endYear: bookData.theme?.endYear || 2025,
      backgroundGradient: bookData.theme?.backgroundGradient || 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%)'
    },
    
    // 确保personalEvents结构存在 - 现在使用事件ID作为key
    personalEvents: bookData.personalEvents || {},
    
    // 新增：当前事件ID，用于跟踪用户当前所在的事件
    currentEventId: bookData.currentEventId || null,
    
    // 新增：事件历史，记录用户选择的路径
    eventHistory: bookData.eventHistory || []
  }
  
  console.log('数据标准化完成:', normalized)
  return normalized
}

// 从API加载书籍数据
export const loadBooksFromAPI = async () => {
  if (isLoading.value) return // 防止重复加载
  
  isLoading.value = true
  loadError.value = null
  
  try {
    console.log('正在从API加载书籍数据...', API_BASE_URL)
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    console.log('API响应状态:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    // 检查响应内容类型
    const contentType = response.headers.get('Content-Type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('API返回的不是JSON格式:', text.substring(0, 200))
      throw new Error(`服务器返回了非JSON格式的数据: ${contentType}`)
    }
    
    const apiBooks = await response.json()
    console.log('成功获取API数据:', apiBooks)
    
    if (!Array.isArray(apiBooks)) {
      throw new Error('API返回的数据格式不正确，期望数组格式')
    }
    
    // 清空现有数据
    books.splice(0, books.length)
    
    // 添加从API获取的数据
    apiBooks.forEach(book => {
      const normalizedBook = normalizeBookData(book)
      if (normalizedBook) {
        books.push(normalizedBook)
      }
    })
    
    console.log(`成功从API加载了 ${books.length} 本书籍`)
    
  } catch (error) {
    console.error('从API加载书籍失败:', error)
    loadError.value = error.message
    
    // 使用静态备用数据
    console.log('使用静态备用数据')
    books.splice(0, books.length)
    fallbackBooks.forEach(book => {
      const normalizedBook = normalizeBookData(book)
      if (normalizedBook) {
        books.push(normalizedBook)
      }
    })
    
    console.log(`已加载 ${books.length} 本备用书籍`)
  } finally {
    isLoading.value = false
  }
}

// 从API获取单个书籍信息
export const getBookFromAPI = async (bookId) => {
  try {
    console.log('正在从API获取书籍详情...', bookId)
    const response = await fetch(`${API_BASE_URL}/${bookId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    console.log('API响应状态:', response.status, response.statusText)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`未找到ID为 ${bookId} 的书籍`)
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    // 检查响应内容类型
    const contentType = response.headers.get('Content-Type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('API返回的不是JSON格式:', text.substring(0, 200))
      throw new Error(`服务器返回了非JSON格式的数据: ${contentType}`)
    }

    const bookData = await response.json()
    console.log('成功获取书籍数据:', bookData)

    if (!bookData || !bookData.id) {
      throw new Error('获取的书籍数据格式不正确')
    }

    // 标准化数据结构
    const normalizedData = normalizeBookData(bookData)
    return normalizedData
  } catch (error) {
    console.error('从API获取书籍失败:', error)
    
    // 尝试从fallbackBooks中查找
    const fallbackBook = fallbackBooks.find(book => book.id === bookId)
    if (fallbackBook) {
      console.log('使用备用数据:', fallbackBook)
      return normalizeBookData(fallbackBook)
    }

    throw error
  }
}

// 增加游玩次数
export const incrementPlayCount = async (bookCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${bookCode}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.warn(`增加游玩次数失败: HTTP ${response.status}`)
    }
  } catch (error) {
    console.error('增加游玩次数失败:', error)
    // 静默失败，不影响用户体验
  }
}

// 设置选择的书籍
export const setSelectedBook = (bookId) => {
  const book = books.find(b => b.id === bookId)
  if (book) {
    selectedBook.value = book
    // 本地存储
    localStorage.setItem('selectedBook', JSON.stringify(book))
    // 增加游玩次数
    incrementPlayCount(bookId)
  }
}

// 获取选择的书籍
export const getSelectedBook = () => {
  if (!selectedBook.value) {
    // 尝试从本地存储恢复
    const stored = localStorage.getItem('selectedBook')
    if (stored) {
      try {
        selectedBook.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored book:', e)
      }
    }
  }
  return selectedBook.value
}

// 清除选择的书籍
export const clearSelectedBook = () => {
  selectedBook.value = null
  localStorage.removeItem('selectedBook')
}

// 初始化书籍数据
export const initializeBooks = async () => {
  if (books.length === 0) {
    await loadBooksFromAPI()
  }
} 
