import React from "react"
import { render, screen } from "@testing-library/react-native"
import Genres from "../src/components/genres"
import { Genre } from "../src/models/movie"

describe("Genres", () => {
  const mockGenres: Genre[] = [
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy" },
    { id: 3, name: "Drama" },
  ]

  it("renders up to maxGenres genres", () => {
    render(<Genres genres={mockGenres} maxGenres={2} />)
    expect(screen.getByText("Action")).toBeTruthy()
    expect(screen.getByText("Comedy")).toBeTruthy()
    expect(screen.queryByText("Drama")).toBeNull()
    expect(screen.getByText("+1 more")).toBeTruthy()
  })

  it("renders all genres when maxGenres is greater than the number of genres", () => {
    render(<Genres genres={mockGenres} maxGenres={4} />)
    expect(screen.getByText("Action")).toBeTruthy()
    expect(screen.getByText("Comedy")).toBeTruthy()
    expect(screen.getByText("Drama")).toBeTruthy()
    expect(screen.queryByText("+")).toBeNull()
  })

  it("renders 'No genres available' when no genres are provided", () => {
    render(<Genres genres={[]} />)
    expect(screen.getByText("No genres available")).toBeTruthy()
  })
})
