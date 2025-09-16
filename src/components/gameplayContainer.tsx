import React, { useMemo } from "react"
import { View } from "react-native"
import CluesContainer from "./clues"
import GameplayView from "./gameplayView"
import GameOverView from "./gameOverView"
import GuessesContainer from "./guesses"
import { getMovieStyles } from "../styles/movieStyles"
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"
import RevealSequence from "./revealSequence"

const GameplayContainer: React.FC = () => {
  const playerGame = useGameStore((state) => state.playerGame)
  const lastGuessResult = useGameStore((state) => state.lastGuessResult)
  const gameStatus = useGameStore((state) => state.gameStatus)
  const completeRevealSequence = useGameStore(
    (state) => state.completeRevealSequence
  )

  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  const showGameOverView = gameStatus === "gameOver"

  return (
    <View style={movieStyles.container}>
      {showGameOverView ? (
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

      {gameStatus === "revealing" && (
        <RevealSequence onAnimationComplete={completeRevealSequence} />
      )}
    </View>
  )
}

export default GameplayContainer
