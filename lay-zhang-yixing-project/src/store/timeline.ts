/**
 * @file src/store/timeline.ts
 * 时间轴状态管理
 */

import { timelineApi } from '@/api/timeline';
import type { TimelineYearDTO } from '@/types/timeline';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTimelineStore = defineStore('timeline', () => {
    const years = ref<TimelineYearDTO[]>([]);
    const activeIndex = ref(0);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // 获取时间轴数据
    const fetchTimelineData = async () => {
        isLoading.value = true;
        error.value = null;
        
        try {
            const response = await timelineApi.getTimeline();
            years.value = response.data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : '获取时间轴数据失败';
            console.error('获取时间轴数据失败:', err);
        } finally {
            isLoading.value = false;
        }
    };

    // 获取指定年份数据
    const getYearData = (year: number) => {
        return years.value.find(y => y.year === year);
    };

    return {
        years,
        activeIndex,
        isLoading,
        error,
        fetchTimelineData,
        getYearData
    };
}); 