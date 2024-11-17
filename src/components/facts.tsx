import React from "react"
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
} from "react-native"
import * as Linking from "expo-linking"
import { Actors } from "./actors"
import { Movie } from "../models/movie"

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
    <View style={styles.container}>
      <Pressable
        onPress={handlePressIMDb}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        accessibilityLabel="Open IMDb page"
        accessibilityRole="button"
      >
        <Text style={styles.header}>{movie.title}</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {movie.tagline && (
          <Text style={styles.subHeader}>{movie.tagline}</Text>
        )}
        <Image source={{ uri: imageURI }} style={styles.posterImage} />
        <Text style={styles.text}>
          Directed by {movie.director?.name || "Unknown"}
        </Text>
        <Actors actors={movie.actors} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 10,
    width: 260,
  },
  header: {
    flexWrap: "wrap",
    fontFamily: "Arvo-Bold",
    fontSize: 24,
    paddingBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
    flexGrow: 1,
  },
  posterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    marginBottom: 10,
    borderRadius: 6,
  },
  subHeader: {
    fontFamily: "Arvo-Italic",
    fontSize: 14,
    textAlign: "center",
    width: "90%",
    marginBottom: 10,
    color: "#666",
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: 14,
    paddingTop: 10,
    textAlign: "center",
    marginBottom: 10,
    color: "#444",
  },
})

export default Facts
