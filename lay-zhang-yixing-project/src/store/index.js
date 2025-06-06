import { defineStore } from 'pinia'
import { musicApi, timelineApi, userApi } from '@/api'

// 音乐store
export const useMusicStore = defineStore('music', {
  state: () => ({
    musicList: [],
    albumList: [],
    mvList: [],
    currentMusic: null,
    loading: false
  }),
  
  getters: {
    // 获取最新音乐
    latestMusic: (state) => state.musicList.slice(0, 5),
    
    // 获取热门专辑
    popularAlbums: (state) => state.albumList.filter(album => album.isPopular)
  },
  
  actions: {
    // 获取音乐列表
    async fetchMusicList(params = {}) {
      this.loading = true
      try {
        const data = await musicApi.getMusicList(params)
        this.musicList = data
      } catch (error) {
        console.error('获取音乐列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取专辑列表
    async fetchAlbumList(params = {}) {
      this.loading = true
      try {
        const data = await musicApi.getAlbumList(params)
        this.albumList = data
      } catch (error) {
        console.error('获取专辑列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取MV列表
    async fetchMVList(params = {}) {
      this.loading = true
      try {
        const data = await musicApi.getMVList(params)
        this.mvList = data
      } catch (error) {
        console.error('获取MV列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 设置当前音乐
    setCurrentMusic(music) {
      this.currentMusic = music
    }
  }
})

// 时间轴store
export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    timelineData: [],
    loading: false
  }),
  
  actions: {
    // 获取时间轴数据
    async fetchTimelineData() {
      this.loading = true
      try {
        const data = await timelineApi.getTimelineData()
        this.timelineData = data
      } catch (error) {
        console.error('获取时间轴数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 添加时间轴事件
    async addTimelineEvent(eventData) {
      try {
        const data = await timelineApi.addTimelineEvent(eventData)
        this.timelineData.push(data)
        return data
      } catch (error) {
        console.error('添加时间轴事件失败:', error)
        throw error
      }
    }
  }
})

// 用户store
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: false
  }),
  
  actions: {
    // 用户登录
    async login(loginData) {
      try {
        const data = await userApi.login(loginData)
        this.token = data.token
        this.userInfo = data.user
        this.isLoggedIn = true
        localStorage.setItem('token', data.token)
        return data
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },
    
    // 用户登出
    logout() {
      this.userInfo = null
      this.token = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      if (!this.token) return
      
      try {
        const data = await userApi.getUserInfo()
        this.userInfo = data
        this.isLoggedIn = true
      } catch (error) {
        console.error('获取用户信息失败:', error)
        this.logout()
      }
    }
  }
}) 