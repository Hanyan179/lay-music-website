package com.hansen.fateEchoes.fate_echoes.vo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

/**
 * 事件历史记录视图对象
 */
@Data
public class EventHistoryVO {

    /**
     * 事件ID
     */
    @JsonProperty("eventId")
    private String eventId;

    /**
     * 选择的选项文本
     */
    @JsonProperty("selectedOption")
    private String selectedOption;

    /**
     * 选择时的年份
     */
    @JsonProperty("year")
    private Integer year;

    /**
     * 选择时间
     */
    @JsonProperty("selectedAt")
    private LocalDateTime selectedAt;
} 