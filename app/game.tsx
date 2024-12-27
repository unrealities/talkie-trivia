import React, { useEffect } from "react"
import { View } from "react-native"

import MoviesContainer from "../src/components/movie"
import { appStyles } from "../src/styles/AppStyles"
import { useAppContext } from "../src/contexts/AppContext"

const GameScreen = () => {
  const { state, dispatch } = useAppContext()
  const { isNetworkConnected, basicMovies, player, playerGame, playerStats } =
    state

  // Ensure this function updates the context state
  const updatePlayerGame = (newPlayerGame) => {
    console.log("GameScreen: Dispatching new playerGame:", newPlayerGame)
    dispatch({ type: "SET_PLAYER_GAME", payload: newPlayerGame })
  }

  const updatePlayerStats = (newPlayerStats) => {
    dispatch({ type: "SET_PLAYER_STATS", payload: newPlayerStats })
  }

  useEffect(() => {
    console.log("GameScreen: playerGame:", playerGame)
  }, [playerGame.guesses, playerGame.correctAnswer])

  return (
    <View style={appStyles.container}>
      <MoviesContainer
        isNetworkConnected={isNetworkConnected}
        movies={basicMovies}
        player={player}
        playerGame={playerGame}
        playerStats={playerStats}
        updatePlayerGame={updatePlayerGame} // Pass updatePlayerGame
        updatePlayerStats={updatePlayerStats}
      />
    </View>
  )
}

export default GameScreen
