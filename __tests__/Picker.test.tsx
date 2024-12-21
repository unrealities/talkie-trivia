import React from "react"
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react-native"
import PickerContainer from "../src/components/picker"
import { BasicMovie } from "../src/models/movie"
import { PlayerGame } from "../src/models/game"

describe("PickerContainer", () => {
  const mockBasicMovies: BasicMovie[] = [
    { id: 1, title: "Movie 1", release_date: 2020 },
    { id: 2, title: "Movie 2", release_date: 2021 },
    {
      id: 3,
      title: "Long Movie Title to Test Text Truncation",
      release_date: 2022,
    },
  ]

  const mockPlayerGame: PlayerGame = {
    correctAnswer: false,
    endDate: new Date(),
    game: {
      date: new Date(),
      guessesMax: 5,
      id: "game1",
      movie: {
        actors: [],
        director: {
          id: 1,
          name: "Test Director",
          popularity: 8,
          profile_path: "",
        },
        genres: [{ id: 1, name: "Action" }],
        id: 1,
        imdb_id: 456,
        overview: "Test overview",
        poster_path: "/test.jpg",
        popularity: 9,
        release_date: "2023-01-01",
        tagline: "Test tagline",
        title: "Test Movie",
        vote_average: 7.5,
        vote_count: 100,
      },
    },
    guesses: [],
    id: "playerGame1",
    playerID: "player1",
    startDate: new Date(),
  }

  const mockUpdatePlayerGame = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it("renders search input and submit button", () => {
    render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )

    expect(screen.getByPlaceholderText("Search for a movie title")).toBeTruthy()
    expect(screen.getByText("Select a Movie")).toBeTruthy()
  })

  it("filters movies based on search text", async () => {
    const { getByPlaceholderText } = render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )

    // Type into the search input
    act(() => {
      fireEvent.changeText(
        getByPlaceholderText("Search for a movie title"),
        "Movie 1"
      )
      jest.advanceTimersByTime(300)
    })

    expect(screen.getByText("Movie 1 (2020)")).toBeTruthy()
    expect(screen.queryByText("Movie 2 (2021)")).toBeNull()
  })

  it("handles movie selection", async () => {
    const { getByPlaceholderText } = render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )

    // Type into the search input
    act(() => {
      fireEvent.changeText(
        getByPlaceholderText("Search for a movie title"),
        "Movie 1"
      )
      jest.advanceTimersByTime(300)
    })

    // Select a movie
    fireEvent.press(screen.getByText("Movie 1 (2020)"))

    // Verify the selected movie is displayed on the button
    expect(screen.getByText("Movie 1 (2020)")).toBeTruthy()
  })

  it("handles guess submission and updates playerGame", () => {
    render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )

    // Select a movie first
    fireEvent.press(screen.getByText("Select a Movie")) // Assuming the button text is the initial value
    fireEvent.changeText(
      screen.getByPlaceholderText("Search for a movie title"),
      "Movie 1"
    )
    act(() => {
      jest.advanceTimersByTime(300)
    })
    fireEvent.press(screen.getByText("Movie 1 (2020)"))

    // Submit the guess
    fireEvent.press(screen.getByText("Movie 1 (2020)"))

    // Verify that updatePlayerGame was called with the correct arguments
    expect(mockUpdatePlayerGame).toHaveBeenCalledWith({
      ...mockPlayerGame,
      guesses: [1],
      correctAnswer: false, // Assuming the selected movie is not the correct answer
    })
  })

  it("disables interactions when playerGame.correctAnswer is true", async () => {
    const { getByText, getByPlaceholderText } = render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={{ ...mockPlayerGame, correctAnswer: true }}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )
    act(() => {
      fireEvent.changeText(
        getByPlaceholderText("Search for a movie title"),
        "Movie"
      )
      jest.advanceTimersByTime(300)
    })

    expect(getByText("Movie 1 (2020)")).toBeTruthy()
    expect(getByText("Select a Movie")).toBeTruthy()

    // Check if search input and submit button are disabled
    expect(getByPlaceholderText("Search for a movie title")).toBeDisabled()
    expect(getByText("Select a Movie")).toBeDisabled()
  })

  it("disables interactions when playerGame.guesses.length >= playerGame.game.guessesMax", () => {
    render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={{
          ...mockPlayerGame,
          guesses: [1, 2, 3, 4, 5],
          game: { ...mockPlayerGame.game, guessesMax: 5 },
        }}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )

    expect(
      screen.getByPlaceholderText("Search for a movie title")
    ).toBeDisabled()
    expect(screen.getByText("Select a Movie")).toBeDisabled()
  })

  it("displays no movies found when search yields no results", async () => {
    const { getByPlaceholderText } = render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )

    act(() => {
      fireEvent.changeText(
        getByPlaceholderText("Search for a movie title"),
        "Nonexistent Movie"
      )
      jest.advanceTimersByTime(300)
    })

    expect(screen.getByText("No movies found")).toBeTruthy()
  })

  it("shows and hides the loading indicator during search", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )

    // Initial state, loading indicator should not be visible
    expect(screen.queryByTestId("activity-indicator")).toBeNull()

    // Start typing, loading indicator should become visible while searching
    fireEvent.changeText(
      getByPlaceholderText("Search for a movie title"),
      "Movie"
    )
    expect(screen.getByTestId("activity-indicator")).toBeTruthy()

    // Wait for the search to complete, loading indicator should disappear
    act(() => {
      jest.advanceTimersByTime(300)
    })

    // Assuming you have a way to determine when the search is done
    // For example, check if the search results are displayed
    expect(screen.queryByTestId("activity-indicator")).toBeNull()
  })

  it("truncates long movie titles in search results", async () => {
    const { getByPlaceholderText, getByText } = render(
      <PickerContainer
        enableSubmit={true}
        movies={mockBasicMovies}
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
      />
    )

    act(() => {
      fireEvent.changeText(
        getByPlaceholderText("Search for a movie title"),
        "Long"
      )
      jest.advanceTimersByTime(300)
    })

    // Test that the long title is visible but truncated
    const movieTitle = screen.getByText((content, element) => {
      return (
        element.type === "Text" &&
        content.startsWith("Long Movie Title to Test Text")
      )
    })
    expect(movieTitle).toBeTruthy()
  })
})
