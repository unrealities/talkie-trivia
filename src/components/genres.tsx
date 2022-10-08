import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../styles/global'
import { Genre } from './movie'

interface GenreProps {
    genre: Genre
}
interface GenresProps {
    genres: Genre[]
}

const GenreContainer = (props: GenreProps) => {
    return (
        <View style={styles.GenreContainer}>
            <Text key={props.genre.id} style={styles.GenreText}>{props.genre.name}</Text>
        </View>
    )
}

const Genres = (props: GenresProps) => {
    return (
        <View style={styles.GenresContainer}>
            {props.genres.map((genre) => { return <GenreContainer genre={genre} /> })}
        </View>
    )
}

const styles = StyleSheet.create({
    GenreContainer: {
        backgroundColor: colors.tertiary,
        borderColor: colors.primary,
        borderRadius: 8,
        height: 26,
        margin: 4,
        padding: 6
    },
    GenresContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWarp: 'wrap',
        margin: 10
    },
    GenreText: {
        color: colors.secondary,
        fontFamily: 'Arvo-Bold',
        fontSize: 12
    }
})

export default Genres
