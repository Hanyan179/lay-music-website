package com.hansen.fateEchoes.fate_echoes.controller.api.v1;

import com.fateechoes.dto.EventDTO;
import com.fateechoes.service.EventService;
import com.hansen.fateEchoes.fate_echoes.vo.PersonalEventVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 事件控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = {"*"},
    allowCredentials = "true",
    maxAge = 3600
)
public class EventController {

    @Autowired
    private EventService eventService;

    /**
     * 根据书籍代码获取所有事件
     * @param bookCode 书籍代码
     * @return 事件列表
     */
    @GetMapping("/book/{bookCode}")
    public ResponseEntity<List<EventDTO>> getEventsByBookCode(@PathVariable Long bookCode) {
        try {
            List<EventDTO> events = eventService.getEventsByBookCode(bookCode);
            log.info("成功获取书籍 {} 的 {} 个事件", bookCode, events.size());
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            log.error("获取书籍事件失败: {}", bookCode, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 根据书籍代码获取PersonalEvents映射
     * @param bookCode 书籍代码
     * @return PersonalEvents映射
     */
    @GetMapping("/book/{bookCode}/personal-events")
    public ResponseEntity<Map<String, PersonalEventVO>> getPersonalEventsByBookCode(@PathVariable Long bookCode) {
        try {
            Map<String, PersonalEventVO> personalEvents = eventService.buildPersonalEventsMap(bookCode);
            log.info("成功构建书籍 {} 的 {} 个PersonalEvents", bookCode, personalEvents.size());
            return ResponseEntity.ok(personalEvents);
        } catch (Exception e) {
            log.error("构建PersonalEvents失败: {}", bookCode, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 根据事件名称获取事件详情
     * @param eventName 事件名称
     * @return 事件详情
     */
    @GetMapping("/{eventName}")
    public ResponseEntity<EventDTO> getEventByName(@PathVariable String eventName) {
        try {
            Optional<EventDTO> eventOptional = eventService.getEventByName(eventName);
            if (eventOptional.isPresent()) {
                log.info("成功获取事件详情: {}", eventName);
                return ResponseEntity.ok(eventOptional.get());
            } else {
                log.warn("未找到事件: {}", eventName);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("获取事件详情失败: {}", eventName, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 健康检查接口
     * @return 系统状态
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Events API is running");
    }
} 
