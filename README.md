# Auth Monorepo with Vue.js, BFF, and User Service

A full-stack authentication monorepo featuring a Vue.js frontend, Backend for Frontend (BFF) layer, and user service, all secured with Auth0.

## Architecture

```
┌─────────────────┐
│   Vue.js SPA    │  Port 5173
│  (Frontend)     │
└────────┬────────┘
         │ HTTP + JWT
         │
┌────────▼────────┐
│   BFF Layer     │  Port 3001
│  (Express.js)   │
└────────┬────────┘
         │ HTTP + JWT
         │
┌────────▼────────┐
│  User Service   │  Port 3002
│  (Express.js)   │
└─────────────────┘

      Auth0
   ┌─────────┐
   │ Identity│
   │ Provider│
   └─────────┘
```

### Components

1. **Frontend (Vue.js + Vite)**
   - Single Page Application with Vue 3
   - Auth0 integration for authentication
   - Protected routes with auth guards
   - API client for BFF communication

2. **BFF (Backend for Frontend)**
   - Express.js server
   - JWT validation using Auth0
   - Proxies requests to microservices
   - CORS configuration for frontend

3. **User Service**
   - Express.js microservice
   - User profile management
   - JWT validation
   - In-memory user storage (can be replaced with database)

## Prerequisites

- Node.js 18+ and npm
- Auth0 account (free tier available)
- Git

## Quick Start

### 1. Clone and Install

```bash
cd auth-monorepo
npm install
cd frontend && npm install && cd ..
cd bff && npm install && cd ..
cd user-service && npm install && cd ..
```

Or use the Makefile:
```bash
make install
```

### 2. Set Up Auth0

Follow the detailed guide in [AUTH0_SETUP.md](./AUTH0_SETUP.md) to:
- Create an Auth0 account
- Create an API
- Create a Single Page Application
- Get your credentials

### 3. Configure Environment Variables

**Option A: Use the setup script (recommended)**

```bash
make setup-env
```

**Option B: Manually create .env files**

Create `.env` files in each service directory based on the `.env.example` files:

- `frontend/.env`
- `bff/.env`
- `user-service/.env`

See [AUTH0_SETUP.md](./AUTH0_SETUP.md) for detailed configuration.

### 4. Start Development Servers

```bash
npm run dev
```

Or with Make:
```bash
make dev
```

This will start all three services concurrently:
- Frontend: http://localhost:5173
- BFF: http://localhost:3001
- User Service: http://localhost:3002

### 5. Test the Application

1. Open http://localhost:5173
2. Click "Log In"
3. Authenticate with Auth0
4. Visit the Profile page
5. Click "Fetch User Data from BFF" to test the full flow

## Project Structure

```
auth-monorepo/
├── frontend/                 # Vue.js SPA
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── views/           # Page views
│   │   ├── services/        # API clients
│   │   ├── router/          # Vue Router config
│   │   ├── App.vue          # Root component
│   │   └── main.js          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── bff/                      # Backend for Frontend
│   ├── src/
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   └── server.js        # Express server
│   └── package.json
│
├── user-service/             # User microservice
│   ├── src/
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── server.js        # Express server
│   └── package.json
│
├── package.json              # Root package.json
├── docker-compose.yml        # Docker configuration
├── Makefile                  # Development commands
├── AUTH0_SETUP.md           # Auth0 setup guide
└── README.md                # This file
```

## Available Scripts

### Root Level

- `npm run dev` - Start all services
- `npm run dev:frontend` - Start only frontend
- `npm run dev:bff` - Start only BFF
- `npm run dev:user-service` - Start only user service
- `npm run build` - Build frontend for production
- `npm run clean` - Remove all node_modules

### Using Make

- `make help` - Show all available commands
- `make install` - Install all dependencies
- `make dev` - Start all services
- `make build` - Build frontend
- `make clean` - Clean node_modules
- `make setup-env` - Interactive environment setup

## API Endpoints

### BFF Layer (http://localhost:3001)

- `GET /health` - Health check (public)
- `GET /api/users/me` - Get current user profile (protected)
- `GET /api/users/profile` - Get user profile from BFF (protected)
- `GET /api/protected` - Protected endpoint example (protected)

### User Service (http://localhost:3002)

- `GET /health` - Health check (public)
- `GET /api/users/me` - Get current user (protected)
- `GET /api/users/:userId` - Get user by ID (protected)

## Authentication Flow

1. User clicks "Log In" in the Vue.js frontend
2. Auth0 Vue SDK redirects to Auth0 login page
3. User authenticates with Auth0
4. Auth0 redirects back with authorization code
5. Frontend exchanges code for JWT access token
6. Frontend includes JWT in Authorization header for API calls
7. BFF validates JWT using Auth0's public keys (JWKS)
8. BFF forwards request to user service (with JWT)
9. User service validates JWT and returns data
10. BFF returns data to frontend

## Security Features

- JWT-based authentication
- RS256 algorithm for token signing
- JWKS (JSON Web Key Set) for public key retrieval
- Token validation on both BFF and microservice layers
- CORS configuration
- Protected routes in frontend
- Secure token storage (Auth0 SDK handles this)

## Development Tips

### Testing Authentication

1. Use Auth0's test users or create your own
2. Check browser DevTools Network tab to see JWT tokens
3. Use the `/health` endpoints to verify services are running

### Debugging

- Check console logs in each service
- Verify environment variables are set correctly
- Ensure Auth0 configuration matches across all services
- Check CORS settings if requests are blocked

### Hot Reload

All services support hot reload:
- Frontend: Vite HMR
- Backend services: Node.js `--watch` flag

## Production Considerations

### Before Deploying

1. **Environment Variables**
   - Use production Auth0 tenant
   - Set production URLs in Auth0 dashboard
   - Enable HTTPS for all services

2. **Security**
   - Enable rate limiting
   - Add request validation
   - Implement proper error handling
   - Set up monitoring and logging

3. **Database**
   - Replace in-memory storage with a real database
   - Set up migrations
   - Configure backups

4. **Infrastructure**
   - Use environment-specific configs
   - Set up CI/CD pipelines
   - Configure load balancing
   - Enable auto-scaling

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# The dist/ folder contains the production build
```

## Docker Support

### Development with Docker

```bash
make docker-build
make docker-up
```

Or directly:
```bash
docker-compose up --build
```

### Stop Services

```bash
make docker-down
```

## Troubleshooting

### "Invalid callback URL" error
- Verify callback URLs in Auth0 dashboard match your frontend URL
- Check that you're using the correct Auth0 application

### CORS errors
- Ensure `FRONTEND_URL` in BFF matches your frontend URL
- Check `ALLOWED_ORIGINS` in user service

### JWT validation fails
- Verify `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` match across all services
- Check that Auth0 API uses RS256 algorithm
- Ensure you're passing the token in the Authorization header

### Services won't start
- Check if ports 3001, 3002, or 5173 are already in use
- Verify all environment variables are set
- Check Node.js version (requires 18+)

## Extending the Application

### Add a New Microservice

1. Create a new directory (e.g., `order-service`)
2. Copy structure from `user-service`
3. Add JWT validation middleware
4. Create routes and services
5. Update BFF to proxy requests
6. Add to `package.json` workspace
7. Update `docker-compose.yml`

### Add Database Support

1. Install database client (e.g., `pg` for PostgreSQL)
2. Update `userService.js` to use database queries
3. Add database configuration to `.env`
4. Create migration scripts
5. Update Docker Compose to include database service

### Add More Auth0 Features

- **Social login**: Enable in Auth0 dashboard
- **Multi-factor authentication**: Configure in Auth0
- **Roles and permissions**: Use Auth0 RBAC
- **Custom claims**: Add to Auth0 Actions

## Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Vue.js Documentation](https://vuejs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)

## License

MIT

## Support

For issues and questions:
1. Check [AUTH0_SETUP.md](./AUTH0_SETUP.md)
2. Review the troubleshooting section above
3. Check Auth0 community forums
4. Open an issue in this repository
