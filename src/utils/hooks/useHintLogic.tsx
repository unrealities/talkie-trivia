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
  const hintsUsedCountRef = useRef(0)

  useEffect(() => {
    console.log("useHintLogic: Resetting state due to guess change.")
    setHintUsedThisGuess(false)
 setHintUsedThisGuess(false) // Explicitly reset when guess count changes
    setSelectedHintType(null)
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
      if (
        isInteractionsDisabled || // Cannot select if game is over/disabled
        hintUsedThisGuess || // Cannot use more than one hint per guess
        playerGame.guesses.length >= 3 || // Cannot use hints after the 3rd guess
        playerGame.hintsUsed[playerGame.guesses.length] || // Cannot use a hint if one is already used for this guess (redundant with hintUsedThisGuess but good check)
        Object.keys(playerGame.hintsUsed || {}).length >= 3 || // Cannot use more than 3 hints in total per game
        !playerGame?.game?.movie || // Cannot get a hint if no movie is loaded
        !getHintText(hint) || // Cannot use if the hint text is unavailable
        !showHintOptions
      ) {
        console.log("useHintLogic: Hint selection prevented.")
        return
      }

      console.log(`useHintLogic: Selecting hint - ${hint}`)
      setSelectedHintType(hint)
      setHintUsedThisGuess(true)
      setDisplayedHintText(text)
      setIsHintSelectionDisabled(true)
      setHintUsedThisGuess(true)
      setShowHintOptions(false)

      updatePlayerGame({
        ...playerGame,
        hintsUsed: {
          ...(playerGame.hintsUsed || {}),
          [playerGame.guesses.length]: hint,
        },
      })

      const hintsUsedInCurrentGame =
        Object.keys(playerGame.hintsUsed || {}).length + 1
      if (hintsUsedInCurrentGame <= 3) {
        updatePlayerStats((prevStats: any) => ({
          ...prevStats,
          hintsAvailable: Math.max(0, (prevStats?.hintsAvailable ?? 0) - 1),
        }))
      }

      // Increment hint used count for the current game
      hintsUsedCountRef.current = hintsUsedInCurrentGame

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    },
    [
      isInteractionsDisabled,
      hintUsedThisGuess,
      isHintSelectionDisabled,
      hintsAvailable,
      showHintOptions,
      getHintText,
      playerGame,
      updatePlayerGame,
      updatePlayerStats,
    ]
  )

  const handleToggleHintOptions = useCallback(() => {
    // Only allow toggling if interactions are enabled, hints are available for this guess, and we haven't used a hint this guess
    if (
      isInteractionsDisabled ||
      playerGame.guesses.length >= 3 || // Cannot toggle if no more guesses
      Object.keys(playerGame.hintsUsed || {}).length >= 3 || // Cannot toggle if all hints are used for the game
      hintUsedThisGuess // Cannot toggle if hint is already used this guess
    ) {
      return
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowHintOptions((prevShow) => !prevShow)
  }, [
    showHintOptions,
    isInteractionsDisabled,
    hintUsedThisGuess,
    playerGame.guesses.length,
    playerGame.hintsUsed,
  ])

  const getHintLabelText = useCallback(() => {
    if (Object.keys(playerGame.hintsUsed || {}).length >= 3) {
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
