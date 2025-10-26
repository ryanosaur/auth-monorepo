import express from 'express'

const router = express.Router()

// Protected endpoint example
router.get('/', (req, res) => {
  res.json({
    message: 'This is protected data from the BFF',
    userId: req.auth.sub,
    timestamp: new Date().toISOString(),
    permissions: req.auth.permissions || [],
    scope: req.auth.scope
  })
})

export default router
