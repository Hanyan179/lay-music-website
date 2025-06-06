import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8089/fate-echoes/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// 音乐相关API
export const musicApi = {
  // 获取音乐列表
  getMusicList: (params) => api.get('/music/list', { params }),
  
  // 获取音乐详情
  getMusicDetail: (id) => api.get(`/music/${id}`),
  
  // 获取专辑列表
  getAlbumList: (params) => api.get('/album/list', { params }),
  
  // 获取MV列表
  getMVList: (params) => api.get('/mv/list', { params })
}

// 时间轴相关API
export const timelineApi = {
  // 获取时间轴数据
  getTimelineData: () => api.get('/timeline'),
  
  // 添加时间轴事件
  addTimelineEvent: (data) => api.post('/timeline', data),
  
  // 更新时间轴事件
  updateTimelineEvent: (id, data) => api.put(`/timeline/${id}`, data),
  
  // 删除时间轴事件
  deleteTimelineEvent: (id) => api.delete(`/timeline/${id}`)
}

// 用户相关API
export const userApi = {
  // 用户登录
  login: (data) => api.post('/user/login', data),
  
  // 用户注册
  register: (data) => api.post('/user/register', data),
  
  // 获取用户信息
  getUserInfo: () => api.get('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => api.put('/user/info', data)
}

export default api 