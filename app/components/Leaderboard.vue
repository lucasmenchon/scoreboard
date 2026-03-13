<template>
  <div v-if="store.teams.length >= 2" class="leaderboard card animate-fade-in-up">
    <div class="leaderboard-header">
      <h2 class="leaderboard-title">
        <i class="fas fa-ranking-star"></i> Classificação
      </h2>
      <span class="leaderboard-subtitle">Tempo: {{ store.formattedTimer }}</span>
    </div>

    <div class="podium" v-if="sorted.length >= 2">
      <!-- 2nd place -->
      <div class="podium-place second" v-if="sorted[1]">
        <div class="podium-avatar" :style="{ borderColor: sorted[1].color }">
          <span class="podium-emoji">🥈</span>
        </div>
        <span class="podium-name">{{ sorted[1].name }}</span>
        <span class="podium-score">{{ sorted[1].points }}</span>
        <div class="podium-bar bar-2"></div>
      </div>

      <!-- 1st place -->
      <div class="podium-place first" v-if="sorted[0]">
        <div class="podium-crown"><i class="fas fa-crown"></i></div>
        <div class="podium-avatar" :style="{ borderColor: sorted[0].color }">
          <span class="podium-emoji">🥇</span>
        </div>
        <span class="podium-name">{{ sorted[0].name }}</span>
        <span class="podium-score">{{ sorted[0].points }}</span>
        <div class="podium-bar bar-1"></div>
      </div>

      <!-- 3rd place -->
      <div class="podium-place third" v-if="sorted[2]">
        <div class="podium-avatar" :style="{ borderColor: sorted[2].color }">
          <span class="podium-emoji">🥉</span>
        </div>
        <span class="podium-name">{{ sorted[2].name }}</span>
        <span class="podium-score">{{ sorted[2].points }}</span>
        <div class="podium-bar bar-3"></div>
      </div>
    </div>

    <!-- Full ranking list -->
    <ul class="ranking-list">
      <li v-for="(team, index) in sorted" :key="team.id" class="ranking-item">
        <span class="ranking-position">#{{ index + 1 }}</span>
        <div class="ranking-color" :style="{ background: team.color }"></div>
        <span class="ranking-name">{{ team.name }}</span>
        <div class="ranking-bar-wrap">
          <div
            class="ranking-bar"
            :style="{ width: barWidth(team.points) + '%', background: team.color }"
          ></div>
        </div>
        <span class="ranking-points">{{ team.points }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useScoreboardStore } from '~/stores/scoreboard'

const store = useScoreboardStore()

const sorted = computed(() => store.sortedTeams)

function barWidth(points: number) {
  if (store.maxPoints === 0) return 0
  return (points / store.maxPoints) * 100
}
</script>

<style scoped>
.leaderboard {
  padding: 0;
  margin-bottom: 24px;
  overflow: hidden;
}

.leaderboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.leaderboard-title {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.leaderboard-title i {
  color: var(--accent);
}

.leaderboard-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}

/* Podium */
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px 0;
}

.podium-place {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 80px;
  position: relative;
}

.podium-crown {
  color: var(--accent);
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

.podium-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-input);
}

.podium-emoji {
  font-size: 1.4rem;
}

.podium-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.podium-score {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--accent);
}

.podium-bar {
  width: 60px;
  border-radius: 6px 6px 0 0;
  margin-top: 4px;
}

.bar-1 {
  height: 80px;
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.bar-2 {
  height: 56px;
  background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
}

.bar-3 {
  height: 40px;
  background: linear-gradient(180deg, #b45309 0%, #92400e 100%);
}

/* Ranking list */
.ranking-list {
  list-style: none;
  padding: 16px 20px;
  margin: 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(51, 65, 85, 0.3);
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-position {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-muted);
  min-width: 28px;
}

.ranking-color {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ranking-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 60px;
}

.ranking-bar-wrap {
  flex: 1;
  height: 6px;
  background: var(--bg-input);
  border-radius: 3px;
  overflow: hidden;
}

.ranking-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.ranking-points {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-bright);
  min-width: 24px;
  text-align: right;
}

@media (max-width: 640px) {
  .podium {
    gap: 4px;
  }

  .podium-place {
    min-width: 60px;
  }
}
</style>
