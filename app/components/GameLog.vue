<template>
  <div class="game-log card animate-fade-in-up">
    <div class="log-header" @click="isOpen = !isOpen">
      <h2 class="log-title">
        <i class="fas fa-scroll"></i> Histórico
        <span class="log-count">{{ store.logs.length }}</span>
      </h2>
      <i class="fas" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'" style="color: var(--text-muted); font-size: 0.8rem;"></i>
    </div>

    <Transition name="expand">
      <div v-if="isOpen" class="log-content">
        <div v-if="store.logs.length === 0" class="log-empty">
          <i class="fas fa-ghost"></i>
          <p>Nenhum evento ainda...</p>
        </div>
        <TransitionGroup v-else name="log-item" tag="ul" class="log-list">
          <li v-for="log in store.recentLogs" :key="log.id" class="log-entry" :class="'log-' + log.type">
            <div class="log-icon">
              <i :class="iconForType(log.type)"></i>
            </div>
            <span class="log-message">{{ log.message }}</span>
            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          </li>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useScoreboardStore, type GameLog } from '~/stores/scoreboard'

const store = useScoreboardStore()
const isOpen = ref(false)

function iconForType(type: GameLog['type']) {
  switch (type) {
    case 'score': return 'fas fa-star'
    case 'team': return 'fas fa-users'
    case 'member': return 'fas fa-user'
    case 'reset': return 'fas fa-redo'
    case 'timer': return 'fas fa-clock'
    case 'round': return 'fas fa-flag'
    default: return 'fas fa-circle'
  }
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<style scoped>
.game-log {
  padding: 0;
  margin-bottom: 24px;
  overflow: hidden;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  cursor: pointer;
  transition: var(--transition);
}

.log-header:hover {
  background: rgba(255, 255, 255, 0.02);
}

.log-title {
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-title i {
  color: var(--secondary);
}

.log-count {
  font-size: 0.7rem;
  background: var(--bg-surface);
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}

.log-content {
  border-top: 1px solid var(--border-color);
  max-height: 300px;
  overflow-y: auto;
}

.log-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}

.log-empty i {
  font-size: 2rem;
  margin-bottom: 8px;
  display: block;
}

.log-empty p {
  font-size: 0.85rem;
}

.log-list {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 20px;
  font-size: 0.8rem;
  border-bottom: 1px solid rgba(51, 65, 85, 0.15);
}

.log-entry:last-child {
  border-bottom: none;
}

.log-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  flex-shrink: 0;
}

.log-score .log-icon {
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent);
}

.log-team .log-icon {
  background: rgba(124, 58, 237, 0.15);
  color: var(--primary-light);
}

.log-member .log-icon {
  background: rgba(6, 182, 212, 0.15);
  color: var(--secondary);
}

.log-reset .log-icon {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
}

.log-round .log-icon {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.log-message {
  flex: 1;
  color: var(--text-secondary);
}

.log-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 300px;
}

.log-item-enter-active {
  transition: all 0.3s ease;
}

.log-item-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
