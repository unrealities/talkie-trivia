import React, { useCallback } from "react"
import {
  Text,
  Pressable,
  View,
  Alert,
  ActivityIndicator,
  ImageSourcePropType,
  ScrollView,
} from "react-native"
import * as Linking from "expo-linking"
import { Image } from "expo-image" // Import ImageSourcePropType
import { Actors } from "./actors"
import { Movie } from "../models/movie"
import { factsStyles } from "../styles/factsStyles"

interface FactsProps {
  movie: Movie
  isLoading?: boolean
  error?: string
}

const Facts = React.memo(
  ({ movie, isLoading = false, error }: FactsProps) => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />
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

    const imageSource: ImageSourcePropType = movie.poster_path
      ? { uri: `https://image.tmdb.org/t/p/original${movie.poster_path}` }
      : require("../../assets/movie_default.png")

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
          Alert.alert(
            "Link Error",
            linkError instanceof Error ? linkError.message : "Unknown error"
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
            accessibilityRole="button"
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
            <Text style={factsStyles.subHeader}>{movie.tagline}</Text>
          )}

          {/* Using expo-image with caching */}
          {movie.poster_path && (
            <Image
              source={imageSource}
              style={factsStyles.posterImage}
              placeholder={require("../../assets/movie_default.png")}
              onError={(e) => console.log("Image load error")}
              contentFit="cover"
            />
          )}

          {movie.director?.name && (
            <Text style={factsStyles.text}>
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
