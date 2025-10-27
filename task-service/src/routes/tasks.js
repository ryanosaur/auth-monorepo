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
router.get('/', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const tasks = await getTasksByUser(userId)
    res.json(tasks)
  } catch (error) {
    next(error)
  }
})

// Get high priority tasks due this week
router.get('/priority-week', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const tasks = await getHighPriorityTasksDueThisWeek(userId)
    res.json(tasks)
  } catch (error) {
    next(error)
  }
})

// Get a specific task
router.get('/:taskId', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { taskId } = req.params
    const task = await getTaskById(taskId, userId)
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
router.post('/', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const task = await createTask(userId, req.body)
    res.status(201).json(task)
  } catch (error) {
    next(error)
  }
})

// Update a task
router.put('/:taskId', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { taskId } = req.params
    const task = await updateTask(taskId, userId, req.body)
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
router.post('/:taskId/move', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { taskId } = req.params
    const { columnId, position } = req.body
    const task = await moveTask(taskId, userId, columnId, position)
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
router.delete('/:taskId', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { taskId } = req.params
    const result = await deleteTask(taskId, userId)
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
