export class Task {
  constructor({
    id,
    userId,
    title,
    description,
    priority,
    dueDate,
    columnId,
    position,
    createdAt,
    updatedAt
  }) {
    this.id = id
    this.userId = userId
    this.title = title
    this.description = description || ''
    this.priority = priority || 'medium' // low, medium, high
    this.dueDate = dueDate || null
    this.columnId = columnId
    this.position = position || 0
    this.createdAt = createdAt || new Date().toISOString()
    this.updatedAt = updatedAt || new Date().toISOString()
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      priority: this.priority,
      dueDate: this.dueDate,
      columnId: this.columnId,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
