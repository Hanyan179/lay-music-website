// 管理员API接口

const API_BASE_URL = 'http://localhost:8080/api/admin'

// 获取token
const getToken = () => {
  return localStorage.getItem('admin_token')
}

// 设置token
const setToken = (token) => {
  localStorage.setItem('admin_token', token)
}

// 清除token
const clearToken = () => {
  localStorage.removeItem('admin_token')
}

// 通用请求配置
const createRequestOptions = (method, data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  }
  
  const token = getToken()
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }
  
  if (data) {
    options.body = JSON.stringify(data)
  }
  
  return options
}

// 模拟API响应
const mockResponse = (data, success = true, message = '操作成功') => {
  return Promise.resolve({
    code: success ? 200 : 500,
    message,
    data,
    timestamp: Date.now()
  })
}

// 认证相关API
export const adminLogin = async (loginData) => {
  try {
    // 使用真实的后端API进行登录
    const response = await fetch('http://localhost:8081/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginData.username,
        password: loginData.password // 发送原始密码，后端处理加密验证
      })
    })
    
    const result = await response.json()
    
    if (result.code === 200) {
      // 登录成功，保存token
      if (result.data && result.data.token) {
        setToken(result.data.token)
      }
      return {
        success: true,
        message: result.message,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || '登录失败',
        data: null
      }
    }
  } catch (error) {
    console.error('登录失败:', error)
    return {
      success: false,
      message: '网络连接失败，请检查服务器状态',
      data: null
    }
  }
}

export const adminLogout = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockResponse(null, true, '退出登录成功')
  } catch (error) {
    console.error('退出登录失败:', error)
    return mockResponse(null, false, '退出登录失败')
  }
}

export const validateToken = async (token) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (token && token.startsWith('mock_jwt_token_')) {
      return mockResponse({
        encryptedId: 'LM_admin_001',
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@laymusic.com'
      })
    } else {
      return mockResponse(null, false, 'token无效')
    }
  } catch (error) {
    console.error('验证token失败:', error)
    return mockResponse(null, false, 'token验证失败')
  }
}

// 专辑管理API
export const getAllAlbums = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockAlbums = [
      {
        encryptedId: 'LM_album_001',
        albumName: 'NAMANANA',
        songCount: 6,
        totalDuration: 1320,
        songType: '流行',
        releaseYear: 2018,
        albumDescription: 'LAY第二张个人专辑，展现了他的多样化音乐风格',
        achievements: JSON.stringify({
          awards: ['iTunes全球专辑榜第4名', '美国iTunes专辑榜第21名']
        }),
        status: 1
      },
      {
        encryptedId: 'LM_album_002',
        albumName: 'LOSE CONTROL',
        songCount: 7,
        totalDuration: 1680,
        songType: '流行',
        releaseYear: 2016,
        albumDescription: 'LAY首张个人专辑',
        achievements: JSON.stringify({
          awards: ['iTune中国区专辑榜第1名']
        }),
        status: 1
      }
    ]
    
    return mockResponse(mockAlbums)
  } catch (error) {
    console.error('获取专辑列表失败:', error)
    return mockResponse(null, false, '获取专辑列表失败')
  }
}

export const getAlbumById = async (albumId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟根据ID获取专辑详情
    const albums = await getAllAlbums()
    const album = albums.data.find(item => item.encryptedId === albumId)
    
    if (album) {
      return mockResponse(album)
    } else {
      return mockResponse(null, false, '专辑不存在')
    }
  } catch (error) {
    console.error('获取专辑详情失败:', error)
    return mockResponse(null, false, '获取专辑详情失败')
  }
}

export const createAlbum = async (albumData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newAlbum = {
      ...albumData,
      encryptedId: 'LM_album_' + Date.now(),
      status: 0
    }
    
    return mockResponse(newAlbum, true, '专辑创建成功')
  } catch (error) {
    console.error('创建专辑失败:', error)
    return mockResponse(null, false, '创建专辑失败')
  }
}

export const updateAlbum = async (albumData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockResponse(albumData, true, '专辑更新成功')
  } catch (error) {
    console.error('更新专辑失败:', error)
    return mockResponse(null, false, '更新专辑失败')
  }
}

export const deleteAlbum = async (albumId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockResponse(null, true, '专辑删除成功')
  } catch (error) {
    console.error('删除专辑失败:', error)
    return mockResponse(null, false, '删除专辑失败')
  }
}

export const updateAlbumStatus = async (albumId, status) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // 模拟更新专辑状态
    return mockResponse({ albumId, status }, true, '专辑状态更新成功')
  } catch (error) {
    console.error('更新专辑状态失败:', error)
    return mockResponse(null, false, '更新专辑状态失败')
  }
}

export const batchDeleteAlbums = async (albumIds) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // 模拟批量删除专辑
    return mockResponse({ deletedCount: albumIds.length }, true, `成功删除${albumIds.length}个专辑`)
  } catch (error) {
    console.error('批量删除专辑失败:', error)
    return mockResponse(null, false, '批量删除专辑失败')
  }
}

export const getAlbumStatistics = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // 模拟获取专辑统计信息
    const statistics = {
      totalAlbums: 5,
      publishedAlbums: 5,
      draftAlbums: 0,
      offlineAlbums: 0,
      totalSongs: 74,
      totalDuration: 15480, // 总时长（秒）
      totalPlayCount: 50000000, // 总播放量
      averageRating: 4.8,
      latestAlbum: {
        name: 'PRODUCER',
        releaseDate: '2021-09-03'
      }
    }
    
    return mockResponse(statistics)
  } catch (error) {
    console.error('获取专辑统计失败:', error)
    return mockResponse(null, false, '获取专辑统计失败')
  }
}

// 真实API调用函数（当后端接口可用时使用）
export const realApiCall = async (endpoint, options) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API调用失败:', error)
    throw error
  }
}

// 用户管理相关API

// 获取用户列表
export const getUserList = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    })
    
    const result = await response.json()
    
    if (result.code === 200) {
      return {
        success: true,
        message: result.message,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || '获取用户列表失败',
        data: []
      }
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return {
      success: false,
      message: '网络连接失败',
      data: []
    }
  }
}

// 添加用户
export const addUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:8081/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(userData)
    })
    
    const result = await response.json()
    
    if (result.code === 200) {
      return {
        success: true,
        message: result.message,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || '添加用户失败',
        data: null
      }
    }
  } catch (error) {
    console.error('添加用户失败:', error)
    return {
      success: false,
      message: '网络连接失败',
      data: null
    }
  }
}

// 更新用户
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`http://localhost:8081/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(userData)
    })
    
    const result = await response.json()
    
    if (result.code === 200) {
      return {
        success: true,
        message: result.message,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || '更新用户失败',
        data: null
      }
    }
  } catch (error) {
    console.error('更新用户失败:', error)
    return {
      success: false,
      message: '网络连接失败',
      data: null
    }
  }
}

// 删除用户
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8081/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    })
    
    const result = await response.json()
    
    if (result.code === 200) {
      return {
        success: true,
        message: result.message,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || '删除用户失败',
        data: null
      }
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    return {
      success: false,
      message: '网络连接失败',
      data: null
    }
  }
}

// 导出所有API函数
export default {
  // 认证相关
  adminLogin,
  adminLogout,
  validateToken,
  
  // 专辑管理
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  updateAlbumStatus,
  batchDeleteAlbums,
  getAlbumStatistics,
  
  // 用户管理
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  
  // 通用工具
  realApiCall
} 