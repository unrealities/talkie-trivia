import { useState, useCallback, useEffect } from "react"
import { BasicMovie } from "../../models/movie"
import { PlayerGame } from "../../models/game"
import { useSharedValue, withTiming } from "react-native-reanimated"

const DEFAULT_BUTTON_TEXT = "Select a Movie"

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
  const [selectedMovie, setSelectedMovie] = useState<{
    id: number
    title: string
  }>({
    id: 0,
    title: DEFAULT_BUTTON_TEXT,
  })
  const [searchText, setSearchText] = useState<string>("")
  const buttonScale = useSharedValue(1)

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

  const handleInputChange = useCallback(
    (text: string) => {
      if (selectedMovie.id !== 0) {
        setSelectedMovie({ id: 0, title: DEFAULT_BUTTON_TEXT })
      }
      setSearchText(text)
      setIsSearching(true)
    },
    [selectedMovie]
  ) // selectedMovie added to dependencies

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
        const releaseYear = movie.release_date
          ? ` (${movie.release_date.toString().substring(0, 4)})`
          : ""
        setSelectedMovie({
          id: movie.id,
          title: `${movie.title}${releaseYear}`,
        })

        setSearchText("")
        setFoundMovies([])
      }
    },
    [isInteractionsDisabled]
  )

  const resetSelectedMovie = useCallback(() => {
    setSelectedMovie({ id: 0, title: DEFAULT_BUTTON_TEXT });
  }, [setSelectedMovie]);

  const onPressCheck = useCallback(() => {
    if (
      !isInteractionsDisabled &&
      selectedMovie.id > 0 &&
      playerGame.game.movie?.id
    ) {
      const newGuesses = [...(playerGame.guesses || []), selectedMovie.id]
      const isCorrectAnswer = playerGame.game.movie.id === selectedMovie.id

      if (isCorrectAnswer) {
        onGuessFeedback("Correct Guess!")
        setShowConfetti?.(true)
      } else {
        onGuessFeedback("Incorrect Guess")
      }

      const updatedPlayerGame = {
        ...playerGame,
        guesses: newGuesses,
        correctAnswer: isCorrectAnswer,
      }

      updatePlayerGame(updatedPlayerGame)
      setSelectedMovie({ id: 0, title: DEFAULT_BUTTON_TEXT })

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
    DEFAULT_BUTTON_TEXT,
    handleInputChange,
    handleMovieSelection,
    onPressCheck,
    handleFocus,
    handleBlur,
    resetSelectedMovie
  }
}
