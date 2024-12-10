import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"

interface PickerContainerProps {
  enableSubmit: boolean
  movies: BasicMovie[]
  playerGame: PlayerGame
  updatePlayerGame: Dispatch<SetStateAction<PlayerGame>>
}

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const PickerContainer: React.FC<PickerContainerProps> = ({
  movies,
  playerGame,
  updatePlayerGame,
}) => {
  const DEFAULT_BUTTON_TEXT = "Select a Movie"

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [foundMovies, setFoundMovies] = useState<BasicMovie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<{
    id: number
    title: string
  }>({ id: 0, title: DEFAULT_BUTTON_TEXT })
  const [searchText, setSearchText] = useState<string>("")

  const debouncedSearchText = useDebounce(searchText, 300)

  const isInteractionsDisabled = useMemo(
    () =>
      playerGame.correctAnswer ||
      playerGame.guesses.length >= playerGame.game.guessesMax,
    [playerGame.correctAnswer, playerGame.guesses, playerGame.game.guessesMax]
  )

  // Optimized filterMovies function using useMemo for caching
  const filterMovies = useMemo(() => {
    return (searchTerm: string) => {
      const trimmedTerm = searchTerm.trim().toLowerCase()

      if (trimmedTerm === "") {
        return movies // Return all movies when the search term is empty
      }

      // Return filtered movies
      return movies.filter((movie) =>
        movie.title.toLowerCase().includes(trimmedTerm)
      )
    }
  }, [movies]) // `movies` is a dependency because the function will be recreated when movies change

  // Load all movies initially, only runs once on mount or when 'movies' prop changes
  useEffect(() => {
    setIsLoading(true)
    setFoundMovies(movies)
    setError(null)
    setIsLoading(false)
  }, [movies])

  // Trigger filtering with debounced search text
  useEffect(() => {
    if (debouncedSearchText) {
      setIsLoading(true) // Set loading only when we have a search term
      const filteredMovies = filterMovies(debouncedSearchText)
      setFoundMovies(filteredMovies)
      setIsLoading(false)
    } else {
      setFoundMovies(movies) // Reset to all movies
      setError(null)
    }
  }, [debouncedSearchText, filterMovies, movies])

  const handleSearchChange = (text: string) => {
    if (!isInteractionsDisabled) {
      setSearchText(text)
    }
  }

  const onPressCheck = useCallback(() => {
    if (
      !isInteractionsDisabled &&
      selectedMovie.id > 0 &&
      playerGame.game.movie?.id
    ) {
      updatePlayerGame({
        ...playerGame,
        guesses: [...playerGame.guesses, selectedMovie.id],
        correctAnswer: playerGame.game.movie.id === selectedMovie.id,
      })
    }
  }, [isInteractionsDisabled, selectedMovie.id, playerGame, updatePlayerGame])

  const handleMovieSelection = (movie: BasicMovie) => {
    if (!isInteractionsDisabled) {
      setSelectedMovie({ id: movie.id, title: movie.title })
    }
  }

  return (
    <View style={pickerStyles.container}>
      <TextInput
        accessible
        accessibilityRole="search"
        aria-label="Search for a movie"
        maxLength={100}
        onChangeText={handleSearchChange}
        placeholder="Search for a movie title"
        placeholderTextColor={colors.tertiary}
        style={pickerStyles.input}
        value={searchText}
        editable={!isInteractionsDisabled}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text accessibilityRole="text" style={pickerStyles.errorText}>
          {error}
        </Text>
      ) : (
        <View style={pickerStyles.text}>
          {foundMovies.length > 0 && (
            <ScrollView style={pickerStyles.resultsShow}>
              {foundMovies.map((movie) => (
                <Pressable
                  accessible
                  accessibilityRole="button"
                  aria-label={`Select movie: ${movie.title}, ID: ${movie.id}`}
                  key={movie.id}
                  onPress={() => handleMovieSelection(movie)}
                  style={[
                    pickerStyles.pressableText,
                    selectedMovie.id === movie.id && pickerStyles.selectedMovie,
                  ]}
                  android_ripple={{ color: colors.quinary }}
                  disabled={isInteractionsDisabled}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={pickerStyles.unselected}
                  >
                    {movie.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <Pressable
        accessible
        aria-label={
          isInteractionsDisabled
            ? "Submit button disabled"
            : "Submit button enabled"
        }
        role="button"
        disabled={isInteractionsDisabled}
        onPress={onPressCheck}
        style={[
          pickerStyles.button,
          isInteractionsDisabled && { opacity: 0.5 },
        ]}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={pickerStyles.buttonText}
        >
          {selectedMovie.title}
        </Text>
      </Pressable>
    </View>
  )
}

export default PickerContainer
