package com.fateechoes.vo;

import lombok.Data;
import java.util.List;

/**
 * 事件视图对象
 */
@Data
public class EventVO {
    
    /**
     * 事件唯一ID
     */
    private Integer id;

    /**
     * 事件名称
     */
    private String name;

    /**
     * 图片URL
     */
    private String imageUrl;

    /**
     * 事件描述/问题
     */
    private String question;

    /**
     * 事件发生年份
     */
    private Integer year;

    /**
     * 是否为起始事件
     */
    private Boolean isEntry;

    /**
     * 关联的选项列表
     */
    private List<OptionVO> options;
} 