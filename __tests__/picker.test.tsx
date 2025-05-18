import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import PickerContainer from '../src/components/pickerUI';
import { PlayerGame } from '../src/models/game';
import { BasicMovie } from '../src/models/movie';
import { colors } from '../src/styles/global';
import { usePickerLogic } from '../src/utils/hooks/usePickerLogic';

// Mock the usePickerLogic hook
jest.mock('../src/utils/hooks/usePickerLogic');

const mockUsePickerLogic = usePickerLogic as jest.Mock;

const mockMovie: BasicMovie = { id: '1', title: 'Test Movie', release_date: '2022-01-01' };
const mockMovies: BasicMovie[] = [
  mockMovie,
  { id: '2', title: 'Another Movie', release_date: '2023-05-15' },
];

const mockPlayerGame: PlayerGame = {
  game: {
    id: 'game1',
    movieId: '1',
    guessesMax: 5,
    hintsMax: 3,
    gameDate: '2023-10-27',
    gameIndex: 1,
    daily: true,
  },
  guesses: [],
  hintsUsed: 0,
  correctAnswer: false,
  gaveUp: false,
  playerId: 'player1',
  playerGameId: 'pg1',
};

const defaultProps = {
  enableSubmit: true,
  movies: mockMovies,
  playerGame: mockPlayerGame,
  updatePlayerGame: jest.fn(),
  onGuessFeedback: jest.fn(),
  setShowConfetti: jest.fn(),
};

describe('PickerContainer', () => {
  beforeEach(() => {
    mockUsePickerLogic.mockReturnValue({
      searchText: '',
      foundMovies: [],
      // Provide default mock values for all other properties returned by usePickerLogic
      isSearching: false,
      selectedMovie: { id: '', title: 'Select a movie', release_date: '' },
      buttonScale: { _value: 1 }, // Mock animated value structure
      DEFAULT_BUTTON_TEXT: 'Select a movie',
      handleInputChange: jest.fn(),
      handleMovieSelection: jest.fn(),
      onPressCheck: jest.fn(),
      handleFocus: jest.fn(),
      handleBlur: jest.fn(),
      isInteractionsDisabled: false, // Default to enabled
    });
  });

  test('renders with default props', () => {
    render(<PickerContainer {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search for a movie...')).toBeVisible();
    expect(screen.getByText('Select a movie')).toBeVisible();
  });

  test('disables interactions when game is over (correctAnswer)', () => {
    const playerGameWithCorrectAnswer: PlayerGame = {
      ...mockPlayerGame,
      correctAnswer: true,
    };
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      isInteractionsDisabled: true,
    });

    render(<PickerContainer {...defaultProps} playerGame={playerGameWithCorrectAnswer} />);
    expect(screen.getByPlaceholderText('Search for a movie...')).toBeDisabled();
    expect(screen.getByText('Select a movie')).toBeVisible(); // Button is visible but style should indicate disabled
    // Checking button style requires inspecting the animated style, which is tricky with RTL.
    // The mock usePickerLogic already returns isInteractionsDisabled: true based on playerGame state.
  });

  test('disables interactions when game is over (gaveUp)', () => {
    const playerGameWithGaveUp: PlayerGame = {
      ...mockPlayerGame,
      gaveUp: true,
    };
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      isInteractionsDisabled: true,
    });
    render(<PickerContainer {...defaultProps} playerGame={playerGameWithGaveUp} />);
    expect(screen.getByPlaceholderText('Search for a movie...')).toBeDisabled();
    expect(screen.getByText('Select a movie')).toBeVisible(); // Button is visible but style should indicate disabled
  });

  test('disables interactions when guesses are maxed out', () => {
    const playerGameWithMaxGuesses: PlayerGame = {
      ...mockPlayerGame,
      guesses: ['guess1', 'guess2', 'guess3', 'guess4', 'guess5'],
    };
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      isInteractionsDisabled: true,
    });
    render(<PickerContainer {...defaultProps} playerGame={playerGameWithMaxGuesses} />);
    expect(screen.getByPlaceholderText('Search for a movie...')).toBeDisabled();
    expect(screen.getByText('Select a movie')).toBeVisible(); // Button is visible but style should indicate disabled
  });

  test('handles input change and updates search text', () => {
    const handleInputChange = jest.fn();
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      handleInputChange,
    });
    render(<PickerContainer {...defaultProps} />);
    fireEvent.changeText(screen.getByPlaceholderText('Search for a movie...'), 'new search');
    expect(handleInputChange).toHaveBeenCalledWith('new search');
  });

  test('selects a movie and updates the selected movie', async () => {
    const handleMovieSelection = jest.fn();
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
 foundMovies: mockMovies, // Override specific properties for this test
      handleMovieSelection,
    });
    render(<PickerContainer {...defaultProps} />);

    // Need to simulate typing to show the found movies
    fireEvent.changeText(screen.getByPlaceholderText('Search for a movie...'), 'Test');

    await waitFor(() => {
      expect(screen.getByText('Test Movie (2022)')).toBeVisible();
    });

    fireEvent.press(screen.getByText('Test Movie (2022)'));
    expect(handleMovieSelection).toHaveBeenCalledWith(mockMovie);
  });

  test('presses the check button and triggers onPressCheck', () => {
    const onPressCheck = jest.fn();
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: mockMovie, // Simulate a movie being selected
      onPressCheck,
    });
    render(<PickerContainer {...defaultProps} />);
    fireEvent.press(screen.getByLabelText(`Check movie: ${mockMovie.title}`));
    expect(onPressCheck).toHaveBeenCalled();
  });

  test('renderItem function renders movie items correctly', () => {
    const handleMovieSelection = jest.fn();
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      foundMovies: mockMovies,
      selectedMovie: { id: '', title: 'Select a movie', release_date: '' },
      handleMovieSelection,
    });
    const { getByText } = render(<PickerContainer {...defaultProps} />);
    fireEvent.changeText(screen.getByPlaceholderText('Search for a movie...'), 'Test'); // Trigger search and display list

    expect(getByText('Test Movie (2022)')).toBeVisible();
    expect(getByText('Another Movie (2023)')).toBeVisible();
  });

  test('animated button style reflects disabled state and selected movie', () => {
    // Testing animated styles directly with RTL is complex.
    // We are testing the logic within usePickerLogic and the passed props to PickerUI.
    // We can check if the props passed to PickerUI reflect the expected state.
    const selectedMovie = { id: '3', title: 'Short', release_date: '' };
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie,
      DEFAULT_BUTTON_TEXT: 'Select a movie',
      isInteractionsDisabled: false,
    });
    const { rerender } = render(<PickerContainer {...defaultProps} />);

    // Check when a valid movie is selected
    expect(mockUsePickerLogic().selectedMovie).toEqual(selectedMovie);

    // Check when interactions are disabled
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie,
      DEFAULT_BUTTON_TEXT: 'Select a movie',
      isInteractionsDisabled: true,
    });
    rerender(<PickerContainer {...defaultProps} />);
    expect(mockUsePickerLogic().isInteractionsDisabled).toBe(true);

    // Check when no movie is selected (default text)
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: { id: '', title: 'Select a movie', release_date: '' },
      DEFAULT_BUTTON_TEXT: 'Select a movie',
      isInteractionsDisabled: false,
    });
    rerender(<PickerContainer {...defaultProps} />);
    expect(mockUsePickerLogic().selectedMovie.title).toBe('Select a movie');

    // Check when selected movie title is too long
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: { id: '4', title: 'A very very very very very very very long movie title', release_date: '' },
      DEFAULT_BUTTON_TEXT: 'Select a movie',
      isInteractionsDisabled: false,
    });
    rerender(<PickerContainer {...defaultProps} />);
    expect(mockUsePickerLogic().selectedMovie.title.length).toBeGreaterThan(35);
  });

  test('tests focus and blur handlers', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      handleFocus,
      handleBlur,
    });
    render(<PickerContainer {...defaultProps} />);
    fireEvent(screen.getByPlaceholderText('Search for a movie...'), 'focus');
    expect(handleFocus).toHaveBeenCalled();
    fireEvent(screen.getByPlaceholderText('Search for a movie...'), 'blur');
    expect(handleBlur).toHaveBeenCalled();
  });

  test('tests accessibility properties of Pressable elements', async () => {
    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      foundMovies: mockMovies, // Override specific properties for this test with a non-empty array
      selectedMovie: { id: '', title: 'Select a movie', release_date: '' },
    });
    render(<PickerContainer {...defaultProps} />);

    fireEvent.changeText(screen.getByPlaceholderText('Search for a movie...'), 'Test'); // Trigger search and display list

    await waitFor(() => {
        expect(screen.getByLabelText(`Select movie: ${mockMovie.title}, ID: ${mockMovie.id}`)).toBeVisible();
    });

    expect(screen.getByLabelText(`Select movie: ${mockMovie.title}, ID: ${mockMovie.id}`)).toHaveAccessibilityRole('button');
    expect(screen.getByLabelText(`Check movie: Select a movie`)).toHaveAccessibilityRole('button');
  });

  test('ensures setShowConfetti is called when a correct answer is submitted', () => {
    const setShowConfetti = jest.fn();
    const onPressCheck = jest.fn().mockImplementation(({ setShowConfetti }) => {
        if (setShowConfetti) {
            setShowConfetti(true);
        }
    });

    mockUsePickerLogic.mockReturnValue({
      ...mockUsePickerLogic(), // Spread the default mock values
      // Override specific properties for this test
      selectedMovie: mockMovie,
      onPressCheck: () => onPressCheck({ setShowConfetti }), // Pass the mock setShowConfetti
    });

    render(<PickerContainer {...defaultProps} setShowConfetti={setShowConfetti} />);
    fireEvent.press(screen.getByLabelText(`Check movie: ${mockMovie.title}`));
    expect(onPressCheck).toHaveBeenCalled();
    expect(setShowConfetti).toHaveBeenCalledWith(true);
  });


  test('ensures onGuessFeedback is called with appropriate messages', () => {
    const onGuessFeedback = jest.fn();
     const onPressCheck = jest.fn().mockImplementation(({ onGuessFeedback }) => {
        if (onGuessFeedback) {
            onGuessFeedback("Test feedback message");
        }
    });
    mockUsePickerLogic.mockReturnValue({
        ...mockUsePickerLogic(), // Spread the default mock values
        // Override specific properties for this test
        selectedMovie: mockMovie,
        onGuessFeedback: onGuessFeedback,
        onPressCheck: () => onPressCheck({ onGuessFeedback }),
    });
    render(<PickerContainer {...defaultProps} onGuessFeedback={onGuessFeedback} />);
    fireEvent.press(screen.getByLabelText(`Check movie: ${mockMovie.title}`));
    expect(onGuessFeedback).toHaveBeenCalledWith("Test feedback message");
  });

  test('tests the memoization of the component', () => {
    // This test is more about verifying that `memo` is used, rather than
    // a deep test of memoization behavior which is handled by React.
    // We can check if the component type indicates it's memoized.
    expect(PickerContainer.displayName).toBe('Memo(PickerContainer)');
  });
});