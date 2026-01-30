import { IGameDataService } from "./iGameDataService"
import { GameMode, TriviaItem, BasicTriviaItem } from "../models/trivia"
import { db } from "./firebaseClient"
import { doc, getDoc } from "firebase/firestore"
import { FIRESTORE_COLLECTIONS } from "../config/constants"

// 1. IMPORT LOCAL DATA
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

  // --- HELPER: Fetch a specific date's game from Firestore ---
  private async _fetchGameForDate(dateStr: string): Promise<RawMovie | null> {
    console.log(`[MovieDataService] 🔍 Checking Firestore for date: ${dateStr}`)

    try {
      // 1. Get the Schedule Document
      const dailyGameRef = doc(db, FIRESTORE_COLLECTIONS.DAILY_GAMES, dateStr)
      const dailyGameSnap = await getDoc(dailyGameRef)

      if (!dailyGameSnap.exists()) {
        console.log(
          `[MovieDataService] ⚠️ No document found in 'dailyGames' for ID: ${dateStr}`,
        )
        return null
      }

      const data = dailyGameSnap.data()
      console.log(`[MovieDataService] ✅ Found Schedule:`, data)
      const { movieId } = data

      if (!movieId) {
        console.error(
          `[MovieDataService] ❌ Error: 'movieId' is missing from dailyGames document!`,
        )
        return null
      }

      // 2. Get the Actual Movie Data
      console.log(
        `[MovieDataService] 🎬 Fetching Movie details for ID: ${movieId}`,
      )
      const movieRef = doc(db, FIRESTORE_COLLECTIONS.MOVIES, String(movieId))
      const movieSnap = await getDoc(movieRef)

      if (movieSnap.exists()) {
        const cloudMovieData = movieSnap.data() as RawMovie
        cloudMovieData.id = movieId
        console.log(
          `[MovieDataService] ✨ Successfully loaded movie: ${cloudMovieData.title}`,
        )
        return cloudMovieData
      } else {
        console.error(
          `[MovieDataService] ❌ Movie ID ${movieId} is scheduled, but NOT found in 'movies' collection!`,
        )
      }
    } catch (error: any) {
      console.error(
        `[MovieDataService] 💥 CRITICAL ERROR fetching ${dateStr}:`,
        error.message,
        error,
      )
    }
    return null
  }

  public async getDailyTriviaItemAndLists(): Promise<{
    dailyItem: TriviaItem
    fullItems: readonly TriviaItem[]
    basicItems: readonly BasicTriviaItem[]
  }> {
    const basicItems = this.basicMovies

    // Hydrate lite list for Implicit Feedback logic
    const fullItems = this.liteMovies.map((lite) => {
      const basic = this.basicMovies.find((b) => b.id === lite.id) || {
        title: "",
        releaseDate: "",
        posterPath: "",
        id: lite.id,
      }
      return this._transformLiteToTriviaItem(lite, basic)
    })

    // 1. Try TODAY (Local Time)
    const today = new Date()
    // Explicitly using the user's locale but forcing YYYY-MM-DD format manually to be safe
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const todayStr = `${year}-${month}-${day}`

    let rawMovie = await this._fetchGameForDate(todayStr)

    // 2. Fallback: Try YESTERDAY
    if (!rawMovie) {
      console.log(
        `[MovieDataService] Today's game (${todayStr}) unavailable. Trying yesterday...`,
      )
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const yYear = yesterday.getFullYear()
      const yMonth = String(yesterday.getMonth() + 1).padStart(2, "0")
      const yDay = String(yesterday.getDate()).padStart(2, "0")
      const yesterdayStr = `${yYear}-${yMonth}-${yDay}`

      rawMovie = await this._fetchGameForDate(yesterdayStr)
    }

    if (rawMovie) {
      return {
        dailyItem: this._transformMovieToTriviaItem(rawMovie),
        fullItems,
        basicItems,
      }
    }

    // 3. Strict Failure
    const errorMsg = `Unable to load the daily challenge. Checked ${todayStr} and yesterday.`
    console.error(`[MovieDataService] 🛑 FATAL: ${errorMsg}`)
    throw new Error(errorMsg)
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
