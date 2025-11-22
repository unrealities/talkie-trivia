import React, { ReactElement } from "react"
import { View } from "react-native"
import { render, screen, waitFor } from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import { useAuth } from "../src/contexts/authContext"
import { useGameStore } from "../src/state/gameStore"

// 1. Mock React.lazy to avoid dynamic import error and circular dependency.
jest.mock("react", () => {
  const actual = jest.requireActual("react")
  return {
    ...actual,
    lazy: (factory: any) => {
      const Component = (props: any) => {
        // Use STRING "View" to avoid requiring react-native which causes circular dependency
        return actual.createElement(
          "View",
          { ...props, testID: "lazy-component" },
          props.children
        )
      }
      return Component
    },
    Suspense: ({ children }: any) => children,
  }
})

// 2. Mock the modules.
jest.mock("../src/components/googleLogin", () => () => <></>)
jest.mock("../src/components/playerStats", () => () => <></>)
jest.mock("../src/components/gameHistory", () => () => <></>)
jest.mock("../src/components/themeSelector", () => () => <></>)
jest.mock("../src/components/difficultySelector", () => () => <></>)
jest.mock("../src/components/historyDetailModal", () => () => <></>)

jest.mock("../src/contexts/authContext")
jest.mock("../src/state/gameStore")

import ProfileScreen from "../src/app/(tabs)/profile"

const mockUseAuth = useAuth as jest.Mock
const mockUseGameStore = useGameStore as unknown as jest.Mock

const renderWithTheme = (ui: ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe("App: ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGameStore.mockImplementation((selector: any) =>
      selector({
        playerStats: {},
        loading: false,
      })
    )
  })

  it("should show loading indicator if authentication is loading", () => {
    mockUseAuth.mockReturnValue({ player: null, user: null })
    mockUseGameStore.mockImplementation((selector: any) =>
      selector({ loading: true })
    )

    renderWithTheme(<ProfileScreen />)

    expect(screen.getByTestId("loading-indicator-container")).toBeTruthy()
  })

  it("should render guest profile correctly", async () => {
    mockUseAuth.mockReturnValue({
      player: { name: "Guest" },
      user: { isAnonymous: true },
    })

    renderWithTheme(<ProfileScreen />)

    await waitFor(() => {
      expect(screen.getByText("Welcome, Guest!")).toBeTruthy()
      expect(screen.getByText("Save Your Progress")).toBeTruthy()
    })
  })

  it("should render signed-in user profile correctly", async () => {
    mockUseAuth.mockReturnValue({
      player: { name: "Test User" },
      user: { isAnonymous: false },
    })

    renderWithTheme(<ProfileScreen />)

    await waitFor(() => {
      expect(screen.getByText("Welcome, Test User!")).toBeTruthy()
      expect(screen.queryByText("Save Your Progress")).toBeNull()
    })
  })
})
