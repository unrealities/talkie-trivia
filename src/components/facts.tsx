import React, { useCallback, memo, useMemo } from "react"
import {
  Text,
  Pressable,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { Image } from "expo-image"
import { Actors } from "./actors"
import { Actor, Director, Movie } from "../models/movie"
import { getFactsStyles } from "../styles/factsStyles"
import { useTheme } from "../contexts/themeContext"
import { analyticsService } from "../utils/analyticsService"
import { useIMDbLink } from "../utils/hooks/useIMDbLink"

type ImageSource = { uri: string } | number
const defaultMovieImage = require("../../assets/movie_default.png")

const MovieHeader = memo(
  ({
    title,
    tagline,
    onPress,
  }: {
    title: string
    tagline: string
    onPress: () => void
  }) => {
    const { colors } = useTheme()
    const factsStyles = useMemo(() => getFactsStyles(colors), [colors])
    return (
      <>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1 },
            factsStyles.pressable,
          ]}
          accessible={true}
          accessibilityLabel={`IMDb page for ${title}`}
          role="link"
        >
          <Text style={factsStyles.header}>{title}</Text>
        </Pressable>
        {tagline && <Text style={factsStyles.subHeaderSmall}>{tagline}</Text>}
      </>
    )
  }
)

const MoviePoster = memo(({ posterPath }: { posterPath: string }) => {
  const factsStyles = useMemo(() => getFactsStyles(useTheme().colors), [])
  const imageSource: ImageSource = posterPath
    ? { uri: `https://image.tmdb.org/t/p/w500${posterPath}` }
    : defaultMovieImage

  return (
    <Image
      source={imageSource}
      style={factsStyles.posterImage}
      placeholder={defaultMovieImage}
      contentFit="cover"
    />
  )
})

const DirectorInfo = memo(({ director }: { director?: Director }) => {
  const { colors } = useTheme()
  const factsStyles = useMemo(() => getFactsStyles(colors), [colors])
  if (!director?.name) return null

  return (
    <Text style={factsStyles.subHeaderSmall}>Directed by {director.name}</Text>
  )
})

interface FactsProps {
  movie: Movie
  isLoading?: boolean
  error?: string
  isScrollEnabled?: boolean
}

const Facts = memo(
  ({ movie, isLoading = false, error, isScrollEnabled = true }: FactsProps) => {
    const { colors } = useTheme()
    const factsStyles = useMemo(() => getFactsStyles(colors), [colors])
    const { openLink } = useIMDbLink()

    const handleMoviePress = useCallback(() => {
      analyticsService.trackImdbLinkTapped(movie.title)
      openLink(movie.imdb_id, "title")
    }, [openLink, movie.imdb_id, movie.title])

    const handleActorPress = useCallback(
      (actor: Actor) => {
        analyticsService.trackActorLinkTapped(actor.name)
        openLink(actor.imdb_id, "name")
      },
      [openLink]
    )

    if (isLoading) {
      return (
        <ActivityIndicator
          testID="activity-indicator"
          size="large"
          color={colors.primary}
        />
      )
    }

    if (error) {
      return (
        <View style={factsStyles.errorContainer}>
          <Text style={factsStyles.errorText}>{error}</Text>
        </View>
      )
    }

    return (
      <View style={factsStyles.container}>
        <MovieHeader
          title={movie.title}
          tagline={movie.tagline}
          onPress={handleMoviePress}
        />
        <ScrollView
          scrollEnabled={isScrollEnabled}
          contentContainerStyle={factsStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MoviePoster posterPath={movie.poster_path} />
          <DirectorInfo director={movie.director} />
          {movie.actors && movie.actors.length > 0 && (
            <Actors actors={movie.actors} onActorPress={handleActorPress} />
          )}
        </ScrollView>
      </View>
    )
  },
  (prevProps, nextProps) =>
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.error === nextProps.error
)

export default Facts
