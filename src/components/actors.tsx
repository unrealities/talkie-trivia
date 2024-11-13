import React from "react"
import { Image, StyleSheet, Text, Pressable, View } from "react-native"
import * as Linking from "expo-linking"
import { colors } from "../styles/global"
import { Actor } from "../models/movie"

interface ActorProps {
  actor: Actor
  imdbId: string
}

interface ActorsProps {
  actors: Actor[]
}

const ActorContainer = ({ actor, imdbId }: ActorProps) => {
  const imageURI = "https://image.tmdb.org/t/p/original"
  const imdbURI = imdbId ? `https://www.imdb.com/name/${imdbId}` : null

  return (
    <View style={styles.ActorContainer}>
      <Pressable
        onPress={() => {
          if (imdbURI) Linking.openURL(imdbURI)
        }}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1.0 }]}
      >
        <Image
          source={{ uri: `${imageURI}${actor.profile_path}` }}
          defaultSource={require("../../assets/actor_default.png")}
          style={styles.ActorImage}
        />
        <Text style={styles.ActorText} numberOfLines={2} ellipsizeMode="tail">
          {actor.name}
        </Text>
      </Pressable>
    </View>
  )
}

export const Actors = ({ actors }: ActorsProps) => (
  <View style={styles.ActorsContainer}>
    {actors.slice(0, 3).map((actor) => (
      <ActorContainer
        key={actor.imdbId || actor.name}
        actor={actor}
        imdbId={actor.imdbId}
      />
    ))}
  </View>
)

const styles = StyleSheet.create({
  ActorsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    width: "100%",
  },
  ActorContainer: {
    alignItems: "center",
    flex: 1,
    maxWidth: 80,
    minHeight: 140,
  },
  ActorImage: {
    height: 90,
    width: 60,
    borderRadius: 4,
  },
  ActorText: {
    fontFamily: "Arvo-Regular",
    fontSize: 10,
    paddingTop: 4,
    textAlign: "center",
    color: colors.primary,
    width: 60,
  },
})
