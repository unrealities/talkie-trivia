import React, { useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import AppLoading from 'expo-app-loading';
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

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={selectedMovieID}
                    style={styles.text}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedMovieID(itemValue)
                    }}>
                    <Picker.Item key="0" label="" value={0} />
                    {props.movies.map((movie) => (
                        <Picker.Item key={movie.id} label={movie.title} value={movie.id} />
                    ))}
                </Picker>
                <Button
                    onPress={() => {
                        if (selectedMovieID > 0) {
                            props.updateGuesses([...props.guesses, selectedMovieID])
                        }
                        if (props.movieID == selectedMovieID) {
                            props.updateCorrectGuess(true)
                            props.toggleModal(true)
                        }
                    }}
                    disabled={props.enableSubmit}
                    title="Submit"
                    color="red"
                    accessibilityLabel="Submit your guess"
                />
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
        fontFamily: 'Arvo_400Regular',
        fontSize: 14
    },

});

export default PickerContainer
