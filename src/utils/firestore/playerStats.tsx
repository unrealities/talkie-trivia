import PlayerStats from '../../models/playerStats'

export const playerStatsConverter = {
    toFirestore: (playerStats) => {
        let ps: PlayerStats = {
            currentStreak: playerStats.currentStreak,
            games: playerStats.games,
            maxStreak: playerStats.maxStreak,
            player: playerStats.player,
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
            player: data.player,
            wins: data.wins
        }
        return ps
    }
}
