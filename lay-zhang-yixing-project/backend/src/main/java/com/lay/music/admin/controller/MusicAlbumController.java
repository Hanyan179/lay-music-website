package com.lay.music.admin.controller;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 音乐专辑管理控制器
 */
@RestController
@RequestMapping("/api/admin/albums")
public class MusicAlbumController {
    
    // 模拟数据存储
    private static final List<Map<String, Object>> albums = new ArrayList<>();
    
    static {
        // 初始化一些测试数据
        Map<String, Object> album1 = new HashMap<>();
        album1.put("id", "1");
        album1.put("albumTitle", "NAMANANA");
        album1.put("trackCount", 12);
        album1.put("totalDuration", "45:32");
        album1.put("genre", "流行音乐");
        album1.put("releaseYear", 2018);
        album1.put("description", "张艺兴首张个人专辑");
        album1.put("status", 1);
        album1.put("createTime", LocalDateTime.now().toString());
        album1.put("coverImage", "https://example.com/cover1.jpg");
        albums.add(album1);
        
        Map<String, Object> album2 = new HashMap<>();
        album2.put("id", "2");
        album2.put("albumTitle", "蜜蜂");
        album2.put("trackCount", 10);
        album2.put("totalDuration", "38:15");
        album2.put("genre", "R&B");
        album2.put("releaseYear", 2019);
        album2.put("description", "展现多样音乐风格");
        album2.put("status", 1);
        album2.put("createTime", LocalDateTime.now().toString());
        album2.put("coverImage", "https://example.com/cover2.jpg");
        albums.add(album2);
        
        Map<String, Object> album3 = new HashMap<>();
        album3.put("id", "3");
        album3.put("albumTitle", "LIT");
        album3.put("trackCount", 8);
        album3.put("totalDuration", "32:45");
        album3.put("genre", "Hip-Hop");
        album3.put("releaseYear", 2020);
        album3.put("description", "张艺兴全新力作");
        album3.put("status", 1);
        album3.put("createTime", LocalDateTime.now().toString());
        album3.put("coverImage", "https://example.com/cover3.jpg");
        albums.add(album3);
    }
    
    /**
     * 获取专辑列表
     */
    @GetMapping
    public Map<String, Object> getAlbums(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        List<Map<String, Object>> filteredAlbums = new ArrayList<>(albums);
        if (search != null && !search.trim().isEmpty()) {
            filteredAlbums = new ArrayList<>();
            for (Map<String, Object> album : albums) {
                if (album.get("albumTitle").toString().toLowerCase().contains(search.toLowerCase())) {
                    filteredAlbums.add(album);
                }
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "获取专辑列表成功");
        
        Map<String, Object> data = new HashMap<>();
        data.put("list", filteredAlbums);
        data.put("total", filteredAlbums.size());
        data.put("page", page);
        data.put("size", size);
        
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
    
    /**
     * 获取单个专辑详情
     */
    @GetMapping("/{id}")
    public Map<String, Object> getAlbum(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        
        for (Map<String, Object> album : albums) {
            if (id.equals(album.get("id"))) {
                response.put("code", 200);
                response.put("message", "获取专辑详情成功");
                response.put("data", album);
                response.put("timestamp", System.currentTimeMillis());
                return response;
            }
        }
        
        response.put("code", 404);
        response.put("message", "专辑不存在");
        response.put("data", null);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 创建专辑
     */
    @PostMapping
    public Map<String, Object> createAlbum(@RequestBody Map<String, Object> albumData) {
        albumData.put("id", String.valueOf(albums.size() + 1));
        albumData.put("createTime", LocalDateTime.now().toString());
        albumData.put("updateTime", LocalDateTime.now().toString());
        if (!albumData.containsKey("status")) {
            albumData.put("status", 1);
        }
        
        albums.add(albumData);
        
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "专辑创建成功");
        response.put("data", albumData);
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
    
    /**
     * 更新专辑
     */
    @PutMapping("/{id}")
    public Map<String, Object> updateAlbum(@PathVariable String id, @RequestBody Map<String, Object> albumData) {
        Map<String, Object> response = new HashMap<>();
        
        for (int i = 0; i < albums.size(); i++) {
            if (id.equals(albums.get(i).get("id"))) {
                albumData.put("id", id);
                albumData.put("updateTime", LocalDateTime.now().toString());
                albums.set(i, albumData);
                
                response.put("code", 200);
                response.put("message", "专辑更新成功");
                response.put("data", albumData);
                response.put("timestamp", System.currentTimeMillis());
                return response;
            }
        }
        
        response.put("code", 404);
        response.put("message", "专辑不存在");
        response.put("data", null);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 删除专辑
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteAlbum(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        
        boolean removed = albums.removeIf(album -> id.equals(album.get("id")));
        if (removed) {
            response.put("code", 200);
            response.put("message", "专辑删除成功");
            response.put("data", null);
        } else {
            response.put("code", 404);
            response.put("message", "专辑不存在");
            response.put("data", null);
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 批量删除专辑
     */
    @DeleteMapping("/batch")
    public Map<String, Object> batchDeleteAlbums(@RequestBody List<String> albumIds) {
        Map<String, Object> response = new HashMap<>();
        
        int deletedCount = 0;
        for (String id : albumIds) {
            boolean removed = albums.removeIf(album -> id.equals(album.get("id")));
            if (removed) {
                deletedCount++;
            }
        }
        
        response.put("code", 200);
        response.put("message", "批量删除完成，共删除 " + deletedCount + " 个专辑");
        response.put("data", Map.of("deletedCount", deletedCount));
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
    
    /**
     * 更新专辑状态
     */
    @PutMapping("/status/{id}")
    public Map<String, Object> updateAlbumStatus(@PathVariable String id, @RequestParam Integer status) {
        Map<String, Object> response = new HashMap<>();
        
        for (Map<String, Object> album : albums) {
            if (id.equals(album.get("id"))) {
                album.put("status", status);
                album.put("updateTime", LocalDateTime.now().toString());
                
                response.put("code", 200);
                response.put("message", "专辑状态更新成功");
                response.put("data", album);
                response.put("timestamp", System.currentTimeMillis());
                return response;
            }
        }
        
        response.put("code", 404);
        response.put("message", "专辑不存在");
        response.put("data", null);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * 获取专辑统计信息
     */
    @GetMapping("/statistics")
    public Map<String, Object> getAlbumStatistics() {
        Map<String, Object> response = new HashMap<>();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAlbums", albums.size());
        stats.put("activeAlbums", albums.stream().mapToInt(album -> (Integer) album.get("status")).sum());
        stats.put("totalTracks", albums.stream().mapToInt(album -> (Integer) album.get("trackCount")).sum());
        
        response.put("code", 200);
        response.put("message", "获取统计信息成功");
        response.put("data", stats);
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
} 