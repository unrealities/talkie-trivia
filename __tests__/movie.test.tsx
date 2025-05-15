import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native';

// Mock expo-network before useNetworkStatus is imported
jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() => Promise.resolve({ isInternetReachable: true })),
}));
import useNetworkStatus from '../src/utils/hooks/useNetworkStatus';
import { useGameLogic } from '../src/utils/hooks/useGameLogic';
import Movie from '../src/components/movie'

jest.mock('../src/utils/hooks/useGameLogic.tsx', () => ({
  useGameLogic: jest.fn(() => ({
    // Mocked values and functions returned by the hook
    game: null, // Default to no game data loaded
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
    // Return a component function that accepts props and conditionally renders buttons.
    // This mock is simplified to only render what's necessary for the movie.test.tsx
    // button click tests. Rendering for other parts of GameUI is handled in
    // gameUI.test.tsx.
    // The mock now correctly accesses playerGame from props.

    return (props: any) => { // Pass props here
      const isGameOver = props.playerGame?.correctAnswer || props.playerGame?.gaveUp;

      // Add other elements if needed for specific tests in GameUI.test.tsx that were moved
      // For movie.test.tsx, we primarily need the buttons for the click tests.
      // We might need to add testIDs for loading/error/network messages if GameUI renders them,
      // but based on the plan, MoviesContainer now handles those. So, the GameUI mock
      // in movie.test.tsx should only focus on the buttons and the data-testid.

      return <div data-testid="game-ui">{isGameOver ? <button>Play Again</button> : <button>Give Up</button>}</div>;
    };
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
  // Define a more complete mock game object that includes playerGame structure
  const mockGame = {
    id: 'game1',
    movie: { title: 'Test Movie', release_date: '2022-01-01', poster_path: '/test.jpg', overview: 'A test movie' },
    playerGame: { guesses: [], correctAnswer: false, gaveUp: false, game: { movie: { overview: '' } } }, // Add playerGame structure
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
    jest.clearAllMocks();
    mockUseNetworkStatus.mockReturnValue({ isNetworkConnected: true });
  });

  it('renders GameUI component when not loading, no error, network connected, and game data is available', () => {
    // Ensure useGameLogic mock returns a state where GameUI should be rendered
    useGameLogic.mockReturnValue({
      playerGame: mockGame.playerGame, // Provide valid playerGame data
      isLoading: false,
      error: null,
      player: { name: 'TestPlayer', id: '1' },
      game: mockGame, // Provide valid game data
      playerStats: {},
      updatePlayerGame: jest.fn(),
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
      handleGuess: jest.fn(),
 isNetworkConnected: true,
    });
    // Ensure useNetworkStatus mock returns connected
    mockUseNetworkStatus.mockReturnValue({ isNetworkConnected: true });

    render(<Movie />);
    expect(screen.getByTestId('game-ui')).toBeTruthy();
  });

  it('calls handleGiveUp when Give Up button is pressed', () => {
    useGameLogic.mockReturnValue({
      // Ensure the structure returned by useGameLogic matches what MoviesContainer expects
        playerGame: { // Add playerGame with game not over state
        correctAnswer: false,
        gaveUp: false,
        game: mockGame, // Include game object if needed by GameUI
        guesses: [],
      },
      isLoading: false,
      error: null,
      game: mockGame, // Include game object if needed by GameUI
      player: { name: 'TestPlayer', id: '1' }, // Include player if needed
      playerStats: {}, // Include playerStats if needed
      updatePlayerGame: jest.fn(), // Include update functions if needed
      error: null,
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
      handleGuess: jest.fn(),
 isNetworkConnected: true,
    });

    render(<Movie />);
    fireEvent.press(screen.getByText('Give Up'));

    expect(useGameLogic().handleGiveUp).toHaveBeenCalled();
  });

  it('calls handleNewGame when Play Again button is pressed after game over', () => {
    useGameLogic.mockReturnValue({
      // Ensure the structure returned by useGameLogic matches what MoviesContainer expects
        playerGame: { // Add playerGame with game over state (won)
        correctAnswer: true, // Or gaveUp: true
        gaveUp: false,
        game: mockGame, // Include game object if needed by GameUI
        guesses: [],
      },
      isLoading: false,
      error: null,
      game: mockGame, // Include game object if needed by GameUI
      player: { name: 'TestPlayer', id: '1' }, // Include player if needed
      playerStats: {}, // Include playerStats if needed
      updatePlayerGame: jest.fn(), // Include update functions if needed
      error: null,
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
      handleGuess: jest.fn(),
 isNetworkConnected: true,
    });

    render(<Movie />);
    fireEvent.press(screen.getByText('Play Again'));
    expect(useGameLogic().handleNewGame).toHaveBeenCalled();
  });

  it('displays loading indicator when loading', () => {
    useGameLogic.mockReturnValue({
      game: null,
      playerGame: null, // Ensure playerGame is null when loading
      isLoading: true,
      error: null,
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
      handleGuess: jest.fn(),
 isNetworkConnected: true, // Assume network is connected during loading
    });
    render(<Movie />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('displays error message when there is an error', () => {
    useGameLogic.mockReturnValue({
      game: null,
      playerGame: null, // Ensure playerGame is null on error
      isLoading: false,
      error: 'Failed to load game',
      handleGiveUp: jest.fn(),
      handleNewGame: jest.fn(),
      handleGuess: jest.fn(),
 isNetworkConnected: true, // Assume network is connected when error occurs. TODO: This test should likely mock a network connected scenario to specifically test the error display.
    });
    render(<Movie />);
    expect(screen.getByText('Error: Failed to load game')).toBeTruthy();
  });

  it('displays "No Network Connection" when offline', async () => {
    mockUseNetworkStatus.mockReturnValue({ isNetworkConnected: false });
    render(<Movie />);
    expect(screen.getByText('No Network Connection')).toBeTruthy();
  });
});
