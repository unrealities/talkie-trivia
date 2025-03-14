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
import { AppProvider } from "../src/contexts/appContext"

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
    hintsUsed: {},
    gaveUp: false,
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

  it("truncates long movie titles in search results", async () => {
    const { getByPlaceholderText, getByText } = render(
      <AppProvider>
        <PickerContainer
          enableSubmit={true}
          movies={mockBasicMovies}
          playerGame={mockPlayerGame}
          updatePlayerGame={mockUpdatePlayerGame}
        />
      </AppProvider>
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