<template>
  <header class="header">
    <div class="container header-inner">
      <div class="header-brand">
        <div class="logo">
          <i class="fas fa-trophy"></i>
        </div>
        <div>
          <h1 class="header-title">Scoreboard <span class="pro-badge">PRO</span></h1>
          <p class="header-subtitle">Placar interativo para jogos</p>
        </div>
      </div>

      <div class="header-center" v-if="store.gameStarted">
        <div class="round-display">
          <span class="round-label">Rodada</span>
          <span class="round-number">{{ store.roundNumber }}</span>
        </div>
        <div class="timer-display">
          <i class="fas fa-clock"></i>
          <span class="timer-value" :class="{ 'timer-running': store.timerRunning }">
            {{ store.formattedTimer }}
          </span>
        </div>
      </div>

      <div class="header-actions">
        <button v-if="store.gameStarted" class="btn btn-ghost btn-icon" @click="toggleSettings" data-tooltip="Configurações">
          <i class="fas fa-cog" :class="{ 'fa-spin': showSettings }"></i>
        </button>
      </div>
    </div>

    <!-- Settings panel -->
    <Transition name="slide">
      <div v-if="showSettings" class="settings-panel">
        <div class="container settings-inner">
          <div class="setting-group">
            <label class="setting-label"><i class="fas fa-bullseye"></i> Pontuação máxima</label>
            <div class="setting-control">
              <button class="btn btn-icon-sm btn-ghost" @click="changeMax(-1)"><i class="fas fa-minus"></i></button>
              <span class="setting-value">{{ store.maxPoints }}</span>
              <button class="btn btn-icon-sm btn-ghost" @click="changeMax(1)"><i class="fas fa-plus"></i></button>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label"><i class="fas fa-stopwatch"></i> Timer</label>
            <div class="setting-control timer-controls">
              <button class="btn btn-icon-sm" :class="store.timerRunning ? 'btn-danger' : 'btn-success'" @click="toggleTimer">
                <i :class="store.timerRunning ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>
              <button class="btn btn-icon-sm btn-ghost" @click="store.resetTimer()">
                <i class="fas fa-redo"></i>
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label"><i class="fas fa-forward"></i> Rodada</label>
            <button class="btn btn-ghost" @click="store.nextRound()">
              Próxima Rodada <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <div class="setting-group">
            <label class="setting-label"><i class="fas fa-undo"></i> Ações</label>
            <div class="setting-control" style="gap: 8px;">
              <button class="btn btn-ghost" @click="store.resetScores()">
                <i class="fas fa-redo"></i> Reset Placares
              </button>
              <button class="btn btn-danger" @click="confirmResetAll">
                <i class="fas fa-trash"></i> Reset Tudo
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useScoreboardStore } from '~/stores/scoreboard'

const store = useScoreboardStore()
const showSettings = ref(false)

function toggleSettings() {
  showSettings.value = !showSettings.value
}

function changeMax(delta: number) {
  store.setMaxPoints(store.maxPoints + delta)
}

function toggleTimer() {
  if (store.timerRunning) {
    store.stopTimer()
  } else {
    store.startTimer()
  }
}

function confirmResetAll() {
  if (confirm('Tem certeza que deseja resetar TUDO? Times e pontuações serão removidos.')) {
    store.resetAll()
    showSettings.value = false
  }
}
</script>

<style scoped>
.header {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  gap: 20px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 44px;
  height: 44px;
  background: var(--primary-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
}

.header-title {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #e2e8f0, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.pro-badge {
  font-size: 0.6rem;
  background: var(--accent);
  color: #1a1a2e;
  -webkit-text-fill-color: #1a1a2e;
  padding: 2px 6px;
  border-radius: 4px;
  vertical-align: super;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.header-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 20px;
}

.round-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.round-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.round-number {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  color: var(--secondary);
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: var(--bg-card);
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.timer-display i {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.timer-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.timer-running {
  color: var(--success) !important;
}

/* Settings Panel */
.settings-panel {
  border-top: 1px solid var(--border-color);
  background: rgba(26, 26, 46, 0.98);
}

.settings-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 16px 20px;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.setting-value {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 1rem;
  min-width: 30px;
  text-align: center;
  color: var(--accent);
}

.timer-controls {
  gap: 6px;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 200px;
}

@media (max-width: 768px) {
  .header-inner {
    flex-wrap: wrap;
    padding: 10px 12px;
    gap: 10px;
  }

  .header-center {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .settings-inner {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
