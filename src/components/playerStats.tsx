import React, { memo, useMemo } from "react"
import { View } from "react-native"

import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import WinChart from "./winChart"
import { getPlayerStatsStyles } from "../styles/playerStatsStyles"
import { useTheme } from "../contexts/themeContext"
import StatItem from "./statItem"

export interface PlayerStatsContainerProps {
  player: Player
  playerStats: PlayerStats
}

const PlayerStatsContainer = memo(
  (props: PlayerStatsContainerProps) => {
    const { colors } = useTheme()
    const playerStatsStyles = useMemo(
      () => getPlayerStatsStyles(colors),
      [colors]
    )
    if (!props || !props.player || !props.playerStats) {
      return null
    }

    return (
      <View style={playerStatsStyles.container} key={props.player.id}>
        <WinChart wins={props.playerStats.wins} />
        <View style={playerStatsStyles.statsContainer}>
          <StatItem
            label="All-Time Score"
            value={props.playerStats.allTimeScore.toLocaleString()}
            valueStyle={playerStatsStyles.scoreText}
          />
          <StatItem label="Games Played" value={props.playerStats.games} />
          <StatItem
            label="Current Streak"
            value={props.playerStats.currentStreak}
            valueStyle={playerStatsStyles.streakText}
          />
          <StatItem
            label="Max Streak"
            value={props.playerStats.maxStreak}
            valueStyle={playerStatsStyles.streakText}
          />
          <StatItem
            label="Hints Available"
            value={props.playerStats.hintsAvailable}
          />
        </View>
      </View>
    )
  },
  (prevProps, nextProps) =>
    prevProps.player.id === nextProps.player.id &&
    prevProps.playerStats === nextProps.playerStats
)

export default PlayerStatsContainer
