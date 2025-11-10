import { jest } from "@jest/globals";

global.__DEV__ = true;

// This is the officially recommended mock for Reanimated v2+
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => { };
  return Reanimated;
});

jest.mock("expo-image", () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const MockImage = React.forwardRef(
    ({ source, style, ...props }, ref) => {
      const uri = typeof source === 'object' && source !== null && 'uri' in source ? source.uri : 'mock-uri';
      return (
        <View
          ref={ref}
          style={style}
          testID="mock-expo-image"
          data-source={uri}
          source={source}
          accessibilityRole="image"
          {...props}
        >
          <Text>Image</Text>
        </View>
      );
    }
  );
  MockImage.displayName = "MockExpoImage";
  return { Image: MockImage };
});

jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve(true)),
}));

jest.mock(
  "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator",
  () => {
    const { View } = require("react-native");
    const MockActivityIndicator = ({ ...props }) => (
      <View {...props} testID="activity-indicator" />
    );
    MockActivityIndicator.displayName = "MockActivityIndicator";
    return MockActivityIndicator;
  }
);

// This is the corrected, self-contained mock for 'react-native'
jest.mock("react-native", () => {
  const mockNativeModules = {
    UIManager: {
      RCTView: () => { },
      Constants: {},
      measure: jest.fn(),
      measureInWindow: jest.fn(),
    },
    RNCNetInfo: {
      getCurrentState: jest.fn(() => Promise.resolve({ isInternetReachable: true, type: 'wifi' })),
      addListener: jest.fn(() => jest.fn()),
      removeListeners: jest.fn(),
    },
  };

  return {
    // Basic Components
    View: "View",
    Text: "Text",
    Pressable: "Pressable",
    Button: "Button",
    Modal: "Modal",
    TextInput: "TextInput",
    FlatList: "FlatList",
    ScrollView: "ScrollView",
    ActivityIndicator: "ActivityIndicator",
    Image: "Image",

    // APIs and Utilities
    StyleSheet: {
      create: (styles) => styles,
      flatten: jest.fn((style) => style),
      compose: jest.fn((style1, style2) => [style1, style2]),
      hairlineWidth: 1,
    },
    Platform: {
      OS: 'test',
      select: (config) => config['test'] ?? config['default'],
      Version: 'testVersion',
    },
    PixelRatio: {
      get: jest.fn(() => 1),
      getFontScale: jest.fn(() => 1),
      getPixelSizeForLayoutSize: jest.fn((layoutSize) => layoutSize),
      roundToNearestPixel: jest.fn((size) => Math.round(size)),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812, scale: 1, fontScale: 1 })),
      addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      removeEventListener: jest.fn(),
    },
    Alert: { alert: jest.fn() },
    LayoutAnimation: {
      configureNext: jest.fn(),
      Presets: { easeInEaseOut: {}, linear: {}, spring: {} },
    },
    Linking: jest.requireMock("expo-linking"),

    // Mocks for ThemeProvider Support
    useColorScheme: jest.fn(() => 'light'),
    Appearance: {
      getColorScheme: jest.fn(() => 'light'),
      addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
      removeChangeListener: jest.fn(),
    },

    // Native Modules
    NativeModules: mockNativeModules,
    UIManager: mockNativeModules.UIManager,
    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    })),
  };
});

const originalWarn = console.warn;
console.warn = (...args) => {
  const warningMessage = args[0];
  const silencedWarnings = [
    "defaultProps", "Victory", "Slice", "VictoryLabel", // Victory Native warnings
    "process.env.EXPO_OS is not defined",
    "No native module found for",
    "`TurboModuleRegistry.getEnforcing(...)`",
    "__fbBatchedBridgeConfig is not set",
    "Calling synchronous methods on native modules",
    "No native ExponentConstants module found",
    "Animated: `useNativeDriver`",
    "RCTView", // Reanimated warnings
    'Key "cancelled" in the image picker',
    "unstable_createElement is acting as a fallback",
  ];
  if (typeof warningMessage === "string" && silencedWarnings.some(w => warningMessage.includes(w))) {
    return;
  }
  originalWarn.apply(console, args);
};

global.alert = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-uuid", () => ({
  v4: () => "mock-uuid-v4",
}));

jest.mock("expo-constants", () => ({
  ...jest.requireActual("expo-constants"),
  expoConfig: {
    extra: {
      firebaseApiKey: "mock-firebase-apikey",
      firebaseProjectId: "mock-project-id",
    },
  },
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useIdTokenAuthRequest: () => [
    {},
    { type: "success", params: { id_token: "mock-id-token" } },
    jest.fn(() =>
      Promise.resolve({
        type: "success",
        params: { id_token: "mock-id-token" },
      })
    ),
  ],
}));

jest.mock("expo-auth-session", () => ({
  makeRedirectUri: jest.fn(() => "mock-redirect-uri"),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  GoogleAuthProvider: { credential: jest.fn() },
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  writeBatch: jest.fn(() => ({ commit: jest.fn() })),
  collection: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock("firebase/performance", () => ({
  getPerformance: jest.fn(),
}));

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");
