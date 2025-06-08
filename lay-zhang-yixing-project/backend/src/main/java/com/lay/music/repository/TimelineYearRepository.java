package com.lay.music.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.lay.music.entity.TimelineYear;

@Repository
public interface TimelineYearRepository extends JpaRepository<TimelineYear, Long> {
    
    @Query("select distinct y from TimelineYear y left join fetch y.events order by y.year")
    List<TimelineYear> findAllWithEvents();
} 