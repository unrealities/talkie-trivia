import React from "react"
import { render, fireEvent, screen } from "@testing-library/react-native"
import * as Linking from "expo-linking"
import { Actor } from "../src/models/movie"
import { Actors, default as ActorContainer } from "../src/components/actors"

jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}))

describe("ActorContainer", () => {
  const mockActor: Actor = {
    id: 1,
    name: "Test Actor",
    popularity: 8,
    profile_path: "/test.jpg",
    order: 0,
  }

  beforeEach(() => {
    ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
    ;(Linking.openURL as jest.Mock).mockResolvedValue(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders actor name and image", () => {
    render(<ActorContainer actor={mockActor} />)

    expect(screen.getByText("Test Actor")).toBeTruthy()
    expect(screen.getByRole("image")).toBeTruthy()
  })

  it("calls onActorPress when provided", () => {
    const mockOnActorPress = jest.fn()
    render(<ActorContainer actor={mockActor} onActorPress={mockOnActorPress} />)

    fireEvent.press(screen.getByText("Test Actor"))
    expect(mockOnActorPress).toHaveBeenCalledWith(mockActor)
  })

  it("opens IMDb link when pressed and imdbId is provided", async () => {
    render(<ActorContainer actor={mockActor} imdbId="nm123" />)
    fireEvent.press(screen.getByText("Test Actor"))
    expect(Linking.canOpenURL).toHaveBeenCalledWith(
      "https://www.imdb.com/name/nm123"
    )
    expect(Linking.openURL).toHaveBeenCalledWith(
      "https://www.imdb.com/name/nm123"
    )
  })

  it("alerts when IMDb link is unavailable", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {})
    render(<ActorContainer actor={mockActor} />)

    fireEvent.press(screen.getByText("Test Actor"))
    expect(alertSpy).toHaveBeenCalledWith(
      "IMDb link unavailable",
      "No link found for this actor."
    )
  })
})

describe("Actors", () => {
  const mockActors: Actor[] = [
    {
      id: 1,
      name: "Actor 1",
      popularity: 8,
      profile_path: "/actor1.jpg",
      order: 0,
    },
    {
      id: 2,
      name: "Actor 2",
      popularity: 9,
      profile_path: "/actor2.jpg",
      order: 1,
    },
  ]

  it("renders null when no actors are provided", () => {
    const { container } = render(<Actors actors={[]} />)
    expect(container.children.length).toBe(0)
  })

  it("renders up to maxDisplay actors", () => {
    render(<Actors actors={mockActors} maxDisplay={1} />)
    expect(screen.getByText("Actor 1")).toBeTruthy()
    expect(screen.queryByText("Actor 2")).toBeNull()
  })

  it("renders all actors when maxDisplay is greater than the number of actors", () => {
    render(<Actors actors={mockActors} maxDisplay={3} />)
    expect(screen.getByText("Actor 1")).toBeTruthy()
    expect(screen.getByText("Actor 2")).toBeTruthy()
  })
})
