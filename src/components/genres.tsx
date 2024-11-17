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

const GenreContainer = ({ genre }: GenreProps) => (
    <View style={styles.genreContainer}>
        <Text style={styles.genreText}>{genre.name}</Text>
    </View>
)

const Genres = ({ genres }: GenresProps) => (
    <View style={styles.genresContainer}>
        {genres.length > 0 ? (
            genres.map((genre) => <GenreContainer key={genre.id} genre={genre} />)
        ) : (
            <Text style={styles.noGenresText}>No genres available</Text>
        )}
    </View>
)

const styles = StyleSheet.create({
    genreContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: colors.quaternary,
        borderRadius: 8,
        margin: 6,
        maxHeight: 44,
        minHeight: 26,
        minWidth: 80,
        maxWidth: 220,
        padding: 6
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    genreText: {
        color: colors.secondary,
        fontFamily: 'Arvo-Bold',
        fontSize: 12,
        textAlign: 'center'
    },
    noGenresText: {
        color: colors.secondary,
        fontFamily: 'Arvo-Italic',
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 10,
    }
})

export default Genres
