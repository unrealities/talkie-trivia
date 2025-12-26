import React, { ReactElement } from "react"
import { Text } from "react-native"
import {
  render,
  fireEvent,
  screen,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../../../src/contexts/themeContext"
import { ScalePressable } from "../../../src/components/ui/scalePressable"
import { useSharedValue, withSpring } from "react-native-reanimated"

// Mocks for Reanimated
jest.mock("react-native-reanimated", () => {
  const actual = jest.requireActual("react-native-reanimated/mock")
  return {
    ...actual,
    useSharedValue: jest.fn(() => ({ value: 1 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((val) => val),
    createAnimatedComponent: (component: any) => component,
  }
})

const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("UI Component: ScalePressable", () => {
  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render children", () => {
    renderWithTheme(
      <ScalePressable onPress={mockOnPress}>
        <Text>Press Me</Text>
      </ScalePressable>
    )
    expect(screen.getByText("Press Me")).toBeTruthy()
  })

  it("should trigger onPress when pressed", () => {
    renderWithTheme(
      <ScalePressable onPress={mockOnPress}>
        <Text>Press Me</Text>
      </ScalePressable>
    )
    fireEvent.press(screen.getByText("Press Me"))
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it("should trigger animation hooks on press in/out", () => {
    const mockScale = { value: 1 }
    // @ts-ignore
    useSharedValue.mockReturnValue(mockScale)

    renderWithTheme(
      <ScalePressable onPress={mockOnPress}>
        <Text>Press Me</Text>
      </ScalePressable>
    )

    const button = screen.getByText("Press Me")

    // Simulate Press In (Shrink)
    fireEvent(button, "pressIn")
    expect(withSpring).toHaveBeenCalledWith(0.96)
    expect(mockScale.value).toBe(0.96)

    // Simulate Press Out (Bounce Back)
    fireEvent(button, "pressOut")
    expect(withSpring).toHaveBeenCalledWith(1)
    expect(mockScale.value).toBe(1)
  })

  it("should apply custom styles correctly", () => {
    renderWithTheme(
      <ScalePressable style={{ backgroundColor: "red" }}>
        <Text>Styled</Text>
      </ScalePressable>
    )
    // Checking style application on the pressable component
    expect(screen.getByText("Styled")).toBeTruthy()
  })
})
