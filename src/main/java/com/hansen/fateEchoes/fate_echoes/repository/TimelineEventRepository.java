package com.hansen.fateEchoes.fate_echoes.repository;

import com.hansen.fateEchoes.fate_echoes.entity.TimelineEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 年度事件数据访问接口
 */
@Repository
public interface TimelineEventRepository extends JpaRepository<TimelineEvent, Long> {
    
    /**
     * 根据书籍ID查找所有年度事件
     * @param bookId 书籍ID
     * @return 年度事件列表
     */
    List<TimelineEvent> findByBookIdOrderByYearAscDisplayOrderAsc(Long bookId);
    
    /**
     * 根据书籍ID和年份查找年度事件
     * @param bookId 书籍ID
     * @param year 年份
     * @return 年度事件列表
     */
    List<TimelineEvent> findByBookIdAndYearOrderByDisplayOrderAsc(Long bookId, Integer year);
    
    /**
     * 根据书籍ID查找所有年份（去重）
     * @param bookId 书籍ID
     * @return 年份列表
     */
    @Query("SELECT DISTINCT te.year FROM TimelineEvent te WHERE te.bookId = :bookId ORDER BY te.year ASC")
    List<Integer> findDistinctYearsByBookId(@Param("bookId") Long bookId);
    
    /**
     * 删除指定书籍的所有年度事件
     * @param bookId 书籍ID
     */
    void deleteByBookId(Long bookId);
    
    /**
     * 删除指定书籍指定年份的所有年度事件
     * @param bookId 书籍ID
     * @param year 年份
     */
    void deleteByBookIdAndYear(Long bookId, Integer year);
    
    /**
     * 统计指定书籍的年度事件数量
     * @param bookId 书籍ID
     * @return 事件数量
     */
    long countByBookId(Long bookId);
    
    /**
     * 统计指定书籍指定年份的年度事件数量
     * @param bookId 书籍ID
     * @param year 年份
     * @return 事件数量
     */
    long countByBookIdAndYear(Long bookId, Integer year);
} 