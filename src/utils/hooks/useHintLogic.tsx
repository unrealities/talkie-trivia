import { useState, useCallback, useEffect } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { PlayerGame } from "../../models/game"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type HintType = "decade" | "director" | "actor" | "genre"

interface UseHintLogicProps {
  playerGame: PlayerGame
  isInteractionsDisabled: boolean
  hintsAvailable: number
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  updatePlayerStats: (updatedPlayerStats: any) => void
}

export function useHintLogic({
  playerGame,
  isInteractionsDisabled,
  hintsAvailable,
  updatePlayerGame,
  updatePlayerStats,
}: UseHintLogicProps) {
  const [hintUsedThisGuess, setHintUsedThisGuess] = useState<boolean>(false)
  const [showHintOptions, setShowHintOptions] = useState(false)
  const [displayedHintText, setDisplayedHintText] = useState<string | null>(
    null
  )

  useEffect(() => {
    console.log("useHintLogic: Resetting state for new guess.")
    setHintUsedThisGuess(false)
    setDisplayedHintText(null)
    setShowHintOptions(false)
  }, [playerGame.guesses.length])

  const getHintText = useCallback(
    (hintType: HintType): string => {
      if (!playerGame?.game?.movie) return "Hint unavailable"
      const { movie } = playerGame.game

      let text = ""
      try {
        switch (hintType) {
          case "decade":
            text = movie.release_date
              ? `${movie.release_date.substring(0, 3)}0s`
              : "Decade unavailable"
            break
          case "director":
            text = movie.director?.name || "Director unavailable"
            break
          case "actor":
            text =
              movie.actors && movie.actors.length > 0
                ? movie.actors[0].name
                : "Actor unavailable"
            break
          case "genre":
            text =
              movie.genres && movie.genres.length > 0
                ? movie.genres[0].name
                : "Genre unavailable"
            break
          default:
            text = "Invalid hint type"
        }
      } catch (e) {
        console.error("Error getting hint text:", e)
        text = "Error fetching hint"
      }
      console.log(`useHintLogic: Generated Hint Text (${hintType}):`, text)
      return text
    },
    [playerGame.game.movie]
  )

  const handleHintSelection = useCallback(
    (hint: HintType) => {
      const { guesses, hintsUsed, game } = playerGame

      if (
        isInteractionsDisabled ||
        hintsAvailable <= 0 ||
        (hintsUsed && hintsUsed[guesses.length]) || // Check if hint was already used for this guess index
        !game?.movie ||
        !getHintText(hint)
      ) {
        return
      }

      console.log(`useHintLogic: Selecting hint - ${hint}`)
      setHintUsedThisGuess(true)
      setDisplayedHintText(getHintText(hint))
      setShowHintOptions(false)

      updatePlayerGame({
        ...playerGame,
        hintsUsed: {
          ...(playerGame.hintsUsed || {}),
          [playerGame.guesses.length]: hint,
        },
      })

      // Decrement available hints from the player's stats.
      updatePlayerStats((prevStats: any) => ({
        ...prevStats,
        hintsAvailable: Math.max(0, (prevStats?.hintsAvailable ?? 0) - 1),
      }))

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    },
    [
      isInteractionsDisabled,
      hintsAvailable,
      getHintText,
      playerGame,
      updatePlayerGame,
      updatePlayerStats,
    ]
  )

  const handleToggleHintOptions = useCallback(() => {
    // Allow toggling only if the game is active, hints are available, and one hasn't been used for this guess.
    if (isInteractionsDisabled || hintsAvailable <= 0 || hintUsedThisGuess) {
      return
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowHintOptions((prevShow) => !prevShow)
  }, [isInteractionsDisabled, hintsAvailable, hintUsedThisGuess])

  const getHintLabelText = useCallback(() => {
    // If a hint has been used for the current guess, show remaining count.
    if (hintUsedThisGuess) {
      return `${hintsAvailable} Hint${
        hintsAvailable !== 1 ? "s" : ""
      } remaining`
    }
    // If no hints are left at all.
    if (hintsAvailable <= 0) {
      return "Out of hints!"
    }
    // Default prompt.
    return `Need a Hint? (${hintsAvailable} available)`
  }, [hintsAvailable, hintUsedThisGuess])

  const hintLabelText = getHintLabelText()

  const isToggleDisabled =
    isInteractionsDisabled || hintsAvailable <= 0 || hintUsedThisGuess

  const areHintButtonsDisabled =
    isInteractionsDisabled || hintUsedThisGuess || hintsAvailable <= 0

  return {
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled,
    areHintButtonsDisabled,
    handleToggleHintOptions,
    handleHintSelection,
  }
}
