import { Share } from "react-native"
import { PlayerGame } from "../models/game"
import { analyticsService } from "./analyticsService"
import { hapticsService } from "./hapticsService"
import { calculateScore } from "./scoreUtils"
import { GAME_MODE_CONFIG } from "../config/difficulty"
import { useGameStore } from "../state/gameStore"

export const generateShareMessage = (playerGame: PlayerGame): string => {
  const appUrl = "https://talkie-trivia.com"
  const gameDate =
    playerGame.startDate instanceof Date
      ? playerGame.startDate
      : new Date(playerGame.startDate)

  // Get the current game mode to generate a context-aware message.
  const gameMode = useGameStore.getState().gameMode
  const config = GAME_MODE_CONFIG[gameMode]

  const dateString = gameDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const title = `${config.shareResultTitle}\n📅 ${dateString}`

  let resultLine = ""
  let grid = ""
  const guessCount = playerGame.guesses.length

  if (playerGame.correctAnswer) {
    resultLine = `✅ Guessed in ${guessCount}/${playerGame.guessesMax} tries!`
    grid = "🟥".repeat(guessCount - 1) + "🟩"
  } else if (playerGame.gaveUp) {
    resultLine = `🤔 Gave up after ${guessCount} guess${
      guessCount === 1 ? "" : "es"
    }.`
    grid = "🟥".repeat(guessCount) + "⏹️"
  } else {
    resultLine = `😢 Didn't guess the item!`
    grid = "🟥".repeat(playerGame.guessesMax).trim()
  }

  const score = calculateScore(playerGame)
  const scoreLine = `Score: 🏆 ${score}`

  return `${title}\n${resultLine}\n\n${grid}\n${scoreLine}\n\nPlay at ${appUrl}`
}

export const shareGameResult = async (playerGame: PlayerGame) => {
  hapticsService.medium()
  const outcome = playerGame.correctAnswer
    ? "win"
    : playerGame.gaveUp
    ? "give_up"
    : "lose"
  analyticsService.trackShareResults(outcome)

  const message = generateShareMessage(playerGame)

  try {
    await Share.share(
      {
        message,
        title: "Talkie Trivia Results",
      },
      {
        dialogTitle: "Share your Talkie Trivia results!",
      }
    )
  } catch (error: any) {
    if (
      error.name === "AbortError" ||
      error.message.includes("Share Canceled")
    ) {
      console.log("Share action was canceled by the user.")
      return
    }
    throw error
  }
}
