package com.fateechoes.entity;

import javax.persistence.*;
import lombok.Data;


/**
 * 事件选项实体类
 */
@Data
@Entity
@Table(name = "options")
public class Option {

    /**
     * 选项唯一ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 所属事件
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    /**
     * 选项描述
     */
    @Column(name = "option_text", nullable = false)
    private String optionText;

    /**
     * 影响文本描述
     */
    @Column(name = "effect", columnDefinition = "TEXT")
    private String effect;

    /**
     * 下一个事件ID
     */
    @Column(name = "next_event_id")
    private String nextEventId;

    /**
     * 是否进入下一年
     */
    @Column(name = "is_next_year", nullable = false)
    private Boolean isNextYear = true;

    /**
     * 操作类型（show/jump）- 保留向后兼容
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "next_type")
    private NextType nextType;

    /**
     * 下一事件名称（显示用）- 保留向后兼容
     */
    @Column(name = "next_event_name")
    private String nextEventName;

    /**
     * 操作类型枚举
     */
    public enum NextType {
        SHOW,
        JUMP
    }
}
