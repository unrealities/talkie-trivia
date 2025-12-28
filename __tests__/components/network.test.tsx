import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../../src/contexts/themeContext"
import NetworkContainer from "../../src/components/network"

// --- Test Setup ---
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("NetworkContainer Component", () => {
  describe("Connection States", () => {
    it("should NOT render anything when isConnected is true", () => {
      renderWithTheme(<NetworkContainer isConnected={true} />)

      // The component returns null, so querying for the text should fail
      expect(screen.queryByText("Network is not connected")).toBeNull()
    })

    it("should render the warning banner when isConnected is false", () => {
      renderWithTheme(<NetworkContainer isConnected={false} />)

      // The warning text should now be visible
      expect(screen.getByText("Network is not connected")).toBeTruthy()
    })
  })
})
