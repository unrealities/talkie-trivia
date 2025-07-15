import React, { ErrorInfo } from "react"
import { render, screen, fireEvent, act } from "@testing-library/react-native"
import ErrorBoundary from "../src/components/errorBoundary"
import { Text, Alert } from "react-native"

jest.mock("expo-updates", () => ({
  reloadAsync: jest.fn(),
}))
import * as Updates from "expo-updates"
const mockedUpdates = Updates as jest.Mocked<typeof Updates>

console.error = jest.fn()
console.log = jest.fn()
describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUpdates.reloadAsync.mockResolvedValue()
  })

  it("renders its children when no error has occurred", () => {
    render(
      <ErrorBoundary>
        <Text>Child Component</Text>
      </ErrorBoundary>
    )
    expect(screen.getByText("Child Component")).toBeTruthy()
  })

  it("displays the error UI when an error occurs", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <Text>Child Component</Text>
      </ErrorBoundary>
    )

    const error = new Error("Test Error")
    const TestComponent = () => {
      throw error
    }

    rerender(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText("Oops! Something went wrong.")).toBeTruthy()
    expect(
      screen.getByText(
        "An unexpected error occurred. Please try reloading the app."
      )
    ).toBeTruthy()
  })

  it("getDerivedStateFromError sets the state correctly", () => {
    const error = new Error("Test Error")
    const state = ErrorBoundary.getDerivedStateFromError(error)
    expect(state.hasError).toBe(true)
    expect(state.error).toEqual(error)
    expect(console.error).toHaveBeenCalledWith(
      "ErrorBoundary caught an error:",
      error
    )
  })

  it("componentDidCatch logs the error and errorInfo", () => {
    const error = new Error("Test Error")
    const errorInfo: ErrorInfo = { componentStack: "TestComponent" }
    const instance = new ErrorBoundary({})
    instance.componentDidCatch(error, errorInfo)
    expect(console.error).toHaveBeenCalledWith(
      "ErrorBoundary details:",
      error,
      errorInfo
    )
  })

  it("handleReload successfully reloads the app", async () => {
    const instance = new ErrorBoundary({})
    await act(async () => {
      await instance["handleReload"]()
    })
    expect(mockedUpdates.reloadAsync).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith(
      "Attempting to reload app via Updates API..."
    )
  })

  it("handleReload fails gracefully when reloadAsync fails", async () => {
    mockedUpdates.reloadAsync.mockRejectedValue(new Error("Reload Failed"))
    const instance = new ErrorBoundary({})
    const alertSpy = jest.spyOn(Alert, "alert")

    await act(async () => {
      await instance["handleReload"]()
    })

    expect(mockedUpdates.reloadAsync).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith(
      "Attempting to reload app via Updates API..."
    )
    expect(console.error).toHaveBeenCalledWith(
      "Failed to reload the app via Updates API:",
      new Error("Reload Failed")
    )
    expect(alertSpy).toHaveBeenCalledWith(
      "Reload Failed",
      "Could not automatically reload the app. Please close and restart it manually."
    )
    alertSpy.mockRestore()
  })

  it("Reload button triggers handleReload", async () => {
    const { rerender } = render(
      <ErrorBoundary>
        <Text>Some Text</Text>
      </ErrorBoundary>
    )

    const error = new Error("Test Error")
    const TestComponent = () => {
      throw error
    }

    rerender(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    )

    const button = screen.getByTestId("reload-button")
    fireEvent.press(button)

    expect(mockedUpdates.reloadAsync).toHaveBeenCalled()
  })
})
