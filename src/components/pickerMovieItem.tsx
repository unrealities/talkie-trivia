import React, { memo, useEffect } from "react"
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native"
import { Image } from "expo-image"
import { BasicMovie, Movie } from "../models/movie"
import { API_CONFIG } from "../config/constants"
import { useStyles, Theme } from "../utils/hooks/useStyles"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface MovieItemProps {
  movie: BasicMovie
  detailedMovie: Movie | null
  isDisabled: boolean
  isExpanded: boolean
  onSelect: (movie: BasicMovie) => void
  onLongPress: (movie: BasicMovie) => void
}

const defaultPoster = require("../../assets/movie_default.png")

const PickerMovieItem = memo<MovieItemProps>(
  ({ movie, detailedMovie, isDisabled, isExpanded, onSelect, onLongPress }) => {
    const styles = useStyles(themedStyles)

    useEffect(() => {
      if (Platform.OS !== "web") {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      }
    }, [isExpanded])

    const releaseYear = movie.release_date
      ? ` (${movie.release_date.toString().substring(0, 4)})`
      : ""
    const titleWithYear = `${movie.title}${releaseYear}`

    const imageSource = movie.poster_path
      ? { uri: `${API_CONFIG.TMDB_IMAGE_BASE_URL_W92}${movie.poster_path}` }
      : defaultPoster

    const fullImageSource = movie.poster_path
      ? { uri: `${API_CONFIG.TMDB_IMAGE_BASE_URL_W500}${movie.poster_path}` }
      : defaultPoster

    return (
      <View style={styles.resultItemContainer}>
        <Pressable
          accessible
          accessibilityRole="button"
          aria-label={`Select and guess movie: ${movie.title}. Long press to preview.`}
          onPress={() => onSelect(movie)}
          onLongPress={() => onLongPress(movie)}
          delayLongPress={200}
          style={({ pressed }) => [
            styles.resultItem,
            pressed && styles.pressedItem,
          ]}
          android_ripple={{ color: styles.pressedItem.backgroundColor }}
          disabled={isDisabled}
        >
          <View style={styles.resultItemContent}>
            <Image
              source={imageSource}
              placeholder={defaultPoster}
              style={styles.resultImage}
              contentFit="cover"
            />
            <Text
              style={styles.unselected}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {titleWithYear}
            </Text>
          </View>

          {isExpanded && detailedMovie && (
            <View style={styles.expandedPreview}>
              <Image
                source={fullImageSource}
                placeholder={defaultPoster}
                style={styles.expandedImage}
                contentFit="cover"
              />
              <View style={styles.expandedInfo}>
                <Text style={styles.expandedTitle} numberOfLines={3}>
                  {detailedMovie.title}
                </Text>
                <Text style={styles.expandedYear}>
                  Release Year:{" "}
                  {new Date(detailedMovie.release_date).getFullYear()}
                </Text>
                <Text style={styles.expandedHint}>
                  Tap this item to select.
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    )
  }
)

interface PickerMovieItemStyles {
  resultItemContainer: ViewStyle
  resultItem: ViewStyle
  pressedItem: ViewStyle
  resultItemContent: ViewStyle
  resultImage: ImageStyle
  unselected: TextStyle
  expandedPreview: ViewStyle
  expandedImage: ImageStyle
  expandedInfo: ViewStyle
  expandedTitle: TextStyle
  expandedYear: TextStyle
  expandedHint: TextStyle
}

const themedStyles = (theme: Theme): PickerMovieItemStyles => ({
  resultItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  resultItem: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    overflow: "hidden",
  },
  pressedItem: {
    backgroundColor: theme.colors.surface,
  },
  resultItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultImage: {
    width: theme.responsive.scale(30),
    height: theme.responsive.scale(45),
    borderRadius: theme.responsive.scale(4),
    marginRight: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
  },
  unselected: {
    ...theme.typography.bodyText,
    fontSize: theme.responsive.responsiveFontSize(14),
    flex: 1,
  },
  expandedPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.medium,
    padding: theme.spacing.small,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.responsive.scale(8),
  },
  expandedImage: {
    width: theme.responsive.scale(80),
    height: theme.responsive.scale(120),
    borderRadius: theme.responsive.scale(6),
    marginRight: theme.spacing.medium,
  },
  expandedInfo: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  expandedTitle: {
    ...theme.typography.bodyText,
    color: theme.colors.textPrimary,
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(16),
    marginBottom: theme.spacing.extraSmall,
  },
  expandedYear: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
  expandedHint: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontFamily: "Arvo-Italic",
  },
})

export default PickerMovieItem
