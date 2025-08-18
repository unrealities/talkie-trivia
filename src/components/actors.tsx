import React, { memo, useCallback, useMemo } from "react"
import { Text, Pressable, View, StyleProp, ViewStyle } from "react-native"
import { getActorsStyles } from "../styles/actorsStyles"
import { Actor } from "../models/movie"
import { Image } from "expo-image"
import { useTheme } from "../contexts/themeContext"
import { API_CONFIG } from "../config/constants"

type ImageSource = { uri: string } | number

interface ActorContainerProps {
  actor: Actor
  style?: StyleProp<ViewStyle>
  onPress: (actor: Actor) => void
}

interface ActorsProps {
  actors: Actor[]
  maxDisplay?: number
  containerStyle?: StyleProp<ViewStyle>
  onActorPress: (actor: Actor) => void
}

const defaultActorImage = require("../../assets/actor_default.png")

const ActorContainer = memo(
  ({ actor, style, onPress }: ActorContainerProps) => {
    const { colors } = useTheme()
    const actorsStyles = useMemo(() => getActorsStyles(colors), [colors])
    const imageURI = API_CONFIG.TMDB_IMAGE_BASE_URL_W185

    const handlePress = () => {
      onPress(actor)
    }

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
            contentFit="cover"
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
    prevProps.onPress === nextProps.onPress
)

export const Actors = memo(
  ({ actors, maxDisplay = 3, containerStyle, onActorPress }: ActorsProps) => {
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
            onPress={onActorPress}
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
