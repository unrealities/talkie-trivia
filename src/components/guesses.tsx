import React, { memo, useMemo, useCallback } from "react"
import { View, ViewStyle } from "react-native"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { BasicMovie } from "../models/movie"
import { useGameStore } from "../state/gameStore"
import { HintInfo, PlayerGame, Guess } from "../models/game"
import { useShallow } from "zustand/react/shallow"
import GuessRow from "./guess/guessRow"
import EmptyGuessTile from "./guess/emptyGuessTile"
import SkeletonRow from "./guess/skeletonRow"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { spacing, responsive } from "../styles/global"

type GuessResult = {
  movieId: number
  correct: boolean
  feedback?: string | null
  hintInfo?: HintInfo[] | null
} | null

interface GuessesContainerProps {
  lastGuessResult: GuessResult
  gameForDisplay?: PlayerGame
  allMoviesForDisplay?: readonly BasicMovie[]
}

type ListItem =
  | { type: "guess"; guess: Guess; index: number }
  | { type: "empty"; index: number }
  | { type: "skeleton"; index: number }

const ESTIMATED_ROW_HEIGHT = responsive.scale(44) + spacing.small // minHeight + marginBottom

const GuessesContainer = memo(
  ({
    lastGuessResult,
    gameForDisplay,
    allMoviesForDisplay,
  }: GuessesContainerProps) => {
    const { loading, playerGame, basicMovies } = useGameStore(
      useShallow((state) => ({
        loading: state.loading,
        playerGame: state.playerGame,
        basicMovies: state.basicMovies,
      }))
    )
    const styles = useStyles(themedStyles)

    const isDataLoading = gameForDisplay ? false : loading
    const currentGame = gameForDisplay || playerGame
    const movies = allMoviesForDisplay || basicMovies

    const { guesses, guessesMax, movie } = currentGame
    const correctMovieId = movie.id

    const listData: ListItem[] = useMemo(() => {
      if (isDataLoading) {
        return Array.from({ length: guessesMax }, (_, index) => ({
          type: "skeleton",
          index,
        }))
      }

      const items: ListItem[] = []
      for (let i = 0; i < guessesMax; i++) {
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
              lastGuessResult.movieId === item.guess.movieId
            return (
              <GuessRow
                index={item.index}
                guess={item.guess}
                movies={movies}
                isLastGuess={isLastGuess}
                lastGuessResult={lastGuessResult}
                correctMovieId={correctMovieId}
              />
            )
          }
          default:
            return null
        }
      },
      [lastGuessResult, guesses.length, movies, correctMovieId]
    )

    const keyExtractor = useCallback(
      (item: ListItem) => item.index.toString(),
      []
    )

    const listContainerHeight = guessesMax * ESTIMATED_ROW_HEIGHT

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
