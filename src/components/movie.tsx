import React, { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import ConfettiCannon from "react-native-confetti-cannon"

import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import NetworkContainer from "./network"
import MovieModal from "./modal"
import PickerContainer from "./picker"
import TitleHeader from "./titleHeader"
import { colors } from "../styles/global"
import { movieStyles } from "../styles/movieStyles"
import { batchUpdatePlayerData } from "../utils/firebaseService"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import { useAppContext } from "../contexts/appContext"

interface MoviesContainerProps {
  isNetworkConnected: boolean
  movies: readonly BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  updatePlayerGame: React.Dispatch<React.SetStateAction<PlayerGame>>
  updatePlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>
}

const MoviesContainer: React.FC<MoviesContainerProps> = ({
  isNetworkConnected,
  movies,
  player,
  playerGame,
  playerStats,
  updatePlayerGame,
  updatePlayerStats,
}) => {
  const [enableSubmit, setEnableSubmit] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const confettiRef = useRef<ConfettiCannon>(null)
  const { state } = useAppContext()

  useEffect(() => {
    const updatePlayerData = async (playerGame) => {
      if (!playerGame || Object.keys(playerGame).length === 0) {
        console.log(
          "MoviesContainer useEffect [updatePlayerData]: Skipping update - playerGame is empty"
        )
        return
      }
      if (!state.hasGameStarted) {
        return
      }

      if (
        (playerGame.guesses.length > 4 || playerGame.correctAnswer) &&
        enableSubmit
      ) {
        setEnableSubmit(false)
        const updatedStats = { ...playerStats }

        if (playerGame.correctAnswer) {
          updatedStats.currentStreak++
          updatedStats.maxStreak = Math.max(
            updatedStats.currentStreak,
            updatedStats.maxStreak
          )
          updatedStats.wins[playerGame.guesses.length - 1]++
        } else {
          updatedStats.currentStreak = 0
        }

        try {
          console.log(
            "MoviesContainer useEffect [updatePlayerData]: updating player data"
          )
          const result = await batchUpdatePlayerData(
            updatedStats,
            playerGame,
            player.id
          )
          if (result.success) {
            console.log(
              "MoviesContainer useEffect [updatePlayerData]: updated player data"
            )
            updatePlayerStats(updatedStats)
            setShowModal(true)
            if (playerGame.correctAnswer) confettiRef.current?.start()
          }
        } catch (err) {
          console.error(
            "MoviesContainer useEffect [updatePlayerData]: Error updating player data:",
            err
          )
        }
      } else if (
        playerGame.guesses.length > 0 &&
        playerGame.guesses.length < 5 &&
        !playerGame.correctAnswer
      ) {
        // Update playerGame data
        try {
          console.log(
            "MoviesContainer useEffect [updatePlayerData]: updating player game data"
          )
          const result = await batchUpdatePlayerData(
            {}, // No stats update
            playerGame,
            player.id
          )
          if (result.success) {
            console.log(
              "MoviesContainer useEffect [updatePlayerData]: updated player game data"
            )
          }
        } catch (err) {
          console.error(
            "MoviesContainer useEffect [updatePlayerData]: Error updating player game data:",
            err
          )
        }
      }
    }
    const timeoutId = setTimeout(() => {
      updatePlayerData(playerGame)
    }, 50) // Introduce a 50ms delay

    return () => clearTimeout(timeoutId)
  }, [
    playerGame,
    enableSubmit,
    playerStats,
    player.id,
    state.hasGameStarted,
    updatePlayerStats,
    setShowModal,
  ])

  // Make sure updatePlayerGame is correctly updating the state in GameScreen
  const handleUpdatePlayerGame = (updatedPlayerGame: PlayerGame) => {
    console.log("MoviesContainer: Updating playerGame:", updatedPlayerGame)
    updatePlayerGame(updatedPlayerGame)
  }

  return (
    <View style={movieStyles.container}>
      <NetworkContainer isConnected={isNetworkConnected} />
      <TitleHeader />
      <CluesContainer
        correctGuess={playerGame.correctAnswer}
        guesses={playerGame.guesses}
        summary={playerGame.game.movie.overview}
        playerGame={playerGame}
      />
      <PickerContainer
        enableSubmit={enableSubmit}
        playerGame={playerGame}
        movies={movies}
        updatePlayerGame={handleUpdatePlayerGame}
      />
      <GuessesContainer
        guesses={playerGame.guesses}
        movie={playerGame.game.movie}
        movies={movies}
      />
      <MovieModal
        movie={playerGame.game.movie}
        show={showModal}
        toggleModal={setShowModal}
      />
      <ConfettiCannon
        autoStart={false}
        colors={Object.values(colors)}
        count={250}
        explosionSpeed={500}
        fadeOut={true}
        fallSpeed={2000}
        origin={{ x: 100, y: -20 }}
        ref={confettiRef}
      />
    </View>
  )
}

export default MoviesContainer
