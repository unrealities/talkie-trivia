import { PlayerGame } from "../models/game"
import PlayerStats from "../models/playerStats"
import { TriviaItem } from "./trivia"
import { GAME_DEFAULTS } from "../config/constants"
import { DIFFICULTY_MODES, DEFAULT_DIFFICULTY } from "../config/difficulty"

export const defaultTriviaItem: TriviaItem = {
  id: 0,
  title: "",
  description: "",
  posterPath: "",
  releaseDate: "",
  metadata: {},
  hints: [],
}

export const defaultPlayerGame: PlayerGame = {
  id: "",
  playerID: "",
  triviaItem: defaultTriviaItem,
  guessesMax: DIFFICULTY_MODES[DEFAULT_DIFFICULTY].guessesMax,
  difficulty: DEFAULT_DIFFICULTY,
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
  allTimeScore: 0,
}

export const generateDateId = (date: Date): string => {
  return date.toISOString().slice(0, 10)
}
