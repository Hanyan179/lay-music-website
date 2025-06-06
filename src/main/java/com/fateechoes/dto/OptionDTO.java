package com.fateechoes.dto;

import com.fateechoes.entity.Option.NextType;
import lombok.Data;

/**
 * 选项数据传输对象
 */
@Data
public class OptionDTO {
    
    /**
     * 选项唯一ID
     */
    private Integer id;

    /**
     * 所属事件ID
     */
    private Integer eventId;

    /**
     * 选项描述
     */
    private String optionText;

    /**
     * 影响文本描述
     */
    private String effect;

    /**
     * 下一个事件ID
     */
    private String nextEventId;

    /**
     * 是否进入下一年
     */
    private Boolean isNextYear;

    /**
     * 操作类型（show/jump）- 保留向后兼容
     */
    private NextType nextType;

    /**
     * 下一事件名称（显示用）- 保留向后兼容
     */
    private String nextEventName;
} 