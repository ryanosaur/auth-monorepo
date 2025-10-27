import dotenv from 'dotenv'

// Load environment variables FIRST, before any other imports
dotenv.config()

import express from 'express'
import cors from 'cors'
import { jwtCheck } from './middleware/auth.js'
import userRoutes from './routes/users.js'
import protectedRoutes from './routes/protected.js'
import taskRoutes from './routes/tasks.js'
import columnRoutes from './routes/columns.js'

// Debug: Log environment variables
console.log('🔍 Environment variables loaded:')
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN)
console.log('AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE)
console.log('PORT:', process.env.PORT)
console.log('USER_SERVICE_URL:', process.env.USER_SERVICE_URL)
console.log('TASK_SERVICE_URL:', process.env.TASK_SERVICE_URL)

if (!process.env.AUTH0_DOMAIN) {
  console.error('❌ ERROR: AUTH0_DOMAIN is not set in .env file!')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Public routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'bff' })
})

// Protected routes (require JWT)
app.use('/api/users', jwtCheck, userRoutes)
app.use('/api/protected', jwtCheck, protectedRoutes)
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
  console.log(`BFF server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
