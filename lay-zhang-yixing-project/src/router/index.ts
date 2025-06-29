// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/',                 name: 'ArtistJourney',       component: () => import('@/views/ArtistJourney.vue') },
  
  /* 主页 */
  { path: '/home',             name: 'HomePage',            component: () => import('@/views/HomePage.vue') },
  
  /* 移动端页面 */
  { path: '/mobile',           name: 'MobileArtistJourney', component: () => import('@/views/MobileArtistJourney.vue') },



  /* 音乐3D页面 */  
  { path: '/music3d',          name: 'Music3D',             component: () => import('@/views/Music3D.vue') },
  { path: '/test-music',       name: 'testMusic',           component: () => import('@/views/TestMusic.vue') },
  
  /* 留言墙页面 */
  { path: '/message-wall',     name: 'MessageWall',         component: () => import('@/views/Gallery.vue') },
  
  /* 透明波纹演示页面 */
  { path: '/ripple-demo',      name: 'RippleDemo',          component: () => import('@/views/RippleDemo.vue') },

  /* 折射光效果演示页面 */
  { path: '/refraction-demo',  name: 'RefractionDemo',      component: () => import('@/views/RefractionDemo.vue') },

  /* 沉浸式照片墙演示页面 */
  { path: '/portfolio-gallery', name: 'PortfolioGalleryDemo', component: () => import('@/views/PortfolioGalleryDemo.vue') },

  { path: '/landing-3d',       name: 'Landing3D',           component: () => import('@/views/Landing3D.vue') },

  /* 唯一的 /timeline */
  { path: '/timeline',         name: 'Timeline',            component: () => import('@/views/TimelinePage.vue') },

  { path: '/year/:year(\\d{4})', name: 'YearDetail', props: true,
    component: () => import('@/views/YearDetail.vue') },

  /* 后台 */
  { path: '/x-back',           name: 'AdminLogin',          component: () => import('@/views/AdminLogin.vue') },
  { path: '/x-back/dashboard', name: 'AdminDashboard', meta: { requiresAuth: true },
    component: () => import('@/views/AdminDashboard.vue') },


  /* 404 → 首页 */  
  { path: '/:pathMatch(.*)*',  redirect: '/' }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
