package com.fateechoes.vo;

import com.fateechoes.entity.Option.NextType;
import lombok.Data;

/**
 * 选项视图对象
 */
@Data
public class OptionVO {
    
    /**
     * 选项唯一ID
     */
    private Integer id;

    /**
     * 选项描述
     */
    private String optionText;

    /**
     * 影响文本描述
     */
    private String effect;

    /**
     * 操作类型（show/jump）
     */
    private NextType nextType;

    /**
     * 下一事件名称（显示用）
     */
    private String nextEventName;
} 