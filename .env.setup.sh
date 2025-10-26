#!/bin/bash

# Helper script to set up environment variables
# Usage: ./env-setup.sh

echo "🔧 Auth0 Configuration Setup"
echo "=============================="
echo ""

# Prompt for Auth0 credentials
read -p "Enter your Auth0 Domain (e.g., my-app.us.auth0.com): " AUTH0_DOMAIN
read -p "Enter your Auth0 Client ID: " AUTH0_CLIENT_ID
read -p "Enter your Auth0 Audience (API Identifier): " AUTH0_AUDIENCE

echo ""
echo "Creating .env files..."

# Frontend .env
cat > frontend/.env << EOF
VITE_AUTH0_DOMAIN=$AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE=$AUTH0_AUDIENCE
VITE_BFF_API_URL=http://localhost:3001
EOF

# BFF .env
cat > bff/.env << EOF
PORT=3001
NODE_ENV=development
AUTH0_DOMAIN=$AUTH0_DOMAIN
AUTH0_AUDIENCE=$AUTH0_AUDIENCE
USER_SERVICE_URL=http://localhost:3002
FRONTEND_URL=http://localhost:5173
EOF

# User Service .env
cat > user-service/.env << EOF
PORT=3002
NODE_ENV=development
AUTH0_DOMAIN=$AUTH0_DOMAIN
AUTH0_AUDIENCE=$AUTH0_AUDIENCE
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5173
EOF

echo ""
echo "✅ Environment files created successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run dev' to start all services"
echo ""
