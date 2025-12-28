import React, { ReactElement } from "react"
import {
  render,
  screen,
  act,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import RevealSequence from "../../src/components/revealSequence"
import { useGameStore } from "../../src/state/gameStore"
import { defaultPlayerGame } from "../../src/models/default"
import { API_CONFIG } from "../../src/config/constants"

// --- Mocks ---

// Mock Reanimated to handle layout animations predictably
// We don't need deep mocks since we are testing the callback via timer advancement
jest.mock("react-native-reanimated", () => {
  const Reanimated = jest.requireActual("react-native-reanimated/mock")
  return {
    ...Reanimated,
    // Ensure runOnJS executes the callback
    runOnJS: (fn: Function) => fn,
    // Ensure withDelay calls callback after delay (simulated)
    withDelay: (delay: number, animation: any) => {
      return animation
    },
    // Ensure withTiming calls callback immediately for test purposes if provided
    withTiming: (toValue: number, config: any, callback: any) => {
      if (callback) callback(true) // Simulate completion
      return { value: toValue }
    },
    useSharedValue: (initial: number) => ({ value: initial }),
    useAnimatedStyle: (fn: Function) => fn(),
  }
})

// Mock Game Store
jest.mock("../../src/state/gameStore")
const mockUseGameStore = useGameStore as unknown as jest.Mock

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

const mockTriviaItem = {
  ...defaultPlayerGame.triviaItem,
  id: 101,
  title: "The Matrix",
  posterPath: "/matrix_poster.jpg",
}

const setMockStoreState = (state: any) => {
  mockUseGameStore.mockImplementation((selector: any) => selector(state))
}

describe("RevealSequence Component", () => {
  const onAnimationCompleteMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    setMockStoreState({
      playerGame: {
        ...defaultPlayerGame,
        triviaItem: mockTriviaItem,
      },
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should render the correct movie title and poster", () => {
    renderWithTheme(
      <RevealSequence onAnimationComplete={onAnimationCompleteMock} />
    )

    expect(screen.getByText("The Matrix")).toBeTruthy()

    const image = screen.getByTestId("mock-expo-image")
    expect(image.props["data-source"]).toBe(
      `${API_CONFIG.TMDB_IMAGE_BASE_URL_W500}${mockTriviaItem.posterPath}`
    )
  })

  it("should render fallback image if posterPath is missing", () => {
    setMockStoreState({
      playerGame: {
        ...defaultPlayerGame,
        triviaItem: { ...mockTriviaItem, posterPath: null },
      },
    })

    renderWithTheme(
      <RevealSequence onAnimationComplete={onAnimationCompleteMock} />
    )

    const image = screen.getByTestId("mock-expo-image")
    // Fallback require returns 1 in Jest
    expect(image.props.source).toBe(1)
  })

  it("should call onAnimationComplete after the sequence finishes", () => {
    renderWithTheme(
      <RevealSequence onAnimationComplete={onAnimationCompleteMock} />
    )

    // The component has multiple animations chained with delays.
    // The final callback is inside a `setTimeout` within the `withTiming` completion callback.
    // 1. Initial delay + animation duration
    // 2. setTimeout of 1000ms

    // Since we mocked `withTiming` to execute the callback immediately,
    // we just need to advance the timer for the setTimeout(..., 1000).

    expect(onAnimationCompleteMock).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(2000) // Advance past 1000ms
    })

    expect(onAnimationCompleteMock).toHaveBeenCalledTimes(1)
  })
})
