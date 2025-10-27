import { Task } from '../models/Task.js'

export async function createTask(userId, taskData) {
  const task = new Task({
    userId,
    ...taskData
  })

  await task.save()
  return task.toObject()
}

export async function getTasksByUser(userId) {
  const tasks = await Task.find({ userId })
    .sort({ position: 1 })
    .lean()

  return tasks
}

export async function getTaskById(taskId, userId) {
  const task = await Task.findOne({ _id: taskId, userId }).lean()

  if (!task) {
    throw new Error('Task not found')
  }

  return task
}

export async function updateTask(taskId, userId, updates) {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean()

  if (!task) {
    throw new Error('Task not found')
  }

  return task
}

export async function deleteTask(taskId, userId) {
  const result = await Task.deleteOne({ _id: taskId, userId })

  if (result.deletedCount === 0) {
    throw new Error('Task not found')
  }

  return { success: true }
}

export async function moveTask(taskId, userId, newColumnId, newPosition) {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    {
      columnId: newColumnId,
      position: newPosition,
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  ).lean()

  if (!task) {
    throw new Error('Task not found')
  }

  return task
}

export async function getHighPriorityTasksDueThisWeek(userId) {
  const now = new Date()
  const weekFromNow = new Date()
  weekFromNow.setDate(now.getDate() + 7)

  const tasks = await Task.find({
    userId,
    priority: 'high',
    dueDate: {
      $gte: now,
      $lte: weekFromNow
    }
  })
    .sort({ dueDate: 1 })
    .lean()

  return tasks
}
