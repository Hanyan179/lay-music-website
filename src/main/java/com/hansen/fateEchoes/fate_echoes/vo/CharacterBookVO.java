package com.hansen.fateEchoes.fate_echoes.vo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;
import java.util.List;

/**
 * 角色书籍视图对象
 */
@Data
public class CharacterBookVO {

    /**
     * 书籍唯一标识符
     */
    private String id;

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
     * 封面图片（base64或URL）
     */
    private String cover;

    /**
     * 主题配置
     */
    private BookThemeVO theme;

    /**
     * 游玩次数
     */
    @JsonProperty("playCount")
    private Long playCount;

    /**
     * 作者
     */
    @JsonProperty("author")
    private String author;

    /**
     * 点赞次数
     */
    @JsonProperty("likeCount")
    private Long likeCount;

    /**
     * 显示排序
     */
    @JsonProperty("displayOrder")
    private Integer displayOrder;

    /**
     * 个人事件映射（事件ID -> 事件详情）
     */
    @JsonProperty("personalEvents")
    private Map<String, PersonalEventVO> personalEvents;

    /**
     * 当前事件ID
     */
    @JsonProperty("currentEventId")
    private String currentEventId;

    /**
     * 事件历史记录
     */
    @JsonProperty("eventHistory")
    private List<EventHistoryVO> eventHistory;

    /**
     * 是否已上传（发布）
     */
    @JsonProperty("isUploaded")
    private Integer isUploaded;

    /**
     * 是否已完成著作
     */
    @JsonProperty("isCompleted")
    private Integer isCompleted;

    /**
     * 用户token
     */
    @JsonProperty("userToken")
    private String userToken;
}
