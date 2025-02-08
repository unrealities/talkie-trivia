export default class PlayerStats {
  id: string
  currentStreak: number
  games: number
  maxStreak: number
  wins: number[]
  hintsAvailable: number // New field for available hints
  hintsUsedCount: number // New field to track hints used

  constructor(
    id: string,
    currentStreak: number,
    games: number,
    maxStreak: number,
    wins: number[],
    hintsAvailable: number = 3, // Default hints to 3
    hintsUsedCount: number = 0 // Initialize hintsUsedCount
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
    if (hintsAvailable < 0) {
      throw new Error("Hints available cannot be negative.")
    }
    if (hintsUsedCount < 0) {
      throw new Error("Hints used count cannot be negative.")
    }

    this.id = id
    this.currentStreak = currentStreak
    this.games = games
    this.maxStreak = maxStreak
    this.wins = wins
    this.hintsAvailable = hintsAvailable
    this.hintsUsedCount = hintsUsedCount
  }
}
