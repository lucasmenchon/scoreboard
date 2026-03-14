<template>
  <div class="scoreboard-page">
    <ConfettiEffect />

    <!-- Welcome state -->
    <div v-if="!store.gameStarted" class="welcome animate-fade-in-up">
      <div class="welcome-icon">
        <i class="fas fa-gamepad"></i>
      </div>
      <h2 class="welcome-title">Bem-vindo ao Scoreboard!</h2>
      <p class="welcome-desc">
        Crie times, adicione membros, marque pontos e acompanhe tudo em tempo real. 
        Perfeito para jogos entre amigos, competições e desafios!
      </p>
      <div class="welcome-features">
        <div class="feature">
          <i class="fas fa-users"></i>
          <span>Times ilimitados</span>
        </div>
        <div class="feature">
          <i class="fas fa-stopwatch"></i>
          <span>Timer integrado</span>
        </div>
        <div class="feature">
          <i class="fas fa-ranking-star"></i>
          <span>Ranking em tempo real</span>
        </div>
        <div class="feature">
          <i class="fas fa-scroll"></i>
          <span>Histórico de eventos</span>
        </div>
        <div class="feature">
          <i class="fas fa-trophy"></i>
          <span>Efeitos de vitória</span>
        </div>
        <div class="feature">
          <i class="fas fa-palette"></i>
          <span>Cores personalizáveis</span>
        </div>
      </div>
    </div>

    <!-- Add team -->
    <AddTeam />

    <!-- Stats -->
    <StatsBar />

    <!-- Leaderboard -->
    <Leaderboard />

    <!-- Team cards grid -->
    <div v-if="store.teams.length > 0" class="teams-grid">
      <TransitionGroup name="team-list">
        <TeamCard
          v-for="(team, index) in store.sortedTeams"
          :key="team.id"
          :team="team"
          :rank="index + 1"
        />
      </TransitionGroup>
    </div>

    <!-- Empty state -->
    <div v-if="store.gameStarted && store.teams.length === 0" class="empty-state animate-fade-in">
      <i class="fas fa-ghost"></i>
      <p>Todos os times foram removidos. Adicione novos times acima!</p>
    </div>

    <!-- Game log -->
    <GameLog />
  </div>
</template>

<script setup lang="ts">
import { useScoreboardStore } from '~/stores/scoreboard'

const store = useScoreboardStore()

useHead({
  title: 'Scoreboard - Placar Interativo',
})
</script>

<style scoped>
.scoreboard-page {
  padding-bottom: 40px;
}

/* Welcome */
.welcome {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 24px;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: var(--primary-gradient);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: white;
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #e2e8f0, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  max-width: 500px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.welcome-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.feature {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.feature i {
  color: var(--primary-light);
  font-size: 0.75rem;
}

/* Teams grid */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.empty-state i {
  font-size: 2.5rem;
  margin-bottom: 10px;
  display: block;
}

.empty-state p {
  font-size: 0.9rem;
}

/* Team list transitions */
.team-list-enter-active {
  transition: all 0.4s ease;
}

.team-list-leave-active {
  transition: all 0.3s ease;
}

.team-list-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.team-list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

.team-list-move {
  transition: transform 0.4s ease;
}

@media (max-width: 640px) {
  .teams-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 1.4rem;
  }
}
</style>
