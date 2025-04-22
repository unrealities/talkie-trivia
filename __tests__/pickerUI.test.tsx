import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { default as PickerUI } from '../src/components/pickerUI';
import { BasicMovie } from '../src/models/movie';

const mockMovies: readonly BasicMovie[] = [
  { id: 1, title: 'Movie 1' },
  { id: 2, title: 'Movie 2' },
];

const renderPickerUI = (props: Partial<React.ComponentProps<typeof PickerUI>> = {}) => {
  const defaultProps: React.ComponentProps<typeof PickerUI> = {
    searchText: '',
    isSearching: false,
    isLoading: false,
    error: null,
    foundMovies: [],
    selectedMovieTitle: 'Select a Movie',
    isInteractionsDisabled: false,
    DEFAULT_BUTTON_TEXT: 'Select a Movie',
    animatedButtonStyle: {},
    handleInputChange: jest.fn(),
    renderItem: jest.fn(() => null),
    onPressCheck: jest.fn(),
    handleFocus: jest.fn(),
    handleBlur: jest.fn(),
  };
  return render(<PickerUI {...defaultProps} {...props} />);
};

describe('PickerUI', () => {
  it('renders correctly with default props', () => {
    const { getByPlaceholderText, getByText } = renderPickerUI();
    expect(getByPlaceholderText('Search for a movie title')).toBeTruthy();
    expect(getByText('Select a Movie')).toBeTruthy();
  });

  it('displays search text', () => {
    const { getByDisplayValue } = renderPickerUI({ searchText: 'Movie Title' });
    expect(getByDisplayValue('Movie Title')).toBeTruthy();
  });

  it('calls handleInputChange when input changes', () => {
    const handleInputChange = jest.fn();
    const { getByPlaceholderText } = renderPickerUI({ handleInputChange });
    const input = getByPlaceholderText('Search for a movie title');
    fireEvent.changeText(input, 'New Text');
    expect(handleInputChange).toHaveBeenCalledWith('New Text');
  });

  it('shows activity indicator when searching', () => {
    const { getByTestId } = renderPickerUI({ isSearching: true });
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('shows loading indicator when loading', () => {
    const { getByTestId } = renderPickerUI({ isLoading: true });
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('displays error message when there is an error', () => {
    const { getByText } = renderPickerUI({ error: 'An error occurred' });
    expect(getByText('An error occurred')).toBeTruthy();
  });

  it('renders found movies in a FlatList', () => {
    const renderItem = jest.fn(({ item }) => <Text>{item.title}</Text>);
    const { getByText } = renderPickerUI({ foundMovies: mockMovies, renderItem });
    expect(getByText('Movie 1')).toBeTruthy();
    expect(getByText('Movie 2')).toBeTruthy();
    expect(renderItem).toHaveBeenCalledTimes(2);
  });

  it('displays "No movies found" when there are no results and search text is not empty', () => {
    const { getByText } = renderPickerUI({ searchText: 'abc', foundMovies: [] });
    expect(getByText('No movies found')).toBeTruthy();
  });

  it('does not display "No movies found" when search text is empty', () => {
    const { queryByText } = renderPickerUI({ searchText: '', foundMovies: [] });
    expect(queryByText('No movies found')).toBeNull();
  });


  it('disables button when interactions are disabled', () => {
    const { getByLabelText } = renderPickerUI({
      isInteractionsDisabled: true,
      selectedMovieTitle: 'Movie 1',
    });
    const button = getByLabelText('Submit button disabled');
    expect(button.props.disabled).toBe(true);
  });

  it('disables button when selectedMovieTitle is DEFAULT_BUTTON_TEXT', () => {
    const { getByLabelText } = renderPickerUI({
      selectedMovieTitle: 'Select a Movie',
    });
    const button = getByLabelText('Submit button disabled');
    expect(button.props.disabled).toBe(true);
  });

  it('enables button when interactions are enabled and a movie is selected', () => {
    const { getByLabelText } = renderPickerUI({
      selectedMovieTitle: 'Movie 1',
    });
    const button = getByLabelText('Submit button enabled');
    expect(button.props.disabled).toBe(false);
  });

  it('calls onPressCheck when button is pressed', () => {
    const onPressCheck = jest.fn();
    const { getByLabelText } = renderPickerUI({
      onPressCheck,
      selectedMovieTitle: 'Movie 1',
    });
    const button = getByLabelText('Submit button enabled');
    fireEvent.press(button);
    expect(onPressCheck).toHaveBeenCalled();
  });

  it('calls handleFocus when input is focused', () => {
    const handleFocus = jest.fn();
    const { getByPlaceholderText } = renderPickerUI({ handleFocus });
    const input = getByPlaceholderText('Search for a movie title');
    fireEvent(input, 'focus');
    expect(handleFocus).toHaveBeenCalled();
  });

  it('calls handleBlur when input is blurred', () => {
    const handleBlur = jest.fn();
    const { getByPlaceholderText } = renderPickerUI({ handleBlur });
    const input = getByPlaceholderText('Search for a movie title');
    fireEvent(input, 'blur');
    expect(handleBlur).toHaveBeenCalled();
  });
});