import React, { useCallback, memo } from "react"
import {
  Text,
  Pressable,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import * as Linking from "expo-linking"
import { Image } from "expo-image"
import { Actors } from "./actors"
import { Movie } from "../models/movie"
import { factsStyles } from "../styles/factsStyles"

type ImageSource = { uri: string } | number

interface FactsProps {
  movie: Movie
  isLoading?: boolean
  error?: string
}

const defaultMovieImage = require("../../assets/movie_default.png")

const Facts = memo(
  ({ movie, isLoading = false, error }: FactsProps) => {
    if (isLoading) {
      return (
        <ActivityIndicator
          testID="activity-indicator"
          size="large"
          color="#0000ff"
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

    const imdbURI = movie.imdb_id
      ? `https://www.imdb.com/title/${movie.imdb_id}`
      : null

    const imageSource: ImageSource = movie.poster_path
      ? { uri: `https://image.tmdb.org/t/p/original${movie.poster_path}` }
      : defaultMovieImage

    const placeholderSource: ImageSource = defaultMovieImage

    const handlePressIMDb = useCallback(() => {
      if (imdbURI) {
        try {
          Linking.canOpenURL(imdbURI).then((supported) => {
            if (supported) {
              Linking.openURL(imdbURI)
            } else {
              Alert.alert("Unsupported Link", "Unable to open IMDb page")
            }
          })
        } catch (linkError) {
          console.error("Error opening IMDb link:", linkError)
          Alert.alert(
            "Link Error",
            `Could not open the IMDb link. ${
              linkError instanceof Error
                ? linkError.message
                : "Please check if you have a browser installed."
            }`
          )
        }
      } else {
        Alert.alert("No IMDb Link", "IMDb link is unavailable for this movie")
      }
    }, [imdbURI])

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
          contentContainerStyle={factsStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
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
            <Actors actors={movie.actors} />
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
