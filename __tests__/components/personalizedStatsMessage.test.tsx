import React, { ReactElement } from "react"
import {
  render,
  screen,
  waitFor,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import PersonalizedStatsMessage from "../../src/components/personalizedStatsMessage"
import { useAuth } from "../../src/contexts/authContext"
import { useGameStore } from "../../src/state/gameStore"
import { gameService } from "../../src/services/gameService"
import { defaultPlayerGame, defaultPlayerStats } from "../../src/models/default"

// --- Mocks ---
jest.mock("../../src/contexts/authContext")
jest.mock("../../src/state/gameStore")
jest.mock("../../src/services/gameService")

// --- Helper Data ---
const mockPlayer = { id: "player-1" }
const mockHistory = [
  { wasCorrect: true, dateId: "1" },
  { wasCorrect: true, dateId: "2" },
  { wasCorrect: false, dateId: "3" },
  { wasCorrect: true, dateId: "4" },
  { wasCorrect: true, dateId: "5" },
  { wasCorrect: false, dateId: "6" },
  { wasCorrect: true, dateId: "7" },
] // 5 wins out of 7

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

const mockUseAuth = useAuth as jest.Mock
const mockUseGameStore = useGameStore as unknown as jest.Mock
const mockGameService = gameService as jest.Mocked<typeof gameService>

const setMockStoreState = (overrides: any) => {
  const state = {
    playerStats: { ...defaultPlayerStats, ...overrides.playerStats },
    playerGame: { ...defaultPlayerGame, ...overrides.playerGame },
  }
  mockUseGameStore.mockImplementation((selector: any) => selector(state))
}

describe("PersonalizedStatsMessage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({ player: mockPlayer })
    mockGameService.fetchGameHistory.mockResolvedValue([])
  })

  describe("Loading and Empty States", () => {
    it("should render nothing while loading or if player/stats are missing", async () => {
      setMockStoreState({ playerStats: null })

      // Initially loading, so should be null
      const { toJSON } = renderWithTheme(<PersonalizedStatsMessage />)
      // We can't check loading state easily as it's internal useState(true)
      // But if stats are missing even after load, it returns null.

      await waitFor(() => {
        // After effect runs, loading is false. But stats are null.
        // Expect no message container.
        expect(screen.queryByText(/./)).toBeNull()
      })
    })
  })

  describe("Winning Scenarios", () => {
    it("should show 'New high streak' message if current streak matches max streak (>1)", async () => {
      setMockStoreState({
        playerGame: { correctAnswer: true, guesses: [{}, {}] },
        playerStats: { currentStreak: 5, maxStreak: 5 },
      })

      renderWithTheme(<PersonalizedStatsMessage />)

      await waitFor(() => {
        expect(
          screen.getByText(/New high streak: 5 wins in a row!/i)
        ).toBeTruthy()
      })
    })

    it("should show 'winning streak' message if current streak >= 3 (and not new high)", async () => {
      setMockStoreState({
        playerGame: { correctAnswer: true, guesses: [{}, {}] },
        playerStats: { currentStreak: 4, maxStreak: 10 },
      })

      renderWithTheme(<PersonalizedStatsMessage />)

      await waitFor(() => {
        expect(
          screen.getByText(/You're on a 4-day winning streak!/i)
        ).toBeTruthy()
      })
    })

    it("should show 'perfect score' message if guessed in 1 try", async () => {
      setMockStoreState({
        playerGame: { correctAnswer: true, guesses: [{}] }, // 1 guess
        playerStats: { currentStreak: 1, maxStreak: 10 },
      })

      renderWithTheme(<PersonalizedStatsMessage />)

      await waitFor(() => {
        expect(
          screen.getByText(/A perfect score! Guessed on the first try!/i)
        ).toBeTruthy()
      })
    })
  })

  describe("Losing Scenarios", () => {
    it("should show 'amazing streak' consolation if streak was broken (>3)", async () => {
      setMockStoreState({
        playerGame: { correctAnswer: false },
        playerStats: { currentStreak: 4 }, // Streak that just ended?
        // Note: The component logic reads `playerStats.currentStreak`.
        // If the game just ended in a loss, `_processGameOver` usually resets currentStreak to 0.
        // However, `PersonalizedStatsMessage` might be reading the stats *before* reset or logic assumes
        // `currentStreak` is the *previous* streak in this context?
        // Let's check source: `if (!playerGame.correctAnswer && playerStats.currentStreak > 3)`
        // This implies the stats passed in still have the streak, OR it's interpreting it as "you *had* a streak".
        // If `_processGameOver` sets streak to 0 on loss, this condition `currentStreak > 3` would fail.
        //
        // Looking at `gameStore.ts`, `_processGameOver` sets `draft.currentStreak = 0` on loss.
        // So `playerStats` in store will have 0.
        // This suggests `PersonalizedStatsMessage` might never show this message if it relies on the *updated* store state.
        // Unless `playerStats` hasn't updated yet? But `GameOverView` shows *after* processing.
        //
        // Potential Bug in Source Logic?
        // If `playerStats.currentStreak` is 0, the condition `> 3` is false.
        // We will test assuming the component logic is what we are testing, even if it might be unreachable in real app flow without delayed updates.
      })

      // Manually forcing a state that satisfies the condition to verify the component's rendering logic.
      setMockStoreState({
        playerGame: { correctAnswer: false },
        playerStats: { currentStreak: 4 },
      })

      renderWithTheme(<PersonalizedStatsMessage />)

      await waitFor(() => {
        expect(
          screen.getByText(/You had an amazing 4-day streak./i)
        ).toBeTruthy()
      })
    })
  })

  describe("History Analysis Scenarios", () => {
    it("should show win rate if history > 5 items", async () => {
      setMockStoreState({
        playerGame: { correctAnswer: false },
        playerStats: { currentStreak: 0 },
      })
      // @ts-ignore
      mockGameService.fetchGameHistory.mockResolvedValue(mockHistory)

      renderWithTheme(<PersonalizedStatsMessage />)

      await waitFor(() => {
        // 5 wins out of 7 items = ~71%
        expect(
          screen.getByText(/Your win rate over the last 7 days is 71%./i)
        ).toBeTruthy()
      })
    })

    it("should show default message if no other conditions met", async () => {
      setMockStoreState({
        playerGame: { correctAnswer: false },
        playerStats: { currentStreak: 0 },
      })
      mockGameService.fetchGameHistory.mockResolvedValue([]) // No history

      renderWithTheme(<PersonalizedStatsMessage />)

      await waitFor(() => {
        expect(
          screen.getByText(/Come back tomorrow for another movie!/i)
        ).toBeTruthy()
      })
    })
  })
})
