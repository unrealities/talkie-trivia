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
    const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>('')
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

    const filter = (text) => {
        setSearchText(text)

        if (searchText !== '') {
            let results = props.movies.filter((movie) => {
                return movie.title.toLowerCase().startsWith(searchText.toLowerCase())
            })
            if (selectedMovieID > 0) {
                results = results.filter((movie) => {
                    if (movie.id != selectedMovieID) {
                        return movie.title.toLowerCase().startsWith(searchText.toLowerCase())
                    }
                })
            }
            setFoundMovies(results)
        } else {
            setFoundMovies(props.movies)
            setSelectedMovieID(0)
            setSelectedMovieTitle('')
        }
    }

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <View style={styles.container}>
                <TextInput
                    defaultValue={searchText}
                    onChangeText={text => filter(text)}
                    placeholder="search for a movie title"
                    value={searchText}
                    style={styles.input}
                />

                <View style={styles.text}>
                    {foundMovies && foundMovies.length > 0 ? (
                        foundMovies.slice(0,5).map((movie) => (
                            <Pressable key={movie.id} onPress={() => {setSelectedMovieID(movie.id); setSelectedMovieTitle(movie.title); setSearchText(movie.title)}}>
                                <Text style={styles.unselected}>{movie.title}</Text>
                            </Pressable>
                        ))
                    ) : (
                        <Text>No Movie Found</Text>
                    )}
                    {selectedMovieID > 0 && (
                        <Pressable key={selectedMovieID} onPress={() => {setSelectedMovieID(0); setSelectedMovieTitle(''); setSearchText(selectedMovieTitle)}}>
                            <Text style={styles.selected}>{selectedMovieTitle}</Text>
                        </Pressable>
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
        borderColor: 'red',
        borderRadius: 10,
        borderWidth: 2,
        color: 'grey',
        padding: 5,
        width: 300
    },
    selected: {
        color: 'red',
        fontWeight: 'bold',
        paddingTop: 10
    },
    text: {
        fontFamily: 'Arvo_400Regular',
        fontSize: 12,
        padding: 10,
        lineHeight: 16,
        marginBottom: 10
    },
    unselected: {
        fontStyle: 'italic'
    }
})

export default PickerContainer
