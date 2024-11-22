import React from "react"
import { Text, View } from "react-native"
import { Genre } from "../models/movie"
import { genresStyles } from "../styles/genresStyles"

interface GenreProps {
  genre: Genre
}
interface GenresProps {
  genres: Genre[]
}

const GenreContainer = ({ genre }: GenreProps) => (
  <View style={genresStyles.genreContainer}>
    <Text style={genresStyles.genreText}>{genre.name}</Text>
  </View>
)

const Genres = ({ genres }: GenresProps) => (
  <View style={genresStyles.genresContainer}>
    {genres.length > 0 ? (
      genres.map((genre) => <GenreContainer key={genre.id} genre={genre} />)
    ) : (
      <Text style={genresStyles.noGenresText}>No genres available</Text>
    )}
  </View>
)

export default Genres
