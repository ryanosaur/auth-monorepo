import { Column } from '../models/Column.js'

// Initialize default columns for a user
export async function initializeDefaultColumns(userId) {
  const existingColumns = await getColumnsByUser(userId)

  if (existingColumns.length > 0) {
    return existingColumns
  }

  const defaultColumns = [
    { name: 'Backlog', position: 0 },
    { name: 'In Progress', position: 1 },
    { name: 'Done', position: 2 }
  ]

  const createdColumns = await Column.insertMany(
    defaultColumns.map((col) => ({
      userId,
      name: col.name,
      position: col.position
    }))
  )

  return createdColumns.map(col => col.toObject())
}

export async function createColumn(userId, columnData) {
  const column = new Column({
    userId,
    ...columnData
  })

  await column.save()
  return column.toObject()
}

export async function getColumnsByUser(userId) {
  const columns = await Column.find({ userId })
    .sort({ position: 1 })
    .lean()

  return columns
}

export async function getColumnById(columnId, userId) {
  const column = await Column.findOne({ _id: columnId, userId }).lean()

  if (!column) {
    throw new Error('Column not found')
  }

  return column
}

export async function updateColumn(columnId, userId, updates) {
  const column = await Column.findOneAndUpdate(
    { _id: columnId, userId },
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean()

  if (!column) {
    throw new Error('Column not found')
  }

  return column
}

export async function deleteColumn(columnId, userId) {
  const result = await Column.deleteOne({ _id: columnId, userId })

  if (result.deletedCount === 0) {
    throw new Error('Column not found')
  }

  return { success: true }
}
