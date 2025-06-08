<!--
 * @file src/components/timeline/YearCard.vue
 * 年份卡片组件
 -->

<template>
  <div 
    class="year-card"
    :class="{ 'is-active': isActive }"
    @click="handleClick"
  >
    <div class="card-content">
      <h2 class="year">{{ year }}</h2>
      <div class="cover" v-if="cover">
        <img 
          :src="cover" 
          :alt="`${year}年封面`"
          loading="lazy"
        />
      </div>
      <p class="description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimelineStore } from '@/store/timeline';
import gsap from 'gsap';
import { useRouter } from 'vue-router';

const props = defineProps<{
  year: number;
  cover?: string;
  description: string;
  isActive?: boolean;
}>();

const router = useRouter();
const store = useTimelineStore();

// 点击卡片跳转到详情页
const handleClick = () => {
  router.push(`/year/${props.year}`);
};

// 卡片动画
const animateCard = (element: HTMLElement, isActive: boolean) => {
  gsap.to(element, {
    scale: isActive ? 1.05 : 1,
    boxShadow: isActive 
      ? '0 20px 40px rgba(0,0,0,0.3)' 
      : '0 10px 20px rgba(0,0,0,0.1)',
    duration: 0.5,
    ease: 'power2.out'
  });
};

// 监听激活状态变化
const cardRef = ref<HTMLElement | null>(null);
watch(() => props.isActive, (newValue) => {
  if (cardRef.value) {
    animateCard(cardRef.value, newValue);
  }
});
</script>

<style lang="scss" scoped>
.year-card {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  .card-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    padding: 2rem;
    max-width: 800px;
    width: 100%;
    transform-origin: center;
    
    .year {
      font-size: 4rem;
      font-weight: bold;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #fff, #ccc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .cover {
      width: 100%;
      aspect-ratio: 16/9;
      overflow: hidden;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }
    
    .description {
      font-size: 1.2rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  &:hover {
    .cover img {
      transform: scale(1.05);
    }
  }
  
  &.is-active {
    z-index: 1;
  }
}
</style> 
 * @file src/components/timeline/YearCard.vue
 * 年份卡片组件
 -->

<template>
  <div 
    class="year-card"
    :class="{ 'is-active': isActive }"
    @click="handleClick"
  >
    <div class="card-content">
      <h2 class="year">{{ year }}</h2>
      <div class="cover" v-if="cover">
        <img 
          :src="cover" 
          :alt="`${year}年封面`"
          loading="lazy"
        />
      </div>
      <p class="description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimelineStore } from '@/store/timeline';
import gsap from 'gsap';
import { useRouter } from 'vue-router';

const props = defineProps<{
  year: number;
  cover?: string;
  description: string;
  isActive?: boolean;
}>();

const router = useRouter();
const store = useTimelineStore();

// 点击卡片跳转到详情页
const handleClick = () => {
  router.push(`/year/${props.year}`);
};

// 卡片动画
const animateCard = (element: HTMLElement, isActive: boolean) => {
  gsap.to(element, {
    scale: isActive ? 1.05 : 1,
    boxShadow: isActive 
      ? '0 20px 40px rgba(0,0,0,0.3)' 
      : '0 10px 20px rgba(0,0,0,0.1)',
    duration: 0.5,
    ease: 'power2.out'
  });
};

// 监听激活状态变化
const cardRef = ref<HTMLElement | null>(null);
watch(() => props.isActive, (newValue) => {
  if (cardRef.value) {
    animateCard(cardRef.value, newValue);
  }
});
</script>

<style lang="scss" scoped>
.year-card {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  .card-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    padding: 2rem;
    max-width: 800px;
    width: 100%;
    transform-origin: center;
    
    .year {
      font-size: 4rem;
      font-weight: bold;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #fff, #ccc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .cover {
      width: 100%;
      aspect-ratio: 16/9;
      overflow: hidden;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }
    
    .description {
      font-size: 1.2rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  &:hover {
    .cover img {
      transform: scale(1.05);
    }
  }
  
  &.is-active {
    z-index: 1;
  }
}
</style> 