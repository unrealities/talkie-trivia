import Player from './player'

export default class PlayerStats {
    currentStreak: number
    games: number // number of games attempted (at least one guess made)
    maxStreak: number
    player: Player
    wins: number[]  // wins[0] = win on first guess, win[4] = win on fifth guess, sum(wins) = total wins
}
