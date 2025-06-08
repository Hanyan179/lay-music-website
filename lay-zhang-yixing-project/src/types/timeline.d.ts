/**
 * @file src/types/timeline.d.ts
 * 时间轴数据模型类型定义
 */

export interface TimelineEventDTO {
    id: number;
    title: string;
    description: string;
    imagePath: string | null;
    tags: string[];
    timestamp: string; // ISO日期字符串
}

export interface TimelineYearDTO {
    year: number;
    events: TimelineEventDTO[];
}

// 场景背景色预设
export const SCENE_BACKGROUNDS = [
    '#1a1a2e', // 深蓝
    '#16213e', // 靛蓝
    '#0f3460', // 藏青
    '#533483', // 紫蓝
    '#e94560'  // 玫红
] as const;

// 相机动画参数
export interface CameraAnimationParams {
    startZ: number;
    endZ: number;
    duration: number;
}

// 卡片动画参数
export interface CardAnimationParams {
    scale: number;
    duration: number;
    ease: string;
} 
 * @file src/types/timeline.d.ts
 * 时间轴数据模型类型定义
 */

export interface TimelineEventDTO {
    id: number;
    title: string;
    description: string;
    imagePath: string | null;
    tags: string[];
    timestamp: string; // ISO日期字符串
}

export interface TimelineYearDTO {
    year: number;
    events: TimelineEventDTO[];
}

// 场景背景色预设
export const SCENE_BACKGROUNDS = [
    '#1a1a2e', // 深蓝
    '#16213e', // 靛蓝
    '#0f3460', // 藏青
    '#533483', // 紫蓝
    '#e94560'  // 玫红
] as const;

// 相机动画参数
export interface CameraAnimationParams {
    startZ: number;
    endZ: number;
    duration: number;
}

// 卡片动画参数
export interface CardAnimationParams {
    scale: number;
    duration: number;
    ease: string;
} 