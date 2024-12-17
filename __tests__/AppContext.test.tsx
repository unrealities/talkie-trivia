import React from "react"
import { renderHook, act } from "@testing-library/react-native"
import {
  AppProvider,
  useAppContext,
  appReducer,
  initialState,
  defaultPlayerGame,
  defaultPlayerStats,
} from "../src/contexts/appContext"
import { BasicMovie, Movie } from "../src/models/movie"
import Player from "../src/models/player"
import PlayerStats from "../src/models/playerStats"

// Mock data for testing
const mockMovie: Movie = {
  actors: [],
  director: { id: 1, name: "Test Director", popularity: 8, profile_path: "" },
  genres: [{ id: 1, name: "Action" }],
  id: 123,
  imdb_id: 456,
  overview: "Test overview",
  poster_path: "/test.jpg",
  popularity: 9,
  release_date: "2023-01-01",
  tagline: "Test tagline",
  title: "Test Movie",
  vote_average: 7.5,
  vote_count: 100,
}

const mockBasicMovie: BasicMovie = {
  id: 456,
  release_date: 2023,
  title: "Another Movie",
}

const mockPlayer: Player = {
  id: "player1",
  name: "Test Player",
}

describe("appReducer", () => {
  it("should set network connected state", () => {
    const action = { type: "SET_NETWORK_CONNECTED", payload: false } as const
    const newState = appReducer(initialState, action)
    expect(newState.isNetworkConnected).toBe(false)
  })

  it("should set movies and select a movie for today's game", () => {
    const action = {
      type: "SET_MOVIES",
      payload: [mockMovie] as readonly Movie[],
    } as const
    const newState = appReducer(initialState, action)
    expect(newState.movies).toEqual([mockMovie])
    expect(newState.playerGame.game.movie).toEqual(mockMovie)
  })

  it("should set basic movies", () => {
    const action = {
      type: "SET_BASIC_MOVIES",
      payload: [mockBasicMovie] as readonly BasicMovie[],
    } as const
    const newState = appReducer(initialState, action)
    expect(newState.basicMovies).toEqual([mockBasicMovie])
  })

  it("should set the current movie", () => {
    const action = { type: "SET_MOVIE", payload: mockMovie } as const
    const newState = appReducer(initialState, action)
    expect(newState.movie).toEqual(mockMovie)
  })

  it("should set the player", () => {
    const action = { type: "SET_PLAYER", payload: mockPlayer } as const
    const newState = appReducer(initialState, action)
    expect(newState.player).toEqual(mockPlayer)
  })

  it("should set player game with guesses and correct answer", () => {
    const updatedPlayerGame = {
      ...defaultPlayerGame,
      guesses: [1, 2, 3],
      correctAnswer: true,
    }
    const action = {
      type: "SET_PLAYER_GAME",
      payload: updatedPlayerGame,
    } as const
    const newState = appReducer(initialState, action)
    expect(newState.playerGame).toEqual(updatedPlayerGame)
  })

  it("should set player stats", () => {
    const updatedPlayerStats: PlayerStats = {
      ...defaultPlayerStats,
      currentStreak: 5,
      maxStreak: 10,
      games: 20,
      wins: [1, 2, 3, 4, 5],
    }

    const action = {
      type: "SET_PLAYER_STATS",
      payload: updatedPlayerStats,
    } as const
    const newState = appReducer(initialState, action)
    expect(newState.playerStats).toEqual(updatedPlayerStats)
  })

  it("should return the current state for unknown action types", () => {
    const action = { type: "UNKNOWN_ACTION" } as any // Cast to 'any' to bypass type checking for this test
    const newState = appReducer(initialState, action)
    expect(newState).toEqual(initialState)
  })
})

describe("AppContext", () => {
  it("should provide initial state", () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    })
    expect(result.current.state).toEqual(initialState)
  })

  it("should update state via dispatch", () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.dispatch({
        type: "SET_NETWORK_CONNECTED",
        payload: false,
      })
    })

    expect(result.current.state.isNetworkConnected).toBe(false)

    act(() => {
      result.current.dispatch({
        type: "SET_MOVIES",
        payload: [mockMovie],
      })
    })

    expect(result.current.state.movies).toEqual([mockMovie])
  })

  it("should update state via dispatch (more actions)", () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.dispatch({
        type: "SET_BASIC_MOVIES",
        payload: [mockBasicMovie],
      })
    })
    expect(result.current.state.basicMovies).toEqual([mockBasicMovie])

    act(() => {
      result.current.dispatch({ type: "SET_MOVIE", payload: mockMovie })
    })
    expect(result.current.state.movie).toEqual(mockMovie)

    act(() => {
      result.current.dispatch({ type: "SET_PLAYER", payload: mockPlayer })
    })
    expect(result.current.state.player).toEqual(mockPlayer)

    act(() => {
      result.current.dispatch({
        type: "SET_PLAYER_GAME",
        payload: {
          ...defaultPlayerGame,
          guesses: [1, 2],
          correctAnswer: false,
        },
      })
    })
    expect(result.current.state.playerGame.guesses).toEqual([1, 2])
    expect(result.current.state.playerGame.correctAnswer).toBe(false)

    act(() => {
      result.current.dispatch({
        type: "SET_PLAYER_STATS",
        payload: { ...defaultPlayerStats, currentStreak: 3 },
      })
    })
    expect(result.current.state.playerStats.currentStreak).toBe(3)
  })
})
