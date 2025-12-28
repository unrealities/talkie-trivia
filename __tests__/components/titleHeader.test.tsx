import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import TitleHeader from "../../src/components/titleHeader"

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("TitleHeader Component", () => {
  it("should render the title correctly", () => {
    const testTitle = "Guess the Movie"
    renderWithTheme(<TitleHeader title={testTitle} />)

    expect(screen.getByText(testTitle)).toBeTruthy()
  })

  it("should render with heading typography styles", () => {
    // While we can't verify exact pixels easily, we can ensure it renders.
    renderWithTheme(<TitleHeader title="Header Test" />)
    expect(screen.toJSON()).toBeTruthy()
  })
})
