import React, { useEffect, useState, useCallback, memo } from "react"
import {
  ActivityIndicator,
  Pressable,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"

interface PickerContainerProps {
  enableSubmit: boolean
  movies: BasicMovie[]
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  onGuessFeedback: (message: string | null) => void
  setShowConfetti?: (show: boolean) => void
}

const PickerContainer: React.FC<PickerContainerProps> = memo(
  ({
    enableSubmit,
    movies,
    playerGame,
    updatePlayerGame,
    onGuessFeedback,
    setShowConfetti,
  }) => {
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
    const buttonScale = useSharedValue(1)

    const isInteractionsDisabled =
      playerGame.correctAnswer ||
      playerGame.guesses.length >= playerGame.game.guessesMax ||
      playerGame.gaveUp

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
          setShowConfetti && setShowConfetti(true)
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
      buttonScale,
      setShowConfetti,
    ])

    const animatedButtonStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: buttonScale.value }],

        backgroundColor:
          isInteractionsDisabled ||
          selectedMovie.title === DEFAULT_BUTTON_TEXT ||
          selectedMovie.title.length > 35
            ? "transparent"
            : undefined,
        borderColor:
          isInteractionsDisabled ||
          selectedMovie.title === DEFAULT_BUTTON_TEXT ||
          selectedMovie.title.length > 35
            ? colors.tertiary
            : colors.primary,
        opacity:
          isInteractionsDisabled ||
          selectedMovie.title === DEFAULT_BUTTON_TEXT ||
          selectedMovie.title.length > 35
            ? 0.5
            : 1,
      }
    })

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

        <Animated.View style={[pickerStyles.button, animatedButtonStyle]}>
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
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
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
  }
)

export default PickerContainer
