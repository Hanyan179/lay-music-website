// LAY张艺兴轮播数据维护文件
// 数据来源：微博 https://m.weibo.cn/u/2706896955

export const carouselData = [
  {
    id: 1,
    type: 'video',
    src: '/img/viewVideo/kaitian.mp4',
    title: 'LAY张艺兴《开天》精彩现场',
    description: '热力四射的舞台演出，展现无限魅力',
    source: '微博',
    link: 'https://m.weibo.cn/u/2706896955',
    publishTime: '2024-12-15'
  },
  {
    id: 2,
    type: 'video',
    src: '/img/viewVideo/miansha.mp4',
    title: 'LAY张艺兴《面纱》舞蹈练习',
    description: '专业态度与完美技巧的完美结合',
    source: '微博',
    link: 'https://m.weibo.cn/u/2706896955',
    publishTime: '2024-12-10'
  },
  {
    id: 3,
    type: 'image',
    src: 'https://via.placeholder.com/800x600/333/fff?text=LAY+Studio+Recording',
    title: '录音室创作时光',
    description: '音乐创作的每一个瞬间都充满灵感',
    source: '微博',
    link: 'https://m.weibo.cn/u/2706896955',
    publishTime: '2024-12-08'
  },
  {
    id: 4,
    type: 'image',
    src: 'https://via.placeholder.com/800x600/444/fff?text=LAY+Behind+Scenes',
    title: '幕后花絮',
    description: '真实记录音乐制作的珍贵时刻',
    source: '微博',
    link: 'https://m.weibo.cn/u/2706896955',
    publishTime: '2024-12-05'
  },
  {
    id: 5,
    type: 'image',
    src: 'https://via.placeholder.com/800x600/555/fff?text=LAY+Fashion+Shoot',
    title: '时尚大片拍摄',
    description: '完美诠释时尚与艺术的融合',
    source: '微博',
    link: 'https://m.weibo.cn/u/2706896955',
    publishTime: '2024-12-01'
  },
  {
    id: 6,
    type: 'image',
    src: 'https://via.placeholder.com/800x600/666/fff?text=LAY+Live+Concert',
    title: '演唱会现场精彩片段',
    description: '与粉丝们共同度过的难忘时光',
    source: '微博',
    link: 'https://m.weibo.cn/u/2706896955',
    publishTime: '2024-11-28'
  }
]

// 获取所有轮播数据
export const getAllCarouselItems = () => {
  return carouselData
}

// 根据类型筛选轮播数据
export const getCarouselItemsByType = (type) => {
  return carouselData.filter(item => item.type === type)
}

// 获取最新的轮播数据
export const getLatestCarouselItems = (count = 6) => {
  return carouselData
    .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
    .slice(0, count)
}

// 根据ID获取轮播项
export const getCarouselItemById = (id) => {
  return carouselData.find(item => item.id === id)
}

// 获取随机轮播数据
export const getRandomCarouselItems = (count = 6) => {
  const shuffled = [...carouselData].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
