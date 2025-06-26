// 多语言数据定义
export interface LanguageData {
  // 导航栏
  nav: {
    home: string
    music: string
    messages: string
    about: string
    contact: string
    menu: string
  }
  
  // 主页内容
  hero: {
    name: string
    identityTags: {
      title: string
      description: string
    }[]
    biography: string
    scrollHint: string
    scrollHintMore: string
  }
  
  // 右键菜单
  contextMenu: {
    search: string
    mainNav: string
    settings: string
    timeline: string
    admin: string
  }
  
  // 通用
  common: {
    loading: string
  }
}

// 中文
export const zhCN: LanguageData = {
  nav: {
    home: '首页',
    music: '音乐',
    messages: '留言墙',
    about: '关于',
    contact: '联系',
    menu: '菜单'
  },
  
  hero: {
    name: 'LAY ZHANG',
    identityTags: [
      { title: '歌手', description: '华语流行音乐实力唱将，嗓音独特富有感染力' },
      { title: '舞者', description: '精湛舞技融合多元风格，舞台表现力极强' },
      { title: '制作人', description: '参与音乐制作全流程，追求艺术完美呈现' },
      { title: '演员', description: '影视作品丰富，演技自然细腻富有层次' },
      { title: '艺术家', description: '跨界艺术创作，探索音乐与视觉的无限可能' },
      { title: '创作者', description: '原创音乐作品众多，展现独特音乐理念' }
    ],
    biography: `张艺兴，1991年10月7日出生于湖南长沙，中国内地男歌手、舞者、音乐制作人、演员。

2005年，通过SM Entertainment全球海选进入韩国SM公司成为练习生。2012年4月8日，以韩国男子组合EXO成员身份正式出道。2015年10月7日，发行首张个人专辑《LOSE CONTROL》。2016年10月28日，发行第二张个人专辑《LAY 02 SHEEP》。

作为音乐制作人，张艺兴不仅在演唱上有着出色的表现，更是深度参与到音乐创作的各个环节中。他的音乐风格融合了R&B、Hip-Hop、电子音乐等多种元素，展现出独特的音乐理念和艺术追求。

除了音乐事业，张艺兴还活跃在影视领域，参演了多部电影和电视剧作品，展现了其多元化的艺术才能。他始终坚持自己的艺术理念，用音乐传递正能量，是当代华语乐坛的重要力量。`,
    scrollHint: '下滑继续',
    scrollHintMore: '下滑查看更多'
  },
  
  contextMenu: {
    search: '搜索菜单...',
    mainNav: '主要导航',
    settings: '设置选项',
    timeline: '时间线',
    admin: '管理员'
  },
  
  common: {
    loading: '加载中...'
  }
}

// 英文
export const enUS: LanguageData = {
  nav: {
    home: 'Home',
    music: 'Music',
    messages: 'Messages',
    about: 'About',
    contact: 'Contact',
    menu: 'Menu'
  },
  
  hero: {
    name: 'LAY ZHANG',
    identityTags: [
      { title: 'Singer', description: 'Powerful vocalist in Chinese pop music with unique and infectious voice' },
      { title: 'Dancer', description: 'Exquisite dance skills blending diverse styles with strong stage presence' },
      { title: 'Producer', description: 'Involved in full music production process, pursuing perfect artistic presentation' },
      { title: 'Actor', description: 'Rich filmography with natural, nuanced and layered acting skills' },
      { title: 'Artist', description: 'Cross-disciplinary artistic creation, exploring infinite possibilities of music and visual arts' },
      { title: 'Creator', description: 'Numerous original music works showcasing unique musical concepts' }
    ],
    biography: `Zhang Yixing (LAY), born October 7, 1991, in Changsha, Hunan, is a Chinese singer, dancer, music producer, and actor.

In 2005, he became a trainee at SM Entertainment through their global audition. On April 8, 2012, he officially debuted as a member of the Korean boy group EXO. On October 7, 2015, he released his first solo album "LOSE CONTROL". On October 28, 2016, he released his second solo album "LAY 02 SHEEP".

As a music producer, Zhang Yixing not only excels in vocals but also deeply participates in all aspects of music creation. His musical style blends R&B, Hip-Hop, electronic music and other elements, showcasing unique musical concepts and artistic pursuits.

Beyond his music career, Zhang Yixing is also active in film and television, participating in multiple movies and TV series, demonstrating his diversified artistic talents. He consistently upholds his artistic philosophy, spreading positive energy through music, and is an important force in contemporary Chinese pop music.`,
    scrollHint: 'Scroll to continue',
    scrollHintMore: 'Scroll for more'
  },
  
  contextMenu: {
    search: 'Search menu...',
    mainNav: 'Main Navigation',
    settings: 'Settings',
    timeline: 'Timeline',
    admin: 'Admin'
  },
  
  common: {
    loading: 'Loading...'
  }
}

// 韩文
export const koKR: LanguageData = {
  nav: {
    home: '홈',
    music: '음악',
    messages: '메시지',
    about: '소개',
    contact: '연락',
    menu: '메뉴'
  },
  
  hero: {
    name: 'LAY ZHANG',
    identityTags: [
      { title: '가수', description: '독특하고 감염력 있는 목소리를 가진 중국 팝 음악의 실력파 보컬리스트' },
      { title: '댄서', description: '다양한 스타일을 융합한 뛰어난 댄스 실력과 강한 무대 표현력' },
      { title: '프로듀서', description: '음악 제작 전 과정에 참여하며 완벽한 예술적 표현을 추구' },
      { title: '배우', description: '풍부한 필모그래피와 자연스럽고 섬세하며 층이 있는 연기력' },
      { title: '아티스트', description: '장르를 넘나드는 예술적 창작, 음악과 시각 예술의 무한한 가능성 탐구' },
      { title: '창작자', description: '독특한 음악적 개념을 보여주는 수많은 오리지널 음악 작품' }
    ],
    biography: `장이싱(LAY), 1991년 10월 7일 중국 후난성 창사 출생, 중국의 가수, 댄서, 음악 프로듀서, 배우.

2005년 SM 엔터테인먼트 글로벌 오디션을 통해 한국 SM 회사의 연습생이 되었다. 2012년 4월 8일, 한국 남성 그룹 EXO의 멤버로 정식 데뷔했다. 2015년 10월 7일, 첫 번째 개인 앨범 《LOSE CONTROL》을 발매했다. 2016년 10월 28일, 두 번째 개인 앨범 《LAY 02 SHEEP》을 발매했다.

음악 프로듀서로서 장이싱은 보컬에서 뛰어난 표현을 보일 뿐만 아니라 음악 창작의 모든 단계에 깊이 참여한다. 그의 음악 스타일은 R&B, 힙합, 일렉트로닉 음악 등 다양한 요소를 융합하여 독특한 음악적 이념과 예술적 추구를 보여준다.

음악 활동 외에도 장이싱은 영화와 텔레비전 분야에서도 활발히 활동하며, 여러 영화와 드라마 작품에 출연하여 다원화된 예술적 재능을 보여주었다. 그는 항상 자신의 예술적 이념을 고수하며 음악을 통해 긍정적인 에너지를 전달하는 현대 중국 가요계의 중요한 힘이다.`,
    scrollHint: '스크롤하여 계속',
    scrollHintMore: '더 보려면 스크롤'
  },
  
  contextMenu: {
    search: '메뉴 검색...',
    mainNav: '주요 네비게이션',
    settings: '설정',
    timeline: '타임라인',
    admin: '관리자'
  },
  
  common: {
    loading: '로딩 중...'
  }
}

// 语言配置
export const languages = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ko-KR': koKR
} as const

export type LanguageCode = keyof typeof languages

// 语言显示名称
export const languageNames = {
  'zh-CN': '中文',
  'en-US': 'English',
  'ko-KR': '한국어'
} as const 