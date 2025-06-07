import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ArtistJourney from '@/views/ArtistJourney.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 