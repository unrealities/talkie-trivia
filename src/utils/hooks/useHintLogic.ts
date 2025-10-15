import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { HintType } from "../../models/game"
import { useGameStore } from "../../state/gameStore"
import { hapticsService } from "../hapticsService"
import { analyticsService } from "../analyticsService"
import { useShallow } from "zustand/react/shallow"
import { DIFFICULTY_MODES } from "../../config/difficulty"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type HintStatus = "available" | "used" | "disabled"

export function useHintLogic() {
  const {
    playerGame,
    isInteractionsDisabled,
    playerStats,
    difficulty,
    useHint,
  } = useGameStore(
    useShallow((state) => ({
      playerGame: state.playerGame,
      isInteractionsDisabled: state.isInteractionsDisabled,
      playerStats: state.playerStats,
      difficulty: state.difficulty,
      useHint: state.useHint,
    }))
  )

  const [showHintOptions, setShowHintOptions] = useState(false)
  const [displayedHintText, setDisplayedHintText] = useState<string | null>(
    null
  )
  const [highlightedHint, setHighlightedHint] = useState<HintType | null>(null)
  const prevHintsUsedRef = useRef<Partial<Record<HintType, boolean>>>()

  const hintsAvailable = playerStats?.hintsAvailable ?? 0
  const hintTypes: HintType[] = ["decade", "director", "actor", "genre"]

  const currentHintStrategy = DIFFICULTY_MODES[difficulty].hintStrategy

  const hintStatuses = useMemo(() => {
    const statuses: Record<HintType, HintStatus> = {} as any
    const usedHints = playerGame.hintsUsed || {}

    for (const type of hintTypes) {
      if (usedHints[type]) {
        statuses[type] = "used"
      } else if (
        currentHintStrategy === "NONE_DISABLED" ||
        currentHintStrategy === "EXTREME_CHALLENGE" ||
        currentHintStrategy === "ALL_REVEALED" ||
        isInteractionsDisabled ||
        (currentHintStrategy === "USER_SPEND" && hintsAvailable <= 0)
      ) {
        statuses[type] = "disabled"
      } else {
        statuses[type] = "available"
      }
    }
    return statuses
  }, [
    playerGame.hintsUsed,
    isInteractionsDisabled,
    hintsAvailable,
    currentHintStrategy,
  ])

  useEffect(() => {
    const currentHints = playerGame.hintsUsed || {}
    const previousHints = prevHintsUsedRef.current || {}

    if (currentHintStrategy !== "IMPLICIT_FEEDBACK") {
      prevHintsUsedRef.current = currentHints
      return
    }

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
  }, [playerGame.hintsUsed, currentHintStrategy])

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
      if (currentHintStrategy !== "USER_SPEND") return

      hapticsService.medium()

      const status = hintStatuses[hintType]
      setShowHintOptions(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setDisplayedHintText(getHintText(hintType))

      if (status === "available") {
        useHint(hintType)
      }
    },
    [hintStatuses, currentHintStrategy, getHintText, useHint]
  )

  useEffect(() => {
    if (currentHintStrategy !== "USER_SPEND") {
      setDisplayedHintText(null)
    }
  }, [playerGame.guesses.length, currentHintStrategy])

  const handleToggleHintOptions = useCallback(() => {
    if (currentHintStrategy !== "USER_SPEND") return

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
  }, [
    showHintOptions,
    hintsAvailable,
    playerGame.hintsUsed,
    currentHintStrategy,
  ])

  const hintLabelText = useMemo(() => {
    if (isInteractionsDisabled) return "Game Over"

    switch (currentHintStrategy) {
      case "ALL_REVEALED":
        return "All Clues Revealed"
      case "USER_SPEND": {
        const usedHintsCount = Object.values(playerGame.hintsUsed || {}).filter(
          (v) => v
        ).length
        const effectiveHints = Math.max(0, hintsAvailable)

        if (effectiveHints <= 0 && usedHintsCount === 0) {
          return ""
        }
        return `Need a Hint? (${effectiveHints} available)`
      }
      case "IMPLICIT_FEEDBACK":
        return "Hints are revealed by successful guesses!"
      case "NONE_DISABLED":
      case "EXTREME_CHALLENGE":
        return ""
      default:
        return ""
    }
  }, [
    hintsAvailable,
    isInteractionsDisabled,
    playerGame.hintsUsed,
    currentHintStrategy,
  ])

  const isToggleDisabled =
    isInteractionsDisabled || currentHintStrategy !== "USER_SPEND"

  const areHintButtonsDisabled =
    isInteractionsDisabled ||
    currentHintStrategy !== "USER_SPEND" ||
    hintsAvailable <= 0

  return {
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled,
    areHintButtonsDisabled,
    hintStatuses,
    highlightedHint,
    getHintText,
    handleToggleHintOptions,
    handleHintSelection,
  }
}
