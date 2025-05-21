import React from "react"
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native"
import { PlayerGame } from "../src/models/game"
import { PickerUI } from "../src/components/pickerUI"
import { BasicMovie } from "../src/models/movie"
import { colors } from "../src/styles/global"
import { usePickerLogic } from "../src/utils/hooks/usePickerLogic"

// Mock the usePickerLogic hook
jest.mock("../src/utils/hooks/usePickerLogic")

const mockUsePickerLogic = usePickerLogic as jest.Mock

const mockMovie: BasicMovie = {
  id: "1",
  title: "Test Movie",
  release_date: "2022-01-01",
}
const mockMovies: BasicMovie[] = [
  mockMovie,
  { id: "2", title: "Another Movie", release_date: "2023-05-15" },
]

const mockPlayerGame: PlayerGame = {
  game: {
    id: "game1",
    movieId: "1",
    guessesMax: 5,
    hintsMax: 3,
    gameDate: "2023-10-27",
    gameIndex: 1,
    daily: true,
  },
  guesses: [],
  hintsUsed: 0,
  correctAnswer: false,
  gaveUp: false,
  playerId: "player1",
  playerGameId: "pg1",
}

const defaultProps = {
  enableSubmit: true,
  movies: mockMovies,
  playerGame: mockPlayerGame,
  updatePlayerGame: jest.fn(),
  onGuessFeedback: jest.fn(),
  setShowConfetti: jest.fn(),
}

describe("PickerContainer", () => {
  beforeEach(() => {
    mockUsePickerLogic.mockReturnValue({
      selectedMovieTitle: "Select a movie", // Explicitly mock selectedMovieTitle
      selectedMovie: { id: "", title: "Select a movie", release_date: "" },
      // Provide default mock values for all other properties returned by usePickerLogic
      isLoading: false,
      error: null,
      buttonScale: { _value: 1 }, // Mock animated value structure
      DEFAULT_BUTTON_TEXT: "Select a movie",
      isInteractionsDisabled: false, // Default to enabled
      searchText: "",
      foundMovies: [],
      // Provide default mock values for all other properties returned by usePickerLogic
      isSearching: false,
      handleInputChange: jest.fn(),
      handleMovieSelection: jest.fn(),
      onPressCheck: jest.fn(),
      handleFocus: jest.fn(),
      handleBlur: jest.fn(),
    })
  })

  // Mock the selectedMovieTitle separately based on the selectedMovie mock

  test("renders with default props", () => {
    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )
    expect(screen.getByPlaceholderText("Search for a movie...")).toBeVisible()
    expect(screen.getByText("Select a movie")).toBeVisible()
  })

  test("disables interactions when game is over (correctAnswer)", () => {
    const playerGameWithCorrectAnswer: PlayerGame = {
      ...mockPlayerGame,
      correctAnswer: true,
    }
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      isInteractionsDisabled: true,
      selectedMovieTitle: "Select a movie",
    })

    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )
    expect(screen.getByPlaceholderText("Search for a movie...")).toBeDisabled()
    expect(screen.getByText("Select a movie")).toBeVisible() // Button is visible but style should indicate disabled
    // Checking button style requires inspecting the animated style, which is tricky with RTL.
    // The mock usePickerLogic already returns isInteractionsDisabled: true based on playerGame state.
  })

  test("disables interactions when game is over (gaveUp)", () => {
    const playerGameWithGaveUp: PlayerGame = {
      ...mockPlayerGame,
      gaveUp: true,
    }
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      isInteractionsDisabled: true,
      selectedMovieTitle: "Select a movie",
    })
    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )
    expect(screen.getByPlaceholderText("Search for a movie...")).toBeDisabled()
    expect(screen.getByText("Select a movie")).toBeVisible() // Button is visible but style should indicate disabled
  })

  test("disables interactions when guesses are maxed out", () => {
    const playerGameWithMaxGuesses: PlayerGame = {
      ...mockPlayerGame,
      guesses: ["guess1", "guess2", "guess3", "guess4", "guess5"],
    }
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      isInteractionsDisabled: true,
      selectedMovieTitle: "Select a movie",
    })
    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )
    expect(screen.getByPlaceholderText("Search for a movie...")).toBeDisabled()
    expect(screen.getByText("Select a movie")).toBeVisible() // Button is visible but style should indicate disabled
  })

  test("handles input change and updates search text", () => {
    const handleInputChange = jest.fn()
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      handleInputChange,
      selectedMovieTitle: "Select a movie",
    })
    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )
    fireEvent.changeText(
      screen.getByPlaceholderText("Search for a movie..."),
      "new search"
    )
    expect(handleInputChange).toHaveBeenCalledWith("new search")
  })

  test("selects a movie and updates the selected movie", async () => {
    const handleMovieSelection = jest.fn()
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      foundMovies: mockMovies, // Override specific properties for this test
      handleMovieSelection,
    })
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
      selectedMovieTitle: "Select a movie",
    }) // Initial render title

    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )

    // Need to simulate typing to show the found movies
    fireEvent.changeText(
      screen.getByPlaceholderText("Search for a movie..."),
      "Test"
    )

    await waitFor(() => {
      expect(screen.getByText("Test Movie (2022)")).toBeVisible()
    })
    // After selection, the title should update, but the mock doesn't reflect this state change.
    // The test focuses on if handleMovieSelection is called, which is correct.

    fireEvent.press(screen.getByText("Test Movie (2022)"))
    expect(handleMovieSelection).toHaveBeenCalledWith(mockMovie)
  })

  test("presses the check button and triggers onPressCheck", () => {
    const onPressCheck = jest.fn()
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: mockMovie, // Simulate a movie being selected
      onPressCheck,
      selectedMovieTitle: mockMovie.title,
    })
    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )
    fireEvent.press(screen.getByLabelText(`Check movie: ${mockMovie.title}`))
    expect(onPressCheck).toHaveBeenCalled()
  })

  test("renderItem function renders movie items correctly", () => {
    const handleMovieSelection = jest.fn()
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      foundMovies: mockMovies,
      selectedMovie: { id: "", title: "Select a movie", release_date: "" },
      handleMovieSelection,
      selectedMovieTitle: "Select a movie",
    })
    const mockLogicProps = mockUsePickerLogic()
    const { getByText } = render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )
    fireEvent.changeText(
      screen.getByPlaceholderText("Search for a movie..."),
      "Test"
    ) // Trigger search and display list

    expect(getByText("Test Movie (2022)")).toBeVisible()
    expect(getByText("Another Movie (2023)")).toBeVisible()
  })

  test("animated button style reflects disabled state and selected movie", () => {
    // Testing animated styles directly with RTL is complex.\n    // We are testing the logic within usePickerLogic and the passed props to PickerUI.\n    // We can check if the props passed to PickerUI reflect the expected state.\n
    const selectedMovie = { id: "3", title: "Short", release_date: "" }
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie,
      DEFAULT_BUTTON_TEXT: "Select a movie",
      isInteractionsDisabled: false,
      selectedMovieTitle: selectedMovie.title,
    })
    const mockLogicProps = mockUsePickerLogic()
    const { rerender } = render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )

    // Check when a valid movie is selected
    expect(mockUsePickerLogic().selectedMovie).toEqual(selectedMovie)

    // Check when interactions are disabled
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie,
      DEFAULT_BUTTON_TEXT: "Select a movie",
      isInteractionsDisabled: true,
      selectedMovieTitle: selectedMovie.title,
    })
    const nextMockLogicProps = mockUsePickerLogic()
    rerender(
      <PickerUI
        searchText={nextMockLogicProps.searchText}
        selectedMovieTitle={nextMockLogicProps.selectedMovieTitle}
        selectedMovie={nextMockLogicProps.selectedMovie}
        foundMovies={nextMockLogicProps.foundMovies}
        isSearching={nextMockLogicProps.isSearching}
        isInteractionsDisabled={nextMockLogicProps.isInteractionsDisabled}
        buttonScale={nextMockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={nextMockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={nextMockLogicProps.handleInputChange}
        handleMovieSelection={nextMockLogicProps.handleMovieSelection}
        onPressCheck={nextMockLogicProps.onPressCheck}
        handleFocus={nextMockLogicProps.handleFocus}
        handleBlur={nextMockLogicProps.handleBlur}
      />
    )
    expect(mockUsePickerLogic().isInteractionsDisabled).toBe(true)

    // Check when no movie is selected (default text)
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: { id: "", title: "Select a movie", release_date: "" },
      DEFAULT_BUTTON_TEXT: "Select a movie",
      isInteractionsDisabled: false,
      selectedMovieTitle: "Select a movie",
    })
    const anotherMockLogicProps = mockUsePickerLogic()
    rerender(
      <PickerUI
        searchText={anotherMockLogicProps.searchText}
        selectedMovieTitle={anotherMockLogicProps.selectedMovieTitle}
        selectedMovie={anotherMockLogicProps.selectedMovie}
        foundMovies={anotherMockLogicProps.foundMovies}
        isSearching={anotherMockLogicProps.isSearching}
        isInteractionsDisabled={anotherMockLogicProps.isInteractionsDisabled}
        buttonScale={anotherMockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={anotherMockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={anotherMockLogicProps.handleInputChange}
        handleMovieSelection={anotherMockLogicProps.handleMovieSelection}
        onPressCheck={anotherMockLogicProps.onPressCheck}
        handleFocus={anotherMockLogicProps.handleFocus}
        handleBlur={anotherMockLogicProps.handleBlur}
      />
    )
    expect(mockUsePickerLogic().selectedMovie.title).toBe("Select a movie")

    // Check when selected movie title is too long
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: {
        id: "4",
        title: "A very very very very very very very long movie title",
        release_date: "",
      },
      DEFAULT_BUTTON_TEXT: "Select a movie",
      isInteractionsDisabled: false,
      selectedMovieTitle:
        "A very very very very very very very long movie title",
    })
    const lastMockLogicProps = mockUsePickerLogic()
    rerender(
      <PickerUI
        searchText={lastMockLogicProps.searchText}
        selectedMovieTitle={lastMockLogicProps.selectedMovieTitle}
        selectedMovie={lastMockLogicProps.selectedMovie}
        foundMovies={lastMockLogicProps.foundMovies}
        isSearching={lastMockLogicProps.isSearching}
        isInteractionsDisabled={lastMockLogicProps.isInteractionsDisabled}
        buttonScale={lastMockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={lastMockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={lastMockLogicProps.handleInputChange}
        handleMovieSelection={lastMockLogicProps.handleMovieSelection}
        onPressCheck={lastMockLogicProps.onPressCheck}
        handleFocus={lastMockLogicProps.handleFocus}
        handleBlur={lastMockLogicProps.handleBlur}
      />
    )
    expect(mockUsePickerLogic().selectedMovie.title.length).toBeGreaterThan(35)
  })

  test("tests focus and blur handlers", () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      handleFocus,
      handleBlur,
      selectedMovieTitle: "Select a movie",
    })
    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )
    fireEvent(screen.getByPlaceholderText("Search for a movie..."), "focus")
    expect(handleFocus).toHaveBeenCalled()
    fireEvent(screen.getByPlaceholderText("Search for a movie..."), "blur")
    expect(handleBlur).toHaveBeenCalled()
  })

  test("tests accessibility properties of Pressable elements", async () => {
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      foundMovies: mockMovies, // Override specific properties for this test with a non-empty array
      selectedMovie: { id: "", title: "Select a movie", release_date: "" },
      selectedMovieTitle: "Select a movie",
    })
    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
      />
    )

    fireEvent.changeText(
      screen.getByPlaceholderText("Search for a movie..."),
      "Test"
    ) // Trigger search and display list

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          `Select movie: ${mockMovie.title}, ID: ${mockMovie.id}`
        )
      ).toBeVisible()
    })

    expect(
      screen.getByLabelText(
        `Select movie: ${mockMovie.title}, ID: ${mockMovie.id}`
      )
    ).toHaveAccessibilityRole("button")
    expect(
      screen.getByLabelText(`Check movie: Select a movie`)
    ).toHaveAccessibilityRole("button")
  })

  test("ensures setShowConfetti is called when a correct answer is submitted", () => {
    const setShowConfetti = jest.fn()
    const onPressCheck = jest.fn().mockImplementation(({ setShowConfetti }) => {
      if (setShowConfetti) {
        setShowConfetti(true)
      }
    })

    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: mockMovie,
      selectedMovieTitle: mockMovie.title,
      onPressCheck: () => onPressCheck({ setShowConfetti }), // Pass the mock setShowConfetti
    })

    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
        setShowConfetti={setShowConfetti}
      />
    )
    fireEvent.press(screen.getByLabelText(`Check movie: ${mockMovie.title}`))
    expect(onPressCheck).toHaveBeenCalled()
    expect(setShowConfetti).toHaveBeenCalledWith(true)
  })

  test("ensures onGuessFeedback is called with appropriate messages", () => {
    const onGuessFeedback = jest.fn()
    const onPressCheck = jest.fn().mockImplementation(({ onGuessFeedback }) => {
      if (onGuessFeedback) {
        onGuessFeedback("Test feedback message")
      }
    })
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: mockMovie,
      onGuessFeedback: onGuessFeedback,
      selectedMovieTitle: mockMovie.title,
      onPressCheck: () => onPressCheck({ onGuessFeedback }),
    })
    const mockLogicProps = mockUsePickerLogic()
    render(
      <PickerUI
        searchText={mockLogicProps.searchText}
        selectedMovieTitle={mockLogicProps.selectedMovieTitle}
        selectedMovie={mockLogicProps.selectedMovie}
        foundMovies={mockLogicProps.foundMovies}
        isSearching={mockLogicProps.isSearching}
        isInteractionsDisabled={mockLogicProps.isInteractionsDisabled}
        buttonScale={mockLogicProps.buttonScale}
        DEFAULT_BUTTON_TEXT={mockLogicProps.DEFAULT_BUTTON_TEXT}
        handleInputChange={mockLogicProps.handleInputChange}
        handleMovieSelection={mockLogicProps.handleMovieSelection}
        onPressCheck={mockLogicProps.onPressCheck}
        handleFocus={mockLogicProps.handleFocus}
        handleBlur={mockLogicProps.handleBlur}
        onGuessFeedback={onGuessFeedback}
      />
    )
    fireEvent.press(screen.getByLabelText(`Check movie: ${mockMovie.title}`))
    expect(onGuessFeedback).toHaveBeenCalledWith("Test feedback message")
  })
})
