import React from "react"
import { render } from "@testing-library/react-native"
import Genres from "../src/components/genres"
import { Genre } from "../src/models/movie"

describe("Genres Component", () => {
  const mockGenres: Genre[] = [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Sci-Fi" },
    { id: 4, name: "Thriller" },
    { id: 5, name: "Comedy" },
    { id: 6, name: "Drama" },
  ]

  it('renders "No genres available" when no genres are provided', () => {
    const { getByText } = render(<Genres genres={[]} />)
    expect(getByText("No genres available")).toBeTruthy()
  })

  it("renders a single genre correctly", () => {
    const { getByText } = render(<Genres genres={[mockGenres[0]]} />)
    expect(getByText("Action")).toBeTruthy()
  })

  it("renders multiple genres correctly", () => {
    const { getByText } = render(
      <Genres genres={[mockGenres[0], mockGenres[1], mockGenres[2]]} />
    )
    expect(getByText("Action")).toBeTruthy()
    expect(getByText("Adventure")).toBeTruthy()
    expect(getByText("Sci-Fi")).toBeTruthy()
  })

  it('renders "+X more" text when genres exceed maxGenres', () => {
    const { getByText } = render(<Genres genres={mockGenres} maxGenres={3} />)
    expect(getByText("+3 more")).toBeTruthy()
    expect(getByText("Action")).toBeTruthy()
    expect(getByText("Adventure")).toBeTruthy()
    expect(getByText("Sci-Fi")).toBeTruthy()
    expect(() => getByText("Thriller")).toThrow()
  })

  it("slices genres correctly based on maxGenres", () => {
    const { queryByText } = render(<Genres genres={mockGenres} maxGenres={2} />)
    expect(queryByText("Action")).toBeTruthy()
    expect(queryByText("Adventure")).toBeTruthy()
    expect(queryByText("Sci-Fi")).toBeFalsy()
    expect(queryByText("Thriller")).toBeFalsy()
    expect(queryByText("Comedy")).toBeFalsy()
    expect(queryByText("Drama")).toBeFalsy()
  })
})
