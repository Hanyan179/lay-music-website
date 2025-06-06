import { createRouter, createWebHistory } from 'vue-router'
import ArtistJourney from '@/views/ArtistJourney.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ArtistJourney
  },
  {
    path: '/artist-journey',
    name: 'ArtistJourney',
    component: ArtistJourney
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 