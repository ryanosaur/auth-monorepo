<template>
  <div class="modal-overlay" @click="handleOverlayClick" v-if="show">
    <div class="modal-content vaporwave-card" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? 'EDIT TASK' : 'CREATE TASK' }}</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="task-form">
        <div class="form-group">
          <label for="title">Task Title *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="vaporwave-input"
            placeholder="Enter task title"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            class="vaporwave-input"
            placeholder="Enter task description"
            rows="4"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priority">Priority *</label>
            <select
              id="priority"
              v-model="formData.priority"
              class="vaporwave-select"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="form-group">
            <label for="dueDate">Due Date</label>
            <input
              id="dueDate"
              v-model="formData.dueDate"
              type="date"
              class="vaporwave-input"
            />
          </div>
        </div>

        <div class="form-group" v-if="!isEdit">
          <label for="column">Column *</label>
          <select
            id="column"
            v-model="formData.columnId"
            class="vaporwave-select"
            required
          >
            <option value="" disabled>Select a column</option>
            <option v-for="column in columns" :key="column.id" :value="column.id">
              {{ column.name }}
            </option>
          </select>
        </div>

        <div v-if="error" class="error-message">
          <span>⚠️ {{ error }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn-neon" :disabled="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'TaskModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default: null
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const formData = ref({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      columnId: ''
    })

    const isEdit = ref(false)

    watch(() => props.task, (newTask) => {
      if (newTask) {
        isEdit.value = true
        formData.value = {
          title: newTask.title || '',
          description: newTask.description || '',
          priority: newTask.priority || 'medium',
          dueDate: newTask.dueDate ? newTask.dueDate.split('T')[0] : '',
          columnId: newTask.columnId || ''
        }
      } else {
        isEdit.value = false
        resetForm()
      }
    }, { immediate: true })

    watch(() => props.show, (newShow) => {
      if (!newShow) {
        resetForm()
      }
    })

    const resetForm = () => {
      formData.value = {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        columnId: props.columns[0]?.id || ''
      }
    }

    const closeModal = () => {
      emit('close')
    }

    const handleOverlayClick = () => {
      closeModal()
    }

    const handleSubmit = () => {
      const data = {
        ...formData.value,
        dueDate: formData.value.dueDate ? new Date(formData.value.dueDate).toISOString() : null
      }
      emit('submit', data)
    }

    return {
      formData,
      isEdit,
      closeModal,
      handleOverlayClick,
      handleSubmit
    }
  }
}
</script>

<style scoped>
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.vaporwave-input,
.vaporwave-select {
  font-family: var(--font-body);
}

textarea.vaporwave-input {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  background: rgba(245, 87, 108, 0.2);
  border: 2px solid #f5576c;
  border-radius: 8px;
  padding: 1rem;
  color: #ff6b81;
  text-align: center;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--deep-purple);
}

.btn-secondary {
  padding: 0.75rem 2rem;
  background: transparent;
  border: 2px solid var(--deep-purple);
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-family: var(--font-display);
}

.btn-secondary:hover {
  border-color: var(--neon-purple);
  color: var(--neon-purple);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
