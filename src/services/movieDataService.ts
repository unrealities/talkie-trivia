import { IGameDataService } from "./iGameDataService"
import { GameMode, TriviaItem, BasicTriviaItem, Hint } from "../models/trivia"
import Constants from "expo-constants"

import popularMoviesData from "../../data/popularMovies.json"

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
          value: sanitizedActors,
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
    const isE2E =
      Constants.expoConfig?.extra?.isE2E === true ||
      process.env.EXPO_PUBLIC_IS_E2E === "true"

    if (isE2E) {
      const inception = this.allMovies.find((m) => m.title === "Inception")
      // Fallback if local JSON is missing Inception (should not happen in dev but safe for E2E)
      const selectedMovie =
        inception ||
        this.allMovies[0] ||
        ({
          id: 27205,
          title: "Inception",
          overview: "Dream...",
          poster_path: "",
          release_date: "2010",
          genres: [],
          director: {},
          actors: [],
        } as any)

      return {
        dailyItem: this._transformMovieToTriviaItem(selectedMovie),
        fullItems: this.allMovies.map((m) =>
          this._transformMovieToTriviaItem(m)
        ),
        basicItems: this.allMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          releaseDate: movie.release_date,
          posterPath: movie.poster_path,
        })),
      }
    }

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

    const fullItems = this.allMovies.map((m) =>
      this._transformMovieToTriviaItem(m)
    )
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
    // --- E2E MOCK ---
    const isE2E =
      Constants.expoConfig?.extra?.isE2E === true ||
      process.env.EXPO_PUBLIC_IS_E2E === "true"

    if (isE2E && String(id) === "27205") {
      // Explicitly mock the return for the history check to avoid JSON dependency
      return {
        id: 27205,
        title: "Inception",
        description:
          "A thief who steals corporate secrets through the use of dream-sharing technology.",
        posterPath: "/9gk7admal4zlDun9ncJ7sUCKRnl.jpg",
        releaseDate: "2010-07-16",
        metadata: {
          imdb_id: "tt1375666",
          tagline: "Your mind is the scene of the crime.",
        },
        hints: [
          { type: "director", label: "Director", value: "Christopher Nolan" },
        ],
      }
    }

    const movie = this.allMovies.find((m) => m.id === Number(id))
    return movie ? this._transformMovieToTriviaItem(movie) : null
  }
}
