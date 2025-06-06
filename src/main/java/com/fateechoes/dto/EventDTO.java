package com.fateechoes.dto;

import lombok.Data;
import java.util.List;

/**
 * 事件数据传输对象
 */
@Data
public class EventDTO {
    
    /**
     * 事件唯一ID
     */
    private Integer id;

    /**
     * 事件名称
     */
    private String name;

    /**
     * 图片存储路径
     */
    private String image;

    /**
     * 事件描述/问题
     */
    private String question;

    /**
     * 事件详细描述
     */
    private String description;

    /**
     * 事件发生年份
     */
    private Integer year;

    /**
     * 关联的书籍代码
     */
    private Long bookCode;

    /**
     * 是否为起始事件
     */
    private Boolean isEntry;

    /**
     * 关联的选项列表
     */
    private List<OptionDTO> options;
} 
