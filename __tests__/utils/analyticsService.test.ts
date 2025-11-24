import { analyticsService } from "../../src/utils/analyticsService"
import {
  logEvent,
  setUserId,
  setUserProperties,
} from "firebase/analytics"

// Mock Firebase config to allow us to toggle 'analytics' existence
jest.mock("../../src/config/firebase", () => ({
  analytics: {}, // Default to initialized
}))

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
}))

describe("Utils: analyticsService", () => {
  const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {})
  const mockConsoleError = jest
    .spyOn(console, "error")
    .mockImplementation(() => {})

  beforeEach(() => {
    jest.clearAllMocks()
    // @ts-ignore - reset analytics mock to be defined
    require("../../src/config/firebase").analytics = {}
  })

  describe("Safety Checks", () => {
    it("should fail gracefully if analytics is not initialized", async () => {
      // @ts-ignore
      require("../../src/config/firebase").analytics = undefined

      await analyticsService.trackGameStart(1, "Test Movie")

      expect(logEvent).not.toHaveBeenCalled()
      // Should log a dev warning (mocked in jestSetup or source)
      // We check that it didn't crash
    })

    it("should catch and log errors from Firebase", async () => {
      ;(logEvent as jest.Mock).mockRejectedValueOnce(
        new Error("Firebase Error")
      )

      await analyticsService.trackGameStart(1, "Test Movie")

      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining("Error logging event"),
        expect.any(Error)
      )
    })
  })

  describe("User Identification", () => {
    it("should set user ID", () => {
      analyticsService.identifyUser("user-123")
      expect(setUserId).toHaveBeenCalledWith(expect.anything(), "user-123")
    })

    it("should set user properties if provided", () => {
      analyticsService.identifyUser("user-123", { method: "google" })
      expect(setUserProperties).toHaveBeenCalledWith(expect.anything(), {
        method: "google",
      })
    })
  })

  describe("Event Tracking", () => {
    it("trackOnboardingStarted", async () => {
      await analyticsService.trackOnboardingStarted()
      expect(logEvent).toHaveBeenCalledWith(
        expect.anything(),
        "onboarding_started",
        undefined
      )
    })

    it("trackGameStart", async () => {
      await analyticsService.trackGameStart(101, "Inception")
      expect(logEvent).toHaveBeenCalledWith(expect.anything(), "game_start", {
        movie_id: 101,
        movie_title: "Inception",
      })
    })

    it("trackGameWin", async () => {
      await analyticsService.trackGameWin(3, 1)
      expect(logEvent).toHaveBeenCalledWith(expect.anything(), "game_win", {
        guesses_taken: 3,
        hints_used_count: 1,
      })
    })

    it("trackGameLose", async () => {
      await analyticsService.trackGameLose(2)
      expect(logEvent).toHaveBeenCalledWith(expect.anything(), "game_lose", {
        hints_used_count: 2,
      })
    })

    it("trackGuessMade", async () => {
      await analyticsService.trackGuessMade(1, true, 500, "Movie A")
      expect(logEvent).toHaveBeenCalledWith(expect.anything(), "guess_made", {
        guess_number: 1,
        is_correct: true,
        guessed_movie_id: 500,
        guessed_movie_title: "Movie A",
      })
    })

    it("trackHintUsed", async () => {
      await analyticsService.trackHintUsed("director", 2, 1)
      expect(logEvent).toHaveBeenCalledWith(expect.anything(), "hint_used", {
        hint_type: "director",
        guess_number_before_hint: 2,
        hints_remaining: 1,
      })
    })

    it("trackShareResults", async () => {
      await analyticsService.trackShareResults("win")
      expect(logEvent).toHaveBeenCalledWith(
        expect.anything(),
        "share_results_tapped",
        {
          game_outcome: "win",
        }
      )
    })

    it("trackGoogleSignInFailure sanitizes error length", async () => {
      const longError = "a".repeat(200)
      await analyticsService.trackGoogleSignInFailure(longError)

      expect(logEvent).toHaveBeenCalledWith(
        expect.anything(),
        "google_signin_failure",
        {
          error_message: expect.stringMatching(/^a{100}$/), // Should be truncated to 100 chars
        }
      )
    })

    it("trackErrorBoundary sanitizes error length", async () => {
      const longError = "e".repeat(200)
      await analyticsService.trackErrorBoundary(longError)

      expect(logEvent).toHaveBeenCalledWith(
        expect.anything(),
        "error_boundary_triggered",
        {
          error_message: expect.stringMatching(/^e{100}$/),
        }
      )
    })
  })
})
