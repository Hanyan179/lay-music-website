package com.lay.music.config;

import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import com.lay.music.entity.TimelineEvent;
import com.lay.music.entity.TimelineYear;
import com.lay.music.repository.TimelineYearRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class TimelineDataLoader {

    private final TimelineYearRepository yearRepository;

    @Bean
    @Profile("!prod") // 仅在非生产环境加载示例数据
    public CommandLineRunner loadTimelineData() {
        return args -> {
            log.info("开始加载时间轴示例数据...");
            
            // 2016年数据
            TimelineYear year2016 = new TimelineYear();
            year2016.setYear(2016);
            
            TimelineEvent event1 = new TimelineEvent();
            event1.setTitle("《LOSE CONTROL》专辑发布");
            event1.setDescription("张艺兴首张个人专辑《LOSE CONTROL》正式发布，收录了《LOSE CONTROL》《What U need?》等6首歌曲。");
            event1.setImageName("2016_album.webp");
            event1.setTags("音乐,专辑,首张专辑");
            event1.setEventDate(LocalDate.of(2016, 10, 28));
            event1.setYear(year2016);
            
            TimelineEvent event2 = new TimelineEvent();
            event2.setTitle("《LOSE CONTROL》销量突破100万");
            event2.setDescription("《LOSE CONTROL》专辑销量突破100万张，成为首位在韩国发行个人专辑销量破百万的中国歌手。");
            event2.setImageName("2016_album_sales.webp");
            event2.setTags("音乐,销量,里程碑");
            event2.setEventDate(LocalDate.of(2016, 12, 15));
            event2.setYear(year2016);
            
            year2016.setEvents(List.of(event1, event2));
            
            // 2017年数据
            TimelineYear year2017 = new TimelineYear();
            year2017.setYear(2017);
            
            TimelineEvent event3 = new TimelineEvent();
            event3.setTitle("《SHEEP》专辑发布");
            event3.setDescription("第二张个人专辑《SHEEP》发布，收录了《SHEEP》《I NEED U》等10首歌曲。");
            event3.setImageName("2017_album.webp");
            event3.setTags("音乐,专辑,第二张专辑");
            event3.setEventDate(LocalDate.of(2017, 10, 7));
            event3.setYear(year2017);
            
            TimelineEvent event4 = new TimelineEvent();
            event4.setTitle("《SHEEP》获得多个音乐奖项");
            event4.setDescription("《SHEEP》专辑获得多个音乐奖项，包括最佳专辑、最佳制作人等。");
            event4.setImageName("2017_awards.webp");
            event4.setTags("音乐,奖项,成就");
            event4.setEventDate(LocalDate.of(2017, 12, 20));
            event4.setYear(year2017);
            
            year2017.setEvents(List.of(event3, event4));
            
            // 保存数据
            yearRepository.saveAll(List.of(year2016, year2017));
            
            log.info("时间轴示例数据加载完成，共加载 {} 个年份，{} 个事件", 
                yearRepository.count(), 
                yearRepository.findAllWithEvents().stream()
                    .mapToInt(year -> year.getEvents().size())
                    .sum());
        };
    }
} 