import type { ApiResponse, TimelineEvent, TimelineYearDTO } from '@/types/timeline';
import axios from 'axios';

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export const timelineApi = {
  // 获取时间轴数据
  getTimeline: () => 
    request.get<ApiResponse<TimelineYearDTO[]>>('/timeline'),
    
  // 获取指定年份数据
  getYearData: (year: number) =>
    request.get<ApiResponse<TimelineYearDTO>>(`/timeline/${year}`),
    
  // 获取事件详情
  getEventDetail: (eventId: number) =>
    request.get<ApiResponse<TimelineEvent>>(`/timeline/event/${eventId}`)
}; 