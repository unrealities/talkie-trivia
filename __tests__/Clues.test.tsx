import React from "react"
import { render, act, screen, fireEvent } from "@testing-library/react-native"
import CluesContainer from "../src/components/clues"
import { PlayerGame } from "../src/models/game"

describe("CluesContainer", () => {
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
        id: 123,
        imdb_id: 456,
        overview:
          "This is a test overview. It has multiple sentences. Let's see how it splits.",
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

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("displays loading state initially", () => {
    render(
      <CluesContainer
        playerGame={mockPlayerGame}
        guesses={[]}
        summary=""
        correctGuess={false}
      />
    )
    expect(screen.getByTestId("skeleton-line")).toBeTruthy()
  })

  it("reveals clues incrementally when guesses are updated", async () => {
    const { rerender } = render(
      <CluesContainer
        playerGame={mockPlayerGame}
        guesses={[]}
        summary={mockPlayerGame.game.movie.overview}
        correctGuess={false}
      />
    )
    expect(screen.queryByText("This is a test overview.")).toBeNull()

    rerender(
      <CluesContainer
        playerGame={mockPlayerGame}
        guesses={[1]}
        summary={mockPlayerGame.game.movie.overview}
        correctGuess={false}
      />
    )
    act(() => jest.advanceTimersByTime(500))

    expect(screen.getByText("This is a test")).toBeTruthy()

    rerender(
      <CluesContainer
        playerGame={mockPlayerGame}
        guesses={[1, 2]}
        summary={mockPlayerGame.game.movie.overview}
        correctGuess={false}
      />
    )
    act(() => jest.advanceTimersByTime(500))

    expect(screen.getByText("overview. It has")).toBeTruthy()
  })

  it("displays full summary when correct guess is made", () => {
    render(
      <CluesContainer
        playerGame={mockPlayerGame}
        guesses={[1, 2, 3]}
        summary={mockPlayerGame.game.movie.overview}
        correctGuess={true}
      />
    )

    expect(
      screen.getByText(
        "This is a test overview. It has multiple sentences. Let's see how it splits."
      )
    ).toBeTruthy()
  })
})
