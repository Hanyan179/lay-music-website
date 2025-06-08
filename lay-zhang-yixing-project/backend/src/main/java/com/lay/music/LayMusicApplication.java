package com.lay.music;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * LAY张艺兴音乐网站后台管理系统启动类
 */
@SpringBootApplication
public class LayMusicApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(LayMusicApplication.class, args);
        System.out.println("==============================================");
        System.out.println("LAY张艺兴音乐后台管理系统启动成功！");
        System.out.println("访问地址：http://localhost:8080");
        System.out.println("==============================================");
    }
} 