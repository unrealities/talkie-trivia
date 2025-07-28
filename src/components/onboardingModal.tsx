import React, { memo } from "react"
import { Modal, Pressable, Text, View } from "react-native"
import { onboardingModalStyles as styles } from "../styles/onboardingModalStyles"
import { hapticsService } from "../utils/hapticsService"

interface OnboardingModalProps {
  isVisible: boolean
  onDismiss: () => void
}

const tutorialSteps = [
  {
    icon: "book",
    text: "Read the plot summary for the daily movie.",
  },
  {
    icon: "search",
    text: "Search for the movie title you think it is.",
  },
  {
    icon: "hand-pointer-o",
    text: "Long-press a result to see a preview before you guess!",
  },
  {
    icon: "list-ol",
    text: "You have 5 guesses to get it right.",
  },
  {
    icon: "lightbulb-o",
    text: "Use a hint if you're stuck!",
  },
]

const OnboardingModal: React.FC<OnboardingModalProps> = memo(
  ({ isVisible, onDismiss }) => {
    const handleDismiss = () => {
      hapticsService.medium()
      onDismiss()
    }

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={handleDismiss}
      >
        <View style={styles.centeredView} testID="onboarding-modal-container">
          <View style={styles.modalView}>
            <Text style={styles.title}>Welcome to Talkie Trivia!</Text>
            <Text style={styles.subtitle}>How to Play</Text>

            <View style={styles.stepsContainer}>
              {tutorialSteps.map((step, index) => (
                <View style={styles.stepRow} key={index}>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleDismiss}
              accessibilityLabel="Got it, let's play"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Let's Play!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }
)

export default OnboardingModal
