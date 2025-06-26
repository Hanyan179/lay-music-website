// LAY张艺兴音乐网站 - 数据API调用模块
// 用于前端页面获取后端数据

const API_BASE = 'http://localhost:8082';

// 通用API请求函数
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(API_BASE + url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.msg || '请求失败');
    }
    
    return data.data;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

// ==================== 公开数据接口 ====================

/**
 * 获取音乐数据
 * @returns {Promise<Object>} 音乐数据对象
 */
export async function getMusicData() {
  return await apiRequest('/api/data/music');
}

/**
 * 获取时间线数据
 * @returns {Promise<Object>} 时间线数据对象
 */
export async function getTimelineData() {
  return await apiRequest('/api/data/timeline');
}

/**
 * 获取留言数据（仅已审核）
 * @returns {Promise<Object>} 留言数据对象
 */
export async function getMessagesData() {
  return await apiRequest('/api/data/messages');
}

// ==================== 管理接口（需要登录） ====================

/**
 * 管理员登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} code 验证码
 * @param {string} uuid 验证码UUID
 * @returns {Promise<string>} 登录Token
 */
export async function adminLogin(username, password, code = '', uuid = '') {
  const response = await fetch(API_BASE + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
      code,
      uuid
    })
  });
  
  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(data.msg || '登录失败');
  }
  
  return data.token;
}

/**
 * 获取验证码
 * @returns {Promise<Object>} 验证码数据
 */
export async function getCaptcha() {
  const response = await fetch(API_BASE + '/captchaImage');
  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(data.msg || '获取验证码失败');
  }
  
  return data.data;
}

/**
 * 获取用户信息
 * @param {string} token 登录Token
 * @returns {Promise<Object>} 用户信息
 */
export async function getUserInfo(token) {
  return await apiRequest('/getInfo', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * 获取管理员留言数据（包含未审核）
 * @param {string} token 登录Token
 * @returns {Promise<Object>} 完整留言数据
 */
export async function getAdminMessagesData(token) {
  return await apiRequest('/api/admin/data/messages', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * 更新音乐数据
 * @param {Object} musicData 音乐数据对象
 * @param {string} token 登录Token
 * @returns {Promise<boolean>} 更新结果
 */
export async function updateMusicData(musicData, token) {
  const response = await fetch(API_BASE + '/api/admin/data/music', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(musicData)
  });
  
  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(data.msg || '更新失败');
  }
  
  return true;
}

/**
 * 更新时间线数据
 * @param {Object} timelineData 时间线数据对象
 * @param {string} token 登录Token
 * @returns {Promise<boolean>} 更新结果
 */
export async function updateTimelineData(timelineData, token) {
  const response = await fetch(API_BASE + '/api/admin/data/timeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(timelineData)
  });
  
  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(data.msg || '更新失败');
  }
  
  return true;
}

/**
 * 更新留言数据
 * @param {Object} messagesData 留言数据对象
 * @param {string} token 登录Token
 * @returns {Promise<boolean>} 更新结果
 */
export async function updateMessagesData(messagesData, token) {
  const response = await fetch(API_BASE + '/api/admin/data/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(messagesData)
  });
  
  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(data.msg || '更新失败');
  }
  
  return true;
}

// ==================== 工具函数 ====================

/**
 * 检查API服务状态
 * @returns {Promise<boolean>} 服务是否正常
 */
export async function checkApiStatus() {
  try {
    await getCaptcha();
    return true;
  } catch (error) {
    console.error('API服务检查失败:', error);
    return false;
  }
}

/**
 * 格式化时间戳
 * @param {string} timestamp ISO时间戳
 * @returns {string} 格式化后的时间
 */
export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 本地存储Token管理
 */
export const tokenManager = {
  // 存储Token
  setToken(token) {
    localStorage.setItem('admin_token', token);
  },
  
  // 获取Token
  getToken() {
    return localStorage.getItem('admin_token');
  },
  
  // 清除Token
  clearToken() {
    localStorage.removeItem('admin_token');
  },
  
  // 检查Token是否存在
  hasToken() {
    return !!this.getToken();
  }
};

// 默认导出所有API函数
export default {
  // 公开接口
  getMusicData,
  getTimelineData,
  getMessagesData,
  
  // 认证接口
  adminLogin,
  getCaptcha,
  getUserInfo,
  
  // 管理接口
  getAdminMessagesData,
  updateMusicData,
  updateTimelineData,
  updateMessagesData,
  
  // 工具函数
  checkApiStatus,
  formatTimestamp,
  tokenManager
}; 