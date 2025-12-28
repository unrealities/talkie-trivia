import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import Genres from "../../src/components/genres"
import { Genre } from "../../src/models/trivia"

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

// --- Mock Data ---
const mockGenres: Genre[] = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Comedy" },
  { id: 4, name: "Drama" },
  { id: 5, name: "Fantasy" },
  { id: 6, name: "Horror" },
  { id: 7, name: "Sci-Fi" },
]

describe("Genres Component", () => {
  describe("Rendering Logic", () => {
    it("should render 'No genres available' when the list is empty", () => {
      renderWithTheme(<Genres genres={[]} />)
      expect(screen.getByText("No genres available")).toBeTruthy()
    })

    it("should render 'No genres available' when the genres prop is null", () => {
      renderWithTheme(<Genres genres={null} />)
      expect(screen.getByText("No genres available")).toBeTruthy()
    })

    it("should render all genres if count is less than default max (5)", () => {
      const fewGenres = mockGenres.slice(0, 3)
      renderWithTheme(<Genres genres={fewGenres} />)

      expect(screen.getByText("Action")).toBeTruthy()
      expect(screen.getByText("Adventure")).toBeTruthy()
      expect(screen.getByText("Comedy")).toBeTruthy()

      // Should not show "+X more"
      expect(screen.queryByText(/\+\d+ more/)).toBeNull()
    })

    it("should render exactly max genres (default 5) without truncation text", () => {
      const fiveGenres = mockGenres.slice(0, 5)
      renderWithTheme(<Genres genres={fiveGenres} />)

      expect(screen.getByText("Action")).toBeTruthy()
      expect(screen.getByText("Fantasy")).toBeTruthy()

      // Boundary check: If length == max, no "+ more" text
      expect(screen.queryByText(/\+\d+ more/)).toBeNull()
    })
  })

  describe("Truncation Logic", () => {
    it("should truncate the list and show '+X more' when exceeding default max (5)", () => {
      renderWithTheme(<Genres genres={mockGenres} />) // Length is 7

      // Should show first 5
      expect(screen.getByText("Action")).toBeTruthy()
      expect(screen.getByText("Fantasy")).toBeTruthy()

      // Should NOT show 6th and 7th in the list
      expect(screen.queryByText("Horror")).toBeNull()
      expect(screen.queryByText("Sci-Fi")).toBeNull()

      // Should show remaining count (7 - 5 = 2)
      expect(screen.getByText("+2 more")).toBeTruthy()
    })

    it("should respect a custom 'maxGenres' prop", () => {
      renderWithTheme(<Genres genres={mockGenres} maxGenres={2} />)

      // Should show first 2
      expect(screen.getByText("Action")).toBeTruthy()
      expect(screen.getByText("Adventure")).toBeTruthy()

      // Should NOT show 3rd
      expect(screen.queryByText("Comedy")).toBeNull()

      // Should show remaining count (7 - 2 = 5)
      expect(screen.getByText("+5 more")).toBeTruthy()
    })
  })

  describe("Styling and Content", () => {
    it("should handle long genre names with ellipsization props", () => {
      const longGenre: Genre[] = [
        { id: 99, name: "Super Extremely Long Genre Name That Does Not Fit" },
      ]
      renderWithTheme(<Genres genres={longGenre} />)

      const genreText = screen.getByText(
        "Super Extremely Long Genre Name That Does Not Fit"
      )

      // Verify the component passes numberOfLines and tail props to the Typography component
      expect(genreText.props.numberOfLines).toBe(1)
      expect(genreText.props.ellipsizeMode).toBe("tail")
    })
  })
})
