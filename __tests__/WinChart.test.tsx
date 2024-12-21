import React from "react"
import { render, screen } from "@testing-library/react-native"
import WinChart from "../src/components/winChart"

describe("WinChart", () => {
  const mockWins = [1, 2, 3, 4, 5]

  it("renders the chart with the provided wins data", () => {
    render(<WinChart wins={mockWins} />)

    expect(screen.getByText("1")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("7")).toBeTruthy()
    // Verify labels or other elements that VictoryPie renders based on data
  })

  it("handles empty wins array", () => {
    render(<WinChart wins={[]} />)
  })
})
