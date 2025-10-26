import { createRouter, createWebHistory } from 'vue-router'
import { createAuthGuard } from '@auth0/auth0-vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Tasks from '../views/Tasks.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: createAuthGuard()
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    beforeEnter: createAuthGuard()
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: createAuthGuard()
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
