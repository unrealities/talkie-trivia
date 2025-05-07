import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import useNetworkStatus from '../src/utils/hooks/useNetworkStatus';
import Movie from '../src/components/movie'

// Mock the necessary hooks and context
jest.mock('../utils/hooks/useGameLogic', () => ({
  useGameLogic: () => ({
    game: {
      id: 'game1',
      movie: { title: 'Test Movie', release_date: '2022-01-01', poster_path: '/test.jpg', overview: 'A test movie' },
      guesses: [],
      isGameOver: false,
      isGameWon: false,
    },
    isLoading: false,
    error: null,
  }),
}));
jest.mock('../utils/hooks/useNetworkStatus');
jest.mock('../contexts/appContext', () => ({
  AppContext: {
    Consumer: ({ children }: { children: (value: any) => React.ReactNode }) =>
      children({ player: { name: 'TestPlayer', id: '1' }, setPlayer: jest.fn() }),
  },
}));

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
    mockUseNetworkStatus.mockReturnValue({ isConnected: true });
  });

  it('renders correctly with game data', () => {
    render(<Movie />);

    expect(screen.getByText('Test Movie')).toBeTruthy();
    expect(screen.getByText('Released: 2022')).toBeTruthy();
    expect(screen.getByText('A test movie')).toBeTruthy();
  });

  it('displays loading indicator when loading', () => {
    jest.mock('../utils/hooks/useGameLogic', () => ({
      useGameLogic: () => ({
        game: null,
        isLoading: true,
        error: null,
      }),
    }));

    render(<Movie />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays error message when there is an error', () => {
    jest.mock('../utils/hooks/useGameLogic', () => ({
      useGameLogic: () => ({
        game: null,
        isLoading: false,
        error: 'Failed to load game',
      }),
    }));

    render(<Movie />);

    expect(screen.getByText('Error: Failed to load game')).toBeTruthy();
  });

  it('displays "No Network Connection" when offline', async () => {
    mockUseNetworkStatus.mockReturnValue({ isConnected: false });
    render(<Movie />);
    await waitFor(() => {
      expect(screen.getByText('No Network Connection')).toBeTruthy();
    });
  });

  it('calls handleGiveUp when Give Up button is pressed', () => {
    const handleGiveUpMock = jest.fn();
    jest.mock('../utils/hooks/useGameLogic', () => ({
      handleGiveUp: handleGiveUpMock,
    }));
    jest.mock('../utils/hooks/useGameLogic', () => ({
      useGameLogic: () => ({
        game: mockGame,
        isLoading: false,
        error: null,
        handleGiveUp: handleGiveUpMock,
      }),
    }));
    render(<Movie />);

    fireEvent.press(screen.getByText('Give Up'));

    expect(handleGiveUpMock).toHaveBeenCalled();
  });

  it('calls handleNewGame when Play Again button is pressed after game over', () => {
    const handleNewGameMock = jest.fn();
    jest.mock('../utils/hooks/useGameLogic', () => ({
      useGameLogic: () => ({
        game: { ...mockGame, isGameOver: true },
        isLoading: false,
        error: null,
        handleNewGame: handleNewGameMock,
      }),
    }));

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