import { useState, useCallback, useEffect } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { BasicMovie } from "../../models/movie"
import { PlayerGame } from "../../models/game"
import {
  useSharedValue,
  withSequence,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { analyticsService } from "../analyticsService"
import { hapticsService } from "../hapticsService"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface UsePickerLogicProps {
  movies: readonly BasicMovie[]
  playerGame: PlayerGame
  isInteractionsDisabled: boolean
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  onGuessFeedback: (message: string | null) => void
  setShowConfetti?: (show: boolean) => void
}

type PickerState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: string; results: readonly BasicMovie[] }
  | { status: "selected"; movie: BasicMovie }

export function usePickerLogic({
  movies,
  playerGame,
  isInteractionsDisabled,
  updatePlayerGame,
  onGuessFeedback,
  setShowConfetti,
}: UsePickerLogicProps) {
  const [pickerState, setPickerState] = useState<PickerState>({
    status: "idle",
  })
  const shakeAnimation = useSharedValue(0)

  const triggerShake = () => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 })
    )
  }

  const filterMovies = useCallback(
    (searchTerm: string) => {
      const trimmedTerm = searchTerm.trim().toLowerCase()
      if (trimmedTerm === "") return []
      return movies.filter((movie) =>
        movie.title.toLowerCase().includes(trimmedTerm)
      )
    },
    [movies]
  )

  const handleInputChange = useCallback(
    (text: string) => {
      if (isInteractionsDisabled) return
      if (text === "") {
        setPickerState({ status: "idle" })
      } else {
        setPickerState({ status: "searching", query: text })
      }
    },
    [isInteractionsDisabled]
  )

  useEffect(() => {
    if (pickerState.status !== "searching") return

    const handler = setTimeout(() => {
      const filtered = filterMovies(pickerState.query)
      setPickerState({
        status: "results",
        query: pickerState.query,
        results: filtered,
      })
    }, 300)

    return () => clearTimeout(handler)
  }, [pickerState, filterMovies])

  const handleMovieSelection = useCallback(
    (movie: BasicMovie) => {
      if (isInteractionsDisabled) return
      setPickerState({ status: "selected", movie })
      hapticsService.light()
    },
    [isInteractionsDisabled]
  )

  const resetSelectedMovie = useCallback(() => {
    if (isInteractionsDisabled) return
    setPickerState({ status: "idle" })
  }, [isInteractionsDisabled])

  const onPressCheck = useCallback(() => {
    if (
      isInteractionsDisabled ||
      pickerState.status !== "selected" ||
      !playerGame.movie?.id
    )
      return

    hapticsService.medium()
    const { movie: selectedMovie } = pickerState

    const newGuesses = [...(playerGame.guesses || []), selectedMovie.id]
    const isCorrectAnswer = playerGame.movie.id === selectedMovie.id

    analyticsService.trackGuessMade(
      newGuesses.length,
      isCorrectAnswer,
      selectedMovie.id,
      selectedMovie.title
    )

    if (isCorrectAnswer) {
      hapticsService.success()
      onGuessFeedback("Correct Guess!")
      setShowConfetti?.(true)
    } else {
      hapticsService.error()
      onGuessFeedback("Incorrect Guess")
      triggerShake()
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    const updatedPlayerGame = {
      ...playerGame,
      guesses: newGuesses,
      correctAnswer: isCorrectAnswer,
    }

    updatePlayerGame(updatedPlayerGame)
    setPickerState({ status: "idle" })
  }, [
    isInteractionsDisabled,
    pickerState,
    playerGame,
    updatePlayerGame,
    onGuessFeedback,
    setShowConfetti,
  ])

  return {
    pickerState,
    shakeAnimation,
    handleInputChange,
    handleMovieSelection,
    onPressCheck,
    resetSelectedMovie,
  }
}
