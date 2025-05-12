import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Mock expo-network before useNetworkStatus is imported
jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() => Promise.resolve({ isInternetReachable: true })),
}));
import useNetworkStatus from '../src/utils/hooks/useNetworkStatus';
import Movie from '../src/components/movie'

jest.mock('../src/utils/hooks/useGameLogic.tsx', () => ({
  useGameLogic: jest.fn(() => ({
    // Mocked values and functions returned by the hook
    game: {
      id: 'game1',
      movie: { title: 'Test Movie', release_date: '2022-01-01', poster_path: '/test.jpg', overview: 'A test movie' },
      guesses: [],
      isGameWon: false,
    },
    handleGiveUp: jest.fn(),
    handleNewGame: jest.fn(),
    handleGuess: jest.fn(),
    isLoading: false,
    error: null,
  })),
}));

jest.mock('../src/contexts/appContext', () => ({
 AppContext: {
    Consumer: ({ children }: { children: (value: any) => React.ReactNode }) =>
      children({ player: { name: 'TestPlayer', id: '1' }, setPlayer: jest.fn() }),
  },
}));

jest.mock('../src/components/gameUI', () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="game-ui">GameUI</div>;
  },
}));

jest.mock('../src/components/hintUI', () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="hint-ui">HintUI</div>;
  },
}));

jest.mock('../src/components/playerStats', () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="player-stats">PlayerStats</div>;
  },
}));

jest.mock('../src/utils/hooks/useNetworkStatus');

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
    useGameLogic.mockReturnValue({
      game: null,
      isLoading: true,
      error: null,
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
      handleGuess: jest.fn(),
    });

    render(<Movie />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays error message when there is an error', () => {
    useGameLogic.mockReturnValue({
      game: null,
      isLoading: false,
      error: 'Failed to load game',
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
      handleGuess: jest.fn(),
    });

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
    // Assuming the jest.mock at the top provides handleGiveUpMock
    render(<Movie />);
    fireEvent.press(screen.getByText('Give Up'));

    expect(useGameLogic().handleGiveUp).toHaveBeenCalled();
  });

  it('calls handleNewGame when Play Again button is pressed after game over', () => {
    useGameLogic.mockReturnValue({
      game: { ...mockGame, isGameOver: true }, // Mock game over state
      isLoading: false,
      error: null,
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
      handleGuess: jest.fn(),
    });

    render(<Movie />);

    fireEvent.press(screen.getByText('Play Again'));

    expect(useGameLogic().handleNewGame).toHaveBeenCalled();
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
