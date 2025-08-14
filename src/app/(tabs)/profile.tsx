import React, {
  lazy,
  useState,
  useCallback,
  Suspense,
  useMemo,
  useEffect,
} from "react"
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { getAppStyles } from "../../styles/appStyles"
import { useAuth } from "../../contexts/authContext"
import { useGame } from "../../contexts/gameContext"
import { GameHistoryEntry } from "../../models/gameHistory"
import { Movie, BasicMovie } from "../../models/movie"
import {
  fetchMovieById,
  fetchPlayerGameById,
} from "../../utils/firebaseService"
import { responsive, spacing } from "../../styles/global"
import { useTheme } from "../../contexts/themeContext"
import { PlayerGame } from "../../models/game"

const GoogleLogin = lazy(() => import("../../components/googleLogin"))
const PlayerStatsContainer = lazy(() => import("../../components/playerStats"))
const GameHistory = lazy(() => import("../../components/gameHistory"))
const MovieModal = lazy(() => import("../../components/modal"))
const Facts = lazy(() => import("../../components/facts"))
const ThemeSelector = lazy(() => import("../../components/themeSelector"))
const GuessesContainer = lazy(() => import("../../components/guesses"))
const DifficultySelector = lazy(
  () => import("../../components/difficultySelector")
)

const ProfileScreen: React.FC<{}> = () => {
  const { player } = useAuth()
  const { playerStats, loading, error, basicMovies } = useGame()
  const { colors } = useTheme()
  const appStyles = useMemo(() => getAppStyles(colors), [colors])

  const [selectedHistoryMovie, setSelectedHistoryMovie] =
    useState<Movie | null>(null)
  const [selectedPlayerGame, setSelectedPlayerGame] =
    useState<PlayerGame | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isHistoryMovieLoading, setIsHistoryMovieLoading] = useState(false)

  const handleHistoryItemPress = useCallback(
    async (item: GameHistoryEntry) => {
      if (!item.movieId || !player) return
      setIsModalVisible(true)
      setIsHistoryMovieLoading(true)
      try {
        const playerGameId = `${player.id}-${item.dateId}`
        const [movie, playerGame] = await Promise.all([
          fetchMovieById(item.movieId),
          fetchPlayerGameById(playerGameId),
        ])

        if (movie && playerGame) {
          setSelectedHistoryMovie(movie)
          setSelectedPlayerGame(playerGame)
        } else {
          console.warn("Could not find movie or game history details.")
          setIsModalVisible(false)
        }
      } catch (e) {
        console.error("Failed to fetch history movie:", e)
        setIsModalVisible(false)
      } finally {
        setIsHistoryMovieLoading(false)
      }
    },
    [player]
  )

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false)
    setSelectedHistoryMovie(null)
    setSelectedPlayerGame(null)
  }, [])

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
    if (isHistoryMovieLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )
    }
    if (selectedHistoryMovie) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Facts movie={selectedHistoryMovie} isScrollEnabled={false} />
          {selectedPlayerGame && (
            <View>
              <Text style={styles.historyGuessesTitle}>Your Guesses</Text>
              <Suspense fallback={<LoadingIndicator />}>
                <GuessesContainer
                  gameForDisplay={selectedPlayerGame}
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
    <>
      <ScrollView style={appStyles.container}>
        <Suspense fallback={<LoadingIndicator />}>
          <GoogleLogin />
          <ThemeSelector />
          <DifficultySelector />
          {loading && <LoadingIndicator />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && player && playerStats && (
            <>
              <PlayerStatsContainer player={player} playerStats={playerStats} />
              <GameHistory onHistoryItemPress={handleHistoryItemPress} />
            </>
          )}
        </Suspense>
      </ScrollView>

      {isModalVisible && (
        <Suspense fallback={null}>
          <MovieModal show={isModalVisible} toggleModal={handleModalClose}>
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
      )}
    </>
  )
}

export default ProfileScreen
