import { Alert, Share, Platform } from "react-native"
import ViewShot from "react-native-view-shot"
import { PlayerGame } from "../models/game"
import { analyticsService } from "./analyticsService"
import { hapticsService } from "./hapticsService"

export const generateShareMessage = (playerGame: PlayerGame): string => {
  const appUrl = "talkie-trivia.com (Coming Soon)"
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
    resultLine = `😢 Didn't guess the movie!`
    grid = "🟥 ".repeat(playerGame.guessesMax).trim()
  }

  return `${title}\n${resultLine}\n\n${grid}\n\nPlay at ${appUrl}`
}

async function dataUriToBlob(dataUri: string) {
  const res = await fetch(dataUri)
  return await res.blob()
}

export const shareGameResultAsImage = async (
  viewShotRef: React.RefObject<ViewShot>,
  playerGame: PlayerGame
) => {
  hapticsService.medium()
  const outcome = playerGame.correctAnswer
    ? "win"
    : playerGame.gaveUp
    ? "give_up"
    : "lose"
  analyticsService.trackShareResults(outcome)

  try {
    if (!viewShotRef.current?.capture) {
      throw new Error("ViewShot is not ready.")
    }

    const uri = await viewShotRef.current.capture()
    const message = generateShareMessage(playerGame)

    if (Platform.OS === "web") {
      if (navigator.share) {
        const blob = await dataUriToBlob(uri)
        const file = new File([blob], "talkie-trivia-result.jpg", {
          type: "image/jpeg",
        })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Talkie Trivia Results",
            text: message,
            files: [file],
          })
        } else {
          await navigator.share({
            title: "Talkie Trivia Results",
            text: message,
          })
        }
      } else {
        Alert.alert(
          "Sharing not supported",
          "Your browser does not support the Web Share API."
        )
      }
    } else {
      await Share.share(
        {
          url: uri,
          message: message,
          title: "Talkie Trivia Results",
        },
        {
          dialogTitle: "Share your Talkie Trivia results!",
        }
      )
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Share action was cancelled by the user.")
      return
    }

    console.error("Sharing failed:", error)

    try {
      const message = generateShareMessage(playerGame)
      await Share.share(
        { message, title: "Talkie Trivia Results" },
        { dialogTitle: "Share your Talkie Trivia results!" }
      )
    } catch (fallbackError: any) {
      Alert.alert("Share Error", "Could not share your results.")
    }
  }
}
