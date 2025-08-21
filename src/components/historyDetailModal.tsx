import React, { useState, useEffect, Suspense, lazy, useMemo } from "react"
import {
  View,
  ActivityIndicator,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native"
import { GameHistoryEntry } from "../models/gameHistory"
import { Movie } from "../models/movie"
import { PlayerGame } from "../models/game"
import { useAuth } from "../contexts/authContext"
import { useGameState } from "../contexts/gameStateContext"
import { gameService } from "../services/gameService"
import { useTheme } from "../contexts/themeContext"
import { responsive, spacing } from "../styles/global"
import LoadingIndicator from "./loadingIndicator"

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
  const { basicMovies } = useGameState()
  const { colors } = useTheme()

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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        loadingContainer: {
          justifyContent: "center",
          alignItems: "center",
          minHeight: responsive.scale(200),
          paddingVertical: responsive.scale(50),
          width: "100%",
        },
        errorContainer: {
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.large,
        },
        errorText: {
          fontFamily: "Arvo-Regular",
          fontSize: responsive.responsiveFontSize(16),
          color: colors.error,
          textAlign: "center",
        },
        historyGuessesTitle: {
          fontFamily: "Arvo-Bold",
          fontSize: responsive.responsiveFontSize(18),
          color: colors.primary,
          textAlign: "center",
          marginTop: spacing.large,
          marginBottom: spacing.small,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: spacing.medium,
        },
      }),
    [colors]
  )

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )
    }
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )
    }
    if (movie) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Facts movie={movie} isScrollEnabled={false} />
          {playerGame && (
            <View>
              <Text style={styles.historyGuessesTitle}>Your Guesses</Text>
              <Suspense fallback={<LoadingIndicator />}>
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
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          }
        >
          {renderModalContent()}
        </Suspense>
      </MovieModal>
    </Suspense>
  )
}

export default HistoryDetailModal
