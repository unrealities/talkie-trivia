import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
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
import { BasicMovie, Movie } from "../models/movie"
import { getPickerStyles } from "../styles/pickerStyles"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"
import { API_CONFIG } from "../config/constants"
import { useGameStore } from "../state/gameStore"
import TutorialTooltip from "./tutorialTooltip"
import { useShallow } from "zustand/react/shallow"
import { normalizeSearchString } from "../utils/stringUtils"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface MovieItemProps {
  movie: BasicMovie
  detailedMovie: Movie | null
  isDisabled: boolean
  isExpanded: boolean
  onSelect: (movie: BasicMovie) => void
  onLongPress: (movie: BasicMovie) => void
}

const MovieItem = memo<MovieItemProps>(
  ({ movie, detailedMovie, isDisabled, isExpanded, onSelect, onLongPress }) => {
    const { colors } = useTheme()
    const pickerStyles = useMemo(() => getPickerStyles(colors), [colors])
    const defaultPoster = require("../../assets/movie_default.png")

    useEffect(() => {
      if (Platform.OS !== "web") {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      }
    }, [isExpanded])

    const releaseYear = movie.release_date
      ? ` (${movie.release_date.toString().substring(0, 4)})`
      : ""
    const titleWithYear = `${movie.title}${releaseYear}`

    const imageSource = movie.poster_path
      ? { uri: `${API_CONFIG.TMDB_IMAGE_BASE_URL_W92}${movie.poster_path}` }
      : defaultPoster

    const fullImageSource = movie.poster_path
      ? { uri: `${API_CONFIG.TMDB_IMAGE_BASE_URL_W500}${movie.poster_path}` }
      : defaultPoster

    return (
      <View style={pickerStyles.resultItemContainer}>
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
              source={imageSource}
              placeholder={defaultPoster}
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

          {isExpanded && detailedMovie && (
            <View style={pickerStyles.expandedPreview}>
              <Image
                source={fullImageSource}
                placeholder={defaultPoster}
                style={pickerStyles.expandedImage}
                contentFit="cover"
              />
              <View style={pickerStyles.expandedInfo}>
                <Text style={pickerStyles.expandedTitle} numberOfLines={3}>
                  {detailedMovie.title}
                </Text>
                <Text style={pickerStyles.expandedYear}>
                  Release Year:{" "}
                  {new Date(detailedMovie.release_date).getFullYear()}
                </Text>
                <Text style={pickerStyles.expandedHint}>
                  Tap this item to select.
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    )
  },
  (prevProps, nextProps) =>
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.detailedMovie === nextProps.detailedMovie
)

const PickerContainer: FC = memo(() => {
  const {
    isInteractionsDisabled,
    basicMovies,
    allFullMovies,
    makeGuess,
    loading,
    tutorialState,
    dismissGuessInputTip,
    dismissResultsTip,
  } = useGameStore(
    useShallow((state) => ({
      isInteractionsDisabled: state.isInteractionsDisabled,
      basicMovies: state.basicMovies,
      allFullMovies: state.movies,
      makeGuess: state.makeGuess,
      loading: state.loading,
      tutorialState: state.tutorialState,
      dismissGuessInputTip: state.dismissGuessInputTip,
      dismissResultsTip: state.dismissResultsTip,
    }))
  )

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<readonly BasicMovie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [expandedMovieId, setExpandedMovieId] = useState<number | null>(null)
  const [detailedMovie, setDetailedMovie] = useState<Movie | null>(null)

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shakeAnimation = useSharedValue(0)

  const triggerShake = useCallback(() => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 })
    )
  }, [shakeAnimation])

  const filterMovies = useMemo(
    () =>
      (searchTerm: string): BasicMovie[] => {
        const trimmedTerm = searchTerm.trim()
        if (trimmedTerm.length < 2) return []

        const normalizedSearchTerm = normalizeSearchString(trimmedTerm)

        return search(normalizedSearchTerm, [...basicMovies], {
          keySelector: (movie) => normalizeSearchString(movie.title),
          threshold: 0.8,
        }) as BasicMovie[]
      },
    [basicMovies]
  )

  const handleInputChange = useCallback(
    (text: string) => {
      if (isInteractionsDisabled) return

      setQuery(text)
      setExpandedMovieId(null)
      setDetailedMovie(null)

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      const trimmedText = text.trim()
      if (trimmedText.length < 2) {
        setResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)

      searchTimeoutRef.current = setTimeout(() => {
        const filtered = filterMovies(trimmedText)

        if (filtered.length > 0) {
          hapticsService.light()
        } else if (trimmedText.length > 2) {
          triggerShake()
        }

        setResults(filtered)
        setIsSearching(false)
      }, 300) // 300ms debounce
    },
    [isInteractionsDisabled, filterMovies, triggerShake]
  )

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }))

  const handleLongPressMovie = useCallback(
    (movie: BasicMovie) => {
      hapticsService.medium()
      const newId = expandedMovieId === movie.id ? null : movie.id
      setExpandedMovieId(newId)

      if (newId) {
        const fullMovie = allFullMovies.find((m) => m.id === newId)
        setDetailedMovie(fullMovie || null)
      } else {
        setDetailedMovie(null)
      }
    },
    [expandedMovieId, allFullMovies]
  )

  const handleSelectMovie = useCallback(
    (movie: BasicMovie) => {
      setExpandedMovieId(null)
      setDetailedMovie(null)
      makeGuess(movie)
      handleInputChange("")
    },
    [makeGuess, handleInputChange]
  )

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BasicMovie>) => (
      <MovieItem
        movie={item}
        detailedMovie={detailedMovie}
        isDisabled={isInteractionsDisabled}
        isExpanded={expandedMovieId === item.id}
        onSelect={handleSelectMovie}
        onLongPress={handleLongPressMovie}
      />
    ),
    [
      isInteractionsDisabled,
      expandedMovieId,
      detailedMovie,
      handleSelectMovie,
      handleLongPressMovie,
    ]
  )

  const showResults = query.length >= 2 || isSearching
  const showResultsTip = results.length > 0 && tutorialState.showResultsTip

  if (loading) {
    return <PickerSkeleton />
  }

  return (
    <View style={{ width: "100%", zIndex: 10 }}>
      <PickerUI
        query={query}
        isSearching={isSearching}
        results={results}
        showResults={showResults}
        animatedInputStyle={animatedInputStyle}
        isInteractionsDisabled={isInteractionsDisabled}
        handleInputChange={handleInputChange}
        renderItem={renderItem}
      />
      <TutorialTooltip
        isVisible={tutorialState.showGuessInputTip}
        text="Type here to search for the movie title you think it is."
        onDismiss={dismissGuessInputTip}
        style={{ top: -75 }}
      />
      <TutorialTooltip
        isVisible={showResultsTip}
        text="Pro Tip: Long-press any result to see a preview before you guess!"
        onDismiss={dismissResultsTip}
        style={{ top: 60 }}
      />
    </View>
  )
})

export default PickerContainer
