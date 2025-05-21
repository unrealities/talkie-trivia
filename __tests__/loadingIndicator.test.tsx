import React from "react"
import { render, screen } from "@testing-library/react-native"
import LoadingIndicator from "../src/components/loadingIndicator" // Adjust the path as needed
import CustomLoadingIndicator from "../src/components/customLoadingIndicator" // Adjust the path as needed
import { appStyles } from "../src/styles/appStyles"

// Mock the CustomLoadingIndicator component
jest.mock("../src/components/customLoadingIndicator", () => {
  return ({ message }: { message?: string }) => {
    return (
      <mock-customloadingindicator
        testID="custom-loading-indicator"
        message={message}
      />
    )
  }
})

describe("LoadingIndicator", () => {
  it("renders correctly", () => {
    render(<LoadingIndicator />)
    const loadingIndicator = screen.getByTestId("loading-indicator-container")
    expect(loadingIndicator).toBeTruthy()
  })

  it("renders the CustomLoadingIndicator component", () => {
    render(<LoadingIndicator />)
    const customLoadingIndicator = screen.getByTestId(
      "custom-loading-indicator"
    )
    expect(customLoadingIndicator).toBeTruthy()
  })

  it("passes the message prop to CustomLoadingIndicator", () => {
    const testMessage = "Loading data..."
    render(<LoadingIndicator message={testMessage} />)
    const customLoadingIndicator = screen.getByTestId(
      "custom-loading-indicator"
    )
    expect(customLoadingIndicator.props.message).toBe(testMessage)
  })

  it("the View component has the correct style", () => {
    render(<LoadingIndicator />)
    const loadingIndicator = screen.getByTestId("loading-indicator-container")
    expect(loadingIndicator.props.style).toEqual(appStyles.loadingContainer)
  })
})
