import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppLoading from 'expo-app-loading';
import { useFonts, Arvo_400Regular, Arvo_400Regular_Italic } from '@expo-google-fonts/arvo'

const TitleHeader = () => {
    let [fontsLoaded] = useFonts({
        Arvo_400Regular,
    })

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>TALKIE-TRIVIA</Text>
                <Text style={styles.subHeader}>text movie trivia</Text>
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
        fontFamily: 'Arvo_400Regular',
        fontSize: 24,
    },
    subHeader: {
        fontFamily: 'Arvo_400Regular_Italic',
        fontSize: 18,
        fontStyle: 'italic'
    }
});

export default TitleHeader
