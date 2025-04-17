import { jest } from "@jest/globals"

global.__DEV__ = true

jest.mock("react-native-reanimated", () => ({
  useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
  useAnimatedStyle: jest.fn((callback) => callback()),
  withTiming: jest.fn((toValue, options, cb) => {
    if (typeof cb === "function") {
      cb(true)
    } else if (options && typeof options === "function") {
      options(true)
    }
    return toValue
  }),
  Easing: {
    linear: jest.fn((v) => v),
    inOut: jest.fn(() => jest.fn((v) => v)),
    ease: jest.fn((v) => v),
  },
  runOnJS: jest.fn(
    (fn) =>
      (...args) =>
        fn(...args)
  ),
  interpolate: jest.fn(),
  Extrapolate: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  createAnimatedComponent: jest.fn((component) => component),
}))

jest.mock("expo-image", () => {
  const MockReact = require("react")
  const MockReactNative = require("react-native")
  const MockImage = MockReact.forwardRef(
    ({ source, style, placeholder, contentFit, onError, ...props }, ref) => {
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
          accessibilityRole="image"
          {...props}
        >
          <MockReactNative.Text>Image</MockReactNative.Text>
        </MockReactNative.View>
      )
    }
  )
  MockImage.displayName = "MockExpoImage"
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
  MockScrollView.displayName = "MockScrollView"
  return MockScrollView
})

jest.mock(
  "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator",
  () => {
    const { View } = require("react-native")
    const MockActivityIndicator = ({ ...props }) => (
      <View {...props} testID="activity-indicator" />
    )
    MockActivityIndicator.displayName = "MockActivityIndicator"
    return MockActivityIndicator
  }
)

jest.mock("react-native", () => {
  const mockNativeModules = {
    UIManager: {
      RCTView: () => { },
      Constants: {},
      measure: jest.fn(),
      measureInWindow: jest.fn(),
    },
    ReanimatedModule: {
      installTurboModule: jest.fn(),
      makeMutable: jest.fn(),
      makeRemote: jest.fn(),
      startMapper: jest.fn(),
      stopMapper: jest.fn(),
      registerEventHandler: jest.fn(),
      unregisterEventHandler: jest.fn(),
      getViewProp: jest.fn(),
    },

    DeviceInfo: {
      getConstants: () => ({
        Dimensions: {
          window: { width: 375, height: 812, scale: 1, fontScale: 1 },
          screen: { width: 375, height: 812, scale: 1, fontScale: 1 },
        },
      }),
    },

    RNCNetInfo: {
      getCurrentState: jest.fn(() =>
        Promise.resolve({ isInternetReachable: true, type: "wifi" })
      ),
      addListener: jest.fn(() => jest.fn()),
      removeListeners: jest.fn(),
    },
  }

  return {
    View: "View",
    Text: "Text",
    Pressable: "Pressable",
    Button: "Button",
    Modal: "Modal",
    TextInput: "TextInput",
    FlatList: "FlatList",
    ScrollView: "ScrollView",
    ActivityIndicator: "ActivityIndicator",

    StyleSheet: {
      create: (styles) => styles,
      flatten: jest.fn((style) => style),
      compose: jest.fn((style1, style2) => [style1, style2]),
      hairlineWidth: 1,
    },
    Platform: {
      OS: "test",
      select: (config) => config["test"] ?? config["default"],
      Version: "testVersion",
    },
    PixelRatio: {
      get: jest.fn(() => 1),
      getFontScale: jest.fn(() => 1),
      getPixelSizeForLayoutSize: jest.fn((layoutSize) => layoutSize),
      roundToNearestPixel: jest.fn((size) => Math.round(size)),
    },
    Dimensions: {
      get: jest.fn((key) => {
        if (key === "window" || key === "screen") {
          return { width: 375, height: 812, scale: 1, fontScale: 1 }
        }
        return undefined
      }),
      addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      removeEventListener: jest.fn(),
    },
    Alert: { alert: jest.fn() },
    LayoutAnimation: {
      configureNext: jest.fn(),
      Presets: { easeInEaseOut: {}, linear: {}, spring: {} },
    },

    Linking: jest.requireMock("expo-linking"),

    NativeModules: mockNativeModules,

    UIManager: mockNativeModules.UIManager,

    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    })),
  }
})

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
    (warningMessage.includes("No native module found for") ||
      warningMessage.includes("`TurboModuleRegistry.getEnforcing(...)`") ||
      warningMessage.includes("__fbBatchedBridgeConfig is not set") ||
      warningMessage.includes(
        "Calling synchronous methods on native modules"
      )) &&
    warningMessage.includes("UIManager")
  ) {
    return
  }
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes("No native ExponentConstants module found")
  ) {
    return
  }
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes("Animated: `useNativeDriver`")
  ) {
    return
  }
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes("RCTView") &&
    warningMessage.includes("does not exist") &&
    warningMessage.includes("react-native-reanimated")
  ) {
    return
  }
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes('Key "cancelled" in the image picker')
  ) {
    return
  }
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes(
      "Warning: unstable_createElement is acting as a fallback"
    ) &&
    warningMessage.includes("W3CSelectability")
  ) {
    return
  }

  originalWarn.apply(console, args)
}

global.alert = jest.fn()

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
)

jest.mock("react-native-uuid", () => ({
  v4: () => "mock-uuid-v4",
}))

jest.mock("expo-constants", () => ({
  executionEnvironment: "storeClient",
  isDevice: false,
  deviceName: "JestTestDevice",
  systemFonts: [],
  statusBarHeight: 20,
  deviceYearClass: 2021,
  manifest: {},
  manifest2: {},
  expoConfig: {
    extra: {
      firebaseApiKey: "mock-firebase-apikey",
      firebaseProjectId: "mock-project-id",
      firebaseMessagingSenderId: "mock-sender-id",
      firebaseAppId: "mock-app-id",
      firebaseMeasurementId: "mock-measurement-id",
      androidClientId: "mock-android-client-id",
      expoClientId: "mock-expo-client-id",
      iosClientId: "mock-ios-client-id",
      webClientId: "mock-web-client-id",
      themoviedbKey: "mock-tmdb-key",
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
}))
jest.mock("expo-auth-session", () => {
  return {
    makeRedirectUri: jest.fn(() => "mock-redirect-uri"),
    AuthRequest: jest.fn(),
    fetchDiscoveryAsync: jest.fn(),
    exchangeCodeAsync: jest.fn(),
  }
})

jest.mock("firebase/auth", () => {
  const mockUser = {
    uid: "mock-test-user-id",
    displayName: "Mock User",
    email: "mock@example.com",
    getIdToken: jest.fn(() => Promise.resolve("mock-id-token")),
  }
  const mockAuthInstance = {
    currentUser: null,
    onAuthStateChangedListeners: [],
    onIdTokenChangedListeners: [],
    __setUser: function (user) {
      this.currentUser = user
      this.onAuthStateChangedListeners.forEach((listener) => listener(user))
      this.onIdTokenChangedListeners.forEach((listener) => listener(user))
    },
    onAuthStateChanged: function (listener) {
      this.onAuthStateChangedListeners.push(listener)
      listener(this.currentUser)
      return () => {
        this.onAuthStateChangedListeners =
          this.onAuthStateChangedListeners.filter((l) => l !== listener)
      }
    },
    onIdTokenChanged: function (listener) {
      this.onIdTokenChangedListeners.push(listener)
      listener(this.currentUser)
      return () => {
        this.onIdTokenChangedListeners = this.onIdTokenChangedListeners.filter(
          (l) => l !== listener
        )
      }
    },
    signOut: jest.fn(() => {
      mockAuthInstance.__setUser(null)
      return Promise.resolve()
    }),
    signInWithCredential: jest.fn(() => {
      const result = { user: mockUser }
      mockAuthInstance.__setUser(mockUser)
      return Promise.resolve(result)
    }),
  }
  return {
    getAuth: jest.fn(() => mockAuthInstance),
    onAuthStateChanged: jest.fn((auth, listener) =>
      auth.onAuthStateChanged(listener)
    ),
    GoogleAuthProvider: {
      credential: jest.fn(() => ({
        providerId: "google.com",
        signInMethod: "google.com",
      })),
      PROVIDER_ID: "google.com",
    },
    signInWithCredential: jest.fn((auth, cred) =>
      auth.signInWithCredential(cred)
    ),
    signOut: jest.fn((auth) => auth.signOut()),
  }
})

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn((db, collection, id) => ({
    id: id || `mock-doc-id-${collection}`,
    path: `${collection}/${id || "mock-doc-id"}`,
    withConverter: jest.fn(function () {
      return this
    }),
    parent: { id: collection },
  })),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: jest.fn(() => false),
      data: jest.fn(() => undefined),
      id: "mock-getDoc-id",
    })
  ),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  collection: jest.fn((db, path) => ({ id: path, path: path })),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ empty: true, docs: [], size: 0 })),
  onSnapshot: jest.fn(() => jest.fn()),
  serverTimestamp: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
    fromDate: jest.fn((date) => ({
      seconds: date.getTime() / 1000,
      nanoseconds: 0,
    })),
  },
  CACHE_SIZE_UNLIMITED: -1,
  persistentLocalCache: jest.fn(() => ({})),
  persistentMultipleTabManager: jest.fn(() => ({})),
  initializeFirestore: jest.fn((app, config) => ({})),
}))

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({ name: "mockApp", options: {} })),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({ name: "[DEFAULT]", options: {} })),
}))

jest.mock("firebase/performance", () => ({
  getPerformance: jest.fn(() => ({})),
}))

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome")
