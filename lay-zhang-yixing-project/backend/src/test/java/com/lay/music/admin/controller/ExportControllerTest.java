package com.lay.music.admin.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.io.IOException;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import com.lay.music.service.TimelineExportService;

@SpringBootTest
@AutoConfigureMockMvc
class ExportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TimelineExportService exportService;

    @Test
    void exportTimeline_Success() throws Exception {
        // 模拟导出服务返回路径
        Path mockPath = Path.of("../frontend/public/database/timeline.json");
        when(exportService.exportToStaticJson()).thenReturn(mockPath);

        // 执行测试
        mockMvc.perform(post("/api/admin/export/timeline"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200))
            .andExpect(jsonPath("$.message").value("导出成功"))
            .andExpect(jsonPath("$.data.path").exists())
            .andExpect(jsonPath("$.data.timestamp").exists());
    }

    @Test
    void exportTimeline_Error() throws Exception {
        // 模拟导出服务抛出异常
        when(exportService.exportToStaticJson())
            .thenThrow(new IOException("测试异常"));

        // 执行测试
        mockMvc.perform(post("/api/admin/export/timeline"))
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$.code").value(500))
            .andExpect(jsonPath("$.message").value("导出失败: 测试异常"))
            .andExpect(jsonPath("$.data").isEmpty());
    }
} 