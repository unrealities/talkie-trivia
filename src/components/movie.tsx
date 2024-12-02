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
import { doc, getFirestore, setDoc } from "firebase/firestore"

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
import { playerStatsConverter } from "../utils/firestore/converters/playerStats"
import { playerGameConverter } from "../utils/firestore/converters/playerGame"
import { colors } from "../styles/global"
import { movieStyles } from "../styles/movieStyles"

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface MovieContainerProps {
  isNetworkConnected: boolean
  movies: BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  updatePlayerGame: Dispatch<SetStateAction<PlayerGame>>
}

const MoviesContainer = ({
  isNetworkConnected,
  movies,
  player,
  playerGame,
  playerStats,
  updatePlayerGame,
}: MovieContainerProps) => {
  const [enableSubmit, setEnableSubmit] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const confettiRef = useRef<ConfettiCannon>(null)

  const updatePlayerStatsInFirestore = useCallback(
    async (correctAnswer: boolean) => {
      const updatedStats = { ...playerStats }

      if (correctAnswer) {
        updatedStats.currentStreak++
        updatedStats.maxStreak = Math.max(
          updatedStats.currentStreak,
          updatedStats.maxStreak
        )
        updatedStats.wins[playerGame.guesses.length]++
      } else {
        updatedStats.currentStreak = 0
      }

      try {
        await setDoc(
          doc(db, "playerStats", player.id).withConverter(playerStatsConverter),
          updatedStats
        )
        return updatedStats
      } catch (e) {
        console.error("Error updating player stats: ", e)
        return playerStats
      }
    },
    [player.id, playerGame.guesses.length, playerStats]
  )

  const updatePlayerGameInFirestore = useCallback(async (game: PlayerGame) => {
    try {
      await setDoc(
        doc(db, "playerGames", game.id).withConverter(playerGameConverter),
        game
      )
    } catch (e) {
      console.error("Error updating player game: ", e)
    }
  }, [])

  useEffect(() => {
    const { guesses, correctAnswer } = playerGame

    if (guesses.length > 4 && enableSubmit) {
      setEnableSubmit(false)
      updatePlayerStatsInFirestore(false)
      setShowModal(true)
    } else if (correctAnswer && enableSubmit) {
      confettiRef.current?.start()
      setEnableSubmit(false)
      updatePlayerStatsInFirestore(true)
      setShowModal(true)
    }
  }, [playerGame, enableSubmit, updatePlayerStatsInFirestore])

  useEffect(() => {
    if (player.name) {
      updatePlayerGameInFirestore(playerGame)
    }
  }, [playerGame.id, player.name, updatePlayerGameInFirestore])

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
