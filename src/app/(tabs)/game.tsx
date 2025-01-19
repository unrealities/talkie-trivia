import React, { useEffect } from "react"
import { View, Text } from "react-native" // Import Text
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import MoviesContainer from "../../components/movie"
import { appStyles } from "../../styles/appStyles"
import { useAppContext } from "../../contexts/appContext"
import useNetworkStatus from "../../utils/hooks/useNetworkStatus"

const GameScreen = () => {
  console.log("GameScreen is rendering")
  const { state, dispatch } = useAppContext()
  const {
    isNetworkConnected,
    basicMovies,
    player,
    playerGame,
    playerStats,
    isLoading,
    dataLoadingError,
  } = state

  useNetworkStatus()

  const updatePlayerGame = (newPlayerGame) => {
    console.log("GameScreen: Dispatching new playerGame:", newPlayerGame)
    dispatch({ type: "SET_PLAYER_GAME", payload: newPlayerGame })
  }

  const updatePlayerStats = (newPlayerStats) => {
    dispatch({ type: "SET_PLAYER_STATS", payload: newPlayerStats })
  }

  if (isLoading) {
    console.log("GameScreen: Still loading...")
    return <LoadingIndicator />
  }

  if (dataLoadingError) {
    console.log("GameScreen: Data loading error:", dataLoadingError)
    return <ErrorMessage message={dataLoadingError} />
  }

  console.log("GameScreen: basicMovies.length:", basicMovies.length)
  console.log("GameScreen: playerGame.game.movie:", playerGame.game.movie)

  //Only render when the data is ready:
  if (basicMovies.length > 0 && playerGame.game.movie) {
    console.log("GameScreen: Rendering MoviesContainer")
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
  } else {
    console.log("GameScreen: Still waiting for game data...")
    return <Text>Loading game data...</Text>
  }
}

export default GameScreen
