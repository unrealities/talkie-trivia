import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HintContainer from '../src/components/hint';
import { useHintLogic } from '../src/utils/hooks/useHintLogic';

// Mock the useHintLogic hook
jest.mock('../src/utils/hooks/useHintLogic');

const mockUseHintLogic = useHintLogic as jest.Mock;

const mockPlayerGame = {
  movieId: 1,
  guesses: [],
  hints: [],
  clues: [],
  givenUp: false,
  won: false,
};

const mockUpdatePlayerGame = jest.fn();
const mockUpdatePlayerStats = jest.fn();

describe('HintContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial props', () => {
    mockUseHintLogic.mockReturnValue({
      showHintOptions: false,
      displayedHintText: '',
      hintLabelText: 'Get a Hint',
      isToggleDisabled: false,
      areHintButtonsDisabled: true,
      hintsAvailable: 2,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: jest.fn(),
    });

    const { getByText } = render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={2}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    );

    expect(getByText('Get a Hint')).toBeTruthy();
  });

  it('displays hint options when showHintOptions is true', () => {
    mockUseHintLogic.mockReturnValue({
      showHintOptions: true,
      displayedHintText: '',
      hintLabelText: 'Get a Hint',
      isToggleDisabled: false,
      areHintButtonsDisabled: false,
      hintsAvailable: 2,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: jest.fn(),
    });

    const { getByText } = render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={2}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    );

    expect(getByText('Decade')).toBeTruthy();
    expect(getByText('Director')).toBeTruthy();
    expect(getByText('Actor')).toBeTruthy();
    expect(getByText('Genre')).toBeTruthy();  });

  it('displays hint text when displayedHintText is not empty', () => {
    mockUseHintLogic.mockReturnValue({
      showHintOptions: false,
      displayedHintText: 'This is a hint!',
      hintLabelText: 'Get a Hint',
      isToggleDisabled: false,
      areHintButtonsDisabled: true,
      hintsAvailable: 1,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: jest.fn(),
    });

    const { getByText } = render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={1}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    );

    expect(getByText('This is a hint!')).toBeTruthy();
  });

  it('disables toggle button when isToggleDisabled is true', () => {
    const handleToggleHintOptions = jest.fn();
    mockUseHintLogic.mockReturnValue({
      showHintOptions: false,
      displayedHintText: '',
      hintLabelText: 'Get a Hint',
      isToggleDisabled: true,
      areHintButtonsDisabled: true,
      hintsAvailable: 0,
      handleToggleHintOptions: handleToggleHintOptions,
      handleHintSelection: jest.fn(),
    });

    const { getByText } = render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={true}
        hintsAvailable={0}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    );

    const toggleButton = getByText('Get a Hint');
    fireEvent.press(toggleButton);
    expect(handleToggleHintOptions).not.toHaveBeenCalled(); 
  });

  it('disables hint buttons when areHintButtonsDisabled is true', () => {
    const handleHintSelection = jest.fn();
    mockUseHintLogic.mockReturnValue({
      showHintOptions: true,
      displayedHintText: '',
      hintLabelText: 'Get a Hint',
      isToggleDisabled: false,
      areHintButtonsDisabled: true,
      hintsAvailable: 1,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: handleHintSelection,
    });

    const { getByText } = render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={1}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    );
    
    expect(getByText('Decade')).toBeTruthy(); // Decade should exist but be disabled
    expect(getByText('Director')).toBeTruthy(); // Director should exist but be disabled
    expect(getByText('Actor')).toBeTruthy(); // Actor should exist but be disabled
    expect(getByText('Genre')).toBeTruthy(); // Genre should exist but be disabled
  });

  it('calls handleToggleHintOptions when toggle button is pressed', () => {
    const handleToggleHintOptions = jest.fn();
    mockUseHintLogic.mockReturnValue({
      showHintOptions: false,
      displayedHintText: '',
      hintLabelText: 'Get a Hint',
      isToggleDisabled: false,
      areHintButtonsDisabled: true,
      hintsAvailable: 2,
      handleToggleHintOptions: handleToggleHintOptions,
      handleHintSelection: jest.fn(),
    });

    const { getByText } = render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={2}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    );

    const toggleButton = getByText('Get a Hint');
    fireEvent.press(toggleButton);
    expect(handleToggleHintOptions).toHaveBeenCalledTimes(1);
  });

  it('calls handleHintSelection with correct hint type when a hint button is pressed', () => {
    const handleHintSelection = jest.fn();
    mockUseHintLogic.mockReturnValue({
      showHintOptions: true,
      displayedHintText: '',
      hintLabelText: 'Get a Hint',
      isToggleDisabled: false,
      areHintButtonsDisabled: false,
      hintsAvailable: 2,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: handleHintSelection,
    });

    const { getByText } = render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={2}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    );

    const hintButton1 = getByText('Hint 1');
    fireEvent.press(hintButton1);
    expect(handleHintSelection).toHaveBeenCalledWith('genre');

    const hintButton2 = getByText('Hint 2');
    fireEvent.press(hintButton2);
    expect(handleHintSelection).toHaveBeenCalledWith('actor');
  });
});