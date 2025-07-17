import React, { memo, useEffect } from "react"
import { Modal, Pressable, Text, View, Share, Alert } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { modalStyles } from "../styles/modalStyles"
import Facts from "./facts"
import { PlayerGame } from "../models/game"
import { generateShareMessage } from "../utils/shareUtils"
import { analyticsService } from "../utils/analyticsService"

interface MovieModalProps {
  playerGame: PlayerGame | null
  show: boolean
  toggleModal: (show: boolean) => void
}

const MovieModal: React.FC<MovieModalProps> = memo(
  ({ playerGame, show, toggleModal }) => {
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

    const renderContent = () => {
      if (!playerGame) {
        return null
      }

      return (
        <Animated.View
          style={[modalStyles.modalView, animatedModalContentStyle]}
        >
          <Facts movie={playerGame.movie} />
          <View style={modalStyles.buttonContainer}>
            <Pressable
              style={modalStyles.button}
              onPress={() => toggleModal(false)}
            >
              <Text style={modalStyles.buttonText}>Close</Text>
            </Pressable>
            <Pressable style={modalStyles.shareButton} onPress={handleShare}>
              <Text style={modalStyles.buttonText}>Share</Text>
            </Pressable>
          </View>
        </Animated.View>
      )
    }

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={show}
        onRequestClose={() => toggleModal(false)}
        hardwareAccelerated
        statusBarTranslucent
      >
        <Pressable
          style={modalStyles.centeredView}
          onPress={() => toggleModal(false)}
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
  },
  (prevProps, nextProps) =>
    prevProps.playerGame === nextProps.playerGame &&
    prevProps.show === nextProps.show
)

export default MovieModal
