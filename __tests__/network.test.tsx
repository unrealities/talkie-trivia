import React from "react"
import { render } from "@testing-library/react-native"
import NetworkContainer from "../src/components/network"

// Mocking react-native components
jest.mock("react-native", () => {
  const ReactNative = jest.requireActual("react-native")
  return {
    ...ReactNative,
    Text: "Text", // Mock Text component
    View: "View", // Mock View component
  }
})

// Mocking the styles import
jest.mock("../src/styles/networkStyles", () => ({
  networkStyles: {
    container: "mockContainerStyle",
    text: "mockTextStyle",
  },
}))

describe("NetworkContainer", () => {
  it('renders the "connected" message when isConnected is true', () => {
    const { getByText } = render(<NetworkContainer isConnected={true} />)
    expect(getByText("Network is connected")).toBeDefined()
  })

  it('renders the "Not Connected" message when isConnected is false', () => {
    const { getByText } = render(<NetworkContainer isConnected={false} />)
    expect(getByText("Network is not connected")).toBeDefined()
  })
})
