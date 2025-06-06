package com.hansen.fateEchoes.fate_echoes.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 角色书籍数据传输对象
 */
@Data
public class CharacterBookDTO {

    /**
     * 书籍ID
     */
    private Long id;

    /**
     * 书籍唯一标识符
     */
    @JsonProperty("book_code")
    private Long bookCode;

    /**
     * 书籍标题
     */
    private String title;

    /**
     * 书籍副标题
     */
    private String subtitle;

    /**
     * 书籍描述
     */
    private String description;

    /**
     * 封面图片存储路径
     */
    @JsonProperty("cover_image_path")
    private String coverImagePath;

    /**
     * 封面图片base64数据
     */
    @JsonProperty("cover_image_data")
    private String coverImageData;

    /**
     * 主题配置JSON数据
     */
    @JsonProperty("theme_config")
    private String themeConfig;

    /**
     * 故事起始年份
     */
    @JsonProperty("start_year")
    private Integer startYear;

    /**
     * 故事结束年份
     */
    @JsonProperty("end_year")
    private Integer endYear;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 显示排序
     */
    @JsonProperty("display_order")
    private Integer displayOrder;

    /**
     * 游玩次数
     */
    @JsonProperty("play_count")
    private Long playCount;

    /**
     * 作者
     */
    @JsonProperty("author")
    private String author;

    /**
     * 点赞次数
     */
    @JsonProperty("like_count")
    private Long likeCount;

    /**
     * 个人事件配置JSON数据
     */
    @JsonProperty("personal_events_config")
    private String personalEventsConfig;

//    /**
//     * 当前事件ID
//     */
//    @JsonProperty("current_event_id")
//    private String currentEventId;

//    /**
//     * 事件历史记录JSON数据
//     */
//    @JsonProperty("event_history")
//    private String eventHistory;
}
