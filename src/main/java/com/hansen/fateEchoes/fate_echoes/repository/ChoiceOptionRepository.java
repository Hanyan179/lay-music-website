package com.hansen.fateEchoes.fate_echoes.repository;

import com.hansen.fateEchoes.fate_echoes.entity.ChoiceOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 选择选项数据访问接口
 */
@Repository
public interface ChoiceOptionRepository extends JpaRepository<ChoiceOption, Long> {
    
    /**
     * 根据人生抉择事件ID查找所有选项
     * @param choiceEventId 人生抉择事件ID
     * @return 选项列表
     */
    List<ChoiceOption> findByChoiceEventIdOrderBySortOrderAsc(Long choiceEventId);
    
    /**
     * 删除指定人生抉择事件的所有选项
     * @param choiceEventId 人生抉择事件ID
     */
    void deleteByChoiceEventId(Long choiceEventId);
    
    /**
     * 统计指定人生抉择事件的选项数量
     * @param choiceEventId 人生抉择事件ID
     * @return 选项数量
     */
    long countByChoiceEventId(Long choiceEventId);
} 