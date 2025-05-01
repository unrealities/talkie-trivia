import React from 'react';
import { render, act } from '@testing-library/react-native';
import GiveUpConfirmation from '../src/components/giveUpConfirmation';
import { Alert } from 'react-native';

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

describe('GiveUpConfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <GiveUpConfirmation
        isVisible={false}
        onConfirm={() => { }}
        onCancel={() => { }}
      />
    );
  });

  it('shows the alert dialog with correct title and message when visible', () => {
    render(
      <GiveUpConfirmation
        isVisible={true}
        onConfirm={() => { }}
        onCancel={() => { }}
      />
    );

    expect(Alert.alert).toHaveBeenCalledWith(
      'Give Up?',
      'Are you sure you want to give up on this movie?',
      expect.anything(),
      { cancelable: false }
    );
  });

  it('calls onCancel when pressing cancel on the alert dialog', () => {
    const onCancel = jest.fn();
    render(
      <GiveUpConfirmation
        isVisible={true}
        onConfirm={() => { }}
        onCancel={onCancel}
      />
    );

    const alertConfig = (Alert.alert as jest.Mock).mock.calls[0][2];
    const cancelOption = alertConfig.find((option: any) => option.text === 'Cancel');

    act(() => {
      cancelOption.onPress();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when pressing give up on the alert dialog', () => {
    const onConfirm = jest.fn();
    render(
      <GiveUpConfirmation
        isVisible={true}
        onConfirm={onConfirm}
        onCancel={() => { }}
      />
    );

    const alertConfig = (Alert.alert as jest.Mock).mock.calls[0][2];
    const giveUpOption = alertConfig.find((option: any) => option.text === 'Give Up');

    act(() => {
      giveUpOption.onPress();
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
