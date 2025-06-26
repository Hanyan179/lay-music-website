package com.lay.music.admin.controller;

import com.lay.music.entity.User;
import com.lay.music.repository.UserRepository;
import com.lay.music.utils.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * 管理员认证控制器
 */
@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * MD5加密方法
     */
    private String md5Encrypt(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5加密失败", e);
        }
    }
    
    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        // 验证输入参数
        if (username == null || username.trim().isEmpty() || 
            password == null || password.trim().isEmpty()) {
            response.put("code", 400);
            response.put("message", "用户名和密码不能为空");
            response.put("data", null);
            response.put("timestamp", System.currentTimeMillis());
            return response;
        }
        
        try {
            // 从数据库查找用户
            Optional<User> userOptional = userRepository.findByUsername(username);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // 验证用户状态
                if (user.getStatus() != 1) {
                    response.put("code", 403);
                    response.put("message", "用户已被禁用");
                    response.put("data", null);
                    response.put("timestamp", System.currentTimeMillis());
                    return response;
                }
                
                // 验证密码（使用MD5加密）
                String encryptedPassword = md5Encrypt(password);
                if (encryptedPassword.equals(user.getPassword())) {
                    // 登录成功
                    Map<String, Object> data = new HashMap<>();
                    data.put("token", "LAY-JWT-TOKEN-" + System.currentTimeMillis());
                    data.put("userInfo", Map.of(
                        "id", user.getId().toString(),
                        "username", user.getUsername(),
                        "realName", user.getRealName(),
                        "email", user.getEmail() != null ? user.getEmail() : "",
                        "role", user.getRole(),
                        "lastLoginTime", System.currentTimeMillis()
                    ));
                    
                    response.put("code", 200);
                    response.put("message", "登录成功");
                    response.put("data", data);
                    response.put("timestamp", System.currentTimeMillis());
                    
                    // 更新最后登录时间
                    user.setLastLoginTime(java.time.LocalDateTime.now());
                    userRepository.save(user);
                    
                    // 记录登录日志
                    System.out.println("用户登录成功: " + username + " - " + new java.util.Date());
                    
                } else {
                    response.put("code", 401);
                    response.put("message", "用户名或密码错误");
                    response.put("data", null);
                    response.put("timestamp", System.currentTimeMillis());
                    
                    // 记录失败日志
                    System.out.println("用户登录失败 - 密码错误: " + username + " - " + new java.util.Date());
                }
            } else {
                response.put("code", 401);
                response.put("message", "用户名或密码错误");
                response.put("data", null);
                response.put("timestamp", System.currentTimeMillis());
                
                // 记录失败日志
                System.out.println("用户登录失败 - 用户不存在: " + username + " - " + new java.util.Date());
            }
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "登录过程中发生错误");
            response.put("data", null);
            response.put("timestamp", System.currentTimeMillis());
            
            // 记录错误日志
            System.err.println("登录验证异常: " + e.getMessage());
            e.printStackTrace();
        }
        
        return response;
    }
    
    /**
     * 管理员登出
     */
    @PostMapping("/logout")
    public Map<String, Object> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "登出成功");
        response.put("data", null);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 验证token
     */
    @GetMapping("/verify")
    public Map<String, Object> verify(@RequestHeader(value = "Authorization", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token != null && token.startsWith("Bearer ")) {
            Map<String, Object> userInfo = Map.of(
                "id", "1",
                "username", "admin",
                "realName", "系统管理员",
                "department", "技术部",
                "position", "后台管理员"
            );
            response.put("code", 200);
            response.put("message", "验证成功");
            response.put("data", userInfo);
        } else {
            response.put("code", 401);
            response.put("message", "无效的token");
            response.put("data", null);
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 获取管理员信息
     */
    @GetMapping("/info")
    public Map<String, Object> getAdminInfo(@RequestHeader(value = "Authorization", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token != null && token.startsWith("Bearer ")) {
            Map<String, Object> userInfo = Map.of(
                "encryptedId", "LM_admin_001",
                "username", "admin",
                "realName", "系统管理员",
                "email", "admin@laymusic.com",
                "department", "技术部",
                "position", "后台管理员"
            );
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", userInfo);
        } else {
            response.put("code", 401);
            response.put("message", "无效的token");
            response.put("data", null);
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 修改密码
     */
    @PostMapping("/changePassword")
    public Map<String, Object> changePassword(@RequestBody ChangePasswordRequest request, 
                                     @RequestHeader(value = "Authorization", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token != null && token.startsWith("Bearer ")) {
            try {
                // 验证输入参数
                if (request.getOldPassword() == null || request.getOldPassword().trim().isEmpty() ||
                    request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
                    response.put("code", 400);
                    response.put("message", "原密码和新密码不能为空");
                    response.put("data", null);
                    response.put("timestamp", System.currentTimeMillis());
                    return response;
                }
                
                // 验证新密码强度
                if (request.getNewPassword().length() < 6) {
                    response.put("code", 400);
                    response.put("message", "新密码长度不能少于6位");
                    response.put("data", null);
                    response.put("timestamp", System.currentTimeMillis());
                    return response;
                }
                
                // 验证原密码是否正确
                if (PasswordUtils.verifyPassword(request.getOldPassword(), PasswordUtils.encryptPassword("LayMusic@2025"))) {
                    // 原密码正确，更新为新密码（实际应用中应该更新数据库）
                    String newEncryptedPassword = PasswordUtils.encryptPassword(request.getNewPassword());
                    
                response.put("code", 200);
                response.put("message", "密码修改成功");
                    response.put("data", Map.of(
                        "message", "密码已更新，请重新登录",
                        "timestamp", System.currentTimeMillis()
                    ));
                    
                    // 记录密码修改日志
                    System.out.println("管理员密码修改成功 - " + new java.util.Date());
                    System.out.println("新密码加密值: " + newEncryptedPassword);
                    
            } else {
                response.put("code", 400);
                response.put("message", "原密码错误");
                    response.put("data", null);
                    
                    // 记录密码修改失败日志
                    System.out.println("管理员密码修改失败：原密码错误 - " + new java.util.Date());
                }
            } catch (Exception e) {
                response.put("code", 500);
                response.put("message", "密码修改过程中发生错误");
                response.put("data", null);
                
                // 记录错误日志
                System.err.println("密码修改异常: " + e.getMessage());
            }
        } else {
            response.put("code", 401);
            response.put("message", "无效的token");
            response.put("data", null);
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty() && !"unknown".equalsIgnoreCase(xRealIP)) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }
    
    /**
     * 登录请求DTO
     */
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    /**
     * 修改密码请求DTO
     */
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
        
        public String getOldPassword() {
            return oldPassword;
        }
        
        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }
        
        public String getNewPassword() {
            return newPassword;
        }
        
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
} 