package com.lay.music.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimelineYearDTO {
    @JsonProperty("year")
    private Integer year;
    
    @JsonProperty("events")
    private List<TimelineEventDTO> events;
} 