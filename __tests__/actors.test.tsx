import React from "react"
import {
  render,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react-native"
import * as Linking from "expo-linking"
import { Alert } from "react-native"
import { Actors } from "../src/components/actors"
import { Actor } from "../src/models/movie"

jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
  ;(Linking.openURL as jest.Mock).mockResolvedValue(true)

  if (jest.isMockFunction(global.alert)) {
    ;(global.alert as jest.Mock).mockClear()
  } else {
    console.warn("global.alert was not mocked by jest.fn() in jestSetup.js")
  }
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

  it("renders the default number of actors (max 3) and their images", () => {
    render(<Actors actors={mockActors} />)
    const actor1Button = screen.getByRole("button", {
      name: /Actor: Actor One/i,
    })
    const actor2Button = screen.getByRole("button", {
      name: /Actor: Actor TwoLastName/i,
    })
    const actor3Button = screen.getByRole("button", {
      name: /Actor: Actor Three/i,
    })

    expect(actor1Button).toBeTruthy()
    expect(actor2Button).toBeTruthy()
    expect(actor3Button).toBeTruthy()
    expect(screen.queryByText("Actor Four")).toBeNull()

    expect(within(actor1Button).getByText("Image")).toBeTruthy()
    expect(within(actor2Button).getByText("Image")).toBeTruthy()
    expect(within(actor3Button).getByText("Image")).toBeTruthy()
  })

  it("renders actors up to the maxDisplay limit and their images", () => {
    render(<Actors actors={mockActors} maxDisplay={2} />)
    const actor1Button = screen.getByRole("button", {
      name: /Actor: Actor One/i,
    })
    const actor2Button = screen.getByRole("button", {
      name: /Actor: Actor TwoLastName/i,
    })

    expect(actor1Button).toBeTruthy()
    expect(actor2Button).toBeTruthy()
    expect(screen.queryByText("Actor Three")).toBeNull()
    expect(screen.queryByText("Actor Four")).toBeNull()

    expect(within(actor1Button).getByText("Image")).toBeTruthy()
    expect(within(actor2Button).getByText("Image")).toBeTruthy()
  })

  it("renders all actors when maxDisplay is greater than the number of actors", () => {
    render(<Actors actors={mockActors} maxDisplay={5} />)
    const actor1Button = screen.getByRole("button", {
      name: /Actor: Actor One/i,
    })
    const actor2Button = screen.getByRole("button", {
      name: /Actor: Actor TwoLastName/i,
    })
    const actor3Button = screen.getByRole("button", {
      name: /Actor: Actor Three/i,
    })
    const actor4Button = screen.getByRole("button", {
      name: /Actor: Actor Four/i,
    })

    expect(actor1Button).toBeTruthy()
    expect(actor2Button).toBeTruthy()
    expect(actor3Button).toBeTruthy()
    expect(actor4Button).toBeTruthy()

    expect(within(actor1Button).getByText("Image")).toBeTruthy()
    expect(within(actor2Button).getByText("Image")).toBeTruthy()
    expect(within(actor3Button).getByText("Image")).toBeTruthy()
    expect(within(actor4Button).getByText("Image")).toBeTruthy()
  })

  it("renders actor names correctly (including split names)", () => {
    render(<Actors actors={mockActors} />)
    expect(screen.getByText(/TwoLastName/)).toBeTruthy()
  })

  it("renders a default image when profile_path is null", () => {
    render(<Actors actors={[mockActorWithNoImage]} />)
    const actor3Button = screen.getByRole("button", {
      name: /Actor: Actor Three/i,
    })
    expect(within(actor3Button).getByText("Image")).toBeTruthy()
  })

  it("attempts to open IMDb link when actor with link is pressed (no onActorPress)", async () => {
    render(<Actors actors={[mockActorWithLink]} />)
    // Target using testID
    fireEvent.press(
      screen.getByTestId(`actor-pressable-${mockActorWithLink.id}`)
    )

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
    expect(global.alert).not.toHaveBeenCalled()
  })
})
