# Auth0 Setup Guide

This guide walks you through setting up Auth0 for this application.

## Step 1: Create an Auth0 Account

1. Go to [https://auth0.com/signup](https://auth0.com/signup)
2. Sign up for a free account
3. Choose a tenant domain (e.g., `my-app-dev`)
4. Select your region

## Step 2: Create an API

1. In the Auth0 Dashboard, go to **Applications** → **APIs**
2. Click **Create API**
3. Fill in the details:
   - **Name**: `My App API` (or any name)
   - **Identifier**: `https://api.myapp.com` (this will be your `AUTH0_AUDIENCE`)
   - **Signing Algorithm**: `RS256`
4. Click **Create**
5. Save the **Identifier** - you'll need this for your `.env` files

## Step 3: Create a Single Page Application

1. In the Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **Create Application**
3. Choose:
   - **Name**: `My App Frontend` (or any name)
   - **Application Type**: `Single Page Web Applications`
4. Click **Create**
5. Go to the **Settings** tab and configure:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
   - **Allowed Origins (CORS)**: `http://localhost:5173`
6. Scroll down and click **Save Changes**
7. Note your:
   - **Domain** (e.g., `my-app-dev.us.auth0.com`)
   - **Client ID**

## Step 4: Configure Environment Variables

### Frontend (.env)

Create `frontend/.env` from `frontend/.env.example`:

```bash
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-spa-client-id
VITE_AUTH0_AUDIENCE=https://api.myapp.com
VITE_BFF_API_URL=http://localhost:3001
```

### BFF (.env)

Create `bff/.env` from `bff/.env.example`:

```bash
PORT=3001
NODE_ENV=development
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.myapp.com
USER_SERVICE_URL=http://localhost:3002
FRONTEND_URL=http://localhost:5173
```

### User Service (.env)

Create `user-service/.env` from `user-service/.env.example`:

```bash
PORT=3002
NODE_ENV=development
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.myapp.com
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5173
```

## Step 7: Test the Configuration

1. Start all services: `npm run dev` from the root directory
2. Open http://localhost:5173
3. Try both registration methods:
   - **Google Sign Up**: Click "Sign up with Google" (if enabled in Step 6)
   - **Email/Password**: Fill in the registration form
4. You should be redirected to Auth0's login page
5. After logging in, you should be redirected to the dashboard
6. Visit the Profile and Tasks pages to test the full app

## Step 6: Enable Google Authentication (Recommended)

Google authentication is already integrated in the frontend, so you just need to enable it in Auth0:

1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Find **Google** in the list
3. Click the toggle to enable it
4. Auth0 provides default development credentials for testing
5. For production, click **Continue** to set up your own Google OAuth app:
   - You'll need to create a project in Google Cloud Console
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Auth0
6. Click **Save Changes**

**Test it:**
- Go to your registration page
- Click "Sign up with Google"
- You should be redirected to Google login

### Optional: Enable Other Social Providers

You can also enable:
- **GitHub**: Great for developer-focused apps
- **Facebook**: Popular for consumer apps
- **Twitter/X**: Social media integration
- **LinkedIn**: Professional networking
- **Microsoft**: Enterprise applications

For each provider, follow the same process in **Authentication** → **Social**

## Troubleshooting

### "Invalid callback URL" error
- Make sure `http://localhost:5173` is in **Allowed Callback URLs**

### "Invalid origin" error
- Check that CORS is properly configured in both Auth0 and your backend

### "Invalid audience" error
- Verify that the `AUTH0_AUDIENCE` matches your API identifier exactly

### JWT verification fails
- Ensure all services use the same `AUTH0_DOMAIN` and `AUTH0_AUDIENCE`
- Check that your Auth0 API is using RS256 signing algorithm

## Production Deployment

When deploying to production:

1. Update all URLs to your production domains
2. Create a new Auth0 Application for production (recommended)
3. Set up proper environment variables in your hosting platform
4. Enable HTTPS for all services
5. Review Auth0's security best practices
