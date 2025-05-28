import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // 修正路径引用
import CharacterCreation from '../views/CharacterCreation.vue'

const routes = [
    {
        path: '/',
        redirect: '/character-creation'
    },
    {
        path: '/character-creation',
        name: 'character-creation',
        component: CharacterCreation
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
