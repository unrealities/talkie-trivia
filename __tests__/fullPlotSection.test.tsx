import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import FullPlotSection from "../src/components/gameOver/fullPlotSection"
import { useGameStore } from "../src/state/gameStore"

// Mock GameStore
jest.mock("../src/state/gameStore")
const mockUseGameStore = useGameStore as unknown as jest.Mock

const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("GameOver Component: FullPlotSection", () => {
  beforeEach(() => {
    mockUseGameStore.mockImplementation((selector: any) =>
      selector({
        gameMode: "movies",
      })
    )
  })

  it("should render the plot overview provided via props", () => {
    const plot = "A young hobbit inherits a magical ring."
    renderWithTheme(<FullPlotSection overview={plot} />)
    expect(screen.getByText(plot)).toBeTruthy()
  })

  it("should display 'The Full Plot' title when game mode is movies", () => {
    mockUseGameStore.mockImplementation((selector: any) =>
      selector({ gameMode: "movies" })
    )
    renderWithTheme(<FullPlotSection overview="test" />)
    expect(screen.getByText("The Full Plot")).toBeTruthy()
  })

  it("should display 'The Full Description' title when game mode is videoGames", () => {
    mockUseGameStore.mockImplementation((selector: any) =>
      selector({ gameMode: "videoGames" })
    )
    renderWithTheme(<FullPlotSection overview="test" />)
    expect(screen.getByText("The Full Description")).toBeTruthy()
  })

  it("should display 'The Full Synopsis' title when game mode is tvShows", () => {
    mockUseGameStore.mockImplementation((selector: any) =>
      selector({ gameMode: "tvShows" })
    )
    renderWithTheme(<FullPlotSection overview="test" />)
    expect(screen.getByText("The Full Synopsis")).toBeTruthy()
  })
})
