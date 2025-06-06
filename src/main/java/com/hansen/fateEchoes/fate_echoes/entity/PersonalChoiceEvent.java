package com.hansen.fateEchoes.fate_echoes.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "personal_choice_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PersonalChoiceEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_id", nullable = false)
    private Long bookId;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "event_code", nullable = false, unique = true)
    private String eventCode; // 如 "A", "B", "C" 等，用于标识不同的人生抉择

    @Column(name = "question", nullable = false)
    private String question;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // 媒体相关字段
    @Column(name = "media_type")
    private String mediaType; // 'image' or 'video'

    @Column(name = "media_url", columnDefinition = "TEXT")
    private String mediaUrl;

    @Column(name = "media_poster", columnDefinition = "TEXT")
    private String mediaPoster; // 视频缩略图

    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String image; // 向后兼容的图片字段

    @Column(name = "is_starting_event")
    private Boolean isStartingEvent = false; // 是否为起始事件

    @Column(name = "display_order")
    private Integer displayOrder = 0; // 显示顺序

    @Column(name = "after_description", columnDefinition = "TEXT")
    private String afterDescription; // 事后描述（用于自定义成功/失败提示文案）

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 一对多关系：一个人生抉择事件有多个选项
    @OneToMany(mappedBy = "personalChoiceEvent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ChoiceOption> options;

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
