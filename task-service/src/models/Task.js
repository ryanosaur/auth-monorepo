import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Column',
    required: true,
    index: true
  },
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for efficient querying
taskSchema.index({ userId: 1, columnId: 1, position: 1 })
taskSchema.index({ userId: 1, dueDate: 1, priority: 1 })

export const Task = mongoose.model('Task', taskSchema)
