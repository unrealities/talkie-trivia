import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react"
import {
  ActivityIndicator,
  Pressable,
  FlatList,
  Text,
  TextInput,
  View,
  Animated,
  Easing,
} from "react-native"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"
import { useAnimatedStyle } from "react-native-reanimated"

interface PickerContainerProps {
  enableSubmit: boolean
  movies: BasicMovie[]
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  onGuessFeedback: (message: string | null) => void
}

const PickerContainer: React.FC<PickerContainerProps> = memo(
  ({ enableSubmit, movies, playerGame, updatePlayerGame, onGuessFeedback }) => {
    const [isFocused, setIsFocused] = useState(false)
    const DEFAULT_BUTTON_TEXT = "Select a Movie"

    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [foundMovies, setFoundMovies] = useState<BasicMovie[]>([])
    const [selectedMovie, setSelectedMovie] = useState<{
      id: number
      title: string
    }>({ id: 0, title: DEFAULT_BUTTON_TEXT })
    const [searchText, setSearchText] = useState<string>("")
    const buttonScale = useRef(new Animated.Value(1)).current

    const isInteractionsDisabled = useMemo(
      () =>
        playerGame.correctAnswer ||
        playerGame.guesses.length >= playerGame.game.guessesMax ||
        playerGame.gaveUp,
      [
        playerGame.correctAnswer,
        playerGame.guesses,
        playerGame.game.guessesMax,
        playerGame.gaveUp,
      ]
    )

    const filterMovies = useCallback(
      (searchTerm: string) => {
        const trimmedTerm = searchTerm.trim().toLowerCase()

        if (trimmedTerm === "") {
          return []
        }

        const filteredMovies = movies.filter((movie) =>
          movie.title.toLowerCase().includes(trimmedTerm)
        )
        return filteredMovies
      },
      [movies]
    )

    const handleInputChange = (text: string) => {
      setSearchText(text)
      setIsSearching(true)
    }

    useEffect(() => {
      const handler = setTimeout(() => {
        if (searchText) {
          const filteredMovies = filterMovies(searchText)
          setFoundMovies(filteredMovies)
          setIsSearching(false)
        } else {
          setFoundMovies([])
          setIsSearching(false)
        }
      }, 300)

      return () => clearTimeout(handler)
    }, [searchText, filterMovies])

    const onPressCheck = useCallback(() => {
      console.log(
        "onPressCheck: isInteractionsDisabled:",
        isInteractionsDisabled
      )
      console.log("onPressCheck: selectedMovie:", selectedMovie)
      console.log("onPressCheck: playerGame.game.movie:", playerGame.game.movie)

      if (
        !isInteractionsDisabled &&
        selectedMovie.id > 0 &&
        playerGame.game.movie?.id
      ) {
        const newGuesses = Array.isArray(playerGame.guesses)
          ? [...playerGame.guesses, selectedMovie.id]
          : [selectedMovie.id]

        const isCorrectAnswer = playerGame.game.movie.id === selectedMovie.id

        console.log("PickerContainer: onPressCheck - newGuesses:", newGuesses)
        console.log(
          "PickerContainer: onPressCheck - isCorrectAnswer:",
          isCorrectAnswer
        )

        if (isCorrectAnswer) {
          onGuessFeedback("Correct Guess!")
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
        setSearchText("")

        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 0.9,
            duration: 50,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start()
      }
    }, [
      isInteractionsDisabled,
      selectedMovie,
      playerGame,
      updatePlayerGame,
      onGuessFeedback,
      buttonScale,
    ])

    const animatedButtonStyle = useAnimatedStyle(() => ({
      transform: [{ scale: buttonScale }],
    }))

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
        }
      },
      [isInteractionsDisabled, setSelectedMovie]
    )

    const renderItem = useCallback(
      ({ item: movie }: { item: BasicMovie }) => {
        const releaseYear = movie.release_date
          ? ` (${movie.release_date.toString().substring(0, 4)})`
          : ""
        const titleWithYear = `${movie.title}${releaseYear}`

        return (
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
              style={pickerStyles.unselected}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {titleWithYear}
            </Text>
          </Pressable>
        )
      },
      [handleMovieSelection, selectedMovie.id, isInteractionsDisabled]
    )

    return (
      <View style={pickerStyles.container}>
        <View style={pickerStyles.inputContainer}>
          <TextInput
            accessible
            accessibilityRole="search"
            aria-label="Search for a movie"
            maxLength={100}
            onBlur={() => setIsFocused(false)}
            onChangeText={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for a movie title"
            placeholderTextColor={colors.tertiary}
            style={pickerStyles.input}
            value={searchText}
            readOnly={isInteractionsDisabled}
          />
          {isSearching && (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={pickerStyles.activityIndicator}
            />
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : error ? (
          <Text accessibilityRole="text" style={pickerStyles.errorText}>
            {error}
          </Text>
        ) : (
          <View style={pickerStyles.resultsContainer}>
            {/* Use FlatList instead of ScrollView */}
            <FlatList
              data={foundMovies}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={pickerStyles.resultsShow}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={pickerStyles.noResultsText}>No movies found</Text>
              }
            />
          </View>
        )}

        <Animated.View style={[animatedButtonStyle]}>
          <Pressable
            accessible
            aria-label={
              isInteractionsDisabled
                ? "Submit button disabled"
                : "Submit button enabled"
            }
            role="button"
            disabled={
              isInteractionsDisabled ||
              selectedMovie.title === DEFAULT_BUTTON_TEXT
            }
            onPress={onPressCheck}
            style={[
              pickerStyles.button,
              isInteractionsDisabled && pickerStyles.disabledButton,
              selectedMovie.title === DEFAULT_BUTTON_TEXT &&
                pickerStyles.disabledButton,
              selectedMovie.title.length > 35 && pickerStyles.disabledButton,
            ]}
          >
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                pickerStyles.buttonText,
                selectedMovie.title.length > 35 && pickerStyles.buttonTextSmall,
              ]}
            >
              {selectedMovie.title}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.enableSubmit === nextProps.enableSubmit &&
      prevProps.movies === nextProps.movies &&
      prevProps.playerGame === nextProps.playerGame &&
      prevProps.updatePlayerGame === nextProps.updatePlayerGame
    )
  }
)

export default PickerContainer
