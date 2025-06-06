package com.fateechoes.repository;

import com.fateechoes.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 事件数据访问接口
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    /**
     * 根据事件名称查找事件
     * @param name 事件名称
     * @return 事件实体
     */
    Optional<Event> findByName(String name);

    /**
     * 根据书籍代码查找所有事件
     * @param bookCode 书籍代码
     * @return 事件列表
     */
    List<Event> findByBookIdOrderByYearAsc(Long bookCode);

    /**
     * 根据书籍代码查找起始事件
     * @param bookCode 书籍代码
     * @return 起始事件列表
     */
    List<Event> findByBookIdAndIsEntryTrueOrderByYearAsc(Long bookCode);

    /**
     * 根据书籍代码和年份查找事件
     * @param bookCode 书籍代码
     * @param year 年份
     * @return 事件列表
     */
    List<Event> findByBookIdAndYearOrderById(Long bookCode, Integer year);
}
