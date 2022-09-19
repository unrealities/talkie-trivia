import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFonts } from 'expo-font'

import { colors } from '../styles/global'

const TitleHeader = () => {
    let [fontsLoaded] = useFonts({
        'Arvo-Bold': require('../../assets/fonts/Arvo-Bold.ttf'),
        'Arvo-Italic': require('../../assets/fonts/Arvo-Italic.ttf')
    })

    if (fontsLoaded) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>TALKIE-TRIVIA</Text>
                <Text style={styles.subHeader}>guess the movie given it's summary</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        top: 30
    },
    header: {
        borderTopColor: colors.primary,
        borderTopWidth: 2,
        color: colors.primary,
        fontFamily: 'Arvo-Bold',
        fontSize: 24,
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
