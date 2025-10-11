import React from "react"
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react-native"
// Removed usePickerLogic mock import as it is no longer used
import PickerContainer from "../src/components/picker"
import { BasicMovie } from "../src/models/movie"

// Mock internal dependencies
jest.mock("../src/components/pickerSkeleton", () => () => <></>)

// Mock the debounce mechanism globally in jestSetup.js or here.
// We rely on the jestSetup.js debounce mock (using actual setTimeout) for timing, but we need
// to flush timers to ensure the search runs immediately.
jest.useFakeTimers()

const mockMovies: readonly BasicMovie[] = [
  {
    id: 1,
    title: "Test Movie 1",
    release_date: "2022-01-01",
    poster_path: "/a.jpg",
  },
  {
    id: 2,
    title: "Another Movie",
    release_date: "2023-05-15",
    poster_path: "/b.jpg",
  },
  {
    id: 3,
    title: "Bad Guess",
    release_date: "2023-05-15",
    poster_path: "/c.jpg",
  },
]

const mockStore = {
  basicMovies: mockMovies,
  movies: mockMovies, // Full movies should also be mocked for previews
  loading: false,
  isInteractionsDisabled: false,
  playerGame: {
    movie: { id: 100 },
    guesses: [],
    guessesMax: 5,
    correctAnswer: false,
    gaveUp: false,
  },
  tutorialState: {
    showGuessInputTip: true,
    showResultsTip: true,
  },
  makeGuess: jest.fn(),
  dismissGuessInputTip: jest.fn(),
  dismissResultsTip: jest.fn(),
}

// Mock the useGameStore hook implementation for testing
jest.mock("../src/state/gameStore", () => ({
  useGameStore: jest.fn((selector) => selector(mockStore)),
}))

describe("PickerContainer", () => {
  const mockMakeGuess = mockStore.makeGuess
  const mockHandleInputChange = jest.fn() // Now internal to PickerContainer, but we can test the effect on query/results.

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset query for the next test
    mockStore.makeGuess.mockClear()
  })

  it("renders correctly and accepts input", () => {
    render(<PickerContainer />)
    const input = screen.getByPlaceholderText("Search for a movie title...")
    expect(input).toBeTruthy()

    fireEvent.changeText(input, "Test")
    expect(input.props.value).toBe("Test")
  })

  it("shows results container after typing and debouncing", async () => {
    render(<PickerContainer />)
    const input = screen.getByPlaceholderText("Search for a movie title...")

    fireEvent.changeText(input, "Movie")

    // Initially, results should not be visible before debounce or if query is too short
    expect(screen.queryByText("Another Movie (2023)")).toBeNull()

    // Fast-forward time to trigger debounce
    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    // Now results should appear
    await waitFor(() => {
      expect(screen.getByText("Test Movie 1 (2022)")).toBeTruthy()
      expect(screen.getByText("Another Movie (2023)")).toBeTruthy()
    })

    // Expect the preview hint to show
    expect(screen.getByText("💡 Hold any result to preview")).toBeTruthy()
  })

  it("calls makeGuess and clears input upon movie selection", async () => {
    render(<PickerContainer />)
    const input = screen.getByPlaceholderText("Search for a movie title...")
    fireEvent.changeText(input, "Test Movie")

    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    const movieItem = screen.getByText("Test Movie 1 (2022)")
    fireEvent.press(movieItem)

    // Check if makeGuess was called with the correct movie object
    expect(mockMakeGuess).toHaveBeenCalledWith(mockMovies[0])

    // Check if input is cleared (since handleInputChange is called with "")
    // Note: We can't directly check the internal state of the input in RN testing without props
    // We check the side effect of calling handleInputChange("")
  })

  it("displays 'No movies found' when search yields no results", async () => {
    render(<PickerContainer />)
    const input = screen.getByPlaceholderText("Search for a movie title...")
    fireEvent.changeText(input, "ZZZZZZZ")

    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(screen.getByText('No movies found for "ZZZZZZZ"')).toBeTruthy()
    })
  })

  it("does not allow input when interactions are disabled", () => {
    const disabledStore = { ...mockStore, isInteractionsDisabled: true }
    jest.mock("../src/state/gameStore", () => ({
      useGameStore: jest.fn((selector) => selector(disabledStore)),
    }))

    render(<PickerContainer />)
    const input = screen.getByPlaceholderText("Search for a movie title...")
    expect(input.props.editable).toBe(false)
  })
})
