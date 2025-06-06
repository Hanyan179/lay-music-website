package com.hansen.fateEchoes.fate_echoes.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hansen.fateEchoes.fate_echoes.entity.CharacterBook;
import com.hansen.fateEchoes.fate_echoes.repository.CharacterBookRepository;
import com.hansen.fateEchoes.fate_echoes.service.CharacterBookService;
import com.hansen.fateEchoes.fate_echoes.vo.BookThemeVO;
import com.hansen.fateEchoes.fate_echoes.vo.CharacterBookVO;
import com.hansen.fateEchoes.fate_echoes.vo.PersonalEventVO;
import com.hansen.fateEchoes.fate_echoes.service.EventService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 角色书籍服务实现类
 */
@Slf4j
@Service
public class CharacterBookServiceImpl implements CharacterBookService {
    
    @Autowired
    private CharacterBookRepository characterBookRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private EventService eventService;
    
    @Override
    public List<CharacterBookVO> getAllAvailableBooks() {
        List<CharacterBook> books = characterBookRepository.findAllActiveOrderByDisplayOrder();
        return books.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<CharacterBookVO> getBookByCode(String bookCode) {
        Optional<CharacterBook> bookOptional = characterBookRepository.findByBookCode(bookCode);
        return bookOptional.map(this::convertToVO);
    }
    
    @Override
    public Optional<CharacterBookVO> getFullBookByCode(String bookCode) {
        Optional<CharacterBook> bookOptional = characterBookRepository.findByBookCode(bookCode);
        if (bookOptional.isPresent()) {
            CharacterBook book = bookOptional.get();
            CharacterBookVO vo = convertToVO(book);
            
            // 从数据库获取事件数据并构建PersonalEvents
            Map<String, PersonalEventVO> personalEvents = eventService.buildPersonalEventsMap(bookCode);
            vo.setPersonalEvents(personalEvents);
            
            // 设置起始事件ID
            if (vo.getCurrentEventId() == null) {
                String startingEventId = eventService.getStartingEventId(bookCode);
                vo.setCurrentEventId(startingEventId);
            }
            
            // 如果事件历史为空，初始化为空列表
            if (vo.getEventHistory() == null) {
                vo.setEventHistory(new ArrayList<>());
            }
            
            log.info("成功获取书籍 {} 的完整数据，包含 {} 个事件", bookCode, personalEvents.size());
            return Optional.of(vo);
        }
        return Optional.empty();
    }
    
    @Override
    @Transactional
    public void incrementPlayCount(String bookCode) {
        Optional<CharacterBook> bookOptional = characterBookRepository.findByBookCode(bookCode);
        if (bookOptional.isPresent()) {
            CharacterBook book = bookOptional.get();
            book.setPlayCount(book.getPlayCount() + 1);
            characterBookRepository.save(book);
            log.info("书籍 {} 游玩次数已增加到 {}", bookCode, book.getPlayCount());
        } else {
            log.warn("未找到书籍代码为 {} 的书籍", bookCode);
        }
    }
    
    @Override
    @Transactional
    public void incrementLikeCount(String bookCode) {
        Optional<CharacterBook> bookOptional = characterBookRepository.findByBookCode(bookCode);
        if (bookOptional.isPresent()) {
            CharacterBook book = bookOptional.get();
            book.setLikeCount(book.getLikeCount() + 1);
            characterBookRepository.save(book);
            log.info("书籍 {} 点赞次数已增加到 {}", bookCode, book.getLikeCount());
        } else {
            log.warn("未找到书籍代码为 {} 的书籍", bookCode);
        }
    }
    
    @Override
    public boolean isBookCodeExists(String bookCode) {
        return characterBookRepository.existsByBookCode(bookCode);
    }
    
    @Override
    @Transactional
    public CharacterBookVO createBook(String bookCode, String title, String subtitle, String description,
                                     Integer startYear, Integer endYear, String primaryColor, MultipartFile coverImage) {
        try {
            // 创建新的书籍实体
            CharacterBook book = new CharacterBook();
            book.setBookCode(bookCode);
            book.setTitle(title);
            book.setSubtitle(subtitle);
            book.setDescription(description);
            book.setStartYear(startYear);
            book.setEndYear(endYear);
            book.setStatus(1); // 启用状态
            book.setPlayCount(0L);
            book.setLikeCount(0L);
            book.setCreatedBy("system");
            book.setUpdatedBy("system");
            
            // 设置显示顺序（在最后）
            Integer maxOrder = characterBookRepository.findMaxDisplayOrder();
            book.setDisplayOrder(maxOrder + 1);
            
            // 处理封面图片
            if (coverImage != null && !coverImage.isEmpty()) {
                String base64Image = processImage(coverImage);
                book.setCoverImageData(base64Image);
            }
            
            // 生成主题配置JSON
            String themeConfig = generateThemeConfig(primaryColor, startYear, endYear);
            book.setThemeConfig(themeConfig);
            
            // 保存到数据库
            CharacterBook savedBook = characterBookRepository.save(book);
            log.info("成功创建书籍: {}", bookCode);
            
            // 转换为VO并返回
            return convertToVO(savedBook);
            
        } catch (Exception e) {
            log.error("创建书籍失败: {}", bookCode, e);
            throw new RuntimeException("创建书籍失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 处理图片文件，转换为base64
     */
    private String processImage(MultipartFile imageFile) throws IOException {
        // 验证文件类型
        String contentType = imageFile.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && 
                                   !contentType.equals("image/png") && 
                                   !contentType.equals("image/jpg"))) {
            throw new IllegalArgumentException("不支持的图片格式，请使用 JPG 或 PNG 格式");
        }
        
        // 验证文件大小（限制5MB）
        if (imageFile.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("图片大小不能超过 5MB");
        }
        
        // 转换为base64
        byte[] imageBytes = imageFile.getBytes();
        String base64 = Base64.getEncoder().encodeToString(imageBytes);
        
        // 添加data URL前缀
        String mimeType = contentType;
        return String.format("data:%s;base64,%s", mimeType, base64);
    }
    
    /**
     * 生成主题配置JSON
     */
    private String generateThemeConfig(String primaryColor, Integer startYear, Integer endYear) {
        try {
            // 生成背景渐变色（基于主题色）
            String backgroundColor = adjustColorBrightness(primaryColor, -20);
            String gradientColor1 = adjustColorBrightness(primaryColor, 10);
            String gradientColor2 = adjustColorBrightness(primaryColor, -10);
            
            String backgroundGradient = String.format(
                "linear-gradient(135deg, %s 0%%, %s 50%%, %s 100%%)",
                gradientColor1, primaryColor, gradientColor2
            );
            
            // 构建JSON对象
            return objectMapper.writeValueAsString(new HashMap<String, String>() {{
                put("primaryColor", primaryColor);
                put("backgroundColor", backgroundColor);
                put("backgroundGradient", backgroundGradient);
            }});
            
        } catch (Exception e) {
            log.error("生成主题配置失败", e);
            // 返回默认配置
            return String.format("{\"primaryColor\":\"%s\",\"backgroundColor\":\"%s\",\"backgroundGradient\":\"linear-gradient(135deg, %s 0%%, %s 50%%, %s 100%%)\"}",
                primaryColor, primaryColor, primaryColor, primaryColor, primaryColor);
        }
    }
    
    /**
     * 调整颜色亮度
     */
    private String adjustColorBrightness(String hexColor, int adjustment) {
        try {
            // 移除#号
            String color = hexColor.replace("#", "");
            
            // 解析RGB值
            int r = Integer.parseInt(color.substring(0, 2), 16);
            int g = Integer.parseInt(color.substring(2, 4), 16);
            int b = Integer.parseInt(color.substring(4, 6), 16);
            
            // 调整亮度
            r = Math.max(0, Math.min(255, r + adjustment));
            g = Math.max(0, Math.min(255, g + adjustment));
            b = Math.max(0, Math.min(255, b + adjustment));
            
            // 转换回hex
            return String.format("#%02x%02x%02x", r, g, b);
            
        } catch (Exception e) {
            log.warn("调整颜色亮度失败: {}", hexColor, e);
            return hexColor; // 返回原颜色
        }
    }
    
    /**
     * 将实体转换为VO
     */
    private CharacterBookVO convertToVO(CharacterBook book) {
        CharacterBookVO vo = new CharacterBookVO();
        vo.setId(book.getBookCode()); // 前端使用bookCode作为id
        vo.setTitle(book.getTitle());
        vo.setSubtitle(book.getSubtitle());
        vo.setDescription(book.getDescription());
        vo.setPlayCount(book.getPlayCount());
        vo.setLikeCount(book.getLikeCount());
        vo.setDisplayOrder(book.getDisplayOrder());
        vo.setAuthor(book.getAuthor());
        
        // 优先使用图片路径，如果没有则使用base64数据
        if (book.getCoverImagePath() != null && !book.getCoverImagePath().isEmpty()) {
            vo.setCover(book.getCoverImagePath());
        } else {
            vo.setCover(book.getCoverImageData());
        }
        
        // 解析主题配置JSON
        vo.setTheme(parseThemeConfig(book));
        
        // 设置当前事件ID
        vo.setCurrentEventId(book.getCurrentEventId());
        
        // 解析事件历史记录JSON
        vo.setEventHistory(parseEventHistory(book.getEventHistory()));
        
        // personalEvents在getFullBookByCode中单独设置，这里设置为空Map
        vo.setPersonalEvents(new HashMap<>());
        
        // 设置新增字段
        vo.setIsUploaded(book.getIsUploaded());
        vo.setIsCompleted(book.getIsCompleted());
        vo.setUserToken(book.getUserToken());
        
        return vo;
    }
    
    /**
     * 解析主题配置JSON
     */
    private BookThemeVO parseThemeConfig(CharacterBook book) {
        BookThemeVO theme = new BookThemeVO();
        
        // 设置年份范围
        theme.setStartYear(book.getStartYear());
        theme.setEndYear(book.getEndYear());
        
        // 解析JSON配置
        if (book.getThemeConfig() != null && !book.getThemeConfig().isEmpty()) {
            try {
                JsonNode themeNode = objectMapper.readTree(book.getThemeConfig());
                
                theme.setPrimaryColor(getJsonStringValue(themeNode, "primaryColor", "#86868b"));
                theme.setBackgroundColor(getJsonStringValue(themeNode, "backgroundColor", "#f5f5f7"));
                theme.setBackgroundGradient(getJsonStringValue(themeNode, "backgroundGradient", 
                    "linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%)"));
                
            } catch (JsonProcessingException e) {
                log.error("解析书籍 {} 的主题配置JSON失败: {}", book.getBookCode(), e.getMessage());
                // 使用默认值
                setDefaultTheme(theme);
            }
        } else {
            // 使用默认值
            setDefaultTheme(theme);
        }
        
        return theme;
    }
    
    /**
     * 从JSON节点获取字符串值
     */
    private String getJsonStringValue(JsonNode node, String fieldName, String defaultValue) {
        JsonNode fieldNode = node.get(fieldName);
        return fieldNode != null && !fieldNode.isNull() ? fieldNode.asText() : defaultValue;
    }
    
    /**
     * 设置默认主题
     */
    private void setDefaultTheme(BookThemeVO theme) {
        theme.setPrimaryColor("#86868b");
        theme.setBackgroundColor("#f5f5f7");
        theme.setBackgroundGradient("linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%)");
    }
    
    /**
     * 解析事件历史记录JSON
     */
    private List<com.hansen.fateEchoes.fate_echoes.vo.EventHistoryVO> parseEventHistory(String eventHistoryJson) {
        if (eventHistoryJson == null || eventHistoryJson.isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            return objectMapper.readValue(eventHistoryJson, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, 
                    com.hansen.fateEchoes.fate_echoes.vo.EventHistoryVO.class));
        } catch (JsonProcessingException e) {
            log.error("解析事件历史记录JSON失败: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    @Override
    public List<CharacterBookVO> getPublicBooks() {
        List<CharacterBook> books = characterBookRepository.findPublicBooks();
        return books.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CharacterBookVO> getUserBooks(String userToken) {
        if (userToken == null || userToken.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        List<CharacterBook> books = characterBookRepository.findByUserToken(userToken);
        List<CharacterBookVO> result = books.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
        
        log.info("获取用户 {} 的书籍，共 {} 本", userToken, result.size());
        return result;
    }
} 