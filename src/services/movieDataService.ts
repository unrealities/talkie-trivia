import { IGameDataService } from "./iGameDataService"
import { GameMode, TriviaItem, BasicTriviaItem } from "../models/trivia"
import { db } from "./firebaseClient"
import { doc, getDoc } from "firebase/firestore"
import { FIRESTORE_COLLECTIONS } from "../config/constants"

import basicMoviesData from "../../data/basicMovies.json"
import moviesLiteData from "../../data/moviesLite.json"

interface JsonBasicMovie {
  id: number
  title: string
  release_date: string
  poster_path: string
}

interface LiteMovie {
  id: number
  d: string // Director
  g: string[] | null // Genres
  c: string[] | null // Cast
  y: string // Year
}

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

  private basicMovies: readonly BasicTriviaItem[] = (
    basicMoviesData as JsonBasicMovie[]
  ).map((m) => ({
    id: m.id,
    title: m.title,
    releaseDate: m.release_date,
    posterPath: m.poster_path,
  }))

  private liteMovies: readonly LiteMovie[] = moviesLiteData as LiteMovie[]

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

  private _transformLiteToTriviaItem(
    lite: LiteMovie,
    basic: BasicTriviaItem,
  ): TriviaItem {
    // Handle potential nulls from JSON
    const castList = lite.c || []
    const genreList = lite.g || []
    const directorName = lite.d || "N/A"

    return {
      id: lite.id,
      title: basic.title,
      description: "",
      posterPath: basic.posterPath,
      releaseDate: basic.releaseDate,
      metadata: {},
      hints: [
        { type: "director", label: "Director", value: directorName },
        { type: "genre", label: "Genre", value: genreList[0] || "N/A" },
        {
          type: "actors",
          label: "Actors",
          value: castList.map((name) => ({ id: 0, name })),
        },
        {
          type: "decade",
          label: "Decade",
          value: lite.y ? `${lite.y.substring(0, 3)}0s` : "N/A",
        },
      ],
    }
  }

  public async getDailyTriviaItemAndLists(): Promise<{
    dailyItem: TriviaItem
    fullItems: readonly TriviaItem[]
    basicItems: readonly BasicTriviaItem[]
  }> {
    const basicItems = this.basicMovies

    // Hydrate the Lite list on demand
    // This allows the game logic to check guesses against "full" data (Implicit Feedback)
    // without actually loading the massive strings/images for every movie.
    const fullItems = this.liteMovies.map((lite) => {
      const basic = this.basicMovies.find((b) => b.id === lite.id) || {
        title: "",
        releaseDate: "",
        posterPath: "",
        id: lite.id,
      }
      return this._transformLiteToTriviaItem(lite, basic)
    })

    try {
      const today = new Date().toISOString().split("T")[0]
      const dailyGameRef = doc(db, FIRESTORE_COLLECTIONS.DAILY_GAMES, today)
      const dailyGameSnap = await getDoc(dailyGameRef)

      if (dailyGameSnap.exists()) {
        const { movieId } = dailyGameSnap.data()

        // Fetch the Rich Data for ONLY the winning movie
        const movieRef = doc(db, FIRESTORE_COLLECTIONS.MOVIES, String(movieId))
        const movieSnap = await getDoc(movieRef)

        if (movieSnap.exists()) {
          const cloudMovieData = movieSnap.data() as RawMovie
          cloudMovieData.id = movieId

          return {
            dailyItem: this._transformMovieToTriviaItem(cloudMovieData),
            fullItems,
            basicItems,
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch daily game:", error)
    }

    throw new Error("Could not load today's game.")
  }

  public async getItemById(id: number | string): Promise<TriviaItem | null> {
    try {
      const movieRef = doc(db, FIRESTORE_COLLECTIONS.MOVIES, String(id))
      const movieSnap = await getDoc(movieRef)
      if (movieSnap.exists()) {
        const data = movieSnap.data() as RawMovie
        data.id = Number(id)
        return this._transformMovieToTriviaItem(data)
      }
    } catch (error) {
      console.error("Error fetching item by ID:", error)
    }
    return null
  }
}
