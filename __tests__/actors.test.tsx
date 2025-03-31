import React from "react"
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native"
import * as Linking from "expo-linking"
import { Alert } from "react-native"
import { Actors } from "../src/components/actors"
import { Actor } from "../src/models/movie"

jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}))

let alertSpy: jest.SpyInstance
beforeAll(() => {
  alertSpy = jest.spyOn(Alert, "alert")
})

beforeEach(() => {
  jest.clearAllMocks()
  ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
  ;(Linking.openURL as jest.Mock).mockResolvedValue(true)
  alertSpy.mockClear()
})

afterAll(() => {
  alertSpy.mockRestore()
})

const mockActors: Actor[] = [
  {
    id: 1,
    name: "Actor One",
    popularity: 9,
    profile_path: "/actor1.jpg",
    order: 0,
    imdb_id: "nm0000111",
  },
  {
    id: 2,
    name: "Actor TwoLastName",
    popularity: 8,
    profile_path: "/actor2.jpg",
    order: 1,
  },
  {
    id: 3,
    name: "Actor Three",
    popularity: 7,
    profile_path: null,
    order: 2,
    imdb_id: "nm0000333",
  },
  {
    id: 4,
    name: "Actor Four",
    popularity: 6,
    profile_path: "/actor4.jpg",
    order: 3,
    imdb_id: "nm0000444",
  },
]

const mockActorWithoutLink: Actor = mockActors[1]
const mockActorWithLink: Actor = mockActors[0]
const mockActorWithNoImage: Actor = mockActors[2]

describe("Actors Component", () => {
  it("renders null when the actors array is empty", () => {
    render(<Actors actors={[]} />)
    expect(screen.queryByText(/Actor/)).toBeNull()
  })

  it("renders null when the actors prop is null or undefined", () => {
    render(<Actors actors={null as any} />)
    expect(screen.queryByText(/Actor/)).toBeNull()

    render(<Actors actors={undefined as any} />)
    expect(screen.queryByText(/Actor/)).toBeNull()
  })

  it("renders the default number of actors (max 3) when maxDisplay is not provided", () => {
    render(<Actors actors={mockActors} />)
    expect(screen.getByText("Actor One")).toBeTruthy()
    expect(screen.getByText(/TwoLastName/)).toBeTruthy()
    expect(screen.getByText("Actor Three")).toBeTruthy()
    expect(screen.queryByText("Actor Four")).toBeNull()

    const images = screen.getAllByTestId("mock-expo-image")
    expect(images.length).toBe(3)
  })

  it("renders actors up to the maxDisplay limit", () => {
    render(<Actors actors={mockActors} maxDisplay={2} />)
    expect(screen.getByText("Actor One")).toBeTruthy()
    expect(screen.getByText(/TwoLastName/)).toBeTruthy()
    expect(screen.queryByText("Actor Three")).toBeNull()
    expect(screen.queryByText("Actor Four")).toBeNull()

    const images = screen.getAllByTestId("mock-expo-image")
    expect(images.length).toBe(2)
  })

  it("renders all actors when maxDisplay is greater than the number of actors", () => {
    render(<Actors actors={mockActors} maxDisplay={5} />)
    expect(screen.getByText("Actor One")).toBeTruthy()
    expect(screen.getByText(/TwoLastName/)).toBeTruthy()
    expect(screen.getByText("Actor Three")).toBeTruthy()
    expect(screen.getByText("Actor Four")).toBeTruthy()

    const images = screen.getAllByTestId("mock-expo-image")
    expect(images.length).toBe(4)
  })

  it("renders actor names correctly (including split names)", () => {
    render(<Actors actors={mockActors} />)
    expect(screen.getByText(/Actor TwoLastName/)).toBeTruthy()
  })

  it("renders a default image when profile_path is null", () => {
    render(<Actors actors={[mockActorWithNoImage]} />)
    const images = screen.getAllByTestId("mock-expo-image")
    expect(images.length).toBe(1)
  })

  it("calls onActorPress prop when an actor is pressed", () => {
    const mockOnActorPress = jest.fn()
    render(
      <Actors actors={[mockActorWithLink]} onActorPress={mockOnActorPress} />
    )

    fireEvent.press(screen.getByRole("button", { name: /Actor: Actor One/i }))

    expect(mockOnActorPress).toHaveBeenCalledTimes(1)
    expect(mockOnActorPress).toHaveBeenCalledWith(mockActorWithLink)
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(alertSpy).not.toHaveBeenCalled()
  })

  it("attempts to open IMDb link when actor with link is pressed (no onActorPress)", async () => {
    render(<Actors actors={[mockActorWithLink]} />)

    fireEvent.press(screen.getByRole("button", { name: /Actor: Actor One/i }))

    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith(
        "https://www.imdb.com/name/nm0000111"
      )
    })
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(
        "https://www.imdb.com/name/nm0000111"
      )
    })

    expect(alertSpy).not.toHaveBeenCalled()
  })

  it("shows alert when actor without IMDb link is pressed (no onActorPress)", () => {
    render(<Actors actors={[mockActorWithoutLink]} />)

    fireEvent.press(
      screen.getByRole("button", { name: /Actor: Actor TwoLastName/i })
    )

    expect(Linking.canOpenURL).not.toHaveBeenCalled()
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalledTimes(1)
    expect(alertSpy).toHaveBeenCalledWith(
      "IMDb link unavailable",
      "No link found for this actor."
    )
  })

  it("shows alert when Linking.canOpenURL returns false", async () => {
    ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(false)
    render(<Actors actors={[mockActorWithLink]} />)

    fireEvent.press(screen.getByRole("button", { name: /Actor: Actor One/i }))

    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith(
        "https://www.imdb.com/name/nm0000111"
      )
    })
    expect(Linking.openURL).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledTimes(1)
    })
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Unable to open IMDb link")
    })
  })

  it("shows alert when Linking.openURL fails", async () => {
    const linkError = new Error("Failed to open")
    ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
    ;(Linking.openURL as jest.Mock).mockRejectedValue(linkError)

    render(<Actors actors={[mockActorWithLink]} />)

    fireEvent.press(screen.getByRole("button", { name: /Actor: Actor One/i }))

    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith(
        "https://www.imdb.com/name/nm0000111"
      )
    })
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(
        "https://www.imdb.com/name/nm0000111"
      )
    })

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledTimes(1)
    })
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error opening link")
    })
  })
})
