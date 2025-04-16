import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import HintUI from '../src/components/hintUI';
describe('HintUI', () => {
  const defaultProps = {
    showHintOptions: false,
    displayedHintText: null,
    hintLabelText: 'Get a Hint',
    isToggleDisabled: false,
    areHintButtonsDisabled: true,
    hintsAvailable: 2,
    handleToggleHintOptions: jest.fn(),
    handleHintSelection: jest.fn(),
  };

  it('Renders correctly with initial props', () => {
    const { getByText, queryByText } = render(<HintUI {...defaultProps} />);

    expect(getByText('Get a Hint')).toBeTruthy();
    expect(queryByText('Decade')).toBeNull();
    expect(queryByText('Director')).toBeNull();
    expect(queryByText('Actor')).toBeNull();
    expect(queryByText('Genre')).toBeNull();
    expect(queryByText('This is a hint!')).toBeNull();
  });

  it('Displays hint options when showHintOptions is true', () => {
    const { getByText } = render(<HintUI {...defaultProps} showHintOptions={true} areHintButtonsDisabled={false} />);

    expect(getByText('Decade')).toBeTruthy();
    expect(getByText('Director')).toBeTruthy();
    expect(getByText('Actor')).toBeTruthy();
    expect(getByText('Genre')).toBeTruthy();
  });

  it('Hides hint options when showHintOptions is false', () => {
    const { queryByText } = render(<HintUI {...defaultProps} />);

    expect(queryByText('Decade')).toBeNull();
    expect(queryByText('Director')).toBeNull();
    expect(queryByText('Actor')).toBeNull();
    expect(queryByText('Genre')).toBeNull();
  });

  it('Displays hint text when displayedHintText is not empty', () => {
    const { getByText } = render(<HintUI {...defaultProps} displayedHintText="This is a hint!" />);

    expect(getByText('This is a hint!')).toBeTruthy();
  });

  it('Hides hint text when displayedHintText is empty', () => {
    const { queryByText } = render(<HintUI {...defaultProps} />);

    expect(queryByText('This is a hint!')).toBeNull();
  });

  it('Disables toggle button when isToggleDisabled is true', () => {
    const handleToggleHintOptions = jest.fn();
    const { getByText } = render(
      <HintUI {...defaultProps} isToggleDisabled={true} handleToggleHintOptions={handleToggleHintOptions} />
    );

    const toggleButton = getByText('Get a Hint');
    fireEvent.press(toggleButton);
    expect(handleToggleHintOptions).not.toHaveBeenCalled();
  });

  it('Enables toggle button when isToggleDisabled is false', () => {
    const handleToggleHintOptions = jest.fn();
    const { getByText } = render(
      <HintUI {...defaultProps} handleToggleHintOptions={handleToggleHintOptions} />
    );

    const toggleButton = getByText('Get a Hint');
    fireEvent.press(toggleButton);
    expect(handleToggleHintOptions).toHaveBeenCalled();
  });

  it('Disables hint buttons when areHintButtonsDisabled is true', () => {
    const { getByText } = render(<HintUI {...defaultProps} showHintOptions={true} areHintButtonsDisabled={true} />);

    expect(getByText('Decade').props.accessibilityState.disabled).toBe(true);
    expect(getByText('Director').props.accessibilityState.disabled).toBe(true);
    expect(getByText('Actor').props.accessibilityState.disabled).toBe(true);
    expect(getByText('Genre').props.accessibilityState.disabled).toBe(true);
  });

  it('Enables hint buttons when areHintButtonsDisabled is false', () => {
    const { getByText } = render(<HintUI {...defaultProps} showHintOptions={true} areHintButtonsDisabled={false} />);

    expect(getByText('Decade').props.accessibilityState.disabled).toBe(false);
    expect(getByText('Director').props.accessibilityState.disabled).toBe(false);
    expect(getByText('Actor').props.accessibilityState.disabled).toBe(false);
    expect(getByText('Genre').props.accessibilityState.disabled).toBe(false);
  });

  it('Calls handleToggleHintOptions when toggle button is pressed', () => {
    const handleToggleHintOptions = jest.fn();
    const { getByText } = render(
      <HintUI {...defaultProps} handleToggleHintOptions={handleToggleHintOptions} />
    );

    const toggleButton = getByText('Get a Hint');
    fireEvent.press(toggleButton);
    expect(handleToggleHintOptions).toHaveBeenCalled();
  });

  it('Calls handleHintSelection with correct hint type when a hint button is pressed', () => {
    const handleHintSelection = jest.fn();
    const { getByText } = render(
      <HintUI {...defaultProps} showHintOptions={true} areHintButtonsDisabled={false} handleHintSelection={handleHintSelection} />
    );

    fireEvent.press(getByText('Decade'));
    expect(handleHintSelection).toHaveBeenCalledWith('decade');

    fireEvent.press(getByText('Director'));
    expect(handleHintSelection).toHaveBeenCalledWith('director');

    fireEvent.press(getByText('Actor'));
    expect(handleHintSelection).toHaveBeenCalledWith('actor');

    fireEvent.press(getByText('Genre'));
    expect(handleHintSelection).toHaveBeenCalledWith('genre');
  });
});