import PlayerStats from '../../models/playerStats'

export const playerStatsConverter = {
    toFirestore: (playerStats) => {
        let ps: PlayerStats = {
            currentStreak: playerStats.currentStreak,
            games: playerStats.games,
            maxStreak: playerStats.maxStreak,
            wins: playerStats.wins
        }
        return ps
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        let ps: PlayerStats = {
            currentStreak: data.currentStreak,
            games: data.games,
            maxStreak: data.maxStreak,
            wins: data.wins
        }
        return ps
    }
}
