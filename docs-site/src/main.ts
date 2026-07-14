import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/guide/introduction',
    },
    {
      path: '/guide/:page',
      component: () => import('./pages/GuidePage.vue'),
    },
    {
      path: '/api/:page',
      component: () => import('./pages/ApiPage.vue'),
    },
    {
      path: '/architecture/:page',
      component: () => import('./pages/ArchitecturePage.vue'),
    },
    {
      path: '/deployment/:page',
      component: () => import('./pages/DeploymentPage.vue'),
    },
    {
      path: '/development/:page',
      component: () => import('./pages/DevelopmentPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/guide/introduction',
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

const app = createApp(App)
app.use(router)
app.mount('#app')
