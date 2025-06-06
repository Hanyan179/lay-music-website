package com.hansen.fateEchoes.fate_echoes.service;

import com.hansen.fateEchoes.fate_echoes.vo.CharacterBookVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * 角色书籍服务接口
 */
public interface CharacterBookService {
    
    /**
     * 获取所有可用的书籍
     * @return 书籍列表
     */
    List<CharacterBookVO> getAllAvailableBooks();
    
    /**
     * 根据书籍代码获取书籍详情
     * @param bookCode 书籍代码
     * @return 书籍详情
     */
    Optional<CharacterBookVO> getBookByCode(String bookCode);
    
    /**
     * 根据书籍代码获取完整的书籍详情（包含事件数据）
     * @param bookCode 书籍代码
     * @return 包含完整事件数据的书籍详情
     */
    Optional<CharacterBookVO> getFullBookByCode(String bookCode);
    
    /**
     * 增加书籍游玩次数
     * @param bookCode 书籍代码
     */
    void incrementPlayCount(String bookCode);
    
    /**
     * 增加书籍点赞次数
     * @param bookCode 书籍代码
     */
    void incrementLikeCount(String bookCode);
    
    /**
     * 检查书籍代码是否已存在
     * @param bookCode 书籍代码
     * @return 是否存在
     */
    boolean isBookCodeExists(String bookCode);
    
    /**
     * 创建新书籍
     * @param bookCode 书籍代码
     * @param title 标题
     * @param subtitle 副标题
     * @param description 描述
     * @param startYear 起始年份
     * @param endYear 结束年份
     * @param primaryColor 主题色
     * @param coverImage 封面图片文件
     * @return 创建的书籍VO
     */
    CharacterBookVO createBook(String bookCode, String title, String subtitle, String description,
                              Integer startYear, Integer endYear, String primaryColor, MultipartFile coverImage);
    
    /**
     * 获取所有公开的书籍（已完成且已上传）
     * @return 公开书籍列表
     */
    List<CharacterBookVO> getPublicBooks();
    
    /**
     * 根据用户token获取用户的书籍（我的人生）
     * @param userToken 用户token
     * @return 用户书籍列表
     */
    List<CharacterBookVO> getUserBooks(String userToken);
} 