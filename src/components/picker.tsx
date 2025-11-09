import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { View, Platform, UIManager } from "react-native"
import { ListRenderItemInfo } from "@shopify/flash-list"
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { search } from "fast-fuzzy"
import { BasicTriviaItem, TriviaItem } from "../models/trivia"
import { PickerUI } from "./pickerUI"
import PickerSkeleton from "./pickerSkeleton"
import PickerItem from "./pickerItem"
import { hapticsService } from "../utils/hapticsService"
import { useGameStore } from "../state/gameStore"
import TutorialTooltip from "./tutorialTooltip"
import { useShallow } from "zustand/react/shallow"
import { normalizeSearchString } from "../utils/stringUtils"
import { GAME_MODE_CONFIG } from "../config/difficulty"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const PickerContainer: FC = memo(() => {
  const {
    isInteractionsDisabled,
    basicItems,
    fullItems,
    makeGuess,
    loading,
    tutorialState,
    dismissGuessInputTip,
    dismissResultsTip,
    gameMode,
  } = useGameStore(
    useShallow((state) => ({
      isInteractionsDisabled: state.isInteractionsDisabled,
      basicItems: state.basicItems,
      fullItems: state.fullItems,
      makeGuess: state.makeGuess,
      loading: state.loading,
      tutorialState: state.tutorialState,
      dismissGuessInputTip: state.dismissGuessInputTip,
      dismissResultsTip: state.dismissResultsTip,
      gameMode: state.gameMode,
    }))
  )

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<readonly BasicTriviaItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [expandedItemId, setExpandedItemId] = useState<number | string | null>(
    null
  )
  const [detailedItem, setDetailedItem] = useState<TriviaItem | null>(null)

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shakeAnimation = useSharedValue(0)

  const triggerShake = useCallback(() => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 })
    )
  }, [shakeAnimation])

  const filterItems = useCallback(
    (searchTerm: string): BasicTriviaItem[] => {
      const trimmedTerm = searchTerm.trim()
      if (trimmedTerm.length < 2) return []

      const normalizedSearchTerm = normalizeSearchString(trimmedTerm)

      return search(normalizedSearchTerm, [...basicItems], {
        keySelector: (item) => normalizeSearchString(item.title),
        threshold: 0.8,
      }) as BasicTriviaItem[]
    },
    [basicItems]
  )

  const handleInputChange = useCallback(
    (text: string) => {
      if (isInteractionsDisabled) return

      setQuery(text)
      setExpandedItemId(null)
      setDetailedItem(null)

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
        const filtered = filterItems(trimmedText)

        if (filtered.length > 0) {
          hapticsService.light()
        } else if (trimmedText.length > 2) {
          triggerShake()
        }

        setResults(filtered)
        setIsSearching(false)
      }, 300)
    },
    [isInteractionsDisabled, filterItems, triggerShake]
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

  const handleLongPressItem = useCallback(
    (item: BasicTriviaItem) => {
      hapticsService.medium()
      const newId = expandedItemId === item.id ? null : item.id
      setExpandedItemId(newId)

      if (newId) {
        const fullItem = fullItems.find((m) => m.id === newId)
        setDetailedItem(fullItem || null)
      } else {
        setDetailedItem(null)
      }
    },
    [expandedItemId, fullItems]
  )

  const handleSelectItem = useCallback(
    (item: BasicTriviaItem) => {
      setExpandedItemId(null)
      setDetailedItem(null)
      makeGuess(item)
      handleInputChange("")
    },
    [makeGuess, handleInputChange]
  )

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BasicTriviaItem>) => (
      <PickerItem
        item={item}
        detailedItem={detailedItem}
        isDisabled={isInteractionsDisabled}
        isExpanded={expandedItemId === item.id}
        onSelect={handleSelectItem}
        onLongPress={handleLongPressItem}
      />
    ),
    [
      isInteractionsDisabled,
      expandedItemId,
      detailedItem,
      handleSelectItem,
      handleLongPressItem,
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
        placeholder={GAME_MODE_CONFIG[gameMode].searchPlaceholder}
      />
      <TutorialTooltip
        isVisible={tutorialState.showGuessInputTip}
        text="Type here to search for the title you think it is."
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
