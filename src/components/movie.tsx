import React, { useEffect, useRef, useState, useCallback } from "react"
import { View, Alert, Pressable, Text } from "react-native"
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
import HintContainer from "./hint"

interface MoviesContainerProps {
  isNetworkConnected: boolean
  movies: readonly BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  updatePlayerGame: React.Dispatch<React.SetStateAction<PlayerGame>>
  updatePlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>
  initialDataLoaded: boolean
}

const MoviesContainer: React.FC<MoviesContainerProps> = ({
  isNetworkConnected,
  movies,
  player,
  playerGame,
  playerStats,
  updatePlayerGame,
  updatePlayerStats,
  initialDataLoaded,
}) => {
  const [enableSubmit, setEnableSubmit] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const confettiRef = useRef<ConfettiCannon>(null)
  const { state, dispatch } = useAppContext()
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null)
  const [showGiveUpConfirmation, setShowGiveUpConfirmation] = useState(false)

  const hintsAvailable = playerStats?.hintsAvailable || 0

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
        (playerGame.guesses.length > 4 ||
          playerGame.correctAnswer ||
          playerGame.gaveUp) &&
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
          updatedStats.games++
        } else if (!playerGame.gaveUp) {
          updatedStats.currentStreak = 0
          updatedStats.games++
        }

        try {
          console.log(
            "MoviesContainer useEffect [updatePlayerData]: updating player data"
          )
          const result = await batchUpdatePlayerData(
            updatedStats,
            playerGame,
            player.id,
            { hintsAvailable: updatedStats.hintsAvailable }
          )

          if (result.success) {
            console.log(
              "MoviesContainer useEffect [updatePlayerData]: updated player data"
            )
            updatePlayerStats(updatedStats)
            console.log("setShowModal called with:", true)
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
        try {
          console.log(
            "MoviesContainer useEffect [updatePlayerData]: updating player game data"
          )
          const result = await batchUpdatePlayerData({}, playerGame, player.id)
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
    updatePlayerData(playerGame)
  }, [
    playerGame,
    enableSubmit,
    playerStats,
    player.id,
    state.hasGameStarted,
    updatePlayerStats,
    setShowModal,
    initialDataLoaded,
  ])

  const handleUpdatePlayerGame = (updatedPlayerGame: PlayerGame) => {
    console.log("MoviesContainer: Updating playerGame:", updatedPlayerGame)
    updatePlayerGame(updatedPlayerGame)
  }
  const handleGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(true)
  }, [setShowGiveUpConfirmation])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false)

    if (playerGame && !playerGame.correctAnswer) {
      const updatedPlayerGameGiveUp = {
        ...playerGame,
        correctAnswer: false,
        guesses: [...playerGame.guesses, -1],
        gaveUp: true,
      }

      updatePlayerGame(updatedPlayerGameGiveUp)
    }
  }, [playerGame, updatePlayerGame, setShowGiveUpConfirmation])

  const cancelGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false)
  }, [setShowGiveUpConfirmation])

  const provideGuessFeedback = useCallback(
    (message: string | null) => {
      setGuessFeedback(message)
      if (message) {
        setTimeout(() => {
          setGuessFeedback(null)
        }, 2000)
      }
    },
    [setGuessFeedback]
  )

  const isInteractionsDisabled =
    playerGame.correctAnswer ||
    playerGame.guesses.length >= playerGame.game.guessesMax ||
    playerGame.gaveUp

  console.log("showModal state:", showModal)
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
      <HintContainer
        playerGame={playerGame}
        updatePlayerGame={handleUpdatePlayerGame}
        isInteractionsDisabled={isInteractionsDisabled}
        hintsAvailable={hintsAvailable}
      />
      {/* PickerContainer should be BEFORE GuessesContainer */}
      <PickerContainer
        enableSubmit={enableSubmit}
        playerGame={playerGame}
        movies={movies}
        updatePlayerGame={handleUpdatePlayerGame}
        onGuessFeedback={provideGuessFeedback}
      />
      {guessFeedback && (
        <View style={movieStyles.feedbackContainer}>
          <Text style={movieStyles.feedbackText}>{guessFeedback}</Text>
        </View>
      )}
      <GuessesContainer
        guesses={playerGame.guesses}
        movie={playerGame.game.movie}
        movies={movies}
      />
      {/* Place Give Up button AFTER GuessesContainer in the natural flow of elements */}
      <Pressable
        onPress={handleGiveUp}
        style={({ pressed }) => [
          movieStyles.giveUpButton,
          isInteractionsDisabled && movieStyles.disabledButton,
          pressed && movieStyles.pressedButton,
        ]}
        disabled={isInteractionsDisabled}
        accessible={true}
        accessibilityLabel="Give Up"
        accessibilityHint="Gives up on the current movie and reveals the answer."
        accessibilityRole="button"
      >
        <Text style={movieStyles.giveUpButtonText}>Give Up?</Text>
      </Pressable>

      {showGiveUpConfirmation &&
        Alert.alert(
          "Give Up?",
          "Are you sure you want to give up on this movie?",
          [
            {
              text: "Cancel",
              onPress: cancelGiveUp,
              style: "cancel",
            },
            { text: "Give Up", onPress: confirmGiveUp },
          ],
          { cancelable: false }
        )}
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
