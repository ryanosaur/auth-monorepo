<template>
  <div id="app" class="scanlines">
    <nav class="navbar">
      <router-link to="/" class="logo-link">
        <Logo class="compact" />
      </router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-item" v-if="!isAuthenticated">
          <span class="nav-icon">🏠</span>
          Home
        </router-link>
        <router-link to="/dashboard" class="nav-item" v-if="isAuthenticated">
          <span class="nav-icon">📊</span>
          Dashboard
        </router-link>
        <router-link to="/login" v-if="!isAuthenticated" class="nav-item">
          <span class="nav-icon">🔑</span>
          Login
        </router-link>
        <router-link to="/register" v-if="!isAuthenticated" class="btn-neon nav-btn">
          Join Grid
        </router-link>
        <button @click="logout" v-if="isAuthenticated" class="btn-neon nav-btn logout-btn">
          Disconnect
        </button>
      </div>
    </nav>

    <Sidebar v-if="isAuthenticated && showSidebar" />

    <main :class="{ 'with-sidebar': isAuthenticated && showSidebar }">
      <router-view />
    </main>

    <footer class="footer" :class="{ 'with-sidebar': isAuthenticated && showSidebar }">
      <div class="footer-content">
        <p>© 2025 Claude Test App // All Rights Reserved</p>
        <p class="footer-tagline">Powered by Auth0 × Built with Vue.js</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import Logo from './components/Logo.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Logo,
    Sidebar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { logout, isAuthenticated, isLoading } = useAuth0()

    const showSidebar = computed(() => {
      const routesWithSidebar = ['/dashboard', '/tasks', '/profile']
      return routesWithSidebar.some(r => route.path.startsWith(r))
    })

    // Redirect to dashboard after login
    watch([isAuthenticated, isLoading], ([auth, loading]) => {
      if (!loading && auth && (route.path === '/' || route.path === '/login' || route.path === '/register')) {
        router.push('/dashboard')
      }
    })

    const handleLogout = () => {
      logout({ logoutParams: { returnTo: window.location.origin } })
    }

    return {
      logout: handleLogout,
      isAuthenticated,
      showSidebar
    }
  }
}
</script>

<style>
@import './styles/theme.css';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: rgba(10, 14, 39, 0.95);
  padding: 1rem 2rem;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(185, 103, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  border-bottom: 2px solid var(--neon-purple);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-link::after {
  display: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-family: var(--font-display);
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.nav-item:hover {
  color: var(--neon-cyan);
  background: rgba(5, 255, 161, 0.1);
  text-shadow: var(--glow-cyan);
}

.nav-item::after {
  display: none;
}

.nav-item.router-link-active {
  color: var(--neon-pink);
  background: rgba(255, 110, 199, 0.1);
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-btn {
  padding: 0.5rem 1.5rem;
  font-size: 0.85rem;
}

.logout-btn {
  border-color: #f5576c;
  color: #f5576c;
}

.logout-btn:hover {
  border-color: var(--neon-pink);
  color: white;
}

main {
  flex: 1;
  padding: 0;
  width: 100%;
  transition: margin-left 0.3s ease;
}

main.with-sidebar {
  margin-left: 250px;
}

.footer {
  background: rgba(5, 8, 20, 0.9);
  padding: 2rem;
  border-top: 2px solid var(--deep-purple);
  margin-top: auto;
  transition: margin-left 0.3s ease;
}

.footer.with-sidebar {
  margin-left: 250px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-family: var(--font-display);
  font-size: 0.85rem;
}

.footer-tagline {
  margin-top: 0.5rem;
  color: var(--neon-cyan);
  font-size: 0.75rem;
  letter-spacing: 2px;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .nav-item {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .nav-icon {
    font-size: 1rem;
  }

  main.with-sidebar {
    margin-left: 70px;
  }

  .footer.with-sidebar {
    margin-left: 70px;
  }
}
</style>
