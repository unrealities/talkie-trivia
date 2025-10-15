import React from "react"
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react-native"
import CluesContainer from "../src/components/clues"
import { Movie } from "../src/models/movie"
import { DIFFICULTY_MODES, DifficultyLevel } from "../src/config/difficulty"
import { useGameStore } from "../src/state/gameStore"

// Mock the core components/utilities used by CluesContainer
jest.mock("../src/utils/hapticsService", () => ({
  hapticsService: {
    light: jest.fn(),
  },
}))
jest.mock("react-native-reanimated", () => ({
  // Re-exporting necessary reanimated mocks from jestSetup, but ensuring usage is mocked
  ...jest.requireActual("react-native-reanimated"),
  useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((toValue, options, cb) => {
    if (typeof cb === "function") {
      cb(true)
    }
    return toValue
  }),
  withDelay: jest.fn((delay, animation) => animation),
  withSequence: jest.fn((...animations) => animations[animations.length - 1]),
  useAnimatedReaction: jest.fn((prepare, react) => {
    // Manually trigger reaction logic for typewriter effect testing simulation
    const simulatedProgressValue = prepare()
    if (simulatedProgressValue > 0) {
      react(simulatedProgressValue, simulatedProgressValue - 1)
    }
  }),
  runOnJS: jest.fn(
    (fn) =>
      (...args) =>
        fn(...args)
  ),
  cancelAnimation: jest.fn(),
}))

const mockMovie: Movie = {
  id: 1,
  title: "The Test Movie",
  tagline: "A thrilling test.",
  overview:
    "This is a test movie overview with several important details to be split into multiple clues for the user to guess. It must be long enough to generate at least five segments.",
  poster_path: "/test.jpg",
  director: { id: 1, name: "Test Director" },
  actors: [],
  genres: [],
  vote_average: 7.5,
  vote_count: 1000,
  release_date: "2023-01-01",
  runtime: 120,
  imdb_id: "tt1234567",
}

// Define mock store utility using new DifficultyLevel keys
const mockStoreFactory = (
  difficultyKey: DifficultyLevel,
  guesses: number[] = [],
  isOver: boolean = false
) => ({
  playerGame: {
    correctAnswer: isOver,
    guesses: guesses.map((id) => ({ movieId: id })),
    movie: mockMovie,
    // Access guessesMax via the centralized constant mapping
    guessesMax: DIFFICULTY_MODES[difficultyKey]?.guessesMax || 5,
  },
  movieOverview: mockMovie.overview,
  isInteractionsDisabled: isOver,
  difficulty: difficultyKey,
  loading: false,
})

let mockStore = mockStoreFactory("LEVEL_3", [], false) // Default to Medium
const mockedUseGameStore = useGameStore as jest.Mock

describe("Clues Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseGameStore.mockImplementation((selector) => selector(mockStore))
  })

  // The word count depends on the precise splitting function which aims for 5 segments,
  // total words in overview is 26.
  // Segment lengths: 6, 7, 7, 5, 1 = 26 words total.
  // Cumulative words: 6, 13, 20, 25, 26

  it("reveals 1 clue initially in 'LEVEL_2' mode (one per guess)", () => {
    mockStore = mockStoreFactory("LEVEL_2", [], false)
    const { getByText } = render(<CluesContainer />)

    // Initial guess count 0. 0 + 1 = 1 clue revealed.
    expect(getByText("6/26 words revealed")).toBeTruthy()
  })

  it("reveals 2 clues after one guess in 'LEVEL_2' mode", () => {
    mockStore = mockStoreFactory("LEVEL_2", [100], false)
    const { rerender, getByText } = render(<CluesContainer />)

    // Guess count 1. 1 + 1 = 2 clues revealed.
    expect(getByText("13/26 words revealed")).toBeTruthy()
  })

  it("reveals clues slowly in 'LEVEL_5' mode (one clue per two guesses)", () => {
    // Initial load (guesses 0): 1 clue (Math.floor(0/2) + 1) = 1 clue
    mockStore = mockStoreFactory("LEVEL_5", [], false)
    const { rerender, getByText } = render(<CluesContainer />)

    expect(getByText("6/26 words revealed")).toBeTruthy()

    // After 1st guess (guesses 1): still 1 clue (Math.floor(1/2) + 1) = 1 clue
    mockStore = mockStoreFactory("LEVEL_5", [1], false)
    rerender(<CluesContainer />)
    expect(getByText("6/26 words revealed")).toBeTruthy()

    // After 2nd guess (guesses 2): 2 clues (Math.floor(2/2) + 1) = 2 clues
    mockStore = mockStoreFactory("LEVEL_5", [1, 2], false)
    rerender(<CluesContainer />)
    expect(getByText("13/26 words revealed")).toBeTruthy()
  })

  it("reveals all clues when game is over (correctAnswer is true) regardless of mode", () => {
    mockStore = mockStoreFactory("LEVEL_5", [1, 2], true) // Extreme mode, game won
    const { getByText } = render(<CluesContainer />)

    // All words should be revealed (26 total words)
    expect(getByText("26/26 words revealed")).toBeTruthy()
  })
})
