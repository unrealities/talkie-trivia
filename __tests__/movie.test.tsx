import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useGameLogic } from '../utils/hooks/useGameLogic';
import { useNetworkStatus } from '../utils/hooks/useNetworkStatus';
import { Movie } from './movie';
import { AppContext } from '../contexts/appContext';

// Mock the necessary hooks and context
jest.mock('src/utils/hooks/useGameLogic');
jest.mock('../utils/hooks/useNetworkStatus');
jest.mock('../contexts/appContext', () => ({
  AppContext: {
    Consumer: ({ children }: { children: (value: any) => React.ReactNode }) =>
      children({ player: { name: 'TestPlayer', id: '1' }, setPlayer: jest.fn() }),
  },
}));

const mockUseGameLogic = useGameLogic as jest.Mock;
const mockUseNetworkStatus = useNetworkStatus as jest.Mock;

describe('Movie', () => {
  const mockGame = {
    id: 'game1',
    movie: { title: 'Test Movie', release_date: '2022-01-01', poster_path: '/test.jpg', overview: 'A test movie' },
    guesses: [],
    isGameOver: false,
    isGameWon: false,
    clues: [],
    hintCount: 0,
    maxHints: 3,
    factCount: 0,
    maxFacts: 3,
    genres: [],
    player: { name: 'TestPlayer', id: '1' },
  };

  beforeEach(() => {
    mockUseGameLogic.mockReturnValue({
      game: mockGame,
      isLoading: false,
      error: null,
      handleGuess: jest.fn(),
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
    });
    mockUseNetworkStatus.mockReturnValue({ isConnected: true });
  });

  it('renders correctly with game data', () => {
    render(<Movie />);

    expect(screen.getByText('Test Movie')).toBeTruthy();
    expect(screen.getByText('Released: 2022')).toBeTruthy();
    expect(screen.getByText('A test movie')).toBeTruthy();
  });

  it('displays loading indicator when loading', () => {
    mockUseGameLogic.mockReturnValue({
      ...mockUseGameLogic(),
      isLoading: true,
    });

    render(<Movie />);

    expect(screen.getByTestId('custom-loading-indicator')).toBeTruthy();
  });

  it('displays error message when there is an error', () => {
    mockUseGameLogic.mockReturnValue({
      ...mockUseGameLogic(),
      error: 'Failed to load game',
    });

    render(<Movie />);

    expect(screen.getByText('Error: Failed to load game')).toBeTruthy();
  });

  it('displays "No Network Connection" when offline', () => {
    mockUseNetworkStatus.mockReturnValue({ isConnected: false });

    render(<Movie />);

    expect(screen.getByText('No Network Connection')).toBeTruthy();
  });

  it('calls handleGiveUp when Give Up button is pressed', () => {
    const handleGiveUpMock = jest.fn();
    mockUseGameLogic.mockReturnValue({
      ...mockUseGameLogic(),
      handleGiveUp: handleGiveUpMock,
    });

    render(<Movie />);

    fireEvent.press(screen.getByText('Give Up'));

    expect(handleGiveUpMock).toHaveBeenCalled();
  });

  it('calls handleNewGame when Play Again button is pressed after game over', () => {
    const handleNewGameMock = jest.fn();
    mockUseGameLogic.mockReturnValue({
      ...mockUseGameLogic(),
      game: { ...mockGame, isGameOver: true },
      handleNewGame: handleNewGameMock,
    });

    render(<Movie />);

    fireEvent.press(screen.getByText('Play Again'));

    expect(handleNewGameMock).toHaveBeenCalled();
  });

  it('renders GameUI component', () => {
    render(<Movie />);

    expect(screen.getByTestId('game-ui')).toBeTruthy();
  });

  it('renders HintUI component', () => {
    render(<Movie />);

    expect(screen.getByTestId('hint-ui')).toBeTruthy();
  });

  it('renders PlayerStats component', () => {
    render(<Movie />);

    expect(screen.getByTestId('player-stats')).toBeTruthy();
  });
});