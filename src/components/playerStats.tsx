import React from "react"
import { StyleSheet, Text, View } from "react-native"

import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import WinChart from "./winChart"
import { colors } from "../styles/global"

export interface PlayerStatsContainerProps {
  player: Player
  playerStats: PlayerStats
}

const PlayerStatsContainer = (props: PlayerStatsContainerProps) => {
  return (
    <View style={styles.container} key={props.player.id}>
      <WinChart wins={props.playerStats.wins} />
      <View style={styles.statsContainer}>
        <View style={styles.statContainer}>
          <Text style={styles.header}>Games Played</Text>
          <Text style={styles.text}>{props.playerStats.games}</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.header}>Current Streak</Text>
          <Text style={styles.text}>{props.playerStats.currentStreak}</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.header}>Max Streak</Text>
          <Text style={styles.text}>{props.playerStats.maxStreak}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flex: 1,
    padding: 8,
    textAlign: "center",
    width: "90%"
  },
  header: {
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: 12,
    minWidth: 100,
    textAlign: "left"
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4
  },
  statsContainer: {
    alignItems: "center",
    paddingTop: 10,
    width: "100%"
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: 12,
    paddingLeft: 12,
    textAlign: "left"
  },
})

export default PlayerStatsContainer
