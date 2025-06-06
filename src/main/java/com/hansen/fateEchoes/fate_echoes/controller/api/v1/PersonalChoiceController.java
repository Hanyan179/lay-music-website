package com.hansen.fateEchoes.fate_echoes.controller.api.v1;

import com.hansen.fateEchoes.fate_echoes.entity.PersonalChoiceEvent;
import com.hansen.fateEchoes.fate_echoes.entity.ChoiceOption;
import com.hansen.fateEchoes.fate_echoes.service.PersonalChoiceService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 人生抉择API控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/personal-choice")
@CrossOrigin(origins = "*")
public class PersonalChoiceController {

    @Autowired
    private PersonalChoiceService personalChoiceService;

    /**
     * 获取书籍的起始事件
     * @param bookId 书籍ID
     * @return 起始事件
     */
    @GetMapping("/starting-event/{bookId}")
    public ResponseEntity<Map<String, Object>> getStartingEvent(@PathVariable Long bookId) {
        try {
            Optional<PersonalChoiceEvent> startingEvent = personalChoiceService.getStartingEvent(bookId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);

            if (startingEvent.isPresent()) {
                PersonalChoiceEvent event = startingEvent.get();
                List<ChoiceOption> options = personalChoiceService.getEventOptions(event.getId());

                response.put("event", event);
                response.put("options", options);
                response.put("hasEvent", true);
            } else {
                response.put("hasEvent", false);
                response.put("message", "没有找到起始事件");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取起始事件失败：书籍ID={}", bookId, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取起始事件失败：" + e.getMessage());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * 根据事件代码获取事件详情
     * @param bookId 书籍ID
     * @param eventCode 事件代码
     * @return 事件详情
     */
    @GetMapping("/event/{bookId}/{eventCode}")
    public ResponseEntity<Map<String, Object>> getEventByCode(@PathVariable Long bookId, @PathVariable String eventCode) {
        try {
            Optional<PersonalChoiceEvent> event = personalChoiceService.getEventByCode(bookId, eventCode);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);

            if (event.isPresent()) {
                PersonalChoiceEvent choiceEvent = event.get();
                List<ChoiceOption> options = personalChoiceService.getEventOptions(choiceEvent.getId());

                response.put("event", choiceEvent);
                response.put("options", options);
                response.put("hasEvent", true);
            } else {
                response.put("hasEvent", false);
                response.put("message", "没有找到事件代码为 " + eventCode + " 的事件");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取事件失败：书籍ID={}，事件代码={}", bookId, eventCode, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取事件失败：" + e.getMessage());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * 根据选择历史获取当前应该发生的事件
     * @param bookId 书籍ID
     * @param choiceHistory 选择历史（多个选择用逗号分隔）
     * @return 当前事件
     */
    @GetMapping("/current-event/{bookId}")
    public ResponseEntity<Map<String, Object>> getCurrentEvent(
            @PathVariable Long bookId,
            @RequestParam(value = "history", required = false) String choiceHistory) {
        try {
            List<String> historyList = null;
            if (choiceHistory != null && !choiceHistory.trim().isEmpty()) {
                historyList = Arrays.asList(choiceHistory.split(","));
            }

            Optional<String> currentEventCode = personalChoiceService.getCurrentEventByHistory(bookId, historyList);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);

            if (currentEventCode.isPresent()) {
                // 获取事件详情
                Optional<PersonalChoiceEvent> event = personalChoiceService.getEventByCode(bookId, currentEventCode.get());

                if (event.isPresent()) {
                    PersonalChoiceEvent choiceEvent = event.get();
                    List<ChoiceOption> options = personalChoiceService.getEventOptions(choiceEvent.getId());

                    response.put("eventCode", currentEventCode.get());
                    response.put("event", choiceEvent);
                    response.put("options", options);
                    response.put("hasEvent", true);
                } else {
                    response.put("hasEvent", false);
                    response.put("message", "事件代码 " + currentEventCode.get() + " 对应的事件不存在");
                }
            } else {
                response.put("hasEvent", false);
                response.put("message", "根据选择历史未找到当前事件");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取当前事件失败：书籍ID={}，选择历史={}", bookId, choiceHistory, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取当前事件失败：" + e.getMessage());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * 获取书籍的所有人生抉择事件概览
     * @param bookId 书籍ID
     * @return 事件概览
     */
    @GetMapping("/all-events/{bookId}")
    public ResponseEntity<Map<String, Object>> getAllChoiceEvents(@PathVariable Long bookId) {
        try {
            List<PersonalChoiceEvent> events = personalChoiceService.getAllChoiceEvents(bookId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            response.put("count", events.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取所有人生抉择事件失败：书籍ID={}", bookId, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取事件列表失败：" + e.getMessage());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
