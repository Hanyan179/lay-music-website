// 角色书籍类型
export interface CharacterBook {
  id: number
  bookCode: string
  title: string
  subtitle?: string
  description: string
  author: string
  startYear: number
  endYear: number
  primaryColor: string
  coverImage?: string
  playCount: number
  likeCount: number
  isCompleted: boolean
  isUploaded: boolean
  userToken?: string
  createdAt: string
  updatedAt: string
  pageRoute?: string
}

// 时间线事件类型
export interface TimelineEvent {
  id: number
  bookId: number
  year: number
  title: string
  description: string
  mediaType?: 'image' | 'video'
  mediaUrl?: string
  mediaPoster?: string
  impact: number
  tags: string[]
  displayOrder: number
}

// 人生抉择事件类型
export interface PersonalChoiceEvent {
  id: number
  bookId: number
  year: number
  eventCode: string
  question: string
  description: string
  mediaType?: 'image' | 'video'
  mediaUrl?: string
  mediaPoster?: string
  isStartingEvent: boolean
  displayOrder: number
  afterDescription?: string
  options: ChoiceOption[]
}

// 选择选项类型
export interface ChoiceOption {
  id: number
  eventId: number
  optionText: string
  effect: string
  nextEventCode?: string
  isNextYear: boolean
  actionType: 'CONTINUE' | 'END' | 'NEXT_EVENT'
  tags: string[]
  sortOrder: number
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  isCorrect?: boolean
  correctDescription?: string
}

// 游戏状态类型
export interface GameState {
  bookId: number
  currentYear: number
  choiceHistory: string[]
  completedEvents: string[]
  playerStats: Record<string, number>
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
} 