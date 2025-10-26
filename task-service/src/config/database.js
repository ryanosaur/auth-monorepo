import mongoose from 'mongoose'

let isConnected = false

export async function connectDatabase() {
  if (isConnected) {
    console.log('✅ Using existing database connection')
    return
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasks'

    console.log('📦 Connecting to MongoDB...')

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    isConnected = true
    console.log('✅ MongoDB connected successfully')
    console.log(`📍 Database: ${mongoose.connection.name}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected')
  isConnected = false
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed through app termination')
  process.exit(0)
})
