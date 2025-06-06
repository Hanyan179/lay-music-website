-- 为character_books表添加新字段
-- 执行此脚本前请备份数据库

-- 添加新字段
ALTER TABLE character_books 
ADD COLUMN is_uploaded TINYINT NOT NULL DEFAULT 0 COMMENT '是否已上传：0-未上传，1-已上传' AFTER author,
ADD COLUMN is_completed TINYINT NOT NULL DEFAULT 0 COMMENT '是否已完成著作：0-未完成，1-已完成' AFTER is_uploaded,
ADD COLUMN user_token VARCHAR(100) COMMENT '用户Token（浏览器生成的用户标识）' AFTER is_completed;

-- 添加新索引
ALTER TABLE character_books 
ADD INDEX idx_user_token (user_token),
ADD INDEX idx_upload_status (is_uploaded, is_completed, status);

-- 更新现有数据，将所有现有书籍标记为已完成且已上传（公开）
UPDATE character_books 
SET is_uploaded = 1, is_completed = 1, author = COALESCE(author, '系统管理员')
WHERE status = 1;

-- 验证更新结果
SELECT book_code, title, is_uploaded, is_completed, user_token, author 
FROM character_books 
ORDER BY display_order; 