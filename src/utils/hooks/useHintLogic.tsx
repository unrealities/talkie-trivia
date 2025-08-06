import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { PlayerGame, HintType } from "../../models/game"
import PlayerStats from "../../models/playerStats"
import { analyticsService } from "../analyticsService"
import { hapticsService } from "../hapticsService"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type HintStatus = "available" | "used" | "disabled"

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
  const [highlightedHint, setHighlightedHint] = useState<HintType | null>(null)
  const prevHintsUsedRef = useRef<Partial<Record<HintType, boolean>>>()

  const hintsAvailable = playerStats?.hintsAvailable ?? 0
  const hintTypes: HintType[] = ["decade", "director", "actor", "genre"]

  const hintStatuses = useMemo(() => {
    const statuses: Record<HintType, HintStatus> = {} as any
    const usedHints = playerGame.hintsUsed || {}

    for (const type of hintTypes) {
      if (usedHints[type]) {
        statuses[type] = "used"
      } else if (isInteractionsDisabled || hintsAvailable <= 0) {
        statuses[type] = "disabled"
      } else {
        statuses[type] = "available"
      }
    }
    return statuses
  }, [playerGame.hintsUsed, isInteractionsDisabled, hintsAvailable])

  useEffect(() => {
    const currentHints = playerGame.hintsUsed || {}
    const previousHints = prevHintsUsedRef.current || {}

    const newHint = (Object.keys(currentHints) as HintType[]).find(
      (key) => currentHints[key] && !previousHints[key]
    )

    if (newHint) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setShowHintOptions(true)
      setHighlightedHint(newHint)

      const timer = setTimeout(() => setHighlightedHint(null), 2500)
      return () => clearTimeout(timer)
    }

    prevHintsUsedRef.current = currentHints
  }, [playerGame.hintsUsed])

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
      setDisplayedHintText(getHintText(hintType))

      if (status === "used") {
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
            [hintType]: true,
          },
        })

        const newPlayerStats: PlayerStats = {
          ...playerStats,
          hintsAvailable: Math.max(0, hintsAvailable - 1),
          hintsUsedCount: (playerStats.hintsUsedCount || 0) + 1,
        }
        updatePlayerStats(newPlayerStats)
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
      !Object.values(playerGame.hintsUsed || {}).some(Boolean)
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

    const guessesRemaining = playerGame.guessesMax - playerGame.guesses.length
    const effectiveHints = Math.min(hintsAvailable, guessesRemaining)

    if (
      effectiveHints <= 0 &&
      !Object.values(playerGame.hintsUsed || {}).some(Boolean)
    ) {
      return "Out of hints!"
    }
    return `Need a Hint? (${effectiveHints} available)`
  }, [
    hintsAvailable,
    isInteractionsDisabled,
    playerGame.hintsUsed,
    playerGame.guesses.length,
    playerGame.guessesMax,
  ])

  return {
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled: isInteractionsDisabled,
    hintStatuses,
    highlightedHint,
    handleToggleHintOptions,
    handleHintSelection,
  }
}
