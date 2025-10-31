import React from "react"
import { View, ViewStyle } from "react-native"
import CluesContainer from "./clues"
import GameplayView from "./gameplayView"
import GameOverView from "./gameOverView"
import GuessesContainer from "./guesses"
import { useGameStore } from "../state/gameStore"
import RevealSequence from "./revealSequence"
import { useStyles, Theme } from "../utils/hooks/useStyles"

const GameplayContainer: React.FC = () => {
  const playerGame = useGameStore((state) => state.playerGame)
  const lastGuessResult = useGameStore((state) => state.lastGuessResult)
  const gameStatus = useGameStore((state) => state.gameStatus)
  const completeRevealSequence = useGameStore(
    (state) => state.completeRevealSequence
  )
  const styles = useStyles(themedStyles)

  const showGameOverView = gameStatus === "gameOver"

  return (
    <View style={styles.container}>
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

interface GameplayContainerStyles {
  container: ViewStyle
}

const themedStyles = (theme: Theme): GameplayContainerStyles => ({
  container: {
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
    maxWidth: theme.responsive.scale(600),
    alignSelf: "center",
    marginBottom: theme.spacing.extraLarge,
    paddingHorizontal: theme.spacing.small,
  },
})

export default GameplayContainer
