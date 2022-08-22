import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import AppLoading from 'expo-app-loading'
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
    const [searchText, setSearchText] = useState<string>('')
    const [foundMovies, setFoundMovies] = useState(props.movies)
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

    const filter = (e) => {
        const keyword = e.target.value

        if (keyword !== '') {
            const results = props.movies.filter((movie) => {
                return movie.title.toLowerCase().startsWith(keyword.toLowerCase())
            })
            setFoundMovies(results)
            setSearchText(keyword)
        } else {
            setFoundMovies(props.movies)
        }
    }

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <View style={styles.container}>
                <TextInput
                    value={searchText}
                    onChangeText={filter}
                    placeholder="search for a movie title"
                    style={styles.input}
                />

                <View style={styles.text}>
                    {foundMovies && foundMovies.length > 0 ? (
                        foundMovies.slice(0,5).map((movie) => (
                            <Pressable key={movie.id} onPress={() => {setSelectedMovieID(movie.id)}}>
                                <span className={selectedMovieID == movie.id ? 'selected' : ''}>{movie.title}</span>
                            </Pressable>
                        ))
                    ) : (
                        <li></li>
                    )}
                </View>
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
    input: {
        borderWidth: 2,
        padding: 5,
        width: 300
    },
    selected: {
        backgroundColor: 'light red'
    },
    text: {
        fontFamily: 'Arvo_400Regular',
        fontSize: 12,
        marginBottom: 10
    }
})

export default PickerContainer
