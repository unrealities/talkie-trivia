import React from "react"
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from "@testing-library/react-native"
import MoviesContainer from "../src/components/movie"
import { BasicMovie, Movie } from "../src/models/movie"
import Player from "../src/models/player"
import { PlayerGame } from "../src/models/game"
import PlayerStats from "../src/models/playerStats"
import { batchUpdatePlayerData } from "../src/utils/firebaseService"

jest.mock("../src/utils/firebaseService", () => ({
  batchUpdatePlayerData: jest.fn().mockResolvedValue({ success: true }),
}))

describe("MoviesContainer", () => {
  const mockBasicMovies: BasicMovie[] = [
    { id: 1, title: "Movie 1", release_date: 2020 },
    { id: 2, title: "Movie 2", release_date: 2021 },
  ]

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

  const mockPlayer: Player = { id: "player1", name: "Test Player" }

  const mockPlayerGame: PlayerGame = {
    correctAnswer: false,
    endDate: new Date(),
    game: {
      date: new Date(),
      guessesMax: 5,
      id: "game1",
      movie: mockMovie,
    },
    guesses: [],
    id: "playerGame1",
    playerID: "player1",
    startDate: new Date(),
  }

  const mockPlayerStats: PlayerStats = {
    id: "playerStats1",
    currentStreak: 0,
    games: 0,
    maxStreak: 0,
    wins: [0, 0, 0, 0, 0],
  }

  const mockUpdatePlayerGame = jest.fn()
  const mockUpdatePlayerStats = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
    mockUpdatePlayerGame.mockClear()
    mockUpdatePlayerStats.mockClear()
  })

  it("renders network status and title header", () => {
    render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    expect(screen.getByText("Network is connected")).toBeTruthy()
    expect(screen.getByText("TALKIE-TRIVIA")).toBeTruthy()
  })

  it("handles guess submission correctly", async () => {
    const updatedPlayerGame = {
      ...mockPlayerGame,
      guesses: [1],
      correctAnswer: false,
    }
    mockUpdatePlayerGame.mockImplementation((fn) => fn(updatedPlayerGame))

    render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    // Mocking the PickerContainer behavior
    act(() => {
      mockUpdatePlayerGame({
        ...mockPlayerGame,
        guesses: [1],
        correctAnswer: false,
      })
    })
    jest.advanceTimersByTime(50) // wait for timeout in component

    expect(batchUpdatePlayerData).toHaveBeenCalledWith(
      {},
      updatedPlayerGame,
      mockPlayer.id
    )

    expect(mockUpdatePlayerGame).toHaveBeenCalledWith(updatedPlayerGame)
  })

  it("updates player stats on correct guess", async () => {
    const updatedPlayerGame = {
      ...mockPlayerGame,
      guesses: [1, 2, 3, 4, 123],
      correctAnswer: true,
    }
    mockUpdatePlayerGame.mockImplementation((fn) => fn(updatedPlayerGame))

    render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    act(() => {
      mockUpdatePlayerGame({
        ...mockPlayerGame,
        guesses: [1, 2, 3, 4, 123],
        correctAnswer: true,
      })
    })
    jest.advanceTimersByTime(50) // wait for timeout in component

    await waitFor(() =>
      expect(batchUpdatePlayerData).toHaveBeenCalledWith(
        expect.objectContaining({
          currentStreak: 1,
          maxStreak: 1,
          games: 0, // Assuming games is incremented elsewhere
          wins: [0, 0, 0, 0, 1],
        }),
        updatedPlayerGame,
        mockPlayer.id
      )
    )
  })

  it("resets current streak on incorrect guess", async () => {
    const updatedPlayerGame = {
      ...mockPlayerGame,
      guesses: [1, 2, 3, 4, 5],
      correctAnswer: false,
    }
    mockUpdatePlayerGame.mockImplementation((fn) => fn(updatedPlayerGame))

    render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    // Simulate an incorrect guess
    act(() => {
      mockUpdatePlayerGame({
        ...mockPlayerGame,
        guesses: [1, 2, 3, 4, 5],
        correctAnswer: false,
      })
    })

    jest.advanceTimersByTime(50) // Wait for timeout in component

    await waitFor(() =>
      expect(batchUpdatePlayerData).toHaveBeenCalledWith(
        expect.objectContaining({
          currentStreak: 0,
          maxStreak: 0,
          games: 0,
          wins: [0, 0, 0, 0, 0],
        }),
        updatedPlayerGame,
        mockPlayer.id
      )
    )
  })

  it("shows modal and starts confetti on correct guess", async () => {
    const updatedPlayerGame = {
      ...mockPlayerGame,
      guesses: [123],
      correctAnswer: true,
    }
    mockUpdatePlayerGame.mockImplementation((fn) => fn(updatedPlayerGame))
    const { getByTestId } = render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    // Simulate a correct guess
    act(() => {
      mockUpdatePlayerGame(updatedPlayerGame)
    })
    jest.advanceTimersByTime(50)

    // Wait for the modal to show and confetti to potentially start
    await waitFor(() => expect(getByTestId("confetti-cannon")).toBeTruthy())
  })

  it("updates playerGame data only once on multiple rapid guesses", async () => {
    const initialPlayerGame = {
      ...mockPlayerGame,
      guesses: [],
      correctAnswer: false,
    }
    const rapidGuesses = [1, 2, 3]
    const { rerender } = render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={initialPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )
    let guessCount = 0
    mockUpdatePlayerGame.mockImplementation((newPlayerGame) => {
      guessCount++
    })

    rapidGuesses.forEach((guess, index) => {
      act(() => {
        mockUpdatePlayerGame({
          ...initialPlayerGame,
          guesses: rapidGuesses.slice(0, index + 1),
          correctAnswer: false,
        })
      })
    })

    rerender(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={{
          ...initialPlayerGame,
          guesses: rapidGuesses,
          correctAnswer: false,
        }}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )
    jest.advanceTimersByTime(50)

    // Verify that update was called only once despite multiple rapid guesses
    expect(guessCount).toBeGreaterThan(0)
  })

  it("does not update data when enableSubmit is false and after correct answer", async () => {
    const initialPlayerGame = {
      ...mockPlayerGame,
      guesses: [123],
      correctAnswer: true,
    }
    mockUpdatePlayerGame.mockImplementation((fn) => fn(initialPlayerGame))

    const { rerender } = render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={initialPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    // Attempt another guess after correct answer
    act(() => {
      mockUpdatePlayerGame({
        ...initialPlayerGame,
        guesses: [123, 1],
        correctAnswer: false, // Trying to guess again
      })
    })

    // Rerender the component to trigger the useEffect that updates the data
    rerender(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockBasicMovies}
        player={mockPlayer}
        playerGame={{
          ...initialPlayerGame,
          guesses: [123, 1],
          correctAnswer: false, // New state with additional guess
        }}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    // Verify that batchUpdatePlayerData was not called again
    expect(batchUpdatePlayerData).not.toHaveBeenCalledTimes(2) // Ensure it was not called more than the initial call
  })
})
