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

interface MoviesContainerProps {
  isNetworkConnected: boolean
  movies: BasicMovie[]
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
  const confettiRef = useRef(null)

  useEffect(() => {
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

      batchUpdatePlayerData(updatedStats, playerGame, player.id)
        .then(() => {
          updatePlayerStats(updatedStats)
          setShowModal(true)
          if (playerGame.correctAnswer) confettiRef.current?.start()
        })
        .catch((err) => console.error("Error updating player data:", err))
    }
  }, [playerGame, enableSubmit, playerStats, player.id, updatePlayerStats])

  const handleUpdatePlayerGame = (updatedPlayerGame: PlayerGame) => {
    if (
      !updatedPlayerGame.correctAnswer &&
      updatedPlayerGame.guesses.length <= 5
    ) {
      updatePlayerGame(updatedPlayerGame)
    }
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
