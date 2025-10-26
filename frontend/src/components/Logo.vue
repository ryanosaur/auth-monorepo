<template>
  <div class="logo-container">
    <div class="logo">
      <div class="logo-text">
        <span class="claude">CLAUDE</span>
        <span class="test">TEST</span>
        <span class="app">APP</span>
      </div>
      <div class="logo-tagline">// RETRO FUTURE AUTHENTICATION //</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style scoped>
.logo-container {
  display: inline-block;
}

.logo {
  text-align: center;
  user-select: none;
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
}

.logo-text span {
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: 8px;
  line-height: 1;
  position: relative;
}

.claude {
  font-size: 3.5rem;
  background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(5, 255, 161, 0.5);
  animation: glowCyan 2s ease-in-out infinite;
}

.test {
  font-size: 2.8rem;
  background: linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-pink) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(185, 103, 255, 0.5);
  margin-top: -0.5rem;
  animation: glowPurple 2s ease-in-out infinite;
  animation-delay: 0.3s;
}

.app {
  font-size: 3rem;
  background: linear-gradient(135deg, var(--neon-pink) 0%, #ff6ec7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 110, 199, 0.5);
  margin-top: -0.5rem;
  animation: glowPink 2s ease-in-out infinite;
  animation-delay: 0.6s;
}

.logo-tagline {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: var(--neon-cyan);
  letter-spacing: 2px;
  margin-top: 0.5rem;
  opacity: 0.8;
  animation: blink 3s ease-in-out infinite;
}

@keyframes glowCyan {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(5, 255, 161, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(5, 255, 161, 0.9));
  }
}

@keyframes glowPurple {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(185, 103, 255, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(185, 103, 255, 0.9));
  }
}

@keyframes glowPink {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(255, 110, 199, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 110, 199, 0.9));
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.3;
  }
}

/* Compact version for navbar */
.logo-container.compact .logo-text span {
  font-size: 1.5rem !important;
  letter-spacing: 4px;
}

.logo-container.compact .claude {
  font-size: 1.8rem !important;
}

.logo-container.compact .test {
  font-size: 1.5rem !important;
  margin-top: -0.3rem;
}

.logo-container.compact .app {
  font-size: 1.6rem !important;
  margin-top: -0.3rem;
}

.logo-container.compact .logo-tagline {
  font-size: 0.5rem;
  margin-top: 0.2rem;
}
</style>
