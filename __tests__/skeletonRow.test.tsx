import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import { SkeletonRow } from "../src/components/guess/skeletonRow"
import { useSkeletonAnimation } from "../src/utils/hooks/useSkeletonAnimation"

// Mock Animation
jest.mock("../src/utils/hooks/useSkeletonAnimation")

// Fixed Reanimated Mock
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: {
      View: View, // Animated.View becomes just View
    },
    // If the component uses named exports like useSharedValue, they need to be here or in the global mock
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
  }
})

const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("Guess Component: SkeletonRow", () => {
  beforeEach(() => {
    ;(useSkeletonAnimation as jest.Mock).mockReturnValue({ opacity: 0.5 })
  })

  it("should render the index number correctly", () => {
    renderWithTheme(<SkeletonRow index={2} />)
    // Display index is 0-based in code, but displayed as 1-based
    expect(screen.getByText("3")).toBeTruthy()
  })

  it("should render the skeleton text container", () => {
    const { toJSON } = renderWithTheme(<SkeletonRow index={0} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it("should call useSkeletonAnimation", () => {
    renderWithTheme(<SkeletonRow index={0} />)
    expect(useSkeletonAnimation).toHaveBeenCalled()
  })
})
