-- 角色书籍主表
CREATE TABLE character_books (
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
    
    -- 新增字段
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

-- 插入初始数据
INSERT INTO character_books (
    book_code, title, subtitle, description, 
    cover_image_data, theme_config, 
    start_year, end_year, display_order, like_count, status,
    is_uploaded, is_completed, author
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
        'backgroundGradient', 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%)'
    ),
    1995, 2025, 1, 156, 1, 1, 1, '系统管理员'
),
(
    'ambitious_journey',
    '雄心壮志', 
    '追求卓越的人生之路',
    '踏上充满挑战的征程，在激烈竞争中追求成功与荣耀。',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxkZWZzPiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4gICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY5NTAwO3N0b3Atb3BhY2l0eToxIiAvPiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNWEwMDtzdG9wLW9wYWNpdHk6MSIgLz4gICAgPC9saW5lYXJHcmFkaWVudD4gIDwvZGVmcz4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWQyKSIgcng9IjEwIi8+ICA8cG9seWdvbiBwb2ludHM9IjEwMCw2MCA4MCwxMDAgMTIwLDEwMCIgZmlsbD0iI2ZmZiIvPiAgPHJlY3QgeD0iODAiIHk9IjEyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIiByeD0iNCIvPiAgPHRleHQgeD0iMTAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNmZmYiIGZvbnQtd2VpZ2h0PSI2MDAiPumboOW/gOWjiOW/lzwvdGV4dD48L3N2Zz4=',
    JSON_OBJECT(
        'primaryColor', '#ff9500',
        'backgroundColor', '#ff6b35',
        'backgroundGradient', 'linear-gradient(135deg, #ff9500 0%, #ff6b35 50%, #ff5a00 100%)'
    ),
    1990, 2030, 2, 230, 1, 1, 1, '系统管理员'
),
(
    'creative_soul',
    '艺术人生',
    '用创意点亮世界',
    '用艺术的眼光看世界，在创作中寻找自我表达和心灵的自由。',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxkZWZzPiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4gICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTc4YmZhO3N0b3Atb3BhY2l0eToxIiAvPiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhlNWNmNjtzdG9wLW9wYWNpdHk6MSIgLz4gICAgPC9saW5lYXJHcmFkaWVudD4gIDwvZGVmcz4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWQzKSIgcng9IjEwIi8+ICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjgwIiByPSIxNSIgZmlsbD0iI2ZmZiIvPiAgPGNpcmNsZSBjeD0iMTQwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+ICA8Y2lyY2xlIGN4PSI4MCIgY3k9IjE2MCIgcj0iMTAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPiAgPHBhdGggZD0iTTEwMCAxODBRMTIwIDIwMCAxNDAgMTgwUTE2MCAyMDAgMTgwIDE4MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iNjAwIj7opo/mnK/kurrnlJ88L3RleHQ+PC9zdmc+',
    JSON_OBJECT(
        'primaryColor', '#a78bfa',
        'backgroundColor', '#8b5cf6',
        'backgroundGradient', 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)'
    ),
    1995, 2025, 3, 189, 1, 1, 1, '系统管理员'
),
(
    'adventurous_spirit',
    '冒险精神',
    '探索未知的勇敢征程',
    '拥抱未知，勇敢探索，在冒险中发现人生的无限可能。',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxkZWZzPiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQ0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4gICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzRjNzU5O3N0b3Atb3BhY2l0eToxIiAvPiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzEwYjk4MTtzdG9wLW9wYWNpdHk6MSIgLz4gICAgPC9saW5lYXJHcmFkaWVudD4gIDwvZGVmcz4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWQ0KSIgcng9IjEwIi8+ICA8cGF0aCBkPSJNNTAgODBMMTAwIDUwTDE1MCA4MEwxMDAgMTEwWiIgZmlsbD0iI2ZmZiIvPiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSI4IiBmaWxsPSIjZmZmIi8+ICA8bGluZSB4MT0iMTAwIiB5MT0iMTUwIiB4Mj0iMTAwIiB5Mj0iMTIwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIvPiAgPGxpbmUgeDE9IjEwMCIgeTE9IjE1MCIgeDI9IjEyMCIgeTI9IjE0MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjMiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iNjAwIj7lhqLpmanjsr7npZ48L3RleHQ+PC9zdmc+',
    JSON_OBJECT(
        'primaryColor', '#34c759',
        'backgroundColor', '#10b981',
        'backgroundGradient', 'linear-gradient(135deg, #34c759 0%, #10b981 50%, #059669 100%)'
    ),
    1995, 2025, 4, 98, 1, 1, 1, '系统管理员'
); 