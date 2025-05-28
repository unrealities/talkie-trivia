import React, { useCallback, memo } from "react"
import { Pressable, Text, ListRenderItemInfo } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"
import { usePickerLogic } from "../utils/hooks/usePickerLogic"
import { PickerUI } from "./pickerUI"

interface PickerContainerProps {
  enableSubmit: boolean
  movies: readonly BasicMovie[]
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
    const isInteractionsDisabled =
      playerGame.correctAnswer ||
      playerGame.guesses.length >= playerGame.game.guessesMax ||
      playerGame.gaveUp

    const {
      searchText,
      isSearching,
      foundMovies,
      selectedMovie,
      buttonScale,
      DEFAULT_BUTTON_TEXT,
      handleInputChange,
      handleMovieSelection, // Destructure handleMovieSelection directly from the hook
      onPressCheck,
      handleFocus,
      handleBlur,
    } = usePickerLogic({
      movies,
      playerGame,
      isInteractionsDisabled,
      updatePlayerGame,
      onGuessFeedback,
      setShowConfetti,
    })

    // Determine if a movie is selected based on selectedMovie from the hook
    const isMovieSelectedForGuess = selectedMovie.id !== 0 // Adjust condition based on initial selectedMovie state in usePickerLogic

    const animatedButtonStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: isMovieSelectedForGuess
          ? colors.primary
          : "transparent",
        borderColor: isMovieSelectedForGuess ? colors.primary : colors.primary,
        opacity: isMovieSelectedForGuess && !isInteractionsDisabled ? 1 : 1,
        transform: [{ scale: buttonScale.value }],
      }
    })

    const renderItem = useCallback(
      ({ item: movie }: ListRenderItemInfo<BasicMovie>) => {
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
            onPress={() => handleMovieSelection(movie)} // Use handleMovieSelection from the hook directly
            style={[
              pickerStyles.pressableText,
              selectedMovie.id === movie.id && pickerStyles.selectedMovie,
            ]}
            android_ripple={{ color: colors.quinary }}
            disabled={isInteractionsDisabled}
          >
            <Text // Use Text component to display movie title
              style={pickerStyles.unselected}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {titleWithYear}
            </Text>
          </Pressable>
        )
      },
      [handleMovieSelection, selectedMovie.id, isInteractionsDisabled] // Update dependencies
    )

    return (
      <PickerUI
        searchText={searchText}
        isSearching={isSearching}
        isLoading={false} // Assuming usePickerLogic handles loading internally or passes a loading state
        error={null} // Assuming usePickerLogic handles errors internally or passes an error state
        foundMovies={foundMovies}
        selectedMovieTitle={selectedMovie.title}
        isInteractionsDisabled={isInteractionsDisabled}
        DEFAULT_BUTTON_TEXT={DEFAULT_BUTTON_TEXT}
        isMovieSelectedForGuess={isMovieSelectedForGuess} // Pass the derived state
        animatedButtonStyle={animatedButtonStyle}
        handleInputChange={handleInputChange}
        renderItem={renderItem}
        onPressCheck={onPressCheck}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
      />
    )
  }
)

export default PickerContainer
