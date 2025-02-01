import React, { memo } from "react"
import { Modal, Pressable, Text, View } from "react-native"
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
    console.log("MovieModal rendered with show:", show) // ADDED

    const renderContent = () => {
      if (!movie) {
        return (
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.errorText}>
              No movie information available
            </Text>
            <Pressable
              style={modalStyles.button}
              onPress={() => toggleModal(false)}
            >
              <Text style={modalStyles.buttonText}>Dismiss</Text>
            </Pressable>
          </View>
        )
      }

      return (
        <View style={modalStyles.modalView}>
          <Facts movie={movie} />
          <Pressable
            style={modalStyles.button}
            onPress={() => toggleModal(false)}
          >
            <Text style={modalStyles.buttonText}>Close</Text>
          </Pressable>
        </View>
      )
    }

    return (
      <Modal
        animationType="slide"
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
