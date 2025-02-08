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
import { useAnimatedStyle } from "react-native-reanimated" // IMPORT useAnimatedStyle

interface PickerContainerProps {
  enableSubmit: boolean
  movies: BasicMovie[]
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  onGuessFeedback: (message: string | null) => void // Feedback function
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
    const buttonScale = useRef(new Animated.Value(1)).current // For button animation

    const isInteractionsDisabled = useMemo(
      () =>
        playerGame.correctAnswer ||
        playerGame.guesses.length >= playerGame.game.guessesMax ||
        playerGame.gaveUp, // Include gaveUp state
      [
        playerGame.correctAnswer,
        playerGame.guesses,
        playerGame.game.guessesMax,
        playerGame.gaveUp,
      ]
    )

    // Simple search using includes
    const filterMovies = (searchTerm: string) => {
      const trimmedTerm = searchTerm.trim().toLowerCase()

      if (trimmedTerm === "") {
        return [] // Return empty array when search term is empty
      }

      // Filter movies based on search term
      const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(trimmedTerm)
      )
      return filteredMovies
    }

    // Update state directly on input change
    const handleInputChange = (text: string) => {
      setSearchText(text)
      setIsSearching(true)
    }

    // Debounced effect to trigger search
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
      }, 300) // 300ms delay

      return () => clearTimeout(handler) // Clean up the timeout
    }, [searchText, movies])

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

        // Provide feedback based on the guess
        if (isCorrectAnswer) {
          onGuessFeedback("Correct Guess!")
        } else {
          onGuessFeedback("Incorrect Guess")
        }

        // Update playerGame state using the new array
        const updatedPlayerGame = {
          ...playerGame,
          guesses: newGuesses,
          correctAnswer: isCorrectAnswer,
        }

        updatePlayerGame(updatedPlayerGame) // Call updatePlayerGame directly

        setSelectedMovie({ id: 0, title: DEFAULT_BUTTON_TEXT })
        setSearchText("")

        // Button press animation
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 0.9,
            duration: 50, // Short duration for press effect
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 150, // Slightly longer duration for release
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
      transform: [{ scale: buttonScale.value }],
    }))

    const handleMovieSelection = (movie: BasicMovie) => {
      if (!isInteractionsDisabled) {
        const releaseYear = movie.release_date
          ? ` (${movie.release_date.toString().substring(0, 4)})`
          : ""
        setSelectedMovie({
          id: movie.id,
          title: `${movie.title}${releaseYear}`,
        })
      }
    }

    // Render item for FlatList
    const renderItem = ({ item: movie }: { item: BasicMovie }) => {
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
            numberOfLines={1}
            ellipsizeMode="tail"
            style={pickerStyles.unselected}
          >
            {titleWithYear}
          </Text>
        </Pressable>
      )
    }

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
              } // Add a component to display when the list is empty
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
            } //disable when no movie selected or interactions are disabled
            onPress={onPressCheck}
            style={[
              pickerStyles.button,
              isInteractionsDisabled && pickerStyles.disabledButton, // disabled style
              selectedMovie.title === DEFAULT_BUTTON_TEXT &&
                pickerStyles.disabledButton, // also disabled style when no movie selected
              selectedMovie.title.length > 35 && pickerStyles.buttonSmall,
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
