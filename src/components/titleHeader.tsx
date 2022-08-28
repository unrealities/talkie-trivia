import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppLoading from 'expo-app-loading'
import { useFonts, Arvo_700Bold, Arvo_400Regular_Italic } from '@expo-google-fonts/arvo'

import { colors } from '../styles/global'

const TitleHeader = () => {
    let [fontsLoaded] = useFonts({ Arvo_700Bold, Arvo_400Regular_Italic })

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
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
        fontFamily: 'Arvo_700Bold',
        fontSize: 24,
        fontWeight: '700',
        paddingTop: 8,
        textAlign: 'center'
    },
    subHeader: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 2,
        color: colors.secondary,
        fontFamily: 'Arvo_400Regular_Italic',
        fontSize: 18,
        fontStyle: 'italic',
        paddingBottom: 8,
        textAlign: 'center'
    }
})

export default TitleHeader
