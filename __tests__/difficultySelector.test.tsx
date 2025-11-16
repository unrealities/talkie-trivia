import React, { ReactElement } from "react"
import {
  render,
  screen,
  fireEvent,
  act,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import DifficultySelector from "../src/components/difficultySelector"
import { useGameStore } from "../src/state/gameStore"
import { useAuth } from "../src/contexts/authContext"
import { hapticsService } from "../src/utils/hapticsService"
import { DEFAULT_DIFFICULTY, DIFFICULTY_MODES } from "../src/config/difficulty"

// --- Mocking Dependencies ---
jest.mock("../src/state/gameStore")
jest.mock("../src/contexts/authContext")
jest.mock("../src/utils/hapticsService")

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

const mockSetDifficulty = jest.fn()
const mockUseGameStore = useGameStore as jest.Mock
const mockUseAuth = useAuth as jest.Mock

describe("DifficultySelector Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockUseAuth.mockReturnValue({ player: { id: "test-player" } })

    mockUseGameStore.mockImplementation((selector: (state: any) => any) => {
      const state = {
        difficulty: DEFAULT_DIFFICULTY, // 'LEVEL_3' (Medium)
        setDifficulty: mockSetDifficulty,
      }
      return selector(state)
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("Rendering", () => {
    it("should render correctly with default difficulty selected", () => {
      renderWithTheme(<DifficultySelector />)
      const defaultLabel = DIFFICULTY_MODES[DEFAULT_DIFFICULTY].label

      expect(screen.getByText("Difficulty")).toBeTruthy()
      expect(screen.getByTestId("mock-icon-gamepad")).toBeTruthy()

      // FIX: Use `getAllByText` because the label "Medium" appears more than once.
      // We just need to confirm that it's rendered at all.
      const mediumElements = screen.getAllByText(defaultLabel)
      expect(mediumElements.length).toBeGreaterThan(0)
    })

    it("should display the correct description for the currently selected difficulty", () => {
      renderWithTheme(<DifficultySelector />)

      act(() => {
        jest.runAllTimers()
      })

      const description = DIFFICULTY_MODES[DEFAULT_DIFFICULTY].description
      expect(screen.getByText(description)).toBeTruthy()
    })
  })

  describe("Interactions", () => {
    it("should call setDifficulty and trigger haptics when a new option is pressed", () => {
      renderWithTheme(<DifficultySelector />)

      // This is not ambiguous because there is only one "Hard" button.
      const hardButton = screen.getByText("Hard")
      fireEvent.press(hardButton)

      expect(mockSetDifficulty).toHaveBeenCalledWith("LEVEL_4")
      expect(hapticsService.medium).toHaveBeenCalledTimes(1)
    })

    it("should temporarily change the description on long press", () => {
      renderWithTheme(<DifficultySelector />)
      act(() => jest.runAllTimers())

      const easyButton = screen.getByText("Easy")

      fireEvent(easyButton, "longPress")
      act(() => jest.runAllTimers())

      expect(
        screen.getByText(DIFFICULTY_MODES.LEVEL_2.description)
      ).toBeTruthy()
      expect(hapticsService.light).toHaveBeenCalledTimes(1)
    })
  })
})
