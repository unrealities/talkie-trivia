import { jest } from "@jest/globals"
import React from "react"

jest.mock("react-native-reanimated", () => {
  return {
    useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((toValue, _, cb) => {
      if (cb) {
        cb(true)
      }
      return toValue
    }),
    withSpring: jest.fn((toValue, _, cb) => {
      if (cb) {
        cb(true)
      }
      return toValue
    }),
    Easing: {
      linear: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(() => jest.fn()),
    },
    interpolate: jest.fn(),
    Extrapolate: { CLAMP: "clamp" },
    useAnimatedGestureHandler: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
    View: "View",
    Text: "Text",
  }
})

jest.mock("expo-image", () => {
  const MockReact = require("react")
  const MockReactNative = require("react-native")
  const MockImage = MockReact.forwardRef(
    (
      { source, style, placeholder, contentFit, onError, ...props }: any,
      ref: any
    ) => {
      const uri =
        typeof source === "object" && source !== null && "uri" in source
          ? source.uri
          : "mock-image-source"
      return (
        <MockReactNative.View
          ref={ref}
          style={style}
          data-testid="mock-expo-image"
          data-source={uri}
          role="image"
          {...props}
        >
          <MockReactNative.Text>Image</MockReactNative.Text>
        </MockReactNative.View>
      )
    }
  )
  return { Image: MockImage }
})

jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve(true)),
}))

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
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes("process.env.EXPO_OS is not defined")
  ) {
    return
  }
  originalWarn.apply(console, args)
}

global.alert = jest.fn()
