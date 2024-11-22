import React from "react"
import { Image, Text, Pressable, View, Alert } from "react-native"
import * as Linking from "expo-linking"
import { actorsStyles } from "../styles/ActorsStyles"
import { Actor } from "../models/movie"

interface ActorProps {
  actor: Actor
  imdbId: number
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
    <View style={actorsStyles.actorContainer} accessible>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1.0 }]}
        accessibilityRole="button"
      >
        <Image
          source={{
            uri: actor.profile_path
              ? `${imageURI}${actor.profile_path}`
              : Image.resolveAssetSource(
                  require("../../assets/actor_default.png")
                ).uri,
          }}
          style={actorsStyles.actorImage}
        />
        <Text
          style={actorsStyles.actorText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {actor.name}
        </Text>
      </Pressable>
    </View>
  )
}

export const Actors = ({ actors }: ActorsProps) => (
  <View style={actorsStyles.actorsContainer}>
    {actors.slice(0, 3).map((actor) => (
      <ActorContainer
        key={actor.id || actor.name}
        actor={actor}
        imdbId={actor.id}
      />
    ))}
  </View>
)
