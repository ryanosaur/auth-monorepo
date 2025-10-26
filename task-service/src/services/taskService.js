import { v4 as uuidv4 } from 'uuid'
import { Task } from '../models/Task.js'

// In-memory storage (replace with database in production)
const tasks = new Map()

export function createTask(userId, taskData) {
  const task = new Task({
    id: uuidv4(),
    userId,
    ...taskData
  })

  tasks.set(task.id, task)
  return task.toJSON()
}

export function getTasksByUser(userId) {
  return Array.from(tasks.values())
    .filter(task => task.userId === userId)
    .map(task => task.toJSON())
    .sort((a, b) => a.position - b.position)
}

export function getTaskById(taskId, userId) {
  const task = tasks.get(taskId)

  if (!task) {
    throw new Error('Task not found')
  }

  if (task.userId !== userId) {
    throw new Error('Unauthorized')
  }

  return task.toJSON()
}

export function updateTask(taskId, userId, updates) {
  const task = tasks.get(taskId)

  if (!task) {
    throw new Error('Task not found')
  }

  if (task.userId !== userId) {
    throw new Error('Unauthorized')
  }

  Object.assign(task, updates, {
    updatedAt: new Date().toISOString()
  })

  tasks.set(taskId, task)
  return task.toJSON()
}

export function deleteTask(taskId, userId) {
  const task = tasks.get(taskId)

  if (!task) {
    throw new Error('Task not found')
  }

  if (task.userId !== userId) {
    throw new Error('Unauthorized')
  }

  tasks.delete(taskId)
  return { success: true }
}

export function moveTask(taskId, userId, newColumnId, newPosition) {
  const task = tasks.get(taskId)

  if (!task) {
    throw new Error('Task not found')
  }

  if (task.userId !== userId) {
    throw new Error('Unauthorized')
  }

  task.columnId = newColumnId
  task.position = newPosition
  task.updatedAt = new Date().toISOString()

  tasks.set(taskId, task)
  return task.toJSON()
}

export function getHighPriorityTasksDueThisWeek(userId) {
  const now = new Date()
  const weekFromNow = new Date()
  weekFromNow.setDate(now.getDate() + 7)

  return Array.from(tasks.values())
    .filter(task => {
      if (task.userId !== userId) return false
      if (!task.dueDate) return false
      if (task.priority !== 'high') return false

      const dueDate = new Date(task.dueDate)
      return dueDate >= now && dueDate <= weekFromNow
    })
    .map(task => task.toJSON())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
}
