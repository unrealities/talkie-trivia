import React, { useCallback, memo } from "react"
import {
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
import { TriviaItem, Hint } from "../models/trivia"
import { analyticsService } from "../utils/analyticsService"
import { useExternalLink } from "../utils/hooks/useExternalLink"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { u } from "../styles/utils"
import { Typography } from "./ui/typography"
import Actors from "./actors"
import { API_CONFIG } from "../config/constants"

type ImageSource = { uri: string } | number
const defaultItemImage = require("../../assets/movie_default.png")

const ItemHeader = memo(
  ({
    title,
    onPress,
    isLinkable,
  }: {
    title: string
    onPress: () => void
    isLinkable: boolean
  }) => {
    const styles = useStyles(themedStyles)
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.headerPressable,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        disabled={!isLinkable}
        accessible={isLinkable}
        accessibilityLabel={`Open external page for ${title}`}
        role="link"
      >
        <View style={styles.headerContainer}>
          <Typography
            variant="h1"
            style={[styles.header, isLinkable && styles.linkText]}
          >
            {title}
          </Typography>
          {isLinkable && (
            <FontAwesome
              name="external-link-square"
              size={styles.imdbIcon.fontSize}
              color={styles.imdbIcon.color}
              style={styles.imdbIcon}
            />
          )}
        </View>
      </Pressable>
    )
  }
)

const ItemPoster = memo(
  ({ posterPath, compact }: { posterPath: string; compact: boolean }) => {
    const styles = useStyles(themedStyles)
    const imageSource: ImageSource = posterPath
      ? { uri: `https://image.tmdb.org/t/p/w500${posterPath}` }
      : defaultItemImage

    return (
      <Image
        source={imageSource}
        style={[styles.posterImage, compact && styles.posterImageCompact]}
        placeholder={defaultItemImage}
        contentFit="contain"
      />
    )
  }
)

const HintsRenderer = memo(({ item }: { item: TriviaItem }) => {
  const { openLink } = useExternalLink()
  const styles = useStyles(themedStyles)

  const handleActorPress = useCallback(
    (actor: any) => {
      if (actor.imdb_id) {
        analyticsService.trackActorLinkTapped(actor.name)
        openLink(`${API_CONFIG.IMDB_BASE_URL_NAME}${actor.imdb_id}`)
      }
    },
    [openLink]
  )

  const renderHint = (hint: Hint) => {
    switch (hint.type) {
      case "director":
        return (
          <Typography key={hint.type} variant="caption" style={styles.director}>
            {hint.label}: {String(hint.value)}
          </Typography>
        )
      case "actors":
        if (Array.isArray(hint.value)) {
          return (
            <Actors
              key={hint.type}
              actors={hint.value}
              onActorPress={handleActorPress}
            />
          )
        }
        return null
      default:
        return null
    }
  }

  return <>{item.hints.map(renderHint)}</>
})

interface FactsProps {
  item: TriviaItem
  isLoading?: boolean
  error?: string
  isScrollEnabled?: boolean
  compact?: boolean
}

const Facts = memo(
  ({
    item,
    isLoading = false,
    error,
    isScrollEnabled = true,
    compact = false,
  }: FactsProps) => {
    const styles = useStyles(themedStyles)
    const { openLink } = useExternalLink()

    const handleItemPress = useCallback(() => {
      const imdbId = item.metadata.imdb_id
      if (imdbId) {
        analyticsService.trackImdbLinkTapped(item.title)
        openLink(`${API_CONFIG.IMDB_BASE_URL_TITLE}${imdbId}`)
      }
    }, [openLink, item.title, item.metadata.imdb_id])

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
        <ItemHeader
          title={item.title}
          onPress={handleItemPress}
          isLinkable={!!item.metadata.imdb_id}
        />
        {item.metadata.tagline && (
          <Typography variant="caption" style={styles.tagline}>
            {item.metadata.tagline}
          </Typography>
        )}

        {isScrollEnabled ? (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ItemPoster posterPath={item.posterPath} compact={compact} />
            <HintsRenderer item={item} />
          </ScrollView>
        ) : (
          <View style={styles.staticContent}>
            <ItemPoster posterPath={item.posterPath} compact={compact} />
            <HintsRenderer item={item} />
          </View>
        )}
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
  posterImageCompact: ImageStyle
  headerPressable: ViewStyle
  loadingIndicator: { color: string }
  linkText: TextStyle
  staticContent: ViewStyle
}

const themedStyles = (theme: Theme): FactsStyles => ({
  container: {
    alignItems: "center",
    width: "100%",
    // Removed flex: 1 to prevent layout issues in nested ScrollViews
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
  },
  linkText: {
    textDecorationLine: "underline",
  },
  imdbIcon: {
    marginLeft: theme.spacing.small,
    paddingBottom: theme.spacing.small,
    fontSize: theme.responsive.scale(22),
    color: theme.colors.primary,
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
  staticContent: {
    width: "100%",
    alignItems: "center",
    paddingBottom: theme.spacing.small,
  },
  posterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    marginBottom: theme.spacing.medium,
    borderRadius: theme.responsive.scale(8),
  },
  posterImageCompact: {
    height: theme.responsive.scale(150),
    width: "auto",
    aspectRatio: 2 / 3,
    marginBottom: theme.spacing.small,
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
