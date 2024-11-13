import React from "react"
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import * as Linking from "expo-linking"
import { Actors } from "./actors"
import { Movie } from "../models/movie"

interface FactsProps {
  movie: Movie
}

const Facts = (props: FactsProps) => {
  const imdbURI = "https://www.imdb.com/title/"
  const imageURI = "https://image.tmdb.org/t/p/original"
  const movie = props.movie

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Linking.openURL(`${imdbURI}${movie.imdb_id}`)
        }}
      >
        <View>
          <Text style={styles.header}>{movie.title}</Text>
        </View>
      </TouchableWithoutFeedback>
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { flexGrow: 1 }]}
      >
        <Text style={styles.subHeader}>{movie.tagline}</Text>
        <Image
          source={{ uri: `${imageURI}${movie.poster_path}` }}
          style={styles.posterImage}
        />
        <Text style={styles.text}>Directed by {movie.director.name}</Text>
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
    width: 260,
  },
  header: {
    flexWrap: "wrap",
    fontFamily: "Arvo-Bold",
    fontSize: 24,
    paddingBottom: 10,
    textAlign: "center",
  },
  scrollContainer: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 20,
    width: 260,
  },
  posterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    marginBottom: 10,
  },
  subHeader: {
    flexWrap: "wrap",
    fontFamily: "Arvo-Italic",
    fontSize: 14,
    textAlign: "center",
    width: 220,
    marginBottom: 10,
  },
  text: {
    flexWrap: "wrap",
    fontFamily: "Arvo-Regular",
    fontSize: 14,
    paddingTop: 10,
    textAlign: "center",
    marginBottom: 10,
  },
})

export default Facts
