import React, { ReactElement } from "react"
import {
  render,
  screen,
  fireEvent,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import TutorialTooltip from "../src/components/tutorialTooltip"
import { hapticsService } from "../src/utils/hapticsService"

// --- Mocks ---
jest.mock("../src/utils/hapticsService")

// Mock Reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = jest.requireActual("react-native-reanimated/mock")
  return {
    ...Reanimated,
    useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
    useAnimatedStyle: jest.fn((fn) => fn()),
    withTiming: jest.fn((toValue) => toValue), // Return target value immediately
    interpolate: jest.fn(() => 0),
  }
})

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("TutorialTooltip Component", () => {
  const mockOnDismiss = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render nothing when isVisible is false", () => {
    const { toJSON } = renderWithTheme(
      <TutorialTooltip
        isVisible={false}
        text="Tip text"
        onDismiss={mockOnDismiss}
      />
    )
    expect(toJSON()).toBeNull()
  })

  it("should render the text and button when isVisible is true", () => {
    renderWithTheme(
      <TutorialTooltip
        isVisible={true}
        text="This is a helpful tip."
        onDismiss={mockOnDismiss}
      />
    )

    expect(screen.getByText("This is a helpful tip.")).toBeTruthy()
    expect(screen.getByText("Got it")).toBeTruthy()
  })

  it("should call onDismiss and haptics when 'Got it' is pressed", () => {
    renderWithTheme(
      <TutorialTooltip
        isVisible={true}
        text="Tip text"
        onDismiss={mockOnDismiss}
      />
    )

    fireEvent.press(screen.getByText("Got it"))

    expect(hapticsService.medium).toHaveBeenCalled()
    expect(mockOnDismiss).toHaveBeenCalledTimes(1)
  })
})
