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
import * as Haptics from "expo-haptics"

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

export function usePickerLogic({
  movies,
  playerGame,
  isInteractionsDisabled,
  updatePlayerGame,
  onGuessFeedback,
  setShowConfetti,
}: UsePickerLogicProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [foundMovies, setFoundMovies] = useState<BasicMovie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<BasicMovie | null>(null)
  const [searchText, setSearchText] = useState<string>("")

  const buttonScale = useSharedValue(1)
  const shakeAnimation = useSharedValue(0)

  // Function to trigger the shake animation.
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
      if (trimmedTerm === "") {
        return []
      }

      return Array.from(movies).filter((movie) =>
        movie.title.toLowerCase().includes(trimmedTerm)
      )
    },
    [movies]
  )

  const handleInputChange = useCallback((text: string) => {
    setSearchText(text)
    setIsSearching(true)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText) {
        const filtered = filterMovies(searchText)
        setFoundMovies(filtered)
      } else {
        setFoundMovies([])
      }
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(handler)
  }, [searchText, filterMovies])

  const handleMovieSelection = useCallback(
    (movie: BasicMovie) => {
      if (!isInteractionsDisabled) {
        setSelectedMovie(movie)
        setSearchText("")
        setFoundMovies([])
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
      }
    },
    [isInteractionsDisabled]
  )

  const resetSelectedMovie = useCallback(() => {
    setSelectedMovie(null)
  }, [])

  const onPressCheck = useCallback(() => {
    if (!isInteractionsDisabled && selectedMovie && playerGame.game.movie?.id) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }

      const newGuesses = [...(playerGame.guesses || []), selectedMovie.id]
      const isCorrectAnswer = playerGame.game.movie.id === selectedMovie.id

      if (isCorrectAnswer) {
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }
        onGuessFeedback("Correct Guess!")
        setShowConfetti?.(true)
      } else {
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
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
      setSelectedMovie(null)

      buttonScale.value = withTiming(0.9, { duration: 150 }, () => {
        buttonScale.value = withTiming(1, { duration: 150 })
      })
    }
  }, [
    isInteractionsDisabled,
    selectedMovie,
    playerGame,
    updatePlayerGame,
    onGuessFeedback,
    setShowConfetti,
    buttonScale,
  ])

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  return {
    searchText,
    isSearching,
    foundMovies,
    selectedMovie,
    isFocused,
    buttonScale,
    shakeAnimation,
    handleInputChange,
    handleMovieSelection,
    onPressCheck,
    handleFocus,
    handleBlur,
    resetSelectedMovie,
  }
}
