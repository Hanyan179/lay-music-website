package com.fateechoes.repository;

import com.fateechoes.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 选项数据访问接口
 */
@Repository
public interface OptionRepository extends JpaRepository<Option, Integer> {
    
    /**
     * 根据事件ID查找所有选项
     * @param eventId 事件ID
     * @return 选项列表
     */
    List<Option> findByEventIdOrderById(Integer eventId);
} 