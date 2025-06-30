<template>
  <div class="home-page" style="margin: 0; padding: 0; height: 100vh; overflow-x: hidden;">


        <!-- 主要内容区域 -->
    <div class="wrapper" style="margin: 0; padding: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100vh;">
      <div 
        class="page-header section-dark" 
        :style="{ 
          backgroundImage: 'url(/img/ddee8f80-67aa-434a-8880-6b73179f0530.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          transform: `translate3d(0, ${parallaxOffset}px, 0)`,
          margin: '0',
          padding: '0',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100vh'
        }"
        ref="bigImage"
      >
        <div class="filter"></div>
        <div class="content-center">
          <div class="container">
            <div class="title-brand">
              <h1 class="presentation-title">SITE TITLE</h1>
              <div class="fog-low">
                <img src="http://demos.creative-tim.com/paper-kit-2/assets/img/fog-low.png" alt="">
              </div>
              <div class="fog-low right">
                <img src="http://demos.creative-tim.com/paper-kit-2/assets/img/fog-low.png" alt="">
              </div>
            </div>
            <h2 class="presentation-subtitle text-center">Headline</h2>
          </div>
        </div>
        <div 
          class="moving-clouds" 
          style="background-image: url('http://demos.creative-tim.com/paper-kit-2/assets/img/clouds.png');"
        ></div>
      </div>
    </div>


  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'HomePage',
  setup() {
    const parallaxOffset = ref(0)
    const bigImage = ref(null)

    let scrollTimeout = null

    // 防抖函数
    const debounce = (func, wait) => {
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(scrollTimeout)
          func(...args)
        }
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(later, wait)
      }
    }

    // 视差滚动效果
    const checkScrollForPresentationPage = debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      parallaxOffset.value = scrollTop / 3
    }, 4)

    // 处理滚动事件
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        checkScrollForPresentationPage()
      }
    }

    onMounted(() => {
      // 添加滚动监听
      window.addEventListener('scroll', handleScroll)
      
      // 设置初始状态
      handleScroll()
    })

    onUnmounted(() => {
      // 清理事件监听
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    })

    return {
      parallaxOffset,
      bigImage
    }
  }
}
</script>

<style scoped>
/* 导入原始CSS文件 */
@import '../styles/home-page.css';

/* 重置页面边距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Vue特定样式 */
.home-page {
  margin: 0 !important;
  padding: 0 !important;
  min-height: 100vh;
  position: relative;
}

/* 确保主要内容从顶部开始 */
.wrapper {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.page-header {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
</style> 