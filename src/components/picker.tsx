import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
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

// TODO: Implement custom searchable list picker
// https://www.kindacode.com/article/how-to-create-a-filter-search-list-in-react/
const PickerContainer = (props: PickerContainerProps) => {
    const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
    const [foundMovies, setFoundMovies] = useState(props.movies);
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
        const keyword = e.target.value;

        if (keyword !== '') {
            const results = props.movies.filter((movie) => {
                return movie.title.toLowerCase().startsWith(keyword.toLowerCase())
            })
            setFoundMovies(results);
        } else {
            setFoundMovies(props.movies)
        }

        setSelectedMovieID(keyword);
    }

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <View style={styles.container}>
                <input
                    type="search"
                    value={name}
                    onChange={filter}
                    className="input"
                    placeholder="search for a movie title"
                />

                <div style={styles.text}>
                    {foundMovies && foundMovies.length > 0 ? (
                        foundMovies.map((movie) => (
                            <li key={movie.id} className="user">
                                <span className="movie-name">{movie.name}</span>
                            </li>
                        ))
                    ) : (
                        <h1>No results found!</h1>
                    )}
                </div>
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
