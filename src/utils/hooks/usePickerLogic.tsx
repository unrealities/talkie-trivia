import { useState, useCallback, useEffect } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { search } from "fast-fuzzy"
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
  onGuessMade: (result: { movieId: number; correct: boolean }) => void
}

type PickerState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: string; results: readonly BasicMovie[] }

export function usePickerLogic({
  movies,
  playerGame,
  isInteractionsDisabled,
  updatePlayerGame,
  onGuessMade,
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
    (searchTerm: string): BasicMovie[] => {
      const trimmedTerm = searchTerm.trim()
      if (trimmedTerm.length < 2) return []

      const results = search(trimmedTerm, movies, {
        keySelector: (movie) => movie.title,
        threshold: 0.8,
      })

      return results
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
      if (filtered.length > 0) {
        hapticsService.light()
      }

      setPickerState({
        status: "results",
        query: pickerState.query,
        results: filtered,
      })
    }, 300)

    return () => clearTimeout(handler)
  }, [pickerState, filterMovies])

  const handleMovieSelection = useCallback(
    (selectedMovie: BasicMovie) => {
      if (isInteractionsDisabled || !playerGame.movie?.id) return

      setPickerState({ status: "idle" })

      const newGuesses = [...(playerGame.guesses || []), selectedMovie.id]
      const isCorrectAnswer = playerGame.movie.id === selectedMovie.id

      analyticsService.trackGuessMade(
        newGuesses.length,
        isCorrectAnswer,
        selectedMovie.id,
        selectedMovie.title
      )

      if (!isCorrectAnswer) {
        triggerShake()
      }

      onGuessMade({ movieId: selectedMovie.id, correct: isCorrectAnswer })

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      const updatedPlayerGame = {
        ...playerGame,
        guesses: newGuesses,
        correctAnswer: isCorrectAnswer,
      }
      updatePlayerGame(updatedPlayerGame)
    },
    [isInteractionsDisabled, playerGame, updatePlayerGame, onGuessMade]
  )

  return {
    pickerState,
    shakeAnimation,
    handleInputChange,
    handleMovieSelection,
  }
}
