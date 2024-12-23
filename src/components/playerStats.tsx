import React from "react"
import { Text, View } from "react-native"

import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import WinChart from "./winChart"
import { playerStatsStyles } from "../styles/playerStatsStyles"

export interface PlayerStatsContainerProps {
  player: Player
  playerStats: PlayerStats
}

const PlayerStatsContainer = (props: PlayerStatsContainerProps) => {
  return (
    <View style={playerStatsStyles.container} key={props.player.id}>
      <WinChart wins={props.playerStats.wins} />
      <View style={playerStatsStyles.statsContainer}>
        <View style={playerStatsStyles.statContainer}>
          <Text style={playerStatsStyles.header}>Games Played</Text>
          <Text style={playerStatsStyles.text}>{props.playerStats.games}</Text>
        </View>
        <View style={playerStatsStyles.statContainer}>
          <Text style={playerStatsStyles.header}>Current Streak</Text>
          <Text style={playerStatsStyles.text}>
            {props.playerStats.currentStreak}
          </Text>
        </View>
        <View style={playerStatsStyles.statContainer}>
          <Text style={playerStatsStyles.header}>Max Streak</Text>
          <Text style={playerStatsStyles.text}>
            {props.playerStats.maxStreak}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PlayerStatsContainer
