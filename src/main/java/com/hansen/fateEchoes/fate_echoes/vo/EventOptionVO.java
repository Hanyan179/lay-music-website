package com.hansen.fateEchoes.fate_echoes.vo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 事件选项视图对象
 */
@Data
public class EventOptionVO {

    /**
     * 选项文本
     */
    @JsonProperty("text")
    private String text;

    /**
     * 选择后果描述
     */
    @JsonProperty("consequence")
    private String consequence;

    /**
     * 下一个事件ID
     */
    @JsonProperty("nextEventId")
    private String nextEventId;

    /**
     * 是否进入下一年
     */
    @JsonProperty("is_next_year")
    private Boolean isNextYear;
} 