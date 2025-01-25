import React, { lazy } from "react"
import { View } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import { appStyles } from "../../styles/appStyles"

const GoogleLogin = lazy(() => import("../../components/googleLogin"))
const PlayerStatsContainer = lazy(() => import("../../components/playerStats"))
import { useAppContext } from "../../contexts/appContext"

const ProfileScreen = () => {
  console.log("ProfileScreen is rendering")
  const { state, dispatch } = useAppContext()
  const { player, playerStats } = state

  const updatePlayer = (newPlayer) => {
    dispatch({ type: "SET_PLAYER", payload: newPlayer })
  }

  return (
    <View style={appStyles.container}>
      <React.Suspense fallback={<LoadingIndicator />}>
        <GoogleLogin player={player} onAuthStateChange={updatePlayer} />
        <PlayerStatsContainer player={player} playerStats={playerStats} />
      </React.Suspense>
    </View>
  )
}

export default ProfileScreen
