package com.hansen.fateEchoes.fate_echoes.controller.api.v1;

import com.hansen.fateEchoes.fate_echoes.service.CharacterBookService;
import com.hansen.fateEchoes.fate_echoes.vo.CharacterBookVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * 角色书籍控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/books")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = {"*"},
    allowCredentials = "true",
    maxAge = 3600
)
public class CharacterBookController {

    @Autowired
    private CharacterBookService characterBookService;

    /**
     * 获取所有可用的书籍
     * @return 书籍列表
     */
    @GetMapping
    public ResponseEntity<List<CharacterBookVO>> getAllBooks() {
        try {
            List<CharacterBookVO> books = characterBookService.getAllAvailableBooks();
            log.info("成功获取 {} 本书籍", books.size());
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            log.error("获取书籍列表失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 根据书籍代码获取书籍详情
     * @param bookCode 书籍代码
     * @return 书籍详情
     */
    @GetMapping("/{bookCode}")
    public ResponseEntity<CharacterBookVO> getBookByCode(@PathVariable String bookCode) {
        try {
            Optional<CharacterBookVO> bookOptional = characterBookService.getFullBookByCode(bookCode);
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
     * @param bookCode 书籍代码
     * @return 操作结果
     */
    @PostMapping("/{bookCode}/play")
    public ResponseEntity<Void> incrementPlayCount(@PathVariable String bookCode) {
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
     * @param bookCode 书籍代码
     * @return 操作结果
     */
    @PostMapping("/{bookCode}/like")
    public ResponseEntity<Void> incrementLikeCount(@PathVariable String bookCode) {
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
     * @param bookCode 书籍代码
     * @param title 标题
     * @param subtitle 副标题
     * @param description 描述
     * @param startYear 起始年份
     * @param endYear 结束年份
     * @param primaryColor 主题色
     * @param coverImage 封面图片文件
     * @return 创建结果
     */
    @PostMapping
    public ResponseEntity<CharacterBookVO> createBook(
            @RequestParam("bookCode") String bookCode,
            @RequestParam("title") String title,
            @RequestParam(value = "subtitle", required = false) String subtitle,
            @RequestParam("description") String description,
            @RequestParam("startYear") Integer startYear,
            @RequestParam("endYear") Integer endYear,
            @RequestParam("primaryColor") String primaryColor,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
        try {
            // 验证参数
            if (bookCode == null || bookCode.trim().isEmpty()) {
                log.warn("书籍代码不能为空");
                return ResponseEntity.badRequest().build();
            }
            
            if (title == null || title.trim().isEmpty()) {
                log.warn("书籍标题不能为空");
                return ResponseEntity.badRequest().build();
            }
            
            if (description == null || description.trim().isEmpty()) {
                log.warn("书籍描述不能为空");
                return ResponseEntity.badRequest().build();
            }
            
            if (startYear == null || endYear == null || startYear >= endYear) {
                log.warn("年份设置无效: {} - {}", startYear, endYear);
                return ResponseEntity.badRequest().build();
            }
            
            // 检查书籍代码是否已存在
            if (characterBookService.isBookCodeExists(bookCode)) {
                log.warn("书籍代码已存在: {}", bookCode);
                return ResponseEntity.status(409).build(); // Conflict
            }
            
            // 创建书籍
            CharacterBookVO newBook = characterBookService.createBook(
                bookCode, title, subtitle, description, 
                startYear, endYear, primaryColor, coverImage
            );
            
            log.info("成功创建书籍: {}", bookCode);
            return ResponseEntity.ok(newBook);
            
        } catch (Exception e) {
            log.error("创建书籍失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 健康检查接口
     * @return 系统状态
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Character Books API is running");
    }
    
    /**
     * 获取所有公开的书籍（已完成且已上传）
     * @return 公开书籍列表
     */
    @GetMapping("/public")
    public ResponseEntity<List<CharacterBookVO>> getPublicBooks() {
        try {
            List<CharacterBookVO> books = characterBookService.getPublicBooks();
            log.info("成功获取 {} 本公开书籍", books.size());
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            log.error("获取公开书籍列表失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 根据用户token获取用户的书籍（我的人生）
     * @param userToken 用户token
     * @return 用户书籍列表
     */
    @GetMapping("/my")
    public ResponseEntity<List<CharacterBookVO>> getUserBooks(@RequestParam("userToken") String userToken) {
        try {
            if (userToken == null || userToken.trim().isEmpty()) {
                log.warn("用户token不能为空");
                return ResponseEntity.badRequest().build();
            }
            
            List<CharacterBookVO> books = characterBookService.getUserBooks(userToken);
            log.info("成功获取用户 {} 的 {} 本书籍", userToken, books.size());
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            log.error("获取用户书籍列表失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
