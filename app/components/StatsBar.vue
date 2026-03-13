<template>
  <div class="stats-bar" v-if="store.teams.length > 0">
    <div class="stat-item">
      <div class="stat-icon"><i class="fas fa-users"></i></div>
      <div class="stat-info">
        <span class="stat-value">{{ store.teams.length }}</span>
        <span class="stat-label">Times</span>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon"><i class="fas fa-user"></i></div>
      <div class="stat-info">
        <span class="stat-value">{{ totalMembers }}</span>
        <span class="stat-label">Jogadores</span>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon"><i class="fas fa-star"></i></div>
      <div class="stat-info">
        <span class="stat-value">{{ store.totalPoints }}</span>
        <span class="stat-label">Pontos total</span>
      </div>
    </div>

    <div class="stat-item" v-if="store.leader">
      <div class="stat-icon leader-icon"><i class="fas fa-crown"></i></div>
      <div class="stat-info">
        <span class="stat-value leader-value">{{ store.leader.name }}</span>
        <span class="stat-label">Líder</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScoreboardStore } from '~/stores/scoreboard'

const store = useScoreboardStore()

const totalMembers = computed(() => {
  return store.teams.reduce((sum, t) => sum + t.members.length, 0)
})
</script>

<style scoped>
.stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  animation: fadeInUp 0.5s ease-out;
}

.stat-item {
  flex: 1;
  min-width: 120px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition);
}

.stat-item:hover {
  border-color: rgba(124, 58, 237, 0.3);
  box-shadow: var(--shadow-glow);
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(124, 58, 237, 0.12);
  color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.leader-icon {
  background: rgba(245, 158, 11, 0.12);
  color: var(--accent);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-bright);
}

.leader-value {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
}

.stat-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
