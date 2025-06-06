import { createRouter, createWebHistory } from 'vue-router'
import CharacterCreation from '../views/CharacterCreation.vue'
import TestBook from '../views/testBook.vue'
import Timeline from '../views/Timeline.vue'
import AddBook from '../views/AddBook.vue'
import EventEditor from '../views/EventEditor.vue'
import TimelineEditor from '../views/TimelineEditor.vue'
import TimelineStories from '../views/TimelineStories.vue'
import IntroPage from '../views/IntroPage.vue'
import StoryDetail from '../views/StoryDetail.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: CharacterCreation
    },
    {
        path: '/intro',
        name: 'intro',
        component: IntroPage
    },
    {
        path: '/timeline/:bookId?',
        name: 'timeline',
        component: Timeline
    },
    {
        path: '/timeline-editor/:bookId',
        name: 'timeline-editor',
        component: TimelineEditor
    },
    {
        path: '/timeline-stories',
        name: 'timeline-stories',
        component: TimelineStories
    },
    {
        path: '/story/:id',
        name: 'story-detail',
        component: StoryDetail
    },
    {
        path: '/test-book',
        name: 'test-book',
        component: TestBook
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
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
