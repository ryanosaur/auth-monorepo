<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1 class="glow-text">DASHBOARD</h1>
        <p class="subtitle">// Your Command Center //</p>
      </div>
      <router-link to="/tasks" class="btn-neon">
        + New Task
      </router-link>
    </div>

    <div class="stats-grid">
      <div class="stat-card vaporwave-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-label">Total Tasks</div>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
      </div>

      <div class="stat-card vaporwave-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-label">In Progress</div>
          <div class="stat-value">{{ stats.inProgress }}</div>
        </div>
      </div>

      <div class="stat-card vaporwave-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-label">Completed</div>
          <div class="stat-value">{{ stats.completed }}</div>
        </div>
      </div>

      <div class="stat-card vaporwave-card high-priority">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <div class="stat-label">High Priority</div>
          <div class="stat-value">{{ stats.highPriority }}</div>
        </div>
      </div>
    </div>

    <div class="priority-section">
      <h2>🎯 HIGH PRIORITY TASKS DUE THIS WEEK</h2>

      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Loading priority tasks...</p>
      </div>

      <div v-else-if="error" class="error-state vaporwave-card">
        <span>⚠️ {{ error }}</span>
      </div>

      <div v-else-if="priorityTasks.length === 0" class="empty-state vaporwave-card">
        <div class="empty-icon">🎉</div>
        <h3>All Clear!</h3>
        <p>No high-priority tasks due this week.</p>
        <router-link to="/tasks" class="btn-neon">
          Create Your First Task
        </router-link>
      </div>

      <div v-else class="tasks-list">
        <div
          v-for="task in priorityTasks"
          :key="task.id"
          class="task-card vaporwave-card"
          @click="navigateToTasks"
        >
          <div class="task-header">
            <h3>{{ task.title }}</h3>
            <span class="priority-badge" :class="task.priority">
              {{ task.priority }}
            </span>
          </div>

          <p v-if="task.description" class="task-description">
            {{ task.description }}
          </p>

          <div class="task-footer">
            <div class="task-due">
              <span class="icon">📅</span>
              {{ formatDate(task.dueDate) }}
              <span class="days-left" :class="{ urgent: getDaysLeft(task.dueDate) <= 2 }">
                ({{ getDaysLeftText(task.dueDate) }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import apiClient from '../services/api'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const { getAccessTokenSilently } = useAuth0()

    const priorityTasks = ref([])
    const allTasks = ref([])
    const loading = ref(true)
    const error = ref(null)

    const stats = computed(() => {
      const total = allTasks.value.length
      const inProgress = allTasks.value.filter(t => t.columnId && !t.columnId.includes('done')).length
      const completed = allTasks.value.filter(t => t.columnId && t.columnId.includes('done')).length
      const highPriority = allTasks.value.filter(t => t.priority === 'high').length

      return { total, inProgress, completed, highPriority }
    })

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }

    const getDaysLeft = (dateString) => {
      const due = new Date(dateString)
      const now = new Date()
      const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
      return diff
    }

    const getDaysLeftText = (dateString) => {
      const days = getDaysLeft(dateString)
      if (days === 0) return 'Due Today'
      if (days === 1) return '1 day left'
      if (days < 0) return `${Math.abs(days)} days overdue`
      return `${days} days left`
    }

    const navigateToTasks = () => {
      router.push('/tasks')
    }

    const loadData = async () => {
      loading.value = true
      error.value = null

      try {
        const token = await getAccessTokenSilently()

        // Load priority tasks and all tasks in parallel
        const [priority, all] = await Promise.all([
          apiClient.getPriorityTasksThisWeek(token),
          apiClient.getTasks(token)
        ])

        priorityTasks.value = priority
        allTasks.value = all
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        error.value = err.message || 'Failed to load dashboard data'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      priorityTasks,
      stats,
      loading,
      error,
      formatDate,
      getDaysLeft,
      getDaysLeftText,
      navigateToTasks
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--neon-cyan);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 2px;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  cursor: default;
  transition: transform 0.3s ease;
  animation: slideUp 0.6s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card.high-priority {
  border-color: #f5576c;
}

.stat-icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 10px rgba(255, 110, 199, 0.5));
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 900;
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.priority-section {
  animation: slideUp 0.8s ease;
}

.priority-section h2 {
  color: var(--neon-pink);
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loader {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(185, 103, 255, 0.2);
  border-top-color: var(--neon-pink);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 2rem;
  background: rgba(245, 87, 108, 0.2);
  border-color: #f5576c;
  color: #ff6b81;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.empty-state h3 {
  color: var(--neon-cyan);
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-card {
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.task-card::before {
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

.task-card:hover {
  transform: translateX(10px);
  border-color: var(--neon-cyan);
}

.task-card:hover::before {
  opacity: 1;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.task-header h3 {
  color: white;
  font-family: var(--font-display);
  font-size: 1.3rem;
  letter-spacing: 1px;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
}

.priority-badge.high {
  background: rgba(245, 87, 108, 0.3);
  border: 2px solid #f5576c;
  color: #ff6b81;
}

.priority-badge.medium {
  background: rgba(255, 170, 51, 0.3);
  border: 2px solid #ffaa33;
  color: #ffaa33;
}

.priority-badge.low {
  background: rgba(5, 255, 161, 0.3);
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
}

.task-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.task-due {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.task-due .icon {
  font-size: 1rem;
}

.days-left {
  color: var(--neon-cyan);
  font-weight: 600;
}

.days-left.urgent {
  color: #f5576c;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .task-card {
    padding: 1rem;
  }

  .task-header {
    flex-direction: column;
  }
}
</style>
