import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Player from '../models/player'
import PlayerStats from '../models/playerStats'
import WinChart from './winChart'
import { colors } from '../styles/global'

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
        alignItems: 'flex-start',
        flex: 1,
        minWidth: 140,
        padding: 8,
        textAlign: 'center',
        width: 300
    },
    header: {
        color: colors.primary,
        flex: 1,
        flexDirection: 'row',
        fontFamily: 'Arvo-Bold',
        fontSize: 12,
        minWidth: 100,
        textAlign: 'left'
    },
    statContainer: {
        flex: 1,
        flexDirection: 'row',
        maxHeight: 20
    },
    statsContainer :{
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10,
        width: 300
    },
    text: {
        color: colors.secondary,
        flex: 1,
        flexDirection: 'row',
        fontFamily: 'Arvo-Regular',
        fontSize: 12,
        paddingLeft: 12,
        textAlign: 'left'
    }
})

export default PlayerStatsContainer
