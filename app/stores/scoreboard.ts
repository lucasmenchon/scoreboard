import { defineStore } from 'pinia'

export interface Member {
  id: number
  name: string
  avatar: string
}

export interface Team {
  id: number
  name: string
  color: string
  points: number
  members: Member[]
  createdAt: number
}

export interface GameLog {
  id: number
  message: string
  type: 'score' | 'team' | 'member' | 'reset' | 'timer' | 'round'
  timestamp: number
}

const TEAM_COLORS = [
  '#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444',
  '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#6366f1',
  '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#22d3ee',
]

const AVATARS = [
  '🎮', '🏆', '⚡', '🔥', '💎', '🎯', '🚀', '🌟',
  '🎲', '🎪', '🎨', '🎭', '🦊', '🐉', '🦅', '🐺',
  '👑', '⚔️', '🛡️', '🏅', '💪', '🎵', '🌈', '☄️',
]

export const useScoreboardStore = defineStore('scoreboard', {
  state: () => ({
    teams: [] as Team[],
    logs: [] as GameLog[],
    maxPoints: 10,
    roundNumber: 1,
    timerSeconds: 0,
    timerRunning: false,
    timerInterval: null as ReturnType<typeof setInterval> | null,
    gameStarted: false,
    showConfetti: false,
    nextTeamId: 1,
    nextMemberId: 1,
    nextLogId: 1,
  }),

  getters: {
    sortedTeams: (state) => {
      return [...state.teams].sort((a, b) => b.points - a.points)
    },

    leader: (state): Team | null => {
      if (state.teams.length === 0) return null
      return [...state.teams].reduce((best, team) =>
        team.points > best.points ? team : best
      , state.teams[0])
    },

    totalPoints: (state) => {
      return state.teams.reduce((sum, t) => sum + t.points, 0)
    },

    formattedTimer: (state) => {
      const mins = Math.floor(state.timerSeconds / 60)
      const secs = state.timerSeconds % 60
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    },

    recentLogs: (state) => {
      return [...state.logs].reverse().slice(0, 50)
    },
  },

  actions: {
    addTeam(name: string) {
      if (!name || name.trim() === '') return
      const colorIndex = this.teams.length % TEAM_COLORS.length
      const team: Team = {
        id: this.nextTeamId++,
        name: name.trim().substring(0, 12),
        color: TEAM_COLORS[colorIndex],
        points: 0,
        members: [],
        createdAt: Date.now(),
      }
      this.teams.push(team)
      this.addLog(`Time "${team.name}" adicionado!`, 'team')
      if (!this.gameStarted) this.gameStarted = true
    },

    removeTeam(teamId: number) {
      const team = this.teams.find(t => t.id === teamId)
      if (team) {
        this.addLog(`Time "${team.name}" removido.`, 'team')
        this.teams = this.teams.filter(t => t.id !== teamId)
      }
    },

    addMember(teamId: number, name: string) {
      const team = this.teams.find(t => t.id === teamId)
      if (!team || !name || name.trim() === '') return
      const avatarIndex = team.members.length % AVATARS.length
      team.members.push({
        id: this.nextMemberId++,
        name: name.trim().substring(0, 15),
        avatar: AVATARS[avatarIndex],
      })
      this.addLog(`"${name.trim()}" entrou no time "${team.name}"`, 'member')
    },

    removeMember(teamId: number, memberId: number) {
      const team = this.teams.find(t => t.id === teamId)
      if (!team) return
      const member = team.members.find(m => m.id === memberId)
      if (member) {
        this.addLog(`"${member.name}" saiu do time "${team.name}"`, 'member')
        team.members = team.members.filter(m => m.id !== memberId)
      }
    },

    increasePoints(teamId: number, amount: number = 1) {
      const team = this.teams.find(t => t.id === teamId)
      if (!team) return
      team.points = Math.min(team.points + amount, this.maxPoints)
      this.addLog(`${team.name}: +${amount} ponto(s) → ${team.points}`, 'score')
      if (team.points >= this.maxPoints) {
        this.showConfetti = true
        this.addLog(`🏆 "${team.name}" atingiu a pontuação máxima!`, 'score')
        setTimeout(() => { this.showConfetti = false }, 3000)
      }
    },

    decreasePoints(teamId: number, amount: number = 1) {
      const team = this.teams.find(t => t.id === teamId)
      if (!team) return
      team.points = Math.max(team.points - amount, 0)
      this.addLog(`${team.name}: -${amount} ponto(s) → ${team.points}`, 'score')
    },

    setPoints(teamId: number, points: number) {
      const team = this.teams.find(t => t.id === teamId)
      if (!team) return
      team.points = Math.max(0, Math.min(points, this.maxPoints))
    },

    nextRound() {
      this.roundNumber++
      this.addLog(`--- Rodada ${this.roundNumber} ---`, 'round')
    },

    resetScores() {
      this.teams.forEach(t => t.points = 0)
      this.roundNumber = 1
      this.addLog('Placares resetados!', 'reset')
    },

    resetAll() {
      this.teams = []
      this.logs = []
      this.roundNumber = 1
      this.timerSeconds = 0
      this.stopTimer()
      this.gameStarted = false
      this.nextTeamId = 1
      this.nextMemberId = 1
    },

    // Timer
    startTimer() {
      if (this.timerRunning) return
      this.timerRunning = true
      this.timerInterval = setInterval(() => {
        this.timerSeconds++
      }, 1000)
    },

    stopTimer() {
      this.timerRunning = false
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    resetTimer() {
      this.stopTimer()
      this.timerSeconds = 0
    },

    setMaxPoints(max: number) {
      this.maxPoints = Math.max(1, Math.min(max, 999))
    },

    addLog(message: string, type: GameLog['type']) {
      this.logs.push({
        id: this.nextLogId++,
        message,
        type,
        timestamp: Date.now(),
      })
    },

    updateTeamColor(teamId: number, color: string) {
      const team = this.teams.find(t => t.id === teamId)
      if (team) team.color = color
    },
  },
})
