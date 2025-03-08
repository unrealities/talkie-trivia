import React, { memo } from "react"
import { Text, View } from "react-native"

import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import WinChart from "./winChart"
import { playerStatsStyles } from "../styles/playerStatsStyles"

export interface PlayerStatsContainerProps {
  player: Player
  playerStats: PlayerStats
}

const PlayerStatsContainer = memo(
  (props: PlayerStatsContainerProps) => {
    return (
      <View
        style={playerStatsStyles.container}
        key={props.player.id}
        accessibilityLabel="Player Statistics"
      >
        <WinChart wins={props.playerStats.wins} />
        <View style={playerStatsStyles.statsContainer}>
          <View style={playerStatsStyles.statContainer}>
            <Text style={playerStatsStyles.header}>Games Played</Text>
            <Text style={playerStatsStyles.text}>
              {props.playerStats.games}
            </Text>
          </View>
          <View style={playerStatsStyles.statContainer}>
            <Text style={playerStatsStyles.header}>Current Streak</Text>
            <Text
              style={[playerStatsStyles.text, playerStatsStyles.streakText]}
            >
              {" "}
              {/* Apply streakText style */}
              {props.playerStats.currentStreak}
            </Text>
          </View>
          <View style={playerStatsStyles.statContainer}>
            <Text style={playerStatsStyles.header}>Max Streak</Text>
            <Text
              style={[playerStatsStyles.text, playerStatsStyles.streakText]}
            >
              {" "}
              {/* Apply streakText style */}
              {props.playerStats.maxStreak}
            </Text>
          </View>
          <View style={playerStatsStyles.statContainer}>
            <Text style={playerStatsStyles.header}>Hints Available</Text>
            <Text style={playerStatsStyles.text}>
              {props.playerStats.hintsAvailable}
            </Text>
          </View>
        </View>
      </View>
    )
  },
  (prevProps, nextProps) =>
    prevProps.player.id === nextProps.player.id &&
    prevProps.playerStats === nextProps.playerStats
)

export default PlayerStatsContainer
