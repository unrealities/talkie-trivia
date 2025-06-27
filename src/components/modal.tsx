import React, { memo, useEffect } from "react"
import { Modal, Pressable, Text, View } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { modalStyles } from "../styles/modalStyles"
import Facts from "./facts"
import { Movie } from "../models/movie"

interface MovieModalProps {
  movie: Movie | null
  show: boolean
  toggleModal: (show: boolean) => void
}

const MovieModal: React.FC<MovieModalProps> = memo(
  ({ movie, show, toggleModal }) => {
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

    const renderContent = () => {
      if (!movie) {
        return null
      }

      return (
        <Animated.View
          style={[modalStyles.modalView, animatedModalContentStyle]}
        >
          <Facts movie={movie} />
          <Pressable
            style={modalStyles.button}
            onPress={() => toggleModal(false)}
          >
            <Text style={modalStyles.buttonText}>Close</Text>
          </Pressable>
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
    prevProps.movie === nextProps.movie && prevProps.show === nextProps.show
)

export default MovieModal
