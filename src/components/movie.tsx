import React, { useEffect } from "react"
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"

import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import { useGameLogic } from "../utils/hooks/useGameLogic"
import GameUI from "./gameUI"
import ErrorMessage from "./errorMessage"

interface MoviesContainerProps {
  isNetworkConnected: boolean
  movies: readonly BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  updatePlayerGame: (game: PlayerGame) => void
  updatePlayerStats: (stats: any) => void
  isDataLoading: boolean
}

const MoviesContainer: React.FC<MoviesContainerProps> = ({
  isNetworkConnected,
  movies,
  player,
  playerGame,
  playerStats,
  updatePlayerGame,
  updatePlayerStats,
  isDataLoading,
}) => {
  const {
    showModal,
    setShowModal,
    showConfetti,
    setShowConfetti,
    guessFeedback,
    showGiveUpConfirmationDialog,
    isInteractionsDisabled,
    handleGiveUp,
    cancelGiveUp,
    confirmGiveUp,
    handleConfettiStop,
    provideGuessFeedback,
  } = useGameLogic()

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

  if (!isNetworkConnected) {
    return (
      <ErrorMessage message="No Network Connection. Please check your internet and try again." />
    )
  }

  return (
    <GameUI
      isDataLoading={isDataLoading}
      isNetworkConnected={isNetworkConnected}
      movies={movies}
      player={player}
      playerGame={playerGame}
      playerStats={playerStats}
      showModal={showModal}
      showConfetti={showConfetti}
      guessFeedback={guessFeedback}
      showGiveUpConfirmationDialog={showGiveUpConfirmationDialog}
      isInteractionsDisabled={isInteractionsDisabled}
      animatedModalStyles={animatedModalStyles}
      handleGiveUp={handleGiveUp}
      cancelGiveUp={cancelGiveUp}
      confirmGiveUp={confirmGiveUp}
      handleConfettiStop={handleConfettiStop}
      provideGuessFeedback={provideGuessFeedback}
      setShowModal={setShowModal}
      setShowConfetti={setShowConfetti}
      updatePlayerGame={updatePlayerGame}
      updatePlayerStats={updatePlayerStats}
    />
  )
}

export default MoviesContainer
