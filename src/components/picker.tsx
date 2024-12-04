import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
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

const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return ((...args: Parameters<T>) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => func(...args), delay)
  }) as T
}

const PickerContainer: React.FC<PickerContainerProps> = ({
  movies,
  playerGame,
  updatePlayerGame,
}) => {
  const DEFAULT_BUTTON_TEXT = "Select a Movie"

  const [searchState, setSearchState] = useState({
    foundMovies: [] as BasicMovie[],
    searchText: "",
    loading: true,
    error: null as string | null,
  })

  const [selectedMovie, setSelectedMovie] = useState<{
    id: number;
    title: string;
  }>({ id: 0, title: DEFAULT_BUTTON_TEXT })

  const removeDuplicates = useCallback((movieList: BasicMovie[]): BasicMovie[] => {
    return movieList.filter(
      (movie, index, self) =>
        index ===
        self.findIndex(
          (m) => m.title.toLowerCase() === movie.title.toLowerCase()
        )
    )
  }, [])

  const isInteractionsDisabled = useMemo(() =>
    playerGame.correctAnswer ||
    playerGame.guesses.length >= playerGame.game.guessesMax,
    [playerGame.correctAnswer, playerGame.guesses, playerGame.game.guessesMax]
  )

  const filterMovies = useCallback((searchTerm: string) => {
    const trimmedTerm = searchTerm.trim().toLowerCase()

    if (trimmedTerm === "") {
      return removeDuplicates(movies)
    }

    const regex = new RegExp(
      trimmedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    )

    const filteredMovies = movies.filter((movie) =>
      regex.test(movie.title)
    )

    return removeDuplicates(filteredMovies)
  }, [movies, removeDuplicates])

  const debouncedFilterMovies = useCallback(
    useDebounce((text: string) => {
      setSearchState(prev => ({
        ...prev,
        loading: true
      }))

      const filteredMovies = filterMovies(text)

      setSearchState(prev => ({
        ...prev,
        foundMovies: filteredMovies,
        error: filteredMovies.length === 0
          ? `No movies found for "${text}"`
          : null,
        loading: false,
      }))
    }, 300),
    [filterMovies]
  )

  // Initial movies loading effect
  useEffect(() => {
    const uniqueMovies = removeDuplicates(movies)
    setSearchState(prev => ({
      ...prev,
      foundMovies: uniqueMovies,
      loading: false,
      error: uniqueMovies.length === 0
        ? "Failed to load movies. Please try again."
        : null,
    }))
  }, [movies, removeDuplicates])

  const handleSearchChange = (text: string) => {
    if (!isInteractionsDisabled) {
      setSearchState(prev => ({ ...prev, searchText: text }))
      debouncedFilterMovies(text)
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
  }, [
    isInteractionsDisabled,
    selectedMovie.id,
    playerGame,
    updatePlayerGame,
  ])

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
        value={searchState.searchText}
        editable={!isInteractionsDisabled}
      />

      {searchState.loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : searchState.error ? (
        <Text
          accessibilityRole="text"
          style={pickerStyles.errorText}
        >
          {searchState.error}
        </Text>
      ) : (
        <View style={pickerStyles.text}>
          {searchState.foundMovies.length > 0 ? (
            <ScrollView style={pickerStyles.resultsShow}>
              {searchState.foundMovies.map((movie) => (
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
          ) : (
            <Text style={pickerStyles.noResultsText}>
              {searchState.searchText
                ? `No movies found for "${searchState.searchText}"`
                : "No movies available"}
            </Text>
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
          isInteractionsDisabled && { opacity: 0.5 }
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
