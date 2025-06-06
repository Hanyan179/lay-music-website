package com.hansen.fateEchoes.fate_echoes.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "choice_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ChoiceOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "choice_event_id", nullable = false)
    private Long choiceEventId;
    
    @Column(name = "option_text", nullable = false)
    private String optionText; // 选项描述文本
    
    @Column(name = "effect", columnDefinition = "TEXT")
    private String effect; // 选择后果描述
    
    @Column(name = "next_event_code")
    private String nextEventCode; // 下一个人生抉择事件的代码（如 "B", "C"）
    
    @Column(name = "is_next_year")
    private Boolean isNextYear = false; // 是否进入下一年
    
    @Column(name = "action_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ActionType actionType = ActionType.SHOW_EFFECT; // 操作类型
    
    @Column(name = "sort_order")
    private Integer sortOrder = 0; // 排序
    
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // 标签提示（JSON格式）
    
    @Column(name = "media_url")
    private String mediaUrl; // 选项媒体文件URL
    
    @Column(name = "media_type")
    private String mediaType; // 媒体类型（image/video）
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 多对一关系：多个选项属于一个人生抉择事件
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "choice_event_id", insertable = false, updatable = false)
    private PersonalChoiceEvent personalChoiceEvent;
    
    /**
     * 操作类型枚举
     */
    public enum ActionType {
        SHOW_EFFECT,    // 显示影响描述，返回当前页面
        JUMP_TO_NEXT    // 跳转到下一个事件
    }
    
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