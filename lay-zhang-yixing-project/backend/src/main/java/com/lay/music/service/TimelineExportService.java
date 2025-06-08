package com.lay.music.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lay.music.dto.TimelineEventDTO;
import com.lay.music.dto.TimelineYearDTO;
import com.lay.music.entity.TimelineYear;
import com.lay.music.repository.TimelineYearRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimelineExportService {

    private final TimelineYearRepository yearRepository;
    
    @Value("${export.frontend-dir}")
    private String frontendDir;
    
    @Value("${export.image-prefix}")
    private String imagePrefix;

    public Path exportToStaticJson() throws IOException {
        log.info("开始导出时间轴数据到静态JSON文件...");
        
        // 查询所有年份及其事件
        List<TimelineYear> years = yearRepository.findAllWithEvents();
        
        // 转换为DTO格式
        List<TimelineYearDTO> exportData = years.stream()
            .map(year -> TimelineYearDTO.builder()
                .year(year.getYear())
                .events(year.getEvents().stream()
                    .map(event -> TimelineEventDTO.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .description(event.getDescription())
                        .imagePath(event.getImageName() != null ? 
                            imagePrefix + event.getImageName() : null)
                        .tags(event.getTags() != null ? 
                            Arrays.asList(event.getTags().split(",")) : List.of())
                        .timestamp(event.getEventDate())
                        .build())
                    .collect(Collectors.toList()))
                .build())
            .collect(Collectors.toList());

        // 配置ObjectMapper
        ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .enable(SerializationFeature.INDENT_OUTPUT);

        // 创建目标目录
        Path exportPath = Path.of(frontendDir, "public", "database", "timeline.json");
        Files.createDirectories(exportPath.getParent());

        // 写入文件
        mapper.writeValue(exportPath.toFile(), exportData);
        
        long fileSize = Files.size(exportPath);
        log.info("时间轴数据导出完成，文件大小: {} KB，路径: {}", fileSize / 1024, exportPath);
        
        return exportPath;
    }
} 