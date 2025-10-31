import React, { useState, useEffect, Suspense, lazy } from "react"
import {
  View,
  ActivityIndicator,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native"
import { GameHistoryEntry } from "../models/gameHistory"
import { Movie } from "../models/movie"
import { PlayerGame } from "../models/game"
import { useAuth } from "../contexts/authContext"
import { gameService } from "../services/gameService"
import { useGameStore } from "../state/gameStore"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Typography } from "./ui/typography"

const MovieModal = lazy(() => import("./modal"))
const Facts = lazy(() => import("./facts"))
const GuessesContainer = lazy(() => import("./guesses"))

interface HistoryDetailModalProps {
  historyItem: GameHistoryEntry | null
  onClose: () => void
}

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  historyItem,
  onClose,
}) => {
  const { player } = useAuth()
  const basicMovies = useGameStore((state) => state.basicMovies)
  const styles = useStyles(themedStyles)

  const [movie, setMovie] = useState<Movie | null>(null)
  const [playerGame, setPlayerGame] = useState<PlayerGame | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!historyItem || !player) {
      setMovie(null)
      setPlayerGame(null)
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const playerGameId = `${player.id}-${historyItem.dateId}`
        const [fetchedMovie, fetchedPlayerGame] = await Promise.all([
          gameService.fetchMovieById(historyItem.movieId),
          gameService.fetchPlayerGameById(playerGameId),
        ])

        if (fetchedMovie && fetchedPlayerGame) {
          setMovie(fetchedMovie)
          setPlayerGame(fetchedPlayerGame)
        } else {
          throw new Error("Could not find movie or game history details.")
        }
      } catch (e: any) {
        console.error("Failed to fetch history details:", e)
        setError(e.message || "Failed to load history.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [historyItem, player])

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={styles.rawTheme.colors.primary}
          />
        </View>
      )
    }
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Typography variant="error">{error}</Typography>
        </View>
      )
    }
    if (movie) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Facts movie={movie} isScrollEnabled={false} />
          {playerGame && (
            <View>
              <Typography variant="h2" style={styles.guessesTitle}>
                Your Guesses
              </Typography>
              <Suspense fallback={<ActivityIndicator />}>
                <GuessesContainer
                  gameForDisplay={playerGame}
                  allMoviesForDisplay={basicMovies}
                  lastGuessResult={null}
                />
              </Suspense>
            </View>
          )}
        </ScrollView>
      )
    }
    return null
  }

  return (
    <Suspense fallback={null}>
      <MovieModal show={!!historyItem} toggleModal={onClose}>
        <Suspense
          fallback={
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={styles.rawTheme.colors.primary}
              />
            </View>
          }
        >
          {renderModalContent()}
        </Suspense>
      </MovieModal>
    </Suspense>
  )
}

interface HistoryDetailModalStyles {
  loadingContainer: ViewStyle
  errorContainer: ViewStyle
  guessesTitle: TextStyle
  rawTheme: Theme
}

const themedStyles = (theme: Theme): HistoryDetailModalStyles => ({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: theme.responsive.scale(300),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.large,
    minHeight: theme.responsive.scale(300),
  },
  guessesTitle: {
    fontSize: theme.responsive.responsiveFontSize(20),
    textAlign: "center",
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.medium,
  },
  rawTheme: theme,
})

export default HistoryDetailModal
