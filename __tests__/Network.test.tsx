import React from "react"
import { render, screen } from "@testing-library/react-native"
import NetworkContainer from "../src/components/network"

describe("NetworkContainer", () => {
  it("renders 'connected' when isConnected is true", () => {
    render(<NetworkContainer isConnected={true} />)
    expect(screen.getByText("Network is connected")).toBeTruthy()
  })

  it("renders 'not connected' when isConnected is false", () => {
    render(<NetworkContainer isConnected={false} />)
    expect(screen.getByText("Network is not connected")).toBeTruthy()
  })

  it("does not render the component when isConnected is true", () => {
    const { container } = render(<NetworkContainer isConnected={true} />)
    expect(container.children.length).toBe(0) // Assuming it's completely hidden
  })

  it("renders only the 'not connected' message when isConnected is false", () => {
    render(<NetworkContainer isConnected={false} />)
    expect(screen.queryByText("Network is connected")).toBeNull() // Make sure connected message is not present
  })
})
