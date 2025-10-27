import express from 'express'
import {
  initializeDefaultColumns,
  createColumn,
  getColumnsByUser,
  getColumnById,
  updateColumn,
  deleteColumn
} from '../services/columnService.js'

const router = express.Router()

// Get all columns for the current user
router.get('/', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const columns = await getColumnsByUser(userId)

    // If no columns exist, initialize default ones
    if (columns.length === 0) {
      const defaultColumns = await initializeDefaultColumns(userId)
      return res.json(defaultColumns)
    }

    res.json(columns)
  } catch (error) {
    next(error)
  }
})

// Initialize default columns
router.post('/initialize', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const columns = await initializeDefaultColumns(userId)
    res.json(columns)
  } catch (error) {
    next(error)
  }
})

// Get a specific column
router.get('/:columnId', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { columnId } = req.params
    const column = await getColumnById(columnId, userId)
    res.json(column)
  } catch (error) {
    if (error.message === 'Column not found') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message })
    }
    next(error)
  }
})

// Create a new column
router.post('/', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const column = await createColumn(userId, req.body)
    res.status(201).json(column)
  } catch (error) {
    next(error)
  }
})

// Update a column
router.put('/:columnId', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { columnId } = req.params
    const column = await updateColumn(columnId, userId, req.body)
    res.json(column)
  } catch (error) {
    if (error.message === 'Column not found') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message })
    }
    next(error)
  }
})

// Delete a column
router.delete('/:columnId', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const { columnId } = req.params
    const result = await deleteColumn(columnId, userId)
    res.json(result)
  } catch (error) {
    if (error.message === 'Column not found') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message })
    }
    next(error)
  }
})

export default router
