import React from "react"
import { View } from "react-native"

import GoogleLogin from "../../components/googleLogin"
import PlayerStatsContainer from "../../components/playerStats"
import { appStyles } from "../../styles/appStyles"
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
      <GoogleLogin player={player} onAuthStateChange={updatePlayer} />
      <PlayerStatsContainer player={player} playerStats={playerStats} />
    </View>
  )
}

export default ProfileScreen
