<template>
  <div class="register-container">
    <div class="register-card vaporwave-card">
      <div class="card-header">
        <h2 class="glow-text">JOIN THE GRID</h2>
        <p class="subtitle">// Create Your Account //</p>
      </div>

      <div class="social-signup">
        <button @click="registerWithGoogle" class="btn-social google">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          Sign up with Google
        </button>
      </div>

      <div class="divider">
        <span>OR</span>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              class="vaporwave-input"
              placeholder="Enter first name"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              class="vaporwave-input"
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="formData.email"
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
            v-model="formData.password"
            type="password"
            class="vaporwave-input"
            placeholder="Enter secure password"
            required
            minlength="8"
          />
          <span class="help-text">Minimum 8 characters</span>
        </div>

        <div class="form-group">
          <label for="country">Country</label>
          <select
            id="country"
            v-model="formData.country"
            class="vaporwave-select"
            required
          >
            <option value="" disabled>Select your country</option>
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </select>
        </div>

        <div v-if="error" class="error-message">
          <span>⚠️ {{ error }}</span>
        </div>

        <button
          type="submit"
          class="btn-neon submit-btn"
          :disabled="loading"
        >
          {{ loading ? 'CONNECTING...' : 'ENTER THE GRID' }}
        </button>
      </form>

      <div class="login-link">
        Already have an account?
        <router-link to="/login">Log In</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const { loginWithRedirect } = useAuth0()

    const formData = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      country: ''
    })

    const loading = ref(false)
    const error = ref('')

    const countries = [
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'AU', name: 'Australia' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'ES', name: 'Spain' },
      { code: 'IT', name: 'Italy' },
      { code: 'NL', name: 'Netherlands' },
      { code: 'SE', name: 'Sweden' },
      { code: 'NO', name: 'Norway' },
      { code: 'DK', name: 'Denmark' },
      { code: 'FI', name: 'Finland' },
      { code: 'PL', name: 'Poland' },
      { code: 'BR', name: 'Brazil' },
      { code: 'MX', name: 'Mexico' },
      { code: 'AR', name: 'Argentina' },
      { code: 'JP', name: 'Japan' },
      { code: 'KR', name: 'South Korea' },
      { code: 'CN', name: 'China' },
      { code: 'IN', name: 'India' },
      { code: 'SG', name: 'Singapore' },
      { code: 'NZ', name: 'New Zealand' },
      { code: 'ZA', name: 'South Africa' }
    ]

    const handleRegister = async () => {
      loading.value = true
      error.value = ''

      try {
        // Auth0 signup with redirect and user metadata
        await loginWithRedirect({
          authorizationParams: {
            screen_hint: 'signup',
            login_hint: formData.value.email
          },
          appState: {
            userData: {
              firstName: formData.value.firstName,
              lastName: formData.value.lastName,
              country: formData.value.country
            }
          }
        })
      } catch (err) {
        console.error('Registration error:', err)
        error.value = err.message || 'Failed to register. Please try again.'
        loading.value = false
      }
    }

    const registerWithGoogle = async () => {
      try {
        await loginWithRedirect({
          authorizationParams: {
            connection: 'google-oauth2',
            screen_hint: 'signup'
          }
        })
      } catch (err) {
        console.error('Google registration error:', err)
        error.value = 'Failed to sign up with Google. Please try again.'
      }
    }

    return {
      formData,
      loading,
      error,
      countries,
      handleRegister,
      registerWithGoogle
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.register-card {
  max-width: 600px;
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

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.help-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
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

.social-signup {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
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
  box-shadow: 0 0 20px rgba(66, 133, 244, 0.5);
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

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

.login-link a {
  color: var(--neon-cyan);
  font-weight: 600;
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .card-header h2 {
    font-size: 2rem;
  }
}
</style>
