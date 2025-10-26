<template>
  <div class="home">
    <div class="hero-section">
      <Logo />
      <p class="hero-subtitle">
        // SECURE AUTHENTICATION FOR THE RETRO FUTURE //
      </p>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">256</span>
          <span class="stat-label">Bit Encryption</span>
        </div>
        <div class="stat">
          <span class="stat-number">∞</span>
          <span class="stat-label">Possibilities</span>
        </div>
        <div class="stat">
          <span class="stat-number">100%</span>
          <span class="stat-label">Vaporwave</span>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div v-if="!isAuthenticated" class="vaporwave-card welcome-card">
        <div class="card-icon">🌊</div>
        <h2 class="glow-text">WELCOME TO THE GRID</h2>
        <p class="card-description">
          Experience the future of authentication with our retro-inspired platform.
          Join thousands of users in the digital realm.
        </p>
        <div class="action-buttons">
          <router-link to="/register" class="btn-neon primary-btn">
            Join the Grid
          </router-link>
          <router-link to="/login" class="btn-neon secondary-btn">
            Access Terminal
          </router-link>
        </div>
      </div>

      <div v-else class="vaporwave-card authenticated-card">
        <div class="card-icon">✨</div>
        <h2 class="glow-text">WELCOME BACK, {{ user?.name }}!</h2>
        <p class="card-description">
          You are successfully connected to the grid. Your authentication is secure
          and your journey through the digital realm continues.
        </p>
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">ONLINE</span>
        </div>
        <router-link to="/profile" class="btn-neon">
          View Profile
        </router-link>
      </div>
    </div>

    <div class="features-section">
      <h3 class="section-title">POWERED BY THE LATEST TECH</h3>
      <div class="features-grid">
        <div class="feature-card vaporwave-card">
          <div class="feature-icon">🔒</div>
          <h4>Secure Auth</h4>
          <p>Auth0-powered authentication with industry-standard security</p>
        </div>
        <div class="feature-card vaporwave-card">
          <div class="feature-icon">⚡</div>
          <h4>Lightning Fast</h4>
          <p>Built with Vue.js for blazing fast performance</p>
        </div>
        <div class="feature-card vaporwave-card">
          <div class="feature-icon">🎨</div>
          <h4>Retro Aesthetic</h4>
          <p>Vaporwave-inspired design that takes you back to the future</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue'
import Logo from '../components/Logo.vue'

export default {
  name: 'Home',
  components: {
    Logo
  },
  setup() {
    const { isAuthenticated, user } = useAuth0()

    return {
      isAuthenticated,
      user
    }
  }
}
</script>

<style scoped>
.home {
  min-height: calc(100vh - 200px);
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: radial-gradient(circle at 50% 50%, rgba(185, 103, 255, 0.15) 0%, transparent 70%);
  animation: heroGlow 4s ease-in-out infinite;
}

@keyframes heroGlow {
  0%, 100% {
    background: radial-gradient(circle at 50% 50%, rgba(185, 103, 255, 0.15) 0%, transparent 70%);
  }
  50% {
    background: radial-gradient(circle at 50% 50%, rgba(5, 255, 161, 0.15) 0%, transparent 70%);
  }
}

.hero-subtitle {
  font-family: 'Courier New', monospace;
  color: var(--neon-cyan);
  font-size: 1rem;
  letter-spacing: 2px;
  margin-top: 1rem;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 900;
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 0.5rem;
}

.content-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-card,
.authenticated-card {
  text-align: center;
  animation: slideUp 0.8s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.welcome-card h2,
.authenticated-card h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.card-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  background: var(--gradient-neon);
  border-color: transparent;
  color: white;
}

.secondary-btn {
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 2rem 0;
  font-family: var(--font-display);
  letter-spacing: 2px;
}

.status-dot {
  width: 12px;
  height: 12px;
  background: var(--neon-cyan);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--neon-cyan);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.status-text {
  color: var(--neon-cyan);
  font-weight: 900;
}

.features-section {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  font-family: var(--font-display);
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h4 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--neon-pink);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-stats {
    gap: 2rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
