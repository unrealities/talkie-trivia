import { PlayerGame } from "../models/game"

export const generateShareMessage = (playerGame: PlayerGame): string => {
  if (!playerGame) {
    return "Check out Talkie Trivia!"
  }

  const appUrl = "Coming Soon"
  const gameDate =
    playerGame.startDate instanceof Date
      ? playerGame.startDate
      : new Date(playerGame.startDate)

  const dateString = gameDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const title = `Talkie Trivia 🎬\n📅 ${dateString}`

  let resultLine = ""
  let grid = ""
  const guessCount = playerGame.guesses.length

  if (playerGame.correctAnswer) {
    resultLine = `✅ Guessed in ${guessCount}/${playerGame.guessesMax} tries!`
    grid = "🟥 ".repeat(guessCount - 1) + "🟩"
  } else if (playerGame.gaveUp) {
    resultLine = `🤔 Gave up after ${guessCount} guess${
      guessCount === 1 ? "" : "es"
    }.`
    grid = "🟥 ".repeat(guessCount) + "⏹️"
  } else {
    // Lost by running out of guesses
    resultLine = `😢 Didn't guess the movie!`
    grid = "🟥 ".repeat(playerGame.guessesMax).trim()
  }

  return `${title}\n${resultLine}\n\n${grid}\n\nPlay at ${appUrl}`
}
