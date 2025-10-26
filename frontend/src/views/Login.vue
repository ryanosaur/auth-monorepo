<template>
  <div class="login-container">
    <div class="login-card vaporwave-card">
      <div class="card-header">
        <h2 class="glow-text">ACCESS TERMINAL</h2>
        <p class="subtitle">// Enter Your Credentials //</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="vaporwave-input"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="vaporwave-input"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          <span>⚠️ {{ error }}</span>
        </div>

        <button
          type="submit"
          class="btn-neon submit-btn"
          :disabled="loading"
        >
          {{ loading ? 'CONNECTING...' : 'CONNECT TO GRID' }}
        </button>
      </form>

      <div class="divider">
        <span>OR</span>
      </div>

      <div class="social-login">
        <button @click="loginWithSocial('google')" class="btn-social google">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          Continue with Google
        </button>

        <button @click="loginWithSocial('github')" class="btn-social github">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
          Continue with GitHub
        </button>
      </div>

      <div class="register-link">
        Don't have an account?
        <router-link to="/register">Join Now</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const { loginWithRedirect } = useAuth0()

    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        // Auth0 login with redirect
        await loginWithRedirect({
          authorizationParams: {
            login_hint: email.value
          }
        })
      } catch (err) {
        console.error('Login error:', err)
        error.value = err.message || 'Failed to login. Please try again.'
        loading.value = false
      }
    }

    const loginWithSocial = async (provider) => {
      try {
        // Map provider names to Auth0 connection identifiers
        const connectionMap = {
          google: 'google-oauth2',
          github: 'github'
        }

        await loginWithRedirect({
          authorizationParams: {
            connection: connectionMap[provider] || provider
          }
        })
      } catch (err) {
        console.error('Social login error:', err)
        error.value = `Failed to login with ${provider}`
      }
    }

    return {
      email,
      password,
      loading,
      error,
      handleLogin,
      loginWithSocial
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.login-card {
  max-width: 500px;
  width: 100%;
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--neon-cyan);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 2px;
  opacity: 0.8;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}

.form-group label {
  color: var(--neon-pink);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-display);
}

.error-message {
  background: rgba(245, 87, 108, 0.2);
  border: 2px solid #f5576c;
  border-radius: 8px;
  padding: 1rem;
  color: #ff6b81;
  text-align: center;
  font-weight: 600;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.submit-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--font-display);
  letter-spacing: 2px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-purple), transparent);
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: 2px solid var(--deep-purple);
  border-radius: 8px;
  background: rgba(5, 8, 20, 0.6);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-body);
}

.btn-social:hover {
  transform: translateY(-2px);
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.btn-social.google:hover {
  border-color: #4285f4;
}

.btn-social.github:hover {
  border-color: #333;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

.register-link a {
  color: var(--neon-cyan);
  font-weight: 600;
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .card-header h2 {
    font-size: 2rem;
  }
}
</style>
