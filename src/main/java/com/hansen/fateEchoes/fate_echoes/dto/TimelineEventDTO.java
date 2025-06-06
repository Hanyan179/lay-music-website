package com.hansen.fateEchoes.fate_echoes.dto;

import lombok.Data;
import java.util.List;

/**
 * 年度事件DTO
 */
@Data
public class TimelineEventDTO {
    
    /**
     * 事件ID（前端临时ID）
     */
    private Long id;
    
    /**
     * 事件标题
     */
    private String title;
    
    /**
     * 事件描述
     */
    private String description;
    
    /**
     * 媒体类型
     */
    private String mediaType;
    
    /**
     * 媒体URL
     */
    private String mediaUrl;
    
    /**
     * 媒体缩略图
     */
    private String mediaPoster;
    
    /**
     * 影响等级
     */
    private String impact;
    
    /**
     * 标签列表
     */
    private List<String> tags;
    
    /**
     * 显示顺序
     */
    private Integer displayOrder;
    
    /**
     * 日期描述（前端显示用）
     */
    private String date;
} 