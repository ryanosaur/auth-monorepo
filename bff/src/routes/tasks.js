import express from 'express'
import axios from 'axios'

const router = express.Router()
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://localhost:3003'

// Get all tasks
router.get('/', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const response = await axios.get(`${TASK_SERVICE_URL}/api/tasks`, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Get high priority tasks due this week
router.get('/priority-week', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const response = await axios.get(`${TASK_SERVICE_URL}/api/tasks/priority-week`, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Get specific task
router.get('/:taskId', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { taskId } = req.params
    const response = await axios.get(`${TASK_SERVICE_URL}/api/tasks/${taskId}`, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Create task
router.post('/', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const response = await axios.post(`${TASK_SERVICE_URL}/api/tasks`, req.body, {
      headers: { Authorization: token }
    })
    res.status(201).json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Update task
router.put('/:taskId', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { taskId } = req.params
    const response = await axios.put(`${TASK_SERVICE_URL}/api/tasks/${taskId}`, req.body, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Move task
router.post('/:taskId/move', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { taskId } = req.params
    const response = await axios.post(`${TASK_SERVICE_URL}/api/tasks/${taskId}/move`, req.body, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Delete task
router.delete('/:taskId', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { taskId } = req.params
    const response = await axios.delete(`${TASK_SERVICE_URL}/api/tasks/${taskId}`, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

function handleServiceError(error, res, next) {
  console.error('Error from task service:', error.message)
  if (error.response) {
    return res.status(error.response.status).json(error.response.data)
  }
  next(error)
}

export default router
