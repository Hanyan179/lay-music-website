package com.hansen.fateEchoes.fate_echoes.controller.api.v1;

import com.hansen.fateEchoes.fate_echoes.entity.TimelineEvent;
import com.hansen.fateEchoes.fate_echoes.entity.PersonalChoiceEvent;
import com.hansen.fateEchoes.fate_echoes.entity.ChoiceOption;
import com.hansen.fateEchoes.fate_echoes.repository.TimelineEventRepository;
import com.hansen.fateEchoes.fate_echoes.repository.PersonalChoiceEventRepository;
import com.hansen.fateEchoes.fate_echoes.repository.ChoiceOptionRepository;
import com.hansen.fateEchoes.fate_echoes.dto.YearDataRequest;
import com.hansen.fateEchoes.fate_echoes.dto.TimelineEventDTO;
import com.hansen.fateEchoes.fate_echoes.dto.PersonalChoiceEventDTO;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * 时间线编辑器API控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/timeline-editor")
@CrossOrigin(
        origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = {"*"},
        allowCredentials = "true",
        maxAge = 3600
)
public class TimelineEditorController {

    @Autowired
    private TimelineEventRepository timelineEventRepository;

    @Autowired
    private PersonalChoiceEventRepository personalChoiceEventRepository;

    @Autowired
    private ChoiceOptionRepository choiceOptionRepository;

    /**
     * 保存指定年份的数据
     * @param request 年份数据请求
     * @return 保存结果
     */
    @PostMapping("/save-year")
    @Transactional
    public ResponseEntity<Map<String, Object>> saveYearData(@RequestBody YearDataRequest request) {
        try {
            log.info("开始保存书籍 {} 的 {} 年数据", request.getBookId(), request.getYear());

            // 删除现有的年度事件和人生抉择事件
            timelineEventRepository.deleteByBookIdAndYear(request.getBookId(), request.getYear());
            personalChoiceEventRepository.deleteByBookIdAndYear(request.getBookId(), request.getYear());
            // 关键修复：强制刷新，确保删除操作同步到数据库
            timelineEventRepository.flush();
            personalChoiceEventRepository.flush();
            int savedEventCount = 0;
            int savedChoiceCount = 0;

            // 保存年度事件
            if (request.getEvents() != null && !request.getEvents().isEmpty()) {
                for (TimelineEventDTO eventDTO : request.getEvents()) {
                    TimelineEvent event = convertToTimelineEvent(eventDTO, request.getBookId(), request.getYear());
                    timelineEventRepository.save(event);
                    savedEventCount++;
                }
            }

            // 保存人生抉择事件
            if (request.getChoiceEvents() != null && !request.getChoiceEvents().isEmpty()) {
                for (int i = 0; i < request.getChoiceEvents().size(); i++) {
                    PersonalChoiceEventDTO choiceDTO = request.getChoiceEvents().get(i);
                    
                    // 如果事件代码为空，自动生成唯一代码
                    if (choiceDTO.getEventCode() == null || choiceDTO.getEventCode().trim().isEmpty()) {
                        choiceDTO.setEventCode("AUTO_" + request.getYear() + "_" + (i + 1));
                    }
                    
                    // 保存人生抉择事件
                    PersonalChoiceEvent choiceEvent = convertToPersonalChoiceEvent(choiceDTO, request.getBookId(), request.getYear());
                    PersonalChoiceEvent savedChoice = personalChoiceEventRepository.save(choiceEvent);

                    // 保存选项
                    if (choiceDTO.getOptions() != null && !choiceDTO.getOptions().isEmpty()) {
                        for (int j = 0; j < choiceDTO.getOptions().size(); j++) {
                            PersonalChoiceEventDTO.ChoiceOptionDTO optionDTO = choiceDTO.getOptions().get(j);
                            ChoiceOption option = new ChoiceOption();
                            option.setChoiceEventId(savedChoice.getId());
                            option.setOptionText(optionDTO.getOptionText());
                            option.setEffect(optionDTO.getEffect());
                            option.setNextEventCode(optionDTO.getNextEventCode());
                            option.setIsNextYear(optionDTO.getIsNextYear());
                            option.setActionType(ChoiceOption.ActionType.valueOf(optionDTO.getActionType()));
                            option.setTags(convertTagsToJson(optionDTO.getTags()));
                            option.setSortOrder(j);
                            option.setMediaUrl(optionDTO.getMediaUrl());
                            option.setMediaType(optionDTO.getMediaType());
                            choiceOptionRepository.save(option);
                        }
                    }
                    savedChoiceCount++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", String.format("成功保存 %d 个年度事件和 %d 个人生抉择事件", savedEventCount, savedChoiceCount));
            response.put("year", request.getYear());
            response.put("eventCount", savedEventCount);
            response.put("choiceCount", savedChoiceCount);

            log.info("成功保存书籍 {} 的 {} 年数据：{} 个年度事件，{} 个人生抉择事件",
                     request.getBookId(), request.getYear(), savedEventCount, savedChoiceCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("保存年份数据失败：书籍ID={}, 年份={}", request.getBookId(), request.getYear(), e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "保存失败：" + e.getMessage());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * 加载指定年份的数据
     * @param bookId 书籍ID
     * @param year 年份
     * @return 年份数据
     */
    @GetMapping("/load-year/{bookId}/{year}")
    public ResponseEntity<Map<String, Object>> loadYearData(@PathVariable Long bookId, @PathVariable Integer year) {
        try {
            // 查询年度事件
            List<TimelineEvent> timelineEvents = timelineEventRepository.findByBookIdAndYearOrderByDisplayOrderAsc(bookId, year);
            
            // 转换为DTO
            List<TimelineEventDTO> eventDTOs = timelineEvents.stream()
                    .map(this::convertToTimelineEventDTO)
                    .collect(java.util.stream.Collectors.toList());

            // 查询人生抉择事件
            List<PersonalChoiceEvent> choiceEvents = personalChoiceEventRepository.findByBookIdAndYearOrderByDisplayOrderAsc(bookId, year);

            // 转换为DTO并加载选项
            List<PersonalChoiceEventDTO> choiceEventDTOs = choiceEvents.stream()
                    .map(choiceEvent -> {
                        PersonalChoiceEventDTO dto = convertToPersonalChoiceEventDTO(choiceEvent);
                        
                        // 为每个人生抉择事件加载选项
                        List<ChoiceOption> options = choiceOptionRepository.findByChoiceEventIdOrderBySortOrderAsc(choiceEvent.getId());
                        List<PersonalChoiceEventDTO.ChoiceOptionDTO> optionDTOs = options.stream()
                                .map(this::convertToChoiceOptionDTO)
                                .collect(java.util.stream.Collectors.toList());
                        dto.setOptions(optionDTOs);
                        
                        return dto;
                    })
                    .collect(java.util.stream.Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("year", year);
            response.put("events", eventDTOs);
            response.put("choiceEvents", choiceEventDTOs);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("加载年份数据失败：书籍ID={}, 年份={}", bookId, year, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "加载失败：" + e.getMessage());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * 获取书籍的所有年份数据概览
     * @param bookId 书籍ID
     * @return 年份概览数据
     */
    @GetMapping("/year-summary/{bookId}")
    public ResponseEntity<Map<String, Object>> getYearSummary(@PathVariable Long bookId) {
        try {
            // 获取有事件的年份
            List<Integer> timelineYears = timelineEventRepository.findDistinctYearsByBookId(bookId);
            List<Integer> choiceYears = personalChoiceEventRepository.findDistinctYearsByBookId(bookId);

            // 统计每年的事件数量
            Map<Integer, Integer> eventCounts = new HashMap<>();
            Map<Integer, Integer> choiceCounts = new HashMap<>();

            for (Integer year : timelineYears) {
                eventCounts.put(year, (int) timelineEventRepository.countByBookIdAndYear(bookId, year));
            }

            for (Integer year : choiceYears) {
                choiceCounts.put(year, (int) personalChoiceEventRepository.countByBookIdAndYear(bookId, year));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("timelineYears", timelineYears);
            response.put("choiceYears", choiceYears);
            response.put("eventCounts", eventCounts);
            response.put("choiceCounts", choiceCounts);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取年份概览失败：书籍ID={}", bookId, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取年份概览失败：" + e.getMessage());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // 转换DTO到实体的辅助方法
    private TimelineEvent convertToTimelineEvent(TimelineEventDTO dto, Long bookId, Integer year) {
        TimelineEvent event = new TimelineEvent();
        event.setBookId(bookId);
        event.setYear(year);
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setMediaType(dto.getMediaType());
        event.setMediaUrl(dto.getMediaUrl());
        event.setMediaPoster(dto.getMediaPoster());
        event.setImpact(dto.getImpact());
        event.setTags(convertTagsToJson(dto.getTags()));
        event.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        return event;
    }

    private PersonalChoiceEvent convertToPersonalChoiceEvent(PersonalChoiceEventDTO dto, Long bookId, Integer year) {
        PersonalChoiceEvent event = new PersonalChoiceEvent();
        event.setBookId(bookId);
        event.setYear(year);
        event.setEventCode(dto.getEventCode());
        event.setQuestion(dto.getQuestion());
        event.setDescription(dto.getDescription());
        event.setMediaType(dto.getMediaType());
        event.setMediaUrl(dto.getMediaUrl());
        event.setMediaPoster(dto.getMediaPoster());
        event.setIsStartingEvent(dto.getIsStartingEvent() != null ? dto.getIsStartingEvent() : false);
        event.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        event.setAfterDescription(dto.getAfterDescription());
        return event;
    }

    // 转换实体到DTO的辅助方法
    private TimelineEventDTO convertToTimelineEventDTO(TimelineEvent entity) {
        TimelineEventDTO dto = new TimelineEventDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setMediaType(entity.getMediaType());
        dto.setMediaUrl(entity.getMediaUrl());
        dto.setMediaPoster(entity.getMediaPoster());
        dto.setImpact(entity.getImpact());
        dto.setTags(convertJsonToTags(entity.getTags()));
        dto.setDisplayOrder(entity.getDisplayOrder());
        return dto;
    }

    private PersonalChoiceEventDTO convertToPersonalChoiceEventDTO(PersonalChoiceEvent entity) {
        PersonalChoiceEventDTO dto = new PersonalChoiceEventDTO();
        dto.setId(entity.getId());
        dto.setEventCode(entity.getEventCode());
        dto.setQuestion(entity.getQuestion());
        dto.setDescription(entity.getDescription());
        dto.setMediaType(entity.getMediaType());
        dto.setMediaUrl(entity.getMediaUrl());
        dto.setMediaPoster(entity.getMediaPoster());
        dto.setIsStartingEvent(entity.getIsStartingEvent());
        dto.setDisplayOrder(entity.getDisplayOrder());
        dto.setAfterDescription(entity.getAfterDescription());
        return dto;
    }

    private PersonalChoiceEventDTO.ChoiceOptionDTO convertToChoiceOptionDTO(ChoiceOption entity) {
        PersonalChoiceEventDTO.ChoiceOptionDTO dto = new PersonalChoiceEventDTO.ChoiceOptionDTO();
        dto.setOptionText(entity.getOptionText());
        dto.setEffect(entity.getEffect());
        dto.setNextEventCode(entity.getNextEventCode());
        dto.setIsNextYear(entity.getIsNextYear());
        dto.setActionType(entity.getActionType().name());
        dto.setTags(convertJsonToTags(entity.getTags()));
        dto.setSortOrder(entity.getSortOrder());
        dto.setMediaUrl(entity.getMediaUrl());
        dto.setMediaType(entity.getMediaType());
        return dto;
    }

    private String convertTagsToJson(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return null;
        }
        try {
            return "[\"" + String.join("\", \"", tags) + "\"]";
        } catch (Exception e) {
            log.warn("转换标签为JSON失败", e);
            return null;
        }
    }

    private List<String> convertJsonToTags(String tagsJson) {
        if (tagsJson == null || tagsJson.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        try {
            // 简单的JSON数组解析
            String trimmed = tagsJson.trim();
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                String content = trimmed.substring(1, trimmed.length() - 1);
                if (content.trim().isEmpty()) {
                    return java.util.Collections.emptyList();
                }
                return java.util.Arrays.stream(content.split(","))
                        .map(tag -> tag.trim().replaceAll("\"", ""))
                        .filter(tag -> !tag.isEmpty())
                        .collect(java.util.stream.Collectors.toList());
            }
            return java.util.Collections.emptyList();
        } catch (Exception e) {
            log.warn("转换JSON为标签失败", e);
            return java.util.Collections.emptyList();
        }
    }
}
