import React, { memo } from "react"
import { Text, View } from "react-native"
import { Genre } from "../models/movie"
import { genresStyles } from "../styles/genresStyles"

interface GenreProps {
  genre: Genre
}

interface GenresProps {
  genres: Genre[]
  maxGenres?: number
}

const GenreContainer = memo(({ genre }: GenreProps) => (
  <View style={genresStyles.genreContainer}>
    <Text
      style={genresStyles.genreText}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {genre.name}
    </Text>
  </View>
))

const Genres = memo(({
  genres,
  maxGenres = 5
}: GenresProps) => {
  const displayedGenres = genres.slice(0, maxGenres)

  return (
    <View style={genresStyles.genresContainer}>
      {displayedGenres.length > 0 ? (
        displayedGenres.map((genre) => (
          <GenreContainer
            key={genre.id}
            genre={genre}
          />
        ))
      ) : (
        <Text style={genresStyles.noGenresText}>No genres available</Text>
      )}
      {genres.length > maxGenres && (
        <Text style={genresStyles.noGenresText}>
          +{genres.length - maxGenres} more
        </Text>
      )}
    </View>
  )
})

export default Genres
