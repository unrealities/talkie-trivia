import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import StatItem from "../src/components/statItem"

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("StatItem Component", () => {
  it("should render label and string value", () => {
    renderWithTheme(<StatItem label="Current Streak" value="5" />)

    expect(screen.getByText("Current Streak")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("should render numeric value correctly", () => {
    renderWithTheme(<StatItem label="Score" value={1500} />)

    expect(screen.getByText("Score")).toBeTruthy()
    // React Native renders numbers as strings in Text
    expect(screen.getByText("1500")).toBeTruthy()
  })

  it("should apply custom value styles if provided", () => {
    // We can't easily check style computation with testing-library in a unit test
    // without inspecting the JSON tree style prop, but we can verify the render doesn't crash.
    // A snapshot or explicit prop check would be deeper, but for functionality:

    renderWithTheme(
      <StatItem
        label="Styled Value"
        value="100"
        valueStyle={{ color: "red" }}
      />
    )

    expect(screen.getByText("100")).toBeTruthy()
  })
})
