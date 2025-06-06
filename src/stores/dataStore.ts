import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type {
  CharacterBook,
  TimelineEvent,
  PersonalChoiceEvent,
  GameState
} from '../types'

// 静态数据（原来从数据库获取的数据）
const STATIC_DATA = {
  books: [
    {
      id: 1,
      bookCode: 'my_birth_story',
      title: '允许平凡',
      subtitle: '人生漫漫',
      description: '喜欢的人的网名提供了灵感，突然想去探讨一下我们过往生活的共鸣瞬间，谨以怀念我们走过的路，也向未来的晨光致意。那么，就让时间开始在1995吧。',
      author: '含盐',
      startYear: 1995,
      endYear: 2025,
      primaryColor: '#007AFF',
      coverImage: '/images/covers/my_birth_story.jpg',
      playCount: 0,
      likeCount: 0,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'play'
    },
    // 示例书籍数据 (用于展示9本书籍)
    {
      id: 2,
      bookCode: 'artist_journey',
      title: '张艺兴',
      subtitle: '努力努力再努力',
      description: '为给我激励过的明星所制作的网站。',
      author: '梦想导师',
      startYear: 1990,
      endYear: 2020,
      primaryColor: '#FF9500',
      coverImage: '/images/covers/artist_journey.jpg',
      playCount: 5,
      likeCount: 12,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'artist-journey'
    },
    {
      id: 3,
      bookCode: 'entrepreneur_life',
      title: '创业传奇',
      subtitle: '从零到独角兽的商业故事',
      description: '见证一个普通人如何通过选择和坚持，创建商业帝国的传奇历程。',
      author: '商业智者',
      startYear: 2000,
      endYear: 2023,
      primaryColor: '#34C759',
      coverImage: '/images/covers/entrepreneur_life.jpg',
      playCount: 8,
      likeCount: 25,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'entrepreneur-life'
    },
    {
      id: 4,
      bookCode: 'teacher_story',
      title: '师者风范',
      subtitle: '教育者的人生选择',
      description: '一位老师的职业生涯，见证教育的力量如何改变学生和自己的命运。',
      author: '教育使者',
      startYear: 1985,
      endYear: 2015,
      primaryColor: '#5856D6',
      coverImage: '/images/covers/teacher_story.jpg',
      playCount: 3,
      likeCount: 18,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'teacher-story'
    },
    {
      id: 5,
      bookCode: 'doctor_journey',
      title: '白衣天使',
      subtitle: '医者仁心的选择之路',
      description: '从医学院学生到主治医生，体验救死扶伤背后的人生抉择。',
      author: '医道传承',
      startYear: 1992,
      endYear: 2022,
      primaryColor: '#FF3B30',
      coverImage: '/images/covers/doctor_journey.jpg',
      playCount: 6,
      likeCount: 30,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'doctor-journey'
    },
    {
      id: 6,
      bookCode: 'programmer_life',
      title: '码农传说',
      subtitle: '代码改变世界的故事',
      description: '从编程小白到技术大牛，见证科技如何重塑现代生活。',
      author: '代码诗人',
      startYear: 1998,
      endYear: 2024,
      primaryColor: '#8E8E93',
      coverImage: '/images/covers/programmer_life.jpg',
      playCount: 15,
      likeCount: 42,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'programmer-life'
    },
    {
      id: 7,
      bookCode: 'traveler_adventure',
      title: '环球旅人',
      subtitle: '世界是最好的教室',
      description: '背包客的环球之旅，在不同文化中寻找人生的真谛。',
      author: '行走天涯',
      startYear: 2005,
      endYear: 2020,
      primaryColor: '#FF6B35',
      coverImage: '/images/covers/traveler_adventure.jpg',
      playCount: 7,
      likeCount: 22,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'traveler-adventure'
    },
    {
      id: 8,
      bookCode: 'chef_cuisine',
      title: '厨艺人生',
      subtitle: '味蕾上的人生哲学',
      description: '从厨房学徒到米其林主厨，用美食诠释人生的酸甜苦辣。',
      author: '美食哲人',
      startYear: 1988,
      endYear: 2018,
      primaryColor: '#FF9F40',
      coverImage: '/images/covers/chef_cuisine.jpg',
      playCount: 4,
      likeCount: 16,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'chef-cuisine'
    },
    {
      id: 9,
      bookCode: 'musician_symphony',
      title: '音乐人生',
      subtitle: '用旋律谱写的选择',
      description: '从街头艺人到音乐家，用音符记录每一个人生选择的美妙时刻。',
      author: '音律编织者',
      startYear: 1993,
      endYear: 2023,
      primaryColor: '#AF52DE',
      coverImage: '/images/covers/musician_symphony.jpg',
      playCount: 9,
      likeCount: 35,
      isCompleted: true,
      isUploaded: true,
      userToken: '',
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      pageRoute: 'musician-symphony'
    }
  ] as CharacterBook[],

  timelineEvents: [
    {
      id: 1,
      bookId: 1,
      year: 1995,
      title: '降生时刻',
      description: '1995年秋天，在产房里的第一声啼哭',
      mediaType: 'image' as const,
      mediaUrl: '/images/events/birth_1995.jpg',
      impact: 5,
      tags: ['开始', '重要', '降生'],
      displayOrder: 1
    },
    {
      id: 2,
      bookId: 1,
      year: 2010,
      title: '青春记忆',
      description: '15岁的美好时光，充满无限可能',
      mediaType: 'image' as const,
      mediaUrl: '/images/events/youth_2010.jpg',
      impact: 4,
      tags: ['青春', '成长', '美好'],
      displayOrder: 2
    },
    {
      id: 3,
      bookId: 1,
      year: 2025,
      title: '人生感悟',
      description: '30年人生历程的回顾与展望',
      mediaType: 'image' as const,
      mediaUrl: '/images/events/reflection_2025.jpg',
      impact: 5,
      tags: ['感悟', '成就', '未来'],
      displayOrder: 3
    }
  ] as TimelineEvent[],

  personalChoiceEvents: [
    {
      id: 1,
      bookId: 1,
      year: 1995,
      eventCode: 'birth_choice',
      question: '我的降生',
      description: '1995年秋天，我在产房里哇哇大哭，那时候哪知道，这一出生就相当于点了"进入地球Online"的确认键。现在想想，30年过去了，很多事都记不清了，但隐约记得——',
      mediaType: 'image' as const,
      mediaUrl: '/images/choices/birth_moment.jpg',
      isStartingEvent: true,
      displayOrder: 1,
      afterDescription: '这些最初的感受，成为了我人生的第一份珍贵记忆...',
      options: [
        {
          id: 1,
          eventId: 1,
          optionText: '襁褓的拥抱',
          effect: '有双手把我裹得紧紧的，软软的布料贴着皮肤，像游戏里的新手防护罩。',
          nextEventCode: 'childhood_memory',
          isNextYear: true,
          actionType: 'NEXT_EVENT' as const,
          tags: ['温暖', '保护', '母爱'],
          sortOrder: 1,
          mediaUrl: '/images/effects/warm_embrace.jpg',
          mediaType: 'image' as const,
          isCorrect: true,
          correctDescription: '那是妈妈的手在说"别怕，这个世界我来保护你"。原来我人生第一个"安全区"，就是她温暖的怀抱。'
        },
        {
          id: 2,
          eventId: 1,
          optionText: '心跳的摇篮曲',
          effect: '总有一阵"咚咚"的声音陪着我，像背景音乐一样规律。',
          nextEventCode: 'childhood_memory',
          isNextYear: true,
          actionType: 'NEXT_EVENT' as const,
          tags: ['节奏', '安抚', '心跳'],
          sortOrder: 2,
          mediaUrl: '/images/effects/heartbeat_lullaby.jpg',
          mediaType: 'image' as const,
          isCorrect: true,
          correctDescription: '那是妈妈的心跳声。原来我出生后的第一首摇篮曲，不是歌声，而是她心脏跳动的节奏——最原始、最永恒的安抚。'
        },
        {
          id: 3,
          eventId: 1,
          optionText: '甜蜜的谜题',
          effect: '有一股香香的味道，每次靠近就会让我安静下来。',
          nextEventCode: 'childhood_memory',
          isNextYear: true,
          actionType: 'NEXT_EVENT' as const,
          tags: ['香味', '安心', '温馨'],
          sortOrder: 3,
          mediaUrl: '/images/effects/sweet_scent.jpg',
          mediaType: 'image' as const,
          isCorrect: true,
          correctDescription: '那是妈妈的怀抱。原来世界上最甜的"任务奖励"，不是金币或道具，而是被这样抱着时，心里自动充值的安心感。'
        },
        {
          id: 4,
          eventId: 1,
          optionText: '笑容的密码',
          effect: '有人会对着我笑，眼睛弯成月牙，嘴角上扬的弧度特别好看。',
          nextEventCode: 'childhood_memory',
          isNextYear: true,
          actionType: 'NEXT_EVENT' as const,
          tags: ['笑容', '父爱', '温暖'],
          sortOrder: 4,
          mediaUrl: '/images/effects/loving_smile.jpg',
          mediaType: 'image' as const,
          isCorrect: false,
          correctDescription: '那是爸爸在跟我说话。原来世界上最早的"经验值+1"，不是通关成就，而是这样的笑容——它让我第一次懂得，什么是无条件的爱。'
        }
      ]
    },
    {
      id: 2,
      bookId: 1,
      year: 2010,
      eventCode: 'childhood_memory',
      question: '童年的选择',
      description: '15岁的我站在人生的十字路口，这是一个关于兴趣和未来的重要决定...',
      mediaType: 'image' as const,
      mediaUrl: '/images/choices/childhood_crossroad.jpg',
      isStartingEvent: false,
      displayOrder: 2,
      afterDescription: '这个选择将影响我未来的发展方向...',
      options: [
        {
          id: 5,
          eventId: 2,
          optionText: '专注学习',
          effect: '把所有精力投入到学业中，追求学术成就',
          nextEventCode: 'adult_career',
          isNextYear: true,
          actionType: 'NEXT_EVENT' as const,
          tags: ['学习', '专注', '成就'],
          sortOrder: 1,
          mediaUrl: '/images/effects/academic_focus.jpg',
          mediaType: 'image' as const,
          isCorrect: true,
          correctDescription: '专注学习让我获得了扎实的知识基础，为未来的成功奠定了基石。'
        },
        {
          id: 6,
          eventId: 2,
          optionText: '发展兴趣',
          effect: '培养多种兴趣爱好，全面发展自己',
          nextEventCode: 'adult_career',
          isNextYear: true,
          actionType: 'NEXT_EVENT' as const,
          tags: ['兴趣', '全面', '发展'],
          sortOrder: 2,
          mediaUrl: '/images/effects/diverse_interests.jpg',
          mediaType: 'image' as const,
          isCorrect: true,
          correctDescription: '多元化的兴趣让我成为了一个更有趣、更全面的人。'
        }
      ]
    },
    {
      id: 3,
      bookId: 1,
      year: 2025,
      eventCode: 'adult_career',
      question: '成年的抉择',
      description: '30岁的我面临人生的重大选择，这将决定我的未来道路...',
      mediaType: 'image' as const,
      mediaUrl: '/images/choices/adult_decision.jpg',
      isStartingEvent: false,
      displayOrder: 3,
      afterDescription: '无论选择什么，这都是我人生故事的重要一章...',
      options: [
        {
          id: 7,
          eventId: 3,
          optionText: '创业之路',
          effect: '选择创业，开创属于自己的事业',
          isNextYear: false,
          actionType: 'END' as const,
          tags: ['创业', '冒险', '成就'],
          sortOrder: 1,
          mediaUrl: '/images/effects/entrepreneurship.jpg',
          mediaType: 'image' as const,
          isCorrect: true,
          correctDescription: '创业的道路虽然充满挑战，但我收获了自己想要的人生。'
        },
        {
          id: 8,
          eventId: 3,
          optionText: '稳定工作',
          effect: '选择稳定的工作和生活方式',
          isNextYear: false,
          actionType: 'END' as const,
          tags: ['稳定', '安全', '平衡'],
          sortOrder: 2,
          mediaUrl: '/images/effects/stable_career.jpg',
          mediaType: 'image' as const,
          isCorrect: true,
          correctDescription: '稳定的生活让我拥有了内心的平静和家庭的幸福。'
        }
      ]
    }
  ] as PersonalChoiceEvent[]
}

export const useDataStore = defineStore('data', () => {
  // 静态数据
  const books = ref<CharacterBook[]>(STATIC_DATA.books)
  const timelineEvents = ref<TimelineEvent[]>(STATIC_DATA.timelineEvents)
  const personalChoiceEvents = ref<PersonalChoiceEvent[]>(STATIC_DATA.personalChoiceEvents)

  // 用户数据（存储在localStorage）
  const gameStates = ref<GameState[]>([])
  const userLikes = ref<Set<number>>(new Set())

  // Computed
  const getAllBooks = computed(() => books.value.filter(book => book.isCompleted && book.isUploaded))
  const getFeaturedBooks = computed(() => getAllBooks.value.slice(0, 9)) // 限制显示9本

  // Methods
  const getBookById = (id: number): CharacterBook | undefined => {
    return books.value.find(book => book.id === id)
  }

  const getTimelineEventsByBookId = (bookId: number): TimelineEvent[] => {
    return timelineEvents.value.filter(event => event.bookId === bookId)
  }

  const getPersonalChoiceEventsByBookId = (bookId: number): PersonalChoiceEvent[] => {
    return personalChoiceEvents.value
      .filter(event => event.bookId === bookId)
      .sort((a, b) => {
        // 先按年份排序，再按displayOrder排序
        if (a.year !== b.year) {
          return a.year - b.year
        }
        return (a.displayOrder || 0) - (b.displayOrder || 0)
      })
  }

  const getStartingEvent = (bookId: number): PersonalChoiceEvent | undefined => {
    return personalChoiceEvents.value.find(
      event => event.bookId === bookId && event.isStartingEvent
    )
  }

  const getEventByCode = (bookId: number, eventCode: string): PersonalChoiceEvent | null => {
    return personalChoiceEvents.value.find(
      event => event.bookId === bookId && event.eventCode === eventCode
    ) || null
  }

  const incrementPlayCount = (bookId: number) => {
    const book = books.value.find(b => b.id === bookId)
    if (book) {
      book.playCount++
      saveToLocalStorage()
    }
  }

  const toggleLike = (bookId: number): boolean => {
    const book = books.value.find(b => b.id === bookId)
    if (!book) return false

    if (userLikes.value.has(bookId)) {
      // 取消点赞
      userLikes.value.delete(bookId)
      book.likeCount = Math.max(0, book.likeCount - 1)
    } else {
      // 点赞
      userLikes.value.add(bookId)
      book.likeCount++
    }

    saveToLocalStorage()
    return userLikes.value.has(bookId)
  }

  const hasLiked = (bookId: number): boolean => {
    return userLikes.value.has(bookId)
  }

  const saveGameState = (gameState: GameState) => {
    const existingIndex = gameStates.value.findIndex(
      state => state.bookId === gameState.bookId
    )

    if (existingIndex >= 0) {
      gameStates.value[existingIndex] = gameState
    } else {
      gameStates.value.push(gameState)
    }

    saveToLocalStorage()
  }

  const getGameState = (bookId: number): GameState | undefined => {
    return gameStates.value.find(state => state.bookId === bookId)
  }

  const saveToLocalStorage = () => {
    try {
      // 保存完整的数据结构
      localStorage.setItem('fate-echoes-books', JSON.stringify(books.value))
      localStorage.setItem('fate-echoes-timeline-events', JSON.stringify(timelineEvents.value))
      localStorage.setItem('fate-echoes-personal-choice-events', JSON.stringify(personalChoiceEvents.value))
      localStorage.setItem('fate-echoes-game-states', JSON.stringify(gameStates.value))
      localStorage.setItem('fate-echoes-user-likes', JSON.stringify(Array.from(userLikes.value)))

      console.log('💾 数据已保存到localStorage:')
      console.log('  - 书籍:', books.value.length, '本')
      console.log('  - 个人选择事件:', personalChoiceEvents.value.length, '个')
      console.log('  - 游戏状态:', gameStates.value.length, '个')
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      // 加载书籍数据
      const savedBooks = localStorage.getItem('fate-echoes-books')
      if (savedBooks) {
        const parsedBooks = JSON.parse(savedBooks)
        // 只有当有有效数据时才覆盖
        if (parsedBooks.length > 0) {
          books.value = parsedBooks
          console.log('📚 加载保存的书籍数据:', parsedBooks.length, '本')
        } else {
          console.log('📚 使用静态书籍数据')
        }
      } else {
        console.log('📚 没有保存的书籍数据，使用静态数据')
      }

      // 加载时间线事件数据
      const savedTimelineEvents = localStorage.getItem('fate-echoes-timeline-events')
      if (savedTimelineEvents) {
        const parsedEvents = JSON.parse(savedTimelineEvents)
        // 只有当有有效数据时才覆盖
        if (parsedEvents.length > 0) {
          timelineEvents.value = parsedEvents
          console.log('⏰ 加载保存的时间线事件数据:', parsedEvents.length, '个')
        } else {
          console.log('⏰ 使用静态时间线事件数据')
        }
      } else {
        console.log('⏰ 没有保存的时间线事件数据，使用静态数据')
      }

      // 加载个人选择事件数据
      const savedPersonalChoiceEvents = localStorage.getItem('fate-echoes-personal-choice-events')
      if (savedPersonalChoiceEvents) {
        const parsedEvents = JSON.parse(savedPersonalChoiceEvents)
        // 只要有数据就使用，不再进行严格的起始事件验证
        if (parsedEvents.length > 0) {
          personalChoiceEvents.value = parsedEvents
          console.log('🎮 加载保存的个人选择事件数据:', parsedEvents.length, '个')

          // 检查是否存在起始事件，如果没有就警告但不重置数据
          const hasStartingEvent = parsedEvents.some((event: any) => event.isStartingEvent)
          if (!hasStartingEvent) {
            console.warn('⚠️ 警告：没有找到起始事件，但保留已保存的数据')
          }
        } else {
          console.log('🎮 使用静态个人选择事件数据')
          personalChoiceEvents.value = STATIC_DATA.personalChoiceEvents
        }
      } else {
        console.log('🎮 没有保存的个人选择事件数据，使用静态数据')
        personalChoiceEvents.value = STATIC_DATA.personalChoiceEvents
      }

      // 加载游戏状态
      const savedGameStates = localStorage.getItem('fate-echoes-game-states')
      if (savedGameStates) {
        gameStates.value = JSON.parse(savedGameStates)
        console.log('💾 加载保存的游戏状态:', gameStates.value.length, '个')
      }

      // 加载用户点赞
      const savedLikes = localStorage.getItem('fate-echoes-user-likes')
      if (savedLikes) {
        userLikes.value = new Set(JSON.parse(savedLikes))
        console.log('❤️ 加载用户点赞数据:', userLikes.value.size, '个')
      }

      // 验证关键数据
      console.log('🔍 数据验证:')
      console.log('  - 书籍数量:', books.value.length)
      console.log('  - 时间线事件数量:', timelineEvents.value.length)
      console.log('  - 个人选择事件数量:', personalChoiceEvents.value.length)
      console.log('  - 起始事件存在:', personalChoiceEvents.value.some(e => e.isStartingEvent))

    } catch (error) {
      console.error('从localStorage加载数据失败:', error)
      // 出错时使用静态数据
      books.value = STATIC_DATA.books
      timelineEvents.value = STATIC_DATA.timelineEvents
      personalChoiceEvents.value = STATIC_DATA.personalChoiceEvents
      console.log('🔄 已恢复静态数据')
    }
  }

  // 添加新的个人选择事件
  const addPersonalChoiceEvent = (event: PersonalChoiceEvent) => {
    personalChoiceEvents.value.push(event)
    saveToLocalStorage()
  }

  // 更新个人选择事件
  const updatePersonalChoiceEvent = (updatedEvent: PersonalChoiceEvent) => {
    const index = personalChoiceEvents.value.findIndex(event => event.id === updatedEvent.id)
    if (index !== -1) {
      // 更新事件数据
      personalChoiceEvents.value[index] = updatedEvent
      console.log('✅ 更新个人选择事件:', updatedEvent.id, updatedEvent.question)
      console.log('📷 事件图片URL:', updatedEvent.mediaUrl)
      console.log('🎯 选项数量:', updatedEvent.options.length)
      updatedEvent.options.forEach((option, idx) => {
        console.log(`  选项${idx + 1} 图片:`, option.mediaUrl)
      })

      // 立即保存到localStorage
      try {
        saveToLocalStorage()
        console.log('💾 事件更新已保存到localStorage')

        // 验证保存是否成功
        const savedData = localStorage.getItem('fate-echoes-personal-choice-events')
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          const savedEvent = parsedData.find((e: any) => e.id === updatedEvent.id)
          if (savedEvent && savedEvent.question === updatedEvent.question) {
            console.log('✅ 确认：数据已成功保存到localStorage')
          } else {
            console.error('❌ 警告：保存验证失败，数据可能未正确保存')
          }
        }
      } catch (error) {
        console.error('❌ 保存事件更新失败:', error)
      }
    } else {
      console.error('❌ 未找到要更新的事件:', updatedEvent.id)
    }
  }

  // 删除个人选择事件
  const deletePersonalChoiceEvent = (eventId: number) => {
    const index = personalChoiceEvents.value.findIndex(event => event.id === eventId)
    if (index !== -1) {
      personalChoiceEvents.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // 添加新书籍
  const addBook = (book: CharacterBook) => {
    books.value.push(book)
    saveToLocalStorage()
  }

  // 更新书籍
  const updateBook = (updatedBook: CharacterBook) => {
    const index = books.value.findIndex(book => book.id === updatedBook.id)
    if (index !== -1) {
      books.value[index] = updatedBook
      saveToLocalStorage()
    }
  }

  // 删除书籍
  const deleteBook = (bookId: number) => {
    const index = books.value.findIndex(book => book.id === bookId)
    if (index !== -1) {
      books.value.splice(index, 1)
      // 同时删除相关的事件和时间线事件
      personalChoiceEvents.value = personalChoiceEvents.value.filter(event => event.bookId !== bookId)
      timelineEvents.value = timelineEvents.value.filter(event => event.bookId !== bookId)
      saveToLocalStorage()
    }
  }

  // 删除游戏状态 (用于重新体验功能)
  const deleteGameState = (bookId: number) => {
    const index = gameStates.value.findIndex(state => state.bookId === bookId)
    if (index !== -1) {
      gameStates.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // 恢复图片数据
  const restoreImageData = () => {
    // 从localStorage获取可能存在的图片数据
    const savedEvents = localStorage.getItem('fate-echoes-personal-choice-events')
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents)
        parsedEvents.forEach((savedEvent: any, index: number) => {
          if (personalChoiceEvents.value[index]) {
            // 恢复事件图片
            if (savedEvent.mediaUrl && savedEvent.mediaUrl !== personalChoiceEvents.value[index].mediaUrl) {
              personalChoiceEvents.value[index].mediaUrl = savedEvent.mediaUrl
              console.log('🔄 恢复事件图片:', savedEvent.question, savedEvent.mediaUrl)
            }

            // 恢复选项图片
            savedEvent.options?.forEach((savedOption: any, optIndex: number) => {
              if (personalChoiceEvents.value[index].options[optIndex] && savedOption.mediaUrl) {
                personalChoiceEvents.value[index].options[optIndex].mediaUrl = savedOption.mediaUrl
                console.log('🔄 恢复选项图片:', savedOption.optionText, savedOption.mediaUrl)
              }
            })
          }
        })
      } catch (error) {
        console.error('恢复图片数据失败:', error)
      }
    }
  }

  // 获取书籍对应的页面路由
  const getBookPageRoute = (bookId: number): string => {
    const book = books.value.find(b => b.id === bookId)
    return book?.pageRoute || 'play' // 默认使用play页面
  }

  // 初始化时加载数据
  loadFromLocalStorage()
  restoreImageData()

  return {
    books: readonly(books),
    timelineEvents: readonly(timelineEvents),
    personalChoiceEvents: readonly(personalChoiceEvents),
    gameStates,
    getAllBooks,
    getFeaturedBooks,
    getBookById,
    getTimelineEventsByBookId,
    getPersonalChoiceEventsByBookId,
    getStartingEvent,
    getEventByCode,
    addBook,
    updateBook,
    deleteBook,
    addPersonalChoiceEvent,
    updatePersonalChoiceEvent,
    deletePersonalChoiceEvent,
    getGameState,
    saveGameState,
    deleteGameState,
    incrementPlayCount,
    toggleLike,
    hasLiked,
    saveToLocalStorage,
    loadFromLocalStorage,
    restoreImageData,
    getBookPageRoute
  }
})
