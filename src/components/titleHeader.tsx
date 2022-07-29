import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const TitleHeader = () => {
    return (
        <View style={styles.container}>
            <Text>Talkie-Trivia</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 1,
        justifyContent: 'center'
    },
});

export default TitleHeader
