package com.lay.music.repository;

import com.lay.music.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户数据访问Repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 根据用户名查找用户
     */
    Optional<User> findByUsername(String username);
    
    /**
     * 检查用户名是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 根据用户名或真实姓名搜索用户（分页）
     */
    @Query("SELECT u FROM User u WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.realName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    /**
     * 根据角色查找用户
     */
    Page<User> findByRole(String role, Pageable pageable);
    
    /**
     * 根据状态查找用户
     */
    Page<User> findByStatus(Integer status, Pageable pageable);
    
    /**
     * 统计用户总数
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = 1")
    long countActiveUsers();
} 