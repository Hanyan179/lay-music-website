package com.hansen.fateEchoes.fate_echoes.vo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 事件媒体内容视图对象
 */
@Data
public class EventMediaVO {

    /**
     * 媒体类型：image, video
     */
    @JsonProperty("type")
    private String type;

    /**
     * 媒体URL路径
     */
    @JsonProperty("url")
    private String url;

    /**
     * 视频封面图（可选，仅视频类型）
     */
    @JsonProperty("poster")
    private String poster;
} 