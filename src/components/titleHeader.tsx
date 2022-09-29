import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colors } from '../styles/global'

const TitleHeader = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>TALKIE-TRIVIA</Text>
            <Text style={styles.subHeader}>guess the movie given it's summary</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {                
        borderBottomColor: colors.primary,
        borderBottomWidth: 2,
        borderTopColor: colors.primary,
        borderTopWidth: 2,
        borderStyle: 'solid',
        flex: 1,
        justifyContent: 'center',
        padding: 6,
        marginTop: 12,
        minHeight: 30,
        minWidth: 300
    },
    header: {
        color: colors.primary,
        flex: 1,
        fontFamily: 'Arvo-Bold',
        fontSize: 24,
        textAlign: 'center'
    },
    subHeader: {
        color: colors.secondary,
        flex: 1,
        fontFamily: 'Arvo-Italic',
        fontSize: 14,
        textAlign: 'center'
    }
})

export default TitleHeader
