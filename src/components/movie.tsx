import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
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

const MoviesContainer = (props: MovieContainerProps) => {
  const [enableSubmit, setEnableSubmit] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const confettiRef = useRef<ConfettiCannon>(null)

  const setPlayerStats = async (correctAnswer: boolean) => {
    let ps = { ...props.playerStats }

    if (correctAnswer) {
      ps.currentStreak++
      if (ps.currentStreak > ps.maxStreak) {
        ps.maxStreak = ps.currentStreak
      }
      ps.wins[props.playerGame.guesses.length]++
    } else {
      ps.currentStreak = 0
    }

    try {
      await setDoc(
        doc(db, "playerStats", props.player.id).withConverter(
          playerStatsConverter
        ),
        ps
      )
    } catch (e) {
      console.error("Error updating player stats: ", e)
    }
  }

  const setPlayerGame = async (playerGame: PlayerGame) => {
    try {
      await setDoc(
        doc(db, "playerGames", playerGame.id).withConverter(
          playerGameConverter
        ),
        playerGame
      )
    } catch (e) {
      console.error("Error updating player game: ", e)
    }
  }

  useEffect(() => {
    const { guesses, correctAnswer } = props.playerGame

    if (guesses.length > 4 && enableSubmit) {
      setEnableSubmit(false)
      setPlayerStats(false)
      setShowModal(true)
    } else if (correctAnswer && enableSubmit) {
      confettiRef.current?.start()
      setEnableSubmit(false)
      setPlayerStats(true)
      setShowModal(true)
    }
  }, [props.playerGame, enableSubmit])

  useEffect(() => {
    if (props.player.name) {
      setPlayerGame(props.playerGame)
    }
  }, [props.playerGame.id])

  return (
    <View style={movieStyles.container}>
      <NetworkContainer isConnected={props.isNetworkConnected} />
      <TitleHeader />
      <CluesContainer
        correctGuess={props.playerGame.correctAnswer}
        guesses={props.playerGame.guesses}
        summary={props.playerGame.game.movie.overview}
      />
      <PickerContainer
        enableSubmit={enableSubmit}
        playerGame={props.playerGame}
        movies={props.movies}
        updatePlayerGame={props.updatePlayerGame}
      />
      <GuessesContainer
        guesses={props.playerGame.guesses}
        movie={props.playerGame.game.movie}
        movies={props.movies}
      />
      <ResetContainer
        playerGame={props.playerGame}
        updatePlayerGame={props.updatePlayerGame}
      />
      <MovieModal
        movie={props.playerGame.game.movie}
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
