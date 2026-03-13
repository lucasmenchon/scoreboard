<template>
  <Teleport to="body">
    <Transition name="confetti">
      <div v-if="store.showConfetti" class="confetti-overlay">
        <div v-for="i in 40" :key="i" class="confetti-piece" :style="confettiStyle(i)"></div>
        <div class="confetti-message">
          <i class="fas fa-trophy"></i>
          <h2>Pontuação Máxima!</h2>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useScoreboardStore } from '~/stores/scoreboard'

const store = useScoreboardStore()

const colors = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1', '#14b8a6']

function confettiStyle(i: number) {
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 1.5 + Math.random() * 2
  const color = colors[i % colors.length]
  const size = 6 + Math.random() * 8
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
  }
}
</script>

<style scoped>
.confetti-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -10px;
  border-radius: 2px;
  animation: confettiFall linear forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--accent);
  animation: pulse 0.5s ease;
}

.confetti-message i {
  font-size: 3rem;
  margin-bottom: 10px;
  display: block;
}

.confetti-message h2 {
  font-size: 1.8rem;
  font-weight: 800;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}

.confetti-enter-active {
  transition: opacity 0.3s;
}
.confetti-leave-active {
  transition: opacity 1s;
}
.confetti-enter-from,
.confetti-leave-to {
  opacity: 0;
}
</style>
