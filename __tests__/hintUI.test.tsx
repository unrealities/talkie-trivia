import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import HintUI from '../src/components/hintUI';

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

describe('HintUI', () => {
  const mockHandleToggleHintOptions = jest.fn();
  const mockHandleHintSelection = jest.fn();
  const defaultProps = {
    showHintOptions: false,
    displayedHintText: null,
    hintLabelText: 'Hint',
    isToggleDisabled: false,
    areHintButtonsDisabled: false,
    hintsAvailable: 4,
    handleToggleHintOptions: mockHandleToggleHintOptions,
    handleHintSelection: mockHandleHintSelection,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', async () => {
    await render(<HintUI {...defaultProps} />);
    expect(screen.getByText('Hint')).toBeTruthy();
  }, 10000);

  it('displays hint options when showHintOptions is true', async () => {
    await render(<HintUI {...defaultProps} showHintOptions={true} />);
    expect(screen.getByText('Decade')).toBeTruthy();
    expect(screen.getByText('Director')).toBeTruthy();
    expect(screen.getByText('Actor')).toBeTruthy();
    expect(screen.getByText('Genre')).toBeTruthy();
  }, 10000);

  it('displays displayedHintText when it is not null', async () => {
    await render(<HintUI {...defaultProps} displayedHintText="Test Hint" />);
    expect(screen.getByText('Test Hint')).toBeTruthy();
  });

  it('disables toggle button when isToggleDisabled is true', () => {
    const {getByText} = render(<HintUI {...defaultProps} isToggleDisabled={true} />);
    const toggleButton = getByText('Hint').parent;
    expect(toggleButton.props.disabled).toBe(true);
  }, 10000);

  it('disables hint buttons when areHintButtonsDisabled is true', () => {
      render(<HintUI {...defaultProps} showHintOptions={true} areHintButtonsDisabled={true} />);
      const decadeButtonParent = screen.getAllByText('Decade')[0].parent;
      const directorButtonParent = screen.getAllByText('Director')[0].parent;
      const actorButtonParent = screen.getAllByText('Actor')[0].parent;
      const genreButtonParent = screen.getAllByText('Genre')[0].parent;
  
      expect(decadeButtonParent?.props.disabled).toBe(true);
      expect(directorButtonParent?.props.disabled).toBe(true);
      expect(actorButtonParent?.props.disabled).toBe(true);
      expect(genreButtonParent?.props.disabled).toBe(true);
    }, 10000);

  it('calls handleToggleHintOptions when toggle button is pressed', async () => {
    render(<HintUI {...defaultProps} />);
    fireEvent.press(screen.getByText('Hint'));
    expect(mockHandleToggleHintOptions).toHaveBeenCalled();
  }, 10000);

  it('calls handleHintSelection with correct type when a hint button is pressed', async () => {
      render(<HintUI {...defaultProps} showHintOptions={true} />);
      fireEvent.press(screen.getByText('Decade'));
      expect(mockHandleHintSelection).toHaveBeenCalledWith('decade');

      fireEvent.press(screen.getByText('Director'));
      expect(mockHandleHintSelection).toHaveBeenCalledWith('director');

      fireEvent.press(screen.getByText('Actor'));
      expect(mockHandleHintSelection).toHaveBeenCalledWith('actor');

      fireEvent.press(screen.getByText('Genre'));
      expect(mockHandleHintSelection).toHaveBeenCalledWith('genre');
    }, 10000);

  it('passes correct hintsAvailable to HintButton', async () => {
      render(<HintUI {...defaultProps} showHintOptions={true} hintsAvailable={2} />);
      const decadeButtonParent = screen.getAllByText('Decade')[0].parent;
      const directorButtonParent = screen.getAllByText('Director')[0].parent;
      const actorButtonParent = screen.getAllByText('Actor')[0].parent;
      const genreButtonParent = screen.getAllByText('Genre')[0].parent;
  
      expect(decadeButtonParent?.props.accessibilityLabel).toContain('2 hints available.');
      expect(directorButtonParent?.props.accessibilityLabel).toContain('2 hints available.');
      expect(actorButtonParent?.props.accessibilityLabel).toContain('2 hints available.');
      expect(genreButtonParent?.props.accessibilityLabel).toContain('2 hints available.');

  }, 10000);
    
  });