import React, { useEffect } from "react"
import { View } from "react-native"

import MoviesContainer from "../../components/movie"
import { appStyles } from "../../styles/appStyles"
import { useAppContext } from "../../contexts/appContext"
import useNetworkStatus from "../../utils/hooks/useNetworkStatus"

const GameScreen = () => {
  console.log("GameScreen is rendering")
  const { state, dispatch } = useAppContext()
  const { isNetworkConnected, basicMovies, player, playerGame, playerStats } =
    state

  useNetworkStatus()

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
        updatePlayerGame={updatePlayerGame}
        updatePlayerStats={updatePlayerStats}
      />
    </View>
  )
}

export default GameScreen
