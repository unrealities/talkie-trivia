import { onCall, HttpsError } from "firebase-functions/v2/https"
import * as admin from "firebase-admin"
import { calculateScore } from "./utils/scoreUtils"

admin.initializeApp()
const db = admin.firestore()

export const submitGameResult = onCall(async (request) => {
  // 1. Authentication Check
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    )
  }

  const { playerGame } = request.data
  const userId = request.auth.uid

  if (!playerGame || playerGame.playerID !== userId) {
    throw new HttpsError("permission-denied", "Invalid game data ownership.")
  }

  // 2. Validate the Game
  const score = calculateScore(playerGame)
  const isWin = playerGame.correctAnswer

  // 3. Transactional Update of Stats
  const playerStatsRef = db.collection("playerStats").doc(userId)
  const playerGameRef = db.collection("playerGames").doc(playerGame.id)

  let dateId = new Date().toISOString().split("T")[0]
  try {
    const dateVal = playerGame.startDate
    if (typeof dateVal === "string") {
      dateId = dateVal.split("T")[0]
    } else if (dateVal && typeof dateVal.toDate === "function") {
      // Handle Firestore Timestamp if passed directly
      dateId = dateVal.toDate().toISOString().split("T")[0]
    }
  } catch (e) {
    console.warn("Could not parse start date for history ID, using today", e)
  }

  const historyRef = db
    .collection("players")
    .doc(userId)
    .collection("gameHistory")
    .doc(dateId)

  try {
    await db.runTransaction(async (transaction) => {
      const statsDoc = await transaction.get(playerStatsRef)
      let stats = statsDoc.exists ? statsDoc.data() : null

      if (!stats) {
        stats = {
          id: userId,
          currentStreak: 0,
          games: 0,
          maxStreak: 0,
          wins: [0, 0, 0, 0, 0],
          hintsAvailable: 3,
          hintsUsedCount: 0,
          allTimeScore: 0,
        }
      }

      // Update Stats
      stats!.games = (stats!.games || 0) + 1
      stats!.allTimeScore = (stats!.allTimeScore || 0) + score

      if (isWin) {
        stats!.currentStreak = (stats!.currentStreak || 0) + 1
        stats!.maxStreak = Math.max(stats!.currentStreak, stats!.maxStreak || 0)

        const guessCount = playerGame.guesses.length
        if (!stats!.wins) stats!.wins = [0, 0, 0, 0, 0]

        if (guessCount > 0 && guessCount <= 5) {
          stats!.wins[guessCount - 1] = (stats!.wins[guessCount - 1] || 0) + 1
        }
      } else {
        stats!.currentStreak = 0
      }

      const gameUpdate = {
        ...playerGame,
        statsProcessed: true,
        score,
      }

      transaction.set(playerGameRef, gameUpdate, { merge: true })
      transaction.set(playerStatsRef, stats!)

      transaction.set(historyRef, {
        dateId,
        itemId: playerGame.triviaItem.id,
        itemTitle: playerGame.triviaItem.title || "Unknown",
        posterPath: playerGame.triviaItem.posterPath || "",
        wasCorrect: isWin,
        gaveUp: playerGame.gaveUp,
        guessCount: playerGame.guesses.length,
        guessesMax: playerGame.guessesMax,
        difficulty: playerGame.difficulty,
        score: score,
        gameMode: "movies",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    })

    return { success: true, score }
  } catch (error: any) {
    console.error("Transaction failure:", error)
    throw new HttpsError(
      "internal",
      `Could not submit game result: ${error.message}`,
    )
  }
})
