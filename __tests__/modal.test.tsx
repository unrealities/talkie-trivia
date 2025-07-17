import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import MovieModal from "../src/components/modal"
import { Movie } from "../src/models/movie"
import { PlayerGame } from "../src/models/game"
import { Share } from "react-native"

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  release_date: "2023-01-01",
  poster_path: "/test.jpg",
  vote_average: 7.5,
  overview: "This is a test movie.",
  tagline: "Test tagline",
  genres: [{ id: 1, name: "Action" }],
  director: { id: 1, name: "Test Director" },
  actors: [],
  imdb_id: 12345,
  popularity: 100,
  vote_count: 1000,
}

const mockPlayerGame: PlayerGame = {
  id: "test-pg-1",
  playerID: "player-1",
  movie: mockMovie,
  guesses: [10, 1],
  guessesMax: 5,
  correctAnswer: true,
  gaveUp: false,
  startDate: new Date(),
  endDate: new Date(),
}

jest.mock("react-native/Libraries/Share/Share", () => ({
  ...jest.requireActual("react-native/Libraries/Share/Share"),
  share: jest.fn(),
}))

describe("MovieModal", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders nothing when hidden", () => {
    const toggleModal = jest.fn()
    const { container } = render(
      <MovieModal
        playerGame={mockPlayerGame}
        show={false}
        toggleModal={toggleModal}
      />
    )
    expect(container.children.length).toBe(0)
  })

  it("renders correctly when shown with a playerGame", () => {
    const toggleModal = jest.fn()
    const { getByText } = render(
      <MovieModal
        playerGame={mockPlayerGame}
        show={true}
        toggleModal={toggleModal}
      />
    )
    expect(getByText("Test Movie")).toBeTruthy()
    expect(getByText("Close")).toBeTruthy()
    expect(getByText("Share")).toBeTruthy()
  })

  it("renders nothing when shown without a playerGame", () => {
    const toggleModal = jest.fn()
    const { queryByText } = render(
      <MovieModal playerGame={null} show={true} toggleModal={toggleModal} />
    )
    expect(queryByText("Close")).toBeNull()
    expect(queryByText("Share")).toBeNull()
  })

  it("calls toggleModal when the close button is pressed", () => {
    const toggleModal = jest.fn()
    const { getByText } = render(
      <MovieModal
        playerGame={mockPlayerGame}
        show={true}
        toggleModal={toggleModal}
      />
    )
    fireEvent.press(getByText("Close"))
    expect(toggleModal).toHaveBeenCalledWith(false)
  })

  it("calls Share.share when the share button is pressed", async () => {
    const toggleModal = jest.fn()
    const { getByText } = render(
      <MovieModal
        playerGame={mockPlayerGame}
        show={true}
        toggleModal={toggleModal}
      />
    )
    fireEvent.press(getByText("Share"))
    expect(Share.share).toHaveBeenCalled()
  })

  it("calls toggleModal when tapping outside the modal", () => {
    const toggleModal = jest.fn()
    const { getByLabelText } = render(
      <MovieModal
        playerGame={mockPlayerGame}
        show={true}
        toggleModal={toggleModal}
      />
    )
    fireEvent.press(getByLabelText("Close modal by tapping outside"))
    expect(toggleModal).toHaveBeenCalledWith(false)
  })
})
