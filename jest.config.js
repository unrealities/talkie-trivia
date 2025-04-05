module.exports = {
  preset: "jest-expo",
  globals: {
    "process.env": {
      EXPO_OS: "test",
    },
    TEST_ENV: true,
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|victory-native|react-native-reanimated|expo-image|expo-linking|expo-constants|expo-asset|expo-font|expo-modules-core|react-native-vector-icons)/",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["./jestSetup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],

  moduleNameMapper: {
    "^react-native/Libraries/Components/ScrollView/ScrollView$":
      "react-native/jest/mockComponent",
    "^react-native/Libraries/Components/ActivityIndicator/ActivityIndicator$":
      "react-native/jest/mockComponent",
  },
}
