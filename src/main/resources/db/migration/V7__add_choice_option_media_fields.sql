-- 为choice_options表添加媒体相关字段
ALTER TABLE choice_options 
ADD COLUMN media_url VARCHAR(500) COMMENT '选项媒体文件URL',
ADD COLUMN media_type VARCHAR(20) COMMENT '媒体类型（image/video）';

-- 创建索引提高查询性能
CREATE INDEX idx_choice_options_media_type ON choice_options(media_type);

-- 添加注释
ALTER TABLE choice_options COMMENT = '选择选项表 - 包含媒体文件支持'; 