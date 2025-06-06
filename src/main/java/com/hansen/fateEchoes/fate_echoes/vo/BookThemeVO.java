package com.hansen.fateEchoes.fate_echoes.vo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 书籍主题配置视图对象
 */
@Data
public class BookThemeVO {
    
    /**
     * 主题色
     */
    @JsonProperty("primaryColor")
    private String primaryColor;
    
    /**
     * 背景色
     */
    @JsonProperty("backgroundColor")
    private String backgroundColor;
    
    /**
     * 起始年份
     */
    @JsonProperty("startYear")
    private Integer startYear;
    
    /**
     * 结束年份
     */
    @JsonProperty("endYear")
    private Integer endYear;
    
    /**
     * 背景渐变
     */
    @JsonProperty("backgroundGradient")
    private String backgroundGradient;
} 