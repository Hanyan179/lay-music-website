package com.hansen.fateEchoes.fate_echoes.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 角色书籍实体类
 */
@Data
@Entity
@Table(name = "character_books")
public class CharacterBook {
    
    /**
     * 书籍ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 书籍唯一标识符
     */
    @Column(name = "book_code", nullable = false, unique = true, length = 50)
    private String bookCode;
    
    /**
     * 书籍标题
     */
    @Column(name = "title", nullable = false, length = 100)
    private String title;
    
    /**
     * 书籍副标题
     */
    @Column(name = "subtitle", length = 200)
    private String subtitle;
    
    /**
     * 书籍描述
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    /**
     * 封面图片存储路径
     */
    @Column(name = "cover_image_path", length = 500)
    private String coverImagePath;
    
    /**
     * 封面图片base64数据
     */
    @Column(name = "cover_image_data", columnDefinition = "LONGTEXT")
    private String coverImageData;
    
    /**
     * 主题配置JSON数据
     */
    @Column(name = "theme_config", columnDefinition = "JSON")
    private String themeConfig;
    
    /**
     * 故事起始年份
     */
    @Column(name = "start_year", nullable = false)
    private Integer startYear = 1995;
    
    /**
     * 故事结束年份
     */
    @Column(name = "end_year", nullable = false)
    private Integer endYear = 2025;
    
    /**
     * 状态：0-禁用，1-启用
     */
    @Column(name = "status", nullable = false)
    private Integer status = 1;
    
    /**
     * 显示排序
     */
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
    
    /**
     * 游玩次数
     */
    @Column(name = "play_count")
    private Long playCount = 0L;
    
    /**
     * 点赞次数
     */
    @Column(name = "like_count")
    private Long likeCount = 0L;
    
    /**
     * 个人事件配置JSON数据
     */
    @Column(name = "personal_events_config", columnDefinition = "JSON")
    private String personalEventsConfig;
    
    /**
     * 当前事件ID
     */
    @Column(name = "current_event_id", length = 100)
    private String currentEventId;
    
    /**
     * 事件历史记录JSON数据
     */
    @Column(name = "event_history", columnDefinition = "JSON")
    private String eventHistory;
    
    /**
     * 作者
     */
    @Column(name = "author", length = 100)
    private String author;
    
    /**
     * 创建时间
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * 创建者
     */
    @Column(name = "created_by", length = 50)
    private String createdBy;
    
    /**
     * 更新者
     */
    @Column(name = "updated_by", length = 50)
    private String updatedBy;
    
    /**
     * 是否已上传（发布）：0-未上传，1-已上传
     */
    @Column(name = "is_uploaded", nullable = false)
    private Integer isUploaded = 0;
    
    /**
     * 是否已完成著作：0-未完成，1-已完成
     */
    @Column(name = "is_completed", nullable = false)
    private Integer isCompleted = 0;
    
    /**
     * 用户token（浏览器生成的唯一标识）
     */
    @Column(name = "user_token", length = 100)
    private String userToken;
} 