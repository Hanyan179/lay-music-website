package com.lay.music.admin.controller;

import com.lay.music.entity.User;
import com.lay.music.repository.UserRepository;
import com.lay.music.utils.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Optional;

/**
 * 用户管理控制器
 */
@RestController
@RequestMapping("/api/admin/users")
public class UserManagementController {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 初始化默认管理员用户
     */
    @PostConstruct
    public void initDefaultAdmin() {
        // 检查是否已存在管理员用户
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(PasswordUtils.encryptPassword("LayMusic@2025"));
            adminUser.setRealName("系统管理员");
            adminUser.setEmail("admin@laymusic.com");
            adminUser.setDepartment("技术部");
            adminUser.setPosition("后台管理员");
            adminUser.setRole("ADMIN");
            adminUser.setStatus(1);
            
            userRepository.save(adminUser);
            System.out.println("✅ 默认管理员用户已创建: admin / LayMusic@2025");
        }
    }
    
    /**
     * 获取用户列表
     */
    @GetMapping
    public Map<String, Object> getUserList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 创建分页对象（页码从0开始）
            Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createTime"));
            
            // 根据关键字搜索用户
            Page<User> userPage;
            if (keyword == null || keyword.trim().isEmpty()) {
                userPage = userRepository.findAll(pageable);
            } else {
                userPage = userRepository.findByKeyword(keyword.trim(), pageable);
            }
            
            // 转换为安全的用户信息（不包含密码）
            List<Map<String, Object>> safeUsers = new ArrayList<>();
            for (User user : userPage.getContent()) {
                Map<String, Object> safeUser = new HashMap<>();
                safeUser.put("id", user.getId());
                safeUser.put("username", user.getUsername());
                safeUser.put("realName", user.getRealName());
                safeUser.put("email", user.getEmail());
                safeUser.put("department", user.getDepartment());
                safeUser.put("position", user.getPosition());
                safeUser.put("role", user.getRole());
                safeUser.put("status", user.getStatus());
                safeUser.put("createTime", user.getCreateTime());
                safeUser.put("lastLoginTime", user.getLastLoginTime());
                safeUsers.add(safeUser);
            }
            
            Map<String, Object> data = new HashMap<>();
            data.put("users", safeUsers);
            data.put("total", userPage.getTotalElements());
            data.put("page", page);
            data.put("size", size);
            data.put("totalPages", userPage.getTotalPages());
            
            response.put("code", 200);
            response.put("message", "获取用户列表成功");
            response.put("data", data);
            
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取用户列表失败");
            response.put("data", null);
            System.err.println("获取用户列表异常: " + e.getMessage());
            e.printStackTrace();
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 创建用户
     */
    @PostMapping
    public Map<String, Object> createUser(@RequestBody Map<String, String> userRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = userRequest.get("username");
            String password = userRequest.get("password");
            String realName = userRequest.get("realName");
            String email = userRequest.get("email");
            
            // 验证必填字段
            if (username == null || username.trim().isEmpty() ||
                password == null || password.trim().isEmpty() ||
                realName == null || realName.trim().isEmpty()) {
                response.put("code", 400);
                response.put("message", "用户名、密码和真实姓名不能为空");
                response.put("data", null);
                response.put("timestamp", System.currentTimeMillis());
                return response;
            }
            
            // 检查用户名是否已存在
            if (userRepository.existsByUsername(username)) {
                response.put("code", 400);
                response.put("message", "用户名已存在");
                response.put("data", null);
                response.put("timestamp", System.currentTimeMillis());
                return response;
            }
            
            // 创建新用户
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(PasswordUtils.encryptPassword(password));
            newUser.setRealName(realName);
            newUser.setEmail(email != null ? email : "");
            newUser.setDepartment(userRequest.getOrDefault("department", ""));
            newUser.setPosition(userRequest.getOrDefault("position", ""));
            newUser.setRole(userRequest.getOrDefault("role", "USER"));
            newUser.setStatus(1);
            
            // 保存到数据库
            User savedUser = userRepository.save(newUser);
            
            // 返回用户信息（不包含密码）
            Map<String, Object> safeUser = new HashMap<>();
            safeUser.put("id", savedUser.getId());
            safeUser.put("username", savedUser.getUsername());
            safeUser.put("realName", savedUser.getRealName());
            safeUser.put("email", savedUser.getEmail());
            safeUser.put("department", savedUser.getDepartment());
            safeUser.put("position", savedUser.getPosition());
            safeUser.put("role", savedUser.getRole());
            safeUser.put("status", savedUser.getStatus());
            safeUser.put("createTime", savedUser.getCreateTime());
            
            response.put("code", 200);
            response.put("message", "用户创建成功");
            response.put("data", safeUser);
            
            System.out.println("✅ 新用户创建成功: " + username + " (ID: " + savedUser.getId() + ")");
            
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "用户创建失败");
            response.put("data", null);
            System.err.println("用户创建异常: " + e.getMessage());
            e.printStackTrace();
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 批量创建用户
     */
    @PostMapping("/batch")
    public Map<String, Object> batchCreateUsers(@RequestBody Map<String, Object> batchRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, String>> userList = (List<Map<String, String>>) batchRequest.get("users");
            
            if (userList == null || userList.isEmpty()) {
                response.put("code", 400);
                response.put("message", "用户列表不能为空");
                response.put("data", null);
                response.put("timestamp", System.currentTimeMillis());
                return response;
            }
            
            List<Map<String, Object>> createdUsers = new ArrayList<>();
            List<String> errorMessages = new ArrayList<>();
            
            for (Map<String, String> userRequest : userList) {
                try {
                    String username = userRequest.get("username");
                    String password = userRequest.get("password");
                    String realName = userRequest.get("realName");
                    
                    // 验证必填字段
                    if (username == null || username.trim().isEmpty() ||
                        password == null || password.trim().isEmpty() ||
                        realName == null || realName.trim().isEmpty()) {
                        errorMessages.add("用户 " + username + ": 用户名、密码和真实姓名不能为空");
                        continue;
                    }
                    
                    // 检查用户名是否已存在
                    if (userRepository.existsByUsername(username)) {
                        errorMessages.add("用户 " + username + ": 用户名已存在");
                        continue;
                    }
                    
                    // 创建新用户
                    User newUser = new User();
                    newUser.setUsername(username);
                    newUser.setPassword(PasswordUtils.encryptPassword(password));
                    newUser.setRealName(realName);
                    newUser.setEmail(userRequest.getOrDefault("email", ""));
                    newUser.setDepartment(userRequest.getOrDefault("department", ""));
                    newUser.setPosition(userRequest.getOrDefault("position", ""));
                    newUser.setRole(userRequest.getOrDefault("role", "USER"));
                    newUser.setStatus(1);
                    
                    // 保存到数据库
                    User savedUser = userRepository.save(newUser);
                    
                    // 添加到成功列表（不包含密码）
                    Map<String, Object> safeUser = new HashMap<>();
                    safeUser.put("id", savedUser.getId());
                    safeUser.put("username", savedUser.getUsername());
                    safeUser.put("realName", savedUser.getRealName());
                    safeUser.put("email", savedUser.getEmail());
                    safeUser.put("department", savedUser.getDepartment());
                    safeUser.put("position", savedUser.getPosition());
                    safeUser.put("role", savedUser.getRole());
                    safeUser.put("status", savedUser.getStatus());
                    safeUser.put("createTime", savedUser.getCreateTime());
                    createdUsers.add(safeUser);
                    
                } catch (Exception e) {
                    errorMessages.add("用户 " + userRequest.get("username") + ": " + e.getMessage());
                }
            }
            
            Map<String, Object> data = new HashMap<>();
            data.put("createdUsers", createdUsers);
            data.put("successCount", createdUsers.size());
            data.put("errorCount", errorMessages.size());
            data.put("errors", errorMessages);
            
            response.put("code", 200);
            response.put("message", "批量创建完成");
            response.put("data", data);
            
            System.out.println("批量创建用户完成: 成功 " + createdUsers.size() + " 个, 失败 " + errorMessages.size() + " 个");
            
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "批量创建失败");
            response.put("data", null);
            System.err.println("批量创建用户异常: " + e.getMessage());
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 删除用户
     */
    @DeleteMapping("/{userId}")
    public Map<String, Object> deleteUser(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userIdLong = Long.parseLong(userId);
            
            // 检查用户是否存在
            Optional<User> userOptional = userRepository.findById(userIdLong);
            if (!userOptional.isPresent()) {
                response.put("code", 404);
                response.put("message", "用户不存在");
                response.put("data", null);
                response.put("timestamp", System.currentTimeMillis());
                return response;
            }
            
            User user = userOptional.get();
            
            // 不能删除管理员用户
            if ("ADMIN".equals(user.getRole()) || "admin".equals(user.getUsername())) {
                response.put("code", 403);
                response.put("message", "不能删除系统管理员");
                response.put("data", null);
                response.put("timestamp", System.currentTimeMillis());
                return response;
            }
            
            // 从数据库删除用户
            userRepository.delete(user);
            
            response.put("code", 200);
            response.put("message", "用户删除成功");
            response.put("data", null);
            System.out.println("✅ 用户删除成功: " + user.getUsername() + " (ID: " + userId + ")");
            
        } catch (NumberFormatException e) {
            response.put("code", 400);
            response.put("message", "用户ID格式错误");
            response.put("data", null);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "用户删除失败");
            response.put("data", null);
            System.err.println("删除用户异常: " + e.getMessage());
            e.printStackTrace();
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
} 