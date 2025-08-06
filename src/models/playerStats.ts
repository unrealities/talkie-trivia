export default class PlayerStats {
  id: string
  currentStreak: number
  games: number
  maxStreak: number
  wins: number[]
  hintsAvailable: number
  hintsUsedCount: number

  constructor(
    id: string,
    currentStreak: number,
    games: number,
    maxStreak: number,
    wins: number[],
    hintsAvailable: number,
    hintsUsedCount: number
  ) {
    this.id = id
    this.currentStreak = currentStreak
    this.games = games
    this.maxStreak = maxStreak
    this.wins = wins
    this.hintsAvailable = hintsAvailable
    this.hintsUsedCount = hintsUsedCount
  }
}
