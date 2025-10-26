import express from 'express'
import { getUserProfile, getUserById } from '../services/userService.js'

const router = express.Router()

// Get current authenticated user's profile
router.get('/me', async (req, res, next) => {
  try {
    const userId = req.auth.sub
    const userProfile = await getUserProfile(userId, req.auth)

    res.json(userProfile)
  } catch (error) {
    next(error)
  }
})

// Get user by ID (example of additional endpoint)
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params

    // Optionally verify the user has permission to view this user
    // For now, only allow users to view their own profile
    if (userId !== req.auth.sub) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only view your own profile'
      })
    }

    const user = await getUserById(userId, req.auth)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

export default router
