import React from "react"
import { render, fireEvent, screen } from "@testing-library/react-native"
import GameUI from "../src/components/gameUI"
import { BasicMovie, Director, Movie } from "../src/models/movie"
import { Game, PlayerGame } from "../src/models/game"
import Player from "../src/models/player"
import PlayerStats from "../src/models/playerStats"

const mockDirector: Director = {
  id: 1,
  name: "director",
  popularity: 100,
  profile_path: "/director.html",
}

const mockPlayer: Player = {
  id: "player1",
  name: "Test Player",
}

const mockMovie: Movie = {
  id: 1,
  actors: [],
  director: mockDirector,
  imdb_id: 1234,
  tagline: "testing",
  title: "Test Movie",
  release_date: "2023-01-01",
  poster_path: "/test.jpg",
  overview: "An exciting test movie.",
  popularity: 100,
  genres: [],
  vote_average: 8.0,
  vote_count: 1000,
}

const mockMovies: readonly BasicMovie[] = [
  mockMovie,
  { ...mockMovie, id: 2, title: "Another Movie" },
]

const mockGame: Game = {
  id: "game1",
  date: new Date(),
  guessesMax: 5,
  movie: mockMovie,
}

const mockPlayerGame: PlayerGame = {
  id: "pg1",
  playerID: "player1",
  guesses: [],
  startDate: new Date(),
  endDate: new Date(),
  hintsUsed: {},
  game: mockGame,
  correctAnswer: false,
  gaveUp: false,
}

const mockPlayerStats: PlayerStats = {
  id: "player1",
  games: 5,
  wins: [],
  currentStreak: 2,
  maxStreak: 4,
  hintsUsedCount: 1,
  hintsAvailable: 2,
}

// --- Mocks for Child Components and Libraries ---

// Mock child components to isolate GameUI
jest.mock("../src/component/clues", () => "CluesContainer")
jest.mock("../src/component/guesses", () => "GuessesContainer")
jest.mock("../src/component/network", () => "NetworkContainer")
jest.mock("./modal", () => "MovieModal")
jest.mock("../src/component/picker", () => "PickerContainer")
jest.mock("../src/component/titleHeader", () => "TitleHeader")
jest.mock("../src/component/hint", () => "HintContainer")
jest.mock("../src/component/confettiCelebration", () => "ConfettiCelebration")
jest.mock("../src/component/confirmationModal", () => "ConfirmationModal")

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock") // Use the official mock
  // Mock useAnimatedStyle if it were used directly in GameUI (it's not here)
  // Reanimated.useAnimatedStyle = jest.fn(() => ({}));
  // Mock Animated.View specifically if needed, or let the mock handle it
  Reanimated.View = "Animated.View" // Simple mock for testing presence
  return Reanimated
})

// --- Default Props Helper ---
const createTestProps = (overrides = {}) => {
  const defaultProps = {
    isNetworkConnected: true,
    movies: mockMovies,
    player: mockPlayer,
    playerGame: mockPlayerGame,
    playerStats: mockPlayerStats,
    showModal: false,
    showConfetti: false,
    guessFeedback: null,
    showGiveUpConfirmationDialog: false,
    isInteractionsDisabled: false,
    animatedModalStyles: {}, // Provide a default empty object
    handleGiveUp: jest.fn(),
    cancelGiveUp: jest.fn(),
    confirmGiveUp: jest.fn(),
    handleConfettiStop: jest.fn(),
    provideGuessFeedback: jest.fn(),
    setShowModal: jest.fn(),
    setShowConfetti: jest.fn(),
    updatePlayerGame: jest.fn(),
    updatePlayerStats: jest.fn(),
  }
  return { ...defaultProps, ...overrides }
}

// --- Test Suite ---
describe("GameUI", () => {
  it("renders correctly with default props", () => {
    const props = createTestProps()
    render(<GameUI {...props} />)

    // Check if core child components are rendered (using their mock names)
    expect(screen.getByText("NetworkContainer")).toBeTruthy()
    expect(screen.getByText("TitleHeader")).toBeTruthy()
    expect(screen.getByText("CluesContainer")).toBeTruthy()
    expect(screen.getByText("HintContainer")).toBeTruthy()
    expect(screen.getByText("PickerContainer")).toBeTruthy()
    expect(screen.getByText("GuessesContainer")).toBeTruthy()
    expect(screen.getByText("MovieModal")).toBeTruthy() // Mocked components render their name
    expect(screen.getByText("ConfettiCelebration")).toBeTruthy()
    expect(screen.getByText("ConfirmationModal")).toBeTruthy()

    // Check for the Give Up button
    expect(screen.getByRole("button", { name: /give up/i })).toBeOnTheScreen()

    // Check that feedback text is not present initially
    expect(screen.queryByTestId("guess-feedback-text")).toBeNull() // Assuming movieStyles.feedbackText has testID
    // Or query by the text itself if feedback isn't present
    expect(screen.queryByText(/.+/)).not.toContain("Some Feedback") // Adjust regex if needed
  })

  it("displays guess feedback when provided", () => {
    const feedback = "Incorrect Guess!"
    const props = createTestProps({ guessFeedback: feedback })
    render(<GameUI {...props} />)

    // Check if the feedback text is displayed
    expect(screen.getByText(feedback)).toBeTruthy()
    // Or add testID to the Text component in GameUI:
    // <Text testID="guess-feedback-text" style={movieStyles.feedbackText}>{guessFeedback}</Text>
    // expect(screen.getByTestId("guess-feedback-text")).toHaveTextContent(feedback);
  })

  it("calls handleGiveUp when the Give Up button is pressed", () => {
    const props = createTestProps()
    render(<GameUI {...props} />)

    const giveUpButton = screen.getByRole("button", { name: /give up/i })
    fireEvent.press(giveUpButton)

    expect(props.handleGiveUp).toHaveBeenCalledTimes(1)
  })

  it("disables the Give Up button when isInteractionsDisabled is true", () => {
    const props = createTestProps({ isInteractionsDisabled: true })
    render(<GameUI {...props} />)

    const giveUpButton = screen.getByRole("button", { name: /give up/i })

    // Check accessibility state for disabled
    expect(giveUpButton).toBeDisabled()

    // Try pressing it and ensure the handler is NOT called
    fireEvent.press(giveUpButton)
    expect(props.handleGiveUp).not.toHaveBeenCalled()
  })

  it("passes correct props to NetworkContainer", () => {
    const props = createTestProps({ isNetworkConnected: false })
    // We need to check props passed to the mock
    const MockNetworkContainer = require("./network") // Get the mock constructor
    render(<GameUI {...props} />)
    expect(MockNetworkContainer).toHaveBeenCalledWith(
      expect.objectContaining({ isConnected: false }),
      expect.anything() // Context argument
    )
  })

  it("passes correct props to CluesContainer", () => {
    const props = createTestProps()
    const MockCluesContainer = require("./clues")
    render(<GameUI {...props} />)
    expect(MockCluesContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        correctGuess: props.playerGame.correctAnswer,
        guesses: props.playerGame.guesses,
        summary: props.playerGame.game.movie.overview,
        playerGame: props.playerGame,
        isGameOver: props.isInteractionsDisabled,
      }),
      expect.anything()
    )
  })

  it("passes correct props to HintContainer", () => {
    const props = createTestProps()
    const MockHintContainer = require("./hint")
    render(<GameUI {...props} />)
    expect(MockHintContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        playerGame: props.playerGame,
        updatePlayerGame: props.updatePlayerGame,
        isInteractionsDisabled: props.isInteractionsDisabled,
        hintsAvailable: props.playerStats.hintsAvailable,
        updatePlayerStats: props.updatePlayerStats,
      }),
      expect.anything()
    )
  })

  it("passes correct props to PickerContainer", () => {
    const props = createTestProps()
    const MockPickerContainer = require("./picker")
    render(<GameUI {...props} />)
    expect(MockPickerContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        playerGame: props.playerGame,
        movies: props.movies,
        updatePlayerGame: props.updatePlayerGame,
        onGuessFeedback: props.provideGuessFeedback,
        setShowConfetti: props.setShowConfetti,
      }),
      expect.anything()
    )
  })

  it("passes correct props to GuessesContainer", () => {
    const props = createTestProps()
    const MockGuessesContainer = require("./guesses")
    render(<GameUI {...props} />)
    expect(MockGuessesContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        guesses: props.playerGame.guesses,
        movie: props.playerGame.game.movie,
        movies: props.movies,
      }),
      expect.anything()
    )
  })

  it("passes correct movie to MovieModal when game is won", () => {
    const wonGame = { ...mockPlayerGame, correctAnswer: true }
    const props = createTestProps({ playerGame: wonGame, showModal: true })
    const MockMovieModal = require("./modal")
    render(<GameUI {...props} />)
    expect(MockMovieModal).toHaveBeenCalledWith(
      expect.objectContaining({
        movie: wonGame.game.movie, // Should pass the correct movie
        show: true,
        toggleModal: props.setShowModal,
      }),
      expect.anything()
    )
  })

  it("passes correct movie to MovieModal when player gave up", () => {
    const gaveUpGame = { ...mockPlayerGame, gaveUp: true }
    const props = createTestProps({ playerGame: gaveUpGame, showModal: true })
    const MockMovieModal = require("./modal")
    render(<GameUI {...props} />)
    expect(MockMovieModal).toHaveBeenCalledWith(
      expect.objectContaining({
        movie: gaveUpGame.game.movie, // Should pass the correct movie
        show: true,
        toggleModal: props.setShowModal,
      }),
      expect.anything()
    )
  })

  it("passes null movie to MovieModal when game is ongoing", () => {
    const props = createTestProps({ showModal: true }) // Game is in progress by default mock
    const MockMovieModal = require("./modal")
    render(<GameUI {...props} />)
    expect(MockMovieModal).toHaveBeenCalledWith(
      expect.objectContaining({
        movie: null, // Should pass null
        show: true,
        toggleModal: props.setShowModal,
      }),
      expect.anything()
    )
  })

  it("passes correct props to ConfettiCelebration", () => {
    const props = createTestProps({ showConfetti: true })
    const MockConfetti = require("./confettiCelebration")
    render(<GameUI {...props} />)
    expect(MockConfetti).toHaveBeenCalledWith(
      expect.objectContaining({
        startConfetti: true,
        onConfettiStop: props.handleConfettiStop,
      }),
      expect.anything()
    )
  })

  it("passes correct props to ConfirmationModal", () => {
    const props = createTestProps({ showGiveUpConfirmationDialog: true })
    const MockConfirmModal = require("./confirmationModal")
    render(<GameUI {...props} />)
    expect(MockConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
        title: "Give Up?",
        message: "Are you sure you want to give up?",
        confirmText: "Give Up",
        cancelText: "Cancel",
        onConfirm: props.confirmGiveUp,
        onCancel: props.cancelGiveUp,
      }),
      expect.anything()
    )
  })
})
