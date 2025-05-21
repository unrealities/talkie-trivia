import React from "react"
import { render, RenderResult } from "@testing-library/react-native"
import GuessesContainer from "../src/components/guesses"
import { BasicMovie, Movie } from "../src/models/movie"

// Mock the styles
jest.mock("../src/styles/guessesStyles", () => ({
  guessesStyles: {},
}))

// Mock useEffect
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: jest.fn().mockImplementation((f) => f()),
}))

describe("GuessesContainer", () => {
  it("renders with an empty array of guesses", () => {
    const movies: readonly BasicMovie[] = []
    const movie: Movie = {
      id: 1,
      title: "Test Movie",
      overview: "",
      poster_path: "",
      release_date: new Date(),
      vote_average: 0,
      genre_ids: [],
    }
    const { getByText }: RenderResult = render(
      <GuessesContainer guesses={[]} movie={movie} movies={movies} />
    )
    expect(getByText("1")).toBeTruthy()
  })

  it("renders with a single guess", () => {
    const movies: readonly BasicMovie[] = [
      { id: 123, title: "Guess Movie", release_date: "1999-01-01" },
    ]
    const movie: Movie = {
      id: 123,
      title: "Guess Movie",
      overview: "",
      poster_path: "",
      vote_average: 0,
    }
    const { getByText }: RenderResult = render(
      <GuessesContainer guesses={[123]} movie={movie} movies={movies} />
    )
    expect(getByText("1")).toBeTruthy()
    expect(getByText("Guess Movie (1999-01-01)")).toBeTruthy()
  })
})
