import React, { useCallback, memo } from "react"
import { Pressable, Text, ListRenderItemInfo } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"
import { usePickerLogic } from "../utils/hooks/usePickerLogic"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"
import { useGameplay } from "../contexts/gameplayContext"

interface MovieItemProps {
  movie: BasicMovie
  isSelected: boolean
  isDisabled: boolean
  onSelect: (movie: BasicMovie) => void
}

const MovieItem = memo<MovieItemProps>(
  ({ movie, isSelected, isDisabled, onSelect }) => {
    const releaseYear = movie.release_date
      ? ` (${movie.release_date.toString().substring(0, 4)})`
      : ""
    const titleWithYear = `${movie.title}${releaseYear}`

    return (
      <Pressable
        accessible
        accessibilityRole="button"
        aria-label={`Select movie: ${movie.title}, ID: ${movie.id}`}
        onPress={() => onSelect(movie)}
        style={[
          pickerStyles.pressableText,
          isSelected && pickerStyles.selectedMovie,
        ]}
        android_ripple={{ color: colors.quinary }}
        disabled={isDisabled}
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
  }
)

const PickerContainer: React.FC = memo(() => {
  const {
    isDataLoading,
    movies,
    playerGame,
    isInteractionsDisabled,
    updatePlayerGame,
    provideGuessFeedback,
    setShowConfetti,
  } = useGameplay()

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
    onGuessFeedback: provideGuessFeedback,
    setShowConfetti,
  })

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }],
    }
  })

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BasicMovie>) => {
      return (
        <MovieItem
          movie={item}
          isSelected={selectedMovie?.id === item.id}
          isDisabled={isInteractionsDisabled}
          onSelect={handleMovieSelection}
        />
      )
    },
    [selectedMovie, isInteractionsDisabled, handleMovieSelection]
  )

  if (isDataLoading) {
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
})

export default PickerContainer
