import CryptoJS from 'crypto-js'

/**
 * 前端密码加密工具
 * 与后端保持一致的加密算法
 */

// 与后端相同的盐值
const SALT = 'LAY_MUSIC_SALT_2025'

/**
 * 加密密码
 * @param {string} password 原始密码
 * @returns {string} 加密后的密码
 */
export function encryptPassword(password) {
  try {
    // 添加盐值
    const saltedPassword = password + SALT
    
    // 使用SHA-256进行哈希运算
    const hash = CryptoJS.SHA256(saltedPassword)
    
    // 转换为Base64编码
    const base64Hash = CryptoJS.enc.Base64.stringify(hash)
    
    return base64Hash
  } catch (error) {
    console.error('密码加密失败:', error)
    throw new Error('密码加密失败')
  }
}

/**
 * 简单的SHA-256加密（不使用盐值）
 * @param {string} text 要加密的文本
 * @returns {string} 加密后的文本
 */
export function sha256(text) {
  const hash = CryptoJS.SHA256(text)
  return CryptoJS.enc.Hex.stringify(hash)
}

/**
 * MD5加密（可选）
 * @param {string} text 要加密的文本
 * @returns {string} 加密后的文本
 */
export function md5(text) {
  const hash = CryptoJS.MD5(text)
  return CryptoJS.enc.Hex.stringify(hash)
} 