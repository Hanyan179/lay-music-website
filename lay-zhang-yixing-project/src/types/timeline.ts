// 时间轴事件
export interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  imagePath?: string;
  tags: string[];
}

// 年份数据
export interface TimelineYearDTO {
  year: number;
  events: TimelineEvent[];
}

// API 响应
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 场景背景色常量
export const SCENE_BACKGROUNDS = [
  0x87CEEB, // 天蓝色
  0x4169E1, // 皇室蓝
  0x6495ED, // 矢车菊蓝
  0x1E90FF, // 道奇蓝
  0x00BFFF, // 深天蓝色
]; 