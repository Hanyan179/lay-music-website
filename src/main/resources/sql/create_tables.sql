-- Fate Echoes 数据库表创建脚本
-- 执行此脚本前请确保数据库为空或备份现有数据

-- 设置字符集和排序规则
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ====================================================
-- 1. 角色书籍主表 (character_books)
-- ====================================================
CREATE TABLE IF NOT EXISTS character_books (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '书籍ID',
    
    -- 基本信息
    book_code VARCHAR(50) NOT NULL UNIQUE COMMENT '书籍唯一标识符（如：ordinary_life）',
    title VARCHAR(100) NOT NULL COMMENT '书籍标题',
    subtitle VARCHAR(200) COMMENT '书籍副标题',
    description TEXT COMMENT '书籍描述',
    
    -- 图片信息
    cover_image_path VARCHAR(500) COMMENT '封面图片存储路径',
    cover_image_data LONGTEXT COMMENT '封面图片base64数据（备用）',
    
    -- 主题配置（JSON格式存储）
    theme_config JSON COMMENT '主题配置JSON数据',
    
    -- 时间范围
    start_year INT NOT NULL DEFAULT 1995 COMMENT '故事起始年份',
    end_year INT NOT NULL DEFAULT 2025 COMMENT '故事结束年份',
    
    -- 状态管理
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    display_order INT NOT NULL DEFAULT 0 COMMENT '显示排序，数字越小越靠前',
    
    -- 统计信息
    play_count BIGINT DEFAULT 0 COMMENT '游玩次数',
    like_count BIGINT DEFAULT 0 COMMENT '点赞次数',
    
    -- 个人事件和历史
    personal_events_config JSON COMMENT '个人事件配置JSON数据',
    current_event_id VARCHAR(100) COMMENT '当前事件ID',
    event_history JSON COMMENT '事件历史记录JSON数据',
    
    -- 作者信息
    author VARCHAR(100) COMMENT '作者',
    
    -- 用户和状态字段
    is_uploaded TINYINT NOT NULL DEFAULT 0 COMMENT '是否已上传：0-未上传，1-已上传',
    is_completed TINYINT NOT NULL DEFAULT 0 COMMENT '是否已完成著作：0-未完成，1-已完成',
    user_token VARCHAR(100) COMMENT '用户Token（浏览器生成的用户标识）',
    
    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建者',
    updated_by VARCHAR(50) COMMENT '更新者',
    
    -- 索引
    INDEX idx_book_code (book_code),
    INDEX idx_status_order (status, display_order),
    INDEX idx_like_count (like_count DESC),
    INDEX idx_created_at (created_at),
    INDEX idx_user_token (user_token),
    INDEX idx_upload_status (is_uploaded, is_completed, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色书籍主表';

-- ====================================================
-- 2. 人生抉择事件表 (personal_choice_events)
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
    after_description TEXT COMMENT '事后描述（用于自定义成功/失败提示文案）',
    
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
-- 3. 选择选项表 (choice_options)
-- ====================================================
CREATE TABLE IF NOT EXISTS choice_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '选项ID',
    choice_event_id BIGINT NOT NULL COMMENT '所属人生抉择事件ID',
    option_text VARCHAR(255) NOT NULL COMMENT '选项文本',
    effect TEXT COMMENT '选择后果描述',
    next_event_code VARCHAR(10) COMMENT '下一个事件代码',
    is_next_year TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否进入下一年',
    action_type ENUM('SHOW_EFFECT', 'JUMP_TO_NEXT') NOT NULL DEFAULT 'SHOW_EFFECT' COMMENT '操作类型',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
    tags TEXT COMMENT '标签提示（JSON格式）',
    after_description TEXT COMMENT '事后描述（选择后的详细反馈）',
    
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
-- 4. 年度事件表 (timeline_events) - 重命名并规范化现有events表
-- ====================================================
DROP TABLE IF EXISTS events;
CREATE TABLE IF NOT EXISTS timeline_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '事件ID',
    book_id BIGINT NOT NULL COMMENT '所属书籍ID',
    year INT NOT NULL COMMENT '事件发生年份',
    title VARCHAR(200) NOT NULL COMMENT '事件标题',
    description TEXT COMMENT '事件详细描述',
    
    -- 媒体相关字段
    media_type VARCHAR(20) COMMENT '媒体类型：image, video',
    media_url TEXT COMMENT '媒体文件URL',
    media_poster TEXT COMMENT '视频缩略图URL',
    
    -- 事件属性
    impact VARCHAR(20) DEFAULT '中等' COMMENT '影响等级：低, 中等, 高, 极高',
    tags JSON COMMENT '事件标签数组',
    display_order INT NOT NULL DEFAULT 0 COMMENT '显示顺序',
    
    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 外键约束
    FOREIGN KEY (book_id) REFERENCES character_books(id) ON DELETE CASCADE,
    
    -- 索引
    INDEX idx_book_year (book_id, year),
    INDEX idx_title (title),
    INDEX idx_impact (impact),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='年度事件表';

-- ====================================================
-- 5. 重命名并规范化现有options表为event_options
-- ====================================================
DROP TABLE IF EXISTS options;
CREATE TABLE IF NOT EXISTS event_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '选项ID',
    event_id BIGINT NOT NULL COMMENT '所属事件ID（可能是timeline_events或其他事件表）',
    event_type ENUM('TIMELINE', 'CHOICE') NOT NULL DEFAULT 'TIMELINE' COMMENT '事件类型',
    option_text VARCHAR(500) NOT NULL COMMENT '选项文本',
    option_value VARCHAR(100) COMMENT '选项值',
    is_default TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否为默认选项',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
    
    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 索引
    INDEX idx_event (event_id, event_type),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='事件选项表（通用）';

-- ====================================================
-- 插入测试数据
-- ====================================================

-- 插入书籍测试数据
INSERT INTO character_books (
    book_code, title, subtitle, description, 
    cover_image_data, theme_config, 
    start_year, end_year, display_order, like_count, status,
    is_uploaded, is_completed, author, user_token
) VALUES 
(
    'ordinary_life',
    '允许平凡',
    '一个普通人的人生轨迹',
    '体验平凡而真实的人生，在平淡中寻找生活的意义和小确幸。',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxkZWZzPiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4gICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjVmNWY3O3N0b3Atb3BhY2l0eToxIiAvPiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U4ZThlZDtzdG9wLW9wYWNpdHk6MSIgLz4gICAgPC9saW5lYXJHcmFkaWVudD4gIDwvZGVmcz4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWQxKSIgcng9IjEwIi8+ICA8cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMjAiIGZpbGw9IiM4Njg2OGIiIHJ4PSI0Ii8+ICA8cmVjdCB4PSIyMCIgeT0iODAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTAiIGZpbGw9IiNjNmM2Y2QiIHJ4PSI0Ii8+ICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNjAiIHI9IjMwIiBmaWxsPSIjODY4NjhiIiBvcGFjaXR5PSIwLjMiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMWQxZDFmIiBmb250LXdlaWdodD0iNjAwIj7lhYHorrjlubPlh6E8L3RleHQ+PC9zdmc+',
    JSON_OBJECT(
        'primaryColor', '#86868b',
        'backgroundColor', '#f5f5f7',
        'backgroundGradient', 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%)',
        'startYear', 1995,
        'endYear', 2025
    ),
    1995, 2025, 1, 156, 1, 1, 1, '系统管理员', NULL
),
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
    1995, 2025, 2, 0, 1, 0, 0, '测试用户', 'test_user_token_123'
);

-- 插入人生抉择事件测试数据
INSERT INTO personal_choice_events (
    book_id, year, event_code, question, description, 
    is_starting_event, display_order, after_description
) VALUES 
-- 允许平凡的人生抉择
(1, 1995, 'A', '高考后的选择', '高考结束了，面对人生的第一个重要选择点...', 1, 1, '你做出了明智的选择，这将影响你的未来发展方向。'),
(1, 1999, 'B', '大学毕业后的人生方向', '大学即将毕业，你需要决定未来的道路...', 0, 2, '这个决定将开启你人生的新篇章。'),
(1, 2005, 'C', '是否结婚安家', '遇到了生命中的那个人，是时候考虑人生大事了...', 0, 3, '爱情的选择没有对错，只有适合与否。'),

-- 测试人生的人生抉择
(2, 1995, 'START', '人生的起点', '每个人都有自己的起点，你会如何开始？', 1, 1, '良好的开始是成功的一半。'),
(2, 2000, 'CAREER', '职业选择', '千禧年到了，面临重要的职业选择...', 0, 2, '职业道路的选择将决定你的人生轨迹。');

-- 插入选择选项测试数据
INSERT INTO choice_options (
    choice_event_id, option_text, effect, next_event_code, 
    is_next_year, action_type, sort_order, tags
) VALUES 
-- 高考后的选择 (事件A)
(1, '选择名牌大学', '进入985高校，学习压力很大但机会更多', 'B', 0, 'JUMP_TO_NEXT', 1, '["名校", "高压力"]'),
(1, '选择普通大学', '生活比较轻松，有更多时间发展兴趣爱好', 'B', 0, 'JUMP_TO_NEXT', 2, '["普通大学", "低压力"]'),
(1, '选择专科学校', '快速进入社会，提早积累工作经验', 'B', 0, 'JUMP_TO_NEXT', 3, '["专科学校", "快速进入社会"]'),

-- 大学毕业后的人生方向 (事件B)
(2, '考研深造', '继续学习，提升学历，延迟进入社会', 'C', 0, 'JUMP_TO_NEXT', 1, '["考研", "提升学历"]'),
(2, '直接工作', '进入职场，开始赚钱养活自己', 'C', 0, 'JUMP_TO_NEXT', 2, '["直接工作", "进入职场"]'),
(2, '创业尝试', '趁年轻拼一把，虽然风险很大', 'C', 0, 'JUMP_TO_NEXT', 3, '["创业尝试", "风险大"]'),

-- 是否结婚安家 (事件C)
(3, '选择结婚', '步入婚姻殿堂，开始新的人生阶段', NULL, 1, 'SHOW_EFFECT', 1, '["结婚", "新的人生阶段"]'),
(3, '继续单身', '享受自由，专注事业发展', NULL, 1, 'SHOW_EFFECT', 2, '["单身", "自由"]'),

-- 测试人生的选项
(4, '努力学习', '勤奋好学，为未来打好基础', 'CAREER', 0, 'JUMP_TO_NEXT', 1, '["勤奋好学", "为未来打好基础"]'),
(4, '快乐成长', '享受童年，保持天真烂漫', 'CAREER', 0, 'JUMP_TO_NEXT', 2, '["快乐成长", "保持天真烂漫"]'),

(5, '成为程序员', '进入IT行业，薪资高但压力大', NULL, 1, 'SHOW_EFFECT', 1, '["进入IT行业", "薪资高"]'),
(5, '成为教师', '教书育人，稳定但收入一般', NULL, 1, 'SHOW_EFFECT', 2, '["成为教师", "稳定收入"]'),
(5, '自由职业', '做自己喜欢的事，收入不稳定', NULL, 1, 'SHOW_EFFECT', 3, '["自由职业", "收入不稳定"]');

-- 插入年度事件测试数据
INSERT INTO timeline_events (
    book_id, year, title, description, impact, tags, display_order
) VALUES 
-- 允许平凡的年度事件
(1, 1995, '高中毕业', '完成了高中学业，准备迎接人生新阶段', '高', '["教育", "成长"]', 1),
(1, 1996, '大学入学', '踏进大学校园，开始了独立生活', '高', '["教育", "独立"]', 2),
(1, 1999, '大学毕业', '完成了高等教育，准备步入社会', '高', '["教育", "转折"]', 3),
(1, 2000, '第一份工作', '找到了人生第一份正式工作', '中等', '["工作", "成长"]', 4),
(1, 2005, '买房结婚', '有了自己的小家，人生进入新阶段', '极高', '["家庭", "成就"]', 5),

-- 测试人生的年度事件
(2, 1995, '测试开始', '人生测试的第一年', '中等', '["测试"]', 1),
(2, 2000, '新千年', '进入了新的千年，充满希望', '中等', '["里程碑"]', 2),
(2, 2010, '而立之年', '三十岁了，该立业成家了', '高', '["成长", "责任"]', 3);

-- 完成数据插入
SELECT '数据库表创建完成！' as status; 