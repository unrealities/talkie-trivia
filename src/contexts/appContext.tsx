import React, { createContext, useContext, useState, useReducer } from "react"
import { BasicMovie, Movie } from "../models/movie"
import { PlayerGame } from "../models/game"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"

// Define a default movie object to use as a placeholder
const defaultMovie: Movie = {
  actors: [],
  director: { id: 0, name: "", popularity: 0, profile_path: "" },
  genres: [],
  id: 0,
  imdb_id: 0,
  overview: "", // Ensure overview is never undefined
  poster_path: "",
  popularity: 0,
  release_date: "",
  tagline: "",
  title: "",
  vote_average: 0,
  vote_count: 0,
}

interface AppState {
  isNetworkConnected: boolean
  movies: Movie[]
  basicMovies: BasicMovie[]
  movie: Movie | null
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
}

type AppAction =
  | { type: "SET_NETWORK_CONNECTED"; payload: boolean }
  | { type: "SET_MOVIES"; payload: Movie[] }
  | { type: "SET_BASIC_MOVIES"; payload: BasicMovie[] }
  | { type: "SET_MOVIE"; payload: Movie | null }
  | { type: "SET_PLAYER"; payload: Player }
  | { type: "SET_PLAYER_GAME"; payload: PlayerGame }
  | { type: "SET_PLAYER_STATS"; payload: PlayerStats }

const initialState: AppState = {
  isNetworkConnected: true,
  movies: [],
  basicMovies: [],
  movie: null,
  player: { id: "", name: "" },
  playerGame: {
    correctAnswer: false,
    endDate: new Date(),
    game: {
      date: new Date(),
      guessesMax: 5,
      id: "",
      movie: defaultMovie, // Use the default movie object
    },
    guesses: [],
    id: "",
    playerID: "",
    startDate: new Date(),
  },
  playerStats: {
    id: "",
    currentStreak: 0,
    games: 0,
    maxStreak: 0,
    wins: [0, 0, 0, 0, 0],
  },
}

const AppContext = createContext<
  { state: AppState; dispatch: React.Dispatch<AppAction> } | undefined
>(undefined)

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
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
      return { ...state, playerGame: action.payload }
    case "SET_PLAYER_STATS":
      return { ...state, playerStats: action.payload }
    default:
      return state
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
