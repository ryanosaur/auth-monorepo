<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <button class="collapse-btn" @click="toggleCollapse">
      <span v-if="!isCollapsed">◀</span>
      <span v-else">▶</span>
    </button>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-link">
        <span class="nav-icon">📊</span>
        <span class="nav-text" v-if="!isCollapsed">Dashboard</span>
      </router-link>

      <router-link to="/tasks" class="nav-link">
        <span class="nav-icon">📋</span>
        <span class="nav-text" v-if="!isCollapsed">Tasks</span>
      </router-link>

      <router-link to="/profile" class="nav-link">
        <span class="nav-icon">👤</span>
        <span class="nav-text" v-if="!isCollapsed">Profile</span>
      </router-link>

      <div class="nav-divider" v-if="!isCollapsed"></div>

      <a href="#" @click.prevent="handleLogout" class="nav-link logout-link">
        <span class="nav-icon">🚪</span>
        <span class="nav-text" v-if="!isCollapsed">Logout</span>
      </a>
    </nav>

    <div class="sidebar-footer" v-if="!isCollapsed">
      <div class="user-badge">
        <img v-if="user?.picture" :src="user.picture" :alt="user.name" class="user-avatar" />
        <div class="user-initial" v-else>{{ userInitial }}</div>
        <div class="user-info">
          <div class="user-name">{{ user?.name || 'User' }}</div>
          <div class="user-status">
            <span class="status-dot"></span>
            Online
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

export default {
  name: 'Sidebar',
  setup() {
    const { user, logout } = useAuth0()
    const isCollapsed = ref(false)

    const userInitial = computed(() => {
      return user.value?.name?.charAt(0).toUpperCase() || 'U'
    })

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const handleLogout = () => {
      logout({ logoutParams: { returnTo: window.location.origin } })
    }

    return {
      user,
      isCollapsed,
      userInitial,
      toggleCollapse,
      handleLogout
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  width: 250px;
  background: rgba(10, 14, 39, 0.95);
  border-right: 2px solid var(--neon-purple);
  backdrop-filter: blur(10px);
  transition: width 0.3s ease;
  z-index: 50;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 40px rgba(185, 103, 255, 0.2);
}

.sidebar.collapsed {
  width: 70px;
}

.collapse-btn {
  position: absolute;
  right: -15px;
  top: 20px;
  width: 30px;
  height: 30px;
  background: var(--gradient-neon);
  border: 2px solid var(--neon-purple);
  border-radius: 50%;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 51;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(185, 103, 255, 0.6);
}

.sidebar-nav {
  flex: 1;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 1rem 0;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--gradient-neon);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-link:hover {
  color: var(--neon-cyan);
  background: rgba(5, 255, 161, 0.1);
  text-shadow: 0 0 10px rgba(5, 255, 161, 0.5);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--neon-pink);
  background: rgba(255, 110, 199, 0.1);
}

.nav-link.router-link-active::before {
  opacity: 1;
  background: var(--neon-pink);
}

.nav-icon {
  font-size: 1.5rem;
  min-width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  white-space: nowrap;
}

.nav-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--deep-purple), transparent);
  margin: 1rem 1.5rem;
}

.logout-link {
  color: rgba(245, 87, 108, 0.8);
}

.logout-link:hover {
  color: #f5576c;
  background: rgba(245, 87, 108, 0.1);
  text-shadow: 0 0 10px rgba(245, 87, 108, 0.5);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 2px solid var(--deep-purple);
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar,
.user-initial {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--neon-cyan);
  box-shadow: 0 0 15px rgba(5, 255, 161, 0.3);
}

.user-initial {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-neon);
  color: white;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 1.2rem;
}

.user-info {
  flex: 1;
  overflow: hidden;
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--neon-cyan);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--neon-cyan);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .sidebar .nav-text,
  .sidebar-footer {
    display: none;
  }

  .collapse-btn {
    display: none;
  }
}
</style>
