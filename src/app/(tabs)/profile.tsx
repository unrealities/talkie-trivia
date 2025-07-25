import React, { lazy, useState, useCallback, Suspense } from "react"
import { View, ScrollView, ActivityIndicator, StyleSheet } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"
import { useAuth } from "../../contexts/authContext"
import { useGame } from "../../contexts/gameContext"
import { GameHistoryEntry } from "../../models/gameHistory"
import { Movie } from "../../models/movie"
import { fetchMovieById } from "../../utils/firebaseService"
import { colors, responsive } from "../../styles/global"

const GoogleLogin = lazy(() => import("../../components/googleLogin"))
const PlayerStatsContainer = lazy(() => import("../../components/playerStats"))
const GameHistory = lazy(() => import("../../components/gameHistory"))
const MovieModal = lazy(() => import("../../components/modal"))
const Facts = lazy(() => import("../../components/facts"))

const ProfileScreen: React.FC<{}> = () => {
  const { player } = useAuth()
  const { playerStats, loading, error } = useGame()
  const [selectedHistoryMovie, setSelectedHistoryMovie] =
    useState<Movie | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isHistoryMovieLoading, setIsHistoryMovieLoading] = useState(false)

  const handleHistoryItemPress = useCallback(async (item: GameHistoryEntry) => {
    if (!item.movieId) return
    setIsModalVisible(true)
    setIsHistoryMovieLoading(true)
    try {
      const movie = await fetchMovieById(item.movieId)
      if (movie) {
        setSelectedHistoryMovie(movie)
      } else {
        setIsModalVisible(false)
      }
    } catch (e) {
      console.error("Failed to fetch history movie:", e)
      setIsModalVisible(false)
    } finally {
      setIsHistoryMovieLoading(false)
    }
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false)
    setSelectedHistoryMovie(null)
  }, [])

  const renderModalContent = () => {
    if (isHistoryMovieLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )
    }
    if (selectedHistoryMovie) {
      return <Facts movie={selectedHistoryMovie} />
    }
    return null
  }

  return (
    <>
      <ScrollView style={appStyles.container}>
        <Suspense fallback={<LoadingIndicator />}>
          <GoogleLogin />
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
            {/* The Suspense here handles lazy loading of the Facts component */}
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

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: responsive.scale(200),
    paddingVertical: responsive.scale(50),
    width: "100%",
  },
})

export default ProfileScreen
