import React, { ReactElement } from "react"
import {
  render,
  screen,
  fireEvent,
  cleanup,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import ErrorMessage from "../../src/components/errorMessage"

// Custom Render Helper with ThemeProvider
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("ErrorMessage Component", () => {
  const onRetryMock = jest.fn()

  beforeEach(() => {
    onRetryMock.mockClear()
  })

  afterEach(cleanup)

  describe("Rendering Logic", () => {
    it("should render only the message when onRetry is not provided", () => {
      const message = "Something went wrong."
      renderWithTheme(<ErrorMessage message={message} />)

      // Check that the message is displayed
      expect(screen.getByText(message)).toBeTruthy()

      // Check that the retry button is NOT rendered
      expect(screen.queryByText("Retry")).toBeNull()
    })

    it("should render both the message and the retry button when onRetry is provided", () => {
      const message = "Network connection failed."
      renderWithTheme(<ErrorMessage message={message} onRetry={onRetryMock} />)

      expect(screen.getByText(message)).toBeTruthy()
      expect(screen.getByText("Retry")).toBeTruthy()
    })

    it("should render an empty message if an empty string is passed", () => {
      renderWithTheme(<ErrorMessage message="" />)

      // The Text component for the message should still be there, just empty.
      const messageElement = screen.getByText("")
      expect(messageElement).toBeTruthy()
    })
  })

  describe("Interaction", () => {
    it("should call the onRetry function when the retry button is pressed", () => {
      const message = "Could not load data."
      renderWithTheme(<ErrorMessage message={message} onRetry={onRetryMock} />)

      const retryButton = screen.getByText("Retry")
      fireEvent.press(retryButton)

      expect(onRetryMock).toHaveBeenCalledTimes(1)
    })

    it("should not call onRetry if the button is not pressed", () => {
      const message = "Another error."
      renderWithTheme(<ErrorMessage message={message} onRetry={onRetryMock} />)

      expect(onRetryMock).not.toHaveBeenCalled()
    })
  })
})
