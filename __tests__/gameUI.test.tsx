import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import GameUI from '../src/components/gameUI';
import { BasicMovie } from '../src/models/movie';
import { PlayerGame, Game } from '../src/models/game';
import Player from '../src/models/player';
import PlayerStats from '../src/models/playerStats';

// Mocking dependencies
jest.mock('../src/components/clues', () => ({
  __esModule: true,
  default: () => <div testID="clues-container" />,
}));
jest.mock('../src/components/guesses', () => ({
  __esModule: true,
  default: () => <div testID="guesses-container" />,
}));
jest.mock('../src/components/network', () => ({
  __esModule: true,
  default: () => <div testID="network-container" />,
}));
jest.mock('../src/components/errorMessage', () => ({
  __esModule: true,
  default: () => <div testID="network-container" />,
}));
jest.mock('../src/components/modal', () => ({
  __esModule: true,
  default: () => <div testID="modal-container" />,
}));
jest.mock('../src/components/picker', () => ({
  __esModule: true,
  default: () => <div testID="picker-container" />,
}));
jest.mock('../src/components/titleHeader', () => ({
  __esModule: true,
  default: () => <div testID="title-header" />,
}));
jest.mock('../src/components/hint', () => ({
  __esModule: true,
  default: () => <div testID="hint-container" />,
}));
jest.mock('../src/components/confettiCelebration', () => ({
  __esModule: true,
  default: () => <div testID="confetti-celebration" />,
}));
jest.mock('../src/components/confirmationModal', () => ({
  __esModule: true,
  default: () => <div testID="confirmation-modal" />,
}));
jest.mock('react-native-reanimated', () => {
  return {
    View: ({ children, style }: any) => <div style={style}>{children}</div>,
    default: {
      View: ({ children, style }: any) => <div style={style}>{children}</div>,
    },
  };
});

const mockMovies: readonly BasicMovie[] = [
  { id: '1', title: 'Movie 1' },
  { id: '2', title: 'Movie 2' },
];

const mockGame: Game = {
  movie: { id: '1', title: 'Movie 1', overview: "overview" },
  genres: [],
  actors: [],
  directors: [],
}
const mockPlayerGame: PlayerGame = {
  game: mockGame,
  guesses: [],
  correctAnswer: false,
  gaveUp: false,
};

const mockPlayer: Player = {
  id: "user123",
  name: 'test@example.com',
};

const mockPlayerStats: PlayerStats = {
  id: "user123",
  currentStreak: 0,
  games: 0,
  maxStreak: 0,
  wins: [],
  hintsAvailable: 0,
  hintsUsedCount: 0
};

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
};

const renderWithProps = (props: any) => {
  return render(<GameUI {...props} />);
};

describe('GameUI', () => {
  it('renders guess feedback when present', () => {
    const feedback = "Try Again!";
    renderWithProps({ ...mockProps, guessFeedback: feedback });
    expect(screen.getByText(feedback)).toBeDefined();
  });

  it('disables interactions when isInteractionsDisabled is true', () => {
    renderWithProps({ ...mockProps, isInteractionsDisabled: true });
    expect(screen.getByRole('button', { name: 'Give Up?' }).props.disabled).toBe(true);
  });

  it('renders all components', () => {
    render(<GameUI {...mockProps} />);

    expect(screen.getByTestId('clues-container')).toBeDefined();
    expect(screen.getByTestId('guesses-container')).toBeDefined();
    expect(screen.getByTestId('network-container')).toBeDefined();
    expect(screen.getByTestId('picker-container')).toBeDefined();
    expect(screen.getByTestId('title-header')).toBeDefined();
    expect(screen.getByTestId('hint-container')).toBeDefined();

  });

  it('renders the modal when showModal is true', () => {
    render(<GameUI {...{ ...mockProps, showModal: true }} />);
    expect(screen.getByTestId('modal-container')).toBeDefined();
  });

  it('renders the confetti when showConfetti is true', () => {
    render(<GameUI {...{ ...mockProps, showConfetti: true }} />);
    expect(screen.getByTestId('confetti-celebration')).toBeDefined();
  });

  it('renders the ConfirmationModal when showGiveUpConfirmationDialog is true', () => {
    render(<GameUI {...{ ...mockProps, showGiveUpConfirmationDialog: true }} />);
    expect(screen.getByTestId('confirmation-modal')).toBeDefined();
  });

  it('calls handleGiveUp when Give Up button is pressed', () => {
    render(<GameUI {...mockProps} />);
    const giveUpButton = screen.getByText('Give Up?');
    fireEvent.press(giveUpButton);
    expect(mockProps.handleGiveUp).toHaveBeenCalled();
  });
});
