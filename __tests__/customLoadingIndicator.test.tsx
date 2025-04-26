import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import CustomLoadingIndicator from '../src/components/customLoadingIndicator';

jest.mock('react-native-reanimated', () => {
  return {
    View: jest.fn(({ children, ...props }) => <View {...props}>{children}</View>),
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withRepeat: jest.fn((value) => value),
    withTiming: jest.fn((value) => value),
      Easing: { linear: jest.fn() },
    default: {
      View: jest.fn(({ children, ...props }) => <View {...props}>{children}</View>),
      },
  };
});

jest.mock('react-native-svg', () => {
  const ActualSvg = jest.requireActual('react-native-svg');
  return {
      ...ActualSvg,
    Svg: jest.fn(({ children, ...props }) => <svg {...props}>{children}</svg>),
    Circle: jest.fn(({ children, ...props }) => <circle {...props}>{children}</circle>),
  };
});

jest.mock('../src/styles/global', () => ({
  colors: {
    primary: 'blue', tertiary: 'red', background: 'white',
  },
  responsive: {
    scale: jest.fn((size) => size)
  },
}));

describe('CustomLoadingIndicator', () => {
  it('renders without crashing', () => {
    render(<CustomLoadingIndicator />);
  });

  it('renders a component with testID "activity-indicator"', () => {
    render(<CustomLoadingIndicator />);
    const indicator = screen.getByTestId('activity-indicator');
    expect(indicator).toBeTruthy();
  });

  it('renders 2 Circle elements', () => {
    const { getAllByRole } = render(<CustomLoadingIndicator />);
    const circles = getAllByRole('Circle');
    expect(circles.length).toBe(2);
  });
});

