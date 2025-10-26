import express from 'express'
import axios from 'axios'

const router = express.Router()
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002'

// Get current user profile
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization

    // Forward request to user service
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/me`, {
      headers: {
        Authorization: token
      }
    })

    res.json(response.data)
  } catch (error) {
    console.error('Error fetching user from user service:', error.message)

    if (error.response) {
      return res.status(error.response.status).json(error.response.data)
    }

    next(error)
  }
})

// Additional user-related endpoints can be added here
router.get('/profile', async (req, res) => {
  res.json({
    message: 'User profile from BFF',
    userId: req.auth.sub,
    source: 'bff-layer'
  })
})

export default router
