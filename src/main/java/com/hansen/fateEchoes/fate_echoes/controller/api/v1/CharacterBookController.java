package com.hansen.fateEchoes.fate_echoes.controller.api.v1;

import com.hansen.fateEchoes.fate_echoes.service.CharacterBookService;
import com.hansen.fateEchoes.fate_echoes.vo.CharacterBookVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * 角色书籍控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/books")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowedHeaders = {"*"}, allowCredentials = "true", maxAge = 3600)
public class CharacterBookController {

    @Autowired
    private CharacterBookService characterBookService;

    /**
     * 获取所有可用的书籍
     *
     * @return 书籍列表
     */
    @GetMapping
    public ResponseEntity<List<CharacterBookVO>> getAllBooks(@RequestParam(value = "type", defaultValue = "public") String type, @RequestParam(value = "userToken", required = false) String userToken) {
        try {
            List<CharacterBookVO> books;

            if ("my".equals(type) && userToken != null && !userToken.trim().isEmpty()) {
                // 获取用户的书籍
                books = characterBookService.getBooksByUserToken(userToken);
                log.info("成功获取用户 {} 的 {} 本书籍", userToken, books.size());
            } else {
                // 获取公开书籍（已完成且已上传的）
                books = characterBookService.getAllPublicBooks();
                log.info("成功获取 {} 本公开书籍", books.size());
            }

            return ResponseEntity.ok(books);
        } catch (Exception e) {
            log.error("获取书籍列表失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 根据书籍代码获取书籍详情
     *
     * @param bookCode 书籍代码或带下划线前缀的数据库ID
     * @return 书籍详情
     */
    @GetMapping("/{bookCode}")
    public ResponseEntity<CharacterBookVO> getBookByCode(@PathVariable Long bookCode) {
        try {
            Optional<CharacterBookVO> bookOptional;
            // 如果参数以下划线开头，去掉下划线后当作数据库主键ID处理
            bookOptional = characterBookService.getFullBookById(bookCode);
            if (bookOptional.isPresent()) {
                log.info("成功获取书籍详情: {}", bookCode);
                return ResponseEntity.ok(bookOptional.get());
            } else {
                log.warn("未找到书籍: {}", bookCode);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("获取书籍详情失败: {}", bookCode, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 增加书籍游玩次数
     *
     * @param bookCode 书籍代码
     * @return 操作结果
     */
    @PostMapping("/{bookCode}/play")
    public ResponseEntity<Void> incrementPlayCount(@PathVariable Long bookCode) {
        try {
            characterBookService.incrementPlayCount(bookCode);
            log.info("书籍 {} 游玩次数已增加", bookCode);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("增加书籍游玩次数失败: {}", bookCode, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 增加书籍点赞次数
     *
     * @param bookCode 书籍代码
     * @return 操作结果
     */
    @PostMapping("/{bookCode}/like")
    public ResponseEntity<Void> incrementLikeCount(@PathVariable Long bookCode) {
        try {
            characterBookService.incrementLikeCount(bookCode);
            log.info("书籍 {} 点赞次数已增加", bookCode);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("增加书籍点赞次数失败: {}", bookCode, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 创建新书籍
     *
     * @param bookCode     书籍代码
     * @param title        标题
     * @param subtitle     副标题
     * @param description  描述
     * @param author       作者
     * @param startYear    起始年份
     * @param endYear      结束年份
     * @param primaryColor 主题色
     * @param userToken    用户Token
     * @param coverImage   封面图片文件
     * @return 创建结果
     */
    @PostMapping
    public ResponseEntity<CharacterBookVO> createBook(@RequestParam("title") String title, @RequestParam(value = "subtitle", required = false) String subtitle, @RequestParam("description") String description, @RequestParam("author") String author, @RequestParam("startYear") Integer startYear, @RequestParam("endYear") Integer endYear, @RequestParam("primaryColor") String primaryColor, @RequestParam(value = "userToken", required = false) String userToken, @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
        try {


            if (title == null || title.trim().isEmpty()) {
                log.warn("书籍标题不能为空");
                return ResponseEntity.badRequest().build();
            }

            if (description == null || description.trim().isEmpty()) {
                log.warn("书籍描述不能为空");
                return ResponseEntity.badRequest().build();
            }

            if (author == null || author.trim().isEmpty()) {
                log.warn("作者不能为空");
                return ResponseEntity.badRequest().build();
            }

            if (startYear == null || endYear == null || startYear >= endYear) {
                log.warn("年份设置无效: {} - {}", startYear, endYear);
                return ResponseEntity.badRequest().build();
            }



            // 创建书籍
            CharacterBookVO newBook = characterBookService.createBook( title, subtitle, description, author, startYear, endYear, primaryColor, userToken, coverImage);

            return ResponseEntity.ok(newBook);

        } catch (Exception e) {
            log.error("创建书籍失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 更新书籍
     *
     * @param bookId       书籍ID
     * @param title        标题
     * @param subtitle     副标题
     * @param description  描述
     * @param author       作者
     * @param startYear    起始年份
     * @param endYear      结束年份
     * @param primaryColor 主题色
     * @param userToken    用户Token
     * @param coverImage   封面图片文件
     * @return 更新结果
     */
    @PutMapping("/{bookId}")
    public ResponseEntity<CharacterBookVO> updateBook(@PathVariable Long bookId, @RequestParam("title") String title, @RequestParam(value = "subtitle", required = false) String subtitle, @RequestParam("description") String description, @RequestParam("author") String author, @RequestParam("startYear") Integer startYear, @RequestParam("endYear") Integer endYear, @RequestParam("primaryColor") String primaryColor, @RequestParam(value = "userToken", required = false) String userToken, @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
        try {

            if (title == null || title.trim().isEmpty()) {
                log.warn("书籍标题不能为空");
                return ResponseEntity.badRequest().build();
            }

            if (description == null || description.trim().isEmpty()) {
                log.warn("书籍描述不能为空");
                return ResponseEntity.badRequest().build();
            }

            if (author == null || author.trim().isEmpty()) {
                log.warn("作者不能为空");
                return ResponseEntity.badRequest().build();
            }

            if (startYear == null || endYear == null || startYear >= endYear) {
                log.warn("年份设置无效: {} - {}", startYear, endYear);
                return ResponseEntity.badRequest().build();
            }

            // 检查书籍是否存在
            Optional<CharacterBookVO> existingBook = characterBookService.getFullBookById(bookId);
            if (!existingBook.isPresent()) {
                log.warn("书籍不存在: {}", bookId);
                return ResponseEntity.notFound().build();
            }

            // 更新书籍
            CharacterBookVO updatedBook = characterBookService.updateBook(bookId, title, subtitle, description, author, startYear, endYear, primaryColor, userToken, coverImage);

            log.info("成功更新书籍: {}", bookId);
            return ResponseEntity.ok(updatedBook);

        } catch (Exception e) {
            log.error("更新书籍失败: {}", bookId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 健康检查接口
     *
     * @return 系统状态
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Character Books API is running");
    }
}
