import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '../App.vue'
import CharacterCreation from '../views/CharacterCreation.vue'
import Timeline from '../views/Timeline.vue'
import AddBook from '../views/AddBook.vue'
import EventEditor from '../views/EventEditor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CharacterCreation
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: Timeline
    },
    {
      path: '/add-book',
      name: 'add-book',
      component: AddBook
    },
    {
      path: '/event-editor',
      name: 'event-editor',
      component: EventEditor
    }
  ]
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#root') 