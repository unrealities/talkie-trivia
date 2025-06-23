import { useState, useCallback, useEffect, useMemo } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { PlayerGame } from "../../models/game"
import PlayerStats from "../../models/playerStats"

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
  playerStats: PlayerStats
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  updatePlayerStats: (updatedPlayerStats: PlayerStats) => void
}

export function useHintLogic({
  playerGame,
  isInteractionsDisabled,
  playerStats,
  updatePlayerGame,
  updatePlayerStats,
}: UseHintLogicProps) {
  const [showHintOptions, setShowHintOptions] = useState(false)
  const [displayedHintText, setDisplayedHintText] = useState<string | null>(
    null
  )

  const hintsAvailable = playerStats?.hintsAvailable ?? 0

  const hintUsedThisTurn = useMemo(() => {
    return playerGame.hintsUsed?.[playerGame.guesses.length] !== undefined
  }, [playerGame.hintsUsed, playerGame.guesses.length])

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
      return text
    },
    [playerGame.game.movie]
  )

  useEffect(() => {
    const currentGuessIndex = playerGame.guesses.length
    const hintForCurrentTurn = playerGame.hintsUsed?.[currentGuessIndex]

    if (hintForCurrentTurn) {
      setDisplayedHintText(getHintText(hintForCurrentTurn))
      setShowHintOptions(false)
    } else {
      setDisplayedHintText(null)
    }
  }, [playerGame.hintsUsed, playerGame.guesses.length, getHintText])

  const handleHintSelection = useCallback(
    (hint: HintType) => {
      if (isInteractionsDisabled || hintsAvailable <= 0 || hintUsedThisTurn) {
        return
      }

      setShowHintOptions(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      updatePlayerGame({
        ...playerGame,
        hintsUsed: {
          ...(playerGame.hintsUsed || {}),
          [playerGame.guesses.length]: hint,
        },
      })

      const newPlayerStats: PlayerStats = {
        ...playerStats,
        hintsAvailable: Math.max(0, hintsAvailable - 1),
        hintsUsedCount: (playerStats.hintsUsedCount || 0) + 1,
      }
      updatePlayerStats(newPlayerStats)
    },
    [
      isInteractionsDisabled,
      hintsAvailable,
      hintUsedThisTurn,
      playerGame,
      playerStats,
      updatePlayerGame,
      updatePlayerStats,
      getHintText,
    ]
  )

  const handleToggleHintOptions = useCallback(() => {
    if (isInteractionsDisabled || hintsAvailable <= 0 || hintUsedThisTurn) {
      return
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowHintOptions((prevShow) => !prevShow)
  }, [isInteractionsDisabled, hintsAvailable, hintUsedThisTurn])

  const hintLabelText = useMemo(() => {
    if (hintsAvailable <= 0) {
      return "Out of hints!"
    }
    if (hintUsedThisTurn) {
      return `Make a guess to use another hint`
    }
    return `Need a Hint? (${hintsAvailable} available)`
  }, [hintsAvailable, hintUsedThisTurn])

  const isToggleDisabled =
    isInteractionsDisabled || hintsAvailable <= 0 || hintUsedThisTurn
  const areHintButtonsDisabled = isToggleDisabled

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
