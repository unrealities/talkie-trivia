import { IGameDataService } from "./iGameDataService"
import { GameMode, TriviaItem, BasicTriviaItem, Hint } from "../models/trivia"

// We import the raw JSON data directly
import popularMoviesData from "../../data/popularMovies.json"

// Define the shape of the raw movie data from the JSON file for type safety
interface RawMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  release_date: string
  tagline: string
  imdb_id: string
  popularity: number
  vote_average: number
  vote_count: number
  genres: { id: number; name: string }[]
  director: { id: number; name: string; imdb_id?: string }
  actors: { id: number; name: string; imdb_id?: string; order: number }[]
}

export class MovieDataService implements IGameDataService {
  public mode: GameMode = "movies"
  private allMovies: readonly RawMovie[] = popularMoviesData as RawMovie[]

  private _transformMovieToTriviaItem(movie: RawMovie): TriviaItem {
    // Sanitize actors to ensure imdb_id is null, not undefined
    const sanitizedActors = (movie.actors || []).map((actor) => ({
      ...actor,
      imdb_id: actor.imdb_id || null,
    }))

    return {
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      metadata: {
        imdb_id: movie.imdb_id || null,
        tagline: movie.tagline || null,
        popularity: movie.popularity || 0,
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        genres: movie.genres || [],
      },
      hints: [
        {
          type: "director",
          label: "Director",
          value: movie.director?.name || "N/A",
          isLinkable: !!movie.director?.imdb_id,
          metadata: { imdb_id: movie.director?.imdb_id || null },
        },
        {
          type: "actors",
          label: "Actors",
          value: sanitizedActors, // Use sanitized actor list
          isLinkable: true,
        },
        {
          type: "genre",
          label: "Genre",
          value: movie.genres?.[0]?.name || "N/A",
        },
        {
          type: "decade",
          label: "Decade",
          value: movie.release_date
            ? `${movie.release_date.substring(0, 3)}0s`
            : "N/A",
        },
      ],
    }
  }

  public async getDailyTriviaItemAndLists(): Promise<{
    dailyItem: TriviaItem
    fullItems: readonly TriviaItem[]
    basicItems: readonly BasicTriviaItem[]
  }> {
    if (!this.allMovies || this.allMovies.length === 0) {
      throw new Error("Local movie data is missing or empty.")
    }

    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 0)
    const diff = today.getTime() - startOfYear.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)

    const movieIndex = dayOfYear % this.allMovies.length
    const selectedMovie = this.allMovies[movieIndex]

    const fullItems = this.allMovies.map(this._transformMovieToTriviaItem)
    const basicItems = this.allMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path,
    }))

    return {
      dailyItem: this._transformMovieToTriviaItem(selectedMovie),
      fullItems,
      basicItems,
    }
  }

  public async getItemById(id: number | string): Promise<TriviaItem | null> {
    const movie = this.allMovies.find((m) => m.id === Number(id))
    return movie ? this._transformMovieToTriviaItem(movie) : null
  }
}
