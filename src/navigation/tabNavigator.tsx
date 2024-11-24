import React from "react"
import { View } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { appStyles } from "../styles/AppStyles"
import { colors } from "../styles/global"
import GoogleLogin from "../components/googleLogin"
import MoviesContainer from "../components/movie"
import PlayerStatsContainer from "../components/playerStats"
import { Player } from "../models/player"
import { PlayerGame } from "../models/game"
import { PlayerStats } from "../models/playerStats"
import { BasicMovie } from "../models/movie"

interface TabNavigatorProps {
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  setPlayerGame: (game: PlayerGame) => void
  isNetworkConnected: boolean
  basicMovies: BasicMovie[]
}

const Tab = createBottomTabNavigator()

export const TabNavigator: React.FC<TabNavigatorProps> = ({
  player,
  playerGame,
  playerStats,
  setPlayerGame,
  isNetworkConnected,
  basicMovies,
}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarLabelStyle: { fontFamily: "Arvo-Bold", fontSize: 16 },
      }}
    >
      <Tab.Screen name="Game">
        {() => (
          <View style={appStyles.container}>
            <MoviesContainer
              isNetworkConnected={isNetworkConnected}
              movies={basicMovies}
              player={player}
              playerGame={playerGame}
              playerStats={playerStats}
              updatePlayerGame={setPlayerGame}
            />
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => (
          <View style={appStyles.container}>
            <GoogleLogin player={player} />
            <PlayerStatsContainer player={player} playerStats={playerStats} />
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
