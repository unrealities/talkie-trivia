export default class PlayerStats {
  id: string
  currentStreak: number
  games: number
  maxStreak: number
  wins: number[]

  constructor(
    id: string,
    currentStreak: number,
    games: number,
    maxStreak: number,
    wins: number[]
  ) {
    if (!id) {
      throw new Error("PlayerStats ID is required.")
    }
    if (currentStreak < 0) {
      throw new Error("Current streak cannot be negative.")
    }
    if (games < 0) {
      throw new Error("Number of games cannot be negative.")
    }
    if (maxStreak < 0) {
      throw new Error("Max streak cannot be negative.")
    }
    if (wins.length !== 5 || wins.some((winCount) => winCount < 0)) {
      throw new Error(
        "Wins array must have a length of 5 and contain non-negative numbers."
      )
    }

    this.id = id
    this.currentStreak = currentStreak
    this.games = games
    this.maxStreak = maxStreak
    this.wins = wins
  }
}
