package com.hansen.fateEchoes.fate_echoes.service;

import com.fateechoes.dto.EventDTO;
import com.fateechoes.entity.Event;
import com.hansen.fateEchoes.fate_echoes.vo.PersonalEventVO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 事件服务接口
 */
public interface EventService {
    
    /**
     * 根据书籍代码获取所有事件
     * @param bookCode 书籍代码
     * @return 事件列表
     */
    List<EventDTO> getEventsByBookCode(String bookCode);
    
    /**
     * 根据事件名称获取事件详情
     * @param eventName 事件名称
     * @return 事件详情
     */
    Optional<EventDTO> getEventByName(String eventName);
    
    /**
     * 根据书籍代码构建PersonalEvents映射
     * @param bookCode 书籍代码
     * @return PersonalEvents映射（事件ID -> PersonalEventVO）
     */
    Map<String, PersonalEventVO> buildPersonalEventsMap(String bookCode);
    
    /**
     * 根据书籍代码获取起始事件ID
     * @param bookCode 书籍代码
     * @return 起始事件ID
     */
    String getStartingEventId(String bookCode);
} 