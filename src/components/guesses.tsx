import React, { memo } from "react"
import { View, ViewStyle } from "react-native"
import { BasicMovie } from "../models/movie"
import { useGameStore } from "../state/gameStore"
import { HintInfo, PlayerGame } from "../models/game"
import { useShallow } from "zustand/react/shallow"
import GuessRow from "./guess/guessRow"
import EmptyGuessTile from "./guess/emptyGuessTile"
import SkeletonRow from "./guess/skeletonRow"
import { useStyles, Theme } from "../utils/hooks/useStyles"

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

    if (isDataLoading) {
      return (
        <View style={styles.container}>
          {Array.from({ length: guessesMax }).map((_, index) => (
            <SkeletonRow key={index} index={index} />
          ))}
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {Array.from({ length: guessesMax }).map((_, index) => {
          const guess = guesses[index]

          if (!guess) {
            return <EmptyGuessTile key={index} index={index} />
          }

          const isLastGuess =
            !!lastGuessResult &&
            index === guesses.length - 1 &&
            lastGuessResult.movieId === guess.movieId

          return (
            <GuessRow
              key={`${guess.movieId}-${index}`}
              index={index}
              guess={guess}
              movies={movies}
              isLastGuess={isLastGuess}
              lastGuessResult={lastGuessResult}
              correctMovieId={correctMovieId}
            />
          )
        })}
      </View>
    )
  }
)

interface GuessesContainerStyles {
  container: ViewStyle
}

const themedStyles = (theme: Theme): GuessesContainerStyles => ({
  container: {
    width: "100%",
    paddingVertical: theme.spacing.small,
  },
})

export default GuessesContainer
