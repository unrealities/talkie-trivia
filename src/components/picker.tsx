import React, { SetStateAction, useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

import { BasicMovie } from './movie'
import { colors } from '../styles/global'

interface PickerContainerProps {
    enableSubmit: boolean
    guesses: number[]
    movieID: number
    movies: BasicMovie[]
    toggleModal: Dispatch<SetStateAction<boolean>>
    toggleSubmit: Dispatcn<SetStateAction<boolean>>
    updateCorrectGuess: Dispatch<SetStateAction<boolean>>
    updateGuesses: Dispatch<SetStateAction<number[]>>
}
const PickerContainer = (props: PickerContainerProps) => {
    const defaultButtonText = 'Select a Movie'
    const [foundMovies, setFoundMovies] = useState(props.movies)
    const [inputActive, setInputActive] = useState(false)
    const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
    const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>(defaultButtonText)
    const [searchText, setSearchText] = useState<string>('')

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

    useEffect(() => { selectedMovieID === 0 ? props.toggleSubmit(false) : props.toggleSubmit(true) })
    useEffect(() => {
        if (props.guesses.length === 0) {
            setSelectedMovieID(0)
            setSelectedMovieTitle(defaultButtonText)
            setSearchText('')
        }
        setInputActive(true)
    }, [props.guesses])

    const filter = (text) => {
        setSearchText(text)

        if (searchText !== '') {
            let results = props.movies.filter((movie) => {
                return movie.title.toLowerCase().includes(searchText.toLowerCase())
            })
            if (selectedMovieID > 0) {
                results = results.filter((movie) => {
                    if (movie.id != selectedMovieID) {
                        return movie.title.toLowerCase().includes(searchText.toLowerCase())
                    }
                })
            }
            setFoundMovies(results)
        } else {
            setFoundMovies(props.movies)
            setSelectedMovieID(0)
            setSelectedMovieTitle(defaultButtonText)
        }
    }

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
                    <ScrollView style={inputActive ? styles.resultsShow : styles.resultsHide}>
                        {foundMovies.map((movie) => (
                            <Pressable
                                key={movie.id}
                                onPress={() => {
                                    setSelectedMovieID(movie.id)
                                    setSelectedMovieTitle(movie.title)
                                    setSearchText(movie.title)
                                    setInputActive(false)
                                }}
                                style={styles.pressableText}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.unselected}>{movie.title}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </View>
            <Pressable
                disabled={!props.enableSubmit}
                onPress={onPressCheck}
                style={props.enableSubmit ? styles.button : styles.buttonDisabled}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.buttonText}>{selectedMovieTitle}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 10,
        width: 300
    },
    buttonDisabled: {
        backgroundColor: colors.tertiary,
        borderRadius: 10,
        padding: 10,
        width: 300
    },
    buttonText: {
        color: colors.secondary,
        fontFamily: 'Arvo-Regular',
        fontSize: 16,
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
        fontFamily: 'Arvo-Regular',
        maxWidth: 300,
        padding: 5,
        width: 300
    },
    pressableText: {
        flex: 1,
        flexWrap: 'nowrap',
        fontFamily: 'Arvo-Regular'
    },
    resultsHide: {
        display: 'none',
        height: 0
    },
    resultsShow: {
        flex: 1,
        maxHeight: 88,
        maxWidth: 280
    },
    text: {
        fontFamily: 'Arvo-Regular',
        fontSize: 12,
        padding: 10,
        lineHeight: 16,
        marginBottom: 10
    },
    unselected: {
        color: colors.secondary,
        flex: 1,
        flexWrap: 'nowrap',
        fontFamily: 'Arvo-Italic',
        fontStyle: 'italic'
    }
})

export default PickerContainer
