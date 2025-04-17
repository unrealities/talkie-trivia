import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MoviesContainer from '../src/components/movie';
import { BasicMovie } from '../src/models/movie';
import { PlayerGame } from '../src/models/game';
import Player from '../src/models/player';
import PlayerStats from '../src/models/playerStats';

// Mock GameUI and useGameLogic to test interactions
jest.mock('../src/components/gameUI', () => {
  return jest.fn(props => {
    // Expose the props passed to GameUI so we can test them
    global.GameUIProps = props;
    return (
      <div data-testid="mock-game-ui">
        <button
          data-testid="guess-button"
          onPress={() => props.handleGuess && props.handleGuess('test guess')}
        />
        <button
          data-testid="give-up-button"
          onPress={() => props.handleGiveUp && props.handleGiveUp()}
        />
      </div>
    );
  });
});

// Mock data
const mockMovies: readonly BasicMovie[] = [
  { id: '1', title: 'Movie 1' },
  { id: '2', title: 'Movie 2' },
];
const mockPlayer: Player = { uid: 'player1', displayName: 'Test Player' };
const mockPlayerGame: PlayerGame = { movieId: '1', guesses: [], hints: 0, gaveUp: false };
const mockPlayerStats: PlayerStats = { gamesPlayed: 0, gamesWon: 0, winRate: 0 };
const mockUpdatePlayerGame = jest.fn();
const mockUpdatePlayerStats = jest.fn();

describe('MoviesContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with mock data', () => {
    const { getByTestId, queryByText } = render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
        initialDataLoaded={true}
      />
    );

    // Check that the GameUI component is rendered
    expect(getByTestId('mock-game-ui')).toBeTruthy();

    // Check that initial data is loaded properly
    expect(global.GameUIProps.movie).toEqual(mockMovies[0]);
    expect(global.GameUIProps.player).toEqual(mockPlayer);
    expect(global.GameUIProps.playerGame).toEqual(mockPlayerGame);
  });

  it('passes correct props to GameUI', () => {
    render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
        initialDataLoaded={true}
      />
    );

    // Check all expected props are passed to GameUI
    expect(global.GameUIProps).toHaveProperty('movie');
    expect(global.GameUIProps).toHaveProperty('player');
    expect(global.GameUIProps).toHaveProperty('playerGame');
    expect(global.GameUIProps).toHaveProperty('handleGuess');
    expect(global.GameUIProps).toHaveProperty('handleGiveUp');
    expect(global.GameUIProps).toHaveProperty('isNetworkConnected');

    // Verify values
    expect(global.GameUIProps.isNetworkConnected).toBe(true);
    expect(global.GameUIProps.movie).toEqual(mockMovies[0]);
  });

  it('calls updatePlayerGame when handleGuess is triggered', async () => {
    const { getByTestId } = render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
        initialDataLoaded={true}
      />
    );

    // Trigger the guess action
    fireEvent.press(getByTestId('guess-button'));

    // Check that updatePlayerGame was called
    await waitFor(() => {
      expect(mockUpdatePlayerGame).toHaveBeenCalled();
    });
  });

  it('handles the give up action correctly', async () => {
    const { getByTestId } = render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
        initialDataLoaded={true}
      />
    );

    // Trigger the give up action
    fireEvent.press(getByTestId('give-up-button'));

    // Check that the right functions were called
    await waitFor(() => {
      expect(mockUpdatePlayerGame).toHaveBeenCalledWith(
        expect.objectContaining({
          gaveUp: true
        })
      );
    });
  });

  it('shows loading state when initialDataLoaded is false', () => {
    const { queryByTestId } = render(
      <MoviesContainer
        isNetworkConnected={true}
        movies={mockMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
        initialDataLoaded={false}
      />
    );

    // The GameUI should not be rendered when data is loading
    expect(queryByTestId('mock-game-ui')).toBeNull();
    // You might want to check for a loading indicator instead
  });

  it('handles network disconnection', () => {
    render(
      <MoviesContainer
        isNetworkConnected={false}
        movies={mockMovies}
        player={mockPlayer}
        playerGame={mockPlayerGame}
        playerStats={mockPlayerStats}
        updatePlayerGame={mockUpdatePlayerGame}
        updatePlayerStats={mockUpdatePlayerStats}
        initialDataLoaded={true}
      />
    );

    // Check that isNetworkConnected is correctly passed to GameUI
    expect(global.GameUIProps.isNetworkConnected).toBe(false);
  });
});