import React, { useCallback, memo, useMemo } from "react"
import {
  Text,
  Pressable,
  View,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native"
import { Image } from "expo-image"
import * as Linking from "expo-linking"
import { Actors } from "./actors"
import { Actor, Movie } from "../models/movie"
import { getFactsStyles } from "../styles/factsStyles"
import { useTheme } from "../contexts/themeContext"
import { analyticsService } from "../utils/analyticsService"
import { API_CONFIG } from "../config/constants"

type ImageSource = { uri: string } | number

interface FactsProps {
  movie: Movie
  isLoading?: boolean
  error?: string
  isScrollEnabled?: boolean
}

const defaultMovieImage = require("../../assets/movie_default.png")

const Facts = memo(
  ({ movie, isLoading = false, error, isScrollEnabled = true }: FactsProps) => {
    const { colors } = useTheme()
    const factsStyles = useMemo(() => getFactsStyles(colors), [colors])

    if (isLoading) {
      return (
        <ActivityIndicator
          testID="activity-indicator"
          size="large"
          color={colors.primary}
        />
      )
    }

    if (error) {
      return (
        <View style={factsStyles.errorContainer}>
          <Text style={factsStyles.errorText}>{error}</Text>
        </View>
      )
    }

    const handleActorPress = useCallback((actor: Actor) => {
      const imdbURI = actor.imdb_id
        ? `${API_CONFIG.IMDB_BASE_URL_NAME}${actor.imdb_id}`
        : null

      analyticsService.trackActorLinkTapped(actor.name)

      if (imdbURI) {
        Linking.canOpenURL(imdbURI)
          .then((supported) => {
            if (supported) {
              Linking.openURL(imdbURI)
            } else {
              Alert.alert("Unable to open IMDb link")
            }
          })
          .catch(() => {
            Alert.alert("Error opening link")
          })
      } else {
        Alert.alert("IMDb link unavailable", "No link found for this actor.")
      }
    }, [])

    const imageSource: ImageSource = movie.poster_path
      ? { uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }
      : defaultMovieImage

    const placeholderSource: ImageSource = defaultMovieImage

    const handlePressIMDb = useCallback(() => {}, [movie.imdb_id, movie.title])

    return (
      <View style={factsStyles.container}>
        {movie.title && (
          <Pressable
            onPress={handlePressIMDb}
            style={({ pressed }) => [
              { opacity: pressed ? 0.6 : 1 },
              factsStyles.pressable,
            ]}
            accessible={true}
            accessibilityLabel={`IMDb page for ${movie.title}`}
            role="button"
            accessibilityHint="Double tap to open movie's IMDb page"
          >
            <Text style={factsStyles.header}>{movie.title}</Text>
          </Pressable>
        )}

        <ScrollView
          scrollEnabled={isScrollEnabled}
          contentContainerStyle={factsStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {movie.tagline && (
            <Text style={factsStyles.subHeaderSmall}>{movie.tagline}</Text>
          )}

          <Image
            source={imageSource}
            style={factsStyles.posterImage}
            placeholder={placeholderSource}
            onError={(e) => console.log("Image load error", e)}
            contentFit="cover"
          />

          {movie.director?.name && (
            <Text style={factsStyles.subHeaderSmall}>
              Directed by {movie.director.name || "Unknown"}
            </Text>
          )}

          {movie.actors && movie.actors.length > 0 && (
            <Actors actors={movie.actors} onActorPress={handleActorPress} />
          )}
        </ScrollView>
      </View>
    )
  },
  (prevProps, nextProps) =>
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.error === nextProps.error
)

export default Facts
