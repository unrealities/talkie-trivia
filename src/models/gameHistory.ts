export class GameHistoryEntry {
  dateId: string // YYYY-MM-DD
  movieId: number
  movieTitle: string
  posterPath: string
  wasCorrect: boolean
  gaveUp: boolean
  guessCount: number
  guessesMax: number

  constructor(
    dateId: string,
    movieId: number,
    movieTitle: string,
    posterPath: string,
    wasCorrect: boolean,
    gaveUp: boolean,
    guessCount: number,
    guessesMax: number
  ) {
    this.dateId = dateId
    this.movieId = movieId
    this.movieTitle = movieTitle
    this.posterPath = posterPath
    this.wasCorrect = wasCorrect
    this.gaveUp = gaveUp
    this.guessCount = guessCount
    this.guessesMax = guessesMax
  }
}
