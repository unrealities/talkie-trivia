import React, { useCallback, memo } from "react"
import { Pressable, Text, ListRenderItemInfo } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"
import { usePickerLogic } from "../utils/hooks/usePickerLogic"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"

interface PickerContainerProps {
  isLoading: boolean
  movies: readonly BasicMovie[]
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  onGuessFeedback: (message: string | null) => void
  setShowConfetti?: (show: boolean) => void
}

const PickerContainer: React.FC<PickerContainerProps> = memo(
  ({
    isLoading,
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
      shakeAnimation,
      handleInputChange,
      handleMovieSelection,
      onPressCheck,
      handleFocus,
      handleBlur,
      resetSelectedMovie,
    } = usePickerLogic({
      movies,
      playerGame,
      isInteractionsDisabled,
      updatePlayerGame,
      onGuessFeedback,
      setShowConfetti,
    })

    const animatedInputStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: shakeAnimation.value }],
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
            onPress={() => handleMovieSelection(movie)}
            style={[
              pickerStyles.pressableText,
              selectedMovie?.id === movie.id && pickerStyles.selectedMovie,
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
      [handleMovieSelection, selectedMovie, isInteractionsDisabled]
    )

    if (isLoading) {
      return <PickerSkeleton />
    }

    return (
      <PickerUI
        searchText={searchText}
        isSearching={isSearching}
        isLoading={false}
        error={null}
        foundMovies={foundMovies}
        selectedMovie={selectedMovie}
        animatedInputStyle={animatedInputStyle}
        isInteractionsDisabled={isInteractionsDisabled}
        handleInputChange={handleInputChange}
        renderItem={renderItem}
        onPressCheck={onPressCheck}
        handleFocus={handleFocus}
        onClearSelectedMovie={resetSelectedMovie}
        handleBlur={handleBlur}
      />
    )
  }
)

export default PickerContainer
