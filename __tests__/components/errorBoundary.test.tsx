import React from "react"
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react-native"
import { Text, Alert } from "react-native"
import * as Updates from "expo-updates"
import ErrorBoundary from "../../src/components/errorBoundary"
import { analyticsService } from "../../src/utils/analyticsService"

jest.mock("expo-updates")
jest.mock("../../src/utils/analyticsService")
jest.spyOn(Alert, "alert")

const errorMessage = "Test Error Message"
const ProblemChild = () => {
  throw new Error(errorMessage)
}

const HealthyChild = () => <Text>Healthy Content</Text>

describe("ErrorBoundary Component", () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    cleanup()
  })

  it("should render children components when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <HealthyChild />
      </ErrorBoundary>
    )
    expect(screen.getByText("Healthy Content")).toBeTruthy()
  })

  it("should catch an error and display the fallback UI", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    )
    expect(screen.getByText("Oops! Something went wrong.")).toBeTruthy()
    expect(analyticsService.trackErrorBoundary).toHaveBeenCalledWith(
      errorMessage
    )
  })

  it("should call Updates.reloadAsync when 'Reload App' is pressed", async () => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    )

    fireEvent.press(screen.getByTestId("reload-button"))

    expect(Updates.reloadAsync).toHaveBeenCalledTimes(1)
    consoleLogSpy.mockRestore()
  })
})
