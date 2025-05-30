import React from "react"
import { View, Pressable, Text, ScrollView } from "react-native"
import Animated from "react-native-reanimated"

import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import NetworkContainer from "./network"
import MovieModal from "./modal"
import PickerContainer from "./picker"
import TitleHeader from "./titleHeader"
import { movieStyles } from "../styles/movieStyles"
import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import HintContainer from "./hint"
import ConfettiCelebration from "./confettiCelebration"
import ConfirmationModal from "./confirmationModal"
import FlashMessage from "./flashMessage"

interface GameUIProps {
  isNetworkConnected: boolean
  movies: readonly BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats

  showModal: boolean
  showConfetti: boolean
  guessFeedback: string | null
  showGiveUpConfirmationDialog: boolean
  isInteractionsDisabled: boolean
  animatedModalStyles: any

  handleGiveUp: () => void
  cancelGiveUp: () => void
  confirmGiveUp: () => void
  handleConfettiStop: () => void
  provideGuessFeedback: (message: string | null) => void
  setShowModal: (show: boolean) => void
  setShowConfetti: (show: boolean) => void

  updatePlayerGame: (game: PlayerGame) => void
  updatePlayerStats: (stats: any) => void
}

const GameUI: React.FC<GameUIProps> = ({
  isNetworkConnected,
  movies,
  player,
  playerGame,
  playerStats,
  showModal,
  showConfetti,
  guessFeedback,
  showGiveUpConfirmationDialog,
  isInteractionsDisabled,
  animatedModalStyles,
  handleGiveUp,
  cancelGiveUp,
  confirmGiveUp,
  handleConfettiStop,
  provideGuessFeedback,
  setShowModal,
  setShowConfetti,
  updatePlayerGame,
  updatePlayerStats,
}) => {
  const hintsAvailable = playerStats?.hintsAvailable ?? 0

  return (
    <ScrollView
      contentContainerStyle={movieStyles.scrollContentContainer}
      style={{ flex: 1 }}
    >
      <View style={movieStyles.container}>
        <NetworkContainer isConnected={isNetworkConnected} />
        <CluesContainer
          correctGuess={playerGame.correctAnswer}
          guesses={playerGame.guesses}
          summary={playerGame.game.movie.overview}
          playerGame={playerGame}
          isGameOver={isInteractionsDisabled}
        />
        <HintContainer
          playerGame={playerGame}
          updatePlayerGame={updatePlayerGame}
          isInteractionsDisabled={isInteractionsDisabled}
          hintsAvailable={hintsAvailable}
          updatePlayerStats={updatePlayerStats}
        />
        <PickerContainer
          enableSubmit={true}
          playerGame={playerGame}
          movies={movies}
          updatePlayerGame={updatePlayerGame}
          onGuessFeedback={provideGuessFeedback}
          setShowConfetti={setShowConfetti}
        />
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
        <FlashMessage message={guessFeedback} />
      </View>
    </ScrollView>
  )
}

export default GameUI
