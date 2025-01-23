import React, { createContext, useContext, useReducer } from "react"
import { BasicMovie, Movie } from "../models/movie"
import { Game, PlayerGame } from "../models/game"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"

const defaultMovie: Movie = {
  actors: [],
  director: { id: 0, name: "", popularity: 0, profile_path: "" },
  genres: [],
  id: 0,
  imdb_id: 0,
  overview: "",
  poster_path: "",
  popularity: 0,
  release_date: "",
  tagline: "",
  title: "",
  vote_average: 0,
  vote_count: 0,
}

const defaultGame: Game = {
  date: new Date(),
  guessesMax: 5,
  id: "",
  movie: defaultMovie,
}

export const defaultPlayerGame: PlayerGame = {
  correctAnswer: false,
  endDate: new Date(),
  game: defaultGame,
  guesses: [],
  id: "",
  playerID: "",
  startDate: new Date(),
}

export const defaultPlayerStats: PlayerStats = {
  id: "",
  currentStreak: 0,
  games: 0,
  maxStreak: 0,
  wins: [0, 0, 0, 0, 0],
}

interface AppState {
  isNetworkConnected: boolean
  movies: readonly Movie[]
  basicMovies: readonly BasicMovie[]
  movie: Movie | null
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  isLoading: boolean
  dataLoadingError: string | null
  hasGameStarted: boolean
}

type AppAction =
  | { type: "SET_NETWORK_CONNECTED"; payload: boolean }
  | { type: "SET_MOVIES"; payload: readonly Movie[] }
  | { type: "SET_BASIC_MOVIES"; payload: readonly BasicMovie[] }
  | { type: "SET_MOVIE"; payload: Movie | null }
  | { type: "SET_PLAYER"; payload: Player }
  | { type: "SET_PLAYER_GAME"; payload: PlayerGame }
  | { type: "SET_PLAYER_STATS"; payload: PlayerStats }
  | { type: "SET_IS_LOADING"; payload: boolean }
  | { type: "SET_DATA_LOADING_ERROR"; payload: string | null }
  | { type: "SET_HAS_GAME_STARTED"; payload: boolean }

export const initialState: AppState = {
  isNetworkConnected: true,
  movies: [],
  basicMovies: [],
  movie: null,
  player: { id: "", name: "" },
  playerGame: defaultPlayerGame,
  playerStats: defaultPlayerStats,
  isLoading: true,
  dataLoadingError: null,
  hasGameStarted: false,
}

const AppContext = createContext<
  { state: AppState; dispatch: React.Dispatch<AppAction> } | undefined
>(undefined)

export const appReducer = (state: AppState, action: AppAction): AppState => {
  console.log("appReducer: Action dispatched:", action)
  switch (action.type) {
    case "SET_NETWORK_CONNECTED":
      return { ...state, isNetworkConnected: action.payload }
    case "SET_MOVIES":
      // Select a random movie for today's game
      const todayMovie =
        action.payload[new Date().getDate() % action.payload.length]

      return {
        ...state,
        movies: action.payload,
        playerGame: {
          ...state.playerGame,
          game: {
            ...state.playerGame.game,
            movie: todayMovie,
          },
        },
      }
    case "SET_BASIC_MOVIES":
      return { ...state, basicMovies: action.payload }
    case "SET_MOVIE":
      return { ...state, movie: action.payload }
    case "SET_PLAYER":
      return { ...state, player: action.payload }
    case "SET_PLAYER_GAME":
      console.log(
        "appReducer: SET_PLAYER_GAME: new playerGame:",
        action.payload
      )
      return {
        ...state,
        playerGame: action.payload,
      }
    case "SET_PLAYER_STATS":
      return { ...state, playerStats: action.payload }
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_DATA_LOADING_ERROR":
      return { ...state, dataLoadingError: action.payload }
    case "SET_HAS_GAME_STARTED":
      return { ...state, hasGameStarted: action.payload }
    default:
      return state
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  if (!children) {
    console.log("AppProvider: No children")
    return null
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  console.log("useAppContext: context", context)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
