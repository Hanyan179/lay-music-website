-- 为choice_options表添加after_description字段的迁移脚本
-- 执行时间：2025-06-03

-- 添加after_description字段
ALTER TABLE choice_options 
ADD COLUMN after_description TEXT COMMENT '事后描述（选择后的详细反馈）' 
AFTER tags;

-- 更新现有数据，将effect字段的值复制到after_description字段作为默认值
UPDATE choice_options 
SET after_description = effect 
WHERE after_description IS NULL;

-- 验证数据
SELECT id, option_text, effect, after_description 
FROM choice_options 
LIMIT 10; 