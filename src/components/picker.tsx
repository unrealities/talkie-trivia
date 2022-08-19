import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import AppLoading from 'expo-app-loading'
import { Picker } from '@react-native-picker/picker'
import { useFonts, Arvo_400Regular } from '@expo-google-fonts/arvo'

import { BasicMovie } from './movie'

interface PickerContainerProps {
    enableSubmit: boolean
    guesses: number[]
    movieID: number
    movies: BasicMovie[]
    toggleModal: Dispatch<SetStateAction<boolean>>
    updateCorrectGuess: Dispatch<SetStateAction<boolean>>
    updateGuesses: Dispatch<SetStateAction<number[]>>
}

const PickerContainer = (props: PickerContainerProps) => {
    const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
    let [fontsLoaded] = useFonts({ Arvo_400Regular })

    let onPressCheck = () => {
        if (selectedMovieID > 0) {
            props.updateGuesses([...props.guesses, selectedMovieID])
        }
        if (props.movieID == selectedMovieID) {
            props.updateCorrectGuess(true)
            props.toggleModal(true)
        }
        if (props.guesses.length > 3) {
            props.toggleModal(true)
        }
    }

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={selectedMovieID}
                    style={styles.text}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedMovieID(itemValue)
                    }}>
                    <Picker.Item label="" value={0} />
                    {props.movies.map((movie) => (
                        <Picker.Item label={movie.title} value={movie.id} />
                    ))}
                </Picker>
                <Pressable
                    disabled={!props.enableSubmit}
                    onPress={onPressCheck}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Submit Guess</Text>
                </Pressable>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 10
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Arvo_400Regular',
        fontSize: 18,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 20
    },
    text: {
        fontFamily: 'Arvo_400Regular',
        fontSize: 12,
        marginBottom: 10
    }
})

export default PickerContainer
