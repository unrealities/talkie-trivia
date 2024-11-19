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
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import { colors } from "../styles/global"

interface PickerContainerProps {
  enableSubmit: boolean
  movies: BasicMovie[]
  playerGame: PlayerGame
  updatePlayerGame: Dispatch<SetStateAction<PlayerGame>>
}

const useDebounce = (func: Function, delay: number) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (...args: any[]) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => func(...args), delay)
  }
}

const PickerContainer = (props: PickerContainerProps) => {
  const defaultButtonText = "Select a Movie"
  const [searchState, setSearchState] = useState({
    foundMovies: [] as BasicMovie[],
    searchText: "",
    loading: true,
    error: null as string | null,
  })
  const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
  const [selectedMovieTitle, setSelectedMovieTitle] =
    useState<string>(defaultButtonText)
  const [disableInteractions, setDisableInteractions] = useState<boolean>(false)

  useEffect(() => {
    const isCorrectAnswer = props.playerGame.correctAnswer
    const guessesExhausted =
      props.playerGame.guesses.length >= props.playerGame.maxGuesses
    setDisableInteractions(isCorrectAnswer || guessesExhausted)
  }, [props.playerGame.correctAnswer, props.playerGame.guesses])

  useEffect(() => {
    const uniqueMovies = removeDuplicates(props.movies)
    if (uniqueMovies.length === 0) {
      setSearchState({
        ...searchState,
        foundMovies: [],
        loading: false,
        error: "Failed to load movies. Please try again.",
      })
    } else {
      setSearchState({
        ...searchState,
        foundMovies: uniqueMovies,
        loading: false,
        error: null,
      })
    }
  }, [props.movies])

  const removeDuplicates = (movies: BasicMovie[]): BasicMovie[] => {
    return movies.filter(
      (movie, index, self) =>
        index ===
        self.findIndex(
          (m) => m.title.toLowerCase() === movie.title.toLowerCase()
        )
    )
  }

  const debouncedFilterMovies = useCallback(
    useDebounce((text: string) => {
      setSearchState((prev) => ({ ...prev, loading: true }))
      const searchTerm = text.trim().toLowerCase()

      if (searchTerm === "") {
        setSearchState((prev) => ({
          ...prev,
          foundMovies: removeDuplicates(props.movies),
          error: null,
          loading: false,
        }))
      } else {
        const regex = new RegExp(
          searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        )
        const filteredMovies = props.movies.filter((movie) =>
          regex.test(movie.title)
        )

        const uniqueFilteredMovies = removeDuplicates(filteredMovies)
        setSearchState((prev) => ({
          ...prev,
          foundMovies: uniqueFilteredMovies,
          error:
            uniqueFilteredMovies.length === 0
              ? `No movies found for "${text}"`
              : null,
          loading: false,
        }))
      }
    }, 300),
    [props.movies]
  )

  const handleSearchChange = (text: string) => {
    if (!disableInteractions) {
      setSearchState((prev) => ({ ...prev, searchText: text }))
      debouncedFilterMovies(text)
    }
  }

  const onPressCheck = useCallback(() => {
    if (
      !disableInteractions &&
      selectedMovieID > 0 &&
      props.playerGame.game.movie?.id
    ) {
      props.updatePlayerGame({
        ...props.playerGame,
        guesses: [...props.playerGame.guesses, selectedMovieID],
        correctAnswer: props.playerGame.game.movie.id === selectedMovieID,
      })
    }
  }, [
    disableInteractions,
    selectedMovieID,
    props.playerGame,
    props.updatePlayerGame,
  ])

  const handleMovieSelection = (movie: BasicMovie) => {
    if (!disableInteractions) {
      setSelectedMovieID(movie.id)
      setSelectedMovieTitle(movie.title) // Update the button text to the selected movie title
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        accessible
        accessibilityRole="search"
        aria-label="Search for a movie"
        maxLength={100}
        onChangeText={handleSearchChange}
        placeholder="Search for a movie title"
        placeholderTextColor={colors.tertiary}
        style={styles.input}
        value={searchState.searchText}
        editable={!disableInteractions}
      />

      {searchState.loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : searchState.error ? (
        <Text accessibilityRole="text" style={styles.errorText}>
          {searchState.error}
        </Text>
      ) : (
        <View style={styles.text}>
          {searchState.foundMovies.length > 0 ? (
            <ScrollView style={styles.resultsShow}>
              {searchState.foundMovies.map((movie) => (
                <Pressable
                  accessible
                  accessibilityRole="button"
                  aria-label={`Select movie: ${movie.title}, ID: ${movie.id}`}
                  key={movie.id}
                  onPress={() => handleMovieSelection(movie)}
                  style={[
                    styles.pressableText,
                    selectedMovieID === movie.id && styles.selectedMovie,
                  ]}
                  android_ripple={{ color: colors.quinary }}
                  disabled={disableInteractions}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.unselected}
                  >
                    {movie.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noResultsText}>
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
        style={[styles.button, disableInteractions && { opacity: 0.5 }]}
      >
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.buttonText}>
          {selectedMovieTitle} {/* Display the selected movie title */}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    maxHeight: 40,
    minHeight: 40,
    padding: 10,
    width: 300,
  },
  buttonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    flex: 1,
    minHeight: 180,
  },
  input: {
    alignSelf: "flex-start",
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    maxWidth: 300,
    padding: 5,
    textAlign: "center",
    width: 300,
  },
  pressableText: {
    flex: 1,
    fontFamily: "Arvo-Regular",
    padding: 5,
    borderRadius: 5,
  },
  selectedMovie: {
    backgroundColor: colors.quinary,
  },
  resultsShow: {
    flex: 1,
    maxHeight: 82,
    maxWidth: 280,
    minHeight: 82,
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: 12,
    padding: 10,
    lineHeight: 16,
    marginBottom: 10,
  },
  noResultsText: {
    fontFamily: "Arvo-Regular",
    fontSize: 14,
    color: colors.tertiary,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "Arvo-Regular",
    fontSize: 14,
    color: colors.quaternary,
    textAlign: "center",
    padding: 10,
  },
  unselected: {
    color: colors.secondary,
    fontFamily: "Arvo-Italic",
  },
})

export default PickerContainer
