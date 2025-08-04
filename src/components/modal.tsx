import React, { memo, useEffect, useMemo } from "react"
import { Modal, Pressable, Text, View, Share, Alert } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { getModalStyles } from "../styles/modalStyles"
import { PlayerGame } from "../models/game"
import { generateShareMessage } from "../utils/shareUtils"
import { analyticsService } from "../utils/analyticsService"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"

interface MovieModalProps {
  playerGame?: PlayerGame | null
  show: boolean
  toggleModal: (show: boolean) => void
  children: React.ReactNode
}

const MovieModal: React.FC<MovieModalProps> = memo(
  ({ playerGame, show, toggleModal, children }) => {
    const { colors } = useTheme()
    const modalStyles = useMemo(() => getModalStyles(colors), [colors])
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
        <Animated.View
          style={[modalStyles.modalView, animatedModalContentStyle]}
        >
          {children}
          <View style={modalStyles.buttonContainer}>
            <Pressable style={modalStyles.button} onPress={handleClose}>
              <Text style={modalStyles.buttonText}>Close</Text>
            </Pressable>
            {playerGame && (
              <Pressable style={modalStyles.shareButton} onPress={handleShare}>
                <Text style={modalStyles.buttonText}>Share</Text>
              </Pressable>
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
          style={modalStyles.centeredView}
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

export default MovieModal
