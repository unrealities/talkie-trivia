import React from "react"
import { View, Pressable, Text, ScrollView, Platform } from "react-native"
import Animated from "react-native-reanimated"
import * as Haptics from "expo-haptics"

import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import NetworkContainer from "./network"
import MovieModal from "./modal"
import PickerContainer from "./picker"
import { movieStyles } from "../styles/movieStyles"
import HintContainer from "./hint"
import ConfettiCelebration from "./confettiCelebration"
import ConfirmationModal from "./confirmationModal"
import FlashMessages from "./flashMessages"
import { useGameplay } from "../contexts/gameplayContext"

const GameUI: React.FC = () => {
  const {
    isDataLoading,
    isNetworkConnected,
    playerGame,
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
    setShowModal,
  } = useGameplay()

  const onGiveUpPress = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    }
    handleGiveUp()
  }

  const isGameOver =
    playerGame.correctAnswer ||
    playerGame.gaveUp ||
    playerGame.guesses.length >= playerGame.guessesMax

  return (
    <ScrollView
      contentContainerStyle={movieStyles.scrollContentContainer}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={movieStyles.container}>
        <NetworkContainer isConnected={isNetworkConnected} />
        <CluesContainer />
        <HintContainer />
        <PickerContainer />
        <GuessesContainer />

        <Pressable
          onPress={onGiveUpPress}
          style={({ pressed }) => [
            movieStyles.giveUpButton,
            (isInteractionsDisabled || isDataLoading) &&
              movieStyles.disabledButton,
            pressed && movieStyles.pressedButton,
          ]}
          disabled={isInteractionsDisabled || isDataLoading}
          accessible={true}
          accessibilityLabel="Give Up"
          accessibilityHint="Gives up on the current movie."
          accessibilityRole="button"
        >
          <Text style={movieStyles.giveUpButtonText}>Give Up?</Text>
        </Pressable>

        <Animated.View style={[animatedModalStyles]}>
          <MovieModal
            playerGame={isGameOver ? playerGame : null}
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
        <FlashMessages message={guessFeedback} />
      </View>
    </ScrollView>
  )
}

export default GameUI
