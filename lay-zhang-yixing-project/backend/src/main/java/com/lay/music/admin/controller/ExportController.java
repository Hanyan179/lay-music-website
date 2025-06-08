package com.lay.music.admin.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.lay.music.service.TimelineExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/admin/export")
@RequiredArgsConstructor
@Tag(name = "导出管理", description = "时间轴数据导出接口")
public class ExportController {

    private final TimelineExportService exportService;

    @Operation(summary = "导出时间轴数据", description = "将时间轴数据导出为静态JSON文件")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "导出成功"),
        @ApiResponse(responseCode = "500", description = "导出失败")
    })
    @PostMapping("/timeline")
    public ResponseEntity<Map<String, Object>> exportTimeline() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Path exportPath = exportService.exportToStaticJson();
            response.put("code", 200);
            response.put("message", "导出成功");
            response.put("data", Map.of(
                "path", exportPath.toString(),
                "timestamp", System.currentTimeMillis()
            ));
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("导出时间轴数据失败", e);
            response.put("code", 500);
            response.put("message", "导出失败: " + e.getMessage());
            response.put("data", null);
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 
        } catch (IOException e) {
            log.error("导出时间轴数据失败", e);
            response.put("code", 500);
            response.put("message", "导出失败: " + e.getMessage());
            response.put("data", null);
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 