import React, { useCallback, memo } from "react"
import { Pressable, Text, ListRenderItemInfo } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"
import { usePickerLogic } from "../utils/hooks/usePickerLogic"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"
import { useGame } from "../contexts/gameContext"

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

interface PickerContainerProps {
  provideGuessFeedback: (message: string | null) => void
}

const PickerContainer: React.FC<PickerContainerProps> = memo(
  ({ provideGuessFeedback }) => {
    const {
      loading: isDataLoading,
      movies,
      playerGame,
      isInteractionsDisabled,
      updatePlayerGame,
      setShowConfetti,
    } = useGame()

    const {
      pickerState,
      shakeAnimation,
      handleInputChange,
      handleMovieSelection,
      onPressCheck,
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
        const isSelected =
          pickerState.status === "selected" && pickerState.movie.id === item.id
        return (
          <MovieItem
            movie={item}
            isSelected={isSelected}
            isDisabled={isInteractionsDisabled}
            onSelect={handleMovieSelection}
          />
        )
      },
      [pickerState, isInteractionsDisabled, handleMovieSelection]
    )

    if (isDataLoading) {
      return <PickerSkeleton />
    }

    return (
      <PickerUI
        pickerState={pickerState}
        animatedInputStyle={animatedInputStyle}
        isInteractionsDisabled={isInteractionsDisabled}
        handleInputChange={handleInputChange}
        renderItem={renderItem}
        onPressCheck={onPressCheck}
        onClearSelectedMovie={resetSelectedMovie}
      />
    )
  }
)

export default PickerContainer
