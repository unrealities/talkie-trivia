import React, { useCallback, memo, useState } from "react"
import { Pressable, Text, ListRenderItemInfo, View } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { Image } from "expo-image"
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"
import { usePickerLogic } from "../utils/hooks/usePickerLogic"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"
import { useGame } from "../contexts/gameContext"
import { hapticsService } from "../utils/hapticsService"
import PreviewModal from "../components/previewModal"

interface MovieItemProps {
  movie: BasicMovie
  isDisabled: boolean
  onSelect: (movie: BasicMovie) => void
  onLongPress: (movie: BasicMovie) => void
}

const MovieItem = memo<MovieItemProps>(
  ({ movie, isDisabled, onSelect, onLongPress }) => {
    const releaseYear = movie.release_date
      ? ` (${movie.release_date.toString().substring(0, 4)})`
      : ""
    const titleWithYear = `${movie.title}${releaseYear}`
    const posterUri = movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : null

    return (
      <Pressable
        accessible
        accessibilityRole="button"
        aria-label={`Select and guess movie: ${movie.title}`}
        onPress={() => onSelect(movie)}
        onLongPress={() => onLongPress(movie)}
        delayLongPress={200}
        style={({ pressed }) => [
          pickerStyles.resultItem,
          pressed && { backgroundColor: colors.grey },
        ]}
        android_ripple={{ color: colors.grey }}
        disabled={isDisabled}
      >
        <Image
          source={{ uri: posterUri }}
          placeholder={require("../../assets/movie_default.png")}
          style={pickerStyles.resultImage}
          contentFit="cover"
        />
        <Text
          style={pickerStyles.unselected}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {titleWithYear}
        </Text>
      </Pressable>
    )
  }
)

interface PickerContainerProps {
  onGuessMade: (result: { movieId: number; correct: boolean }) => void
}

const PickerContainer: React.FC<PickerContainerProps> = memo(
  ({ onGuessMade }) => {
    const {
      loading: isDataLoading,
      movies,
      playerGame,
      isInteractionsDisabled,
      updatePlayerGame,
    } = useGame()

    const [previewMovie, setPreviewMovie] = useState<BasicMovie | null>(null)

    const {
      pickerState,
      shakeAnimation,
      handleInputChange,
      handleMovieSelection,
    } = usePickerLogic({
      movies,
      playerGame,
      isInteractionsDisabled,
      updatePlayerGame,
      onGuessMade,
    })

    const animatedInputStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: shakeAnimation.value }],
      }
    })

    const handleLongPressMovie = useCallback((movie: BasicMovie) => {
      hapticsService.light()
      setPreviewMovie(movie)
    }, [])

    const handleClosePreview = useCallback(() => {
      setPreviewMovie(null)
    }, [])

    const handlePreviewSubmit = useCallback(
      (movie: BasicMovie) => {
        handleMovieSelection(movie)
        handleClosePreview()
      },
      [handleMovieSelection, handleClosePreview]
    )

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<BasicMovie>) => (
        <MovieItem
          movie={item}
          isDisabled={isInteractionsDisabled}
          onSelect={handleMovieSelection}
          onLongPress={handleLongPressMovie}
        />
      ),
      [isInteractionsDisabled, handleMovieSelection, handleLongPressMovie]
    )

    if (isDataLoading) {
      return <PickerSkeleton />
    }

    return (
      <>
        <PickerUI
          pickerState={pickerState}
          animatedInputStyle={animatedInputStyle}
          isInteractionsDisabled={isInteractionsDisabled}
          handleInputChange={handleInputChange}
          renderItem={renderItem}
        />
        <PreviewModal
          movie={previewMovie}
          isVisible={!!previewMovie}
          onClose={handleClosePreview}
          onSubmit={handlePreviewSubmit}
        />
      </>
    )
  }
)

export default PickerContainer
