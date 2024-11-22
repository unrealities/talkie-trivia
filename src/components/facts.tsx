import React from "react"
import { Image, ScrollView, Text, Pressable, View, Alert } from "react-native"
import * as Linking from "expo-linking"
import { Actors } from "./actors"
import { Movie } from "../models/movie"
import { factsStyles } from "../styles/factsStyles"

interface FactsProps {
  movie: Movie
}

const Facts = ({ movie }: FactsProps) => {
  const imdbURI = movie.imdb_id
    ? `https://www.imdb.com/title/${movie.imdb_id}`
    : null
  const imageURI = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : Image.resolveAssetSource(require("../../assets/movie_default.png")).uri

  const handlePressIMDb = () => {
    if (imdbURI) {
      Linking.openURL(imdbURI)
    } else {
      Alert.alert("IMDb link is unavailable for this movie.")
    }
  }

  return (
    <View style={factsStyles.container}>
      <Pressable
        onPress={handlePressIMDb}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        accessibilityLabel="Open IMDb page"
        accessibilityRole="button"
      >
        <Text style={factsStyles.header}>{movie.title}</Text>
      </Pressable>
      <ScrollView contentContainerStyle={factsStyles.scrollContainer}>
        {movie.tagline && (
          <Text style={factsStyles.subHeader}>{movie.tagline}</Text>
        )}
        <Image source={{ uri: imageURI }} style={factsStyles.posterImage} />
        <Text style={factsStyles.text}>
          Directed by {movie.director?.name || "Unknown"}
        </Text>
        <Actors actors={movie.actors} />
      </ScrollView>
    </View>
  )
}

export default Facts
