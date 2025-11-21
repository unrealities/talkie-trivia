import React from "react"
import { render, fireEvent, screen } from "@testing-library/react-native"
import { ThemeContext } from "../src/contexts/themeContext"
import ThemeSelector from "../src/components/themeSelector"
import { lightColors } from "../src/styles/themes"

// --- Mock Context ---
const mockSetTheme = jest.fn()

const renderWithMockContext = (
  currentTheme: "light" | "dark" | "system" = "system"
) => {
  return render(
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme: mockSetTheme,
        colors: lightColors,
        colorScheme: "light",
      }}
    >
      <ThemeSelector />
    </ThemeContext.Provider>
  )
}

describe("ThemeSelector Component", () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it("should render all theme options", () => {
    renderWithMockContext()

    expect(screen.getByText("Theme")).toBeTruthy()
    expect(screen.getByText("Light")).toBeTruthy()
    expect(screen.getByText("Dark")).toBeTruthy()
    expect(screen.getByText("System")).toBeTruthy()
  })

  it("should indicate the currently selected theme", () => {
    renderWithMockContext("dark")

    // We check accessibility state "selected" which is set on the Pressable
    const darkButton = screen.getByRole("button", { name: "Set theme to Dark" })
    expect(darkButton.props.accessibilityState.selected).toBe(true)

    const lightButton = screen.getByRole("button", {
      name: "Set theme to Light",
    })
    expect(lightButton.props.accessibilityState.selected).toBe(false)
  })

  it("should call setTheme when an option is pressed", () => {
    renderWithMockContext("light")

    const systemButton = screen.getByRole("button", {
      name: "Set theme to System",
    })
    fireEvent.press(systemButton)

    expect(mockSetTheme).toHaveBeenCalledWith("system")
  })
})
