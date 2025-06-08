import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ArtistJourney from '@/views/ArtistJourney.vue'
import Timeline3D from '@/views/Timeline3D.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 