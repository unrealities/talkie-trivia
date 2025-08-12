import { Movie } from "../models/movie"
import { PlayerGame } from "../models/game"
import PlayerStats from "../models/playerStats"
import { GAME_DEFAULTS } from "../config/constants"

export const defaultMovie: Movie = {
  actors: [],
  director: { id: 0, name: "", popularity: 0, profile_path: "" },
  genres: [],
  id: 0,
  imdb_id: "",
  overview: "",
  poster_path: "",
  popularity: 0,
  release_date: "",
  tagline: "",
  title: "",
  vote_average: 0,
  vote_count: 0,
}

export const defaultPlayerGame: PlayerGame = {
  id: "",
  playerID: "",
  movie: defaultMovie,
  guessesMax: GAME_DEFAULTS.MAX_GUESSES,
  guesses: [],
  correctAnswer: false,
  gaveUp: false,
  startDate: new Date(),
  endDate: new Date(),
  hintsUsed: {},
  statsProcessed: false,
}

export const defaultPlayerStats: PlayerStats = {
  id: "",
  currentStreak: 0,
  games: 0,
  maxStreak: 0,
  wins: Array(GAME_DEFAULTS.MAX_GUESSES).fill(0),
  hintsAvailable: GAME_DEFAULTS.INITIAL_HINTS,
  hintsUsedCount: 0,
}

export const generateDateId = (date: Date): string => {
  return date.toISOString().slice(0, 10)
}
