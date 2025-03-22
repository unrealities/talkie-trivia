import React, { useEffect, useState, useCallback } from "react"
import { View, Pressable, Text, ScrollView } from "react-native"

import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import NetworkContainer from "./network"
import MovieModal from "./modal"
import PickerContainer from "./picker"
import TitleHeader from "./titleHeader"
import { movieStyles } from "../styles/movieStyles"
import { batchUpdatePlayerData } from "../utils/firebaseService"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import { useAppContext } from "../contexts/appContext"
import HintContainer from "./hint"
import ConfettiCelebration from "./confettiCelebration"
import ConfirmationModal from "./confirmationModal"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"

interface MoviesContainerProps {
  isNetworkConnected: boolean
  movies: readonly BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  updatePlayerGame: React.Dispatch<React.SetStateAction<PlayerGame>>
  updatePlayerStats: (updatedPlayerStats: any) => void
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
  const [showModal, setShowModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { state, dispatch } = useAppContext()
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null)
  const [showGiveUpConfirmationDialog, setShowGiveUpConfirmationDialog] =
    useState(false)

  const hintsAvailable = playerStats?.hintsAvailable || 0

  const cancelGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(false)
  }, [setShowGiveUpConfirmationDialog])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(false)

    if (playerGame && !playerGame.correctAnswer) {
      const updatedPlayerGameGiveUp = {
        ...playerGame,
        correctAnswer: false,
        guesses: [...playerGame.guesses, -1],
        gaveUp: true,
      }
      updatePlayerGame(updatedPlayerGameGiveUp)
    }
  }, [playerGame, updatePlayerGame, dispatch])

  const handleGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(true)
  }, [setShowGiveUpConfirmationDialog])

  const updatePlayerData = useCallback(async () => {
    if (!playerGame || Object.keys(playerGame).length === 0) {
      return
    }

    if (
      playerGame.guesses.length >= playerGame.game.guessesMax ||
      playerGame.correctAnswer ||
      playerGame.gaveUp
    ) {
      const updatedStats = { ...playerStats }

      if (!updatedStats.id) {
        console.warn("playerStats.id is undefined! Aborting update.")
        return
      }

      if (playerGame.correctAnswer) {
        updatedStats.currentStreak++
        updatedStats.maxStreak = Math.max(
          updatedStats.currentStreak,
          updatedStats.maxStreak
        )
        updatedStats.wins = updatedStats.wins || [0, 0, 0, 0, 0]
        updatedStats.wins[playerGame.guesses.length - 1]++
      } else {
        updatedStats.currentStreak = 0
      }
      updatedStats.games++

      try {
        const result = await batchUpdatePlayerData(
          updatedStats,
          playerGame,
          player.id,
          { hintsAvailable: updatedStats.hintsAvailable }
        )
        if (result.success) {
          setShowModal(true)
        }
      } catch (error) {
        console.error("Error updating data:", error)
      }
    } else if (playerGame.guesses.length > 0) {
      try {
        await batchUpdatePlayerData({}, playerGame, player.id)
      } catch (err) {
        console.error("updatePlayerData: Error updating player game data:", err)
        dispatch({
          type: "SET_DATA_LOADING_ERROR",
          payload: (err as Error).message,
        })
      }
    }
  }, [playerGame, playerStats, player.id, dispatch])

  useEffect(() => {
    if (initialDataLoaded) {
      updatePlayerData()
    }
  }, [initialDataLoaded, updatePlayerData])

  const handleUpdatePlayerGame = useCallback(
    (updatedPlayerGame: PlayerGame) => {
      updatePlayerGame(updatedPlayerGame)
    },
    [updatePlayerGame]
  )

  const provideGuessFeedback = useCallback((message: string | null) => {
    setGuessFeedback(message)
    if (message) {
      setTimeout(() => setGuessFeedback(null), 2000)
    }
  }, [])

  const isInteractionsDisabled =
    playerGame.correctAnswer ||
    playerGame.guesses.length >= playerGame.game.guessesMax ||
    playerGame.gaveUp

  const handleConfettiStop = useCallback(() => {
    setShowConfetti(false)
  }, [])

  const modalOpacity = useSharedValue(0)

  const animatedModalStyles = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
    }
  })

  useEffect(() => {
    if (showModal) {
      modalOpacity.value = withTiming(1, { duration: 300 })
    } else {
      modalOpacity.value = withTiming(0, { duration: 300 })
    }
  }, [showModal, modalOpacity])

  return (
    <ScrollView
      contentContainerStyle={movieStyles.scrollContentContainer}
      style={{ flex: 1 }}
    >
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
          updatePlayerStats={updatePlayerStats}
        />
        <PickerContainer
          enableSubmit={true}
          playerGame={playerGame}
          movies={movies}
          updatePlayerGame={handleUpdatePlayerGame}
          onGuessFeedback={provideGuessFeedback}
          setShowConfetti={setShowConfetti}
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
          accessibilityHint="Gives up on the current movie."
          accessibilityRole="button"
        >
          <Text style={movieStyles.giveUpButtonText}>Give Up?</Text>
        </Pressable>

        <Animated.View style={[animatedModalStyles]}>
          <MovieModal
            movie={
              playerGame.correctAnswer || playerGame.gaveUp
                ? playerGame.game.movie
                : null
            }
            show={showModal}
            toggleModal={setShowModal}
          />
        </Animated.View>
        <ConfettiCelebration
          startConfetti={showConfetti}
          onConfettiStop={handleConfettiStop}
        />
        <ConfirmationModal
          isVisible={showGiveUpConfirmationDialog}
          title="Give Up?"
          message="Are you sure you want to give up?"
          confirmText="Give Up"
          cancelText="Cancel"
          onConfirm={confirmGiveUp}
          onCancel={cancelGiveUp}
        />
      </View>
    </ScrollView>
  )
}

export default MoviesContainer
