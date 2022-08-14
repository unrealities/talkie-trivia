import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppLoading from 'expo-app-loading';
import { useFonts, Arvo_700Bold, Arvo_400Regular_Italic } from '@expo-google-fonts/arvo'

const TitleHeader = () => {
    let [fontsLoaded] = useFonts({ Arvo_700Bold, Arvo_400Regular_Italic })

    if (!fontsLoaded) {
        return <AppLoading />;
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
        padding: 1
    },
    header: {
        color: 'red',
        fontFamily: 'Arvo_700Bold',
        fontSize: 24,
        fontWeight: '700'
    },
    subHeader: {
        fontFamily: 'Arvo_400Regular_Italic',
        fontSize: 18,
        fontStyle: 'italic'
    }
});

export default TitleHeader
