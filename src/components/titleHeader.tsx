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
        flex: 1,
        justifyContent: 'center',
        minHeight: 60
    },
    header: {
        borderTopColor: colors.primary,
        borderTopWidth: 2,
        color: colors.primary,
        fontFamily: 'Arvo-Bold',
        fontSize: 24,
        marginTop: 8,
        paddingTop: 8,
        textAlign: 'center'
    },
    subHeader: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 2,
        color: colors.secondary,
        fontFamily: 'Arvo-Italic',
        fontSize: 18,
        paddingBottom: 8,
        textAlign: 'center'
    }
})

export default TitleHeader
