import React, { useEffect, useRef, useState, useCallback } from "react"
import { View, Pressable, Text, ScrollView } from "react-native"

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
import ConfettiCelebration from "./confettiCelebration"
import GiveUpConfirmation from "./giveUpConfirmation"

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
  const [enableSubmit, setEnableSubmit] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { state, dispatch } = useAppContext()
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null)
  const [showGiveUpConfirmationDialog, setShowGiveUpConfirmationDialog] =
    useState(false)

  const hintsAvailable = playerStats?.hintsAvailable || 0

  const [dateId, setDateId] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  })

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
  }, [playerGame, updatePlayerGame, setShowGiveUpConfirmationDialog])

  const handleGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(true)
  }, [setShowGiveUpConfirmationDialog])

  const updatePlayerData = useCallback(
    async (playerGame) => {
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

        if (!updatedStats.id) {
          console.warn(
            "MoviesContainer useEffect [updatePlayerData]: playerStats.id is undefined! Aborting update."
          )
          return
        }

        if (playerGame.correctAnswer) {
          updatedStats.currentStreak++
          updatedStats.maxStreak = Math.max(
            updatedStats.currentStreak,
            updatedStats.maxStreak
          )

          if (!updatedStats.wins) {
            updatedStats.wins = [0, 0, 0, 0, 0]
          } else if (!Array.isArray(updatedStats.wins)) {
            updatedStats.wins = [0, 0, 0, 0, 0]
          }
          if (updatedStats.wins && Array.isArray(updatedStats.wins)) {
            updatedStats.wins[playerGame.guesses.length - 1] =
              (updatedStats.wins[playerGame.guesses.length - 1] || 0) + 1
          }

          updatedStats.games++
        } else if (!playerGame.gaveUp) {
          updatedStats.currentStreak = 0
          updatedStats.games++
        }

        try {
          const result = await batchUpdatePlayerData(
            updatedStats,
            playerGame,
            player.id,
            { hintsAvailable: updatedStats.hintsAvailable }
          )

          if (result.success) {
            updatePlayerStats(updatedStats)
            console.log("setShowModal called with:", true)
            setShowModal(true)
            setShowConfetti(true)
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
          const result = await batchUpdatePlayerData({}, playerGame, player.id)
        } catch (err) {
          console.error(
            "MoviesContainer useEffect [updatePlayerData]: Error updating player game data:",
            err
          )
        }
      }
    },
    [
      playerStats,
      player.id,
      enableSubmit,
      setShowModal,
      updatePlayerStats,
      state.hasGameStarted,
    ]
  )

  useEffect(() => {
    updatePlayerData(playerGame)
  }, [playerGame, updatePlayerData, initialDataLoaded])

  const handleUpdatePlayerGame = useCallback(
    (updatedPlayerGame: PlayerGame) => {
      updatePlayerGame(updatedPlayerGame)
    },
    [updatePlayerGame]
  )

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

  const handleConfettiStop = useCallback(() => {
    setShowConfetti(false)
  }, [])

  console.log("showModal state:", showModal)
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

        <MovieModal
          movie={playerGame.game.movie}
          show={showModal}
          toggleModal={setShowModal}
        />
        <ConfettiCelebration
          startConfetti={showConfetti}
          onConfettiStop={handleConfettiStop}
        />
        <GiveUpConfirmation
          isVisible={showGiveUpConfirmationDialog}
          onConfirm={confirmGiveUp}
          onCancel={cancelGiveUp}
        />
      </View>
    </ScrollView>
  )
}

export default MoviesContainer
