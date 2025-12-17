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

const InlineActors = ({ actors }: { actors: any[] }) => {
  const styles = useStyles(themedStyles)
  // Take top 3
  const topActors = actors
    .slice(0, 3)
    .map((a) => a.name)
    .join(", ")
  return (
    <Typography variant="caption" style={styles.inlineActors} numberOfLines={3}>
      Starring: {topActors}
    </Typography>
  )
}

const ItemHeader = memo(
  ({
    title,
    onPress,
    isLinkable,
    compact = false,
  }: {
    title: string
    onPress: () => void
    isLinkable: boolean
    compact?: boolean
  }) => {
    const styles = useStyles(themedStyles)
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.headerPressable,
          compact && styles.headerPressableCompact,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        disabled={!isLinkable}
        accessible={isLinkable}
        accessibilityLabel={`Open external page for ${title}`}
        role="link"
      >
        <View
          style={[
            styles.headerContainer,
            compact && styles.headerContainerCompact,
          ]}
        >
          <Typography
            variant="h1"
            style={[
              styles.header,
              isLinkable && styles.linkText,
              compact && styles.headerCompact,
            ]}
            numberOfLines={compact ? 2 : undefined}
          >
            {title}
          </Typography>
          {isLinkable && (
            <FontAwesome
              name="external-link-square"
              size={compact ? 16 : styles.imdbIcon.fontSize}
              color={styles.imdbIcon.color}
              style={[styles.imdbIcon, compact && styles.imdbIconCompact]}
            />
          )}
        </View>
      </Pressable>
    )
  }
)

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

    const handleActorPress = useCallback(
      (actor: any) => {
        if (actor.imdb_id) {
          analyticsService.trackActorLinkTapped(actor.name)
          openLink(`${API_CONFIG.IMDB_BASE_URL_NAME}${actor.imdb_id}`)
        }
      },
      [openLink]
    )

    if (isLoading)
      return (
        <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
      )
    if (error)
      return (
        <View style={u.pMd}>
          <Typography variant="error">{error}</Typography>
        </View>
      )

    const imageSource = item.posterPath
      ? { uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }
      : defaultItemImage

    const renderCompactLayout = () => (
      <View style={styles.compactContainer}>
        <View style={styles.compactTopRow}>
          {/* LEFT COLUMN: POSTER */}
          <Image
            source={imageSource}
            style={styles.posterImageCompact}
            contentFit="contain"
            placeholder={defaultItemImage}
          />

          {/* RIGHT COLUMN: DETAILS */}
          <View style={styles.compactInfo}>
            <ItemHeader
              title={item.title}
              onPress={handleItemPress}
              isLinkable={!!item.metadata.imdb_id}
              compact
            />

            {/* Tagline */}
            {item.metadata.tagline && (
              <Typography
                variant="caption"
                style={styles.taglineCompact}
                numberOfLines={3}
              >
                "{item.metadata.tagline}"
              </Typography>
            )}

            {/* Metadata Block */}
            <View style={styles.metadataBlock}>
              {/* Director */}
              {item.hints.map((h) => {
                if (h.type === "director") {
                  return (
                    <Typography
                      key="dir"
                      variant="caption"
                      style={styles.metadataText}
                    >
                      Dir: {String(h.value)}
                    </Typography>
                  )
                }
                return null
              })}

              {/* Year/Decade */}
              {item.hints.map((h) => {
                if (h.type === "decade") {
                  return (
                    <Typography
                      key="dec"
                      variant="caption"
                      style={styles.metadataText}
                    >
                      Released: {String(h.value)}
                    </Typography>
                  )
                }
                return null
              })}

              {/* Genre */}
              {item.hints.map((h) => {
                if (h.type === "genre") {
                  return (
                    <Typography
                      key="gen"
                      variant="caption"
                      style={styles.metadataText}
                    >
                      Genre: {String(h.value)}
                    </Typography>
                  )
                }
                return null
              })}
            </View>

            {/* Actors (Inline Text) */}
            {item.hints.map((h) => {
              if (h.type === "actors" && Array.isArray(h.value)) {
                return <InlineActors key="actors" actors={h.value} />
              }
              return null
            })}
          </View>
        </View>
      </View>
    )

    const renderStandardLayout = () => (
      <>
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
        <Image
          source={imageSource}
          style={styles.posterImage}
          contentFit="cover"
        />
        {item.hints.map((hint) => {
          if (hint.type === "actors" && Array.isArray(hint.value)) {
            return (
              <Actors
                key={hint.type}
                actors={hint.value}
                onActorPress={handleActorPress}
              />
            )
          }
          if (["director", "genre", "decade"].includes(hint.type)) {
            return (
              <Typography
                key={hint.type}
                variant="caption"
                style={styles.director}
              >
                {hint.label}: {String(hint.value)}
              </Typography>
            )
          }
          return null
        })}
      </>
    )

    return (
      <View style={styles.container}>
        {compact ? (
          renderCompactLayout()
        ) : isScrollEnabled ? (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderStandardLayout()}
          </ScrollView>
        ) : (
          <View style={styles.staticContent}>{renderStandardLayout()}</View>
        )}
      </View>
    )
  }
)

interface FactsStyles {
  container: ViewStyle
  headerContainer: ViewStyle
  headerContainerCompact: ViewStyle
  header: TextStyle
  headerCompact: TextStyle
  imdbIcon: TextStyle & { fontSize: number }
  imdbIconCompact: TextStyle
  inlineActors: TextStyle & { fontSize: number }
  linkText: TextStyle
  tagline: TextStyle
  taglineCompact: TextStyle
  director: TextStyle
  scrollContainer: ViewStyle
  staticContent: ViewStyle
  posterImage: ImageStyle
  posterImageCompact: ImageStyle
  headerPressable: ViewStyle
  headerPressableCompact: ViewStyle
  loadingIndicator: { color: string }
  metadataBlock: ViewStyle
  metadataText: TextStyle & { fontSize: number }
  compactContainer: ViewStyle
  compactTopRow: ViewStyle
  compactInfo: ViewStyle
}

const themedStyles = (theme: Theme): FactsStyles => ({
  container: {
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  headerContainerCompact: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  header: {
    ...theme.typography.heading1,
    fontSize: theme.responsive.responsiveFontSize(24),
    paddingBottom: theme.spacing.medium,
    textAlign: "center",
  },
  headerCompact: {
    fontSize: theme.responsive.responsiveFontSize(20),
    paddingBottom: theme.spacing.extraSmall,
    textAlign: "left",
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
  imdbIconCompact: {
    paddingBottom: 0,
    marginLeft: theme.spacing.extraSmall,
  },
  tagline: {
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(14),
    textAlign: "center",
    width: "90%",
    marginBottom: theme.spacing.small,
    color: theme.colors.primary,
    fontStyle: "italic",
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
  headerPressable: {
    width: "100%",
    alignItems: "center",
    paddingVertical: theme.spacing.small,
  },
  headerPressableCompact: {
    alignItems: "flex-start",
    paddingVertical: 0,
  },
  loadingIndicator: {
    color: theme.colors.primary,
  },

  // Compact Layout
  compactContainer: {
    width: "100%",
    flexDirection: "column",
  },
  compactTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.small,
  },
  posterImageCompact: {
    width: theme.responsive.scale(100),
    height: theme.responsive.scale(150),
    borderRadius: theme.responsive.scale(8),
    marginRight: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
  },
  compactInfo: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: theme.spacing.extraSmall,
  },
  taglineCompact: {
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(11),
    color:
      theme.colorScheme === "dark" ? "#E0E0E0" : theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
  metadataBlock: {
    flexDirection: "column",
    marginBottom: theme.spacing.small,
  },
  metadataText: {
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(12),
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  inlineActors: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(11),
    color:
      theme.colorScheme === "dark" ? "#CCCCCC" : theme.colors.textSecondary,
    marginTop: theme.spacing.extraSmall,
  },
})

export default Facts
