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
    Optional<CharacterBookVO> getBookByCode(Long bookCode);

    /**
     * 根据数据库主键ID获取书籍详情
     * @param bookId 数据库主键ID
     * @return 书籍详情
     */
    Optional<CharacterBookVO> getBookById(Long bookId);

    /**
     * 根据书籍代码获取完整的书籍详情（包含事件数据）
     * @param bookCode 书籍代码
     * @return 包含完整事件数据的书籍详情
     */
    Optional<CharacterBookVO> getFullBookByCode(Long bookCode);

    /**
     * 根据数据库主键ID获取完整的书籍详情（包含事件数据）
     * @param bookId 数据库主键ID
     * @return 包含完整事件数据的书籍详情
     */
    Optional<CharacterBookVO> getFullBookById(Long bookId);

    /**
     * 增加书籍游玩次数
     * @param bookCode 书籍代码
     */
    void incrementPlayCount(Long bookCode);

    /**
     * 增加书籍点赞次数
     * @param bookCode 书籍代码
     */
    void incrementLikeCount(Long bookCode);

    /**
     * 检查书籍代码是否已存在
     * @param bookCode 书籍代码
     * @return 是否存在
     */
    boolean isBookCodeExists(Long bookCode);

    /**
     * 创建新书籍
     * @param bookCode 书籍代码
     * @param title 标题
     * @param subtitle 副标题
     * @param description 描述
     * @param author 作者
     * @param startYear 起始年份
     * @param endYear 结束年份
     * @param primaryColor 主题色
     * @param userToken 用户Token
     * @param coverImage 封面图片文件
     * @return 创建的书籍VO
     */
    CharacterBookVO createBook( String title, String subtitle, String description, String author,
                              Integer startYear, Integer endYear, String primaryColor, String userToken, MultipartFile coverImage);

    /**
     * 更新书籍
     * @param bookId 书籍ID
     * @param title 标题
     * @param subtitle 副标题
     * @param description 描述
     * @param author 作者
     * @param startYear 起始年份
     * @param endYear 结束年份
     * @param primaryColor 主题色
     * @param userToken 用户Token
     * @param coverImage 封面图片文件
     * @return 更新的书籍VO
     */
    CharacterBookVO updateBook(Long bookId, String title, String subtitle, String description, String author,
                              Integer startYear, Integer endYear, String primaryColor, String userToken, MultipartFile coverImage);

    /**
     * 获取所有已完成且已上传的公开书籍
     * @return 书籍列表
     */
    List<CharacterBookVO> getAllPublicBooks();

    /**
     * 根据用户Token获取用户的书籍（包括未完成的）
     * @param userToken 用户Token
     * @return 书籍列表
     */
    List<CharacterBookVO> getBooksByUserToken(String userToken);
}
