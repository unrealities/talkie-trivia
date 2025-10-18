export default interface PlayerStats {
  id: string
  currentStreak: number
  games: number
  maxStreak: number
  wins: number[]
  hintsAvailable: number
  hintsUsedCount: number
  lastStreakMessageDate?: string
  allTimeScore: number
}
