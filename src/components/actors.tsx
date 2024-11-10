import React from "react"
import { Image, StyleSheet, Text, Pressable, View } from "react-native"
import * as Linking from "expo-linking"
import { colors } from "../styles/global"
import { Actor } from "../models/movie"

interface ActorProps {
  actor: Actor
  imdbId: string // Add IMDb ID prop for more accurate linking
}

interface ActorsProps {
  actors: Actor[]
}

const ActorContainer = (props: ActorProps) => {
  let imageURI = "https://image.tmdb.org/t/p/original"
  let imdbURI = "https://www.imdb.com/name/"

  return (
    <View style={styles.ActorContainer}>
      <Pressable
        onPress={() => {
          Linking.openURL(`${imdbURI}${props.imdbId}`)
        }}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.6 : 1.0,
          },
        ]}
      >
        <Image
          source={{ uri: `${imageURI}${props.actor.profile_path}` }}
          style={styles.ActorImage}
        />
        <Text style={styles.ActorText} numberOfLines={2}>
          {props.actor.name}
        </Text>
      </Pressable>
    </View>
  )
}

const Actors = (props: ActorsProps) => {
  return (
    <View style={styles.ActorsContainer}>
      {props.actors.map((actor, index) => (
        <ActorContainer
          key={index}
          actor={actor}
          imdbId={actor.imdbId} // Pass IMDb ID here
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  ActorsContainer: {
    color: colors.primary,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    minWidth: 270,
    paddingBottom: 12,
    paddingTop: 12,
  },
  ActorContainer: {
    alignItems: "center",
    flex: 1,
    maxWidth: 60,
    minHeight: 120,
  },
  ActorImage: {
    flex: 1,
    height: 90,
    width: 60,
  },
  ActorText: {
    flex: 1,
    fontFamily: "Arvo-Regular",
    fontSize: 12,
    minHeight: 34,
    paddingTop: 4,
    textAlign: "center",
    flexWrap: "wrap",
  },
})

export default Actors
