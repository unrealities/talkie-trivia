import React from "react"
import { Image, StyleSheet, Text, Pressable, View, Alert } from "react-native"
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

  const handlePress = () => {
    if (imdbURI) {
      Linking.openURL(imdbURI)
    } else {
      Alert.alert("IMDb link unavailable for this actor.")
    }
  }

  return (
    <View style={styles.actorContainer} accessible>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1.0 }]}
        accessibilityRole="button"
      >
        <Image
          source={{
            uri: actor.profile_path
              ? `${imageURI}${actor.profile_path}`
              : Image.resolveAssetSource(require("../../assets/actor_default.png")).uri,
          }}
          style={styles.actorImage}
        />
        <Text style={styles.actorText} numberOfLines={2} ellipsizeMode="tail">
          {actor.name}
        </Text>
      </Pressable>
    </View>
  )
}

export const Actors = ({ actors }: ActorsProps) => (
  <View style={styles.actorsContainer}>
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
  actorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    width: "100%",
  },
  actorContainer: {
    alignItems: "center",
    flex: 1,
    maxWidth: 80,
    minHeight: 140,
  },
  actorImage: {
    height: 90,
    width: 60,
    borderRadius: 4,
    resizeMode: "cover",
  },
  actorText: {
    fontFamily: "Arvo-Regular",
    fontSize: 10,
    paddingTop: 4,
    textAlign: "center",
    color: colors.primary,
    width: 60,
    lineHeight: 12,
  },
})
