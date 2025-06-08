import AdminDashboard from '@/views/AdminDashboard.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import ArtistJourney from '@/views/ArtistJourney.vue'
import Home from '@/views/Home.vue'
import Timeline3D from '@/views/Timeline3D.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'ArtistJourney',
    component: ArtistJourney
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/artist-journey',
    name: 'ArtistJourneyAlias',
    component: ArtistJourney
  },
  {
    path: '/timeline',
    name: 'Timeline3D',
    component: Timeline3D
  },
  {
    path: '/x-back',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/x-back/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  { path: '/timeline', name: 'Timeline', component: () => import('@/views/TimelinePage.vue') }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 