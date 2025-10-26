#!/bin/bash

# Interactive Auth0 Setup Guide
# This script walks you through the Auth0 setup process

echo "╔════════════════════════════════════════════════════════╗"
echo "║     Auth0 Setup Guide - Interactive Walkthrough       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Create Account
echo -e "${BLUE}STEP 1: Create Auth0 Account${NC}"
echo "════════════════════════════════════════════════════════"
echo "1. Open your browser and go to: https://auth0.com/signup"
echo "2. Sign up with your email or use Google/GitHub"
echo "3. Choose a tenant domain (e.g., 'my-app-dev')"
echo "4. Select your region (choose closest to you)"
echo ""
read -p "Press ENTER when you've created your account and are logged in..."
echo ""

# Step 2: Create API
echo -e "${BLUE}STEP 2: Create an Auth0 API${NC}"
echo "════════════════════════════════════════════════════════"
echo "1. In the Auth0 Dashboard, click 'Applications' in the left sidebar"
echo "2. Click on 'APIs'"
echo "3. Click the '+ Create API' button"
echo "4. Fill in:"
echo "   - Name: 'My App API' (or any name you prefer)"
echo "   - Identifier: 'https://api.myapp.com' (this is your audience)"
echo "   - Signing Algorithm: RS256 (should be default)"
echo "5. Click 'Create'"
echo ""
read -p "Press ENTER when you've created the API..."
echo ""

echo -e "${YELLOW}📋 Copy your API Identifier:${NC}"
read -p "Paste your API Identifier here: " AUTH0_AUDIENCE
echo ""

# Step 3: Get Domain
echo -e "${BLUE}STEP 3: Get your Auth0 Domain${NC}"
echo "════════════════════════════════════════════════════════"
echo "Look at the top-right corner of your Auth0 dashboard"
echo "You should see your tenant name (e.g., 'dev-abc123.us.auth0.com')"
echo ""
read -p "Enter your Auth0 Domain: " AUTH0_DOMAIN
echo ""

# Step 4: Create Application
echo -e "${BLUE}STEP 4: Create Single Page Application${NC}"
echo "════════════════════════════════════════════════════════"
echo "1. In the Auth0 Dashboard, go to 'Applications' > 'Applications'"
echo "2. Click '+ Create Application'"
echo "3. Fill in:"
echo "   - Name: 'My App Frontend' (or any name)"
echo "   - Application Type: Select 'Single Page Web Applications'"
echo "4. Click 'Create'"
echo ""
read -p "Press ENTER when you've created the application..."
echo ""

echo "5. You should now be on the application's 'Settings' tab"
echo "6. Scroll down and configure the following:"
echo ""
echo "   Allowed Callback URLs:"
echo "   → http://localhost:5173"
echo ""
echo "   Allowed Logout URLs:"
echo "   → http://localhost:5173"
echo ""
echo "   Allowed Web Origins:"
echo "   → http://localhost:5173"
echo ""
echo "   Allowed Origins (CORS):"
echo "   → http://localhost:5173"
echo ""
echo "7. Scroll to the bottom and click 'Save Changes'"
echo ""
read -p "Press ENTER when you've configured these settings..."
echo ""

echo -e "${YELLOW}📋 Copy your Client ID:${NC}"
echo "It's near the top of the Settings page"
echo ""
read -p "Paste your Client ID here: " AUTH0_CLIENT_ID
echo ""

# Step 5: Create .env files
echo -e "${BLUE}STEP 5: Creating .env files${NC}"
echo "════════════════════════════════════════════════════════"

# Create frontend/.env
cat > frontend/.env << EOF
VITE_AUTH0_DOMAIN=$AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE=$AUTH0_AUDIENCE
VITE_BFF_API_URL=http://localhost:3001
EOF

# Create bff/.env
cat > bff/.env << EOF
PORT=3001
NODE_ENV=development
AUTH0_DOMAIN=$AUTH0_DOMAIN
AUTH0_AUDIENCE=$AUTH0_AUDIENCE
USER_SERVICE_URL=http://localhost:3002
FRONTEND_URL=http://localhost:5173
EOF

# Create user-service/.env
cat > user-service/.env << EOF
PORT=3002
NODE_ENV=development
AUTH0_DOMAIN=$AUTH0_DOMAIN
AUTH0_AUDIENCE=$AUTH0_AUDIENCE
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5173
EOF

echo -e "${GREEN}✅ Environment files created successfully!${NC}"
echo ""

# Summary
echo -e "${BLUE}SUMMARY${NC}"
echo "════════════════════════════════════════════════════════"
echo -e "Auth0 Domain:    ${GREEN}$AUTH0_DOMAIN${NC}"
echo -e "Client ID:       ${GREEN}$AUTH0_CLIENT_ID${NC}"
echo -e "Audience:        ${GREEN}$AUTH0_AUDIENCE${NC}"
echo ""

echo -e "${GREEN}✅ Auth0 setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Install dependencies: make install (or npm install in each directory)"
echo "2. Start the app: make dev (or npm run dev)"
echo "3. Open http://localhost:5173 and test the login"
echo ""
