<template>
  <div class="profile">
    <div class="profile-container">
      <h1 class="glow-text">USER PROFILE</h1>
      <p class="subtitle">// Your Digital Identity //</p>

      <div class="vaporwave-card loading-card" v-if="isLoading">
        <div class="loader"></div>
        <p>Loading your profile...</p>
      </div>

      <div v-else-if="user">
        <div class="vaporwave-card profile-card">
          <div class="profile-header">
            <div class="avatar-container">
              <img :src="user.picture" :alt="user.name" class="avatar" />
              <div class="avatar-glow"></div>
            </div>
            <div class="user-info">
              <h2>{{ user.name }}</h2>
              <p class="email">{{ user.email }}</p>
              <div class="status-badge">
                <span class="status-dot"></span>
                <span>VERIFIED</span>
              </div>
            </div>
          </div>

          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-icon">🔐</span>
              <div>
                <div class="stat-label">Security</div>
                <div class="stat-value">Active</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">⚡</span>
              <div>
                <div class="stat-label">Token Status</div>
                <div class="stat-value">Valid</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🌐</span>
              <div>
                <div class="stat-label">Connection</div>
                <div class="stat-value">Online</div>
              </div>
            </div>
          </div>
        </div>

        <div class="vaporwave-card api-card">
          <h3>API INTEGRATION TEST</h3>
          <p class="card-description">
            Connect to the BFF layer to retrieve your user data from the backend services.
          </p>

          <button @click="fetchUserData" :disabled="loading" class="btn-neon">
            {{ loading ? 'CONNECTING...' : 'FETCH DATA FROM BFF' }}
          </button>

          <div v-if="userData" class="user-data">
            <h4>Response from BFF:</h4>
            <div class="data-container">
              <pre>{{ JSON.stringify(userData, null, 2) }}</pre>
            </div>
          </div>

          <div v-if="error" class="error-message">
            <span>⚠️ {{ error }}</span>
          </div>
        </div>

        <details class="vaporwave-card raw-data">
          <summary>VIEW RAW AUTH0 DATA</summary>
          <div class="data-container">
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import apiClient from '../services/api'

export default {
  name: 'Profile',
  setup() {
    const { user, isLoading, getAccessTokenSilently } = useAuth0()
    const userData = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const fetchUserData = async () => {
      loading.value = true
      error.value = null

      try {
        const token = await getAccessTokenSilently()
        const response = await apiClient.getUserProfile(token)
        userData.value = response
      } catch (err) {
        error.value = err.message || 'Failed to fetch user data'
        console.error('Error fetching user data:', err)
      } finally {
        loading.value = false
      }
    }

    return {
      user,
      isLoading,
      userData,
      loading,
      error,
      fetchUserData
    }
  }
}
</script>

<style scoped>
.profile {
  min-height: calc(100vh - 200px);
  padding: 2rem;
  background: radial-gradient(circle at 50% 50%, rgba(5, 255, 161, 0.1) 0%, transparent 50%);
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: var(--neon-cyan);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin-bottom: 3rem;
  opacity: 0.8;
}

.loading-card {
  text-align: center;
  padding: 4rem 2rem;
}

.loader {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(185, 103, 255, 0.2);
  border-top-color: var(--neon-pink);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-card {
  margin-bottom: 2rem;
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

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--deep-purple);
  position: relative;
  z-index: 1;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--neon-cyan);
  box-shadow: 0 0 30px rgba(5, 255, 161, 0.5);
  position: relative;
  z-index: 2;
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: var(--gradient-neon);
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

.user-info {
  flex: 1;
}

.user-info h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--neon-pink);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.email {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(5, 255, 161, 0.2);
  border: 2px solid var(--neon-cyan);
  border-radius: 20px;
  font-family: var(--font-display);
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: var(--neon-cyan);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--neon-cyan);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--neon-cyan);
  animation: pulse 2s ease-in-out infinite;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(5, 8, 20, 0.5);
  border: 2px solid var(--deep-purple);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  border-color: var(--neon-purple);
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  color: var(--neon-cyan);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
}

.api-card {
  margin-bottom: 2rem;
  animation: slideUp 0.8s ease;
  position: relative;
  z-index: 1;
}

.api-card h3 {
  color: var(--neon-pink);
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.card-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.user-data {
  margin-top: 2rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.user-data h4 {
  color: var(--neon-cyan);
  font-family: var(--font-display);
  margin-bottom: 1rem;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

.data-container {
  background: rgba(5, 8, 20, 0.8);
  border: 2px solid var(--deep-purple);
  border-radius: 8px;
  padding: 1.5rem;
  overflow-x: auto;
}

.data-container pre {
  color: var(--neon-cyan);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.error-message {
  margin-top: 1.5rem;
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

.raw-data {
  cursor: pointer;
  animation: slideUp 1s ease;
}

.raw-data summary {
  font-family: var(--font-display);
  color: var(--neon-purple);
  font-size: 1.2rem;
  letter-spacing: 2px;
  padding: 1rem 0;
  text-align: center;
  transition: all 0.3s ease;
}

.raw-data summary:hover {
  color: var(--neon-pink);
  text-shadow: var(--glow-pink);
}

.raw-data[open] summary {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--deep-purple);
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  h1 {
    font-size: 2rem;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }
}
</style>
