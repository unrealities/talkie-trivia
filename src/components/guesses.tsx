import React, { memo, useMemo } from "react"
import { View } from "react-native"
import { getGuessesStyles } from "../styles/guessesStyles"
import { BasicMovie } from "../models/movie"
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"
import { HintInfo, PlayerGame } from "../models/game"
import { useShallow } from "zustand/react/shallow"
import GuessRow from "./guess/guessRow"
import EmptyGuessTile from "./guess/emptyGuessTile"
import SkeletonRow from "./guess/skeletonRow"

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

    const isDataLoading = gameForDisplay ? false : loading
    const currentGame = gameForDisplay || playerGame
    const movies = allMoviesForDisplay || basicMovies

    const { colors } = useTheme()
    const guessesStyles = useMemo(() => getGuessesStyles(colors), [colors])
    const { guesses, guessesMax, movie } = currentGame
    const correctMovieId = movie.id

    if (isDataLoading) {
      return (
        <View style={guessesStyles.container}>
          {Array.from({ length: guessesMax }).map((_, index) => (
            <SkeletonRow key={index} index={index} />
          ))}
        </View>
      )
    }

    return (
      <View style={guessesStyles.container}>
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

export default GuessesContainer
