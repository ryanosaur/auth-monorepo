import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { jwtCheck } from './middleware/auth.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

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
  res.json({ status: 'ok', service: 'user-service' })
})

// Protected routes (require JWT)
app.use('/api/users', jwtCheck, userRoutes)

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
  console.log(`User service running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
