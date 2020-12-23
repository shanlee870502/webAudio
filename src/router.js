import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    base: process.env.BASE_URL,
    routes:[
        {
            path: '/',
            name: 'index',
            component: () =>import('./views/index.vue')
        },
        {
            path: '/stereo',
            name: 'stereo',
            component: () => import('./views/stereo.vue')
        },
        {
            path: '/3d-sound',
            name: '3d-sound',
            component: () => import('./views/3d-stereo.vue')
        }
    ]
})