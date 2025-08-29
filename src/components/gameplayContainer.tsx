import React, { useMemo } from "react"
import { View } from "react-native"
import CluesContainer from "./clues"
import GameplayView from "./gameplayView"
import GameOverView from "./gameOverView"
import GuessesContainer from "./guesses"
import { getMovieStyles } from "../styles/movieStyles"
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"

const GameplayContainer: React.FC = () => {
  const playerGame = useGameStore((state) => state.playerGame)
  const lastGuessResult = useGameStore((state) => state.lastGuessResult)

  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  const isGameOver =
    playerGame.correctAnswer ||
    playerGame.gaveUp ||
    playerGame.guesses.length >= playerGame.guessesMax

  return (
    <View style={movieStyles.container}>
      {isGameOver ? (
        <GameOverView
          playerGame={playerGame}
          lastGuessResult={lastGuessResult}
        />
      ) : (
        <>
          <CluesContainer />
          <GameplayView />
          <GuessesContainer lastGuessResult={lastGuessResult} />
        </>
      )}
    </View>
  )
}

export default GameplayContainer
