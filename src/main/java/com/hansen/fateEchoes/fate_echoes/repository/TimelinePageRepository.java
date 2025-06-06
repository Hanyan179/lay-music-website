//package com.hansen.fateEchoes.fate_echoes.repository;
//
//import com.hansen.fateEchoes.fate_echoes.entity.TimelinePage;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface TimelinePageRepository extends JpaRepository<TimelinePage, Long> {
//
//    // 根据书籍ID查找所有页面
//    List<TimelinePage> findByBookId(Long bookId);
//
//    // 根据书籍ID和年份查找页面
//    Optional<TimelinePage> findByBookIdAndYear(Long bookId, Integer year);
//
//    // 根据书籍ID查找页面，按年份排序
//    List<TimelinePage> findByBookIdOrderByYearAsc(Long bookId);
//}
