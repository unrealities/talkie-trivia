import React, { memo } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Genre } from "../models/movie"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Typography } from "./ui/typography"

interface GenreProps {
  genre: Genre
}

const GenreContainer = memo(({ genre }: GenreProps) => {
  const styles = useStyles(themedStyles)
  return (
    <View style={styles.genreContainer}>
      <Typography
        style={styles.genreText}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {genre.name}
      </Typography>
    </View>
  )
})

interface GenresProps {
  genres: Genre[]
  maxGenres?: number
}

const Genres = memo(({ genres, maxGenres = 5 }: GenresProps) => {
  const styles = useStyles(themedStyles)
  const displayedGenres = genres.slice(0, maxGenres)

  return (
    <View style={styles.genresContainer}>
      {displayedGenres.length > 0 ? (
        displayedGenres.map((genre) => (
          <GenreContainer key={genre.id} genre={genre} />
        ))
      ) : (
        <Typography style={styles.noGenresText}>No genres available</Typography>
      )}
      {genres.length > maxGenres && (
        <Typography style={styles.noGenresText}>
          +{genres.length - maxGenres} more
        </Typography>
      )}
    </View>
  )
})

interface GenresStyles {
  genresContainer: ViewStyle
  genreContainer: ViewStyle
  genreText: TextStyle
  noGenresText: TextStyle
}

const themedStyles = (theme: Theme): GenresStyles => ({
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
  },
  genreContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.colors.quinary,
    borderRadius: theme.responsive.scale(10),
    margin: theme.spacing.extraSmall,
    padding: theme.spacing.small,
    flexBasis: "auto",
    flexGrow: 1,
    flexShrink: 1,
    minHeight: theme.responsive.scale(30),
  },
  genreText: {
    color: theme.colors.textPrimary,
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(14),
    textAlign: "center",
  },
  noGenresText: {
    color: theme.colors.tertiary,
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(12),
    textAlign: "center",
    marginVertical: theme.spacing.small,
  },
})

export default Genres
