package com.lay.music.dto;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimelineEventDTO {
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("title")
    private String title;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("imagePath")
    private String imagePath;
    
    @JsonProperty("tags")
    private List<String> tags;
    
    @JsonProperty("timestamp")
    private LocalDate timestamp;
} 