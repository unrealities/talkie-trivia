import React from "react"
import { render, screen } from "@testing-library/react-native"
import NetworkContainer from "../src/components/network"

describe("NetworkContainer", () => {
  it("renders 'not connected' when isConnected is false", () => {
    render(<NetworkContainer isConnected={false} />)
    expect(screen.getByText("Network is not connected")).toBeTruthy()
  })

  it("does not render the component when isConnected is true", () => {
    render(<NetworkContainer isConnected={true} />)
    const element = screen.queryByText("Network is connected")
    expect(element).toBeNull()
  })
})
