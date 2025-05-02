import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GoogleLogin from '../src/components/googleLogin';
jest.mock('../src/utils/hooks/useGoogleAuth');
import { useGoogleAuth } from '../src/utils/hooks/useGoogleAuth';

describe('GoogleLogin', () => {
  const mockHandleSignIn = jest.fn();
  const mockHandleSignOut = jest.fn();
  const mockOnAuthStateChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGoogleAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      authError: null,
      handleSignIn: mockHandleSignIn,
      handleSignOut: mockHandleSignOut,
      currentUser: null,
    });
  });

  it('renders "Sign In with Google" button when not signed in', () => {
    const { getByText } = render(<GoogleLogin player={null} onAuthStateChange={mockOnAuthStateChange} />);
    expect(getByText('Sign In with Google')).toBeTruthy();
  });

  it('calls handleSignIn when "Sign In with Google" button is pressed', () => {
    const { getByText } = render(<GoogleLogin player={null} onAuthStateChange={mockOnAuthStateChange}/>);
    fireEvent.press(getByText('Sign In with Google'));
    expect(mockHandleSignIn).toHaveBeenCalled();
  });

  it('renders "Sign Out {displayName}" button when signed in', () => {
    const displayName = 'Test User';
    (useGoogleAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      authError: null,
      handleSignIn: mockHandleSignIn,
      handleSignOut: mockHandleSignOut,
      currentUser: { displayName },
    });
    const { getByText } = render(<GoogleLogin player={null} onAuthStateChange={mockOnAuthStateChange}/>);
    expect(getByText(`Sign Out ${displayName}`)).toBeTruthy();
  });

    it('renders "Sign Out {playerName}" button when signed in and currentUser.displayName is null', () => {
        const playerName = 'Player Name';
        const player: { id: string; name: string; email: string } = { id: 'player123', name: playerName, email: 'foo@bar.com' };
        (useGoogleAuth as jest.Mock).mockReturnValue({
            currentUser: { displayName: null},
        });
        (useGoogleAuth as jest.Mock).mockReturnValue({
            isLoading: false,            
            authError: null,
            handleSignIn: mockHandleSignIn,
            handleSignOut: mockHandleSignOut,
            currentUser: { displayName: null},
        });
        const { getByText } = render(<GoogleLogin player={player} onAuthStateChange={mockOnAuthStateChange}/>);
        expect(getByText(`Sign Out ${playerName}`)).toBeTruthy();
    });

  it('calls handleSignOut when "Sign Out" button is pressed', () => {
      const displayName = 'Test User';
      (useGoogleAuth as jest.Mock).mockReturnValue({
          isLoading: false,
          authError: null,
          handleSignIn: mockHandleSignIn,
          handleSignOut: mockHandleSignOut,
          currentUser: { displayName },
      });
      const { getByText } = render(<GoogleLogin player={null} onAuthStateChange={mockOnAuthStateChange}/>);
      fireEvent.press(getByText(`Sign Out ${displayName}`));
    (useGoogleAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      authError: null,
      handleSignIn: mockHandleSignIn,
      handleSignOut: mockHandleSignOut,
      currentUser: { displayName },
    });
    expect(mockHandleSignOut).toHaveBeenCalled();
  });

  it('shows ActivityIndicator and is disabled when isLoading is true', async () => {
    (useGoogleAuth as jest.Mock).mockReturnValue({
      isLoading: true,
      authError: null,
      handleSignOut: mockHandleSignOut,
      currentUser: null,
    });
    const { getByTestId } = render(<GoogleLogin player={null} onAuthStateChange={mockOnAuthStateChange}/>);

    const activityIndicator = getByTestId('activityIndicator');
        expect(activityIndicator).toBeTruthy();
        expect(getByTestId('googleButton').props.disabled).toBe(true);
  });

  it('calls onAuthStateChange when the auth state changes', async () => {
      const mockOnAuthStateChange = jest.fn();
      const handleSignInMock = jest.fn(() => mockOnAuthStateChange({ id: '1', name: 'foo', email: 'foo@bar.com' }));
      (useGoogleAuth as jest.Mock).mockReturnValue({
          isLoading: false,
          authError: null,
          handleSignIn: handleSignInMock,
          handleSignOut: mockHandleSignOut,
          currentUser: null,
      });
      const { getByText } = render(<GoogleLogin player={null} onAuthStateChange={mockOnAuthStateChange} />);

      fireEvent.press(getByText('Sign In with Google'))
      expect(mockOnAuthStateChange).toHaveBeenCalled();
      
    });
  });
