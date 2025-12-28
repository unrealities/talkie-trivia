import React, { ReactElement } from "react"
import {
  render,
  screen,
  fireEvent,
  cleanup,
  RenderOptions,
  within,
  act,
} from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import GameDifficultyToggle from "../../src/components/gameDifficultyToggle"
import { useGameStore } from "../../src/state/gameStore"
import { hapticsService } from "../../src/utils/hapticsService"
import { DEFAULT_DIFFICULTY, DIFFICULTY_MODES } from "../../src/config/difficulty"
import { GameState } from "../../src/state/gameStore"

jest.mock("../../src/state/gameStore")
jest.mock("../../src/utils/hapticsService")

const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

const mockSetDifficulty = jest.fn()
const mockUseGameStore = useGameStore as unknown as jest.Mock

describe("GameDifficultyToggle Component", () => {
  const setMockStoreState = (overrides: Partial<GameState> = {}) => {
    const defaultState = {
      difficulty: DEFAULT_DIFFICULTY,
      setDifficulty: mockSetDifficulty,
      playerGame: { guesses: [] },
      isInteractionsDisabled: false,
      ...overrides,
    }
    mockUseGameStore.mockImplementation((selector: (state: any) => any) =>
      selector(defaultState)
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    setMockStoreState()
  })

  afterEach(() => {
    jest.useRealTimers()
    cleanup()
  })

  // Helper to get the main toggle button by its label and the fact it has a chevron icon
  const getToggleButton = (name: string) => {
    const buttons = screen.getAllByRole("button", { name })
    const toggleButton = buttons.find(
      (btn) =>
        within(btn).queryByTestId("mock-icon-chevron-down") ||
        within(btn).queryByTestId("mock-icon-chevron-up")
    )
    if (!toggleButton)
      throw new Error(
        `Could not find the main toggle button with name: ${name}`
      )
    return toggleButton
  }

  describe("Rendering", () => {
    it("should render the current difficulty label and be collapsed by default", () => {
      renderWithTheme(<GameDifficultyToggle />)

      expect(getToggleButton("Medium")).toBeTruthy()

      // The option buttons are rendered but should not be visible
      expect(screen.getByText("Easy")).not.toBeVisible()
      expect(screen.getByText("Hard")).not.toBeVisible()
    })
  })

  describe("Interactions", () => {
    it("should expand and show options when the toggle button is pressed", () => {
      renderWithTheme(<GameDifficultyToggle />)

      fireEvent.press(getToggleButton("Medium"))
      act(() => jest.runAllTimers())

      // FIX: Assert that the element is now in the tree and available.
      // `toBeVisible()` can be flaky with reanimated mocks.
      expect(screen.getByRole("button", { name: "Basic" })).toBeTruthy()
      expect(screen.getByRole("button", { name: "Hard" })).toBeTruthy()
      expect(hapticsService.light).toHaveBeenCalledTimes(1)
    })

    it("should call setDifficulty and collapse when an option is selected", () => {
      renderWithTheme(<GameDifficultyToggle />)

      fireEvent.press(getToggleButton("Medium"))
      act(() => jest.runAllTimers())

      const hardOptionButton = screen.getByRole("button", { name: "Hard" })
      fireEvent.press(hardOptionButton)
      act(() => jest.runAllTimers())

      expect(mockSetDifficulty).toHaveBeenCalledWith("LEVEL_4")
      expect(hapticsService.medium).toHaveBeenCalledTimes(1)

      // FIX: Assert that the element is no longer visible after collapsing.
      expect(hardOptionButton).not.toBeVisible()
    })
  })

  describe("Conditional Logic and Disabled States", () => {
    it("should be disabled if isInteractionsDisabled is true", () => {
      setMockStoreState({ isInteractionsDisabled: true })
      renderWithTheme(<GameDifficultyToggle />)

      const toggleButton = getToggleButton("Medium")
      expect(toggleButton.props.accessibilityState).toEqual({
        disabled: true,
        expanded: false,
      })

      fireEvent.press(toggleButton)
      expect(hapticsService.light).not.toHaveBeenCalled()
    })

    it("should disable options that have fewer max guesses than current guesses", () => {
      setMockStoreState({
        playerGame: {
          guesses: [{ itemId: 1 }, { itemId: 2 }, { itemId: 3 }, { itemId: 4 }],
        } as any,
      })
      renderWithTheme(<GameDifficultyToggle />)

      fireEvent.press(getToggleButton("Medium"))
      act(() => jest.runAllTimers())

      const extremeButton = screen.getByRole("button", { name: "Extreme" })
      const hardButton = screen.getByRole("button", { name: "Hard" })

      expect(extremeButton.props.accessibilityState).toEqual({ disabled: true })
      expect(hardButton.props.accessibilityState).toEqual({ disabled: false })
    })
  })
})
