import { jest } from "@jest/globals"
global.__DEV__ = true;

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
    ScrollView: "ScrollView",
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

jest.mock("react-native/Libraries/Components/ScrollView/ScrollView", () => {
  const React = require("react")
  const { View } = require("react-native")

  const MockScrollView = React.forwardRef(({ children, ...props }, ref) => (
    <View ref={ref} {...props} testID="mock-scrollview">
      {children}
    </View>
  ))
  return MockScrollView
})

jest.mock(
  "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator",
  () => {
    const { View } = require("react-native")

    const MockActivityIndicator = ({ ...props }) => (
      <View {...props} testID="activity-indicator" />
    )
    return MockActivityIndicator
  }
)

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
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes("No native module found for") &&
    warningMessage.includes("UIManager")
  ) {
    return
  }
  originalWarn.apply(console, args)
}

global.alert = jest.fn()
