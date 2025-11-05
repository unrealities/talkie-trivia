import React, { memo, useMemo, useCallback } from "react"
import { View, ViewStyle } from "react-native"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { BasicTriviaItem } from "../models/trivia" // Changed
import { useGameStore } from "../state/gameStore"
import { HintInfo, PlayerGame, Guess } from "../models/game"
import { useShallow } from "zustand/react/shallow"
import GuessRow from "./guess/guessRow"
import EmptyGuessTile from "./guess/emptyGuessTile"
import SkeletonRow from "./guess/skeletonRow"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { spacing, responsive } from "../styles/global"

type GuessResult = {
  itemId: number | string
  correct: boolean
  feedback?: string | null
  hintInfo?: HintInfo[] | null
} | null

interface GuessesContainerProps {
  lastGuessResult: GuessResult
  gameForDisplay?: PlayerGame
  allMoviesForDisplay?: readonly BasicTriviaItem[]
}

type ListItem =
  | { type: "guess"; guess: Guess; index: number }
  | { type: "empty"; index: number }
  | { type: "skeleton"; index: number }

const ESTIMATED_ROW_HEIGHT = responsive.scale(44) + spacing.small

const GuessesContainer = memo(
  ({
    lastGuessResult,
    gameForDisplay,
    allMoviesForDisplay,
  }: GuessesContainerProps) => {
    const { loading, playerGame, basicItems } = useGameStore(
      useShallow((state) => ({
        loading: state.loading,
        playerGame: state.playerGame,
        basicItems: state.basicItems,
      }))
    )
    const styles = useStyles(themedStyles)

    const isDataLoading = gameForDisplay ? false : loading
    const currentGame = gameForDisplay || playerGame
    const items = allMoviesForDisplay || basicItems

    const { guesses, guessesMax, triviaItem } = currentGame
    const correctItemId = triviaItem?.id ?? 0 // Fallback to 0 if triviaItem is not yet loaded

    const listData: ListItem[] = useMemo(() => {
      const max = guessesMax || 5 // Fallback for initial render
      if (isDataLoading) {
        return Array.from({ length: max }, (_, index) => ({
          type: "skeleton",
          index,
        }))
      }

      const items: ListItem[] = []
      for (let i = 0; i < max; i++) {
        if (guesses[i]) {
          items.push({ type: "guess", guess: guesses[i], index: i })
        } else {
          items.push({ type: "empty", index: i })
        }
      }
      return items
    }, [isDataLoading, guesses, guessesMax])

    const renderListItem = useCallback(
      ({ item }: ListRenderItemInfo<ListItem>) => {
        switch (item.type) {
          case "skeleton":
            return <SkeletonRow index={item.index} />
          case "empty":
            return <EmptyGuessTile index={item.index} />
          case "guess": {
            const isLastGuess =
              !!lastGuessResult &&
              item.index === guesses.length - 1 &&
              lastGuessResult.itemId === item.guess.itemId
            return (
              <GuessRow
                index={item.index}
                guess={item.guess}
                basicItems={items}
                isLastGuess={isLastGuess}
                lastGuessResult={lastGuessResult}
                correctItemId={correctItemId}
              />
            )
          }
          default:
            return null
        }
      },
      [lastGuessResult, guesses.length, items, correctItemId]
    )

    const keyExtractor = useCallback(
      (item: ListItem) => item.index.toString(),
      []
    )

    const listContainerHeight = (guessesMax || 5) * ESTIMATED_ROW_HEIGHT

    return (
      <View style={[styles.listWrapper, { height: listContainerHeight }]}>
        <FlashList
          data={listData}
          renderItem={renderListItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATED_ROW_HEIGHT}
          contentContainerStyle={styles.container}
          scrollEnabled={false}
        />
      </View>
    )
  }
)

interface GuessesContainerStyles {
  listWrapper: ViewStyle
  container: ViewStyle
}

const themedStyles = (theme: Theme): GuessesContainerStyles => ({
  listWrapper: {
    width: "100%",
  },
  container: {
    paddingVertical: theme.spacing.small,
  },
})

export default GuessesContainer
