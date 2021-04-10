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
                {path: '/', name: 'world', component: views('World')},
                {path: '/trend', name: 'trend', component: views('Trend')},
            ]
        },
    ]
})

export default router
