import { jest } from "@jest/globals";
import React from "react";

// --- Mocks ---

// Mock react-native-reanimated manually and minimally
jest.mock("react-native-reanimated", () => {
  // No external variables used here, this is fine
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
  };
});

// Mock expo-image
jest.mock('expo-image', () => {
  // REQUIRE React INSIDE the factory function
  const MockReact = require('react');
  const MockReactNative = require('react-native'); // Need View

  const MockImage = MockReact.forwardRef(({ source, style, placeholder, contentFit, onError, ...props }: any, ref: any) => { // Added 'any' types for simplicity in mock
    const uri = typeof source === 'object' && source !== null && 'uri' in source ? source.uri : 'mock-image-source';

    // Use MockReactNative.View for better compatibility if testEnvironment were node
    // For jsdom, a div might still work, but using RN View is safer practice for RN mocks.
    return (
      <MockReactNative.View
        ref={ref}
        style={style}
        data-testid="mock-expo-image"
        data-source={uri}
        role="image"
        {...props}
      >
        <MockReactNative.Text>Image</MockReactNative.Text> {/* Use Mock Text */}
      </MockReactNative.View>
    );
  });
  return { Image: MockImage };
});

// Mock ActivityIndicator
jest.mock(
  "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator",
  () => {
    // REQUIRE React Native INSIDE
    const MockReactNative = require('react-native');
    const MockActivityIndicator = (props: any) => (
      // Using View/Text might be slightly better than div for RN testing consistency
      <MockReactNative.View data-testid="activity-indicator" {...props}>
        <MockReactNative.Text>ActivityIndicator</MockReactNative.Text>
      </MockReactNative.View>
    );
    return MockActivityIndicator;
  }
);

// Mock expo-linking
jest.mock('expo-linking', () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve(true)),
}));


// --- Console Warning Filtering ---
const originalWarn = console.warn;
console.warn = (...args) => {
  const warningMessage = args[0];
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes("defaultProps") &&
    (warningMessage.includes("VictoryPie") ||
      warningMessage.includes("Slice") ||
      warningMessage.includes("VictoryLabel"))
  ) {
    return;
  }
  // Suppress the EXPO_OS warning if it persists after config changes
  if (typeof warningMessage === 'string' && warningMessage.includes('process.env.EXPO_OS is not defined')) {
    return;
  }

  originalWarn.apply(console, args);
};

// --- Global Mocks ---
global.alert = jest.fn(); // Mock Alert.alert