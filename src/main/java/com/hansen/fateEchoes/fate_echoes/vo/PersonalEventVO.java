package com.hansen.fateEchoes.fate_echoes.vo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * 个人事件视图对象
 */
@Data
public class PersonalEventVO {

    /**
     * 事件问题/标题
     */
    @JsonProperty("question")
    private String question;

    /**
     * 事件描述
     */
    @JsonProperty("description")
    private String description;

    /**
     * 事件选项列表
     */
    @JsonProperty("options")
    private List<EventOptionVO> options;

    /**
     * 媒体内容（可选）
     */
    @JsonProperty("media")
    private EventMediaVO media;
} 