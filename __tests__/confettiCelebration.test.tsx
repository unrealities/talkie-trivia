import React, { forwardRef, useImperativeHandle } from "react"
import { render, screen } from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import ConfettiCelebration from "../src/components/confettiCelebration"
import { View } from "react-native"

// --- Mocking the external library ---
// We create a mock for 'react-native-confetti-cannon' to test our component's
// interaction with it, without actually rendering the confetti animation.

// This mock function will allow us to check if the `start()` method was called.
const mockStart = jest.fn()

jest.mock("react-native-confetti-cannon", () => {
  // We use forwardRef and useImperativeHandle because the real component
  // is controlled via a ref in ConfettiCelebration.tsx.
  const MockConfettiCannon = forwardRef(({ onAnimationEnd, ...props }, ref) => {
    useImperativeHandle(ref, () => ({
      start: mockStart, // Expose our mock `start` function on the ref
    }))

    // The mock component can be a simple View. We pass onAnimationEnd as a prop
    // so we can simulate the animation ending in our test.
    return (
      <View
        testID="confetti-cannon"
        // @ts-ignore - a custom prop for testing
        onAnimationEnd={onAnimationEnd}
        {...props}
      />
    )
  })
  MockConfettiCannon.displayName = "MockConfettiCannon"
  return MockConfettiCannon
})

// --- Test Suite ---

describe("ConfettiCelebration Component", () => {
  const mockOnConfettiStop = jest.fn()

  beforeEach(() => {
    // Clear mocks before each test to ensure a clean state
    mockStart.mockClear()
    mockOnConfettiStop.mockClear()
  })

  it("should not render when startConfetti is false", () => {
    render(
      <ThemeProvider>
        <ConfettiCelebration startConfetti={false} />
      </ThemeProvider>
    )

    // queryByTestId returns null if the element is not found, which is what we expect.
    expect(screen.queryByTestId("confetti-cannon")).toBeNull()
  })

  it("should render and call the start method when startConfetti is true", () => {
    render(
      <ThemeProvider>
        <ConfettiCelebration startConfetti={true} />
      </ThemeProvider>
    )

    // The component should be in the DOM.
    expect(screen.getByTestId("confetti-cannon")).toBeTruthy()
    // The useEffect hook should have called the start() method on the ref.
    expect(mockStart).toHaveBeenCalledTimes(1)
  })

  it("should call onConfettiStop when the onAnimationEnd prop is triggered", () => {
    render(
      <ThemeProvider>
        <ConfettiCelebration
          startConfetti={true}
          onConfettiStop={mockOnConfettiStop}
        />
      </ThemeProvider>
    )

    const confettiCannon = screen.getByTestId("confetti-cannon")

    // Simulate the animation ending by directly calling the onAnimationEnd prop
    // that our mock component received.
    act(() => {
      confettiCannon.props.onAnimationEnd()
    })

    // Verify that our component's callback was executed.
    expect(mockOnConfettiStop).toHaveBeenCalledTimes(1)
  })

  it("should not call start() again on re-render if startConfetti is already true", () => {
    const { rerender } = render(
      <ThemeProvider>
        <ConfettiCelebration startConfetti={true} />
      </ThemeProvider>
    )

    expect(mockStart).toHaveBeenCalledTimes(1)

    // Re-render with the same props
    rerender(
      <ThemeProvider>
        <ConfettiCelebration startConfetti={true} />
      </ThemeProvider>
    )

    // The start method should not be called again because the dependency array in useEffect prevents it.
    expect(mockStart).toHaveBeenCalledTimes(1)
  })
})
