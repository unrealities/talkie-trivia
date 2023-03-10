export default class PlayerStats {
    currentStreak: number
    games: number // number of games attempted (at least one guess made)
    maxStreak: number
    wins: number[]  // wins[0] = win on first guess, win[4] = win on fifth guess, sum(wins) = total wins
}
