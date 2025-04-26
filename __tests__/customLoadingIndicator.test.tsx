import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CustomLoadingIndicator from '../src/components/customLoadingIndicator';

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
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
  return {
      Svg: jest.fn(({ children, ...props }) => <svg {...props}>{children}</svg>),
    Circle: jest.fn(({ children, ...props }) => <circle testID="circle" {...props}>{children}</circle>),  
  default: jest.fn(({ children, ...props }) => <svg {...props}>{children}</svg>),

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
    render(<CustomLoadingIndicator />);
    const circles = screen.getAllByTestId('circle');
    expect(circles.length).toBe(2);
  });
});

