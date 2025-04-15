import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Facts from '../src/components/facts';
import { Movie } from '../src/models/movie';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

// Mock the Actors component to avoid testing its internal logic
jest.mock('../src/components/actors', () => ({
  Actors: () => <></>,
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  tagline: 'Test Tagline',
  overview: 'Test Overview',
  poster_path: '/test.jpg',
  director: { id: 1, name: 'Test Director' },
  actors: [{ id: 1, name: 'Test Actor', character: 'Test Character', profile_path: null }],
  genres: [{ id: 1, name: 'Action' }],
  vote_average: 7.5,
  vote_count: 1000,
  release_date: '2023-01-01',
  runtime: 120,
  imdb_id: 'tt1234567',
};

describe('Facts Component', () => {
  it('renders loading state', () => {
    const { getByTestId } = render(<Facts movie={mockMovie} isLoading />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders error state', () => {
    const { getByText } = render(<Facts movie={mockMovie} error={'An error occurred'} />);
    expect(getByText('An error occurred')).toBeTruthy();
  });

  it('renders movie data correctly', () => {
    const { getByText, getByLabelText } = render(<Facts movie={mockMovie} />);
    expect(getByLabelText('IMDb page for Test Movie')).toBeTruthy();
    expect(getByText('Test Tagline')).toBeTruthy();
    expect(getByText('Directed by Test Director')).toBeTruthy();
  });

  it('handles IMDb link press correctly when link exists', async () => {
    const mockOpenURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    const mockCanOpenURL = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const { getByLabelText } = render(<Facts movie={mockMovie} />);

    // Await the press event to ensure it completes before assertions
    await fireEvent.press(getByLabelText('IMDb page for Test Movie'));

    await waitFor(() => {
      expect(mockCanOpenURL).toHaveBeenCalledWith('https://www.imdb.com/title/tt1234567');
      expect(mockOpenURL).toHaveBeenCalledWith('https://www.imdb.com/title/tt1234567');
    });

    mockOpenURL.mockClear();
    mockCanOpenURL.mockClear();
  });

  it('shows alert when IMDb link is unavailable', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    const movieWithoutImdb = { ...mockMovie, imdb_id: null };
    const { getByLabelText } = render(<Facts movie={movieWithoutImdb} />);

    fireEvent.press(getByLabelText('IMDb page for Test Movie'));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('No IMDb Link', 'IMDb link is unavailable for this movie');
    });

    mockAlert.mockRestore();
  });

  it('shows alert when canOpenURL returns false', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const { getByLabelText } = render(<Facts movie={mockMovie} />);

    fireEvent.press(getByLabelText('IMDb page for Test Movie'));

    await waitFor(() => { // waitFor is needed because Alert.alert might take some time to be called
      expect(mockAlert).toHaveBeenCalledWith('Unsupported Link', 'Unable to open IMDb page');
    });

    mockAlert.mockClear();
  });

  it('shows alert on link opening error', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert').mockClear();
    const mockOpenURL = jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('Failed to open link'));
    const mockCanOpenURL = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const { getByLabelText } = render(<Facts movie={mockMovie} />);

    fireEvent.press(getByLabelText('IMDb page for Test Movie'));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Link Error',
        'Could not open the IMDb link. Failed to open link'
      );
    });
    mockAlert.mockClear();
    mockOpenURL.mockClear();
    mockCanOpenURL.mockClear();
  });
});