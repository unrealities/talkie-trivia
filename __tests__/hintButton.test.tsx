import React, { ReactElement } from "react"
import {
  render,
  fireEvent,
  screen,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import HintButton from "../src/components/hintButton"

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("HintButton Component", () => {
  const mockOnPress = jest.fn()

  beforeEach(() => {
    mockOnPress.mockClear()
  })

  describe("Rendering and States", () => {
    it("should render correctly in 'available' state", () => {
      renderWithTheme(
        <HintButton
          hintType="director"
          iconName="film-outline"
          label="Director"
          onPress={mockOnPress}
          status="available"
          accessibilityHintCount={3}
          isHighlighted={false}
        />
      )

      const button = screen.getByRole("button")
      expect(button).toBeTruthy()
      expect(screen.getByText("Director")).toBeTruthy()
      expect(button.props.accessibilityState.disabled).toBe(false)
      expect(button.props.accessibilityLabel).toContain("3 hints available")
    })

    it("should render correctly in 'disabled' state", () => {
      renderWithTheme(
        <HintButton
          hintType="genre"
          iconName="folder-open-outline"
          label="Genre"
          onPress={mockOnPress}
          status="disabled"
          accessibilityHintCount={0}
          isHighlighted={false}
        />
      )

      const button = screen.getByRole("button")
      // Check for visual disabled prop/style (opacity usually handled by style)
      expect(button.props.accessibilityState.disabled).toBe(true)
      expect(button.props.accessibilityLabel).toBe("Genre hint unavailable.")
    })

    it("should render correctly in 'used' state", () => {
      renderWithTheme(
        <HintButton
          hintType="year"
          iconName="calendar-outline"
          label="Year"
          onPress={mockOnPress}
          status="used"
          accessibilityHintCount={2}
          isHighlighted={false}
        />
      )

      const button = screen.getByRole("button")
      expect(button.props.accessibilityLabel).toBe("Re-view the year hint.")
    })
  })

  describe("Interaction", () => {
    it("should call onPress with hintType when pressed", () => {
      renderWithTheme(
        <HintButton
          hintType="director"
          iconName="film-outline"
          label="Director"
          onPress={mockOnPress}
          status="available"
          accessibilityHintCount={3}
          isHighlighted={false}
        />
      )

      fireEvent.press(screen.getByRole("button"))
      expect(mockOnPress).toHaveBeenCalledWith("director")
    })

    it("should NOT call onPress when disabled", () => {
      renderWithTheme(
        <HintButton
          hintType="director"
          iconName="film-outline"
          label="Director"
          onPress={mockOnPress}
          status="disabled"
          accessibilityHintCount={0}
          isHighlighted={false}
        />
      )

      fireEvent.press(screen.getByRole("button"))
      expect(mockOnPress).not.toHaveBeenCalled()
    })
  })
})
