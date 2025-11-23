import { jest } from "@jest/globals";

const mockedDimensions = {
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  Object.defineProperty(rn, 'Dimensions', {
    get: () => mockedDimensions,
  });
  return rn;
});

global.__DEV__ = true;

// --- CONSOLE LOG SUPPRESSION ---
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

const logMessagesToSuppress = [
  "Firebase Analytics not supported in this environment.",
  "[ANALYTICS - Skipped]",
];

const errorMessagesToSuppress = [
  "AuthContext: Error during auth state change handling:", // AuthContext Test
  "Failed to open external link:", // useExternalLink Test
  "VideoGameService.getItemById is not yet implemented", // VideoGameService
];

console.log = (...args) => {
  if (typeof args[0] === 'string' && logMessagesToSuppress.some(msg => args[0].includes(msg))) {
    return;
  }
  originalConsoleLog(...args);
};

console.error = (...args) => {
  if (typeof args[0] === 'string' && errorMessagesToSuppress.some(msg => args[0].includes(msg))) {
    return;
  }
  originalConsoleError(...args);
};

// --- MOCKS ---
jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  useFonts: () => [true, null],
  isLoaded: jest.fn().mockReturnValue(true),
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = ({ name, ...props }) => (
    <Text testID={`mock-icon-${name}`} {...props}>{name}</Text>
  );
  return { FontAwesome: MockIcon, Ionicons: MockIcon };
});

jest.mock("expo-image", () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const MockImage = React.forwardRef(({ source, style, ...props }, ref) => {
    const uri = typeof source === 'object' && source !== null && 'uri' in source ? source.uri : 'mock-uri';
    return (
      <View ref={ref} style={style} testID="mock-expo-image" data-source={uri} source={source} accessibilityRole="image" {...props}>
        <Text>Image</Text>
      </View>
    );
  });
  MockImage.displayName = "MockExpoImage";
  return { Image: MockImage };
});

jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve(true)),
}));

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
  deviceYearClass: 2020,
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useIdTokenAuthRequest: () => [{}, { type: "success", params: { id_token: "mock-id-token" } }, jest.fn()],
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
  signInAnonymously: jest.fn(),
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
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    writeBatch: jest.fn(() => ({ commit: jest.fn(), set: jest.fn() })),
    collection: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    getDocs: jest.fn(),
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
  isSupported: jest.fn(() => Promise.resolve(false)),
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
}));
