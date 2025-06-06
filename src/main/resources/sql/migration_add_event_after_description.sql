-- 为personal_choice_events表添加after_description字段的迁移脚本
-- 执行时间：2025-06-03

-- 添加after_description字段
ALTER TABLE personal_choice_events 
ADD COLUMN after_description TEXT COMMENT '事后描述（用于自定义成功/失败提示文案）' 
AFTER display_order;

-- 更新现有数据，设置默认的事后描述
UPDATE personal_choice_events 
SET after_description = CASE 
    WHEN event_code = 'A' THEN '你做出了明智的选择，这将影响你的未来发展方向。'
    WHEN event_code = 'B' THEN '这个决定将开启你人生的新篇章。'
    WHEN event_code = 'C' THEN '爱情的选择没有对错，只有适合与否。'
    WHEN event_code = 'START' THEN '良好的开始是成功的一半。'
    WHEN event_code = 'CAREER' THEN '职业道路的选择将决定你的人生轨迹。'
    ELSE '你的选择将影响未来的人生道路。'
END
WHERE after_description IS NULL;

-- 验证数据
SELECT id, event_code, question, after_description 
FROM personal_choice_events 
ORDER BY book_id, year, display_order
LIMIT 10; 