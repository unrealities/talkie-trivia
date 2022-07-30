import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppLoading from 'expo-app-loading';
import { useFonts, Arvo_400Regular } from '@expo-google-fonts/arvo'

const TitleHeader = () => {
    let [fontsLoaded] = useFonts({
        Arvo_400Regular,
    })

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>TALKIE-TRIVIA</Text>
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
    text: {
        color: 'red',
        fontFamily: 'Arvo_400Regular',
        fontSize: 24,
    }
});

export default TitleHeader
