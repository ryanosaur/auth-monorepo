import express from 'express'
import axios from 'axios'

const router = express.Router()
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://localhost:3003'

console.log('📍 [Columns Route] TASK_SERVICE_URL loaded as:', TASK_SERVICE_URL)

// Get all columns
router.get('/', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const response = await axios.get(`${TASK_SERVICE_URL}/api/columns`, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Initialize default columns
router.post('/initialize', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const response = await axios.post(`${TASK_SERVICE_URL}/api/columns/initialize`, {}, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Get specific column
router.get('/:columnId', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { columnId } = req.params
    const response = await axios.get(`${TASK_SERVICE_URL}/api/columns/${columnId}`, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Create column
router.post('/', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const response = await axios.post(`${TASK_SERVICE_URL}/api/columns`, req.body, {
      headers: { Authorization: token }
    })
    res.status(201).json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Update column
router.put('/:columnId', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { columnId } = req.params
    const response = await axios.put(`${TASK_SERVICE_URL}/api/columns/${columnId}`, req.body, {
      headers: { Authorization: token }
    })
    res.json(response.data)
  } catch (error) {
    handleServiceError(error, res, next)
  }
})

// Delete column
router.delete('/:columnId', async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { columnId } = req.params
    const response = await axios.delete(`${TASK_SERVICE_URL}/api/columns/${columnId}`, {
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
