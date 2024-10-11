import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { BasicMovie } from '../models/movie'
import { PlayerGame } from '../models/game'
import { colors } from '../styles/global'

interface PickerContainerProps {
    enableSubmit: boolean
    movies: BasicMovie[]
    playerGame: PlayerGame
    updatePlayerGame: Dispatch<SetStateAction<PlayerGame>>
}

const PickerContainer = (props: PickerContainerProps) => {
    const defaultButtonText = 'Select a Movie'
    const [foundMovies, setFoundMovies] = useState<BasicMovie[]>(props.movies)
    const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
    const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>(defaultButtonText)
    const [searchText, setSearchText] = useState<string>('')

    useEffect(() => {
        setFoundMovies(props.movies)
    }, [props.movies])

    useEffect(() => {
        if (searchText.trim() === '') {
            setFoundMovies(props.movies)
        } else {
            const filteredMovies = props.movies.filter((movie) =>
                movie.title.toLowerCase().includes(searchText.toLowerCase())
            )
            setFoundMovies(filteredMovies)
        }
    }, [searchText, props.movies])

    const onPressCheck = () => {
        if (selectedMovieID > 0) {
            props.updatePlayerGame({
                ...props.playerGame,
                guesses: [...props.playerGame.guesses, selectedMovieID],
                correctAnswer: props.playerGame.game.movie.id === selectedMovieID,
            })
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                clearTextOnFocus={false}
                maxLength={100}
                onChangeText={(text) => setSearchText(text)}
                placeholder="search for a movie title"
                placeholderTextColor={colors.tertiary}
                style={styles.input}
                value={searchText}
            />
            <View style={styles.text}>
                {foundMovies.length > 0 ? (
                    <ScrollView style={styles.resultsShow}>
                        {foundMovies.map((movie) => (
                            <Pressable
                                key={movie.title}
                                onPress={() => {
                                    setSelectedMovieID(movie.id)
                                    setSelectedMovieTitle(movie.title)
                                }}
                                style={styles.pressableText}
                            >
                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.unselected}>
                                    {movie.title}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.noResultsText}>No movies found</Text>
                )}
            </View>
            <Pressable
                disabled={selectedMovieID === 0}
                onPress={onPressCheck}
                style={selectedMovieID > 0 ? styles.button : styles.buttonDisabled}
            >
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.buttonText}>
                    {selectedMovieTitle}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        flex: 1,
        maxHeight: 40,
        minHeight: 40,
        padding: 10,
        width: 300
    },
    buttonDisabled: {
        display: 'none'
    },
    buttonText: {
        color: colors.secondary,
        fontFamily: 'Arvo-Regular',
        fontSize: 16,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        minHeight: 180
    },
    input: {
        alignSelf: 'flex-start',
        borderColor: colors.primary,
        borderRadius: 10,
        borderWidth: 2,
        color: colors.secondary,
        fontFamily: 'Arvo-Regular',
        maxWidth: 300,
        padding: 5,
        textAlign: 'center',
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
        maxHeight: 82,
        maxWidth: 280,
        minHeight: 82
    },
    text: {
        fontFamily: 'Arvo-Regular',
        fontSize: 12,
        padding: 10,
        lineHeight: 16,
        marginBottom: 10
    },
    noResultsText: {
        fontFamily: 'Arvo-Regular',
        fontSize: 14,
        color: colors.tertiary,
        textAlign: 'center',
    },
    unselected: {
        color: colors.secondary,
        flex: 1,
        flexWrap: 'nowrap',
        fontFamily: 'Arvo-Italic'
    }
})

export default PickerContainer
