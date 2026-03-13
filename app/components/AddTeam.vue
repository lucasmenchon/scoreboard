<template>
  <div class="add-team-section animate-fade-in-up">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-plus-circle"></i> Adicionar Time
      </h2>
    </div>
    <form @submit.prevent="handleAdd" class="add-form">
      <div class="form-row">
        <input
          ref="inputRef"
          v-model="teamName"
          type="text"
          class="input team-input"
          placeholder="Nome do time (máx. 12 caracteres)..."
          maxlength="12"
          @keyup.enter="handleAdd"
        />
        <button type="submit" class="btn btn-primary" :disabled="!teamName.trim()">
          <i class="fas fa-plus"></i> Adicionar
        </button>
      </div>
      <div class="quick-add">
        <span class="quick-label">Rápido:</span>
        <button
          v-for="preset in presets"
          :key="preset"
          type="button"
          class="btn btn-ghost quick-btn"
          @click="addPreset(preset)"
        >
          {{ preset }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useScoreboardStore } from '~/stores/scoreboard'

const store = useScoreboardStore()
const teamName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const presets = ['Alfa', 'Bravo', 'Delta', 'Omega', 'Phoenix', 'Titan']

function handleAdd() {
  if (!teamName.value.trim()) return
  store.addTeam(teamName.value)
  teamName.value = ''
  inputRef.value?.focus()
}

function addPreset(name: string) {
  store.addTeam(name)
}
</script>

<style scoped>
.add-team-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: var(--primary-light);
}

.form-row {
  display: flex;
  gap: 10px;
}

.team-input {
  flex: 1;
}

.quick-add {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-right: 4px;
}

.quick-btn {
  padding: 4px 12px;
  font-size: 0.75rem;
  border-radius: 20px;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }
}
</style>
