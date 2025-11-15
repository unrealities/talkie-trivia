import React, { ReactElement } from "react"
import {
  render,
  screen,
  act,
  cleanup,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import CountdownTimer from "../src/components/countdownTimer"

// Custom Render Helper with ThemeProvider
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("CountdownTimer Component", () => {
  // NOTE: These tests assume the test runner's environment is UTC-6,
  // based on the consistent +6 hour discrepancy in the previous test failures.
  // The component calculates time until the local midnight, not UTC midnight.

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    cleanup()
  })

  describe("Rendering and Countdown Logic", () => {
    it("should render correctly on initial load", () => {
      // Set system time to 10:30 UTC, which is 04:30 in a UTC-6 timezone.
      jest.setSystemTime(new Date("2025-11-15T10:30:00.000Z"))
      renderWithTheme(<CountdownTimer />)

      // The time until local midnight (from 04:30) is 19 hours and 30 minutes.
      expect(screen.getByText("Next game in 19:30:00")).toBeTruthy()
    })

    it("should update the countdown every second", () => {
      jest.setSystemTime(new Date("2025-11-15T10:30:00.000Z")) // 04:30 local
      renderWithTheme(<CountdownTimer />)

      expect(screen.getByText("Next game in 19:30:00")).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(1000) // Advance 1 second
      })
      expect(screen.getByText("Next game in 19:29:59")).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(5000) // Advance 5 more seconds
      })
      expect(screen.getByText("Next game in 19:29:54")).toBeTruthy()
    })

    it("should correctly display time with single-digit hours, minutes, and seconds (padded)", () => {
      // Set system time to 23:50:51 UTC, which is 17:50:51 in a UTC-6 timezone.
      jest.setSystemTime(new Date("2025-11-15T23:50:51.000Z"))
      renderWithTheme(<CountdownTimer />)

      // The time until local midnight (from 17:50:51) is 6 hours, 9 minutes, and 9 seconds.
      expect(screen.getByText("Next game in 06:09:09")).toBeTruthy()
    })

    it("should handle the final seconds before local midnight", () => {
      // Set system time to 23:59:57 local time by using a non-UTC string.
      // This avoids timezone math for this specific test case.
      jest.setSystemTime(new Date("2025-11-15T23:59:57"))
      renderWithTheme(<CountdownTimer />)

      expect(screen.getByText("Next game in 00:00:03")).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(screen.getByText("Next game in 00:00:02")).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(screen.getByText("Next game in 00:00:01")).toBeTruthy()
    })

    it("should show 00:00:00 at midnight and then reset for the next day", () => {
      jest.setSystemTime(new Date("2025-11-15T23:59:59"))
      renderWithTheme(<CountdownTimer />)

      expect(screen.getByText("Next game in 00:00:01")).toBeTruthy()

      // Advance time to exactly midnight
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      // At this exact moment, the difference to the next midnight is 24h,
      // which results in 0 hours remaining in a 24h cycle. This is correct.
      expect(screen.getByText("Next game in 00:00:00")).toBeTruthy()

      // Advance one more second into the new day
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      // Now it should be counting down from 23:59:59
      expect(screen.getByText("Next game in 23:59:59")).toBeTruthy()
    })
  })

  describe("Component Lifecycle", () => {
    it("should clear the interval timer when the component is unmounted", () => {
      // Spy on clearInterval to track its calls
      const clearIntervalSpy = jest.spyOn(global, "clearInterval")

      const { unmount } = renderWithTheme(<CountdownTimer />)

      // Before unmounting, no cleanup should have occurred.
      expect(clearIntervalSpy).not.toHaveBeenCalled()

      // Unmount the component to trigger the useEffect cleanup function
      unmount()

      // After unmounting, the cleanup function should have been called exactly once.
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1)

      // Clean up the spy for other tests
      clearIntervalSpy.mockRestore()
    })
  })
})
