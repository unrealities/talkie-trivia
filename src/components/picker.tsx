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
  const [foundMovies, setFoundMovies] = useState<BasicMovie[]>([])
  const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
  const [selectedMovieTitle, setSelectedMovieTitle] =
    useState<string>(defaultButtonText)
  const [searchText, setSearchText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)

  useEffect(() => {
    if (props.movies.length === 0) {
      setFoundMovies([])
      setLoading(false)
      setError("Failed to load movies. Please try again.")
    } else {
      const uniqueMovies = removeDuplicates(props.movies)
      setFoundMovies(uniqueMovies)
      setLoading(false)
      setError(null)
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
      const searchTerm = text.trim().toLowerCase()

      if (searchTerm === "") {
        setFoundMovies(removeDuplicates(props.movies))
        setError(null)
      } else {
        const regex = new RegExp(
          searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        )
        const filteredMovies = props.movies.filter((movie) =>
          regex.test(movie.title)
        )

        const uniqueFilteredMovies = removeDuplicates(filteredMovies)
        setFoundMovies(uniqueFilteredMovies)

        if (uniqueFilteredMovies.length === 0) {
          setError(`No movies found for "${text}"`)
        } else {
          setError(null)
        }
      }
    }, 300),
    [props.movies]
  )

  const handleSearchChange = (text: string) => {
    setSearchText(text)
    debouncedFilterMovies(text)
  }

  const onPressCheck = useCallback(() => {
    if (selectedMovieID > 0) {
      props.updatePlayerGame({
        ...props.playerGame,
        guesses: [...props.playerGame.guesses, selectedMovieID],
        correctAnswer: props.playerGame.game.movie.id === selectedMovieID,
      })
    }
  }, [
    selectedMovieID,
    selectedMovieTitle,
    props.playerGame,
    props.updatePlayerGame,
  ])

  const handleMovieSelection = (movie: BasicMovie) => {
    setSelectedMovieID(movie.id)
    setSelectedMovieTitle(movie.title)
    setIsButtonDisabled(false)
  }

  return (
    <View style={styles.container}>
      <TextInput
        accessible
        aria-label="Search for a movie"
        clearTextOnFocus={false}
        maxLength={100}
        onChangeText={(text) => handleSearchChange(text)}
        placeholder="Search for a movie title"
        placeholderTextColor={colors.tertiary}
        style={styles.input}
        value={searchText}
        readOnly={!loading && props.movies.length > 0}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.text}>
          {foundMovies.length > 0 ? (
            <ScrollView style={styles.resultsShow}>
              {foundMovies.map((movie) => (
                <Pressable
                  accessible
                  aria-label={`Select movie: ${movie.title}, ID: ${movie.id}`}
                  key={movie.id}
                  onPress={() => handleMovieSelection(movie)}
                  style={[
                    styles.pressableText,
                    selectedMovieID === movie.id && styles.selectedMovie,
                  ]}
                  android_ripple={{ color: colors.quinary }}
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
              {searchText
                ? `No movies found for "${searchText}"`
                : "No movies available"}
            </Text>
          )}
        </View>
      )}

      <Pressable
        accessible
        aria-label={
          isButtonDisabled ? "Submit button disabled" : "Submit button enabled"
        }
        role="button"
        disabled={isButtonDisabled}
        onPress={onPressCheck}
        style={isButtonDisabled ? styles.buttonDisabled : styles.button}
      >
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.buttonText}>
          {selectedMovieTitle}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 1,
    maxHeight: 40,
    minHeight: 40,
    padding: 10,
    width: 300,
    opacity: 1,
  },
  buttonDisabled: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 1,
    maxHeight: 40,
    minHeight: 40,
    padding: 10,
    width: 300,
    opacity: 0.5,
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
    flexWrap: "nowrap",
    fontFamily: "Arvo-Regular",
    padding: 5,
    borderRadius: 5,
    opacity: 1,
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
    flex: 1,
    flexWrap: "nowrap",
    fontFamily: "Arvo-Italic",
  },
})

export default PickerContainer
