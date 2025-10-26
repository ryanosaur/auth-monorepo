import { expressjwt } from 'express-jwt'
import jwksRsa from 'jwks-rsa'

// JWT verification middleware
export const jwtCheck = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
})

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
