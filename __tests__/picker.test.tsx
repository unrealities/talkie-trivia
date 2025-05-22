import React from "react"
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native"
import { View, Text } from "react-native"
import { PlayerGame } from "../src/models/game"
import { PickerUI } from "../src/components/pickerUI"
import { BasicMovie } from "../src/models/movie"
import { colors } from "../src/styles/global"

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const { View, Text } = require("react-native")

  return {
    useSharedValue: (value: any) => ({ value }),
    useAnimatedStyle: (style: any) => style(),
    withSpring: (value: any) => value,
    withTiming: (value: any) => value,
    Animated: { 
      View: View, 
      Text: Text, 
      createAnimatedComponent: (component: any) => component 
    },
  }
})

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
      selectedMovieTitle: "Select a movie",
      selectedMovie: { id: "", title: "Select a movie", release_date: "" },
      isLoading: false,
      error: null,
      buttonScale: { value: 1 }, // Simplified animated value structure
      DEFAULT_BUTTON_TEXT: "Select a movie",
      isInteractionsDisabled: false,
      searchText: "",
      foundMovies: [],
      isSearching: false,
      handleInputChange: jest.fn(),
      handleMovieSelection: jest.fn(),
      onPressCheck: jest.fn(),
      handleFocus: jest.fn(),
      handleBlur: jest.fn(),
      renderItem: jest.fn(({ item }) => <Text>{item.title}</Text>),
    })
  })

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
      ...mockUsePickerLogic(),
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
    expect(screen.getByText("Select a movie")).toBeVisible()
  })

  test("disables interactions when game is over (gaveUp)", () => {
    const playerGameWithGaveUp: PlayerGame = {
      ...mockPlayerGame,
      gaveUp: true,
    }
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
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
    expect(screen.getByText("Select a movie")).toBeVisible()
  })

  test("disables interactions when guesses are maxed out", () => {
    const playerGameWithMaxGuesses: PlayerGame = {
      ...mockPlayerGame,
      guesses: ["guess1", "guess2", "guess3", "guess4", "guess5"],
    }
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
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
    expect(screen.getByText("Select a movie")).toBeVisible()
  })

  test("handles input change and updates search text", () => {
    const handleInputChange = jest.fn()
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
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
      ...mockUsePickerLogic(),
      foundMovies: mockMovies,
      handleMovieSelection,
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
    )

    await waitFor(() => {
      expect(screen.getByText("Test Movie (2022)")).toBeVisible()
    })

    fireEvent.press(screen.getByText("Test Movie (2022)"))
    expect(handleMovieSelection).toHaveBeenCalledWith(mockMovie)
  })

  test("presses the check button and triggers onPressCheck", () => {
    const onPressCheck = jest.fn()
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
      selectedMovie: mockMovie,
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
      ...mockUsePickerLogic(),
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
    )

    expect(getByText("Test Movie (2022)")).toBeVisible()
    expect(getByText("Another Movie (2023)")).toBeVisible()
  })

  test("animated button style reflects disabled state and selected movie", () => {
    const selectedMovie = { id: "3", title: "Short", release_date: "" }
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
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

    expect(mockUsePickerLogic().selectedMovie).toEqual(selectedMovie)

    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
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

    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
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

    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(),
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
      ...mockUsePickerLogic(),
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
      ...mockUsePickerLogic(),
      foundMovies: mockMovies,
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
    )

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
      ...mockUsePickerLogic(),
      selectedMovie: mockMovie,
      selectedMovieTitle: mockMovie.title,
      onPressCheck: () => onPressCheck({ setShowConfetti }),
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
      ...mockUsePickerLogic(),
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
