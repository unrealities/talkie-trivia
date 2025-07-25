import React from "react"
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native"
import { usePickerLogic } from "../src/utils/hooks/usePickerLogic"
import PickerContainer from "../src/components/picker"
import { GameProvider } from "../src/contexts/gameContext"
import { BasicMovie } from "../src/models/movie"

jest.mock("../src/utils/hooks/usePickerLogic")
const mockUsePickerLogic = usePickerLogic as jest.Mock
jest.mock("../src/components/pickerSkeleton", () => () => <></>)

const mockMovies: readonly BasicMovie[] = [
  { id: 1, title: "Test Movie 1", release_date: "2022-01-01" },
  { id: 2, title: "Another Movie", release_date: "2023-05-15" },
]

const mockGameContextValue = {
  loading: false,
  movies: mockMovies,
  playerGame: {
    movie: { id: 1 },
    guesses: [],
    guessesMax: 5,
    correctAnswer: false,
    gaveUp: false,
  },
  isInteractionsDisabled: false,
  updatePlayerGame: jest.fn(),
  setShowConfetti: jest.fn(),
}

describe("PickerContainer and PickerLogic", () => {
  const mockHandleInputChange = jest.fn()
  const mockHandleMovieSelection = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePickerLogic.mockReturnValue({
      pickerState: { status: "idle" },
      shakeAnimation: { value: 0 },
      handleInputChange: mockHandleInputChange,
      handleMovieSelection: mockHandleMovieSelection,
    })
  })

  const renderWithContext = (component: React.ReactElement) => {
    return render(
      <GameProvider value={mockGameContextValue as any}>
        {component}
      </GameProvider>
    )
  }

  it("calls handleInputChange when text is entered", () => {
    renderWithContext(<PickerContainer provideGuessFeedback={jest.fn()} />)
    const input = screen.getByPlaceholderText("Search for a movie title...")
    fireEvent.changeText(input, "Test")
    expect(mockHandleInputChange).toHaveBeenCalledWith("Test")
  })

  it("renders movie results when pickerState has results", async () => {
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
      pickerState: {
        status: "results",
        query: "Test",
        results: mockMovies,
      },
    })
    renderWithContext(<PickerContainer provideGuessFeedback={jest.fn()} />)
    await waitFor(() => {
      expect(screen.getByText("Test Movie 1 (2022)")).toBeTruthy()
      expect(screen.getByText("Another Movie (2023)")).toBeTruthy()
    })
  })

  it("calls handleMovieSelection when a movie result is pressed", async () => {
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
      pickerState: {
        status: "results",
        query: "Test",
        results: [mockMovies[0]],
      },
    })

    renderWithContext(<PickerContainer provideGuessFeedback={jest.fn()} />)
    const movieItem = await screen.findByText("Test Movie 1 (2022)")
    fireEvent.press(movieItem)

    expect(mockHandleMovieSelection).toHaveBeenCalledWith(mockMovies[0])
  })

  it("does not render a submit button", () => {
    renderWithContext(<PickerContainer provideGuessFeedback={jest.fn()} />)
    const submitButton = screen.queryByText("Submit Guess")
    expect(submitButton).toBeNull()
  })

  it("disables input when interactions are disabled", () => {
    const disabledContextValue = {
      ...mockGameContextValue,
      isInteractionsDisabled: true,
    }
    render(
      <GameProvider value={disabledContextValue as any}>
        <PickerContainer provideGuessFeedback={jest.fn()} />
      </GameProvider>
    )

    const input = screen.getByPlaceholderText("Search for a movie title...")
    expect(input.props.editable).toBe(false)
  })
})
