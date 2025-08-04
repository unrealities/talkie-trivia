import React, { memo, useCallback, useMemo } from "react"
import {
  Text,
  Pressable,
  View,
  Alert,
  StyleProp,
  ViewStyle,
} from "react-native"
import * as Linking from "expo-linking"
import { getActorsStyles } from "../styles/actorsStyles"
import { Actor } from "../models/movie"
import { Image } from "expo-image"
import { analyticsService } from "../utils/analyticsService"
import { useTheme } from "../contexts/themeContext"

type ImageSource = { uri: string } | number

interface ActorContainerProps {
  actor: Actor
  imdbId?: string
  style?: StyleProp<ViewStyle>
  onActorPress?: (actor: Actor) => void
}

interface ActorsProps {
  actors: Actor[]
  maxDisplay?: number
  containerStyle?: StyleProp<ViewStyle>
}

const defaultActorImage = require("../../assets/actor_default.png")

const ActorContainer = memo(
  ({ actor, imdbId, style, onActorPress }: ActorContainerProps) => {
    const { colors } = useTheme()
    const actorsStyles = useMemo(() => getActorsStyles(colors), [colors])
    const imageURI = "https://image.tmdb.org/t/p/w185"
    const imdbURI = imdbId ? `https://www.imdb.com/name/${imdbId}` : null

    const handlePress = useCallback(() => {
      if (onActorPress) {
        onActorPress(actor)
        return
      }

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
    }, [actor, imdbURI, onActorPress])

    const actorImageSource: ImageSource = actor.profile_path
      ? { uri: `${imageURI}${actor.profile_path}` }
      : defaultActorImage

    const placeholderSource: ImageSource = defaultActorImage

    const splitName = (name: string): string[] => {
      const parts = name.trim().split(" ")
      if (parts.length > 1) {
        return [parts[0], parts.slice(1).join(" ")]
      }
      return [name, ""]
    }

    const [firstName, lastName] = splitName(actor.name)

    return (
      <View
        style={[actorsStyles.actorContainer, style, { pointerEvents: "auto" }]}
        accessible
      >
        <Pressable
          testID={`actor-pressable-${actor.id}`}
          onPress={handlePress}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1.0 },
            actorsStyles.actorPressable,
          ]}
          role="button"
          accessibilityLabel={`Actor: ${actor.name}. View details`}
        >
          <Image
            source={actorImageSource}
            style={actorsStyles.actorImage}
            resizeMode="cover"
            placeholder={placeholderSource}
          />
          <View style={actorsStyles.actorTextContainer}>
            <View style={actorsStyles.actorTextBackground}>
              <Text style={actorsStyles.actorText}>
                {firstName}
                {lastName ? (
                  <Text style={actorsStyles.actorText}>
                    {"\n"}
                    {lastName}
                  </Text>
                ) : null}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    )
  },
  (prevProps, nextProps) =>
    prevProps.actor.id === nextProps.actor.id &&
    prevProps.onActorPress === nextProps.onActorPress
)

export const Actors = memo(
  ({
    actors,
    maxDisplay = 3,
    containerStyle,
    onActorPress,
  }: ActorsProps & { onActorPress?: (actor: Actor) => void }) => {
    const { colors } = useTheme()
    const actorsStyles = useMemo(() => getActorsStyles(colors), [colors])

    if (!actors || actors.length === 0) {
      return null
    }

    return (
      <View style={[actorsStyles.actorsContainer, containerStyle]}>
        {actors.slice(0, maxDisplay).map((actor) => (
          <ActorContainer
            key={`${actor.id}-${actor.name}`}
            actor={actor}
            imdbId={actor.imdb_id}
            onActorPress={onActorPress}
          />
        ))}
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.actors === nextProps.actors &&
      prevProps.maxDisplay === nextProps.maxDisplay &&
      prevProps.containerStyle === nextProps.containerStyle &&
      prevProps.onActorPress === nextProps.onActorPress
    )
  }
)

export default Actors
