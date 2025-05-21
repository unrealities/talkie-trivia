import React from "react"
import { render, act } from "@testing-library/react-native"
import WinChart, { WinChartProps } from "../src/components/winChart"
import { Dimensions } from "react-native"

// Mock react-native Dimensions
jest.mock("react-native", () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 300 }),
  },
  View: "View",
  Text: "Text",
}))

// Define the mock PieChart component outside of jest.mock
const mockPieChart = jest.fn((props) => {
  return React.createElement("View", props, null)
})

// Mock react-native-chart-kit
jest.mock("react-native-chart-kit", () => {
  const ChartKit = jest.requireActual("react-native-chart-kit")
  return {
    ...ChartKit,
    PieChart: mockPieChart,
  }
})
describe("WinChart", () => {
  const defaultProps: WinChartProps = {
    wins: [10, 20, 30, 15, 5],
  }

  it("renders correctly with default data", () => {
    const { toJSON } = render(<WinChart {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it("renders correctly with empty data", () => {
    const props: WinChartProps = {
      wins: [],
    }
    const { toJSON } = render(<WinChart {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it("renders correctly with zero values", () => {
    const props: WinChartProps = {
      wins: [0, 0, 10, 0, 5],
    }
    const { toJSON } = render(<WinChart {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it("renders a View with correct accessibility props", () => {
    const { getByRole } = render(<WinChart {...defaultProps} />)
    expect(
      getByRole("image", { name: "Win distribution pie chart" })
    ).toBeTruthy()
  })

  it("passes correct data to PieChart component with full data", () => {
    render(<WinChart {...defaultProps} />)
    const pieChartCall = mockPieChart.mock.calls[0][0]
    expect(pieChartCall.data.length).toBe(5)
    expect(pieChartCall.data[0].y).toBe(10)
    expect(pieChartCall.data[1].y).toBe(20)
    expect(pieChartCall.data[2].y).toBe(30)
    expect(pieChartCall.data[3].y).toBe(15)
    expect(pieChartCall.data[4].y).toBe(5)
  })

  it("passes correct data to PieChart component with empty data", () => {
    const props: WinChartProps = {
      wins: [],
    }
    render(<WinChart {...props} />)
    const pieChartCall = mockPieChart.mock.calls[0][0]
    expect(pieChartCall.data.length).toBe(5)
    pieChartCall.data.forEach((slice: any) => {
      expect(slice.y).toBe(0)
    })
  })

  it("passes correct data to PieChart component with zero values", () => {
    const props: WinChartProps = {
      wins: [0, 0, 10, 0, 5],
    }
    render(<WinChart {...props} />)
    const pieChartCall = mockPieChart.mock.calls[0][0]
    expect(pieChartCall.data.length).toBe(5)
    expect(pieChartCall.data[0].y).toBe(0)
    expect(pieChartCall.data[1].y).toBe(0)
    expect(pieChartCall.data[2].y).toBe(10)
    expect(pieChartCall.data[3].y).toBe(0)
    expect(pieChartCall.data[4].y).toBe(5)
  })

  it("calculates and formats labels correctly for full data", () => {
    render(<WinChart {...defaultProps} />)
    const pieChartCall = mockPieChart.mock.calls[0][0]
    const totalWins = defaultProps.wins.reduce((a, b) => a + b, 0)
    expect(pieChartCall.data[0].label).toBe(
      `${((10 / totalWins) * 100).toFixed(0)}%`
    )
    expect(pieChartCall.data[1].label).toBe(
      `${((20 / totalWins) * 100).toFixed(0)}%`
    )
    expect(pieChartCall.data[2].label).toBe(
      `${((30 / totalWins) * 100).toFixed(0)}%`
    )
    expect(pieChartCall.data[3].label).toBe(
      `${((15 / totalWins) * 100).toFixed(0)}%`
    )
    expect(pieChartCall.data[4].label).toBe(
      `${((5 / totalWins) * 100).toFixed(0)}%`
    )
  })

  it("labels are empty for zero values", () => {
    const props: WinChartProps = {
      wins: [0, 0, 10, 0, 5],
    }
    render(<WinChart {...props} />)
    const pieChartCall = mockPieChart.mock.calls[0][0]
    expect(pieChartCall.data[0].label).toBe("")
    expect(pieChartCall.data[1].label).toBe("")
    expect(pieChartCall.data[3].label).toBe("")
  })

  it("labels are empty for all zero values", () => {
    const props: WinChartProps = {
      wins: [0, 0, 0, 0, 0],
    }
    render(<WinChart {...props} />)
    const pieChartCall = mockPieChart.mock.calls[0][0]
    pieChartCall.data.forEach((slice: any) => {
      expect(slice.label).toBe("")
    })
  })

  it("uses the correct screen width for the chart", () => {
    render(<WinChart {...defaultProps} />)
    const pieChartCall = mockPieChart.mock.calls[0][0]
    expect(pieChartCall.width).toBe(300 * 0.6)
  })
})
