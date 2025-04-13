import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Actors from '../src/components/actors';
import { Actor } from '../src/models/movie';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

// Mock the Linking module
jest.mock('expo-linking', () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}));

// Mock the Alert module
jest.spyOn(Alert, 'alert');

const mockActors: Actor[] = [
  { id: 1, name: 'Tom Hanks', profile_path: '/tom_hanks.jpg', imdb_id: 'nm0000158' },
  { id: 2, name: 'Brad Pitt', profile_path: '/brad_pitt.jpg', imdb_id: 'nm0000093' },
  { id: 3, name: 'Leonardo DiCaprio', profile_path: '/leonardo_dicaprio.jpg', imdb_id: 'nm0000138' },
];

describe('Actors Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without actors', () => {
    const { queryByTestId } = render(<Actors actors={[]} />);
    expect(queryByTestId('actor-pressable-1')).toBeNull();
  });

  it('renders with actors', () => {
    const { getByTestId } = render(<Actors actors={mockActors} />);
    expect(getByTestId('actor-pressable-1')).toBeTruthy();
    expect(getByTestId('actor-pressable-2')).toBeTruthy();
    expect(getByTestId('actor-pressable-3')).toBeTruthy();
  });

  it('displays the correct number of actors based on maxDisplay', () => {
    const { getAllByTestId } = render(<Actors actors={mockActors} maxDisplay={2} />);
    expect(getAllByTestId(/actor-pressable-/).length).toBe(2);
  });

  it('handles actor names with single and multiple parts', () => {
    const actors: Actor[] = [
      { id: 1, name: 'Cher', profile_path: '/cher.jpg', imdb_id: 'nm0000333' },
      { id: 2, name: 'Robert Downey Jr.', profile_path: '/robert_downey_jr.jpg', imdb_id: 'nm0000375' },
    ];
    const { getByTestId, getByText } = render(<Actors actors={actors} />);
    expect(getByText('Cher')).toBeTruthy()
    expect(getByText('Robert Downey Jr.')).toBeTruthy()
  });

  it('opens IMDb link when actor is pressed and link is available', async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
    const { getByTestId } = render(<Actors actors={mockActors} />);
    fireEvent.press(getByTestId('actor-pressable-1'));
    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledWith('https://www.imdb.com/name/nm0000158'));
  });

  it('shows an alert when IMDb link is unavailable', async () => {
    const actors: Actor[] = [{ id: 1, name: 'Unknown Actor', profile_path: null, imdb_id: null }];
    const { getByTestId } = render(<Actors actors={actors} />);
    fireEvent.press(getByTestId('actor-pressable-1'));
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('IMDb link unavailable', 'No link found for this actor.'));
  });

  it('shows an alert when IMDb link cannot be opened', async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);
    const { getByTestId } = render(<Actors actors={mockActors} />);
    fireEvent.press(getByTestId('actor-pressable-1'));
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Unable to open IMDb link'));
  });

  it('triggers onActorPress callback when provided', async () => {
    const onActorPress = jest.fn(actor => actor);
    const { getByTestId } = render(<Actors actors={mockActors} onActorPress={onActorPress} maxDisplay={1} />);
    const pressable = getByTestId('actor-pressable-1');
    fireEvent.press(pressable);
    await waitFor(() => expect(onActorPress).toHaveBeenCalledWith(mockActors[0]), { timeout: 1000 });
  });

  it('has correct accessibility labels and roles', () => {
    const { getByTestId } = render(<Actors actors={mockActors} />);
    expect(getByTestId('actor-pressable-1').props.accessibilityLabel).toBe('Actor: Tom Hanks. View details');
    expect(getByTestId('actor-pressable-1').props.role).toBe('button');
  });
});