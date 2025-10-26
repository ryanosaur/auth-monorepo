import mongoose from 'mongoose'

const columnSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for efficient querying
columnSchema.index({ userId: 1, position: 1 })

export const Column = mongoose.model('Column', columnSchema)
