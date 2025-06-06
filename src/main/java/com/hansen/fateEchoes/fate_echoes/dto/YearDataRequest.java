package com.hansen.fateEchoes.fate_echoes.dto;

import lombok.Data;
import java.util.List;

/**
 * 年份数据保存请求DTO
 */
@Data
public class YearDataRequest {
    
    /**
     * 书籍ID
     */
    private Long bookId;
    
    /**
     * 年份
     */
    private Integer year;
    
    /**
     * 背景图片
     */
    private String backgroundImage;
    
    /**
     * 背景类型
     */
    private String backgroundType;
    
    /**
     * 年度事件列表
     */
    private List<TimelineEventDTO> events;
    
    /**
     * 人生抉择事件列表
     */
    private List<PersonalChoiceEventDTO> choiceEvents;
} 