import { useState, useCallback, useEffect, useMemo } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { PlayerGame } from "../../models/game"
import PlayerStats from "../../models/playerStats"
import { analyticsService } from "../analyticsService"
import { hapticsService } from "../hapticsService"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type HintType = "decade" | "director" | "actor" | "genre"
type HintStatus = "available" | "used" | "disabled"

interface UseHintLogicProps {
  playerGame: PlayerGame
  isInteractionsDisabled: boolean
  playerStats: PlayerStats
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  updatePlayerStats: (updatedPlayerStats: PlayerStats) => void
}

/**
 * Manages the state and logic for the hint system.
 * Note: Hints are intended to be replenished on a daily basis,
 * which is handled by server-side logic or when a new playerGame is generated.
 */
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
  const hintTypes: HintType[] = ["decade", "director", "actor", "genre"]

  const hintUsedThisTurn = useMemo(
    () => playerGame.hintsUsed?.[playerGame.guesses.length] !== undefined,
    [playerGame.hintsUsed, playerGame.guesses.length]
  )

  const hintStatuses = useMemo(() => {
    const statuses: Record<HintType, HintStatus> = {} as any
    const usedHintTypes = new Set(Object.values(playerGame.hintsUsed || {}))

    for (const type of hintTypes) {
      if (usedHintTypes.has(type)) {
        statuses[type] = "used"
      } else {
        if (isInteractionsDisabled || hintsAvailable <= 0 || hintUsedThisTurn) {
          statuses[type] = "disabled"
        } else {
          statuses[type] = "available"
        }
      }
    }
    return statuses
  }, [
    playerGame.hintsUsed,
    isInteractionsDisabled,
    hintsAvailable,
    hintUsedThisTurn,
  ])

  const getHintText = useCallback(
    (hintType: HintType): string => {
      if (!playerGame?.movie) return "Hint unavailable"
      const { movie } = playerGame
      switch (hintType) {
        case "decade":
          return movie.release_date
            ? `${movie.release_date.substring(0, 3)}0s`
            : "Decade unavailable"
        case "director":
          return movie.director?.name || "Director unavailable"
        case "actor":
          return movie.actors?.[0]?.name || "Actor unavailable"
        case "genre":
          return movie.genres?.[0]?.name || "Genre unavailable"
        default:
          return "Invalid hint type"
      }
    },
    [playerGame.movie]
  )

  const handleHintSelection = useCallback(
    (hintType: HintType) => {
      hapticsService.medium()

      const status = hintStatuses[hintType]
      setShowHintOptions(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      if (status === "used") {
        setDisplayedHintText(getHintText(hintType))
        return
      }

      if (status === "available") {
        analyticsService.trackHintUsed(
          hintType,
          playerGame.guesses.length,
          hintsAvailable - 1
        )
        updatePlayerGame({
          ...playerGame,
          hintsUsed: {
            ...(playerGame.hintsUsed || {}),
            [playerGame.guesses.length]: hintType,
          },
        })

        const newPlayerStats: PlayerStats = {
          ...playerStats,
          hintsAvailable: Math.max(0, hintsAvailable - 1),
          hintsUsedCount: (playerStats.hintsUsedCount || 0) + 1,
        }
        updatePlayerStats(newPlayerStats)
        setDisplayedHintText(getHintText(hintType))
      }
    },
    [
      hintStatuses,
      playerGame,
      playerStats,
      hintsAvailable,
      getHintText,
      updatePlayerGame,
      updatePlayerStats,
    ]
  )

  useEffect(() => {
    setDisplayedHintText(null)
  }, [playerGame.guesses.length])

  const handleToggleHintOptions = useCallback(() => {
    hapticsService.light()

    if (
      hintsAvailable <= 0 &&
      !Object.keys(playerGame.hintsUsed || {}).length
    ) {
      return
    }

    if (!showHintOptions) {
      analyticsService.trackHintOptionsToggled()
      setDisplayedHintText(null)
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowHintOptions((prevShow) => !prevShow)
  }, [showHintOptions, hintsAvailable, playerGame.hintsUsed])

  const hintLabelText = useMemo(() => {
    if (isInteractionsDisabled) return "Game Over"
    if (hintsAvailable <= 0 && !Object.keys(playerGame.hintsUsed || {}).length)
      return "Out of hints!"
    if (hintUsedThisTurn) return `Make a guess to use another hint`
    return `Need a Hint? (${hintsAvailable} available)`
  }, [
    hintsAvailable,
    hintUsedThisTurn,
    isInteractionsDisabled,
    playerGame.hintsUsed,
  ])

  const isToggleDisabled = isInteractionsDisabled

  return {
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled,
    hintStatuses,
    handleToggleHintOptions,
    handleHintSelection,
  }
}
