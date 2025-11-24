import { jest } from '@jest/globals';
import 'react-native-gesture-handler/jestSetup';

// --- GLOBAL MOCKS ---

// Reanimated setup
global.ReanimatedDataMock = {
  now: () => 0,
};

// --- CONSOLE SUPPRESSION ---
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

const logMessagesToSuppress = [
  "Firebase Analytics not supported",
  "[ANALYTICS - Skipped]",
  "You are calling concat on a terminating link",
  "Update to",
  "Warning: An update to",
  "AuthContext: Error during auth state change handling",
  "VideoGameService is not yet implemented",
  "Failed to open external link",
  "Error during sharing process",
  "Share action was canceled by the user"
];

const shouldSuppress = (args) => {
  const msg = args[0];
  return typeof msg === 'string' && logMessagesToSuppress.some(suppressedMsg => msg.includes(suppressedMsg));
};

console.error = (...args) => {
  if (shouldSuppress(args)) return;
  originalConsoleError(...args);
};

console.log = (...args) => {
  if (shouldSuppress(args)) return;
  originalConsoleLog(...args);
};

console.warn = (...args) => {
  if (shouldSuppress(args)) return;
  originalConsoleWarn(...args);
};

// --- MOCK REACT NATIVE ---
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Mock Dimensions
  RN.Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 812, scale: 2, fontScale: 1 });
  RN.Dimensions.addEventListener = jest.fn();
  RN.Dimensions.removeEventListener = jest.fn();

  // Mock PixelRatio
  RN.PixelRatio.get = jest.fn(() => 2);
  RN.PixelRatio.getFontScale = jest.fn(() => 1);
  RN.PixelRatio.getPixelSizeForLayoutSize = jest.fn(size => size * 2);
  RN.PixelRatio.roundToNearestPixel = jest.fn(size => size);

  // Mock Animated
  RN.Animated.timing = (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue);
      callback && callback({ finished: true });
    },
  });

  return RN;
});

// --- EXPO MOCKS ---
jest.mock('expo-font', () => ({
  isLoaded: jest.fn().mockReturnValue(true),
  loadAsync: jest.fn().mockResolvedValue(true),
  useFonts: jest.fn().mockReturnValue([true, null]),
}));

jest.mock('expo-constants', () => ({
  ...jest.requireActual('expo-constants'),
  expoConfig: {
    extra: {
      firebaseApiKey: "mock-key",
      firebaseProjectId: "mock-project",
    },
  },
  deviceYearClass: 2023,
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve(true)),
}));

// Mock Expo Image
jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockImage = React.forwardRef(({ source, ...props }, ref) => {
    // Handle both URI objects and local asset numbers (which equal 1 in Jest)
    const uri = source?.uri ? source.uri : undefined;
    return (
      <View
        ref={ref}
        testID="mock-expo-image"
        source={source}
        data-source={uri}
        {...props}
      />
    );
  });
  MockImage.displayName = "MockImage";
  return { Image: MockImage };
});

// Mock Vector Icons
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockIcon = ({ name, testID, ...props }) => (
    <Text testID={testID || `mock-icon-${name}`} {...props}>
      {name}
    </Text>
  );
  return {
    FontAwesome: MockIcon,
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
    FontAwesome5: MockIcon,
  };
});

// --- ROUTER & STORAGE ---
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  Tabs: Object.assign((props) => props.children, {
    Screen: () => null
  }),
  Slot: ({ children }) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// --- FIREBASE MOCKS ---
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  signInAnonymously: jest.fn(),
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: { credential: jest.fn() },
}));

jest.mock("firebase/firestore", () => {
  class MockTimestamp {
    constructor(seconds, nanoseconds) {
      this.seconds = seconds || 0;
      this.nanoseconds = nanoseconds || 0;
    }
    toDate() { return new Date(this.seconds * 1000); }
    static now() { return new MockTimestamp(Date.now() / 1000, 0); }
    static fromDate(date) { return new MockTimestamp(date.getTime() / 1000, 0); }
  }
  return {
    getFirestore: jest.fn(),
    doc: jest.fn(() => ({ withConverter: jest.fn() })),
    collection: jest.fn(() => ({ withConverter: jest.fn() })),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    getDocs: jest.fn(),
    writeBatch: jest.fn(() => ({ commit: jest.fn(), set: jest.fn() })),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    Timestamp: MockTimestamp,
  };
});

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock("firebase/performance", () => ({
  getPerformance: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
  isSupported: jest.fn().mockResolvedValue(false),
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
}));

// --- GLOBAL ---
global.ReanimatedDataMock = { now: () => 0 };
global.__DEV__ = true;
