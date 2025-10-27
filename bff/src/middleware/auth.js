import { expressjwt } from 'express-jwt'
import jwksRsa from 'jwks-rsa'

// Create JWT middleware lazily to ensure env vars are loaded
let _jwtCheck = null

function createJwtMiddleware() {
  if (!_jwtCheck) {
    const domain = process.env.AUTH0_DOMAIN
    const audience = process.env.AUTH0_AUDIENCE

    console.log('🔐 Creating JWT middleware with domain:', domain)

    if (!domain) {
      throw new Error('AUTH0_DOMAIN environment variable is not set!')
    }

    _jwtCheck = expressjwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`
      }),
      audience: audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256']
    })
  }
  return _jwtCheck
}

// Export a middleware function that creates the real middleware on first use
export const jwtCheck = (req, res, next) => {
  const middleware = createJwtMiddleware()
  return middleware(req, res, next)
}

// Middleware to extract user info from JWT
export const extractUser = (req, res, next) => {
  if (req.auth) {
    req.user = {
      sub: req.auth.sub,
      permissions: req.auth.permissions || [],
      scope: req.auth.scope
    }
  }
  next()
}
