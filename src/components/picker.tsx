import React, { useCallback, memo, useState, useEffect } from "react"
import { Pressable, Text, ListRenderItemInfo } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
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

    return (
      <Pressable
        accessible
        accessibilityRole="button"
        aria-label={`Select and guess movie: ${movie.title}`}
        onPress={() => onSelect(movie)}
        onLongPress={() => onLongPress(movie)}
        delayLongPress={200}
        style={({ pressed }) => [
          pickerStyles.pressableText,
          pressed && { backgroundColor: colors.quinary },
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
    const [hintShownThisGame, setHintShownThisGame] = useState(false)
    const [showPreviewHint, setShowPreviewHint] = useState(false)

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

    useEffect(() => {
      setHintShownThisGame(false)
    }, [playerGame.id])

    useEffect(() => {
      if (
        pickerState.status === "results" &&
        !hintShownThisGame &&
        pickerState.results.length > 0
      ) {
        setShowPreviewHint(true)
        setHintShownThisGame(true)

        const timer = setTimeout(() => {
          setShowPreviewHint(false)
        }, 4000)

        return () => clearTimeout(timer)
      }
    }, [pickerState.status, pickerState.results, hintShownThisGame])

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
          showPreviewHint={showPreviewHint}
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
