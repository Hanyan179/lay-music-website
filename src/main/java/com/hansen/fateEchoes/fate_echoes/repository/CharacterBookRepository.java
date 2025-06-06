package com.hansen.fateEchoes.fate_echoes.repository;

import com.hansen.fateEchoes.fate_echoes.entity.CharacterBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 角色书籍数据访问接口
 */
@Repository
public interface CharacterBookRepository extends JpaRepository<CharacterBook, Long> {
    
    /**
     * 根据书籍代码查找书籍
     * @param bookCode 书籍代码
     * @return 书籍实体
     */
    Optional<CharacterBook> findByBookCode(Long bookCode);
    
    /**
     * 根据数据库主键ID查找书籍
     * @param id 数据库主键ID
     * @return 书籍实体
     */
    Optional<CharacterBook> findById(Long id);
    
    /**
     * 查询所有启用状态的书籍，按点赞量排序
     * @return 书籍列表
     */
    @Query("SELECT cb FROM CharacterBook cb WHERE cb.status = 1 ORDER BY cb.likeCount DESC, cb.displayOrder ASC, cb.createdAt ASC")
    List<CharacterBook> findAllActiveOrderByDisplayOrder();
    
    /**
     * 根据状态查询书籍，按点赞量排序
     * @param status 状态
     * @return 书籍列表
     */
    List<CharacterBook> findByStatusOrderByLikeCountDescDisplayOrderAsc(Integer status);
    
    /**
     * 检查书籍代码是否存在
     * @param bookCode 书籍代码
     * @return 是否存在
     */
    boolean existsByBookCode(Long bookCode);
    
    /**
     * 查询最大显示顺序
     * @return 最大显示顺序
     */
    @Query("SELECT COALESCE(MAX(cb.displayOrder), 0) FROM CharacterBook cb")
    Integer findMaxDisplayOrder();
    
    /**
     * 根据状态、是否完成、是否上传查询书籍，按点赞量排序
     * @param status 状态
     * @param isCompleted 是否完成
     * @param isUploaded 是否上传
     * @return 书籍列表
     */
    List<CharacterBook> findByStatusAndIsCompletedAndIsUploadedOrderByLikeCountDescDisplayOrderAsc(
            Integer status, Integer isCompleted, Integer isUploaded);
    
    /**
     * 根据用户Token查询书籍，按创建时间倒序
     * @param userToken 用户Token
     * @return 书籍列表
     */
    List<CharacterBook> findByUserTokenOrderByCreatedAtDesc(String userToken);
} 
