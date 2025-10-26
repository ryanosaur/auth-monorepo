<template>
  <div class="tasks-page">
    <div class="tasks-header">
      <div>
        <h1 class="glow-text">TASK BOARD</h1>
        <p class="subtitle">// Manage Your Projects //</p>
      </div>
      <div class="header-actions">
        <button @click="showColumnModal = true" class="btn-secondary">
          + Add Column
        </button>
        <button @click="openCreateTaskModal" class="btn-neon">
          + New Task
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Loading your tasks...</p>
    </div>

    <div v-else-if="error" class="error-state vaporwave-card">
      <span>⚠️ {{ error }}</span>
    </div>

    <div v-else class="kanban-board">
      <div
        v-for="column in columns"
        :key="column.id"
        class="kanban-column"
        @drop="handleDrop($event, column.id)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="column-header">
          <h3>{{ column.name }}</h3>
          <span class="task-count">{{ getColumnTasks(column.id).length }}</span>
          <button
            v-if="!isDefaultColumn(column.name)"
            @click="deleteColumn(column.id)"
            class="delete-column-btn"
            title="Delete Column"
          >
            🗑️
          </button>
        </div>

        <div class="column-content">
          <div
            v-for="task in getColumnTasks(column.id)"
            :key="task.id"
            class="task-item"
            draggable="true"
            @dragstart="handleDragStart($event, task)"
            @dragend="handleDragEnd"
          >
            <div class="task-item-header">
              <h4>{{ task.title }}</h4>
              <span class="priority-dot" :class="task.priority" :title="task.priority"></span>
            </div>

            <p v-if="task.description" class="task-item-description">
              {{ task.description }}
            </p>

            <div v-if="task.dueDate" class="task-item-due">
              📅 {{ formatDueDate(task.dueDate) }}
            </div>

            <div class="task-item-actions">
              <button @click="editTask(task)" class="task-action-btn">
                ✏️ Edit
              </button>
              <button @click="deleteTask(task.id)" class="task-action-btn delete">
                🗑️ Delete
              </button>
            </div>
          </div>

          <div v-if="getColumnTasks(column.id).length === 0" class="empty-column">
            <p>No tasks yet</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :show="showTaskModal"
      :task="currentTask"
      :columns="columns"
      :loading="modalLoading"
      :error="modalError"
      @close="closeTaskModal"
      @submit="handleTaskSubmit"
    />

    <!-- Column Modal -->
    <div class="modal-overlay" v-if="showColumnModal" @click="showColumnModal = false">
      <div class="modal-content vaporwave-card" @click.stop>
        <div class="modal-header">
          <h2>ADD NEW COLUMN</h2>
          <button class="close-btn" @click="showColumnModal = false">✕</button>
        </div>
        <form @submit.prevent="handleColumnSubmit" class="task-form">
          <div class="form-group">
            <label for="columnName">Column Name *</label>
            <input
              id="columnName"
              v-model="newColumnName"
              type="text"
              class="vaporwave-input"
              placeholder="Enter column name"
              required
            />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showColumnModal = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-neon">
              Create Column
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import apiClient from '../services/api'
import TaskModal from '../components/TaskModal.vue'

export default {
  name: 'Tasks',
  components: {
    TaskModal
  },
  setup() {
    const { getAccessTokenSilently } = useAuth0()

    const tasks = ref([])
    const columns = ref([])
    const loading = ref(true)
    const error = ref(null)

    const showTaskModal = ref(false)
    const showColumnModal = ref(false)
    const currentTask = ref(null)
    const modalLoading = ref(false)
    const modalError = ref(null)
    const newColumnName = ref('')

    const draggedTask = ref(null)

    const getColumnTasks = (columnId) => {
      return tasks.value
        .filter(task => task.columnId === columnId)
        .sort((a, b) => a.position - b.position)
    }

    const isDefaultColumn = (columnName) => {
      return ['Backlog', 'In Progress', 'Done'].includes(columnName)
    }

    const formatDueDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }

    const loadData = async () => {
      loading.value = true
      error.value = null

      try {
        const token = await getAccessTokenSilently()

        const [tasksData, columnsData] = await Promise.all([
          apiClient.getTasks(token),
          apiClient.getColumns(token)
        ])

        tasks.value = tasksData
        columns.value = columnsData
      } catch (err) {
        console.error('Error loading tasks:', err)
        error.value = err.message || 'Failed to load tasks'
      } finally {
        loading.value = false
      }
    }

    const openCreateTaskModal = () => {
      currentTask.value = null
      showTaskModal.value = true
    }

    const editTask = (task) => {
      currentTask.value = task
      showTaskModal.value = true
    }

    const closeTaskModal = () => {
      showTaskModal.value = false
      currentTask.value = null
      modalError.value = null
    }

    const handleTaskSubmit = async (taskData) => {
      modalLoading.value = true
      modalError.value = null

      try {
        const token = await getAccessTokenSilently()

        if (currentTask.value) {
          // Update existing task
          const updated = await apiClient.updateTask(token, currentTask.value.id, taskData)
          const index = tasks.value.findIndex(t => t.id === currentTask.value.id)
          if (index !== -1) {
            tasks.value[index] = updated
          }
        } else {
          // Create new task
          const newTask = await apiClient.createTask(token, {
            ...taskData,
            position: getColumnTasks(taskData.columnId).length
          })
          tasks.value.push(newTask)
        }

        closeTaskModal()
      } catch (err) {
        console.error('Error saving task:', err)
        modalError.value = err.message || 'Failed to save task'
      } finally {
        modalLoading.value = false
      }
    }

    const deleteTask = async (taskId) => {
      if (!confirm('Are you sure you want to delete this task?')) {
        return
      }

      try {
        const token = await getAccessTokenSilently()
        await apiClient.deleteTask(token, taskId)
        tasks.value = tasks.value.filter(t => t.id !== taskId)
      } catch (err) {
        console.error('Error deleting task:', err)
        alert('Failed to delete task')
      }
    }

    const handleColumnSubmit = async () => {
      if (!newColumnName.value.trim()) return

      try {
        const token = await getAccessTokenSilently()
        const newColumn = await apiClient.createColumn(token, {
          name: newColumnName.value,
          position: columns.value.length
        })

        columns.value.push(newColumn)
        newColumnName.value = ''
        showColumnModal.value = false
      } catch (err) {
        console.error('Error creating column:', err)
        alert('Failed to create column')
      }
    }

    const deleteColumn = async (columnId) => {
      const columnTasks = getColumnTasks(columnId)
      if (columnTasks.length > 0) {
        alert('Cannot delete a column that contains tasks. Please move or delete the tasks first.')
        return
      }

      if (!confirm('Are you sure you want to delete this column?')) {
        return
      }

      try {
        const token = await getAccessTokenSilently()
        await apiClient.deleteColumn(token, columnId)
        columns.value = columns.value.filter(c => c.id !== columnId)
      } catch (err) {
        console.error('Error deleting column:', err)
        alert('Failed to delete column')
      }
    }

    const handleDragStart = (event, task) => {
      draggedTask.value = task
      event.dataTransfer.effectAllowed = 'move'
    }

    const handleDragEnd = () => {
      draggedTask.value = null
    }

    const handleDrop = async (event, columnId) => {
      event.preventDefault()

      if (!draggedTask.value || draggedTask.value.columnId === columnId) {
        return
      }

      try {
        const token = await getAccessTokenSilently()
        const newPosition = getColumnTasks(columnId).length

        const updated = await apiClient.moveTask(
          token,
          draggedTask.value.id,
          columnId,
          newPosition
        )

        const index = tasks.value.findIndex(t => t.id === draggedTask.value.id)
        if (index !== -1) {
          tasks.value[index] = updated
        }
      } catch (err) {
        console.error('Error moving task:', err)
        alert('Failed to move task')
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      tasks,
      columns,
      loading,
      error,
      showTaskModal,
      showColumnModal,
      currentTask,
      modalLoading,
      modalError,
      newColumnName,
      getColumnTasks,
      isDefaultColumn,
      formatDueDate,
      openCreateTaskModal,
      editTask,
      closeTaskModal,
      handleTaskSubmit,
      deleteTask,
      handleColumnSubmit,
      deleteColumn,
      handleDragStart,
      handleDragEnd,
      handleDrop
    }
  }
}
</script>

<style scoped>
.tasks-page {
  padding: 2rem;
  height: 100%;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.tasks-header h1 {
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

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid var(--neon-purple);
  color: var(--neon-purple);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-family: var(--font-display);
}

.btn-secondary:hover {
  background: rgba(185, 103, 255, 0.1);
  box-shadow: 0 0 20px rgba(185, 103, 255, 0.3);
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

.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 2rem;
}

.kanban-column {
  background: rgba(10, 14, 39, 0.6);
  border: 2px solid var(--deep-purple);
  border-radius: 12px;
  padding: 1rem;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--deep-purple);
}

.column-header h3 {
  flex: 1;
  color: var(--neon-cyan);
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.task-count {
  background: rgba(5, 255, 161, 0.2);
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: var(--font-display);
}

.delete-column-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.delete-column-btn:hover {
  opacity: 1;
  transform: scale(1.2);
}

.column-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.task-item {
  background: rgba(5, 8, 20, 0.8);
  border: 2px solid var(--deep-purple);
  border-radius: 8px;
  padding: 1rem;
  cursor: grab;
  transition: all 0.3s ease;
}

.task-item:hover {
  border-color: var(--neon-purple);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(185, 103, 255, 0.3);
}

.task-item:active {
  cursor: grabbing;
}

.task-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.task-item-header h4 {
  color: white;
  font-size: 1rem;
  line-height: 1.4;
}

.priority-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.priority-dot.high {
  background: #f5576c;
  box-shadow: 0 0 10px #f5576c;
}

.priority-dot.medium {
  background: #ffaa33;
  box-shadow: 0 0 10px #ffaa33;
}

.priority-dot.low {
  background: var(--neon-cyan);
  box-shadow: 0 0 10px var(--neon-cyan);
}

.task-item-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-item-due {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.task-item-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--deep-purple);
}

.task-action-btn {
  flex: 1;
  background: transparent;
  border: 2px solid var(--deep-purple);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-action-btn:hover {
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
}

.task-action-btn.delete:hover {
  border-color: #f5576c;
  color: #f5576c;
}

.empty-column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

/* Column Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--deep-purple);
}

.modal-header h2 {
  color: var(--neon-pink);
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 2px;
}

.close-btn {
  background: none;
  border: 2px solid var(--deep-purple);
  color: rgba(255, 255, 255, 0.7);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  border-color: #f5576c;
  color: #f5576c;
  transform: rotate(90deg);
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--neon-cyan);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-display);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .tasks-page {
    padding: 1rem;
  }

  .tasks-header h1 {
    font-size: 2rem;
  }

  .kanban-board {
    grid-template-columns: 1fr;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .header-actions button {
    width: 100%;
  }
}
</style>
