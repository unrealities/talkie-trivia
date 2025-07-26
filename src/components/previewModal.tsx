import React, { memo } from "react"
import { Modal, View, Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { BasicMovie } from "../models/movie"
import { previewModalStyles as styles } from "../styles/previewModalStyles"

interface PreviewModalProps {
  movie: BasicMovie | null
  isVisible: boolean
  onClose: () => void
  onSubmit: (movie: BasicMovie) => void
}

const defaultMovieImage = require("../../assets/movie_default.png")

const PreviewModal: React.FC<PreviewModalProps> = memo(
  ({ movie, isVisible, onClose, onSubmit }) => {
    if (!movie) {
      return null
    }

    const handleSubmit = () => {
      onSubmit(movie)
    }

    const imageSource = movie.poster_path
      ? { uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }
      : defaultMovieImage

    const releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "N/A"

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <Pressable style={styles.centeredView} onPress={onClose}>
          <Pressable
            style={styles.modalView}
            onPress={(e) => e.stopPropagation()}
          >
            <Image
              source={imageSource}
              style={styles.posterImage}
              placeholder={defaultMovieImage}
              contentFit="cover"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.titleText} numberOfLines={3}>
                {movie.title}
              </Text>
              <Text style={styles.dateText}>Release Year: {releaseYear}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
              <Pressable style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Guess</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    )
  }
)

export default PreviewModal
