import React, { Dispatch, SetStateAction, useEffect, useState, useCallback } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { BasicMovie } from '../models/movie'
import { PlayerGame } from '../models/game'
import { colors } from '../styles/global'

interface PickerContainerProps {
    enableSubmit: boolean
    movies: BasicMovie[]
    playerGame: PlayerGame
    updatePlayerGame: Dispatch<SetStateAction<PlayerGame>>
}

const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => func(...args), delay)
    }
}

const PickerContainer = (props: PickerContainerProps) => {
    const defaultButtonText = 'Select a Movie'
    const [foundMovies, setFoundMovies] = useState<BasicMovie[]>(props.movies)
    const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
    const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>(defaultButtonText)
    const [searchText, setSearchText] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)

    useEffect(() => {
        if (props.movies.length === 0) {
            setFoundMovies([])
            setLoading(false)
        } else {
            setFoundMovies(props.movies)
            setLoading(false)
        }
    }, [props.movies])

    const debouncedFilterMovies = useCallback(
        debounce((text: string) => {
            if (text.trim() === '') {
                setFoundMovies(props.movies)
            } else {
                const filteredMovies = props.movies.filter((movie) =>
                    movie.title.toLowerCase().includes(text.toLowerCase())
                )
                setFoundMovies(filteredMovies)
            }
        }, 300),
        [props.movies]
    )

    const handleSearchChange = (text: string) => {
        setSearchText(text)
        debouncedFilterMovies(text)
    }

    const onPressCheck = () => {
        if (selectedMovieID > 0) {
            props.updatePlayerGame({
                ...props.playerGame,
                guesses: [...props.playerGame.guesses, selectedMovieID],
                correctAnswer: props.playerGame.game.movie.id === selectedMovieID,
            })
        }
    }

    const handleMovieSelection = (movie: BasicMovie) => {
        setSelectedMovieID(movie.id)
        setSelectedMovieTitle(movie.title)
        setIsButtonDisabled(false)
    }

    return (
        <View style={styles.container}>
            <TextInput
                accessible
                accessibilityLabel="Movie search input"
                clearTextOnFocus={false}
                maxLength={100}
                onChangeText={(text) => handleSearchChange(text)}
                placeholder="Search for a movie title"
                placeholderTextColor={colors.tertiary}
                style={styles.input}
                value={searchText}
                editable={props.movies.length > 0}
            />

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <View style={styles.text}>
                    {foundMovies.length > 0 ? (
                        <ScrollView style={styles.resultsShow}>
                            {foundMovies.map((movie) => (
                                <Pressable
                                    accessible
                                    accessibilityLabel={`Select movie: ${movie.title}`}
                                    key={movie.id}
                                    onPress={() => handleMovieSelection(movie)}
                                    style={[
                                        styles.pressableText,
                                        selectedMovieID === movie.id && styles.selectedMovie
                                    ]}
                                >
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.unselected}>
                                        {movie.title}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noResultsText}>No movies found</Text>
                    )}
                </View>
            )}

            <Pressable
                accessible
                accessibilityLabel={isButtonDisabled ? "Submit button disabled" : "Submit button enabled"}
                disabled={isButtonDisabled}
                onPress={onPressCheck}
                style={isButtonDisabled ? styles.buttonDisabled : styles.button}
            >
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.buttonText}>
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
        width: 300,
        opacity: 1
    },
    buttonDisabled: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        flex: 1,
        maxHeight: 40,
        minHeight: 40,
        padding: 10,
        width: 300,
        opacity: 0.5
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
        fontFamily: 'Arvo-Regular',
        padding: 5,
        borderRadius: 5
    },
    selectedMovie: {
        backgroundColor: colors.quinary
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
