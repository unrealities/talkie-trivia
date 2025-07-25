import React, { lazy, useState, useCallback } from "react"
import { View, ScrollView, ActivityIndicator } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"
import { useAuth } from "../../contexts/authContext"
import { useGame } from "../../contexts/gameContext"
import { GameHistoryEntry } from "../../models/gameHistory"
import { Movie } from "../../models/movie"
import { fetchMovieById } from "../../utils/firebaseService"
import { colors } from "../../styles/global"

const GoogleLogin = lazy(() => import("../../components/googleLogin"))
const PlayerStatsContainer = lazy(() => import("../../components/playerStats"))
const GameHistory = lazy(() => import("../../components/gameHistory"))
const MovieModal = lazy(() => import("../../components/modal"))

const ProfileScreen: React.FC<{}> = () => {
  const { player } = useAuth()
  const { playerStats, loading, error } = useGame()
  const [selectedHistoryMovie, setSelectedHistoryMovie] =
    useState<Movie | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isHistoryMovieLoading, setIsHistoryMovieLoading] = useState(false)

  const handleHistoryItemPress = useCallback(async (item: GameHistoryEntry) => {
    if (!item.movieId) return
    setIsHistoryMovieLoading(true)
    setIsModalVisible(true)
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

  return (
    <>
      <ScrollView style={appStyles.container}>
        <React.Suspense fallback={<LoadingIndicator />}>
          <GoogleLogin />
          {loading && <LoadingIndicator />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && player && playerStats && (
            <>
              <PlayerStatsContainer player={player} playerStats={playerStats} />
              {/* --- UX IMPROVEMENT: Pass the handler to GameHistory --- */}
              <GameHistory onHistoryItemPress={handleHistoryItemPress} />
            </>
          )}
        </React.Suspense>
      </ScrollView>

      {isModalVisible && (
        <React.Suspense fallback={null}>
          <MovieModal show={isModalVisible} toggleModal={handleModalClose}>
            {isHistoryMovieLoading ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : selectedHistoryMovie ? (
              <Facts movie={selectedHistoryMovie} />
            ) : null}
          </MovieModal>
        </React.Suspense>
      )}
    </>
  )
}

export default ProfileScreen
