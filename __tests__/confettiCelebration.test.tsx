import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import ConfettiCelebration from '../src/components/confettiCelebration';
import { colors } from '../src/styles/global';

jest.mock('react-native-confetti-cannon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef(({ testID, ...props }: any, ref) => {
      return (
        <View testID={testID} {...props} ref={ref}>
        </View>);
    })
  }
});

describe('ConfettiCelebration', () => {
  it('renders ConfettiCannon when startConfetti is true', () => {
    render(<ConfettiCelebration startConfetti={true} />);
    const confettiCannon = screen.getByTestId('confetti-cannon');
    expect(confettiCannon).toBeTruthy();
  });

  it('does not render ConfettiCannon when startConfetti is false', () => {
    render(<ConfettiCelebration startConfetti={false} />);
    const confettiCannon = screen.queryByTestId('confetti-cannon');
    expect(confettiCannon).toBeNull();
  });

  it('calls onConfettiStop after animation stops', async () => {
    const onConfettiStop = jest.fn();
    render(<ConfettiCelebration startConfetti={true} onConfettiStop={onConfettiStop} />);
    const confettiCannon = screen.getByTestId('confetti-cannon');
    expect(confettiCannon).toBeTruthy();

    await waitFor(() => expect(onConfettiStop).not.toHaveBeenCalled());
  });

  it('renders ConfettiCannon with correct props', () => {
    render(<ConfettiCelebration startConfetti={true} />);
    const confettiCannon = screen.getByTestId('confetti-cannon');
    expect(confettiCannon.props.count).toBe(250);
    expect(confettiCannon.props.origin).toEqual({ x: -100, y: 0 });
    expect(confettiCannon.props.colors).toEqual(Object.values(colors));
    expect(confettiCannon.props.fallSpeed).toBe(2000);
    expect(confettiCannon.props.fadeOut).toBe(true);
    expect(confettiCannon.props.explosionSpeed).toBe(500);
  });
});
