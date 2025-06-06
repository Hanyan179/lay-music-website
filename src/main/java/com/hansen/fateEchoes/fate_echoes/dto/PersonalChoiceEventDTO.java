package com.hansen.fateEchoes.fate_echoes.dto;

import lombok.Data;
import java.util.List;

/**
 * 人生抉择事件DTO
 */
@Data
public class PersonalChoiceEventDTO {
    
    /**
     * 事件ID（前端临时ID）
     */
    private Long id;
    
    /**
     * 事件代码
     */
    private String eventCode;
    
    /**
     * 问题
     */
    private String question;
    
    /**
     * 问题描述
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
     * 是否为起始事件
     */
    private Boolean isStartingEvent;
    
    /**
     * 显示顺序
     */
    private Integer displayOrder;
    
    /**
     * 事后描述（用于自定义成功/失败提示文案）
     */
    private String afterDescription;
    
    /**
     * 选项列表
     */
    private List<ChoiceOptionDTO> options;
    
    /**
     * 选择选项DTO
     */
    @Data
    public static class ChoiceOptionDTO {
        
        /**
         * 选项文本
         */
        private String optionText;
        
        /**
         * 影响描述
         */
        private String effect;
        
        /**
         * 下一个事件代码
         */
        private String nextEventCode;
        
        /**
         * 是否进入下一年
         */
        private Boolean isNextYear;
        
        /**
         * 操作类型
         */
        private String actionType;
        
        /**
         * 排序顺序
         */
        private Integer sortOrder;
        
        /**
         * 标签提示
         */
        private List<String> tags;
        
        /**
         * 选项媒体URL
         */
        private String mediaUrl;
        
        /**
         * 选项媒体类型
         */
        private String mediaType;
    }
} 