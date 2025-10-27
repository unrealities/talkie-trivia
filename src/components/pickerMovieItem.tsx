import React, { memo, useEffect, useMemo } from "react"
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import { Image } from "expo-image"
import { useTheme } from "../contexts/themeContext"
import { getPickerStyles } from "../styles/pickerStyles"
import { BasicMovie, Movie } from "../models/movie"
import { API_CONFIG } from "../config/constants"

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
    const { colors } = useTheme()
    const pickerStyles = useMemo(() => getPickerStyles(colors), [colors])

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
      <View style={pickerStyles.resultItemContainer}>
        <Pressable
          accessible
          accessibilityRole="button"
          aria-label={`Select and guess movie: ${movie.title}. Long press to preview.`}
          onPress={() => onSelect(movie)}
          onLongPress={() => onLongPress(movie)}
          delayLongPress={200}
          style={({ pressed }) => [
            pickerStyles.resultItem,
            pressed && { backgroundColor: colors.surface },
          ]}
          android_ripple={{ color: colors.surface }}
          disabled={isDisabled}
        >
          <View style={pickerStyles.resultItemContent}>
            <Image
              source={imageSource}
              placeholder={defaultPoster}
              style={pickerStyles.resultImage}
              contentFit="cover"
            />
            <Text
              style={pickerStyles.unselected}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {titleWithYear}
            </Text>
          </View>

          {isExpanded && detailedMovie && (
            <View style={pickerStyles.expandedPreview}>
              <Image
                source={fullImageSource}
                placeholder={defaultPoster}
                style={pickerStyles.expandedImage}
                contentFit="cover"
              />
              <View style={pickerStyles.expandedInfo}>
                <Text style={pickerStyles.expandedTitle} numberOfLines={3}>
                  {detailedMovie.title}
                </Text>
                <Text style={pickerStyles.expandedYear}>
                  Release Year:{" "}
                  {new Date(detailedMovie.release_date).getFullYear()}
                </Text>
                <Text style={pickerStyles.expandedHint}>
                  Tap this item to select.
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    )
  },
  (prevProps, nextProps) =>
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.detailedMovie === nextProps.detailedMovie
)

export default PickerMovieItem
