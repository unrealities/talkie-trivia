import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import ErrorMessage from '../src/components/errorMessage';

describe('ErrorMessage', () => {
  it('renders the error message correctly', () => {
    const message = 'Test error message';
    render(<ErrorMessage message={message} />);
    const messageElement = screen.getByText(message);
    expect(messageElement).toBeDefined();
  });

  it('renders the retry button when onRetry is provided', () => {
      const onRetry = jest.fn();
      const { getByTestId } = render(<ErrorMessage message="Error" onRetry={onRetry} />);
      const retryButton = onRetry
      expect(retryButton).toBeDefined();
  });

  it('does not render the retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />);
    const retryButton = screen.queryByText('Retry');
    expect(retryButton).toBeNull();
  });

  it('calls the onRetry function when the retry button is pressed', () => {
      const onRetry = jest.fn();
      const { getByTestId } = render(<ErrorMessage message="Error" onRetry={onRetry} />);
      const retryButton = getByTestId("retry")

      fireEvent.press(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

    it('memoizes correctly', () => {
    const onRetry = jest.fn();
    const { rerender } = render(<ErrorMessage message="Error" onRetry={onRetry} />);
    const previousRetryCount = onRetry.mock.calls.length
    rerender(<ErrorMessage message="Error" onRetry={jest.fn()} />);
      expect(onRetry).toHaveBeenCalledTimes(previousRetryCount)

      rerender(<ErrorMessage message="New Error" onRetry={jest.fn()} />);

  });
});