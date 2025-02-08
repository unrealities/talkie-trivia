import React, { useEffect, useRef, useState, useCallback } from "react"
import { View, Alert, Pressable, Text } from "react-native" // Added Pressable and Text
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
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null) // State for guess feedback message
  const [showGiveUpConfirmation, setShowGiveUpConfirmation] = useState(false) // State for "Give Up" confirmation

  const hintsAvailable = playerStats?.hintsAvailable || 0 // Get hintsAvailable from playerStats

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
          playerGame.gaveUp) && //Include gaveUp state
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
          updatedStats.games++ // Increment games played on win
        } else if (!playerGame.gaveUp) {
          // Only increment games if not gave up and lost
          updatedStats.currentStreak = 0
          updatedStats.games++ // Increment games played on loss (not gave up)
        }

        try {
          console.log(
            "MoviesContainer useEffect [updatePlayerData]: updating player data"
          )
          const result = await batchUpdatePlayerData(
            updatedStats,
            playerGame,
            player.id,
            { hintsAvailable: updatedStats.hintsAvailable } // Pass hintsAvailable to be saved in player doc
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

  // Make sure updatePlayerGame is correctly updating the state in GameScreen
  const handleUpdatePlayerGame = (updatedPlayerGame: PlayerGame) => {
    console.log("MoviesContainer: Updating playerGame:", updatedPlayerGame)
    updatePlayerGame(updatedPlayerGame)
  }
  const handleGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(true) // Show confirmation alert
  }, [setShowGiveUpConfirmation])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false) // Hide confirmation alert

    if (playerGame && !playerGame.correctAnswer) {
      const updatedPlayerGameGiveUp = {
        ...playerGame,
        correctAnswer: false, // Explicitly set to false to ensure modal shows lose state
        guesses: [...playerGame.guesses, -1], // Add a dummy guess to proceed to game end state
        gaveUp: true, // Set gaveUp to true
      }

      updatePlayerGame(updatedPlayerGameGiveUp) // Update game state to trigger end game and modal

      // No need to update playerStats here for "gave up" specifically, stats update already handles loss in the useEffect
    }
  }, [playerGame, updatePlayerGame, setShowGiveUpConfirmation])

  const cancelGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false) // Just close the confirmation, no further action
  }, [setShowGiveUpConfirmation])

  const provideGuessFeedback = useCallback(
    (message: string | null) => {
      setGuessFeedback(message)
      if (message) {
        setTimeout(() => {
          setGuessFeedback(null)
        }, 2000) // Clear feedback message after 2 seconds
      }
    },
    [setGuessFeedback]
  )

  const isInteractionsDisabled =
    playerGame.correctAnswer ||
    playerGame.guesses.length >= playerGame.game.guessesMax ||
    playerGame.gaveUp //Include gaveUp state to disable interaction after giving up

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
        hintsAvailable={hintsAvailable} // Pass hintsAvailable to HintContainer
      />
      <PickerContainer
        enableSubmit={enableSubmit}
        playerGame={playerGame}
        movies={movies}
        updatePlayerGame={handleUpdatePlayerGame}
        onGuessFeedback={provideGuessFeedback} // Pass the feedback function
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
