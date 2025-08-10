import { useState, useCallback, useEffect } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { search } from "fast-fuzzy"
import { BasicMovie, Movie } from "../../models/movie"
import { HintType } from "../../models/game"
import {
  useSharedValue,
  withSequence,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { analyticsService } from "../analyticsService"
import { hapticsService } from "../hapticsService"
import { generateImplicitHint } from "../guessFeedbackUtils"
import { useGame } from "../../contexts/gameContext"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface UsePickerLogicProps {
  onGuessMade: (result: {
    movieId: number
    correct: boolean
    feedback?: string | null
    hintType?: HintType | null
  }) => void
}

type PickerState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: string; results: readonly BasicMovie[] }

export function usePickerLogic({ onGuessMade }: UsePickerLogicProps) {
  const { movies, playerGame, isInteractionsDisabled, dispatch } = useGame()
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

      const results = search(trimmedTerm, [...movies], {
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

      const isCorrectAnswer = playerGame.movie.id === selectedMovie.id
      let feedback: string | null = null
      let hintType: HintType | null = null

      analyticsService.trackGuessMade(
        playerGame.guesses.length + 1,
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
            playerGame.movie,
            playerGame.hintsUsed
          )
          feedback = result.feedback
          hintType = result.hintType
        }
      }

      onGuessMade({
        movieId: selectedMovie.id,
        correct: isCorrectAnswer,
        feedback,
        hintType,
      })

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      dispatch({
        type: "MAKE_GUESS",
        payload: {
          selectedMovie,
          correctMovie: playerGame.movie,
          allMovies: movies,
        },
      })
    },
    [isInteractionsDisabled, playerGame, movies, onGuessMade, dispatch]
  )

  return {
    pickerState,
    shakeAnimation,
    handleInputChange,
    handleMovieSelection,
  }
}
