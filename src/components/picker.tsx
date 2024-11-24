import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useRef,
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

interface SearchState {
  foundMovies: BasicMovie[]
  searchText: string
  loading: boolean
  error: string | null
}

const useDebounce = (func: Function, delay: number) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (...args: any[]) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => func(...args), delay)
  }
}

const PickerContainer: React.FC<PickerContainerProps> = ({ 
  enableSubmit, 
  movies=[],
  playerGame, 
  updatePlayerGame 
}) => {
  const defaultButtonText = "Select a Movie"
  const [searchState, setSearchState] = useState<SearchState>({
    foundMovies: [],
    searchText: "",
    loading: true,
    error: null,
  })
  const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
  const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>(defaultButtonText)
  const [disableInteractions, setDisableInteractions] = useState<boolean>(false)

  // Function to remove duplicates
  const removeDuplicates = useCallback((movies: BasicMovie[]): BasicMovie[] => {
    return movies.filter(
      (movie, index, self) =>
        index === self.findIndex(
          (m) => m.title.toLowerCase() === movie.title.toLowerCase()
        )
    )
  }, [])

  // Initial movies load
  useEffect(() => {
    if (!movies) {
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: "Movies data is not available",
        foundMovies: []
      }))
      return
    }

    const uniqueMovies = removeDuplicates(movies)
    setSearchState(prev => ({
      ...prev,
      foundMovies: uniqueMovies,
      loading: false,
      error: uniqueMovies.length === 0 ? "No movies available" : null
    }))
  }, [movies, removeDuplicates])

  // Game state effect
  useEffect(() => {
    const isCorrectAnswer = playerGame.correctAnswer
    const guessesExhausted = playerGame.guesses.length >= playerGame.maxGuesses
    setDisableInteractions(isCorrectAnswer || guessesExhausted)
  }, [playerGame.correctAnswer, playerGame.guesses, playerGame.maxGuesses])

  const debouncedFilterMovies = useCallback(
    useDebounce((text: string) => {
      if (!movies) return // Guard clause for undefined movies

      setSearchState(prev => ({ ...prev, loading: true }))
      const searchTerm = text.trim().toLowerCase()

      if (searchTerm === "") {
        setSearchState(prev => ({
          ...prev,
          foundMovies: removeDuplicates(movies),
          error: null,
          loading: false,
        }))
        return
      }

      const regex = new RegExp(
        searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      )
      const filteredMovies = movies.filter(movie => regex.test(movie.title))
      const uniqueFilteredMovies = removeDuplicates(filteredMovies)

      setSearchState(prev => ({
        ...prev,
        foundMovies: uniqueFilteredMovies,
        error: uniqueFilteredMovies.length === 0 ? `No movies found for "${text}"` : null,
        loading: false,
      }))
    }, 300),
    [movies, removeDuplicates]
  )

  const handleSearchChange = useCallback((text: string) => {
    if (!disableInteractions) {
      setSearchState(prev => ({ ...prev, searchText: text }))
      debouncedFilterMovies(text)
    }
  }, [disableInteractions, debouncedFilterMovies])

  const handleMovieSelection = useCallback((movie: BasicMovie) => {
    if (!disableInteractions) {
      setSelectedMovieID(movie.id)
      setSelectedMovieTitle(movie.title)
    }
  }, [disableInteractions])

  const onPressCheck = useCallback(() => {
    if (
      !disableInteractions &&
      selectedMovieID > 0 &&
      playerGame.game.movie?.id
    ) {
      updatePlayerGame({
        ...playerGame,
        guesses: [...playerGame.guesses, selectedMovieID],
        correctAnswer: playerGame.game.movie.id === selectedMovieID,
      })
    }
  }, [
    disableInteractions,
    selectedMovieID,
    playerGame,
    updatePlayerGame,
  ])

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
        editable={!disableInteractions}
      />

      {searchState.loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : searchState.error ? (
        <Text accessibilityRole="text" style={pickerStyles.errorText}>
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
                    selectedMovieID === movie.id && pickerStyles.selectedMovie,
                  ]}
                  android_ripple={{ color: colors.quinary }}
                  disabled={disableInteractions}
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
          disableInteractions
            ? "Submit button disabled"
            : "Submit button enabled"
        }
        role="button"
        disabled={disableInteractions}
        onPress={onPressCheck}
        style={[pickerStyles.button, disableInteractions && { opacity: 0.5 }]}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={pickerStyles.buttonText}
        >
          {selectedMovieTitle}
        </Text>
      </Pressable>
    </View>
  )
}

export default PickerContainer
