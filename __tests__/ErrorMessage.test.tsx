import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import ErrorMessage from "../src/components/errorMessage"

describe("ErrorMessage", () => {
  it("renders the error message", () => {
    const { getByText } = render(<ErrorMessage message="Test error" />)
    expect(getByText("Test error")).toBeTruthy()
  })

  it("calls onRetry when retry button is pressed", () => {
    const mockOnRetry = jest.fn()
    const { getByText } = render(
      <ErrorMessage message="Test error" onRetry={mockOnRetry} />
    )
    fireEvent.press(getByText("Retry"))
    expect(mockOnRetry).toHaveBeenCalled()
  })

  it("does not render retry button when onRetry is not provided", () => {
    const { queryByText } = render(<ErrorMessage message="Test error" />)
    expect(queryByText("Retry")).toBeNull()
  })
})
