import {createRouter, createWebHashHistory} from 'vue-router'

import AppView from "@/components/AppView";

const views = name => () => import('@/views/' + name);
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            component: AppView,
            children: [
                {path: '/', name: 'world', component: views('ViewWorld')},
                {path: '/trend', name: 'trend', component: views('ViewTrend')},
                {path: '/vaccine', name: 'trend', component: views('ViewVaccine')},
            ]
        },
    ]
})

export default router
