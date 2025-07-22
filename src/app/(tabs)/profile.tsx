import React, { lazy } from "react"
import { View, ScrollView } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"

const GoogleLogin = lazy(() => import("../../components/googleLogin"))
const PlayerStatsContainer = lazy(() => import("../../components/playerStats"))
const GameHistory = lazy(() => import("../../components/gameHistory"))
import { useAuth } from "../../contexts/authContext"
import { useGame } from "../../contexts/gameContext"

const ProfileScreen: React.FC<{}> = () => {
  const { player } = useAuth()
  const { playerStats, loading, error } = useGame()

  return (
    <ScrollView style={appStyles.container}>
      <React.Suspense fallback={<LoadingIndicator />}>
        <GoogleLogin />
        {loading && <LoadingIndicator />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && player && playerStats && (
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
