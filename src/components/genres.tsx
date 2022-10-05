import React from 'react'
import { Text, View } from 'react-native'
import { Genre } from './movie'

interface GenresProps {
    genres: Genre[]
}

const Genres = (props: GenresProps) => {
    let displayGenres = ""
    props.genres.forEach((genre) => {
        displayGenres = displayGenres + " | " + genre.name
    })
    displayGenres = displayGenres + " | "

    return (
        <View>
            <Text>{displayGenres}</Text>
        </View>
    )
}

export default Genres
