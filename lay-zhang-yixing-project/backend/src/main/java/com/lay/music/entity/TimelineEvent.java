package com.lay.music.entity;

import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "timeline_event")
@SuppressWarnings("all") // 抑制Lombok生成的代码的警告
public class TimelineEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 120, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_name", length = 120)
    private String imageName;

    @Column(length = 255)
    private String tags;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "year_id", nullable = false)
    private TimelineYear year;
} 
    @JoinColumn(name = "year_id", nullable = false)
    private TimelineYear year;
} 