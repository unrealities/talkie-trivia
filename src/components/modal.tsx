import React, { memo, useEffect } from "react"
import {
  Modal,
  Pressable,
  View,
  Share,
  Alert,
  ViewStyle,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { PlayerGame } from "../models/game"
import { generateShareMessage } from "../utils/shareUtils"
import { analyticsService } from "../utils/analyticsService"
import { hapticsService } from "../utils/hapticsService"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Button } from "./ui/button"

interface MovieModalProps {
  playerGame?: PlayerGame | null
  show: boolean
  toggleModal: (show: boolean) => void
  children: React.ReactNode
}

const MovieModal: React.FC<MovieModalProps> = memo(
  ({ playerGame, show, toggleModal, children }) => {
    const styles = useStyles(themedStyles)
    const animatedValue = useSharedValue(0)

    const animatedModalContentStyle = useAnimatedStyle(() => {
      return {
        opacity: animatedValue.value,
        transform: [{ scale: animatedValue.value }],
      }
    })

    useEffect(() => {
      animatedValue.value = withTiming(show ? 1 : 0, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      })
    }, [show, animatedValue])

    const handleShare = async () => {
      if (!playerGame) return
      hapticsService.medium()
      try {
        let outcome: "win" | "lose" | "give_up" = "lose"
        if (playerGame.correctAnswer) {
          outcome = "win"
        } else if (playerGame.gaveUp) {
          outcome = "give_up"
        }

        analyticsService.trackShareResults(outcome)

        const message = generateShareMessage(playerGame)
        await Share.share(
          {
            message,
            title: "Talkie Trivia Results",
          },
          {
            dialogTitle: "Share your Talkie Trivia results!", // Android only
          }
        )
      } catch (error: any) {
        Alert.alert("Share Error", error.message)
      }
    }

    const handleClose = () => {
      hapticsService.light()
      toggleModal(false)
    }

    const renderContent = () => {
      return (
        <Animated.View style={[styles.modalView, animatedModalContentStyle]}>
          {children}
          <View style={styles.buttonContainer}>
            <Button
              title="Close"
              variant="secondary"
              onPress={handleClose}
              style={styles.button}
            />
            {playerGame && (
              <Button
                title="Share"
                variant="primary"
                onPress={handleShare}
                style={styles.button}
              />
            )}
          </View>
        </Animated.View>
      )
    }

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={show}
        onRequestClose={handleClose}
        hardwareAccelerated
        statusBarTranslucent
      >
        <Pressable
          style={styles.centeredView}
          onPress={handleClose}
          accessible={true}
          accessibilityLabel="Close modal by tapping outside"
        >
          {/* Prevent touch events from propagating to the background Pressable */}
          <Pressable onPress={(e) => e.stopPropagation()} accessible={false}>
            {renderContent()}
          </Pressable>
        </Pressable>
      </Modal>
    )
  }
)

interface ModalStyles {
  centeredView: ViewStyle
  modalView: ViewStyle
  buttonContainer: ViewStyle
  button: ViewStyle
}

const themedStyles = (theme: Theme): ModalStyles => ({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%", // Increased for better content visibility
    maxWidth: theme.responsive.scale(500),
    alignSelf: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.responsive.scale(15),
    padding: theme.spacing.large,
    ...theme.shadows.medium,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: theme.spacing.medium,
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.small,
  },
})

export default MovieModal
