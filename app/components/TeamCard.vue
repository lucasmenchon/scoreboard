<template>
  <div class="team-card card animate-fade-in-up" :style="{ '--team-color': team.color }">
    <!-- Header -->
    <div class="team-header">
      <div class="team-info">
        <div class="team-color-dot" :style="{ background: team.color }"></div>
        <h3 class="team-name">{{ team.name }}</h3>
        <span v-if="rank === 1 && store.teams.length > 1" class="badge badge-gold">
          <i class="fas fa-crown"></i> 1º
        </span>
        <span v-else-if="rank === 2 && store.teams.length > 2" class="badge badge-silver">
          <i class="fas fa-medal"></i> 2º
        </span>
        <span v-else-if="rank === 3 && store.teams.length > 3" class="badge badge-bronze">
          <i class="fas fa-medal"></i> 3º
        </span>
      </div>
      <button class="btn btn-icon-sm btn-ghost remove-btn" @click="handleRemove" title="Remover time">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Score -->
    <div class="score-section">
      <button class="score-btn minus" @click="store.decreasePoints(team.id)" :disabled="team.points <= 0">
        <i class="fas fa-minus"></i>
      </button>

      <div class="score-display">
        <div class="score-ring" :style="progressStyle">
          <span class="score-value" :class="{ 'score-pop': animating }" :key="team.points">
            {{ team.points }}
          </span>
        </div>
        <div class="score-max">/ {{ store.maxPoints }}</div>
      </div>

      <button class="score-btn plus" @click="store.increasePoints(team.id)" :disabled="team.points >= store.maxPoints">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- Progress bar -->
    <div class="progress-bar-container">
      <div
        class="progress-bar-fill"
        :style="{ width: progressPercent + '%', background: team.color }"
      ></div>
    </div>

    <!-- Quick score buttons -->
    <div class="quick-scores">
      <button class="btn btn-ghost quick-score-btn" @click="store.increasePoints(team.id, 2)">+2</button>
      <button class="btn btn-ghost quick-score-btn" @click="store.increasePoints(team.id, 3)">+3</button>
      <button class="btn btn-ghost quick-score-btn" @click="store.increasePoints(team.id, 5)">+5</button>
      <button class="btn btn-ghost quick-score-btn" @click="store.decreasePoints(team.id, 2)">-2</button>
      <button class="btn btn-ghost quick-score-btn" @click="store.decreasePoints(team.id, 3)">-3</button>
    </div>

    <!-- Members -->
    <div class="members-section">
      <div class="members-header" @click="showMembers = !showMembers">
        <span class="members-title">
          <i class="fas fa-users"></i>
          Membros ({{ team.members.length }})
        </span>
        <i class="fas" :class="showMembers ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </div>

      <Transition name="expand">
        <div v-if="showMembers" class="members-content">
          <TransitionGroup name="list" tag="ul" class="members-list">
            <li v-for="member in team.members" :key="member.id" class="member-item">
              <span class="member-avatar">{{ member.avatar }}</span>
              <span class="member-name">{{ member.name }}</span>
              <button class="btn btn-icon-sm btn-ghost member-remove" @click="store.removeMember(team.id, member.id)">
                <i class="fas fa-times"></i>
              </button>
            </li>
          </TransitionGroup>

          <form @submit.prevent="handleAddMember" class="add-member-form">
            <input
              v-model="memberName"
              type="text"
              class="input member-input"
              placeholder="Nome do membro..."
              maxlength="15"
            />
            <button type="submit" class="btn btn-icon-sm btn-primary" :disabled="!memberName.trim()">
              <i class="fas fa-plus"></i>
            </button>
          </form>
        </div>
      </Transition>
    </div>

    <!-- Color picker -->
    <div class="color-picker-row">
      <input
        type="color"
        :value="team.color"
        @input="(e) => store.updateTeamColor(team.id, (e.target as HTMLInputElement).value)"
        class="color-picker"
        title="Cor do time"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScoreboardStore, type Team } from '~/stores/scoreboard'

const props = defineProps<{
  team: Team
  rank: number
}>()

const store = useScoreboardStore()
const showMembers = ref(false)
const memberName = ref('')
const animating = ref(false)

const progressPercent = computed(() => {
  return Math.min((props.team.points / store.maxPoints) * 100, 100)
})

const progressStyle = computed(() => {
  const pct = progressPercent.value
  const deg = (pct / 100) * 360
  return {
    background: `conic-gradient(${props.team.color} ${deg}deg, var(--bg-input) ${deg}deg)`,
  }
})

watch(() => props.team.points, () => {
  animating.value = true
  setTimeout(() => { animating.value = false }, 300)
})

function handleAddMember() {
  if (!memberName.value.trim()) return
  store.addMember(props.team.id, memberName.value)
  memberName.value = ''
}

function handleRemove() {
  if (confirm(`Remover time "${props.team.name}"?`)) {
    store.removeTeam(props.team.id)
  }
}
</script>

<style scoped>
.team-card {
  padding: 0;
  overflow: hidden;
  position: relative;
}

.team-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--team-color);
}

.team-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.team-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-bright);
}

.remove-btn {
  opacity: 0.4;
  transition: var(--transition);
}

.team-card:hover .remove-btn {
  opacity: 1;
}

/* Score section */
.score-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px;
}

.score-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.score-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.score-btn.plus:hover:not(:disabled) {
  border-color: var(--success);
  color: var(--success);
  background: rgba(16, 185, 129, 0.1);
}

.score-btn.minus:hover:not(:disabled) {
  border-color: var(--danger);
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

.score-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.5s ease;
}

.score-value {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-bright);
}

.score-max {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}

/* Progress bar */
.progress-bar-container {
  height: 4px;
  background: var(--bg-input);
  margin: 0 16px;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Quick scores */
.quick-scores {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px 4px;
}

.quick-score-btn {
  padding: 2px 10px;
  font-size: 0.75rem;
  border-radius: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
}

/* Members */
.members-section {
  border-top: 1px solid var(--border-color);
  margin-top: 8px;
}

.members-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  cursor: pointer;
  transition: var(--transition);
}

.members-header:hover {
  background: rgba(255, 255, 255, 0.03);
}

.members-title {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.members-header i:last-child {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.members-content {
  padding: 0 16px 12px;
}

.members-list {
  list-style: none;
  padding: 0;
  margin: 0 0 10px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  transition: var(--transition);
}

.member-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.member-avatar {
  font-size: 1.2rem;
}

.member-name {
  flex: 1;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.member-remove {
  opacity: 0;
  transition: var(--transition);
}

.member-item:hover .member-remove {
  opacity: 1;
}

.add-member-form {
  display: flex;
  gap: 6px;
}

.member-input {
  flex: 1;
  padding: 6px 10px;
  font-size: 0.8rem;
}

/* Color picker */
.color-picker-row {
  padding: 8px 16px 12px;
  display: flex;
  justify-content: flex-end;
}

.color-picker {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: transparent;
  padding: 0;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: 2px solid var(--border-color);
  border-radius: 50%;
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
  max-height: 500px;
}

.list-enter-active {
  transition: all 0.3s ease;
}

.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
