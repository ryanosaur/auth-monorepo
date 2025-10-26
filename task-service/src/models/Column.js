export class Column {
  constructor({
    id,
    userId,
    name,
    position,
    createdAt,
    updatedAt
  }) {
    this.id = id
    this.userId = userId
    this.name = name
    this.position = position || 0
    this.createdAt = createdAt || new Date().toISOString()
    this.updatedAt = updatedAt || new Date().toISOString()
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
