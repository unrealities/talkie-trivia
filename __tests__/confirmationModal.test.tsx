import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConfirmationModal from '../src/components/confirmationModal';
import { waitFor } from '@testing-library/react-native';

describe('ConfirmationModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  const props = {
    isVisible: true,
    title: 'Test Title',
    message: 'Test Message',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  };

  it('renders correctly with given props', () => {
    const { getByText } = render(<ConfirmationModal {...props} />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
    expect(getByText('Confirm')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onConfirm when confirm button is pressed', () => {
    const { getByText } = render(<ConfirmationModal {...props} />);

    fireEvent.press(getByText('Confirm'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).toHaveBeenCalledTimes(0);

  });

  it('calls onCancel when cancel button is pressed', async () => {
    const { getByText } = render(<ConfirmationModal {...props} />);
    fireEvent.press(getByText('Cancel'));
    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  });

  it('does not render when isVisible is false', async () => {
    const { queryByTestId } = render(<ConfirmationModal {...props} isVisible={false} />);
    expect(queryByTestId('confirmation-modal-container')).toBeNull();
  });
});