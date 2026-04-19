"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScoreboardStore = void 0;
var pinia_1 = require("pinia");
var TEAM_COLORS = [
    '#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444',
    '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#6366f1',
    '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#22d3ee',
];
var AVATARS = [
    '🎮', '🏆', '⚡', '🔥', '💎', '🎯', '🚀', '🌟',
    '🎲', '🎪', '🎨', '🎭', '🦊', '🐉', '🦅', '🐺',
    '👑', '⚔️', '🛡️', '🏅', '💪', '🎵', '🌈', '☄️',
];
exports.useScoreboardStore = (0, pinia_1.defineStore)('scoreboard', {
    state: function () { return ({
        teams: [],
        logs: [],
        maxPoints: 10,
        roundNumber: 1,
        timerSeconds: 0,
        timerRunning: false,
        timerInterval: null,
        gameStarted: false,
        showConfetti: false,
        nextTeamId: 1,
        nextMemberId: 1,
        nextLogId: 1,
    }); },
    getters: {
        sortedTeams: function (state) {
            return __spreadArray([], state.teams, true).sort(function (a, b) { return b.points - a.points; });
        },
        leader: function (state) {
            if (state.teams.length === 0)
                return null;
            return __spreadArray([], state.teams, true).reduce(function (best, team) {
                return team.points > best.points ? team : best;
            }, state.teams[0]);
        },
        totalPoints: function (state) {
            return state.teams.reduce(function (sum, t) { return sum + t.points; }, 0);
        },
        formattedTimer: function (state) {
            var mins = Math.floor(state.timerSeconds / 60);
            var secs = state.timerSeconds % 60;
            return "".concat(String(mins).padStart(2, '0'), ":").concat(String(secs).padStart(2, '0'));
        },
        recentLogs: function (state) {
            return __spreadArray([], state.logs, true).reverse().slice(0, 50);
        },
    },
    actions: {
        addTeam: function (name) {
            if (!name || name.trim() === '')
                return;
            var colorIndex = this.teams.length % TEAM_COLORS.length;
            var team = {
                id: this.nextTeamId++,
                name: name.trim().substring(0, 12),
                color: TEAM_COLORS[colorIndex],
                points: 0,
                members: [],
                createdAt: Date.now(),
            };
            this.teams.push(team);
            this.addLog("Time \"".concat(team.name, "\" adicionado!"), 'team');
            if (!this.gameStarted)
                this.gameStarted = true;
        },
        removeTeam: function (teamId) {
            var team = this.teams.find(function (t) { return t.id === teamId; });
            if (team) {
                this.addLog("Time \"".concat(team.name, "\" removido."), 'team');
                this.teams = this.teams.filter(function (t) { return t.id !== teamId; });
            }
        },
        addMember: function (teamId, name) {
            var team = this.teams.find(function (t) { return t.id === teamId; });
            if (!team || !name || name.trim() === '')
                return;
            var avatarIndex = team.members.length % AVATARS.length;
            team.members.push({
                id: this.nextMemberId++,
                name: name.trim().substring(0, 15),
                avatar: AVATARS[avatarIndex],
            });
            this.addLog("\"".concat(name.trim(), "\" entrou no time \"").concat(team.name, "\""), 'member');
        },
        removeMember: function (teamId, memberId) {
            var team = this.teams.find(function (t) { return t.id === teamId; });
            if (!team)
                return;
            var member = team.members.find(function (m) { return m.id === memberId; });
            if (member) {
                this.addLog("\"".concat(member.name, "\" saiu do time \"").concat(team.name, "\""), 'member');
                team.members = team.members.filter(function (m) { return m.id !== memberId; });
            }
        },
        increasePoints: function (teamId, amount) {
            var _this = this;
            if (amount === void 0) { amount = 1; }
            var team = this.teams.find(function (t) { return t.id === teamId; });
            if (!team)
                return;
            team.points = Math.min(team.points + amount, this.maxPoints);
            this.addLog("".concat(team.name, ": +").concat(amount, " ponto(s) \u2192 ").concat(team.points), 'score');
            if (team.points >= this.maxPoints) {
                this.showConfetti = true;
                this.addLog("\uD83C\uDFC6 \"".concat(team.name, "\" atingiu a pontua\u00E7\u00E3o m\u00E1xima!"), 'score');
                setTimeout(function () { _this.showConfetti = false; }, 3000);
            }
        },
        decreasePoints: function (teamId, amount) {
            if (amount === void 0) { amount = 1; }
            var team = this.teams.find(function (t) { return t.id === teamId; });
            if (!team)
                return;
            team.points = Math.max(team.points - amount, 0);
            this.addLog("".concat(team.name, ": -").concat(amount, " ponto(s) \u2192 ").concat(team.points), 'score');
        },
        setPoints: function (teamId, points) {
            var team = this.teams.find(function (t) { return t.id === teamId; });
            if (!team)
                return;
            team.points = Math.max(0, Math.min(points, this.maxPoints));
        },
        nextRound: function () {
            this.roundNumber++;
            this.addLog("--- Rodada ".concat(this.roundNumber, " ---"), 'round');
        },
        resetScores: function () {
            this.teams.forEach(function (t) { return t.points = 0; });
            this.roundNumber = 1;
            this.addLog('Placares resetados!', 'reset');
        },
        resetAll: function () {
            this.teams = [];
            this.logs = [];
            this.roundNumber = 1;
            this.timerSeconds = 0;
            this.stopTimer();
            this.gameStarted = false;
            this.nextTeamId = 1;
            this.nextMemberId = 1;
        },
        // Timer
        startTimer: function () {
            var _this = this;
            if (this.timerRunning)
                return;
            this.timerRunning = true;
            this.timerInterval = setInterval(function () {
                _this.timerSeconds++;
            }, 1000);
        },
        stopTimer: function () {
            this.timerRunning = false;
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        },
        resetTimer: function () {
            this.stopTimer();
            this.timerSeconds = 0;
        },
        setMaxPoints: function (max) {
            this.maxPoints = Math.max(1, Math.min(max, 999));
        },
        addLog: function (message, type) {
            this.logs.push({
                id: this.nextLogId++,
                message: message,
                type: type,
                timestamp: Date.now(),
            });
        },
        updateTeamColor: function (teamId, color) {
            var team = this.teams.find(function (t) { return t.id === teamId; });
            if (team)
                team.color = color;
        },
    },
});
