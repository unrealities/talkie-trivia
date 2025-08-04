import React, { memo, useMemo } from "react"
import { Text, View } from "react-native"
import { Genre } from "../models/movie"
import { getGenresStyles } from "../styles/genresStyles"
import { useTheme } from "../contexts/themeContext"

interface GenreProps {
  genre: Genre
}

interface GenresProps {
  genres: Genre[]
  maxGenres?: number
}

const GenreContainer = memo(({ genre }: GenreProps) => {
  const { colors } = useTheme()
  const genresStyles = useMemo(() => getGenresStyles(colors), [colors])
  return (
    <View style={genresStyles.genreContainer}>
      <Text
        style={genresStyles.genreText}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {genre.name}
      </Text>
    </View>
  )
})

const Genres = memo(
  ({ genres, maxGenres = 5 }: GenresProps) => {
    const { colors } = useTheme()
    const genresStyles = useMemo(() => getGenresStyles(colors), [colors])
    const displayedGenres = genres.slice(0, maxGenres)

    return (
      <View style={genresStyles.genresContainer}>
        {displayedGenres.length > 0 ? (
          displayedGenres.map((genre) => (
            <GenreContainer key={genre.id} genre={genre} />
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
  },
  (prevProps, nextProps) =>
    prevProps.genres === nextProps.genres &&
    prevProps.maxGenres === nextProps.maxGenres
)

export default Genres
