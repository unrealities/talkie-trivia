import React from "react"
import { View } from "react-native"

import GoogleLogin from "../src/components/googleLogin"
import PlayerStatsContainer from "../src/components/playerStats"
import { appStyles } from "../src/styles/AppStyles"
import { useAppContext } from "../src/contexts/AppContext"

const ProfileScreen = () => {
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
