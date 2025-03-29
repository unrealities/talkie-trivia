import { useState, useCallback, useEffect, useRef } from "react"
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
  const [isHintSelectionDisabled, setIsHintSelectionDisabled] =
    useState<boolean>(false)
  const [selectedHintType, setSelectedHintType] = useState<HintType | null>(
    null
  )
  const [showHintOptions, setShowHintOptions] = useState(false)
  const [displayedHintText, setDisplayedHintText] = useState<string | null>(
    null
  )

  useEffect(() => {
    console.log("useHintLogic: Resetting state due to guess change.")
    setHintUsedThisGuess(false)
    setSelectedHintType(null)
    setDisplayedHintText(null)
    setIsHintSelectionDisabled(false)
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
      if (
        isInteractionsDisabled ||
        hintUsedThisGuess ||
        isHintSelectionDisabled ||
        hintsAvailable <= 0 ||
        !showHintOptions
      ) {
        console.log("useHintLogic: Hint selection prevented.")
        return
      }

      console.log(`useHintLogic: Selecting hint - ${hint}`)
      setSelectedHintType(hint)
      setHintUsedThisGuess(true)
      const text = getHintText(hint)
      setDisplayedHintText(text)
      setIsHintSelectionDisabled(true)
      setShowHintOptions(false)

      updatePlayerGame({
        ...playerGame,
        hintsUsed: {
          ...(playerGame.hintsUsed || {}),
          [playerGame.guesses.length]: hint,
        },
      })

      if (hintsAvailable > 0) {
        updatePlayerStats((prevStats: any) => ({
          ...prevStats,
          hintsAvailable: Math.max(0, hintsAvailable - 1),
        }))
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    },
    [
      isInteractionsDisabled,
      hintUsedThisGuess,
      isHintSelectionDisabled,
      hintsAvailable,
      showHintOptions,
      getHintText,
      updatePlayerGame,
      updatePlayerStats,
      playerGame,
    ]
  )

  const handleToggleHintOptions = useCallback(() => {
    if (isInteractionsDisabled || hintsAvailable <= 0 || hintUsedThisGuess) {
      return
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowHintOptions((prevShow) => !prevShow)
  }, [
    showHintOptions,
    isInteractionsDisabled,
    hintsAvailable,
    hintUsedThisGuess,
  ])

  const getHintLabelText = useCallback(() => {
    if (hintsAvailable <= 0) {
      return "Out of hints!"
    }
    if (hintUsedThisGuess) {
      return `${hintsAvailable} Hint${
        hintsAvailable !== 1 ? "s" : ""
      } remaining`
    }

    return `Need a Hint? (${hintsAvailable} available)`
  }, [hintsAvailable, hintUsedThisGuess])

  const hintLabelText = getHintLabelText()

  const isToggleDisabled =
    isInteractionsDisabled || hintsAvailable <= 0 || hintUsedThisGuess

  const areHintButtonsDisabled =
    isInteractionsDisabled ||
    hintUsedThisGuess ||
    isHintSelectionDisabled ||
    hintsAvailable <= 0

  return {
    hintUsedThisGuess,
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled,
    areHintButtonsDisabled,
    handleToggleHintOptions,
    handleHintSelection,
  }
}
