package com.lay.music.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 根路径控制器
 */
@Controller
public class RootController {
    
    /**
     * 根路径处理器 - 返回首页
     */
    @GetMapping("/")
    public String root() {
        return "forward:/index.html";
    }
    
    /**
     * x-back路径处理器 - 返回后台管理登录页面
     */
    @GetMapping("/x-back")
    public String adminLogin() {
        return "forward:/index.html";
    }
    
    /**
     * API信息页面
     */
    @GetMapping("/api")
    @ResponseBody
    public Map<String, Object> apiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "LAY张艺兴音乐后台管理系统 API");
        response.put("version", "1.0.0");
        response.put("status", "运行中");
        response.put("description", "张艺兴音乐主题网站后台API服务");
        response.put("endpoints", Map.of(
            "API测试", "/api/test",
            "健康检查", "/api/health",
            "管理员登录", "/api/admin/login",
            "管理员验证", "/api/admin/verify",
            "管理员信息", "/api/admin/info"
        ));
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 错误页面处理
     */
    @GetMapping("/error")
    public Map<String, Object> error() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "页面未找到");
        response.put("suggestion", "请访问 /api/test 进行API测试");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
} 