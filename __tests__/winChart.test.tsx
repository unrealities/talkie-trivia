import React from "react"
import { render, screen } from "@testing-library/react-native"
import WinChart from "../src/components/winChart"

// Mock the victory-native library
// We only need to check the props passed to the components
jest.mock("victory-native", () => ({
  VictoryBar: (props: any) => <mock-victory-bar {...props} />,
  VictoryChart: (props: any) => <mock-victory-chart {...props} />,
  VictoryAxis: (props: any) => <mock-victory-axis {...props} />,
  VictoryLabel: (props: any) => <mock-victory-label {...props} />,
}))

describe("WinChart Component", () => {
  it("renders an empty state message when there are no wins", () => {
    render(<WinChart wins={[0, 0, 0, 0, 0]} />)
    expect(
      screen.getByText(
        "Your win distribution will appear here after your first win!"
      )
    ).toBeTruthy()
    expect(screen.queryByTestId("mock-victory-chart")).toBeFalsy()
  })

  it("renders the bar chart when there are wins", () => {
    render(<WinChart wins={[1, 2, 3, 0, 1]} />)
    expect(
      screen.getByLabelText(
        "Bar chart showing win distribution by number of guesses."
      )
    ).toBeTruthy()
    // Check that the chart component is rendered
    expect(screen.UNSAFE_getByType("mock-victory-chart")).toBeTruthy()
  })

  it("passes correctly formatted data to VictoryBar", () => {
    const winsData = [10, 20, 5, 0, 8]
    render(<WinChart wins={winsData} />)
    const victoryBar = screen.UNSAFE_getByType("mock-victory-bar")

    const expectedData = [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 5 },
      { x: 4, y: 0 },
      { x: 5, y: 8 },
    ]

    expect(victoryBar.props.data).toEqual(expectedData)
  })

  it("configures labels correctly for VictoryBar", () => {
    const winsData = [5, 10, 0, 2, 1]
    render(<WinChart wins={winsData} />)
    const victoryBar = screen.UNSAFE_getByType("mock-victory-bar")

    // The labels prop should be a function that returns the 'y' value
    const labelsProp = victoryBar.props.labels
    expect(typeof labelsProp).toBe("function")

    // Test the output of the function for a non-zero and a zero value
    expect(labelsProp({ datum: { y: 5 } })).toBe(5)
    expect(labelsProp({ datum: { y: 0 } })).toBe("")
  })
})
