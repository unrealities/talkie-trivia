import { jest } from "@jest/globals"
import React from "react"

jest.mock("react-native-reanimated", () => {
  return {
    useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((toValue, _, cb) => { if (cb) { cb(true); } return toValue; }),
    withSpring: jest.fn((toValue, _, cb) => { if (cb) { cb(true); } return toValue; }),
    Easing: {
      linear: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(() => jest.fn()),
    },
    interpolate: jest.fn(),
    Extrapolate: { CLAMP: 'clamp' },
    useAnimatedGestureHandler: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
    View: 'View',
    Text: 'Text',
    ScrollView: 'ScrollView',
  }
});

const originalWarn = console.warn
console.warn = (...args) => {
  const warningMessage = args[0]
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes("defaultProps") &&
    (warningMessage.includes("VictoryPie") ||
      warningMessage.includes("Slice") ||
      warningMessage.includes("VictoryLabel"))
  ) {
    return
  }
  originalWarn.apply(console, args)
}

jest.mock(
  "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator",
  () => {
    const MockActivityIndicator = (props: any) => (
      <div data-testid="activity-indicator">ActivityIndicator</div>
    );
    return MockActivityIndicator;
  }
);