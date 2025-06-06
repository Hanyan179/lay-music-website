package com.hansen.fateEchoes.fate_echoes.repository;

import com.hansen.fateEchoes.fate_echoes.entity.PersonalChoiceEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 人生抉择事件数据访问接口
 */
@Repository
public interface PersonalChoiceEventRepository extends JpaRepository<PersonalChoiceEvent, Long> {
    
    /**
     * 根据书籍ID查找所有人生抉择事件
     * @param bookId 书籍ID
     * @return 人生抉择事件列表
     */
    List<PersonalChoiceEvent> findByBookIdOrderByYearAscDisplayOrderAsc(Long bookId);
    
    /**
     * 根据书籍ID和年份查找人生抉择事件
     * @param bookId 书籍ID
     * @param year 年份
     * @return 人生抉择事件列表
     */ 
    List<PersonalChoiceEvent> findByBookIdAndYearOrderByDisplayOrderAsc(Long bookId, Integer year);
    
    /**
     * 根据书籍ID和事件代码查找人生抉择事件
     * @param bookId 书籍ID
     * @param eventCode 事件代码
     * @return 人生抉择事件
     */
    Optional<PersonalChoiceEvent> findByBookIdAndEventCode(Long bookId, String eventCode);
    
    /**
     * 根据书籍ID查找起始事件
     * @param bookId 书籍ID
     * @return 起始事件
     */
    Optional<PersonalChoiceEvent> findByBookIdAndIsStartingEventTrue(Long bookId);
    
    /**
     * 根据书籍ID查找所有年份（去重）
     * @param bookId 书籍ID
     * @return 年份列表
     */
    @Query("SELECT DISTINCT pce.year FROM PersonalChoiceEvent pce WHERE pce.bookId = :bookId ORDER BY pce.year ASC")
    List<Integer> findDistinctYearsByBookId(@Param("bookId") Long bookId);
    
    /**
     * 检查事件代码是否在指定书籍中已存在
     * @param bookId 书籍ID
     * @param eventCode 事件代码
     * @return 是否存在
     */
    boolean existsByBookIdAndEventCode(Long bookId, String eventCode);
    
    /**
     * 删除指定书籍的所有人生抉择事件
     * @param bookId 书籍ID
     */
    void deleteByBookId(Long bookId);
    
    /**
     * 删除指定书籍指定年份的所有人生抉择事件
     * @param bookId 书籍ID
     * @param year 年份
     */
    void deleteByBookIdAndYear(Long bookId, Integer year);
    
    /**
     * 统计指定书籍的人生抉择事件数量
     * @param bookId 书籍ID
     * @return 事件数量
     */
    long countByBookId(Long bookId);
    
    /**
     * 统计指定书籍指定年份的人生抉择事件数量
     * @param bookId 书籍ID
     * @param year 年份
     * @return 事件数量
     */
    long countByBookIdAndYear(Long bookId, Integer year);
} 