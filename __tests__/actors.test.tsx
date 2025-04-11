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
    const actor1Button = screen.getByTestId(
      `actor-pressable-${mockActors[0].id}`
    )
    const actor2Button = screen.getByTestId(
      `actor-pressable-${mockActors[1].id}`
    )
    const actor3Button = screen.getByTestId(
      `actor-pressable-${mockActors[2].id}`
    )

    expect(actor1Button).toBeTruthy()
    expect(actor2Button).toBeTruthy()
    expect(actor3Button).toBeTruthy()
    expect(
      screen.queryByTestId(`actor-pressable-${mockActors[3].id}`)
    ).toBeNull()

    expect(within(actor1Button).getByText("Image")).toBeTruthy()
    expect(within(actor2Button).getByText("Image")).toBeTruthy()
    expect(within(actor3Button).getByText("Image")).toBeTruthy()
  })

  it("renders actors up to the maxDisplay limit and their images", () => {
    render(<Actors actors={mockActors} maxDisplay={2} />)
    const actor1Button = screen.getByTestId(
      `actor-pressable-${mockActors[0].id}`
    )
    const actor2Button = screen.getByTestId(
      `actor-pressable-${mockActors[1].id}`
    )

    expect(actor1Button).toBeTruthy()
    expect(actor2Button).toBeTruthy()
    expect(
      screen.queryByTestId(`actor-pressable-${mockActors[2].id}`)
    ).toBeNull()

    expect(within(actor1Button).getByText("Image")).toBeTruthy()
    expect(within(actor2Button).getByText("Image")).toBeTruthy()
  })

  it("renders all actors when maxDisplay is greater than the number of actors", () => {
    render(<Actors actors={mockActors} maxDisplay={5} />)
    const actor1Button = screen.getByTestId(
      `actor-pressable-${mockActors[0].id}`
    )
    const actor2Button = screen.getByTestId(
      `actor-pressable-${mockActors[1].id}`
    )
    const actor3Button = screen.getByTestId(
      `actor-pressable-${mockActors[2].id}`
    )
    const actor4Button = screen.getByTestId(
      `actor-pressable-${mockActors[3].id}`
    )

    expect(actor1Button).toBeTruthy()
    expect(actor2Button).toBeTruthy()
    expect(actor3Button).toBeTruthy()
    expect(actor4Button).toBeTruthy()

    expect(within(actor1Button).getByText("Image")).toBeTruthy()
    expect(within(actor2Button).getByText("Image")).toBeTruthy()
    expect(within(actor3Button).getByText("Image")).toBeTruthy()
    expect(within(actor4Button).getByText("Image")).toBeTruthy()
  })

  it("renders actor names correctly (including split names)", async () => {
    render(<Actors actors={mockActors} />)
    expect(screen.getByText(/One/)).toBeTruthy()
    expect(screen.getByText(/TwoLastName/)).toBeTruthy()
  })

  it("renders a default image when profile_path is null", () => {
    render(<Actors actors={[mockActorWithNoImage]} />)
    const actor3Button = screen.getByTestId(
      `actor-pressable-${mockActorWithNoImage.id}`
    )
    expect(actor3Button).toBeTruthy()
  })
})
