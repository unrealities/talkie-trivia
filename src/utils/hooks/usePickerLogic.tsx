import { useState, useCallback, useEffect } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { search } from "fast-fuzzy"
import { BasicMovie, Movie } from "../../models/movie"
import { PlayerGame } from "../../models/game"
import {
  useSharedValue,
  withSequence,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { analyticsService } from "../analyticsService"
import { hapticsService } from "../hapticsService"
import { generateImplicitHint } from "../guessFeedbackUtils"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface UsePickerLogicProps {
  movies: readonly Movie[]
  playerGame: PlayerGame
  isInteractionsDisabled: boolean
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  onGuessMade: (result: {
    movieId: number
    correct: boolean
    feedback?: string | null
  }) => void
}

type PickerState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: readonly BasicMovie[] }

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

      return results as BasicMovie[]
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
      let feedback: string | null = null
      let revealedHints = {}

      analyticsService.trackGuessMade(
        newGuesses.length,
        isCorrectAnswer,
        selectedMovie.id,
        selectedMovie.title
      )

      if (!isCorrectAnswer) {
        triggerShake()
        const guessedFullMovie = movies.find((m) => m.id === selectedMovie.id)
        if (guessedFullMovie) {
          const result = generateImplicitHint(
            guessedFullMovie,
            playerGame.movie
          )
          feedback = result.feedback
          revealedHints = result.revealedHints
        }
      }

      onGuessMade({
        movieId: selectedMovie.id,
        correct: isCorrectAnswer,
        feedback,
      })

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      const updatedPlayerGame: PlayerGame = {
        ...playerGame,
        guesses: newGuesses,
        correctAnswer: isCorrectAnswer,
        hintsUsed: {
          ...playerGame.hintsUsed,
          ...revealedHints,
        },
      }
      updatePlayerGame(updatedPlayerGame)
    },
    [isInteractionsDisabled, playerGame, movies, updatePlayerGame, onGuessMade]
  )

  return {
    pickerState,
    shakeAnimation,
    handleInputChange,
    handleMovieSelection,
  }
}
