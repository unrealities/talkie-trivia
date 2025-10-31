import React, { memo, useCallback } from "react"
import {
  Text,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native"
import { Actor, Movie } from "../models/movie"
import { Image } from "expo-image"
import { API_CONFIG } from "../config/constants"
import { useIMDbLink } from "../utils/hooks/useIMDbLink"
import { analyticsService } from "../utils/analyticsService"
import { useStyles, Theme } from "../utils/hooks/useStyles"

type ImageSource = { uri: string } | number

interface ActorsProps {
  actors: Actor[]
  maxDisplay?: number
  containerStyle?: StyleProp<ViewStyle>
  onActorPress: (actor: Actor) => void
}

const defaultActorImage = require("../../assets/actor_default.png")

const ActorContainer = memo(
  ({ actor, onPress }: { actor: Actor; onPress: (actor: Actor) => void }) => {
    const styles = useStyles(themedStyles)
    const imageURI = API_CONFIG.TMDB_IMAGE_BASE_URL_W185

    const actorImageSource: ImageSource = actor.profile_path
      ? { uri: `${imageURI}${actor.profile_path}` }
      : defaultActorImage

    const splitName = (name: string): string[] => {
      const parts = name.trim().split(" ")
      return parts.length > 1
        ? [parts[0], parts.slice(1).join(" ")]
        : [name, ""]
    }

    const [firstName, lastName] = splitName(actor.name)

    return (
      <View style={styles.actorContainer}>
        <Pressable
          testID={`actor-pressable-${actor.id}`}
          onPress={() => onPress(actor)}
          style={({ pressed }) => [
            styles.actorPressable,
            { opacity: pressed ? 0.6 : 1.0, pointerEvents: "auto" },
          ]}
          role="button"
          accessibilityLabel={`Actor: ${actor.name}. View details`}
        >
          <Image
            source={actorImageSource}
            style={styles.actorImage}
            contentFit="cover"
            placeholder={defaultActorImage}
          />
          <View style={styles.actorTextContainer}>
            <View style={styles.actorTextBackground}>
              <Text style={styles.actorText}>
                {firstName}
                {lastName ? (
                  <Text>
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
  }
)

export const Actors: React.FC<ActorsProps> = memo(
  ({ actors, maxDisplay = 3, containerStyle, onActorPress }) => {
    const styles = useStyles(themedStyles)
    if (!actors || actors.length === 0) return null

    return (
      <View style={[styles.actorsContainer, containerStyle]}>
        {actors.slice(0, maxDisplay).map((actor) => (
          <ActorContainer
            key={`${actor.id}-${actor.name}`}
            actor={actor}
            onPress={onActorPress}
          />
        ))}
      </View>
    )
  }
)

interface ActorsStyles {
  actorsContainer: ViewStyle
  actorContainer: ViewStyle
  actorPressable: ViewStyle
  actorImage: ImageStyle
  actorTextContainer: ViewStyle
  actorTextBackground: ViewStyle
  actorText: TextStyle
}

const themedStyles = (theme: Theme): ActorsStyles => ({
  actorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: theme.responsive.scale(2),
    width: "100%",
  },
  actorContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: theme.spacing.extraSmall,
    minHeight: theme.responsive.scale(180),
    position: "relative",
  },
  actorPressable: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.responsive.scale(4),
    padding: theme.responsive.scale(2),
    width: "100%",
    backgroundColor: theme.colors.background,
  },
  actorImage: {
    height: theme.responsive.scale(120),
    width: "100%",
    aspectRatio: 1 / 1.5,
    borderRadius: theme.responsive.scale(4),
  },
  actorTextContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: theme.responsive.scale(40),
    flexWrap: "wrap",
  },
  actorTextBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: theme.responsive.scale(2),
    marginTop: theme.responsive.scale(10),
    width: "100%",
  },
  actorText: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(8),
    color: theme.colors.secondary,
    textAlign: "center",
    lineHeight: theme.responsive.responsiveFontSize(10),
    paddingVertical: theme.responsive.scale(2),
  },
})

const ActorsWrapper = ({ movie }: { movie: Movie }) => {
  const { openLink } = useIMDbLink()

  const handleActorPress = useCallback(
    (actor: Actor) => {
      analyticsService.trackActorLinkTapped(actor.name)
      openLink(actor.imdb_id, "name")
    },
    [openLink]
  )

  if (!movie || !movie.actors) {
    return null
  }

  return <Actors actors={movie.actors} onActorPress={handleActorPress} />
}

export default ActorsWrapper
