import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import PickerSkeleton from "../src/components/pickerSkeleton"

// --- Mocks ---

// Mock the animation hook to ensure it's being used,
// and to avoid complex Reanimated setup in this unit test.
jest.mock("../src/utils/hooks/useSkeletonAnimation", () => ({
  useSkeletonAnimation: jest.fn(() => ({ opacity: 0.5 })),
}))

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("PickerSkeleton Component", () => {
  it("should render the skeleton container", () => {
    renderWithTheme(<PickerSkeleton />)

    // The component is an Animated.View with an internal structure.
    // Since we don't have explicit testIDs on the internal views in the source,
    // we verify the root element renders without crashing.
    // However, adding a testID is recommended for robust testing.
    // Assuming the component structure from source:
    // <Animated.View style={[styles.container, animatedStyle]}>
    //   <View style={styles.inputContainer}>...

    // We can inspect the style of the rendered element if we don't add a testID,
    // or we can update the component to have a testID.
    // Based on previous tests, we assume we can rely on structure or add testID in a real scenario.
    // For now, we check if *something* rendered.
    expect(screen.toJSON()).toBeTruthy()
  })

  it("should use the skeleton animation style", () => {
    const {
      useSkeletonAnimation,
    } = require("../src/utils/hooks/useSkeletonAnimation")
    renderWithTheme(<PickerSkeleton />)
    expect(useSkeletonAnimation).toHaveBeenCalled()
  })
})
