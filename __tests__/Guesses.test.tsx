import React from "react"
import { render, screen } from "@testing-library/react-native"
import GuessesContainer from "../src/components/guesses"
import { BasicMovie, Movie } from "../src/models/movie"

describe("GuessesContainer", () => {
  const mockMovies: BasicMovie[] = [
    { id: 1, title: "Movie 1", release_date: 2020 },
    { id: 2, title: "Movie 2", release_date: 2021 },
    { id: 3, title: "Movie 3", release_date: 2022 },
    { id: 4, title: "Movie 4", release_date: 2023 },
    { id: 5, title: "Movie 5", release_date: 2024 },
  ]

  const mockMovie: Movie = {
    actors: [],
    director: { id: 1, name: "Test Director", popularity: 8, profile_path: "" },
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
  }

  it("renders placeholders for unguessed movies", () => {
    render(
      <GuessesContainer guesses={[]} movies={mockMovies} movie={mockMovie} />
    )
    expect(screen.getAllByText("-").length).toBe(5)
  })

  it("renders guessed movie titles", () => {
    render(
      <GuessesContainer
        guesses={[1, 3, 5, 4, 2]}
        movies={mockMovies}
        movie={mockMovie}
      />
    )
    expect(screen.getByText("Movie 1 (2020)")).toBeTruthy()
    expect(screen.getByText("Movie 3 (2022)")).toBeTruthy()
    expect(screen.getByText("Movie 5 (2024)")).toBeTruthy()
    expect(screen.getByText("Movie 4 (2023)")).toBeTruthy()
    expect(screen.getByText("Movie 2 (2021)")).toBeTruthy()
  })

  it("renders a combination of placeholders and guessed movies", () => {
    render(
      <GuessesContainer
        guesses={[2, 4]}
        movies={mockMovies}
        movie={mockMovie}
      />
    )
    expect(screen.getByText("Movie 2 (2021)")).toBeTruthy()
    expect(screen.getByText("Movie 4 (2023)")).toBeTruthy()
    expect(screen.getAllByText("-").length).toBe(3)
  })

  it("renders without crashing when a guessed movie is not found", () => {
    render(
      <GuessesContainer guesses={[6]} movies={mockMovies} movie={mockMovie} />
    )
    expect(screen.getByText("-")).toBeTruthy()
  })
})
