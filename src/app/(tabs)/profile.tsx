import React, { lazy } from "react"
import { View, ScrollView } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"

const GoogleLogin = lazy(() => import("../../components/googleLogin"))
const PlayerStatsContainer = lazy(() => import("../../components/playerStats"))
const GameHistory = lazy(() => import("../../components/gameHistory")) // ADDED
import { useAuth } from "../../contexts/authContext"
import { useGame } from "../../contexts/gameContext"

const ProfileScreen: React.FC<{}> = () => {
  const { player, loading: authLoading, error: authError } = useAuth()
  const {
    playerStats,
    loading: gameDataLoading,
    error: gameDataError,
  } = useGame()

  const isLoading = authLoading || gameDataLoading
  const error = authError || gameDataError

  return (
    <ScrollView style={appStyles.container}>
      <React.Suspense fallback={<LoadingIndicator />}>
        <GoogleLogin />
        {isLoading && <LoadingIndicator />}
        {error && <ErrorMessage message={error} />}
        {!isLoading && !error && player && playerStats && (
          <>
            <PlayerStatsContainer player={player} playerStats={playerStats} />
            <GameHistory />
          </>
        )}
      </React.Suspense>
    </ScrollView>
  )
}

export default ProfileScreen
