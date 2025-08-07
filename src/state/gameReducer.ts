import { BasicMovie, Movie } from "../models/movie"
import { PlayerGame, HintType } from "../models/game"
import { generateImplicitHint } from "../utils/guessFeedbackUtils"

export type GameAction =
  | { type: "INITIALIZE_GAME"; payload: PlayerGame }
  | {
      type: "MAKE_GUESS"
      payload: {
        selectedMovie: BasicMovie
        correctMovie: Movie
        allMovies: readonly Movie[]
      }
    }
  | { type: "USE_HINT"; payload: HintType }
  | { type: "GIVE_UP" }
  | { type: "SET_STATS_PROCESSED" }

export function gameReducer(state: PlayerGame, action: GameAction): PlayerGame {
  switch (action.type) {
    case "INITIALIZE_GAME":
      return action.payload

    case "MAKE_GUESS": {
      // Prevent updates if the game is already over
      if (
        state.correctAnswer ||
        state.gaveUp ||
        state.guesses.length >= state.guessesMax
      ) {
        return state
      }

      const { selectedMovie, correctMovie, allMovies } = action.payload
      const newGuesses = [...state.guesses, selectedMovie.id]
      const isCorrectAnswer = correctMovie.id === selectedMovie.id

      let revealedHints: Partial<Record<HintType, boolean>> = {}
      if (!isCorrectAnswer) {
        const guessedFullMovie = allMovies.find(
          (m) => m.id === selectedMovie.id
        )
        if (guessedFullMovie) {
          const hintResult = generateImplicitHint(
            guessedFullMovie,
            correctMovie,
            state.hintsUsed
          )
          revealedHints = hintResult.revealedHints
        }
      }

      return {
        ...state,
        guesses: newGuesses,
        correctAnswer: isCorrectAnswer,
        hintsUsed: {
          ...state.hintsUsed,
          ...revealedHints,
        },
      }
    }

    case "USE_HINT": {
      const hintType = action.payload
      if (state.hintsUsed?.[hintType] || state.correctAnswer || state.gaveUp) {
        return state
      }
      return {
        ...state,
        hintsUsed: {
          ...state.hintsUsed,
          [hintType]: true,
        },
      }
    }

    case "GIVE_UP":
      return {
        ...state,
        gaveUp: true,
      }

    case "SET_STATS_PROCESSED":
      return {
        ...state,
        statsProcessed: true,
      }

    default:
      throw new Error("Unhandled action type in gameReducer")
  }
}
