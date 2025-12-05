import PlayerStats from "../../../models/playerStats"
import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore"

export const playerStatsConverter = {
  toFirestore: (playerStats: PlayerStats) => {
    let ps: PlayerStats = {
      id: playerStats.id,
      currentStreak: playerStats.currentStreak,
      games: playerStats.games,
      maxStreak: playerStats.maxStreak,
      wins: playerStats.wins,
      hintsAvailable: playerStats.hintsAvailable,
      hintsUsedCount: playerStats.hintsUsedCount,
      lastStreakMessageDate: playerStats.lastStreakMessageDate ?? null,
      allTimeScore: playerStats.allTimeScore || 0,
    }
    return ps
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PlayerStats => {
    const data = snapshot.data(options)
    let ps: PlayerStats = {
      id: data.id,
      currentStreak: data.currentStreak,
      games: data.games,
      maxStreak: data.maxStreak,
      wins: data.wins,
      hintsAvailable: data.hintsAvailable || 3,
      hintsUsedCount: data.hintsUsedCount || 0,
      lastStreakMessageDate: data.lastStreakMessageDate ?? null,
      allTimeScore: data.allTimeScore || 0,
    }
    return ps
  },
}
