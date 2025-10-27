import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { ListRenderItemInfo, View, Platform, UIManager } from "react-native"
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { search } from "fast-fuzzy"
import { BasicMovie, Movie } from "../models/movie"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"
import PickerMovieItem from "./pickerMovieItem"
import { hapticsService } from "../utils/hapticsService"
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

  const filterMovies = useCallback(
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
      <PickerMovieItem
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
