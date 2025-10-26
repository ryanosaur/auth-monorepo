import express from 'express'
import {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask,
  getHighPriorityTasksDueThisWeek
} from '../services/taskService.js'

const router = express.Router()

// Get all tasks for the current user
router.get('/', (req, res, next) => {
  try {
    const userId = req.auth.sub
    const tasks = getTasksByUser(userId)
    res.json(tasks)
  } catch (error) {
    next(error)
  }
})

// Get high priority tasks due this week
router.get('/priority-week', (req, res, next) => {
  try {
    const userId = req.auth.sub
    const tasks = getHighPriorityTasksDueThisWeek(userId)
    res.json(tasks)
  } catch (error) {
    next(error)
  }
})

// Get a specific task
router.get('/:taskId', (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { taskId } = req.params
    const task = getTaskById(taskId, userId)
    res.json(task)
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message })
    }
    next(error)
  }
})

// Create a new task
router.post('/', (req, res, next) => {
  try {
    const userId = req.auth.sub
    const task = createTask(userId, req.body)
    res.status(201).json(task)
  } catch (error) {
    next(error)
  }
})

// Update a task
router.put('/:taskId', (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { taskId } = req.params
    const task = updateTask(taskId, userId, req.body)
    res.json(task)
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message })
    }
    next(error)
  }
})

// Move a task to a different column
router.post('/:taskId/move', (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { taskId } = req.params
    const { columnId, position } = req.body
    const task = moveTask(taskId, userId, columnId, position)
    res.json(task)
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message })
    }
    next(error)
  }
})

// Delete a task
router.delete('/:taskId', (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { taskId } = req.params
    const result = deleteTask(taskId, userId)
    res.json(result)
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message })
    }
    next(error)
  }
})

export default router
