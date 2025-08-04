import React, { memo, useMemo } from "react"
import { Modal, View, Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { BasicMovie } from "../models/movie"
import { getPreviewModalStyles } from "../styles/previewModalStyles"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"

interface PreviewModalProps {
  movie: BasicMovie | null
  isVisible: boolean
  onClose: () => void
  onSubmit: (movie: BasicMovie) => void
}

const defaultMovieImage = require("../../assets/movie_default.png")

const PreviewModal: React.FC<PreviewModalProps> = memo(
  ({ movie, isVisible, onClose, onSubmit }) => {
    const { colors } = useTheme()
    const styles = useMemo(() => getPreviewModalStyles(colors), [colors])

    if (!movie) {
      return null
    }

    const handleSubmit = () => {
      hapticsService.medium()
      onSubmit(movie)
    }

    const handleClose = () => {
      hapticsService.light()
      onClose()
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
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <Pressable style={styles.centeredView} onPress={handleClose}>
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
              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                ]}
                onPress={handleClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={handleSubmit}
              >
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
