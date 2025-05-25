import React, { useCallback, memo, useState } from "react"
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
    const [isMovieSelected, setIsMovieSelected] = useState(false)

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
      handleInputChange, // Original handleInputChange from hook
      onPressCheck, // Original onPressCheck from hook
      handleFocus, // Original handleFocus from hook
      handleBlur, // Original handleBlur from hook
    } = usePickerLogic({
      movies,
      playerGame,
      isInteractionsDisabled,
      updatePlayerGame,
      onGuessFeedback,
      setShowConfetti,
    })

    const { handleMovieSelection: originalHandleMovieSelection } =
      usePickerLogic({
        movies,
        playerGame,
        isInteractionsDisabled,
        updatePlayerGame,
        onGuessFeedback,
        setShowConfetti,
      })

    // Create a new handleMovieSelection function that calls the original and updates local state
    const handleMovieSelectionWrapper = useCallback(
      (movie: BasicMovie) => {
        originalHandleMovieSelection(movie)
        setIsMovieSelected(true)
      },
      [originalHandleMovieSelection, setIsMovieSelected]
    )

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
            onPress={() => handleMovieSelectionWrapper(movie)}
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
      [handleMovieSelectionWrapper, selectedMovie.id, isInteractionsDisabled]
    )

    return (
      <PickerUI
        searchText={searchText}
        isSearching={isSearching}
        isLoading={false}
        error={null}
        foundMovies={foundMovies}
        selectedMovieTitle={selectedMovie.title}
        isInteractionsDisabled={isInteractionsDisabled}
        DEFAULT_BUTTON_TEXT={DEFAULT_BUTTON_TEXT}
        isMovieSelectedForGuess={isMovieSelected}
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
