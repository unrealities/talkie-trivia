import React, {
  useCallback,
  memo,
  useState,
  useEffect,
  FC,
  useMemo,
} from "react"
import {
  Pressable,
  Text,
  ListRenderItemInfo,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { Image } from "expo-image"
import { BasicMovie } from "../models/movie"
import { getPickerStyles } from "../styles/pickerStyles"
import { usePickerLogic } from "../utils/hooks/usePickerLogic"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"
import { useGame } from "../contexts/gameContext"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"
import { API_CONFIG } from "../config/constants"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface MovieItemProps {
  movie: BasicMovie
  isDisabled: boolean
  isExpanded: boolean
  onSelect: (movie: BasicMovie) => void
  onLongPress: (movie: BasicMovie) => void
}

const MovieItem = memo<MovieItemProps>(
  ({ movie, isDisabled, isExpanded, onSelect, onLongPress }) => {
    const { colors } = useTheme()
    const pickerStyles = useMemo(() => getPickerStyles(colors), [colors])

    useEffect(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }, [isExpanded])

    const releaseYear = movie.release_date
      ? ` (${movie.release_date.toString().substring(0, 4)})`
      : ""
    const titleWithYear = `${movie.title}${releaseYear}`
    const posterUri = movie.poster_path
      ? `${API_CONFIG.TMDB_IMAGE_BASE_URL_W92}${movie.poster_path}`
      : null
    const fullPosterUri = movie.poster_path
      ? `${API_CONFIG.TMDB_IMAGE_BASE_URL_W500}${movie.poster_path}`
      : null

    return (
      <Pressable
        accessible
        accessibilityRole="button"
        aria-label={`Select and guess movie: ${movie.title}. Long press to preview.`}
        onPress={() => onSelect(movie)}
        onLongPress={() => onLongPress(movie)}
        delayLongPress={200}
        style={({ pressed }) => [
          pickerStyles.resultItem,
          pressed && { backgroundColor: colors.surface },
        ]}
        android_ripple={{ color: colors.surface }}
        disabled={isDisabled}
      >
        <View style={pickerStyles.resultItemContent}>
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
        </View>

        {isExpanded && (
          <View style={pickerStyles.expandedPreview}>
            <Image
              source={{ uri: fullPosterUri }}
              placeholder={require("../../assets/movie_default.png")}
              style={pickerStyles.expandedImage}
              contentFit="cover"
            />
            <View style={pickerStyles.expandedInfo}>
              <Text style={pickerStyles.expandedTitle} numberOfLines={3}>
                {movie.title}
              </Text>
              <Text style={pickerStyles.expandedYear}>
                Release Year: {new Date(movie.release_date).getFullYear()}
              </Text>
              <Text style={pickerStyles.expandedHint}>
                Tap this item to select.
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    )
  }
)

interface PickerContainerProps {
  onGuessMade: (result: { movieId: number; correct: boolean }) => void
}

const PickerContainer: FC<PickerContainerProps> = memo(({ onGuessMade }) => {
  const { loading: isDataLoading, isInteractionsDisabled } = useGame()
  const [expandedMovieId, setExpandedMovieId] = useState<number | null>(null)

  const {
    pickerState,
    shakeAnimation,
    stagedGuess,
    handleInputChange,
    handleStageGuess,
    handleConfirmGuess,
    handleClearStagedGuess,
  } = usePickerLogic({
    onGuessMade,
  })

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }],
    }
  })

  const handleLongPressMovie = useCallback((movie: BasicMovie) => {
    hapticsService.medium()
    setExpandedMovieId((prevId) => (prevId === movie.id ? null : movie.id))
  }, [])

  const handleSelectMovie = useCallback(
    (movie: BasicMovie) => {
      setExpandedMovieId(null)
      handleStageGuess(movie)
    },
    [handleStageGuess]
  )

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BasicMovie>) => (
      <MovieItem
        movie={item}
        isDisabled={isInteractionsDisabled}
        isExpanded={expandedMovieId === item.id}
        onSelect={handleSelectMovie}
        onLongPress={handleLongPressMovie}
      />
    ),
    [
      isInteractionsDisabled,
      handleSelectMovie,
      handleLongPressMovie,
      expandedMovieId,
    ]
  )

  if (isDataLoading) {
    return <PickerSkeleton />
  }

  return (
    <PickerUI
      pickerState={pickerState}
      animatedInputStyle={animatedInputStyle}
      isInteractionsDisabled={isInteractionsDisabled}
      stagedGuess={stagedGuess}
      handleInputChange={handleInputChange}
      onConfirmGuess={handleConfirmGuess}
      onClearStagedGuess={handleClearStagedGuess}
      renderItem={renderItem}
    />
  )
})

export default PickerContainer
