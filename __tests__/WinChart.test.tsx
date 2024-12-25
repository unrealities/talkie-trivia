import React from "react"
import { render, screen } from "@testing-library/react-native"
import WinChart from "../src/components/winChart"

describe("WinChart", () => {
  const mockWins = [1, 2, 3, 4, 5]

  it("renders the chart with the provided wins data", () => {
    render(<WinChart wins={mockWins} />)
    expect(screen.getByTestId("victory-pie-chart")).toBeTruthy()
  })

  it("handles empty wins array", () => {
    render(<WinChart wins={[]} />)
    expect(screen.getByTestId("victory-pie-chart")).toBeTruthy()
  })
})
