import React, { useEffect} from "react"
import { View } from "react-native"

import MoviesContainer from "../components/movie"
import { appStyles } from "../styles/AppStyles"
import { useAppContext } from "../contexts/AppContext"

const GameScreen = () => {
  const { state, dispatch } = useAppContext()
  const { isNetworkConnected, basicMovies, player, playerGame, playerStats } =
    state

  const updatePlayerGame = (newPlayerGame) => {
    dispatch({ type: "SET_PLAYER_GAME", payload: newPlayerGame })
  }

  const updatePlayerStats = (newPlayerStats) => {
    dispatch({ type: "SET_PLAYER_STATS", payload: newPlayerStats })
  }

  useEffect(() => {
    console.log("GameScreen: playerGame:", playerGame)
  }, [playerGame])

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
