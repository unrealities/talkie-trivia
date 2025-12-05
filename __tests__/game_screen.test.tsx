import React, { ReactElement } from "react"
import { render, screen, waitFor } from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import { useGameStore } from "../src/state/gameStore"

// 1. Mock React.lazy to bypass dynamic imports
jest.mock("react", () => {
  const actualReact = jest.requireActual("react")
  return {
    ...actualReact,
    lazy: (factory: any) => {
      return function MockLazyComponent(props: any) {
        return <actualReact.Fragment>{props.children}</actualReact.Fragment>
      }
    },
    Suspense: ({ children }: { children: React.ReactNode }) => children,
  }
})

// 2. Mock the component modules that are being lazy-loaded.
// When `import("../../components/gameplayContainer")` is called, it returns this object.
jest.mock("../src/components/gameplayContainer", () => {
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: () => <View testID="gameplay-container" />,
  }
})
jest.mock("../src/components/confettiCelebration", () => {
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: () => <View testID="confetti" />,
  }
})
jest.mock("../src/components/flashMessages", () => {
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: () => <View testID="flash-messages" />,
  }
})
jest.mock("../src/components/gameDifficultyToggle", () => {
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: () => <View testID="difficulty-toggle" />,
  }
})

// Normal component mock
jest.mock("../src/components/titleHeader", () => {
  const { Text } = require("react-native")
  return ({ title }: any) => <Text>{title}</Text>
})

jest.mock("../src/state/gameStore")
jest.unmock("react") // Reset

jest.mock("react", () => {
  const actual = jest.requireActual("react")
  return {
    ...actual,
    lazy: jest.fn().mockImplementation(() => {
      const { View } = require("react-native")
      return (props: any) => <View testID="lazy-component" {...props} />
    }),
    Suspense: ({ children }: { children: React.ReactNode }) => children,
  }
})

import GameScreen from "../src/app/(tabs)/game"

const mockUseGameStore = useGameStore as unknown as jest.Mock

const renderWithTheme = (ui: ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe("App: GameScreen", () => {
  beforeEach(() => {
    mockUseGameStore.mockImplementation((selector: any) =>
      selector({
        gameMode: "movies",
        showConfetti: false,
        handleConfettiStop: jest.fn(),
        flashMessage: null,
      })
    )
  })

  it("should render the header with correct title", async () => {
    renderWithTheme(<GameScreen />)
    await waitFor(() => {
      expect(screen.getByText("Find the title!")).toBeTruthy()
    })
  })

  it("should render lazy loaded components", async () => {
    renderWithTheme(<GameScreen />)
    await waitFor(() => {
      // We expect multiple lazy components (GameplayContainer, DifficultyToggle, etc.)
      const lazyComps = screen.getAllByTestId("lazy-component")
      expect(lazyComps.length).toBeGreaterThan(0)
    })
  })
})
