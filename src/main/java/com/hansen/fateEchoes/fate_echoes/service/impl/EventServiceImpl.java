package com.hansen.fateEchoes.fate_echoes.service.impl;

import com.fateechoes.dto.EventDTO;
import com.fateechoes.dto.OptionDTO;
import com.fateechoes.entity.Event;
import com.fateechoes.entity.Option;
import com.fateechoes.repository.EventRepository;
import com.hansen.fateEchoes.fate_echoes.service.EventService;
import com.hansen.fateEchoes.fate_echoes.vo.EventOptionVO;
import com.hansen.fateEchoes.fate_echoes.vo.PersonalEventVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 事件服务实现类
 */
@Slf4j
@Service
public class EventServiceImpl implements EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Override
    public List<EventDTO> getEventsByBookCode(String bookCode) {
        List<Event> events = eventRepository.findByBookCodeOrderByYearAsc(bookCode);
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<EventDTO> getEventByName(String eventName) {
        Optional<Event> eventOptional = eventRepository.findByName(eventName);
        return eventOptional.map(this::convertToDTO);
    }
    
    @Override
    public Map<String, PersonalEventVO> buildPersonalEventsMap(String bookCode) {
        List<Event> events = eventRepository.findByBookCodeOrderByYearAsc(bookCode);
        Map<String, PersonalEventVO> personalEventsMap = new HashMap<>();
        
        for (Event event : events) {
            PersonalEventVO personalEvent = convertToPersonalEventVO(event);
            personalEventsMap.put(event.getName(), personalEvent);
        }
        
        log.info("为书籍 {} 构建了 {} 个事件的PersonalEvents映射", bookCode, personalEventsMap.size());
        return personalEventsMap;
    }
    
    @Override
    public String getStartingEventId(String bookCode) {
        List<Event> entryEvents = eventRepository.findByBookCodeAndIsEntryTrueOrderByYearAsc(bookCode);
        if (!entryEvents.isEmpty()) {
            return entryEvents.get(0).getName();
        }
        
        // 如果没有标记为起始事件的，返回第一个事件
        List<Event> allEvents = eventRepository.findByBookCodeOrderByYearAsc(bookCode);
        if (!allEvents.isEmpty()) {
            return allEvents.get(0).getName();
        }
        
        log.warn("书籍 {} 没有找到任何事件", bookCode);
        return null;
    }
    
    /**
     * 将Event实体转换为EventDTO
     */
    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setImage(event.getImage());
        dto.setQuestion(event.getQuestion());
        dto.setDescription(event.getDescription());
        dto.setYear(event.getYear());
        dto.setBookCode(event.getBookCode());
        dto.setIsEntry(event.getIsEntry());
        
        // 转换选项
        if (event.getOptions() != null) {
            List<OptionDTO> optionDTOs = event.getOptions().stream()
                    .map(this::convertOptionToDTO)
                    .collect(Collectors.toList());
            dto.setOptions(optionDTOs);
        }
        
        return dto;
    }
    
    /**
     * 将Option实体转换为OptionDTO
     */
    private OptionDTO convertOptionToDTO(Option option) {
        OptionDTO dto = new OptionDTO();
        dto.setId(option.getId());
        dto.setEventId(option.getEvent().getId());
        dto.setOptionText(option.getOptionText());
        dto.setEffect(option.getEffect());
        dto.setNextEventId(option.getNextEventId());
        dto.setIsNextYear(option.getIsNextYear());
        dto.setNextType(option.getNextType());
        dto.setNextEventName(option.getNextEventName());
        return dto;
    }
    
    /**
     * 将Event实体转换为PersonalEventVO（用于前端）
     */
    private PersonalEventVO convertToPersonalEventVO(Event event) {
        PersonalEventVO personalEvent = new PersonalEventVO();
        personalEvent.setQuestion(event.getQuestion());
        personalEvent.setDescription(event.getDescription());
        
        // 转换选项为EventOptionVO
        if (event.getOptions() != null) {
            List<EventOptionVO> eventOptions = event.getOptions().stream()
                    .map(this::convertToEventOptionVO)
                    .collect(Collectors.toList());
            personalEvent.setOptions(eventOptions);
        }
        
        // 暂时不设置媒体内容，后续可根据需要扩展
        personalEvent.setMedia(null);
        
        return personalEvent;
    }
    
    /**
     * 将Option实体转换为EventOptionVO（用于前端）
     */
    private EventOptionVO convertToEventOptionVO(Option option) {
        EventOptionVO eventOption = new EventOptionVO();
        eventOption.setText(option.getOptionText());
        eventOption.setConsequence(option.getEffect());
        eventOption.setNextEventId(option.getNextEventId());
        eventOption.setIsNextYear(option.getIsNextYear());
        return eventOption;
    }
} 