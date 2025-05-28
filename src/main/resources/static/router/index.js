import { createRouter, createWebHistory } from 'vue-router'
import CharacterCreation from '../views/CharacterCreation.vue'
import TestBook from '../views/testBook.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: CharacterCreation
    },
    {
        path: '/test-book',
        name: 'test-book',
        component: TestBook
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 