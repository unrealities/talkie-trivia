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
import Facts from "../src/components/facts"
import { Movie, Actor, Director, Genre } from "../src/models/movie"

jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}))

jest.spyOn(Alert, "alert")

beforeEach(() => {
  jest.clearAllMocks()

  ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
  ;(Linking.openURL as jest.Mock).mockResolvedValue(true)
  ;(Alert.alert as jest.Mock).mockClear()
})

const mockDirector: Director = {
  id: 1,
  name: "Test Director",
  popularity: 8,
  profile_path: "/director.jpg",
}

const mockActors: Actor[] = [
  {
    id: 101,
    name: "Actor One",
    order: 0,
    popularity: 9,
    profile_path: "/a1.jpg",
    imdb_id: "nm111",
  },
  {
    id: 102,
    name: "Actor Two",
    order: 1,
    popularity: 8,
    profile_path: "/a2.jpg",
    imdb_id: "nm222",
  },
]

const mockGenres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
]

const mockMovieFull: Movie = {
  id: 123,
  title: "Awesome Test Movie",
  overview: "An overview.",
  tagline: "The tagline!",
  poster_path: "/poster.jpg",
  release_date: "2023-01-01",
  imdb_id: 7654321,
  director: mockDirector,
  actors: mockActors,
  genres: mockGenres,
  popularity: 100,
  vote_average: 8.5,
  vote_count: 1000,
}

const mockMovieMinimal: Movie = {
  id: 456,
  title: "Minimal Movie",
  overview: "Minimal overview.",
  tagline: "",
  poster_path: null,
  release_date: "2022-05-05",
  imdb_id: 0,
  director: null as any,
  actors: [],
  genres: [],
  popularity: 50,
  vote_average: 6.0,
  vote_count: 50,
}

describe("Facts Component", () => {
  it("renders loading indicator when isLoading is true", () => {
    render(<Facts movie={mockMovieFull} isLoading={true} />)

    expect(screen.getByTestId("activity-indicator")).toBeTruthy()
    expect(screen.queryByText(mockMovieFull.title)).toBeNull()
  })

  it("renders error message when error prop is provided", () => {
    const errorMessage = "Failed to load movie data"
    render(<Facts movie={mockMovieFull} error={errorMessage} />)
    expect(screen.getByText(errorMessage)).toBeTruthy()
    expect(screen.queryByText(mockMovieFull.title)).toBeNull()
  })

  it("renders movie details correctly when data is provided", () => {
    render(<Facts movie={mockMovieFull} />)

    const titleElement = screen.getByRole("button", {
      name: `IMDb page for ${mockMovieFull.title}`,
    })
    expect(within(titleElement).getByText(mockMovieFull.title)).toBeTruthy()

    expect(screen.getByText(mockMovieFull.tagline)).toBeTruthy()

    expect(
      screen.getByText(`Directed by ${mockMovieFull.director.name}`)
    ).toBeTruthy()

    expect(screen.getByText("Image")).toBeTruthy()

    expect(screen.getByText(mockActors[0].name.split(" ")[0])).toBeTruthy()
    expect(screen.getByText(mockActors[1].name.split(" ")[0])).toBeTruthy()
  })

  it("renders default image when poster_path is null", () => {
    render(<Facts movie={mockMovieMinimal} />)

    expect(screen.getByText("Image")).toBeTruthy()
  })

  it("handles missing optional fields gracefully", () => {
    render(<Facts movie={mockMovieMinimal} />)

    expect(screen.getByText(mockMovieMinimal.title)).toBeTruthy()
    expect(screen.queryByText(/Directed by/)).toBeNull()
    expect(screen.queryByText(mockMovieFull.tagline)).toBeNull()
    expect(screen.queryByText(/Actor One/)).toBeNull()
  })

  it("attempts to open IMDb link when title is pressed (and imdb_id exists)", async () => {
    render(<Facts movie={mockMovieFull} />)
    const titleElement = screen.getByRole("button", {
      name: `IMDb page for ${mockMovieFull.title}`,
    })

    fireEvent.press(titleElement)

    const expectedUrl = `https://www.imdb.com/title/${mockMovieFull.imdb_id}`
    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith(expectedUrl)
    })
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl)
    })
    expect(Alert.alert).not.toHaveBeenCalled()
  })

  it("shows alert when title is pressed and imdb_id is missing", () => {
    render(<Facts movie={mockMovieMinimal} />)
    const titleElement = screen.getByRole("button", {
      name: `IMDb page for ${mockMovieMinimal.title}`,
    })

    fireEvent.press(titleElement)

    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(Alert.alert).toHaveBeenCalledWith(
      "No IMDb Link",
      "IMDb link is unavailable for this movie"
    )
  })

  it("shows alert if Linking.canOpenURL returns false", async () => {
    ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(false)
    render(<Facts movie={mockMovieFull} />)
    const titleElement = screen.getByRole("button", {
      name: `IMDb page for ${mockMovieFull.title}`,
    })

    fireEvent.press(titleElement)

    const expectedUrl = `https://www.imdb.com/title/${mockMovieFull.imdb_id}`
    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith(expectedUrl)
    })
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(Alert.alert).toHaveBeenCalledWith(
      "Unsupported Link",
      "Unable to open IMDb page"
    )
  })

  it("shows alert if Linking.openURL rejects", async () => {
    const linkError = new Error("Failed to open")
    ;(Linking.openURL as jest.Mock).mockRejectedValue(linkError)
    render(<Facts movie={mockMovieFull} />)
    const titleElement = screen.getByRole("button", {
      name: `IMDb page for ${mockMovieFull.title}`,
    })

    fireEvent.press(titleElement)

    const expectedUrl = `https://www.imdb.com/title/${mockMovieFull.imdb_id}`
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl)
    })
    expect(Alert.alert).toHaveBeenCalledWith(
      "Link Error",
      expect.stringContaining("Could not open the IMDb link. Failed to open")
    )
  })
})
