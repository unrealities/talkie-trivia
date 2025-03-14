import { jest } from "@jest/globals"
import React from "react" // Import React

jest.mock("react-native/Libraries/vendor/emitter/EventEmitter", () => {
  const { EventEmitter } = require("events")
  return EventEmitter
})

jest.mock(
  "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator",
  () => {
    const MockActivityIndicator = (props: any) => (
      <div data-testid="activity-indicator">ActivityIndicator</div>
    )
    return MockActivityIndicator
  }
)

jest.mock("react-native/Libraries/Components/ScrollView/ScrollView", () => {
  const MockScrollView = (props: any) => (
    <div data-testid="scroll-view">{props.children}</div>
  )
  return MockScrollView
})

jest.mock("react-native-reanimated", () => {
  return {
    // Mock the specific Animated API you are using
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    call: jest.fn(),
    Clock: jest.fn(),
    block: jest.fn(),
    startClock: jest.fn(),
    stopClock: jest.fn(),
    clockRunning: jest.fn(),
    interpolate: jest.fn(),
    Extrapolate: {
      CLAMP: "clamp",
    },
    useSharedValue: (initialValue: any) => ({
      value: initialValue,
    }),
    useAnimatedStyle: (func: any) => {
      return {} // Return an empty style
    },
    withTiming: jest.fn(),
    withSpring: jest.fn(),
    Easing: {
      linear: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
    useAnimatedGestureHandler: jest.fn(),
    runOnJS: jest.fn(),
  }
})

// Optional: Filter out specific console.warn messages (if needed)
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
    return // Suppress the warning
  }
  originalWarn.apply(console, args)
}
