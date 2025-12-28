import React, { ReactElement } from "react"
import { Text } from "react-native"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import ProfileSection from "../../src/components/profileSection"

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("ProfileSection Component", () => {
  it("should render the title and icon", () => {
    renderWithTheme(
      <ProfileSection title="My Section" icon="user">
        <Text>Child Content</Text>
      </ProfileSection>
    )

    // Check Title
    expect(screen.getByText("My Section")).toBeTruthy()

    // Check Icon (Mocked FontAwesome usually renders text with the icon name)
    expect(screen.getByTestId("mock-icon-user")).toBeTruthy()
  })

  it("should render children content", () => {
    renderWithTheme(
      <ProfileSection title="Settings" icon="cog">
        <Text testID="child-element">Inner Content</Text>
      </ProfileSection>
    )

    expect(screen.getByTestId("child-element")).toBeTruthy()
    expect(screen.getByText("Inner Content")).toBeTruthy()
  })
})
