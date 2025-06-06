package com.hansen.fateEchoes.fate_echoes.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "timeline_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TimelineEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "book_id", nullable = false)
    private Long bookId;
    
    @Column(name = "year", nullable = false)
    private Integer year;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // 媒体相关字段
    @Column(name = "media_type", length = 20)
    private String mediaType; // 'image' or 'video'
    
    @Column(name = "media_url", columnDefinition = "TEXT")
    private String mediaUrl;
    
    @Column(name = "media_poster", columnDefinition = "TEXT")
    private String mediaPoster; // 视频缩略图
    
    // 事件属性
    @Column(name = "impact", length = 20)
    private String impact = "中等"; // 影响等级：低, 中等, 高, 极高
    
    @Column(name = "tags", columnDefinition = "JSON")
    private String tags; // 事件标签数组（JSON格式）
    
    @Column(name = "display_order")
    private Integer displayOrder = 0; // 显示顺序
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 多对一关系：多个年度事件属于一本书
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", insertable = false, updatable = false)
    private CharacterBook characterBook;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 