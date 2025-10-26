# Google Authentication Setup Guide

## Quick Start (Development)

Auth0 provides default Google credentials for development and testing. You can enable Google authentication immediately without setting up your own Google OAuth app.

### Enable in Auth0 (2 minutes)

1. **Log in to Auth0 Dashboard**
   - Go to https://manage.auth0.com

2. **Navigate to Social Connections**
   - Click **Authentication** in the left sidebar
   - Click **Social**

3. **Enable Google**
   - Find **google-oauth2** in the list
   - Toggle it **ON** (it will turn blue)
   - A popup will appear

4. **Use Development Keys** (for testing)
   - Click **Continue with default settings**
   - Auth0 will use their development credentials
   - Click **Try Connection** to test

5. **Assign to Your Application**
   - Go to the **Applications** tab in the popup
   - Check your application(s) to enable Google for them
   - Click **Save**

**That's it!** Google authentication is now enabled.

### Test It

1. Go to http://localhost:5173/register
2. Click **"Sign up with Google"**
3. You'll be redirected to Google login
4. After authentication, you'll land on the dashboard

---

## Production Setup (Google Cloud Console)

For production apps, you should use your own Google OAuth credentials:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select a Project** → **New Project**
3. Enter project name: "Claude Test App"
4. Click **Create**

### Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### Step 3: Create OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace)
3. Click **Create**
4. Fill in required fields:
   - **App name**: Claude Test App
   - **User support email**: your email
   - **Developer contact**: your email
5. Click **Save and Continue**
6. **Scopes**: Click **Save and Continue** (use defaults)
7. **Test users**: Add your email for testing
8. Click **Save and Continue**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Name it: "Claude Test App - Auth0"
5. Add **Authorized redirect URIs**:
   ```
   https://YOUR-TENANT.auth0.com/login/callback
   ```
   Replace `YOUR-TENANT` with your Auth0 domain (e.g., `dev-abc123.us`)

6. Click **Create**
7. Copy your **Client ID** and **Client Secret**

### Step 5: Configure Auth0 with Your Credentials

1. Back in Auth0 Dashboard
2. Go to **Authentication** → **Social** → **google-oauth2**
3. Enter your **Client ID** and **Client Secret** from Google
4. (Optional) Add custom scopes:
   ```
   email
   profile
   openid
   ```
5. Click **Save Changes**

### Step 6: Publish Your OAuth Consent Screen (Production)

1. In Google Cloud Console
2. Go to **OAuth consent screen**
3. Click **Publish App**
4. Confirm publishing

⚠️ **Note**: Until published, only test users can authenticate.

---

## Advanced Configuration

### Request Additional Scopes

In Auth0 Google connection settings, you can request additional permissions:

```
email
profile
openid
https://www.googleapis.com/auth/user.birthday.read
https://www.googleapis.com/auth/user.gender.read
```

### Custom Parameters

You can pass additional parameters to Google:

```javascript
// In your Vue component
await loginWithRedirect({
  authorizationParams: {
    connection: 'google-oauth2',
    screen_hint: 'signup',
    // Custom Google parameters
    access_type: 'offline',  // Get refresh token
    prompt: 'consent'        // Force consent screen
  }
})
```

### Customize Button

The Google button already has proper styling in Register.vue and Login.vue. To customize further:

```vue
<button @click="registerWithGoogle" class="btn-social google">
  <img src="/google-logo.svg" width="20" height="20" />
  Sign up with Google
</button>
```

---

## Troubleshooting

### "Access blocked: Claude Test App has not completed verification"

**Cause**: Your app is in development mode.

**Solutions**:
- Add test users in Google Cloud Console
- OR publish your OAuth consent screen (production only)

### "Redirect URI mismatch"

**Cause**: The redirect URI in Google doesn't match Auth0's callback.

**Fix**:
1. Get correct URI from Auth0:
   - Auth0 Dashboard → Authentication → Social → google-oauth2
   - Copy the redirect URI shown
2. Add it to Google Cloud Console:
   - Credentials → Your OAuth client → Authorized redirect URIs

### "Invalid Client ID"

**Cause**: Client ID/Secret mismatch.

**Fix**:
1. Verify you copied the correct credentials from Google
2. Regenerate OAuth credentials in Google if needed
3. Update Auth0 with new credentials

### Users see "Sign in with Google temporarily disabled"

**Cause**: Auth0 connection is disabled or app not assigned.

**Fix**:
1. Auth0 → Authentication → Social → google-oauth2
2. Ensure toggle is ON
3. Click Applications tab
4. Enable for your application

---

## Security Best Practices

### Production Checklist

- [ ] Use your own OAuth credentials (not Auth0's defaults)
- [ ] Enable HTTPS on your application
- [ ] Publish OAuth consent screen
- [ ] Review requested scopes (request minimum needed)
- [ ] Set up proper error handling for auth failures
- [ ] Monitor failed login attempts
- [ ] Implement session timeout
- [ ] Add CSRF protection
- [ ] Review Auth0 security settings

### Data Privacy

Google provides user data according to your requested scopes:
- **email**: User's email address
- **profile**: Name, picture, locale
- **openid**: Standard OpenID Connect claims

Make sure to:
1. Have a privacy policy
2. Disclose data usage in OAuth consent screen
3. Only request scopes you actually use
4. Handle user data securely

---

## Testing Social Login

### Test Flow

1. **Registration**: Click "Sign up with Google"
2. **Google Login**: Enter Google credentials
3. **Consent**: Grant permissions (first time)
4. **Redirect**: Back to your app
5. **Dashboard**: Should land on `/dashboard`
6. **Profile**: Check user data populated correctly

### Test Cases

- [ ] New user registration
- [ ] Existing user login
- [ ] Email already exists (different provider)
- [ ] Login error handling
- [ ] Logout and re-login
- [ ] Multiple Google accounts
- [ ] Revoked permissions

---

## Alternative: GitHub Authentication

Want to add GitHub too? It's already in the Login page!

1. Auth0 → Authentication → Social
2. Enable **github**
3. Use Auth0 dev credentials or add your own:
   - Create OAuth App in GitHub
   - Add Client ID/Secret to Auth0
4. Update Register.vue to add GitHub button

---

## Support & Resources

- [Auth0 Google Connection Docs](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers/google)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Auth0 Social Connections](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers)

**Need Help?**
- Auth0 Community Forum
- Google Cloud Support
- Stack Overflow (tag: auth0, oauth2)
