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
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    cleanup()
  })

  // Helper to calculate expected time string dynamically based on the mocked time
  const getExpectedTime = (mockNow: Date) => {
    const tomorrow = new Date(mockNow)
    tomorrow.setDate(mockNow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const diff = tomorrow.getTime() - mockNow.getTime()

    const pad = (num: number) => num.toString().padStart(2, "0")
    const hours = pad(Math.floor((diff / (1000 * 60 * 60)) % 24))
    const minutes = pad(Math.floor((diff / 1000 / 60) % 60))
    const seconds = pad(Math.floor((diff / 1000) % 60))

    return `${hours}:${minutes}:${seconds}`
  }

  describe("Rendering and Countdown Logic", () => {
    it("should render correctly on initial load", () => {
      const mockTime = new Date("2025-11-15T10:30:00") // Local time construction
      jest.setSystemTime(mockTime)

      renderWithTheme(<CountdownTimer />)

      const expected = getExpectedTime(mockTime)
      expect(screen.getByText(`Next game in ${expected}`)).toBeTruthy()
    })

    it("should update the countdown every second", () => {
      const mockTime = new Date("2025-11-15T23:59:50")
      jest.setSystemTime(mockTime)
      renderWithTheme(<CountdownTimer />)

      const initialExpected = getExpectedTime(mockTime)
      expect(screen.getByText(`Next game in ${initialExpected}`)).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(1000) // Advance 1 second
      })

      const nextTime = new Date(mockTime.getTime() + 1000)
      const nextExpected = getExpectedTime(nextTime)
      expect(screen.getByText(`Next game in ${nextExpected}`)).toBeTruthy()
    })
  })

  describe("Component Lifecycle", () => {
    it("should clear the interval timer when the component is unmounted", () => {
      const clearIntervalSpy = jest.spyOn(global, "clearInterval")
      const { unmount } = renderWithTheme(<CountdownTimer />)
      expect(clearIntervalSpy).not.toHaveBeenCalled()
      unmount()
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
      clearIntervalSpy.mockRestore()
    })
  })
})
