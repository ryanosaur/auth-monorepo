import axios from 'axios'

const BFF_API_URL = import.meta.env.VITE_BFF_API_URL || 'http://localhost:3001'

const apiClient = {
  // User endpoints
  async getUserProfile(token) {
    const response = await axios.get(`${BFF_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async getProtectedData(token) {
    const response = await axios.get(`${BFF_API_URL}/api/protected`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  // Task endpoints
  async getTasks(token) {
    const response = await axios.get(`${BFF_API_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async getPriorityTasksThisWeek(token) {
    const response = await axios.get(`${BFF_API_URL}/api/tasks/priority-week`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async getTask(token, taskId) {
    const response = await axios.get(`${BFF_API_URL}/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async createTask(token, taskData) {
    const response = await axios.post(`${BFF_API_URL}/api/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async updateTask(token, taskId, updates) {
    const response = await axios.put(`${BFF_API_URL}/api/tasks/${taskId}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async moveTask(token, taskId, columnId, position) {
    const response = await axios.post(`${BFF_API_URL}/api/tasks/${taskId}/move`, {
      columnId,
      position
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async deleteTask(token, taskId) {
    const response = await axios.delete(`${BFF_API_URL}/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  // Column endpoints
  async getColumns(token) {
    const response = await axios.get(`${BFF_API_URL}/api/columns`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async initializeColumns(token) {
    const response = await axios.post(`${BFF_API_URL}/api/columns/initialize`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async createColumn(token, columnData) {
    const response = await axios.post(`${BFF_API_URL}/api/columns`, columnData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async updateColumn(token, columnId, updates) {
    const response = await axios.put(`${BFF_API_URL}/api/columns/${columnId}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async deleteColumn(token, columnId) {
    const response = await axios.delete(`${BFF_API_URL}/api/columns/${columnId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
}

export default apiClient
