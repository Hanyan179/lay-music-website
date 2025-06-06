-- Fate Echoes 数据库迁移脚本
-- 适用于已有 character_books, events, options 表的数据库
-- 执行前请备份数据库！

-- 设置字符集和排序规则
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ====================================================
-- 1. 检查并更新 character_books 表结构
-- ====================================================

-- 检查character_books表是否缺少新字段，如果缺少则添加
SET @table_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'character_books'
);

-- 添加可能缺少的字段（如果不存在）
SET @column_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'character_books' 
    AND COLUMN_NAME = 'is_uploaded'
);

-- 如果字段不存在，则添加
SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE character_books 
     ADD COLUMN is_uploaded TINYINT NOT NULL DEFAULT 0 COMMENT "是否已上传：0-未上传，1-已上传" AFTER author,
     ADD COLUMN is_completed TINYINT NOT NULL DEFAULT 0 COMMENT "是否已完成著作：0-未完成，1-已完成" AFTER is_uploaded,
     ADD COLUMN user_token VARCHAR(100) COMMENT "用户Token（浏览器生成的用户标识）" AFTER is_completed;', 
    'SELECT "character_books字段已存在" as status;');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加可能缺少的索引
SET @index_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'character_books' 
    AND INDEX_NAME = 'idx_user_token'
);

SET @sql = IF(@index_exists = 0, 
    'ALTER TABLE character_books 
     ADD INDEX idx_user_token (user_token),
     ADD INDEX idx_upload_status (is_uploaded, is_completed, status);', 
    'SELECT "character_books索引已存在" as status;');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 更新现有数据：将所有现有书籍标记为已完成且已上传（公开）
UPDATE character_books 
SET is_uploaded = 1, is_completed = 1, author = COALESCE(author, '系统管理员')
WHERE status = 1 AND (is_uploaded IS NULL OR is_uploaded = 0);

-- ====================================================
-- 2. 备份并重命名现有的 events 表为 timeline_events
-- ====================================================

-- 检查是否需要重命名events表
SET @events_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'events'
);

SET @timeline_events_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'timeline_events'
);

-- 如果events表存在但timeline_events不存在，则重命名
SET @sql = IF(@events_exists > 0 AND @timeline_events_exists = 0, 
    'RENAME TABLE events TO events_backup;
     CREATE TABLE timeline_events (
         id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT "事件ID",
         book_id BIGINT NOT NULL COMMENT "所属书籍ID",
         year INT NOT NULL COMMENT "事件发生年份",
         title VARCHAR(200) NOT NULL COMMENT "事件标题",
         description TEXT COMMENT "事件详细描述",
         media_type VARCHAR(20) COMMENT "媒体类型：image, video",
         media_url TEXT COMMENT "媒体文件URL",
         media_poster TEXT COMMENT "视频缩略图URL",
         impact VARCHAR(20) DEFAULT "中等" COMMENT "影响等级：低, 中等, 高, 极高",
         tags JSON COMMENT "事件标签数组",
         display_order INT NOT NULL DEFAULT 0 COMMENT "显示顺序",
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT "创建时间",
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT "更新时间",
         FOREIGN KEY (book_id) REFERENCES character_books(id) ON DELETE CASCADE,
         INDEX idx_book_year (book_id, year),
         INDEX idx_title (title),
         INDEX idx_impact (impact),
         INDEX idx_display_order (display_order)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT="年度事件表";', 
    'SELECT "timeline_events表已存在或events表不存在" as status;');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 3. 备份并重命名现有的 options 表为 event_options
-- ====================================================

-- 检查是否需要重命名options表
SET @options_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'options'
);

SET @event_options_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'event_options'
);

-- 如果options表存在但event_options不存在，则重命名
SET @sql = IF(@options_exists > 0 AND @event_options_exists = 0, 
    'RENAME TABLE options TO options_backup;
     CREATE TABLE event_options (
         id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT "选项ID",
         event_id BIGINT NOT NULL COMMENT "所属事件ID（可能是timeline_events或其他事件表）",
         event_type ENUM("TIMELINE", "CHOICE") NOT NULL DEFAULT "TIMELINE" COMMENT "事件类型",
         option_text VARCHAR(500) NOT NULL COMMENT "选项文本",
         option_value VARCHAR(100) COMMENT "选项值",
         is_default TINYINT(1) NOT NULL DEFAULT 0 COMMENT "是否为默认选项",
         sort_order INT NOT NULL DEFAULT 0 COMMENT "排序",
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT "创建时间",
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT "更新时间",
         INDEX idx_event (event_id, event_type),
         INDEX idx_sort_order (sort_order)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT="事件选项表（通用）";', 
    'SELECT "event_options表已存在或options表不存在" as status;');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ====================================================
-- 4. 创建人生抉择事件表 (personal_choice_events)
-- ====================================================

CREATE TABLE IF NOT EXISTS personal_choice_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '事件ID',
    book_id BIGINT NOT NULL COMMENT '所属书籍ID',
    year INT NOT NULL COMMENT '事件发生年份',
    event_code VARCHAR(10) NOT NULL COMMENT '事件代码（如A,B,C等）',
    question VARCHAR(500) NOT NULL COMMENT '人生抉择问题',
    description TEXT COMMENT '问题详细描述',
    
    -- 媒体相关字段
    media_type VARCHAR(20) COMMENT '媒体类型：image, video',
    media_url TEXT COMMENT '媒体文件URL',
    media_poster TEXT COMMENT '视频缩略图URL',
    image LONGTEXT COMMENT '图片base64数据（向后兼容）',
    
    -- 事件属性
    is_starting_event TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否为起始事件',
    display_order INT NOT NULL DEFAULT 0 COMMENT '显示顺序',
    
    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 外键约束
    FOREIGN KEY (book_id) REFERENCES character_books(id) ON DELETE CASCADE,
    
    -- 索引
    UNIQUE KEY uk_book_event (book_id, event_code),
    INDEX idx_book_year (book_id, year),
    INDEX idx_starting_event (is_starting_event),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='人生抉择事件表';

-- ====================================================
-- 5. 创建选择选项表 (choice_options)
-- ====================================================

CREATE TABLE IF NOT EXISTS choice_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '选项ID',
    choice_event_id BIGINT NOT NULL COMMENT '所属人生抉择事件ID',
    option_text VARCHAR(500) NOT NULL COMMENT '选项描述文本',
    effect TEXT COMMENT '选择后果描述',
    next_event_code VARCHAR(10) COMMENT '下一个事件代码',
    is_next_year TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否进入下一年',
    action_type ENUM('SHOW_EFFECT', 'JUMP_TO_NEXT') NOT NULL DEFAULT 'SHOW_EFFECT' COMMENT '操作类型',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '选项排序',
    
    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 外键约束
    FOREIGN KEY (choice_event_id) REFERENCES personal_choice_events(id) ON DELETE CASCADE,
    
    -- 索引
    INDEX idx_choice_event (choice_event_id),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='选择选项表';

-- ====================================================
-- 6. 插入测试数据
-- ====================================================

-- 插入测试书籍（如果不存在）
INSERT IGNORE INTO character_books (
    book_code, title, subtitle, description, 
    cover_image_data, theme_config, 
    start_year, end_year, display_order, like_count, status,
    is_uploaded, is_completed, author, user_token
) VALUES 
(
    'test_life',
    '测试人生',
    '用于测试的人生轨迹',
    '这是一个测试书籍，包含各种人生抉择和年度事件的示例。',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjMDA3YWZmIiByeD0iMTAiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iNjAwIj7mtYvor5U8L3RleHQ+PC9zdmc+',
    JSON_OBJECT(
        'primaryColor', '#007aff',
        'backgroundColor', '#007aff',
        'backgroundGradient', 'linear-gradient(135deg, #007aff 0%, #005cbf 100%)',
        'startYear', 1995,
        'endYear', 2025
    ),
    1995, 2025, 999, 0, 1, 0, 0, '测试用户', 'test_user_token_123'
);

-- 获取测试书籍的ID
SET @test_book_id = (SELECT id FROM character_books WHERE book_code = 'test_life');

-- 插入人生抉择事件测试数据
INSERT IGNORE INTO personal_choice_events (
    book_id, year, event_code, question, description, 
    is_starting_event, display_order
) VALUES 
(@test_book_id, 1995, 'START', '人生的起点', '每个人都有自己的起点，你会如何开始？', 1, 1),
(@test_book_id, 2000, 'CAREER', '职业选择', '千禧年到了，面临重要的职业选择...', 0, 2),
(@test_book_id, 2010, 'FAMILY', '家庭规划', '三十而立，是时候考虑家庭了...', 0, 3);

-- 插入选择选项测试数据
INSERT INTO choice_options (
    choice_event_id, option_text, effect, next_event_code, 
    is_next_year, action_type, sort_order
) VALUES 
-- 人生起点的选项
((SELECT id FROM personal_choice_events WHERE book_id = @test_book_id AND event_code = 'START'), 
 '努力学习', '勤奋好学，为未来打好基础', 'CAREER', 0, 'JUMP_TO_NEXT', 1),
((SELECT id FROM personal_choice_events WHERE book_id = @test_book_id AND event_code = 'START'), 
 '快乐成长', '享受童年，保持天真烂漫', 'CAREER', 0, 'JUMP_TO_NEXT', 2),

-- 职业选择的选项
((SELECT id FROM personal_choice_events WHERE book_id = @test_book_id AND event_code = 'CAREER'), 
 '成为程序员', '进入IT行业，薪资高但压力大', 'FAMILY', 0, 'JUMP_TO_NEXT', 1),
((SELECT id FROM personal_choice_events WHERE book_id = @test_book_id AND event_code = 'CAREER'), 
 '成为教师', '教书育人，稳定但收入一般', 'FAMILY', 0, 'JUMP_TO_NEXT', 2),
((SELECT id FROM personal_choice_events WHERE book_id = @test_book_id AND event_code = 'CAREER'), 
 '自由职业', '做自己喜欢的事，收入不稳定', 'FAMILY', 0, 'JUMP_TO_NEXT', 3),

-- 家庭规划的选项
((SELECT id FROM personal_choice_events WHERE book_id = @test_book_id AND event_code = 'FAMILY'), 
 '结婚生子', '组建家庭，承担更多责任', NULL, 1, 'SHOW_EFFECT', 1),
((SELECT id FROM personal_choice_events WHERE book_id = @test_book_id AND event_code = 'FAMILY'), 
 '专注事业', '暂时不考虑家庭，专心工作', NULL, 1, 'SHOW_EFFECT', 2);

-- 插入年度事件测试数据（使用timeline_events表）
INSERT IGNORE INTO timeline_events (
    book_id, year, title, description, impact, tags, display_order
) VALUES 
(@test_book_id, 1995, '测试开始', '人生测试的第一年', '中等', '["测试"]', 1),
(@test_book_id, 2000, '新千年', '进入了新的千年，充满希望', '中等', '["里程碑"]', 2),
(@test_book_id, 2010, '而立之年', '三十岁了，该立业成家了', '高', '["成长", "责任"]', 3),
(@test_book_id, 2020, '不惑之年', '四十岁了，对人生有了更深的理解', '高', '["智慧", "成熟"]', 4);

-- ====================================================
-- 完成迁移
-- ====================================================

-- 显示迁移结果
SELECT '数据库迁移完成！' as status;

-- 显示表结构信息
SELECT 
    TABLE_NAME as '表名',
    TABLE_ROWS as '记录数',
    TABLE_COMMENT as '说明'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME IN ('character_books', 'personal_choice_events', 'choice_options', 'timeline_events', 'event_options')
ORDER BY TABLE_NAME; 