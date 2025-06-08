<!--
 * @file src/views/YearDetail.vue
 * 年份详情页
 -->

<template>
  <div class="year-detail">
    <BackTop text="返回时间轴" @click="router.back()" />
    
    <div class="content" v-if="yearData">
      <h1 class="year-title">{{ yearData.year }}年</h1>
      
      <div class="events-grid">
        <div 
          v-for="event in yearData.events" 
          :key="event.id"
          class="event-card"
        >
          <div class="event-image" v-if="event.imagePath">
            <img 
              :src="event.imagePath" 
              :alt="event.title"
              loading="lazy"
            />
          </div>
          
          <div class="event-content">
            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-date">{{ formatDate(event.timestamp) }}</p>
            <p class="event-description">{{ event.description }}</p>
            
            <div class="event-tags" v-if="event.tags.length">
              <span 
                v-for="tag in event.tags" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="loading" v-else-if="store.isLoading">
      加载中...
    </div>
    
    <div class="error" v-else-if="store.error">
      {{ store.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import BackTop from '@/components/timeline/BackTop.vue';
import { useTimelineStore } from '@/store/timeline';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const store = useTimelineStore();

// 获取年份数据
const year = computed(() => Number(route.params.year));
const yearData = computed(() => 
  store.years.find(y => y.year === year.value)
);

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 加载数据
onMounted(async () => {
  if (store.years.length === 0) {
    await store.fetchTimelineData();
  }
});
</script>

<style lang="scss" scoped>
.year-detail {
  min-height: 100vh;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  
  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 5rem;
    
    .year-title {
      font-size: 4rem;
      font-weight: bold;
      margin-bottom: 3rem;
      text-align: center;
      background: linear-gradient(45deg, #fff, #ccc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      
      .event-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 1rem;
        overflow: hidden;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: translateY(-5px);
        }
        
        .event-image {
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
        }
        
        .event-content {
          padding: 1.5rem;
          
          .event-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          
          .event-date {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }
          
          .event-description {
            line-height: 1.6;
            margin-bottom: 1rem;
          }
          
          .event-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            
            .tag {
              padding: 0.3rem 0.8rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 1rem;
              font-size: 0.9rem;
            }
          }
        }
      }
    }
  }
  
  .loading,
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1.2rem;
  }
  
  .error {
    color: #ff4d4f;
  }
}
</style> 