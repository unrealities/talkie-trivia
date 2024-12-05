import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"
import { View } from "react-native"
import ConfettiCannon from "react-native-confetti-cannon"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import NetworkContainer from "./network"
import MovieModal from "./modal"
import PickerContainer from "./picker"
import TitleHeader from "./titleHeader"
import ResetContainer from "./reset"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import { firebaseConfig } from "../config/firebase"
import { colors } from "../styles/global"
import { movieStyles } from "../styles/movieStyles"
import { batchUpdatePlayerData } from "../utils/firebaseService"

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface MovieContainerProps {
  isNetworkConnected: boolean
  movies: BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  updatePlayerGame: Dispatch<SetStateAction<PlayerGame>>
  updatePlayerStats: Dispatch<SetStateAction<PlayerStats>>
}

const MoviesContainer = ({
  isNetworkConnected,
  movies,
  player,
  playerGame,
  playerStats,
  updatePlayerGame,
  updatePlayerStats,
}: MovieContainerProps) => {
  const [enableSubmit, setEnableSubmit] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const confettiRef = useRef<ConfettiCannon>(null)

  useEffect(() => {
    const { guesses, correctAnswer } = playerGame

    if ((guesses.length > 4 || correctAnswer) && enableSubmit) {
      setEnableSubmit(false)
      const updatedStats = { ...playerStats }
      if (correctAnswer) {
        updatedStats.currentStreak++
        updatedStats.maxStreak = Math.max(
          updatedStats.currentStreak,
          updatedStats.maxStreak
        )
        updatedStats.wins[guesses.length - 1]++
      } else {
        updatedStats.currentStreak = 0
      }

      batchUpdatePlayerData(updatedStats, playerGame, player.id).then(() => {
        updatePlayerStats(updatedStats)
        setShowModal(true)
        if (correctAnswer) confettiRef.current?.start()
      })
    }
  }, [playerGame, enableSubmit, playerStats, player.id, updatePlayerStats])

  return (
    <View style={movieStyles.container}>
      <NetworkContainer isConnected={isNetworkConnected} />
      <TitleHeader />
      <CluesContainer
        correctGuess={playerGame.correctAnswer}
        guesses={playerGame.guesses}
        summary={playerGame.game.movie.overview}
      />
      <PickerContainer
        enableSubmit={enableSubmit}
        playerGame={playerGame}
        movies={movies}
        updatePlayerGame={updatePlayerGame}
      />
      <GuessesContainer
        guesses={playerGame.guesses}
        movie={playerGame.game.movie}
        movies={movies}
      />
      <ResetContainer
        playerGame={playerGame}
        updatePlayerGame={updatePlayerGame}
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
