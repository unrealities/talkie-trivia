import React, { useCallback, memo } from "react"
import {
  Text,
  Pressable,
  View,
  ActivityIndicator,
  ScrollView,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native"
import { Image } from "expo-image"
import { FontAwesome } from "@expo/vector-icons"
import ActorsWrapper from "./actors"
import { Director, Movie } from "../models/movie"
import { analyticsService } from "../utils/analyticsService"
import { useIMDbLink } from "../utils/hooks/useIMDbLink"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { u } from "../styles/utils"
import { Typography } from "./ui/typography"

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
    const styles = useStyles(themedStyles)
    return (
      <>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.headerPressable,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          accessible={true}
          accessibilityLabel={`Open IMDb page for ${title}`}
          role="link"
        >
          <View style={styles.headerContainer}>
            <Typography variant="h1" style={styles.header}>
              {title}
            </Typography>
            <FontAwesome
              name="imdb"
              size={styles.imdbIcon.fontSize}
              color={styles.imdbIcon.color}
              style={styles.imdbIcon}
            />
          </View>
        </Pressable>
        {tagline && (
          <Typography variant="caption" style={styles.tagline}>
            {tagline}
          </Typography>
        )}
      </>
    )
  }
)

const MoviePoster = memo(({ posterPath }: { posterPath: string }) => {
  const styles = useStyles(themedStyles)
  const imageSource: ImageSource = posterPath
    ? { uri: `https://image.tmdb.org/t/p/w500${posterPath}` }
    : defaultMovieImage

  return (
    <Image
      source={imageSource}
      style={styles.posterImage}
      placeholder={defaultMovieImage}
      contentFit="cover"
    />
  )
})

const DirectorInfo = memo(({ director }: { director?: Director }) => {
  const styles = useStyles(themedStyles)
  if (!director?.name) return null

  return (
    <Typography variant="caption" style={styles.director}>
      Directed by {director.name}
    </Typography>
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
    const styles = useStyles(themedStyles)
    const { openLink } = useIMDbLink()

    const handleMoviePress = useCallback(() => {
      analyticsService.trackImdbLinkTapped(movie.title)
      openLink(movie.imdb_id, "title")
    }, [openLink, movie.imdb_id, movie.title])

    if (isLoading) {
      return (
        <ActivityIndicator
          testID="activity-indicator"
          size="large"
          color={styles.loadingIndicator.color}
        />
      )
    }

    if (error) {
      return (
        <View style={[u.flex, u.justifyCenter, u.alignCenter, u.pMd]}>
          <Typography variant="error">{error}</Typography>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <MovieHeader
          title={movie.title}
          tagline={movie.tagline}
          onPress={handleMoviePress}
        />
        <ScrollView
          scrollEnabled={isScrollEnabled}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MoviePoster posterPath={movie.poster_path} />
          <DirectorInfo director={movie.director} />
          <ActorsWrapper movie={movie} />
        </ScrollView>
      </View>
    )
  }
)

interface FactsStyles {
  container: ViewStyle
  headerContainer: ViewStyle
  header: TextStyle
  imdbIcon: TextStyle & { fontSize: number }
  tagline: TextStyle
  director: TextStyle
  scrollContainer: ViewStyle
  posterImage: ImageStyle
  headerPressable: ViewStyle
  loadingIndicator: { color: string }
}

const themedStyles = (theme: Theme): FactsStyles => ({
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  header: {
    ...theme.typography.heading1,
    fontSize: theme.responsive.responsiveFontSize(24),
    paddingBottom: theme.spacing.medium,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  imdbIcon: {
    marginLeft: theme.spacing.small,
    paddingBottom: theme.spacing.small,
    fontSize: theme.responsive.scale(28),
    color: "#F5C518",
  },
  tagline: {
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(14),
    textAlign: "center",
    width: "90%",
    marginBottom: theme.spacing.small,
    color: theme.colors.primary,
    fontStyle: "italic",
    lineHeight: theme.responsive.responsiveFontSize(16),
  },
  director: {
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(14),
    textAlign: "center",
    width: "90%",
    marginBottom: theme.spacing.small,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.medium,
    paddingBottom: theme.spacing.large,
    width: "100%",
  },
  posterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    marginBottom: theme.spacing.medium,
    borderRadius: theme.responsive.scale(8),
  },
  headerPressable: {
    width: "100%",
    alignItems: "center",
    paddingVertical: theme.spacing.small,
    backgroundColor: "transparent",
  },
  loadingIndicator: {
    color: theme.colors.primary,
  },
})

export default Facts
