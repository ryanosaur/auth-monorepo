import dotenv from 'dotenv'

// Load environment variables FIRST, before any other imports
dotenv.config()

import express from 'express'
import cors from 'cors'
import { jwtCheck } from './middleware/auth.js'
import taskRoutes from './routes/tasks.js'
import columnRoutes from './routes/columns.js'
import { connectDatabase } from './config/database.js'

// Connect to MongoDB
await connectDatabase()

const app = express()
const PORT = process.env.PORT || 3003

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3001',
  'http://localhost:5173'
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())

// Public routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'task-service' })
})

// Protected routes (require JWT)
app.use('/api/tasks', jwtCheck, taskRoutes)
app.use('/api/columns', jwtCheck, columnRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing token'
    })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`Task service running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
