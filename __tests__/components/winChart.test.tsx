import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import WinChart from "../../src/components/winChart"

// --- Mocks ---

jest.mock("victory-native", () => {
  const { View } = require("react-native")
  return {
    VictoryBar: (props: any) => (
      <View
        testID="mock-victory-bar"
        data-chart-data={JSON.stringify(props.data)}
      />
    ),
    VictoryChart: ({ children }: any) => (
      <View testID="mock-victory-chart">{children}</View>
    ),
    VictoryAxis: () => <View testID="mock-victory-axis" />,
    VictoryLabel: () => <View testID="mock-victory-label" />,
  }
})

jest.mock("../../src/components/statItem", () => {
  const { Text, View } = require("react-native")
  return (props: any) => (
    <View testID={`stat-item-${props.label}`}>
      <Text>
        {props.label}: {props.value}
      </Text>
    </View>
  )
})

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("WinChart Component", () => {
  describe("Empty State", () => {
    it("should render empty message if total wins is 0", () => {
      const emptyWins = [0, 0, 0, 0, 0]
      renderWithTheme(<WinChart wins={emptyWins} />)

      expect(
        screen.getByText(
          "Your win distribution will appear here after your first win!"
        )
      ).toBeTruthy()

      expect(screen.queryByTestId("mock-victory-chart")).toBeNull()
    })
  })

  describe("Data Rendering", () => {
    it("should render the chart with correct data format", () => {
      const testWins = [1, 5, 2, 0, 1] // 1 win in 1 guess, 5 in 2 guesses, etc.
      renderWithTheme(<WinChart wins={testWins} />)

      const chart = screen.getByTestId("mock-victory-chart")
      expect(chart).toBeTruthy()

      const bar = screen.getByTestId("mock-victory-bar")

      // Verify data transformation: index -> x, count -> y
      // @ts-ignore
      const passedData = JSON.parse(bar.props["data-chart-data"])

      expect(passedData).toEqual([
        { x: 1, y: 1 },
        { x: 2, y: 5 },
        { x: 3, y: 2 },
        { x: 4, y: 0 },
        { x: 5, y: 1 },
      ])
    })

    it("should have a descriptive accessibility label", () => {
      const testWins = [1, 0, 2, 0, 0]
      renderWithTheme(<WinChart wins={testWins} />)

      const label = screen.getByLabelText(/Bar chart showing win distribution/)
      expect(label).toBeTruthy()

      expect(label.props.accessibilityLabel).toContain("1 win with 1 guess")
      expect(label.props.accessibilityLabel).toContain("2 wins with 3 guesses")
    })
  })
})
