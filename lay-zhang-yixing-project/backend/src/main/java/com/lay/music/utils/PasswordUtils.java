package com.lay.music.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * 密码加密工具类
 */
public class PasswordUtils {
    
    private static final String ALGORITHM = "SHA-256";
    private static final String SALT = "LAY_MUSIC_SALT_2025";
    
    /**
     * 加密密码
     * @param password 原始密码
     * @return 加密后的密码
     */
    public static String encryptPassword(String password) {
        try {
            // 创建MessageDigest实例
            MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
            
            // 添加盐值增强安全性
            String saltedPassword = password + SALT;
            
            // 进行哈希运算
            byte[] hashBytes = digest.digest(saltedPassword.getBytes("UTF-8"));
            
            // 转换为Base64编码
            return Base64.getEncoder().encodeToString(hashBytes);
            
        } catch (Exception e) {
            throw new RuntimeException("密码加密失败", e);
        }
    }
    
    /**
     * 验证密码
     * @param inputPassword 用户输入的密码
     * @param storedPassword 存储的加密密码
     * @return 是否匹配
     */
    public static boolean verifyPassword(String inputPassword, String storedPassword) {
        String encryptedInput = encryptPassword(inputPassword);
        return encryptedInput.equals(storedPassword);
    }
    
    /**
     * 生成随机盐值（可选功能）
     * @return 随机盐值
     */
    public static String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
    
    /**
     * 使用自定义盐值加密密码
     * @param password 原始密码
     * @param salt 盐值
     * @return 加密后的密码
     */
    public static String encryptPasswordWithSalt(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
            String saltedPassword = password + salt;
            byte[] hashBytes = digest.digest(saltedPassword.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (Exception e) {
            throw new RuntimeException("密码加密失败", e);
        }
    }
} 