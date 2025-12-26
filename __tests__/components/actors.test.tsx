import React, { ReactElement } from "react"
import {
  render,
  fireEvent,
  screen,
  RenderOptions,
  within,
} from "@testing-library/react-native"
import Actors from "../../src/components/actors"
import { API_CONFIG } from "../../src/config/constants"
import { ThemeProvider } from "../../src/contexts/themeContext"

// Custom Render Helper with ThemeProvider
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

type Actor = {
  id: number | string
  name: string
  profile_path: string | null
  imdb_id?: string
}

// Mock Data
const mockActors: Actor[] = [
  { id: 1, name: "Tom Hanks", profile_path: "/tom_hanks.jpg" },
  { id: 2, name: "Meryl Streep", profile_path: "/meryl_streep.jpg" },
  { id: 3, name: "Denzel Washington", profile_path: "/denzel_washington.jpg" },
  { id: 4, name: "Cher", profile_path: "/cher.jpg" },
  { id: 5, name: "Actor Without Image", profile_path: null },
]

// Test Suite
describe("Actors Component", () => {
  const onActorPressMock = jest.fn()

  beforeEach(() => {
    onActorPressMock.mockClear()
  })

  describe("Rendering Logic", () => {
    it("should render nothing if the actors prop is null or empty", () => {
      const { rerender } = renderWithTheme(
        <Actors actors={[]} onActorPress={onActorPressMock} />
      )
      expect(screen.queryByTestId(/actor-pressable-/)).toBeNull()

      rerender(
        <ThemeProvider>
          <Actors actors={null as any} onActorPress={onActorPressMock} />
        </ThemeProvider>
      )
      expect(screen.queryByTestId(/actor-pressable-/)).toBeNull()
    })

    it("should render up to the default maximum of 3 actors", () => {
      renderWithTheme(
        <Actors actors={mockActors} onActorPress={onActorPressMock} />
      )
      const actorElements = screen.getAllByTestId(/actor-pressable-/)
      expect(actorElements).toHaveLength(3)
    })

    it("should respect the `maxDisplay` prop when provided", () => {
      renderWithTheme(
        <Actors
          actors={mockActors}
          maxDisplay={2}
          onActorPress={onActorPressMock}
        />
      )
      const actorElements = screen.getAllByTestId(/actor-pressable-/)
      expect(actorElements).toHaveLength(2)
    })

    it("should render fewer actors if the array length is less than `maxDisplay`", () => {
      const fewActors = mockActors.slice(0, 1)
      renderWithTheme(
        <Actors
          actors={fewActors}
          maxDisplay={3}
          onActorPress={onActorPressMock}
        />
      )
      const actorElements = screen.getAllByTestId(/actor-pressable-/)
      expect(actorElements).toHaveLength(1)
    })

    it("should use the correct image URI when profile_path is available", () => {
      renderWithTheme(
        <Actors actors={[mockActors[0]]} onActorPress={onActorPressMock} />
      )
      const image = screen.getByTestId("mock-expo-image")
      expect(image.props["data-source"]).toBe(
        `${API_CONFIG.TMDB_IMAGE_BASE_URL_W185}${mockActors[0].profile_path}`
      )
    })

    it("should use the default fallback image when profile_path is null", () => {
      renderWithTheme(
        <Actors actors={[mockActors[4]]} onActorPress={onActorPressMock} />
      )
      const image = screen.getByTestId("mock-expo-image")
      expect(image.props.source).toBe(1)
    })

    it("should correctly split and display actor names", () => {
      renderWithTheme(
        <Actors
          actors={mockActors}
          maxDisplay={4}
          onActorPress={onActorPressMock}
        />
      )

      const tomHanksCard = screen.getByTestId("actor-pressable-1")
      // The text is nested, so we check for the combined text content.
      expect(within(tomHanksCard).getByText(/Tom\s*Hanks/)).toBeTruthy()

      const cherCard = screen.getByTestId("actor-pressable-4")
      expect(within(cherCard).getByText("Cher")).toBeTruthy()
    })
  })

  describe("Interaction", () => {
    it("should call onActorPress with the correct actor object when pressed", () => {
      renderWithTheme(
        <Actors
          actors={mockActors}
          maxDisplay={3}
          onActorPress={onActorPressMock}
        />
      )
      const actorToPress = screen.getByTestId("actor-pressable-2") // Meryl Streep
      fireEvent.press(actorToPress)
      expect(onActorPressMock).toHaveBeenCalledWith(mockActors[1])
    })
  })

  describe("Accessibility", () => {
    it("should have the correct accessibility label and role", () => {
      renderWithTheme(
        <Actors actors={[mockActors[0]]} onActorPress={onActorPressMock} />
      )
      const pressable = screen.getByTestId("actor-pressable-1")
      expect(pressable.props.accessibilityLabel).toBe(
        "Actor: Tom Hanks. View details"
      )
      expect(pressable.props.role).toBe("button")
    })
  })
})
