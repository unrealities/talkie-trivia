import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import AppLoading from 'expo-app-loading'
import { useFonts, Arvo_400Regular } from '@expo-google-fonts/arvo'

import { BasicMovie } from './movie'
import { colors } from '../styles/global'

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
    const [foundMovies, setFoundMovies] = useState(props.movies)
    const [inputActive, setInputActive] = useState(false)
    const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
    const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>('')
    const [searchText, setSearchText] = useState<string>('')
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
                    clearTextOnFocus={true}
                    maxLength={100}
                    onChangeText={text => filter(text)}
                    onFocus={() => setInputActive(true)}
                    placeholder="search for a movie title"
                    placeholderTextColor={colors.tertiary}
                    style={styles.input}
                    value={searchText}
                />

                <View style={styles.text}>
                    {foundMovies && foundMovies.length > 0 && (
                        <View style={inputActive ? styles.resultsShow : styles.resultsHide}>
                            {foundMovies.slice(0, 5).map((movie) => (
                                <Pressable key={movie.id} onPress={() => { setSelectedMovieID(movie.id); setSelectedMovieTitle(movie.title); setSearchText(movie.title); setInputActive(false) }}>
                                    <Text style={styles.unselected}>{movie.title}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                    {selectedMovieID > 0 && (
                        <Pressable key={selectedMovieID} onPress={() => { setSelectedMovieID(0); setSelectedMovieTitle(''); setSearchText(selectedMovieTitle) }}>
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
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 10
    },
    buttonText: {
        color: colors.secondary,
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
        borderColor: colors.primary,
        borderRadius: 10,
        borderWidth: 2,
        color: colors.secondary,
        padding: 5,
        width: 300
    },
    resultsHide: {
        display: 'none'
    },
    resultsShow: {
        flex: 1
    },
    selected: {
        color: colors.primary,
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
        color: colors.secondary,
        fontStyle: 'italic'
    }
})

export default PickerContainer
