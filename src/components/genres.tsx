import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../styles/global'
import { Genre } from '../models/movie'

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
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: colors.tertiary,
        borderRadius: 8,
        flex: 1,
        margin: 6,
        maxHeight: 44,
        minHeight: 26,
        minWidth: 80,
        padding: 6
    },
    GenresContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWarp: 'wrap',
        margin: 10,
        minHeight: 20,
        minWidth: 80
    },
    GenreText: {
        alignItems: 'center',
        alignSelf: 'center',
        color: colors.secondary,
        flex: 1,
        fontFamily: 'Arvo-Bold',
        fontSize: 12,
        textAlign: 'center'
    }
})

export default Genres
