import { createRouter, createWebHashHistory } from 'vue-router'

// const Home = import('../views/Home')
import Home from '../views/Home.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', redirect: '/home' },
        {path: '/', name: 'home', component: Home},
        {path: '/home', name: 'home', component: Home},
    ]
})

export default router
