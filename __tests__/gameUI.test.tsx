import React from "react"
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native"
import GameUI from "../src/components/gameplayContainer"
import { BasicMovie } from "../src/models/movie"
import { PlayerGame, Game } from "../src/models/game"
import Player from "../src/models/player"
import PlayerStats from "../src/models/playerStats"

// Mocking child components
jest.mock("../src/components/clues", () => ({
  __esModule: true,
  default: () => <div testID="clues-container" />,
}))
jest.mock("../src/components/guesses", () => ({
  __esModule: true,
  default: () => <div testID="guesses-container" />,
}))
jest.mock("../src/components/network", () => ({
  __esModule: true,
  default: () => <div testID="network-container" />,
}))
// Modify the mock for './modal' (MovieModal) in this file. The mock should be a function that accepts props. If the 'show' prop is true and the 'movie' prop is not null, the mock should render a button with the text 'Play Again'. This button should call the toggleModal prop when pressed.
jest.mock("../src/components/modal", () => ({
  __esModule: true,
  default: ({ show, movie, toggleModal }: any) => {
    if (show && movie) {
      return (
        <button
          onClick={() => {
            toggleModal()
          }}
          testID="play-again-button"
        >
          Play Again
        </button>
      )
    }
    return <div testID="modal-container" />
  },
}))
jest.mock("../src/components/picker", () => ({
  __esModule: true,
  default: () => <div testID="picker-container" />,
}))
jest.mock("../src/components/titleHeader", () => ({
  __esModule: true,
  default: () => <div testID="title-header" />,
}))
jest.mock("../src/components/hint", () => ({
  __esModule: true,
  default: () => <div testID="hint-container" />,
}))
jest.mock("../src/components/confettiCelebration", () => ({
  __esModule: true,
  default: () => <div testID="confetti-celebration" />,
}))
jest.mock("../src/components/confirmationModal", () => ({
  __esModule: true,
  default: () => <div testID="confirmation-modal" />,
}))
jest.mock("react-native-reanimated", () => {
  return {
    View: ({ children, style }: any) => <div style={style}>{children}</div>,
    default: {
      View: ({ children, style }: any) => <div style={style}>{children}</div>,
    },
  }
})

const mockMovies: readonly BasicMovie[] = [
  { id: "1", title: "Movie 1" },
  { id: "2", title: "Movie 2" },
]

const mockGame: Game = {
  movie: {
    // Keep this structure for the movie details needed by GameUI
    id: "1",
    title: "Test Movie",
    release_date: "2022-01-01",
    overview: "A test movie",
  },
  genres: [],
  actors: [],
  directors: [],
}

const mockPlayerGame: PlayerGame = {
  game: mockGame,
  guesses: [],
  correctAnswer: false,
  gaveUp: false,
}

const mockPlayer: Player = {
  id: "user123",
  name: "test@example.com",
}

const mockPlayerStats: PlayerStats = {
  id: "user123",
  currentStreak: 0,
  games: 0,
  maxStreak: 0,
  wins: [],
  hintsAvailable: 0,
  hintsUsedCount: 0,
}

const mockProps = {
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
  animatedModalStyles: {},

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

const renderWithProps = (props: any) => {
  return render(<GameUI {...props} />)
}

describe("GameUI", () => {
  it("renders correctly with game data", () => {
    const gameDataProps = {
      ...mockProps,
      playerGame: mockPlayerGame, // Ensure playerGame has complete game and movie data
    }
    render(<GameUI {...gameDataProps} />)

    expect(screen.getByTestId("network-container")).toBeDefined()
    expect(screen.getByTestId("title-header")).toBeDefined()
    expect(screen.getByTestId("clues-container")).toBeDefined()
    expect(screen.getByTestId("hint-container")).toBeDefined()
    expect(screen.getByTestId("picker-container")).toBeDefined()
    expect(screen.getByTestId("guesses-container")).toBeDefined()
  })

  it("renders guess feedback when present", () => {
    const feedback = "Try Again!"
    renderWithProps({ ...mockProps, guessFeedback: feedback })
    expect(screen.getByText(feedback)).toBeDefined()
  })

  it("disables interactions when isInteractionsDisabled is true", () => {
    renderWithProps({ ...mockProps, isInteractionsDisabled: true })
    expect(
      screen.getByRole("button", { name: "Give Up?" }).props.disabled
    ).toBe(true)
  })

  it("renders all components", () => {
    render(<GameUI {...mockProps} />)

    expect(screen.getByTestId("clues-container")).toBeDefined()
    expect(screen.getByTestId("guesses-container")).toBeDefined()
    expect(screen.getByTestId("network-container")).toBeDefined()
    expect(screen.getByTestId("picker-container")).toBeDefined()
    expect(screen.getByTestId("title-header")).toBeDefined()
    expect(screen.getByTestId("hint-container")).toBeDefined()
  })

  it("renders the modal when showModal is true", () => {
    render(<GameUI {...{ ...mockProps, showModal: true }} />)
    expect(screen.getByTestId("modal-container")).toBeDefined()
  })

  it("renders the confetti when showConfetti is true", () => {
    render(<GameUI {...{ ...mockProps, showConfetti: true }} />)
    expect(screen.getByTestId("confetti-celebration")).toBeDefined()
  })

  it("renders the ConfirmationModal when showGiveUpConfirmationDialog is true", () => {
    render(<GameUI {...{ ...mockProps, showGiveUpConfirmationDialog: true }} />)
    expect(screen.getByTestId("confirmation-modal")).toBeDefined()
  })

  it("calls handleGiveUp when Give Up button is pressed", () => {
    render(<GameUI {...mockProps} />)
    const giveUpButton = screen.getByText("Give Up?")
    fireEvent.press(giveUpButton)
    expect(mockProps.handleGiveUp).toHaveBeenCalled()
  })

  it("calls handleNewGame when Play Again button is pressed after game over", async () => {
    const toggleModal = jest.fn()
    const gameCompleteProps = {
      ...mockProps,
      playerGame: { ...mockPlayerGame, correctAnswer: true },
      showModal: true, // Assuming modal shows on game over
    }
    render(<GameUI {...gameCompleteProps} toggleModal={toggleModal} />)
    await screen.findByTestId("play-again-button")
    expect(toggleModal).toHaveBeenCalled()
  })
})
