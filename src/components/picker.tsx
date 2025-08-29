import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  ListRenderItemInfo,
  Pressable,
  Text,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { Image } from "expo-image"
import { search } from "fast-fuzzy"
import { BasicMovie } from "../models/movie"
import { getPickerStyles } from "../styles/pickerStyles"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"
import { API_CONFIG } from "../config/constants"
import { useGameStore } from "../state/gameStore"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type PickerState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: string; results: readonly BasicMovie[] }

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

const PickerContainer: FC = memo(() => {
  const { isInteractionsDisabled, basicMovies, makeGuess, loading } =
    useGameStore((state) => ({
      isInteractionsDisabled: state.isInteractionsDisabled,
      basicMovies: state.basicMovies,
      makeGuess: state.makeGuess,
      loading: state.loading,
    }))

  const [expandedMovieId, setExpandedMovieId] = useState<number | null>(null)
  const [pickerState, setPickerState] = useState<PickerState>({
    status: "idle",
  })
  const shakeAnimation = useSharedValue(0)

  const triggerShake = () => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 })
    )
  }

  const filterMovies = useCallback(
    (searchTerm: string): BasicMovie[] => {
      const trimmedTerm = searchTerm.trim()
      if (trimmedTerm.length < 2) return []
      return search(trimmedTerm, [...basicMovies], {
        keySelector: (movie) => movie.title,
        threshold: 0.8,
      }) as BasicMovie[]
    },
    [basicMovies]
  )

  const handleInputChange = useCallback(
    (text: string) => {
      if (isInteractionsDisabled) return
      if (text === "") {
        setPickerState({ status: "idle" })
      } else {
        setPickerState({ status: "searching", query: text })
      }
    },
    [isInteractionsDisabled]
  )

  useEffect(() => {
    if (pickerState.status !== "searching") return
    const handler = setTimeout(() => {
      const filtered = filterMovies(pickerState.query)
      if (filtered.length > 0) hapticsService.light()
      else if (pickerState.query.length > 2) triggerShake()
      setPickerState({
        status: "results",
        query: pickerState.query,
        results: filtered,
      })
    }, 300)
    return () => clearTimeout(handler)
  }, [pickerState, filterMovies])

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }))

  const handleLongPressMovie = useCallback((movie: BasicMovie) => {
    hapticsService.medium()
    setExpandedMovieId((prevId) => (prevId === movie.id ? null : movie.id))
  }, [])

  const handleSelectMovie = useCallback(
    (movie: BasicMovie) => {
      setExpandedMovieId(null)
      makeGuess(movie)
      handleInputChange("") // Clear input after guess
    },
    [makeGuess, handleInputChange]
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
      expandedMovieId,
      handleSelectMovie,
      handleLongPressMovie,
    ]
  )

  if (loading) {
    return <PickerSkeleton />
  }

  return (
    <PickerUI
      pickerState={pickerState}
      animatedInputStyle={animatedInputStyle}
      isInteractionsDisabled={isInteractionsDisabled}
      handleInputChange={handleInputChange}
      renderItem={renderItem}
    />
  )
})

export default PickerContainer
