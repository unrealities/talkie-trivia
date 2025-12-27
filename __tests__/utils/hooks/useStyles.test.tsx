import { renderHook } from "@testing-library/react-native"
import { useStyles, useThemeTokens } from "../../../src/utils/hooks/useStyles"
import * as ThemeContext from "../../../src/contexts/themeContext"
import { lightColors, darkColors } from "../../../src/styles/themes"

// Mock context
jest.mock("../../../src/contexts/themeContext")

describe("Hooks: useStyles", () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return styles using the current theme colors", () => {
    // Mock Light Theme
    jest.spyOn(ThemeContext, "useTheme").mockReturnValue({
      theme: "light",
      colorScheme: "light",
      colors: lightColors,
      setTheme: mockSetTheme,
    })

    const styleFactory = (theme: any) => ({
      container: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.medium,
      },
    })

    const { result } = renderHook(() => useStyles(styleFactory))

    expect(result.current.container.backgroundColor).toBe(
      lightColors.background
    )
  })

  it("should update styles when theme changes to dark", () => {
    // Mock Dark Theme
    jest.spyOn(ThemeContext, "useTheme").mockReturnValue({
      theme: "dark",
      colorScheme: "dark",
      colors: darkColors,
      setTheme: mockSetTheme,
    })

    const styleFactory = (theme: any) => ({
      text: {
        color: theme.colors.textPrimary,
      },
    })

    const { result } = renderHook(() => useStyles(styleFactory))

    expect(result.current.text.color).toBe(darkColors.textPrimary)
  })

  it("should provide access to raw theme tokens", () => {
    jest.spyOn(ThemeContext, "useTheme").mockReturnValue({
      theme: "light",
      colorScheme: "light",
      colors: lightColors,
      setTheme: mockSetTheme,
    })

    const { result } = renderHook(() => useThemeTokens())

    expect(result.current.colors).toBe(lightColors)
    expect(result.current.spacing).toBeDefined()
    expect(result.current.typography).toBeDefined()
    expect(result.current.shadows).toBeDefined()
  })
})
