import React from "react"
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from "@testing-library/react-native"
import * as Linking from "expo-linking"
import Facts from "../src/components/facts"
import { Movie } from "../src/models/movie"

// Mock Linking module
jest.mock("expo-linking", () => ({
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
}))

describe("Facts", () => {
  const mockMovie: Movie = {
    actors: [
      {
        id: 1,
        name: "Actor 1",
        popularity: 8,
        profile_path: "/actor1.jpg",
        order: 0,
      },
      {
        id: 2,
        name: "Actor 2",
        popularity: 9,
        profile_path: "/actor2.jpg",
        order: 1,
      },
    ],
    director: { id: 1, name: "Test Director", popularity: 8, profile_path: "" },
    genres: [{ id: 1, name: "Action" }],
    id: 123,
    imdb_id: "tt12345",
    overview: "Test overview",
    poster_path: "/test.jpg",
    popularity: 9,
    release_date: "2023-01-01",
    tagline: "Test tagline",
    title: "Test Movie",
    vote_average: 7.5,
    vote_count: 100,
  }

  beforeEach(() => {
    ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders loading indicator when loading", () => {
    render(<Facts movie={mockMovie} isLoading={true} />)
    expect(screen.getByRole("progressbar")).toBeTruthy()
  })

  it("renders error message when error", () => {
    render(<Facts movie={mockMovie} error="Test error" />)
    expect(screen.getByText("Test error")).toBeTruthy()
  })

  it("renders movie title and IMDb link", async () => {
    render(<Facts movie={mockMovie} />)
    expect(screen.getByText("Test Movie")).toBeTruthy()
  })

  it("opens IMDb link on title press", async () => {
    render(<Facts movie={mockMovie} />)

    fireEvent.press(screen.getByText("Test Movie"))
    await waitFor(() =>
      expect(Linking.openURL).toHaveBeenCalledWith(
        "https://www.imdb.com/title/tt12345"
      )
    )
  })

  it("renders tagline, poster, director, and actors", () => {
    render(<Facts movie={mockMovie} />)
    expect(screen.getByText("Test tagline")).toBeTruthy()
    expect(screen.getByRole("image")).toBeTruthy()
    expect(screen.getByText("Directed by Test Director")).toBeTruthy()
    expect(screen.getByText("Actor 1")).toBeTruthy()
    expect(screen.getByText("Actor 2")).toBeTruthy()
  })

  it("renders default image when no poster path is provided", () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null }
    render(<Facts movie={movieWithoutPoster} />)
    const defaultPosterImage = screen.getAllByRole("image")[0]
    expect(defaultPosterImage.props.source).toEqual(
      require("../../assets/movie_default.png")
    )
  })
})
