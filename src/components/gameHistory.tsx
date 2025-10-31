import React, { useState, useEffect, memo, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native"
import { Image } from "expo-image"
import { useAuth } from "../contexts/authContext"
import { GameHistoryEntry } from "../models/gameHistory"
import { hapticsService } from "../utils/hapticsService"
import { API_CONFIG } from "../config/constants"
import { DIFFICULTY_MODES } from "../config/difficulty"
import { gameService } from "../services/gameService"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Typography } from "./ui/typography"

interface GameHistoryItemProps {
  item: GameHistoryEntry
  onPress: (item: GameHistoryEntry) => void
}

const GameHistoryItem = memo(({ item, onPress }: GameHistoryItemProps) => {
  const styles = useStyles(themedStyles)
  const posterUri = `${API_CONFIG.TMDB_IMAGE_BASE_URL_W185}${item.posterPath}`
  const difficultyLabel = DIFFICULTY_MODES[item.difficulty]?.label || "Unknown"
  const date = new Date(item.dateId)
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handlePress = () => {
    hapticsService.light()
    onPress(item)
  }

  const getResultText = () => {
    if (item.wasCorrect) {
      return (
        <Typography style={[styles.resultText, styles.winText]}>
          Correct in {item.guessCount}/{item.guessesMax} guesses!
        </Typography>
      )
    }
    return (
      <Typography style={[styles.resultText, styles.lossText]}>
        {item.gaveUp ? "Gave up" : "Incorrect"}
      </Typography>
    )
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.itemContainer,
        pressed && styles.itemPressed,
      ]}
    >
      <Image source={{ uri: posterUri }} style={styles.posterImage} />
      <View style={styles.infoContainer}>
        <Typography style={styles.movieTitle} numberOfLines={2}>
          {item.movieTitle}
        </Typography>
        <Typography style={styles.dateText}>{formattedDate}</Typography>
        <Typography style={styles.difficultyText}>
          Difficulty: {difficultyLabel}
        </Typography>
        {getResultText()}
      </View>
      <View style={styles.scoreContainer}>
        <Typography style={styles.scoreText}>{item.score}</Typography>
        <Typography style={styles.scoreLabel}>PTS</Typography>
      </View>
    </Pressable>
  )
})

interface GameHistoryProps {
  onHistoryItemPress: (item: GameHistoryEntry) => void
}

const GameHistory = ({ onHistoryItemPress }: GameHistoryProps) => {
  const { player } = useAuth()
  const styles = useStyles(themedStyles)
  const [history, setHistory] = useState<GameHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!player) return

      try {
        const fetchedHistory = await gameService.fetchGameHistory(player.id)
        setHistory(fetchedHistory)
      } catch (err: any) {
        console.error("Failed to fetch game history:", err)
        setError("Could not load game history.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [player])

  const renderItem = useCallback(
    ({ item }: { item: GameHistoryEntry }) => (
      <GameHistoryItem item={item} onPress={onHistoryItemPress} />
    ),
    [onHistoryItemPress]
  )

  if (loading) {
    return (
      <ActivityIndicator size="large" color={styles.rawTheme.colors.primary} />
    )
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Typography style={styles.emptyText}>{error}</Typography>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.dateId}-${item.movieId}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Typography style={styles.emptyText}>
              Play a game to see your history here!
            </Typography>
          </View>
        )}
      />
    </View>
  )
}

interface GameHistoryStyles {
  container: ViewStyle
  listContainer: ViewStyle
  itemContainer: ViewStyle
  itemPressed: ViewStyle
  posterImage: ImageStyle
  infoContainer: ViewStyle
  movieTitle: TextStyle
  dateText: TextStyle
  difficultyText: TextStyle
  resultText: TextStyle
  winText: TextStyle
  lossText: TextStyle
  scoreContainer: ViewStyle
  scoreText: TextStyle
  scoreLabel: TextStyle
  emptyContainer: ViewStyle
  emptyText: TextStyle
  rawTheme: Theme
}

const themedStyles = (theme: Theme): GameHistoryStyles => ({
  container: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    paddingBottom: theme.spacing.large,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.responsive.scale(8),
    marginBottom: theme.spacing.small,
    padding: theme.spacing.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemPressed: {
    backgroundColor: theme.colors.surface,
  },
  posterImage: {
    width: theme.responsive.scale(60),
    height: theme.responsive.scale(90),
    borderRadius: theme.responsive.scale(4),
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing.medium,
  },
  movieTitle: {
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(16),
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.extraSmall,
  },
  dateText: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.extraSmall,
  },
  difficultyText: {
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(12),
    color: theme.colors.primary,
    marginBottom: theme.spacing.extraSmall,
  },
  resultText: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(14),
  },
  winText: {
    color: theme.colors.success,
  },
  lossText: {
    color: theme.colors.error,
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: theme.spacing.small,
  },
  scoreText: {
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(20),
    color: theme.colors.tertiary,
  },
  scoreLabel: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(10),
    color: theme.colors.textSecondary,
    marginTop: -theme.spacing.extraSmall,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.large,
  },
  emptyText: {
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(16),
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  rawTheme: theme,
})

export default GameHistory
