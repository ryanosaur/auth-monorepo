import { v4 as uuidv4 } from 'uuid'
import { Column } from '../models/Column.js'

// In-memory storage (replace with database in production)
const columns = new Map()

// Initialize default columns for a user
export function initializeDefaultColumns(userId) {
  const existingColumns = getColumnsByUser(userId)

  if (existingColumns.length > 0) {
    return existingColumns
  }

  const defaultColumns = [
    { name: 'Backlog', position: 0 },
    { name: 'In Progress', position: 1 },
    { name: 'Done', position: 2 }
  ]

  return defaultColumns.map((col, index) => {
    const column = new Column({
      id: uuidv4(),
      userId,
      name: col.name,
      position: index
    })
    columns.set(column.id, column)
    return column.toJSON()
  })
}

export function createColumn(userId, columnData) {
  const column = new Column({
    id: uuidv4(),
    userId,
    ...columnData
  })

  columns.set(column.id, column)
  return column.toJSON()
}

export function getColumnsByUser(userId) {
  return Array.from(columns.values())
    .filter(column => column.userId === userId)
    .map(column => column.toJSON())
    .sort((a, b) => a.position - b.position)
}

export function getColumnById(columnId, userId) {
  const column = columns.get(columnId)

  if (!column) {
    throw new Error('Column not found')
  }

  if (column.userId !== userId) {
    throw new Error('Unauthorized')
  }

  return column.toJSON()
}

export function updateColumn(columnId, userId, updates) {
  const column = columns.get(columnId)

  if (!column) {
    throw new Error('Column not found')
  }

  if (column.userId !== userId) {
    throw new Error('Unauthorized')
  }

  Object.assign(column, updates, {
    updatedAt: new Date().toISOString()
  })

  columns.set(columnId, column)
  return column.toJSON()
}

export function deleteColumn(columnId, userId) {
  const column = columns.get(columnId)

  if (!column) {
    throw new Error('Column not found')
  }

  if (column.userId !== userId) {
    throw new Error('Unauthorized')
  }

  columns.delete(columnId)
  return { success: true }
}
